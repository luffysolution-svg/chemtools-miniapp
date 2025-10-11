// 元素周期表数据
// 数据来源：IUPAC、NIST、CRC Handbook

// 元数据
const METADATA = {
  version: '1.0.0',
  lastUpdated: '2025-10-10',
  totalElements: 118,
  sources: {
    atomicMass: 'IUPAC Standard Atomic Weights (2021)',
    electronegativity: 'Pauling Scale (Linus Pauling, 1960)',
    atomicRadius: 'Covalent Radii (Cordero et al., 2008)',
    ionizationEnergy: 'CRC Handbook of Chemistry and Physics, 102nd Edition (2021)',
    meltingPoint: 'NIST Chemistry WebBook',
    boilingPoint: 'NIST Chemistry WebBook',
    citation: [
      'IUPAC Technical Report, Pure Appl. Chem. 88, 265 (2016)',
      'CRC Handbook of Chemistry and Physics, 102nd Edition (2021)',
      'NIST Atomic Spectra Database',
      'B. Cordero et al., Dalton Trans., 2832-2838 (2008)'
    ]
  },
  dataQuality: {
    atomicMass: '根据IUPAC标准，不确定度通常在±0.001 u以内',
    electronegativity: 'Pauling标度，±0.1',
    atomicRadius: '±5 pm（取决于化学环境）',
    ionizationEnergy: '±1 kJ/mol',
    meltingPoint: '±1 K（取决于纯度和压力）',
    boilingPoint: '±1 K（取决于纯度和压力）'
  },
  notes: [
    '原子质量：根据2021年IUPAC推荐值，部分元素（如放射性元素）给出的是最稳定同位素的质量数',
    '电负性：使用Pauling标度，稀有气体通常无电负性值',
    '原子半径：使用共价半径，实际半径因化学键类型而异',
    '电离能：第一电离能（kJ/mol）',
    '熔点和沸点：在标准大气压（101.325 kPa）下的值',
    '状态：室温（298.15 K）下的物态'
  ],
  disclaimer: '元素性质数据来自多个权威来源，仅供科研和教学参考。部分放射性元素的数据为估计值。'
};

/**
 * 获取模块元数据
 * @returns {object} 元数据对象
 */
function getMetadata() {
  return METADATA;
}

/**
 * 根据原子序数获取元素
 * @param {number} atomicNumber - 原子序数 (1-118)
 * @returns {object|null} 元素对象或错误对象
 */
function getElementById(atomicNumber) {
  const num = Number(atomicNumber);
  
  if (!Number.isFinite(num) || num < 1 || num > 118) {
    return {
      error: '无效的原子序数',
      errorCode: 'INVALID_ATOMIC_NUMBER',
      validRange: '1-118',
      received: atomicNumber
    };
  }
  
  return periodicElements[num - 1];
}

/**
 * 根据元素符号获取元素
 * @param {string} symbol - 元素符号（如'H', 'He'）
 * @returns {object|null} 元素对象或错误对象
 */
function getElementBySymbol(symbol) {
  if (!symbol || typeof symbol !== 'string') {
    return {
      error: '元素符号必须为非空字符串',
      errorCode: 'INVALID_SYMBOL'
    };
  }
  
  const elem = periodicElements.find(e => e.symbol === symbol || e.symbol.toLowerCase() === symbol.toLowerCase());
  
  if (!elem) {
    return {
      error: `未找到符号为 "${symbol}" 的元素`,
      errorCode: 'ELEMENT_NOT_FOUND',
      suggestion: '请使用正确的元素符号（如H, He, Li等）'
    };
  }
  
  return elem;
}

/**
 * 根据元素名称获取元素
 * @param {string} name - 元素名称（中文或英文）
 * @returns {object|null} 元素对象或错误对象
 */
function getElementByName(name) {
  if (!name || typeof name !== 'string') {
    return {
      error: '元素名称必须为非空字符串',
      errorCode: 'INVALID_NAME'
    };
  }
  
  const elem = periodicElements.find(e => 
    e.name === name || 
    e.name.toLowerCase() === name.toLowerCase()
  );
  
  if (!elem) {
    return {
      error: `未找到名称为 "${name}" 的元素`,
      errorCode: 'ELEMENT_NOT_FOUND',
      suggestion: '请使用正确的元素名称（如氢、氦、锂等）'
    };
  }
  
  return elem;
}

/**
 * 按类别筛选元素
 * @param {string} category - 类别（如'alkali', 'metal'等）
 * @returns {array|object} 筛选结果或错误对象
 */
function filterByCategory(category) {
  if (!category || typeof category !== 'string') {
    return {
      error: '类别必须为非空字符串',
      errorCode: 'INVALID_CATEGORY'
    };
  }
  
  const validCategories = Object.keys(categoryLabels);
  if (!validCategories.includes(category)) {
    return {
      error: `无效的类别: ${category}`,
      errorCode: 'INVALID_CATEGORY',
      validCategories,
      suggestion: '有效类别: ' + validCategories.join(', ')
    };
  }
  
  return periodicElements.filter(e => e.category === category);
}

/**
 * 按状态筛选元素
 * @param {string} state - 状态（'固态', '液态', '气态'）
 * @returns {array|object} 筛选结果或错误对象
 */
function filterByState(state) {
  if (!state || typeof state !== 'string') {
    return {
      error: '状态必须为非空字符串',
      errorCode: 'INVALID_STATE'
    };
  }
  
  const validStates = ['固态', '液态', '气态'];
  if (!validStates.includes(state)) {
    return {
      error: `无效的状态: ${state}`,
      errorCode: 'INVALID_STATE',
      validStates,
      suggestion: '有效状态: ' + validStates.join(', ')
    };
  }
  
  return periodicElements.filter(e => e.state === state);
}

/**
 * 获取元素统计信息
 * @returns {object} 统计信息
 */
