/**
 * 热力学计算工具
 * 包含热力学相关的计算功能
 */

// 通用气体常数 R (J/(mol·K))
const R = 8.314;

// 华氏温度转开尔文
function fahrenheitToKelvin(F) {
  return (F - 32) * 5 / 9 + 273.15;
}

// 摄氏温度转开尔文
function celsiusToKelvin(C) {
  return C + 273.15;
}

/**
 * Gibbs自由能计算
 * ΔG = ΔH - T·ΔS
 * @param {number} deltaH - 焓变 (kJ/mol)
 * @param {number} T - 温度 (K)
 * @param {number} deltaS - 熵变 (J/(mol·K))
 * @returns {object} 计算结果
 */
function calculateGibbsFreeEnergy(deltaH, T, deltaS) {
  // 将ΔH从kJ/mol转换为J/mol
  const deltaH_J = deltaH * 1000;
  
  // 计算ΔG (J/mol)
  const deltaG_J = deltaH_J - T * deltaS;
  
  // 转换为kJ/mol
  const deltaG = deltaG_J / 1000;
  
  // 判断反应自发性
  let spontaneity;
  if (deltaG < 0) {
    spontaneity = '自发反应 (ΔG < 0)';
  } else if (deltaG > 0) {
    spontaneity = '非自发反应 (ΔG > 0)';
  } else {
    spontaneity = '平衡状态 (ΔG = 0)';
  }
  
  return {
    deltaG: deltaG.toFixed(2),
    deltaG_J: deltaG_J.toFixed(2),
    spontaneity: spontaneity,
    temperature: T.toFixed(2),
    deltaH: deltaH.toFixed(2),
    deltaS: deltaS.toFixed(2)
  };
}

/**
 * 根据ΔG计算平衡常数K
 * ΔG° = -RT ln(K)
 * K = exp(-ΔG°/RT)
 * @param {number} deltaG - 标准Gibbs自由能变 (kJ/mol)
 * @param {number} T - 温度 (K)
 * @returns {object} 平衡常数
 */
function calculateEquilibriumConstant(deltaG, T) {
  // 将ΔG从kJ/mol转换为J/mol
  const deltaG_J = deltaG * 1000;
  
  // 计算K = exp(-ΔG/RT)
  const K = Math.exp(-deltaG_J / (R * T));
  
  // pK = -log10(K)
  const pK = -Math.log10(K);
  
  // 判断反应倾向
  let tendency;
  if (K > 1) {
    tendency = '正向为主 (K > 1)';
  } else if (K < 1) {
    tendency = '逆向为主 (K < 1)';
  } else {
    tendency = '平衡 (K = 1)';
  }
  
  return {
    K: K.toExponential(4),
    K_value: K,
    pK: pK.toFixed(4),
    deltaG: deltaG.toFixed(2),
    temperature: T.toFixed(2),
    tendency: tendency
  };
}

/**
 * 根据平衡常数K计算ΔG
 * ΔG° = -RT ln(K)
 * @param {number} K - 平衡常数
 * @param {number} T - 温度 (K)
 * @returns {object} Gibbs自由能
 */
function calculateGibbsFromK(K, T) {
  // 计算ΔG (J/mol)
  const deltaG_J = -R * T * Math.log(K);
  
  // 转换为kJ/mol
  const deltaG = deltaG_J / 1000;
  
  return {
    deltaG: deltaG.toFixed(2),
    deltaG_J: deltaG_J.toFixed(2),
    K: K.toExponential(4),
    temperature: T.toFixed(2),
    lnK: Math.log(K).toFixed(4)
  };
}

/**
 * Van't Hoff方程计算不同温度下的平衡常数
 * ln(K2/K1) = -ΔH°/R × (1/T2 - 1/T1)
 * @param {number} K1 - 温度T1下的平衡常数
 * @param {number} T1 - 温度1 (K)
 * @param {number} T2 - 温度2 (K)
 * @param {number} deltaH - 标准焓变 (kJ/mol)
 * @returns {object} 新温度下的平衡常数
 */
