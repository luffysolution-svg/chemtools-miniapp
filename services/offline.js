/**
 * 离线服务 v6.0.0
 * 管理21个核心计算工具的离线数据和功能
 */

const { storageService } = require('./storage');

class OfflineService {
  constructor() {
    this.version = '1.0.0';
    this.storageKey = 'chemtools:offline';
    this.networkListening = false;
    
    // 定义21个核心计算工具的离线数据包
    this.offlineTools = [
      // 基础计算工具(5个)
      { id: 'unit', name: '单位换算', category: 'basic', size: 50, essential: true },
      { id: 'ph', name: 'pH计算', category: 'basic', size: 30, essential: true },
      { id: 'solution', name: '溶液配制', category: 'basic', size: 40, essential: true },
      { id: 'molar', name: '分子质量', category: 'basic', size: 35, essential: true },
      { id: 'batch', name: '批量计算', category: 'basic', size: 45, essential: false },
      
      // 高级计算工具(6个)
      { id: 'xrd', name: 'XRD分析', category: 'advanced', size: 60, essential: true },
      { id: 'electrochem', name: '电化学计算', category: 'advanced', size: 55, essential: true },
      { id: 'ksp', name: '溶度积计算', category: 'advanced', size: 80, essential: true },
      { id: 'complexation', name: '络合计算', category: 'advanced', size: 70, essential: true },
      { id: 'thermodynamics', name: '热力学计算', category: 'advanced', size: 65, essential: true },
      { id: 'kinetics', name: '动力学计算', category: 'advanced', size: 65, essential: true },
      
      // 光谱工具(2个)
      { id: 'uvvis', name: 'UV-Vis计算', category: 'spectroscopy', size: 50, essential: true },
      { id: 'xps-raman', name: 'XPS/Raman', category: 'spectroscopy', size: 100, essential: false },
      
      // 材料数据库工具(5个) - 仅核心数据
      { id: 'periodic', name: '元素周期表', category: 'materials', size: 150, essential: false },
      { id: 'semiconductor', name: '半导体数据', category: 'materials', size: 120, essential: false },
      { id: 'abbreviation', name: '化学缩写', category: 'materials', size: 200, essential: false },
      { id: 'organic-materials', name: '有机材料', category: 'materials', size: 80, essential: false },
      
      // 批量工具(3个)
      { id: 'batch-unit', name: '批量单位换算', category: 'batch', size: 40, essential: false },
      { id: 'batch-xrd', name: '批量XRD', category: 'batch', size: 50, essential: false },
      { id: 'batch-dilution', name: '批量稀释', category: 'batch', size: 40, essential: false }
    ];
  }

  /**
   * 初始化离线服务
   */
  init() {
    try {
      // 加载离线配置
      const config = this.getConfig();
      
      if (!config.initialized) {
        // 首次初始化
        this.setConfig({
          initialized: true,
          enabled: false,
          version: this.version,
          installedTools: [],
          lastUpdate: Date.now(),
          autoDownload: false,
          storageUsed: 0
        });
      }
      
      // 启动网络监听
      this.startNetworkMonitoring();
      
      console.log('✅ 离线服务初始化成功');
      return true;
    } catch (e) {
      console.error('离线服务初始化失败:', e);
      return false;
    }
  }

  /**
   * 获取离线配置
   */
  getConfig() {
    return storageService.get(this.storageKey, {
      initialized: false,
      enabled: false,
      version: '0.0.0',
      installedTools: [],
      lastUpdate: 0,
      autoDownload: false,
      storageUsed: 0
    });
  }

  /**
   * 设置离线配置
   */
  setConfig(config) {
    const current = this.getConfig();
    const updated = { ...current, ...config };
    return storageService.set(this.storageKey, updated);
  }

  /**
   * 启用离线模式
   */
  enableOffline() {
    this.setConfig({ enabled: true });
    console.log('✅ 离线模式已启用');
    return true;
  }

  /**
   * 禁用离线模式
   */
  disableOffline() {
    this.setConfig({ enabled: false });
    console.log('离线模式已禁用');
    return true;
  }

  /**
   * 检查是否启用离线模式
   */
  isOfflineEnabled() {
    return this.getConfig().enabled;
  }

  /**
   * 获取所有工具列表
   */
  getAllTools() {
    return this.offlineTools.map(tool => ({
      ...tool,
      installed: this.isToolInstalled(tool.id),
      available: this.isToolAvailable(tool.id)
    }));
  }

  /**
   * 获取已安装的工具
   */
  getInstalledTools() {
    const config = this.getConfig();
    return config.installedTools || [];
  }

  /**
   * 检查工具是否已安装
   */
  isToolInstalled(toolId) {
    const installed = this.getInstalledTools();
    return installed.includes(toolId);
  }

  /**
   * 检查工具是否可用（在线或已安装）
   */
  isToolAvailable(toolId) {
    // 如果在线，所有工具都可用
    if (this.isOnline()) {
      return true;
    }
    
    // 离线时，只有已安装的工具可用
    return this.isToolInstalled(toolId);
  }

