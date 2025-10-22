// UTF-8, no BOM
// XRD深度分析工具：Scherrer公式、晶格精修、消光判断、峰强分析
// 数据来源：International Tables for Crystallography
// P. Scherrer, Nachr. Ges. Wiss. Göttingen 26, 98-100 (1918)

// 元数据
const METADATA = {
  version: '1.0.0',
  lastUpdated: '2025-10-18',
  sources: {
    scherrer: 'P. Scherrer, Nachr. Ges. Wiss. Göttingen 26, 98-100 (1918)',
    crystallography: 'International Tables for Crystallography, Vol. A (2016)',
    extinction: 'Space Group Systematic Absences, IUCr'
  },
  precision: {
    crystalliteSize: '±10-20% (取决于FWHM测量精度)',
    latticeParams: '±0.001-0.01 Å (取决于峰位精度)'
  },
  applicableRange: {
    crystalliteSize: '3-200 nm (超过200nm，XRD线宽主要由仪器宽化决定)',
    scherrerK: '0.89-1.0 (取决于晶粒形状)'
  }
};

/**
 * Scherrer公式：晶粒尺寸计算
 * D = Kλ / (β·cosθ)
 * 
 * @param {number} fwhm - 半峰宽(FWHM)，单位：度(°)
 * @param {number} theta2 - 衍射角2θ，单位：度(°)
 * @param {number} lambda - X射线波长，单位：Å (默认1.5406，Cu Kα)
 * @param {number} K - 形状因子 (默认0.9，球形颗粒)
 * @returns {object} { size: 晶粒尺寸(nm), details: 详细信息 } 或 { error, errorCode }
 */
function calculateCrystalliteSize(fwhm, theta2, lambda = 1.5406, K = 0.9) {
  // 输入类型转换
  const beta = Number(fwhm);
  const twoTheta = Number(theta2);
  const lam = Number(lambda);
  const shapeK = Number(K);

  // 基本有效性检查
  if (!isFinite(beta) || !isFinite(twoTheta) || !isFinite(lam) || !isFinite(shapeK)) {
    return {
      error: '输入必须为有效数字',
      errorCode: 'INVALID_NUMBER',
      input: { fwhm, theta2, lambda, K }
    };
  }

  // 范围检查
  if (beta <= 0 || beta > 10) {
    return {
      error: 'FWHM应在0°到10°之间（典型值0.1-2°）',
      errorCode: 'INVALID_FWHM'
    };
  }

  if (twoTheta <= 0 || twoTheta >= 180) {
    return {
      error: '衍射角2θ应在0°到180°之间',
      errorCode: 'INVALID_ANGLE'
    };
  }

  if (lam <= 0 || lam > 5) {
    return {
      error: 'X射线波长应在0-5 Å之间（常用范围0.5-2.5 Å）',
      errorCode: 'INVALID_WAVELENGTH'
    };
  }

  if (shapeK < 0.89 || shapeK > 1.0) {
    return {
      error: '形状因子K应在0.89-1.0之间',
      errorCode: 'INVALID_K'
    };
  }

  // 计算
  const theta = twoTheta / 2; // θ (度)
  const thetaRad = theta * Math.PI / 180; // θ (弧度)
  const betaRad = beta * Math.PI / 180; // β (弧度)

  // Scherrer公式：D = Kλ / (β·cosθ)
  const cosTheta = Math.cos(thetaRad);
  
  if (cosTheta <= 0) {
    return {
      error: '角度超出有效范围（θ应小于90°）',
      errorCode: 'INVALID_THETA'
    };
  }

  // 晶粒尺寸 (Å)
  const sizeAngstrom = (shapeK * lam) / (betaRad * cosTheta);
  
  // 转换为 nm
  const sizeNm = sizeAngstrom / 10;

  // 估算应变效应（简化）
  // 当FWHM较大时，可能包含应变宽化
  let strainWarning = '';
  if (beta > 0.5) {
    strainWarning = '⚠️ FWHM较大，可能包含应变宽化效应。建议使用Williamson-Hall方法分离尺寸和应变贡献。';
  }

  // 尺寸范围建议
  let sizeNote = '';
  if (sizeNm < 3) {
    sizeNote = '⚠️ 晶粒尺寸小于3nm，接近Scherrer公式适用下限，结果仅供参考。';
  } else if (sizeNm > 200) {
    sizeNote = '⚠️ 晶粒尺寸大于200nm，XRD线宽主要由仪器宽化决定，建议进行仪器宽化修正。';
  }

  return {
    size: sizeNm,
    unit: 'nm',
    details: {
      fwhm: `${beta.toFixed(3)}°`,
      theta2: `${twoTheta.toFixed(2)}°`,
      theta: `${theta.toFixed(2)}°`,
      lambda: `${lam} Å`,
      K: shapeK,
      sizeAngstrom: `${sizeAngstrom.toFixed(2)} Å`,
      sizeNm: `${sizeNm.toFixed(2)} nm`,
      formula: 'D = Kλ / (β·cosθ)',
      strainWarning,
      sizeNote
    },
    precision: '±10-20%',
    conditions: [
      'FWHM需扣除仪器宽化',
      '假设晶粒为无应变状态',
      `形状因子K=${shapeK}（球形颗粒）`
    ]
  };
}

