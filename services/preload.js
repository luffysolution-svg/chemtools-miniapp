/**
 * 预加载服务 v4.2.0
 * 智能预加载常用页面数据，提升页面切换速度
 */

const { storageService } = require('./storage');

const PRELOAD_CACHE_KEY = 'chemtools:preload_cache';
const PRELOAD_CONFIG_KEY = 'chemtools:preload_config';

class PreloadService {
  constructor() {
    this.config = this.loadConfig();
    this.cache = new Map();
    this.preloadQueue = [];
    this.isPreloading = false;
  }

  /**
   * 加载预加载配置
   */
  loadConfig() {
    const defaultConfig = {
      enabled: true,
      maxCacheSize: 5, // 最多缓存5个页面数据
      preloadDelay: 500, // 预加载延迟（毫秒）
      preloadTopN: 3 // 预加载最常用的前N个工具
    };

    try {
      const config = storageService.get(PRELOAD_CONFIG_KEY, defaultConfig);
      return { ...defaultConfig, ...config };
    } catch (e) {
      return defaultConfig;
    }
  }

  /**
   * 保存配置
   */
  saveConfig() {
    storageService.set(PRELOAD_CONFIG_KEY, this.config);
  }

  /**
   * 启用预加载
   */
  enablePreload() {
    this.config.enabled = true;
    this.saveConfig();
  }

  /**
   * 禁用预加载
   */
  disablePreload() {
    this.config.enabled = false;
    this.clearCache();
    this.saveConfig();
  }

  /**
   * 预加载页面数据
   * @param {string} path - 页面路径
   * @param {Function} dataLoader - 数据加载函数
   */
  async preloadPage(path, dataLoader) {
    if (!this.config.enabled) {
      return;
    }

    // 检查是否已缓存
    if (this.cache.has(path)) {
      console.log(`页面数据已缓存: ${path}`);
      return;
    }

    // 检查缓存大小
    if (this.cache.size >= this.config.maxCacheSize) {
      // 删除最旧的缓存
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    try {
      console.log(`预加载页面数据: ${path}`);
      const data = await dataLoader();
      
      this.cache.set(path, {
        data,
        timestamp: Date.now(),
        path
      });

      console.log(`预加载完成: ${path}`);
    } catch (e) {
      console.error(`预加载失败: ${path}`, e);
    }
  }

  /**
   * 获取预加载的数据
   */
  getPreloadedData(path) {
    if (!this.cache.has(path)) {
      return null;
    }

    const cached = this.cache.get(path);
    
    // 检查缓存是否过期（30分钟）
    const maxAge = 30 * 60 * 1000;
    if (Date.now() - cached.timestamp > maxAge) {
      this.cache.delete(path);
      return null;
    }

    return cached.data;
  }

  /**
   * 预加载常用页面
   */
  async preloadCommonPages() {
    if (!this.config.enabled) {
      return;
    }

    // 延迟执行，避免阻塞主线程
    setTimeout(async () => {
      // 获取最近使用的工具
      const recentTools = storageService.get('chemtools:recent_tools', []);
      const topTools = recentTools.slice(0, this.config.preloadTopN);

      // 预定义常用数据加载器
      const commonLoaders = [
        {
          path: '/pages/search/search',
          loader: () => this.loadSearchData()
        }
      ];

      // 预加载最近使用的工具（简化版，只预标记）
      for (const tool of topTools) {
        console.log(`标记预加载: ${tool.name}`);
      }

      // 预加载常用页面
      for (const { path, loader } of commonLoaders) {
        await this.preloadPage(path, loader);
      }
    }, this.config.preloadDelay);
  }

  /**
   * 加载搜索数据（示例）
   */
  async loadSearchData() {
    return {
      preloaded: true,
      timestamp: Date.now()
    };
  }

  /**
   * 预加载元素周期表数据
   */
  async preloadPeriodicTable() {
    try {
      const periodic = require('../utils/periodic');
      return {
        elements: periodic.periodicElements || [],
        preloaded: true
      };
    } catch (e) {
      console.error('预加载元素表失败:', e);
      return null;
    }
  }

  /**
   * 预加载半导体数据
   */
  async preloadSemiconductors() {
    try {
      const semiconductors = require('../utils/semiconductors');
      return {
        materials: semiconductors.semiconductorMaterials || [],
        preloaded: true
      };
    } catch (e) {
      console.error('预加载半导体数据失败:', e);
      return null;
    }
  }

  /**
   * 智能预加载（基于使用频率）
   */
  async smartPreload() {
    if (!this.config.enabled) {
      return;
    }

    const recentTools = storageService.get('chemtools:recent_tools', []);
    
    // 统计使用频率
    const frequency = {};
    recentTools.forEach(tool => {
      frequency[tool.path] = (frequency[tool.path] || 0) + 1;
    });

    // 按频率排序
    const sortedPaths = Object.keys(frequency).sort((a, b) => frequency[b] - frequency[a]);
    const topPaths = sortedPaths.slice(0, this.config.preloadTopN);

    console.log('智能预加载路径:', topPaths);

    // 这里可以根据路径类型执行不同的预加载策略
    for (const path of topPaths) {
      if (path.includes('periodic')) {
        await this.preloadPage(path, () => this.preloadPeriodicTable());
      } else if (path.includes('semiconductor')) {
        await this.preloadPage(path, () => this.preloadSemiconductors());
      }
    }
  }

  /**
   * 清除预加载缓存
   */
  clearCache() {
    this.cache.clear();
    console.log('预加载缓存已清除');
  }

  /**
   * 获取缓存状态
   */
  getCacheStatus() {
    const cacheInfo = [];
    this.cache.forEach((value, key) => {
      cacheInfo.push({
        path: key,
        timestamp: value.timestamp,
        age: Date.now() - value.timestamp
      });
    });

    return {
      enabled: this.config.enabled,
      cacheSize: this.cache.size,
      maxCacheSize: this.config.maxCacheSize,
      cacheInfo
    };
  }

  /**
   * 设置预加载数量
   */
  setPreloadCount(count) {
    this.config.preloadTopN = Math.max(1, Math.min(10, count));
    this.saveConfig();
  }

  /**
   * 设置缓存大小
   */
  setCacheSize(size) {
    this.config.maxCacheSize = Math.max(1, Math.min(20, size));
    this.saveConfig();
    
    // 清理超出的缓存
    while (this.cache.size > this.config.maxCacheSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
  }

  /**
   * 空闲时预加载（模拟 requestIdleCallback）
   */
  preloadOnIdle(callback) {
    // 微信小程序没有 requestIdleCallback，使用 setTimeout 模拟
    setTimeout(() => {
      if (!this.isPreloading) {
        this.isPreloading = true;
        callback();
        this.isPreloading = false;
      }
    }, this.config.preloadDelay);
  }

  /**
   * 批量预加载
   */
  async batchPreload(tasks) {
    if (!this.config.enabled) {
      return;
    }

    for (const { path, loader } of tasks) {
      await this.preloadPage(path, loader);
    }
  }
}

// 导出单例
const preloadService = new PreloadService();

module.exports = {
  preloadService,
  PreloadService
};

