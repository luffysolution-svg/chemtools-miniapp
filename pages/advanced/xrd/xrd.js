/**
 * XRD计算工具页面
 */

const { listTargets, dFromTheta2, theta2FromD, dCubic, dTetragonal, dOrthorhombic, dHexagonal } = require('../../../utils/xrd');
const { historyService } = require('../../../services/history');

Page({
  data: {
    // 工具选择
    tools: [
      { id: 'bragg', name: 'd-2θ互算', icon: '💎' },
      { id: 'crystal', name: '晶系d(hkl)', icon: '🔷' }
    ],
    currentTool: 'bragg',

    // Bragg计算
    xrayTargets: [],
    xrayIndex: 0,
    lambda: '1.5406',
    lambdaPlaceholder: '1.5406',
    braggMode: 'theta-to-d',
    theta2: '',
    dValue: '',
    braggResult: '',
    braggResultText: '',
    braggHint: '',

    // 晶系计算
    crystalSystems: ['立方晶系', '四方晶系', '正交晶系', '六方晶系'],
    crystalIndex: 0,
    latticeA: '',
    latticeB: '',
    latticeC: '',
    millerH: '',
    millerK: '',
    millerL: '',
    crystalResult: '',
    crystalResultText: '',
    crystalHint: ''
  },

  onLoad() {
    // 加载X射线源数据
    const targets = listTargets();
    const xrayTargets = targets.map(t => `${t.name} (${t.lambda} Å)`);
    this.setData({ 
      xrayTargets,
      _targets: targets
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
   * ========== Bragg计算功能 ==========
   */

  /**
   * X射线源改变
   */
  handleXrayChange(e) {
    const index = Number(e.detail.value);
    const lambda = this.data._targets[index].lambda;
    this.setData({ 
      xrayIndex: index,
      lambda: String(lambda),
      lambdaPlaceholder: String(lambda)
    });
  },

  /**
   * 波长输入
   */
  handleLambdaInput(e) {
    this.setData({ lambda: e.detail.value });
  },

  /**
   * 切换Bragg模式
   */
  switchBraggMode(e) {
    const mode = e.currentTarget.dataset.mode;
    this.setData({ 
      braggMode: mode,
      theta2: '',
      dValue: '',
      braggResult: ''
    });
  },

  /**
   * 2θ输入
   */
  handleTheta2Input(e) {
    this.setData({ theta2: e.detail.value });
  },

  /**
   * d值输入
   */
  handleDInput(e) {
    this.setData({ dValue: e.detail.value });
  },

  /**
   * 计算Bragg
   */
  calculateBragg() {
    const { braggMode, lambda, theta2, dValue } = this.data;

    const lam = Number(lambda);
    if (isNaN(lam) || lam <= 0) {
      wx.showToast({ title: '请输入有效的波长', icon: 'none' });
      return;
    }

    if (braggMode === 'theta-to-d') {
      // 2θ → d
      if (!theta2) {
        wx.showToast({ title: '请输入衍射角 2θ', icon: 'none' });
        return;
      }

      const result = dFromTheta2(theta2, lam);
      if (result.error) {
        wx.showToast({ title: result.error, icon: 'none' });
        return;
      }

      const d = result.d;
      const braggResult = `d = ${d.toFixed(4)} Å`;
      const braggResultText = `晶面间距 d = ${d.toFixed(4)} Å\n\n参数：\n2θ = ${theta2}°\nλ = ${lam} Å`;

      this.setData({
        braggResult,
        braggResultText,
        braggHint: 'Bragg定律：nλ = 2d sinθ (n=1)',
        dValue: d.toFixed(4)
      });

      historyService.add({
        type: 'xrd',
        title: 'XRD - 2θ→d',
        input: `2θ=${theta2}°, λ=${lam}Å`,
        result: `d=${d.toFixed(4)}Å`
      });

    } else {
      // d → 2θ
      if (!dValue) {
        wx.showToast({ title: '请输入晶面间距 d', icon: 'none' });
        return;
      }

      const result = theta2FromD(dValue, lam);
      if (result.error) {
        wx.showToast({ title: result.error, icon: 'none', duration: 2500 });
        return;
      }

      const theta = result.theta2;
      const braggResult = `2θ = ${theta.toFixed(3)}°`;
      const braggResultText = `衍射角 2θ = ${theta.toFixed(3)}°\n\n参数：\nd = ${dValue} Å\nλ = ${lam} Å`;

      this.setData({
        braggResult,
        braggResultText,
        braggHint: 'Bragg定律：nλ = 2d sinθ (n=1)',
        theta2: theta.toFixed(3)
      });

      historyService.add({
        type: 'xrd',
        title: 'XRD - d→2θ',
        input: `d=${dValue}Å, λ=${lam}Å`,
        result: `2θ=${theta.toFixed(3)}°`
      });
    }
  },

  /**
   * 清空Bragg
   */
  resetBragg() {
    this.setData({
      theta2: '',
      dValue: '',
      braggResult: '',
      braggResultText: '',
      braggHint: ''
    });
  },

  /**
   * ========== 晶系计算功能 ==========
   */

  /**
   * 晶系改变
   */
  handleCrystalChange(e) {
    const index = Number(e.detail.value);
    this.setData({ 
      crystalIndex: index,
      latticeB: '',
      latticeC: '',
      crystalResult: ''
    });
  },

  /**
   * 晶格参数输入
   */
  handleLatticeAInput(e) {
    this.setData({ latticeA: e.detail.value });
  },

  handleLatticeBInput(e) {
    this.setData({ latticeB: e.detail.value });
  },

  handleLatticeCInput(e) {
    this.setData({ latticeC: e.detail.value });
  },

  /**
   * 米勒指数输入
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

  /**
   * 计算晶系d(hkl)
   */
  calculateCrystal() {
    const { crystalIndex, latticeA, latticeB, latticeC, millerH, millerK, millerL } = this.data;

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

    let d, systemName;

    switch (crystalIndex) {
      case 0: // 立方
        d = dCubic(a, h, k, l);
        systemName = '立方晶系';
        break;

      case 1: // 四方
        const c1 = Number(latticeC);
        if (isNaN(c1) || c1 <= 0) {
          wx.showToast({ title: '请输入有效的晶格常数 c', icon: 'none' });
          return;
        }
        d = dTetragonal(a, c1, h, k, l);
        systemName = '四方晶系';
        break;

      case 2: // 正交
        const b = Number(latticeB);
        const c2 = Number(latticeC);
        if (isNaN(b) || b <= 0 || isNaN(c2) || c2 <= 0) {
          wx.showToast({ title: '请输入有效的晶格常数 b 和 c', icon: 'none' });
          return;
        }
        d = dOrthorhombic(a, b, c2, h, k, l);
        systemName = '正交晶系';
        break;

      case 3: // 六方
        const c3 = Number(latticeC);
        if (isNaN(c3) || c3 <= 0) {
          wx.showToast({ title: '请输入有效的晶格常数 c', icon: 'none' });
          return;
        }
        d = dHexagonal(a, c3, h, k, l);
        systemName = '六方晶系';
        break;
    }

    const crystalResult = `d(${h}${k}${l}) = ${d.toFixed(4)} Å`;
    const crystalResultText = `${systemName}\n晶面间距 d(${h}${k}${l}) = ${d.toFixed(4)} Å\n\n晶格参数：\na = ${a} Å${latticeB ? `\nb = ${latticeB} Å` : ''}${latticeC ? `\nc = ${latticeC} Å` : ''}`;

    this.setData({
      crystalResult,
      crystalResultText,
      crystalHint: `${systemName}的晶面间距`
    });

    historyService.add({
      type: 'xrd',
      title: `XRD - ${systemName}`,
      input: `(${h}${k}${l}), a=${a}`,
      result: `d=${d.toFixed(4)}Å`
    });
  },

  /**
   * 清空晶系计算
   */
  resetCrystal() {
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
  },

  /**
   * 分享
   */
  onShareAppMessage() {
    return {
      title: 'XRD计算工具 - 材料化学科研工具箱',
      path: '/pages/advanced/xrd/xrd'
    };
  }
});

