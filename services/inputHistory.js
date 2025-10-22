/**
 * 输入历史记录服务
 * 管理各工具的输入历史，提供快速填充功能
 * Version: 1.0.0
 */

const STORAGE_KEY = 'input_history';
const MAX_HISTORY_ITEMS = 10;
const EXPIRE_DAYS = 30;

class InputHistoryService {
  /**
   * 获取指定工具的输入历史
   * @param {string} toolType - 工具类型（unit/ph/molar等）
   * @param {string} field - 字段名（可选，用于区分同一工具的不同输入框）
   * @returns {Array} 历史记录数组
   */
  getHistory(toolType, field = 'default') {
    const allHistory = this._loadAllHistory();
    const key = this._getKey(toolType, field);
    
    if (!allHistory[key]) {
      return [];
    }
    
    // 过滤过期记录
    const validHistory = allHistory[key].filter(item => {
      const age = Date.now() - item.timestamp;
      return age < EXPIRE_DAYS * 24 * 60 * 60 * 1000;
    });
    
    // 按时间倒序排序，返回值数组
    return validHistory
      .sort((a, b) => b.timestamp - a.timestamp)
      .map(item => item.value);
  }

  /**
   * 添加输入历史
   * @param {string} toolType - 工具类型
   * @param {string} value - 输入值
   * @param {string} field - 字段名
   */
  addHistory(toolType, value, field = 'default') {
    if (!value || value.trim() === '') {
      return;
    }
    
    const allHistory = this._loadAllHistory();
    const key = this._getKey(toolType, field);
    
    if (!allHistory[key]) {
      allHistory[key] = [];
    }
    
    // 移除重复项
    allHistory[key] = allHistory[key].filter(item => item.value !== value);
    
    // 添加新记录
    allHistory[key].unshift({
      value: value,
      timestamp: Date.now()
    });
    
    // 限制数量
    if (allHistory[key].length > MAX_HISTORY_ITEMS) {
      allHistory[key] = allHistory[key].slice(0, MAX_HISTORY_ITEMS);
    }
    
    this._saveAllHistory(allHistory);
  }

  /**
   * 清除指定工具的历史
   * @param {string} toolType - 工具类型
   * @param {string} field - 字段名（可选）
   */
  clearHistory(toolType, field = null) {
    const allHistory = this._loadAllHistory();
    
    if (field) {
      const key = this._getKey(toolType, field);
      delete allHistory[key];
    } else {
      // 清除该工具的所有字段历史
      Object.keys(allHistory).forEach(key => {
        if (key.startsWith(toolType + ':')) {
          delete allHistory[key];
        }
      });
    }
    
    this._saveAllHistory(allHistory);
  }

  /**
   * 清除所有历史记录
   */
  clearAllHistory() {
    try {
      wx.removeStorageSync(STORAGE_KEY);
    } catch (e) {
      console.error('清除历史记录失败:', e);
    }
  }

  /**
   * 获取最常用的值
   * @param {string} toolType - 工具类型
   * @param {string} field - 字段名
   * @param {number} limit - 返回数量
   * @returns {Array} 最常用的值数组
   */
  getFrequentValues(toolType, field = 'default', limit = 5) {
    const history = this.getHistory(toolType, field);
    
    // 统计频率
    const frequency = {};
    history.forEach(value => {
      frequency[value] = (frequency[value] || 0) + 1;
    });
    
    // 按频率排序
    return Object.keys(frequency)
      .sort((a, b) => frequency[b] - frequency[a])
      .slice(0, limit);
  }

  /**
   * 获取建议值（结合历史和常用值）
   * @param {string} toolType - 工具类型
   * @param {string} field - 字段名
   * @param {string} currentInput - 当前输入
   * @returns {Array} 建议值数组
   */
  getSuggestions(toolType, field = 'default', currentInput = '') {
    const history = this.getHistory(toolType, field);
    
    if (!currentInput) {
      return history.slice(0, 5);
    }
    
    // 筛选匹配的历史记录
    return history.filter(value => 
      value.toString().toLowerCase().includes(currentInput.toLowerCase())
    ).slice(0, 5);
  }

  /**
   * 生成存储键
   * @private
   */
  _getKey(toolType, field) {
    return `${toolType}:${field}`;
  }

  /**
   * 加载所有历史记录
   * @private
   */
  _loadAllHistory() {
    try {
      const data = wx.getStorageSync(STORAGE_KEY);
      return data || {};
    } catch (e) {
      console.error('加载历史记录失败:', e);
      return {};
    }
  }

  /**
   * 保存所有历史记录
   * @private
   */
  _saveAllHistory(data) {
    try {
      wx.setStorageSync(STORAGE_KEY, data);
    } catch (e) {
      console.error('保存历史记录失败:', e);
    }
  }

  /**
   * 清理过期记录（定期调用）
   */
  cleanExpiredHistory() {
    const allHistory = this._loadAllHistory();
    let hasChanges = false;
    
    Object.keys(allHistory).forEach(key => {
      const validItems = allHistory[key].filter(item => {
        const age = Date.now() - item.timestamp;
        return age < EXPIRE_DAYS * 24 * 60 * 60 * 1000;
      });
      
      if (validItems.length !== allHistory[key].length) {
        allHistory[key] = validItems;
        hasChanges = true;
      }
      
      // 删除空数组
      if (validItems.length === 0) {
        delete allHistory[key];
      }
    });
    
    if (hasChanges) {
      this._saveAllHistory(allHistory);
    }
  }
}

// 创建单例
const inputHistoryService = new InputHistoryService();

// 导出
module.exports = {
  inputHistoryService
};

