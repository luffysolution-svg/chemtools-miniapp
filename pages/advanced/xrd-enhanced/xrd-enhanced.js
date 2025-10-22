/**
 * XRD分析工具页面（完整版）
 * 包含：基础计算（d-2θ互算、晶系d(hkl)）+ 深度分析（Scherrer公式、晶格精修、消光判断、峰强分析）
 */

const {
  calculateCrystalliteSize,
  refineLatticeParameters,
  determineExtinction,
  calculateRelativeIntensity,
  getMetadata
} = require('../../../utils/xrd-enhanced');
const { listTargets, dFromTheta2, theta2FromD, dCubic, dTetragonal, dOrthorhombic, dHexagonal } = require('../../../utils/xrd');
const { historyService } = require('../../../services/history');
const { getPresets } = require('../../../utils/input-presets');

Page({
  data: {
    // 工具选择
    tools: [
      { id: 'bragg', name: 'd-2θ互算', icon: '💎' },
      { id: 'crystal', name: '晶系d(hkl)', icon: '🔷' },
      { id: 'scherrer', name: 'Scherrer公式', icon: '📏' },
      { id: 'refine', name: '晶格精修', icon: '🔧' },
      { id: 'extinction', name: '消光判断', icon: '🔍' },
      { id: 'intensity', name: '峰强分析', icon: '📊' }
    ],
    currentTool: 'bragg',

    // Bragg计算（基础）
    xrayTargets: [],
    xrayIndex: 0,
    braggLambda: '1.5406',
    braggLambdaPlaceholder: '1.5406',
    braggMode: 'theta-to-d',
    braggTheta2: '',
    braggDValue: '',
    braggResult: '',
    braggResultText: '',
    braggHint: '',
    
    // 预设值
    wavelengthPresets: [],
    anglePresets: [],
    dValuePresets: [],

    // 晶系计算（基础）
    crystalSystemsBasic: ['立方晶系', '四方晶系', '正交晶系', '六方晶系'],
    crystalIndexBasic: 0,
    latticeA: '',
    latticeB: '',
    latticeC: '',
    millerH: '',
    millerK: '',
    millerL: '',
    crystalResult: '',
    crystalResultText: '',
    crystalHint: '',

    // Scherrer计算
    fwhm: '',
    theta2: '',
    lambda: '1.5406',
    lambdaPlaceholder: '1.5406',
    shapeK: '0.9',
    scherrerResult: null,
    scherrerResultText: '',

    // 晶格精修
    crystalSystems: ['立方晶系', '四方晶系', '六方晶系', '正交晶系'],
    crystalIndex: 0,
    refinePeaks: '',
    refinePeaksPlaceholder: '格式：h,k,l,2θ (每行一个)\n例如：1,1,1,38.5\n     2,0,0,44.8',
    refineResult: null,
    refineResultText: '',

    // 消光判断
    extinctionPeaks: '',
    extinctionPeaksPlaceholder: '格式：h,k,l (每行一个)\n例如：1,1,1\n     2,0,0\n     2,2,0',
    extinctionResult: null,
    extinctionResultText: '',

    // 峰强分析
    intensityPeaks: '',
    intensityPeaksPlaceholder: '格式：hkl,强度 (每行一个)\n例如：111,1500\n     200,2000\n     220,800',
    intensityResult: null,
    intensityResultText: ''
  },

  onLoad() {
    // 加载X射线源数据
    const targets = listTargets();
    const xrayTargets = targets.map(t => `${t.name} (${t.lambda} Å)`);
    this.setData({ 
      xrayTargets,
      _targets: targets,
      wavelengthPresets: getPresets('xrd', 'wavelength'),
      anglePresets: getPresets('xrd', 'angle'),
      dValuePresets: getPresets('xrd', 'dValue')
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
   * ========== Bragg计算功能（基础）==========
   */

  handleXrayChange(e) {
    const index = Number(e.detail.value);
    const lambda = this.data._targets[index].lambda;
    this.setData({ 
      xrayIndex: index,
      braggLambda: String(lambda),
      braggLambdaPlaceholder: String(lambda)
    });
  },

  handleBraggLambdaInput(e) {
    this.setData({ braggLambda: e.detail.value });
  },

  switchBraggMode(e) {
    const mode = e.currentTarget.dataset.mode;
    this.setData({ 
      braggMode: mode,
      braggTheta2: '',
      braggDValue: '',
      braggResult: ''
    });
  },

  handleBraggTheta2Input(e) {
    this.setData({ braggTheta2: e.detail.value });
  },

  handleBraggDInput(e) {
    this.setData({ braggDValue: e.detail.value });
  },
  
  handleWavelengthChange(e) {
    this.setData({ braggLambda: e.detail.value });
  },
  
  handleAngleChange(e) {
    this.setData({ braggTheta2: e.detail.value });
  },
  
  handleDValueChange(e) {
    this.setData({ braggDValue: e.detail.value });
  },
  
  handleRealtimeCalculate(e) {
    if (e.detail.value && this.data.braggLambda) {
      this.calculateBragg();
    }
  },
  
  handleRealtimeCalculateBragg(e) {
    if (e.detail.value && this.data.braggLambda) {
      this.calculateBragg();
    }
  },

  calculateBragg() {
    const { braggMode, braggLambda, braggTheta2, braggDValue } = this.data;

    const lam = Number(braggLambda);
    if (isNaN(lam) || lam <= 0) {
      wx.showToast({ title: '请输入有效的波长', icon: 'none' });
      return;
    }

    if (braggMode === 'theta-to-d') {
      // 2θ → d
      if (!braggTheta2) {
        wx.showToast({ title: '请输入衍射角 2θ', icon: 'none' });
        return;
      }

      const result = dFromTheta2(braggTheta2, lam);
      if (result.error) {
        wx.showToast({ title: result.error, icon: 'none' });
        return;
      }

      const d = result.d;
      const braggResult = `d = ${d.toFixed(4)} Å`;
      const braggResultText = `晶面间距 d = ${d.toFixed(4)} Å\n\n参数：\n2θ = ${braggTheta2}°\nλ = ${lam} Å\n\n公式：Bragg定律 nλ = 2d sinθ (n=1)`;

      this.setData({
        braggResult,
        braggResultText,
        braggHint: 'Bragg定律：nλ = 2d sinθ (n=1)',
        braggDValue: d.toFixed(4)
      });

      historyService.add({
        tool: 'XRD分析-2θ→d',
        input: { theta2: braggTheta2, lambda: lam },
        result: `d=${d.toFixed(4)}Å`,
        time: new Date().getTime()
      });

    } else {
      // d → 2θ
      if (!braggDValue) {
        wx.showToast({ title: '请输入晶面间距 d', icon: 'none' });
        return;
      }

      const result = theta2FromD(braggDValue, lam);
      if (result.error) {
        wx.showToast({ title: result.error, icon: 'none', duration: 2500 });
        return;
      }

      const theta = result.theta2;
      const braggResult = `2θ = ${theta.toFixed(3)}°`;
      const braggResultText = `衍射角 2θ = ${theta.toFixed(3)}°\n\n参数：\nd = ${braggDValue} Å\nλ = ${lam} Å\n\n公式：Bragg定律 nλ = 2d sinθ (n=1)`;

      this.setData({
        braggResult,
        braggResultText,
        braggHint: 'Bragg定律：nλ = 2d sinθ (n=1)',
        braggTheta2: theta.toFixed(3)
      });

      historyService.add({
        tool: 'XRD分析-d→2θ',
        input: { d: braggDValue, lambda: lam },
        result: `2θ=${theta.toFixed(3)}°`,
        time: new Date().getTime()
      });
    }
  },

  /**
   * ========== 晶系计算功能（基础）==========
   */

  handleCrystalSystemChange(e) {
    const index = Number(e.detail.value);
    this.setData({ 
      crystalIndexBasic: index,
      latticeB: '',
      latticeC: '',
      crystalResult: ''
    });
  },

  handleLatticeAInput(e) {
    this.setData({ latticeA: e.detail.value });
  },

  handleLatticeBInput(e) {
    this.setData({ latticeB: e.detail.value });
  },

  handleLatticeCInput(e) {
    this.setData({ latticeC: e.detail.value });
  },

  handleMillerHInput(e) {
    this.setData({ millerH: e.detail.value });
  },

  handleMillerKInput(e) {
    this.setData({ millerK: e.detail.value });
  },

  handleMillerLInput(e) {
    this.setData({ millerL: e.detail.value });
  },

  calculateCrystal() {
    const { crystalIndexBasic, latticeA, latticeB, latticeC, millerH, millerK, millerL } = this.data;

    // 验证米勒指数
    const h = Number(millerH) || 0;
    const k = Number(millerK) || 0;
    const l = Number(millerL) || 0;

    if (h === 0 && k === 0 && l === 0) {
      wx.showToast({ title: '米勒指数不能全为0', icon: 'none' });
      return;
    }

    // 验证晶格参数
    const a = Number(latticeA);
    if (isNaN(a) || a <= 0) {
      wx.showToast({ title: '请输入有效的晶格常数 a', icon: 'none' });
      return;
    }

    let result, systemName;

    switch (crystalIndexBasic) {
      case 0: // 立方
        result = dCubic(a, h, k, l);
        systemName = '立方晶系';
        break;

      case 1: // 四方
        const c1 = Number(latticeC);
        if (isNaN(c1) || c1 <= 0) {
          wx.showToast({ title: '请输入有效的晶格常数 c', icon: 'none' });
          return;
        }
        result = dTetragonal(a, c1, h, k, l);
        systemName = '四方晶系';
        break;

      case 2: // 正交
        const b = Number(latticeB);
        const c2 = Number(latticeC);
        if (isNaN(b) || b <= 0 || isNaN(c2) || c2 <= 0) {
          wx.showToast({ title: '请输入有效的晶格常数 b 和 c', icon: 'none' });
          return;
        }
        result = dOrthorhombic(a, b, c2, h, k, l);
        systemName = '正交晶系';
        break;

      case 3: // 六方
        const c3 = Number(latticeC);
        if (isNaN(c3) || c3 <= 0) {
          wx.showToast({ title: '请输入有效的晶格常数 c', icon: 'none' });
          return;
        }
        result = dHexagonal(a, c3, h, k, l);
        systemName = '六方晶系';
        break;
    }

    if (result.error) {
      wx.showToast({ 
        title: result.error, 
        icon: 'none',
        duration: 2000
      });
      return;
    }

    const d = result.d;
    const crystalResult = `d(${h}${k}${l}) = ${d.toFixed(4)} Å`;
    const crystalResultText = `${systemName}\n晶面间距 d(${h}${k}${l}) = ${d.toFixed(4)} Å\n\n晶格参数：\na = ${a} Å${latticeB ? `\nb = ${latticeB} Å` : ''}${latticeC ? `\nc = ${latticeC} Å` : ''}`;

    this.setData({
      crystalResult,
      crystalResultText,
      crystalHint: `${systemName}的晶面间距`
    });

    historyService.add({
      tool: `XRD分析-${systemName}`,
      input: { hkl: `(${h}${k}${l})`, a },
      result: `d=${d.toFixed(4)}Å`,
      time: new Date().getTime()
    });
  },

  /**
   * ========== Scherrer计算功能 ==========
   */

  handleFwhmInput(e) {
    this.setData({ fwhm: e.detail.value });
  },

  handleTheta2Input(e) {
    this.setData({ theta2: e.detail.value });
  },

  handleLambdaInput(e) {
    this.setData({ lambda: e.detail.value });
  },

  handleShapeKInput(e) {
    this.setData({ shapeK: e.detail.value });
  },

  calculateScherrer() {
    const { fwhm, theta2, lambda, shapeK } = this.data;

    if (!fwhm || !theta2) {
      wx.showToast({
        title: '请输入FWHM和2θ',
        icon: 'none'
      });
      return;
    }

    const result = calculateCrystalliteSize(
      parseFloat(fwhm),
      parseFloat(theta2),
      parseFloat(lambda) || 1.5406,
      parseFloat(shapeK) || 0.9
    );

    if (result.error) {
      wx.showToast({
        title: result.error,
        icon: 'none',
        duration: 3000
      });
      return;
    }

    // 格式化结果文本
    let resultText = `晶粒尺寸：${result.size.toFixed(2)} nm\n\n`;
    resultText += `📋 计算详情：\n`;
    resultText += `• FWHM：${result.details.fwhm}\n`;
    resultText += `• 2θ：${result.details.theta2}\n`;
    resultText += `• 波长λ：${result.details.lambda}\n`;
    resultText += `• 形状因子K：${result.details.K}\n`;
    resultText += `• 公式：${result.details.formula}\n\n`;
    resultText += `📐 精度：${result.precision}\n\n`;
    
    if (result.details.strainWarning) {
      resultText += `${result.details.strainWarning}\n\n`;
    }
    if (result.details.sizeNote) {
      resultText += `${result.details.sizeNote}\n\n`;
    }

    resultText += `⚠️ 注意事项：\n`;
    result.conditions.forEach(cond => {
      resultText += `• ${cond}\n`;
    });

    this.setData({
      scherrerResult: result,
      scherrerResultText: resultText
    });

    // 保存历史
    historyService.add({
      tool: 'XRD深度分析-Scherrer公式',
      input: { fwhm, theta2, lambda, shapeK },
      result: `${result.size.toFixed(2)} nm`,
      time: new Date().getTime()
    });
  },

  /**
   * ========== 晶格精修功能 ==========
   */

  handleCrystalSystemChange(e) {
    this.setData({ crystalIndex: Number(e.detail.value) });
  },

  handleRefinePeaksInput(e) {
    this.setData({ refinePeaks: e.detail.value });
  },

  calculateRefine() {
    const { refinePeaks, crystalIndex, crystalSystems } = this.data;

    if (!refinePeaks.trim()) {
      wx.showToast({
        title: '请输入衍射峰数据',
        icon: 'none'
      });
      return;
    }

    // 解析输入数据
    const lines = refinePeaks.trim().split('\n');
    const peaks = [];
    
    for (const line of lines) {
      const parts = line.trim().split(/[,，\s]+/);
      if (parts.length >= 4) {
        peaks.push({
          h: parseFloat(parts[0]),
          k: parseFloat(parts[1]),
          l: parseFloat(parts[2]),
          theta2: parseFloat(parts[3])
        });
      }
    }

    if (peaks.length < 3) {
      wx.showToast({
        title: '至少需要3个有效衍射峰',
        icon: 'none',
        duration: 3000
      });
      return;
    }

    const systemMap = ['cubic', 'tetragonal', 'hexagonal', 'orthorhombic'];
    const result = refineLatticeParameters(peaks, systemMap[crystalIndex]);

    if (result.error) {
      wx.showToast({
        title: result.error,
        icon: 'none',
        duration: 3000
      });
      return;
    }

    // 格式化结果
    let resultText = `✨ 晶格常数精修结果\n\n`;
    resultText += `晶系：${result.crystalSystem}\n`;
    resultText += `晶格常数 a = ${result.latticeParameter.a} ${result.latticeParameter.unit}\n`;
    resultText += `使用峰数：${result.peaksUsed}\n`;
    resultText += `R² = ${result.rSquared} (${result.goodnessOfFit})\n\n`;
    
    resultText += `📊 精修峰位：\n`;
    result.refinedPeaks.forEach(peak => {
      resultText += `${peak.hkl}: 2θ=${peak.theta2}°, d=${peak.d}Å\n`;
    });
    
    resultText += `\n💡 说明：\n`;
    result.notes.forEach(note => {
      resultText += `• ${note}\n`;
    });

    this.setData({
      refineResult: result,
      refineResultText: resultText
    });

    // 保存历史
    historyService.add({
      tool: 'XRD深度分析-晶格精修',
      input: { peaks: peaks.length, system: crystalSystems[crystalIndex] },
      result: `a=${result.latticeParameter.a}Å`,
      time: new Date().getTime()
    });
  },

  /**
   * ========== 消光判断功能 ==========
   */

  handleExtinctionPeaksInput(e) {
    this.setData({ extinctionPeaks: e.detail.value });
  },

  calculateExtinction() {
    const { extinctionPeaks } = this.data;

    if (!extinctionPeaks.trim()) {
      wx.showToast({
        title: '请输入衍射峰(hkl)',
        icon: 'none'
      });
      return;
    }

    // 解析输入
    const lines = extinctionPeaks.trim().split('\n');
    const peaks = [];

    for (const line of lines) {
      const parts = line.trim().split(/[,，\s]+/);
      if (parts.length >= 3) {
        peaks.push({
          h: parseInt(parts[0]),
          k: parseInt(parts[1]),
          l: parseInt(parts[2])
        });
      }
    }

    if (peaks.length === 0) {
      wx.showToast({
        title: '未找到有效的(hkl)数据',
        icon: 'none'
      });
      return;
    }

    const result = determineExtinction(peaks);

    if (result.error) {
      wx.showToast({
        title: result.error,
        icon: 'none',
        duration: 3000
      });
      return;
    }

    // 格式化结果
    let resultText = `🔍 消光系统分析结果\n\n`;
    resultText += `分析峰数：${result.peaksAnalyzed}\n\n`;
    resultText += `可能的布拉维格子：\n\n`;

    result.possibleLattices.forEach((lattice, index) => {
      resultText += `${index + 1}. ${lattice.type}\n`;
      resultText += `   消光规则：${lattice.rule}\n`;
      resultText += `   示例空间群：${lattice.examples.join(', ')}\n\n`;
    });

    resultText += `${result.note}\n\n`;
    resultText += `💡 ${result.recommendation}`;

    this.setData({
      extinctionResult: result,
      extinctionResultText: resultText
    });

    // 保存历史
    historyService.add({
      tool: 'XRD深度分析-消光判断',
      input: { peaks: peaks.length },
      result: `可能的格子：${result.possibleLattices.length}种`,
      time: new Date().getTime()
    });
  },

  /**
   * ========== 峰强分析功能 ==========
   */

  handleIntensityPeaksInput(e) {
    this.setData({ intensityPeaks: e.detail.value });
  },

  calculateIntensity() {
    const { intensityPeaks } = this.data;

    if (!intensityPeaks.trim()) {
      wx.showToast({
        title: '请输入峰强数据',
        icon: 'none'
      });
      return;
    }

    // 解析输入
    const lines = intensityPeaks.trim().split('\n');
    const peaks = [];

    for (const line of lines) {
      const parts = line.trim().split(/[,，\s]+/);
      if (parts.length >= 2) {
        peaks.push({
          hkl: parts[0],
          intensity: parseFloat(parts[1])
        });
      }
    }

    if (peaks.length === 0) {
      wx.showToast({
        title: '未找到有效的峰强数据',
        icon: 'none'
      });
      return;
    }

    const result = calculateRelativeIntensity(peaks);

    if (result.error) {
      wx.showToast({
        title: result.error,
        icon: 'none',
        duration: 3000
      });
      return;
    }

    // 格式化结果
    let resultText = `📊 相对峰强分析结果\n\n`;
    resultText += `峰数：${result.peakCount}\n`;
    resultText += `最大强度：${result.maxIntensity}\n`;
    resultText += `总强度：${result.totalIntensity}\n\n`;
    resultText += `归一化结果：\n`;
    resultText += `峰位 | 强度 | 相对强度\n`;
    resultText += `${'─'.repeat(30)}\n`;

    result.normalizedPeaks.forEach(peak => {
      resultText += `${peak.hkl.padEnd(6)} | ${peak.intensity.padEnd(8)} | ${peak.percentage}\n`;
    });

    resultText += `\n💡 ${result.usage}\n\n`;
    resultText += `⚠️ ${result.crystallinityNote}`;

    this.setData({
      intensityResult: result,
      intensityResultText: resultText
    });

    // 保存历史
    historyService.add({
      tool: 'XRD深度分析-峰强分析',
      input: { peaks: peaks.length },
      result: `最强峰：${result.normalizedPeaks[0]?.hkl || 'N/A'}`,
      time: new Date().getTime()
    });
  },

  /**
   * 清空当前工具的结果
   */
  clearResult() {
    const { currentTool } = this.data;
    
    switch (currentTool) {
      case 'bragg':
        this.setData({
          braggTheta2: '',
          braggDValue: '',
          braggResult: '',
          braggResultText: '',
          braggHint: ''
        });
        break;
      case 'crystal':
        this.setData({
          latticeA: '',
          latticeB: '',
          latticeC: '',
          millerH: '',
          millerK: '',
          millerL: '',
          crystalResult: '',
          crystalResultText: '',
          crystalHint: ''
        });
        break;
      case 'scherrer':
        this.setData({
          fwhm: '',
          theta2: '',
          scherrerResult: null,
          scherrerResultText: ''
        });
        break;
      case 'refine':
        this.setData({
          refinePeaks: '',
          refineResult: null,
          refineResultText: ''
        });
        break;
      case 'extinction':
        this.setData({
          extinctionPeaks: '',
          extinctionResult: null,
          extinctionResultText: ''
        });
        break;
      case 'intensity':
        this.setData({
          intensityPeaks: '',
          intensityResult: null,
          intensityResultText: ''
        });
        break;
    }
  },

  /**
   * 导出结果
   */
  exportResult() {
    const { currentTool, braggResultText, crystalResultText, scherrerResultText, refineResultText, extinctionResultText, intensityResultText } = this.data;
    
    let text = '';
    switch (currentTool) {
      case 'bragg':
        text = braggResultText;
        break;
      case 'crystal':
        text = crystalResultText;
        break;
      case 'scherrer':
        text = scherrerResultText;
        break;
      case 'refine':
        text = refineResultText;
        break;
      case 'extinction':
        text = extinctionResultText;
        break;
      case 'intensity':
        text = intensityResultText;
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

