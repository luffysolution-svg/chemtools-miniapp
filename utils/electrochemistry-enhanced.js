// UTF-8, no BOM
// 电化学性能增强工具：比容量、库伦效率、循环稳定性

const METADATA = {
  version: '1.0.0',
  lastUpdated: '2025-10-18',
  sources: {
    specificCapacity: 'Electrochemical Methods: Fundamentals and Applications',
    coulombicEfficiency: 'Battery testing standards',
    faraday: 'F = 96485 C/mol'
  }
};

// 法拉第常数
const FARADAY_CONSTANT = 96485; // C/mol

/**
 * 比容量计算
 * @param {number} capacity - 容量(mAh)
 * @param {number} mass - 活性物质质量(mg)
 * @param {number} activeMaterialRatio - 活性物质占比(%)，默认100
 * @returns {object} 比容量(mAh/g)
 */
function calculateSpecificCapacity(capacity, mass, activeMaterialRatio = 100) {
  const Q = Number(capacity);
  const m = Number(mass);
  const ratio = Number(activeMaterialRatio) / 100;

  if (!isFinite(Q) || !isFinite(m) || !isFinite(ratio)) {
    return {
      error: '请输入有效的数值',
      errorCode: 'INVALID_INPUT'
    };
  }

  if (Q < 0 || m <= 0 || ratio <= 0 || ratio > 1) {
    return {
      error: '容量、质量和占比必须为正数，占比不超过100%',
      errorCode: 'INVALID_RANGE'
    };
  }

  // 比容量(mAh/g) = 容量(mAh) / (质量(mg) / 1000) / 活性物质占比
  const specificCapacity = Q / (m / 1000) / ratio;

  return {
    specificCapacity: parseFloat(specificCapacity.toFixed(2)),
    unit: 'mAh/g',
    gravimetric: parseFloat(specificCapacity.toFixed(2)),
    capacity: Q,
    mass: m,
    ratio: (ratio * 100).toFixed(1),
    formula: `Q_sp = Q / (m × ratio) = ${Q} / (${m/1000} × ${ratio}) = ${specificCapacity.toFixed(2)} mAh/g`
  };
}

/**
 * 体积比容量计算
 * @param {number} specificCapacity - 重量比容量(mAh/g)
 * @param {number} density - 材料密度(g/cm³)
 * @returns {object} 体积比容量(mAh/cm³)
 */
function calculateVolumetricCapacity(specificCapacity, density) {
  const Qsp = Number(specificCapacity);
  const rho = Number(density);

  if (!isFinite(Qsp) || !isFinite(rho)) {
    return { error: '请输入有效的数值', errorCode: 'INVALID_INPUT' };
  }

  if (Qsp <= 0 || rho <= 0) {
    return { error: '比容量和密度必须为正数', errorCode: 'INVALID_RANGE' };
  }

  // 体积比容量 = 重量比容量 × 密度
  const volumetricCapacity = Qsp * rho;

  return {
    volumetricCapacity: parseFloat(volumetricCapacity.toFixed(2)),
    unit: 'mAh/cm³',
    specificCapacity: Qsp,
    density: rho,
    formula: `Q_vol = Q_sp × ρ = ${Qsp} × ${rho} = ${volumetricCapacity.toFixed(2)} mAh/cm³`
  };
}

/**
 * 库伦效率计算
 * @param {number} chargeCapacity - 充电容量(mAh)
 * @param {number} dischargeCapacity - 放电容量(mAh)
 * @param {number} cycle - 循环次数（可选）
 * @returns {object} 库伦效率(%)
 */