/**
 * 晶格常数精修（立方晶系简化版）
 * 使用多个衍射峰拟合晶格参数
 * 
 * @param {Array} peaks - 衍射峰数组 [{h, k, l, theta2}]
 * @param {string} crystalSystem - 晶系类型 ('cubic', 'tetragonal', 'hexagonal', 'orthorhombic')
 * @returns {object} 精修结果
 */
function refineLatticeParameters(peaks, crystalSystem = 'cubic') {
  if (!Array.isArray(peaks) || peaks.length < 3) {
    return {
      error: '至少需要3个衍射峰进行精修',
      errorCode: 'INSUFFICIENT_PEAKS'
    };
  }

  // 立方晶系：1/d² = (h²+k²+l²)/a²
  if (crystalSystem === 'cubic') {
    return refineCubicLattice(peaks);
  }

  // 四方晶系：1/d² = (h²+k²)/a² + l²/c²
  if (crystalSystem === 'tetragonal') {
    return refineTetragonalLattice(peaks);
  }

  // 六方晶系：1/d² = 4(h²+hk+k²)/(3a²) + l²/c²
  if (crystalSystem === 'hexagonal') {
    return refineHexagonalLattice(peaks);
  }

  // 正交晶系：1/d² = h²/a² + k²/b² + l²/c²
  if (crystalSystem === 'orthorhombic') {
    return refineOrthorhombicLattice(peaks);
  }

  // 单斜晶系：1/d² = h²/a²sin²β + k²/b² + l²/c²sin²β - 2hlcosβ/(acsin²β)
  if (crystalSystem === 'monoclinic') {
    return refineMonoclinicLattice(peaks);
  }

  // 三斜晶系：复杂公式，需要6个晶格参数和3个角度
  if (crystalSystem === 'triclinic') {
    return refineTriclinicLattice(peaks);
  }

  return {
    error: `未知晶系: ${crystalSystem}`,
    errorCode: 'UNKNOWN_SYSTEM'
  };
}

/**
 * 立方晶系晶格常数精修
 */
function refineCubicLattice(peaks) {
  const lambda = 1.5406; // Cu Kα
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
  let n = 0;

  const refinedPeaks = [];

  for (const peak of peaks) {
    const { h, k, l, theta2 } = peak;
    
    if (!isFinite(h) || !isFinite(k) || !isFinite(l) || !isFinite(theta2)) {
      continue;
    }

    const hkl2 = h * h + k * k + l * l;
    if (hkl2 === 0) continue;

    const thetaRad = (theta2 / 2) * Math.PI / 180;
    const sinTheta = Math.sin(thetaRad);
    
    if (sinTheta <= 0 || sinTheta >= 1) continue;

    // d = λ / (2·sinθ)
    const d = lambda / (2 * sinTheta);
    
    // 1/d²
    const invD2 = 1 / (d * d);

    // 线性拟合：1/d² = hkl²/a²
    // Y = 1/d², X = h²+k²+l²
    sumX += hkl2;
    sumY += invD2;
    sumXY += hkl2 * invD2;
    sumXX += hkl2 * hkl2;
    n++;

    refinedPeaks.push({
      hkl: `(${h}${k}${l})`,
      theta2: theta2.toFixed(2),
      d: d.toFixed(4),
      hkl2
    });
  }

  if (n < 3) {
    return {
      error: '有效峰数少于3个，无法进行精修',
      errorCode: 'INSUFFICIENT_VALID_PEAKS'
    };
  }

  // 最小二乘法拟合：slope = 1/a²
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  
  if (slope <= 0) {
    return {
      error: '拟合失败，请检查输入数据',
      errorCode: 'FIT_FAILED'
    };
  }

  const a = Math.sqrt(1 / slope); // 晶格常数 (Å)

  // 计算R²（拟合优度）
  const meanY = sumY / n;
  let ssRes = 0, ssTot = 0;
  
  for (const peak of peaks) {
    const { h, k, l, theta2 } = peak;
    const hkl2 = h * h + k * k + l * l;
    const thetaRad = (theta2 / 2) * Math.PI / 180;
    const sinTheta = Math.sin(thetaRad);
    const d = lambda / (2 * sinTheta);
    const invD2 = 1 / (d * d);
    
    const predicted = slope * hkl2;
    ssRes += (invD2 - predicted) * (invD2 - predicted);
    ssTot += (invD2 - meanY) * (invD2 - meanY);
  }

  const rSquared = 1 - ssRes / ssTot;

  return {
    latticeParameter: {
      a: a.toFixed(4),
      unit: 'Å'
    },
    crystalSystem: 'cubic',
    peaksUsed: n,
    rSquared: rSquared.toFixed(4),
    goodnessOfFit: rSquared > 0.99 ? '优秀' : rSquared > 0.95 ? '良好' : '一般',
    refinedPeaks,
    notes: [
      '精修方法：最小二乘法',
      '假设无系统误差',
      'R² 接近1表示拟合良好'
    ]
  };
}

