// UTF-8, no BOM
// 光催化性能计算工具
// 表观量子效率(AQE)、降解速率常数

const METADATA = {
  version: '1.0.0',
  lastUpdated: '2025-10-18',
  sources: {
    aqe: 'IUPAC Photocatalysis Terminology',
    kinetics: 'Langmuir-Hinshelwood kinetics',
    planck: 'h = 6.62607015×10⁻³⁴ J·s'
  }
};

// 常数
const PLANCK_H = 6.62607015e-34; // J·s
const SPEED_OF_LIGHT = 2.99792458e8; // m/s
const AVOGADRO = 6.02214076e23; // mol⁻¹

/**
 * 表观量子效率(AQE)计算
 * AQE = (反应的分子数 / 入射的光子数) × 100%
 * 
 * @param {number} reactionRate - 反应速率(mol/h 或 mol/s)
 * @param {number} photonFlux - 光子通量(W 或 mW)
 * @param {number} wavelength - 光源波长(nm)
 * @param {object} options - {timeUnit: 'h'|'s', powerUnit: 'W'|'mW'}
 * @returns {object} AQE(%)
 */
function calculateAQE(reactionRate, photonFlux, wavelength, options = {}) {
  const rate = Number(reactionRate);
  const flux = Number(photonFlux);
  const lambda = Number(wavelength);

  if (!isFinite(rate) || !isFinite(flux) || !isFinite(lambda)) {
    return {
      error: '请输入有效的数值',
      errorCode: 'INVALID_INPUT'
    };
  }

  if (rate < 0 || flux <= 0 || lambda <= 0) {
    return {
      error: '反应速率、光通量和波长必须为正数',
      errorCode: 'INVALID_RANGE'
    };
  }

  const { timeUnit = 'h', powerUnit = 'W' } = options;

  // 统一单位
  const ratePerSecond = timeUnit === 'h' ? rate / 3600 : rate; // mol/s
  const powerWatt = powerUnit === 'mW' ? flux / 1000 : flux; // W

  // 计算光子能量: E = hc/λ
  const lambdaM = lambda * 1e-9; // 转换为米
  const photonEnergy = (PLANCK_H * SPEED_OF_LIGHT) / lambdaM; // J

  // 入射光子数/秒 = 功率 / 单个光子能量
  const photonFluxPerSecond = powerWatt / photonEnergy; // photons/s

  // 反应的分子数/秒 = 反应速率 × 阿伏伽德罗常数
  const moleculesPerSecond = ratePerSecond * AVOGADRO; // molecules/s

  // AQE = 反应分子数 / 入射光子数 × 100%
  const aqe = (moleculesPerSecond / photonFluxPerSecond) * 100;

  // 评估
  let performanceNote = '';
  if (aqe > 50) {
    performanceNote = '✓ 光催化性能优秀';
  } else if (aqe > 10) {
    performanceNote = '✓ 光催化性能良好';
  } else if (aqe > 1) {
    performanceNote = '○ 光催化性能一般';
  } else {
    performanceNote = '○ 光催化性能较低';
  }

  return {
    aqe: parseFloat(aqe.toFixed(4)),
    unit: '%',
    reactionRate: `${rate} mol/${timeUnit}`,
    photonFlux: `${flux} ${powerUnit}`,
    wavelength: `${lambda} nm`,
    photonEnergy: `${(photonEnergy * 1e19).toFixed(3)} ×10⁻¹⁹ J`,
    photonFluxPerSecond: photonFluxPerSecond.toExponential(3),
    moleculesPerSecond: moleculesPerSecond.toExponential(3),
    performanceNote,
    note: 'AQE表示光催化剂利用光子的效率'
  };
}

/**
 * 降解速率常数拟合（一级动力学）
 * ln(C/C0) = -kt 或 C = C0·e^(-kt)
 * 
 * @param {Array} timeData - 时间-浓度数据 [{time(min), concentration}]
 * @returns {object} 速率常数k、半衰期
 */
