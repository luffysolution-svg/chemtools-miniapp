/**
 * 搜索缓存服务 v4.3.0
 * 缓存搜索结果，提升重复搜索速度
 */

class SearchCache {
  constructor() {
    this.cache = new Map();
    this.maxSize = 10; // 最多缓存10个搜索结果
    this.maxAge = 5 * 60 * 1000; // 5分钟过期
  }

  /**
   * 生成缓存键
   */
  generateKey(keyword, options = {}) {
    const optionsStr = JSON.stringify(options);
    return `${keyword.toLowerCase()}::${optionsStr}`;
  }

  /**
   * 获取缓存
   */
  get(keyword, options = {}) {
    const key = this.generateKey(keyword, options);
    const cached = this.cache.get(key);

    if (!cached) {
      return null;
    }

    // 检查是否过期
    if (Date.now() - cached.timestamp > this.maxAge) {
      this.cache.delete(key);
      return null;
    }

    // 更新访问时间（用于 LRU）
    cached.lastAccess = Date.now();
    
    return {
      results: cached.results,
      resultsByType: cached.resultsByType,
      fromCache: true
    };
  }

  /**
   * 设置缓存
   */
  set(keyword, results, resultsByType, options = {}) {
    const key = this.generateKey(keyword, options);

    // LRU 缓存策略：缓存满时删除最久未访问的
    if (this.cache.size >= this.maxSize) {
      let oldestKey = null;
      let oldestTime = Date.now();

      this.cache.forEach((value, k) => {
        if (value.lastAccess < oldestTime) {
          oldestTime = value.lastAccess;
          oldestKey = k;
        }
      });

      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      results,
      resultsByType,
      timestamp: Date.now(),
      lastAccess: Date.now()
    });
  }

  /**
   * 检查是否有缓存
   */
  has(keyword, options = {}) {
    const key = this.generateKey(keyword, options);
    const cached = this.cache.get(key);

    if (!cached) {
      return false;
    }

    // 检查是否过期
    if (Date.now() - cached.timestamp > this.maxAge) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * 清除缓存
   */
  clear() {
    this.cache.clear();
    console.log('搜索缓存已清空');
  }

  /**
   * 获取缓存统计
   */
  getStats() {
    const entries = Array.from(this.cache.entries());
    
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      items: entries.map(([key, value]) => ({
        key,
        age: Date.now() - value.timestamp,
        resultCount: value.results.length
      }))
    };
  }

  /**
   * 清理过期缓存
   */
  cleanup() {
    const now = Date.now();
    const keysToDelete = [];

    this.cache.forEach((value, key) => {
      if (now - value.timestamp > this.maxAge) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.cache.delete(key));

    if (keysToDelete.length > 0) {
      console.log(`清理了 ${keysToDelete.length} 个过期缓存`);
    }
  }

  /**
   * 设置缓存配置
   */
  setConfig(config = {}) {
    if (config.maxSize !== undefined) {
      this.maxSize = Math.max(1, Math.min(50, config.maxSize));
    }
    if (config.maxAge !== undefined) {
      this.maxAge = Math.max(60 * 1000, config.maxAge); // 最少1分钟
    }
  }
}

// 导出单例
const searchCache = new SearchCache();

// 定期清理过期缓存（每分钟）
setInterval(() => {
  searchCache.cleanup();
}, 60 * 1000);

module.exports = {
  searchCache,
  SearchCache
};

