const { backupService } = require('./services/backup');
const { preloadService } = require('./services/preload');
const { shareService } = require('./services/share');
const { offlineService } = require('./services/offline');
const { statisticsService } = require('./services/statistics');

App({
  globalData: {
    version: 'v8.1.0',
    userInfo: null,
    preloadConfig: {
      enabled: true,
      preloadCount: 3,
      cacheSize: 5
    },
    backupConfig: {
      autoBackupEnabled: true,
      backupInterval: 24,
      maxBackups: 7
    },
    offlineConfig: {
      enabled: false,
      autoDownload: false
    }
  },

  onLaunch() {
    console.log('App Launch - v8.1.0');
    
    // 启动时初始化各种服务
    this.initializeServices();
  },

  onShow() {
    console.log('App Show');
    
    // 每次显示时检查是否需要备份
    this.checkAutoBackup();
  },

  // 初始化服务
  initializeServices() {
    try {
      // 启用预加载服务
      if (this.globalData.preloadConfig.enabled) {
        preloadService.enablePreload();
        console.log('✅ 预加载服务已启用');
      }

      // 启用自动备份
      if (this.globalData.backupConfig.autoBackupEnabled) {
        backupService.enableAutoBackup();
        console.log('✅ 自动备份服务已启用');
      }

      // 初始化离线服务
      offlineService.init();
      console.log('✅ 离线服务已初始化');

      // 延迟1秒后预加载常用页面，避免影响启动速度
      setTimeout(() => {
        preloadService.preloadCommonPages();
      }, 1000);

    } catch (e) {
      console.error('服务初始化失败:', e);
    }
  },

  // 检查并执行自动备份
  async checkAutoBackup() {
    try {
      if (backupService.shouldAutoBackup()) {
        console.log('⏰ 执行自动备份...');
        const result = await backupService.performAutoBackup();
        
        if (result.success) {
          console.log('✅ 自动备份完成:', result.name);
        } else {
          console.log('⚠️ 自动备份跳过:', result.reason || result.error);
        }
      }
    } catch (e) {
      console.error('自动备份检查失败:', e);
    }
  },

  // 获取各种服务的方法
  getBackupService() {
    return backupService;
  },

  getPreloadService() {
    return preloadService;
  },

  getShareService() {
    return shareService;
  },

  getOfflineService() {
    return offlineService;
  },

  getStatisticsService() {
    return statisticsService;
  }
});