/**
 * 四方晶系晶格常数精修
 * 1/d² = (h²+k²)/a² + l²/c²
 */
function refineTetragonalLattice(peaks) {
  const lambda = 1.5406; // Cu Kα
  
  // 建立线性方程组求解 1/a² 和 1/c²
  // Y = X1·(h²+k²) + X2·l²
  // 其中 Y = 1/d², X1 = 1/a², X2 = 1/c²
  
  let n = 0;
  let sum_hk2 = 0, sum_l2 = 0, sum_hk4 = 0, sum_l4 = 0;
  let sum_hk2_l2 = 0, sum_Y = 0, sum_Y_hk2 = 0, sum_Y_l2 = 0;
  
  const refinedPeaks = [];
  
  for (const peak of peaks) {
    const { h, k, l, theta2 } = peak;
    
    if (!isFinite(h) || !isFinite(k) || !isFinite(l) || !isFinite(theta2)) continue;
    
    const hk2 = h * h + k * k;
    const l2 = l * l;
    
    if (hk2 === 0 && l2 === 0) continue;
    
    const thetaRad = (theta2 / 2) * Math.PI / 180;
    const sinTheta = Math.sin(thetaRad);
    
    if (sinTheta <= 0 || sinTheta >= 1) continue;
    
    const d = lambda / (2 * sinTheta);
    const invD2 = 1 / (d * d);
    
    sum_hk2 += hk2;
    sum_l2 += l2;
    sum_hk4 += hk2 * hk2;
    sum_l4 += l2 * l2;
    sum_hk2_l2 += hk2 * l2;
    sum_Y += invD2;
    sum_Y_hk2 += invD2 * hk2;
    sum_Y_l2 += invD2 * l2;
    n++;
    
    refinedPeaks.push({
      hkl: `(${h}${k}${l})`,
      theta2: theta2.toFixed(2),
      d: d.toFixed(4)
    });
  }
  
  if (n < 3) {
    return {
      error: '有效峰数少于3个，无法进行精修',
      errorCode: 'INSUFFICIENT_VALID_PEAKS'
    };
  }
  
  // 最小二乘法求解
  const det = n * (sum_hk4 * sum_l4 - sum_hk2_l2 * sum_hk2_l2) - 
              sum_hk2 * (sum_hk2 * sum_l4 - sum_l2 * sum_hk2_l2) + 
              sum_l2 * (sum_hk2 * sum_hk2_l2 - sum_l2 * sum_hk4);
  
  if (Math.abs(det) < 1e-10) {
    return {
      error: '拟合失败，数据可能不适合四方晶系',
      errorCode: 'FIT_FAILED'
    };
  }
  
  const inv_a2 = (sum_Y_hk2 * sum_l4 - sum_Y_l2 * sum_hk2_l2) / 
                 (sum_hk4 * sum_l4 - sum_hk2_l2 * sum_hk2_l2);
  const inv_c2 = (sum_Y_l2 * sum_hk4 - sum_Y_hk2 * sum_hk2_l2) / 
                 (sum_hk4 * sum_l4 - sum_hk2_l2 * sum_hk2_l2);
  
  if (inv_a2 <= 0 || inv_c2 <= 0) {
    return {
      error: '拟合失败，请检查输入数据或晶系选择',
      errorCode: 'NEGATIVE_PARAMETER'
    };
  }
  
  const a = Math.sqrt(1 / inv_a2);
  const c = Math.sqrt(1 / inv_c2);
  const c_a_ratio = c / a;
  
  return {
    latticeParameter: {
      a: a.toFixed(4),
      c: c.toFixed(4),
      c_a_ratio: c_a_ratio.toFixed(4),
      unit: 'Å'
    },
    crystalSystem: 'tetragonal',
    peaksUsed: n,
    refinedPeaks,
    notes: [
      '精修方法：最小二乘法',
      'c/a 比值可用于材料鉴定',
      '需要包含不同 (hkl) 和 (00l) 类型的峰'
    ]
  };
}

/**
 * 六方晶系晶格常数精修
 * 1/d² = 4(h²+hk+k²)/(3a²) + l²/c²
 */
