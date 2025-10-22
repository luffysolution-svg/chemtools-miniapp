/**
 * BET表面积与吸附等温线分析
 * 包含：BET表面积、Langmuir拟合、Freundlich拟合
 */

const {
  calculateBET,
  fitLangmuir,
  fitFreundlich
} = require('../../../utils/bet-analysis');
const { historyService } = require('../../../services/history');
const { getPresets } = require('../../../utils/input-presets');

Page({
  data: {
    pressurePresets: [],
    volumePresets: [],
    // 工具选择
    tools: [
      { id: 'bet', name: 'BET表面积', icon: '📊' },
      { id: 'langmuir', name: 'Langmuir', icon: '📈' },
      { id: 'freundlich', name: 'Freundlich', icon: '📉' }
    ],
    currentTool: 'bet',

    // BET分析
    betDataInput: '',
    betPlaceholder: '格式：相对压力(P/P0),吸附量(cm³/g)\n例如：\n0.05,50\n0.10,55\n0.15,58\n0.20,60\n0.25,62\n0.30,64',
    betResult: null,
    betResultText: '',

    // Langmuir拟合
    langmuirDataInput: '',
    langmuirPlaceholder: '格式：平衡浓度(mg/L),吸附量(mg/g)\n例如：\n10,15\n20,25\n30,32\n40,37\n50,40',
    langmuirResult: null,
    langmuirResultText: '',

    // Freundlich拟合
    freundlichDataInput: '',
    freundlichPlaceholder: '格式：平衡浓度(mg/L),吸附量(mg/g)\n例如：\n5,12\n10,18\n20,25\n40,33\n80,42',
    freundlichResult: null,
    freundlichResultText: ''
  },

  /**
   * 切换工具
   */
  switchTool(e) {
    const tool = e.currentTarget.dataset.tool;
    this.setData({ currentTool: tool });
  },

  /**
   * ========== BET分析 ==========
   */

  handleBetDataInput(e) {
    this.setData({ betDataInput: e.detail.value });
  },

  calculateBETAnalysis() {
    const { betDataInput } = this.data;

    if (!betDataInput.trim()) {
      wx.showToast({
        title: '请输入吸附数据',
        icon: 'none'
      });
      return;
    }

    // 解析输入
    const lines = betDataInput.trim().split('\n');
    const adsorptionData = [];

    for (const line of lines) {
      const parts = line.trim().split(/[,，\s]+/);
      if (parts.length >= 2) {
        adsorptionData.push({
          relPressure: parseFloat(parts[0]),
          adsorbedVolume: parseFloat(parts[1])
        });
      }
    }

    if (adsorptionData.length < 5) {
      wx.showToast({
        title: '至少需要5个数据点',
        icon: 'none'
      });
      return;
    }

    const result = calculateBET(adsorptionData);

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

    let resultText = `📊 BET比表面积分析结果\n\n`;
    resultText += `🎯 比表面积：${result.surfaceArea} ${result.unit}\n\n`;
    resultText += `📋 BET参数：\n`;
    resultText += `• 单层饱和吸附量 Vm：${result.Vm} cm³/g\n`;
    resultText += `• BET常数 C：${result.C}\n`;
    resultText += `• 线性区域：${result.linearRange}\n`;
    resultText += `• 线性点数：${result.linearPoints}\n`;
    resultText += `• R² = ${result.rSquared}\n\n`;
    resultText += `📐 拟合方程：\n${result.equation}\n\n`;
    
    result.notes.forEach(note => {
      resultText += `${note}\n`;
    });

    this.setData({
      betResult: result,
      betResultText: resultText
    });

    historyService.add({
      tool: 'BET分析',
      input: `${adsorptionData.length}个数据点`,
      result: `S=${result.surfaceArea} m²/g`
    });
  },

  /**
   * ========== Langmuir拟合 ==========
   */

  handleLangmuirDataInput(e) {
    this.setData({ langmuirDataInput: e.detail.value });
  },

  calculateLangmuir() {
    const { langmuirDataInput } = this.data;

    if (!langmuirDataInput.trim()) {
      wx.showToast({
        title: '请输入平衡数据',
        icon: 'none'
      });
      return;
    }

    // 解析输入
    const lines = langmuirDataInput.trim().split('\n');
    const equilibriumData = [];

    for (const line of lines) {
      const parts = line.trim().split(/[,，\s]+/);
      if (parts.length >= 2) {
        equilibriumData.push({
          concentration: parseFloat(parts[0]),
          adsorption: parseFloat(parts[1])
        });
      }
    }

    const result = fitLangmuir(equilibriumData);

    if (result.error) {
      wx.showToast({
        title: result.error,
        icon: 'none',
        duration: 3000
      });
      return;
    }

    let resultText = `📈 Langmuir吸附等温线拟合结果\n\n`;
    resultText += `📋 拟合参数：\n`;
    resultText += `• 最大吸附量 Qm：${result.Qm} ${result.unit}\n`;
    resultText += `• Langmuir常数 K：${result.K} ${result.KUnit}\n`;
    resultText += `• R² = ${result.rSquared} (${result.fitQuality === 'excellent' ? '优秀' : result.fitQuality === 'good' ? '良好' : '一般'})\n\n`;
    resultText += `📐 拟合方程：\n${result.equation}\n\n`;
    resultText += `💡 ${result.note}`;

    this.setData({
      langmuirResult: result,
      langmuirResultText: resultText
    });

    historyService.add({
      tool: 'Langmuir拟合',
      input: `${equilibriumData.length}个点`,
      result: `Qm=${result.Qm} mg/g`
    });
  },

  /**
   * ========== Freundlich拟合 ==========
   */

  handleFreundlichDataInput(e) {
    this.setData({ freundlichDataInput: e.detail.value });
  },

  calculateFreundlich() {
    const { freundlichDataInput } = this.data;

    if (!freundlichDataInput.trim()) {
      wx.showToast({
        title: '请输入平衡数据',
        icon: 'none'
      });
      return;
    }

    // 解析输入
    const lines = freundlichDataInput.trim().split('\n');
    const equilibriumData = [];

    for (const line of lines) {
      const parts = line.trim().split(/[,，\s]+/);
      if (parts.length >= 2) {
        equilibriumData.push({
          concentration: parseFloat(parts[0]),
          adsorption: parseFloat(parts[1])
        });
      }
    }

    const result = fitFreundlich(equilibriumData);

    if (result.error) {
      wx.showToast({
        title: result.error,
        icon: 'none',
        duration: 3000
      });
      return;
    }

    let resultText = `📉 Freundlich吸附等温线拟合结果\n\n`;
    resultText += `📋 拟合参数：\n`;
    resultText += `• Freundlich常数 Kf：${result.Kf}\n`;
    resultText += `• Freundlich指数 n：${result.n}\n`;
    resultText += `• R² = ${result.rSquared} (${result.fitQuality === 'excellent' ? '优秀' : result.fitQuality === 'good' ? '良好' : '一般'})\n\n`;
    resultText += `📐 拟合方程：\n${result.equation}\n\n`;
    resultText += `💡 ${result.note}\n`;
    resultText += `📊 吸附特性：${result.interpretation}`;

    this.setData({
      freundlichResult: result,
      freundlichResultText: resultText
    });

    historyService.add({
      tool: 'Freundlich拟合',
      input: `${equilibriumData.length}个点`,
      result: `Kf=${result.Kf}, n=${result.n}`
    });
  },

  /**
   * 清空结果
   */
  clearResult() {
    const { currentTool } = this.data;

    switch (currentTool) {
      case 'bet':
        this.setData({
          betDataInput: '',
          betResult: null,
          betResultText: ''
        });
        break;
      case 'langmuir':
        this.setData({
          langmuirDataInput: '',
          langmuirResult: null,
          langmuirResultText: ''
        });
        break;
      case 'freundlich':
        this.setData({
          freundlichDataInput: '',
          freundlichResult: null,
          freundlichResultText: ''
        });
        break;
    }
  },

  /**
   * 导出结果
   */
  exportResult() {
    const { currentTool, betResultText, langmuirResultText, freundlichResultText } = this.data;

    let text = '';
    switch (currentTool) {
      case 'bet':
        text = betResultText;
        break;
      case 'langmuir':
        text = langmuirResultText;
        break;
      case 'freundlich':
        text = freundlichResultText;
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

