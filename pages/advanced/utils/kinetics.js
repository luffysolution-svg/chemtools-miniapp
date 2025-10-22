/**
 * 化学动力学计算工具
 * 包含反应速率、活化能、Arrhenius方程等
 */

// 通用气体常数 R (J/(mol·K))
const R = 8.314;

// 摄氏温度转开尔文
function celsiusToKelvin(C) {
  return C + 273.15;
}

/**
 * Arrhenius方程计算速率常数
 * k = A × exp(-Ea/RT)
 * @param {number} A - 指前因子/频率因子 (单位与k相同)
 * @param {number} Ea - 活化能 (kJ/mol)
 * @param {number} T - 温度 (K)
 * @returns {object} 速率常数和相关信息
 */
function arrheniusEquation(A, Ea, T) {
  // 将Ea从kJ/mol转换为J/mol
  const Ea_J = Ea * 1000;
  
  // 计算k = A × exp(-Ea/RT)
  const k = A * Math.exp(-Ea_J / (R * T));
  
  // 计算ln(k)
  const lnK = Math.log(k);
  
  return {
    k: k.toExponential(4),
    k_value: k,
    lnK: lnK.toFixed(4),
    A: A.toExponential(4),
    Ea: Ea.toFixed(2),
    T: T.toFixed(2),
    temperature_C: (T - 273.15).toFixed(2)
  };
}

/**
 * 根据两个温度下的速率常数计算活化能
 * ln(k2/k1) = -Ea/R × (1/T2 - 1/T1)
 * Ea = -R × ln(k2/k1) / (1/T2 - 1/T1)
 * @param {number} k1 - 温度T1下的速率常数
 * @param {number} T1 - 温度1 (K)
 * @param {number} k2 - 温度T2下的速率常数
 * @param {number} T2 - 温度2 (K)
 * @returns {object} 活化能
 */
function calculateActivationEnergy(k1, T1, k2, T2) {
  // 计算Ea (J/mol)
  const Ea_J = -R * Math.log(k2/k1) / (1/T2 - 1/T1);
  
  // 转换为kJ/mol
  const Ea = Ea_J / 1000;
  
  // 计算指前因子A (使用k1和T1)
  const A = k1 / Math.exp(-Ea_J / (R * T1));
  
  return {
    Ea: Ea.toFixed(2),
    Ea_J: Ea_J.toFixed(2),
    A: A.toExponential(4),
    k1: k1.toExponential(4),
    k2: k2.toExponential(4),
    T1: T1.toFixed(2),
    T2: T2.toFixed(2),
    tempDiff: (T2 - T1).toFixed(2)
  };
}

/**
 * 预测不同温度下的速率常数
 * @param {number} k_ref - 参考温度下的速率常数
 * @param {number} T_ref - 参考温度 (K)
 * @param {number} T_target - 目标温度 (K)
 * @param {number} Ea - 活化能 (kJ/mol)
 * @returns {object} 目标温度下的速率常数
 */
function predictRateConstant(k_ref, T_ref, T_target, Ea) {
  // 将Ea从kJ/mol转换为J/mol
  const Ea_J = Ea * 1000;
  
  // 计算ln(k_target/k_ref)
  const lnK_ratio = -(Ea_J / R) * (1/T_target - 1/T_ref);
  
  // 计算k_target
  const k_target = k_ref * Math.exp(lnK_ratio);
  
  // 计算速率变化倍数
  const rate_change = k_target / k_ref;
  
  return {
    k_ref: k_ref.toExponential(4),
    k_target: k_target.toExponential(4),
    k_target_value: k_target,
    T_ref: T_ref.toFixed(2),
    T_target: T_target.toFixed(2),
    Ea: Ea.toFixed(2),
    rate_change: rate_change.toFixed(4),
    percentage_change: ((rate_change - 1) * 100).toFixed(2)
  };
}

/**
 * 零级反应速率计算
 * [A] = [A]0 - kt
 * @param {number} A0 - 初始浓度 (mol/L)
 * @param {number} k - 速率常数 (mol/(L·s))
 * @param {number} t - 时间 (s)
 * @returns {object} 浓度和半衰期
 */
