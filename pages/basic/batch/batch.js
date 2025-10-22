/**
 * 批量计算页面
 * 支持单位换算、XRD计算、浓度计算的批量处理
 */

const { conversions } = require('../../../utils/conversions');
const { dFromTheta2, theta2FromD } = require('../../../utils/xrd');
const { historyService } = require('../../../services/history');
const { exportService } = require('../../../services/export');
const { parseCsv, generateCsv } = require('./csvUtils');
const { generateShareCard } = require('../utils/shareHelper');

Page({
  data: {
    // 计算类型
    calcTypes: ['单位换算', 'XRD(2θ→d)', 'XRD(d→2θ)', '稀释计算'],
    calcTypeIndex: 0,

    // 单位换算参数
    unitCategories: [],
    unitCategoryIndex: 0,
    unitFrom: '',
    unitTo: '',
    allUnits: [],

    // XRD参数
    xrdLambda: '1.5406',

    // 稀释计算参数
    dilutionC1: '',
    dilutionV2: '',

    // 输入数据
    inputText: '',
    
    // 结果数据
    results: [],
    hasResults: false,
    
    // 进度
    calculating: false,
    progress: 0,
    progressText: '',
    
    // 错误
    errors: [],
    
    // 提示文本（按需设置）
    placeholder: '每行一个数值，例如：\n100\n200\n300'
  },

  onLoad() {
    // 按需初始化，减少初始加载
    this._initUnits();
  },
  
  /**
   * 初始化单位列表（懒加载）
   */
  _initUnits() {
    if (this.data.unitCategories.length === 0) {
      const categories = Object.keys(conversions);
      this.setData({ 
        unitCategories: categories,
        unitCategoryIndex: 0
      });
      this.updateUnitList();
    }
  },

  /**
   * 切换计算类型
   */
  handleCalcTypeChange(e) {
    const index = Number(e.detail.value);
    this.setData({
      calcTypeIndex: index,
      inputText: '',
      results: [],
      hasResults: false,
      errors: []
    });
    this.updatePlaceholder();
  },

  /**
   * 更新输入提示（优化版 - 减少setData）
   */
  updatePlaceholder() {
    const placeholders = {
      0: '每行一个数值，例如：\n100\n200\n300',
      1: '每行一个2θ值（度），例如：\n28.5\n33.1\n47.5',
      2: '每行一个d值（Å），例如：\n3.5\n2.8\n2.1',
      3: '每行一个初始体积（mL），例如：\n10\n20\n30'
    };
    
    const placeholder = placeholders[this.data.calcTypeIndex] || placeholders[0];
    
    // 仅在值变化时更新
    if (this.data.placeholder !== placeholder) {
      this.setData({ placeholder });
    }
  },

  /**
   * 单位换算：类别改变
   */
  handleUnitCategoryChange(e) {
    const index = Number(e.detail.value);
    this.setData({ unitCategoryIndex: index });
    this.updateUnitList();
  },

  /**
   * 更新单位列表
   */
  updateUnitList() {
    const category = this.data.unitCategories[this.data.unitCategoryIndex];
    const units = category ? Object.keys(conversions[category]) : [];
    this.setData({ 
      allUnits: units,
      unitFrom: units[0] || '',
      unitTo: units[1] || ''
    });
  },

  /**
   * 单位输入
   */
  handleUnitFromInput(e) {
    this.setData({ unitFrom: e.detail.value });
  },

  handleUnitToInput(e) {
    this.setData({ unitTo: e.detail.value });
  },

  /**
   * XRD波长输入
   */
  handleLambdaInput(e) {
    this.setData({ xrdLambda: e.detail.value });
  },

  /**
   * 稀释计算参数输入
   */
  handleDilutionC1Input(e) {
    this.setData({ dilutionC1: e.detail.value });
  },

  handleDilutionV2Input(e) {
    this.setData({ dilutionV2: e.detail.value });
  },

  /**
   * 输入文本改变
   */
  handleInputChange(e) {
    this.setData({ inputText: e.detail.value });
  },

  /**
   * 导入CSV（从剪贴板）
   */
  importCsv() {
    wx.getClipboardData({
      success: (res) => {
        const csvText = res.data;
        try {
          const data = parseCsv(csvText);
          if (data.length === 0) {
            wx.showToast({ title: '未识别到有效数据', icon: 'none' });
            return;
          }
          
          // 提取第一列作为输入数据
          const inputText = data.map(row => row[0]).join('\n');
          this.setData({ inputText });
          
          wx.showToast({ 
            title: `已导入 ${data.length} 行数据`, 
            icon: 'success' 
          });
        } catch (error) {
          wx.showToast({ 
            title: '导入失败：' + error.message, 
            icon: 'none' 
          });
        }
      },
      fail: () => {
        wx.showToast({ title: '读取剪贴板失败', icon: 'none' });
      }
    });
  },

  /**
   * 清空输入
   */
  clearInput() {
    this.setData({
      inputText: '',
      results: [],
      hasResults: false,
      errors: []
    });
  },

  /**
   * 执行批量计算（优化版 - 减少setData频率）
   */
  async batchCalculate() {
    const { calcTypeIndex, inputText } = this.data;

    // 验证输入
    if (!inputText.trim()) {
      return wx.showToast({ title: '请输入数据', icon: 'none' });
    }

    // 解析输入数据（支持换行符、空格、制表符分隔）
    const allValues = [];
    const lines = inputText.trim().split(/[\n\r]+/);
    
    for (let line of lines) {
      // 每行可能包含多个数值（用空格或制表符分隔）
      const values = line.trim().split(/[\s\t,]+/).filter(v => v.trim());
      allValues.push(...values);
    }
    
    if (allValues.length === 0) {
      return wx.showToast({ title: '没有有效数据', icon: 'none' });
    }

    // 验证参数
    if (calcTypeIndex === 0 && !this.validateUnitParams()) return;
    if ((calcTypeIndex === 1 || calcTypeIndex === 2) && !this.validateXrdParams()) return;
    if (calcTypeIndex === 3 && !this.validateDilutionParams()) return;

    // 开始计算
    this.setData({ calculating: true, progress: 0 });

    const results = [];
    const errors = [];
    const total = allValues.length;
    let lastUpdate = 0;

    for (let i = 0; i < allValues.length; i++) {
      const value = allValues[i].trim();
      const progress = Math.round(((i + 1) / total) * 100);
      
      // 优化：每20%更新一次进度，减少setData
      if (progress - lastUpdate >= 20 || i === allValues.length - 1) {
        this.setData({ 
          progress,
          progressText: `正在计算 ${i + 1}/${total}...`
        });
        lastUpdate = progress;
      }

      try {
        const calculators = [
          this.calculateUnitConversion,
          this.calculateXrdTheta2D,
          this.calculateXrdD2Theta,
          this.calculateDilution
        ];
        
        const result = calculators[calcTypeIndex].call(this, value, i + 1);

        if (result.error) {
          errors.push({ row: i + 1, value, error: result.error });
        } else {
          results.push(result);
        }
      } catch (error) {
        errors.push({ row: i + 1, value, error: error.message });
      }

      // 减少延迟频率
      if (i % 20 === 0 && i > 0) {
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    }

    // 一次性更新所有结果
    this.setData({
      calculating: false,
      results,
      hasResults: true,
      errors,
      progressText: `计算完成！成功 ${results.length}，失败 ${errors.length}`
    });

    // 异步添加历史记录，不阻塞UI
    if (results.length > 0) {
      setTimeout(() => {
        historyService.add({
          type: 'batch',
          title: `批量计算 - ${this.data.calcTypes[calcTypeIndex]}`,
          input: `${total}组数据`,
          result: `成功${results.length}，失败${errors.length}`
        });
      }, 0);
    }

    wx.showToast({
      title: `完成！成功${results.length}/${total}`,
      icon: 'success'
    });
  },

  /**
   * 验证单位换算参数
   */
  validateUnitParams() {
    const { unitFrom, unitTo, allUnits } = this.data;
    
    if (!allUnits.includes(unitFrom)) {
      wx.showToast({ title: '请输入有效的源单位', icon: 'none' });
      return false;
    }
    
    if (!allUnits.includes(unitTo)) {
      wx.showToast({ title: '请输入有效的目标单位', icon: 'none' });
      return false;
    }
    
    return true;
  },

  /**
   * 验证XRD参数
   */
  validateXrdParams() {
    const lambda = Number(this.data.xrdLambda);
    if (isNaN(lambda) || lambda <= 0) {
      wx.showToast({ title: '请输入有效的波长', icon: 'none' });
      return false;
    }
    return true;
  },

  /**
   * 验证稀释计算参数
   */
  validateDilutionParams() {
    const c1 = Number(this.data.dilutionC1);
    const v2 = Number(this.data.dilutionV2);
    
    if (isNaN(c1) || c1 <= 0) {
      wx.showToast({ title: '请输入有效的初始浓度', icon: 'none' });
      return false;
    }
    
    if (isNaN(v2) || v2 <= 0) {
      wx.showToast({ title: '请输入有效的最终体积', icon: 'none' });
      return false;
    }
    
    return true;
  },

  /**
   * 单位换算计算
   */
  calculateUnitConversion(value, row) {
    const { unitCategoryIndex, unitCategories, unitFrom, unitTo } = this.data;
    const numValue = Number(value);
    
    if (isNaN(numValue)) {
      return { error: '无效数值' };
    }

    const category = unitCategories[unitCategoryIndex];
    
    // 温度需要特殊处理
    let result;
    if (category === '温度') {
      result = this.convertTemperature(numValue, unitFrom, unitTo);
    } else {
      // 检查单位是否存在
      if (!conversions[category][unitFrom] || !conversions[category][unitTo]) {
        return { error: '单位不存在' };
      }
      const base = numValue * conversions[category][unitFrom].factor;
      result = base / conversions[category][unitTo].factor;
    }

    const precision = Math.abs(result) < 1 ? 6 : 4;
    
    return {
      row,
      input: `${numValue} ${unitFrom}`,
      output: `${result.toFixed(precision)} ${unitTo}`,
      value: result
    };
  },

  /**
   * 温度换算
   */
  convertTemperature(value, fromUnit, toUnit) {
    // 修复：获取type字段
    const fromData = conversions['温度'][fromUnit];
    const toData = conversions['温度'][toUnit];
    
    if (!fromData || !toData) {
      return NaN;
    }
    
    const fromSymbol = fromData.type;
    const toSymbol = toData.type;
    
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
   * XRD: 2θ → d
   */
  calculateXrdTheta2D(value, row) {
    const theta2 = Number(value);
    if (isNaN(theta2)) {
      return { error: '无效的2θ值' };
    }

    const lambda = Number(this.data.xrdLambda);
    const result = dFromTheta2(theta2, lambda);
    
    if (result.error) {
      return { error: result.error };
    }

    return {
      row,
      input: `${theta2}°`,
      output: `${result.d.toFixed(4)} Å`,
      value: result.d
    };
  },

  /**
   * XRD: d → 2θ
   */
  calculateXrdD2Theta(value, row) {
    const d = Number(value);
    if (isNaN(d)) {
      return { error: '无效的d值' };
    }

    const lambda = Number(this.data.xrdLambda);
    const result = theta2FromD(d, lambda);
    
    if (result.error) {
      return { error: result.error };
    }

    return {
      row,
      input: `${d} Å`,
      output: `${result.theta2.toFixed(3)}°`,
      value: result.theta2
    };
  },

  /**
   * 稀释计算
   */
  calculateDilution(value, row) {
    const v1 = Number(value);
    if (isNaN(v1) || v1 <= 0) {
      return { error: '无效的体积值' };
    }

    const c1 = Number(this.data.dilutionC1);
    const v2 = Number(this.data.dilutionV2);

    if (v1 > v2) {
      return { error: `初始体积(${v1})不能大于最终体积(${v2})` };
    }

    const c2 = (c1 * v1) / v2;

    return {
      row,
      input: `${v1} mL`,
      output: `${c2.toFixed(4)} mol·L⁻¹`,
      value: c2,
      detail: `${v1}mL@${c1}M → ${v2}mL@${c2.toFixed(4)}M`
    };
  },

  /**
   * 导出结果（优化版 - 减少内存占用）
   */
  exportResults() {
    const { results, calcTypeIndex, calcTypes } = this.data;
    
    if (results.length === 0) {
      return wx.showToast({ title: '没有可导出的结果', icon: 'none' });
    }

    wx.showActionSheet({
      itemList: ['复制到剪贴板', '保存为文本'],
      success: (res) => {
        // 延迟生成数据，避免阻塞UI
        setTimeout(() => {
          const headers = ['序号', '输入', '输出'];
          const rows = results.map(r => [r.row, r.input, r.output]);
          const csvContent = generateCsv([headers, ...rows]);

          if (res.tapIndex === 0) {
            wx.setClipboardData({
              data: csvContent,
              success: () => wx.showToast({ title: '已复制到剪贴板', icon: 'success' })
            });
          } else if (res.tapIndex === 1) {
            const content = `批量计算结果\n计算类型：${calcTypes[calcTypeIndex]}\n计算时间：${new Date().toLocaleString()}\n\n${csvContent}`;
            
            exportService.exportAsText({
              data: results,
              filename: `批量计算_${calcTypes[calcTypeIndex]}_${Date.now()}`,
              content
            }).then(() => {
              wx.showToast({ title: '导出成功', icon: 'success' });
            }).catch(() => {
              wx.showToast({ title: '导出失败', icon: 'none' });
            });
          }
        }, 100);
      }
    });
  },

  /**
   * 查看错误
   */
  viewErrors() {
    const { errors } = this.data;
    if (errors.length === 0) {
      wx.showToast({ title: '没有错误', icon: 'success' });
      return;
    }

    const errorText = errors.map(e => 
      `第${e.row}行: ${e.value}\n错误: ${e.error}`
    ).join('\n\n');

    wx.showModal({
      title: `错误详情 (${errors.length}个)`,
      content: errorText,
      showCancel: false,
      confirmText: '知道了'
    });
  },

  /**
   * 生成分享卡片 (v6.0.0新增)
   */
  async generateCard() {
    const { calcTypeIndex, calcTypes, results, errors } = this.data;
    
    if (!results || results.length === 0) {
      wx.showToast({
        title: '请先完成批量计算',
        icon: 'none'
      });
      return;
    }

    const calcType = calcTypes[calcTypeIndex];
    const successCount = results.filter(r => r.success).length;
    const errorCount = errors.length;

    const inputs = {
      '计算类型': calcType,
      '数据总数': `${results.length}条`
    };

    const results_obj = {
      '成功计算': `${successCount}条`,
      '失败数量': `${errorCount}条`,
      '成功率': `${((successCount / results.length) * 100).toFixed(1)}%`
    };

    // 显示前3条结果作为示例
    if (successCount > 0) {
      const samples = results.filter(r => r.success).slice(0, 3);
      samples.forEach((sample, idx) => {
        results_obj[`示例${idx + 1}`] = `${sample.input} → ${sample.result}`;
      });
    }

    const notes = errorCount > 0 
      ? `有${errorCount}条数据计算失败，请检查输入格式` 
      : '所有数据计算成功';

    await generateShareCard('批量计算', 'batch', inputs, results_obj, notes);
  },

  /**
   * 分享
   */
  onShareAppMessage() {
    return {
      title: '批量计算工具 - 材料化学科研工具箱',
      path: '/pages/basic/batch/batch'
    };
  }
});

