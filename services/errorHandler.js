// 全局错误处理服务
// 用于统一处理计算错误、显示错误信息

/**
 * 错误级别
 */
const ERROR_LEVELS = {
  INFO: 'info',           // 信息提示
  WARNING: 'warning',     // 警告
  ERROR: 'error',         // 错误
  CRITICAL: 'critical'    // 严重错误
};

/**
 * 错误类型分类
 */
const ERROR_TYPES = {
  // 输入验证错误
  VALIDATION: {
    INVALID_NUMBER: { level: ERROR_LEVELS.ERROR, message: '输入必须为有效数字' },
    OUT_OF_RANGE: { level: ERROR_LEVELS.ERROR, message: '输入值超出有效范围' },
    NEGATIVE_VALUE: { level: ERROR_LEVELS.ERROR, message: '输入值不能为负数' },
    DIVISION_BY_ZERO: { level: ERROR_LEVELS.ERROR, message: '除数不能为零' },
    EMPTY_INPUT: { level: ERROR_LEVELS.WARNING, message: '输入不能为空' },
  },
  
  // 计算错误
  CALCULATION: {
    OVERFLOW: { level: ERROR_LEVELS.ERROR, message: '计算结果溢出' },
    UNDERFLOW: { level: ERROR_LEVELS.ERROR, message: '计算结果下溢' },
    NO_SOLUTION: { level: ERROR_LEVELS.WARNING, message: '无法找到解' },
    PRECISION_TOO_LOW: { level: ERROR_LEVELS.WARNING, message: '计算精度不足' },
  },
  
  // 数据错误
  DATA: {
    NOT_FOUND: { level: ERROR_LEVELS.ERROR, message: '未找到相关数据' },
    INVALID_CATEGORY: { level: ERROR_LEVELS.ERROR, message: '无效的类别' },
    INVALID_UNIT: { level: ERROR_LEVELS.ERROR, message: '无效的单位' },
  },
  
  // 系统错误
  SYSTEM: {
    STORAGE_ERROR: { level: ERROR_LEVELS.CRITICAL, message: '存储错误' },
    NETWORK_ERROR: { level: ERROR_LEVELS.ERROR, message: '网络错误' },
    UNKNOWN_ERROR: { level: ERROR_LEVELS.CRITICAL, message: '未知错误' },
  }
};

/**
 * 标准化错误对象
 * @param {object} error - 原始错误对象
 * @returns {object} 标准化的错误对象
 */
function normalizeError(error) {
  // 如果已经是标准格式，直接返回
  if (error && error.errorCode && error.error) {
    return error;
  }
  
  // 如果是字符串，转换为标准格式
  if (typeof error === 'string') {
    return {
      error,
      errorCode: 'UNKNOWN_ERROR',
      level: ERROR_LEVELS.ERROR
    };
  }
  
  // 如果是Error对象
  if (error instanceof Error) {
    return {
      error: error.message,
      errorCode: error.name || 'UNKNOWN_ERROR',
      level: ERROR_LEVELS.ERROR,
      stack: error.stack
    };
  }
  
  // 其他情况
  return {
    error: '未知错误',
    errorCode: 'UNKNOWN_ERROR',
    level: ERROR_LEVELS.CRITICAL
  };
}

/**
 * 获取错误级别对应的图标
 * @param {string} level - 错误级别
 * @returns {string} 图标名称
 */
function getErrorIcon(level) {
  const icons = {
    [ERROR_LEVELS.INFO]: 'ℹ️',
    [ERROR_LEVELS.WARNING]: '⚠️',
    [ERROR_LEVELS.ERROR]: '❌',
    [ERROR_LEVELS.CRITICAL]: '🚨'
  };
  return icons[level] || icons[ERROR_LEVELS.ERROR];
}

/**
 * 获取用户友好的错误消息
 * @param {object} error - 错误对象
 * @returns {string} 用户友好的错误消息
 */
function getUserFriendlyMessage(error) {
  const normalized = normalizeError(error);
  let message = normalized.error;
  
  // 添加建议信息
  if (normalized.suggestion) {
    message += `\n建议：${normalized.suggestion}`;
  }
  
  // 添加有效范围信息
  if (normalized.validRange) {
    message += `\n有效范围：${normalized.validRange}`;
  }
  
  // 添加接收值信息
  if (normalized.received !== undefined) {
    message += `\n输入值：${normalized.received}`;
  }
  
  return message;
}

/**
 * 显示错误提示
 * @param {object} error - 错误对象
 * @param {object} options - 显示选项
 */
function showError(error, options = {}) {
  const normalized = normalizeError(error);
  const message = getUserFriendlyMessage(normalized);
  const icon = options.icon || (normalized.level === ERROR_LEVELS.INFO || normalized.level === ERROR_LEVELS.WARNING ? 'none' : 'error');
  
  wx.showToast({
    title: message,
    icon: icon,
    duration: options.duration || 2500,
    mask: options.mask !== undefined ? options.mask : true
  });
}

