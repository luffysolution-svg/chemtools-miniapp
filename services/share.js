/**
 * 分享服务 v6.0.0
 * 支持计算结果分享、格式化输出、分享卡片生成、分享统计
 */

const { storageService } = require('./storage');

class ShareService {
  constructor() {
    this.statisticsKey = 'chemtools:share_statistics';
  }
  /**
   * 格式化计算结果
   */
  formatCalculationResult(data) {
    let content = `📊 ${data.title || '计算结果'}\n\n`;
    
    // 输入参数
    if (data.inputs && Object.keys(data.inputs).length > 0) {
      content += `━━ 输入参数 ━━\n`;
      Object.entries(data.inputs).forEach(([key, value]) => {
        content += `  • ${key}: ${value}\n`;
      });
      content += `\n`;
    }
    
    // 计算结果
    if (data.results && Object.keys(data.results).length > 0) {
      content += `━━ 计算结果 ━━\n`;
      Object.entries(data.results).forEach(([key, value]) => {
        content += `  ✓ ${key}: ${value}\n`;
      });
      content += `\n`;
    }
    
    // 备注信息
    if (data.notes) {
      content += `━━ 备注 ━━\n`;
      content += `${data.notes}\n\n`;
    }
    
    // 底部信息
    content += `━━━━━━━━━━━━━━━━\n`;
    content += `📱 材料化学科研工具箱\n`;
    content += `🕐 ${new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })}`;
    
    return content;
  }

  /**
   * 格式化为 Markdown
   */
  formatAsMarkdown(data) {
    let content = `# ${data.title || '计算结果'}\n\n`;
    
    // 输入参数
    if (data.inputs && Object.keys(data.inputs).length > 0) {
      content += `## 输入参数\n\n`;
      Object.entries(data.inputs).forEach(([key, value]) => {
        content += `- **${key}**: ${value}\n`;
      });
      content += `\n`;
    }
    
    // 计算结果
    if (data.results && Object.keys(data.results).length > 0) {
      content += `## 计算结果\n\n`;
      Object.entries(data.results).forEach(([key, value]) => {
        content += `- **${key}**: ${value}\n`;
      });
      content += `\n`;
    }
    
    // 备注
    if (data.notes) {
      content += `## 备注\n\n`;
      content += `${data.notes}\n\n`;
    }
    
    // 底部
    content += `---\n\n`;
    content += `*由材料化学科研工具箱生成*  \n`;
    content += `*时间: ${new Date().toLocaleString()}*`;
    
    return content;
  }

  /**
   * 分享到微信（返回分享配置）
   */
  shareToWeChat(data) {
    return {
      title: data.title || '计算结果',
      path: data.path || '/pages/home/home',
      imageUrl: data.imageUrl || ''
    };
  }

  /**
   * 复制结果到剪贴板
   */
  copyToClipboard(data, format = 'text') {
    const content = format === 'markdown' 
      ? this.formatAsMarkdown(data)
      : this.formatCalculationResult(data);

    return new Promise((resolve, reject) => {
      wx.setClipboardData({
        data: content,
        success: () => {
          wx.showToast({
            title: '已复制到剪贴板',
            icon: 'success',
            duration: 2000
          });
          resolve(content);
        },
        fail: (err) => {
          wx.showToast({
            title: '复制失败',
            icon: 'none'
          });
          reject(err);
        }
      });
    });
  }

  /**
   * 分享结果（复制+提示分享）
   */
  async shareResult(data) {
    try {
      // 先复制到剪贴板
      await this.copyToClipboard(data);
      
      // 提示用户可以分享
      setTimeout(() => {
        wx.showModal({
          title: '分享提示',
          content: '结果已复制，现在可以分享给好友或朋友圈',
          showCancel: true,
          confirmText: '立即分享',
          cancelText: '稍后',
          success: (res) => {
            if (res.confirm) {
              wx.showShareMenu({
                withShareTicket: true,
                menus: ['shareAppMessage', 'shareTimeline']
              });
            }
          }
        });
      }, 500);
      
      return true;
    } catch (e) {
      console.error('分享结果失败:', e);
      return false;
    }
  }

  /**
   * 生成分享数据
   */
  generateShareData(toolName, inputs, results, notes) {
    return {
      title: `${toolName} - 计算结果`,
      inputs: inputs || {},
      results: results || {},
      notes: notes || '',
      timestamp: Date.now(),
      path: getCurrentPages()[getCurrentPages().length - 1]?.route || '/pages/home/home'
    };
  }

  /**
   * 保存分享历史
   */
  saveShareHistory(data) {
    try {
      const history = storageService.get('chemtools:share_history', []);
      
      history.unshift({
        ...data,
        shareTime: Date.now()
      });
      
      // 最多保存20条
      const limited = history.slice(0, 20);
      storageService.set('chemtools:share_history', limited);
      
      console.log('分享历史已保存');
    } catch (e) {
      console.error('保存分享历史失败:', e);
    }
  }

  /**
   * 获取分享历史
   */
  getShareHistory() {
    try {
      return storageService.get('chemtools:share_history', []);
    } catch (e) {
      return [];
    }
  }

