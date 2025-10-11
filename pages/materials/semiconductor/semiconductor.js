/**
 * 半导体数据库页面
 */

const { semiconductorMaterials } = require('../../../utils/semiconductors');
const { fuzzyMatch, relevanceScore } = require('../pinyin');
const { copyToClipboard } = require('../../../services/export');

Page({
  data: {
    searchKeyword: '',
    selectedBandgapRange: '全部',
    bandgapRanges: [
      { label: '全部', min: 0, max: 999 },
      { label: '< 1 eV', min: 0, max: 1 },
      { label: '1-2 eV', min: 1, max: 2 },
      { label: '2-3 eV', min: 2, max: 3 },
      { label: '> 3 eV', min: 3, max: 999 }
    ],
    quickSelectMaterials: ['二氧化钛', '氧化锌', '砷化镓', '硅', '氮化镓'],
    allMaterials: [],
    filteredMaterials: [],
    selectedMaterial: null,
    loading: true,
    // 手势相关
    modalStartY: 0,
    modalOffsetY: 0,
    modalTranslate: 0
  },

  onLoad() {
    // 模拟加载延迟，展示骨架屏
    setTimeout(() => {
      this.setData({
        allMaterials: semiconductorMaterials,
        filteredMaterials: semiconductorMaterials,
        loading: false
      });
    }, 300);
  },

  /**
   * 搜索输入
   */
  handleSearchInput(e) {
    const keyword = e.detail.value.trim();
    this.setData({ 
      searchKeyword: keyword,
      showSuggestions: keyword.length > 0  // 有输入时显示建议
    });
    this.filterMaterials();
  },

  /**
   * 搜索获得焦点
   */
  handleSearchFocus() {
    if (this.data.searchKeyword) {
      this.setData({ showSuggestions: true });
    }
  },

  /**
   * 搜索失去焦点
   */
  handleSearchBlur() {
    // 延迟隐藏，以便点击建议
    setTimeout(() => {
      this.setData({ showSuggestions: false });
    }, 200);
  },

  /**
   * 选择搜索建议
   */
  selectSuggestion(e) {
    const suggestion = e.currentTarget.dataset.suggestion;
    this.setData({ 
      searchKeyword: suggestion,
      showSuggestions: false
    });
    this.filterMaterials();
  },

  /**
   * 清除搜索
   */
  clearSearch() {
    this.setData({ 
      searchKeyword: '',
      searchSuggestions: [],
      showSuggestions: false
    });
    this.filterMaterials();
  },

  /**
   * 选择带隙范围
   */
  selectBandgapRange(e) {
    const label = e.currentTarget.dataset.label;
    this.setData({ selectedBandgapRange: label });
    this.filterMaterials();
  },

  /**
   * 快速选择材料
   */
  quickSelectMaterial(e) {
    const name = e.currentTarget.dataset.name;
    this.setData({ searchKeyword: name });
    this.filterMaterials();
  },

  /**
   * 筛选材料（增强版：支持拼音搜索和相关度排序）
   */
  filterMaterials() {
    const { searchKeyword, selectedBandgapRange, allMaterials, bandgapRanges } = this.data;
    
    let filtered = allMaterials;

    // 按带隙筛选
    if (selectedBandgapRange !== '全部') {
      const range = bandgapRanges.find(r => r.label === selectedBandgapRange);
      if (range) {
        filtered = filtered.filter(m => {
          const eg = m.bandGap.value;
          return eg >= range.min && eg < range.max;
        });
      }
    }

    // 按关键词搜索（增强版：支持拼音和模糊匹配）
    if (searchKeyword) {
      // 使用模糊匹配并计算相关度
      filtered = filtered.map(m => {
        let maxScore = 0;
        
        // 检查名称
        const nameScore = relevanceScore(m.name, searchKeyword);
        maxScore = Math.max(maxScore, nameScore);
        
        // 检查化学式
        const formulaScore = relevanceScore(m.formula, searchKeyword);
        maxScore = Math.max(maxScore, formulaScore);
        
        // 检查别名
        if (m.aliases) {
          for (let alias of m.aliases) {
            const aliasScore = relevanceScore(alias, searchKeyword);
            maxScore = Math.max(maxScore, aliasScore);
          }
        }
        
        return {
          ...m,
          _relevanceScore: maxScore
        };
      })
      .filter(m => m._relevanceScore > 0)  // 只保留有匹配的
      .sort((a, b) => b._relevanceScore - a._relevanceScore);  // 按相关度排序
      
      // 生成搜索建议（前5个匹配项的名称）
      const suggestions = filtered.slice(0, 5).map(m => m.name);
      this.setData({ searchSuggestions: suggestions });
    } else {
      this.setData({ searchSuggestions: [] });
    }

    this.setData({ filteredMaterials: filtered });
  },

  /**
   * 显示材料详情
   */
  showMaterialDetail(e) {
    const material = e.currentTarget.dataset.material;
    this.setData({ selectedMaterial: material });
  },

  /**
   * 关闭详情
   */
  closeDetail() {
    this.setData({ selectedMaterial: null });
  },

  /**
   * 阻止事件冒泡
   */
  preventClose() {
    // 阻止点击模态框内容时关闭
  },

  /**
   * 触摸开始
   */
  handleTouchStart(e) {
    this.setData({
      modalStartY: e.touches[0].clientY,
      modalOffsetY: e.touches[0].clientY
    });
  },

  /**
   * 触摸移动
   */
  handleTouchMove(e) {
    const moveY = e.touches[0].clientY;
    const deltaY = moveY - this.data.modalStartY;
    
    // 只允许向下滑动
    if (deltaY > 0) {
      this.setData({
        modalTranslate: deltaY,
        modalOffsetY: moveY
      });
    }
  },

  /**
   * 触摸结束
   */
  handleTouchEnd(e) {
    const deltaY = this.data.modalTranslate;
    
    // 如果下滑超过150rpx，关闭模态框
    if (deltaY > 150) {
      this.closeDetail();
    }
    
    // 重置位置
    this.setData({
      modalTranslate: 0,
      modalStartY: 0,
      modalOffsetY: 0
    });
  },

  /**
   * 复制材料信息
   */
  copyMaterialInfo() {
    const m = this.data.selectedMaterial;
    if (!m) return;

    const info = [
      `【${m.name} (${m.formula})】`,
      '',
      `带隙信息：`,
      `  Eg = ${m.bandGap.value} eV`,
      `  类型：${m.bandGap.type === 'direct' ? '直接带隙' : '间接带隙'}`,
      m.bandGap.temperature ? `  测试温度：${m.bandGap.temperature}` : '',
      '',
      `能带位置 (vs NHE, pH=0)：`,
      `  导带底 (CB)：${m.conductionBand} eV`,
      `  价带顶 (VB)：${m.valenceBand} eV`,
      '',
      `物理性质：`,
      m.crystalStructure ? `  晶体结构：${m.crystalStructure}` : '',
      m.electronMobility ? `  电子迁移率：${m.electronMobility}` : '',
      m.holeMobility ? `  空穴迁移率：${m.holeMobility}` : '',
      m.casNumber ? `  CAS号：${m.casNumber}` : '',
      m.molecularWeight ? `  分子量：${m.molecularWeight} g/mol` : '',
      '',
      m.applications ? `应用：${m.applications}` : ''
    ].filter(line => line !== '').join('\n');

    copyToClipboard(info, '材料信息已复制');
  },

  /**
   * 分享
   */
  onShareAppMessage() {
    return {
      title: '半导体数据库 - 材料化学科研工具箱',
      path: '/pages/materials/semiconductor/semiconductor'
    };
  }
});

