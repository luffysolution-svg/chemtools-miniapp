/**
 * 化学药品缩写查询页面 - 优化版
 * 使用懒加载和按需加载提升性能
 */

const abbreviationUtil = require('./abbreviation-data');
// 核心数据已合并到主数据文件中
const { storageService } = require('../../../services/storage');
const { historyService } = require('../../../services/history');

// 数据加载策略
let fullDataLoaded = false;
let coreDataCache = null;

Page({
  data: {
    searchQuery: '',
    displayData: [],
    categories: [],
    selectedCategory: '全部',
    categoryStats: {},
    isSearching: false,
    showCategoryFilter: false,
    totalCount: 0,
    
    // 收藏功能
    favorites: [],
    
    // 分页加载
    pageSize: 15, // 从20减少到15，减少首屏渲染
    currentPage: 1,
    hasMore: true,
    isLoading: false,
    
    // 搜索历史
    searchHistory: [],
    
    // 数据统计
    statistics: {
      totalCount: 0,
      categoriesCount: 0,
      detailedCount: 0,
      withCAS: 0,
      withFormula: 0
    },
    showStatistics: false,
    
    // 数据加载状态
    dataMode: 'core' // 'core' 或 'full'
  },

  onLoad() {
    // 优先加载核心数据（更快）
    this.initCoreData();
    
    // 延迟加载完整数据
    this.lazyLoadFullData();
  },

  onShow() {
    // 刷新收藏状态
    this.loadFavorites();
  },

  /**
   * 初始化核心数据（最快加载）
   */
  initCoreData() {
    // 使用核心数据（仅50条）
    if (!coreDataCache) {
      const allData = abbreviationUtil.getBasicData();
      coreDataCache = allData.slice(0, 50); // 取前50条作为核心数据
    }
    
    // 计算核心数据统计
    const coreStats = {
      totalCount: coreDataCache.length,
      categories: [...new Set(coreDataCache.map(item => item.category))].sort()
    };
    
    this.setData({
      categories: ['全部', ...coreStats.categories],
      categoryStats: {},
      totalCount: coreStats.totalCount,
      statistics: {
        totalCount: coreStats.totalCount,
        categoriesCount: coreStats.categories.length,
        detailedCount: 0,
        withCAS: 0,
        withFormula: 0
      },
      dataMode: 'core',
      displayData: [] // 初始为空
    });
    
    // 立即加载第一页核心数据
    setTimeout(() => {
      this.loadPageData(coreDataCache, 1);
    }, 50); // 更短的延迟
    
    this.loadFavorites();
    this.loadSearchHistory();
  },

  /**
   * 延迟加载完整数据
   */
  lazyLoadFullData() {
    // 2秒后在后台加载完整数据
    setTimeout(() => {
      if (!fullDataLoaded) {
        try {
          const allData = abbreviationUtil.getBasicData();
          fullDataLoaded = true;
          
          // 更新统计信息
          const categories = ['全部', ...abbreviationUtil.getAllCategories()];
          const categoryStats = abbreviationUtil.getCategoryStats();
          const statistics = abbreviationUtil.getDataStatistics();
          
          this.setData({
            categories,
            categoryStats,
            totalCount: statistics.totalCount,
            statistics,
            dataMode: 'full'
          });
          
          // 如果当前显示的是核心数据，切换到完整数据
          if (this.data.displayData.length > 0 && !this.data.isSearching) {
            this.loadPageData(allData, 1);
          }
        } catch (e) {
          // 完整数据加载失败，继续使用核心数据
        }
      }
    }, 2000);
  },
  
  /**
   * 初始化基础数据（兼容旧方法）
   */
  initBasicData() {
    // 直接调用核心数据初始化
    this.initCoreData();
  },

  /**
   * 加载分页数据
   */
  loadPageData(sourceData, page = 1) {
    const { pageSize } = this.data;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const pageData = sourceData.slice(start, end);
    
    // 优化：减少setData调用，批量更新
    const updateData = {
      currentPage: page,
      hasMore: end < sourceData.length
    };
    
    if (page === 1) {
      // 首次加载，直接设置
      updateData.displayData = pageData;
    } else {
      // 追加数据
      updateData.displayData = [...this.data.displayData, ...pageData];
    }
    
    this.setData(updateData);
  },

  /**
   * 页面滚动到底部，加载更多
   */
  onReachBottom() {
    if (this.data.hasMore && !this.data.isLoading) {
      this.loadMore();
    }
  },

  /**
   * 加载更多数据
   */
  loadMore() {
    if (this.data.isLoading || !this.data.hasMore) return;
    
    this.setData({ isLoading: true });
    
    // 模拟异步加载
    setTimeout(() => {
      let sourceData;
      if (this.data.isSearching) {
        sourceData = abbreviationUtil.searchAbbreviation(this.data.searchQuery);
        sourceData = this.filterByCategory(sourceData, this.data.selectedCategory);
      } else {
        sourceData = abbreviationUtil.getBasicData();
        sourceData = this.filterByCategory(sourceData, this.data.selectedCategory);
      }
      
      this.loadPageData(sourceData, this.data.currentPage + 1);
      this.setData({ isLoading: false });
    }, 300);
  },

  /**
   * 搜索处理
   */
  handleSearch(e) {
    const query = e.detail.value;
    this.setData({ searchQuery: query });
    
    if (query.trim() === '') {
      this.setData({ isSearching: false });
      const allData = abbreviationUtil.getBasicData();
      const filteredData = this.filterByCategory(allData, this.data.selectedCategory);
      this.loadPageData(filteredData, 1);
    } else {
      this.performSearch(query);
    }
  },

  /**
   * 执行搜索
   */
  performSearch(query) {
    const results = abbreviationUtil.searchAbbreviation(query);
    const filteredResults = this.filterByCategory(results, this.data.selectedCategory);
    
    this.setData({ isSearching: true });
    this.loadPageData(filteredResults, 1);
  },

  /**
   * 搜索确认
   */
  handleSearchConfirm(e) {
    const query = e.detail.value.trim();
    if (query) {
      this.saveSearchHistory(query);
      this.performSearch(query);
    }
  },

  /**
   * 清除搜索
   */
  clearSearch() {
    this.setData({
      searchQuery: '',
      isSearching: false
    });
    const allData = abbreviationUtil.getBasicData();
    const filteredData = this.filterByCategory(allData, this.data.selectedCategory);
    this.loadPageData(filteredData, 1);
  },

  /**
   * 切换分类筛选显示
   */
  toggleCategoryFilter() {
    this.setData({
      showCategoryFilter: !this.data.showCategoryFilter
    });
  },

  /**
   * 选择分类
   */
  selectCategory(e) {
    const category = e.currentTarget.dataset.category;
    
    let sourceData;
    if (this.data.isSearching) {
      sourceData = abbreviationUtil.searchAbbreviation(this.data.searchQuery);
    } else {
      sourceData = abbreviationUtil.getBasicData();
    }
    
    const filteredData = this.filterByCategory(sourceData, category);
    
    this.setData({
      selectedCategory: category,
      showCategoryFilter: false
    });
    
    this.loadPageData(filteredData, 1);
  },

  /**
   * 按分类筛选
   */
  filterByCategory(data, category) {
    if (category === '全部') {
      return data;
    }
    return data.filter(item => item.category === category);
  },

  /**
   * 复制缩写
   */
  copyAbbr(e) {
    const { abbr, item } = e.currentTarget.dataset;
    
    // 添加到历史记录
    if (item) {
      historyService.add({
        type: '化学缩写查询',
        title: `${abbr}缩写查询`,
        input: abbr,
        result: item.full || '查询成功',
        metadata: {
          category: '材料查询',
          materialType: '化学缩写',
          abbreviation: abbr,
          fullName: item.full,
          cas: item.cas,
          formula: item.formula,
          abbr_category: item.category,
          dataSource: '化学药品缩写数据库'
        }
      });
    }
    
    wx.setClipboardData({
      data: abbr,
      success: () => {
        wx.showToast({
          title: '已复制缩写',
          icon: 'success',
          duration: 1500
        });
      }
    });
  },

  /**
   * 复制全称
   */
  copyFull(e) {
    const { full } = e.currentTarget.dataset;
    wx.setClipboardData({
      data: full,
      success: () => {
        wx.showToast({
          title: '已复制全称',
          icon: 'success',
          duration: 1500
        });
      }
    });
  },

  /**
   * 复制CAS号
   */
  copyCAS(e) {
    const { cas } = e.currentTarget.dataset;
    if (!cas) return;
    
    wx.setClipboardData({
      data: cas,
      success: () => {
        wx.showToast({
          title: '已复制CAS号',
          icon: 'success',
          duration: 1500
        });
      }
    });
  },

  /**
   * 切换收藏状态
   */
  toggleFavorite(e) {
    const item = e.currentTarget.dataset.item;
    let favorites = this.data.favorites;
    
    const index = favorites.findIndex(fav => fav.abbr === item.abbr);
    
    if (index > -1) {
      // 取消收藏
      favorites.splice(index, 1);
      wx.showToast({
        title: '已取消收藏',
        icon: 'none',
        duration: 1500
      });
    } else {
      // 添加收藏
      favorites.push(item);
      wx.showToast({
        title: '已收藏',
        icon: 'success',
        duration: 1500
      });
    }
    
    storageService.set('chemtools:abbr_favorites', favorites);
    this.setData({ favorites });
  },

  /**
   * 加载收藏数据
   */
  loadFavorites() {
    const favorites = storageService.get('chemtools:abbr_favorites', []);
    this.setData({ favorites });
  },

  /**
   * 查看收藏
   */
  viewFavorites() {
    if (this.data.favorites.length === 0) {
      wx.showToast({
        title: '暂无收藏',
        icon: 'none'
      });
      return;
    }
    
    this.setData({
      selectedCategory: '收藏',
      isSearching: false,
      searchQuery: '',
      showCategoryFilter: false
    });
    
    this.loadPageData(this.data.favorites, 1);
  },

  /**
   * 保存搜索历史
   */
  saveSearchHistory(query) {
    let history = storageService.get('chemtools:abbr_search_history', []);
    history = history.filter(item => item !== query);
    history.unshift(query);
    history = history.slice(0, 10);
    storageService.set('chemtools:abbr_search_history', history);
    this.loadSearchHistory();
  },

  /**
   * 加载搜索历史（优化：只加载3条）
   */
  loadSearchHistory() {
    const history = storageService.get('chemtools:abbr_search_history', []);
    this.setData({ searchHistory: history.slice(0, 3) }); // 从5条减少到3条
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
   * 清空搜索历史
   */
  clearSearchHistory() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空搜索历史吗？',
      success: (res) => {
        if (res.confirm) {
          storageService.remove('chemtools:abbr_search_history');
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
   * 查看详情（按需加载详细数据）
   */
  viewDetail(e) {
    const item = e.currentTarget.dataset.item;
    const isFavorite = this.data.favorites.some(fav => fav.abbr === item.abbr);
    
    // 检查是否有详细数据
    const hasDetail = abbreviationUtil.hasDetailedData(item.abbr);
    
    if (hasDetail) {
      // 按需加载详细数据
      const detailData = abbreviationUtil.getDetailedData(item.abbr);
      
      // 跳转到详情页面或显示详细弹窗
      wx.navigateTo({
        url: `/pages/materials/abbreviation-detail/abbreviation-detail?abbr=${item.abbr}`,
        fail: () => {
          // 如果详情页不存在，使用弹窗显示
          this.showSimpleDetail(item, detailData, isFavorite);
        }
      });
    } else {
      // 显示简单信息
      this.showSimpleDetail(item, null, isFavorite);
    }
  },

  /**
   * 显示详细信息弹窗
   */
  showSimpleDetail(item, detailData, isFavorite) {
    let content = `【基本信息】\n`;
    content += `完整名称：${item.full}\n`;
    content += `中文名：${item.chinese}\n`;
    content += `分类：${item.category}\n`;
    content += `说明：${item.description}`;
    
    // 物理化学信息
    if (item.cas || item.formula || item.mw) {
      content += `\n\n【物化性质】`;
      if (item.cas) content += `\nCAS号：${item.cas}`;
      if (item.formula) content += `\n分子式：${item.formula}`;
      if (item.mw) content += `\n分子量：${item.mw}`;
    }
    
    // 详细物理性质
    if (detailData && detailData.physical) {
      const phys = detailData.physical;
      content += `\n\n【物理性质】`;
      if (phys.appearance) content += `\n外观：${phys.appearance}`;
      if (phys.meltingPoint) content += `\n熔点：${phys.meltingPoint}`;
      if (phys.boilingPoint) content += `\n沸点：${phys.boilingPoint}`;
      if (phys.density) content += `\n密度：${phys.density}`;
      if (phys.solubility) content += `\n溶解性：${phys.solubility}`;
      if (phys.flashPoint) content += `\n闪点：${phys.flashPoint}`;
    }
    
    // 安全信息
    if (detailData && detailData.safety) {
      const safety = detailData.safety;
      content += `\n\n【⚠️ 安全信息】`;
      if (safety.toxicity) content += `\n毒性：${safety.toxicity}`;
      if (safety.ld50) content += `\nLD50：${safety.ld50}`;
      if (safety.hazards && safety.hazards.length > 0) {
        content += `\n危害：${safety.hazards.join('、')}`;
      }
      if (safety.handling) content += `\n操作：${safety.handling}`;
      if (safety.storage) content += `\n储存：${safety.storage}`;
    }
    
    // 用途
    if (detailData && detailData.usage) {
      content += `\n\n【用途】\n${detailData.usage}`;
    }
    
    // 注意事项
    if (detailData && detailData.notes) {
      content += `\n\n【注意】\n${detailData.notes}`;
    }
    
    content += `\n\n${isFavorite ? '★ 已收藏' : '☆ 未收藏'}`;
    
    wx.showModal({
      title: `${item.abbr} - ${item.chinese}`,
      content: content,
      confirmText: isFavorite ? '取消收藏' : '收藏',
      cancelText: '关闭',
      success: (res) => {
        if (res.confirm) {
          this.toggleFavorite({ currentTarget: { dataset: { item: item } } });
        }
      }
    });
  },

  /**
   * 切换统计信息显示
   */
  toggleStatistics() {
    this.setData({
      showStatistics: !this.data.showStatistics
    });
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.initBasicData();
    wx.stopPullDownRefresh();
    wx.showToast({
      title: '刷新成功',
      icon: 'success',
      duration: 1500
    });
  },

  /**
   * 分享
   */
  onShareAppMessage() {
    return {
      title: '化学药品缩写查询 - 材料化学科研工具箱',
      path: '/pages/materials/abbreviation/abbreviation',
      imageUrl: ''
    };
  },

  /**
   * 分享到朋友圈
   */
  onShareTimeline() {
    return {
      title: '化学药品缩写查询工具',
      query: '',
      imageUrl: ''
    };
  }
});
