/**
 * 全局搜索页面 v4.3.0
 * 跨页面、跨数据库的统一搜索
 * 新增：智能建议、缓存、统计、语音搜索
 */

let globalSearch, quickSearch;
try {
  const searchService = require('../../services/searchService');
  globalSearch = searchService.globalSearch;
  quickSearch = searchService.quickSearch;
} catch (e) {
  globalSearch = () => [];
  quickSearch = () => [];
}

// 导入新服务
const { searchStatsService } = require('../../services/searchStats');
const { searchCache } = require('../../services/searchCache');

Page({
  data: {
    // 搜索关键词
    searchKeyword: '',
    // 搜索结果（完整）
    searchResults: [],
    allResultsByType: {},
    // 搜索历史
    searchHistory: [],
    // 热门搜索（动态加载）
    hotSearches: [],
    // 默认热门搜索（备用）
    defaultHotSearches: [
      'XRD', '半导体', 'pH', '单位换算', '元素周期表',
      'DMF', 'TiO2', 'Beer-Lambert', '溶度积', '电化学'
    ],
    // 搜索建议
    searchSuggestions: [],
    showSuggestions: false,
    // 搜索选项（默认全部开启）
    searchOptions: {
      includeTools: true,
      includeAbbreviations: true,
      includeSemiconductors: true,
      includeElements: true
    },
    // UI状态
    isSearching: false,
    showHistory: true,
    showOptions: false,
    noResults: false,
    // 结果分类
    resultsByType: {
      tools: [],
      abbreviations: [],
      semiconductors: [],
      elements: [],
      spectroscopy: [],
      ksp: [],
      references: [],
      xrays: []
    },
    // 分页相关
    resultPageSize: 10,
    displayedCountByType: {
      tools: 10,
      abbreviations: 10,
      semiconductors: 10,
      elements: 10,
      spectroscopy: 10,
      ksp: 10,
      references: 10,
      xrays: 10
    },
    hasMoreByType: {
      tools: false,
      abbreviations: false,
      semiconductors: false,
      elements: false,
      spectroscopy: false,
      ksp: false,
      references: false,
      xrays: false
    },
    // 缓存标识
    fromCache: false,
    // 排序方式
    sortBy: 'relevance', // relevance, recent, popular
    // 语音搜索状态
    isVoiceSearching: false,
    // 搜索过滤显示
    showFilters: false,
    // 历史管理
    editMode: false,
    selectedHistory: [],
    pinnedSearches: [],
    groupedHistory: {
      today: [],
      thisWeek: [],
      older: []
    }
  },

  onLoad(options) {
    // 延迟加载搜索历史，优先显示页面
    setTimeout(() => {
      this.loadSearchHistory();
      this.loadHotSearches();
    }, 0);

    // 支持URL参数传入搜索关键词（用于快捷搜索和快速标签）
    if (options && options.keyword) {
      const keyword = decodeURIComponent(options.keyword);
      this.setData({ 
        searchKeyword: keyword,
        showHistory: false  // 有关键词时隐藏历史
      });
      // 延迟执行搜索，确保页面已加载
      setTimeout(() => {
        this.performSearch(keyword);
        this.saveSearchHistory(keyword);
      }, 300);
    }
  },

  onShow() {
  },

  /**
   * 搜索输入
   */
  handleSearchInput(e) {
    const keyword = e.detail.value;
    this.setData({
      searchKeyword: keyword,
      showHistory: keyword.trim() === ''
    });

    // 清除之前的定时器
    if (this.suggestionTimer) clearTimeout(this.suggestionTimer);
    if (this.searchTimer) clearTimeout(this.searchTimer);

    // 如果输入为空，清空搜索结果
    if (keyword.trim() === '') {
      this.setData({
        searchResults: [],
        resultsByType: {},
        allResultsByType: {},
        noResults: false,
        showSuggestions: false,
        searchSuggestions: []
      });
      return;
    }

    // 显示搜索建议（防抖 200ms）
    this.suggestionTimer = setTimeout(() => {
      const suggestions = this.getSuggestions(keyword.trim());
      this.setData({ 
        searchSuggestions: suggestions,
        showSuggestions: suggestions.length > 0
      });
    }, 200);

    // 实时搜索（防抖 500ms）
    this.searchTimer = setTimeout(() => {
      if (keyword.trim().length > 0) {
        this.performSearch(keyword.trim());
        this.saveSearchHistory(keyword.trim());
      }
    }, 500);
  },

  /**
   * 搜索确认
   */
  handleSearchConfirm(e) {
    const keyword = e.detail.value.trim();
    if (keyword) {
      this.performSearch(keyword);
      this.saveSearchHistory(keyword);
    }
  },

  /**
   * 执行搜索
   */
  performSearch(keyword) {
    if (!keyword || keyword.trim() === '') return;

    // 隐藏搜索建议
    this.setData({ 
      showSuggestions: false,
      showHistory: false 
    });

    // 先检查缓存
    const cached = searchCache.get(keyword, this.data.searchOptions);
    if (cached) {
      this.displaySearchResults(cached, true);
      // 仍然记录搜索统计
      searchStatsService.recordSearch(keyword);
      return;
    }

    this.setData({ isSearching: true });

    try {
      const options = {
        ...this.data.searchOptions,
        limit: 500  // 移除结果限制，获取全部结果
      };

      const results = globalSearch(keyword, options);

      // 按类型分类结果
      const allResultsByType = {
        tools: results.filter(r => r.type === '工具'),
        abbreviations: results.filter(r => r.type === '缩写'),
        semiconductors: results.filter(r => r.type === '半导体'),
        elements: results.filter(r => r.type === '元素'),
        spectroscopy: results.filter(r => r.type === '光谱'),
        ksp: results.filter(r => r.type === 'Ksp'),
        references: results.filter(r => r.type === '参比电极'),
        xrays: results.filter(r => r.type === 'X射线源')
      };

      // 初始化分页显示（每个类型显示前10条）
      const displayedResults = {};
      const hasMore = {};
      Object.keys(allResultsByType).forEach(type => {
        const typeResults = allResultsByType[type];
        displayedResults[type] = typeResults.slice(0, this.data.resultPageSize);
        hasMore[type] = typeResults.length > this.data.resultPageSize;
      });

      // 重置分页计数
      const displayedCount = {};
      Object.keys(allResultsByType).forEach(type => {
        displayedCount[type] = this.data.resultPageSize;
      });

      // 缓存结果
      searchCache.set(keyword, results, allResultsByType, this.data.searchOptions);
      
      // 记录搜索统计
      searchStatsService.recordSearch(keyword);

      // 显示结果
      this.displaySearchResults({
        results,
        resultsByType: displayedResults
      }, false);

      // 更新分页状态
      this.setData({
        allResultsByType,
        displayedCountByType: displayedCount,
        hasMoreByType: hasMore
      });
    } catch (e) {
      console.error('搜索出错:', e);
      this.setData({
        isSearching: false,
        noResults: true,
        fromCache: false
      });
      wx.showToast({
        title: '搜索失败',
        icon: 'none'
      });
    }
  },

  /**
   * 显示搜索结果（统一处理）
   */
  displaySearchResults(data, isFromCache) {
    this.setData({
      searchResults: data.results,
      resultsByType: data.resultsByType,
      isSearching: false,
      noResults: data.results.length === 0,
      fromCache: isFromCache
    });
  },

  /**
   * 加载更多结果（按类型）
   */
  loadMoreResults(e) {
    const { type } = e.currentTarget.dataset;
    if (!type || !this.data.allResultsByType[type]) return;

    const allResults = this.data.allResultsByType[type];
    const currentCount = this.data.displayedCountByType[type];
    const newCount = currentCount + this.data.resultPageSize;
    
    const displayedResults = allResults.slice(0, newCount);
    const hasMore = newCount < allResults.length;

    this.setData({
      [`resultsByType.${type}`]: displayedResults,
      [`displayedCountByType.${type}`]: newCount,
      [`hasMoreByType.${type}`]: hasMore
    });
  },

  /**
   * 快速搜索（只搜索工具）
   */
  quickSearchTools(keyword) {
    const results = quickSearch(keyword);
    this.setData({
      searchResults: results,
      isSearching: false,
      noResults: results.length === 0
    });
  },

  /**
   * 清除搜索
   */
  clearSearch() {
    this.setData({
      searchKeyword: '',
      searchResults: [],
      showHistory: true,
      noResults: false
    });
  },

  /**
   * 点击搜索结果
   */
  handleResultTap(e) {
    const { item } = e.currentTarget.dataset;

    if (!item) return;

    // 根据不同类型跳转到对应页面
    if (item.type === '工具' && item.page) {
      wx.navigateTo({
        url: item.page
      });
    } else if (item.type === '缩写') {
      // 跳转到化学缩写页面，并传递搜索关键词
      wx.navigateTo({
        url: `/pages/materials/abbreviation/abbreviation?search=${encodeURIComponent(item.name)}`
      });
    } else if (item.type === '半导体') {
      // 跳转到半导体页面，并传递搜索关键词
      wx.navigateTo({
        url: `/pages/materials/semiconductor/semiconductor?search=${encodeURIComponent(item.formula || item.name)}`
      });
    } else if (item.type === '元素') {
      // 跳转到元素周期表页面，并传递元素符号
      wx.navigateTo({
        url: `/pages/materials/periodic/periodic?element=${encodeURIComponent(item.symbol)}`
      });
    } else if (item.page) {
      // 默认跳转
      wx.navigateTo({
        url: item.page
      });
    } else {
      // 显示详情
      this.showItemDetail(item);
    }
  },

  /**
   * 显示项目详情
   */
  showItemDetail(item) {
    const content = this.formatItemDetail(item);
    wx.showModal({
      title: item.name || item.title,
      content: content,
      showCancel: true,
      confirmText: '确定',
      cancelText: '取消'
    });
  },

  /**
   * 格式化项目详情
   */
  formatItemDetail(item) {
    let content = '';
    
    if (item.type) content += `类型: ${item.type}\n`;
    if (item.description) content += `\n${item.description}\n`;
    if (item.formula) content += `\n化学式: ${item.formula}`;
    if (item.bandgap) content += `\n带隙: ${item.bandgap} eV`;
    if (item.number) content += `\n原子序数: ${item.number}`;
    if (item.fullName) content += `\n全称: ${item.fullName}`;
    if (item.chineseName) content += `\n中文名: ${item.chineseName}`;
    
    return content || '暂无详细信息';
  },

  /**
   * 切换搜索选项
   */
  toggleSearchOptions() {
    const newShowOptions = !this.data.showOptions;
    this.setData({
      showOptions: newShowOptions,
      showFilters: false  // 关闭过滤器面板，避免同时显示
    });
    
    // 给用户反馈
    if (newShowOptions) {
      wx.showToast({
        title: '搜索选项已展开',
        icon: 'none',
        duration: 1000
      });
    }
  },

  /**
   * 切换搜索范围
   */
  toggleSearchScope(e) {
    const { scope } = e.currentTarget.dataset;
    const key = `searchOptions.${scope}`;
    const currentValue = this.data.searchOptions[scope];
    
    this.setData({
      [key]: !currentValue
    });

    // 如果有搜索关键词，立即重新搜索
    if (this.data.searchKeyword.trim()) {
      this.performSearch(this.data.searchKeyword);
    }
  },

  /**
   * 使用热门搜索
   */
  useHotSearch(e) {
    const { keyword } = e.currentTarget.dataset;
    this.setData({ searchKeyword: keyword });
    this.performSearch(keyword);
    this.saveSearchHistory(keyword);
  },

  /**
   * 使用历史搜索
   */
  useHistorySearch(e) {
    const { keyword } = e.currentTarget.dataset;
    this.setData({ searchKeyword: keyword });
    this.performSearch(keyword);
  },

  /**
   * 保存搜索历史（异步优化）
   */
  saveSearchHistory(keyword) {
    // 确保keyword是字符串
    if (typeof keyword !== 'string' || !keyword.trim()) {
      return;
    }
    
    keyword = keyword.trim();
    
    wx.getStorage({
      key: 'search_history',
      success: (res) => {
        let history = res.data || [];
        
        // 数据清洗：确保所有项都是字符串
        history = history.filter(item => typeof item === 'string' && item.trim());
        
        // 去重
        history = history.filter(item => item !== keyword);
        // 添加到开头
        history.unshift(keyword);
        // 最多保存10条
        history = history.slice(0, 10);
        
        wx.setStorage({
          key: 'search_history',
          data: history
        });
        this.setData({ searchHistory: history });
      },
      fail: () => {
        // 无历史记录，直接创建
        wx.setStorage({
          key: 'search_history',
          data: [keyword]
        });
        this.setData({ searchHistory: [keyword] });
      }
    });
  },

  /**
   * 加载搜索历史（异步优化）
   */
  loadSearchHistory() {
    wx.getStorage({
      key: 'search_history',
      success: (res) => {
        let history = res.data || [];
        // 数据清洗：确保所有项都是字符串
        history = history.filter(item => typeof item === 'string' && item.trim());
        this.setData({ searchHistory: history });
        // 清洗后重新保存
        if (history.length > 0) {
          wx.setStorage({
            key: 'search_history',
            data: history
          });
        }
      },
      fail: () => {
        // 无历史记录，不做处理
      }
    });
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
          // 异步删除
          wx.removeStorage({
            key: 'search_history'
          });
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
   * 获取搜索建议
   */
  getSuggestions(keyword) {
    const suggestions = [];
    const normalizedKeyword = keyword.toLowerCase();

    // 1. 从搜索历史中匹配（优先级最高）
    const history = this.data.searchHistory || [];
    history.forEach(item => {
      if (item.toLowerCase().includes(normalizedKeyword) && item.toLowerCase() !== normalizedKeyword) {
        suggestions.push({
          text: item,
          icon: '🕐',
          source: '历史',
          type: 'history'
        });
      }
    });

    // 2. 从工具名称中匹配
    const tools = [
      { name: 'pH计算', icon: '🧪' },
      { name: 'XRD计算', icon: '📐' },
      { name: '单位换算', icon: '🔁' },
      { name: '溶液配比', icon: '⚗️' },
      { name: '分子质量', icon: '🧬' },
      { name: '元素周期表', icon: '🧮' },
      { name: '半导体数据库', icon: '💡' },
      { name: '化学药品缩写', icon: '📚' },
      { name: '电化学', icon: '⚡' },
      { name: '溶度积', icon: '💧' },
      { name: '络合计算', icon: '🧷' },
      { name: '热力学计算', icon: '🔥' },
      { name: '动力学计算', icon: '⏱️' }
    ];

    tools.forEach(tool => {
      if (tool.name.toLowerCase().includes(normalizedKeyword) && 
          !suggestions.some(s => s.text === tool.name)) {
        suggestions.push({
          text: tool.name,
          icon: tool.icon,
          source: '工具',
          type: 'tool'
        });
      }
    });

    // 3. 从常用关键词中匹配
    const keywords = [
      'DMF', 'DMSO', 'THF', 'TiO2', 'ZnO', 'AgCl', 'BaSO4', 
      'Cu Kα', 'Mo Kα', 'SHE', 'SCE', 'pH', 'XRD', 'XPS', 'Raman'
    ];

    keywords.forEach(kw => {
      if (kw.toLowerCase().includes(normalizedKeyword) && 
          !suggestions.some(s => s.text === kw)) {
        suggestions.push({
          text: kw,
          icon: '🔍',
          source: '关键词',
          type: 'keyword'
        });
      }
    });

    // 最多返回8个建议
    return suggestions.slice(0, 8);
  },

  /**
   * 使用建议
   */
  useSuggestion(e) {
    const { suggestion } = e.currentTarget.dataset;
    if (!suggestion) return;

    this.setData({ 
      searchKeyword: suggestion.text,
      showSuggestions: false 
    });
    this.performSearch(suggestion.text);
    this.saveSearchHistory(suggestion.text);
  },

  /**
   * 加载热门搜索
   */
  loadHotSearches() {
    try {
      const hotSearches = searchStatsService.getHotSearches(10);
      
      if (hotSearches && hotSearches.length > 0) {
        this.setData({ hotSearches });
      } else {
        // 使用默认热门搜索
        const defaultHot = this.data.defaultHotSearches.map((keyword, index) => ({
          keyword,
          count: 10 - index
        }));
        this.setData({ hotSearches: defaultHot });
      }
    } catch (e) {
      console.error('加载热门搜索失败:', e);
      // 使用默认
      const defaultHot = this.data.defaultHotSearches.map((keyword, index) => ({
        keyword,
        count: 10 - index
      }));
      this.setData({ hotSearches: defaultHot });
    }
  },

  /**
   * 语音搜索
   */
  startVoiceSearch() {
    // 微信小程序语音识别需要插件支持
    // 这里提供一个简化版本，使用录音转文字
    wx.showToast({
      title: '语音搜索功能开发中',
      icon: 'none',
      duration: 2000
    });

    // TODO: 集成微信同声传译插件
    // const plugin = requirePlugin('WechatSI');
    // const manager = plugin.getRecordRecognitionManager();
    // manager.start();
  },

  /**
   * 切换排序方式
   */
  changeSortBy(e) {
    const { sort } = e.currentTarget.dataset;
    this.setData({ sortBy: sort });

    // 重新排序当前结果
    if (this.data.searchResults.length > 0) {
      const sortedResults = this.sortResults(this.data.searchResults, sort);
      this.setData({ searchResults: sortedResults });
    }
  },

  /**
   * 排序结果
   */
  sortResults(results, sortBy) {
    const resultsCopy = [...results];

    switch (sortBy) {
      case 'relevance':
        return resultsCopy.sort((a, b) => (b.relevance || 0) - (a.relevance || 0));
      
      case 'recent':
        // 根据搜索历史排序
        const history = this.data.searchHistory || [];
        return resultsCopy.sort((a, b) => {
          const aIndex = history.indexOf(a.name);
          const bIndex = history.indexOf(b.name);
          if (aIndex === -1) return 1;
          if (bIndex === -1) return -1;
          return aIndex - bIndex;
        });
      
      case 'popular':
        // 根据搜索统计排序
        return resultsCopy.sort((a, b) => {
          const aCount = searchStatsService.getSearchCount(a.name);
          const bCount = searchStatsService.getSearchCount(b.name);
          return bCount - aCount;
        });
      
      default:
        return resultsCopy;
    }
  },

  /**
   * 切换过滤器显示
   */
  toggleFilters() {
    const newShowFilters = !this.data.showFilters;
    this.setData({ 
      showFilters: newShowFilters,
      showOptions: false  // 关闭搜索选项面板，避免同时显示
    });
    
    // 给用户反馈
    if (newShowFilters) {
      wx.showToast({
        title: '过滤器已展开',
        icon: 'none',
        duration: 1000
      });
    }
  },

  /**
   * 导出搜索结果
   */
  exportResults() {
    const { searchKeyword, searchResults } = this.data;

    if (!searchResults || searchResults.length === 0) {
      wx.showToast({
        title: '暂无结果可导出',
        icon: 'none'
      });
      return;
    }

    let content = `搜索关键词：${searchKeyword}\n`;
    content += `结果数量：${searchResults.length}\n`;
    content += `导出时间：${new Date().toLocaleString()}\n\n`;
    content += `━━━━━━━━━━━━━━━━━━\n\n`;

    searchResults.forEach((item, index) => {
      content += `${index + 1}. ${item.name}\n`;
      content += `   类型：${item.type}\n`;
      if (item.description) {
        content += `   描述：${item.description}\n`;
      }
      if (item.formula) {
        content += `   化学式：${item.formula}\n`;
      }
      content += `\n`;
    });

    content += `\n━━━━━━━━━━━━━━━━━━\n`;
    content += `由材料化学科研工具箱生成`;

    wx.setClipboardData({
      data: content,
      success: () => {
        wx.showToast({
          title: '已复制到剪贴板',
          icon: 'success'
        });
      }
    });
  },

  /**
   * 切换编辑模式
   */
  toggleEditMode() {
    this.setData({ 
      editMode: !this.data.editMode,
      selectedHistory: []
    });
  },

  /**
   * 选择历史记录
   */
  selectHistory(e) {
    const { keyword } = e.currentTarget.dataset;
    const selected = this.data.selectedHistory;
    const index = selected.indexOf(keyword);

    if (index > -1) {
      selected.splice(index, 1);
    } else {
      selected.push(keyword);
    }

    this.setData({ selectedHistory: selected });
  },

  /**
   * 批量删除
   */
  batchDeleteHistory() {
    const { selectedHistory } = this.data;

    if (selectedHistory.length === 0) {
      wx.showToast({
        title: '请选择要删除的记录',
        icon: 'none'
      });
      return;
    }

    wx.showModal({
      title: '确认删除',
      content: `确定要删除选中的 ${selectedHistory.length} 条搜索历史吗？`,
      success: (res) => {
        if (res.confirm) {
          let history = this.data.searchHistory;
          history = history.filter(item => !selectedHistory.includes(item));
          
          wx.setStorage({
            key: 'search_history',
            data: history
          });

          this.setData({ 
            searchHistory: history,
            selectedHistory: [],
            editMode: false
          });

          wx.showToast({
            title: '删除成功',
            icon: 'success'
          });
        }
      }
    });
  },

  /**
   * 固定/取消固定搜索
   */
  togglePinSearch(e) {
    const { keyword } = e.currentTarget.dataset;
    let pinned = this.data.pinnedSearches;
    const index = pinned.indexOf(keyword);

    if (index > -1) {
      pinned.splice(index, 1);
      wx.showToast({
        title: '已取消固定',
        icon: 'success'
      });
    } else {
      if (pinned.length >= 5) {
        wx.showToast({
          title: '最多固定5个',
          icon: 'none'
        });
        return;
      }
      pinned.unshift(keyword);
      wx.showToast({
        title: '已固定',
        icon: 'success'
      });
    }

    wx.setStorageSync('pinned_searches', pinned);
    this.setData({ pinnedSearches: pinned });
  },

  /**
   * 分享
   */
  onShareAppMessage() {
    const { searchKeyword } = this.data;
    return {
      title: searchKeyword ? `搜索"${searchKeyword}" - 材料化学工具箱` : '全局搜索 - 材料化学工具箱',
      path: '/pages/search/search'
    };
  }
});

