/**
 * 半导体小工具页面
 */

const { historyService } = require('../../../services/history');
const { copyToClipboard } = require('../../../services/export');

Page({
  data: {
    // 工具选择
    tools: [
      { id: 'eg-lambda', name: 'Eg-λ转换', icon: '💡' },
      { id: 'minority', name: '少子近似', icon: '⚡' },
      { id: 'parameters', name: '常用参数', icon: '📋' }
    ],
    currentTool: 'eg-lambda',

    // Eg-λ转换
    egLambdaMode: 'eg-to-lambda',
    egValue: '',
    lambdaValue: '',
    egLambdaResult: '',
    egLambdaResultText: '',
    egLambdaHint: '',
    spectrumRegion: '',

    // 光谱区段参考
    spectrumBands: [
      { name: '紫外 (UV)', range: '10-400 nm', energy: '3.1-124 eV', class: 'uv' },
      { name: '可见光 (Vis)', range: '400-700 nm', energy: '1.77-3.1 eV', class: 'visible' },
      { name: '近红外 (NIR)', range: '700-2500 nm', energy: '0.5-1.77 eV', class: 'nir' },
      { name: '中红外 (MIR)', range: '2.5-25 μm', energy: '0.05-0.5 eV', class: 'mir' },
      { name: '远红外 (FIR)', range: '25-1000 μm', energy: '0.001-0.05 eV', class: 'fir' }
    ],

    // 少子近似
    semiconductorTypes: ['本征半导体', 'n型半导体', 'p型半导体'],
    semiconductorTypeIndex: 0,
    niValue: '',
    dopantValue: '',
    minorityResult: '',
    minorityResultText: '',
    minorityHint: '',
    minorityN: '',
    minorityP: '',
    majorityCarrier: '',
    minorityCarrier: '',

    // 常用参数
    commonSemiconductors: [
      { name: 'Si (硅)', eg: '1.12', ni: '1.5×10¹⁰', temp: '300K' },
      { name: 'Ge (锗)', eg: '0.66', ni: '2.4×10¹³', temp: '300K' },
      { name: 'GaAs (砷化镓)', eg: '1.42', ni: '2.1×10⁶', temp: '300K' },
      { name: 'GaN (氮化镓)', eg: '3.4', ni: '~10⁻¹⁰', temp: '300K' },
      { name: 'InP (磷化铟)', eg: '1.35', ni: '~10⁷', temp: '300K' },
      { name: 'SiC (碳化硅)', eg: '3.26', ni: '~10⁻⁸', temp: '300K' }
    ]
  },

  /**
   * 切换工具
   */
  switchTool(e) {
    const tool = e.currentTarget.dataset.tool;
    this.setData({ currentTool: tool });
  },

  /**
   * ========== Eg-λ 转换 ==========
   */

  /**
   * 切换转换模式
   */
  switchEgLambdaMode(e) {
    const mode = e.currentTarget.dataset.mode;
    this.setData({ 
      egLambdaMode: mode,
      egValue: '',
      lambdaValue: '',
      egLambdaResult: '',
      spectrumRegion: ''
    });
  },

  /**
   * Eg输入
   */
  handleEgInput(e) {
    this.setData({ egValue: e.detail.value });
  },

  /**
   * λ输入
   */
  handleLambdaInput(e) {
    this.setData({ lambdaValue: e.detail.value });
  },

  /**
   * 计算 Eg-λ 转换
   */
  calculateEgLambda() {
    const { egLambdaMode, egValue, lambdaValue } = this.data;
    
    if (egLambdaMode === 'eg-to-lambda') {
      // Eg → λ
      if (!egValue) {
        wx.showToast({ title: '请输入带隙值', icon: 'none' });
        return;
      }

      const eg = Number(egValue);
      if (isNaN(eg) || eg <= 0) {
        wx.showToast({ title: '请输入有效的带隙值', icon: 'none' });
        return;
      }

      // λ(nm) = 1240 / Eg(eV)
      const lambda = 1240 / eg;
      const spectrumRegion = this.getSpectrumRegion(lambda);

      this.setData({
        egLambdaResult: `λ = ${lambda.toFixed(2)} nm`,
        egLambdaResultText: `带隙 Eg = ${eg.toFixed(3)} eV\n对应波长 λ = ${lambda.toFixed(2)} nm\n光谱区域：${spectrumRegion}`,
        egLambdaHint: '根据 E(eV) = 1240/λ(nm) 计算',
        spectrumRegion,
        lambdaValue: lambda.toFixed(2)
      });

      historyService.add({
        type: 'semiconductor-extras',
        title: 'Eg→λ转换',
        input: `Eg = ${eg} eV`,
        result: `λ = ${lambda.toFixed(2)} nm (${spectrumRegion})`
      });

    } else {
      // λ → Eg
      if (!lambdaValue) {
        wx.showToast({ title: '请输入波长值', icon: 'none' });
        return;
      }

      const lambda = Number(lambdaValue);
      if (isNaN(lambda) || lambda <= 0) {
        wx.showToast({ title: '请输入有效的波长值', icon: 'none' });
        return;
      }

      // Eg(eV) = 1240 / λ(nm)
      const eg = 1240 / lambda;
      const spectrumRegion = this.getSpectrumRegion(lambda);

      this.setData({
        egLambdaResult: `Eg = ${eg.toFixed(3)} eV`,
        egLambdaResultText: `波长 λ = ${lambda.toFixed(2)} nm\n对应带隙 Eg = ${eg.toFixed(3)} eV\n光谱区域：${spectrumRegion}`,
        egLambdaHint: '根据 E(eV) = 1240/λ(nm) 计算',
        spectrumRegion,
        egValue: eg.toFixed(3)
      });

      historyService.add({
        type: 'semiconductor-extras',
        title: 'λ→Eg转换',
        input: `λ = ${lambda} nm`,
        result: `Eg = ${eg.toFixed(3)} eV (${spectrumRegion})`
      });
    }
  },

  /**
   * 清空 Eg-λ
   */
  resetEgLambda() {
    this.setData({
      egValue: '',
      lambdaValue: '',
      egLambdaResult: '',
      egLambdaResultText: '',
      egLambdaHint: '',
      spectrumRegion: ''
    });
  },

  /**
   * 获取光谱区域
   */
  getSpectrumRegion(lambda) {
    if (lambda < 400) return '紫外 (UV)';
    if (lambda < 700) return '可见光 (Visible)';
    if (lambda < 2500) return '近红外 (NIR)';
    if (lambda < 25000) return '中红外 (MIR)';
    return '远红外 (FIR)';
  },

  /**
   * ========== 少子近似计算 ==========
   */

  /**
   * 半导体类型改变
   */
  handleSemiconductorTypeChange(e) {
    const index = Number(e.detail.value);
    this.setData({ 
      semiconductorTypeIndex: index,
      dopantValue: '',
      minorityResult: ''
    });
  },

  /**
   * nᵢ输入
   */
  handleNiInput(e) {
    this.setData({ niValue: e.detail.value });
  },

  /**
   * 掺杂浓度输入
   */
  handleDopantInput(e) {
    this.setData({ dopantValue: e.detail.value });
  },

  /**
   * 计算少子浓度
   */
  calculateMinority() {
    const { semiconductorTypeIndex, niValue, dopantValue } = this.data;

    if (!niValue) {
      wx.showToast({ title: '请输入本征载流子浓度', icon: 'none' });
      return;
    }

    // 解析科学计数法
    let ni = this.parseScientific(niValue);
    if (isNaN(ni) || ni <= 0) {
      wx.showToast({ title: '请输入有效的 nᵢ 值', icon: 'none' });
      return;
    }

    let n, p, resultText, hint, majorityCarrier, minorityCarrier;

    if (semiconductorTypeIndex === 0) {
      // 本征半导体
      n = ni;
      p = ni;
      resultText = `本征半导体\nn = p = ${this.formatScientific(ni)} cm⁻³`;
      hint = '本征半导体中电子和空穴浓度相等';
      majorityCarrier = '无（n = p）';
      minorityCarrier = '无（n = p）';

    } else {
      // 掺杂半导体
      if (!dopantValue) {
        wx.showToast({ title: '请输入掺杂浓度', icon: 'none' });
        return;
      }

      let dopant = this.parseScientific(dopantValue);
      if (isNaN(dopant) || dopant <= 0) {
        wx.showToast({ title: '请输入有效的掺杂浓度', icon: 'none' });
        return;
      }

      const ni2 = ni * ni;

      if (semiconductorTypeIndex === 1) {
        // n型半导体
        n = dopant;
        p = ni2 / dopant;
        resultText = `n型半导体\nn (电子) ≈ ${this.formatScientific(n)} cm⁻³\np (空穴) ≈ ${this.formatScientific(p)} cm⁻³`;
        hint = '假设 Nd >> nᵢ，使用质量作用定律 n×p = nᵢ²';
        majorityCarrier = `电子 (${this.formatScientific(n)} cm⁻³)`;
        minorityCarrier = `空穴 (${this.formatScientific(p)} cm⁻³)`;
      } else {
        // p型半导体
        p = dopant;
        n = ni2 / dopant;
        resultText = `p型半导体\np (空穴) ≈ ${this.formatScientific(p)} cm⁻³\nn (电子) ≈ ${this.formatScientific(n)} cm⁻³`;
        hint = '假设 Na >> nᵢ，使用质量作用定律 n×p = nᵢ²';
        majorityCarrier = `空穴 (${this.formatScientific(p)} cm⁻³)`;
        minorityCarrier = `电子 (${this.formatScientific(n)} cm⁻³)`;
      }
    }

    this.setData({
      minorityResult: resultText,
      minorityResultText: resultText,
      minorityHint: hint,
      minorityN: this.formatScientific(n) + ' cm⁻³',
      minorityP: this.formatScientific(p) + ' cm⁻³',
      majorityCarrier,
      minorityCarrier
    });

    historyService.add({
      type: 'semiconductor-extras',
      title: '少子近似计算',
      input: `${this.data.semiconductorTypes[semiconductorTypeIndex]}, nᵢ=${niValue}`,
      result: resultText
    });
  },

  /**
   * 清空少子计算
   */
  resetMinority() {
    this.setData({
      niValue: '',
      dopantValue: '',
      minorityResult: '',
      minorityResultText: '',
      minorityHint: '',
      minorityN: '',
      minorityP: '',
      majorityCarrier: '',
      minorityCarrier: ''
    });
  },

  /**
   * 解析科学计数法
   */
  parseScientific(str) {
    str = String(str).toLowerCase().trim();
    // 支持 1.5e10, 1.5×10¹⁰, 1.5*10^10 等格式
    str = str.replace(/×/g, 'e').replace(/\*/g, 'e').replace(/\^/g, '');
    // 将上标数字转换为普通数字
    const superscriptMap = {
      '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4',
      '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9',
      '⁻': '-'
    };
    str = str.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]/g, ch => superscriptMap[ch] || ch);
    return Number(str);
  },

  /**
   * 格式化科学计数法
   */
  formatScientific(num) {
    if (num === 0) return '0';
    const exponent = Math.floor(Math.log10(Math.abs(num)));
    const mantissa = num / Math.pow(10, exponent);
    
    if (Math.abs(exponent) < 3) {
      return num.toFixed(2);
    }
    
    return `${mantissa.toFixed(2)}×10${this.toSuperscript(exponent)}`;
  },

  /**
   * 转换为上标
   */
  toSuperscript(num) {
    const map = {
      '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
      '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
      '-': '⁻'
    };
    return String(num).split('').map(ch => map[ch] || ch).join('');
  },

  /**
   * 分享
   */
  onShareAppMessage() {
    return {
      title: '半导体小工具 - 材料化学科研工具箱',
      path: '/pages/materials/semiconductor-extras/semiconductor-extras'
    };
  }
});

