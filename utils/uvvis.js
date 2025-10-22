// UTF-8, no BOM
// Beer–Lambert 定律：A = ε l c

function solveBeerLambert(inputs) {
  // inputs: { A, eps, l, c }
  const A = inputs.A !== undefined && inputs.A !== '' ? Number(inputs.A) : null;
  const eps = inputs.eps !== undefined && inputs.eps !== '' ? Number(inputs.eps) : null; // L·mol⁻¹·cm⁻¹
  const l = inputs.l !== undefined && inputs.l !== '' ? Number(inputs.l) : null;         // cm
  const c = inputs.c !== undefined && inputs.c !== '' ? Number(inputs.c) : null;         // mol·L⁻¹

  const known = [A, eps, l, c].filter(v => v !== null && Number.isFinite(v)).length;
  if (known < 2) return { error: '至少已知其中两项（A、ε、l、c）' };

  // 优先：若 A、ε、l 均已知，则 c
  if (A !== null && eps !== null && l !== null) {
    if (eps === 0 || l === 0) return { error: 'ε 与 l 需为非零' };
    return { c: A / (eps * l) };
  }
  // 若 A、ε、c 已知，则 l
  if (A !== null && eps !== null && c !== null) {
    if (eps === 0 || c === 0) return { error: 'ε 与 c 需为非零' };
    return { l: A / (eps * c) };
  }
  // 若 A、l、c 已知，则 ε
  if (A !== null && l !== null && c !== null) {
    if (l === 0 || c === 0) return { error: 'l 与 c 需为非零' };
    return { eps: A / (l * c) };
  }
  // 若 ε、l、c 已知，则 A
  if (eps !== null && l !== null && c !== null) {
    return { A: eps * l * c };
  }
  // 其它任意两项 → 缺一可先设定默认再解；这里返回提示
  return { error: '请提供可直接求解的两项组合，例如 (A, ε, l) / (A, ε, c) / (A, l, c) / (ε, l, c)' };
}

function batchSolveBeerLambert(rows) {
  // rows: Array<{ label?: string, A?: string|number, eps?: string|number, l?: string|number, c?: string|number }>
  return rows.map((r, idx) => {
    const res = solveBeerLambert(r);
    const label = r.label || `#${idx + 1}`;
    return { label, input: r, result: res };
  });
}

/**
 * 计算吸收边（absorption edge）对应的带隙能量
 * 使用Tauc Plot方法：(αhν)^n = A(hν - Eg)
 * @param {Array} data - 数组 [{wavelength: nm, absorbance: A}]
 * @param {string} type - 'direct' 或 'indirect'，决定 n 的值
 * @returns {object} - { Eg: eV, wavelength: nm, method: string, note: string }
 */
function calculateBandGap(data, type = 'direct') {
  if (!Array.isArray(data) || data.length < 3) {
    return { error: '需要至少3个数据点（波长和吸光度）' };
  }
  
  const n = type === 'direct' ? 2 : 0.5; // 直接带隙 n=2，间接带隙 n=0.5
  
  // 转换数据: wavelength(nm) -> energy(eV), absorbance -> (αhν)^n
  const processedData = data.map(point => {
    const lambda = Number(point.wavelength);
    const A = Number(point.absorbance);
    
    if (!Number.isFinite(lambda) || !Number.isFinite(A) || lambda <= 0) {
      return null;
    }
    
    const E = 1240 / lambda; // eV
    const alpha = A; // 简化假设：α ∝ A（需要知道样品厚度才能精确计算）
    const tauc = Math.pow(alpha * E, n);
    
    return { E, tauc };
  }).filter(d => d !== null && Number.isFinite(d.tauc));
  
  if (processedData.length < 3) {
    return { error: '有效数据点不足，请检查输入' };
  }
  
  // 找到吸收边：在Tauc plot中找到线性区域的截距
  // 简化方法：找到 (αhν)^n 开始快速上升的点
  // 更精确的方法需要线性拟合
  
  // 对数据按能量排序
  processedData.sort((a, b) => a.E - b.E);
  
  // 寻找最大梯度位置（吸收边位置）
  let maxGradient = 0;
  let edgeIndex = 0;
  
  for (let i = 1; i < processedData.length - 1; i++) {
    const dE = processedData[i + 1].E - processedData[i - 1].E;
    const dTauc = processedData[i + 1].tauc - processedData[i - 1].tauc;
    const gradient = Math.abs(dTauc / dE);
    
    if (gradient > maxGradient) {
      maxGradient = gradient;
      edgeIndex = i;
    }
  }
  
  const Eg = processedData[edgeIndex].E;
  const wavelength = 1240 / Eg;
  
  return {
    Eg: Number(Eg.toFixed(2)),
    wavelength: Number(wavelength.toFixed(1)),
    type: type,
    method: 'Tauc Plot（简化）',
    note: `${type === 'direct' ? '直接' : '间接'}带隙估算，基于吸收边位置。精确值需要线性拟合。`,
    warning: '此方法为简化估算，建议使用专业软件（如Origin）进行Tauc plot线性拟合获得更准确结果。',
    dataPoints: processedData.length
  };
}

