// pages/advanced/kinetics/kinetics.js
const kinetics = require('../utils/kinetics');
const { generateShareCard } = require('../../../utils/shareHelper');

Page({
  data: {
    activeTab: 0,
    tabs: ['Arrhenius', '活化能计算', '反应级数'],
    
    // Arrhenius
    A: '1e13',
    Ea: '50',
    T: '298.15',
    arrheniusResult: null,
    
    // 活化能
    k1: '',
    T1: '298.15',
    k2: '',
    T2: '323.15',
    eaResult: null,
    
    // 反应级数
    A0: '1.0',
    k_value: '0.01',
    time: '100',
    order: 1,
    reactionResult: null
  },

  onTabChange(e) {
    this.setData({ activeTab: e.currentTarget.dataset.index });
  },

  calculateArrhenius() {
    const { A, Ea, T } = this.data;
    if (!A || !Ea || !T) {
      wx.showToast({ title: '请填写完整数据', icon: 'none' });
      return;
    }
    
    const result = kinetics.arrheniusEquation(parseFloat(A), parseFloat(Ea), parseFloat(T));
    this.setData({ arrheniusResult: result });
  },

  calculateEa() {
    const { k1, T1, k2, T2 } = this.data;
    if (!k1 || !T1 || !k2 || !T2) {
      wx.showToast({ title: '请填写完整数据', icon: 'none' });
      return;
    }
    
    const result = kinetics.calculateActivationEnergy(parseFloat(k1), parseFloat(T1), parseFloat(k2), parseFloat(T2));
    this.setData({ eaResult: result });
  },

  calculateReaction() {
    const { A0, k_value, time, order } = this.data;
    if (!A0 || !k_value || !time) {
      wx.showToast({ title: '请填写完整数据', icon: 'none' });
      return;
    }
    
    let result;
    switch(order) {
      case 0:
        result = kinetics.zeroOrderKinetics(parseFloat(A0), parseFloat(k_value), parseFloat(time));
        break;
      case 1:
        result = kinetics.firstOrderKinetics(parseFloat(A0), parseFloat(k_value), parseFloat(time));
        break;
      case 2:
        result = kinetics.secondOrderKinetics(parseFloat(A0), parseFloat(k_value), parseFloat(time));
        break;
    }
    
    this.setData({ reactionResult: result });
  },

  onInput(e) {
    this.setData({ [e.currentTarget.dataset.field]: e.detail.value });
  },

  onOrderChange(e) {
    this.setData({ order: parseInt(e.detail.value) });
  },

  /**
   * 生成分享卡片 (v6.0.0新增)
   */
  async generateCard() {
    const { activeTab, arrheniusResult, eaResult, reactionResult } = this.data;
    
    if (!arrheniusResult && !eaResult && !reactionResult) {
      wx.showToast({
        title: '请先完成计算',
        icon: 'none'
      });
      return;
    }

    const inputs = {};
    const results = {};

    if (activeTab === 0 && arrheniusResult) {
      // Arrhenius方程
      const { A, Ea, T } = this.data;
      inputs['频率因子A'] = A;
      inputs['活化能Ea'] = `${Ea} kJ·mol⁻¹`;
      inputs['温度T'] = `${T} K`;
      results['速率常数k'] = arrheniusResult.k_text || '';
    } else if (activeTab === 1 && eaResult) {
      // 活化能计算
      const { k1, T1, k2, T2 } = this.data;
      inputs['k1'] = k1;
      inputs['T1'] = `${T1} K`;
      inputs['k2'] = k2;
      inputs['T2'] = `${T2} K`;
      results['活化能Ea'] = eaResult.Ea_text || '';
    } else if (activeTab === 2 && reactionResult) {
      // 反应级数
      const { A0, k_value, time, order } = this.data;
      inputs['初始浓度[A]₀'] = `${A0} mol·L⁻¹`;
      inputs['速率常数k'] = k_value;
      inputs['时间t'] = `${time} s`;
      inputs['反应级数'] = `${order}级`;
      results['剩余浓度[A]'] = reactionResult.A_text || '';
      if (reactionResult.halfLife_text) {
        results['半衰期'] = reactionResult.halfLife_text;
      }
    }

    await generateShareCard('动力学计算', 'kinetics', inputs, results, '基于化学动力学基本方程');
  }
});

