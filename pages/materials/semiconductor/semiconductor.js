/**
 * 半导体数据库页面 - v8.0.0 扩充至150种
 */

const { semiconductorMaterials } = require('../../../utils/semiconductors');
const { PEROVSKITE_MATERIALS, TWO_D_MATERIALS, QUANTUM_DOT_MATERIALS } = require('../../../utils/data/semiconductors-extended');
const { fuzzyMatch, relevanceScore } = require('../pinyin');
const { copyToClipboard } = require('../../../services/export');
const { historyService } = require('../../../services/history');
const { cacheManager } = require('../../../utils/cache-manager');

Page({
  data: {
    searchKeyword: '',
    selectedBandgapRange: '全部',
    // 学术组件数据
    hotMaterials: ['Si', 'GaN', 'TiO2', 'MAPbI3', 'MoS2', 'CdSe', 'GaAs'],
    categoryFilterOptions: [
      { label: '全部', value: '全部' },
      { label: '传统半导体', value: '传统半导体' },
      { label: '钙钛矿', value: '钙钛矿' },
      { label: '2D材料', value: '2D材料' },
      { label: '量子点', value: '量子点' }
    ],
    bandgapFilterOptions: [
      { label: '全部', value: '全部' },
      { label: '< 1 eV', value: '< 1 eV' },
      { label: '1-2 eV', value: '1-2 eV' },
      { label: '2-3 eV', value: '2-3 eV' },
      { label: '> 3 eV', value: '> 3 eV' }
    ],
    bandgapRanges: [
      { label: '全部', min: 0, max: 999 },
      { label: '< 1 eV', min: 0, max: 1 },
      { label: '1-2 eV', min: 1, max: 2 },
      { label: '2-3 eV', min: 2, max: 3 },
      { label: '> 3 eV', min: 3, max: 999 }
    ],
    categoryFilter: '全部',
    categories: ['全部', '传统半导体', '钙钛矿', '2D材料', '量子点'],
    quickSelectMaterials: ['二氧化钛', '氧化锌', '砷化镓', '硅', '氮化镓', 'MAPbI3', 'MoS2', 'CdSe'],
    allMaterials: [],
    filteredMaterials: [],
    selectedMaterial: null,
    loading: true,
    totalCount: 0,
    newCount: 0,
    // 手势相关
    modalStartY: 0,
    modalOffsetY: 0,
    modalTranslate: 0
  },

  onLoad() {
    this.loadAllMaterials();
  },

  /**
   * 统一bandGap数据结构
   */
  normalizeBandGap(bandgap) {
    if (typeof bandgap === 'object' && bandgap !== null && 'value' in bandgap) {
      // 已经是正确的对象结构
      return bandgap;
    }
    
    // 转换为统一结构
    let value = null;
    if (typeof bandgap === 'number') {
      value = bandgap;
    } else if (typeof bandgap === 'string') {
      // 处理字符串，如 "2.5-3.0"
      const match = bandgap.match(/[\d.]+/);
      value = match ? parseFloat(match[0]) : null;
    }
    
    return {
      value: value,
      type: 'direct', // 默认类型
      temperature: '300 K'
    };
  },

  /**
   * 加载所有材料 - v8.0.0 合并150种材料（去重）
   */
  loadAllMaterials() {
    // 合并所有半导体数据
    const traditionalMaterials = semiconductorMaterials.map(m => ({
      ...m,
      category: m.type || '传统半导体',
      isNew: false,
      bandGap: this.normalizeBandGap(m.bandGap)
    }));
    
    const perovskiteMaterials = PEROVSKITE_MATERIALS.map(m => ({
      ...m,
      category: '钙钛矿',
      isNew: true,
      bandGap: this.normalizeBandGap(m.bandgap),
      conductionBand: m.cb || m.conductionBand,
      valenceBand: m.vb || m.valenceBand,
      absorptionEdge: m.absorptionEdge || (m.bandgap ? Math.round(1240 / parseFloat(m.bandgap)) : null)
    }));
    
    const twoDMaterials = TWO_D_MATERIALS.map(m => ({
      ...m,
      category: '2D材料',
      isNew: true,
      bandGap: this.normalizeBandGap(m.bandgap),
      conductionBand: m.cb || m.conductionBand,
      valenceBand: m.vb || m.valenceBand,
      absorptionEdge: m.absorptionEdge || (m.bandgap ? Math.round(1240 / parseFloat(m.bandgap)) : null)
    }));
    
    const quantumDotMaterials = QUANTUM_DOT_MATERIALS.map(m => ({
      ...m,
      category: '量子点',
      isNew: true,
      bandGap: this.normalizeBandGap(m.bandgap),
      conductionBand: m.cb || m.conductionBand,
      valenceBand: m.vb || m.valenceBand,
      absorptionEdge: m.emissionRange ? parseInt(m.emissionRange.split('-')[0]) : null
    }));
    
    // 合并并去重（按name或formula）
    const allMaterialsArray = [
      ...traditionalMaterials,
      ...perovskiteMaterials,
      ...twoDMaterials,
      ...quantumDotMaterials
    ];
    
    // 去重：使用Map按多个字段综合判断
    const uniqueMap = new Map();
    allMaterialsArray.forEach(material => {
      // 使用多个字段组合作为唯一标识
      const key = `${material.name || ''}_${material.formula || ''}_${material.nameEn || ''}`.toLowerCase();
      
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, material);
      } else {
        // 如果有重复，保留数据更完整的那个（新数据优先）
        const existing = uniqueMap.get(key);
        if (material.isNew && !existing.isNew) {
          uniqueMap.set(key, material);
        }
      }
    });
    
    const allMaterials = Array.from(uniqueMap.values());
    const newCount = perovskiteMaterials.length + twoDMaterials.length + quantumDotMaterials.length;
    
    // 数据加载完成：${allMaterials.length}种材料
    
    this.setData({
      allMaterials,
      filteredMaterials: allMaterials.slice(0, 30),
      totalCount: allMaterials.length,
      newCount,
      loading: false
    });
    
    // 延迟加载完整列表并应用初始筛选
    setTimeout(() => {
      this.filterMaterials();
    }, 500);
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
   * 搜索触发（新增）
   */
  handleSearch(e) {
    this.filterMaterials();
  },
  
  /**
   * 分类筛选变化（新增）
   */
  handleCategoryFilterChange(e) {
    const category = e.detail.value || '全部';
    this.setData({ categoryFilter: category });
    this.filterMaterials();
  },
  
  /**
   * 带隙筛选变化（新增）
   */
  handleBandgapFilterChange(e) {
    const range = e.detail.value || '全部';
    this.setData({ selectedBandgapRange: range });
    this.filterMaterials();
  },
  
  /**
   * 清除类别筛选
   */
  clearCategoryFilter() {
    this.setData({ categoryFilter: '全部' });
    this.filterMaterials();
  },
  
  /**
   * 清除带隙筛选
   */
  clearBandgapFilter() {
    this.setData({ selectedBandgapRange: '全部' });
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
    const { searchKeyword, selectedBandgapRange, categoryFilter, allMaterials, bandgapRanges } = this.data;
    
    let filtered = allMaterials;

    // 按材料类别筛选
    if (categoryFilter && categoryFilter !== '全部') {
      filtered = filtered.filter(m => {
        const match = m.category === categoryFilter;
        return match;
      });
    }

    // 按带隙筛选
    if (selectedBandgapRange !== '全部') {
      const range = bandgapRanges.find(r => r.label === selectedBandgapRange);
      if (range) {
        filtered = filtered.filter(m => {
          // 使用可选链避免访问undefined
          const eg = m.bandGap?.value ?? (typeof m.bandGap === 'number' ? m.bandGap : null);
          return eg !== null && eg !== undefined && eg >= range.min && eg < range.max;
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
    
    // 添加到历史记录
    historyService.add({
      type: '半导体材料查询',
      title: `${material.name}材料查询`,
      input: material.name,
      result: `带隙: ${material.bandgap} eV, VB: ${material.vb} eV, CB: ${material.cb} eV`,
      metadata: {
        category: '材料查询',
        materialType: '半导体',
        bandgap: material.bandgap,
        vb: material.vb,
        cb: material.cb,
        unit: 'eV',
        dataSource: material.ref || '材料数据库'
      }
    });
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

    // 安全获取bandGap值
    const bandGapValue = m.bandGap?.value ?? m.bandgap ?? 'N/A';
    const bandGapType = m.bandGap?.type || 'direct';
    const bandGapTemp = m.bandGap?.temperature || '300 K';

    const info = [
      `【${m.name} (${m.formula})】`,
      '',
      `带隙信息：`,
      `  Eg = ${bandGapValue} eV`,
      `  类型：${bandGapType === 'direct' ? '直接带隙' : '间接带隙'}`,
      bandGapTemp ? `  测试温度：${bandGapTemp}` : '',
      '',
      `能带位置 (vs NHE, pH=0)：`,
      `  导带底 (CB)：${m.conductionBand || m.cb || 'N/A'} eV`,
      `  价带顶 (VB)：${m.valenceBand || m.vb || 'N/A'} eV`,
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