function vantHoffEquation(K1, T1, T2, deltaH) {
  // 将ΔH从kJ/mol转换为J/mol
  const deltaH_J = deltaH * 1000;
  
  // 计算ln(K2/K1)
  const lnK2_K1 = -(deltaH_J / R) * (1/T2 - 1/T1);
  
  // 计算K2
  const K2 = K1 * Math.exp(lnK2_K1);
  
  // 计算ΔG在两个温度下的值
  const deltaG1 = -R * T1 * Math.log(K1) / 1000;
  const deltaG2 = -R * T2 * Math.log(K2) / 1000;
  
  return {
    K1: K1.toExponential(4),
    K2: K2.toExponential(4),
    K2_value: K2,
    T1: T1.toFixed(2),
    T2: T2.toFixed(2),
    deltaH: deltaH.toFixed(2),
    deltaG1: deltaG1.toFixed(2),
    deltaG2: deltaG2.toFixed(2),
    tempChange: (T2 - T1).toFixed(2)
  };
}

/**
 * 计算反应焓变 (使用Hess定律)
 * ΔH_reaction = Σ ΔH_f(products) - Σ ΔH_f(reactants)
 * @param {array} products - 产物的生成焓 [{deltaH_f: value, coefficient: n}, ...]
 * @param {array} reactants - 反应物的生成焓 [{deltaH_f: value, coefficient: n}, ...]
 * @returns {object} 反应焓变
 */
function calculateReactionEnthalpy(products, reactants) {
  // 计算产物的总生成焓
  const sum_products = products.reduce((sum, item) => 
    sum + item.deltaH_f * item.coefficient, 0
  );
  
  // 计算反应物的总生成焓
  const sum_reactants = reactants.reduce((sum, item) => 
    sum + item.deltaH_f * item.coefficient, 0
  );
  
  // 计算反应焓变
  const deltaH = sum_products - sum_reactants;
  
  // 判断反应类型
  let reactionType;
  if (deltaH < 0) {
    reactionType = '放热反应 (ΔH < 0)';
  } else if (deltaH > 0) {
    reactionType = '吸热反应 (ΔH > 0)';
  } else {
    reactionType = '热中性 (ΔH = 0)';
  }
  
  return {
    deltaH: deltaH.toFixed(2),
    sum_products: sum_products.toFixed(2),
    sum_reactants: sum_reactants.toFixed(2),
    reactionType: reactionType
  };
}

/**
 * 计算反应熵变
 * ΔS_reaction = Σ S°(products) - Σ S°(reactants)
 * @param {array} products - 产物的标准熵 [{S: value, coefficient: n}, ...]
 * @param {array} reactants - 反应物的标准熵 [{S: value, coefficient: n}, ...]
 * @returns {object} 反应熵变
 */
function calculateReactionEntropy(products, reactants) {
  // 计算产物的总熵
  const sum_products = products.reduce((sum, item) => 
    sum + item.S * item.coefficient, 0
  );
  
  // 计算反应物的总熵
  const sum_reactants = reactants.reduce((sum, item) => 
    sum + item.S * item.coefficient, 0
  );
  
  // 计算反应熵变
  const deltaS = sum_products - sum_reactants;
  
  // 判断熵变类型
  let entropyChange;
  if (deltaS > 0) {
    entropyChange = '熵增加 (ΔS > 0) - 混乱度增加';
  } else if (deltaS < 0) {
    entropyChange = '熵减少 (ΔS < 0) - 有序度增加';
  } else {
    entropyChange = '熵不变 (ΔS = 0)';
  }
  
  return {
    deltaS: deltaS.toFixed(2),
    sum_products: sum_products.toFixed(2),
    sum_reactants: sum_reactants.toFixed(2),
    entropyChange: entropyChange
  };
}

