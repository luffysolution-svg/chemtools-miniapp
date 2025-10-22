/**
 * 离线设置页面 v6.0.0
 */

Page({
  data: {
    // 离线状态
    offlineEnabled: false,
    isOnline: true,
    
    // 工具列表
    tools: [],
    categories: [
      { id: 'basic', name: '基础工具', icon: '🧮' },
      { id: 'advanced', name: '高级工具', icon: '🔬' },
      { id: 'spectroscopy', name: '光谱工具', icon: '📊' },
      { id: 'materials', name: '材料数据', icon: '⚛️' },
      { id: 'batch', name: '批量工具', icon: '📝' }
    ],
    
    // 存储统计
    stats: {
      totalTools: 0,
      installedCount: 0,
      storageUsed: 0,
      maxStorage: 10240,
      percentage: 0
    },
    
    // 操作状态
    installing: false,
    installProgress: 0
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    this.loadData();
  },

  /**
   * 加载数据
   */
  loadData() {
    try {
      const app = getApp();
      const offlineService = app.getOfflineService?.();
      
      if (!offlineService) {
        console.error('离线服务未初始化');
        return;
      }

      // 获取配置
      const config = offlineService.getConfig();
      const isOnline = offlineService.isOnline();
      
      // 获取工具列表
      const tools = offlineService.getAllTools();
      
      // 获取存储统计
      const stats = offlineService.getStorageStats();

      this.setData({
        offlineEnabled: config.enabled,
        isOnline,
        tools,
        stats
      });

    } catch (e) {
      console.error('加载数据失败:', e);
    }
  },

  /**
   * 切换离线模式
   */
  toggleOfflineMode(e) {
    const enabled = e.detail.value;
    
    try {
      const app = getApp();
      const offlineService = app.getOfflineService?.();
      
      if (enabled) {
        offlineService.enableOffline();
        wx.showToast({
          title: '离线模式已启用',
          icon: 'success'
        });
      } else {
        offlineService.disableOffline();
        wx.showToast({
          title: '离线模式已关闭',
          icon: 'none'
        });
      }

      this.setData({ offlineEnabled: enabled });

    } catch (e) {
      console.error('切换失败:', e);
      wx.showToast({
        title: '操作失败',
        icon: 'none'
      });
    }
  },

  /**
   * 安装工具
   */
  async installTool(e) {
    const { id } = e.currentTarget.dataset;
    
    wx.showLoading({ title: '安装中...' });

    try {
      const app = getApp();
      const offlineService = app.getOfflineService?.();
      
      const result = await offlineService.installTool(id);
      
      wx.hideLoading();

      if (result.success) {
        wx.showToast({
          title: '安装成功',
          icon: 'success'
        });
        this.loadData();
      } else {
        wx.showToast({
          title: result.error || '安装失败',
          icon: 'none'
        });
      }

    } catch (e) {
      wx.hideLoading();
      console.error('安装失败:', e);
      wx.showToast({
        title: '安装失败',
        icon: 'none'
      });
    }
  },

  /**
   * 卸载工具
   */
  async uninstallTool(e) {
    const { id, name } = e.currentTarget.dataset;

    const confirmed = await this.showConfirm(
      '确认卸载',
      `确定要卸载"${name}"吗？`
    );

    if (!confirmed) return;

    try {
      const app = getApp();
      const offlineService = app.getOfflineService?.();
      
      const result = await offlineService.uninstallTool(id);

      if (result.success) {
        wx.showToast({
          title: '已卸载',
          icon: 'success'
        });
        this.loadData();
      }

    } catch (e) {
      console.error('卸载失败:', e);
      wx.showToast({
        title: '卸载失败',
        icon: 'none'
      });
    }
  },

  /**
   * 一键安装必需工具
   */
  async installEssential() {
    const confirmed = await this.showConfirm(
      '一键安装',
      '将安装所有必需的核心工具，需要约1-2分钟'
    );

    if (!confirmed) return;

    this.setData({ installing: true, installProgress: 0 });

    try {
      const app = getApp();
      const offlineService = app.getOfflineService?.();
      
      const result = await offlineService.installEssentialTools((progress) => {
        this.setData({
          installProgress: progress.progress
        });
      });

      this.setData({ installing: false });

      if (result.success) {
        wx.showToast({
          title: `已安装${result.installed}个工具`,
          icon: 'success',
          duration: 2000
        });
        this.loadData();
      }

    } catch (e) {
      this.setData({ installing: false });
      console.error('批量安装失败:', e);
      wx.showToast({
        title: '安装失败',
        icon: 'none'
      });
    }
  },

  /**
   * 清空所有数据
   */
  async clearAllData() {
    const confirmed = await this.showConfirm(
      '清空数据',
      '确定要清空所有离线数据吗？此操作不可恢复'
    );

    if (!confirmed) return;

    try {
      const app = getApp();
      const offlineService = app.getOfflineService?.();
      
      const result = offlineService.clearAllData();

      if (result.success) {
        wx.showToast({
          title: '已清空',
          icon: 'success'
        });
        this.loadData();
      }

    } catch (e) {
      console.error('清空失败:', e);
      wx.showToast({
        title: '操作失败',
        icon: 'none'
      });
    }
  },

  /**
   * 检查更新
   */
  async checkUpdate() {
    wx.showLoading({ title: '检查中...' });

    try {
      const app = getApp();
      const offlineService = app.getOfflineService?.();
      
      const result = await offlineService.checkUpdate();
      
      wx.hideLoading();

      if (result.hasUpdate) {
        const confirmed = await this.showConfirm(
          '发现更新',
          `有新版本 ${result.latestVersion} 可用，大小约 ${Math.floor(result.updateSize / 1024)}MB`
        );

        if (confirmed) {
          await this.performUpdate();
        }
      } else {
        wx.showToast({
          title: '已是最新版本',
          icon: 'success'
        });
      }

    } catch (e) {
      wx.hideLoading();
      console.error('检查更新失败:', e);
      wx.showToast({
        title: '检查失败',
        icon: 'none'
      });
    }
  },

  /**
   * 执行更新
   */
  async performUpdate() {
    wx.showLoading({ title: '更新中...' });

    try {
      const app = getApp();
      const offlineService = app.getOfflineService?.();
      
      const result = await offlineService.performUpdate();
      
      wx.hideLoading();

      if (result.success) {
        wx.showToast({
          title: '更新成功',
          icon: 'success'
        });
        this.loadData();
      }

    } catch (e) {
      wx.hideLoading();
      console.error('更新失败:', e);
    }
  },

  /**
   * 显示确认对话框
   */
  showConfirm(title, content) {
    return new Promise((resolve) => {
      wx.showModal({
        title,
        content,
        success: (res) => {
          resolve(res.confirm);
        },
        fail: () => {
          resolve(false);
        }
      });
    });
  },

  /**
   * 格式化存储大小
   */
  formatSize(kb) {
    if (kb < 1024) {
      return `${kb}KB`;
    }
    return `${(kb / 1024).toFixed(2)}MB`;
  }
});

