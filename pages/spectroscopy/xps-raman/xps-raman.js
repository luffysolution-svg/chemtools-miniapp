/**
 * XPS/拉曼/IR谱学参考表页面
 * v2.0.0 - 集成扩充数据库
 */

const { copyToClipboard } = require('../../../services/export');
const { historyService } = require('../../../services/history');
const { generateShareCard } = require('../utils/shareHelper');

// 导入扩充数据库
const { XPS_DATA, searchByElement: searchXPSByElement } = require('../../../utils/data/xps-extended');
const { FTIR_DATA, searchByKeyword: searchFTIRByKeyword } = require('../../../utils/data/ftir-extended');
const { RAMAN_DATA, searchByMaterial: searchRamanByMaterial } = require('../../../utils/data/raman-extended');
const { SOLVENT_NMR_SHIFTS, FUNCTIONAL_GROUP_SHIFTS } = require('../../../utils/data/nmr-chemical-shifts');

// 物理常数
const SPEED_OF_LIGHT = 2.998e10; // cm/s
const PLANCK_CONSTANT = 6.626e-34; // J·s
const ELECTRON_VOLT = 1.602e-19; // J

Page({
  data: {
    loading: true,  // 新增loading状态
    // 谱学类型
    spectroTypes: [
      { id: 'xps', name: 'XPS', icon: '🔬' },
      { id: 'raman-ir', name: 'Raman/IR', icon: '🎵' },
      { id: 'nmr', name: 'NMR', icon: '🧲' },
      { id: 'converter', name: '频率转换', icon: '🔄' }
    ],
    currentType: 'xps',
    
    // NMR数据
    nmrSolvents: [],
    nmrSolventsFiltered: [],
    nmrFunctionalGroups: [],
    nmrFunctionalGroupsFiltered: [],
    nmrSearchKeyword: '',

    // XPS数据
    xpsData: [],
    xpsFiltered: [],
    xpsSearchKeyword: '',

    // 振动光谱数据
    vibrationData: [],
    vibrationFiltered: [],
    vibrationSearchKeyword: '',
    vibrationRegion: 'all',

    // 频率转换
    wavenumber: '',
    converterResult: '',
    converterResultText: '',
    converterHint: '',
    converterWavenumber: '',
    converterWavelength: '',
    converterFrequency: '',
    converterEnergy: ''
  },

  onLoad() {
    // 模拟数据加载
    wx.showLoading({ title: '加载中...', mask: true });
    
    setTimeout(() => {
      const xpsData = this.getXpsData();
      const vibrationData = this.getVibrationalData();
      const nmrSolvents = SOLVENT_NMR_SHIFTS;
      const nmrFunctionalGroups = FUNCTIONAL_GROUP_SHIFTS;
      
      this.setData({
        xpsData,
        xpsFiltered: xpsData,
        vibrationData,
        vibrationFiltered: vibrationData,
        nmrSolvents,
        nmrSolventsFiltered: nmrSolvents,
        nmrFunctionalGroups,
        nmrFunctionalGroupsFiltered: nmrFunctionalGroups,
        loading: false
      });
      wx.hideLoading();
    }, 500);
  },

  /**
   * 获取XPS数据
   */
  getXpsData() {
    // 使用扩充的XPS数据库
    return XPS_DATA.map(entry => ({
      element: entry.element,
      orbital: entry.orbital,
      be: entry.bindingEnergy,
      state: entry.state,
      compound: entry.compound,
      note: entry.notes
    }));
  },

  /**
   * 获取振动光谱数据（合并FTIR和Raman）
   */
  getVibrationalData() {
    // FTIR数据
    const ftirData = FTIR_DATA.map(entry => ({
      group: entry.functionalGroup,
      name: entry.name,
      wavenumber: entry.wavenumber,
      range: entry.range,
      type: 'FTIR',
      intensity: entry.intensity,
      note: entry.notes
    }));

    // Raman数据（展平为单个峰）
    const ramanData = [];
    RAMAN_DATA.forEach(material => {
      material.peaks.forEach(peak => {
        ramanData.push({
          group: material.material,
          name: material.name,
          wavenumber: peak.wavenumber,
          type: 'Raman',
          intensity: peak.intensity,
          assignment: peak.assignment,
          note: peak.notes
        });
      });
    });

    return [...ftirData, ...ramanData];
  },

  /**
   * 切换谱学类型
   */
  switchType(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({ currentType: type });
  },
  
  /**
   * NMR搜索
   */
  handleNmrSearch(e) {
    const keyword = e.detail.value;
    this.setData({ nmrSearchKeyword: keyword });
    this.filterNmr();
  },
  
  /**
   * 清除NMR搜索
   */
  clearNmrSearch() {
    this.setData({ nmrSearchKeyword: '' });
    this.filterNmr();
  },
  
  /**
   * 筛选NMR数据
   */
  filterNmr() {
    const { nmrSolvents, nmrFunctionalGroups, nmrSearchKeyword } = this.data;
    
    if (!nmrSearchKeyword) {
      this.setData({ 
        nmrSolventsFiltered: nmrSolvents,
        nmrFunctionalGroupsFiltered: nmrFunctionalGroups
      });
      return;
    }

    const keyword = nmrSearchKeyword.toLowerCase();
    
    const filteredSolvents = nmrSolvents.filter(item => 
      item.name.toLowerCase().includes(keyword) ||
      item.solvent.toLowerCase().includes(keyword) ||
      item.formula.toLowerCase().includes(keyword)
    );
    
    const filteredGroups = nmrFunctionalGroups.filter(item =>
      item.group.toLowerCase().includes(keyword) ||
      (item.examples && item.examples.toLowerCase().includes(keyword))
    );

    this.setData({ 
      nmrSolventsFiltered: filteredSolvents,
      nmrFunctionalGroupsFiltered: filteredGroups
    });
  },
  
  /**
   * 复制NMR溶剂数据
   */
  copyNmrSolvent(e) {
    const item = e.currentTarget.dataset.item;
    let text = `${item.name} (${item.formula})\n`;
    if (item.proton) {
      text += `¹H-NMR: δ ${item.proton.shift} ppm (${item.proton.multiplicity})\n`;
    }
    if (item.carbon) {
      text += `¹³C-NMR: δ ${item.carbon.shift} ppm (${item.carbon.multiplicity})\n`;
    }
    if (item.waterPeak) {
      text += `H₂O峰: δ ${item.waterPeak} ppm`;
    }
    
    copyToClipboard(text, '溶剂化学位移已复制');
  },

  /**
   * ========== XPS 功能 ==========
   */

  /**
   * XPS搜索
   */
  handleXpsSearch(e) {
    const keyword = e.detail.value.trim().toLowerCase();
    this.setData({ xpsSearchKeyword: keyword });
    this.filterXps();
  },

  /**
   * 清除XPS搜索
   */
  clearXpsSearch() {
    this.setData({ xpsSearchKeyword: '' });
    this.filterXps();
  },

  /**
   * 筛选XPS数据
   */
  filterXps() {
    const { xpsData, xpsSearchKeyword } = this.data;
    
    if (!xpsSearchKeyword) {
      this.setData({ xpsFiltered: xpsData });
      return;
    }

    const filtered = xpsData.filter(item => {
      const keyword = xpsSearchKeyword.toLowerCase();
      return (
        item.element.toLowerCase().includes(keyword) ||
        item.state.toLowerCase().includes(keyword) ||
        String(item.be).includes(keyword) ||
        item.note.toLowerCase().includes(keyword)
      );
    });

    this.setData({ xpsFiltered: filtered });
  },

  /**
   * 复制XPS数据
   */
  copyXpsData(e) {
    const item = e.currentTarget.dataset.item;
    const text = `${item.element} ${item.state}: ${item.be} eV (${item.note})`;
    
    // 添加到历史记录
    historyService.add({
      type: 'XPS谱学查询',
      title: `${item.element} ${item.state} XPS查询`,
      input: `${item.element} ${item.state}`,
      result: `结合能: ${item.be} eV`,
      metadata: {
        category: '谱学查询',
        spectroscopyType: 'XPS',
        element: item.element,
        state: item.state,
        bindingEnergy: item.be,
        note: item.note,
        unit: 'eV',
        dataSource: 'XPS数据库'
      }
    });
    
    copyToClipboard(text, 'XPS数据已复制');
  },

  /**
   * ========== 振动光谱功能 ==========
   */

  /**
   * 选择区域
   */
  selectRegion(e) {
    const region = e.currentTarget.dataset.region;
    this.setData({ vibrationRegion: region });
    this.filterVibration();
  },

  /**
   * 振动光谱搜索
   */
  handleVibrationSearch(e) {
    const keyword = e.detail.value.trim().toLowerCase();
    this.setData({ vibrationSearchKeyword: keyword });
    this.filterVibration();
  },

  /**
   * 清除振动光谱搜索
   */
  clearVibrationSearch() {
    this.setData({ vibrationSearchKeyword: '' });
    this.filterVibration();
  },

  /**
   * 筛选振动光谱数据
   */
  filterVibration() {
    const { vibrationData, vibrationSearchKeyword, vibrationRegion } = this.data;
    
    let filtered = vibrationData;

    // 按区域筛选
    if (vibrationRegion !== 'all') {
      filtered = filtered.filter(item => item.region === vibrationRegion);
    }

    // 按关键词搜索
    if (vibrationSearchKeyword) {
      const keyword = vibrationSearchKeyword.toLowerCase();
      filtered = filtered.filter(item => {
        return (
          item.mode.toLowerCase().includes(keyword) ||
          String(item.pos).includes(keyword) ||
          item.note.toLowerCase().includes(keyword)
        );
      });
    }

    this.setData({ vibrationFiltered: filtered });
  },

  /**
   * 复制振动光谱数据
   */
  copyVibrationData(e) {
    const item = e.currentTarget.dataset.item;
    const text = `${item.mode} (${item.region}): ${item.pos} ${item.unit}\n范围：${item.note}`;
    
    // 添加到历史记录
    historyService.add({
      type: 'Raman/IR谱学查询',
      title: `${item.mode}谱学查询`,
      input: item.mode,
      result: `${item.pos} ${item.unit} (${item.region})`,
      metadata: {
        category: '谱学查询',
        spectroscopyType: item.region === 'raman' ? 'Raman' : 'IR',
        mode: item.mode,
        position: item.pos,
        region: item.region,
        note: item.note,
        unit: item.unit,
        dataSource: 'Raman/IR谱学数据库'
      }
    });
    
    copyToClipboard(text, '峰位数据已复制');
  },

  /**
   * ========== 频率转换功能 ==========
   */

  /**
   * 波数输入
   */
  handleWavenumberInput(e) {
    this.setData({ wavenumber: e.detail.value });
  },

  /**
   * 转换波数
   */
  convertWavenumber() {
    const { wavenumber } = this.data;
    
    if (!wavenumber) {
      wx.showToast({ title: '请输入波数', icon: 'none' });
      return;
    }

    const wn = Number(wavenumber);
    if (isNaN(wn) || wn <= 0) {
      wx.showToast({ title: '请输入有效的波数值', icon: 'none' });
      return;
    }

    // 波数 (cm⁻¹) → 波长 (μm): λ = 10⁴ / ν̃
    const wavelength = 10000 / wn;

    // 波数 → 频率 (THz): ν = c × ν̃ / 10¹²
    const frequency = (SPEED_OF_LIGHT * wn) / 1e12;

    // 波数 → 能量 (eV): E = h × c × ν̃ / e
    const energy = (PLANCK_CONSTANT * SPEED_OF_LIGHT * wn) / ELECTRON_VOLT;

    const resultText = [
      `波数：${wn} cm⁻¹`,
      `波长：${wavelength.toFixed(4)} μm`,
      `频率：${frequency.toFixed(4)} THz`,
      `能量：${energy.toFixed(6)} eV`
    ].join('\n');

    this.setData({
      converterResult: resultText,
      converterResultText: resultText,
      converterHint: '根据光学公式计算',
      converterWavenumber: wn.toFixed(2),
      converterWavelength: wavelength.toFixed(4),
      converterFrequency: frequency.toFixed(4),
      converterEnergy: energy.toFixed(6)
    });
  },

  /**
   * 清空转换器
   */
  resetConverter() {
    this.setData({
      wavenumber: '',
      converterResult: '',
      converterResultText: '',
      converterHint: '',
      converterWavenumber: '',
      converterWavelength: '',
      converterFrequency: '',
      converterEnergy: ''
    });
  },

  /**
   * 生成分享卡片 (v6.0.0新增)
   */
  async generateCard() {
    const { currentType, converterResult, xpsFiltered, vibrationFiltered } = this.data;
    
    // 频率转换结果
    if (currentType === 'converter' && converterResult) {
      const { converterWavenumber, converterWavelength, converterFrequency, converterEnergy } = this.data;

      const inputs = {
        '输入波数': `${this.data.wavenumber} cm⁻¹`
      };

      const results = {
        '波数': converterWavenumber,
        '波长': converterWavelength,
        '频率': converterFrequency,
        '能量': converterEnergy
      };

      await generateShareCard('XPS/Raman光谱', 'xps-raman', inputs, results, '频率-波长-能量换算');
      return;
    }

    // XPS或Raman数据查询
    if (currentType === 'xps' && xpsFiltered.length > 0) {
      const firstData = xpsFiltered[0];
      const inputs = {
        '数据类型': 'XPS峰位数据',
        '查询结果': `${xpsFiltered.length}条`
      };

      const results = {
        '示例': `${firstData.element} - ${firstData.peak_name}`,
        '结合能': `${firstData.binding_energy} eV`
      };

      await generateShareCard('XPS/Raman光谱', 'xps-raman', inputs, results, `共找到${xpsFiltered.length}条XPS数据`);
      return;
    }

    if (currentType === 'raman-ir' && vibrationFiltered.length > 0) {
      const firstData = vibrationFiltered[0];
      const inputs = {
        '数据类型': 'Raman/IR峰位数据',
        '查询结果': `${vibrationFiltered.length}条`
      };

      const results = {
        '示例': firstData.group || '',
        '波数范围': `${firstData.wavenumber} cm⁻¹`
      };

      await generateShareCard('XPS/Raman光谱', 'xps-raman', inputs, results, `共找到${vibrationFiltered.length}条振动光谱数据`);
      return;
    }

    wx.showToast({
      title: '请先完成计算或查询',
      icon: 'none'
    });
  },

  /**
   * 分享
   */
  onShareAppMessage() {
    return {
      title: '谱学参考表 - 材料化学科研工具箱',
      path: '/pages/spectroscopy/xps-raman/xps-raman'
    };
  }
});