function zeroOrderKinetics(A0, k, t) {
  // 计算t时刻的浓度
  const A_t = A0 - k * t;
  
  // 零级反应半衰期 t1/2 = [A]0 / (2k)
  const half_life = A0 / (2 * k);
  
  // 计算完全反应时间
  const complete_time = A0 / k;
  
  return {
    A_t: A_t >= 0 ? A_t.toFixed(4) : '反应已完成',
    A0: A0.toFixed(4),
    k: k.toExponential(4),
    t: t.toFixed(2),
    half_life: half_life.toFixed(2),
    complete_time: complete_time.toFixed(2),
    order: '零级反应'
  };
}

/**
 * 一级反应速率计算
 * [A] = [A]0 × exp(-kt)
 * ln([A]/[A]0) = -kt
 * @param {number} A0 - 初始浓度 (mol/L)
 * @param {number} k - 速率常数 (s⁻¹)
 * @param {number} t - 时间 (s)
 * @returns {object} 浓度和半衰期
 */
function firstOrderKinetics(A0, k, t) {
  // 计算t时刻的浓度
  const A_t = A0 * Math.exp(-k * t);
  
  // 一级反应半衰期 t1/2 = ln(2) / k
  const half_life = Math.log(2) / k;
  
  // 计算反应完成度
  const completion = (1 - A_t / A0) * 100;
  
  return {
    A_t: A_t.toFixed(4),
    A0: A0.toFixed(4),
    k: k.toExponential(4),
    t: t.toFixed(2),
    half_life: half_life.toFixed(2),
    completion: completion.toFixed(2),
    order: '一级反应'
  };
}

/**
 * 二级反应速率计算
 * 1/[A] = 1/[A]0 + kt
 * @param {number} A0 - 初始浓度 (mol/L)
 * @param {number} k - 速率常数 (L/(mol·s))
 * @param {number} t - 时间 (s)
 * @returns {object} 浓度和半衰期
 */
function secondOrderKinetics(A0, k, t) {
  // 计算t时刻的浓度
  const A_t = 1 / (1/A0 + k * t);
  
  // 二级反应半衰期 t1/2 = 1 / (k[A]0)
  const half_life = 1 / (k * A0);
  
  // 计算反应完成度
  const completion = (1 - A_t / A0) * 100;
  
  return {
    A_t: A_t.toFixed(4),
    A0: A0.toFixed(4),
    k: k.toExponential(4),
    t: t.toFixed(2),
    half_life: half_life.toFixed(2),
    completion: completion.toFixed(2),
    order: '二级反应'
  };
}

/**
 * 根据浓度-时间数据确定反应级数
 * @param {array} concentrations - 浓度数据 [c1, c2, c3, ...]
 * @param {array} times - 时间数据 [t1, t2, t3, ...]
 * @returns {object} 反应级数判断
 */
function determineReactionOrder(concentrations, times) {
  const n = concentrations.length;
  if (n < 3) {
    return { error: '至少需要3个数据点' };
  }
  
  // 计算线性相关系数 R²
  
  // 零级: [A] vs t
  const zero_order_r2 = calculateR2(times, concentrations);
  
  // 一级: ln[A] vs t
  const ln_concentrations = concentrations.map(c => Math.log(c));
  const first_order_r2 = calculateR2(times, ln_concentrations);
  
  // 二级: 1/[A] vs t
  const inv_concentrations = concentrations.map(c => 1/c);
  const second_order_r2 = calculateR2(times, inv_concentrations);
  
  // 找出最佳拟合
  const r2_values = {
    '零级': zero_order_r2,
    '一级': first_order_r2,
    '二级': second_order_r2
  };
  
  let best_order = '零级';
  let best_r2 = zero_order_r2;
  
  for (let order in r2_values) {
    if (r2_values[order] > best_r2) {
      best_r2 = r2_values[order];
      best_order = order;
    }
  }
  
  return {
    best_order: best_order,
    zero_order_r2: zero_order_r2.toFixed(4),
    first_order_r2: first_order_r2.toFixed(4),
    second_order_r2: second_order_r2.toFixed(4),
    best_r2: best_r2.toFixed(4)
  };
}

/**
 * 计算线性相关系数 R²
 * @param {array} x - 自变量数据
 * @param {array} y - 因变量数据
 * @returns {number} R²值
 */
