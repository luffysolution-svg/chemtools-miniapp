// UTF-8, no BOM
// Tauc Plot 带隙计算工具
// 用于从UV-Vis吸收光谱数据计算半导体材料的带隙
// 数据来源：J. Tauc, R. Grigorovici, A. Vancu, Phys. Status Solidi B 15, 627 (1966)

const METADATA = {
  version: '1.0.0',
  lastUpdated: '2025-10-18',
  sources: {
    taucPlot: 'J. Tauc, R. Grigorovici, A. Vancu, Phys. Status Solidi B 15, 627 (1966)',
    kubelkaMunk: 'P. Kubelka, F. Munk, Z. Tech. Phys. 12, 593 (1931)',
    beerLambert: 'A. Beer, Ann. Phys. Chem. 86, 78 (1852)'
  },
  precision: {
    bandgap: '±0.05 eV (取决于拟合质量)',
    absorption: '±2% (取决于测量精度)'
  },
  applicableRange: {
    directBandgap: '适用于直接带隙半导体（如GaAs, CdS）',
    indirectBandgap: '适用于间接带隙半导体（如Si, GaP）',
    wavelength: '200-800 nm (紫外-可见光范围)'
  }
};

// 常数
const PLANCK_CONSTANT = 4.135667696e-15; // eV·s
const SPEED_OF_LIGHT = 2.99792458e8; // m/s
const HC_CONSTANT = PLANCK_CONSTANT * SPEED_OF_LIGHT * 1e9; // eV·nm = 1239.84

/**
 * 波长转光子能量
 * @param {number} wavelength - 波长(nm)
 * @returns {number} 光子能量(eV)
 */
function wavelengthToEnergy(wavelength) {
  return HC_CONSTANT / wavelength;
}

/**
 * 光子能量转波长
 * @param {number} energy - 光子能量(eV)
 * @returns {number} 波长(nm)
 */
function energyToWavelength(energy) {
  return HC_CONSTANT / energy;
}

/**
 * Tauc Plot 带隙计算
 * (αhν)^n vs hν 线性拟合，外推至x轴求带隙
 * 
 * @param {Array} absorptionData - 吸收光谱数据 [{wavelength(nm), absorbance}] 或 [{energy(eV), alpha}]
 * @param {string} type - 'direct'(n=2) 或 'indirect'(n=0.5)
 * @param {object} options - 可选参数 {thickness(cm), concentration(mol/L)}
 * @returns {object} { bandgap(eV), fittedLine, rSquared } 或 { error }
 */