function calculateCoulombicEfficiency(chargeCapacity, dischargeCapacity, cycle = null) {
  const Qc = Number(chargeCapacity);
  const Qd = Number(dischargeCapacity);

  if (!isFinite(Qc) || !isFinite(Qd)) {
    return { error: '请输入有效的容量值', errorCode: 'INVALID_INPUT' };
  }

  if (Qc <= 0 || Qd < 0) {
    return { error: '容量必须为正数', errorCode: 'INVALID_RANGE' };
  }

  // 库伦效率 = 放电容量 / 充电容量 × 100%
  const efficiency = (Qd / Qc) * 100;

  let qualityNote = '';
  let type = cycle === 1 || cycle === '1' ? '首次' : '循环';

  if (efficiency > 100) {
    qualityNote = '⚠️ 效率>100%，请检查测试数据';
  } else if (efficiency > 99) {
    qualityNote = `✓ ${type}库伦效率优秀`;
  } else if (efficiency > 95) {
    qualityNote = `✓ ${type}库伦效率良好`;
  } else if (efficiency > 90) {
    qualityNote = `○ ${type}库伦效率一般`;
  } else {
    qualityNote = `⚠️ ${type}库伦效率较低，存在较大不可逆容量损失`;
  }

  // 不可逆容量损失
  const irreversibleLoss = Qc - Qd;
  const lossPercentage = (irreversibleLoss / Qc) * 100;

  return {
    coulombicEfficiency: parseFloat(efficiency.toFixed(2)),
    unit: '%',
    chargeCapacity: Qc,
    dischargeCapacity: Qd,
    irreversibleLoss: parseFloat(irreversibleLoss.toFixed(2)),
    lossPercentage: parseFloat(lossPercentage.toFixed(2)),
    type,
    qualityNote,
    formula: `CE = Q_dis / Q_ch × 100% = ${Qd} / ${Qc} × 100% = ${efficiency.toFixed(2)}%`
  };
}

/**
 * 容量保持率计算
 * @param {Array} capacities - 容量数组 [{cycle, capacity}]
 * @returns {object} 容量保持率分析
 */
function calculateCapacityRetention(capacities) {
  if (!Array.isArray(capacities) || capacities.length < 2) {
    return {
      error: '至少需要2个循环数据点',
      errorCode: 'INSUFFICIENT_DATA'
    };
  }

  // 按循环数排序
  const sorted = capacities
    .filter(c => isFinite(c.cycle) && isFinite(c.capacity))
    .sort((a, b) => a.cycle - b.cycle);

  if (sorted.length < 2) {
    return { error: '有效数据点不足', errorCode: 'INSUFFICIENT_VALID_DATA' };
  }

  const initialCapacity = sorted[0].capacity;
  const finalCapacity = sorted[sorted.length - 1].capacity;
  const totalCycles = sorted[sorted.length - 1].cycle - sorted[0].cycle;

  // 容量保持率
  const retention = (finalCapacity / initialCapacity) * 100;

  // 容量衰减率（每循环）
  const decayRate = ((initialCapacity - finalCapacity) / totalCycles / initialCapacity) * 100;

  // 计算每个点的保持率
  const retentionData = sorted.map(point => ({
    cycle: point.cycle,
    capacity: point.capacity.toFixed(2),
    retention: ((point.capacity / initialCapacity) * 100).toFixed(2)
  }));

  // 评估稳定性
  let stabilityNote = '';
  if (retention > 95) {
    stabilityNote = '✓ 循环稳定性优秀';
  } else if (retention > 80) {
    stabilityNote = '✓ 循环稳定性良好';
  } else if (retention > 60) {
    stabilityNote = '○ 循环稳定性一般';
  } else {
    stabilityNote = '⚠️ 循环稳定性较差';
  }

  return {
    initialCapacity: initialCapacity.toFixed(2),
    finalCapacity: finalCapacity.toFixed(2),
    retention: parseFloat(retention.toFixed(2)),
    unit: '%',
    totalCycles,
    decayRate: parseFloat(decayRate.toFixed(4)),
    decayRateUnit: '%/cycle',
    retentionData,
    stabilityNote
  };
}

/**
 * 倍率性能计算
 * @param {Array} rateData - 倍率数据 [{rate(C), capacity}]
 * @returns {object} 倍率性能分析
 */