/**
 * 显示错误模态框
 * @param {object} error - 错误对象
 * @param {object} options - 显示选项
 * @returns {Promise} Promise对象
 */
function showErrorModal(error, options = {}) {
  const normalized = normalizeError(error);
  const message = getUserFriendlyMessage(normalized);
  const icon = getErrorIcon(normalized.level || ERROR_LEVELS.ERROR);
  
  return new Promise((resolve) => {
    wx.showModal({
      title: options.title || `${icon} 错误`,
      content: message,
      showCancel: options.showCancel !== undefined ? options.showCancel : false,
      confirmText: options.confirmText || '确定',
      cancelText: options.cancelText || '取消',
      success(res) {
        resolve(res.confirm);
      }
    });
  });
}

/**
 * 记录错误日志
 * @param {object} error - 错误对象
 * @param {object} context - 上下文信息
 */
function logError(error, context = {}) {
  const normalized = normalizeError(error);
  const timestamp = new Date().toISOString();
  
  const logEntry = {
    timestamp,
    level: normalized.level || ERROR_LEVELS.ERROR,
    errorCode: normalized.errorCode,
    message: normalized.error,
    context,
    ...normalized
  };
  
  console.error('[ErrorHandler]', JSON.stringify(logEntry, null, 2));
  
  // 如果是严重错误，可以考虑上报到服务器
  if (normalized.level === ERROR_LEVELS.CRITICAL) {
    // TODO: 实现错误上报逻辑
    console.error('[CRITICAL ERROR] 严重错误需要关注:', logEntry);
  }
}

/**
 * 安全执行函数，捕获并处理错误
 * @param {function} fn - 要执行的函数
 * @param {object} options - 选项
 * @returns {any} 函数执行结果或错误对象
 */
function safeExecute(fn, options = {}) {
  try {
    const result = fn();
    
    // 检查结果是否为错误对象
    if (result && result.error) {
      if (options.showError !== false) {
        showError(result, options);
      }
      if (options.logError !== false) {
        logError(result, options.context);
      }
      return null;
    }
    
    return result;
  } catch (error) {
    const normalized = normalizeError(error);
    
    if (options.showError !== false) {
      showError(normalized, options);
    }
    if (options.logError !== false) {
      logError(normalized, options.context);
    }
    
    return null;
  }
}

/**
 * 异步安全执行函数
 * @param {function} fn - 要执行的异步函数
 * @param {object} options - 选项
 * @returns {Promise} Promise对象
 */
async function safeExecuteAsync(fn, options = {}) {
  try {
    const result = await fn();
    
    // 检查结果是否为错误对象
    if (result && result.error) {
      if (options.showError !== false) {
        showError(result, options);
      }
      if (options.logError !== false) {
        logError(result, options.context);
      }
      return null;
    }
    
    return result;
  } catch (error) {
    const normalized = normalizeError(error);
    
    if (options.showError !== false) {
      showError(normalized, options);
    }
    if (options.logError !== false) {
      logError(normalized, options.context);
    }
    
    return null;
  }
}

/**
 * 处理计算结果，自动显示错误或成功信息
 * @param {any} result - 计算结果
 * @param {object} options - 选项
 * @returns {boolean} 是否成功
 */
function handleCalculationResult(result, options = {}) {
  // 检查是否为错误
  if (result && result.error) {
    if (options.showError !== false) {
      showError(result, options);
    }
    if (options.logError !== false) {
      logError(result, options.context);
    }
    return false;
  }
  
  // 检查是否有警告
  if (result && result.warning) {
    const warningObj = {
      error: result.warning,
      errorCode: 'WARNING',
      level: ERROR_LEVELS.WARNING
    };
    if (options.showWarning !== false) {
      showError(warningObj, { icon: 'none', duration: 2000 });
    }
  }
  
  // 如果需要显示成功信息
  if (options.showSuccess && result) {
    wx.showToast({
      title: options.successMessage || '计算成功',
      icon: 'success',
      duration: options.duration || 1500
    });
  }
  
  return true;
}

/**
 * 创建错误对象
 * @param {string} message - 错误消息
 * @param {string} errorCode - 错误代码
 * @param {object} extra - 额外信息
 * @returns {object} 错误对象
 */
function createError(message, errorCode = 'UNKNOWN_ERROR', extra = {}) {
  return {
    error: message,
    errorCode,
    level: ERROR_LEVELS.ERROR,
    ...extra
  };
}

module.exports = {
  // 常量
  ERROR_LEVELS,
  ERROR_TYPES,
  
  // 核心函数
  normalizeError,
  getUserFriendlyMessage,
  showError,
  showErrorModal,
  logError,
  
  // 安全执行
  safeExecute,
  safeExecuteAsync,
  
  // 结果处理
  handleCalculationResult,
  
  // 工具函数
  getErrorIcon,
  createError
};

