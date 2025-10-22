/**
 * 数据备份管理页面 v4.2.0
 */

const { backupService } = require('../../../services/backup');

Page({
  data: {
    backupList: [],
    backupStats: {},
    autoBackupEnabled: true,
    isLoading: false,
    showRestoreOptions: false,
    selectedBackup: null,
    restoreOptions: {
      importHistory: true,
      importFavorites: true,
      importPreferences: true,
      importRecentTools: true,
      importSearchHistory: true,
      mergeMode: false
    }
  },

  onLoad() {
    this.loadBackupList();
    this.loadBackupStats();
    this.checkAutoBackupStatus();
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.loadBackupList();
    this.loadBackupStats();
    wx.stopPullDownRefresh();
  },

  /**
   * 加载备份列表
   */
  loadBackupList() {
    try {
      const backups = backupService.getBackupList();
      // 格式化备份列表数据
      const formattedBackups = backups.map(backup => ({
        ...backup,
        sizeText: (backup.size / 1024).toFixed(1)
      }));
      this.setData({ backupList: formattedBackups });
    } catch (e) {
      console.error('加载备份列表失败:', e);
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  },

  /**
   * 加载备份统计
   */
  loadBackupStats() {
    try {
      const stats = backupService.getBackupStats();
      // 格式化数据供 WXML 使用
      const formattedStats = {
        ...stats,
        totalSizeText: stats.totalSize ? (stats.totalSize / 1024).toFixed(1) : '0'
      };
      this.setData({ backupStats: formattedStats });
    } catch (e) {
      console.error('加载备份统计失败:', e);
    }
  },

  /**
   * 检查自动备份状态
   */
  checkAutoBackupStatus() {
    const config = backupService.config;
    this.setData({
      autoBackupEnabled: config.autoBackupEnabled
    });
  },

  /**
   * 创建手动备份
   */
  async createManualBackup() {
    wx.showLoading({
      title: '创建备份中...',
      mask: true
    });

    this.setData({ isLoading: true });

    try {
      const timestamp = new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      const result = await backupService.createBackup(`手动备份_${timestamp}`);

      wx.hideLoading();

      if (result.success) {
        wx.showToast({
          title: '备份创建成功',
          icon: 'success'
        });
        
        this.loadBackupList();
        this.loadBackupStats();
      } else {
        wx.showToast({
          title: '备份失败: ' + result.error,
          icon: 'none',
          duration: 3000
        });
      }
    } catch (e) {
      wx.hideLoading();
      wx.showToast({
        title: '备份失败',
        icon: 'none'
      });
    } finally {
      this.setData({ isLoading: false });
    }
  },

  /**
   * 显示备份详情
   */
  showBackupInfo(e) {
    const { backup } = e.currentTarget.dataset;
    const info = backupService.getBackupInfo(backup.id);

    if (!info) {
      wx.showToast({
        title: '备份信息不存在',
        icon: 'none'
      });
      return;
    }

    const content = `
备份名称：${info.name}
创建时间：${info.dateStr}
数据大小：${(info.size / 1024).toFixed(2)} KB
版本：${info.version}

数据统计：
• 历史记录：${info.dataCount.history} 条
• 收藏：${info.dataCount.favorites} 条
• 最近使用：${info.dataCount.recentTools} 条
• 搜索历史：${info.dataCount.searchHistory} 条
    `.trim();

    wx.showModal({
      title: '备份详情',
      content,
      showCancel: false,
      confirmText: '确定'
    });
  },

  /**
   * 显示恢复选项
   */
  showRestoreDialog(e) {
    const { backup } = e.currentTarget.dataset;
    this.setData({
      selectedBackup: backup,
      showRestoreOptions: true
    });
  },

  /**
   * 关闭恢复选项
   */
  closeRestoreOptions() {
    this.setData({
      showRestoreOptions: false,
      selectedBackup: null
    });
  },

  /**
   * 切换恢复选项
   */
  toggleRestoreOption(e) {
    const { option } = e.currentTarget.dataset;
    this.setData({
      [`restoreOptions.${option}`]: !this.data.restoreOptions[option]
    });
  },

  /**
   * 切换合并模式
   */
  toggleMergeMode() {
    this.setData({
      'restoreOptions.mergeMode': !this.data.restoreOptions.mergeMode
    });
  },

  /**
   * 确认恢复备份
   */
  async confirmRestore() {
    const { selectedBackup, restoreOptions } = this.data;

    if (!selectedBackup) {
      return;
    }

    wx.showModal({
      title: '确认恢复',
      content: `确定要从「${selectedBackup.name}」恢复数据吗？\n\n模式：${restoreOptions.mergeMode ? '合并' : '覆盖'}`,
      success: async (res) => {
        if (res.confirm) {
          await this.performRestore(selectedBackup.id, restoreOptions);
        }
      }
    });
  },

  /**
   * 执行恢复
   */
  async performRestore(backupId, options) {
    wx.showLoading({
      title: '恢复中...',
      mask: true
    });

    this.setData({ isLoading: true });

    try {
      const result = await backupService.restoreFromBackup(backupId, options);

      wx.hideLoading();

      if (result.success) {
        const summary = Object.entries(result.summary)
          .map(([key, count]) => `${key}: ${count}条`)
          .join('\n');

        wx.showModal({
          title: '恢复成功',
          content: `已恢复数据：\n${summary}`,
          showCancel: false,
          confirmText: '确定',
          success: () => {
            this.closeRestoreOptions();
            // 提示用户重启小程序
            wx.showModal({
              title: '提示',
              content: '数据已恢复，建议重启小程序以确保数据生效',
              confirmText: '重启',
              success: (res) => {
                if (res.confirm) {
                  wx.reLaunch({
                    url: '/pages/home/home'
                  });
                }
              }
            });
          }
        });
      } else {
        wx.showToast({
          title: '恢复失败: ' + result.error,
          icon: 'none',
          duration: 3000
        });
      }
    } catch (e) {
      wx.hideLoading();
      console.error('恢复备份失败:', e);
      wx.showToast({
        title: '恢复失败',
        icon: 'none'
      });
    } finally {
      this.setData({ isLoading: false });
    }
  },

  /**
   * 删除备份
   */
  deleteBackup(e) {
    const { backup } = e.currentTarget.dataset;

    wx.showModal({
      title: '确认删除',
      content: `确定要删除备份「${backup.name}」吗？此操作不可恢复。`,
      confirmColor: '#ff4444',
      success: (res) => {
        if (res.confirm) {
          const result = backupService.deleteBackup(backup.id);
          
          if (result.success) {
            wx.showToast({
              title: '删除成功',
              icon: 'success'
            });
            this.loadBackupList();
            this.loadBackupStats();
          } else {
            wx.showToast({
              title: '删除失败',
              icon: 'none'
            });
          }
        }
      }
    });
  },

  /**
   * 切换自动备份
   */
  toggleAutoBackup(e) {
    const enabled = e.detail.value;

    if (enabled) {
      backupService.enableAutoBackup();
      wx.showToast({
        title: '已启用自动备份',
        icon: 'success'
      });
    } else {
      backupService.disableAutoBackup();
      wx.showToast({
        title: '已关闭自动备份',
        icon: 'none'
      });
    }

    this.setData({ autoBackupEnabled: enabled });
  },

  /**
   * 设置备份间隔
   */
  setBackupInterval() {
    wx.showActionSheet({
      itemList: ['每12小时', '每24小时', '每48小时', '每7天'],
      success: (res) => {
        const intervals = [12, 24, 48, 168];
        const hours = intervals[res.tapIndex];
        
        backupService.setBackupInterval(hours);
        
        wx.showToast({
          title: `已设置为每${hours}小时备份`,
          icon: 'success'
        });
      }
    });
  },

  /**
   * 设置最大备份数
   */
  setMaxBackups() {
    wx.showActionSheet({
      itemList: ['保留3个', '保留5个', '保留7个', '保留10个'],
      success: (res) => {
        const counts = [3, 5, 7, 10];
        const count = counts[res.tapIndex];
        
        backupService.setMaxBackups(count);
        
        wx.showToast({
          title: `已设置最多保留${count}个备份`,
          icon: 'success'
        });

        this.loadBackupList();
      }
    });
  },

  /**
   * 格式化大小
   */
  formatSize(bytes) {
    if (bytes < 1024) {
      return bytes + ' B';
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(2) + ' KB';
    } else {
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }
  },

  /**
   * 空函数（用于阻止事件冒泡）
   */
  doNothing() {
    // 空函数，用于阻止事件冒泡
  },

  /**
   * 分享
   */
  onShareAppMessage() {
    return {
      title: '数据备份 - 材料化学工具箱',
      path: '/pages/settings/backup/backup'
    };
  }
});