/**
 * 将吸收光谱波长转换为能量
 * @param {number} wavelength - 波长(nm)
 * @returns {object} - { energy: eV, note: string }
 */
function wavelengthToEnergy(wavelength) {
  const lambda = Number(wavelength);
  
  if (!Number.isFinite(lambda) || lambda <= 0) {
    return { error: '波长必须为正数' };
  }
  
  const energy = 1240 / lambda; // E(eV) = 1240 / λ(nm)
  
  return {
    energy: Number(energy.toFixed(3)),
    wavelength: lambda,
    unit: 'eV',
    formula: 'E(eV) = 1240 / λ(nm)',
    note: '基于 E = hc/λ 公式'
  };
}

/**
 * 能量转换为波长
 * @param {number} energy - 能量(eV)
 * @returns {object} - { wavelength: nm, note: string }
 */
function energyToWavelength(energy) {
  const E = Number(energy);
  
  if (!Number.isFinite(E) || E <= 0) {
    return { error: '能量必须为正数' };
  }
  
  const wavelength = 1240 / E; // λ(nm) = 1240 / E(eV)
  
  return {
    wavelength: Number(wavelength.toFixed(1)),
    energy: E,
    unit: 'nm',
    formula: 'λ(nm) = 1240 / E(eV)',
    note: '基于 λ = hc/E 公式'
  };
}

/**
 * 判断光的颜色区域
 * @param {number} wavelength - 波长(nm)
 * @returns {object} - { region: string, color: string, note: string }
 */
function getSpectralRegion(wavelength) {
  const lambda = Number(wavelength);
  
  if (!Number.isFinite(lambda) || lambda <= 0) {
    return { error: '波长必须为正数' };
  }
  
  let region, color, energy;
  
  if (lambda < 200) {
    region = '远紫外（Far UV）';
    color = '不可见';
  } else if (lambda < 280) {
    region = '中紫外（UV-C）';
    color = '不可见';
  } else if (lambda < 315) {
    region = '中紫外（UV-B）';
    color = '不可见';
  } else if (lambda < 400) {
    region = '近紫外（UV-A）';
    color = '不可见';
  } else if (lambda < 450) {
    region = '可见光';
    color = '紫/蓝';
  } else if (lambda < 495) {
    region = '可见光';
    color = '蓝';
  } else if (lambda < 570) {
    region = '可见光';
    color = '绿';
  } else if (lambda < 590) {
    region = '可见光';
    color = '黄';
  } else if (lambda < 620) {
    region = '可见光';
    color = '橙';
  } else if (lambda < 750) {
    region = '可见光';
    color = '红';
  } else if (lambda < 2500) {
    region = '近红外（NIR）';
    color = '不可见';
  } else if (lambda < 25000) {
    region = '中红外（MIR）';
    color = '不可见';
  } else {
    region = '远红外（FIR）';
    color = '不可见';
  }
  
  energy = (1240 / lambda).toFixed(2);
  
  return {
    wavelength: lambda,
    region: region,
    color: color,
    energy: Number(energy),
    unit: { wavelength: 'nm', energy: 'eV' },
    visible: lambda >= 380 && lambda <= 750
  };
}

/**
 * Kubelka-Munk 函数计算（用于漫反射光谱）
 * F(R) = (1-R)² / (2R)
 * @param {number} reflectance - 反射率 R (0-1 或 0-100%)
 * @returns {object} - { F_R: number, note: string }
 */
