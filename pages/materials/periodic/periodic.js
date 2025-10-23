/**
 * 元素周期表页面
 */

const { periodicElementsLite, getElementDetail } = require('./periodic-lite');
const { exportService } = require('../../../services/export');
const periodicExtended = require('./periodic-extended');
const { historyService } = require('../../../services/history');

Page({
  data: {
    loading: true,  // 新增loading状态
    searchKeyword: '',
    selectedCategory: 'all',
    // 热门元素
    hotElements: ['H', 'C', 'N', 'O', 'S', 'P', 'Cu', 'Au', 'Fe', 'Si'],
    // 学术风格筛选器数据
    categoryFilters: [
      { label: '全部', value: 'all' },
      { label: '金属', value: 'metal' },
      { label: '非金属', value: 'nonmetal' },
      { label: '过渡金属', value: 'transition' },
      { label: '稀土', value: 'rare-earth' },
      { label: '卤素', value: 'halogen' },
      { label: '惰性气体', value: 'noble-gas' }
    ],
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
      { label: '镧系', value: 'lanthanoid' },
      { label: '锕系', value: 'actinoid' }
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
      'lanthanoid': '镧系元素',
      'actinoid': '锕系元素'
    },
    allElements: [],
    filteredElements: [],
    selectedElement: null
  },

  onLoad() {
    // 使用轻量级数据快速加载
    this.setData({
      allElements: periodicElementsLite,
      filteredElements: periodicElementsLite,
      loading: false
    });
  },

  /**
   * 搜索输入
   */
  handleSearchInput(e) {
    const keyword = e.detail.value;
    this.setData({ searchKeyword: keyword });
  },
  
  /**
   * 搜索触发
   */
  handleSearch(e) {
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
   * 选择分类（新组件）
   */
  handleCategoryChange(e) {
    const category = e.detail.value || 'all';
    this.setData({ selectedCategory: category });
    this.filterElements();
  },
  
  /**
   * 选择类别（旧方法保留）
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
      // 处理复合类别筛选
      if (selectedCategory === 'metal') {
        // 金属包括：碱金属、碱土金属、过渡金属、后过渡金属、镧系、锕系
        filtered = filtered.filter(el => 
          ['alkali', 'alkaline', 'transition', 'post-transition', 'lanthanoid', 'actinoid'].includes(el.category)
        );
      } else if (selectedCategory === 'rare-earth') {
        // 稀土元素包括镧系
        filtered = filtered.filter(el => el.category === 'lanthanoid');
      } else {
        // 直接匹配category
        filtered = filtered.filter(el => el.category === selectedCategory);
      }
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
   * 显示元素详情（按需加载完整数据）
   */
  showElementDetail(e) {
    const liteElement = e.currentTarget.dataset.element;
    
    // 按需加载完整元素数据
    const fullElement = getElementDetail(liteElement.number);
    
    // 合并扩展数据
    const extendedData = periodicExtended.mergeElementData(fullElement, fullElement.number);
    
    // 格式化氧化态
    if (extendedData.oxidationStates) {
      extendedData.oxidationStatesText = periodicExtended.formatOxidationStates(extendedData.oxidationStates);
    }
    
    // 添加族周期区块名称
    if (extendedData.group) {
      extendedData.groupName = periodicExtended.getGroupName(extendedData.group);
      extendedData.periodName = periodicExtended.getPeriodName(extendedData.period);
      extendedData.blockName = periodicExtended.getBlockName(extendedData.block);
    }
    
    this.setData({ selectedElement: extendedData });
    
    // 添加到历史记录
    historyService.add({
      type: '元素查询',
      title: `${extendedData.name}(${extendedData.symbol})元素查询`,
      input: `${extendedData.symbol} - ${extendedData.name}`,
      result: `原子序数: ${extendedData.number}, 原子量: ${extendedData.atomicMass}, 族: ${extendedData.groupName || extendedData.group}`,
      metadata: {
        category: '材料查询',
        materialType: '元素',
        elementNumber: extendedData.number,
        symbol: extendedData.symbol,
        atomicMass: extendedData.atomicMass,
        category: this.data.categoryMap[extendedData.category] || extendedData.category,
        dataSource: '元素周期表数据库'
      }
    });
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
      ``,
      `▸ 基本信息`,
      `  原子序数：${el.number}`,
      `  元素符号：${el.symbol}`,
      `  相对原子质量：${el.atomicMass}`,
      `  元素类别：${this.data.categoryMap[el.category] || '—'}`,
      ``,
      `▸ 物理性质`,
      `  状态（常温）：${el.state || '—'}`,
      `  熔点：${el.meltingPoint ? el.meltingPoint + ' K' : '—'}`,
      `  沸点：${el.boilingPoint ? el.boilingPoint + ' K' : '—'}`,
      `  原子半径：${el.atomicRadius ? el.atomicRadius + ' pm' : '—'}`,
      el.density ? `  密度：${el.density} g/cm³` : null,
      ``,
      `▸ 化学性质`,
      `  电负性：${el.electronegativity || '—'}`,
      `  电离能：${el.ionizationEnergy ? el.ionizationEnergy + ' kJ/mol' : '—'}`,
      el.electronAffinity !== undefined ? `  电子亲和能：${el.electronAffinity || '—'} kJ/mol` : null,
      el.oxidationStatesText ? `  氧化态：${el.oxidationStatesText}` : null
    ];

    // 添加扩展数据
    if (el.hasExtendedData) {
      info.push('');
      info.push('▸ 扩展数据');
      
      if (el.electronConfig) {
        info.push(`  电子构型：${el.electronConfig}`);
      }
      if (el.groupName) {
        info.push(`  族：${el.groupName}`);
      }
      if (el.periodName) {
        info.push(`  周期：${el.periodName}`);
      }
      if (el.blockName) {
        info.push(`  区块：${el.blockName}`);
      }
      if (el.valenceElectrons) {
        info.push(`  价电子数：${el.valenceElectrons}`);
      }
      if (el.crystalStructure) {
        info.push(`  晶体结构：${el.crystalStructure}`);
      }
      if (el.magneticOrdering) {
        info.push(`  磁性：${el.magneticOrdering}`);
      }
      if (el.thermalConductivity) {
        info.push(`  热导率：${el.thermalConductivity} W/(m·K)`);
      }
      if (el.specificHeat) {
        info.push(`  比热容：${el.specificHeat} J/(mol·K)`);
      }
    }

    info.push('');
    info.push('来源：材料化学科研工具箱 v3.9.0');

    // 过滤掉 null 值并合并
    const finalInfo = info.filter(line => line !== null).join('\n');

    exportService.copyToClipboard(finalInfo, { successMessage: '元素信息已复制' });
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

