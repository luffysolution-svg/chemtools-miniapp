// pages/advanced/thermodynamics/thermodynamics.js
const thermo = require('../utils/thermodynamics');
const { generateShareCard } = require('../../../utils/shareHelper');
const { getPresets } = require('../../../utils/input-presets');

Page({
  data: {
    activeTab: 0,
    tabs: ['Gibbs自由能', '平衡常数', 'Van\'t Hoff', '反应焓变'],
    temperaturePresets: [],
    
    // Gibbs自由能
    deltaH: '',
    temperature: '298.15',
    deltaS: '',
    gibbsResult: null,
    
    // 平衡常数
    deltaG_k: '',
    temp_k: '298.15',
    K_value: '',
    kResult: null,
    
    // Van't Hoff
    K1: '',
    T1: '298.15',
    T2: '323.15',
    deltaH_vh: '',
    vhResult: null,
    
    // 反应焓变
    products: [{deltaH_f: '', coefficient: '1'}],
    reactants: [{deltaH_f: '', coefficient: '1'}],
    enthalpyResult: null
  },

  onTabChange(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({ activeTab: index });
  },

  // Gibbs自由能计算
  calculateGibbs() {
    const { deltaH, temperature, deltaS } = this.data;
    
    if (!deltaH || !temperature || !deltaS) {
      wx.showToast({ title: '请填写完整数据', icon: 'none' });
      return;
    }
    
    const result = thermo.calculateGibbsFreeEnergy(
      parseFloat(deltaH),
      parseFloat(temperature),
      parseFloat(deltaS)
    );
    
    this.setData({ gibbsResult: result });
  },

  // 平衡常数计算
  calculateK() {
    const { deltaG_k, temp_k } = this.data;
    
    if (!deltaG_k || !temp_k) {
      wx.showToast({ title: '请填写完整数据', icon: 'none' });
      return;
    }
    
    const result = thermo.calculateEquilibriumConstant(
      parseFloat(deltaG_k),
      parseFloat(temp_k)
    );
    
    this.setData({ kResult: result });
  },

  // Van't Hoff方程计算
  calculateVanHoff() {
    const { K1, T1, T2, deltaH_vh } = this.data;
    
    if (!K1 || !T1 || !T2 || !deltaH_vh) {
      wx.showToast({ title: '请填写完整数据', icon: 'none' });
      return;
    }
    
    const result = thermo.vantHoffEquation(
      parseFloat(K1),
      parseFloat(T1),
      parseFloat(T2),
      parseFloat(deltaH_vh)
    );
    
    this.setData({ vhResult: result });
  },

  // 反应焓变计算
  calculateEnthalpy() {
    const { products, reactants } = this.data;
    
    const validProducts = products.filter(p => p.deltaH_f && p.coefficient);
    const validReactants = reactants.filter(r => r.deltaH_f && r.coefficient);
    
    if (validProducts.length === 0 || validReactants.length === 0) {
      wx.showToast({ title: '请至少添加一个产物和反应物', icon: 'none' });
      return;
    }
    
    const productData = validProducts.map(p => ({
      deltaH_f: parseFloat(p.deltaH_f),
      coefficient: parseFloat(p.coefficient)
    }));
    
    const reactantData = validReactants.map(r => ({
      deltaH_f: parseFloat(r.deltaH_f),
      coefficient: parseFloat(r.coefficient)
    }));
    
    const result = thermo.calculateReactionEnthalpy(productData, reactantData);
    
    this.setData({ enthalpyResult: result });
  },

  // 添加/删除产物/反应物
  addProduct() {
    const products = this.data.products;
    products.push({deltaH_f: '', coefficient: '1'});
    this.setData({ products });
  },

  removeProduct(e) {
    const index = e.currentTarget.dataset.index;
    const products = this.data.products;
    if (products.length > 1) {
      products.splice(index, 1);
      this.setData({ products });
    }
  },

  addReactant() {
    const reactants = this.data.reactants;
    reactants.push({deltaH_f: '', coefficient: '1'});
    this.setData({ reactants });
  },

  removeReactant(e) {
    const index = e.currentTarget.dataset.index;
    const reactants = this.data.reactants;
    if (reactants.length > 1) {
      reactants.splice(index, 1);
      this.setData({ reactants });
    }
  },

  // 输入处理
  onInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [field]: e.detail.value });
  },

  onProductInput(e) {
    const { index, field } = e.currentTarget.dataset;
    const products = this.data.products;
    products[index][field] = e.detail.value;
    this.setData({ products });
  },

  onReactantInput(e) {
    const { index, field } = e.currentTarget.dataset;
    const reactants = this.data.reactants;
    reactants[index][field] = e.detail.value;
    this.setData({ reactants });
  },

  // 清除结果
  clearResults() {
    this.setData({
      gibbsResult: null,
      kResult: null,
      vhResult: null,
      enthalpyResult: null
    });
  },

  /**
   * 生成分享卡片 (v6.0.0新增)
   */
  async generateCard() {
    const { gibbsResult, kResult, vhResult, enthalpyResult } = this.data;
    
    if (!gibbsResult && !kResult && !vhResult && !enthalpyResult) {
      wx.showToast({
        title: '请先完成计算',
        icon: 'none'
      });
      return;
    }

    const inputs = {};
    const results = {};

    // 根据有结果的计算类型生成数据
    if (gibbsResult) {
      inputs['Gibbs能计算'] = '已完成';
      results['ΔG'] = gibbsResult.deltaG_text || '';
      if (gibbsResult.spontaneous !== undefined) {
        results['反应趋势'] = gibbsResult.spontaneous;
      }
    }

    if (kResult) {
      inputs['平衡常数计算'] = '已完成';
      results['平衡常数K'] = kResult.K_text || '';
    }

    if (vhResult) {
      inputs["Van't Hoff计算"] = '已完成';
      results['ΔH'] = vhResult.deltaH_text || '';
    }

    if (enthalpyResult) {
      inputs['焓变计算'] = '已完成';
      results['ΔH_rxn'] = enthalpyResult.deltaH_text || '';
    }

    await generateShareCard('热力学计算', 'thermodynamics', inputs, results, '基于热力学基本定律');
  }
});

