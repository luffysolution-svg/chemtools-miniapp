/**
 * 统一的本地存储服务
 * 提供一致的数据持久化接口
 */

const STORAGE_KEYS = {
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

  getHistory(limit = 30) {
    const data = this.get(STORAGE_KEYS.HISTORY, []);
    const history = Array.isArray(data) ? data : [];
    return limit ? history.slice(0, limit) : history;
  }

  addHistory(item) {
    const history = this.getHistory(50); // 只获取最近50条，减少内存占用
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
    // 限制最多保存50条（从100减少到50）
    const limited = filtered.slice(0, 50);
    return this.set(STORAGE_KEYS.HISTORY, limited);
  }

  /**
   * 清理过期历史记录（超过30天的记录）
   */
  cleanupOldHistory() {
    const history = this.getHistory(false); // 获取所有历史
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const filtered = history.filter(item => item.timestamp > thirtyDaysAgo);
    return this.set(STORAGE_KEYS.HISTORY, filtered);
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

  /**
   * 导出所有数据（用于备份）
   * @returns {Object} 包含所有数据的对象
   */
  exportAllData() {
    const history = this.getHistory(false); // 获取所有历史
    const favorites = this.getFavorites();
    const preferences = this.getPreferences();
    const recentTools = this.get('chemtools:recent_tools', []);
    const searchHistory = this.get('chemtools:search_history', []);
    
    return {
      version: 'v6.0.0',
      exportTime: new Date().toISOString(),
      appName: '材料化学科研工具箱',
      data: {
        history: history || [],
        favorites: favorites || [],
        preferences: preferences || {},
        recentTools: recentTools || [],
        searchHistory: searchHistory || []
      }
    };
  }

  /**
   * 导入数据（从备份恢复）
   * @param {Object} backupData - 备份数据对象
   * @param {Object} options - 导入选项
   * @returns {Object} 导入结果
   */
  importData(backupData, options = {}) {
    const {
      importHistory = true,
      importFavorites = true,
      importPreferences = true,
      importRecentTools = true,
      importSearchHistory = true,
      mergeMode = false // true=合并，false=覆盖
    } = options;

    const results = {
      success: false,
      imported: [],
      errors: [],
      summary: {}
    };

    try {
      // 验证数据格式
      if (!backupData || !backupData.data) {
        throw new Error('无效的备份数据格式');
      }

      const { data } = backupData;

      // 导入历史记录
      if (importHistory && data.history) {
        try {
          if (mergeMode) {
            const existing = this.getHistory(false) || [];
            const merged = this.mergeHistoryData(existing, data.history);
            this.set(STORAGE_KEYS.HISTORY, merged);
            results.imported.push('history');
            results.summary.history = merged.length;
          } else {
            this.set(STORAGE_KEYS.HISTORY, data.history);
            results.imported.push('history');
            results.summary.history = data.history.length;
          }
        } catch (e) {
          results.errors.push({ type: 'history', error: e.message });
        }
      }

      // 导入收藏
      if (importFavorites && data.favorites) {
        try {
          if (mergeMode) {
            const existing = this.getFavorites() || [];
            const merged = this.mergeFavoritesData(existing, data.favorites);
            this.setFavorites(merged);
            results.imported.push('favorites');
            results.summary.favorites = merged.length;
          } else {
            this.setFavorites(data.favorites);
            results.imported.push('favorites');
            results.summary.favorites = data.favorites.length;
          }
        } catch (e) {
          results.errors.push({ type: 'favorites', error: e.message });
        }
      }

      // 导入偏好设置
      if (importPreferences && data.preferences) {
        try {
          if (mergeMode) {
            const existing = this.getPreferences() || {};
            const merged = { ...existing, ...data.preferences };
            this.set(STORAGE_KEYS.USER_PREFERENCES, merged);
          } else {
            this.set(STORAGE_KEYS.USER_PREFERENCES, data.preferences);
          }
          results.imported.push('preferences');
        } catch (e) {
          results.errors.push({ type: 'preferences', error: e.message });
        }
      }

      // 导入最近使用工具
      if (importRecentTools && data.recentTools) {
        try {
          this.set('chemtools:recent_tools', data.recentTools);
          results.imported.push('recentTools');
          results.summary.recentTools = data.recentTools.length;
        } catch (e) {
          results.errors.push({ type: 'recentTools', error: e.message });
        }
      }

      // 导入搜索历史
      if (importSearchHistory && data.searchHistory) {
        try {
          this.set('chemtools:search_history', data.searchHistory);
          results.imported.push('searchHistory');
          results.summary.searchHistory = data.searchHistory.length;
        } catch (e) {
          results.errors.push({ type: 'searchHistory', error: e.message });
        }
      }

      results.success = results.imported.length > 0;
      return results;
    } catch (error) {
      results.success = false;
      results.errors.push({ type: 'general', error: error.message });
      return results;
    }
  }

  /**
   * 合并历史记录（去重）
   */
  mergeHistoryData(existing, imported) {
    const merged = [...existing];
    const existingIds = new Set(existing.map(item => item.id));

    imported.forEach(item => {
      if (!existingIds.has(item.id)) {
        merged.push(item);
      }
    });

    // 按时间排序，最新的在前
    merged.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

    // 限制数量
    return merged.slice(0, 100);
  }

  /**
   * 合并收藏（去重）
   */
  mergeFavoritesData(existing, imported) {
    const merged = [...existing];
    const existingIds = new Set(existing.map(item => item.id));

    imported.forEach(item => {
      if (!existingIds.has(item.id)) {
        merged.push(item);
      }
    });

    return merged;
  }

  /**
   * 获取存储信息统计
   */
  getStorageStats() {
    try {
      const info = wx.getStorageInfoSync();
      const history = this.getHistory(false) || [];
      const favorites = this.getFavorites() || [];
      
      return {
        totalSize: info.currentSize,
        limitSize: info.limitSize,
        keys: info.keys || [],
        historyCount: history.length,
        favoritesCount: favorites.length,
        usagePercent: ((info.currentSize / info.limitSize) * 100).toFixed(2)
      };
    } catch (e) {
      return null;
    }
  }

}

// 导出单例
const storageService = new StorageService();

module.exports = {
  storageService,
  STORAGE_KEYS
};

