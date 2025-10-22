// UTF-8, no BOM
// 误差传递计算工具
// 数据来源：误差分析基础理论

const METADATA = {
  version: '1.0.0',
  lastUpdated: '2025-10-18',
  sources: {
    theory: 'John R. Taylor, An Introduction to Error Analysis, 2nd Edition',
    standard: 'GUM (Guide to the Expression of Uncertainty in Measurement)'
  },
  precision: {
    relativeError: '4位有效数字',
    absoluteError: '根据输入精度'
  },
  applicableRange: {
    variables: '2-10个变量',
    operations: '加减、乘除、幂、对数、三角函数'
  }
};

/**
 * 加减法误差传递
 * z = x ± y ± ...
 * Δz = √(Δx² + Δy² + ...)
 * 
 * @param {Array} values - 测量值数组 [x, y, ...]
 * @param {Array} errors - 对应误差数组 [Δx, Δy, ...]
 * @param {string} operation - 'add' 或 'subtract'
 * @returns {object} 误差传递结果
 */
function calculateAddSubtractError(values, errors, operation = 'add') {
  // 输入验证
  if (!Array.isArray(values) || !Array.isArray(errors)) {
    return {
      error: '输入必须是数组',
      errorCode: 'INVALID_INPUT_TYPE'
    };
  }

  if (values.length !== errors.length || values.length < 2) {
    return {
      error: '至少需要2个变量，且值和误差数量必须相等',
      errorCode: 'INVALID_ARRAY_LENGTH'
    };
  }

  // 检查数值有效性
  for (let i = 0; i < values.length; i++) {
    if (!isFinite(values[i]) || !isFinite(errors[i])) {
      return {
        error: `第${i + 1}个变量或误差无效`,
        errorCode: 'INVALID_NUMBER'
      };
    }
    if (errors[i] < 0) {
      return {
        error: `第${i + 1}个误差不能为负数`,
        errorCode: 'NEGATIVE_ERROR'
      };
    }
  }

  // 计算结果值
  let result = values[0];
  for (let i = 1; i < values.length; i++) {
    if (operation === 'add') {
      result += values[i];
    } else {
      result -= values[i];
    }
  }

  // 计算绝对误差（加减法：直接平方和开方）
  const sumSquaredErrors = errors.reduce((sum, err) => sum + err * err, 0);
  const absoluteError = Math.sqrt(sumSquaredErrors);

  // 计算相对误差
  const relativeError = result !== 0 ? Math.abs(absoluteError / result) : NaN;
  const percentError = relativeError * 100;

  return {
    result: parseFloat(result.toPrecision(6)),
    absoluteError: parseFloat(absoluteError.toPrecision(4)),
    relativeError: parseFloat(relativeError.toPrecision(4)),
    percentError: parseFloat(percentError.toPrecision(4)),
    formula: operation === 'add' 
      ? `z = ${values.join(' + ')}`
      : `z = ${values[0]} - ${values.slice(1).join(' - ')}`,
    errorFormula: `Δz = √(${errors.map((e, i) => `Δx${i + 1}²`).join(' + ')})`,
    notes: [
      `结果：z = ${result.toFixed(4)} ± ${absoluteError.toFixed(4)}`,
      `相对误差：${(percentError).toFixed(2)}%`,
      '加减法误差：各项误差平方和开方'
    ]
  };
}

/**
 * 乘除法误差传递
 * z = x × y / w × ... 或 z = x / y / w / ...
 * Δz/z = √((Δx/x)² + (Δy/y)² + ...)
 * 
 * @param {Array} values - 测量值数组
 * @param {Array} errors - 对应误差数组
 * @param {string} operation - 'multiply' 或 'divide'
 * @returns {object} 误差传递结果
 */
