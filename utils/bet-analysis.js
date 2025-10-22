// UTF-8, no BOM
// BET表面积与孔径分析工具
// 数据来源：S. Brunauer, P. H. Emmett, E. Teller, J. Am. Chem. Soc. 60, 309 (1938)

const METADATA = {
  version: '1.0.0',
  lastUpdated: '2025-10-18',
  sources: {
    bet: 'S. Brunauer, P. H. Emmett, E. Teller, J. Am. Chem. Soc. 60, 309 (1938)',
    bjh: 'E. P. Barrett, L. G. Joyner, P. P. Halenda, J. Am. Chem. Soc. 73, 373 (1951)',
    langmuir: 'I. Langmuir, J. Am. Chem. Soc. 40, 1361 (1918)'
  }
};

// N2分子截面积（常用吸附质）
const N2_CROSS_SECTION = 0.162; // nm²
const AVOGADRO = 6.02214076e23;

/**
 * BET表面积计算
 * BET方程：1/[V(P0/P-1)] = (C-1)/VmC × P/P0 + 1/VmC
 * 线性形式：P/[V(P0-P)] = 1/VmC + (C-1)/VmC × P/P0
 * 
 * @param {Array} adsorptionData - 吸附数据 [{relPressure(P/P0), adsorbedVolume(cm³/g STP)}]
 * @returns {object} BET表面积结果
 */
function calculateBET(adsorptionData) {
  if (!Array.isArray(adsorptionData) || adsorptionData.length < 5) {
    return {
      error: '至少需要5个吸附数据点',
      errorCode: 'INSUFFICIENT_DATA'
    };
  }

  // 自动识别线性区域（通常在 P/P0 = 0.05-0.30）
  const linearRegion = adsorptionData.filter(point => {
    const p = Number(point.relPressure);
    return p >= 0.05 && p <= 0.35 && isFinite(p) && isFinite(point.adsorbedVolume);
  });

  if (linearRegion.length < 3) {
    return {
      error: '线性区域(P/P0=0.05-0.30)数据点不足',
      errorCode: 'INSUFFICIENT_LINEAR_DATA',
      note: '建议在0.05-0.30的相对压力范围内测量更多点'
    };
  }

  // BET线性拟合：y = 1/[V(P0/P-1)], x = P/P0
  // 变换为：P/[V(P0-P)] = slope × P/P0 + intercept
  const betData = linearRegion.map(point => {
    const x = Number(point.relPressure);
    const V = Number(point.adsorbedVolume);
    const y = x / (V * (1 - x));
    return { x, y };
  });

  // 线性拟合
  const { slope, intercept, rSquared } = linearFit(betData);

  if (!isFinite(slope) || !isFinite(intercept) || slope <= 0 || intercept <= 0) {
    return {
      error: 'BET线性拟合失败，请检查数据质量',
      errorCode: 'FIT_FAILED'
    };
  }

  // 计算Vm和C
  const Vm = 1 / (slope + intercept); // 单层饱和吸附量 (cm³/g STP)
  const C = 1 + slope / intercept;    // BET常数

  // 计算比表面积
  // S_BET = (Vm × N_A × σ) / (22414 × 10^18)
  // Vm: cm³/g STP, σ: nm², 22414: STP下1 mol气体体积(cm³)
  const S_BET = (Vm * AVOGADRO * N2_CROSS_SECTION) / (22414 * 1e18);

  // 拟合质量评价
  let fitQuality = 'excellent';
  if (rSquared < 0.999) fitQuality = 'good';
  if (rSquared < 0.995) fitQuality = 'fair';
  if (rSquared < 0.99) fitQuality = 'poor';

  return {
    surfaceArea: parseFloat(S_BET.toFixed(2)),
    unit: 'm²/g',
    Vm: parseFloat(Vm.toFixed(4)),
    C: parseFloat(C.toFixed(2)),
    rSquared: parseFloat(rSquared.toFixed(5)),
    fitQuality,
    linearPoints: linearRegion.length,
    linearRange: '0.05 < P/P0 < 0.30',
    equation: `y = ${slope.toFixed(6)}x + ${intercept.toFixed(6)}`,
    notes: [
      `BET常数C=${C.toFixed(2)}`,
      C < 20 ? '⚠️ C值较小，吸附较弱' : C > 200 ? '💡 C值较大，吸附较强' : '✓ C值正常',
      `R²=${rSquared.toFixed(5)} (${fitQuality === 'excellent' ? '优秀' : fitQuality === 'good' ? '良好' : fitQuality === 'fair' ? '一般' : '较差'})`
    ]
  };
}

