/**
 * 自动备份服务 v4.2.0
 * 提供数据自动备份、手动备份、恢复等功能
 */

const { storageService } = require('./storage');

const BACKUP_PREFIX = 'chemtools:backup:';
const BACKUP_CONFIG_KEY = 'chemtools:backup_config';
const LAST_BACKUP_KEY = 'chemtools:last_backup_time';

class BackupService {
  constructor() {
    this.config = this.loadConfig();
  }

  /**
   * 加载备份配置
   */
  loadConfig() {
    const defaultConfig = {
      autoBackupEnabled: true,
      backupInterval: 24 * 60 * 60 * 1000, // 24小时（毫秒）
      maxBackups: 7, // 保留最近7天的备份
      lastBackupTime: 0
    };

    try {
      const config = storageService.get(BACKUP_CONFIG_KEY, defaultConfig);
      return { ...defaultConfig, ...config };
    } catch (e) {
      return defaultConfig;
    }
  }

  /**
   * 保存备份配置
   */
  saveConfig() {
    storageService.set(BACKUP_CONFIG_KEY, this.config);
  }

  /**
   * 启用自动备份
   */
  enableAutoBackup() {
    this.config.autoBackupEnabled = true;
    this.saveConfig();
    console.log('自动备份已启用');
  }

  /**
   * 禁用自动备份
   */
  disableAutoBackup() {
    this.config.autoBackupEnabled = false;
    this.saveConfig();
    console.log('自动备份已禁用');
  }

  /**
   * 检查是否需要自动备份
   */
  shouldAutoBackup() {
    if (!this.config.autoBackupEnabled) {
      return false;
    }

    const now = Date.now();
    const lastBackup = this.config.lastBackupTime || 0;
    const timeSinceLastBackup = now - lastBackup;

    return timeSinceLastBackup >= this.config.backupInterval;
  }

  /**
   * 执行自动备份
   */
  async performAutoBackup() {
    if (!this.shouldAutoBackup()) {
      console.log('无需自动备份');
      return { success: false, reason: '时间未到' };
    }

    try {
      const result = await this.createBackup(`auto_${this.formatDate(new Date())}`);
      
      if (result.success) {
        this.config.lastBackupTime = Date.now();
        this.saveConfig();
        this.cleanupOldBackups();
      }

      return result;
    } catch (e) {
      console.error('自动备份失败:', e);
      return { success: false, error: e.message };
    }
  }

  /**
   * 创建备份
   * @param {string} name - 备份名称
   */
  async createBackup(name) {
    try {
      const timestamp = Date.now();
      const backupId = `${BACKUP_PREFIX}${timestamp}`;
      
      // 导出所有数据
      const backupData = storageService.exportAllData();
      
      // 添加备份元数据
      const backup = {
        id: backupId,
        name: name || this.formatDate(new Date(timestamp)),
        timestamp,
        version: 'v4.2.0',
        data: backupData.data,
        size: JSON.stringify(backupData).length
      };

      // 保存备份
      storageService.set(backupId, backup);

      console.log(`备份创建成功: ${name}, ID: ${backupId}`);
      
      return {
        success: true,
        backupId,
        name: backup.name,
        timestamp,
        size: backup.size
      };
    } catch (e) {
      console.error('创建备份失败:', e);
      return {
        success: false,
        error: e.message
      };
    }
  }

  /**
   * 获取备份列表
   */
  getBackupList() {
    try {
      const info = wx.getStorageInfoSync();
      const keys = info.keys || [];
      
      const backups = keys
        .filter(key => key.startsWith(BACKUP_PREFIX))
        .map(key => {
          try {
            const backup = storageService.get(key);
            return {
              id: backup.id,
              name: backup.name,
              timestamp: backup.timestamp,
              size: backup.size,
              version: backup.version || 'v3.11.0',
              dateStr: this.formatDate(new Date(backup.timestamp))
            };
          } catch (e) {
            console.error(`读取备份失败: ${key}`, e);
            return null;
          }
        })
        .filter(backup => backup !== null)
        .sort((a, b) => b.timestamp - a.timestamp);

      return backups;
    } catch (e) {
      console.error('获取备份列表失败:', e);
      return [];
    }
  }

