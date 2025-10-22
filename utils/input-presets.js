/**
 * 输入预设值配置
 * 为各个工具定义常用的快捷输入值
 * Version: 2.0.0 - 完整版
 * 更新日期：2025-10-21
 * 
 * 使用说明：
 * 1. 调用 getPresets(toolType, field) 获取特定工具和字段的预设值
 * 2. 调用 getCommonPresets(type) 获取通用预设值（如温度、浓度）
 * 3. 每个工具可以定义多个字段的预设值
 * 4. 预设值格式：{ label: '显示文本', value: '实际值' }
 */

const INPUT_PRESETS = {
  // ========== 基础工具 ==========
  
  // 单位换算
  unit: {
    value: [
      { label: '1', value: '1' },
      { label: '10', value: '10' },
      { label: '100', value: '100' },
      { label: '1000', value: '1000' }
    ]
  },

  // pH计算
  ph: {
    concentration: [
      { label: '强酸 (1)', value: '1' },
      { label: '中性 (7)', value: '7' },
      { label: '强碱 (14)', value: '14' },
      { label: '0.1 M', value: '0.1' },
      { label: '0.01 M', value: '0.01' }
    ],
    phValue: [
      { label: '1', value: '1' },
      { label: '7', value: '7' },
      { label: '14', value: '14' }
    ]
  },

  // 摩尔质量计算
  molar: {
    formula: [
      { label: 'H₂O', value: 'H2O' },
      { label: 'CO₂', value: 'CO2' },
      { label: 'NaCl', value: 'NaCl' },
      { label: 'H₂SO₄', value: 'H2SO4' },
      { label: 'CaCO₃', value: 'CaCO3' },
      { label: 'Al₂O₃', value: 'Al2O3' },
      { label: 'KMnO₄', value: 'KMnO4' },
      { label: 'C₆H₁₂O₆', value: 'C6H12O6' }
    ],
    mass: [
      { label: '1 g', value: '1' },
      { label: '10 g', value: '10' },
      { label: '100 g', value: '100' }
    ],
    moles: [
      { label: '0.1 mol', value: '0.1' },
      { label: '1 mol', value: '1' },
      { label: '10 mol', value: '10' }
    ]
  },

  // 溶液配制
  solution: {
    concentration: [
      { label: '0.1 M', value: '0.1' },
      { label: '0.5 M', value: '0.5' },
      { label: '1.0 M', value: '1.0' },
      { label: '2.0 M', value: '2.0' }
    ],
    volume: [
      { label: '10 mL', value: '10' },
      { label: '25 mL', value: '25' },
      { label: '50 mL', value: '50' },
      { label: '100 mL', value: '100' },
      { label: '250 mL', value: '250' },
      { label: '500 mL', value: '500' }
    ]
  },

  // ========== 高级工具 ==========
  
  // XRD分析
  xrd: {
    wavelength: [
      { label: 'Cu Kα (1.5406 Å)', value: '1.5406' },
      { label: 'Cu Kα₁ (1.54056 Å)', value: '1.54056' },
      { label: 'Mo Kα (0.7107 Å)', value: '0.7107' },
      { label: 'Co Kα (1.7889 Å)', value: '1.7889' },
      { label: 'Fe Kα (1.9373 Å)', value: '1.9373' }
    ],
    angle: [
      { label: '20°', value: '20' },
      { label: '30°', value: '30' },
      { label: '40°', value: '40' },
      { label: '50°', value: '50' },
      { label: '60°', value: '60' }
    ],
    dValue: [
      { label: '3.0 Å', value: '3.0' },
      { label: '2.5 Å', value: '2.5' },
      { label: '2.0 Å', value: '2.0' }
    ]
  },

  // 电化学计算
  electrochem: {
    potential: [
      { label: '0 V', value: '0' },
      { label: '0.5 V', value: '0.5' },
      { label: '1.0 V', value: '1.0' },
      { label: '-0.5 V', value: '-0.5' }
    ],
    temperature: [
      { label: '0°C', value: '0' },
      { label: '25°C', value: '25' },
      { label: '100°C', value: '100' }
    ],
    electronNum: [
      { label: '1', value: '1' },
      { label: '2', value: '2' },
      { label: '3', value: '3' }
    ]
  },

  // 光催化计算
  photocatalysis: {
    wavelength: [
      { label: 'UV (365 nm)', value: '365' },
      { label: '蓝光 (450 nm)', value: '450' },
      { label: '绿光 (550 nm)', value: '550' },
      { label: '红光 (650 nm)', value: '650' }
    ],
    power: [
      { label: '100 mW/cm²', value: '100' },
      { label: '300 mW/cm²', value: '300' },
      { label: '1000 mW/cm²', value: '1000' }
    ]
  },

  // 溶度积计算
  ksp: {
    concentration: [
      { label: '1×10⁻⁵ M', value: '1e-5' },
      { label: '1×10⁻⁶ M', value: '1e-6' },
      { label: '1×10⁻⁷ M', value: '1e-7' }
    ]
  },

  // 配位化学
  complexation: {
    coordinationNumber: [
      { label: '2', value: '2' },
      { label: '4', value: '4' },
      { label: '6', value: '6' }
    ]
  },

  // 动力学计算
  kinetics: {
    temperature: [
      { label: '273 K (0°C)', value: '273' },
      { label: '298 K (25°C)', value: '298' },
      { label: '373 K (100°C)', value: '373' }
    ],
    order: [
      { label: '0级', value: '0' },
      { label: '1级', value: '1' },
      { label: '2级', value: '2' }
    ]
  },

  // 热力学计算
  thermodynamics: {
    temperature: [
      { label: '298 K', value: '298' },
      { label: '273 K', value: '273' },
      { label: '373 K', value: '373' }
    ],
    pressure: [
      { label: '1 atm', value: '1' },
      { label: '1 bar', value: '1' },
      { label: '101325 Pa', value: '101325' }
    ]
  },

  // 电池计算
  battery: {
    voltage: [
      { label: '1.5 V', value: '1.5' },
      { label: '3.7 V', value: '3.7' },
      { label: '12 V', value: '12' }
    ],
    capacity: [
      { label: '1000 mAh', value: '1000' },
      { label: '2000 mAh', value: '2000' },
      { label: '3000 mAh', value: '3000' }
    ]
  },

  // ========== 材料工具 ==========
  
  // BET分析
  bet: {
    pressure: [
      { label: '0.1', value: '0.1' },
      { label: '0.2', value: '0.2' },
      { label: '0.3', value: '0.3' }
    ],
    volume: [
      { label: '100 cm³', value: '100' },
      { label: '200 cm³', value: '200' }
    ]
  },

  // 晶体计算
  crystal: {
    latticeParameter: [
      { label: '3 Å', value: '3' },
      { label: '4 Å', value: '4' },
      { label: '5 Å', value: '5' }
    ]
  },

  // 电学性质
  electrical: {
    conductivity: [
      { label: '1 S/m', value: '1' },
      { label: '10 S/m', value: '10' },
      { label: '100 S/m', value: '100' }
    ],
    mobility: [
      { label: '1 cm²/V·s', value: '1' },
      { label: '10 cm²/V·s', value: '10' },
      { label: '100 cm²/V·s', value: '100' }
    ]
  },

  // 光学性质
  optical: {
    refractiveIndex: [
      { label: '1.0 (空气)', value: '1.0' },
      { label: '1.33 (水)', value: '1.33' },
      { label: '1.5 (玻璃)', value: '1.5' }
    ],
    wavelength: [
      { label: '400 nm', value: '400' },
      { label: '550 nm', value: '550' },
      { label: '700 nm', value: '700' }
    ]
  },

  // 有机材料
  organic: {
    energyLevel: [
      { label: '-3.0 eV', value: '-3.0' },
      { label: '-5.0 eV', value: '-5.0' },
      { label: '-6.0 eV', value: '-6.0' }
    ]
  },

  // ========== 光谱工具 ==========
  
  // XPS
  xps: {
    bindingEnergy: [
      { label: '284.8 eV (C 1s)', value: '284.8' },
      { label: '532 eV (O 1s)', value: '532' },
      { label: '400 eV (N 1s)', value: '400' }
    ]
  },

  // Raman
  raman: {
    shift: [
      { label: '500 cm⁻¹', value: '500' },
      { label: '1000 cm⁻¹', value: '1000' },
      { label: '1500 cm⁻¹', value: '1500' }
    ]
  },

  // NMR
  nmr: {
    chemicalShift: [
      { label: '0 ppm (TMS)', value: '0' },
      { label: '7.26 ppm (CDCl₃)', value: '7.26' },
      { label: '2.50 ppm (DMSO)', value: '2.50' }
    ]
  },

  // UV-Vis
  uvvis: {
    wavelength: [
      { label: '200 nm', value: '200' },
      { label: '400 nm', value: '400' },
      { label: '600 nm', value: '600' },
      { label: '800 nm', value: '800' }
    ],
    absorbance: [
      { label: '0.1', value: '0.1' },
      { label: '0.5', value: '0.5' },
      { label: '1.0', value: '1.0' }
    ]
  },

  // ========== 其他工具 ==========
  
  // 溶剂选择器
  solvent: {
    polarity: [
      { label: '低极性', value: '0.1' },
      { label: '中极性', value: '0.5' },
      { label: '高极性', value: '0.9' }
    ]
  },

  // 误差传播
  error: {
    uncertainty: [
      { label: '±0.1', value: '0.1' },
      { label: '±0.5', value: '0.5' },
      { label: '±1.0', value: '1.0' }
    ]
  },

  // 通用温度预设
  temperature: [
    { label: '0°C (冰点)', value: '0' },
    { label: '25°C (室温)', value: '25' },
    { label: '100°C (沸点)', value: '100' },
    { label: '273 K', value: '273' },
    { label: '298 K', value: '298' },
    { label: '373 K', value: '373' }
  ],

  // 通用浓度预设
  concentration: [
    { label: '0.01 M', value: '0.01' },
    { label: '0.1 M', value: '0.1' },
    { label: '1 M', value: '1' },
    { label: '10 M', value: '10' }
  ]
};

/**
 * 获取指定工具和字段的预设值
 * @param {string} toolType - 工具类型
 * @param {string} field - 字段名
 * @returns {Array} 预设值数组
 */
function getPresets(toolType, field = 'default') {
  if (!INPUT_PRESETS[toolType]) {
    return [];
  }
  
  if (field === 'default' || !INPUT_PRESETS[toolType][field]) {
    // 如果没有指定字段，返回第一个可用的预设
    const firstKey = Object.keys(INPUT_PRESETS[toolType])[0];
    return INPUT_PRESETS[toolType][firstKey] || [];
  }
  
  return INPUT_PRESETS[toolType][field] || [];
}

/**
 * 获取通用预设值（如温度、浓度等）
 * @param {string} type - 预设类型
 * @returns {Array} 预设值数组
 */
function getCommonPresets(type) {
  return INPUT_PRESETS[type] || [];
}

module.exports = {
  INPUT_PRESETS,
  getPresets,
  getCommonPresets
};