function getElementStatistics() {
  const stats = {
    total: periodicElements.length,
    byCategory: {},
    byState: {},
    massRange: {
      min: Infinity,
      max: -Infinity
    },
    electronegativityRange: {
      min: Infinity,
      max: -Infinity
    }
  };
  
  periodicElements.forEach(elem => {
    // 类别统计
    stats.byCategory[elem.category] = (stats.byCategory[elem.category] || 0) + 1;
    
    // 状态统计
    stats.byState[elem.state] = (stats.byState[elem.state] || 0) + 1;
    
    // 质量范围
    if (elem.atomicMass < stats.massRange.min) stats.massRange.min = elem.atomicMass;
    if (elem.atomicMass > stats.massRange.max) stats.massRange.max = elem.atomicMass;
    
    // 电负性范围
    if (elem.electronegativity !== null) {
      if (elem.electronegativity < stats.electronegativityRange.min) {
        stats.electronegativityRange.min = elem.electronegativity;
      }
      if (elem.electronegativity > stats.electronegativityRange.max) {
        stats.electronegativityRange.max = elem.electronegativity;
      }
    }
  });
  
  return stats;
}

const periodicElements = [
    {
      "number": 1,
      "symbol": "H",
      "name": "氢",
      "atomicMass": 1.008,
      "electronegativity": 2.2,
      "atomicRadius": 53.0,
      "ionizationEnergy": 1312.0,
      "meltingPoint": 14.01,
      "boilingPoint": 20.28,
      "state": "气态",
      "category": "nonmetal"
    },
    {
      "number": 2,
      "symbol": "He",
      "name": "氦",
      "atomicMass": 4.0026,
      "electronegativity": null,
      "atomicRadius": 31.0,
      "ionizationEnergy": 2372.0,
      "meltingPoint": 0.95,
      "boilingPoint": 4.22,
      "state": "气态",
      "category": "noble-gas"
    },
    {
      "number": 3,
      "symbol": "Li",
      "name": "锂",
      "atomicMass": 6.94,
      "electronegativity": 0.98,
      "atomicRadius": 167.0,
      "ionizationEnergy": 520.0,
      "meltingPoint": 453.69,
      "boilingPoint": 1615.0,
      "state": "固态",
      "category": "alkali"
    },
    {
      "number": 4,
      "symbol": "Be",
      "name": "铍",
      "atomicMass": 9.0122,
      "electronegativity": 1.57,
      "atomicRadius": 112.0,
      "ionizationEnergy": 899.0,
      "meltingPoint": 1560.0,
      "boilingPoint": 2742.0,
      "state": "固态",
      "category": "alkaline"
    },
    {
      "number": 5,
      "symbol": "B",
      "name": "硼",
      "atomicMass": 10.81,
      "electronegativity": 2.04,
      "atomicRadius": 87.0,
      "ionizationEnergy": 801.0,
      "meltingPoint": 2349.0,
      "boilingPoint": 4200.0,
      "state": "固态",
      "category": "metalloid"
    },
    {
      "number": 6,
      "symbol": "C",
      "name": "碳",
      "atomicMass": 12.011,
      "electronegativity": 2.55,
      "atomicRadius": 67.0,
      "ionizationEnergy": 1086.0,
      "meltingPoint": 3823.0,
      "boilingPoint": 4300.0,
      "state": "固态",
      "category": "nonmetal"
    },
    {
      "number": 7,
      "symbol": "N",
      "name": "氮",
      "atomicMass": 14.007,
      "electronegativity": 3.04,
      "atomicRadius": 56.0,
      "ionizationEnergy": 1402.0,
      "meltingPoint": 63.15,
      "boilingPoint": 77.36,
      "state": "气态",
      "category": "nonmetal"
    },
    {
      "number": 8,
      "symbol": "O",
      "name": "氧",
      "atomicMass": 15.999,
      "electronegativity": 3.44,
      "atomicRadius": 48.0,
      "ionizationEnergy": 1314.0,
      "meltingPoint": 54.36,
      "boilingPoint": 90.2,
      "state": "气态",
      "category": "nonmetal"
    },
    {
      "number": 9,
      "symbol": "F",
      "name": "氟",
      "atomicMass": 18.998,
      "electronegativity": 3.98,
      "atomicRadius": 42.0,
      "ionizationEnergy": 1681.0,
      "meltingPoint": 53.48,
      "boilingPoint": 85.03,
      "state": "气态",
      "category": "halogen"
    },
    {
      "number": 10,
      "symbol": "Ne",
      "name": "氖",
      "atomicMass": 20.18,
      "electronegativity": null,
      "atomicRadius": 38.0,
      "ionizationEnergy": 2080.0,
      "meltingPoint": 24.56,
      "boilingPoint": 27.07,
      "state": "气态",
      "category": "noble-gas"
    },
    {
      "number": 11,
      "symbol": "Na",
      "name": "钠",
      "atomicMass": 22.99,
      "electronegativity": 0.93,
      "atomicRadius": 190.0,
      "ionizationEnergy": 496.0,
      "meltingPoint": 370.87,
      "boilingPoint": 1156.0,
      "state": "固态",
      "category": "alkali"
    },
    {
      "number": 12,
      "symbol": "Mg",
      "name": "镁",
      "atomicMass": 24.305,
      "electronegativity": 1.31,
      "atomicRadius": 145.0,
      "ionizationEnergy": 738.0,
      "meltingPoint": 923.0,
      "boilingPoint": 1363.0,
      "state": "固态",
      "category": "alkaline"
    },
    {
      "number": 13,
      "symbol": "Al",
      "name": "铝",
      "atomicMass": 26.982,
      "electronegativity": 1.61,
      "atomicRadius": 118.0,
      "ionizationEnergy": 578.0,
      "meltingPoint": 933.47,
      "boilingPoint": 2792.0,
      "state": "固态",
      "category": "post-transition"
    },
    {
      "number": 14,
      "symbol": "Si",
      "name": "硅",
      "atomicMass": 28.085,
      "electronegativity": 1.9,
      "atomicRadius": 111.0,
      "ionizationEnergy": 786.0,
      "meltingPoint": 1687.0,
      "boilingPoint": 3538.0,
      "state": "固态",
      "category": "metalloid"
    },
    {
      "number": 15,
      "symbol": "P",
      "name": "磷",
      "atomicMass": 30.974,
      "electronegativity": 2.19,
      "atomicRadius": 98.0,
      "ionizationEnergy": 1012.0,
      "meltingPoint": 317.3,
      "boilingPoint": 553.7,
      "state": "固态",
      "category": "nonmetal"
    },
    {
      "number": 16,
      "symbol": "S",
      "name": "硫",
      "atomicMass": 32.06,
      "electronegativity": 2.58,
      "atomicRadius": 88.0,
      "ionizationEnergy": 999.0,
      "meltingPoint": 388.36,
      "boilingPoint": 717.8,
      "state": "固态",
      "category": "nonmetal"
    },
    {
      "number": 17,
      "symbol": "Cl",
      "name": "氯",
      "atomicMass": 35.45,
      "electronegativity": 3.16,
      "atomicRadius": 79.0,
      "ionizationEnergy": 1251.0,
      "meltingPoint": 171.6,
      "boilingPoint": 239.11,
      "state": "气态",
      "category": "halogen"
    },
    {
      "number": 18,
      "symbol": "Ar",
      "name": "氩",
      "atomicMass": 39.948,
      "electronegativity": null,
      "atomicRadius": 71.0,
      "ionizationEnergy": 1520.0,
      "meltingPoint": 83.81,
      "boilingPoint": 87.3,
      "state": "气态",
      "category": "noble-gas"
    },
    {
      "number": 19,
      "symbol": "K",
      "name": "钾",
      "atomicMass": 39.098,
      "electronegativity": 0.82,
      "atomicRadius": 243.0,
      "ionizationEnergy": 419.0,
      "meltingPoint": 336.53,
      "boilingPoint": 1032.0,
      "state": "固态",
      "category": "alkali"
    },
    {
      "number": 20,
      "symbol": "Ca",
      "name": "钙",
      "atomicMass": 40.078,
      "electronegativity": 1.0,
      "atomicRadius": 194.0,
      "ionizationEnergy": 590.0,
      "meltingPoint": 1115.0,
      "boilingPoint": 1757.0,
      "state": "固态",
      "category": "alkaline"
    },
    {
      "number": 21,
      "symbol": "Sc",
      "name": "钪",
      "atomicMass": 44.956,
      "electronegativity": 1.36,
      "atomicRadius": 184.0,
      "ionizationEnergy": 633.0,
      "meltingPoint": 1814.0,
      "boilingPoint": 3103.0,
      "state": "固态",
      "category": "transition"
    },
    {
      "number": 22,
      "symbol": "Ti",
      "name": "钛",
      "atomicMass": 47.867,
      "electronegativity": 1.54,
      "atomicRadius": 176.0,
      "ionizationEnergy": 658.0,
      "meltingPoint": 1941.0,
      "boilingPoint": 3560.0,
      "state": "固态",
      "category": "transition"
    },
    {
      "number": 23,
      "symbol": "V",
      "name": "钒",
      "atomicMass": 50.942,
      "electronegativity": 1.63,
      "atomicRadius": 171.0,
      "ionizationEnergy": 651.0,
      "meltingPoint": 2183.0,
      "boilingPoint": 3680.0,
      "state": "固态",
      "category": "transition"
    },
    {
      "number": 24,
      "symbol": "Cr",
      "name": "铬",
      "atomicMass": 51.996,
      "electronegativity": 1.66,
      "atomicRadius": 166.0,
      "ionizationEnergy": 653.0,
      "meltingPoint": 2180.0,
      "boilingPoint": 2944.0,
      "state": "固态",
      "category": "transition"
    },
    {
      "number": 25,
      "symbol": "Mn",
      "name": "锰",
      "atomicMass": 54.938,
      "electronegativity": 1.55,
      "atomicRadius": 161.0,
      "ionizationEnergy": 717.0,
      "meltingPoint": 1519.0,
      "boilingPoint": 2334.0,
      "state": "固态",
      "category": "transition"
    },
    {
      "number": 26,
      "symbol": "Fe",
      "name": "铁",
      "atomicMass": 55.845,
      "electronegativity": 1.83,
      "atomicRadius": 156.0,
      "ionizationEnergy": 759.0,
      "meltingPoint": 1811.0,
      "boilingPoint": 3134.0,
      "state": "固态",
      "category": "transition"
    },
    {
      "number": 27,
      "symbol": "Co",
      "name": "钴",
      "atomicMass": 58.933,
      "electronegativity": 1.88,
      "atomicRadius": 152.0,
      "ionizationEnergy": 760.0,
      "meltingPoint": 1768.0,
      "boilingPoint": 3200.0,
      "state": "固态",
      "category": "transition"
    },
    {
      "number": 28,
      "symbol": "Ni",
      "name": "镍",
      "atomicMass": 58.693,
      "electronegativity": 1.91,
      "atomicRadius": 149.0,
      "ionizationEnergy": 737.0,
      "meltingPoint": 1728.0,
      "boilingPoint": 3186.0,
      "state": "固态",
      "category": "transition"
    },
    {
      "number": 29,
      "symbol": "Cu",
      "name": "铜",
      "atomicMass": 63.546,
      "electronegativity": 1.9,
      "atomicRadius": 145.0,
      "ionizationEnergy": 745.0,
      "meltingPoint": 1357.77,
      "boilingPoint": 2835.0,
      "state": "固态",
      "category": "transition"
    },
    {
      "number": 30,
      "symbol": "Zn",
      "name": "锌",
      "atomicMass": 65.38,
      "electronegativity": 1.65,
      "atomicRadius": 142.0,
      "ionizationEnergy": 906.0,
      "meltingPoint": 692.68,
      "boilingPoint": 1180.0,
      "state": "固态",
      "category": "transition"
    },
    {
      "number": 31,
      "symbol": "Ga",
      "name": "镓",
      "atomicMass": 69.723,
      "electronegativity": 1.81,
      "atomicRadius": 136.0,
      "ionizationEnergy": 579.0,
      "meltingPoint": 302.91,
      "boilingPoint": 2477.0,
      "state": "固态",
      "category": "post-transition"
    },
    {
      "number": 32,
      "symbol": "Ge",
      "name": "锗",
      "atomicMass": 72.63,
      "electronegativity": 2.01,
      "atomicRadius": 125.0,
      "ionizationEnergy": 762.0,
      "meltingPoint": 1211.4,
      "boilingPoint": 3106.0,
      "state": "固态",
      "category": "metalloid"
    },
    {
      "number": 33,
      "symbol": "As",
      "name": "砷",
      "atomicMass": 74.922,
      "electronegativity": 2.18,
      "atomicRadius": 114.0,
      "ionizationEnergy": 947.0,
      "meltingPoint": 1090.0,
      "boilingPoint": 887.0,
      "state": "固态",
      "category": "metalloid"
    },
    {
      "number": 34,
      "symbol": "Se",
      "name": "硒",
      "atomicMass": 78.971,
      "electronegativity": 2.55,
      "atomicRadius": 103.0,
      "ionizationEnergy": 941.0,
      "meltingPoint": 494.0,
      "boilingPoint": 958.0,
      "state": "固态",
      "category": "nonmetal"
    },
    {
      "number": 35,
      "symbol": "Br",
      "name": "溴",
      "atomicMass": 79.904,
      "electronegativity": 2.96,
      "atomicRadius": 94.0,
      "ionizationEnergy": 1140.0,
      "meltingPoint": 265.8,
      "boilingPoint": 331.9,
      "state": "液态",
      "category": "halogen"
    },
    {
      "number": 36,
      "symbol": "Kr",
      "name": "氪",
      "atomicMass": 83.798,
      "electronegativity": null,
      "atomicRadius": 88.0,
      "ionizationEnergy": 1351.0,
      "meltingPoint": 115.78,
      "boilingPoint": 119.93,
      "state": "气态",
      "category": "noble-gas"
    },
    {
      "number": 37,
      "symbol": "Rb",
      "name": "铷",
      "atomicMass": 85.468,
      "electronegativity": 0.82,
      "atomicRadius": 265.0,
      "ionizationEnergy": 403.0,
      "meltingPoint": 312.46,
      "boilingPoint": 961.0,
      "state": "固态",
      "category": "alkali"
    },
    {
      "number": 38,
      "symbol": "Sr",
      "name": "锶",
      "atomicMass": 87.62,
      "electronegativity": 0.95,
      "atomicRadius": 219.0,
      "ionizationEnergy": 549.0,
      "meltingPoint": 1050.0,
      "boilingPoint": 1655.0,
      "state": "固态",
      "category": "alkaline"
    },
    {
      "number": 39,
      "symbol": "Y",
      "name": "钇",
      "atomicMass": 88.906,
      "electronegativity": 1.22,
      "atomicRadius": 212.0,
      "ionizationEnergy": 600.0,
      "meltingPoint": 1799.0,
      "boilingPoint": 3609.0,
      "state": "固态",
      "category": "transition"
    },
    {
      "number": 40,
      "symbol": "Zr",
      "name": "锆",
      "atomicMass": 91.224,
      "electronegativity": 1.33,
      "atomicRadius": 206.0,
      "ionizationEnergy": 640.0,
      "meltingPoint": 2128.0,
      "boilingPoint": 4682.0,
      "state": "固态",
      "category": "transition"
    },
    {
      "number": 41,
      "symbol": "Nb",
      "name": "铌",
      "atomicMass": 92.906,
      "electronegativity": 1.6,
      "atomicRadius": 198.0,
      "ionizationEnergy": 652.0,
      "meltingPoint": 2750.0,
      "boilingPoint": 5017.0,
      "state": "固态",
      "category": "transition"
    },
    {
      "number": 42,
      "symbol": "Mo",
      "name": "钼",
      "atomicMass": 95.95,
      "electronegativity": 2.16,
      "atomicRadius": 190.0,
      "ionizationEnergy": 684.0,
      "meltingPoint": 2896.0,
      "boilingPoint": 4912.0,
      "state": "固态",
      "category": "transition"
    },
    {
      "number": 43,
      "symbol": "Tc",
      "name": "锝",
      "atomicMass": 98.0,
      "electronegativity": null,
      "atomicRadius": 183.0,
      "ionizationEnergy": 702.0,
      "meltingPoint": 2430.0,
      "boilingPoint": 4538.0,
      "state": "固态",
      "category": "transition"
    },
    {
      "number": 44,
      "symbol": "Ru",
      "name": "钌",
      "atomicMass": 101.07,
      "electronegativity": 2.2,
      "atomicRadius": 178.0,
      "ionizationEnergy": 710.0,
      "meltingPoint": 2607.0,
      "boilingPoint": 4423.0,
      "state": "固态",
      "category": "transition"
    },
    {
      "number": 45,
      "symbol": "Rh",
      "name": "铑",
      "atomicMass": 102.91,
      "electronegativity": 2.28,
      "atomicRadius": 173.0,
      "ionizationEnergy": 720.0,
      "meltingPoint": 2237.0,
      "boilingPoint": 3968.0,
      "state": "固态",
      "category": "transition"
    },
    {
      "number": 46,
      "symbol": "Pd",
      "name": "钯",
      "atomicMass": 106.42,
      "electronegativity": 2.2,
      "atomicRadius": 169.0,
      "ionizationEnergy": 804.0,
      "meltingPoint": 1828.05,
      "boilingPoint": 3236.0,
      "state": "固态",
      "category": "transition"
    },
    {
      "number": 47,
      "symbol": "Ag",
      "name": "银",
      "atomicMass": 107.87,
      "electronegativity": 1.93,
      "atomicRadius": 165.0,
      "ionizationEnergy": 731.0,
      "meltingPoint": 1234.93,
      "boilingPoint": 2435.0,
      "state": "固态",
      "category": "transition"
    },
    {
      "number": 48,
      "symbol": "Cd",
      "name": "镉",
      "atomicMass": 112.41,
      "electronegativity": 1.69,
      "atomicRadius": 161.0,
      "ionizationEnergy": 868.0,
      "meltingPoint": 594.22,
      "boilingPoint": 1040.0,
      "state": "固态",
      "category": "transition"
    },
    {
      "number": 49,
      "symbol": "In",
      "name": "铟",
      "atomicMass": 114.82,
      "electronegativity": 1.78,
      "atomicRadius": 156.0,
      "ionizationEnergy": 558.0,
      "meltingPoint": 429.75,
      "boilingPoint": 2345.0,
      "state": "固态",
      "category": "post-transition"
    },
    {
      "number": 50,
      "symbol": "Sn",
      "name": "锡",
      "atomicMass": 118.71,
      "electronegativity": 1.96,
      "atomicRadius": 145.0,
      "ionizationEnergy": 709.0,
      "meltingPoint": 505.08,
      "boilingPoint": 2875.0,
      "state": "固态",
      "category": "post-transition"
    },
    {
      "number": 51,
      "symbol": "Sb",
      "name": "锑",
      "atomicMass": 121.76,
      "electronegativity": 2.05,
      "atomicRadius": 133.0,
      "ionizationEnergy": 834.0,
      "meltingPoint": 903.78,
      "boilingPoint": 1860.0,
      "state": "固态",
      "category": "metalloid"
    },
    {
      "number": 52,
      "symbol": "Te",
      "name": "碲",
      "atomicMass": 127.6,
      "electronegativity": 2.1,
      "atomicRadius": 123.0,
      "ionizationEnergy": 869.0,
      "meltingPoint": 722.66,
      "boilingPoint": 1261.0,
      "state": "固态",
      "category": "metalloid"
    },
    {
      "number": 53,
      "symbol": "I",
      "name": "碘",
      "atomicMass": 126.9,
      "electronegativity": 2.66,
      "atomicRadius": 115.0,
      "ionizationEnergy": 1008.0,
      "meltingPoint": 386.85,
      "boilingPoint": 457.4,
      "state": "固态",
      "category": "halogen"
    },
    {
      "number": 54,
      "symbol": "Xe",
      "name": "氙",
      "atomicMass": 131.29,
      "electronegativity": null,
      "atomicRadius": 108.0,
      "ionizationEnergy": 1170.0,
      "meltingPoint": 161.4,
      "boilingPoint": 165.1,
      "state": "气态",
      "category": "noble-gas"
    },
    {
      "number": 55,
      "symbol": "Cs",
      "name": "铯",
      "atomicMass": 132.91,
      "electronegativity": 0.79,
      "atomicRadius": 298.0,
      "ionizationEnergy": 376.0,
      "meltingPoint": 301.59,
      "boilingPoint": 944.0,
      "state": "固态",
      "category": "alkali"
    },
    {
      "number": 56,
      "symbol": "Ba",
      "name": "钡",
      "atomicMass": 137.33,
      "electronegativity": 0.89,
      "atomicRadius": 253.0,
      "ionizationEnergy": 503.0,
      "meltingPoint": 1000.0,
      "boilingPoint": 2170.0,
      "state": "固态",
      "category": "alkaline"
    },
    {
      "number": 57,
      "symbol": "La",
      "name": "镧",
      "atomicMass": 138.91,
      "electronegativity": 1.1,
      "atomicRadius": 240.0,
      "ionizationEnergy": 538.0,
      "meltingPoint": 1193.0,
      "boilingPoint": 3737.0,
      "state": "固态",
      "category": "lanthanoid"
    },
    {
      "number": 58,
      "symbol": "Ce",
      "name": "铈",
      "atomicMass": 140.12,
      "electronegativity": 1.12,
      "atomicRadius": 235.0,
      "ionizationEnergy": 534.0,
      "meltingPoint": 1071.0,
      "boilingPoint": 3716.0,
      "state": "固态",
      "category": "lanthanoid"
    },
    {
      "number": 59,
      "symbol": "Pr",
      "name": "镨",
      "atomicMass": 140.91,
      "electronegativity": 1.13,
      "atomicRadius": 239.0,
      "ionizationEnergy": 527.0,
      "meltingPoint": 1208.0,
      "boilingPoint": 3793.0,
      "state": "固态",
      "category": "lanthanoid"
    },
    {
      "number": 60,
      "symbol": "Nd",
      "name": "钕",
      "atomicMass": 144.24,
      "electronegativity": 1.14,
      "atomicRadius": 229.0,
      "ionizationEnergy": 533.0,
      "meltingPoint": 1297.0,
      "boilingPoint": 3347.0,
      "state": "固态",
      "category": "lanthanoid"
    },
    {
      "number": 61,
      "symbol": "Pm",
      "name": "钷",
      "atomicMass": 145.0,
      "electronegativity": null,
      "atomicRadius": 236.0,
      "ionizationEnergy": 540.0,
      "meltingPoint": 1315.0,
      "boilingPoint": 3273.0,
      "state": "固态",
      "category": "lanthanoid"
    },
    {
      "number": 62,
      "symbol": "Sm",
      "name": "钐",
      "atomicMass": 150.36,
      "electronegativity": 1.17,
      "atomicRadius": 229.0,
      "ionizationEnergy": 545.0,
      "meltingPoint": 1345.0,
      "boilingPoint": 2067.0,
      "state": "固态",
      "category": "lanthanoid"
    },
    {
      "number": 63,
      "symbol": "Eu",
      "name": "铕",
      "atomicMass": 151.96,
      "electronegativity": 1.2,
      "atomicRadius": 233.0,
      "ionizationEnergy": 547.0,
      "meltingPoint": 1095.0,
      "boilingPoint": 1802.0,
      "state": "固态",
      "category": "lanthanoid"
    },
    {
      "number": 64,
      "symbol": "Gd",
      "name": "钆",
      "atomicMass": 157.25,
      "electronegativity": 1.2,
      "atomicRadius": 233.0,
      "ionizationEnergy": 593.0,
      "meltingPoint": 1585.0,
      "boilingPoint": 3546.0,
      "state": "固态",
      "category": "lanthanoid"
    },
    {
      "number": 65,
      "symbol": "Tb",
      "name": "铽",
      "atomicMass": 158.93,
      "electronegativity": 1.2,
      "atomicRadius": 225.0,
      "ionizationEnergy": 566.0,
      "meltingPoint": 1629.0,
      "boilingPoint": 3503.0,
      "state": "固态",
      "category": "lanthanoid"
    },
    {
      "number": 66,
      "symbol": "Dy",
      "name": "镝",
      "atomicMass": 162.5,
      "electronegativity": 1.22,
      "atomicRadius": 228.0,
      "ionizationEnergy": 573.0,
      "meltingPoint": 1680.0,
      "boilingPoint": 2840.0,
      "state": "固态",
      "category": "lanthanoid"
    },
    {
      "number": 67,
      "symbol": "Ho",
      "name": "钬",
      "atomicMass": 164.93,
      "electronegativity": 1.23,
      "atomicRadius": 226.0,
      "ionizationEnergy": 581.0,
      "meltingPoint": 1734.0,
      "boilingPoint": 2993.0,
      "state": "固态",
      "category": "lanthanoid"
    },
    {
      "number": 68,
      "symbol": "Er",
      "name": "铒",
      "atomicMass": 167.26,
      "electronegativity": 1.24,
      "atomicRadius": 226.0,
      "ionizationEnergy": 589.0,
      "meltingPoint": 1802.0,
      "boilingPoint": 3141.0,
      "state": "固态",
      "category": "lanthanoid"
    },
    {
      "number": 69,
      "symbol": "Tm",
      "name": "铥",
      "atomicMass": 168.93,
      "electronegativity": 1.25,
      "atomicRadius": 222.0,
      "ionizationEnergy": 597.0,
      "meltingPoint": 1818.0,
      "boilingPoint": 2223.0,
      "state": "固态",
      "category": "lanthanoid"
    },
    {
      "number": 70,
      "symbol": "Yb",
      "name": "镱",
      "atomicMass": 173.05,
      "electronegativity": 1.1,
      "atomicRadius": 222.0,
      "ionizationEnergy": 603.0,
      "meltingPoint": 1097.0,
      "boilingPoint": 1469.0,
      "state": "固态",
      "category": "lanthanoid"
    },
    {
      "number": 71,
      "symbol": "Lu",
      "name": "镥",
      "atomicMass": 174.97,
      "electronegativity": 1.27,
      "atomicRadius": 217.0,
      "ionizationEnergy": 524.0,
      "meltingPoint": 1925.0,
      "boilingPoint": 3675.0,
      "state": "固态",
      "category": "lanthanoid"
    },
    {
      "number": 72,
      "symbol": "Hf",
      "name": "铪",
      "atomicMass": 178.49,
      "electronegativity": 1.3,
      "atomicRadius": 208.0,
      "ionizationEnergy": 659.0,
      "meltingPoint": 2506.0,
      "boilingPoint": 4876.0,
      "state": "固态",
      "category": "transition"
    },
    {
      "number": 73,
      "symbol": "Ta",
      "name": "钽",
      "atomicMass": 180.95,
      "electronegativity": 1.5,
      "atomicRadius": 200.0,
      "ionizationEnergy": 761.0,
      "meltingPoint": 3290.0,
      "boilingPoint": 5731.0,
      "state": "固态",
      "category": "transition"
    },
    {
      "number": 74,
      "symbol": "W",
      "name": "钨",
      "atomicMass": 183.84,
      "electronegativity": 2.36,
      "atomicRadius": 193.0,
      "ionizationEnergy": 770.0,
      "meltingPoint": 3695.0,
      "boilingPoint": 5828.0,
      "state": "固态",
      "category": "transition"
    },
    {
      "number": 75,
      "symbol": "Re",
      "name": "铼",
      "atomicMass": 186.21,
      "electronegativity": 1.9,
      "atomicRadius": 188.0,
      "ionizationEnergy": 760.0,
      "meltingPoint": 3459.0,
      "boilingPoint": 5869.0,
      "state": "固态",
      "category": "transition"
    },
    {
      "number": 76,
      "symbol": "Os",
      "name": "锇",
      "atomicMass": 190.23,
      "electronegativity": 2.2,
      "atomicRadius": 185.0,
      "ionizationEnergy": 840.0,
      "meltingPoint": 3306.0,
      "boilingPoint": 5285.0,
      "state": "固态",
      "category": "transition"
    },
    {
      "number": 77,
      "symbol": "Ir",
      "name": "铱",
      "atomicMass": 192.22,
      "electronegativity": 2.2,
      "atomicRadius": 180.0,
      "ionizationEnergy": 880.0,
      "meltingPoint": 2719.0,
      "boilingPoint": 4701.0,
      "state": "固态",
      "category": "transition"
    },
    {
      "number": 78,
      "symbol": "Pt",
      "name": "铂",
      "atomicMass": 195.08,
      "electronegativity": 2.28,
      "atomicRadius": 177.0,
      "ionizationEnergy": 871.0,
      "meltingPoint": 2041.4,
      "boilingPoint": 4098.0,
      "state": "固态",
      "category": "transition"
    },
    {
      "number": 79,
      "symbol": "Au",
      "name": "金",
      "atomicMass": 196.97,
      "electronegativity": 2.54,
      "atomicRadius": 174.0,
      "ionizationEnergy": 890.0,
      "meltingPoint": 1337.33,
      "boilingPoint": 3129.0,
      "state": "固态",
      "category": "transition"
    },
    {
      "number": 80,
      "symbol": "Hg",
      "name": "汞",
      "atomicMass": 200.59,
      "electronegativity": 2.0,
      "atomicRadius": 171.0,
      "ionizationEnergy": 1007.0,
      "meltingPoint": 234.32,
      "boilingPoint": 629.88,
      "state": "液态",
      "category": "transition"
    },
    {
      "number": 81,
      "symbol": "Tl",
      "name": "铊",
      "atomicMass": 204.38,
      "electronegativity": 1.62,
      "atomicRadius": 156.0,
      "ionizationEnergy": 589.0,
      "meltingPoint": 577.0,
      "boilingPoint": 1746.0,
      "state": "固态",
      "category": "post-transition"
    },
    {
      "number": 82,
      "symbol": "Pb",
      "name": "铅",
      "atomicMass": 207.2,
      "electronegativity": 1.87,
      "atomicRadius": 154.0,
      "ionizationEnergy": 716.0,
      "meltingPoint": 600.61,
      "boilingPoint": 2022.0,
      "state": "固态",
      "category": "post-transition"
    },
    {
      "number": 83,
      "symbol": "Bi",
      "name": "铋",
      "atomicMass": 208.98,
      "electronegativity": 2.02,
      "atomicRadius": 143.0,
      "ionizationEnergy": 703.0,
      "meltingPoint": 544.55,
      "boilingPoint": 1837.0,
      "state": "固态",
      "category": "post-transition"
    },
    {
      "number": 84,
      "symbol": "Po",
      "name": "钋",
      "atomicMass": 209.0,
      "electronegativity": 2.0,
      "atomicRadius": 135.0,
      "ionizationEnergy": 812.0,
      "meltingPoint": 527.0,
      "boilingPoint": 1235.0,
      "state": "固态",
      "category": "post-transition"
    },
    {
      "number": 85,
      "symbol": "At",
      "name": "砹",
      "atomicMass": 210.0,
      "electronegativity": 2.2,
      "atomicRadius": 127.0,
      "ionizationEnergy": 920.0,
      "meltingPoint": 575.0,
      "boilingPoint": 610.0,
      "state": "固态",
      "category": "halogen"
    },
    {
      "number": 86,
      "symbol": "Rn",
      "name": "氡",
      "atomicMass": 222.0,
      "electronegativity": null,
      "atomicRadius": 120.0,
      "ionizationEnergy": 1037.0,
      "meltingPoint": 202.0,
      "boilingPoint": 211.5,
      "state": "气态",
      "category": "noble-gas"
    },
    {
      "number": 87,
      "symbol": "Fr",
      "name": "钫",
      "atomicMass": 223.0,
      "electronegativity": 0.7,
      "atomicRadius": 348.0,
      "ionizationEnergy": 380.0,
      "meltingPoint": 300.0,
      "boilingPoint": 950.0,
      "state": "固态",
      "category": "alkali"
    },
    {
      "number": 88,
      "symbol": "Ra",
      "name": "镭",
      "atomicMass": 226.0,
      "electronegativity": 0.9,
      "atomicRadius": 283.0,
      "ionizationEnergy": 509.0,
      "meltingPoint": 973.0,
      "boilingPoint": 2010.0,
      "state": "固态",
      "category": "alkaline"
    },
    {
      "number": 89,
      "symbol": "Ac",
      "name": "锕",
      "atomicMass": 227.0,
      "electronegativity": 1.1,
      "atomicRadius": 260.0,
      "ionizationEnergy": 499.0,
      "meltingPoint": 1500.0,
      "boilingPoint": 3500.0,
      "state": "固态",
      "category": "actinoid"
    },
    {
      "number": 90,
      "symbol": "Th",
      "name": "钍",
      "atomicMass": 232.04,
      "electronegativity": 1.3,
      "atomicRadius": 238.0,
      "ionizationEnergy": 587.0,
      "meltingPoint": 2023.0,
      "boilingPoint": 5061.0,
      "state": "固态",
      "category": "actinoid"
    },
    {
      "number": 91,
      "symbol": "Pa",
      "name": "镤",
      "atomicMass": 231.04,
      "electronegativity": 1.5,
      "atomicRadius": 243.0,
      "ionizationEnergy": 568.0,
      "meltingPoint": 1841.0,
      "boilingPoint": 4300.0,
      "state": "固态",
      "category": "actinoid"
    },
    {
      "number": 92,
      "symbol": "U",
      "name": "铀",
      "atomicMass": 238.03,
      "electronegativity": 1.38,
      "atomicRadius": 240.0,
      "ionizationEnergy": 598.0,
      "meltingPoint": 1405.3,
      "boilingPoint": 4404.0,
      "state": "固态",
      "category": "actinoid"
    },
    {
      "number": 93,
      "symbol": "Np",
      "name": "镎",
      "atomicMass": 237.0,
      "electronegativity": 1.36,
      "atomicRadius": 221.0,
      "ionizationEnergy": 604.0,
      "meltingPoint": 917.0,
      "boilingPoint": 4175.0,
      "state": "固态",
      "category": "actinoid"
    },
    {
      "number": 94,
      "symbol": "Pu",
      "name": "钚",
      "atomicMass": 244.0,
      "electronegativity": 1.28,
      "atomicRadius": 243.0,
      "ionizationEnergy": 585.0,
      "meltingPoint": 912.5,
      "boilingPoint": 3505.0,
      "state": "固态",
      "category": "actinoid"
    },
    {
      "number": 95,
      "symbol": "Am",
      "name": "镅",
      "atomicMass": 243.0,
      "electronegativity": 1.3,
      "atomicRadius": 244.0,
      "ionizationEnergy": 578.0,
      "meltingPoint": 1449.0,
      "boilingPoint": 2880.0,
      "state": "固态",
      "category": "actinoid"
    },
    {
      "number": 96,
      "symbol": "Cm",
      "name": "锔",
      "atomicMass": 247.0,
      "electronegativity": 1.3,
      "atomicRadius": 245.0,
      "ionizationEnergy": 581.0,
      "meltingPoint": 1613.0,
      "boilingPoint": 3383.0,
      "state": "固态",
      "category": "actinoid"
    },
    {
      "number": 97,
      "symbol": "Bk",
      "name": "锫",
      "atomicMass": 247.0,
      "electronegativity": 1.3,
      "atomicRadius": 244.0,
      "ionizationEnergy": 601.0,
      "meltingPoint": 1259.0,
      "boilingPoint": 2900.0,
      "state": "固态",
      "category": "actinoid"
    },
    {
      "number": 98,
      "symbol": "Cf",
      "name": "锎",
      "atomicMass": 251.0,
      "electronegativity": 1.3,
      "atomicRadius": 245.0,
      "ionizationEnergy": 608.0,
      "meltingPoint": 1173.0,
      "boilingPoint": 1743.0,
      "state": "固态",
      "category": "actinoid"
    },
    {
      "number": 99,
      "symbol": "Es",
      "name": "锿",
      "atomicMass": 252.0,
      "electronegativity": 1.3,
      "atomicRadius": 245.0,
      "ionizationEnergy": 619.0,
      "meltingPoint": 1133.0,
      "boilingPoint": 1269.0,
      "state": "固态",
      "category": "actinoid"
    },
    {
      "number": 100,
      "symbol": "Fm",
      "name": "镄",
      "atomicMass": 257.0,
      "electronegativity": 1.3,
      "atomicRadius": 245.0,
      "ionizationEnergy": 627.0,
      "meltingPoint": 1125.0,
      "boilingPoint": 1260.0,
      "state": "固态",
      "category": "actinoid"
    },
    {
      "number": 101,
      "symbol": "Md",
      "name": "钔",
      "atomicMass": 258.0,
      "electronegativity": null,
      "atomicRadius": 246.0,
      "ionizationEnergy": 635.0,
      "meltingPoint": 1100.0,
      "boilingPoint": null,
      "state": "固态",
      "category": "actinoid"
    },
    {
      "number": 102,
      "symbol": "No",
      "name": "锘",
      "atomicMass": 259.0,
      "electronegativity": null,
      "atomicRadius": 247.0,
      "ionizationEnergy": 642.0,
      "meltingPoint": 1100.0,
      "boilingPoint": null,
      "state": "固态",
      "category": "actinoid"
    },
    {
      "number": 103,
      "symbol": "Lr",
      "name": "铹",
      "atomicMass": 262.0,
      "electronegativity": null,
      "atomicRadius": 246.0,
      "ionizationEnergy": 470.0,
      "meltingPoint": 1900.0,
      "boilingPoint": null,
      "state": "固态",
      "category": "actinoid"
    },
    {
      "number": 104,
      "symbol": "Rf",
      "name": "Rutherfordium",
      "atomicMass": 267.0,
      "electronegativity": null,
      "atomicRadius": null,
      "ionizationEnergy": null,
      "meltingPoint": null,
      "boilingPoint": null,
      "state": "未知",
      "category": "transition"
    },
    {
      "number": 105,
      "symbol": "Db",
      "name": "Dubnium",
      "atomicMass": 270.0,
      "electronegativity": null,
      "atomicRadius": null,
      "ionizationEnergy": null,
      "meltingPoint": null,
      "boilingPoint": null,
      "state": "未知",
      "category": "transition"
    },
    {
      "number": 106,
      "symbol": "Sg",
      "name": "Seaborgium",
      "atomicMass": 271.0,
      "electronegativity": null,
      "atomicRadius": null,
      "ionizationEnergy": null,
      "meltingPoint": null,
      "boilingPoint": null,
      "state": "未知",
      "category": "transition"
    },
    {
      "number": 107,
      "symbol": "Bh",
      "name": "Bohrium",
      "atomicMass": 270.0,
      "electronegativity": null,
      "atomicRadius": null,
      "ionizationEnergy": null,
      "meltingPoint": null,
      "boilingPoint": null,
      "state": "未知",
      "category": "transition"
    },
    {
      "number": 108,
      "symbol": "Hs",
      "name": "Hassium",
      "atomicMass": 277.0,
      "electronegativity": null,
      "atomicRadius": null,
      "ionizationEnergy": null,
      "meltingPoint": null,
      "boilingPoint": null,
      "state": "未知",
      "category": "transition"
    },
    {
      "number": 109,
      "symbol": "Mt",
      "name": "Meitnerium",
      "atomicMass": 278.0,
      "electronegativity": null,
      "atomicRadius": null,
      "ionizationEnergy": null,
      "meltingPoint": null,
      "boilingPoint": null,
      "state": "未知",
      "category": "transition"
    },
    {
      "number": 110,
      "symbol": "Ds",
      "name": "Darmstadtium",
      "atomicMass": 281.0,
      "electronegativity": null,
      "atomicRadius": null,
      "ionizationEnergy": null,
      "meltingPoint": null,
      "boilingPoint": null,
      "state": "未知",
      "category": "transition"
    },
    {
      "number": 111,
      "symbol": "Rg",
      "name": "Roentgenium",
      "atomicMass": 282.0,
      "electronegativity": null,
      "atomicRadius": null,
      "ionizationEnergy": null,
      "meltingPoint": null,
      "boilingPoint": null,
      "state": "未知",
      "category": "transition"
    },
    {
      "number": 112,
      "symbol": "Cn",
      "name": "Copernicium",
      "atomicMass": 285.0,
      "electronegativity": null,
      "atomicRadius": null,
      "ionizationEnergy": null,
      "meltingPoint": null,
      "boilingPoint": null,
      "state": "未知",
      "category": "transition"
    },
    {
      "number": 113,
      "symbol": "Nh",
      "name": "Nihonium",
      "atomicMass": 286.0,
      "electronegativity": null,
      "atomicRadius": null,
      "ionizationEnergy": null,
      "meltingPoint": null,
      "boilingPoint": null,
      "state": "未知",
      "category": "post-transition"
    },
    {
      "number": 114,
      "symbol": "Fl",
      "name": "Flerovium",
      "atomicMass": 289.0,
      "electronegativity": null,
      "atomicRadius": null,
      "ionizationEnergy": null,
      "meltingPoint": null,
      "boilingPoint": null,
      "state": "未知",
      "category": "post-transition"
    },
    {
      "number": 115,
      "symbol": "Mc",
      "name": "Moscovium",
      "atomicMass": 290.0,
      "electronegativity": null,
      "atomicRadius": null,
      "ionizationEnergy": null,
      "meltingPoint": null,
      "boilingPoint": null,
      "state": "未知",
      "category": "post-transition"
    },
    {
      "number": 116,
      "symbol": "Lv",
      "name": "Livermorium",
      "atomicMass": 293.0,
      "electronegativity": null,
      "atomicRadius": null,
      "ionizationEnergy": null,
      "meltingPoint": null,
      "boilingPoint": null,
      "state": "未知",
      "category": "post-transition"
    },
    {
      "number": 117,
      "symbol": "Ts",
      "name": "Tennessine",
      "atomicMass": 294.0,
      "electronegativity": null,
      "atomicRadius": null,
      "ionizationEnergy": null,
      "meltingPoint": null,
      "boilingPoint": null,
      "state": "未知",
      "category": "halogen"
    },
    {
      "number": 118,
      "symbol": "Og",
      "name": "Oganesson",
      "atomicMass": 294.0,
      "electronegativity": null,
      "atomicRadius": null,
      "ionizationEnergy": null,
      "meltingPoint": null,
      "boilingPoint": null,
      "state": "气态",
      "category": "noble-gas"
    }
  ];