function calculateR2(x, y) {
  const n = x.length;
  
  // 计算平均值
  const x_mean = x.reduce((sum, val) => sum + val, 0) / n;
  const y_mean = y.reduce((sum, val) => sum + val, 0) / n;
  
  // 计算总平方和和残差平方和
  let ss_tot = 0;
  let ss_res = 0;
  
  // 首先计算线性回归参数
  let sum_xy = 0;
  let sum_xx = 0;
  
  for (let i = 0; i < n; i++) {
    sum_xy += (x[i] - x_mean) * (y[i] - y_mean);
    sum_xx += (x[i] - x_mean) * (x[i] - x_mean);
  }
  
  const slope = sum_xy / sum_xx;
  const intercept = y_mean - slope * x_mean;
  
  // 计算R²
  for (let i = 0; i < n; i++) {
    const y_pred = slope * x[i] + intercept;
    ss_res += (y[i] - y_pred) * (y[i] - y_pred);
    ss_tot += (y[i] - y_mean) * (y[i] - y_mean);
  }
  
  const r2 = 1 - (ss_res / ss_tot);
  return r2;
}

/**
 * 计算反应半衰期
 * @param {number} k - 速率常数
 * @param {number} order - 反应级数 (0, 1, 2)
 * @param {number} A0 - 初始浓度 (仅零级和二级需要)
 * @returns {object} 半衰期
 */
function calculateHalfLife(k, order, A0 = null) {
  let half_life;
  let formula;
  
  switch(order) {
    case 0:
      if (!A0) return { error: '零级反应需要初始浓度' };
      half_life = A0 / (2 * k);
      formula = 't₁/₂ = [A]₀ / (2k)';
      break;
      
    case 1:
      half_life = Math.log(2) / k;
      formula = 't₁/₂ = ln(2) / k = 0.693 / k';
      break;
      
    case 2:
      if (!A0) return { error: '二级反应需要初始浓度' };
      half_life = 1 / (k * A0);
      formula = 't₁/₂ = 1 / (k[A]₀)';
      break;
      
    default:
      return { error: '不支持的反应级数' };
  }
  
  return {
    half_life: half_life.toFixed(4),
    order: order + '级反应',
    formula: formula,
    k: k.toExponential(4),
    A0: A0 ? A0.toFixed(4) : 'N/A'
  };
}

/**
 * Eyring方程（过渡态理论）
 * k = (kB·T/h) × exp(ΔS‡/R) × exp(-ΔH‡/RT)
 * @param {number} T - 温度 (K)
 * @param {number} deltaH - 活化焓 (kJ/mol)
 * @param {number} deltaS - 活化熵 (J/(mol·K))
 * @returns {object} 速率常数
 */
function eyringEquation(T, deltaH, deltaS) {
  const kB = 1.380649e-23; // 玻尔兹曼常数 (J/K)
  const h = 6.62607015e-34; // 普朗克常数 (J·s)
  const NA = 6.02214076e23; // 阿伏伽德罗常数
  
  // 将ΔH从kJ/mol转换为J/分子
  const deltaH_J = (deltaH * 1000) / NA;
  const deltaS_J = deltaS / NA;
  
  // 计算k
  const k = (kB * T / h) * Math.exp(deltaS_J / kB) * Math.exp(-deltaH_J / (kB * T));
  
  // 从Eyring方程计算对应的Arrhenius参数
  const Ea = deltaH * 1000 + R * T; // J/mol
  const A = (kB * T / h) * Math.exp(1 + deltaS / R) * Math.exp(1);
  
  return {
    k: k.toExponential(4),
    T: T.toFixed(2),
    deltaH: deltaH.toFixed(2),
    deltaS: deltaS.toFixed(2),
    Ea_equivalent: (Ea / 1000).toFixed(2),
    A_equivalent: A.toExponential(4)
  };
}

/**
 * 常见反应的典型动力学参数
 */
const kineticData = {
  '蔗糖水解': {
    Ea: 107, // kJ/mol
    A: 1.5e13,
    typical_k_25C: 6.17e-6,
    order: 1,
    name: '蔗糖水解 (酸催化)'
  },
  '过氧化氢分解': {
    Ea: 75,
    A: 3.2e12,
    typical_k_25C: 3.6e-4,
    order: 1,
    name: 'H₂O₂分解 (无催化)'
  },
  '乙酸乙酯皂化': {
    Ea: 42,
    A: 4.5e9,
    typical_k_25C: 0.11,
    order: 2,
    name: 'CH₃COOC₂H₅ + OH⁻'
  }
};

module.exports = {
  R,
  celsiusToKelvin,
  arrheniusEquation,
  calculateActivationEnergy,
  predictRateConstant,
  zeroOrderKinetics,
  firstOrderKinetics,
  secondOrderKinetics,
  determineReactionOrder,
  calculateHalfLife,
  eyringEquation,
  calculateR2,
  kineticData
};