function calculateMultiplyDivideError(values, errors, operation = 'multiply') {
  // 输入验证
  if (!Array.isArray(values) || !Array.isArray(errors)) {
    return {
      error: '输入必须是数组',
      errorCode: 'INVALID_INPUT_TYPE'
    };
  }

  if (values.length !== errors.length || values.length < 2) {
    return {
      error: '至少需要2个变量，且值和误差数量必须相等',
      errorCode: 'INVALID_ARRAY_LENGTH'
    };
  }

  // 检查数值有效性
  for (let i = 0; i < values.length; i++) {
    if (!isFinite(values[i]) || !isFinite(errors[i])) {
      return {
        error: `第${i + 1}个变量或误差无效`,
        errorCode: 'INVALID_NUMBER'
      };
    }
    if (errors[i] < 0) {
      return {
        error: `第${i + 1}个误差不能为负数`,
        errorCode: 'NEGATIVE_ERROR'
      };
    }
    if (Math.abs(values[i]) < 1e-10) {
      return {
        error: `第${i + 1}个变量值过小或为零`,
        errorCode: 'ZERO_VALUE'
      };
    }
  }

  // 计算结果值
  let result = values[0];
  for (let i = 1; i < values.length; i++) {
    if (operation === 'multiply') {
      result *= values[i];
    } else {
      result /= values[i];
    }
  }

  // 计算相对误差（乘除法：相对误差的平方和开方）
  const sumSquaredRelErrors = values.reduce((sum, val, i) => {
    const relErr = errors[i] / Math.abs(val);
    return sum + relErr * relErr;
  }, 0);
  const relativeError = Math.sqrt(sumSquaredRelErrors);
  const percentError = relativeError * 100;

  // 计算绝对误差
  const absoluteError = Math.abs(result * relativeError);

  return {
    result: parseFloat(result.toPrecision(6)),
    absoluteError: parseFloat(absoluteError.toPrecision(4)),
    relativeError: parseFloat(relativeError.toPrecision(4)),
    percentError: parseFloat(percentError.toPrecision(4)),
    formula: operation === 'multiply'
      ? `z = ${values.join(' × ')}`
      : `z = ${values[0]} / ${values.slice(1).join(' / ')}`,
    errorFormula: `Δz/z = √(${values.map((_, i) => `(Δx${i + 1}/x${i + 1})²`).join(' + ')})`,
    notes: [
      `结果：z = ${result.toExponential(4)} ± ${absoluteError.toExponential(4)}`,
      `相对误差：${percentError.toFixed(2)}%`,
      '乘除法误差：各项相对误差平方和开方'
    ]
  };
}

/**
 * 幂函数误差传递
 * z = x^n
 * Δz/z = |n| × Δx/x
 * 
 * @param {number} value - 底数 x
 * @param {number} error - 误差 Δx
 * @param {number} exponent - 指数 n
 * @returns {object} 误差传递结果
 */
function calculatePowerError(value, error, exponent) {
  // 输入验证
  if (!isFinite(value) || !isFinite(error) || !isFinite(exponent)) {
    return {
      error: '输入值无效',
      errorCode: 'INVALID_NUMBER'
    };
  }

  if (error < 0) {
    return {
      error: '误差不能为负数',
      errorCode: 'NEGATIVE_ERROR'
    };
  }

  if (Math.abs(value) < 1e-10) {
    return {
      error: '底数过小或为零',
      errorCode: 'ZERO_VALUE'
    };
  }

  // 计算结果
  const result = Math.pow(value, exponent);
  
  // 计算相对误差
  const relativeError = Math.abs(exponent) * (error / Math.abs(value));
  const percentError = relativeError * 100;
  
  // 计算绝对误差
  const absoluteError = Math.abs(result * relativeError);

  return {
    result: parseFloat(result.toPrecision(6)),
    absoluteError: parseFloat(absoluteError.toPrecision(4)),
    relativeError: parseFloat(relativeError.toPrecision(4)),
    percentError: parseFloat(percentError.toPrecision(4)),
    formula: `z = x^${exponent}`,
    errorFormula: `Δz/z = |${exponent}| × Δx/x`,
    notes: [
      `输入：x = ${value} ± ${error}`,
      `结果：z = ${result.toExponential(4)} ± ${absoluteError.toExponential(4)}`,
      `相对误差：${percentError.toFixed(2)}%`,
      '幂函数误差：指数倍的相对误差'
    ]
  };
}

