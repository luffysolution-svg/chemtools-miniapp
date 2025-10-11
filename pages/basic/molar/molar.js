/**
 * 分子质量计算页面
 */

const { periodicElements } = require('../../../utils/periodic');
const { historyService } = require('../../../services/history');

// 从旧页面复制的工具函数
const SUBSCRIPT_DIGITS = {
  '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4',
  '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9'
};

function replaceSubscripts(value) {
  return value.replace(/[₀-₉]/g, ch => SUBSCRIPT_DIGITS[ch] || ch);
}

function mergeCount(target, source, multiplier = 1) {
  Object.keys(source).forEach(symbol => {
    target[symbol] = (target[symbol] || 0) + source[symbol] * multiplier;
  });
}

function parseFormula(formula) {
  const cleaned = replaceSubscripts(formula.replace(/\s+/g, ''));
  if (!cleaned) throw new Error('请输入化学式');
  
  const parts = cleaned.split(/[·.]/);
  const composition = Object.create(null);
  
  parts.forEach(part => {
    if (!part) return;
    let segment = part;
    let multiplier = 1;
    const match = segment.match(/^(\d+)(.*)$/);
    if (match) {
      multiplier = parseInt(match[1], 10);
      segment = match[2];
    }
    const counts = parseSegment(segment);
    mergeCount(composition, counts, multiplier);
  });
  
  return composition;
}

function parseSegment(segment) {
  const tokens = segment.match(/([A-Z][a-z]?|\d+|[()\[\]])/g);
  if (!tokens) throw new Error('化学式格式无效');
  
  const stack = [Object.create(null)];
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token === '(' || token === '[') {
      stack.push(Object.create(null));
    } else if (token === ')' || token === ']') {
      if (stack.length === 1) throw new Error('括号不匹配');
      const group = stack.pop();
      let multiplier = 1;
      const next = tokens[i + 1];
      if (next && /^\d+$/.test(next)) {
        multiplier = parseInt(next, 10);
        i++;
      }
      mergeCount(stack[stack.length - 1], group, multiplier);
    } else if (/^[A-Z][a-z]?$/.test(token)) {
      let count = 1;
      const next = tokens[i + 1];
      if (next && /^\d+$/.test(next)) {
        count = parseInt(next, 10);
        i++;
      }
      const top = stack[stack.length - 1];
      top[token] = (top[token] || 0) + count;
    }
  }
  
  if (stack.length !== 1) throw new Error('括号未正确闭合');
  return stack[0];
}

Page({
  data: {
    formula: '',
    molarMass: '',
    molarResultText: '',
    breakdown: null,
    mass: '',
    moles: '',
    convertResult: '',
    convertResultText: ''
  },

  onLoad() {
    // 创建元素质量映射
    this.massMap = {};
    this.numberMap = {};
    periodicElements.forEach(el => {
      this.massMap[el.symbol] = el.atomicMass;
      this.numberMap[el.symbol] = el.number;
    });
  },

  /**
   * 化学式输入
   */
  handleFormulaInput(e) {
    this.setData({ formula: e.detail.value });
  },

  /**
   * 计算摩尔质量
   */
  calculateMolar() {
    const { formula } = this.data;
    
    if (!formula) {
      wx.showToast({
        title: '请输入化学式',
        icon: 'none'
      });
      return;
    }

    try {
      const composition = parseFormula(formula);
      
      // 检查未识别的元素
      const missing = Object.keys(composition).filter(
        symbol => this.massMap[symbol] === undefined
      );
      if (missing.length) {
        wx.showToast({
          title: `未识别的元素：${missing.join(', ')}`,
          icon: 'none',
          duration: 3000
        });
        return;
      }

      // 计算摩尔质量和组成
      const entries = Object.entries(composition).sort(
        (a, b) => (this.numberMap[a[0]] || 999) - (this.numberMap[b[0]] || 999)
      );
      
      let total = 0;
      const breakdown = [];
      
      entries.forEach(([symbol, count]) => {
        const atomicMass = this.massMap[symbol];
        const contribution = atomicMass * count;
        total += contribution;
        breakdown.push({
          symbol,
          count,
          mass: contribution.toFixed(3)
        });
      });

      const molarMass = total.toFixed(3);
      const breakdownText = breakdown
        .map(item => `${item.symbol}${item.count > 1 ? '×' + item.count : ''}: ${item.mass}`)
        .join('\n');
      
      const molarResultText = `化学式：${formula}\n摩尔质量：${molarMass} g·mol⁻¹\n\n组成元素：\n${breakdownText}`;

      this.setData({
        molarMass,
        molarResultText,
        breakdown,
        mass: '',
        moles: '',
        convertResult: '',
        convertResultText: ''
      });

      // 添加到历史
      historyService.add({
        type: 'molar',
        title: '分子质量计算',
        input: formula,
        result: `Mr = ${molarMass} g·mol⁻¹`
      });

    } catch (error) {
      wx.showToast({
        title: error.message || '计算失败',
        icon: 'none',
        duration: 3000
      });
    }
  },

  /**
   * 质量输入
   */
  handleMassInput(e) {
    this.setData({ mass: e.detail.value });
  },

  /**
   * 物质的量输入
   */
  handleMolesInput(e) {
    this.setData({ moles: e.detail.value });
  },

  /**
   * 质量转物质的量
   */
  massToMoles() {
    const { mass, molarMass } = this.data;
    
    if (!mass) {
      wx.showToast({
        title: '请输入质量',
        icon: 'none'
      });
      return;
    }

    const m = Number(mass);
    const Mr = Number(molarMass);
    
    if (isNaN(m)) {
      wx.showToast({
        title: '请输入有效数值',
        icon: 'none'
      });
      return;
    }

    const n = m / Mr;
    const result = `n = ${n.toFixed(6)} mol`;
    const resultText = `质量：m = ${m.toFixed(4)} g\n物质的量：n = ${n.toFixed(6)} mol\n摩尔质量：Mr = ${Mr} g·mol⁻¹`;

    this.setData({
      convertResult: result,
      convertResultText: resultText,
      moles: n.toFixed(6)
    });
  },

  /**
   * 物质的量转质量
   */
  molesToMass() {
    const { moles, molarMass } = this.data;
    
    if (!moles) {
      wx.showToast({
        title: '请输入物质的量',
        icon: 'none'
      });
      return;
    }

    const n = Number(moles);
    const Mr = Number(molarMass);
    
    if (isNaN(n)) {
      wx.showToast({
        title: '请输入有效数值',
        icon: 'none'
      });
      return;
    }

    const m = n * Mr;
    const result = `m = ${m.toFixed(4)} g`;
    const resultText = `物质的量：n = ${n.toFixed(6)} mol\n质量：m = ${m.toFixed(4)} g\n摩尔质量：Mr = ${Mr} g·mol⁻¹`;

    this.setData({
      convertResult: result,
      convertResultText: resultText,
      mass: m.toFixed(4)
    });
  },

  /**
   * 清空化学式
   */
  resetFormula() {
    this.setData({
      formula: '',
      molarMass: '',
      molarResultText: '',
      breakdown: null,
      mass: '',
      moles: '',
      convertResult: '',
      convertResultText: ''
    });
  },

  /**
   * 分享
   */
  onShareAppMessage() {
    return {
      title: '分子质量计算 - 材料化学科研工具箱',
      path: '/pages/basic/molar/molar'
    };
  }
});

