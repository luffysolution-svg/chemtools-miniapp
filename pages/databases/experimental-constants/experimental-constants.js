/**
 * 实验常数数据库页面
 */

const {
  BUFFER_PKA_DATA,
  SOLVENT_PROPERTIES,
  STANDARD_ELECTRODE_POTENTIALS,
  CRYSTAL_FIELD_SPLITTING,
  searchBuffer,
  searchSolvent,
  searchElectrodePotential,
  searchCrystalField
} = require('../../../utils/data/experimental-constants');

Page({
  data: {
    activeTab: 0,
    searchQuery: '',
    
    // 搜索占位符
    searchPlaceholders: [
      '搜索缓冲液名称...',
      '搜索溶剂名称...',
      '搜索元素或反应...',
      '搜索金属或配合物...'
    ],
    
    // 显示的数据
    displayedBuffers: [],
    displayedSolvents: [],
    displayedElectrodes: [],
    displayedCrystalFields: [],
    
    // 原始数据
    allBuffers: [],
    allSolvents: [],
    allElectrodes: [],
    allCrystalFields: []
  },

  onLoad() {
    this.loadAllData();
  },

  /**
   * 加载所有数据
   */
  loadAllData() {
    this.setData({
      allBuffers: BUFFER_PKA_DATA,
      allSolvents: SOLVENT_PROPERTIES,
      allElectrodes: STANDARD_ELECTRODE_POTENTIALS,
      allCrystalFields: CRYSTAL_FIELD_SPLITTING,
      displayedBuffers: BUFFER_PKA_DATA,
      displayedSolvents: SOLVENT_PROPERTIES,
      displayedElectrodes: STANDARD_ELECTRODE_POTENTIALS,
      displayedCrystalFields: CRYSTAL_FIELD_SPLITTING
    });
  },

  /**
   * 切换Tab
   */
  switchTab(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    
    this.setData({
      activeTab: index,
      searchQuery: ''
    });
  },

  /**
   * 搜索
   */
  onSearch(e) {
    const query = e.detail.value;
    this.setData({ searchQuery: query });
    
    if (!query.trim()) {
      // 恢复全部数据
      this.setData({
        displayedBuffers: this.data.allBuffers,
        displayedSolvents: this.data.allSolvents,
        displayedElectrodes: this.data.allElectrodes,
        displayedCrystalFields: this.data.allCrystalFields
      });
      return;
    }
    
    // 根据当前Tab执行相应搜索
    switch (this.data.activeTab) {
      case 0:
        this.searchBuffers(query);
        break;
      case 1:
        this.searchSolvents(query);
        break;
      case 2:
        this.searchElectrodes(query);
        break;
      case 3:
        this.searchCrystalFields(query);
        break;
    }
  },

  /**
   * 搜索缓冲液
   */
  searchBuffers(query) {
    const results = searchBuffer(query);
    this.setData({ displayedBuffers: results });
  },

  /**
   * 搜索溶剂
   */
  searchSolvents(query) {
    const results = searchSolvent(query);
    this.setData({ displayedSolvents: results });
  },

  /**
   * 搜索电极
   */
  searchElectrodes(query) {
    const results = searchElectrodePotential(query);
    this.setData({ displayedElectrodes: results });
  },

  /**
   * 搜索晶体场
   */
  searchCrystalFields(query) {
    const results = searchCrystalField(query);
    this.setData({ displayedCrystalFields: results });
  }
});

