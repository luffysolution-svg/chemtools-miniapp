/**
 * 误差传递计算器页面
 * 包含：加减法、乘除法、幂函数、对数、三角函数
 */

const {
  calculateAddSubtractError,
  calculateMultiplyDivideError,
  calculatePowerError,
  calculateLogError,
  calculateTrigError
} = require('../../../utils/error-propagation');
const { historyService } = require('../../../services/history');

Page({
  data: {
    // 工具选择
    tools: [
      { id: 'add-subtract', name: '加减法', icon: '➕' },
      { id: 'multiply-divide', name: '乘除法', icon: '✖️' },
      { id: 'power', name: '幂函数', icon: '🔢' },
      { id: 'logarithm', name: '对数', icon: '📊' },
      { id: 'trigonometry', name: '三角函数', icon: '📐' }
    ],
    currentTool: 'add-subtract',

    // 加减法
    addSubOperation: 'add',
    addSubVariableCount: 2,
    addSubValues: ['', ''],
    addSubErrors: ['', ''],
    addSubResult: null,
    addSubResultText: '',

    // 乘除法
    multiDivOperation: 'multiply',
    multiDivVariableCount: 2,
    multiDivValues: ['', ''],
    multiDivErrors: ['', ''],
    multiDivResult: null,
    multiDivResultText: '',

    // 幂函数
    powerValue: '',
    powerError: '',
    powerExponent: '',
    powerResult: null,
    powerResultText: '',

    // 对数
    logValue: '',
    logError: '',
    logBase: 'e',
    logCustomBase: '',
    logResult: null,
    logResultText: '',

    // 三角函数
    trigValue: '',
    trigError: '',
    trigFunction: 'sin',
    trigUnit: 'radian',
    trigResult: null,
    trigResultText: ''
  },

  /**
   * 切换工具
   */
  switchTool(e) {
    const tool = e.currentTarget.dataset.tool;
    this.setData({ currentTool: tool });
  },

  /**
   * ========== 加减法误差传递 ==========
   */

  // 切换加减运算
  switchAddSubOperation(e) {
    const operation = e.currentTarget.dataset.op;
    this.setData({ addSubOperation: operation });
  },

  // 变量数量选择
  onAddSubVariableCountChange(e) {
    const count = parseInt(e.detail.value);
    const values = [...this.data.addSubValues];
    const errors = [...this.data.addSubErrors];
    
    // 调整数组长度
    while (values.length < count) {
      values.push('');
      errors.push('');
    }
    values.length = count;
    errors.length = count;
    
    this.setData({
      addSubVariableCount: count,
      addSubValues: values,
      addSubErrors: errors
    });
  },

  // 输入变量值
  handleAddSubValueInput(e) {
    const index = e.currentTarget.dataset.index;
    const values = [...this.data.addSubValues];
    values[index] = e.detail.value;
    this.setData({ addSubValues: values });
  },

  // 输入误差值
  handleAddSubErrorInput(e) {
    const index = e.currentTarget.dataset.index;
    const errors = [...this.data.addSubErrors];
    errors[index] = e.detail.value;
    this.setData({ addSubErrors: errors });
  },

  // 计算加减法误差
  calculateAddSubtract() {
    const { addSubValues, addSubErrors, addSubOperation } = this.data;
    
    // 转换为数字
    const values = addSubValues.map(v => parseFloat(v));
    const errors = addSubErrors.map(e => parseFloat(e));
    
    // 检查输入
    if (values.some(v => !isFinite(v)) || errors.some(e => !isFinite(e))) {
      wx.showToast({ title: '请输入所有数值', icon: 'none' });
      return;
    }
    
    // 调用计算函数
    const result = calculateAddSubtractError(values, errors, addSubOperation);
    
    if (result.error) {
      wx.showToast({ title: result.error, icon: 'none', duration: 3000 });
      return;
    }
    
    // 格式化结果
    let resultText = `✨ 误差传递计算结果\n\n`;
    resultText += `📐 运算公式\n${result.formula}\n\n`;
    resultText += `📊 误差公式\n${result.errorFormula}\n\n`;
    resultText += `🎯 结果\nz = ${result.result} ± ${result.absoluteError}\n\n`;
    resultText += `📈 误差分析\n`;
    resultText += `绝对误差：±${result.absoluteError}\n`;
    resultText += `相对误差：${(result.relativeError * 100).toFixed(2)}%\n\n`;
    resultText += `💡 说明\n${result.notes.join('\n')}`;
    
    this.setData({
      addSubResult: result,
      addSubResultText: resultText
    });
    
    // 保存历史
    historyService.add({
      tool: '误差传递-加减法',
      input: `${addSubOperation === 'add' ? '加法' : '减法'}：${values.length}个变量`,
      result: `${result.result} ± ${result.absoluteError}`
    });
  },

  clearAddSubtract() {
    const count = this.data.addSubVariableCount;
    this.setData({
      addSubValues: Array(count).fill(''),
      addSubErrors: Array(count).fill(''),
      addSubResult: null,
      addSubResultText: ''
    });
  },

  /**
   * ========== 乘除法误差传递 ==========
   */

  switchMultiDivOperation(e) {
    const operation = e.currentTarget.dataset.op;
    this.setData({ multiDivOperation: operation });
  },

  onMultiDivVariableCountChange(e) {
    const count = parseInt(e.detail.value);
    const values = [...this.data.multiDivValues];
    const errors = [...this.data.multiDivErrors];
    
    while (values.length < count) {
      values.push('');
      errors.push('');
    }
    values.length = count;
    errors.length = count;
    
    this.setData({
      multiDivVariableCount: count,
      multiDivValues: values,
      multiDivErrors: errors
    });
  },

  handleMultiDivValueInput(e) {
    const index = e.currentTarget.dataset.index;
    const values = [...this.data.multiDivValues];
    values[index] = e.detail.value;
    this.setData({ multiDivValues: values });
  },

  handleMultiDivErrorInput(e) {
    const index = e.currentTarget.dataset.index;
    const errors = [...this.data.multiDivErrors];
    errors[index] = e.detail.value;
    this.setData({ multiDivErrors: errors });
  },

  calculateMultiplyDivide() {
    const { multiDivValues, multiDivErrors, multiDivOperation } = this.data;
    
    const values = multiDivValues.map(v => parseFloat(v));
    const errors = multiDivErrors.map(e => parseFloat(e));
    
    if (values.some(v => !isFinite(v)) || errors.some(e => !isFinite(e))) {
      wx.showToast({ title: '请输入所有数值', icon: 'none' });
      return;
    }
    
    const result = calculateMultiplyDivideError(values, errors, multiDivOperation);
    
    if (result.error) {
      wx.showToast({ title: result.error, icon: 'none', duration: 3000 });
      return;
    }
    
    let resultText = `✨ 误差传递计算结果\n\n`;
    resultText += `📐 运算公式\n${result.formula}\n\n`;
    resultText += `📊 误差公式\n${result.errorFormula}\n\n`;
    resultText += `🎯 结果\n${result.notes[0]}\n\n`;
    resultText += `📈 误差分析\n`;
    resultText += `绝对误差：±${result.absoluteError}\n`;
    resultText += `相对误差：${result.percentError.toFixed(2)}%\n\n`;
    resultText += `💡 说明\n${result.notes[2]}`;
    
    this.setData({
      multiDivResult: result,
      multiDivResultText: resultText
    });
    
    historyService.add({
      tool: '误差传递-乘除法',
      input: `${multiDivOperation === 'multiply' ? '乘法' : '除法'}：${values.length}个变量`,
      result: `相对误差 ${result.percentError.toFixed(2)}%`
    });
  },

  clearMultiplyDivide() {
    const count = this.data.multiDivVariableCount;
    this.setData({
      multiDivValues: Array(count).fill(''),
      multiDivErrors: Array(count).fill(''),
      multiDivResult: null,
      multiDivResultText: ''
    });
  },

  /**
   * ========== 幂函数误差传递 ==========
   */

  handlePowerValueInput(e) {
    this.setData({ powerValue: e.detail.value });
  },

  handlePowerErrorInput(e) {
    this.setData({ powerError: e.detail.value });
  },

  handlePowerExponentInput(e) {
    this.setData({ powerExponent: e.detail.value });
  },

  calculatePower() {
    const { powerValue, powerError, powerExponent } = this.data;
    
    const value = parseFloat(powerValue);
    const error = parseFloat(powerError);
    const exponent = parseFloat(powerExponent);
    
    if (!isFinite(value) || !isFinite(error) || !isFinite(exponent)) {
      wx.showToast({ title: '请输入所有参数', icon: 'none' });
      return;
    }
    
    const result = calculatePowerError(value, error, exponent);
    
    if (result.error) {
      wx.showToast({ title: result.error, icon: 'none', duration: 3000 });
      return;
    }
    
    let resultText = `✨ 误差传递计算结果\n\n`;
    resultText += `📐 运算公式\n${result.formula}\n\n`;
    resultText += `📊 误差公式\n${result.errorFormula}\n\n`;
    resultText += `🎯 结果\n${result.notes[1]}\n\n`;
    resultText += `📈 误差分析\n`;
    resultText += `绝对误差：±${result.absoluteError}\n`;
    resultText += `相对误差：${result.percentError.toFixed(2)}%\n\n`;
    resultText += `💡 说明\n${result.notes[3]}`;
    
    this.setData({
      powerResult: result,
      powerResultText: resultText
    });
    
    historyService.add({
      tool: '误差传递-幂函数',
      input: `${value}^${exponent}`,
      result: `${result.result} ± ${result.absoluteError}`
    });
  },

  clearPower() {
    this.setData({
      powerValue: '',
      powerError: '',
      powerExponent: '',
      powerResult: null,
      powerResultText: ''
    });
  },

  /**
   * ========== 对数函数误差传递 ==========
   */

  handleLogValueInput(e) {
    this.setData({ logValue: e.detail.value });
  },

  handleLogErrorInput(e) {
    this.setData({ logError: e.detail.value });
  },

  onLogBaseChange(e) {
    const index = parseInt(e.detail.value);
    const bases = ['e', '10', '2', 'custom'];
    this.setData({ logBase: bases[index] });
  },

  handleLogCustomBaseInput(e) {
    this.setData({ logCustomBase: e.detail.value });
  },

  calculateLog() {
    const { logValue, logError, logBase, logCustomBase } = this.data;
    
    const value = parseFloat(logValue);
    const error = parseFloat(logError);
    
    if (!isFinite(value) || !isFinite(error)) {
      wx.showToast({ title: '请输入真数和误差', icon: 'none' });
      return;
    }
    
    // 确定底数
    let base = Math.E;
    if (logBase === '10') base = 10;
    else if (logBase === '2') base = 2;
    else if (logBase === 'custom') {
      base = parseFloat(logCustomBase);
      if (!isFinite(base)) {
        wx.showToast({ title: '请输入自定义底数', icon: 'none' });
        return;
      }
    }
    
    const result = calculateLogError(value, error, base);
    
    if (result.error) {
      wx.showToast({ title: result.error, icon: 'none', duration: 3000 });
      return;
    }
    
    let resultText = `✨ 误差传递计算结果\n\n`;
    resultText += `📐 运算公式\n${result.formula}\n\n`;
    resultText += `📊 误差公式\n${result.errorFormula}\n\n`;
    resultText += `🎯 结果\n${result.notes[1]}\n\n`;
    resultText += `📈 误差分析\n`;
    resultText += `绝对误差：±${result.absoluteError}\n`;
    if (isFinite(result.percentError)) {
      resultText += `相对误差：${result.percentError.toFixed(2)}%\n`;
    }
    resultText += `\n💡 说明\n${result.notes[3]}`;
    
    this.setData({
      logResult: result,
      logResultText: resultText
    });
    
    historyService.add({
      tool: '误差传递-对数',
      input: `${result.formula.replace('z = ', '')}(${value})`,
      result: `${result.result} ± ${result.absoluteError}`
    });
  },

  clearLog() {
    this.setData({
      logValue: '',
      logError: '',
      logBase: 'e',
      logCustomBase: '',
      logResult: null,
      logResultText: ''
    });
  },

  /**
   * ========== 三角函数误差传递 ==========
   */

  handleTrigValueInput(e) {
    this.setData({ trigValue: e.detail.value });
  },

  handleTrigErrorInput(e) {
    this.setData({ trigError: e.detail.value });
  },

  onTrigFunctionChange(e) {
    const index = parseInt(e.detail.value);
    const functions = ['sin', 'cos', 'tan'];
    this.setData({ trigFunction: functions[index] });
  },

  onTrigUnitChange(e) {
    const index = parseInt(e.detail.value);
    const units = ['radian', 'degree'];
    this.setData({ trigUnit: units[index] });
  },

  calculateTrig() {
    const { trigValue, trigError, trigFunction, trigUnit } = this.data;
    
    let value = parseFloat(trigValue);
    let error = parseFloat(trigError);
    
    if (!isFinite(value) || !isFinite(error)) {
      wx.showToast({ title: '请输入角度和误差', icon: 'none' });
      return;
    }
    
    // 如果是角度，转换为弧度
    if (trigUnit === 'degree') {
      value = value * Math.PI / 180;
      error = error * Math.PI / 180;
    }
    
    const result = calculateTrigError(value, error, trigFunction);
    
    if (result.error) {
      wx.showToast({ title: result.error, icon: 'none', duration: 3000 });
      return;
    }
    
    let resultText = `✨ 误差传递计算结果\n\n`;
    resultText += `📐 运算公式\n${result.formula}\n\n`;
    resultText += `📊 误差公式\n${result.errorFormula}\n\n`;
    resultText += `📥 输入\n${result.notes[0]}\n${result.notes[1]}\n\n`;
    resultText += `🎯 结果\n${result.notes[2]}\n\n`;
    resultText += `💡 说明\n${result.notes[4]}`;
    
    this.setData({
      trigResult: result,
      trigResultText: resultText
    });
    
    historyService.add({
      tool: '误差传递-三角函数',
      input: `${trigFunction}(${trigValue}${trigUnit === 'degree' ? '°' : ' rad'})`,
      result: `${result.result} ± ${result.absoluteError}`
    });
  },

  clearTrig() {
    this.setData({
      trigValue: '',
      trigError: '',
      trigFunction: 'sin',
      trigUnit: 'radian',
      trigResult: null,
      trigResultText: ''
    });
  },

  /**
   * ========== 通用功能 ==========
   */

  exportResult() {
    let resultText = '';
    const { currentTool } = this.data;
    
    if (currentTool === 'add-subtract' && this.data.addSubResultText) {
      resultText = this.data.addSubResultText;
    } else if (currentTool === 'multiply-divide' && this.data.multiDivResultText) {
      resultText = this.data.multiDivResultText;
    } else if (currentTool === 'power' && this.data.powerResultText) {
      resultText = this.data.powerResultText;
    } else if (currentTool === 'logarithm' && this.data.logResultText) {
      resultText = this.data.logResultText;
    } else if (currentTool === 'trigonometry' && this.data.trigResultText) {
      resultText = this.data.trigResultText;
    }
    
    if (!resultText) {
      wx.showToast({ title: '暂无结果可导出', icon: 'none' });
      return;
    }
    
    wx.setClipboardData({
      data: resultText,
      success() {
        wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
      }
    });
  }
});

