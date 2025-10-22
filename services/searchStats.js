/**
 * 搜索统计服务 v4.3.0
 * 记录搜索频率，提供热门搜索统计
 */

const { storageService } = require('./storage');

const STATS_KEY = 'chemtools:search_stats';
const MAX_STATS_SIZE = 100; // 最多记录100个关键词统计

class SearchStatsService {
  constructor() {
    this.stats = this.loadStats();
  }

  /**
   * 加载统计数据
   */
  loadStats() {
    try {
      const stats = storageService.get(STATS_KEY, {});
      return stats;
    } catch (e) {
      console.error('加载搜索统计失败:', e);
      return {};
    }
  }

  /**
   * 保存统计数据
   */
  saveStats() {
    try {
      storageService.set(STATS_KEY, this.stats);
    } catch (e) {
      console.error('保存搜索统计失败:', e);
    }
  }

  /**
   * 记录搜索
   */
  recordSearch(keyword) {
    if (!keyword || keyword.trim() === '') return;

    const normalizedKeyword = keyword.trim().toLowerCase();
    
    // 增加计数
    if (!this.stats[normalizedKeyword]) {
      this.stats[normalizedKeyword] = {
        keyword: keyword.trim(), // 保留原始大小写
        count: 0,
        lastSearchTime: Date.now(),
        firstSearchTime: Date.now()
      };
    }

    this.stats[normalizedKeyword].count++;
    this.stats[normalizedKeyword].lastSearchTime = Date.now();

    // 清理过多的统计数据
    this.cleanupStats();

    this.saveStats();
  }

  /**
   * 获取热门搜索（前N个）
   */
  getHotSearches(limit = 10) {
    try {
      const entries = Object.entries(this.stats);
      
      return entries
        .sort((a, b) => {
          // 按搜索次数排序
          return b[1].count - a[1].count;
        })
        .slice(0, limit)
        .map(([key, data]) => ({
          keyword: data.keyword,
          count: data.count,
          lastSearchTime: data.lastSearchTime
        }));
    } catch (e) {
      console.error('获取热门搜索失败:', e);
      return [];
    }
  }

  /**
   * 获取今日热门搜索
   */
  getTodayHotSearches(limit = 10) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();

    const todaySearches = Object.entries(this.stats)
      .filter(([_, data]) => data.lastSearchTime >= todayTimestamp)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, limit)
      .map(([key, data]) => ({
        keyword: data.keyword,
        count: data.count
      }));

    return todaySearches;
  }

  /**
   * 获取本周热门搜索
   */
  getWeekHotSearches(limit = 10) {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    const weekSearches = Object.entries(this.stats)
      .filter(([_, data]) => data.lastSearchTime >= weekAgo)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, limit)
      .map(([key, data]) => ({
        keyword: data.keyword,
        count: data.count
      }));

    return weekSearches;
  }

  /**
   * 获取搜索统计信息
   */
  getStatsInfo() {
    const entries = Object.values(this.stats);
    const totalSearches = entries.reduce((sum, data) => sum + data.count, 0);

    return {
      totalKeywords: entries.length,
      totalSearches,
      hotSearches: this.getHotSearches(5)
    };
  }

  /**
   * 获取关键词搜索次数
   */
  getSearchCount(keyword) {
    const normalizedKeyword = keyword.trim().toLowerCase();
    return this.stats[normalizedKeyword]?.count || 0;
  }

  /**
   * 清理统计数据（保留最常用的）
   */
  cleanupStats() {
    const entries = Object.entries(this.stats);
    
    if (entries.length <= MAX_STATS_SIZE) {
      return;
    }

    // 按搜索次数排序，保留前MAX_STATS_SIZE个
    const topEntries = entries
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, MAX_STATS_SIZE);

    this.stats = {};
    topEntries.forEach(([key, data]) => {
      this.stats[key] = data;
    });
  }

  /**
   * 清空统计数据
   */
  clearStats() {
    this.stats = {};
    this.saveStats();
  }

  /**
   * 获取相似关键词（用于拼写建议）
   */
  getSimilarKeywords(keyword, limit = 5) {
    const normalizedKeyword = keyword.trim().toLowerCase();
    
    return Object.values(this.stats)
      .filter(data => {
        const key = data.keyword.toLowerCase();
        // 包含关键词或关键词包含在搜索词中
        return key.includes(normalizedKeyword) || normalizedKeyword.includes(key);
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
      .map(data => data.keyword);
  }
}

// 导出单例
const searchStatsService = new SearchStatsService();

module.exports = {
  searchStatsService,
  SearchStatsService
};

