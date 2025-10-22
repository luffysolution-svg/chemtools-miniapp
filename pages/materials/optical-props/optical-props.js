/**
 * 光学性质计算工具
 * 包含：颜色空间转换、荧光量子产率
 */

const {
  rgbToHsv,
  hsvToRgb,
  calculateQuantumYield,
  getFluorescenceStandards
} = require('../../../utils/optical-properties');
const { historyService } = require('../../../services/history');
const { getPresets } = require('../../../utils/input-presets');

Page({
  data: {
    refractiveIndexPresets: [],
    wavelengthPresets: [],
    // 工具选择
    tools: [
      { id: 'color-convert', name: '颜色转换', icon: '🎨' },
      { id: 'quantum-yield', name: '量子产率', icon: '💡' }
    ],
    currentTool: 'color-convert',

    // 颜色转换
    conversionModes: ['RGB → HSV', 'HSV → RGB'],
    conversionIndex: 0,
    rgb_r: '',
    rgb_g: '',
    rgb_b: '',
    hsv_h: '',
    hsv_s: '',
    hsv_v: '',
    colorResult: null,
    colorResultText: '',

    // 量子产率
    fluorStandards: [],
    standardIndex: 0,
    sampleAbs: '',
    sampleIntensity: '',
    sampleRI: '1.33',
    refAbs: '',
    refIntensity: '',
    refRI: '',
    refQY: '',
    qyResult: null,
    qyResultText: ''
  },

  onLoad() {
    // 加载荧光标准列表
    const standards = getFluorescenceStandards();
    const fluorStandards = standards.map(s => `${s.name} (Φ=${s.quantumYield})`);
    this.setData({
      fluorStandards,
      _standards: standards,
      refRI: String(standards[0].refractiveIndex),
      refQY: String(standards[0].quantumYield)
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
   * ========== 颜色转换 ==========
   */

  handleConversionModeChange(e) {
    this.setData({ conversionIndex: Number(e.detail.value) });
  },

  handleRgbRInput(e) { this.setData({ rgb_r: e.detail.value }); },
  handleRgbGInput(e) { this.setData({ rgb_g: e.detail.value }); },
  handleRgbBInput(e) { this.setData({ rgb_b: e.detail.value }); },
  handleHsvHInput(e) { this.setData({ hsv_h: e.detail.value }); },
  handleHsvSInput(e) { this.setData({ hsv_s: e.detail.value }); },
  handleHsvVInput(e) { this.setData({ hsv_v: e.detail.value }); },

  convertColor() {
    const { conversionIndex, rgb_r, rgb_g, rgb_b, hsv_h, hsv_s, hsv_v } = this.data;

    if (conversionIndex === 0) {
      // RGB → HSV
      if (!rgb_r || !rgb_g || !rgb_b) {
        wx.showToast({ title: '请输入RGB值', icon: 'none' });
        return;
      }

      const result = rgbToHsv(
        parseInt(rgb_r),
        parseInt(rgb_g),
        parseInt(rgb_b)
      );

      let resultText = `🎨 RGB → HSV 转换结果\n\n`;
      resultText += `输入RGB：(${rgb_r}, ${rgb_g}, ${rgb_b})\n\n`;
      resultText += `输出HSV：\n`;
      resultText += `• H (色相) = ${result.h}${result.unit.h}\n`;
      resultText += `• S (饱和度) = ${result.s}${result.unit.s}\n`;
      resultText += `• V (明度) = ${result.v}${result.unit.v}`;

      this.setData({
        colorResult: result,
        colorResultText: resultText,
        hsv_h: String(result.h),
        hsv_s: String(result.s),
        hsv_v: String(result.v)
      });

      historyService.add({
        tool: '光学性质-颜色转换',
        input: `RGB(${rgb_r},${rgb_g},${rgb_b})`,
        result: `HSV(${result.h},${result.s},${result.v})`
      });

    } else {
      // HSV → RGB
      if (!hsv_h || !hsv_s || !hsv_v) {
        wx.showToast({ title: '请输入HSV值', icon: 'none' });
        return;
      }

      const result = hsvToRgb(
        parseFloat(hsv_h),
        parseFloat(hsv_s),
        parseFloat(hsv_v)
      );

      let resultText = `🎨 HSV → RGB 转换结果\n\n`;
      resultText += `输入HSV：(${hsv_h}°, ${hsv_s}%, ${hsv_v}%)\n\n`;
      resultText += `输出RGB：\n`;
      resultText += `• R (红) = ${result.r}\n`;
      resultText += `• G (绿) = ${result.g}\n`;
      resultText += `• B (蓝) = ${result.b}`;

      this.setData({
        colorResult: result,
        colorResultText: resultText,
        rgb_r: String(result.r),
        rgb_g: String(result.g),
        rgb_b: String(result.b)
      });

      historyService.add({
        tool: '光学性质-颜色转换',
        input: `HSV(${hsv_h},${hsv_s},${hsv_v})`,
        result: `RGB(${result.r},${result.g},${result.b})`
      });
    }
  },

  /**
   * ========== 量子产率 ==========
   */

  handleStandardChange(e) {
    const index = Number(e.detail.value);
    const standard = this.data._standards[index];
    
    this.setData({
      standardIndex: index,
      refRI: String(standard.refractiveIndex),
      refQY: String(standard.quantumYield)
    });
  },

  handleSampleAbsInput(e) { this.setData({ sampleAbs: e.detail.value }); },
  handleSampleIntensityInput(e) { this.setData({ sampleIntensity: e.detail.value }); },
  handleSampleRIInput(e) { this.setData({ sampleRI: e.detail.value }); },
  handleRefAbsInput(e) { this.setData({ refAbs: e.detail.value }); },
  handleRefIntensityInput(e) { this.setData({ refIntensity: e.detail.value }); },
  handleRefRIInput(e) { this.setData({ refRI: e.detail.value }); },
  handleRefQYInput(e) { this.setData({ refQY: e.detail.value }); },

  calculateQY() {
    const { sampleAbs, sampleIntensity, sampleRI, refAbs, refIntensity, refRI, refQY } = this.data;

    if (!sampleAbs || !sampleIntensity || !refAbs || !refIntensity) {
      wx.showToast({
        title: '请填写必要参数',
        icon: 'none'
      });
      return;
    }

    const result = calculateQuantumYield(
      {
        absorbance: parseFloat(sampleAbs),
        fluorIntensity: parseFloat(sampleIntensity),
        refractiveIndex: parseFloat(sampleRI) || 1.33
      },
      {
        absorbance: parseFloat(refAbs),
        fluorIntensity: parseFloat(refIntensity),
        refractiveIndex: parseFloat(refRI) || 1.33,
        quantumYield: parseFloat(refQY)
      }
    );

    if (result.error) {
      wx.showToast({
        title: result.error,
        icon: 'none',
        duration: 3000
      });
      return;
    }

    let resultText = `💡 荧光量子产率计算结果\n\n`;
    resultText += `样品量子产率 Φs = ${result.quantumYield} (${result.percentage}%)\n\n`;
    resultText += `📋 计算详情：\n`;
    resultText += `• 吸光度比值：As/Ar = ${result.calculation.absRatio}\n`;
    resultText += `• 荧光强度比值：Is/Ir = ${result.calculation.intensityRatio}\n`;
    resultText += `• 折射率比值：ηs/ηr = ${result.calculation.refractiveRatio}\n`;
    resultText += `• 折射率平方：(ηs/ηr)² = ${result.calculation.refractiveSquared}\n\n`;
    resultText += `📐 公式：${result.formula}\n\n`;
    resultText += `⚠️ ${result.note}`;

    this.setData({
      qyResult: result,
      qyResultText: resultText
    });

    historyService.add({
      tool: '光学性质-量子产率',
      input: `样品A=${sampleAbs}`,
      result: `Φs=${result.percentage}%`
    });
  },

  /**
   * 清空结果
   */
  clearResult() {
    const { currentTool } = this.data;

    switch (currentTool) {
      case 'color-convert':
        this.setData({
          rgb_r: '',
          rgb_g: '',
          rgb_b: '',
          hsv_h: '',
          hsv_s: '',
          hsv_v: '',
          colorResult: null,
          colorResultText: ''
        });
        break;
      case 'quantum-yield':
        this.setData({
          sampleAbs: '',
          sampleIntensity: '',
          sampleRI: '1.33',
          refAbs: '',
          refIntensity: '',
          qyResult: null,
          qyResultText: ''
        });
        break;
    }
  },

  /**
   * 导出结果
   */
  exportResult() {
    const { currentTool, colorResultText, qyResultText } = this.data;

    const text = currentTool === 'color-convert' ? colorResultText : qyResultText;

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

