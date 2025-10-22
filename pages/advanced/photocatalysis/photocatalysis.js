/**
 * 光催化性能计算工具
 * 包含：表观量子效率(AQE)、降解动力学、活性对比
 */

const {
  calculateAQE,
  fitDegradationKinetics,
  compareActivity
} = require('../../../utils/photocatalysis');
const { historyService } = require('../../../services/history');
const { getPresets } = require('../../../utils/input-presets');

Page({
  data: {
    // 工具选择
    tools: [
      { id: 'aqe', name: '量子效率', icon: '💡' },
      { id: 'kinetics', name: '降解动力学', icon: '📉' },
      { id: 'compare', name: '活性对比', icon: '📊' }
    ],
    currentTool: 'aqe',

    // AQE计算
    reactionRate: '',
    photonFlux: '',
    wavelength: '365',
    timeUnits: ['小时(h)', '秒(s)'],
    timeUnitIndex: 0,
    powerUnits: ['瓦(W)', '毫瓦(mW)'],
    powerUnitIndex: 1,
    aqeResult: null,
    aqeResultText: '',
    
    // 预设值
    wavelengthPresets: [],
    powerPresets: [],

    // 降解动力学
    kineticsDataInput: '',
    kineticsPlaceholder: '格式：时间(min),浓度(mg/L或相对浓度)\n例如：\n0,10\n10,8.5\n20,7.2\n30,6.1\n40,5.2\n60,3.8',
    kineticsResult: null,
    kineticsResultText: '',

    // 活性对比
    compareDataInput: '',
    comparePlaceholder: '格式：样品名,速率常数k(min⁻¹)\n例如：\nTiO2,0.015\nCdS,0.025\nZnO,0.018\nComposite,0.032',
    compareResult: null,
    compareResultText: ''
  },

  onLoad() {
    this.setData({
      wavelengthPresets: getPresets('photocatalysis', 'wavelength'),
      powerPresets: getPresets('photocatalysis', 'power')
    });
  },

  /**
   * 切换工具
   */
  switchTool(e) {
    const tool = e.currentTarget.dataset.tool;
    this.setData({ currentTool: tool });
  },

  /**
   * ========== AQE计算 ==========
   */

  handleReactionRateInput(e) {
    this.setData({ reactionRate: e.detail.value });
  },

  handlePhotonFluxInput(e) {
    this.setData({ photonFlux: e.detail.value });
  },

  handleWavelengthInput(e) {
    this.setData({ wavelength: e.detail.value });
  },
  
  handleWavelengthChange(e) {
    this.setData({ wavelength: e.detail.value });
  },
  
  handlePhotonFluxChange(e) {
    this.setData({ photonFlux: e.detail.value });
  },

  handleTimeUnitChange(e) {
    this.setData({ timeUnitIndex: Number(e.detail.value) });
  },

  handlePowerUnitChange(e) {
    this.setData({ powerUnitIndex: Number(e.detail.value) });
  },

  calculateAQEValue() {
    const { reactionRate, photonFlux, wavelength, timeUnitIndex, powerUnitIndex } = this.data;

    if (!reactionRate || !photonFlux || !wavelength) {
      wx.showToast({
        title: '请填写所有参数',
        icon: 'none'
      });
      return;
    }

    const timeUnit = timeUnitIndex === 0 ? 'h' : 's';
    const powerUnit = powerUnitIndex === 0 ? 'W' : 'mW';

    const result = calculateAQE(
      parseFloat(reactionRate),
      parseFloat(photonFlux),
      parseFloat(wavelength),
      { timeUnit, powerUnit }
    );

    if (result.error) {
      wx.showToast({
        title: result.error,
        icon: 'none',
        duration: 3000
      });
      return;
    }

    let resultText = `💡 表观量子效率(AQE)计算结果\n\n`;
    resultText += `🎯 AQE = ${result.aqe}%\n\n`;
    resultText += `📋 输入参数：\n`;
    resultText += `• 反应速率：${result.reactionRate}\n`;
    resultText += `• 光子通量：${result.photonFlux}\n`;
    resultText += `• 光源波长：${result.wavelength}\n\n`;
    resultText += `📊 计算详情：\n`;
    resultText += `• 光子能量：${result.photonEnergy}\n`;
    resultText += `• 光子通量：${result.photonFluxPerSecond} photons/s\n`;
    resultText += `• 反应分子数：${result.moleculesPerSecond} molecules/s\n\n`;
    resultText += `${result.performanceNote}\n\n`;
    resultText += `💡 ${result.note}`;

    this.setData({
      aqeResult: result,
      aqeResultText: resultText
    });

    historyService.add({
      tool: '光催化-量子效率',
      input: `λ=${wavelength}nm`,
      result: `AQE=${result.aqe}%`
    });
  },

  /**
   * ========== 降解动力学 ==========
   */

  handleKineticsDataInput(e) {
    this.setData({ kineticsDataInput: e.detail.value });
  },

  calculateKinetics() {
    const { kineticsDataInput } = this.data;

    if (!kineticsDataInput.trim()) {
      wx.showToast({
        title: '请输入时间-浓度数据',
        icon: 'none'
      });
      return;
    }

    // 解析输入
    const lines = kineticsDataInput.trim().split('\n');
    const timeData = [];

    for (const line of lines) {
      const parts = line.trim().split(/[,，\s]+/);
      if (parts.length >= 2) {
        timeData.push({
          time: parseFloat(parts[0]),
          concentration: parseFloat(parts[1])
        });
      }
    }

    const result = fitDegradationKinetics(timeData);

    if (result.error) {
      wx.showToast({
        title: result.error,
        icon: 'none',
        duration: 3000
      });
      if (result.note) {
        setTimeout(() => {
          wx.showToast({
            title: result.note,
            icon: 'none',
            duration: 3000
          });
        }, 3000);
      }
      return;
    }

    let resultText = `📉 降解动力学拟合结果\n\n`;
    resultText += `📋 动力学参数：\n`;
    resultText += `• 速率常数 k = ${result.k} ${result.kUnit}\n`;
    resultText += `• 半衰期 t₁/₂ = ${result.halfLife} ${result.halfLifeUnit}\n`;
    resultText += `• 初始浓度 C₀ = ${result.C0}\n`;
    resultText += `• R² = ${result.rSquared} (${result.fitQuality === 'excellent' ? '优秀' : result.fitQuality === 'good' ? '良好' : result.fitQuality === 'fair' ? '一般' : '较差'})\n\n`;
    resultText += `📐 拟合方程：\n${result.equation}\n\n`;
    resultText += `📊 拟合详情：\n`;
    resultText += `时间 | 实测 | 拟合 | 残差\n`;
    resultText += `${'─'.repeat(30)}\n`;

    result.fittedData.forEach(point => {
      resultText += `${point.time.padEnd(6)} | ${point.measured.padEnd(6)} | ${point.fitted.padEnd(6)} | ${point.residual}\n`;
    });

    resultText += `\n💡 ${result.note}`;

    this.setData({
      kineticsResult: result,
      kineticsResultText: resultText
    });

    historyService.add({
      tool: '光催化-降解动力学',
      input: `${timeData.length}个时间点`,
      result: `k=${result.k} min⁻¹`
    });
  },

  /**
   * ========== 活性对比 ==========
   */

  handleCompareDataInput(e) {
    this.setData({ compareDataInput: e.detail.value });
  },

  calculateCompare() {
    const { compareDataInput } = this.data;

    if (!compareDataInput.trim()) {
      wx.showToast({
        title: '请输入对比数据',
        icon: 'none'
      });
      return;
    }

    // 解析输入
    const lines = compareDataInput.trim().split('\n');
    const datasets = [];

    for (const line of lines) {
      const parts = line.trim().split(/[,，\s]+/);
      if (parts.length >= 2) {
        datasets.push({
          name: parts[0],
          k: parseFloat(parts[1])
        });
      }
    }

    const result = compareActivity(datasets);

    if (result.error) {
      wx.showToast({
        title: result.error,
        icon: 'none',
        duration: 3000
      });
      return;
    }

    let resultText = `📊 光催化活性对比结果\n\n`;
    resultText += `🏆 最佳样品：${result.bestSample} (k=${result.bestK} min⁻¹)\n\n`;
    resultText += `📋 排名：\n`;
    resultText += `排名 | 样品 | k(min⁻¹) | t₁/₂(min) | 相对活性\n`;
    resultText += `${'─'.repeat(40)}\n`;

    result.comparison.forEach(sample => {
      const rank = sample.isBest ? '🥇' : sample.rank === 2 ? '🥈' : sample.rank === 3 ? '🥉' : `${sample.rank}`;
      resultText += `${rank.padEnd(5)} | ${sample.name.padEnd(8)} | ${sample.k.padEnd(9)} | ${sample.halfLife.padEnd(9)} | ${sample.relative}%\n`;
    });

    resultText += `\n💡 ${result.note}`;

    this.setData({
      compareResult: result,
      compareResultText: resultText
    });

    historyService.add({
      tool: '光催化-活性对比',
      input: `${datasets.length}个样品`,
      result: `最佳：${result.bestSample}`
    });
  },

  /**
   * 清空结果
   */
  clearResult() {
    const { currentTool } = this.data;

    switch (currentTool) {
      case 'aqe':
        this.setData({
          reactionRate: '',
          photonFlux: '',
          aqeResult: null,
          aqeResultText: ''
        });
        break;
      case 'kinetics':
        this.setData({
          kineticsDataInput: '',
          kineticsResult: null,
          kineticsResultText: ''
        });
        break;
      case 'compare':
        this.setData({
          compareDataInput: '',
          compareResult: null,
          compareResultText: ''
        });
        break;
    }
  },

  /**
   * 导出结果
   */
  exportResult() {
    const { currentTool, aqeResultText, kineticsResultText, compareResultText } = this.data;

    let text = '';
    switch (currentTool) {
      case 'aqe':
        text = aqeResultText;
        break;
      case 'kinetics':
        text = kineticsResultText;
        break;
      case 'compare':
        text = compareResultText;
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

