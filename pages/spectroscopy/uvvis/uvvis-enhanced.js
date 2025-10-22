// UV-Vis光谱分析工具（增强版）

const { historyService } = require('../../../services/history');
const { generateShareCard } = require('../utils/shareHelper');
const { getPresets } = require('../../../utils/input-presets');
const {
  calculateBandgap,
  kubelkaMunkTransform,
  calculateAbsorptionCoefficient,
  identifyAbsorptionEdge,
  wavelengthToEnergy,
  energyToWavelength
} = require('../../../utils/tauc-plot');
const {
  gaussianPeakFitting,
  lorentzianPeakFitting,
  identifyExcitonPeaks,
  calculateUrbachEnergy
} = require('../../../utils/uvvis');

Page({
  data: {
    // 工具选择
    tools: [
      { id: 'beer-lambert', name: 'Beer-Lambert', icon: '🧪' },
      { id: 'tauc-plot', name: 'Tauc Plot', icon: '📈' },
      { id: 'k-m', name: 'K-M转换', icon: '🔄' },
      { id: 'peak-fitting', name: '多峰拟合', icon: '📊' },
      { id: 'exciton', name: '激子峰', icon: '💫' },
      { id: 'urbach', name: 'Urbach能', icon: '📉' }
    ],
    currentTool: 'beer-lambert',

    // Beer-Lambert部分
    modes: ['计算吸光度 A', '计算浓度 c', '计算摩尔吸光系数 ε'],
    modeIndex: 0,
    absorbance: '',
    epsilon: '',
    concentration: '',
    pathlength: '',
    beerResult: '',
    beerResultText: '',
    
    // 预设值
    absorbancePresets: [
      { label: '0.5', value: '0.5' },
      { label: '1.0', value: '1.0' },
      { label: '1.5', value: '1.5' },
      { label: '2.0', value: '2.0' }
    ],
    wavelengthPresets: [
      { label: '400 nm', value: '400' },
      { label: '500 nm', value: '500' },
      { label: '600 nm', value: '600' },
      { label: '700 nm', value: '700' }
    ],

    // Tauc Plot部分
    bandgapTypes: ['直接带隙', '间接带隙'],
    bandgapTypeIndex: 0,
    taucDataInput: '',
    taucDataPlaceholder: '输入格式：波长(nm),吸光度\n例如：\n300,0.5\n350,0.8\n400,1.2\n450,0.9\n500,0.3',
    taucResult: null,
    taucResultText: '',
    quickWavelength: '',
    quickAbsorbance: '',

    // K-M转换部分
    kmDataInput: '',
    kmDataPlaceholder: '输入格式：波长(nm),反射率(%)\n例如：\n300,45\n350,50\n400,55',
    kmResult: null,
    kmResultText: '',
    
    // 多峰拟合部分
    peakFittingData: '',
    peakFittingDataPlaceholder: '输入格式：波长(nm),吸光度\n例如：\n400,0.5\n450,0.8\n500,1.2\n550,0.9\n600,0.4',
    numPeaks: 2,
    fittingType: 'gaussian',
    fittingTypes: ['高斯拟合', '洛伦兹拟合'],
    peakFittingResult: null,
    peakFittingResultText: '',
    
    // 激子峰识别部分
    excitonData: '',
    excitonDataPlaceholder: '输入格式：波长(nm),吸光度\n例如：\n350,0.3\n400,0.6\n450,0.8\n500,0.5',
    excitonBandgap: '',
    excitonResult: null,
    excitonResultText: '',
    
    // Urbach能部分
    urbachData: '',
    urbachDataPlaceholder: '输入格式：波长(nm),吸光度\n例如：\n400,0.2\n450,0.4\n500,0.7\n550,1.1\n600,1.5',
    urbachBandgap: '',
    urbachResult: null,
    urbachResultText: ''
  },

  /**
   * 切换工具
   */
  switchTool(e) {
    const tool = e.currentTarget.dataset.tool;
    this.setData({ currentTool: tool });
  },

  /**
   * ========== Beer-Lambert 部分 ==========
   */

  handleModeChange(e) {
    const index = Number(e.detail.value);
    this.setData({ 
      modeIndex: index,
      beerResult: '',
      beerResultText: ''
    });
  },

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

  calculateBeerLambert() {
    const { modeIndex, absorbance, epsilon, concentration, pathlength } = this.data;

    if (modeIndex === 0) {
      // 计算吸光度
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
      const beerResult = `A = ${A.toFixed(4)}`;
      const beerResultText = `吸光度 A = ${A.toFixed(4)}\n\n计算参数：\nε = ${e} L·mol⁻¹·cm⁻¹\nc = ${c} mol·L⁻¹\nl = ${l} cm\n\n${A > 2 ? '⚠️ 吸光度过高，可能超出线性范围' : A < 0.1 ? '💡 吸光度较低，误差可能较大' : '✓ 吸光度在合理范围内'}`;

      this.setData({ beerResult, beerResultText, absorbance: A.toFixed(4) });

      historyService.add({
        tool: 'UV-Vis - Beer-Lambert',
        input: `ε=${e}, c=${c}, l=${l}`,
        result: `A=${A.toFixed(4)}`
      });

    } else if (modeIndex === 1) {
      // 计算浓度
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
      const beerResult = `c = ${c.toExponential(4)} mol·L⁻¹`;
      const beerResultText = `浓度 c = ${c.toExponential(4)} mol·L⁻¹\n\n计算参数：\nA = ${A}\nε = ${e} L·mol⁻¹·cm⁻¹\nl = ${l} cm\n\n${A > 2 ? '⚠️ 吸光度过高，结果可能不准确' : '✓ 计算完成'}`;

      this.setData({ beerResult, beerResultText, concentration: c.toExponential(4) });

      historyService.add({
        tool: 'UV-Vis - Beer-Lambert',
        input: `A=${A}, ε=${e}, l=${l}`,
        result: `c=${c.toExponential(4)} mol/L`
      });

    } else if (modeIndex === 2) {
      // 计算摩尔吸光系数
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
      const beerResult = `ε = ${e.toFixed(2)} L·mol⁻¹·cm⁻¹`;
      const beerResultText = `摩尔吸光系数 ε = ${e.toFixed(2)} L·mol⁻¹·cm⁻¹\n\n计算参数：\nA = ${A}\nc = ${c} mol·L⁻¹\nl = ${l} cm\n\n💡 ε值是物质在特定波长下的特征参数`;

      this.setData({ beerResult, beerResultText, epsilon: e.toFixed(2) });

      historyService.add({
        tool: 'UV-Vis - Beer-Lambert',
        input: `A=${A}, c=${c}, l=${l}`,
        result: `ε=${e.toFixed(2)} L·mol⁻¹·cm⁻¹`
      });
    }
  },

  /**
   * ========== Tauc Plot 部分 ==========
   */

  handleBandgapTypeChange(e) {
    this.setData({ bandgapTypeIndex: Number(e.detail.value) });
  },

  handleTaucDataInput(e) {
    this.setData({ taucDataInput: e.detail.value });
  },

  handleQuickWavelengthInput(e) {
    this.setData({ quickWavelength: e.detail.value });
  },

  handleQuickAbsorbanceInput(e) {
    this.setData({ quickAbsorbance: e.detail.value });
  },

  calculateTaucPlot() {
    const { taucDataInput, bandgapTypeIndex } = this.data;

    if (!taucDataInput.trim()) {
      wx.showToast({
        title: '请输入光谱数据',
        icon: 'none'
      });
      return;
    }

    // 解析输入数据
    const lines = taucDataInput.trim().split('\n');
    const absorptionData = [];

    for (const line of lines) {
      const parts = line.trim().split(/[,，\s]+/);
      if (parts.length >= 2) {
        const wavelength = parseFloat(parts[0]);
        const absorbance = parseFloat(parts[1]);
        if (!isNaN(wavelength) && !isNaN(absorbance)) {
          absorptionData.push({ wavelength, absorbance });
        }
      }
    }

    if (absorptionData.length < 5) {
      wx.showToast({
        title: '至少需要5个有效数据点',
        icon: 'none',
        duration: 3000
      });
      return;
    }

    const type = bandgapTypeIndex === 0 ? 'direct' : 'indirect';
    const result = calculateBandgap(absorptionData, type);

    if (result.error) {
      wx.showToast({
        title: result.error,
        icon: 'none',
        duration: 3000
      });
      return;
    }

    // 格式化结果
    let resultText = `✨ ${result.type}带隙计算结果\n\n`;
    resultText += `🎯 带隙 Eg = ${result.bandgap} ${result.unit}\n`;
    resultText += `📏 对应波长 = ${result.wavelength} ${result.wavelengthUnit}\n\n`;
    resultText += `📊 拟合详情：\n`;
    resultText += `• 拟合方程：${result.fittingEquation}\n`;
    resultText += `• R² = ${result.rSquared} (${result.fitQuality === 'excellent' ? '优秀' : result.fitQuality === 'good' ? '良好' : result.fitQuality === 'fair' ? '一般' : '较差'})\n`;
    resultText += `• 线性区域点数：${result.linearRegion}\n`;
    resultText += `• Tauc指数 n = ${result.exponent}\n\n`;
    
    result.notes.forEach(note => {
      if (note) resultText += `${note}\n`;
    });

    this.setData({
      taucResult: result,
      taucResultText: resultText
    });

    historyService.add({
      tool: 'UV-Vis - Tauc Plot',
      input: `${result.type}, ${absorptionData.length}点`,
      result: `Eg=${result.bandgap}eV`
    });
  },

  /**
   * 快速模式：只输入吸收边
   */
  quickCalculate() {
    const { quickWavelength, quickAbsorbance } = this.data;

    if (!quickWavelength) {
      wx.showToast({
        title: '请输入吸收边波长',
        icon: 'none'
      });
      return;
    }

    const wavelength = parseFloat(quickWavelength);
    if (isNaN(wavelength) || wavelength <= 0) {
      wx.showToast({
        title: '请输入有效的波长值',
        icon: 'none'
      });
      return;
    }

    const energy = wavelengthToEnergy(wavelength);

    let resultText = `⚡ 快速估算结果\n\n`;
    resultText += `波长 λ = ${wavelength} nm\n`;
    resultText += `带隙 Eg ≈ ${energy.toFixed(3)} eV\n\n`;
    resultText += `💡 这是根据吸收边位置的粗略估算\n`;
    resultText += `建议使用完整的Tauc Plot分析获得精确带隙值`;

    this.setData({
      taucResultText: resultText
    });
  },

  /**
   * ========== K-M转换 部分 ==========
   */

  handleKmDataInput(e) {
    this.setData({ kmDataInput: e.detail.value });
  },

  calculateKM() {
    const { kmDataInput } = this.data;

    if (!kmDataInput.trim()) {
      wx.showToast({
        title: '请输入反射率数据',
        icon: 'none'
      });
      return;
    }

    // 解析输入数据
    const lines = kmDataInput.trim().split('\n');
    const reflectanceData = [];

    for (const line of lines) {
      const parts = line.trim().split(/[,，\s]+/);
      if (parts.length >= 2) {
        const wavelength = parseFloat(parts[0]);
        const reflectance = parseFloat(parts[1]);
        if (!isNaN(wavelength) && !isNaN(reflectance)) {
          reflectanceData.push({ wavelength, reflectance });
        }
      }
    }

    if (reflectanceData.length === 0) {
      wx.showToast({
        title: '未找到有效数据',
        icon: 'none'
      });
      return;
    }

    const result = kubelkaMunkTransform(reflectanceData);

    if (result.error) {
      wx.showToast({
        title: result.error,
        icon: 'none',
        duration: 3000
      });
      return;
    }

    // 格式化结果
    let resultText = `🔄 Kubelka-Munk转换结果\n\n`;
    resultText += `转换点数：${result.transformedData.length}\n\n`;
    resultText += `波长(nm) | R(%) | F(R)\n`;
    resultText += `${'─'.repeat(30)}\n`;

    result.transformedData.slice(0, 10).forEach(point => {
      resultText += `${point.wavelength.toFixed(0).padEnd(8)} | ${(point.reflectance * 100).toFixed(1).padEnd(6)} | ${point.fR.toFixed(4)}\n`;
    });

    if (result.transformedData.length > 10) {
      resultText += `... (共${result.transformedData.length}个点)\n`;
    }

    resultText += `\n💡 ${result.note}\n`;
    resultText += `📊 ${result.usage}`;

    this.setData({
      kmResult: result,
      kmResultText: resultText
    });

    historyService.add({
      tool: 'UV-Vis - K-M转换',
      input: `${reflectanceData.length}点`,
      result: '转换完成'
    });
  },

  /**
   * 清空当前工具结果
   */
  clearResult() {
    const { currentTool } = this.data;

    switch (currentTool) {
      case 'beer-lambert':
        this.setData({
          absorbance: '',
          epsilon: '',
          concentration: '',
          pathlength: '',
          beerResult: '',
          beerResultText: ''
        });
        break;
      case 'tauc-plot':
        this.setData({
          taucDataInput: '',
          quickWavelength: '',
          quickAbsorbance: '',
          taucResult: null,
          taucResultText: ''
        });
        break;
      case 'k-m':
        this.setData({
          kmDataInput: '',
          kmResult: null,
          kmResultText: ''
        });
        break;
      case 'peak-fitting':
        this.resetPeakFitting();
        break;
      case 'exciton':
        this.resetExciton();
        break;
      case 'urbach':
        this.resetUrbach();
        break;
    }
  },

  /**
   * 导出结果
   */
  exportResult() {
    const { currentTool, beerResultText, taucResultText, kmResultText, peakFittingResultText, excitonResultText, urbachResultText } = this.data;

    let text = '';
    switch (currentTool) {
      case 'beer-lambert':
        text = beerResultText;
        break;
      case 'tauc-plot':
        text = taucResultText;
        break;
      case 'k-m':
        text = kmResultText;
        break;
      case 'peak-fitting':
        text = peakFittingResultText;
        break;
      case 'exciton':
        text = excitonResultText;
        break;
      case 'urbach':
        text = urbachResultText;
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
  },

  /**
   * ========== 多峰拟合 ==========
   */
  handlePeakFittingDataInput(e) {
    this.setData({ peakFittingData: e.detail.value });
  },
  
  fillPeakFittingExample() {
    const exampleData = '400,0.5\n425,0.7\n450,0.9\n475,1.2\n500,1.0\n525,0.8\n550,0.6';
    this.setData({ peakFittingData: exampleData });
    wx.showToast({ title: '已填充示例数据', icon: 'success', duration: 1500 });
  },
  
  handleNumPeaksInput(e) {
    this.setData({ numPeaks: Number(e.detail.value) || 2 });
  },
  
  handleFittingTypeChange(e) {
    const index = Number(e.detail.value);
    this.setData({ fittingType: index === 0 ? 'gaussian' : 'lorentzian' });
  },
  
  calculatePeakFitting() {
    const { peakFittingData, numPeaks, fittingType } = this.data;
    
    if (!peakFittingData.trim()) {
      wx.showToast({ title: '请输入光谱数据', icon: 'none' });
      return;
    }
    
    // 解析输入数据
    const lines = peakFittingData.trim().split('\n');
    const spectrumData = [];
    
    for (const line of lines) {
      const parts = line.trim().split(/[,，\s]+/);
      if (parts.length >= 2) {
        const wavelength = parseFloat(parts[0]);
        const absorbance = parseFloat(parts[1]);
        if (!isNaN(wavelength) && !isNaN(absorbance)) {
          spectrumData.push({ wavelength, absorbance });
        }
      }
    }
    
    if (spectrumData.length < 10) {
      wx.showToast({ title: '至少需要10个有效数据点', icon: 'none', duration: 3000 });
      return;
    }
    
    const fittingFunction = fittingType === 'gaussian' ? gaussianPeakFitting : lorentzianPeakFitting;
    const result = fittingFunction(spectrumData, numPeaks);
    
    if (result.error) {
      wx.showToast({ title: result.error, icon: 'none', duration: 3000 });
      return;
    }
    
    let resultText = `📊 ${result.method}\n\n`;
    resultText += `检测到 ${result.numPeaks} 个峰\n`;
    resultText += `函数: ${result.gaussianFunction || result.lorentzianFunction}\n\n`;
    
    resultText += `峰参数:\n`;
    result.peakParams.forEach(peak => {
      resultText += `\n峰 ${peak.peakNumber}:\n`;
      resultText += `• 波长: ${peak.wavelength} ${peak.wavelengthUnit}\n`;
      resultText += `• 能量: ${peak.energy} ${peak.energyUnit}\n`;
      resultText += `• 强度: ${peak.intensity}\n`;
      resultText += `• FWHM: ${peak.fwhm} ${peak.fwhmUnit}\n`;
      resultText += `• 峰面积: ${peak.peakArea}\n`;
    });
    
    resultText += `\n说明:\n${result.notes.join('\n')}`;
    
    this.setData({ peakFittingResult: result, peakFittingResultText: resultText });
    
    historyService.add({
      tool: 'UV-Vis - 多峰拟合',
      input: `${spectrumData.length}点, ${numPeaks}峰`,
      result: `${result.method}`
    });
  },
  
  resetPeakFitting() {
    this.setData({
      peakFittingData: '',
      peakFittingResult: null,
      peakFittingResultText: ''
    });
  },

  /**
   * ========== 激子峰识别 ==========
   */
  handleExcitonDataInput(e) {
    this.setData({ excitonData: e.detail.value });
  },
  
  fillExcitonExample() {
    const exampleData = '350,0.3\n375,0.5\n400,0.7\n425,0.9\n450,1.0\n475,0.8\n500,0.5';
    this.setData({ excitonData: exampleData, excitonBandgap: '3.2' });
    wx.showToast({ title: '已填充示例数据', icon: 'success', duration: 1500 });
  },
  
  handleExcitonBandgapInput(e) {
    this.setData({ excitonBandgap: e.detail.value });
  },
  
  calculateExciton() {
    const { excitonData, excitonBandgap } = this.data;
    
    if (!excitonData.trim() || !excitonBandgap) {
      wx.showToast({ title: '请输入光谱数据和带隙值', icon: 'none' });
      return;
    }
    
    // 解析输入数据
    const lines = excitonData.trim().split('\n');
    const spectrumData = [];
    
    for (const line of lines) {
      const parts = line.trim().split(/[,，\s]+/);
      if (parts.length >= 2) {
        const wavelength = parseFloat(parts[0]);
        const absorbance = parseFloat(parts[1]);
        if (!isNaN(wavelength) && !isNaN(absorbance)) {
          spectrumData.push({ wavelength, absorbance });
        }
      }
    }
    
    if (spectrumData.length < 10) {
      wx.showToast({ title: '至少需要10个有效数据点', icon: 'none', duration: 3000 });
      return;
    }
    
    const bandgap = parseFloat(excitonBandgap);
    if (isNaN(bandgap) || bandgap <= 0) {
      wx.showToast({ title: '请输入有效的带隙值', icon: 'none' });
      return;
    }
    
    const result = identifyExcitonPeaks(spectrumData, bandgap);
    
    if (result.error) {
      wx.showToast({ title: result.error, icon: 'none', duration: 3000 });
      return;
    }
    
    let resultText = '';
    
    if (result.excitonDetected) {
      resultText += `💫 激子峰识别结果\n\n`;
      resultText += `检测到 ${result.numExcitons} 个激子峰\n`;
      resultText += `带隙: ${result.bandgap} ${result.bandgapUnit}\n\n`;
      
      resultText += `主激子峰:\n`;
      const main = result.mainExciton;
      resultText += `• 能量: ${main.energy} ${main.energyUnit}\n`;
      resultText += `• 波长: ${main.wavelength} ${main.wavelengthUnit}\n`;
      resultText += `• 结合能: ${main.bindingEnergy} ${main.bindingEnergyUnit}\n`;
      resultText += `        = ${main.bindingEnergyMeV} ${main.bindingEnergyMeVUnit}\n`;
      resultText += `• 类型: ${main.type}\n`;
      resultText += `• 可能材料: ${main.possibleMaterial}\n\n`;
      
      if (result.excitons.length > 1) {
        resultText += `其他激子峰:\n`;
        result.excitons.slice(1).forEach((ex, i) => {
          resultText += `${i+2}. ${ex.energy}eV (${ex.wavelength}nm), Eb=${ex.bindingEnergyMeV}meV\n`;
        });
        resultText += `\n`;
      }
      
      resultText += `分析:\n${result.analysis.excitonRadius}\n`;
      resultText += `${result.analysis.excitonType}`;
    } else {
      resultText += `💫 激子峰识别结果\n\n`;
      resultText += `${result.message}\n\n`;
      resultText += `建议: ${result.suggestion}`;
    }
    
    this.setData({ excitonResult: result, excitonResultText: resultText });
    
    historyService.add({
      tool: 'UV-Vis - 激子峰',
      input: `Eg=${bandgap}eV`,
      result: result.excitonDetected ? `${result.numExcitons}个激子峰` : '未检测到'
    });
  },
  
  resetExciton() {
    this.setData({
      excitonData: '',
      excitonBandgap: '',
      excitonResult: null,
      excitonResultText: ''
    });
  },

  /**
   * ========== Urbach能计算 ==========
   */
  handleUrbachDataInput(e) {
    this.setData({ urbachData: e.detail.value });
  },
  
  fillUrbachExample() {
    const exampleData = '400,0.2\n425,0.3\n450,0.5\n475,0.8\n500,1.2\n525,1.6\n550,2.0';
    this.setData({ urbachData: exampleData, urbachBandgap: '3.0' });
    wx.showToast({ title: '已填充示例数据', icon: 'success', duration: 1500 });
  },
  
  handleUrbachBandgapInput(e) {
    this.setData({ urbachBandgap: e.detail.value });
  },
  
  calculateUrbach() {
    const { urbachData, urbachBandgap } = this.data;
    
    if (!urbachData.trim()) {
      wx.showToast({ title: '请输入光谱数据', icon: 'none' });
      return;
    }
    
    // 解析输入数据
    const lines = urbachData.trim().split('\n');
    const spectrumData = [];
    
    for (const line of lines) {
      const parts = line.trim().split(/[,，\s]+/);
      if (parts.length >= 2) {
        const wavelength = parseFloat(parts[0]);
        const absorbance = parseFloat(parts[1]);
        if (!isNaN(wavelength) && !isNaN(absorbance)) {
          spectrumData.push({ wavelength, absorbance });
        }
      }
    }
    
    if (spectrumData.length < 10) {
      wx.showToast({ title: '至少需要10个有效数据点', icon: 'none', duration: 3000 });
      return;
    }
    
    const bandgap = urbachBandgap ? parseFloat(urbachBandgap) : null;
    const result = calculateUrbachEnergy(spectrumData, bandgap);
    
    if (result.error) {
      wx.showToast({ title: result.error, icon: 'none', duration: 3000 });
      return;
    }
    
    let resultText = `📉 Urbach能计算结果\n\n`;
    resultText += `Urbach能: ${result.urbachEnergy} ${result.urbachEnergyUnit}\n`;
    resultText += `        = ${result.urbachEnergyMeV} ${result.urbachEnergyMeVUnit}\n\n`;
    
    resultText += `材料质量: ${result.qualityAssessment}\n`;
    resultText += `无序度: ${result.disorderLevel}\n\n`;
    
    resultText += `拟合质量: R² = ${result.fitQuality} (${result.fitQualityGrade})\n`;
    resultText += `数据点数: ${result.dataPoints}\n`;
    resultText += `拟合范围: ${result.fitRange}\n\n`;
    
    resultText += `方法: ${result.method}\n`;
    resultText += `拟合: ${result.linearFit}\n\n`;
    
    resultText += `典型值:\n`;
    Object.entries(result.interpretation.typical).forEach(([key, value]) => {
      resultText += `• ${key}: ${value}\n`;
    });
    
    resultText += `\n应用:\n${result.applications.slice(0, 3).join('\n')}`;
    
    this.setData({ urbachResult: result, urbachResultText: resultText });
    
    historyService.add({
      tool: 'UV-Vis - Urbach能',
      input: `${spectrumData.length}点`,
      result: `Eu=${result.urbachEnergyMeV}meV`
    });
  },
  
  resetUrbach() {
    this.setData({
      urbachData: '',
      urbachBandgap: '',
      urbachResult: null,
      urbachResultText: ''
    });
  },

  /**
   * 分享
   */
  onShareAppMessage() {
    return {
      title: 'UV-Vis光谱分析工具 - 材料化学科研工具箱',
      path: '/pages/spectroscopy/uvvis/uvvis-enhanced'
    };
  }
});

