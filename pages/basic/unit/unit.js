/**
 * 单位换算页面
 * 重构版本，采用新架构和组件
 */

const { conversions } = require('../../../utils/conversions');
const { historyService } = require('../../../services/history');

Page({
  data: {
    categories: [],
    categoryIndex: 0,
    units: [],
    fromUnitIndex: 0,
    toUnitIndex: 1,
    inputValue: '',
    result: '',
    resultText: '',
    formula: '',
    hint: '',
    historyInput: '',
    validationError: ''
  },

  onLoad() {
    this.initCategories();
    this.updateUnits();
  },

  /**
   * 初始化类别列表
   */
  initCategories() {
    const categories = Object.keys(conversions);
    this.setData({ 
      categories,
      categoryIndex: 0
    });
  },

  /**
   * 更新当前类别的单位列表
   */
  updateUnits() {
    const category = this.data.categories[this.data.categoryIndex];
    const units = category ? Object.keys(conversions[category]) : [];
    const toIndex = units.length > 1 ? 1 : 0;
    
    this.setData({
      units,
      fromUnitIndex: 0,
      toUnitIndex: toIndex
    });
  },

  /**
   * 类别改变
   */
  handleCategoryChange(e) {
    const index = Number(e.detail.value);
    this.setData({ 
      categoryIndex: index,
      result: '',
      resultText: ''
    });
    this.updateUnits();
  },

  /**
   * 数值输入
   */
  handleValueInput(e) {
    this.setData({ 
      inputValue: e.detail.value 
    });
  },

  /**
   * 验证处理
   */
  handleValidate(e) {
    this.setData({
      validationError: e.detail.error || ''
    });
  },

  /**
   * 原始单位改变
   */
  handleFromUnitChange(e) {
    this.setData({ fromUnitIndex: Number(e.detail.value) });
  },

  /**
   * 目标单位改变
   */
  handleToUnitChange(e) {
    this.setData({ toUnitIndex: Number(e.detail.value) });
  },

  /**
   * 交换单位
   */
  swapUnits() {
    const { fromUnitIndex, toUnitIndex } = this.data;
    this.setData({
      fromUnitIndex: toUnitIndex,
      toUnitIndex: fromUnitIndex
    });
  },

  /**
   * 执行换算
   */
  convert() {
    const { categoryIndex, categories, inputValue, units, fromUnitIndex, toUnitIndex } = this.data;
    
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

    const category = categories[categoryIndex];
    const fromUnit = units[fromUnitIndex];
    const toUnit = units[toUnitIndex];

    if (!fromUnit || !toUnit) {
      wx.showToast({
        title: '请选择单位',
        icon: 'none'
      });
      return;
    }

    // 执行换算
    let result;
    let formula = '';
    
    if (category === '温度') {
      result = this.convertTemperature(value, fromUnit, toUnit);
      formula = this.getTemperatureFormula(fromUnit, toUnit);
    } else {
      const base = value * conversions[category][fromUnit];
      result = base / conversions[category][toUnit];
    }

    const precision = Math.abs(result) < 1 ? 6 : 4;
    const resultText = `${value} ${fromUnit} = ${result.toFixed(precision)} ${toUnit}`;
    
    this.setData({
      result: result.toFixed(precision),
      resultText,
      formula,
      hint: category === '温度' ? '温度换算使用专用公式' : `倍率：1 ${fromUnit} = ${(conversions[category][fromUnit] / conversions[category][toUnit]).toExponential(3)} ${toUnit}`,
      historyInput: `${value} ${fromUnit} → ${toUnit}`
    });

    // 添加到历史
    historyService.add({
      type: 'unit',
      title: `单位换算 - ${category}`,
      input: `${value} ${fromUnit}`,
      result: `${result.toFixed(precision)} ${toUnit}`
    });
  },

  /**
   * 温度换算
   */
  convertTemperature(value, fromUnit, toUnit) {
    const { conversions: conv } = require('../../../utils/conversions');
    const fromSymbol = conv['温度'][fromUnit];
    const toSymbol = conv['温度'][toUnit];
    
    let celsius;
    if (fromSymbol === 'C') {
      celsius = value;
    } else if (fromSymbol === 'F') {
      celsius = (value - 32) * (5 / 9);
    } else {
      celsius = value - 273.15;
    }

    if (toSymbol === 'C') return celsius;
    if (toSymbol === 'F') return celsius * (9 / 5) + 32;
    return celsius + 273.15;
  },

  /**
   * 获取温度换算公式
   */
  getTemperatureFormula(fromUnit, toUnit) {
    const formulas = {
      '摄氏度-华氏度': '°F = °C × 9/5 + 32',
      '华氏度-摄氏度': '°C = (°F - 32) × 5/9',
      '摄氏度-开尔文': 'K = °C + 273.15',
      '开尔文-摄氏度': '°C = K - 273.15',
      '华氏度-开尔文': 'K = (°F - 32) × 5/9 + 273.15',
      '开尔文-华氏度': '°F = (K - 273.15) × 9/5 + 32'
    };
    return formulas[`${fromUnit}-${toUnit}`] || '';
  },

  /**
   * 清空
   */
  reset() {
    this.setData({
      inputValue: '',
      result: '',
      resultText: '',
      formula: '',
      hint: '',
      fromUnitIndex: 0,
      toUnitIndex: this.data.units.length > 1 ? 1 : 0
    });
  },

  /**
   * 分享
   */
  onShareAppMessage() {
    return {
      title: '单位换算工具 - 材料化学科研工具箱',
      path: '/pages/basic/unit/unit'
    };
  }
});

