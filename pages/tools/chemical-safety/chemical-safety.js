/**
 * 化学品安全速查 - v6.4.0 全新重构
 * 功能：GHS化学品安全信息查询、筛选、分类
 */

const { searchChemical, getAllChemicals, CHEMICAL_SAFETY_DATA } = require('../../../utils/data/chemical-safety');

Page({
  data: {
    searchQuery: '',
    allChemicals: [],
    filteredChemicals: [],
    selectedChemical: null,
    showDetail: false,
    filterType: 'all',  // all, high, medium, low, acid, base, solvent, oxidizer
    selectedCategories: [],
    sortBy: 'name',     // name, danger
    // 学术组件数据
    hotChemicals: ['浓硫酸', '盐酸', '氢氧化钠', '乙醇', '丙酮', '二氯甲烷'],
    safetyFilters: [
      { label: '全部', value: 'all' },
      { label: '⚠️ 高危', value: 'high' },
      { label: '⚡ 中危', value: 'medium' },
      { label: '✓ 低危', value: 'low' }
    ],
    categoryFilters: [
      { label: '酸类', value: 'acid' },
      { label: '碱类', value: 'base' },
      { label: '溶剂', value: 'solvent' },
      { label: '氧化剂', value: 'oxidizer' }
    ]
  },

  onLoad() {
    this.loadChemicals();
  },

  /**
   * 加载所有化学品
   */
  loadChemicals() {
    const allChemicals = getAllChemicals();
    this.setData({
      allChemicals,
      filteredChemicals: allChemicals
    });
  },

  /**
   * 搜索输入处理
   */
  handleSearchInput(e) {
    const query = e.detail.value;
    this.setData({ searchQuery: query });
  },
  
  /**
   * 搜索触发
   */
  handleSearch(e) {
    this.performSearch(this.data.searchQuery);
  },
  
  /**
   * 筛选变化
   */
  handleFilterChange(e) {
    const filterType = e.detail.value || 'all';
    this.setData({ filterType });
    this.applyFilters();
  },
  
  /**
   * 类别筛选变化
   */
  handleCategoryFilterChange(e) {
    const categories = e.detail.value || [];
    this.setData({ selectedCategories: categories });
    this.applyFilters();
  },

  /**
   * 搜索确认
   */
  handleSearch() {
    this.performSearch(this.data.searchQuery);
  },

  /**
   * 执行搜索和筛选
   */
  performSearch(query) {
    let results = this.data.allChemicals;

    // 如果有搜索关键词
    if (query && query.trim()) {
      const searchResults = searchChemical(query);
      results = searchResults.map(c => ({
        name: c.name,
        nameEn: c.nameEn,
        cas: c.cas,
        formula: c.formula,
        hazardLevel: this.getHazardLevel(c.ghsHazards)
      }));
    }

    // 应用筛选
    results = this.applyFilter(results);

    // 应用排序
    results = this.applySort(results);

    this.setData({ filteredChemicals: results });
  },

  /**
   * 应用筛选条件
   */
  applyFilter(chemicals) {
    const { filterType } = this.data;

    if (filterType === 'all') return chemicals;

    // 按危险等级筛选
    if (['high', 'medium', 'low'].includes(filterType)) {
      return chemicals.filter(c => c.hazardLevel === filterType);
    }

    // 按化学品类别筛选
    return chemicals.filter(c => {
      const fullData = CHEMICAL_SAFETY_DATA.find(item => item.cas === c.cas);
      if (!fullData) return false;

      switch (filterType) {
        case 'acid':
          return c.name.includes('酸') || c.nameEn.toLowerCase().includes('acid');
        case 'base':
          return c.name.includes('碱') || c.name.includes('氢氧化') || 
                 c.nameEn.toLowerCase().includes('hydroxide') ||
                 c.name.includes('氨水');
        case 'solvent':
          return ['乙醇', '甲醇', '丙酮', 'DMF', 'DMSO', '四氢呋喃', '乙腈', 
                  '氯仿', '正己烷', '甲苯', '乙酸乙酯', '二氯甲烷'].includes(c.name);
        case 'oxidizer':
          return fullData.ghsHazards.some(h => h.startsWith('H27')) ||
                 c.name.includes('过氧') || c.name.includes('硝酸');
        default:
          return true;
      }
    });
  },

  /**
   * 应用排序
   */
  applySort(chemicals) {
    const { sortBy } = this.data;

    if (sortBy === 'name') {
      return chemicals.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
    }

    if (sortBy === 'danger') {
      const dangerOrder = { high: 3, medium: 2, low: 1 };
      return chemicals.sort((a, b) => {
        return dangerOrder[b.hazardLevel] - dangerOrder[a.hazardLevel];
      });
    }

    return chemicals;
  },

  /**
   * 切换筛选器
   */
  switchFilter(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({ filterType: type });
    this.performSearch(this.data.searchQuery);
  },

  /**
   * 切换排序方式
   */
  changeSort(e) {
    const sort = e.currentTarget.dataset.sort;
    this.setData({ sortBy: sort });
    this.performSearch(this.data.searchQuery);
  },

  /**
   * 清除搜索
   */
  clearSearch() {
    this.setData({ searchQuery: '' });
    this.performSearch('');
  },

  /**
   * 选择化学品查看详情
   */
  selectChemical(e) {
    const cas = e.currentTarget.dataset.cas;
    const chemical = CHEMICAL_SAFETY_DATA.find(c => c.cas === cas);
    
    if (chemical) {
      // 添加危险等级
      chemical.hazardLevel = this.getHazardLevel(chemical.ghsHazards);
      
      this.setData({
        selectedChemical: chemical,
        showDetail: true
      });
    }
  },

  /**
   * 关闭详情
   */
  closeDetail() {
    this.setData({
      showDetail: false,
      selectedChemical: null
    });
  },

  /**
   * 空函数（阻止冒泡）
   */
  doNothing() {
    // 阻止事件冒泡到背景层
  },

  /**
   * 获取危险等级
   */
  getHazardLevel(ghsHazards) {
    if (!ghsHazards || ghsHazards.length === 0) return 'low';
    
    // 高危标准：
    // H3xx 系列中 H300-H319（急性毒性、严重损伤）
    // H35x（致癌、致突变、生殖毒性）
    // H36x（生殖毒性、内分泌干扰）
    // H37x（靶器官毒性）
    const highDangerCodes = ghsHazards.some(h => {
      const code = parseInt(h.substring(1));
      return (
        (code >= 300 && code <= 319) ||  // 急性毒性、腐蚀
        (code >= 350 && code <= 362) ||  // 致癌、致突变、生殖毒性
        (code >= 370 && code <= 373) ||  // 靶器官毒性
        h === 'H271' || h === 'H272'     // 强氧化性
      );
    });
    
    if (highDangerCodes) return 'high';
    
    // 中危：其他H3xx代码或H2xx（物理危害）
    const mediumDangerCodes = ghsHazards.some(h => {
      const code = parseInt(h.substring(1));
      return (
        (code >= 320 && code <= 336) ||  // 其他健康危害
        (code >= 200 && code <= 290) ||  // 物理危害（爆炸、易燃）
        (code >= 400 && code <= 420)     // 环境危害
      );
    });
    
    if (mediumDangerCodes) return 'medium';
    
    return 'low';
  },

  /**
   * 导出安全信息
   */
  exportSafety() {
    const { selectedChemical } = this.data;
    
    if (!selectedChemical) {
      wx.showToast({
        title: '请先选择化学品',
        icon: 'none'
      });
      return;
    }

    const chem = selectedChemical;
    let text = `╔══════════════════════════════╗\n`;
    text += `  🧪 ${chem.name} 安全信息卡片\n`;
    text += `╚══════════════════════════════╝\n\n`;
    
    text += `【基本信息】\n`;
    text += `中文名：${chem.name}\n`;
    text += `英文名：${chem.nameEn}\n`;
    text += `CAS号：${chem.cas}\n`;
    text += `分子式：${chem.formula}\n\n`;
    
    text += `【⚠️ GHS危险性分类】\n`;
    text += `危险代码：${chem.ghsHazards.join(', ')}\n`;
    chem.hazardStatements.forEach((h, i) => {
      text += `${i + 1}. ${h}\n`;
    });
    text += `\n`;
    
    text += `【🛡️ 防护措施】\n`;
    chem.precautions.forEach((p, i) => {
      text += `${i + 1}. ${p}\n`;
    });
    text += `\n`;
    
    text += `【🚫 不相容物质】\n`;
    text += `${chem.incompatible.join('、')}\n\n`;
    
    text += `【📦 储存条件】\n`;
    text += `${chem.storage}\n\n`;
    
    text += `【🚑 急救措施】\n`;
    text += `👋 皮肤接触：${chem.firstAid.skin}\n`;
    text += `👁️ 眼睛接触：${chem.firstAid.eyes}\n`;
    text += `👃 吸入：${chem.firstAid.inhalation}\n`;
    text += `👄 食入：${chem.firstAid.ingestion}\n\n`;
    
    if (chem.notes) {
      text += `【💡 特别提示】\n`;
      text += `${chem.notes}\n\n`;
    }
    
    text += `──────────────────────────\n`;
    text += `数据来源：GHS化学品分类标准\n`;
    text += `导出时间：${new Date().toLocaleString('zh-CN')}\n`;
    text += `来自：材料化学科研工具箱 v6.4.0`;

    wx.setClipboardData({
      data: text,
      success: () => {
        wx.showToast({
          title: '已复制到剪贴板',
          icon: 'success',
          duration: 2000
        });
      },
      fail: () => {
        wx.showToast({
          title: '复制失败',
          icon: 'none'
        });
      }
    });
  },

  /**
   * 分享安全信息
   */
  shareSafety() {
    const { selectedChemical } = this.data;
    
    if (!selectedChemical) {
      wx.showToast({
        title: '请先选择化学品',
        icon: 'none'
      });
      return;
    }

    const chem = selectedChemical;
    
    // 创建简化版分享文本
    let shareText = `🧪 ${chem.name} (${chem.formula})\n\n`;
    shareText += `⚠️ 危险性：\n`;
    shareText += chem.hazardStatements.slice(0, 2).join('\n');
    shareText += `\n\n🛡️ 防护：${chem.precautions[0]}`;
    shareText += `\n\n🚫 避免接触：${chem.incompatible.slice(0, 3).join('、')}`;
    
    if (chem.notes) {
      shareText += `\n\n💡 ${chem.notes}`;
    }

    wx.setClipboardData({
      data: shareText,
      success: () => {
        wx.showModal({
          title: '已复制简要信息',
          content: '安全信息已复制到剪贴板，可分享给同事\n\n如需完整信息，请使用"导出"功能',
          showCancel: false,
          confirmText: '知道了'
        });
      }
    });
  }
});
