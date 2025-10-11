/**
 * 首页 - 工具导航
 */

const { storageService } = require('../../services/storage');

Page({
  data: {
    searchQuery: '',
    recentTools: [],
    filteredTools: [],
    searchHistory: [],
    allTools: [
      // 基础计算
      { id: 'unit', name: '单位换算', icon: '🔁', description: '长度、质量、温度等单位转换', path: '/pages/basic/unit/unit', category: '基础计算', keywords: ['单位', '换算', '转换', '长度', '质量', '温度'] },
      { id: 'ph', name: 'pH计算', icon: '🧪', description: '酸碱溶液pH值计算', path: '/pages/basic/ph/ph', category: '基础计算', keywords: ['ph', '酸碱', '溶液', '计算'] },
      { id: 'solution', name: '溶液配比', icon: '⚗️', description: '溶液混合与稀释计算', path: '/pages/basic/solution/solution', category: '基础计算', keywords: ['溶液', '配比', '稀释', '混合', '浓度'] },
      { id: 'molar', name: '分子质量', icon: '🧬', description: '化学式摩尔质量计算', path: '/pages/basic/molar/molar', category: '基础计算', keywords: ['分子', '质量', '摩尔', '化学式'] },
      // 材料分析
      { id: 'periodic', name: '元素周期表', icon: '🧮', description: '查询元素性质与参数', path: '/pages/materials/periodic/periodic', category: '材料分析', keywords: ['元素', '周期表', '性质', '参数'] },
      { id: 'semiconductor', name: '半导体数据库', icon: '💡', description: '50+种半导体材料查询', path: '/pages/materials/semiconductor/semiconductor', category: '材料分析', keywords: ['半导体', '材料', '带隙', '能带'] },
      { id: 'semiconductor-extras', name: '半导体小工具', icon: '🔦', description: 'Eg↔λ互算、少子估算', path: '/pages/materials/semiconductor-extras/semiconductor-extras', category: '材料分析', keywords: ['半导体', '波长', '带隙', '少子'] },
      // 谱学工具
      { id: 'xps-raman', name: 'XPS/Raman/IR', icon: '📊', description: '谱学峰位查询参考', path: '/pages/spectroscopy/xps-raman/xps-raman', category: '谱学工具', keywords: ['xps', 'raman', 'ir', '谱学', '峰位'] },
      { id: 'uvvis', name: 'Beer-Lambert', icon: '🌈', description: 'UV-Vis吸光度计算', path: '/pages/spectroscopy/uvvis/uvvis', category: '谱学工具', keywords: ['beer', 'lambert', 'uv', 'vis', '吸光度'] },
      // 高级计算
      { id: 'xrd', name: 'XRD 计算', icon: '📐', description: 'd-2θ互算、晶系d(hkl)', path: '/pages/advanced/xrd/xrd', category: '高级计算', keywords: ['xrd', '衍射', '晶体', '计算'] },
      { id: 'electrochem', name: '电化学', icon: '⚡', description: '电极电位换算与Nernst', path: '/pages/advanced/electrochem/electrochem', category: '高级计算', keywords: ['电化学', '电位', 'nernst', '电极'] },
      { id: 'ksp', name: '溶度积/沉淀', icon: '💧', description: 'Ksp计算、沉淀判断', path: '/pages/advanced/ksp/ksp', category: '高级计算', keywords: ['溶度积', 'ksp', '沉淀', '判断'] },
      { id: 'complexation', name: '络合/掩蔽估算', icon: '🧷', description: '条件稳定常数、络合分数', path: '/pages/advanced/complexation/complexation', category: '高级计算', keywords: ['络合', '掩蔽', '稳定常数'] }
    ],
    isSearching: false
  },

  onLoad() {
    // 同步加载核心数据，提高首屏响应速度
    this.setData({
      filteredTools: this.data.allTools
    });
    this.loadRecentTools();
    this.setData({ searchHistory: this.loadSearchHistory() });
  },

  onShow() {
    // 每次显示页面时刷新最近使用和搜索历史
    this.loadRecentTools();
    this.setData({ searchHistory: this.loadSearchHistory() });
  },

  /**
   * 加载最近使用的工具
   */
  loadRecentTools() {
    const recent = storageService.get('chemtools:recent_tools', []);
    this.setData({
      recentTools: recent.slice(0, 5) // 最多显示5个
    });
  },

  /**
   * 搜索工具
   */
  handleSearch(e) {
    const query = e.detail.value.trim();
    this.setData({ searchQuery: query });
    
    if (query) {
      this.performSearch(query);
    } else {
      this.setData({ 
        isSearching: false,
        filteredTools: [] 
      });
    }
  },

  /**
   * 搜索确认
   */
  handleSearchConfirm(e) {
    const query = e.detail.value.trim();
    if (!query) return;
    
    // 保存搜索历史
    this.saveSearchHistory(query);
    this.setData({ searchHistory: this.loadSearchHistory() });
    
    this.performSearch(query);
    
    // 如果只有一个结果，直接跳转
    if (this.data.filteredTools.length === 1) {
      const tool = this.data.filteredTools[0];
      this.addToRecent(tool);
      wx.navigateTo({
        url: tool.path,
        fail: () => {
          wx.switchTab({ url: tool.path });
        }
      });
    }
  },

  /**
   * 执行搜索
   */
  performSearch(query) {
    const keyword = query.toLowerCase();
    const { allTools } = this.data;
    
    const filtered = allTools.filter(tool => {
      // 搜索名称、描述、分类和关键词
      return tool.name.toLowerCase().includes(keyword) ||
             tool.description.toLowerCase().includes(keyword) ||
             tool.category.toLowerCase().includes(keyword) ||
             tool.keywords.some(k => k.includes(keyword));
    });

    this.setData({
      filteredTools: filtered,
      isSearching: true
    });
  },

  /**
   * 清除搜索
   */
  clearSearch() {
    this.setData({
      searchQuery: '',
      filteredTools: [],
      isSearching: false
    });
  },

  /**
   * 保存搜索历史
   */
  saveSearchHistory(query) {
    if (!query || query.trim().length === 0) return;
    
    let history = storageService.get('chemtools:search_history', []);
    
    // 移除重复项
    history = history.filter(item => item !== query);
    
    // 添加到开头
    history.unshift(query);
    
    // 最多保存20条
    history = history.slice(0, 20);
    
    storageService.set('chemtools:search_history', history);
  },

  /**
   * 加载搜索历史
   */
  loadSearchHistory() {
    const history = storageService.get('chemtools:search_history', []);
    return history.slice(0, 8); // 最多显示8条
  },

  /**
   * 使用历史搜索
   */
  useHistorySearch(e) {
    const query = e.currentTarget.dataset.query;
    this.setData({ searchQuery: query });
    this.performSearch(query);
  },

  /**
   * 删除搜索历史项
   */
  deleteSearchHistory(e) {
    const query = e.currentTarget.dataset.query;
    let history = storageService.get('chemtools:search_history', []);
    history = history.filter(item => item !== query);
    storageService.set('chemtools:search_history', history);
    
    // 刷新显示（如果需要）
    if (this.data.searchQuery === '') {
      this.setData({ searchHistory: this.loadSearchHistory() });
    }
  },

  /**
   * 清空搜索历史
   */
  clearSearchHistory() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空搜索历史吗？',
      success: (res) => {
        if (res.confirm) {
          storageService.remove('chemtools:search_history');
          this.setData({ searchHistory: [] });
          wx.showToast({
            title: '已清空',
            icon: 'success'
          });
        }
      }
    });
  },

  /**
   * 导航到工具页面
   */
  navigateTo(e) {
    const { path } = e.currentTarget.dataset;
    if (!path) return;

    // 记录到最近使用
    this.addToRecent(e.currentTarget.dataset);

    wx.navigateTo({
      url: path,
      fail: () => {
        wx.switchTab({ url: path });
      }
    });
  },

  /**
   * 添加到最近使用
   */
  addToRecent(tool) {
    let recent = storageService.get('chemtools:recent_tools', []);
    
    // 移除重复项
    recent = recent.filter(item => item.path !== tool.path);
    
    // 添加到开头
    recent.unshift(tool);
    
    // 最多保存10个
    recent = recent.slice(0, 10);
    
    storageService.set('chemtools:recent_tools', recent);
    this.loadRecentTools();
  },

  /**
   * 清空最近使用
   */
  clearRecent() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空最近使用记录吗？',
      success: (res) => {
        if (res.confirm) {
          storageService.remove('chemtools:recent_tools');
          this.setData({ recentTools: [] });
          wx.showToast({
            title: '已清空',
            icon: 'success'
          });
        }
      }
    });
  },

  /**
   * 跳转到帮助页面
   */
  goToHelp() {
    wx.navigateTo({
      url: '/pages/help/help?tab=0'
    });
  },

  /**
   * 跳转到数据来源页面
   */
  goToDataSource() {
    wx.navigateTo({
      url: '/pages/help/help?tab=1'
    });
  },

  /**
   * 跳转到常见问题页面
   */
  goToFAQ() {
    wx.navigateTo({
      url: '/pages/help/help?tab=2'
    });
  },

  /**
   * 分享
   */
  onShareAppMessage() {
    return {
      title: '材料化学科研工具箱 - 专业的化学计算工具',
      path: '/pages/home/home',
      imageUrl: ''
    };
  },

  /**
   * 分享到朋友圈
   */
  onShareTimeline() {
    return {
      title: '材料化学科研工具箱',
      query: '',
      imageUrl: ''
    };
  }
});