/**
 * 对数函数误差传递
 * z = log_base(x)
 * Δz = (1/(x·ln(base))) × Δx
 * 
 * @param {number} value - 真数 x
 * @param {number} error - 误差 Δx
 * @param {number} base - 底数（默认为e，自然对数）
 * @returns {object} 误差传递结果
 */
function calculateLogError(value, error, base = Math.E) {
  // 输入验证
  if (!isFinite(value) || !isFinite(error) || !isFinite(base)) {
    return {
      error: '输入值无效',
      errorCode: 'INVALID_NUMBER'
    };
  }

  if (error < 0) {
    return {
      error: '误差不能为负数',
      errorCode: 'NEGATIVE_ERROR'
    };
  }

  if (value <= 0) {
    return {
      error: '真数必须大于零',
      errorCode: 'NON_POSITIVE_VALUE'
    };
  }

  if (base <= 0 || base === 1) {
    return {
      error: '底数必须大于0且不等于1',
      errorCode: 'INVALID_BASE'
    };
  }

  // 计算结果
  const result = Math.log(value) / Math.log(base);
  
  // 计算绝对误差
  const absoluteError = error / (value * Math.log(base));
  
  // 计算相对误差
  const relativeError = result !== 0 ? Math.abs(absoluteError / result) : NaN;
  const percentError = relativeError * 100;

  let baseName = 'e';
  if (base === 10) baseName = '10';
  else if (base === 2) baseName = '2';
  else if (base !== Math.E) baseName = base.toString();

  return {
    result: parseFloat(result.toPrecision(6)),
    absoluteError: parseFloat(absoluteError.toPrecision(4)),
    relativeError: isFinite(relativeError) ? parseFloat(relativeError.toPrecision(4)) : NaN,
    percentError: isFinite(percentError) ? parseFloat(percentError.toPrecision(4)) : NaN,
    formula: baseName === 'e' ? `z = ln(x)` : `z = log${baseName}(x)`,
    errorFormula: `Δz = Δx / (x · ln(${baseName}))`,
    notes: [
      `输入：x = ${value} ± ${error}`,
      `结果：z = ${result.toFixed(6)} ± ${absoluteError.toFixed(6)}`,
      isFinite(percentError) ? `相对误差：${percentError.toFixed(2)}%` : '相对误差：无法计算（结果接近零）',
      '对数函数误差与真数成反比'
    ]
  };
}

/**
 * 三角函数误差传递
 * z = sin(x) 或 cos(x) 或 tan(x)
 * Δ(sin x) = |cos x| × Δx
 * Δ(cos x) = |sin x| × Δx
 * Δ(tan x) = |sec² x| × Δx
 * 
 * @param {number} value - 角度值（单位：弧度）
 * @param {number} error - 误差（单位：弧度）
 * @param {string} funcType - 'sin', 'cos', 或 'tan'
 * @returns {object} 误差传递结果
 */
