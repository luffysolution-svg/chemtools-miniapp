/**
 * 电化学计算页面
 */

const { listReferenceNames, refIdByIndex, convertVsNHE, nernstE } = require('../../../utils/electrochem');
const { historyService } = require('../../../services/history');

Page({
  data: {
    tools: [
      { id: 'convert', name: '电位换算', icon: '🔄' },
      { id: 'nernst', name: 'Nernst方程', icon: '⚛️' }
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
    nernstHint: ''
  },

  onLoad() {
    const references = listReferenceNames();
    this.setData({ references });
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
    const E_NHE = convertVsNHE(E, fromRefId, 25, 0);
    
    // 再从 NHE 转换到目标参比
    const toRefId = refIdByIndex(toRefIndex);
    const E_to = convertVsNHE(0, toRefId, 25, 0); // 获取目标参比的偏移
    const E_final = E_NHE - E_to;

    const convertResult = `${E_final.toFixed(4)} V`;
    const convertResultText = `源电位：${E.toFixed(4)} V vs ${this.data.references[fromRefIndex]}\n换算后：${E_final.toFixed(4)} V vs ${this.data.references[toRefIndex]}`;

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

  onShareAppMessage() {
    return {
      title: '电化学计算 - 材料化学科研工具箱',
      path: '/pages/advanced/electrochem/electrochem'
    };
  }
});