function calculateBandgap(absorptionData, type = 'direct', options = {}) {
  if (!Array.isArray(absorptionData) || absorptionData.length < 5) {
    return {
      error: '至少需要5个数据点进行Tauc分析',
      errorCode: 'INSUFFICIENT_DATA'
    };
  }

  const n = type === 'direct' ? 2 : 0.5; // 直接带隙: n=2, 间接带隙: n=0.5
  const { thickness, concentration } = options;

  // 数据预处理：转换为 (energy, alpha) 格式
  const processedData = [];
  
  for (const point of absorptionData) {
    let energy, alpha;
    
    if (point.wavelength !== undefined && point.absorbance !== undefined) {
      // 输入格式1：波长 + 吸光度
      const wavelength = Number(point.wavelength);
      const absorbance = Number(point.absorbance);
      
      if (!isFinite(wavelength) || !isFinite(absorbance)) continue;
      if (wavelength <= 0 || absorbance < 0) continue;
      
      energy = wavelengthToEnergy(wavelength);
      
      // 计算吸收系数 α
      // Beer-Lambert定律：A = α·d·c 或 A = α·d (对于纯样品)
      if (thickness && concentration) {
        alpha = absorbance / (thickness * concentration);
      } else if (thickness) {
        alpha = absorbance / thickness;
      } else {
        // 如果没有提供厚度，使用吸光度作为相对吸收系数
        alpha = absorbance;
      }
    } else if (point.energy !== undefined && point.alpha !== undefined) {
      // 输入格式2：能量 + 吸收系数
      energy = Number(point.energy);
      alpha = Number(point.alpha);
      
      if (!isFinite(energy) || !isFinite(alpha)) continue;
      if (energy <= 0 || alpha < 0) continue;
    } else {
      continue;
    }
    
    processedData.push({ energy, alpha });
  }

  if (processedData.length < 5) {
    return {
      error: '有效数据点不足（需要≥5个）',
      errorCode: 'INSUFFICIENT_VALID_DATA'
    };
  }

  // 计算 (αhν)^n
  const taucData = processedData.map(point => {
    const y = Math.pow(point.alpha * point.energy, n);
    return {
      x: point.energy, // hν (eV)
      y: y // (αhν)^n
    };
  }).filter(point => isFinite(point.y));

  if (taucData.length < 5) {
    return {
      error: '计算后的有效数据点不足',
      errorCode: 'CALCULATION_ERROR'
    };
  }

  // 自动识别线性区域（最大斜率附近的点）
  const linearRegion = identifyLinearRegion(taucData);
  
  if (linearRegion.length < 3) {
    return {
      error: '无法识别线性区域，请检查数据质量',
      errorCode: 'NO_LINEAR_REGION'
    };
  }

  // 线性拟合
  const { slope, intercept, rSquared } = linearFit(linearRegion);
  
  if (!isFinite(slope) || !isFinite(intercept)) {
    return {
      error: '线性拟合失败',
      errorCode: 'FIT_FAILED'
    };
  }

  // 计算带隙：外推至y=0，即 slope * Eg + intercept = 0
  // Eg = -intercept / slope
  let bandgap;
  if (slope > 0) {
    bandgap = -intercept / slope;
  } else {
    return {
      error: '拟合斜率为负，无法计算带隙',
      errorCode: 'NEGATIVE_SLOPE'
    };
  }

  if (bandgap < 0 || bandgap > 10) {
    return {
      error: `计算得到的带隙值(${bandgap.toFixed(2)} eV)超出合理范围(0-10 eV)`,
      errorCode: 'UNREASONABLE_BANDGAP'
    };
  }

  // 生成拟合线数据（用于展示）
  const minE = Math.min(...linearRegion.map(p => p.x));
  const maxE = Math.max(...linearRegion.map(p => p.x));
  const fittedLine = [
    { x: bandgap, y: 0 }, // 与x轴交点
    { x: maxE, y: slope * maxE + intercept }
  ];

  // 拟合质量评价
  let fitQuality = 'excellent';
  if (rSquared < 0.99) fitQuality = 'good';
  if (rSquared < 0.95) fitQuality = 'fair';
  if (rSquared < 0.90) fitQuality = 'poor';

  return {
    bandgap: parseFloat(bandgap.toFixed(3)),
    unit: 'eV',
    wavelength: parseFloat(energyToWavelength(bandgap).toFixed(1)),
    wavelengthUnit: 'nm',
    type: type === 'direct' ? '直接带隙' : '间接带隙',
    exponent: n,
    fittedLine,
    linearRegion: linearRegion.length,
    rSquared: parseFloat(rSquared.toFixed(4)),
    fitQuality,
    slope: parseFloat(slope.toFixed(4)),
    intercept: parseFloat(intercept.toFixed(4)),
    fittingEquation: `y = ${slope.toFixed(4)}x + ${intercept.toFixed(4)}`,
    notes: [
      `Tauc方程：(αhν)^${n} = A(hν - Eg)`,
      `线性拟合点数：${linearRegion.length}`,
      `R² = ${rSquared.toFixed(4)} (${fitQualityText(fitQuality)})`,
      fitQuality === 'poor' ? '⚠️ 拟合质量较差，请检查数据或尝试其他带隙类型' : ''
    ].filter(note => note)
  };
}

/**
 * 识别线性区域
 * 策略：找到斜率最大的区域作为吸收边
 */
function identifyLinearRegion(data) {
  if (data.length < 10) {
    // 数据点少，全部使用
    return data;
  }

  // 按能量排序
  const sorted = data.slice().sort((a, b) => a.x - b.x);
  
  // 计算局部斜率
  const slopes = [];
  for (let i = 1; i < sorted.length; i++) {
    const dx = sorted[i].x - sorted[i-1].x;
    const dy = sorted[i].y - sorted[i-1].y;
    if (dx > 0) {
      slopes.push({ index: i, slope: dy / dx });
    }
  }

  if (slopes.length === 0) return sorted;

  // 找到最大斜率位置
  const maxSlopeIdx = slopes.reduce((maxIdx, current, idx) => 
    current.slope > slopes[maxIdx].slope ? idx : maxIdx, 0
  );

  const centerIdx = slopes[maxSlopeIdx].index;
  
  // 以最大斜率点为中心，取前后各10个点（或全部）
  const windowSize = 10;
  const startIdx = Math.max(0, centerIdx - windowSize);
  const endIdx = Math.min(sorted.length, centerIdx + windowSize);
  
  return sorted.slice(startIdx, endIdx);
}

/**
 * 线性拟合（最小二乘法）
 */