function calculateTrigError(value, error, funcType = 'sin') {
  // 输入验证
  if (!isFinite(value) || !isFinite(error)) {
    return {
      error: '输入值无效',
      errorCode: 'INVALID_NUMBER'
    };
  }

  if (error < 0) {
    return {
      error: '误差不能为负数',
      errorCode: 'NEGATIVE_ERROR'
    };
  }

  if (!['sin', 'cos', 'tan'].includes(funcType)) {
    return {
      error: '函数类型必须是 sin, cos 或 tan',
      errorCode: 'INVALID_FUNC_TYPE'
    };
  }

  let result, absoluteError, formula, errorFormula;

  if (funcType === 'sin') {
    result = Math.sin(value);
    absoluteError = Math.abs(Math.cos(value)) * error;
    formula = 'z = sin(x)';
    errorFormula = 'Δz = |cos(x)| × Δx';
  } else if (funcType === 'cos') {
    result = Math.cos(value);
    absoluteError = Math.abs(Math.sin(value)) * error;
    formula = 'z = cos(x)';
    errorFormula = 'Δz = |sin(x)| × Δx';
  } else { // tan
    result = Math.tan(value);
    const sec = 1 / Math.cos(value);
    absoluteError = Math.abs(sec * sec) * error;
    formula = 'z = tan(x)';
    errorFormula = 'Δz = |sec²(x)| × Δx';
  }

  // 计算相对误差
  const relativeError = result !== 0 ? Math.abs(absoluteError / result) : NaN;
  const percentError = relativeError * 100;

  // 转换为角度显示（可选）
  const valueDeg = value * 180 / Math.PI;
  const errorDeg = error * 180 / Math.PI;

  return {
    result: parseFloat(result.toPrecision(6)),
    absoluteError: parseFloat(absoluteError.toPrecision(4)),
    relativeError: isFinite(relativeError) ? parseFloat(relativeError.toPrecision(4)) : NaN,
    percentError: isFinite(percentError) ? parseFloat(percentError.toPrecision(4)) : NaN,
    formula,
    errorFormula,
    notes: [
      `输入：x = ${value.toFixed(4)} rad ± ${error.toFixed(4)} rad`,
      `      (= ${valueDeg.toFixed(2)}° ± ${errorDeg.toFixed(2)}°)`,
      `结果：z = ${result.toFixed(6)} ± ${absoluteError.toFixed(6)}`,
      isFinite(percentError) ? `相对误差：${percentError.toFixed(2)}%` : '相对误差：无法计算（结果接近零）',
      '注意：输入角度单位为弧度'
    ]
  };
}

/**
 * 通用误差传递计算（支持复杂表达式）
 * 使用偏导数方法
 * 
 * @param {object} variables - 变量对象 {x: {value, error}, y: {value, error}, ...}
 * @param {Function} expression - 表达式函数 (vars) => result
 * @returns {object} 误差传递结果
 */
function calculateGeneralError(variables, expression) {
  try {
    // 计算函数值
    const varValues = {};
    for (const key in variables) {
      varValues[key] = variables[key].value;
    }
    const result = expression(varValues);

    if (!isFinite(result)) {
      return {
        error: '表达式计算结果无效',
        errorCode: 'INVALID_RESULT'
      };
    }

    // 数值求偏导（有限差分法）
    const h = 1e-8; // 小增量
    let sumSquaredErrors = 0;

    for (const key in variables) {
      const { value, error } = variables[key];
      
      // 计算偏导数 ∂f/∂x ≈ [f(x+h) - f(x-h)] / (2h)
      const varValuesPlusH = { ...varValues };
      const varValuesMinusH = { ...varValues };
      varValuesPlusH[key] = value + h;
      varValuesMinusH[key] = value - h;
      
      const fPlusH = expression(varValuesPlusH);
      const fMinusH = expression(varValuesMinusH);
      const partialDerivative = (fPlusH - fMinusH) / (2 * h);
      
      // 累加 (∂f/∂x × Δx)²
      sumSquaredErrors += Math.pow(partialDerivative * error, 2);
    }

    const absoluteError = Math.sqrt(sumSquaredErrors);
    const relativeError = result !== 0 ? Math.abs(absoluteError / result) : NaN;
    const percentError = relativeError * 100;

    return {
      result: parseFloat(result.toPrecision(6)),
      absoluteError: parseFloat(absoluteError.toPrecision(4)),
      relativeError: isFinite(relativeError) ? parseFloat(relativeError.toPrecision(4)) : NaN,
      percentError: isFinite(percentError) ? parseFloat(percentError.toPrecision(4)) : NaN,
      notes: [
        `结果：z = ${result.toExponential(4)} ± ${absoluteError.toExponential(4)}`,
        isFinite(percentError) ? `相对误差：${percentError.toFixed(2)}%` : '相对误差：无法计算',
        '使用偏导数方法计算'
      ]
    };
  } catch (err) {
    return {
      error: '表达式计算失败',
      errorCode: 'EXPRESSION_ERROR',
      details: err.message
    };
  }
}

module.exports = {
  calculateAddSubtractError,
  calculateMultiplyDivideError,
  calculatePowerError,
  calculateLogError,
  calculateTrigError,
  calculateGeneralError,
  getMetadata: () => METADATA
};