function fitDegradationKinetics(timeData) {
  if (!Array.isArray(timeData) || timeData.length < 3) {
    return {
      error: '至少需要3个时间点数据',
      errorCode: 'INSUFFICIENT_DATA'
    };
  }

  // 过滤有效数据
  const validData = timeData.filter(point => 
    isFinite(point.time) && isFinite(point.concentration) &&
    point.time >= 0 && point.concentration > 0
  );

  if (validData.length < 3) {
    return {
      error: '有效数据点不足',
      errorCode: 'INSUFFICIENT_VALID_DATA'
    };
  }

  // 按时间排序
  const sorted = validData.sort((a, b) => a.time - b.time);
  const C0 = sorted[0].concentration;

  // 线性化：y = ln(C/C0) = -kt, x = t
  const linearData = sorted.map(point => ({
    x: Number(point.time),
    y: Math.log(Number(point.concentration) / C0)
  }));

  // 线性拟合
  const { slope, intercept, rSquared } = linearFit(linearData);

  if (!isFinite(slope) || !isFinite(rSquared)) {
    return {
      error: '动力学拟合失败',
      errorCode: 'FIT_FAILED'
    };
  }

  // 速率常数 k = -slope
  const k = -slope;

  if (k < 0) {
    return {
      error: '速率常数为负，不符合降解动力学',
      errorCode: 'NEGATIVE_K',
      note: '浓度可能随时间增加，不符合降解过程'
    };
  }

  // 半衰期：t1/2 = ln(2) / k
  const halfLife = Math.log(2) / k;

  // 拟合质量
  const fitQuality = rSquared > 0.99 ? 'excellent' : rSquared > 0.95 ? 'good' : rSquared > 0.90 ? 'fair' : 'poor';

  // 计算各点的拟合值和残差
  const fittedData = sorted.map(point => {
    const predicted = C0 * Math.exp(-k * point.time);
    const residual = point.concentration - predicted;
    return {
      time: point.time.toFixed(1),
      measured: point.concentration.toFixed(2),
      fitted: predicted.toFixed(2),
      residual: residual.toFixed(2)
    };
  });

  return {
    k: parseFloat(k.toFixed(6)),
    kUnit: 'min⁻¹',
    halfLife: parseFloat(halfLife.toFixed(2)),
    halfLifeUnit: 'min',
    C0: parseFloat(C0.toFixed(2)),
    rSquared: parseFloat(rSquared.toFixed(4)),
    fitQuality,
    equation: `C = ${C0.toFixed(2)}×e^(-${k.toFixed(6)}t)`,
    fittedData,
    note: 'R² 接近1表示符合一级动力学'
  };
}

/**
 * 线性拟合
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
 * 光催化活性对比
 * @param {Array} datasets - [{name, k(min⁻¹)}]
 * @returns {object} 对比结果
 */
function compareActivity(datasets) {
  if (!Array.isArray(datasets) || datasets.length < 2) {
    return {
      error: '至少需要2组数据进行对比',
      errorCode: 'INSUFFICIENT_DATA'
    };
  }

  const validData = datasets.filter(d => d.name && isFinite(d.k) && d.k > 0);

  if (validData.length < 2) {
    return {
      error: '有效数据不足',
      errorCode: 'INSUFFICIENT_VALID_DATA'
    };
  }

  // 排序
  const sorted = validData.sort((a, b) => b.k - a.k);

  // 以最佳样品为基准
  const best = sorted[0];
  const comparison = sorted.map((sample, idx) => {
    const relative = (sample.k / best.k) * 100;
    return {
      rank: idx + 1,
      name: sample.name,
      k: sample.k.toFixed(6),
      halfLife: (Math.log(2) / sample.k).toFixed(2),
      relative: relative.toFixed(1),
      isBest: idx === 0
    };
  });

  return {
    bestSample: best.name,
    bestK: best.k.toFixed(6),
    comparison,
    note: '相对活性以最佳样品为100%'
  };
}

/**
 * 获取元数据
 */
function getMetadata() {
  return METADATA;
}

module.exports = {
  calculateAQE,
  fitDegradationKinetics,
  compareActivity,
  getMetadata
};