function linearFit(data) {
  const n = data.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;

  for (const point of data) {
    sumX += point.x;
    sumY += point.y;
    sumXY += point.x * point.y;
    sumXX += point.x * point.x;
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // 计算R²
  const meanY = sumY / n;
  let ssRes = 0, ssTot = 0;
  
  for (const point of data) {
    const predicted = slope * point.x + intercept;
    ssRes += Math.pow(point.y - predicted, 2);
    ssTot += Math.pow(point.y - meanY, 2);
  }

  const rSquared = 1 - ssRes / ssTot;

  return { slope, intercept, rSquared };
}

/**
 * 拟合质量文字描述
 */
function fitQualityText(quality) {
  const texts = {
    excellent: '优秀',
    good: '良好',
    fair: '一般',
    poor: '较差'
  };
  return texts[quality] || '未知';
}

/**
 * Kubelka-Munk 转换
 * 将漫反射率转换为F(R)函数，用于粉末样品
 * F(R) = (1-R)² / (2R) = K/S
 * 
 * @param {Array} reflectanceData - 反射率数据 [{wavelength(nm), reflectance(0-1)}]
 * @returns {object} 转换后的数据
 */
function kubelkaMunkTransform(reflectanceData) {
  if (!Array.isArray(reflectanceData) || reflectanceData.length === 0) {
    return {
      error: '请提供反射率数据',
      errorCode: 'NO_DATA'
    };
  }

  const transformedData = [];
  
  for (const point of reflectanceData) {
    const wavelength = Number(point.wavelength);
    let reflectance = Number(point.reflectance);
    
    if (!isFinite(wavelength) || !isFinite(reflectance)) continue;
    
    // 如果反射率是百分比(>1)，转换为0-1
    if (reflectance > 1) {
      reflectance = reflectance / 100;
    }
    
    if (reflectance <= 0 || reflectance >= 1) {
      // 避免除零和负值
      continue;
    }
    
    // K-M函数：F(R) = (1-R)² / (2R)
    const fR = Math.pow(1 - reflectance, 2) / (2 * reflectance);
    const energy = wavelengthToEnergy(wavelength);
    
    transformedData.push({
      wavelength,
      energy,
      reflectance,
      fR
    });
  }

  if (transformedData.length === 0) {
    return {
      error: '没有有效的反射率数据',
      errorCode: 'NO_VALID_DATA'
    };
  }

  return {
    transformedData,
    note: 'F(R) ∝ 吸收系数α，可用于Tauc Plot分析',
    usage: '使用 {energy, alpha: fR} 格式输入到 calculateBandgap 函数'
  };
}

/**
 * 吸收系数计算
 * α = -ln(T) / d 或 α = A / d
 * 
 * @param {number} transmittance - 透射率 (0-1) 或 透过率百分比
 * @param {number} thickness - 样品厚度 (cm)
 * @returns {object} 吸收系数
 */
function calculateAbsorptionCoefficient(transmittance, thickness) {
  let T = Number(transmittance);
  const d = Number(thickness);

  if (!isFinite(T) || !isFinite(d)) {
    return {
      error: '透射率和厚度必须为有效数字',
      errorCode: 'INVALID_INPUT'
    };
  }

  if (T > 1) {
    T = T / 100; // 百分比转小数
  }

  if (T <= 0 || T > 1) {
    return {
      error: '透射率应在0-1之间（或0-100%）',
      errorCode: 'INVALID_TRANSMITTANCE'
    };
  }

  if (d <= 0) {
    return {
      error: '厚度必须大于0',
      errorCode: 'INVALID_THICKNESS'
    };
  }

  // α = -ln(T) / d
  const alpha = -Math.log(T) / d;

  return {
    alpha: parseFloat(alpha.toFixed(4)),
    unit: 'cm⁻¹',
    transmittance: T,
    thickness: d,
    formula: 'α = -ln(T) / d'
  };
}

/**
 * 吸收边识别
 * 简单算法：找到吸光度最大变化率的位置
 */
function identifyAbsorptionEdge(spectrumData) {
  if (!Array.isArray(spectrumData) || spectrumData.length < 3) {
    return {
      error: '数据不足，无法识别吸收边',
      errorCode: 'INSUFFICIENT_DATA'
    };
  }

  // 计算一阶导数（近似）
  const derivatives = [];
  for (let i = 1; i < spectrumData.length - 1; i++) {
    const prev = spectrumData[i-1];
    const next = spectrumData[i+1];
    const current = spectrumData[i];
    
    const dx = next.wavelength - prev.wavelength;
    const dy = next.absorbance - prev.absorbance;
    
    if (dx > 0) {
      derivatives.push({
        wavelength: current.wavelength,
        derivative: Math.abs(dy / dx)
      });
    }
  }

  if (derivatives.length === 0) {
    return {
      error: '无法计算导数',
      errorCode: 'CALCULATION_ERROR'
    };
  }

  // 找到最大导数位置
  const maxDerivative = derivatives.reduce((max, current) =>
    current.derivative > max.derivative ? current : max
  );

  const edgeWavelength = maxDerivative.wavelength;
  const edgeEnergy = wavelengthToEnergy(edgeWavelength);

  return {
    wavelength: parseFloat(edgeWavelength.toFixed(1)),
    energy: parseFloat(edgeEnergy.toFixed(3)),
    unit: 'nm / eV',
    note: '吸收边为吸光度变化最快的位置，可作为带隙的粗略估计'
  };
}

/**
 * 获取元数据
 */
function getMetadata() {
  return METADATA;
}

module.exports = {
  calculateBandgap,
  kubelkaMunkTransform,
  calculateAbsorptionCoefficient,
  identifyAbsorptionEdge,
  wavelengthToEnergy,
  energyToWavelength,
  getMetadata
};