function refineHexagonalLattice(peaks) {
  const lambda = 1.5406;
  
  let n = 0;
  let sum_X1 = 0, sum_X2 = 0, sum_X1X1 = 0, sum_X2X2 = 0;
  let sum_X1X2 = 0, sum_Y = 0, sum_YX1 = 0, sum_YX2 = 0;
  
  const refinedPeaks = [];
  
  for (const peak of peaks) {
    const { h, k, l, theta2 } = peak;
    
    if (!isFinite(h) || !isFinite(k) || !isFinite(l) || !isFinite(theta2)) continue;
    
    const X1 = h * h + h * k + k * k;  // h²+hk+k²
    const X2 = l * l;  // l²
    
    if (X1 === 0 && X2 === 0) continue;
    
    const thetaRad = (theta2 / 2) * Math.PI / 180;
    const sinTheta = Math.sin(thetaRad);
    
    if (sinTheta <= 0 || sinTheta >= 1) continue;
    
    const d = lambda / (2 * sinTheta);
    const invD2 = 1 / (d * d);
    
    sum_X1 += X1;
    sum_X2 += X2;
    sum_X1X1 += X1 * X1;
    sum_X2X2 += X2 * X2;
    sum_X1X2 += X1 * X2;
    sum_Y += invD2;
    sum_YX1 += invD2 * X1;
    sum_YX2 += invD2 * X2;
    n++;
    
    refinedPeaks.push({
      hkl: `(${h}${k}${l})`,
      theta2: theta2.toFixed(2),
      d: d.toFixed(4)
    });
  }
  
  if (n < 3) {
    return {
      error: '有效峰数少于3个，无法进行精修',
      errorCode: 'INSUFFICIENT_VALID_PEAKS'
    };
  }
  
  // 求解 4/(3a²) 和 1/c²
  const coeff1 = (sum_YX1 * sum_X2X2 - sum_YX2 * sum_X1X2) / 
                 (sum_X1X1 * sum_X2X2 - sum_X1X2 * sum_X1X2);
  const coeff2 = (sum_YX2 * sum_X1X1 - sum_YX1 * sum_X1X2) / 
                 (sum_X1X1 * sum_X2X2 - sum_X1X2 * sum_X1X2);
  
  if (coeff1 <= 0 || coeff2 <= 0) {
    return {
      error: '拟合失败，请检查输入数据或晶系选择',
      errorCode: 'NEGATIVE_PARAMETER'
    };
  }
  
  const a = Math.sqrt(4 / (3 * coeff1));
  const c = Math.sqrt(1 / coeff2);
  const c_a_ratio = c / a;
  
  return {
    latticeParameter: {
      a: a.toFixed(4),
      c: c.toFixed(4),
      c_a_ratio: c_a_ratio.toFixed(4),
      unit: 'Å'
    },
    crystalSystem: 'hexagonal',
    peaksUsed: n,
    refinedPeaks,
    notes: [
      '精修方法：最小二乘法',
      '六方晶系：α=β=90°, γ=120°',
      'c/a 比值：理想六方密堆积为1.633'
    ]
  };
}

/**
 * 正交晶系晶格常数精修
 * 1/d² = h²/a² + k²/b² + l²/c²
 */