  /**
   * 获取备份详情
   */
  getBackupInfo(backupId) {
    try {
      const backup = storageService.get(backupId);
      if (!backup) {
        return null;
      }

      return {
        id: backup.id,
        name: backup.name,
        timestamp: backup.timestamp,
        size: backup.size,
        version: backup.version,
        dateStr: this.formatDate(new Date(backup.timestamp)),
        dataCount: {
          history: (backup.data.history || []).length,
          favorites: (backup.data.favorites || []).length,
          recentTools: (backup.data.recentTools || []).length,
          searchHistory: (backup.data.searchHistory || []).length
        }
      };
    } catch (e) {
      console.error(`获取备份详情失败: ${backupId}`, e);
      return null;
    }
  }

  /**
   * 从备份恢复
   * @param {string} backupId - 备份ID
   * @param {object} options - 恢复选项
   */
  async restoreFromBackup(backupId, options = {}) {
    try {
      const backup = storageService.get(backupId);
      
      if (!backup || !backup.data) {
        throw new Error('备份数据不存在或已损坏');
      }

      const restoreOptions = {
        importHistory: true,
        importFavorites: true,
        importPreferences: true,
        importRecentTools: true,
        importSearchHistory: true,
        mergeMode: false, // 默认覆盖模式
        ...options
      };

      const result = storageService.importData({ data: backup.data }, restoreOptions);

      if (result.success) {
        console.log(`从备份恢复成功: ${backup.name}`);
      }

      return result;
    } catch (e) {
      console.error('恢复备份失败:', e);
      return {
        success: false,
        error: e.message
      };
    }
  }

  /**
   * 删除备份
   */
  deleteBackup(backupId) {
    try {
      storageService.remove(backupId);
      console.log(`备份已删除: ${backupId}`);
      return { success: true };
    } catch (e) {
      console.error('删除备份失败:', e);
      return { success: false, error: e.message };
    }
  }

  /**
   * 清理旧备份（保留最近N个）
   */
  cleanupOldBackups() {
    try {
      const backups = this.getBackupList();
      const maxBackups = this.config.maxBackups;

      if (backups.length <= maxBackups) {
        return;
      }

      // 删除超出的旧备份
      const toDelete = backups.slice(maxBackups);
      toDelete.forEach(backup => {
        this.deleteBackup(backup.id);
      });

      console.log(`清理了 ${toDelete.length} 个旧备份`);
    } catch (e) {
      console.error('清理旧备份失败:', e);
    }
  }

  /**
   * 格式化日期
   */
  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }

  /**
   * 获取备份统计信息
   */
  getBackupStats() {
    const backups = this.getBackupList();
    const totalSize = backups.reduce((sum, backup) => sum + (backup.size || 0), 0);
    
    return {
      totalBackups: backups.length,
      totalSize,
      oldestBackup: backups.length > 0 ? backups[backups.length - 1] : null,
      newestBackup: backups.length > 0 ? backups[0] : null,
      autoBackupEnabled: this.config.autoBackupEnabled,
      lastBackupTime: this.config.lastBackupTime
    };
  }

  /**
   * 设置备份间隔
   * @param {number} hours - 小时数
   */
  setBackupInterval(hours) {
    this.config.backupInterval = hours * 60 * 60 * 1000;
    this.saveConfig();
  }

  /**
   * 设置最大备份数
   */
  setMaxBackups(count) {
    this.config.maxBackups = Math.max(1, Math.min(30, count));
    this.saveConfig();
    this.cleanupOldBackups();
  }
}

// 导出单例
const backupService = new BackupService();

module.exports = {
  backupService,
  BackupService
};

