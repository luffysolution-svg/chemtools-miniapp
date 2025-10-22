/**
 * 统计服务 v6.0.0
 * 提供详细的分享统计、数据聚合和分析功能
 */

const { shareService } = require('./share');
const { storageService } = require('./storage');

class StatisticsService {
  constructor() {
    this.storageKey = 'chemtools:statistics_config';
    this.queryCache = {}; // 查询缓存
    this.cacheExpiry = 5 * 60 * 1000; // 缓存5分钟
    
    // 工具名称映射
    this.toolNameMap = {
      'unit': '单位换算',
      'ph': 'pH计算',
      'solution': '溶液配制',
      'molar': '分子质量',
      'batch': '批量计算',
      'xrd': 'XRD分析',
      'electrochem': '电化学计算',
      'ksp': '溶度积计算',
      'complexation': '络合计算',
      'thermodynamics': '热力学计算',
      'kinetics': '动力学计算',
      'uvvis': 'UV-Vis计算',
      'xps-raman': 'XPS/Raman光谱',
      'periodic': '元素周期表',
      'semiconductor': '半导体数据',
      'abbreviation': '化学缩写',
      'organic-materials': '有机材料'
    };

    // 渠道名称映射
    this.channelNameMap = {
      'friend': '分享好友',
      'timeline': '分享朋友圈',
      'copy': '复制',
      'card': '分享卡片',
      'album': '保存相册'
    };
  }

  /**
   * 记录分享（代理到shareService）
   */
  recordShare(data) {
    return shareService.recordShare(data);
  }

  /**
   * 获取统计概览（带缓存优化）
   */
  getOverview() {
    // 性能优化：检查缓存
    const cacheKey = 'overview';
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      console.log('✅ 使用缓存的概览数据');
      return cached;
    }

    const stats = shareService.getStatistics();
    const recent7Days = shareService.getRecentShares(7);
    const recent30Days = shareService.getRecentShares(30);

