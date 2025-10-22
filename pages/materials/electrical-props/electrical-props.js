/**
 * 电学性质计算工具
 * 包含：电导率（四探针/两探针/薄膜）、介电常数
 */

const {
  calculateConductivity4Probe,
  calculateConductivityBulk,
  calculateConductivityFilm,
  calculateDielectricConstant,
  calculateDielectricLoss
} = require('../../../utils/electrical-properties');
const { historyService } = require('../../../services/history');
const { getPresets } = require('../../../utils/input-presets');

Page({
  data: {
    conductivityPresets: [],
    mobilityPresets: [],
    // 工具选择
    tools: [
      { id: 'four-probe', name: '四探针法', icon: '📐' },
      { id: 'bulk', name: '块体样品', icon: '🔲' },
      { id: 'film', name: '薄膜样品', icon: '📄' },
      { id: 'dielectric', name: '介电常数', icon: '⚡' }
    ],
    currentTool: 'four-probe',

    // 四探针法
    fourProbeV: '',
    fourProbeI: '',
    fourProbeT: '',
    currentUnits: ['安(A)', '毫安(mA)'],
    currentUnitIndex: 1,
    thicknessUnits: ['厘米(cm)', '毫米(mm)'],
    thicknessUnitIndex: 0,
    fourProbeResult: null,
    fourProbeResultText: '',

    // 块体样品
    bulkR: '',
    bulkL: '',
    bulkA: '',
    bulkResult: null,
    bulkResultText: '',

    // 薄膜样品
    filmRs: '',
    filmT: '',
    filmResult: null,
    filmResultText: '',

    // 介电常数
    dielectricC: '',
    dielectricA: '',
    dielectricD: '',
    capacitanceUnits: ['皮法(pF)', '纳法(nF)'],
    capacitanceUnitIndex: 0,
    dielectricResult: null,
    dielectricResultText: ''
  },

  /**
   * 切换工具
   */
  switchTool(e) {
    const tool = e.currentTarget.dataset.tool;
    this.setData({ currentTool: tool });
  },

  /**
   * ========== 四探针法 ==========
   */

  handleFourProbeVInput(e) {
    this.setData({ fourProbeV: e.detail.value });
  },

  handleFourProbeIInput(e) {
    this.setData({ fourProbeI: e.detail.value });
  },

  handleFourProbeTInput(e) {
    this.setData({ fourProbeT: e.detail.value });
  },

  handleCurrentUnitChange(e) {
    this.setData({ currentUnitIndex: Number(e.detail.value) });
  },

  handleThicknessUnitChange(e) {
    this.setData({ thicknessUnitIndex: Number(e.detail.value) });
  },

  calculateFourProbe() {
    const { fourProbeV, fourProbeI, fourProbeT, currentUnitIndex, thicknessUnitIndex } = this.data;

    if (!fourProbeV || !fourProbeI || !fourProbeT) {
      wx.showToast({
        title: '请填写所有参数',
        icon: 'none'
      });
      return;
    }

    const currentUnit = currentUnitIndex === 0 ? 'A' : 'mA';
    const thicknessUnit = thicknessUnitIndex === 0 ? 'cm' : 'mm';

    const result = calculateConductivity4Probe(
      parseFloat(fourProbeV),
      parseFloat(fourProbeI),
      parseFloat(fourProbeT),
      { currentUnit, thicknessUnit }
    );

    if (result.error) {
      wx.showToast({
        title: result.error,
        icon: 'none',
        duration: 3000
      });
      return;
    }

    let resultText = `📐 四探针法测量结果\n\n`;
    resultText += `电导率：\n`;
    resultText += `• σ = ${result.conductivity.value_SI} ${result.conductivity.unit_SI}\n`;
    resultText += `• σ = ${result.conductivity.value_CGS} ${result.conductivity.unit_CGS}\n\n`;
    resultText += `电阻率：\n`;
    resultText += `• ρ = ${result.resistivity.value_SI} ${result.resistivity.unit_SI}\n`;
    resultText += `• ρ = ${result.resistivity.value_CGS} ${result.resistivity.unit_CGS}\n\n`;
    resultText += `📋 输入参数：\n`;
    resultText += `• 电压：${result.input.voltage}\n`;
    resultText += `• 电流：${result.input.current}\n`;
    resultText += `• 厚度：${result.input.thickness}\n\n`;
    resultText += `📐 公式：${result.formula}`;

    this.setData({
      fourProbeResult: result,
      fourProbeResultText: resultText
    });

    historyService.add({
      tool: '电学性质-四探针法',
      input: `V=${fourProbeV}V, I=${fourProbeI}${currentUnit}`,
      result: `σ=${result.conductivity.value_CGS} S/cm`
    });
  },

  /**
   * ========== 块体样品 ==========
   */

  handleBulkRInput(e) {
    this.setData({ bulkR: e.detail.value });
  },

  handleBulkLInput(e) {
    this.setData({ bulkL: e.detail.value });
  },

  handleBulkAInput(e) {
    this.setData({ bulkA: e.detail.value });
  },

  calculateBulk() {
    const { bulkR, bulkL, bulkA } = this.data;

    if (!bulkR || !bulkL || !bulkA) {
      wx.showToast({
        title: '请填写所有参数',
        icon: 'none'
      });
      return;
    }

    const result = calculateConductivityBulk(
      parseFloat(bulkR),
      parseFloat(bulkL),
      parseFloat(bulkA)
    );

    if (result.error) {
      wx.showToast({
        title: result.error,
        icon: 'none',
        duration: 3000
      });
      return;
    }

    let resultText = `🔲 块体样品测量结果\n\n`;
    resultText += `电导率：\n`;
    resultText += `• σ = ${result.conductivity.value_SI} ${result.conductivity.unit_SI}\n`;
    resultText += `• σ = ${result.conductivity.value_CGS} ${result.conductivity.unit_CGS}\n\n`;
    resultText += `电阻率：\n`;
    resultText += `• ρ = ${result.resistivity.value_SI} ${result.resistivity.unit_SI}\n`;
    resultText += `• ρ = ${result.resistivity.value_CGS} ${result.resistivity.unit_CGS}\n\n`;
    resultText += `📐 公式：${result.formula}`;

    this.setData({
      bulkResult: result,
      bulkResultText: resultText
    });

    historyService.add({
      tool: '电学性质-块体样品',
      input: `R=${bulkR}Ω`,
      result: `σ=${result.conductivity.value_CGS} S/cm`
    });
  },

  /**
   * ========== 薄膜样品 ==========
   */

  handleFilmRsInput(e) {
    this.setData({ filmRs: e.detail.value });
  },

  handleFilmTInput(e) {
    this.setData({ filmT: e.detail.value });
  },

  calculateFilm() {
    const { filmRs, filmT } = this.data;

    if (!filmRs || !filmT) {
      wx.showToast({
        title: '请填写方块电阻和厚度',
        icon: 'none'
      });
      return;
    }

    const result = calculateConductivityFilm(
      parseFloat(filmRs),
      parseFloat(filmT)
    );

    if (result.error) {
      wx.showToast({
        title: result.error,
        icon: 'none',
        duration: 3000
      });
      return;
    }

    let resultText = `📄 薄膜样品测量结果\n\n`;
    resultText += `电导率：\n`;
    resultText += `• σ = ${result.conductivity.value_SI} ${result.conductivity.unit_SI}\n`;
    resultText += `• σ = ${result.conductivity.value_CGS} ${result.conductivity.unit_CGS}\n\n`;
    resultText += `电阻率：\n`;
    resultText += `• ρ = ${result.resistivity.value_SI} ${result.resistivity.unit_SI}\n`;
    resultText += `• ρ = ${result.resistivity.value_CGS} ${result.resistivity.unit_CGS}\n\n`;
    resultText += `📋 输入参数：\n`;
    resultText += `• 方块电阻：${result.input.sheetResistance}\n`;
    resultText += `• 厚度：${result.input.thickness}\n\n`;
    resultText += `📐 公式：${result.formula}`;

    this.setData({
      filmResult: result,
      filmResultText: resultText
    });

    historyService.add({
      tool: '电学性质-薄膜样品',
      input: `Rs=${filmRs}Ω/sq, t=${filmT}nm`,
      result: `σ=${result.conductivity.value_CGS} S/cm`
    });
  },

  /**
   * ========== 介电常数 ==========
   */

  handleDielectricCInput(e) {
    this.setData({ dielectricC: e.detail.value });
  },

  handleDielectricAInput(e) {
    this.setData({ dielectricA: e.detail.value });
  },

  handleDielectricDInput(e) {
    this.setData({ dielectricD: e.detail.value });
  },

  handleCapacitanceUnitChange(e) {
    this.setData({ capacitanceUnitIndex: Number(e.detail.value) });
  },

  calculateDielectric() {
    const { dielectricC, dielectricA, dielectricD, capacitanceUnitIndex } = this.data;

    if (!dielectricC || !dielectricA || !dielectricD) {
      wx.showToast({
        title: '请填写所有参数',
        icon: 'none'
      });
      return;
    }

    const capacitanceUnit = capacitanceUnitIndex === 0 ? 'pF' : 'nF';

    const result = calculateDielectricConstant(
      parseFloat(dielectricC),
      parseFloat(dielectricA),
      parseFloat(dielectricD),
      { capacitanceUnit }
    );

    if (result.error) {
      wx.showToast({
        title: result.error,
        icon: 'none',
        duration: 3000
      });
      return;
    }

    let resultText = `⚡ 介电常数计算结果\n\n`;
    resultText += `相对介电常数 εr = ${result.epsilonR}\n\n`;
    resultText += `📋 输入参数：\n`;
    resultText += `• 电容：${result.capacitance}\n`;
    resultText += `• 电极面积：${result.area}\n`;
    resultText += `• 介质厚度：${result.thickness}\n\n`;
    resultText += `📐 公式：${result.formula}\n`;
    resultText += `💡 ${result.note}`;

    this.setData({
      dielectricResult: result,
      dielectricResultText: resultText
    });

    historyService.add({
      tool: '电学性质-介电常数',
      input: `C=${dielectricC}${capacitanceUnit}`,
      result: `εr=${result.epsilonR}`
    });
  },

  /**
   * 清空结果
   */
  clearResult() {
    const { currentTool } = this.data;

    switch (currentTool) {
      case 'four-probe':
        this.setData({
          fourProbeV: '',
          fourProbeI: '',
          fourProbeT: '',
          fourProbeResult: null,
          fourProbeResultText: ''
        });
        break;
      case 'bulk':
        this.setData({
          bulkR: '',
          bulkL: '',
          bulkA: '',
          bulkResult: null,
          bulkResultText: ''
        });
        break;
      case 'film':
        this.setData({
          filmRs: '',
          filmT: '',
          filmResult: null,
          filmResultText: ''
        });
        break;
      case 'dielectric':
        this.setData({
          dielectricC: '',
          dielectricA: '',
          dielectricD: '',
          dielectricResult: null,
          dielectricResultText: ''
        });
        break;
    }
  },

  /**
   * 导出结果
   */
  exportResult() {
    const { currentTool, fourProbeResultText, bulkResultText, filmResultText, dielectricResultText } = this.data;

    let text = '';
    switch (currentTool) {
      case 'four-probe':
        text = fourProbeResultText;
        break;
      case 'bulk':
        text = bulkResultText;
        break;
      case 'film':
        text = filmResultText;
        break;
      case 'dielectric':
        text = dielectricResultText;
        break;
    }

    if (!text) {
      wx.showToast({
        title: '暂无结果可导出',
        icon: 'none'
      });
      return;
    }

    wx.setClipboardData({
      data: text,
      success() {
        wx.showToast({
          title: '已复制到剪贴板',
          icon: 'success'
        });
      }
    });
  }
});