/**
 * Clausius-Clapeyron方程（计算蒸气压）
 * ln(P2/P1) = -ΔH_vap/R × (1/T2 - 1/T1)
 * @param {number} P1 - 温度T1下的蒸气压 (Pa)
 * @param {number} T1 - 温度1 (K)
 * @param {number} T2 - 温度2 (K)
 * @param {number} deltaH_vap - 蒸发焓 (kJ/mol)
 * @returns {object} 新温度下的蒸气压
 */
function clausiusClapeyron(P1, T1, T2, deltaH_vap) {
  // 将ΔH从kJ/mol转换为J/mol
  const deltaH_J = deltaH_vap * 1000;
  
  // 计算ln(P2/P1)
  const lnP2_P1 = -(deltaH_J / R) * (1/T2 - 1/T1);
  
  // 计算P2
  const P2 = P1 * Math.exp(lnP2_P1);
  
  return {
    P1: P1.toExponential(4),
    P2: P2.toExponential(4),
    P2_value: P2,
    T1: T1.toFixed(2),
    T2: T2.toFixed(2),
    deltaH_vap: deltaH_vap.toFixed(2),
    P2_atm: (P2 / 101325).toFixed(6)
  };
}

/**
 * 计算反应商Q和判断反应方向
 * Q与K的比较决定反应方向
 * @param {number} Q - 反应商
 * @param {number} K - 平衡常数
 * @returns {object} 反应方向判断
 */
function reactionQuotient(Q, K) {
  let direction;
  let explanation;
  
  if (Q < K) {
    direction = '正向进行';
    explanation = 'Q < K，反应向右进行，生成更多产物';
  } else if (Q > K) {
    direction = '逆向进行';
    explanation = 'Q > K，反应向左进行，生成更多反应物';
  } else {
    direction = '平衡状态';
    explanation = 'Q = K，反应处于平衡状态';
  }
  
  const ratio = Q / K;
  
  return {
    Q: Q.toExponential(4),
    K: K.toExponential(4),
    ratio: ratio.toFixed(4),
    direction: direction,
    explanation: explanation
  };
}

/**
 * 常见物质的热力学数据库（标准状态：25°C，1 atm）
 */
const thermodynamicData = {
  // 常见物质的标准生成焓 ΔH°f (kJ/mol) 和标准熵 S° (J/(mol·K))
  'H2O(l)': { deltaH_f: -285.8, S: 69.9, name: '水(液态)' },
  'H2O(g)': { deltaH_f: -241.8, S: 188.8, name: '水(气态)' },
  'CO2(g)': { deltaH_f: -393.5, S: 213.7, name: '二氧化碳' },
  'CH4(g)': { deltaH_f: -74.8, S: 186.3, name: '甲烷' },
  'NH3(g)': { deltaH_f: -46.1, S: 192.5, name: '氨气' },
  'O2(g)': { deltaH_f: 0, S: 205.0, name: '氧气' },
  'N2(g)': { deltaH_f: 0, S: 191.5, name: '氮气' },
  'H2(g)': { deltaH_f: 0, S: 130.6, name: '氢气' },
  'C(graphite)': { deltaH_f: 0, S: 5.7, name: '石墨' },
  'NaCl(s)': { deltaH_f: -411.2, S: 72.1, name: '氯化钠' },
  'CaCO3(s)': { deltaH_f: -1207.0, S: 92.9, name: '碳酸钙' },
  'CaO(s)': { deltaH_f: -635.1, S: 39.8, name: '氧化钙' },
  'Fe2O3(s)': { deltaH_f: -824.2, S: 87.4, name: '氧化铁(III)' },
  'Al2O3(s)': { deltaH_f: -1675.7, S: 50.9, name: '氧化铝' },
  'SiO2(s)': { deltaH_f: -910.9, S: 41.8, name: '二氧化硅' }
};

module.exports = {
  R,
  celsiusToKelvin,
  fahrenheitToKelvin,
  calculateGibbsFreeEnergy,
  calculateEquilibriumConstant,
  calculateGibbsFromK,
  vantHoffEquation,
  calculateReactionEnthalpy,
  calculateReactionEntropy,
  clausiusClapeyron,
  reactionQuotient,
  thermodynamicData
};