function calculateRatePerformance(rateData) {
  if (!Array.isArray(rateData) || rateData.length < 2) {
    return {
      error: '至少需要2个倍率数据点',
      errorCode: 'INSUFFICIENT_DATA'
    };
  }

  const sorted = rateData
    .filter(d => isFinite(d.rate) && isFinite(d.capacity))
    .sort((a, b) => a.rate - b.rate);

  if (sorted.length < 2) {
    return { error: '有效数据点不足', errorCode: 'INSUFFICIENT_VALID_DATA' };
  }

  const baseCapacity = sorted[0].capacity; // 最低倍率的容量作为基准

  // 计算每个倍率的保持率
  const performanceData = sorted.map(point => ({
    rate: point.rate,
    rateText: `${point.rate}C`,
    capacity: point.capacity.toFixed(2),
    retention: ((point.capacity / baseCapacity) * 100).toFixed(2)
  }));

  // 高倍率性能评估（以最高倍率为准）
  const highestRate = sorted[sorted.length - 1];
  const highRateRetention = (highestRate.capacity / baseCapacity) * 100;

  let ratePerformanceNote = '';
  if (highRateRetention > 80) {
    ratePerformanceNote = '✓ 倍率性能优秀';
  } else if (highRateRetention > 60) {
    ratePerformanceNote = '✓ 倍率性能良好';
  } else if (highRateRetention > 40) {
    ratePerformanceNote = '○ 倍率性能一般';
  } else {
    ratePerformanceNote = '⚠️ 倍率性能较差';
  }

  return {
    baseCapacity: baseCapacity.toFixed(2),
    baseRate: `${sorted[0].rate}C`,
    highestRate: `${highestRate.rate}C`,
    highRateCapacity: highestRate.capacity.toFixed(2),
    highRateRetention: parseFloat(highRateRetention.toFixed(2)),
    performanceData,
    ratePerformanceNote
  };
}

/**
 * 理论比容量计算（基于法拉第定律）
 * @param {number} molWeight - 活性物质分子量(g/mol)
 * @param {number} electronTransfer - 电子转移数(n)
 * @returns {object} 理论比容量(mAh/g)
 */
function calculateTheoreticalCapacity(molWeight, electronTransfer) {
  const M = Number(molWeight);
  const n = Number(electronTransfer);

  if (!isFinite(M) || !isFinite(n)) {
    return { error: '请输入有效的数值', errorCode: 'INVALID_INPUT' };
  }

  if (M <= 0 || n <= 0) {
    return { error: '分子量和电子转移数必须为正数', errorCode: 'INVALID_RANGE' };
  }

  // 理论比容量 = n × F / (M × 3.6)
  // F = 96485 C/mol, 1 mAh = 3.6 C
  const theoreticalCapacity = (n * FARADAY_CONSTANT) / (M * 3.6);

  return {
    theoreticalCapacity: parseFloat(theoreticalCapacity.toFixed(2)),
    unit: 'mAh/g',
    molWeight: M,
    electronTransfer: n,
    formula: `Q_th = n×F / (M×3.6) = ${n}×96485 / (${M}×3.6) = ${theoreticalCapacity.toFixed(2)} mAh/g`,
    note: '实际容量通常低于理论值，取决于材料利用率'
  };
}

/**
 * CV曲线峰电流分析（Randles-Sevcik方程）
 * 分析循环伏安曲线的峰电流，判断反应类型
 * 
 * @param {object} cvData - CV数据 {
 *   peakCurrent: 峰电流(A),
 *   scanRate: 扫速(V/s),
 *   area: 电极面积(cm²),
 *   concentration: 活性物质浓度(mol/cm³，可选)
 * }
 * @returns {object} CV分析结果
 */
