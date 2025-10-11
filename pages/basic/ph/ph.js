/**
 * pH值计算页面
 */

const { historyService } = require('../../../services/history');

Page({
  data: {
    typeOptions: ['强酸 (已知 [H⁺])', '强碱 (已知 [OH⁻])', '由 pH 反推 [H⁺]'],
    typeIndex: 0,
    inputValue: '',
    inputLabel: '氢离子浓度 (mol·L⁻¹)',
    placeholder: '例如：0.01',
    inputHint: '请输入大于0的数值',
    result: '',
    resultText: '',
    detail: '',
    hint: '',
    historyInput: '',
    validationError: ''
  },

  onLoad() {
    this.updateInputLabel();
  },

  /**
   * 更新输入标签
   */
  updateInputLabel() {
    const { typeIndex } = this.data;
    let label, placeholder, hint;

    switch (typeIndex) {
      case 0:
        label = '氢离子浓度 (mol·L⁻¹)';
        placeholder = '例如：0.01';
        hint = '请输入 [H⁺] 浓度';
        break;
      case 1:
        label = '氢氧根离子浓度 (mol·L⁻¹)';
        placeholder = '例如：0.01';
        hint = '请输入 [OH⁻] 浓度';
        break;
      case 2:
        label = 'pH 值';
        placeholder = '例如：7';
        hint = 'pH 范围建议 0-14';
        break;
    }

    this.setData({ 
      inputLabel: label, 
      placeholder,
      inputHint: hint
    });
  },

  /**
   * 类型改变
   */
  handleTypeChange(e) {
    const index = Number(e.detail.value);
    this.setData({ 
      typeIndex: index,
      result: '',
      resultText: '',
      inputValue: ''
    });
    this.updateInputLabel();
  },

  /**
   * 数值输入
   */
  handleValueInput(e) {
    this.setData({ inputValue: e.detail.value });
  },

  /**
   * 验证处理
   */
  handleValidate(e) {
    this.setData({ validationError: e.detail.error || '' });
  },

  /**
   * 执行计算
   */
  calculate() {
    const { typeIndex, inputValue } = this.data;

    // 验证输入
    if (!inputValue) {
      wx.showToast({
        title: '请输入数值',
        icon: 'none'
      });
      return;
    }

    const value = Number(inputValue);
    if (isNaN(value)) {
      wx.showToast({
        title: '请输入有效数字',
        icon: 'none'
      });
      return;
    }

    let result, detail, resultText, historyInput;

    switch (typeIndex) {
      case 0: // 强酸
        if (value <= 0) {
          wx.showToast({
            title: '浓度需大于 0',
            icon: 'none'
          });
          return;
        }
        const pH_acid = -Math.log10(value);
        const pOH_acid = 14 - pH_acid;
        result = `pH = ${pH_acid.toFixed(3)}`;
        detail = `pOH = ${pOH_acid.toFixed(3)}`;
        resultText = `[H⁺] = ${value} mol·L⁻¹\npH = ${pH_acid.toFixed(3)}\npOH = ${pOH_acid.toFixed(3)}`;
        historyInput = `[H⁺] = ${value} mol·L⁻¹`;
        break;

      case 1: // 强碱
        if (value <= 0) {
          wx.showToast({
            title: '浓度需大于 0',
            icon: 'none'
          });
          return;
        }
        const pOH_base = -Math.log10(value);
        const pH_base = 14 - pOH_base;
        result = `pH = ${pH_base.toFixed(3)}`;
        detail = `pOH = ${pOH_base.toFixed(3)}`;
        resultText = `[OH⁻] = ${value} mol·L⁻¹\npH = ${pH_base.toFixed(3)}\npOH = ${pOH_base.toFixed(3)}`;
        historyInput = `[OH⁻] = ${value} mol·L⁻¹`;
        break;

      case 2: // 反推浓度
        if (value < 0 || value > 14) {
          this.setData({
            hint: '⚠️ pH 范围通常在 0-14，超出范围结果仅供参考'
          });
        } else {
          this.setData({ hint: '' });
        }
        const concentration = Math.pow(10, -value);
        result = `[H⁺] = ${concentration.toExponential(3)} mol·L⁻¹`;
        detail = `pH = ${value.toFixed(3)}`;
        resultText = `pH = ${value.toFixed(3)}\n[H⁺] = ${concentration.toExponential(3)} mol·L⁻¹`;
        historyInput = `pH = ${value}`;
        break;
    }

    this.setData({
      result,
      detail,
      resultText,
      historyInput
    });

    // 添加到历史
    historyService.add({
      type: 'ph',
      title: `pH计算 - ${this.data.typeOptions[typeIndex]}`,
      input: historyInput,
      result: result
    });
  },

  /**
   * 清空
   */
  reset() {
    this.setData({
      inputValue: '',
      result: '',
      resultText: '',
      detail: '',
      hint: ''
    });
  },

  /**
   * 分享
   */
  onShareAppMessage() {
    return {
      title: 'pH计算工具 - 材料化学科研工具箱',
      path: '/pages/basic/ph/ph'
    };
  }
});

