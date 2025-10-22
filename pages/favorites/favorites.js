/**
 * 收藏与历史记录页面
 */

const { storageService } = require('../../services/storage');
const { historyService } = require('../../services/history');
const { exportService } = require('../../services/export');

Page({
  data: {
    activeTab: 'favorites',
    historyLoading: false,  // 新增历史记录加载状态
    
    // 收藏相关
    categories: ['材料', '反应', '条件', '计算', '其他'],
    categoryIndex: 0,
    title: '',
    note: '',
    body: '',
    editingId: '',
    favorites: [],
    favoritedCalculations: [],  // 收藏的计算历史
    
    // 历史记录相关
    history: [],  // 原始历史数据
    filteredHistory: [],  // 筛选后的历史数据
    totalHistory: 0,  // 总记录数
    typeFilters: ['全部', '单位换算', 'pH计算', '溶液配比', '分子质量', '其他'],
    typeFilterIndex: 0,
    
    // 高级筛选相关
    showFilterPanel: false,  // 是否显示筛选面板
    searchKeyword: '',  // 搜索关键词
    categoryFilters: ['全部', '基础计算', '高级计算', '材料查询', '光谱分析'],
    categoryFilterIndex: 0,
    dateFilters: ['全部', '今天', '最近7天', '最近30天'],
    dateFilterIndex: 0,
    showWarningOnly: false,  // 仅显示有警告的记录
    showFavoritedOnly: false  // 仅显示收藏的记录
  },

  onLoad() {
    // 按需加载：只加载当前选项卡的数据
    if (this.data.activeTab === 'favorites') {
      this.loadFavorites();
      this.loadFavoritedCalculations();
    } else if (this.data.activeTab === 'history') {
      this.loadHistory();
    }
  },

  onShow() {
    // 每次显示时只刷新当前标签页
    if (this.data.activeTab === 'favorites') {
      this.loadFavorites();
      this.loadFavoritedCalculations();
    } else if (this.data.activeTab === 'history') {
      this.loadHistory();
    }
  },

  /**
   * 切换标签 - 优化版：按需加载数据
   */
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    const oldTab = this.data.activeTab;
    
    this.setData({ activeTab: tab });
    
    // 切换标签时才加载对应的数据
    if (tab !== oldTab) {
      if (tab === 'favorites') {
        // 切换到收藏标签时加载收藏数据
        if (this.data.favorites.length === 0 || this.data.favoritedCalculations.length === 0) {
          this.loadFavorites();
          this.loadFavoritedCalculations();
        }
      } else if (tab === 'history') {
        // 切换到历史标签时加载历史数据
        if (this.data.history.length === 0) {
          this.loadHistory();
        }
      }
    }
  },

  // ========== 收藏相关方法 ==========

  /**
   * 加载收藏列表
   */
  loadFavorites() {
    const favorites = storageService.getFavorites();
    const display = favorites.map(item => {
      const time = item.updatedAt || item.createdAt || '';
      const copyText = [
        `【${this.data.categories[item.categoryIndex || 0]}】${item.title}`,
        item.note ? `备注：${item.note}` : '',
        item.body || '',
        time ? `时间：${time}` : ''
      ].filter(x => !!x).join('\n');
      
      return {
        ...item,
        time,
        copyText
      };
    });
    
    this.setData({ favorites: display });
  },

  /**
   * 加载收藏的计算历史
   */
  loadFavoritedCalculations() {
    const favoritedCalcs = historyService.getFavorited();
    const display = favoritedCalcs.map(item => {
      const date = new Date(item.timestamp);
      const timeStr = `${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
      const copyText = `${item.title}\n输入：${item.input}\n结果：${item.result}\n时间：${date.toLocaleString('zh-CN')}`;
      
      const hasWarning = !!(item.metadata && item.metadata.warning);
      const warning = hasWarning ? item.metadata.warning : '';
      
      return {
        ...item,
        timeStr,
        copyText,
        hasWarning,
        warning,
        userNote: item.userNote || '',
        tags: item.tags || []
      };
    });
    
    this.setData({ favoritedCalculations: display });
  },

  /**
   * 分类选择
   */
  handleCategoryChange(e) {
    this.setData({ categoryIndex: Number(e.detail.value) });
  },

  /**
   * 输入处理
   */
  handleTitleInput(e) {
    this.setData({ title: e.detail.value });
  },

  handleNoteInput(e) {
    this.setData({ note: e.detail.value });
  },

  handleBodyInput(e) {
    this.setData({ body: e.detail.value });
  },

  /**
   * 添加或更新收藏
   */
  addFavorite() {
    const { categoryIndex, title, note, body, editingId } = this.data;
    
    if (!title && !body) {
      wx.showToast({
        title: '请填写标题或内容',
        icon: 'none'
      });
      return;
    }

    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    let favorites = storageService.getFavorites();
    
    if (editingId) {
      // 更新
      const index = favorites.findIndex(item => item.id === editingId);
      if (index >= 0) {
        favorites[index] = {
          ...favorites[index],
          categoryIndex,
          title,
          note,
          body,
          updatedAt: timestamp
        };
      }
    } else {
      // 新增
      const id = `fav_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      favorites.unshift({
        id,
        categoryIndex,
        title,
        note,
        body,
        createdAt: timestamp,
        updatedAt: timestamp
      });
    }

    storageService.setFavorites(favorites);
    this.loadFavorites();
    this.clearForm();
    
    wx.showToast({
      title: editingId ? '已更新' : '已添加',
      icon: 'success'
    });
  },

  /**
   * 编辑收藏
   */
  editFavorite(e) {
    const id = e.currentTarget.dataset.id;
    const favorites = storageService.getFavorites();
    const item = favorites.find(f => f.id === id);
    
    if (!item) return;

    this.setData({
      editingId: item.id,
      categoryIndex: item.categoryIndex || 0,
      title: item.title || '',
      note: item.note || '',
      body: item.body || ''
    });

    // 滚动到表单
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    });
  },

  /**
   * 删除收藏
   */
  deleteFavorite(e) {
    const id = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条收藏吗？',
      success: (res) => {
        if (res.confirm) {
          let favorites = storageService.getFavorites();
          favorites = favorites.filter(item => item.id !== id);
          storageService.setFavorites(favorites);
          this.loadFavorites();
          
          wx.showToast({
            title: '已删除',
            icon: 'success'
          });
        }
      }
    });
  },

  /**
   * 复制收藏
   */
  copyFavorite(e) {
    const text = e.currentTarget.dataset.text;
    exportService.copyToClipboard(text);
  },

  /**
   * 清空表单
   */
  clearForm() {
    this.setData({
      categoryIndex: 0,
      title: '',
      note: '',
      body: '',
      editingId: ''
    });
  },

  /**
   * 清空所有收藏
   */
  clearAllFavorites() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有收藏吗？此操作不可恢复。',
      success: (res) => {
        if (res.confirm) {
          storageService.setFavorites([]);
          this.loadFavorites();
          
          wx.showToast({
            title: '已清空',
            icon: 'success'
          });
        }
      }
    });
  },

  // ========== 历史记录相关方法 ==========

  /**
   * 加载历史记录
   */
  loadHistory() {
    // 显示加载状态
    if (this.data.activeTab === 'history' && this.data.totalHistory === 0) {
      this.setData({ historyLoading: true });
    }
    
    const typeMap = {
      1: 'unit',
      2: 'ph',
      3: 'solution',
      4: 'molar'
    };
    
    const filterType = typeMap[this.data.typeFilterIndex] || null;
    
    // 模拟异步加载
    setTimeout(() => {
      let history = historyService.getList({ 
        type: filterType,
        limit: 500  // 增加获取数量
      });

      // 格式化时间
      history = history.map(item => {
        const date = new Date(item.timestamp);
        const timeStr = `${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
        const copyText = `${item.title}\n输入：${item.input}\n结果：${item.result}\n时间：${date.toLocaleString('zh-CN')}`;
        
        // 判断是否有警告
        const hasWarning = !!(item.metadata && item.metadata.warning);
        const warning = hasWarning ? item.metadata.warning : '';
        
        // 判断是否已收藏
        const isFavorited = !!item.isFavorited;
        
        return {
          ...item,
          timeStr,
          copyText,
          hasWarning,
          warning,
          isFavorited
        };
      });

      this.setData({ 
        history,
        totalHistory: history.length,
        historyLoading: false
      }, () => {
        // 应用筛选
        this.applyFilter();
      });
    }, 300);
  },

  /**
   * 类型筛选
   */
  handleTypeFilterChange(e) {
    this.setData({ 
      typeFilterIndex: Number(e.detail.value)
    }, () => {
      this.loadHistory();
    });
  },

  /**
   * 切换历史记录收藏状态
   */
  toggleFavoriteHistory(e) {
    const id = e.currentTarget.dataset.id;
    const success = historyService.toggleFavorite(id);
    
    if (success) {
      const isFavorited = historyService.isFavorited(id);
      
      wx.showToast({
        title: isFavorited ? '已收藏' : '已取消收藏',
        icon: 'success',
        duration: 1500
      });
      
      // 刷新数据
      this.loadFavoritedCalculations();
      this.loadHistory();
    } else {
      wx.showToast({
        title: '操作失败',
        icon: 'none'
      });
    }
  },

  /**
   * 复制历史
   */
  copyHistory(e) {
    const text = e.currentTarget.dataset.text;
    exportService.copyToClipboard(text);
  },

  /**
   * 删除历史
   */
  deleteHistory(e) {
    const id = e.currentTarget.dataset.id;
    historyService.remove(id);
    this.loadHistory();
    
    wx.showToast({
      title: '已删除',
      icon: 'success'
    });
  },

  /**
   * 清空历史
   */
  clearHistory() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有历史记录吗？',
      success: (res) => {
        if (res.confirm) {
          historyService.clear();
          this.loadHistory();
          
          wx.showToast({
            title: '已清空',
            icon: 'success'
          });
        }
      }
    });
  },

  /**
   * 导出历史（导出筛选后的结果）
   */
  exportHistory() {
    wx.showActionSheet({
      itemList: ['导出为文本', '导出为JSON'],
      success: (res) => {
        const history = this.data.filteredHistory;  // 导出筛选后的数据
        let content;
        let fileName;
        
        if (res.tapIndex === 0) {
          content = historyService.exportAsText(history);
          fileName = `计算历史_${Date.now()}.txt`;
        } else {
          content = historyService.exportAsJSON(history);
          fileName = `计算历史_${Date.now()}.json`;
        }
        
        exportService.saveAsFile(content, fileName);
      }
    });
  },

  // ========== 高级筛选相关方法 ==========

  /**
   * 切换筛选面板显示/隐藏
   */
  toggleFilterPanel() {
    this.setData({
      showFilterPanel: !this.data.showFilterPanel
    });
  },

  /**
   * 搜索关键词输入
   */
  handleSearchInput(e) {
    this.setData({
      searchKeyword: e.detail.value
    });
  },

  /**
   * 清空搜索
   */
  clearSearch() {
    this.setData({
      searchKeyword: ''
    }, () => {
      this.applyFilter();
    });
  },

  /**
   * 类别筛选变更
   */
  handleCategoryFilterChange(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      categoryFilterIndex: index
    });
  },

  /**
   * 日期筛选变更
   */
  handleDateFilterChange(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      dateFilterIndex: index
    });
  },

  /**
   * 警告筛选变更
   */
  handleWarningFilterChange(e) {
    this.setData({
      showWarningOnly: e.detail.value
    });
  },

  /**
   * 应用筛选
   */
  applyFilter() {
    let filtered = [...this.data.history];
    
    // 1. 关键词搜索
    const keyword = this.data.searchKeyword.trim().toLowerCase();
    if (keyword) {
      filtered = filtered.filter(item => {
        const searchText = `${item.title} ${item.input} ${item.result}`.toLowerCase();
        return searchText.includes(keyword);
      });
    }
    
    // 2. 类别筛选
    const categoryIndex = this.data.categoryFilterIndex;
    if (categoryIndex > 0) {
      const categoryMap = {
        1: ['unit', 'ph', 'solution', 'molar'],  // 基础计算
        2: ['xrd', 'electrochem', 'ksp', 'complexation'],  // 高级计算
        3: ['periodic', 'semiconductor'],  // 材料查询
        4: ['uvvis', 'spectroscopy', 'xps-raman']  // 光谱分析
      };
      const types = categoryMap[categoryIndex] || [];
      filtered = filtered.filter(item => types.includes(item.type));
    }
    
    // 3. 日期筛选
    const dateIndex = this.data.dateFilterIndex;
    if (dateIndex > 0) {
      const now = Date.now();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayStart = today.getTime();
      
      filtered = filtered.filter(item => {
        const itemTime = new Date(item.timestamp).getTime();
        
        switch (dateIndex) {
          case 1:  // 今天
            return itemTime >= todayStart;
          case 2:  // 最近7天
            return itemTime >= (now - 7 * 24 * 60 * 60 * 1000);
          case 3:  // 最近30天
            return itemTime >= (now - 30 * 24 * 60 * 60 * 1000);
          default:
            return true;
        }
      });
    }
    
    // 4. 警告筛选
    if (this.data.showWarningOnly) {
      filtered = filtered.filter(item => item.hasWarning);
    }
    
    this.setData({
      filteredHistory: filtered
    });
  },

  /**
   * 重置筛选
   */
  resetFilter() {
    this.setData({
      searchKeyword: '',
      categoryFilterIndex: 0,
      dateFilterIndex: 0,
      showWarningOnly: false
    }, () => {
      this.applyFilter();
      wx.showToast({
        title: '筛选已重置',
        icon: 'success',
        duration: 1500
      });
    });
  },

  /**
   * 分享
   */
  onShareAppMessage() {
    return {
      title: '我的收藏 - 材料化学科研工具箱',
      path: '/pages/favorites/favorites'
    };
  }
});