function analyzeCVPeakCurrent(cvData) {
  const { peakCurrent, scanRate, area, concentration } = cvData;
  
  const ip = Number(peakCurrent);
  const v = Number(scanRate);
  const A = Number(area);
  
  if (!isFinite(ip) || !isFinite(v) || !isFinite(A)) {
    return {
      error: '请输入峰电流、扫速和电极面积',
      errorCode: 'INVALID_INPUT'
    };
  }

  if (v <= 0 || A <= 0) {
    return {
      error: '扫速和电极面积必须为正数',
      errorCode: 'INVALID_RANGE'
    };
  }

  // Randles-Sevcik方程：ip = 2.69×10⁵ × n^(3/2) × A × D^(1/2) × C × v^(1/2)
  // 简化分析：检查ip与v^(1/2)的关系判断扩散控制
  
  const ipNormalized = ip / A; // 电流密度

  // 扩散系数估算（假设n=1，C已知）
  let diffusionCoefficient = null;
  if (concentration && isFinite(concentration)) {
    const C = Number(concentration);
    if (C > 0) {
      // D = (ip / (2.69×10⁵ × n^(3/2) × A × C × v^(1/2)))²
      // 简化：假设n=1
      const D = Math.pow(ip / (269000 * A * C * Math.sqrt(v)), 2);
      diffusionCoefficient = D.toExponential(2);
    }
  }

  return {
    peakCurrent: ip,
    peakCurrentUnit: 'A',
    currentDensity: (ipNormalized * 1000).toFixed(3), // mA/cm²
    currentDensityUnit: 'mA/cm²',
    scanRate: v,
    scanRateUnit: 'V/s',
    area: A,
    areaUnit: 'cm²',
    diffusionCoefficient,
    diffusionCoefficientUnit: 'cm²/s',
    analysis: {
      method: 'Randles-Sevcik方程分析',
      equation: 'ip = 2.69×10⁵ × n^(3/2) × A × D^(1/2) × C × v^(1/2)',
      diffusionControl: '峰电流与v^(1/2)成正比表示扩散控制',
      surfaceControl: '峰电流与v成正比表示表面吸附控制'
    },
    recommendations: [
      '进行多扫速CV测试，绘制ip vs v^(1/2)图',
      '线性关系表明扩散控制反应',
      '峰电位差ΔEp接近59/n mV表示可逆反应',
      '不可逆反应的ΔEp较大'
    ],
    references: [
      'Randles, J.E.B., Trans. Faraday Soc. 44, 327 (1948)',
      'Bard, A.J., Electrochemical Methods, 3rd Ed. (2022)'
    ]
  };
}

/**
 * EIS等效电路参数拟合（简化版）
 * 提供常见等效电路模型
 * 
 * @param {string} circuitType - 电路类型
 * @param {object} eisData - EIS实验数据 {Rs, Rct, W, CPE_Q, CPE_n}
 * @returns {object} 拟合结果和电路解释
 */