function kubelkaMunk(reflectance) {
  let R = Number(reflectance);
  
  if (!Number.isFinite(R)) {
    return { error: '反射率必须为有效数字' };
  }
  
  // 如果输入是百分比，转换为小数
  if (R > 1) {
    R = R / 100;
  }
  
  if (R <= 0 || R >= 1) {
    return { error: '反射率必须在 0 到 1 之间（或 0% 到 100%）' };
  }
  
  const F_R = Math.pow(1 - R, 2) / (2 * R);
  
  return {
    F_R: Number(F_R.toFixed(4)),
    reflectance: R,
    formula: 'F(R) = (1-R)² / (2R)',
    note: 'Kubelka-Munk函数，用于漫反射光谱分析。F(R) ∝ α/s（吸收系数/散射系数）',
    application: '粉末样品的带隙计算：plot [F(R)×hν]^n vs hν'
  };
}

/**
 * 多峰高斯拟合
 * 用于解析重叠的吸收峰
 * @param {Array} data - 光谱数据 [{wavelength, absorbance}]
 * @param {number} numPeaks - 预期峰数量
 * @returns {object} 拟合结果
 */
function gaussianPeakFitting(data, numPeaks = 2) {
  if (!Array.isArray(data) || data.length < 10) {
    return {
      error: '需要至少10个数据点进行峰拟合',
      errorCode: 'INSUFFICIENT_DATA'
    };
  }

  if (numPeaks < 1 || numPeaks > 5) {
    return {
      error: '峰数量应在1-5之间',
      errorCode: 'INVALID_PEAK_NUMBER'
    };
  }

  // 高斯函数: y = A * exp(-(x-μ)²/(2σ²))
  // 其中 A为峰高，μ为峰位，σ为峰宽
  
  // 简化方法：找到主要峰位置
  const sortedData = [...data]
    .filter(d => Number.isFinite(d.wavelength) && Number.isFinite(d.absorbance))
    .sort((a, b) => a.wavelength - b.wavelength);

  if (sortedData.length < 10) {
    return {
      error: '有效数据点不足',
      errorCode: 'INSUFFICIENT_VALID_DATA'
    };
  }

  // 寻找峰位（局部最大值）
  const peaks = [];
  for (let i = 1; i < sortedData.length - 1; i++) {
    if (sortedData[i].absorbance > sortedData[i-1].absorbance &&
        sortedData[i].absorbance > sortedData[i+1].absorbance) {
      peaks.push({
        wavelength: sortedData[i].wavelength,
        absorbance: sortedData[i].absorbance,
        index: i
      });
    }
  }

  // 按强度排序，取前numPeaks个
  peaks.sort((a, b) => b.absorbance - a.absorbance);
  const selectedPeaks = peaks.slice(0, Math.min(numPeaks, peaks.length));

  // 估算峰参数
  const peakParams = selectedPeaks.map((peak, idx) => {
    // 估算半峰宽（FWHM）
    const halfMax = peak.absorbance / 2;
    let leftWidth = 0, rightWidth = 0;
    
    for (let i = peak.index - 1; i >= 0; i--) {
      if (sortedData[i].absorbance <= halfMax) {
        leftWidth = peak.wavelength - sortedData[i].wavelength;
        break;
      }
    }
    
    for (let i = peak.index + 1; i < sortedData.length; i++) {
      if (sortedData[i].absorbance <= halfMax) {
        rightWidth = sortedData[i].wavelength - peak.wavelength;
        break;
      }
    }
    
    const fwhm = leftWidth + rightWidth || 50; // 默认50nm
    const sigma = fwhm / 2.355; // FWHM = 2.355σ

    return {
      peakNumber: idx + 1,
      wavelength: peak.wavelength.toFixed(1),
      wavelengthUnit: 'nm',
      energy: (1240 / peak.wavelength).toFixed(2),
      energyUnit: 'eV',
      intensity: peak.absorbance.toFixed(3),
      fwhm: fwhm.toFixed(1),
      fwhmUnit: 'nm',
      sigma: sigma.toFixed(1),
      peakArea: (peak.absorbance * fwhm * Math.sqrt(2 * Math.PI) / 2.355).toFixed(2)
    };
  });

  return {
    numPeaks: selectedPeaks.length,
    peakParams,
    method: '高斯峰拟合（简化版）',
    gaussianFunction: 'y = A × exp(-(x-μ)²/(2σ²))',
    notes: [
      'FWHM (半峰宽) = 2.355σ',
      '峰面积 = A × σ × √(2π)',
      '此为初步估算，精确拟合需使用专业软件',
      '建议软件：Origin, MATLAB, Python (scipy.optimize)'
    ],
    recommendations: [
      '检查峰是否对称',
      '非对称峰可能需要Lorentz函数或Voigt函数',
      '重叠严重的峰拟合需要优化算法',
      '拟合质量通过R²值评估（应>0.95）'
    ]
  };
}

