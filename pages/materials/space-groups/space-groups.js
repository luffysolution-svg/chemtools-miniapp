/**
 * 空间群数据库查询页面（学术优化版）
 */

const {
  getByNumber,
  getBySymbol,
  getBySystem,
  search,
  getSystemStats,
  getAllSummary
} = require('../../../utils/data/space-groups/index');
const { historyService } = require('../../../services/history');

Page({
  data: {
    // 搜索
    searchValue: '',
    searchPlaceholder: '搜索空间群编号或符号...',
    
    // 晶系筛选
    crystalSystems: [
      { label: '三斜', value: 'triclinic', count: 0 },
      { label: '单斜', value: 'monoclinic', count: 0 },
      { label: '正交', value: 'orthorhombic', count: 0 },
      { label: '四方', value: 'tetragonal', count: 0 },
      { label: '三方', value: 'trigonal', count: 0 },
      { label: '六方', value: 'hexagonal', count: 0 },
      { label: '立方', value: 'cubic', count: 0 }
    ],
    selectedSystem: null,

    // 数据
    allSpaceGroups: [],
    displayList: [],
    
    // 当前选中的空间群
    selectedGroup: null,

    // 统计
    stats: null,
    totalCount: 230
  },

  onLoad() {
    // 加载统计数据
    const stats = getSystemStats();
    
    // 更新晶系计数
    const crystalSystems = this.data.crystalSystems.map(sys => ({
      ...sys,
      count: stats[sys.value] || 0
    }));
    
    // 加载所有空间群
    const allSpaceGroups = getAllSummary();
    
    this.setData({ 
      stats,
      crystalSystems,
      allSpaceGroups,
      displayList: allSpaceGroups
    });
  },

  /**
   * 搜索输入变化
   */
  onSearchInput(e) {
    const value = e.detail.value;
    this.setData({ searchValue: value });
    this.performSearch(value);
  },

  /**
   * 执行搜索
   */
  performSearch(keyword) {
    let results = [];
    
    if (!keyword || keyword.trim() === '') {
      // 如果有晶系筛选，只显示该晶系
      if (this.data.selectedSystem) {
        results = getBySystem(this.data.selectedSystem);
      } else {
        results = this.data.allSpaceGroups;
      }
    } else {
      // 尝试数字搜索
      const number = parseInt(keyword);
      if (!isNaN(number) && number >= 1 && number <= 230) {
        const result = getByNumber(number);
        if (result) {
          results = [result];
        }
      } else {
        // 符号搜索
        results = search(keyword);
        
        // 如果有晶系筛选，进一步过滤
        if (this.data.selectedSystem) {
          results = results.filter(r => r.system === this.data.selectedSystem);
        }
      }
    }
    
    this.setData({ displayList: results });
  },

  /**
   * 晶系筛选
   */
  onFilterSelect(e) {
    const system = e.detail.value;
    this.setData({ selectedSystem: system });
    
    // 重新搜索
    this.performSearch(this.data.searchValue);
  },

  /**
   * 清除筛选
   */
  onFilterClear() {
    this.setData({ selectedSystem: null });
    this.performSearch(this.data.searchValue);
  },

  /**
   * 选择空间群
   */
  selectSpaceGroup(e) {
    const number = e.currentTarget.dataset.number;
    const group = getByNumber(number);
    
    if (group) {
      this.setData({ selectedGroup: group });
      
      // 保存历史
      historyService.add({
        tool: '空间群查询',
        input: `No. ${group.number} ${group.symbol}`,
        result: `${this.getSystemName(group.system)}晶系`
      });
    }
  },

  /**
   * 关闭详情
   */
  closeDetail() {
    this.setData({ selectedGroup: null });
  },

  /**
   * 获取晶系中文名
   */
  getSystemName(system) {
    const names = {
      triclinic: '三斜',
      monoclinic: '单斜',
      orthorhombic: '正交',
      tetragonal: '四方',
      trigonal: '三方',
      hexagonal: '六方',
      cubic: '立方'
    };
    return names[system] || system;
  },

  /**
   * 复制空间群信息
   */
  copyInfo(e) {
    const { selectedGroup } = this.data;
    if (!selectedGroup) return;

    let text = `空间群 No. ${selectedGroup.number}\n`;
    text += `符号：${selectedGroup.symbol}\n`;
    if (selectedGroup.schoenflies) {
      text += `Schoenflies符号：${selectedGroup.schoenflies}\n`;
    }
    text += `晶系：${this.getSystemName(selectedGroup.system)}\n`;
    text += `Laue类：${selectedGroup.laueClass}\n`;
    text += `点群：${selectedGroup.pointGroup}\n`;

    wx.setClipboardData({
      data: text,
      success() {
        wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
      }
    });
  }
});

