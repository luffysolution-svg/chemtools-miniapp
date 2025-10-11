// 单位换算工具
// 数据来源：国际单位制（SI）、CODATA 2018推荐值

// 元数据
const METADATA = {
  version: '1.0.0',
  lastUpdated: '2025-10-10',
  sources: {
    si_units: '国际计量局（BIPM）- 国际单位制（SI）第9版（2019）',
    constants: 'CODATA 2018推荐值',
    pressure: 'ISO 80000-4:2019（压力单位）',
    energy: 'NIST Physical Measurement Laboratory',
    citation: 'SI Brochure, 9th edition (2019), BIPM'
  },
  precision: {
    length: '精确定义',
    mass: '精确定义',
    volume: '精确定义',
    pressure: '精确定义',
    energy: '±1e-19 J（电子伏）',
    temperature: '依赖于测量精度'
  },
  applicableRange: {
    value: '1e-100 < v < 1e100',
    temperature: '-273.15°C < T < 1e6 K'
  }
};

// 单位换算系数（相对于SI基本单位）
const conversions = {
  长度: { 
    米: { factor: 1, symbol: 'm', definition: 'SI基本单位' },
    厘米: { factor: 0.01, symbol: 'cm', definition: '1/100米' },
    毫米: { factor: 0.001, symbol: 'mm', definition: '1/1000米' },
    微米: { factor: 1e-6, symbol: 'μm', definition: '10⁻⁶米' },
    纳米: { factor: 1e-9, symbol: 'nm', definition: '10⁻⁹米' },
    埃: { factor: 1e-10, symbol: 'Å', definition: '10⁻¹⁰米（晶体学常用）' },
    皮米: { factor: 1e-12, symbol: 'pm', definition: '10⁻¹²米（原子尺度）' },
    千米: { factor: 1000, symbol: 'km', definition: '1000米' }
  },
  质量: { 
    千克: { factor: 1, symbol: 'kg', definition: 'SI基本单位' },
    克: { factor: 1e-3, symbol: 'g', definition: '1/1000千克' },
    毫克: { factor: 1e-6, symbol: 'mg', definition: '10⁻⁶千克' },
    微克: { factor: 1e-9, symbol: 'μg', definition: '10⁻⁹千克' },
    吨: { factor: 1000, symbol: 't', definition: '1000千克' },
    原子质量单位: { factor: 1.66053906660e-27, symbol: 'u', definition: '¹²C原子质量的1/12' }
  },
  体积: { 
    立方米: { factor: 1, symbol: 'm³', definition: 'SI导出单位' },
    升: { factor: 1e-3, symbol: 'L', definition: '10⁻³立方米' },
    毫升: { factor: 1e-6, symbol: 'mL', definition: '10⁻⁶立方米 = 1 cm³' },
    微升: { factor: 1e-9, symbol: 'μL', definition: '10⁻⁹立方米' }
  },
  压力: { 
    帕: { factor: 1, symbol: 'Pa', definition: 'SI导出单位（1 Pa = 1 N/m²）' },
    千帕: { factor: 1e3, symbol: 'kPa', definition: '10³帕' },
    兆帕: { factor: 1e6, symbol: 'MPa', definition: '10⁶帕' },
    吉帕: { factor: 1e9, symbol: 'GPa', definition: '10⁹帕（材料科学常用）' },
    巴: { factor: 1e5, symbol: 'bar', definition: '10⁵帕（常用单位）' },
    标准大气压: { factor: 101325, symbol: 'atm', definition: '101325 Pa（精确定义）' },
    毫米汞柱: { factor: 133.322387415, symbol: 'mmHg', definition: '约133.322 Pa' },
    托: { factor: 133.322387415, symbol: 'Torr', definition: '1/760 atm' }
  },
  能量: { 
    焦耳: { factor: 1, symbol: 'J', definition: 'SI导出单位（1 J = 1 N·m）' },
    千焦: { factor: 1e3, symbol: 'kJ', definition: '10³焦耳' },
    兆焦: { factor: 1e6, symbol: 'MJ', definition: '10⁶焦耳' },
    卡路里: { factor: 4.184, symbol: 'cal', definition: '4.184焦耳（精确定义）' },
    千卡: { factor: 4184, symbol: 'kcal', definition: '4184焦耳' },
    电子伏: { factor: 1.602176634e-19, symbol: 'eV', definition: '1.602176634×10⁻¹⁹ J（精确）' },
    千电子伏: { factor: 1.602176634e-16, symbol: 'keV', definition: '10³ eV' },
    兆电子伏: { factor: 1.602176634e-13, symbol: 'MeV', definition: '10⁶ eV' }
  },
  温度: { 
    摄氏度: { type: 'C', definition: 'T(°C) = T(K) - 273.15' },
    华氏度: { type: 'F', definition: 'T(°F) = T(°C) × 9/5 + 32' },
    开尔文: { type: 'K', definition: 'SI基本单位，热力学温度' }
  },
  摩尔浓度: {
    摩尔每升: { factor: 1, symbol: 'mol/L', definition: '摩尔浓度（M）' },
    毫摩尔每升: { factor: 1e-3, symbol: 'mmol/L', definition: '10⁻³ mol/L' },
    微摩尔每升: { factor: 1e-6, symbol: 'μmol/L', definition: '10⁻⁶ mol/L' }
  },
  时间: {
    秒: { factor: 1, symbol: 's', definition: 'SI基本单位' },
    分钟: { factor: 60, symbol: 'min', definition: '60秒' },
    小时: { factor: 3600, symbol: 'h', definition: '3600秒' },
    天: { factor: 86400, symbol: 'd', definition: '86400秒' }
  }
};