  /**
   * 安装工具（模拟下载）
   */
  async installTool(toolId) {
    try {
      const tool = this.offlineTools.find(t => t.id === toolId);
      if (!tool) {
        throw new Error('工具不存在');
      }

      // 检查存储空间
      const config = this.getConfig();
      const totalSize = config.storageUsed + tool.size;
      
      if (totalSize > 10 * 1024) { // 限制10MB
        throw new Error('存储空间不足');
      }

      // 模拟下载过程
      await this.simulateDownload(tool);

      // 标记为已安装
      const installed = this.getInstalledTools();
      if (!installed.includes(toolId)) {
        installed.push(toolId);
        this.setConfig({
          installedTools: installed,
          storageUsed: totalSize,
          lastUpdate: Date.now()
        });
      }

      console.log(`✅ 工具 ${tool.name} 安装成功`);
      return { success: true, tool };
    } catch (e) {
      console.error(`安装工具失败:`, e);
      return { success: false, error: e.message };
    }
  }

  /**
   * 卸载工具
   */
  async uninstallTool(toolId) {
    try {
      const tool = this.offlineTools.find(t => t.id === toolId);
      if (!tool) {
        throw new Error('工具不存在');
      }

      const config = this.getConfig();
      const installed = config.installedTools.filter(id => id !== toolId);
      const storageUsed = Math.max(0, config.storageUsed - tool.size);

      this.setConfig({
        installedTools: installed,
        storageUsed: storageUsed
      });

      console.log(`工具 ${tool.name} 已卸载`);
      return { success: true };
    } catch (e) {
      console.error('卸载工具失败:', e);
      return { success: false, error: e.message };
    }
  }

  /**
   * 批量安装必需工具
   */
  async installEssentialTools(onProgress) {
    const essentialTools = this.offlineTools.filter(t => t.essential);
    const total = essentialTools.length;
    let installed = 0;

    for (let tool of essentialTools) {
      if (this.isToolInstalled(tool.id)) {
        installed++;
        continue;
      }

      const result = await this.installTool(tool.id);
      if (result.success) {
        installed++;
      }

      // 进度回调
      if (onProgress) {
        onProgress({
          current: installed,
          total: total,
          tool: tool.name,
          progress: Math.floor((installed / total) * 100)
        });
      }

      // 延迟，避免操作过快
      await this.delay(100);
    }

    return { success: true, installed, total };
  }

  /**
   * 清空所有离线数据
   */
  clearAllData() {
    try {
      this.setConfig({
        installedTools: [],
        storageUsed: 0,
        lastUpdate: Date.now()
      });
      
      console.log('✅ 离线数据已清空');
      return { success: true };
    } catch (e) {
      console.error('清空数据失败:', e);
      return { success: false, error: e.message };
    }
  }

  /**
   * 获取存储统计
   */
  getStorageStats() {
    const config = this.getConfig();
    const totalTools = this.offlineTools.length;
    const installedCount = config.installedTools.length;
    const maxStorage = 10 * 1024; // 10MB (KB)
    
    return {
      totalTools,
      installedCount,
      storageUsed: config.storageUsed,
      maxStorage,
      percentage: Math.floor((config.storageUsed / maxStorage) * 100),
      lastUpdate: config.lastUpdate
    };
  }

  /**
   * 检查是否在线
   */
  isOnline() {
    try {
      const networkType = wx.getStorageSync('chemtools:network_type');
      return networkType !== 'none' && networkType !== '';
    } catch (e) {
      return true; // 默认认为在线
    }
  }

  /**
   * 启动网络监听
   */
  startNetworkMonitoring() {
    if (this.networkListening) return;

    try {
      // 获取当前网络状态
      wx.getNetworkType({
        success: (res) => {
          wx.setStorageSync('chemtools:network_type', res.networkType);
        }
      });

      // 监听网络状态变化
      wx.onNetworkStatusChange((res) => {
        const networkType = res.isConnected ? res.networkType : 'none';
        wx.setStorageSync('chemtools:network_type', networkType);
        
        console.log(`网络状态变化: ${networkType}`);
        
        // 触发事件
        this.onNetworkChange(res.isConnected, networkType);
      });

      this.networkListening = true;
      console.log('✅ 网络监听已启动');
    } catch (e) {
      console.error('启动网络监听失败:', e);
    }
  }

  /**
   * 网络状态变化回调
   */
  onNetworkChange(isConnected, networkType) {
    // 可以在这里处理网络状态变化
    if (!isConnected && this.isOfflineEnabled()) {
      console.log('📡 已切换到离线模式');
    } else if (isConnected) {
      console.log('📡 网络已连接');
    }
  }

  /**
   * 模拟下载过程（优化版）
   */
  simulateDownload(tool) {
    return new Promise((resolve) => {
      // 性能优化：减少模拟延迟
      const delay = Math.min(tool.size * 3, 1500);
      
      // 模拟下载进度
      const startTime = Date.now();
      setTimeout(() => {
        const endTime = Date.now();
        console.log(`✅ 工具 ${tool.name} 下载完成，耗时: ${endTime - startTime}ms`);
        resolve();
      }, delay);
    });
  }

  /**
   * 延迟函数
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 检查更新
   */
  async checkUpdate() {
    try {
      const config = this.getConfig();
      
      // 比较版本
      if (config.version !== this.version) {
        return {
          hasUpdate: true,
          currentVersion: config.version,
          latestVersion: this.version,
          updateSize: 500 // KB
        };
      }
      
      return { hasUpdate: false };
    } catch (e) {
      return { hasUpdate: false, error: e.message };
    }
  }

  /**
   * 执行更新
   */
  async performUpdate() {
    try {
      // 更新版本号
      this.setConfig({
        version: this.version,
        lastUpdate: Date.now()
      });
      
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
}

// 导出单例
const offlineService = new OfflineService();

module.exports = {
  offlineService,
  OfflineService
};