function fitEISCircuit(circuitType, eisData) {
  const supportedCircuits = ['Randles', 'RC', 'RQ', 'RW'];
  
  if (!supportedCircuits.includes(circuitType)) {
    return {
      error: `不支持的电路类型：${circuitType}`,
      errorCode: 'UNSUPPORTED_CIRCUIT',
      supported: supportedCircuits
    };
  }

  const circuits = {
    'Randles': {
      name: 'Randles电路',
      formula: 'Rs + Rct/(1+jωRctCdl) + W',
      components: {
        Rs: { name: '溶液电阻', unit: 'Ω' },
        Rct: { name: '电荷转移电阻', unit: 'Ω' },
        Cdl: { name: '双电层电容', unit: 'F' },
        W: { name: 'Warburg阻抗', unit: 'Ω·s^(-1/2)' }
      },
      description: '最常见的电化学阻抗模型，适用于扩散控制的电极反应',
      features: [
        '高频半圆：电荷转移过程',
        '低频直线：扩散过程（45°）',
        'Rs从实轴截距读取',
        'Rct从半圆直径读取'
      ]
    },
    'RC': {
      name: '简单RC电路',
      formula: 'Rs + Rct/(1+jωRctC)',
      components: {
        Rs: { name: '串联电阻', unit: 'Ω' },
        Rct: { name: '电荷转移电阻', unit: 'Ω' },
        C: { name: '电容', unit: 'F' }
      },
      description: '最简单的电化学系统模型',
      features: [
        '单一半圆',
        '无扩散过程',
        '适用于快速电极反应'
      ]
    },
    'RQ': {
      name: 'R-CPE电路',
      formula: 'Rs + Rct/(1+(jω)^n × Rct × Q)',
      components: {
        Rs: { name: '溶液电阻', unit: 'Ω' },
        Rct: { name: '电荷转移电阻', unit: 'Ω' },
        Q: { name: 'CPE参数', unit: 'F·s^(n-1)' },
        n: { name: 'CPE指数', unit: '无量纲(0-1)' }
      },
      description: '使用常相位元件(CPE)代替电容，适用于粗糙或非理想电极',
      features: [
        '压缩半圆（n<1）',
        'n=1时退化为理想电容',
        'n接近0.5表示Warburg行为',
        '考虑表面不均匀性'
      ]
    },
    'RW': {
      name: 'R-W电路',
      formula: 'Rs + W',
      components: {
        Rs: { name: '溶液电阻', unit: 'Ω' },
        W: { name: 'Warburg阻抗', unit: 'Ω·s^(-1/2)' }
      },
      description: '纯扩散控制系统',
      features: [
        '45°直线（Nyquist图）',
        '无明显电荷转移阻抗',
        '扩散过程主导'
      ]
    }
  };

  const circuit = circuits[circuitType];
  
  // 解析输入参数
  const params = {};
  for (const [key, value] of Object.entries(eisData || {})) {
    if (isFinite(value)) {
      params[key] = Number(value);
    }
  }

  return {
    circuitType,
    circuitName: circuit.name,
    formula: circuit.formula,
    components: circuit.components,
    description: circuit.description,
    features: circuit.features,
    parameters: params,
    interpretation: {
      Rs: 'Rs越小，电解液离子电导率越好',
      Rct: 'Rct越小，电荷转移速率越快',
      Cdl: 'Cdl与电极有效面积成正比',
      W: 'Warburg系数与扩散速率相关'
    },
    fittingSoftware: [
      'ZView (Scribner Associates)',
      'EC-Lab (Bio-Logic)',
      'Nova (Metrohm)',
      'Zman (AMETEK)'
    ],
    notes: [
      'EIS数据拟合需要专业软件完成',
      '本工具提供电路模型和参数解释',
      '拟合前需进行Kramers-Kronig变换检验数据有效性',
      '不同频率范围对应不同的电化学过程'
    ],
    references: [
      'Macdonald, J.R., Impedance Spectroscopy (2018)',
      'Orazem & Tribollet, Electrochemical Impedance Spectroscopy (2017)'
    ]
  };
}

/**
 * Tafel斜率自动计算
 * 从极化曲线数据中自动识别线性区并计算Tafel斜率
 * 
 * @param {Array} polarizationData - 极化数据 [{overpotential(V), currentDensity(A/cm²)}]
 * @param {string} region - 分析区域 'anodic' | 'cathodic' | 'both'
 * @returns {object} Tafel分析结果
 */
