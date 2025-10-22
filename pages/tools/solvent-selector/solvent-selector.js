/**
 * 溶剂选择助手
 */

const {
  searchSolvent,
  filterByPolarity,
  filterByBoilingPoint,
  filterBySafety,
  getAllSolvents,
  compareSolvents
} = require('../../../utils/data/solvents');

Page({
  data: {
    // 搜索
    searchQuery: '',
    allSolvents: [],
    filteredSolvents: [],

    // 筛选
    polarityRange: [0, 10],
    bpRange: [0, 200],
    safetyLevels: ['低危', '中危', '高危'],
    selectedSafety: null,

    // 对比
    selectedForCompare: [],
    compareResult: null,
    
    // 详情
    selectedSolvent: null,
    showDetail: false
  },

  onLoad() {
    const allSolvents = getAllSolvents();
    this.setData({
      allSolvents,
      filteredSolvents: allSolvents
    });
  },

  /**
   * 搜索溶剂
   */
  handleSearchInput(e) {
    const query = e.detail.value;
    this.setData({ searchQuery: query });

    if (!query.trim()) {
      this.setData({ filteredSolvents: this.data.allSolvents });
      return;
    }

    const results = searchSolvent(query);
    this.setData({ filteredSolvents: results });
  },

  /**
   * 按极性筛选
   */
  filterPolarity() {
    wx.showModal({
      title: '极性范围筛选',
      editable: true,
      placeholderText: '输入范围，如：3-7',
      success: (res) => {
        if (res.confirm && res.content) {
          const parts = res.content.split('-');
          if (parts.length === 2) {
            const results = filterByPolarity(
              parseFloat(parts[0]) || 0,
              parseFloat(parts[1]) || 10
            );
            this.setData({ filteredSolvents: results });
          }
        }
      }
    });
  },

  /**
   * 按沸点筛选
   */
  filterBP() {
    wx.showModal({
      title: '沸点范围筛选',
      editable: true,
      placeholderText: '输入范围(°C)，如：50-100',
      success: (res) => {
        if (res.confirm && res.content) {
          const parts = res.content.split('-');
          if (parts.length === 2) {
            const results = filterByBoilingPoint(
              parseFloat(parts[0]) || 0,
              parseFloat(parts[1]) || 200
            );
            this.setData({ filteredSolvents: results });
          }
        }
      }
    });
  },

  /**
   * 重置筛选
   */
  resetFilter() {
    this.setData({
      searchQuery: '',
      filteredSolvents: this.data.allSolvents
    });
  },

  /**
   * 查看溶剂详情
   */
  viewDetail(e) {
    const index = e.currentTarget.dataset.index;
    const solvent = this.data.filteredSolvents[index];
    
    this.setData({
      selectedSolvent: solvent,
      showDetail: true
    });
  },

  /**
   * 关闭详情
   */
  closeDetail() {
    this.setData({
      showDetail: false
    });
  },

  /**
   * 导出溶剂信息
   */
  exportSolvent() {
    const { selectedSolvent } = this.data;
    
    if (!selectedSolvent) return;

    const s = selectedSolvent;
    let text = `🧪 ${s.name} (${s.nameEn}) 溶剂信息\n\n`;
    text += `📋 基本信息：\n`;
    text += `• CAS号：${s.cas}\n`;
    text += `• 分子式：${s.formula}\n`;
    text += `• 极性指数：${s.polarity}\n`;
    text += `• 沸点：${s.boilingPoint} °C\n`;
    text += `• 密度：${s.density} g/mL\n`;
    text += `• 粘度：${s.viscosity} cP\n`;
    text += `• 介电常数：${s.dielectricConstant}\n`;
    text += `• 折射率：${s.refractiveIndex}\n`;
    text += `• UV截止：${s.uvCutoff} nm\n\n`;
    text += `⚠️ 安全等级：${s.safety === 'low' ? '低危' : s.safety === 'medium' ? '中危' : '高危'}\n`;
    text += `💨 挥发速率：${s.evaporationRate}\n\n`;
    text += `🔬 应用：${s.applications.join('、')}\n\n`;
    text += `💡 ${s.notes}`;

    wx.setClipboardData({
      data: text,
      success() {
        wx.showToast({
          title: '已复制到剪贴板',
          icon: 'success'
        });
      }
    });
  }
});