    return {
      totalShares: stats.totalShares || 0,
      recentShares7Days: recent7Days.length,
      recentShares30Days: recent30Days.length,
      avgSharesPerDay: shareService.calculateAvgSharesPerDay(),
      totalTools: Object.keys(stats.toolUsage || {}).length,
      totalChannels: Object.keys(stats.channelStats || {}).length,
      lastShareTime: stats.lastShare || 0,
      firstShareTime: this.getFirstShareTime()
    };
  }

  /**
   * 获取首次分享时间
   */
  getFirstShareTime() {
    const stats = shareService.getStatistics();
    const shares = stats.shares || [];
    
    if (shares.length === 0) return 0;
    
    return shares[shares.length - 1].timestamp || 0;
  }

  /**
   * 获取热门工具排行（带名称）
   */
  getTopToolsWithNames(limit = 10) {
    const topTools = shareService.getTopTools(limit);
    
    return topTools.map(item => ({
      ...item,
      toolName: this.toolNameMap[item.tool] || item.tool,
      percentage: this.calculatePercentage(item.count, shareService.getTotalShares())
    }));
  }

  /**
   * 获取渠道分布（带名称和百分比）
   */
  getChannelDistributionWithDetails() {
    const distribution = shareService.getChannelDistribution();
    const total = shareService.getTotalShares();
    
    return Object.entries(distribution).map(([channel, count]) => ({
      channel,
      channelName: this.channelNameMap[channel] || channel,
      count,
      percentage: this.calculatePercentage(count, total)
    })).sort((a, b) => b.count - a.count);
  }

  /**
   * 获取时段分布（0-23小时）
   */
  getHourlyDistribution() {
    const distribution = shareService.getTimeDistribution();
    const total = shareService.getTotalShares();
    
    const hourly = [];
    for (let hour = 0; hour < 24; hour++) {
      const count = distribution[hour] || 0;
      hourly.push({
        hour,
        hourLabel: `${String(hour).padStart(2, '0')}:00`,
        count,
        percentage: this.calculatePercentage(count, total)
      });
    }
    
    return hourly;
  }

  /**
   * 获取高峰时段（前5个时段）
   */
  getPeakHours(limit = 5) {
    const hourly = this.getHourlyDistribution();
    
    return hourly
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
      .map(item => ({
        ...item,
        period: this.getTimePeriod(item.hour)
      }));
  }

  /**
   * 获取每日趋势（最近N天）
   */
  getDailyTrendWithLabels(days = 7) {
    const trend = shareService.getDailyTrend(days);
    
    return Object.entries(trend)
      .map(([date, count]) => ({
        date,
        dateLabel: this.formatDateLabel(date),
        count
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  /**
   * 获取每周统计
   */
  getWeeklyStats() {
    const days7 = shareService.getRecentShares(7);
    const days14 = shareService.getRecentShares(14);
    
    const thisWeek = days7.length;
    const lastWeek = days14.length - days7.length;
    const change = lastWeek === 0 ? 0 : ((thisWeek - lastWeek) / lastWeek * 100).toFixed(1);
    
    return {
      thisWeek,
      lastWeek,
      change: parseFloat(change),
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
    };
  }

  /**
   * 获取月度统计
   */
  getMonthlyStats() {
    const days30 = shareService.getRecentShares(30);
    const days60 = shareService.getRecentShares(60);
    
    const thisMonth = days30.length;
    const lastMonth = days60.length - days30.length;
    const change = lastMonth === 0 ? 0 : ((thisMonth - lastMonth) / lastMonth * 100).toFixed(1);
    
    return {
      thisMonth,
      lastMonth,
      change: parseFloat(change),
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
    };
  }

  /**
   * 获取用户偏好分析
   */
  getUserPreferences() {
    const topTools = this.getTopToolsWithNames(3);
    const channelDist = this.getChannelDistributionWithDetails();
    const peakHours = this.getPeakHours(3);
    
    return {
      favoriteTools: topTools,
      preferredChannel: channelDist[0] || null,
      activeHours: peakHours,
      usagePattern: this.analyzeUsagePattern()
    };
  }

  /**
   * 分析使用模式
   */
  analyzeUsagePattern() {
    const hourly = this.getHourlyDistribution();
    let pattern = 'balanced';
    
    // 计算早中晚的分布
    const morning = hourly.slice(6, 12).reduce((sum, h) => sum + h.count, 0);
    const afternoon = hourly.slice(12, 18).reduce((sum, h) => sum + h.count, 0);
    const evening = hourly.slice(18, 24).reduce((sum, h) => sum + h.count, 0);
    const night = hourly.slice(0, 6).reduce((sum, h) => sum + h.count, 0);
    
    const max = Math.max(morning, afternoon, evening, night);
    
    if (morning === max) pattern = 'morning';
    else if (afternoon === max) pattern = 'afternoon';
    else if (evening === max) pattern = 'evening';
    else if (night === max) pattern = 'night';
    
    return {
      pattern,
      distribution: {
        morning: { count: morning, label: '早上(6-12)' },
        afternoon: { count: afternoon, label: '下午(12-18)' },
        evening: { count: evening, label: '晚上(18-24)' },
        night: { count: night, label: '深夜(0-6)' }
      }
    };
  }

  /**
   * 导出完整统计报告
   */
  exportFullReport() {
    return {
      overview: this.getOverview(),
      topTools: this.getTopToolsWithNames(10),
      channelDistribution: this.getChannelDistributionWithDetails(),
      hourlyDistribution: this.getHourlyDistribution(),
      peakHours: this.getPeakHours(5),
      dailyTrend: this.getDailyTrendWithLabels(30),
      weeklyStats: this.getWeeklyStats(),
      monthlyStats: this.getMonthlyStats(),
      userPreferences: this.getUserPreferences(),
      generatedAt: Date.now()
    };
  }

  /**
   * 导出为文本格式
   */
  exportAsText() {
    const report = this.exportFullReport();
    
    let text = '📊 分享统计报告\n';
    text += `生成时间：${new Date().toLocaleString()}\n\n`;
    
    text += '━━━━━━━━━━━━━━━━━━\n';
    text += '📈 统计概览\n';
    text += `总分享次数：${report.overview.totalShares} 次\n`;
    text += `最近7天：${report.overview.recentShares7Days} 次\n`;
    text += `最近30天：${report.overview.recentShares30Days} 次\n`;
    text += `平均每日：${report.overview.avgSharesPerDay} 次\n\n`;
    
    text += '━━━━━━━━━━━━━━━━━━\n';
    text += '🔥 热门工具 TOP 5\n';
    report.topTools.slice(0, 5).forEach((tool, index) => {
      text += `${index + 1}. ${tool.toolName}：${tool.count}次 (${tool.percentage}%)\n`;
    });
    text += '\n';
    
    text += '━━━━━━━━━━━━━━━━━━\n';
    text += '📤 分享渠道分布\n';
    report.channelDistribution.forEach(channel => {
      text += `• ${channel.channelName}：${channel.count}次 (${channel.percentage}%)\n`;
    });
    text += '\n';
    
    text += '━━━━━━━━━━━━━━━━━━\n';
    text += '📱 材料化学科研工具箱\n';
    
    return text;
  }

  /**
   * 计算百分比
   */
  calculatePercentage(value, total) {
    if (total === 0) return 0;
    return ((value / total) * 100).toFixed(1);
  }

  /**
   * 格式化日期标签
   */
  formatDateLabel(dateStr) {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}/${day}`;
  }

  /**
   * 获取时段描述
   */
  getTimePeriod(hour) {
    if (hour >= 6 && hour < 12) return '早上';
    if (hour >= 12 && hour < 18) return '下午';
    if (hour >= 18 && hour < 24) return '晚上';
    return '深夜';
  }

  /**
   * 清空所有统计
   */
  clearAll() {
    shareService.clearStatistics();
    this.clearCache(); // 清空缓存
    console.log('✅ 统计数据已清空');
  }

  /**
   * 从缓存获取数据（性能优化）
   */
  getFromCache(key) {
    const cached = this.queryCache[key];
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > this.cacheExpiry) {
      delete this.queryCache[key];
      return null;
    }

    return cached.data;
  }

  /**
   * 设置缓存
   */
  setCache(key, data) {
    this.queryCache[key] = {
      data,
      timestamp: Date.now()
    };

    // 限制缓存大小
    const keys = Object.keys(this.queryCache);
    if (keys.length > 10) {
      // 删除最旧的缓存
      const oldest = keys.sort((a, b) => 
        this.queryCache[a].timestamp - this.queryCache[b].timestamp
      )[0];
      delete this.queryCache[oldest];
    }
  }

  /**
   * 清空缓存
   */
  clearCache() {
    this.queryCache = {};
    console.log('✅ 查询缓存已清空');
  }
}

// 导出单例
const statisticsService = new StatisticsService();

module.exports = {
  statisticsService,
  StatisticsService
};

