/**
 * 统计展示页面 v6.0.0
 */

Page({
  data: {
    // 统计概览
    overview: {
      totalShares: 0,
      recentShares7Days: 0,
      recentShares30Days: 0,
      avgSharesPerDay: 0
    },
    
    // 热门工具
    topTools: [],
    
    // 渠道分布
    channelDistribution: [],
    
    // 时段分布
    hourlyDistribution: [],
    peakHours: [],
    
    // 每日趋势
    dailyTrend: [],
    
    // 周月统计
    weeklyStats: null,
    monthlyStats: null,
    
    // 用户偏好
    userPreferences: null,
    
    // 显示控制
    showTopTools: true,
    showChannels: true,
    showHourly: false,
    showDaily: false,
    
    // 加载状态
    loading: true,
    hasData: false
  },

  onLoad() {
    this.loadStatistics();
  },

  onShow() {
    this.loadStatistics();
  },

  onPullDownRefresh() {
    this.loadStatistics();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },

  /**
   * 加载统计数据
   */
  loadStatistics() {
    try {
      const app = getApp();
      const statisticsService = app.getStatisticsService?.();
      
      if (!statisticsService) {
        console.error('统计服务未初始化');
        this.setData({ loading: false });
        return;
      }

      // 获取统计概览
      const overview = statisticsService.getOverview();
      
      // 检查是否有数据
      const hasData = overview.totalShares > 0;
      
      if (!hasData) {
        this.setData({ 
          loading: false,
          hasData: false 
        });
        return;
      }

      // 获取各项统计数据
      const topTools = statisticsService.getTopToolsWithNames(10);
      const channelDistribution = statisticsService.getChannelDistributionWithDetails();
      const hourlyDistribution = statisticsService.getHourlyDistribution();
      const peakHours = statisticsService.getPeakHours(5);
      const dailyTrend = statisticsService.getDailyTrendWithLabels(7);
      const weeklyStats = statisticsService.getWeeklyStats();
      const monthlyStats = statisticsService.getMonthlyStats();
      const userPreferences = statisticsService.getUserPreferences();

      this.setData({
        overview,
        topTools,
        channelDistribution,
        hourlyDistribution,
        peakHours,
        dailyTrend,
        weeklyStats,
        monthlyStats,
        userPreferences,
        loading: false,
        hasData: true
      });

    } catch (e) {
      console.error('加载统计失败:', e);
      this.setData({ loading: false });
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  },

  /**
   * 切换显示区块
   */
  toggleSection(e) {
    const { section } = e.currentTarget.dataset;
    const key = `show${section}`;
    this.setData({
      [key]: !this.data[key]
    });
  },

  /**
   * 导出统计报告
   */
  exportReport() {
    wx.showActionSheet({
      itemList: ['导出为文本', '导出为JSON', '分享报告'],
      success: (res) => {
        const index = res.tapIndex;
        if (index === 0) {
          this.exportAsText();
        } else if (index === 1) {
          this.exportAsJSON();
        } else if (index === 2) {
          this.shareReport();
        }
      }
    });
  },

  /**
   * 导出为文本
   */
  async exportAsText() {
    try {
      const app = getApp();
      const statisticsService = app.getStatisticsService?.();
      
      const text = statisticsService.exportAsText();
      
      await wx.setClipboardData({
        data: text
      });
      
      wx.showToast({
        title: '已复制到剪贴板',
        icon: 'success'
      });

    } catch (e) {
      console.error('导出失败:', e);
      wx.showToast({
        title: '导出失败',
        icon: 'none'
      });
    }
  },

  /**
   * 导出为JSON
   */
  async exportAsJSON() {
    try {
      const app = getApp();
      const statisticsService = app.getStatisticsService?.();
      
      const report = statisticsService.exportFullReport();
      const json = JSON.stringify(report, null, 2);
      
      await wx.setClipboardData({
        data: json
      });
      
      wx.showToast({
        title: '已复制到剪贴板',
        icon: 'success'
      });

    } catch (e) {
      console.error('导出失败:', e);
      wx.showToast({
        title: '导出失败',
        icon: 'none'
      });
    }
  },

  /**
   * 分享报告
   */
  shareReport() {
    this.exportAsText();
    setTimeout(() => {
      wx.showModal({
        title: '分享提示',
        content: '报告已复制到剪贴板，可以分享给好友',
        showCancel: false
      });
    }, 500);
  },

  /**
   * 清空统计数据
   */
  clearStatistics() {
    wx.showModal({
      title: '清空统计',
      content: '确定要清空所有统计数据吗？此操作不可恢复',
      confirmColor: '#ff6b6b',
      success: (res) => {
        if (res.confirm) {
          try {
            const app = getApp();
            const statisticsService = app.getStatisticsService?.();
            
            statisticsService.clearAll();
            
            wx.showToast({
              title: '已清空',
              icon: 'success'
            });

            // 重新加载
            this.setData({
              hasData: false,
              overview: {
                totalShares: 0,
                recentShares7Days: 0,
                recentShares30Days: 0,
                avgSharesPerDay: 0
              }
            });

          } catch (e) {
            console.error('清空失败:', e);
            wx.showToast({
              title: '操作失败',
              icon: 'none'
            });
          }
        }
      }
    });
  },

  /**
   * 获取趋势图标
   */
  getTrendIcon(trend) {
    if (trend === 'up') return '📈';
    if (trend === 'down') return '📉';
    return '➡️';
  },

  /**
   * 格式化时间
   */
  formatTime(timestamp) {
    if (!timestamp) return '暂无';
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN');
  }
});

