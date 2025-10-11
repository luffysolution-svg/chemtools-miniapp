/**
 * Ksp/沉淀计算页面
 */

const { historyService } = require('../../../services/history');

Page({
  data: {
    cationConc: '',
    anionConc: '',
    kspValue: '',
    cationCharge: '2',
    anionCharge: '1',
    result: '',
    resultText: '',
    hint: ''
  },

  handleCationInput(e) {
    this.setData({ cationConc: e.detail.value });
  },

  handleAnionInput(e) {
    this.setData({ anionConc: e.detail.value });
  },

  handleKspInput(e) {
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

  onShareAppMessage() {
    return {
      title: 'Ksp/沉淀计算 - 材料化学科研工具箱',
      path: '/pages/advanced/ksp/ksp'
    };
  }
});