const tableLayout = [
  [1,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,2],
  [3,4,null,null,null,null,null,null,null,null,null,null,5,6,7,8,9,10],
  [11,12,null,null,null,null,null,null,null,null,null,null,13,14,15,16,17,18],
  [19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36],
  [37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54],
  [55,56,57,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86],
  [87,88,89,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118],
  [null,null,null,58,59,60,61,62,63,64,65,66,67,68,69,70,71,null],
  [null,null,null,90,91,92,93,94,95,96,97,98,99,100,101,102,103,null]
];



const categoryLabels = {
  "alkali": "碱金属",
  "alkaline": "碱土金属",
  "transition": "过渡金属",
  "post-transition": "后过渡金属",
  "metalloid": "类金属",
  "nonmetal": "非金属",
  "halogen": "卤素",
  "noble-gas": "稀有气体",
  "lanthanoid": "镧系元素",
  "actinoid": "锕系元素"
};



module.exports = { 
  // 数据
  periodicElements, 
  tableLayout, 
  categoryLabels,
  
  // 元数据
  getMetadata,
  
  // 查询函数
  getElementById,
  getElementBySymbol,
  getElementByName,
  
  // 筛选函数
  filterByCategory,
  filterByState,
  
  // 统计函数
  getElementStatistics
};
