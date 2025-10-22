// 数据管理页面
const { storageService } = require('../../services/storage');
const { exportService } = require('../../services/export');

Page({
  data: {
    // 基础统计信息
    totalCalculations: 0,
    totalHistory: 0,
    totalFavorites: 0,
    storageUsed: '0 KB',
    cacheSize: '0 KB',
    
    // 数据访问统计
    topElements: [],           // 最常查询的元素 Top5
    topSemiconductors: [],     // 最常查询的半导体 Top5
    topAbbreviations: [],      // 最常查询的化学缩写 Top5
    topSpectroscopy: [],       // 最常查询的谱学数据 Top5
    
    // 计算类型统计
    calcTypeDistribution: [],  // 计算类型分布
    unitTypeDistribution: [],  // 单位换算类型分布
    xrdCrystalSystem: [],      // XRD晶系分布
    phTypeDistribution: [],    // pH计算酸碱类型分布
    
    // 科研价值统计
    favoriteRate: '0%',        // 收藏率
    topFavoriteTypes: [],      // 收藏率最高的计算类型 Top5
    repeatCalcCount: 0,        // 重复计算次数
    errorWarningCount: 0,      // 警告信息次数
    
    // 展开/收起状态
    showDataAccess: false,
    showCalcType: false,
    showResearchValue: false
  },

  onLoad() {
    this.loadStatistics();
  },

  onShow() {
    // 每次显示时刷新统计信息
    this.loadStatistics();
  },

  /**
   * 跳转到数据备份页面
   */
  navigateToBackup() {
    wx.navigateTo({
      url: '/pages/settings/backup/backup'
    });
  },

  /**
   * 跳转到分享统计页面 (v6.0.0新增)
   */
  navigateToStatistics() {
    wx.navigateTo({
      url: '/pages/settings/statistics/statistics'
    });
  },

  /**
   * 跳转到离线设置页面 (v6.0.0新增)
   */
  navigateToOffline() {
    wx.navigateTo({
      url: '/pages/settings/offline/offline'
    });
  },

  // 加载统计信息
  loadStatistics() {
    try {
      const history = storageService.getHistory(1000) || [];  // 获取更多历史记录用于统计
      const favorites = storageService.getFavorites() || [];
      const storageInfo = wx.getStorageInfoSync();
      
      // 修复Bug: 改进缓存大小计算，避免负数
      const historySize = JSON.stringify(history).length;
      const favoritesSize = JSON.stringify(favorites).length;
      const totalDataSize = historySize + favoritesSize;
      const totalStorageBytes = storageInfo.currentSize * 1024;
      const cacheSize = totalStorageBytes > totalDataSize ? totalStorageBytes - totalDataSize : 0;
      
      // 基础统计
      this.setData({
        totalHistory: history.length,
        totalCalculations: history.length,
        totalFavorites: favorites.length,
        storageUsed: `${(storageInfo.currentSize / 1024).toFixed(2)} KB`,
        cacheSize: `${(cacheSize / 1024).toFixed(2)} KB`
      });
      
      // 高级统计分析
      this.analyzeDataAccess(history);
      this.analyzeCalcTypes(history);
      this.analyzeResearchValue(history, favorites);
    } catch (error) {
      console.error('加载统计信息失败:', error);
      wx.showToast({
        title: '统计加载失败',
        icon: 'none'
      });
    }
  },
  
  // 数据访问统计分析
  analyzeDataAccess(history) {
    const elementCount = {};
    const semiconductorCount = {};
    const abbreviationCount = {};
    const spectroscopyCount = {};
    
    history.forEach(item => {
      const type = item.type || '';
      const input = item.input || '';
      const metadata = item.metadata || {};
      
      // 元素周期表查询 - 优先使用metadata
      if (type.includes('元素查询') || metadata.materialType === '元素') {
        const element = this.extractElementName(input);
        if (element) {
          elementCount[element] = (elementCount[element] || 0) + 1;
        }
      }
      
      // 半导体材料查询 - 优先使用metadata
      if (type.includes('半导体材料查询') || metadata.materialType === '半导体') {
        const material = this.extractMaterialName(input);
        if (material) {
          semiconductorCount[material] = (semiconductorCount[material] || 0) + 1;
        }
      }
      
      // 化学缩写查询 - 优先使用metadata
      if (type.includes('化学缩写查询') || metadata.materialType === '化学缩写') {
        const abbr = metadata.abbreviation || this.extractAbbreviation(input);
        if (abbr) {
          abbreviationCount[abbr] = (abbreviationCount[abbr] || 0) + 1;
        }
      }
      
      // 谱学数据查询 - 优先使用metadata
      if (type.includes('XPS谱学查询') || type.includes('Raman/IR谱学查询') || 
          metadata.spectroscopyType) {
        const peak = this.extractSpectroscopyPeak(input);
        if (peak) {
          const label = `${peak} (${metadata.spectroscopyType || 'XPS/Raman/IR'})`;
          spectroscopyCount[label] = (spectroscopyCount[label] || 0) + 1;
        }
      }
    });
    
    // 修复Bug: 获取Top N并添加百分比计算（避免除零错误）
    this.setData({
      topElements: this.getTopNWithPercentage(elementCount, 5),
      topSemiconductors: this.getTopNWithPercentage(semiconductorCount, 5),
      topAbbreviations: this.getTopNWithPercentage(abbreviationCount, 5),
      topSpectroscopy: this.getTopNWithPercentage(spectroscopyCount, 5)
    });
  },

  // 计算类型统计分析
  analyzeCalcTypes(history) {
    const calcTypes = {};
    const unitTypes = {};
    const xrdSystems = {};
    const phTypes = {};
    
    history.forEach(item => {
      const type = item.type || '其他';
      const input = item.input || '';
      const metadata = item.metadata || {};
      
      // 计算类型分布
      calcTypes[type] = (calcTypes[type] || 0) + 1;
      
      // 单位换算类型
      if (type.includes('单位') || type.includes('换算')) {
        const unitType = metadata.unitType || this.detectUnitType(input);
        if (unitType) {
          unitTypes[unitType] = (unitTypes[unitType] || 0) + 1;
        }
      }
      
      // XRD晶系分布
      if (type.includes('XRD')) {
        const system = metadata.crystalSystem || this.detectCrystalSystem(input);
        if (system) {
          xrdSystems[system] = (xrdSystems[system] || 0) + 1;
        }
      }
      
      // pH计算类型
      if (type.includes('pH')) {
        const phType = metadata.acidBase || this.detectAcidBase(input);
        if (phType) {
          phTypes[phType] = (phTypes[phType] || 0) + 1;
        }
      }
    });
    
    // 修复Bug: 使用带百分比的Top N方法
    this.setData({ 
      calcTypeDistribution: this.getTopNWithPercentage(calcTypes, 8),
      unitTypeDistribution: this.getTopNWithPercentage(unitTypes, 6),
      xrdCrystalSystem: this.getTopNWithPercentage(xrdSystems, 7),
      phTypeDistribution: this.getTopNWithPercentage(phTypes, 4)
    });
  },
  
  // 科研价值统计分析
  analyzeResearchValue(history, favorites) {
    // 收藏率
    const favoriteRate = history.length > 0 
      ? ((favorites.length / history.length) * 100).toFixed(1) 
      : '0';
    
    // 收藏的计算类型分布
    const favoriteTypes = {};
    favorites.forEach(fav => {
      const type = this.extractCalcTypeFromFavorite(fav);
      if (type) {
        favoriteTypes[type] = (favoriteTypes[type] || 0) + 1;
      }
    });
    
    // 重复计算检测
    const inputCount = {};
    let repeatCount = 0;
    history.forEach(item => {
      const key = `${item.type}-${item.input}`;
      inputCount[key] = (inputCount[key] || 0) + 1;
      if (inputCount[key] > 1) {
        repeatCount++;
      }
    });
    
    // 警告信息统计
    let errorWarningCount = 0;
    history.forEach(item => {
      if (item.metadata && (item.metadata.warning || item.metadata.error)) {
        errorWarningCount++;
      }
    });
    
    // 修复Bug: 使用带百分比的Top N方法
    this.setData({
      favoriteRate: `${favoriteRate}%`,
      topFavoriteTypes: this.getTopNWithPercentage(favoriteTypes, 5),
      repeatCalcCount: repeatCount,
      errorWarningCount: errorWarningCount
    });
  },

  // 辅助函数：获取Top N
  getTopN(obj, n) {
    return Object.entries(obj)
      .sort((a, b) => b[1] - a[1])
      .slice(0, n)
      .map(([name, count]) => ({ name, count }));
  },

  // 辅助函数：获取Top N并计算百分比（修复除零bug）
  getTopNWithPercentage(obj, n) {
    const topN = Object.entries(obj)
      .sort((a, b) => b[1] - a[1])
      .slice(0, n)
      .map(([name, count]) => ({ name, count }));
    
    // 计算最大值，避免除零
    const maxCount = topN.length > 0 ? topN[0].count : 1;
    
    return topN.map(item => ({
      ...item,
      percentage: maxCount > 0 ? (item.count / maxCount * 100).toFixed(1) : 0
    }));
  },
  
  // 提取元素名称
  extractElementName(input) {
    // 从 "Zn - 锌" 或 "Zn" 格式中提取
    const symbolMatch = input.match(/([A-Z][a-z]?)\s*-?\s*([\u4e00-\u9fa5]+)?/);
    if (symbolMatch) {
      // 返回中文名或符号
      return symbolMatch[2] || symbolMatch[1];
    }
    return null;
  },
  
  // 提取材料名称
  extractMaterialName(input) {
    // 从输入中提取材料名称
    // 支持中文和化学式，如 "氧化锌" 或 "ZnO"
    const chineseMatch = input.match(/([\u4e00-\u9fa5]{2,})/);
    if (chineseMatch) return chineseMatch[1];
    
    const formulaMatch = input.match(/([A-Z][a-z]?\d*)+/);
    return formulaMatch ? formulaMatch[0] : input.split(/[\s,]+/)[0];
  },
  
  // 提取缩写
  extractAbbreviation(input) {
    // 直接使用input作为缩写（已经是缩写格式）
    const abbrMatch = input.match(/([A-Z]+\d*)/);
    return abbrMatch ? abbrMatch[0] : input.split(/[\s,]+/)[0];
  },
  
  // 提取谱学峰位
  extractSpectroscopyPeak(input) {
    // 从 "Fe 2p3/2" 或 "C-H伸缩" 格式中提取
    const xpsMatch = input.match(/([A-Z][a-z]?\s+\d+[a-z]?\d*\/?\d*)/);
    if (xpsMatch) return xpsMatch[1];
    
    const ramanMatch = input.match(/([\u4e00-\u9fa5]+-?[\u4e00-\u9fa5]+)/);
    if (ramanMatch) return ramanMatch[1];
    
    return input.split(/[\s,]+/)[0];
  },
  
  // 检测单位类型
  detectUnitType(input) {
    if (/nm|μm|mm|cm|m|km|Å/i.test(input)) return '长度';
    if (/eV|J|cal|kJ/i.test(input)) return '能量';
    if (/g|kg|mg|μg/i.test(input)) return '质量';
    if (/L|mL|μL/i.test(input)) return '体积';
    if (/M|mol|mM|μM/i.test(input)) return '浓度';
    return '其他';
  },
  
  // 检测晶系
  detectCrystalSystem(input) {
    if (input.includes('立方')) return '立方';
    if (input.includes('四方')) return '四方';
    if (input.includes('正交')) return '正交';
    if (input.includes('六方')) return '六方';
    if (input.includes('三方')) return '三方';
    if (input.includes('单斜')) return '单斜';
    if (input.includes('三斜')) return '三斜';
    return null;
  },
  
  // 检测酸碱类型
  detectAcidBase(input) {
    if (input.includes('HCl') || input.includes('H2SO4')) return '强酸';
    if (input.includes('CH3COOH') || input.includes('HAc')) return '弱酸';
    if (input.includes('NaOH') || input.includes('KOH')) return '强碱';
    if (input.includes('NH3') || input.includes('氨水')) return '弱碱';
    return '其他';
  },
  
  // 从收藏中提取计算类型
  extractCalcTypeFromFavorite(favorite) {
    const title = favorite.title || '';
    const body = favorite.body || '';
    const text = title + ' ' + body;
    
    if (text.includes('XRD')) return 'XRD分析';
    if (text.includes('pH')) return 'pH计算';
    if (text.includes('单位')) return '单位换算';
    if (text.includes('溶度积') || text.includes('Ksp')) return '溶度积';
    if (text.includes('电化学')) return '电化学';
    if (text.includes('元素')) return '元素查询';
    if (text.includes('半导体')) return '半导体材料';
    
    return '其他';
  },
  
  // 切换统计面板展开状态
  toggleDataAccess() {
    this.setData({ showDataAccess: !this.data.showDataAccess });
  },
  
  toggleCalcType() {
    this.setData({ showCalcType: !this.data.showCalcType });
  },
  
  toggleResearchValue() {
    this.setData({ showResearchValue: !this.data.showResearchValue });
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
          storageService.clearHistory();
          this.loadStatistics();
          
          wx.showToast({
            title: '已清除历史记录',
            icon: 'success'
          });
        }
      }
    });
  },

  // 清除收藏
  clearFavorites() {
    wx.showModal({
      title: '确认清除',
      content: '确定要清除所有收藏吗？此操作不可撤销。',
      confirmText: '清除',
      confirmColor: '#e74c3c',
      success: (res) => {
        if (res.confirm) {
          storageService.setFavorites([]);
          this.loadStatistics();
          
          wx.showToast({
            title: '已清除收藏',
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
      content: '确定要清除缓存吗？不会删除历史记录和收藏。',
      confirmText: '清除',
      success: (res) => {
        if (res.confirm) {
          // 保留重要数据
          const history = storageService.getHistory(1000);
          const favorites = storageService.getFavorites();
          
          // 清除所有存储
          wx.clearStorageSync();
          
          // 恢复重要数据
          if (history && history.length > 0) storageService.set('chemtools:history', history);
          if (favorites && favorites.length > 0) storageService.setFavorites(favorites);
          
          this.loadStatistics();
          
          wx.showToast({
            title: '缓存已清除',
            icon: 'success'
          });
        }
      }
    });
  },

  // 清除所有数据
  clearAllData() {
    wx.showModal({
      title: '⚠️ 危险操作',
      content: '确定要清除所有数据吗？包括历史记录、收藏和缓存。此操作不可撤销！',
      confirmText: '全部清除',
      confirmColor: '#e74c3c',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorageSync();
          this.loadStatistics();
          
          wx.showToast({
            title: '已清除所有数据',
            icon: 'success'
          });
        }
      }
    });
  },

  // 数据备份（完整备份）
  backupData() {
    const backupData = storageService.exportAllData();
    
    wx.showActionSheet({
      itemList: ['复制到剪贴板 (JSON)', '导出为文本', '导出为Markdown'],
      success: async (res) => {
        try {
          switch (res.tapIndex) {
            case 0:
              // 复制JSON到剪贴板
              await exportService.copyToClipboard(
                JSON.stringify(backupData, null, 2),
                { successMessage: '备份数据已复制(JSON格式)\n可保存到记事本' }
              );
              break;
              
            case 1:
              // 导出为文本
              await this.exportBackupAsText(backupData);
              break;
              
            case 2:
              // 导出为Markdown
              await this.exportBackupAsMarkdown(backupData);
              break;
          }
        } catch (error) {
          wx.showToast({
            title: '备份失败: ' + error.message,
            icon: 'none'
          });
        }
      }
    });
  },

  // 导入数据
  importData() {
    wx.showModal({
      title: '导入数据',
      content: '请先复制备份的JSON数据到剪贴板，然后点击确定',
      confirmText: '开始导入',
      success: (res) => {
        if (res.confirm) {
          wx.getClipboardData({
            success: (clipRes) => {
              try {
                const backupData = JSON.parse(clipRes.data);
                
                // 显示导入选项
                this.showImportOptions(backupData);
              } catch (error) {
                wx.showToast({
                  title: '数据格式错误\n请确保复制了正确的JSON数据',
                  icon: 'none',
                  duration: 3000
                });
              }
            },
            fail: () => {
              wx.showToast({
                title: '读取剪贴板失败',
                icon: 'none'
              });
            }
          });
        }
      }
    });
  },

  // 显示导入选项
  showImportOptions(backupData) {
    const items = [
      '覆盖导入（替换所有数据）',
      '合并导入（保留现有数据）',
      '仅导入历史记录',
      '仅导入收藏',
      '取消'
    ];
    
    wx.showActionSheet({
      itemList: items,
      success: (res) => {
        let options = {};
        
        switch (res.tapIndex) {
          case 0:
            // 覆盖模式
            options = { mergeMode: false };
            this.confirmImport(backupData, options, '覆盖');
            break;
            
          case 1:
            // 合并模式
            options = { mergeMode: true };
            this.confirmImport(backupData, options, '合并');
            break;
            
          case 2:
            // 仅导入历史
            options = {
              importHistory: true,
              importFavorites: false,
              importPreferences: false,
              importRecentTools: false,
              importSearchHistory: false,
              mergeMode: true
            };
            this.confirmImport(backupData, options, '导入历史记录');
            break;
            
          case 3:
            // 仅导入收藏
            options = {
              importHistory: false,
              importFavorites: true,
              importPreferences: false,
              importRecentTools: false,
              importSearchHistory: false,
              mergeMode: true
            };
            this.confirmImport(backupData, options, '导入收藏');
            break;
        }
      }
    });
  },

  // 确认导入
  confirmImport(backupData, options, modeName) {
    const history = backupData.data?.history || [];
    const favorites = backupData.data?.favorites || [];
    
    wx.showModal({
      title: `确认${modeName}`,
      content: `将导入：\n历史记录 ${history.length} 条\n收藏 ${favorites.length} 条\n\n此操作不可撤销`,
      confirmText: '确认导入',
      confirmColor: '#1f3c88',
      success: (res) => {
        if (res.confirm) {
          this.executeImport(backupData, options);
        }
      }
    });
  },

  // 执行导入
  executeImport(backupData, options) {
    wx.showLoading({ title: '导入中...' });
    
    setTimeout(() => {
      try {
        const result = storageService.importData(backupData, options);
        
        wx.hideLoading();
        
        if (result.success) {
          let message = '导入成功！\n';
          if (result.summary.history) message += `历史记录: ${result.summary.history}条\n`;
          if (result.summary.favorites) message += `收藏: ${result.summary.favorites}条\n`;
          if (result.summary.recentTools) message += `最近使用: ${result.summary.recentTools}条\n`;
          
          wx.showModal({
            title: '✅ 导入成功',
            content: message,
            showCancel: false,
            confirmText: '刷新页面',
            success: () => {
              this.loadStatistics();
            }
          });
        } else {
          let errorMsg = '导入失败\n';
          result.errors.forEach(err => {
            errorMsg += `${err.type}: ${err.error}\n`;
          });
          
          wx.showToast({
            title: errorMsg,
            icon: 'none',
            duration: 3000
          });
        }
      } catch (error) {
        wx.hideLoading();
        wx.showToast({
          title: '导入失败: ' + error.message,
          icon: 'none'
        });
      }
    }, 500);
  },

  // 恢复数据（从备份恢复）
  restoreData() {
    this.importData(); // 复用导入功能
  },

  // 导出数据（传统导出）
  exportData() {
    const history = storageService.getHistory(1000) || [];
    const favorites = storageService.getFavorites() || [];
    
    // 修复Bug: 版本号统一为v6.0.0
    const exportData = {
      exportTime: new Date().toISOString(),
      version: 'v6.0.0',
      appName: '材料化学科研工具箱',
      data: {
        history: history,
        favorites: favorites,
        statistics: {
          totalCalculations: this.data.totalCalculations,
          totalHistory: this.data.totalHistory,
          totalFavorites: this.data.totalFavorites,
          storageUsed: this.data.storageUsed
        }
      }
    };
    
    // 使用导出服务提供多种导出选项
    wx.showActionSheet({
      itemList: ['复制到剪贴板 (JSON)', '导出为文本', '导出为Markdown', '导出报告'],
      success: async (res) => {
        switch (res.tapIndex) {
          case 0:
            // 复制JSON到剪贴板
            await exportService.copyToClipboard(
              JSON.stringify(exportData, null, 2),
              { successMessage: '数据已复制(JSON格式)' }
            );
            break;
            
          case 1:
            // 导出为文本
            await this.exportAsText(exportData);
            break;
            
          case 2:
            // 导出为Markdown
            await this.exportAsMarkdown(exportData);
            break;
            
          case 3:
            // 导出完整报告
            await this.exportReport(exportData);
            break;
        }
      }
    });
  },

  // 导出为文本格式
  async exportAsText(data) {
    const lines = [];
    lines.push('═══════════════════════════');
    lines.push('  材料化学科研工具箱 - 数据导出');
    lines.push('═══════════════════════════');
    lines.push('');
    lines.push(`导出时间: ${new Date(data.exportTime).toLocaleString('zh-CN')}`);
    lines.push(`版本: ${data.version}`);
    lines.push('');
    
    lines.push('─────── 统计信息 ───────');
    lines.push(`总计算次数: ${data.data.statistics.totalCalculations}`);
    lines.push(`历史记录数: ${data.data.statistics.totalHistory}`);
    lines.push(`收藏数量: ${data.data.statistics.totalFavorites}`);
    lines.push(`存储占用: ${data.data.statistics.storageUsed}`);
    lines.push('');
    
    if (data.data.history.length > 0) {
      lines.push('─────── 历史记录 ───────');
      data.data.history.slice(0, 10).forEach((item, index) => {
        lines.push(`${index + 1}. ${item.type || '计算'}`);
        lines.push(`   输入: ${item.input || '-'}`);
        lines.push(`   结果: ${item.result || '-'}`);
        lines.push(`   时间: ${new Date(item.timestamp).toLocaleString('zh-CN')}`);
        lines.push('');
      });
      if (data.data.history.length > 10) {
        lines.push(`   ... 还有 ${data.data.history.length - 10} 条记录`);
        lines.push('');
      }
    }
    
    if (data.data.favorites.length > 0) {
      lines.push('─────── 收藏列表 ───────');
      data.data.favorites.forEach((item, index) => {
        lines.push(`${index + 1}. ${item.title || '未命名'}`);
        if (item.note) lines.push(`   备注: ${item.note}`);
        lines.push('');
      });
    }
    
    lines.push('═══════════════════════════');
    lines.push('由材料化学科研工具箱生成');
    
    const text = lines.join('\n');
    await exportService.copyToClipboard(text, { 
      successMessage: '文本格式已复制' 
    });
  },

  // 导出为Markdown格式
  async exportAsMarkdown(data) {
    const lines = [];
    lines.push('# 材料化学科研工具箱 - 数据导出');
    lines.push('');
    lines.push(`**导出时间**: ${new Date(data.exportTime).toLocaleString('zh-CN')}`);
    lines.push(`**版本**: ${data.version}`);
    lines.push('');
    
    lines.push('## 📊 统计信息');
    lines.push('');
    lines.push('| 项目 | 数值 |');
    lines.push('|------|------|');
    lines.push(`| 总计算次数 | ${data.data.statistics.totalCalculations} |`);
    lines.push(`| 历史记录数 | ${data.data.statistics.totalHistory} |`);
    lines.push(`| 收藏数量 | ${data.data.statistics.totalFavorites} |`);
    lines.push(`| 存储占用 | ${data.data.statistics.storageUsed} |`);
    lines.push('');
    
    if (data.data.history.length > 0) {
      lines.push('## 📜 历史记录');
      lines.push('');
      data.data.history.slice(0, 10).forEach((item, index) => {
        lines.push(`### ${index + 1}. ${item.type || '计算'}`);
        lines.push('');
        lines.push(`- **输入**: ${item.input || '-'}`);
        lines.push(`- **结果**: ${item.result || '-'}`);
        lines.push(`- **时间**: ${new Date(item.timestamp).toLocaleString('zh-CN')}`);
        lines.push('');
      });
      if (data.data.history.length > 10) {
        lines.push(`> *还有 ${data.data.history.length - 10} 条记录未显示*`);
        lines.push('');
      }
    }
    
    if (data.data.favorites.length > 0) {
      lines.push('## ⭐ 收藏列表');
      lines.push('');
      data.data.favorites.forEach((item, index) => {
        lines.push(`### ${index + 1}. ${item.title || '未命名'}`);
        lines.push('');
        if (item.note) {
          lines.push(`> ${item.note}`);
          lines.push('');
        }
      });
    }
    
    lines.push('---');
    lines.push('');
    lines.push('*由材料化学科研工具箱自动生成*');
    
    const markdown = lines.join('\n');
    await exportService.copyToClipboard(markdown, { 
      successMessage: 'Markdown格式已复制' 
    });
  },

  // 导出完整报告
  async exportReport(data) {
    // 使用导出服务的报告功能
    const results = data.data.history.map(item => ({
      title: item.type || '计算',
      input: item.input || '-',
      result: item.result || '-',
      timestamp: item.timestamp,
      metadata: item.metadata || {}
    }));
    
    const report = exportService.exportReport(
      results,
      '材料化学科研工具箱 - 计算报告',
      {
        format: 'markdown',
        includeIndex: true,
        includeSummary: true,
        includeTimestamp: true
      }
    );
    
    await exportService.copyToClipboard(report, { 
      successMessage: '完整报告已复制' 
    });
  },

  // 导出备份为文本
  async exportBackupAsText(backupData) {
    const lines = [];
    lines.push('═══════════════════════════');
    lines.push('  材料化学科研工具箱 - 完整备份');
    lines.push('═══════════════════════════');
    lines.push('');
    lines.push(`备份时间: ${new Date(backupData.exportTime).toLocaleString('zh-CN')}`);
    lines.push(`版本: ${backupData.version}`);
    lines.push('');
    
    lines.push('─────── 数据统计 ───────');
    lines.push(`历史记录: ${backupData.data.history.length}条`);
    lines.push(`收藏数量: ${backupData.data.favorites.length}条`);
    lines.push(`最近使用: ${backupData.data.recentTools.length}个`);
    lines.push(`搜索历史: ${backupData.data.searchHistory.length}条`);
    lines.push('');
    lines.push('═══════════════════════════');
    lines.push('完整JSON数据请使用"复制到剪贴板(JSON)"选项');
    
    const text = lines.join('\n');
    await exportService.copyToClipboard(text, {
      successMessage: '备份摘要已复制'
    });
  },

  // 导出备份为Markdown
  async exportBackupAsMarkdown(backupData) {
    const lines = [];
    lines.push('# 材料化学科研工具箱 - 完整备份');
    lines.push('');
    lines.push(`**备份时间**: ${new Date(backupData.exportTime).toLocaleString('zh-CN')}`);
    lines.push(`**版本**: ${backupData.version}`);
    lines.push('');
    
    lines.push('## 📊 备份统计');
    lines.push('');
    lines.push('| 数据类型 | 数量 |');
    lines.push('|---------|------|');
    lines.push(`| 历史记录 | ${backupData.data.history.length}条 |`);
    lines.push(`| 收藏数量 | ${backupData.data.favorites.length}条 |`);
    lines.push(`| 最近使用 | ${backupData.data.recentTools.length}个 |`);
    lines.push(`| 搜索历史 | ${backupData.data.searchHistory.length}条 |`);
    lines.push('');
    
    lines.push('## 💾 恢复说明');
    lines.push('');
    lines.push('1. 保存此备份文件');
    lines.push('2. 在设置页面选择"导入数据"');
    lines.push('3. 复制完整JSON数据到剪贴板');
    lines.push('4. 选择导入模式（覆盖/合并）');
    lines.push('');
    lines.push('---');
    lines.push('');
    lines.push('*由材料化学科研工具箱自动生成*');
    
    const markdown = lines.join('\n');
    await exportService.copyToClipboard(markdown, {
      successMessage: 'Markdown备份已复制'
    });
  },

  // 显示关于信息
  showAbout() {
    wx.showModal({
      title: '关于',
      content: '材料化学科研工具箱\n版本: v8.1.0\n\n✨ 核心功能：\n• 36个专业计算工具\n• XRD全晶系精修\n• 1500+材料数据\n• 本地数据备份\n\n提供化学计算、材料数据查询等功能\n支持数据备份与恢复\n\n© 2025 化学计算工具',
      showCancel: false,
      confirmText: '确定'
    });
  }
});