/**
 * Langmuir吸附等温线拟合
 * Q = Qm·K·C / (1 + K·C)
 * 线性化：C/Q = 1/(Qm·K) + C/Qm
 * 
 * @param {Array} equilibriumData - 平衡数据 [{concentration(mg/L), adsorption(mg/g)}]
 * @returns {object} Langmuir拟合结果
 */
function fitLangmuir(equilibriumData) {
  if (!Array.isArray(equilibriumData) || equilibriumData.length < 4) {
    return {
      error: '至少需要4个平衡数据点',
      errorCode: 'INSUFFICIENT_DATA'
    };
  }

  // 线性化：y = C/Q, x = C
  const linearData = equilibriumData
    .filter(point => isFinite(point.concentration) && isFinite(point.adsorption))
    .filter(point => point.concentration > 0 && point.adsorption > 0)
    .map(point => ({
      x: Number(point.concentration),
      y: Number(point.concentration) / Number(point.adsorption)
    }));

  if (linearData.length < 4) {
    return {
      error: '有效数据点不足',
      errorCode: 'INSUFFICIENT_VALID_DATA'
    };
  }

  const { slope, intercept, rSquared } = linearFit(linearData);

  if (!isFinite(slope) || !isFinite(intercept) || slope <= 0) {
    return { error: 'Langmuir拟合失败', errorCode: 'FIT_FAILED' };
  }

  // Qm = 1/slope, K = 1/(slope×intercept)
  const Qm = 1 / slope;
  const K = 1 / (slope * intercept);

  return {
    Qm: parseFloat(Qm.toFixed(4)),
    unit: 'mg/g',
    K: parseFloat(K.toFixed(6)),
    KUnit: 'L/mg',
    rSquared: parseFloat(rSquared.toFixed(4)),
    fitQuality: rSquared > 0.99 ? 'excellent' : rSquared > 0.95 ? 'good' : 'fair',
    equation: `Q = ${Qm.toFixed(2)}×${K.toFixed(4)}×C / (1 + ${K.toFixed(4)}×C)`,
    note: 'Langmuir模型假设单层吸附，吸附位点均匀'
  };
}

/**
 * Freundlich吸附等温线拟合
 * Q = Kf·C^(1/n)
 * 线性化：log Q = log Kf + (1/n)·log C
 * 
 * @param {Array} equilibriumData - 平衡数据 [{concentration, adsorption}]
 * @returns {object} Freundlich拟合结果
 */
function fitFreundlich(equilibriumData) {
  if (!Array.isArray(equilibriumData) || equilibriumData.length < 4) {
    return {
      error: '至少需要4个平衡数据点',
      errorCode: 'INSUFFICIENT_DATA'
    };
  }

  // 线性化：y = log Q, x = log C
  const linearData = equilibriumData
    .filter(point => isFinite(point.concentration) && isFinite(point.adsorption))
    .filter(point => point.concentration > 0 && point.adsorption > 0)
    .map(point => ({
      x: Math.log10(Number(point.concentration)),
      y: Math.log10(Number(point.adsorption))
    }));

  if (linearData.length < 4) {
    return {
      error: '有效数据点不足',
      errorCode: 'INSUFFICIENT_VALID_DATA'
    };
  }

  const { slope, intercept, rSquared } = linearFit(linearData);

  if (!isFinite(slope) || !isFinite(intercept)) {
    return { error: 'Freundlich拟合失败', errorCode: 'FIT_FAILED' };
  }

  // log Kf = intercept, 1/n = slope
  const Kf = Math.pow(10, intercept);
  const n = 1 / slope;

  return {
    Kf: parseFloat(Kf.toFixed(4)),
    n: parseFloat(n.toFixed(4)),
    rSquared: parseFloat(rSquared.toFixed(4)),
    fitQuality: rSquared > 0.99 ? 'excellent' : rSquared > 0.95 ? 'good' : 'fair',
    equation: `Q = ${Kf.toFixed(2)}×C^${(1/n).toFixed(3)}`,
    note: 'Freundlich模型适用于非均匀表面的多层吸附',
    interpretation: n > 1 ? '易于吸附' : n < 1 ? '较难吸附' : '线性吸附'
  };
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
 * 获取元数据
 */
function getMetadata() {
  return METADATA;
}

module.exports = {
  calculateBET,
  fitLangmuir,
  fitFreundlich,
  getMetadata
};