function refineOrthorhombicLattice(peaks) {
  const lambda = 1.5406;
  
  if (peaks.length < 4) {
    return {
      error: '正交晶系至少需要4个衍射峰',
      errorCode: 'INSUFFICIENT_PEAKS'
    };
  }
  
  // 需要求解3个参数，使用最小二乘法
  const equations = [];
  
  for (const peak of peaks) {
    const { h, k, l, theta2 } = peak;
    
    if (!isFinite(h) || !isFinite(k) || !isFinite(l) || !isFinite(theta2)) continue;
    
    const thetaRad = (theta2 / 2) * Math.PI / 180;
    const sinTheta = Math.sin(thetaRad);
    
    if (sinTheta <= 0 || sinTheta >= 1) continue;
    
    const d = lambda / (2 * sinTheta);
    const invD2 = 1 / (d * d);
    
    equations.push({
      h2: h * h,
      k2: k * k,
      l2: l * l,
      invD2: invD2,
      hkl: `(${h}${k}${l})`,
      theta2: theta2.toFixed(2),
      d: d.toFixed(4)
    });
  }
  
  if (equations.length < 4) {
    return {
      error: '有效峰数少于4个，无法精修正交晶系',
      errorCode: 'INSUFFICIENT_VALID_PEAKS'
    };
  }
  
  // 构建正规方程并求解（简化实现）
  let sum_h4 = 0, sum_k4 = 0, sum_l4 = 0;
  let sum_h2k2 = 0, sum_h2l2 = 0, sum_k2l2 = 0;
  let sum_h2Y = 0, sum_k2Y = 0, sum_l2Y = 0;
  let n = equations.length;
  
  for (const eq of equations) {
    sum_h4 += eq.h2 * eq.h2;
    sum_k4 += eq.k2 * eq.k2;
    sum_l4 += eq.l2 * eq.l2;
    sum_h2k2 += eq.h2 * eq.k2;
    sum_h2l2 += eq.h2 * eq.l2;
    sum_k2l2 += eq.k2 * eq.l2;
    sum_h2Y += eq.h2 * eq.invD2;
    sum_k2Y += eq.k2 * eq.invD2;
    sum_l2Y += eq.l2 * eq.invD2;
  }
  
  // 简化求解（假设矩阵可逆）
  const det = sum_h4 * (sum_k4 * sum_l4 - sum_k2l2 * sum_k2l2) -
              sum_h2k2 * (sum_h2k2 * sum_l4 - sum_h2l2 * sum_k2l2) +
              sum_h2l2 * (sum_h2k2 * sum_k2l2 - sum_h2l2 * sum_k4);
  
  if (Math.abs(det) < 1e-10) {
    return {
      error: '拟合失败，数据线性相关或不适合正交晶系',
      errorCode: 'FIT_FAILED'
    };
  }
  
  // 克莱姆法则求解
  const inv_a2 = (sum_h2Y * (sum_k4 * sum_l4 - sum_k2l2 * sum_k2l2) -
                  sum_k2Y * (sum_h2k2 * sum_l4 - sum_h2l2 * sum_k2l2) +
                  sum_l2Y * (sum_h2k2 * sum_k2l2 - sum_h2l2 * sum_k4)) / det;
  
  const inv_b2 = (sum_h4 * (sum_k2Y * sum_l4 - sum_l2Y * sum_k2l2) -
                  sum_h2k2 * (sum_h2Y * sum_l4 - sum_l2Y * sum_h2l2) +
                  sum_h2l2 * (sum_h2Y * sum_k2l2 - sum_k2Y * sum_h2l2)) / det;
  
  const inv_c2 = (sum_h4 * (sum_k4 * sum_l2Y - sum_k2l2 * sum_k2Y) -
                  sum_h2k2 * (sum_h2k2 * sum_l2Y - sum_h2l2 * sum_k2Y) +
                  sum_h2l2 * (sum_h2k2 * sum_k2Y - sum_h2l2 * sum_k4)) / det;
  
  if (inv_a2 <= 0 || inv_b2 <= 0 || inv_c2 <= 0) {
    return {
      error: '拟合失败，请检查输入数据或晶系选择',
      errorCode: 'NEGATIVE_PARAMETER'
    };
  }
  
  const a = Math.sqrt(1 / inv_a2);
  const b = Math.sqrt(1 / inv_b2);
  const c = Math.sqrt(1 / inv_c2);
  
  return {
    latticeParameter: {
      a: a.toFixed(4),
      b: b.toFixed(4),
      c: c.toFixed(4),
      unit: 'Å'
    },
    crystalSystem: 'orthorhombic',
    peaksUsed: n,
    refinedPeaks: equations.map(eq => ({
      hkl: eq.hkl,
      theta2: eq.theta2,
      d: eq.d
    })),
    notes: [
      '精修方法：最小二乘法',
      '正交晶系：α=β=γ=90°, a≠b≠c',
      '需要不同方向的衍射峰以准确确定三个轴长'
    ]
  };
}

/**
 * 单斜晶系晶格常数精修
 * 1/d² = h²/a²sin²β + k²/b² + l²/c²sin²β - 2hlcosβ/(acsin²β)
 * 需要提供β角度（用户输入或估算）
 */
function refineMonoclinicLattice(peaks, beta = 90) {
  const lambda = 1.5406;
  
  if (peaks.length < 5) {
    return {
      error: '单斜晶系至少需要5个衍射峰（建议提供β角度）',
      errorCode: 'INSUFFICIENT_PEAKS'
    };
  }
  
  return {
    error: '单斜晶系精修需要提供β角度参数，建议使用专业软件（如GSAS、FullProf）',
    errorCode: 'COMPLEX_SYSTEM',
    recommendation: '简化方法：若β≈90°可尝试正交晶系精修',
    notes: [
      '单斜晶系：α=γ=90°, β≠90°',
      '需要至少5个独立衍射峰',
      '需要预先知道或估算β角度',
      '精修复杂，建议使用专业Rietveld精修软件'
    ]
  };
}

/**
 * 三斜晶系晶格常数精修
 * 需要6个晶格参数(a,b,c,α,β,γ)，公式极其复杂
 */
function refineTriclinicLattice(peaks) {
  return {
    error: '三斜晶系精修需要专业Rietveld精修软件',
    errorCode: 'VERY_COMPLEX_SYSTEM',
    recommendation: '请使用GSAS、FullProf、Jana2006等专业软件进行全谱拟合',
    notes: [
      '三斜晶系：a≠b≠c, α≠β≠γ≠90°',
      '需要6个独立晶格参数',
      '需要大量高质量衍射数据',
      '手工计算不现实，必须使用专业软件'
    ]
  };
}

/**
 * 消光系统判断
 * 根据观察到的衍射峰判断可能的消光规则和空间群
 * 
 * @param {Array} observedPeaks - 观察到的(hkl)列表，如 [{h,k,l}]
 * @returns {object} 消光规则分析结果
 */
