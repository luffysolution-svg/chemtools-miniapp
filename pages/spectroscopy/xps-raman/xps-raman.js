/**
 * XPS/拉曼/IR谱学参考表页面
 */

const { listXps, listVibrational } = require('../spectroscopy');
const { copyToClipboard } = require('../../../services/export');

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
      { id: 'converter', name: '频率转换', icon: '🔄' }
    ],
    currentType: 'xps',

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
      const xpsData = listXps();
      const vibrationData = listVibrational();
      
      this.setData({
        xpsData,
        xpsFiltered: xpsData,
        vibrationData,
        vibrationFiltered: vibrationData,
        loading: false
      });
      wx.hideLoading();
    }, 500);
  },

  /**
   * 切换谱学类型
   */
  switchType(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({ currentType: type });
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
   * 分享
   */
  onShareAppMessage() {
    return {
      title: '谱学参考表 - 材料化学科研工具箱',
      path: '/pages/spectroscopy/xps-raman/xps-raman'
    };
  }
});

