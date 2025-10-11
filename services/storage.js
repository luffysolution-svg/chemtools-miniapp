/**
 * 统一的本地存储服务
 * 提供一致的数据持久化接口
 */

const STORAGE_KEYS = {
  THEME: 'chemtools:theme',
  LAST_TAB: 'chemtools:lastTab',
  FAVORITES: 'chemtools:favorites',
  HISTORY: 'chemtools:history',
  USER_PREFERENCES: 'chemtools:preferences'
};

class StorageService {
  /**
   * 获取存储的数据
   * @param {string} key - 存储键
   * @param {*} defaultValue - 默认值
   * @returns {*} 存储的数据或默认值
   */
  get(key, defaultValue = null) {
    try {
      const value = wx.getStorageSync(key);
      return value !== '' ? value : defaultValue;
    } catch (e) {
      console.error(`Storage get error for key ${key}:`, e);
      return defaultValue;
    }
  }

  /**
   * 设置存储数据
   * @param {string} key - 存储键
   * @param {*} value - 要存储的值
   * @returns {boolean} 是否成功
   */
  set(key, value) {
    try {
      wx.setStorageSync(key, value);
      return true;
    } catch (e) {
      console.error(`Storage set error for key ${key}:`, e);
      return false;
    }
  }

  /**
   * 删除存储数据
   * @param {string} key - 存储键
   * @returns {boolean} 是否成功
   */
  remove(key) {
    try {
      wx.removeStorageSync(key);
      return true;
    } catch (e) {
      console.error(`Storage remove error for key ${key}:`, e);
      return false;
    }
  }

  /**
   * 清空所有存储（谨慎使用）
   */
  clear() {
    try {
      wx.clearStorageSync();
      return true;
    } catch (e) {
      console.error('Storage clear error:', e);
      return false;
    }
  }

  // 便捷方法
  getTheme() {
    return this.get(STORAGE_KEYS.THEME, 'light');
  }

  setTheme(theme) {
    return this.set(STORAGE_KEYS.THEME, theme);
  }

  getLastTab() {
    return this.get(STORAGE_KEYS.LAST_TAB);
  }

  setLastTab(tab) {
    return this.set(STORAGE_KEYS.LAST_TAB, tab);
  }

  getFavorites() {
    const data = this.get(STORAGE_KEYS.FAVORITES, []);
    return Array.isArray(data) ? data : [];
  }

  setFavorites(favorites) {
    return this.set(STORAGE_KEYS.FAVORITES, favorites);
  }

  getHistory(limit = 50) {
    const data = this.get(STORAGE_KEYS.HISTORY, []);
    const history = Array.isArray(data) ? data : [];
    return limit ? history.slice(0, limit) : history;
  }

  addHistory(item) {
    const history = this.getHistory();
    // 添加时间戳
    const newItem = {
      ...item,
      timestamp: Date.now(),
      id: `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    // 去重：如果有相同类型和内容的记录，先移除
    const filtered = history.filter(h => 
      !(h.type === newItem.type && h.content === newItem.content)
    );
    // 添加到开头
    filtered.unshift(newItem);
    // 限制最多保存100条
    const limited = filtered.slice(0, 100);
    return this.set(STORAGE_KEYS.HISTORY, limited);
  }

  clearHistory() {
    return this.set(STORAGE_KEYS.HISTORY, []);
  }

  getPreferences() {
    return this.get(STORAGE_KEYS.USER_PREFERENCES, {});
  }

  setPreferences(preferences) {
    const current = this.getPreferences();
    return this.set(STORAGE_KEYS.USER_PREFERENCES, { ...current, ...preferences });
  }
}

// 导出单例
const storageService = new StorageService();

module.exports = {
  storageService,
  STORAGE_KEYS
};