function calculateTafelSlope(polarizationData, region = 'both') {
  if (!Array.isArray(polarizationData) || polarizationData.length < 5) {
    return {
      error: '至少需要5个数据点进行Tafel分析',
      errorCode: 'INSUFFICIENT_DATA'
    };
  }

  // 过滤有效数据点（电流密度>0）
  const validData = polarizationData.filter(d => 
    isFinite(d.overpotential) && isFinite(d.currentDensity) && d.currentDensity > 0
  );

  if (validData.length < 5) {
    return {
      error: '有效数据点不足',
      errorCode: 'INSUFFICIENT_VALID_DATA'
    };
  }

  // 分离阳极和阴极数据
  const anodicData = validData.filter(d => d.overpotential > 0);
  const cathodicData = validData.filter(d => d.overpotential < 0);

  const results = {};

  // 阳极Tafel斜率
  if ((region === 'anodic' || region === 'both') && anodicData.length >= 5) {
    const anodicSlope = calculateTafelFit(anodicData);
    results.anodic = anodicSlope;
  }

  // 阴极Tafel斜率
  if ((region === 'cathodic' || region === 'both') && cathodicData.length >= 5) {
    const cathodicSlope = calculateTafelFit(cathodicData.map(d => ({
      overpotential: Math.abs(d.overpotential),
      currentDensity: d.currentDensity
    })));
    results.cathodic = cathodicSlope;
  }

  if (Object.keys(results).length === 0) {
    return {
      error: '无法找到足够的阳极或阴极数据',
      errorCode: 'INSUFFICIENT_BRANCH_DATA'
    };
  }

  return {
    region,
    ...results,
    theory: {
      equation: 'η = a + b×log(j)',
      tafelSlope: 'b = 2.303RT/(αnF)',
      exchangeCurrentDensity: 'j₀可从Tafel线外推至η=0处获得'
    },
    interpretation: {
      slope: 'Tafel斜率反映反应动力学',
      typical: '常见值：40-120 mV/decade',
      lowSlope: '低斜率(<60 mV/decade)表示快速电荷转移',
      highSlope: '高斜率(>120 mV/decade)表示慢速电荷转移或多步反应'
    },
    applications: [
      '电催化活性评价',
      '交换电流密度测定',
      '电荷转移系数计算',
      '反应机理研究'
    ],
    references: [
      'Tafel, J., Z. Phys. Chem. 50, 641 (1905)',
      'Bockris & Reddy, Modern Electrochemistry (1970)'
    ]
  };
}

/**
 * Tafel拟合辅助函数
 */
function calculateTafelFit(data) {
  // 线性拟合：log(j) vs η
  const logData = data.map(d => ({
    x: d.overpotential,
    y: Math.log10(Math.abs(d.currentDensity))
  }));

  // 最小二乘法拟合
  const n = logData.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;

  for (const point of logData) {
    sumX += point.x;
    sumY += point.y;
    sumXY += point.x * point.y;
    sumXX += point.x * point.x;
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Tafel斜率 (mV/decade)
  const tafelSlope = 1 / slope * 1000;

  // 交换电流密度（从截距推算，η=0时）
  const j0 = Math.pow(10, intercept);

  // 计算R²
  const meanY = sumY / n;
  let ssRes = 0, ssTot = 0;
  for (const point of logData) {
    const predicted = slope * point.x + intercept;
    ssRes += Math.pow(point.y - predicted, 2);
    ssTot += Math.pow(point.y - meanY, 2);
  }
  const rSquared = 1 - ssRes / ssTot;

  return {
    tafelSlope: Math.abs(tafelSlope).toFixed(2),
    tafelSlopeUnit: 'mV/decade',
    exchangeCurrentDensity: j0.toExponential(2),
    exchangeCurrentDensityUnit: 'A/cm²',
    dataPoints: n,
    rSquared: rSquared.toFixed(4),
    fitQuality: rSquared > 0.95 ? '优秀' : rSquared > 0.9 ? '良好' : '一般',
    linearRange: `${data[0].overpotential.toFixed(3)} ~ ${data[data.length-1].overpotential.toFixed(3)} V`
  };
}

/**
 * 获取元数据
 */
function getMetadata() {
  return METADATA;
}

module.exports = {
  calculateSpecificCapacity,
  calculateVolumetricCapacity,
  calculateCoulombicEfficiency,
  calculateCapacityRetention,
  calculateRatePerformance,
  calculateTheoreticalCapacity,
  analyzeCVPeakCurrent,
  fitEISCircuit,
  calculateTafelSlope,
  getMetadata
};

