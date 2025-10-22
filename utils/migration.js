/**
 * 数据迁移工具
 * 用于本地数据备份和恢复
 * 
 * @version 8.1.0
 * @author ChemTools Team
 */

const MIGRATION_VERSION_KEY = 'chemtools:migration:version';
const MIGRATION_STATUS_KEY = 'chemtools:migration:status';
const CURRENT_VERSION = '8.1.0';

/**
 * 数据迁移管理器
 */
class MigrationManager {
  constructor() {
    this.migrationStatus = this.getMigrationStatus();
  }

  /**
   * 获取迁移状态
   */
  getMigrationStatus() {
    try {
      const status = wx.getStorageSync(MIGRATION_STATUS_KEY);
      return status || {
        version: null,
        lastMigrationTime: null,
        localBackupCreated: false
      };
    } catch (e) {
      console.error('获取迁移状态失败:', e);
      return {
        version: null,
        lastMigrationTime: null,
        localBackupCreated: false
      };
    }
  }

  /**
   * 更新迁移状态
   */
  updateMigrationStatus(updates) {
    this.migrationStatus = {
      ...this.migrationStatus,
      ...updates
    };
    
    try {
      wx.setStorageSync(MIGRATION_STATUS_KEY, this.migrationStatus);
    } catch (e) {
      console.error('更新迁移状态失败:', e);
    }
  }

  /**
   * 检查是否需要迁移
   */
  needsMigration() {
    return this.migrationStatus.version !== CURRENT_VERSION;
  }

  /**
   * 创建本地备份
   */
  async createLocalBackup() {
    try {
      // 读取所有本地数据
      const historyData = wx.getStorageSync('chemtools:history') || [];
      const favoritesData = wx.getStorageSync('chemtools:favorites') || [];
      const settingsData = wx.getStorageSync('chemtools:settings') || {};
      const recentToolsData = wx.getStorageSync('chemtools:recent_tools') || [];
      const searchHistoryData = wx.getStorageSync('chemtools:search_history') || [];

      // 创建备份对象
      const backup = {
        version: CURRENT_VERSION,
        timestamp: Date.now(),
        data: {
          history: historyData,
          favorites: favoritesData,
          settings: settingsData,
          recentTools: recentToolsData,
          searchHistory: searchHistoryData
        },
        stats: {
          historyCount: historyData.length,
          favoritesCount: favoritesData.length
        }
      };

      // 保存备份到本地
      const backupKey = `chemtools:backup:v8_migration_${Date.now()}`;
      wx.setStorageSync(backupKey, backup);

      console.log('✅ 本地备份创建成功');
      console.log('备份key:', backupKey);
      console.log('历史记录:', backup.stats.historyCount);
      console.log('收藏记录:', backup.stats.favoritesCount);

      this.updateMigrationStatus({
        localBackupCreated: true,
        backupKey
      });

      return {
        success: true,
        backup,
        backupKey
      };
    } catch (e) {
      console.error('创建本地备份失败:', e);
      return {
        success: false,
        error: e.message
      };
    }
  }

  /**
   * 恢复本地备份
   */
  restoreLocalBackup(backupKey) {
    try {
      const backup = wx.getStorageSync(backupKey);
      
      if (!backup) {
        return {
          success: false,
          error: '备份不存在'
        };
      }

      // 恢复数据
      if (backup.data.history) {
        wx.setStorageSync('chemtools:history', backup.data.history);
      }
      
      if (backup.data.favorites) {
        wx.setStorageSync('chemtools:favorites', backup.data.favorites);
      }
      
      if (backup.data.settings) {
        wx.setStorageSync('chemtools:settings', backup.data.settings);
      }

      console.log('✅ 本地备份恢复成功');

      return {
        success: true,
        message: '本地备份恢复成功',
        restored: backup.stats
      };
    } catch (e) {
      console.error('恢复本地备份失败:', e);
      return {
        success: false,
        error: e.message
      };
    }
  }

  /**
   * 列出所有本地备份
   */
  listLocalBackups() {
    try {
      const info = wx.getStorageInfoSync();
      const backupKeys = info.keys.filter(key => 
        key.startsWith('chemtools:backup:')
      );

      const backups = backupKeys.map(key => {
        const backup = wx.getStorageSync(key);
        return {
          key,
          timestamp: backup.timestamp,
          version: backup.version,
          stats: backup.stats
        };
      }).sort((a, b) => b.timestamp - a.timestamp);

      return {
        success: true,
        backups
      };
    } catch (e) {
      console.error('列出备份失败:', e);
      return {
        success: false,
        error: e.message
      };
    }
  }

  /**
   * 删除本地备份
   */
  deleteLocalBackup(backupKey) {
    try {
      wx.removeStorageSync(backupKey);
      return {
        success: true,
        message: '备份已删除'
      };
    } catch (e) {
      console.error('删除备份失败:', e);
      return {
        success: false,
        error: e.message
      };
    }
  }

  /**
   * 清理旧备份（保留最近N个）
   */
  cleanOldBackups(keep = 5) {
    try {
      const listResult = this.listLocalBackups();
      
      if (!listResult.success || listResult.backups.length <= keep) {
        return {
          success: true,
          cleaned: 0
        };
      }

      // 删除多余的备份
      const toDelete = listResult.backups.slice(keep);
      let cleaned = 0;

      toDelete.forEach(backup => {
        const result = this.deleteLocalBackup(backup.key);
        if (result.success) {
          cleaned++;
        }
      });

      console.log(`🧹 清理了${cleaned}个旧备份`);

      return {
        success: true,
        cleaned
      };
    } catch (e) {
      console.error('清理备份失败:', e);
      return {
        success: false,
        error: e.message
      };
    }
  }
}

/**
 * 全局迁移管理器实例
 */
const migrationManager = new MigrationManager();

/**
 * 自动迁移检查（在app.js的onLaunch中调用）
 */
async function autoMigrationCheck() {
  console.log('ℹ️ 数据迁移检查（仅本地备份功能）');
  // 云功能已移除，此函数保留用于未来扩展
}

/**
 * 手动触发迁移（在设置页面调用）
 */
async function manualMigration(mode = 'backup') {
  wx.showLoading({ title: '处理中...' });

  let result;
  
  if (mode === 'backup') {
    result = await migrationManager.createLocalBackup();
  } else {
    result = { success: false, error: '未知模式' };
  }

  wx.hideLoading();

  return result;
}

module.exports = {
  MigrationManager,
  migrationManager,
  autoMigrationCheck,
  manualMigration
};