function determineExtinction(observedPeaks) {
  if (!Array.isArray(observedPeaks) || observedPeaks.length === 0) {
    return {
      error: '请输入观察到的衍射峰(hkl)',
      errorCode: 'NO_PEAKS'
    };
  }

  // 简化的消光规则检查（立方晶系常见情况）
  const extinctions = {
    primitive: { name: 'P (简单)', rule: '无系统消光', checked: false },
    fcc: { name: 'F (面心)', rule: 'h,k,l 全为偶数或全为奇数', checked: false },
    bcc: { name: 'I (体心)', rule: 'h+k+l = 偶数', checked: false },
    diamond: { name: 'Fd (金刚石)', rule: 'h,k,l全偶或全奇，且h+k+l=4n', checked: false }
  };

  // 检查每个可能的消光规则
  for (const peak of observedPeaks) {
    const { h, k, l } = peak;
    
    if (!isFinite(h) || !isFinite(k) || !isFinite(l)) continue;

    const allEven = h % 2 === 0 && k % 2 === 0 && l % 2 === 0;
    const allOdd = h % 2 === 1 && k % 2 === 1 && l % 2 === 1;
    const sum = h + k + l;

    // 简单格子：任何峰都可以出现
    extinctions.primitive.checked = true;

    // 面心：h,k,l全偶或全奇
    if (allEven || allOdd) {
      extinctions.fcc.checked = true;
    }

    // 体心：h+k+l为偶数
    if (sum % 2 === 0) {
      extinctions.bcc.checked = true;
    }

    // 金刚石：h,k,l全偶或全奇，且h+k+l=4n
    if ((allEven || allOdd) && sum % 4 === 0) {
      extinctions.diamond.checked = true;
    }
  }

  // 生成可能的布拉维格子
  const possibleLattices = [];
  for (const [key, ext] of Object.entries(extinctions)) {
    if (ext.checked) {
      possibleLattices.push({
        type: ext.name,
        rule: ext.rule,
        examples: getExampleSpaceGroups(key)
      });
    }
  }

  return {
    peaksAnalyzed: observedPeaks.length,
    possibleLattices,
    note: '⚠️ 此分析为初步判断，确定空间群需要完整的衍射数据和系统消光分析',
    recommendation: '建议使用专业软件（如GSAS、FullProf）进行完整的结构精修'
  };
}

/**
 * 获取示例空间群
 */
function getExampleSpaceGroups(latticeType) {
  const examples = {
    primitive: ['P1', 'Pm', 'Pmm2', 'P4', 'P222', 'P23'],
    fcc: ['F23', 'Fm-3m', 'Fd-3m'],
    bcc: ['I4', 'Im-3m', 'I41/a'],
    diamond: ['Fd-3m (金刚石结构)']
  };
  return examples[latticeType] || [];
}

/**
 * 相对峰强计算
 * 归一化峰强，计算相对强度
 * 
 * @param {Array} peaks - 峰强数组 [{hkl, intensity}]
 * @returns {object} 归一化结果
 */
function calculateRelativeIntensity(peaks) {
  if (!Array.isArray(peaks) || peaks.length === 0) {
    return {
      error: '请输入峰强数据',
      errorCode: 'NO_DATA'
    };
  }

  // 找到最大强度
  let maxIntensity = 0;
  for (const peak of peaks) {
    const intensity = Number(peak.intensity);
    if (isFinite(intensity) && intensity > maxIntensity) {
      maxIntensity = intensity;
    }
  }

  if (maxIntensity === 0) {
    return {
      error: '所有峰强为0或无效',
      errorCode: 'ZERO_INTENSITY'
    };
  }

  // 归一化
  const normalizedPeaks = peaks.map(peak => {
    const intensity = Number(peak.intensity);
    const relativeIntensity = (intensity / maxIntensity) * 100;
    
    return {
      hkl: peak.hkl,
      intensity: intensity.toFixed(1),
      relativeIntensity: relativeIntensity.toFixed(1),
      percentage: `${relativeIntensity.toFixed(1)}%`
    };
  });

  // 计算总强度（用于结晶度估算）
  const totalIntensity = peaks.reduce((sum, peak) => {
    const intensity = Number(peak.intensity);
    return sum + (isFinite(intensity) ? intensity : 0);
  }, 0);

  // 简单的结晶度估算（基于峰强总和，仅供参考）
  // 实际结晶度计算需要更复杂的方法
  const crystallinityNote = '结晶度估算需要结合非晶散射峰分析，此处仅提供相对强度';

  return {
    normalizedPeaks,
    maxIntensity: maxIntensity.toFixed(1),
    totalIntensity: totalIntensity.toFixed(1),
    peakCount: peaks.length,
    crystallinityNote,
    usage: '相对强度可用于：1) 物相鉴定 2) 择优取向分析 3) 结晶度对比'
  };
}

/**
 * PDF卡片号查询（模拟功能）
 * 实际应用需要连接ICDD数据库
 * 
 * @param {string} pdfNumber - PDF卡片号，如 "01-089-0562"
 * @returns {object} PDF卡片信息
 */
