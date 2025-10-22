/**
 * Ksp/沉淀计算页面
 */

const { historyService } = require('../../../services/history');
const { generateShareCard } = require('../utils/shareHelper');
const { getPresets } = require('../../../utils/input-presets');

Page({
  data: {
    concentrationPresets: [],
    cationConc: '',
    anionConc: '',
    kspValue: '',
    cationCharge: '2',
    anionCharge: '1',
    result: '',
    resultText: '',
    hint: ''
  },
  
  onLoad() {
    this.setData({
      concentrationPresets: getPresets('ksp', 'concentration')
    });
  },

  handleCationInput(e) {
    this.setData({ cationConc: e.detail.value });
  },
  
  handleCationChange(e) {
    this.setData({ cationConc: e.detail.value });
  },

  handleAnionInput(e) {
    this.setData({ anionConc: e.detail.value });
  },
  
  handleAnionChange(e) {
    this.setData({ anionConc: e.detail.value });
  },

  handleKspInput(e) {
    this.setData({ kspValue: e.detail.value });
  },
  
  handleKspChange(e) {
    this.setData({ kspValue: e.detail.value });
  },

  handleCationChargeInput(e) {
    this.setData({ cationCharge: e.detail.value });
  },

  handleAnionChargeInput(e) {
    this.setData({ anionCharge: e.detail.value });
  },

  calculateKsp() {
    const { cationConc, anionConc, kspValue, cationCharge, anionCharge } = this.data;
    
    if (!cationConc || !anionConc || !kspValue) {
      wx.showToast({ title: '请输入所有必填参数', icon: 'none' });
      return;
    }

    const cC = Number(cationConc);
    const aC = Number(anionConc);
    const ksp = this.parseScientific(kspValue);
    const n = Number(cationCharge) || 1;
    const m = Number(anionCharge) || 1;

    if (isNaN(cC) || isNaN(aC) || isNaN(ksp) || cC <= 0 || aC <= 0 || ksp <= 0) {
      wx.showToast({ title: '请输入有效数值', icon: 'none' });
      return;
    }

    // 计算离子积 Q = [M]^n × [X]^m
    const Q = Math.pow(cC, n) * Math.pow(aC, m);
    const ratio = Q / ksp;

    let result, hint;
    if (ratio > 1.1) {
      result = '产生沉淀 ⚠️';
      hint = 'Q > Ksp，溶液过饱和，会产生沉淀';
    } else if (ratio > 0.9) {
      result = '饱和溶液 ⚖️';
      hint = 'Q ≈ Ksp，溶液处于饱和状态';
    } else {
      result = '不产生沉淀 ✓';
      hint = 'Q < Ksp，溶液未饱和，不会产生沉淀';
    }

    const resultText = `判断结果：${result}\n\n离子积 Q = ${Q.toExponential(3)}\n溶度积 Ksp = ${ksp.toExponential(3)}\nQ/Ksp = ${ratio.toFixed(2)}`;

    this.setData({ result, resultText, hint });

    historyService.add({
      type: 'ksp',
      title: 'Ksp沉淀判断',
      input: `[M]=${cC}, [X]=${aC}`,
      result: result
    });
  },

  parseScientific(str) {
    str = String(str).toLowerCase().replace(/×/g, 'e').replace(/\*/g, 'e');
    return Number(str);
  },

  reset() {
    this.setData({
      cationConc: '',
      anionConc: '',
      kspValue: '',
      result: '',
      resultText: '',
      hint: ''
    });
  },

  /**
   * 生成分享卡片 (v6.0.0新增)
   */
  async generateCard() {
    const { cationConc, anionConc, kspValue, cationCharge, anionCharge, result, hint } = this.data;
    
    if (!result) {
      wx.showToast({
        title: '请先完成计算',
        icon: 'none'
      });
      return;
    }

    const cC = Number(cationConc);
    const aC = Number(anionConc);
    const ksp = this.parseScientific(kspValue);
    const n = Number(cationCharge);
    const m = Number(anionCharge);
    const Q = Math.pow(cC, n) * Math.pow(aC, m);

    const inputs = {
      '阳离子浓度': `${cationConc} mol·L⁻¹`,
      '阴离子浓度': `${anionConc} mol·L⁻¹`,
      '溶度积Ksp': ksp.toExponential(2),
      '电荷': `M^${n}+ X^${m}-`
    };

    const results = {
      '沉淀判断': result,
      '离子积Q': Q.toExponential(3),
      'Q/Ksp比值': (Q / ksp).toFixed(2)
    };

    await generateShareCard('溶度积计算', 'ksp', inputs, results, hint);
  },

  onShareAppMessage() {
    return {
      title: 'Ksp/沉淀计算 - 材料化学科研工具箱',
      path: '/pages/advanced/ksp/ksp'
    };
  }
});