/**
 * 洛伦兹峰拟合
 * 适用于非对称峰或光致发光谱
 * @param {Array} data - 光谱数据
 * @param {number} numPeaks - 峰数量
 * @returns {object} 拟合结果
 */
function lorentzianPeakFitting(data, numPeaks = 2) {
  // Lorentz函数: y = A / (1 + ((x-x0)/γ)²)
  // 其中 A为峰高，x0为峰位，γ为半峰宽
  
  const gaussianResult = gaussianPeakFitting(data, numPeaks);
  
  if (gaussianResult.error) {
    return gaussianResult;
  }

  // 转换为Lorentz参数
  const lorentzPeaks = gaussianResult.peakParams.map(peak => ({
    ...peak,
    gamma: (parseFloat(peak.fwhm) / 2).toFixed(1), // Lorentz的γ = FWHM/2
    peakArea: (Math.PI * parseFloat(peak.intensity) * parseFloat(peak.fwhm) / 2).toFixed(2)
  }));

  return {
    numPeaks: lorentzPeaks.length,
    peakParams: lorentzPeaks,
    method: 'Lorentz峰拟合（简化版）',
    lorentzianFunction: 'y = A / (1 + ((x-x₀)/γ)²)',
    comparison: {
      gaussian: '适用于对称峰、分子振动谱',
      lorentzian: '适用于非均匀展宽、光致发光谱',
      voigt: '两者的卷积，更真实但计算复杂'
    },
    notes: [
      'Lorentz峰有较长的拖尾',
      'γ (半峰宽) = FWHM/2',
      '峰面积 = πAγ',
      '非均匀展宽系统（如溶液中的荧光）倾向Lorentz峰形'
    ]
  };
}

/**
 * 激子峰识别
 * 自动识别激子吸收峰并计算激子结合能
 * @param {Array} data - 吸收光谱数据
 * @param {number} bandgap - 带隙能量(eV)
 * @returns {object} 激子分析结果
 */
