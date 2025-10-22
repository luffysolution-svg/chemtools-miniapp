/**
 * 络合/掩蔽估算页面
 */

const { historyService } = require('../../../services/history');
const { generateShareCard } = require('../utils/shareHelper');
const { getPresets } = require('../../../utils/input-presets');

Page({
  data: {
    coordinationNumberPresets: [],
    logBeta: '',
    ligandConc: '',
    metalConc: '',
    pH: '7',
    result: '',
    resultText: '',
    hint: ''
  },
  
  onLoad() {
    this.setData({
      coordinationNumberPresets: getPresets('complexation', 'coordinationNumber')
    });
  },

  handleLogBetaInput(e) {
    this.setData({ logBeta: e.detail.value });
  },

  handleLigandInput(e) {
    this.setData({ ligandConc: e.detail.value });
  },

  handleMetalInput(e) {
    this.setData({ metalConc: e.detail.value });
  },

  handlePHInput(e) {
    this.setData({ pH: e.detail.value });
  },

  calculate() {
    const { logBeta, ligandConc, metalConc, pH } = this.data;
    
    if (!logBeta || !ligandConc || !metalConc) {
      wx.showToast({ title: '请输入必填参数', icon: 'none' });
      return;
    }

    const lb = Number(logBeta);
    const cL = Number(ligandConc);
    const cM = Number(metalConc);
    const ph = Number(pH) || 7;

    if (isNaN(lb) || isNaN(cL) || isNaN(cM) || cL <= 0 || cM <= 0) {
      wx.showToast({ title: '请输入有效数值', icon: 'none' });
      return;
    }

    // 简化计算：假设副反应系数接近1（理想情况）
    const beta = Math.pow(10, lb);
    const ratio = cL / cM;

    // 估算络合分数（简化模型）
    let alpha;
    if (ratio > 10) {
      alpha = 0.95; // 配体过量，络合充分
    } else if (ratio > 1) {
      alpha = 0.7 + (ratio - 1) / 36; // 线性估算
    } else {
      alpha = 0.5 * ratio; // 配体不足
    }

    const result = `络合分数 α ≈ ${(alpha * 100).toFixed(1)}%`;
    const resultText = `络合程度：${(alpha * 100).toFixed(1)}%\n\n参数：\nlogβ = ${lb}\nC_L = ${cL} mol·L⁻¹\nC_M = ${cM} mol·L⁻¹\npH = ${ph}\n\n注：简化模型估算，实际情况需考虑副反应`;
    const hint = alpha > 0.9 ? '络合充分，掩蔽效果好' : alpha > 0.5 ? '部分络合' : '络合不充分，建议增加配体浓度';

    this.setData({ result, resultText, hint });

    historyService.add({
      type: 'complexation',
      title: '络合估算',
      input: `logβ=${lb}, C_L=${cL}`,
      result: `α=${(alpha * 100).toFixed(1)}%`
    });
  },

  reset() {
    this.setData({
      logBeta: '',
      ligandConc: '',
      metalConc: '',
      pH: '7',
      result: '',
      resultText: '',
      hint: ''
    });
  },

  /**
   * 生成分享卡片 (v6.0.0新增)
   */
  async generateCard() {
    const { logBeta, ligandConc, metalConc, pH, result, hint } = this.data;
    
    if (!result) {
      wx.showToast({
        title: '请先完成计算',
        icon: 'none'
      });
      return;
    }

    const inputs = {
      '稳定常数logβ': logBeta,
      '配体浓度': `${ligandConc} mol·L⁻¹`,
      '金属离子浓度': `${metalConc} mol·L⁻¹`,
      'pH值': pH
    };

    const results = {
      '络合程度': result,
      '评估': hint
    };

    await generateShareCard('络合计算', 'complexation', inputs, results, '简化模型估算，实际需考虑副反应系数');
  },

  onShareAppMessage() {
    return {
      title: '络合/掩蔽估算 - 材料化学科研工具箱',
      path: '/pages/advanced/complexation/complexation'
    };
  }
});

