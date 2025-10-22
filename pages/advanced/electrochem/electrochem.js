// 电化学计算页面

const { listReferenceNames, refIdByIndex, convertVsNHE, nernstE } = require('../../../utils/electrochem');
const {
  analyzeCVPeakCurrent,
  fitEISCircuit,
  calculateTafelSlope
} = require('../../../utils/electrochemistry-enhanced');
const { historyService } = require('../../../services/history');
const { generateShareCard } = require('../utils/shareHelper');
const { getPresets } = require('../../../utils/input-presets');

Page({
  data: {
    tools: [
      { id: 'convert', name: '电位换算', icon: '🔄' },
      { id: 'nernst', name: 'Nernst方程', icon: '⚛️' },
      { id: 'cv', name: 'CV分析', icon: '📈' },
      { id: 'eis', name: 'EIS拟合', icon: '⚡' },
      { id: 'tafel', name: 'Tafel斜率', icon: '📊' }
    ],
    currentTool: 'convert',
    
    // 电位换算
    references: [],
    fromRefIndex: 0,
    toRefIndex: 3,
    potential: '',
    convertResult: '',
    convertResultText: '',
    
    // Nernst计算
    e0: '',
    temperature: '25',
    electronNum: '',
    reactionQ: '',
    nernstResult: '',
    nernstResultText: '',
    nernstHint: '',
    
    // 预设值
    potentialPresets: [],
    temperaturePresets: [],
    electronNumPresets: [],
    
    // CV分析
    cvPeakCurrent: '',
    cvScanRate: '',
    cvArea: '',
    cvConcentration: '',
    cvResult: null,
    cvResultText: '',
    
    // EIS拟合
    eisCircuitTypes: ['Randles', 'RC', 'RQ', 'RW'],
    eisCircuitIndex: 0,
    eisRs: '',
    eisRct: '',
    eisW: '',
    eisCPE_Q: '',
    eisCPE_n: '',
    eisResult: null,
    eisResultText: '',
    
    // Tafel斜率
    tafelData: '',
    tafelDataPlaceholder: '输入格式：过电位(V),电流密度(A/cm²)\n例如：\n0.05,1e-6\n0.10,5e-6\n0.15,2e-5',
    tafelRegion: 'both',
    tafelRegionOptions: ['阳极+阴极', '仅阳极', '仅阴极'],
    tafelResult: null,
    tafelResultText: ''
  },

  onLoad() {
    const references = listReferenceNames();
    this.setData({ 
      references,
      potentialPresets: getPresets('electrochem', 'potential'),
      temperaturePresets: getPresets('electrochem', 'temperature'),
      electronNumPresets: getPresets('electrochem', 'electronNum')
    });
  },

  switchTool(e) {
    this.setData({ currentTool: e.currentTarget.dataset.tool });
  },

  /**
   * 电位换算
   */
  handleFromRefChange(e) {
    this.setData({ fromRefIndex: Number(e.detail.value) });
  },

  handleToRefChange(e) {
    this.setData({ toRefIndex: Number(e.detail.value) });
  },

  handlePotentialInput(e) {
    this.setData({ potential: e.detail.value });
  },
  
  handlePotentialChange(e) {
    this.setData({ potential: e.detail.value });
    if (e.detail.value) {
      this.convertPotential();
    }
  },

  convertPotential() {
    const { fromRefIndex, toRefIndex, potential } = this.data;
    
    if (!potential) {
      wx.showToast({ title: '请输入电位值', icon: 'none' });
      return;
    }

    const E = Number(potential);
    if (isNaN(E)) {
      wx.showToast({ title: '请输入有效数值', icon: 'none' });
      return;
    }

    // 先转换为 vs NHE
    const fromRefId = refIdByIndex(fromRefIndex);
    const resultFrom = convertVsNHE(E, fromRefId, 25, 0);
    
    // 检查错误
    if (resultFrom.error) {
      wx.showToast({ title: resultFrom.error, icon: 'none', duration: 3000 });
      return;
    }
    
    const E_NHE = resultFrom.E_vs_NHE;
    
    // 再从 NHE 转换到目标参比
    const toRefId = refIdByIndex(toRefIndex);
    const resultTo = convertVsNHE(0, toRefId, 25, 0);
    
    if (resultTo.error) {
      wx.showToast({ title: resultTo.error, icon: 'none', duration: 3000 });
      return;
    }
    
    const E_to = resultTo.E_vs_NHE;
    const E_final = E_NHE - E_to;

    const convertResult = `${E_final.toFixed(4)} V`;
    const convertResultText = `源电位：${E.toFixed(4)} V vs ${this.data.references[fromRefIndex]}\n换算后：${E_final.toFixed(4)} V vs ${this.data.references[toRefIndex]}\n\nvs NHE：${E_NHE.toFixed(4)} V`;

    this.setData({ convertResult, convertResultText });

    historyService.add({
      type: 'electrochem',
      title: '电极电位换算',
      input: `${E}V (${this.data.references[fromRefIndex]})`,
      result: `${E_final.toFixed(4)}V (${this.data.references[toRefIndex]})`
    });
  },

  resetConvert() {
    this.setData({ potential: '', convertResult: '', convertResultText: '' });
  },

  /**
   * Nernst计算
   */
  handleE0Input(e) {
    this.setData({ e0: e.detail.value });
  },

  handleTemperatureInput(e) {
    this.setData({ temperature: e.detail.value });
  },

  handleElectronNumInput(e) {
    this.setData({ electronNum: e.detail.value });
  },

  handleQInput(e) {
    this.setData({ reactionQ: e.detail.value });
  },
  
  handleE0Change(e) {
    this.setData({ e0: e.detail.value });
  },
  
  handleTemperatureChange(e) {
    this.setData({ temperature: e.detail.value });
  },
  
  handleElectronNumChange(e) {
    this.setData({ electronNum: e.detail.value });
  },
  
  handleQChange(e) {
    this.setData({ reactionQ: e.detail.value });
  },

  calculateNernst() {
    const { e0, temperature, electronNum, reactionQ } = this.data;
    
    if (!e0 || !electronNum || !reactionQ) {
      wx.showToast({ title: '请输入所有必填参数', icon: 'none' });
      return;
    }

    const E0 = Number(e0);
    const T = Number(temperature) || 25;
    const n = Number(electronNum);
    const Q = Number(reactionQ);

    if (isNaN(E0) || isNaN(n) || isNaN(Q) || n <= 0 || Q <= 0) {
      wx.showToast({ title: '请输入有效数值', icon: 'none' });
      return;
    }

    const result = nernstE(E0, n, T, Q);
    if (result.error) {
      wx.showToast({ title: result.error, icon: 'none' });
      return;
    }

    const nernstResult = `E = ${result.E.toFixed(4)} V`;
    const nernstResultText = `实际电位 E = ${result.E.toFixed(4)} V\n\n参数：\nE° = ${E0} V\nT = ${T} °C\nn = ${n}\nQ = ${Q}`;
    const nernstHint = `偏离标准电位：${(result.E - E0).toFixed(4)} V`;

    this.setData({ nernstResult, nernstResultText, nernstHint });

    historyService.add({
      type: 'electrochem',
      title: 'Nernst方程',
      input: `E°=${E0}V, n=${n}, Q=${Q}`,
      result: `E=${result.E.toFixed(4)}V`
    });
  },

  resetNernst() {
    this.setData({
      e0: '',
      temperature: '25',
      electronNum: '',
      reactionQ: '',
      nernstResult: '',
      nernstResultText: '',
      nernstHint: ''
    });
  },

  /**
   * 生成分享卡片 (v6.0.0新增)
   */
  async generateCard() {
    const { currentTool, convertResult, nernstResult } = this.data;
    
    if (!convertResult && !nernstResult) {
      wx.showToast({
        title: '请先完成计算',
        icon: 'none'
      });
      return;
    }

    if (currentTool === 'convert' && convertResult) {
      // 电位换算
      const { fromRefIndex, toRefIndex, references, potential } = this.data;

      const inputs = {
        '源电位': `${potential} V`,
        '源参比电极': references[fromRefIndex],
        '目标参比电极': references[toRefIndex]
      };

      const results = {
        '换算结果': convertResult
      };

      await generateShareCard('电化学计算', 'electrochem', inputs, results, '基于标准电极电位');
    } else if (currentTool === 'nernst' && nernstResult) {
      // Nernst方程
      const { e0, temperature, electronNum, reactionQ, nernstHint } = this.data;

      const inputs = {
        '标准电位E°': `${e0} V`,
        '温度': `${temperature} °C`,
        '电子转移数': electronNum,
        '反应商Q': reactionQ
      };

      const results = {
        '实际电位E': nernstResult,
        '偏离标准电位': nernstHint
      };

      await generateShareCard('电化学计算', 'electrochem', inputs, results, 'Nernst方程: E = E° - (RT/nF)lnQ');
    }
  },

  /**
   * ========== CV分析 ==========
   */
  handleCVPeakCurrentInput(e) {
    this.setData({ cvPeakCurrent: e.detail.value });
  },
  
  handleCVScanRateInput(e) {
    this.setData({ cvScanRate: e.detail.value });
  },
  
  handleCVAreaInput(e) {
    this.setData({ cvArea: e.detail.value });
  },
  
  handleCVConcentrationInput(e) {
    this.setData({ cvConcentration: e.detail.value });
  },
  
  calculateCV() {
    const { cvPeakCurrent, cvScanRate, cvArea, cvConcentration } = this.data;
    
    if (!cvPeakCurrent || !cvScanRate || !cvArea) {
      wx.showToast({ title: '请输入峰电流、扫速和电极面积', icon: 'none' });
      return;
    }
    
    const cvData = {
      peakCurrent: Number(cvPeakCurrent),
      scanRate: Number(cvScanRate),
      area: Number(cvArea),
      concentration: cvConcentration ? Number(cvConcentration) : null
    };
    
    const result = analyzeCVPeakCurrent(cvData);
    
    if (result.error) {
      wx.showToast({ title: result.error, icon: 'none', duration: 3000 });
      return;
    }
    
    let resultText = `📈 CV曲线峰电流分析结果\n\n`;
    resultText += `峰电流: ${result.peakCurrent} ${result.peakCurrentUnit}\n`;
    resultText += `电流密度: ${result.currentDensity} ${result.currentDensityUnit}\n`;
    resultText += `扫速: ${result.scanRate} ${result.scanRateUnit}\n`;
    resultText += `电极面积: ${result.area} ${result.areaUnit}\n`;
    
    if (result.diffusionCoefficient) {
      resultText += `\n扩散系数: ${result.diffusionCoefficient} ${result.diffusionCoefficientUnit}\n`;
    }
    
    resultText += `\n分析方法: ${result.analysis.method}\n`;
    resultText += `\n建议:\n${result.recommendations.join('\n')}`;
    
    this.setData({ cvResult: result, cvResultText: resultText });
    
    historyService.add({
      type: 'electrochem',
      title: 'CV曲线分析',
      input: `ip=${cvPeakCurrent}A, v=${cvScanRate}V/s`,
      result: `j=${result.currentDensity}mA/cm²`
    });
  },
  
  resetCV() {
    this.setData({
      cvPeakCurrent: '',
      cvScanRate: '',
      cvArea: '',
      cvConcentration: '',
      cvResult: null,
      cvResultText: ''
    });
  },

  /**
   * ========== EIS拟合 ==========
   */
  handleEISCircuitChange(e) {
    this.setData({ eisCircuitIndex: Number(e.detail.value) });
  },
  
  handleEISRsInput(e) {
    this.setData({ eisRs: e.detail.value });
  },
  
  handleEISRctInput(e) {
    this.setData({ eisRct: e.detail.value });
  },
  
  handleEISWInput(e) {
    this.setData({ eisW: e.detail.value });
  },
  
  handleEISCPEQInput(e) {
    this.setData({ eisCPE_Q: e.detail.value });
  },
  
  handleEISCPENInput(e) {
    this.setData({ eisCPE_n: e.detail.value });
  },
  
  calculateEIS() {
    const { eisCircuitTypes, eisCircuitIndex, eisRs, eisRct, eisW, eisCPE_Q, eisCPE_n } = this.data;
    
    const circuitType = eisCircuitTypes[eisCircuitIndex];
    const eisData = {};
    
    if (eisRs) eisData.Rs = Number(eisRs);
    if (eisRct) eisData.Rct = Number(eisRct);
    if (eisW) eisData.W = Number(eisW);
    if (eisCPE_Q) eisData.CPE_Q = Number(eisCPE_Q);
    if (eisCPE_n) eisData.CPE_n = Number(eisCPE_n);
    
    const result = fitEISCircuit(circuitType, eisData);
    
    if (result.error) {
      wx.showToast({ title: result.error, icon: 'none', duration: 3000 });
      return;
    }
    
    let resultText = `⚡ EIS等效电路分析结果\n\n`;
    resultText += `电路类型: ${result.circuitName}\n`;
    resultText += `电路公式: ${result.formula}\n\n`;
    
    resultText += `元件说明:\n`;
    Object.entries(result.components).forEach(([key, comp]) => {
      resultText += `• ${key}: ${comp.name} (${comp.unit})\n`;
    });
    
    if (Object.keys(result.parameters).length > 0) {
      resultText += `\n输入参数:\n`;
      Object.entries(result.parameters).forEach(([key, value]) => {
        resultText += `• ${key} = ${value}\n`;
      });
    }
    
    resultText += `\n特征:\n${result.features.join('\n')}`;
    resultText += `\n\n建议软件: ${result.fittingSoftware.slice(0, 2).join(', ')}`;
    
    this.setData({ eisResult: result, eisResultText: resultText });
    
    historyService.add({
      type: 'electrochem',
      title: 'EIS等效电路',
      input: circuitType,
      result: result.circuitName
    });
  },
  
  resetEIS() {
    this.setData({
      eisRs: '',
      eisRct: '',
      eisW: '',
      eisCPE_Q: '',
      eisCPE_n: '',
      eisResult: null,
      eisResultText: ''
    });
  },

  /**
   * ========== Tafel斜率 ==========
   */
  handleTafelDataInput(e) {
    this.setData({ tafelData: e.detail.value });
  },
  
  fillTafelExample() {
    const exampleData = '0.05,1e-6\n0.10,5e-6\n0.15,2e-5\n0.20,8e-5\n0.25,3e-4';
    this.setData({ tafelData: exampleData });
    wx.showToast({ title: '已填充示例数据', icon: 'success', duration: 1500 });
  },
  
  handleTafelRegionChange(e) {
    const index = Number(e.detail.value);
    const regions = ['both', 'anodic', 'cathodic'];
    this.setData({ tafelRegion: regions[index] });
  },
  
  calculateTafel() {
    const { tafelData, tafelRegion } = this.data;
    
    if (!tafelData.trim()) {
      wx.showToast({ title: '请输入极化数据', icon: 'none' });
      return;
    }
    
    // 解析输入数据
    const lines = tafelData.trim().split('\n');
    const polarizationData = [];
    
    for (const line of lines) {
      const parts = line.trim().split(/[,，\s]+/);
      if (parts.length >= 2) {
        const overpotential = parseFloat(parts[0]);
        const currentDensity = parseFloat(parts[1]);
        if (!isNaN(overpotential) && !isNaN(currentDensity)) {
          polarizationData.push({ overpotential, currentDensity });
        }
      }
    }
    
    if (polarizationData.length < 3) {
      wx.showToast({ title: '至少需要3个有效数据点', icon: 'none', duration: 3000 });
      return;
    }
    
    const result = calculateTafelSlope(polarizationData, tafelRegion);
    
    if (result.error) {
      wx.showToast({ title: result.error, icon: 'none', duration: 3000 });
      return;
    }
    
    let resultText = `📊 Tafel斜率分析结果\n\n`;
    resultText += `分析区域: ${this.data.tafelRegionOptions[['both','anodic','cathodic'].indexOf(tafelRegion)]}\n\n`;
    
    if (result.anodic) {
      resultText += `阳极 Tafel 斜率:\n`;
      resultText += `• b = ${result.anodic.tafelSlope} ${result.anodic.tafelSlopeUnit}\n`;
      resultText += `• j₀ = ${result.anodic.exchangeCurrentDensity} ${result.anodic.exchangeCurrentDensityUnit}\n`;
      resultText += `• 数据点: ${result.anodic.dataPoints}\n`;
      resultText += `• R² = ${result.anodic.rSquared} (${result.anodic.fitQuality})\n`;
      resultText += `• 线性区域: ${result.anodic.linearRange}\n\n`;
    }
    
    if (result.cathodic) {
      resultText += `阴极 Tafel 斜率:\n`;
      resultText += `• b = ${result.cathodic.tafelSlope} ${result.cathodic.tafelSlopeUnit}\n`;
      resultText += `• j₀ = ${result.cathodic.exchangeCurrentDensity} ${result.cathodic.exchangeCurrentDensityUnit}\n`;
      resultText += `• 数据点: ${result.cathodic.dataPoints}\n`;
      resultText += `• R² = ${result.cathodic.rSquared} (${result.cathodic.fitQuality})\n`;
      resultText += `• 线性区域: ${result.cathodic.linearRange}\n\n`;
    }
    
    resultText += `理论基础:\n${result.theory.equation}\n`;
    resultText += `\n应用:\n${result.applications.join('\n')}`;
    
    this.setData({ tafelResult: result, tafelResultText: resultText });
    
    historyService.add({
      type: 'electrochem',
      title: 'Tafel斜率',
      input: `${polarizationData.length}点`,
      result: result.anodic ? `b=${result.anodic.tafelSlope}mV/dec` : '已完成'
    });
  },
  
  resetTafel() {
    this.setData({
      tafelData: '',
      tafelResult: null,
      tafelResultText: ''
    });
  },

  onShareAppMessage() {
    return {
      title: '电化学计算 - 材料化学科研工具箱',
      path: '/pages/advanced/electrochem/electrochem'
    };
  }
});

