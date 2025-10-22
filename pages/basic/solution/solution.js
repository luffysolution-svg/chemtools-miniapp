/**
 * 溶液配比计算页面（增强版）
 */

const { historyService } = require('../../../services/history');
const { generateShareCard } = require('../utils/shareHelper');
const { getPresets } = require('../../../utils/input-presets');

Page({
  data: {
    modeOptions: ['溶液混合 (同溶质)', '稀释计算 (C₁V₁ = C₂V₂)'],
    modeIndex: 0,
    v1: '',
    c1: '',
    v2: '',
    c2: '',
    result: '',
    resultText: '',
    formula: '',
    hint: '',
    historyInput: '',
    // 新增：预设值
    volumePresets: [],
    concentrationPresets: []
  },
  
  onLoad() {
    this.setData({
      volumePresets: getPresets('solution', 'volume'),
      concentrationPresets: getPresets('solution', 'concentration')
    });
  },

  /**
   * 模式改变
   */
  handleModeChange(e) {
    const index = Number(e.detail.value);
    this.setData({ 
      modeIndex: index,
      result: '',
      resultText: ''
    });
  },

  /**
   * 输入处理
   */
  handleV1Input(e) {
    this.setData({ v1: e.detail.value });
  },

  handleC1Input(e) {
    this.setData({ c1: e.detail.value });
  },

  handleV2Input(e) {
    this.setData({ v2: e.detail.value });
  },

  handleC2Input(e) {
    this.setData({ c2: e.detail.value });
  },
  
  /**
   * 数值变化处理（预设值或历史记录选择）
   */
  handleV1Change(e) {
    this.setData({ v1: e.detail.value });
  },
  
  handleC1Change(e) {
    this.setData({ c1: e.detail.value });
  },
  
  handleV2Change(e) {
    this.setData({ v2: e.detail.value });
  },
  
  handleC2Change(e) {
    this.setData({ c2: e.detail.value });
  },

  /**
   * 执行计算
   */
  calculate() {
    const { modeIndex, v1, c1, v2, c2 } = this.data;
    
    const V1 = Number(v1);
    const C1 = Number(c1);
    const V2 = Number(v2);
    const C2 = Number(c2);

    // 验证输入
    if (isNaN(V1) || isNaN(C1) || isNaN(V2)) {
      wx.showToast({
        title: '请完整输入必填参数',
        icon: 'none'
      });
      return;
    }

    if (V1 <= 0 || C1 <= 0 || V2 <= 0) {
      wx.showToast({
        title: '体积和浓度需大于0',
        icon: 'none'
      });
      return;
    }

    let result, formula, resultText, historyInput;

    if (modeIndex === 0) {
      // 溶液混合
      if (isNaN(C2) || C2 <= 0) {
        wx.showToast({
          title: '混合模式需输入两个溶液的浓度',
          icon: 'none'
        });
        return;
      }

      const totalVolume = V1 + V2;
      const totalMoles = (C1 * V1 + C2 * V2) / 1000; // 转为L
      const finalConcentration = totalMoles / (totalVolume / 1000);

      result = `混合后浓度：${finalConcentration.toFixed(4)} mol·L⁻¹`;
      formula = `V(混) = ${totalVolume.toFixed(2)} mL`;
      resultText = `溶液1：V₁=${V1} mL, c₁=${C1} mol·L⁻¹\n溶液2：V₂=${V2} mL, c₂=${C2} mol·L⁻¹\n混合后：V=${totalVolume.toFixed(2)} mL, c=${finalConcentration.toFixed(4)} mol·L⁻¹`;
      historyInput = `${V1}mL@${C1}M + ${V2}mL@${C2}M`;

    } else {
      // 稀释计算
      const finalConcentration = (C1 * V1) / V2;
      
      result = `稀释后浓度：${finalConcentration.toFixed(4)} mol·L⁻¹`;
      formula = `C₁V₁ = C₂V₂`;
      
      let comparison = '';
      if (!isNaN(C2) && C2 > 0) {
        const diff = Math.abs(finalConcentration - C2);
        const percent = (diff / C2 * 100).toFixed(2);
        comparison = `\n与目标浓度 ${C2} mol·L⁻¹ 相差 ${percent}%`;
      }

      resultText = `原溶液：V₁=${V1} mL, C₁=${C1} mol·L⁻¹\n稀释至：V₂=${V2} mL\n稀释后：C₂=${finalConcentration.toFixed(4)} mol·L⁻¹${comparison}`;
      historyInput = `${V1}mL@${C1}M → ${V2}mL`;
    }

    this.setData({
      result,
      formula,
      resultText,
      historyInput,
      hint: modeIndex === 0 ? '假设体积具有加和性（稀溶液近似）' : '根据C₁V₁=C₂V₂计算'
    });

    // 添加到历史
    historyService.add({
      type: 'solution',
      title: `溶液配比 - ${this.data.modeOptions[modeIndex]}`,
      input: historyInput,
      result: result
    });
  },

  /**
   * 清空
   */
  reset() {
    this.setData({
      v1: '',
      c1: '',
      v2: '',
      c2: '',
      result: '',
      resultText: '',
      formula: '',
      hint: ''
    });
  },

  /**
   * 生成分享卡片 (v6.0.0新增)
   */
  async generateCard() {
    const { modeIndex, modeOptions, v1, c1, v2, c2, result, formula, hint } = this.data;
    
    if (!result) {
      wx.showToast({
        title: '请先完成计算',
        icon: 'none'
      });
      return;
    }

    const mode = modeOptions[modeIndex];
    const inputs = {
      '计算模式': mode,
      '溶液1体积': `${v1} mL`,
      '溶液1浓度': `${c1} mol·L⁻¹`,
      '溶液2体积': `${v2} mL`
    };

    if (modeIndex === 0 && c2) {
      inputs['溶液2浓度'] = `${c2} mol·L⁻¹`;
    }

    const results = {
      '计算结果': result
    };

    if (formula) {
      results['公式'] = formula;
    }

    const notes = hint || '计算结果仅供参考，实际操作请遵循实验室安全规范';

    await generateShareCard('溶液配制', 'solution', inputs, results, notes);
  },

  /**
   * 分享
   */
  onShareAppMessage() {
    return {
      title: '溶液配比计算 - 材料化学科研工具箱',
      path: '/pages/basic/solution/solution'
    };
  }
});