function identifyExcitonPeaks(data, bandgap) {
  if (!Array.isArray(data) || data.length < 10) {
    return {
      error: '需要至少10个数据点',
      errorCode: 'INSUFFICIENT_DATA'
    };
  }

  const Eg = Number(bandgap);
  if (!Number.isFinite(Eg) || Eg <= 0) {
    return {
      error: '请输入有效的带隙值',
      errorCode: 'INVALID_BANDGAP'
    };
  }

  // 寻找位于带隙能量附近的吸收峰
  const sortedData = [...data]
    .filter(d => Number.isFinite(d.wavelength) && Number.isFinite(d.absorbance))
    .map(d => ({
      ...d,
      energy: 1240 / d.wavelength
    }))
    .sort((a, b) => a.energy - b.energy);

  // 寻找带边附近的峰（E < Eg）
  const excitonCandidates = [];
  for (let i = 1; i < sortedData.length - 1; i++) {
    const point = sortedData[i];
    
    // 激子峰应出现在带隙以下
    if (point.energy < Eg && point.energy > Eg - 1.0) { // 搜索范围：Eg-1eV到Eg
      // 检查是否为局部最大值
      if (point.absorbance > sortedData[i-1].absorbance &&
          point.absorbance > sortedData[i+1].absorbance) {
        
        const bindingEnergy = Eg - point.energy;
        
        excitonCandidates.push({
          energy: point.energy.toFixed(3),
          energyUnit: 'eV',
          wavelength: point.wavelength.toFixed(1),
          wavelengthUnit: 'nm',
          intensity: point.absorbance.toFixed(3),
          bindingEnergy: bindingEnergy.toFixed(3),
          bindingEnergyUnit: 'eV',
          bindingEnergyMeV: (bindingEnergy * 1000).toFixed(1),
          bindingEnergyMeVUnit: 'meV'
        });
      }
    }
  }

  if (excitonCandidates.length === 0) {
    return {
      excitonDetected: false,
      message: '未检测到明显的激子峰',
      suggestion: '可能原因：1) 激子结合能太小 2) 峰被掩盖 3) 温度过高导致激子解离',
      bandgap: Eg,
      searchRange: `${(Eg-1).toFixed(2)} - ${Eg.toFixed(2)} eV`
    };
  }

  // 按强度排序
  excitonCandidates.sort((a, b) => b.intensity - a.intensity);

  // 分析激子类型
  const mainExciton = excitonCandidates[0];
  const Eb = parseFloat(mainExciton.bindingEnergy);
  
  let excitonType = '';
  let materialType = '';
  
  if (Eb < 0.01) {
    excitonType = '弱束缚激子（Mott-Wannier型）';
    materialType = '半导体（如GaAs, CdS）';
  } else if (Eb < 0.1) {
    excitonType = '中等束缚激子';
    materialType = '典型半导体';
  } else if (Eb < 0.5) {
    excitonType = '强束缚激子';
    materialType = '宽带隙半导体或2D材料';
  } else {
    excitonType = '极强束缚激子（Frenkel型）';
    materialType = '有机半导体或分子晶体';
  }

  return {
    excitonDetected: true,
    numExcitons: excitonCandidates.length,
    excitons: excitonCandidates,
    mainExciton: {
      ...mainExciton,
      type: excitonType,
      possibleMaterial: materialType
    },
    bandgap: Eg.toFixed(3),
    bandgapUnit: 'eV',
    analysis: {
      excitonBindingEnergy: mainExciton.bindingEnergy,
      excitonRadius: `激子半径 a₀* ≈ ${(0.529 * 13.6 / Eb).toFixed(2)} nm （简化估算）`,
      excitonType: excitonType
    },
    interpretation: {
      weakBinding: 'Eb < 0.01 eV: Mott-Wannier激子，半径大，常见于窄带隙半导体',
      moderateBinding: '0.01 < Eb < 0.5 eV: 中等束缚，大多数半导体',
      strongBinding: 'Eb > 0.5 eV: Frenkel激子，半径小，常见于有机材料和2D材料'
    },
    notes: [
      '激子峰通常出现在吸收边以下',
      '温度升高会降低激子峰强度',
      '2D材料（如MoS₂）有明显的激子峰',
      '激子结合能可通过变温光谱精确测定'
    ],
    references: [
      'Elliott, R.J., Phys. Rev. 108, 1384 (1957)',
      'Klingshirn, C.F., Semiconductor Optics (2012)'
    ]
  };
}

/**
 * Urbach能计算
 * 用于评估材料的无序度和缺陷态密度
 * @param {Array} data - 吸收光谱数据
 * @param {number} bandgap - 带隙能量(eV)，可选
 * @returns {object} Urbach能分析结果
 */
