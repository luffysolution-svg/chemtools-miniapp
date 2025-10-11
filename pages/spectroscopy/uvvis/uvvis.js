/**
 * UV-Vis Beer-Lambert定律计算页面
 */

const { historyService } = require('../../../services/history');

Page({
  data: {
    modes: ['计算吸光度 A', '计算浓度 c', '计算摩尔吸光系数 ε'],
    modeIndex: 0,
    
    // 输入参数
    absorbance: '',
    epsilon: '',
    concentration: '',
    pathlength: '',
    
    // 结果
    result: '',
    resultText: '',
    hint: '',
    historyInput: ''
  },

  /**
   * 切换计算模式
   */
  handleModeChange(e) {
    const index = Number(e.detail.value);
    this.setData({ 
      modeIndex: index,
      result: '',
      resultText: ''
    });
  },

  /**
   * 输入处理
   */
  handleAbsorbanceInput(e) {
    this.setData({ absorbance: e.detail.value });
  },

  handleEpsilonInput(e) {
    this.setData({ epsilon: e.detail.value });
  },

  handleConcentrationInput(e) {
    this.setData({ concentration: e.detail.value });
  },

  handlePathlengthInput(e) {
    this.setData({ pathlength: e.detail.value });
  },

  /**
   * 执行计算
   */
  calculate() {
    const { modeIndex, absorbance, epsilon, concentration, pathlength } = this.data;

    if (modeIndex === 0) {
      // 模式1: 计算吸光度 A = ε × c × l
      if (!epsilon || !concentration || !pathlength) {
        wx.showToast({ title: '请输入所有参数', icon: 'none' });
        return;
      }

      const e = Number(epsilon);
      const c = Number(concentration);
      const l = Number(pathlength);

      if (isNaN(e) || isNaN(c) || isNaN(l) || e <= 0 || c <= 0 || l <= 0) {
        wx.showToast({ title: '请输入有效的正数', icon: 'none' });
        return;
      }

      const A = e * c * l;
      const result = `A = ${A.toFixed(4)}`;
      const resultText = `吸光度 A = ${A.toFixed(4)}\n\n计算参数：\nε = ${e} L·mol⁻¹·cm⁻¹\nc = ${c} mol·L⁻¹\nl = ${l} cm`;
      const hint = A > 2 ? '⚠️ 吸光度过高，可能超出线性范围' : A < 0.1 ? '💡 吸光度较低，误差可能较大' : '';

      this.setData({
        result,
        resultText,
        hint,
        historyInput: `ε=${e}, c=${c}, l=${l}`,
        absorbance: A.toFixed(4)
      });

      historyService.add({
        type: 'uvvis',
        title: 'Beer-Lambert - 计算吸光度',
        input: `ε=${e}, c=${c}, l=${l}`,
        result: `A=${A.toFixed(4)}`
      });

    } else if (modeIndex === 1) {
      // 模式2: 计算浓度 c = A / (ε × l)
      if (!absorbance || !epsilon || !pathlength) {
        wx.showToast({ title: '请输入所有参数', icon: 'none' });
        return;
      }

      const A = Number(absorbance);
      const e = Number(epsilon);
      const l = Number(pathlength);

      if (isNaN(A) || isNaN(e) || isNaN(l) || A < 0 || e <= 0 || l <= 0) {
        wx.showToast({ title: '请输入有效数值', icon: 'none' });
        return;
      }

      const c = A / (e * l);
      const result = `c = ${c.toExponential(4)} mol·L⁻¹`;
      const resultText = `浓度 c = ${c.toExponential(4)} mol·L⁻¹\n\n计算参数：\nA = ${A}\nε = ${e} L·mol⁻¹·cm⁻¹\nl = ${l} cm`;
      const hint = A > 2 ? '⚠️ 吸光度过高，结果可能不准确' : '';

      this.setData({
        result,
        resultText,
        hint,
        historyInput: `A=${A}, ε=${e}, l=${l}`,
        concentration: c.toExponential(4)
      });

      historyService.add({
        type: 'uvvis',
        title: 'Beer-Lambert - 计算浓度',
        input: `A=${A}, ε=${e}, l=${l}`,
        result: `c=${c.toExponential(4)} mol/L`
      });

    } else if (modeIndex === 2) {
      // 模式3: 计算摩尔吸光系数 ε = A / (c × l)
      if (!absorbance || !concentration || !pathlength) {
        wx.showToast({ title: '请输入所有参数', icon: 'none' });
        return;
      }

      const A = Number(absorbance);
      const c = Number(concentration);
      const l = Number(pathlength);

      if (isNaN(A) || isNaN(c) || isNaN(l) || A < 0 || c <= 0 || l <= 0) {
        wx.showToast({ title: '请输入有效数值', icon: 'none' });
        return;
      }

      const e = A / (c * l);
      const result = `ε = ${e.toFixed(2)} L·mol⁻¹·cm⁻¹`;
      const resultText = `摩尔吸光系数 ε = ${e.toFixed(2)} L·mol⁻¹·cm⁻¹\n\n计算参数：\nA = ${A}\nc = ${c} mol·L⁻¹\nl = ${l} cm`;
      const hint = '💡 ε值是物质在特定波长下的特征参数';

      this.setData({
        result,
        resultText,
        hint,
        historyInput: `A=${A}, c=${c}, l=${l}`,
        epsilon: e.toFixed(2)
      });

      historyService.add({
        type: 'uvvis',
        title: 'Beer-Lambert - 计算ε',
        input: `A=${A}, c=${c}, l=${l}`,
        result: `ε=${e.toFixed(2)} L·mol⁻¹·cm⁻¹`
      });
    }
  },

  /**
   * 清空
   */
  reset() {
    this.setData({
      absorbance: '',
      epsilon: '',
      concentration: '',
      pathlength: '',
      result: '',
      resultText: '',
      hint: '',
      historyInput: ''
    });
  },

  /**
   * 分享
   */
  onShareAppMessage() {
    return {
      title: 'Beer-Lambert定律计算 - 材料化学科研工具箱',
      path: '/pages/spectroscopy/uvvis/uvvis'
    };
  }
});

