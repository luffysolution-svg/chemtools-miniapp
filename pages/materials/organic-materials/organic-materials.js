// pages/materials/organic-materials/organic-materials.js
const { organicMaterialsData, categories, searchOrganicMaterial, getMaterialsByCategory } = require('../utils/organic-materials');

Page({
  data: {
    materials: [],
    displayMaterials: [],
    categories: [],
    selectedCategory: '全部',
    searchKeyword: '',
    showDetail: false,
    selectedMaterial: null,
    loading: false,
    // 学术组件数据
    hotMaterials: ['PEDOT:PSS', 'P3HT', 'PCBM', 'Spiro-OMeTAD', 'PTB7', 'MOF-5'],
    categoryFilters: [
      { label: '全部', value: '全部' },
      { label: '导电聚合物', value: '导电聚合物' },
      { label: '有机半导体', value: '有机半导体' },
      { label: 'MOF材料', value: 'MOF材料' },
      { label: '富勒烯', value: '富勒烯' }
    ]
  },

  onLoad() {
    this.initData();
  },

  initData() {
    const categoryList = ['全部', ...Object.keys(categories)];
    this.setData({
      materials: organicMaterialsData,
      displayMaterials: organicMaterialsData,
      categories: categoryList
    });
  },

  // 分类筛选
  onCategoryChange(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({ 
      selectedCategory: category,
      searchKeyword: ''
    });
    
    if (category === '全部') {
      this.setData({ displayMaterials: this.data.materials });
    } else {
      const filtered = getMaterialsByCategory(category);
      this.setData({ displayMaterials: filtered });
    }
  },

  // 学术组件分类筛选
  onCategoryFilterChange(e) {
    const category = e.detail.value;
    this.setData({ 
      selectedCategory: category,
      searchKeyword: ''
    });
    
    if (category === '全部') {
      this.setData({ displayMaterials: this.data.materials });
    } else {
      const filtered = getMaterialsByCategory(category);
      this.setData({ displayMaterials: filtered });
    }
  },

  // 搜索
  onSearchInput(e) {
    const keyword = e.detail.value;
    this.setData({ searchKeyword: keyword });
    
    if (!keyword) {
      if (this.data.selectedCategory === '全部') {
        this.setData({ displayMaterials: this.data.materials });
      } else {
        const filtered = getMaterialsByCategory(this.data.selectedCategory);
        this.setData({ displayMaterials: filtered });
      }
    } else {
      const results = searchOrganicMaterial(keyword);
      this.setData({ displayMaterials: results });
    }
  },

  // 执行搜索
  onSearch(e) {
    const keyword = e.detail.value;
    if (keyword) {
      const results = searchOrganicMaterial(keyword);
      this.setData({ 
        displayMaterials: results,
        searchKeyword: keyword
      });
    }
  },

  // 清除搜索
  clearSearch() {
    this.setData({ 
      searchKeyword: '' 
    });
    if (this.data.selectedCategory === '全部') {
      this.setData({ displayMaterials: this.data.materials });
    } else {
      const filtered = getMaterialsByCategory(this.data.selectedCategory);
      this.setData({ displayMaterials: filtered });
    }
  },

  // 查看详情
  showMaterialDetail(e) {
    const material = e.currentTarget.dataset.material;
    
    this.setData({
      showDetail: true,
      selectedMaterial: material
    });
  },

  // 关闭详情
  closeDetail() {
    this.setData({
      showDetail: false,
      selectedMaterial: null
    });
  },

  // 复制信息
  copyInfo(e) {
    const text = e.currentTarget.dataset.text;
    wx.setClipboardData({
      data: text,
      success: () => {
        wx.showToast({ title: '已复制', icon: 'success' });
      }
    });
  }
});

