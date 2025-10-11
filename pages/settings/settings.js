// 个性化设置页面
const storageService = require('../../services/storage');

Page({
  data: {
    // 主题设置
    theme: 'light',
    themes: ['light', 'dark', 'auto'],
    themeLabels: { light: '浅色', dark: '深色', auto: '跟随系统' },
    
    // 默认单位设置
    defaultUnits: {
      length: 'nm',
      energy: 'eV',
      temperature: 'C',
      concentration: 'M'
    },
    
    // 精度设置
    decimalPlaces: 4,
    decimalOptions: [2, 3, 4, 5, 6],
    
    // 显示设置
    showMetadata: true,
    showFormula: true,
    showWarnings: true,
    
    // 数据管理
    historyLimit: 100,
    autoSaveHistory: true,
    
    // 首页布局
    homeLayout: 'grid',
    homeLayouts: ['grid', 'list'],
    homeLayoutLabels: { grid: '网格', list: '列表' },
    
    // 其他设置
    enableVibration: true,
    enableSound: false,
    
    // 统计信息
    totalCalculations: 0,
    totalHistory: 0,
    storageUsed: '0 KB'
  },

  onLoad() {
    this.loadSettings();
    this.loadStatistics();
  },

  // 加载设置
  loadSettings() {
    const settings = storageService.get('appSettings') || {};
    
    this.setData({
      theme: settings.theme || 'light',
      defaultUnits: settings.defaultUnits || this.data.defaultUnits,
      decimalPlaces: settings.decimalPlaces || 4,
      showMetadata: settings.showMetadata !== false,
      showFormula: settings.showFormula !== false,
      showWarnings: settings.showWarnings !== false,
      historyLimit: settings.historyLimit || 100,
      autoSaveHistory: settings.autoSaveHistory !== false,
      homeLayout: settings.homeLayout || 'grid',
      enableVibration: settings.enableVibration !== false,
      enableSound: settings.enableSound || false
    });
  },

  // 加载统计信息
  loadStatistics() {
    const history = storageService.get('calculationHistory') || [];
    const storageInfo = wx.getStorageInfoSync();
    
    this.setData({
      totalHistory: history.length,
      totalCalculations: history.length,
      storageUsed: `${(storageInfo.currentSize / 1024).toFixed(2)} KB`
    });
  },

  // 保存设置
  saveSettings() {
    const settings = {
      theme: this.data.theme,
      defaultUnits: this.data.defaultUnits,
      decimalPlaces: this.data.decimalPlaces,
      showMetadata: this.data.showMetadata,
      showFormula: this.data.showFormula,
      showWarnings: this.data.showWarnings,
      historyLimit: this.data.historyLimit,
      autoSaveHistory: this.data.autoSaveHistory,
      homeLayout: this.data.homeLayout,
      enableVibration: this.data.enableVibration,
      enableSound: this.data.enableSound
    };
    
    storageService.set('appSettings', settings);
    
    // 应用主题
    this.applyTheme();
    
    wx.showToast({
      title: '设置已保存',
      icon: 'success'
    });
  },

  // 应用主题
  applyTheme() {
    const { theme } = this.data;
    
    if (theme === 'auto') {
      // 检测系统主题
      const systemInfo = wx.getSystemInfoSync();
      const isDark = systemInfo.theme === 'dark';
      wx.setBackgroundColor({
        backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
        backgroundColorTop: isDark ? '#1a1a1a' : '#ffffff',
        backgroundColorBottom: isDark ? '#1a1a1a' : '#ffffff'
      });
    } else if (theme === 'dark') {
      wx.setBackgroundColor({
        backgroundColor: '#1a1a1a',
        backgroundColorTop: '#1a1a1a',
        backgroundColorBottom: '#1a1a1a'
      });
    } else {
      wx.setBackgroundColor({
        backgroundColor: '#ffffff',
        backgroundColorTop: '#ffffff',
        backgroundColorBottom: '#ffffff'
      });
    }
  },

  // 主题切换
  onThemeChange(e) {
    this.setData({ theme: this.data.themes[e.detail.value] });
    this.saveSettings();
  },

  // 精度设置
  onDecimalChange(e) {
    this.setData({ decimalPlaces: this.data.decimalOptions[e.detail.value] });
    this.saveSettings();
  },

  // 布局切换
  onLayoutChange(e) {
    this.setData({ homeLayout: this.data.homeLayouts[e.detail.value] });
    this.saveSettings();
  },

  // 开关切换
  onSwitchChange(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({ [field]: e.detail.value });
    this.saveSettings();
  },

  // 默认单位设置
  onUnitChange(e) {
    const { type } = e.currentTarget.dataset;
    const value = e.detail.value;
    
    this.setData({
      [`defaultUnits.${type}`]: value
    });
    this.saveSettings();
  },

  // 清除历史记录
  clearHistory() {
    wx.showModal({
      title: '确认清除',
      content: '确定要清除所有历史记录吗？此操作不可撤销。',
      confirmText: '清除',
      confirmColor: '#e74c3c',
      success: (res) => {
        if (res.confirm) {
          storageService.remove('calculationHistory');
          this.loadStatistics();
          
          wx.showToast({
            title: '已清除历史记录',
            icon: 'success'
          });
        }
      }
    });
  },

  // 清除缓存
  clearCache() {
    wx.showModal({
      title: '确认清除',
      content: '确定要清除所有缓存吗？不会删除历史记录。',
      confirmText: '清除',
      success: (res) => {
        if (res.confirm) {
          // 保留重要数据
          const history = storageService.get('calculationHistory');
          const settings = storageService.get('appSettings');
          
          // 清除所有存储
          wx.clearStorageSync();
          
          // 恢复重要数据
          if (history) storageService.set('calculationHistory', history);
          if (settings) storageService.set('appSettings', settings);
          
          this.loadStatistics();
          
          wx.showToast({
            title: '缓存已清除',
            icon: 'success'
          });
        }
      }
    });
  },

  // 重置所有设置
  resetSettings() {
    wx.showModal({
      title: '确认重置',
      content: '确定要重置所有设置为默认值吗？',
      confirmText: '重置',
      confirmColor: '#e74c3c',
      success: (res) => {
        if (res.confirm) {
          storageService.remove('appSettings');
          this.loadSettings();
          this.applyTheme();
          
          wx.showToast({
            title: '已重置为默认设置',
            icon: 'success'
          });
        }
      }
    });
  },

  // 导出设置
  exportSettings() {
    const settings = storageService.get('appSettings') || {};
    const json = JSON.stringify(settings, null, 2);
    
    wx.setClipboardData({
      data: json,
      success: () => {
        wx.showToast({
          title: '设置已复制到剪贴板',
          icon: 'success'
        });
      }
    });
  }
});