  /**
   * 清空分享历史
   */
  clearShareHistory() {
    storageService.remove('chemtools:share_history');
    console.log('分享历史已清空');
  }

  /**
   * 记录分享统计 (v6.0.0新增)
   */
  recordShare(data) {
    try {
      const stats = this.getStatistics();
      
      const shareRecord = {
        tool: data.tool || 'unknown',
        toolName: data.toolName || data.tool,
        channel: data.channel || 'unknown', // friend/timeline/copy/card/album
        template: data.template || '',
        timestamp: Date.now(),
        date: new Date().toISOString().split('T')[0],
        hour: new Date().getHours()
      };

      // 添加到记录列表
      if (!stats.shares) stats.shares = [];
      stats.shares.unshift(shareRecord);
      
      // 限制记录数量（最多500条）
      if (stats.shares.length > 500) {
        stats.shares = stats.shares.slice(0, 500);
      }

      // 更新工具使用统计
      if (!stats.toolUsage) stats.toolUsage = {};
      stats.toolUsage[shareRecord.tool] = (stats.toolUsage[shareRecord.tool] || 0) + 1;

      // 更新渠道统计
      if (!stats.channelStats) stats.channelStats = {};
      stats.channelStats[shareRecord.channel] = (stats.channelStats[shareRecord.channel] || 0) + 1;

      // 更新时段统计
      if (!stats.timeDistribution) stats.timeDistribution = {};
      stats.timeDistribution[shareRecord.hour] = (stats.timeDistribution[shareRecord.hour] || 0) + 1;

      // 更新总数
      stats.totalShares = (stats.totalShares || 0) + 1;
      stats.lastShare = Date.now();

      // 保存统计
      this.saveStatistics(stats);
      
      console.log('分享统计已记录:', shareRecord);
      return true;
    } catch (e) {
      console.error('记录分享统计失败:', e);
      return false;
    }
  }

  /**
   * 获取分享统计
   */
  getStatistics() {
    return storageService.get(this.statisticsKey, {
      shares: [],
      toolUsage: {},
      channelStats: {},
      timeDistribution: {},
      totalShares: 0,
      lastShare: 0
    });
  }

  /**
   * 保存统计数据
   */
  saveStatistics(stats) {
    return storageService.set(this.statisticsKey, stats);
  }

  /**
   * 清空统计数据
   */
  clearStatistics() {
    storageService.remove(this.statisticsKey);
    console.log('分享统计已清空');
  }

  /**
   * 获取分享总数
   */
  getTotalShares() {
    const stats = this.getStatistics();
    return stats.totalShares || 0;
  }

  /**
   * 获取最近N天的分享数据
   */
  getRecentShares(days = 7) {
    const stats = this.getStatistics();
    const cutoffDate = Date.now() - (days * 24 * 60 * 60 * 1000);
    
    return (stats.shares || []).filter(share => share.timestamp >= cutoffDate);
  }

  /**
   * 获取热门工具排行
   */
  getTopTools(limit = 10) {
    const stats = this.getStatistics();
    const toolUsage = stats.toolUsage || {};
    
    return Object.entries(toolUsage)
      .map(([tool, count]) => ({ tool, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  /**
   * 获取渠道分布
   */
  getChannelDistribution() {
    const stats = this.getStatistics();
    return stats.channelStats || {};
  }

  /**
   * 获取时段分布
   */
  getTimeDistribution() {
    const stats = this.getStatistics();
    return stats.timeDistribution || {};
  }

  /**
   * 获取每日分享趋势（最近N天）
   */
  getDailyTrend(days = 7) {
    const stats = this.getStatistics();
    const shares = stats.shares || [];
    
    const trend = {};
    const today = new Date();
    
    // 初始化日期
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      trend[dateStr] = 0;
    }
    
    // 统计每天的分享数
    shares.forEach(share => {
      if (share.date && trend.hasOwnProperty(share.date)) {
        trend[share.date]++;
      }
    });
    
    return trend;
  }

  /**
   * 导出统计数据
   */
  exportStatistics() {
    const stats = this.getStatistics();
    
    return {
      summary: {
        totalShares: stats.totalShares,
        lastShare: stats.lastShare,
        toolCount: Object.keys(stats.toolUsage || {}).length,
        avgSharesPerDay: this.calculateAvgSharesPerDay()
      },
      topTools: this.getTopTools(10),
      channelDistribution: this.getChannelDistribution(),
      timeDistribution: this.getTimeDistribution(),
      dailyTrend: this.getDailyTrend(30),
      recentShares: this.getRecentShares(7)
    };
  }

  /**
   * 计算平均每日分享数
   */
  calculateAvgSharesPerDay() {
    const stats = this.getStatistics();
    const shares = stats.shares || [];
    
    if (shares.length === 0) return 0;
    
    const oldestShare = shares[shares.length - 1];
    const days = Math.max(1, Math.ceil((Date.now() - oldestShare.timestamp) / (24 * 60 * 60 * 1000)));
    
    return (stats.totalShares / days).toFixed(2);
  }
}

// 导出单例
const shareService = new ShareService();

module.exports = {
  shareService,
  ShareService
};

