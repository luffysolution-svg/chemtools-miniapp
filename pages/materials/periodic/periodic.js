/**
 * 元素周期表页面
 */

const { periodicElements } = require('../../../utils/periodic');
const { copyToClipboard } = require('../../../services/export');

Page({
  data: {
    loading: true,  // 新增loading状态
    searchKeyword: '',
    selectedCategory: 'all',
    categoryOptions: [
      { label: '全部', value: 'all' },
      { label: '碱金属', value: 'alkali' },
      { label: '碱土金属', value: 'alkaline' },
      { label: '过渡金属', value: 'transition' },
      { label: '后过渡金属', value: 'post-transition' },
      { label: '类金属', value: 'metalloid' },
      { label: '非金属', value: 'nonmetal' },
      { label: '卤素', value: 'halogen' },
      { label: '稀有气体', value: 'noble-gas' },
      { label: '镧系', value: 'lanthanide' },
      { label: '锕系', value: 'actinide' }
    ],
    categoryMap: {
      'alkali': '碱金属',
      'alkaline': '碱土金属',
      'transition': '过渡金属',
      'post-transition': '后过渡金属',
      'metalloid': '类金属',
      'nonmetal': '非金属',
      'halogen': '卤素',
      'noble-gas': '稀有气体',
      'lanthanide': '镧系元素',
      'actinide': '锕系元素'
    },
    allElements: [],
    filteredElements: [],
    selectedElement: null
  },

  onLoad() {
    // 模拟加载延迟
    wx.showLoading({ title: '加载中...', mask: true });
    
    setTimeout(() => {
      this.setData({
        allElements: periodicElements,
        filteredElements: periodicElements,
        loading: false
      });
      wx.hideLoading();
    }, 500);
  },

  /**
   * 搜索输入
   */
  handleSearchInput(e) {
    const keyword = e.detail.value.trim().toLowerCase();
    this.setData({ searchKeyword: keyword });
    this.filterElements();
  },

  /**
   * 清除搜索
   */
  clearSearch() {
    this.setData({ searchKeyword: '' });
    this.filterElements();
  },

  /**
   * 选择类别
   */
  selectCategory(e) {
    const category = e.currentTarget.dataset.value;
    this.setData({ selectedCategory: category });
    this.filterElements();
  },

  /**
   * 筛选元素
   */
  filterElements() {
    const { searchKeyword, selectedCategory, allElements } = this.data;
    
    let filtered = allElements;

    // 按类别筛选
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(el => el.category === selectedCategory);
    }

    // 按关键词搜索
    if (searchKeyword) {
      filtered = filtered.filter(el => {
        const keyword = searchKeyword.toLowerCase();
        return (
          el.name.toLowerCase().includes(keyword) ||
          el.symbol.toLowerCase().includes(keyword) ||
          String(el.number).includes(keyword)
        );
      });
    }

    this.setData({ filteredElements: filtered });
  },

  /**
   * 显示元素详情
   */
  showElementDetail(e) {
    const element = e.currentTarget.dataset.element;
    this.setData({ selectedElement: element });
  },

  /**
   * 关闭详情
   */
  closeDetail() {
    this.setData({ selectedElement: null });
  },

  /**
   * 阻止事件冒泡
   */
  preventClose() {
    // 阻止点击模态框内容时关闭
  },

  /**
   * 复制元素信息
   */
  copyElementInfo() {
    const el = this.data.selectedElement;
    if (!el) return;

    const info = [
      `【${el.name} (${el.symbol})】`,
      `原子序数：${el.number}`,
      `相对原子质量：${el.atomicMass}`,
      `电负性：${el.electronegativity || '—'}`,
      `原子半径：${el.atomicRadius ? el.atomicRadius + ' pm' : '—'}`,
      `电离能：${el.ionizationEnergy ? el.ionizationEnergy + ' kJ/mol' : '—'}`,
      `熔点：${el.meltingPoint ? el.meltingPoint + ' K' : '—'}`,
      `沸点：${el.boilingPoint ? el.boilingPoint + ' K' : '—'}`,
      `状态：${el.state || '—'}`,
      `类别：${this.data.categoryMap[el.category] || '—'}`
    ].join('\n');

    copyToClipboard(info, '元素信息已复制');
  },

  /**
   * 分享
   */
  onShareAppMessage() {
    return {
      title: '元素周期表 - 材料化学科研工具箱',
      path: '/pages/materials/periodic/periodic'
    };
  }
});

