App({
  // 全局数据：确保始终存在，避免 getApp().globalData 为空导致读取 theme 报错
  globalData: {
    theme: 'light'
  },

  onLaunch() {
    // 固定为亮色主题，不再跟随系统或动态切换
    // 如需从本地存储恢复，也可在此读取并校验：
    try {
      const savedTheme = wx.getStorageSync('chemtools:theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        this.globalData.theme = savedTheme;
      }
    } catch (_) {
      // 忽略存储读取异常，保持默认 light
    }
  }
});