function queryPDFCard(pdfNumber) {
  // 常见材料的PDF卡片数据库（示例）
  const pdfDatabase = {
    '01-089-0562': {
      name: 'Anatase TiO₂',
      formula: 'TiO₂',
      crystalSystem: 'Tetragonal',
      spaceGroup: 'I41/amd',
      a: 3.7852,
      c: 9.5139,
      peaks: [
        { hkl: '101', d: 3.520, relInt: 100, theta2: 25.28 },
        { hkl: '004', d: 2.378, relInt: 10, theta2: 37.80 },
        { hkl: '200', d: 1.892, relInt: 25, theta2: 48.05 },
        { hkl: '105', d: 1.699, relInt: 20, theta2: 53.89 },
        { hkl: '211', d: 1.665, relInt: 30, theta2: 55.06 }
      ]
    },
    '01-071-1167': {
      name: 'Rutile TiO₂',
      formula: 'TiO₂',
      crystalSystem: 'Tetragonal',
      spaceGroup: 'P42/mnm',
      a: 4.5937,
      c: 2.9581,
      peaks: [
        { hkl: '110', d: 3.247, relInt: 100, theta2: 27.45 },
        { hkl: '101', d: 2.487, relInt: 50, theta2: 36.09 },
        { hkl: '200', d: 2.296, relInt: 10, theta2: 39.19 },
        { hkl: '111', d: 2.187, relInt: 20, theta2: 41.23 },
        { hkl: '210', d: 2.054, relInt: 25, theta2: 44.05 }
      ]
    },
    '04-0850': {
      name: 'Gold (Au)',
      formula: 'Au',
      crystalSystem: 'Cubic',
      spaceGroup: 'Fm-3m',
      a: 4.0786,
      peaks: [
        { hkl: '111', d: 2.355, relInt: 100, theta2: 38.18 },
        { hkl: '200', d: 2.039, relInt: 52, theta2: 44.39 },
        { hkl: '220', d: 1.442, relInt: 32, theta2: 64.58 },
        { hkl: '311', d: 1.230, relInt: 33, theta2: 77.55 }
      ]
    },
    '05-0664': {
      name: 'Silver (Ag)',
      formula: 'Ag',
      crystalSystem: 'Cubic',
      spaceGroup: 'Fm-3m',
      a: 4.0862,
      peaks: [
        { hkl: '111', d: 2.359, relInt: 100, theta2: 38.12 },
        { hkl: '200', d: 2.043, relInt: 40, theta2: 44.30 },
        { hkl: '220', d: 1.445, relInt: 25, theta2: 64.44 },
        { hkl: '311', d: 1.232, relInt: 28, theta2: 77.40 }
      ]
    }
  };

  if (!pdfNumber || typeof pdfNumber !== 'string') {
    return {
      error: '请输入PDF卡片号',
      errorCode: 'INVALID_INPUT'
    };
  }

  const cardData = pdfDatabase[pdfNumber];
  
  if (!cardData) {
    return {
      error: `未找到PDF卡片号 ${pdfNumber}`,
      errorCode: 'NOT_FOUND',
      suggestion: '当前仅包含示例数据：' + Object.keys(pdfDatabase).join(', '),
      note: '完整PDF数据库需要ICDD授权'
    };
  }

  return {
    pdfNumber,
    ...cardData,
    note: '数据来源：ICDD PDF-4+ 数据库（示例）'
  };
}

/**
 * 相纯度分析（多相混合物）
 * 基于Rietveld方法的简化版本
 * 
 * @param {Array} phases - 相信息 [{name, mainPeakIntensity, RIR}]
 *   RIR (Reference Intensity Ratio): 相对于刚玉的强度比
 * @returns {object} 相含量分析结果
 */
function analyzePhasePurity(phases) {
  if (!Array.isArray(phases) || phases.length === 0) {
    return {
      error: '请输入相信息',
      errorCode: 'NO_PHASES'
    };
  }

  if (phases.length === 1) {
    return {
      phases: [{
        name: phases[0].name,
        content: 100,
        percentage: '100%'
      }],
      purity: '单相',
      note: '仅检测到一个相'
    };
  }

  // 计算相对含量（使用RIR方法）
  // Wα = (Iα/RIRα) / Σ(Ii/RIRi)
  
  let totalWeightedIntensity = 0;
  const processedPhases = [];

  for (const phase of phases) {
    const { name, mainPeakIntensity, RIR = 1 } = phase;
    
    const intensity = Number(mainPeakIntensity);
    const rir = Number(RIR);
    
    if (!isFinite(intensity) || !isFinite(rir) || intensity <= 0 || rir <= 0) {
      return {
        error: `相 "${name}" 的强度或RIR值无效`,
        errorCode: 'INVALID_PHASE_DATA'
      };
    }

    const weightedIntensity = intensity / rir;
    totalWeightedIntensity += weightedIntensity;

    processedPhases.push({
      name,
      intensity,
      RIR: rir,
      weightedIntensity
    });
  }

  // 计算重量百分比
  const results = processedPhases.map(phase => {
    const weightPercent = (phase.weightedIntensity / totalWeightedIntensity) * 100;
    return {
      name: phase.name,
      content: weightPercent.toFixed(1),
      percentage: `${weightPercent.toFixed(1)}%`,
      intensity: phase.intensity.toFixed(1),
      RIR: phase.RIR
    };
  });

  // 判断主相
  const mainPhase = results.reduce((max, phase) => 
    parseFloat(phase.content) > parseFloat(max.content) ? phase : max
  );

  const purityLevel = parseFloat(mainPhase.content);
  let purityGrade = '';
  if (purityLevel >= 95) purityGrade = '高纯度';
  else if (purityLevel >= 85) purityGrade = '较高纯度';
  else if (purityLevel >= 70) purityGrade = '中等纯度';
  else purityGrade = '低纯度/多相混合';

  return {
    phases: results,
    mainPhase: mainPhase.name,
    mainPhaseContent: mainPhase.percentage,
    purityGrade,
    totalPhases: phases.length,
    method: 'RIR方法（参考强度比）',
    notes: [
      'RIR值需要查阅ICDD数据库',
      '假设样品无择优取向',
      '更精确的定量需要Rietveld全谱拟合',
      '误差范围：±3-5%（取决于RIR准确度）'
    ],
    references: [
      'Chung, F.H., J. Appl. Cryst. 7, 519-525 (1974)',
      'ICDD PDF-4+ Database'
    ]
  };
}