/**
 * 获取所有可用的单位类别
 * @returns {Array} 类别名称数组
 */
function getCategories() {
  return Object.keys(conversions);
}

/**
 * 获取指定类别的所有单位
 * @param {string} category - 类别名称
 * @returns {Array|object} 单位名称数组或错误对象
 */
function getUnits(category) {
  if (!conversions[category]) {
    return {
      error: `无效的单位类别: ${category}`,
      errorCode: 'INVALID_CATEGORY',
      validCategories: getCategories()
    };
  }
  
  return Object.keys(conversions[category]);
}

/**
 * 获取单位详细信息
 * @param {string} category - 类别名称
 * @param {string} unit - 单位名称
 * @returns {object} 单位信息或错误对象
 */
function getUnitInfo(category, unit) {
  if (!conversions[category]) {
    return {
      error: `无效的单位类别: ${category}`,
      errorCode: 'INVALID_CATEGORY'
    };
  }
  
  if (!conversions[category][unit]) {
    return {
      error: `类别 "${category}" 中不存在单位 "${unit}"`,
      errorCode: 'INVALID_UNIT',
      validUnits: getUnits(category)
    };
  }
  
  return conversions[category][unit];
}

/**
 * 单位换算（非温度）
 * @param {number} value - 数值
 * @param {string} category - 类别名称
 * @param {string} fromUnit - 源单位
 * @param {string} toUnit - 目标单位
 * @returns {object} { result, unit, formula } 或错误对象
 */
function convert(value, category, fromUnit, toUnit) {
  const val = Number(value);
  
  // 验证输入值
  if (!Number.isFinite(val)) {
    return {
      error: '输入值必须为有效数字',
      errorCode: 'INVALID_NUMBER',
      received: value
    };
  }
  
  // 验证类别
  if (!conversions[category]) {
    return {
      error: `无效的单位类别: ${category}`,
      errorCode: 'INVALID_CATEGORY',
      validCategories: getCategories()
    };
  }
  
  // 特殊处理：温度
  if (category === '温度') {
    return convertTemperature(val, fromUnit, toUnit);
  }
  
  // 验证单位
  if (!conversions[category][fromUnit]) {
    return {
      error: `类别 "${category}" 中不存在源单位 "${fromUnit}"`,
      errorCode: 'INVALID_FROM_UNIT',
      validUnits: getUnits(category)
    };
  }
  
  if (!conversions[category][toUnit]) {
    return {
      error: `类别 "${category}" 中不存在目标单位 "${toUnit}"`,
      errorCode: 'INVALID_TO_UNIT',
      validUnits: getUnits(category)
    };
  }
  
  // 范围检查
  if (Math.abs(val) > 1e100) {
    return {
      error: '输入值超出合理范围',
      errorCode: 'OUT_OF_RANGE',
      validRange: '-1e100 < v < 1e100',
      received: val
    };
  }
  
  // 执行换算
  const fromFactor = conversions[category][fromUnit].factor;
  const toFactor = conversions[category][toUnit].factor;
  const result = val * (fromFactor / toFactor);
  
  // 结果合理性检查
  if (!Number.isFinite(result)) {
    return {
      error: '计算结果溢出或无效',
      errorCode: 'CALCULATION_OVERFLOW',
      inputs: { value: val, from: fromUnit, to: toUnit }
    };
  }
  
  return {
    result: parseFloat(result.toExponential(6)),  // 保留6位有效数字
    unit: toUnit,
    symbol: conversions[category][toUnit].symbol,
    formula: `${val} ${fromUnit} = ${result.toExponential(6)} ${toUnit}`,
    precision: category === '能量' && toUnit === '电子伏' ? '±1e-19 J' : '精确'
  };
}