function calculateUrbachEnergy(data, bandgap = null) {
  if (!Array.isArray(data) || data.length < 10) {
    return {
      error: '需要至少10个数据点',
      errorCode: 'INSUFFICIENT_DATA'
    };
  }

  // Urbach规则: α(E) = α₀ × exp((E - E₀)/Eu)
  // 其中 Eu 为Urbach能，反映无序度
  // ln(α) vs E 在吸收边以下应为线性关系

  const sortedData = [...data]
    .filter(d => Number.isFinite(d.wavelength) && Number.isFinite(d.absorbance) && d.absorbance > 0)
    .map(d => ({
      energy: 1240 / d.wavelength,
      lnAlpha: Math.log(d.absorbance) // 简化：假设 α ∝ A
    }))
    .sort((a, b) => a.energy - b.energy);

  if (sortedData.length < 10) {
    return {
      error: '有效数据点不足',
      errorCode: 'INSUFFICIENT_VALID_DATA'
    };
  }

  // 选择吸收边以下的数据进行拟合
  // 通常选择低能量段（吸收较弱的区域）
  let fitData = sortedData;
  
  if (bandgap && Number.isFinite(bandgap)) {
    // 选择 Eg-0.5eV 到 Eg 之间的数据
    fitData = sortedData.filter(d => d.energy < bandgap && d.energy > bandgap - 0.5);
  } else {
    // 选择吸收较弱的前1/3数据
    fitData = sortedData.slice(0, Math.floor(sortedData.length / 3));
  }

  if (fitData.length < 5) {
    return {
      error: '拟合区域数据点不足',
      errorCode: 'INSUFFICIENT_FIT_DATA',
      suggestion: '请提供更多低能量（吸收边以下）的数据点'
    };
  }

  // 线性拟合: ln(α) vs E
  const n = fitData.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;

  for (const point of fitData) {
    sumX += point.energy;
    sumY += point.lnAlpha;
    sumXY += point.energy * point.lnAlpha;
    sumXX += point.energy * point.energy;
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Urbach能 Eu = 1/slope
  const urbachEnergy = 1 / slope;

  // 计算R²
  const meanY = sumY / n;
  let ssRes = 0, ssTot = 0;
  for (const point of fitData) {
    const predicted = slope * point.energy + intercept;
    ssRes += Math.pow(point.lnAlpha - predicted, 2);
    ssTot += Math.pow(point.lnAlpha - meanY, 2);
  }
  const rSquared = 1 - ssRes / ssTot;

  // 评估材料质量
  let qualityAssessment = '';
  let disorderLevel = '';
  
  if (urbachEnergy < 0.05) {
    qualityAssessment = '优异（高晶体质量）';
    disorderLevel = '极低无序度';
  } else if (urbachEnergy < 0.1) {
    qualityAssessment = '良好';
    disorderLevel = '低无序度';
  } else if (urbachEnergy < 0.2) {
    qualityAssessment = '一般';
    disorderLevel = '中等无序度';
  } else {
    qualityAssessment = '较差（高无序度或非晶）';
    disorderLevel = '高无序度';
  }

  return {
    urbachEnergy: Math.abs(urbachEnergy).toFixed(3),
    urbachEnergyUnit: 'eV',
    urbachEnergyMeV: (Math.abs(urbachEnergy) * 1000).toFixed(1),
    urbachEnergyMeVUnit: 'meV',
    qualityAssessment,
    disorderLevel,
    fitQuality: rSquared.toFixed(4),
    fitQualityGrade: rSquared > 0.95 ? '优秀' : rSquared > 0.9 ? '良好' : '一般',
    dataPoints: n,
    fitRange: `${fitData[0].energy.toFixed(2)} - ${fitData[fitData.length-1].energy.toFixed(2)} eV`,
    method: 'Urbach规则拟合',
    urbachRule: 'α(E) = α₀ × exp((E - E₀)/Eu)',
    linearFit: `ln(α) vs E，斜率 = 1/Eu`,
    interpretation: {
      physical: 'Urbach能反映带尾态密度和材料无序度',
      lowEu: 'Eu小：晶体质量高，缺陷少',
      highEu: 'Eu大：无序度高，可能含有大量缺陷',
      typical: {
        crystallineSi: '~50 meV',
        amorphousSi: '~150 meV',
        organicSemiconductors: '50-100 meV',
        perovskites: '15-50 meV'
      }
    },
    notes: [
      'Urbach能越小，材料晶体质量越好',
      '温度升高会增大Urbach能',
      '缺陷和无序会显著增大Urbach能',
      '建议在低温下测量以获得本征Urbach能',
      '拟合质量R²应>0.95'
    ],
    applications: [
      '评估薄膜晶体质量',
      '比较不同制备条件的样品',
      '研究退火等后处理效果',
      '材料无序度定量表征'
    ],
    references: [
      'Urbach, F., Phys. Rev. 92, 1324 (1953)',
      'Cody, G.D., Semiconductors and Semimetals 21B (1984)'
    ]
  };
}

module.exports = {
  solveBeerLambert,
  batchSolveBeerLambert,
  calculateBandGap,
  wavelengthToEnergy,
  energyToWavelength,
  getSpectralRegion,
  kubelkaMunk,
  gaussianPeakFitting,
  lorentzianPeakFitting,
  identifyExcitonPeaks,
  calculateUrbachEnergy
};
