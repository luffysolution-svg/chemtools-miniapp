/**
 * DOI文献查询页面
 */

const { queryDOI, validateDOI, getCacheStats } = require('../../../services/doi-service');
const { formatCitation, getSupportedFormats } = require('../../../utils/citation-formatter');

Page({
  data: {
    // 输入
    doiInput: '',
    isQuerying: false,
    
    // 文献信息
    metadata: null,
    showMetadata: false,
    
    // 引用格式
    formats: [],
    currentFormat: 'acs',
    currentFormatName: 'ACS Style',
    citation: '',
    
    // 历史记录
    history: [],
    showHistory: false,
    
    // 手动输入模式
    manualMode: false,
    manualData: {
      title: '',
      authors: '',
      journal: '',
      year: '',
      volume: '',
      issue: '',
      pages: '',
      doi: ''
    },
    
    // 缓存统计
    cacheStats: null
  },

  onLoad() {
    // 加载支持的格式
    const formats = getSupportedFormats();
    this.setData({ 
      formats,
      currentFormatName: formats[0].name
    });
    
    // 加载历史记录
    this.loadHistory();
    
    // 加载缓存统计
    this.updateCacheStats();
  },

  /**
   * 输入DOI
   */
  handleDOIInput(e) {
    this.setData({ doiInput: e.detail.value.trim() });
  },

  /**
   * 查询DOI
   */
  async queryDOI() {
    const doi = this.data.doiInput;
    
    if (!doi) {
      wx.showToast({
        title: '请输入DOI',
        icon: 'none'
      });
      return;
    }

    // 验证DOI格式
    if (!validateDOI(doi)) {
      wx.showModal({
        title: '格式错误',
        content: 'DOI格式不正确。\n标准格式：10.xxxx/xxxxx',
        showCancel: false
      });
      return;
    }

    // 开始查询
    this.setData({ isQuerying: true });
    
    wx.showLoading({ title: '查询中...' });

    try {
      const result = await queryDOI(doi);
      const metadata = result.data;
      
      wx.hideLoading();
      
      // 显示结果
      this.setData({
        metadata,
        showMetadata: true,
        isQuerying: false
      });
      
      // 生成引用
      this.generateCitation();
      
      // 保存到历史
      this.saveToHistory(metadata);
      
      // 更新缓存统计
      this.updateCacheStats();
      
      // 提示是否来自缓存
      if (result.fromCache) {
        wx.showToast({
          title: '已从缓存加载',
          icon: 'success',
          duration: 1500
        });
      }
      
    } catch (error) {
      wx.hideLoading();
      this.setData({ isQuerying: false });
      
      // 错误处理
      let errorMsg = '查询失败';
      
      if (error.code === 'NOT_FOUND') {
        errorMsg = '未找到该DOI对应的文献';
      } else if (error.code === 'NETWORK_ERROR') {
        errorMsg = '网络连接失败，是否切换到手动输入？';
        wx.showModal({
          title: '网络错误',
          content: errorMsg,
          confirmText: '手动输入',
          cancelText: '重试',
          success: (res) => {
            if (res.confirm) {
              this.switchToManualMode();
            } else {
              this.queryDOI();
            }
          }
        });
        return;
      } else if (error.code === 'RATE_LIMIT') {
        errorMsg = 'API请求频率超限，请稍后再试';
      } else if (error.code === 'PARSE_ERROR') {
        errorMsg = '解析数据失败: ' + error.message;
      } else {
        errorMsg = error.message || '查询失败';
      }
      
      wx.showModal({
        title: '查询失败',
        content: errorMsg,
        showCancel: false
      });
    }
  },

  /**
   * 生成引用格式
   */
  generateCitation() {
    const { metadata, currentFormat } = this.data;
    
    if (!metadata) return;
    
    const citation = formatCitation(metadata, currentFormat);
    this.setData({ citation });
  },

  /**
   * 切换引用格式
   */
  switchFormat(e) {
    const formatId = e.currentTarget.dataset.format;
    const formatName = e.currentTarget.dataset.name;
    
    this.setData({
      currentFormat: formatId,
      currentFormatName: formatName
    });
    
    this.generateCitation();
  },

  /**
   * 复制引用
   */
  copyCitation() {
    const { citation } = this.data;
    
    if (!citation) {
      wx.showToast({
        title: '暂无内容',
        icon: 'none'
      });
      return;
    }
    
    wx.setClipboardData({
      data: citation,
      success: () => {
        wx.showToast({
          title: '已复制到剪贴板',
          icon: 'success'
        });
      }
    });
  },

  /**
   * 分享引用
   */
  shareCitation() {
    const { metadata, citation, currentFormatName } = this.data;
    
    if (!citation) {
      wx.showToast({
        title: '暂无内容',
        icon: 'none'
      });
      return;
    }
    
    const shareText = `【${metadata.title}】\n\n${currentFormatName}格式引用：\n${citation}`;
    
    wx.setClipboardData({
      data: shareText,
      success: () => {
        wx.showToast({
          title: '引用已复制，可分享',
          icon: 'success'
        });
      }
    });
  },

  /**
   * 保存到历史记录
   */
  saveToHistory(metadata) {
    try {
      let history = wx.getStorageSync('doi_history') || [];
      
      // 检查是否已存在
      const existingIndex = history.findIndex(item => item.doi === metadata.doi);
      if (existingIndex >= 0) {
        history.splice(existingIndex, 1);
      }
      
      // 添加到开头
      history.unshift({
        doi: metadata.doi,
        title: metadata.title,
        authors: metadata.authors,
        journal: metadata.journal,
        year: metadata.year,
        timestamp: Date.now()
      });
      
      // 限制最多20条
      if (history.length > 20) {
        history = history.slice(0, 20);
      }
      
      wx.setStorageSync('doi_history', history);
      this.setData({ history });
      
    } catch (e) {
      console.error('保存历史失败:', e);
    }
  },

  /**
   * 加载历史记录
   */
  loadHistory() {
    try {
      const history = wx.getStorageSync('doi_history') || [];
      this.setData({ history });
    } catch (e) {
      console.error('加载历史失败:', e);
    }
  },

  /**
   * 从历史记录选择
   */
  selectFromHistory(e) {
    const doi = e.currentTarget.dataset.doi;
    this.setData({ 
      doiInput: doi,
      showHistory: false
    });
    this.queryDOI();
  },

  /**
   * 切换历史记录显示
   */
  toggleHistory() {
    this.setData({ showHistory: !this.data.showHistory });
  },

  /**
   * 清除历史记录
   */
  clearHistory() {
    wx.showModal({
      title: '确认清除',
      content: '确定要清除所有历史记录吗？',
      success: (res) => {
        if (res.confirm) {
          try {
            wx.removeStorageSync('doi_history');
            this.setData({ 
              history: [],
              showHistory: false
            });
            wx.showToast({
              title: '已清除',
              icon: 'success'
            });
          } catch (e) {
            console.error('清除历史失败:', e);
          }
        }
      }
    });
  },

  /**
   * 切换到手动输入模式
   */
  switchToManualMode() {
    this.setData({ 
      manualMode: true,
      manualData: {
        ...this.data.manualData,
        doi: this.data.doiInput
      }
    });
  },

  /**
   * 切换回自动模式
   */
  switchToAutoMode() {
    this.setData({ manualMode: false });
  },

  /**
   * 手动输入
   */
  handleManualInput(e) {
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;
    
    this.setData({
      [`manualData.${field}`]: value
    });
  },

  /**
   * 手动生成引用
   */
  generateFromManual() {
    const { manualData } = this.data;
    
    // 验证必填字段
    if (!manualData.title || !manualData.authors || !manualData.journal || !manualData.year) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }
    
    // 解析作者（支持逗号或分号分隔）
    const authorNames = manualData.authors.split(/[,;]/).map(name => name.trim());
    const authors = authorNames.map(name => {
      const parts = name.split(' ');
      if (parts.length >= 2) {
        return {
          given: parts.slice(0, -1).join(' '),
          family: parts[parts.length - 1]
        };
      } else {
        return {
          given: '',
          family: name
        };
      }
    });
    
    // 构建元数据
    const metadata = {
      doi: manualData.doi,
      title: manualData.title,
      authors: authors,
      journal: manualData.journal,
      journalShort: manualData.journal,
      volume: manualData.volume,
      issue: manualData.issue,
      pages: manualData.pages,
      year: parseInt(manualData.year),
      url: manualData.doi ? `https://doi.org/${manualData.doi}` : ''
    };
    
    // 显示结果
    this.setData({
      metadata,
      showMetadata: true,
      manualMode: false
    });
    
    // 生成引用
    this.generateCitation();
    
    wx.showToast({
      title: '已生成引用',
      icon: 'success'
    });
  },

  /**
   * 更新缓存统计
   */
  updateCacheStats() {
    const stats = getCacheStats();
    this.setData({ cacheStats: stats });
  },

  /**
   * 扫码输入DOI
   */
  scanDOI() {
    wx.scanCode({
      onlyFromCamera: false,
      scanType: ['qrCode', 'barCode'],
      success: (res) => {
        let doi = res.result;
        
        // 如果扫描的是URL，提取DOI
        if (doi.includes('doi.org/')) {
          doi = doi.split('doi.org/')[1];
        }
        
        this.setData({ doiInput: doi });
        
        // 自动查询
        if (validateDOI(doi)) {
          this.queryDOI();
        } else {
          wx.showToast({
            title: '未识别到有效DOI',
            icon: 'none'
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '扫码失败',
          icon: 'none'
        });
      }
    });
  },

  /**
   * 打开DOI链接
   */
  openDOILink() {
    const { metadata } = this.data;
    
    if (!metadata || !metadata.doi) {
      wx.showToast({
        title: '无DOI信息',
        icon: 'none'
      });
      return;
    }
    
    wx.setClipboardData({
      data: `https://doi.org/${metadata.doi}`,
      success: () => {
        wx.showToast({
          title: 'DOI链接已复制',
          icon: 'success'
        });
      }
    });
  }
});