/**
 * 温度换算
 * @param {number} value - 温度值
 * @param {string} fromUnit - 源单位
 * @param {string} toUnit - 目标单位
 * @returns {object} { result, unit, formula } 或错误对象
 */
function convertTemperature(value, fromUnit, toUnit) {
  const val = Number(value);
  
  if (!Number.isFinite(val)) {
    return {
      error: '温度值必须为有效数字',
      errorCode: 'INVALID_NUMBER'
    };
  }
  
  const tempUnits = conversions['温度'];
  if (!tempUnits[fromUnit] || !tempUnits[toUnit]) {
    return {
      error: '无效的温度单位',
      errorCode: 'INVALID_TEMPERATURE_UNIT',
      validUnits: Object.keys(tempUnits)
    };
  }
  
  // 转换为开尔文作为中间单位
  let kelvin;
  
  switch (fromUnit) {
    case '摄氏度':
      if (val < -273.15) {
        return {
          error: '温度不能低于绝对零度（-273.15°C）',
          errorCode: 'BELOW_ABSOLUTE_ZERO',
          received: val
        };
      }
      kelvin = val + 273.15;
      break;
    case '华氏度':
      const celsius = (val - 32) * 5 / 9;
      if (celsius < -273.15) {
        return {
          error: '温度不能低于绝对零度（-459.67°F）',
          errorCode: 'BELOW_ABSOLUTE_ZERO',
          received: val
        };
      }
      kelvin = celsius + 273.15;
      break;
    case '开尔文':
      if (val < 0) {
        return {
          error: '开尔文温度不能为负数',
          errorCode: 'NEGATIVE_KELVIN',
          received: val
        };
      }
      kelvin = val;
      break;
    default:
      return { error: '不支持的温度单位', errorCode: 'UNSUPPORTED_UNIT' };
  }
  
  // 从开尔文转换到目标单位
  let result;
  let formula;
  
  switch (toUnit) {
    case '摄氏度':
      result = kelvin - 273.15;
      formula = `T(°C) = T(K) - 273.15 = ${result.toFixed(2)}°C`;
      break;
    case '华氏度':
      const c = kelvin - 273.15;
      result = c * 9 / 5 + 32;
      formula = `T(°F) = T(°C) × 9/5 + 32 = ${result.toFixed(2)}°F`;
      break;
    case '开尔文':
      result = kelvin;
      formula = `T(K) = ${result.toFixed(2)} K`;
      break;
    default:
      return { error: '不支持的温度单位', errorCode: 'UNSUPPORTED_UNIT' };
  }
  
  return {
    result: parseFloat(result.toFixed(4)),
    unit: toUnit,
    symbol: toUnit === '摄氏度' ? '°C' : (toUnit === '华氏度' ? '°F' : 'K'),
    formula,
    precision: '±0.01',
    note: fromUnit !== toUnit ? `原始值: ${val} ${fromUnit}` : null
  };
}

/**
 * 批量换算（同一类别多个单位）
 * @param {number} value - 数值
 * @param {string} category - 类别名称
 * @param {string} fromUnit - 源单位
 * @param {Array} toUnits - 目标单位数组
 * @returns {object} 换算结果对象或错误对象
 */
function convertMultiple(value, category, fromUnit, toUnits) {
  if (!Array.isArray(toUnits)) {
    return {
      error: '目标单位必须为数组',
      errorCode: 'INVALID_TO_UNITS_TYPE'
    };
  }
  
  const results = {};
  const errors = [];
  
  for (const toUnit of toUnits) {
    const result = convert(value, category, fromUnit, toUnit);
    if (result.error) {
      errors.push({ unit: toUnit, error: result.error });
    } else {
      results[toUnit] = result.result;
    }
  }
  
  if (errors.length > 0 && Object.keys(results).length === 0) {
    return {
      error: '所有单位换算均失败',
      errorCode: 'ALL_CONVERSIONS_FAILED',
      details: errors
    };
  }
  
  return {
    results,
    errors: errors.length > 0 ? errors : undefined,
    sourceValue: value,
    sourceUnit: fromUnit,
    category
  };
}

/**
 * 获取模块元数据
 * @returns {object} 元数据对象
 */
function getMetadata() {
  return METADATA;
}

module.exports = { 
  // 数据
  conversions,
  
  // 元数据
  getMetadata,
  
  // 查询函数
  getCategories,
  getUnits,
  getUnitInfo,
  
  // 换算函数
  convert,
  convertTemperature,
  convertMultiple
};
