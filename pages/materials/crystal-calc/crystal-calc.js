/**
 * 晶体学计算工具页面
 * 包含：理论密度、晶胞体积、晶面间距
 */

const {
  calculateTheoreticalDensity,
  calculateCellVolume,
  calculateRelativeDensity,
  calculateDSpacing
} = require('../../../utils/crystallography');
const { historyService } = require('../../../services/history');

Page({
  data: {
    // 工具选择
    tools: [
      { id: 'density', name: '理论密度', icon: '⚖️' },
      { id: 'volume', name: '晶胞体积', icon: '🔷' },
      { id: 'd-spacing', name: 'd间距', icon: '📏' }
    ],
    currentTool: 'density',

    // 晶系选择
    crystalSystems: ['立方', '四方', '正交', '六方', '单斜', '三斜'],
    crystalSystemMap: ['cubic', 'tetragonal', 'orthorhombic', 'hexagonal', 'monoclinic', 'triclinic'],
    crystalIndex: 0,

    // 预设值（常见晶格参数）
    latticePresets: [
      { label: 'NaCl (5.64 Å)', value: '5.64' },
      { label: 'Si (5.43 Å)', value: '5.43' },
      { label: 'Au (4.08 Å)', value: '4.08' },
      { label: 'TiO₂ (4.59 Å)', value: '4.59' }
    ],

    // 理论密度计算
    formula: '',
    zValue: '',
    latticeA: '',
    latticeB: '',
    latticeC: '',
    alpha: '',
    beta: '',
    gamma: '',
    measuredDensity: '',
    densityResult: null,
    densityResultText: '',

    // 晶胞体积计算
    volumeLatticeA: '',
    volumeLatticeB: '',
    volumeLatticeC: '',
    volumeAlpha: '',
    volumeBeta: '',
    volumeGamma: '',
    volumeResult: null,
    volumeResultText: '',

    // d间距计算
    millerH: '',
    millerK: '',
    millerL: '',
    dLatticeA: '',
    dLatticeB: '',
    dLatticeC: '',
    dResult: null,
    dResultText: ''
  },

  /**
   * 切换工具
   */
  switchTool(e) {
    const tool = e.currentTarget.dataset.tool;
    this.setData({ currentTool: tool });
  },

  /**
   * 晶系选择
   */
  handleCrystalSystemChange(e) {
    this.setData({ crystalIndex: Number(e.detail.value) });
  },

  /**
   * ========== 理论密度计算 ==========
   */

  handleFormulaInput(e) {
    this.setData({ formula: e.detail.value });
  },

  handleZValueInput(e) {
    this.setData({ zValue: e.detail.value });
  },

  handleLatticeAInput(e) {
    this.setData({ latticeA: e.detail.value });
  },
  
  handleLatticeAChange(e) {
    this.setData({ latticeA: e.detail.value });
  },

  handleLatticeBInput(e) {
    this.setData({ latticeB: e.detail.value });
  },

  handleLatticeCInput(e) {
    this.setData({ latticeC: e.detail.value });
  },

  handleAlphaInput(e) {
    this.setData({ alpha: e.detail.value });
  },

  handleBetaInput(e) {
    this.setData({ beta: e.detail.value });
  },

  handleGammaInput(e) {
    this.setData({ gamma: e.detail.value });
  },

  handleMeasuredDensityInput(e) {
    this.setData({ measuredDensity: e.detail.value });
  },

  calculateDensity() {
    const { formula, zValue, latticeA, latticeB, latticeC, alpha, beta, gamma, crystalIndex, crystalSystemMap, measuredDensity } = this.data;

    if (!formula || !zValue || !latticeA) {
      wx.showToast({
        title: '请输入化学式、Z值和晶格参数',
        icon: 'none'
      });
      return;
    }

    const crystalSystem = crystalSystemMap[crystalIndex];
    const latticeParams = {
      a: parseFloat(latticeA),
      b: latticeB ? parseFloat(latticeB) : parseFloat(latticeA),
      c: latticeC ? parseFloat(latticeC) : parseFloat(latticeA),
      alpha: alpha ? parseFloat(alpha) : 90,
      beta: beta ? parseFloat(beta) : 90,
      gamma: gamma ? parseFloat(gamma) : 90
    };

    const result = calculateTheoreticalDensity(
      formula.trim(),
      latticeParams,
      parseInt(zValue),
      crystalSystem
    );

    if (result.error) {
      wx.showToast({
        title: result.error,
        icon: 'none',
        duration: 3000
      });
      return;
    }

    // 格式化结果
    let resultText = `⚖️ 理论密度计算结果\n\n`;
    resultText += `化学式：${result.formula}\n`;
    resultText += `分子量：${result.molWeight} g/mol\n`;
    resultText += `晶系：${result.crystalSystem}\n`;
    resultText += `晶胞体积：${result.cellVolume} ų\n`;
    resultText += `Z值：${result.Z}\n\n`;
    resultText += `📊 理论密度：${result.density} ${result.unit}\n\n`;
    resultText += `📐 计算公式：\n${result.calculation}\n`;

    // 如果输入了实测密度，计算致密度
    if (measuredDensity) {
      const relDensity = calculateRelativeDensity(parseFloat(measuredDensity), result.density);
      if (!relDensity.error) {
        resultText += `\n🔍 致密度分析：\n`;
        resultText += `实测密度：${measuredDensity} g/cm³\n`;
        resultText += `致密度：${relDensity.relativeDensity}%\n`;
        resultText += `孔隙率：约${relDensity.porosity}%\n`;
        resultText += `${relDensity.note}`;
      }
    }

    this.setData({
      densityResult: result,
      densityResultText: resultText
    });

    historyService.add({
      tool: '晶体学计算-理论密度',
      input: `${formula}, Z=${zValue}`,
      result: `ρ=${result.density} g/cm³`
    });
  },

  /**
   * ========== 晶胞体积计算 ==========
   */

  handleVolumeLatticeAInput(e) {
    this.setData({ volumeLatticeA: e.detail.value });
  },

  handleVolumeLatticeBInput(e) {
    this.setData({ volumeLatticeB: e.detail.value });
  },

  handleVolumeLatticeCInput(e) {
    this.setData({ volumeLatticeC: e.detail.value });
  },

  handleVolumeAlphaInput(e) {
    this.setData({ volumeAlpha: e.detail.value });
  },

  handleVolumeBetaInput(e) {
    this.setData({ volumeBeta: e.detail.value });
  },

  handleVolumeGammaInput(e) {
    this.setData({ volumeGamma: e.detail.value });
  },

  calculateVolume() {
    const { volumeLatticeA, volumeLatticeB, volumeLatticeC, volumeAlpha, volumeBeta, volumeGamma, crystalIndex, crystalSystemMap } = this.data;

    if (!volumeLatticeA) {
      wx.showToast({
        title: '请至少输入晶格参数a',
        icon: 'none'
      });
      return;
    }

    const crystalSystem = crystalSystemMap[crystalIndex];
    const latticeParams = {
      a: parseFloat(volumeLatticeA),
      b: volumeLatticeB ? parseFloat(volumeLatticeB) : parseFloat(volumeLatticeA),
      c: volumeLatticeC ? parseFloat(volumeLatticeC) : parseFloat(volumeLatticeA),
      alpha: volumeAlpha ? parseFloat(volumeAlpha) : 90,
      beta: volumeBeta ? parseFloat(volumeBeta) : 90,
      gamma: volumeGamma ? parseFloat(volumeGamma) : 90
    };

    const result = calculateCellVolume(latticeParams, crystalSystem);

    if (result.error) {
      wx.showToast({
        title: result.error,
        icon: 'none',
        duration: 3000
      });
      return;
    }

    let resultText = `🔷 晶胞体积计算结果\n\n`;
    resultText += `晶系：${result.crystalSystem}\n`;
    resultText += `体积：${result.volume} ${result.unit}\n\n`;
    resultText += `📐 公式：${result.formula}\n`;

    this.setData({
      volumeResult: result,
      volumeResultText: resultText
    });

    historyService.add({
      tool: '晶体学计算-晶胞体积',
      input: `${result.crystalSystem}, a=${latticeParams.a}`,
      result: `V=${result.volume} ų`
    });
  },

  /**
   * ========== d间距计算 ==========
   */

  handleMillerHInput(e) {
    this.setData({ millerH: e.detail.value });
  },

  handleMillerKInput(e) {
    this.setData({ millerK: e.detail.value });
  },

  handleMillerLInput(e) {
    this.setData({ millerL: e.detail.value });
  },

  handleDLatticeAInput(e) {
    this.setData({ dLatticeA: e.detail.value });
  },

  handleDLatticeBInput(e) {
    this.setData({ dLatticeB: e.detail.value });
  },

  handleDLatticeCInput(e) {
    this.setData({ dLatticeC: e.detail.value });
  },

  calculateD() {
    const { millerH, millerK, millerL, dLatticeA, dLatticeB, dLatticeC, crystalIndex, crystalSystemMap } = this.data;

    if (!millerH || !millerK || !millerL || !dLatticeA) {
      wx.showToast({
        title: '请输入Miller指数和晶格参数',
        icon: 'none'
      });
      return;
    }

    const crystalSystem = crystalSystemMap[crystalIndex];
    const latticeParams = {
      a: parseFloat(dLatticeA),
      b: dLatticeB ? parseFloat(dLatticeB) : parseFloat(dLatticeA),
      c: dLatticeC ? parseFloat(dLatticeC) : parseFloat(dLatticeA)
    };

    const result = calculateDSpacing(
      parseInt(millerH),
      parseInt(millerK),
      parseInt(millerL),
      latticeParams,
      crystalSystem
    );

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

    let resultText = `📏 晶面间距计算结果\n\n`;
    resultText += `晶面：${result.hkl}\n`;
    resultText += `晶系：${result.crystalSystem}\n`;
    resultText += `间距 d：${result.d} ${result.unit}\n\n`;
    resultText += `📐 公式：${result.formula}`;

    this.setData({
      dResult: result,
      dResultText: resultText
    });

    historyService.add({
      tool: '晶体学计算-d间距',
      input: `${result.hkl}`,
      result: `d=${result.d} Å`
    });
  },

  /**
   * 清空结果
   */
  clearResult() {
    const { currentTool } = this.data;

    switch (currentTool) {
      case 'density':
        this.setData({
          formula: '',
          zValue: '',
          latticeA: '',
          latticeB: '',
          latticeC: '',
          alpha: '',
          beta: '',
          gamma: '',
          measuredDensity: '',
          densityResult: null,
          densityResultText: ''
        });
        break;
      case 'volume':
        this.setData({
          volumeLatticeA: '',
          volumeLatticeB: '',
          volumeLatticeC: '',
          volumeAlpha: '',
          volumeBeta: '',
          volumeGamma: '',
          volumeResult: null,
          volumeResultText: ''
        });
        break;
      case 'd-spacing':
        this.setData({
          millerH: '',
          millerK: '',
          millerL: '',
          dLatticeA: '',
          dLatticeB: '',
          dLatticeC: '',
          dResult: null,
          dResultText: ''
        });
        break;
    }
  },

  /**
   * 导出结果
   */
  exportResult() {
    const { currentTool, densityResultText, volumeResultText, dResultText } = this.data;

    let text = '';
    switch (currentTool) {
      case 'density':
        text = densityResultText;
        break;
      case 'volume':
        text = volumeResultText;
        break;
      case 'd-spacing':
        text = dResultText;
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