/**
 * 织构系数计算（March-Dollase模型简化版）
 * 评估晶体的择优取向程度
 * 
 * @param {Array} peaks - 峰强数据 [{hkl, observed, standard}]
 *   observed: 实测相对强度
 *   standard: 标准粉末相对强度（来自PDF卡片）
 * @returns {object} 织构分析结果
 */
function calculateTextureCoefficient(peaks) {
  if (!Array.isArray(peaks) || peaks.length < 3) {
    return {
      error: '至少需要3个衍射峰进行织构分析',
      errorCode: 'INSUFFICIENT_PEAKS'
    };
  }

  const n = peaks.length;
  const textureData = [];
  
  // 计算每个峰的织构系数
  // TC(hkl) = [I(hkl)/I0(hkl)] / [1/n * Σ(I(hkl)/I0(hkl))]
  
  let sumRatio = 0;
  const ratios = [];

  for (const peak of peaks) {
    const { hkl, observed, standard } = peak;
    
    const obs = Number(observed);
    const std = Number(standard);
    
    if (!isFinite(obs) || !isFinite(std) || std === 0) {
      return {
        error: `峰 ${hkl} 的数据无效`,
        errorCode: 'INVALID_PEAK_DATA'
      };
    }

    const ratio = obs / std;
    ratios.push({ hkl, ratio });
    sumRatio += ratio;
  }

  const avgRatio = sumRatio / n;

  // 计算织构系数
  for (let i = 0; i < n; i++) {
    const tc = ratios[i].ratio / avgRatio;
    
    // 判断择优程度
    let orientation = '';
    if (tc > 2.0) orientation = '强择优取向';
    else if (tc > 1.5) orientation = '中等择优取向';
    else if (tc > 1.2) orientation = '轻微择优取向';
    else if (tc < 0.8 && tc > 0.5) orientation = '轻微负向择优';
    else if (tc <= 0.5) orientation = '强负向择优';
    else orientation = '随机取向';

    textureData.push({
      hkl: ratios[i].hkl,
      observed: peaks[i].observed,
      standard: peaks[i].standard,
      textureCoefficient: tc.toFixed(3),
      orientation
    });
  }

  // 计算整体织构指数
  let sumDeviation = 0;
  for (const data of textureData) {
    const tc = parseFloat(data.textureCoefficient);
    sumDeviation += Math.abs(tc - 1);
  }
  const textureIndex = (sumDeviation / n).toFixed(3);

  // 判断整体择优程度
  let overallTexture = '';
  if (textureIndex < 0.1) overallTexture = '几乎无择优（随机取向）';
  else if (textureIndex < 0.3) overallTexture = '轻微择优取向';
  else if (textureIndex < 0.6) overallTexture = '中等择优取向';
  else overallTexture = '强择优取向';

  return {
    textureData,
    textureIndex,
    overallTexture,
    peaksAnalyzed: n,
    method: 'Harris织构系数法',
    interpretation: {
      'TC = 1': '随机取向（无择优）',
      'TC > 1': '正向择优取向（该晶面平行于样品表面）',
      'TC < 1': '负向择优取向（该晶面垂直于样品表面）'
    },
    notes: [
      '织构系数范围：0 ~ ∞',
      'TC = 1 表示完全随机取向',
      'TC偏离1越远，择优程度越强',
      '制样方法会显著影响织构',
      '薄膜样品通常有明显择优取向'
    ],
    references: [
      'Harris, G.B., Phil. Mag. 43, 113-123 (1952)',
      'Dollase, W.A., J. Appl. Cryst. 19, 267-272 (1986)'
    ]
  };
}

/**
 * 获取元数据
 */
function getMetadata() {
  return METADATA;
}

module.exports = {
  calculateCrystalliteSize,
  refineLatticeParameters,
  determineExtinction,
  calculateRelativeIntensity,
  queryPDFCard,
  analyzePhasePurity,
  calculateTextureCoefficient,
  getMetadata
};

