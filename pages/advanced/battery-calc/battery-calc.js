/**
 * 电池性能计算工具页面
 * 包含：比容量、库伦效率、容量保持率、倍率性能
 */

const {
  calculateSpecificCapacity,
  calculateVolumetricCapacity,
  calculateCoulombicEfficiency,
  calculateCapacityRetention,
  calculateRatePerformance,
  calculateTheoreticalCapacity
} = require('../../../utils/electrochemistry-enhanced');
const { historyService } = require('../../../services/history');
const { getPresets } = require('../../../utils/input-presets');

Page({
  data: {
    // 工具选择
    tools: [
      { id: 'specific-capacity', name: '比容量', icon: '⚡' },
      { id: 'coulombic', name: '库伦效率', icon: '🔋' },
      { id: 'retention', name: '容量保持率', icon: '📉' },
      { id: 'rate', name: '倍率性能', icon: '⚡' }
    ],
    currentTool: 'specific-capacity',
    voltagePresets: [
      { label: '1.5 V', value: '1.5' },
      { label: '3.0 V', value: '3.0' },
      { label: '3.7 V', value: '3.7' },
      { label: '4.2 V', value: '4.2' }
    ],
    capacityPresets: [
      { label: '100 mAh', value: '100' },
      { label: '200 mAh', value: '200' },
      { label: '300 mAh', value: '300' },
      { label: '500 mAh', value: '500' }
    ],

    // 比容量计算
    capacity: '',
    mass: '',
    activeMaterialRatio: '100',
    density: '',
    specificResult: null,
    specificResultText: '',

    // 理论比容量
    molWeight: '',
    electronTransfer: '',
    theoreticalResult: null,

    // 库伦效率
    chargeCapacity: '',
    dischargeCapacity: '',
    cycleNumber: '',
    coulombicResult: null,
    coulombicResultText: '',

    // 容量保持率
    retentionDataInput: '',
    retentionPlaceholder: '格式：循环数,容量(mAh/g)\n例如：\n1,180\n10,175\n50,165\n100,155',
    retentionResult: null,
    retentionResultText: '',

    // 倍率性能
    rateDataInput: '',
    ratePlaceholder: '格式：倍率(C),容量(mAh/g)\n例如：\n0.1,200\n0.5,190\n1,180\n2,160\n5,130',
    rateResult: null,
    rateResultText: ''
  },

  /**
   * 切换工具
   */
  switchTool(e) {
    const tool = e.currentTarget.dataset.tool;
    this.setData({ currentTool: tool });
  },

  /**
   * ========== 比容量计算 ==========
   */

  handleCapacityInput(e) {
    this.setData({ capacity: e.detail.value });
  },

  handleMassInput(e) {
    this.setData({ mass: e.detail.value });
  },

  handleRatioInput(e) {
    this.setData({ activeMaterialRatio: e.detail.value });
  },

  handleDensityInput(e) {
    this.setData({ density: e.detail.value });
  },

  handleMolWeightInput(e) {
    this.setData({ molWeight: e.detail.value });
  },

  handleElectronTransferInput(e) {
    this.setData({ electronTransfer: e.detail.value });
  },

  calculateSpecific() {
    const { capacity, mass, activeMaterialRatio, density } = this.data;

    if (!capacity || !mass) {
      wx.showToast({
        title: '请输入容量和质量',
        icon: 'none'
      });
      return;
    }

    const result = calculateSpecificCapacity(
      parseFloat(capacity),
      parseFloat(mass),
      parseFloat(activeMaterialRatio) || 100
    );

    if (result.error) {
      wx.showToast({
        title: result.error,
        icon: 'none',
        duration: 3000
      });
      return;
    }

    let resultText = `⚡ 比容量计算结果\n\n`;
    resultText += `重量比容量：${result.specificCapacity} ${result.unit}\n\n`;
    resultText += `📋 计算详情：\n`;
    resultText += `• 容量：${result.capacity} mAh\n`;
    resultText += `• 质量：${result.mass} mg (${result.mass/1000}g)\n`;
    resultText += `• 活性物质占比：${result.ratio}%\n\n`;
    resultText += `📐 ${result.formula}`;

    // 如果输入了密度，计算体积比容量
    if (density && parseFloat(density) > 0) {
      const volResult = calculateVolumetricCapacity(result.specificCapacity, parseFloat(density));
      if (!volResult.error) {
        resultText += `\n\n📦 体积比容量：${volResult.volumetricCapacity} ${volResult.unit}\n`;
        resultText += `（基于密度 ${volResult.density} g/cm³）`;
      }
    }

    this.setData({
      specificResult: result,
      specificResultText: resultText
    });

    historyService.add({
      tool: '电池性能-比容量',
      input: `${capacity}mAh, ${mass}mg`,
      result: `${result.specificCapacity} mAh/g`
    });
  },

  calculateTheoretical() {
    const { molWeight, electronTransfer } = this.data;

    if (!molWeight || !electronTransfer) {
      wx.showToast({
        title: '请输入分子量和电子转移数',
        icon: 'none'
      });
      return;
    }

    const result = calculateTheoreticalCapacity(
      parseFloat(molWeight),
      parseInt(electronTransfer)
    );

    if (result.error) {
      wx.showToast({
        title: result.error,
        icon: 'none',
        duration: 3000
      });
      return;
    }

    let resultText = `🔬 理论比容量计算结果\n\n`;
    resultText += `理论比容量：${result.theoreticalCapacity} ${result.unit}\n\n`;
    resultText += `📋 计算详情：\n`;
    resultText += `• 分子量：${result.molWeight} g/mol\n`;
    resultText += `• 电子转移数：${result.electronTransfer}\n\n`;
    resultText += `📐 ${result.formula}\n\n`;
    resultText += `💡 ${result.note}`;

    this.setData({
      theoreticalResult: result,
      specificResultText: resultText
    });
  },

  /**
   * ========== 库伦效率计算 ==========
   */

  handleChargeCapacityInput(e) {
    this.setData({ chargeCapacity: e.detail.value });
  },

  handleDischargeCapacityInput(e) {
    this.setData({ dischargeCapacity: e.detail.value });
  },

  handleCycleNumberInput(e) {
    this.setData({ cycleNumber: e.detail.value });
  },

  calculateCoulombic() {
    const { chargeCapacity, dischargeCapacity, cycleNumber } = this.data;

    if (!chargeCapacity || !dischargeCapacity) {
      wx.showToast({
        title: '请输入充放电容量',
        icon: 'none'
      });
      return;
    }

    const result = calculateCoulombicEfficiency(
      parseFloat(chargeCapacity),
      parseFloat(dischargeCapacity),
      cycleNumber ? parseInt(cycleNumber) : null
    );

    if (result.error) {
      wx.showToast({
        title: result.error,
        icon: 'none',
        duration: 3000
      });
      return;
    }

    let resultText = `🔋 库伦效率计算结果\n\n`;
    resultText += `${result.type}库伦效率：${result.coulombicEfficiency}%\n\n`;
    resultText += `📋 计算详情：\n`;
    resultText += `• 充电容量：${result.chargeCapacity} mAh\n`;
    resultText += `• 放电容量：${result.dischargeCapacity} mAh\n`;
    resultText += `• 不可逆损失：${result.irreversibleLoss} mAh (${result.lossPercentage}%)\n\n`;
    resultText += `📐 ${result.formula}\n\n`;
    resultText += `${result.qualityNote}`;

    this.setData({
      coulombicResult: result,
      coulombicResultText: resultText
    });

    historyService.add({
      tool: '电池性能-库伦效率',
      input: `充${chargeCapacity}mAh, 放${dischargeCapacity}mAh`,
      result: `CE=${result.coulombicEfficiency}%`
    });
  },

  /**
   * ========== 容量保持率计算 ==========
   */

  handleRetentionDataInput(e) {
    this.setData({ retentionDataInput: e.detail.value });
  },

  calculateRetention() {
    const { retentionDataInput } = this.data;

    if (!retentionDataInput.trim()) {
      wx.showToast({
        title: '请输入循环数据',
        icon: 'none'
      });
      return;
    }

    // 解析输入
    const lines = retentionDataInput.trim().split('\n');
    const capacities = [];

    for (const line of lines) {
      const parts = line.trim().split(/[,，\s]+/);
      if (parts.length >= 2) {
        capacities.push({
          cycle: parseInt(parts[0]),
          capacity: parseFloat(parts[1])
        });
      }
    }

    if (capacities.length < 2) {
      wx.showToast({
        title: '至少需要2个数据点',
        icon: 'none'
      });
      return;
    }

    const result = calculateCapacityRetention(capacities);

    if (result.error) {
      wx.showToast({
        title: result.error,
        icon: 'none',
        duration: 3000
      });
      return;
    }

    let resultText = `📉 容量保持率分析结果\n\n`;
    resultText += `初始容量：${result.initialCapacity} mAh/g\n`;
    resultText += `最终容量：${result.finalCapacity} mAh/g\n`;
    resultText += `总循环数：${result.totalCycles}\n`;
    resultText += `容量保持率：${result.retention}%\n`;
    resultText += `衰减速率：${result.decayRate}%/cycle\n\n`;
    resultText += `${result.stabilityNote}\n\n`;
    resultText += `📊 详细数据：\n`;
    resultText += `循环 | 容量 | 保持率\n`;
    resultText += `${'─'.repeat(25)}\n`;

    result.retentionData.forEach(point => {
      resultText += `${point.cycle.toString().padEnd(6)} | ${point.capacity.padEnd(8)} | ${point.retention}%\n`;
    });

    this.setData({
      retentionResult: result,
      retentionResultText: resultText
    });

    historyService.add({
      tool: '电池性能-容量保持率',
      input: `${capacities.length}个循环点`,
      result: `保持率${result.retention}%`
    });
  },

  /**
   * ========== 倍率性能计算 ==========
   */

  handleRateDataInput(e) {
    this.setData({ rateDataInput: e.detail.value });
  },

  calculateRate() {
    const { rateDataInput } = this.data;

    if (!rateDataInput.trim()) {
      wx.showToast({
        title: '请输入倍率数据',
        icon: 'none'
      });
      return;
    }

    // 解析输入
    const lines = rateDataInput.trim().split('\n');
    const rateData = [];

    for (const line of lines) {
      const parts = line.trim().split(/[,，\s]+/);
      if (parts.length >= 2) {
        rateData.push({
          rate: parseFloat(parts[0]),
          capacity: parseFloat(parts[1])
        });
      }
    }

    if (rateData.length < 2) {
      wx.showToast({
        title: '至少需要2个倍率数据点',
        icon: 'none'
      });
      return;
    }

    const result = calculateRatePerformance(rateData);

    if (result.error) {
      wx.showToast({
        title: result.error,
        icon: 'none',
        duration: 3000
      });
      return;
    }

    let resultText = `⚡ 倍率性能分析结果\n\n`;
    resultText += `基准倍率：${result.baseRate}\n`;
    resultText += `基准容量：${result.baseCapacity} mAh/g\n`;
    resultText += `最高倍率：${result.highestRate}\n`;
    resultText += `高倍率容量：${result.highRateCapacity} mAh/g\n`;
    resultText += `高倍率保持率：${result.highRateRetention}%\n\n`;
    resultText += `${result.ratePerformanceNote}\n\n`;
    resultText += `📊 详细数据：\n`;
    resultText += `倍率 | 容量 | 保持率\n`;
    resultText += `${'─'.repeat(25)}\n`;

    result.performanceData.forEach(point => {
      resultText += `${point.rateText.padEnd(6)} | ${point.capacity.padEnd(8)} | ${point.retention}%\n`;
    });

    this.setData({
      rateResult: result,
      rateResultText: resultText
    });

    historyService.add({
      tool: '电池性能-倍率性能',
      input: `${rateData.length}个倍率`,
      result: `高倍率保持${result.highRateRetention}%`
    });
  },

  /**
   * 清空结果
   */
  clearResult() {
    const { currentTool } = this.data;

    switch (currentTool) {
      case 'specific-capacity':
        this.setData({
          capacity: '',
          mass: '',
          density: '',
          molWeight: '',
          electronTransfer: '',
          specificResult: null,
          specificResultText: '',
          theoreticalResult: null
        });
        break;
      case 'coulombic':
        this.setData({
          chargeCapacity: '',
          dischargeCapacity: '',
          cycleNumber: '',
          coulombicResult: null,
          coulombicResultText: ''
        });
        break;
      case 'retention':
        this.setData({
          retentionDataInput: '',
          retentionResult: null,
          retentionResultText: ''
        });
        break;
      case 'rate':
        this.setData({
          rateDataInput: '',
          rateResult: null,
          rateResultText: ''
        });
        break;
    }
  },

  /**
   * 导出结果
   */
  exportResult() {
    const { currentTool, specificResultText, coulombicResultText, retentionResultText, rateResultText } = this.data;

    let text = '';
    switch (currentTool) {
      case 'specific-capacity':
        text = specificResultText;
        break;
      case 'coulombic':
        text = coulombicResultText;
        break;
      case 'retention':
        text = retentionResultText;
        break;
      case 'rate':
        text = rateResultText;
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

