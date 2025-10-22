// 配方计算器 - 多组分溶液、pH缓冲液、水热参数

const {
  calculateMultiComponent,
  calculateBuffer,
  calculateHydrothermal,
  listBufferSystems
} = require('../../../utils/formula-calculator');
const { historyService } = require('../../../services/history');
const { periodicElements } = require('../../../utils/periodic');

// 分子量计算辅助函数（从molar.js复制）
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

function parseFormulaToComposition(formula) {
  const cleaned = replaceSubscripts(formula.replace(/\s+/g, ''));
  if (!cleaned) return null;
  
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
    if (counts) mergeCount(composition, counts, multiplier);
  });
  
  return composition;
}

function parseSegment(segment) {
  const tokens = segment.match(/([A-Z][a-z]?|\d+|[()\[\]])/g);
  if (!tokens) return null;
  
  const stack = [Object.create(null)];
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token === '(' || token === '[') {
      stack.push(Object.create(null));
    } else if (token === ')' || token === ']') {
      if (stack.length === 1) return null;
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
  
  if (stack.length !== 1) return null;
  return stack[0];
}

Page({
  data: {
    // 工具选择
    tools: [
      { id: 'multi-component', name: '多组分溶液', icon: '⚗️' },
      { id: 'buffer', name: 'pH缓冲液', icon: '🧪' },
      { id: 'hydrothermal', name: '水热参数', icon: '🔥' }
    ],
    currentTool: 'multi-component',

    // 多组分溶液部分
    totalVolume: '100',
    componentInput: '',
    componentPlaceholder: '智能格式：名称,浓度(M) 或 名称,浓度(M),分子量\n例如：\nNaCl,0.1 (自动计算分子量)\nKCl,0.05,74.55 (手动指定)',
    multiResult: null,
    multiResultText: '',
    // 元素质量映射
    massMap: {},

    // 缓冲液部分
    bufferSystems: [],
    bufferSystemIndex: 0,
    targetPH: '',
    bufferVolume: '1000',
    bufferConcentration: '0.1',
    bufferResult: null,
    bufferResultText: '',

    // 水热参数部分
    solventTypes: ['水', '乙醇', '甲醇', '乙二醇', '其他'],
    solventIndex: 0,
    fillVolume: '',
    autoclaveVolume: '',
    temperature: '',
    hydroResult: null,
    hydroResultText: ''
  },

  onLoad() {
    // 创建元素质量映射
    const massMap = {};
    periodicElements.forEach(el => {
      massMap[el.symbol] = el.atomicMass;
    });
    
    // 加载缓冲体系列表
    const systems = listBufferSystems();
    const bufferSystems = systems.map(s => `${s.name} (pH ${s.range[0]}-${s.range[1]})`);
    this.setData({ 
      bufferSystems,
      _bufferSystemsData: systems,
      massMap
    });
  },
  
  /**
   * 计算化学式的分子量
   */
  calculateMolecularWeight(formula) {
    try {
      const composition = parseFormulaToComposition(formula);
      if (!composition) return null;
      
      let totalMass = 0;
      for (const [symbol, count] of Object.entries(composition)) {
        const mass = this.data.massMap[symbol];
        if (!mass) return null; // 未知元素
        totalMass += mass * count;
      }
      return totalMass;
    } catch (e) {
      return null;
    }
  },

  /**
   * 切换工具
   */
  switchTool(e) {
    const tool = e.currentTarget.dataset.tool;
    this.setData({ currentTool: tool });
  },

  /**
   * ========== 多组分溶液 ==========
   */

  handleTotalVolumeInput(e) {
    this.setData({ totalVolume: e.detail.value });
  },

  handleComponentInput(e) {
    this.setData({ componentInput: e.detail.value });
  },
  
  /**
   * 填充示例数据
   */
  fillExampleComponents() {
    // 使用智能格式（只输入化学式和浓度）
    const exampleData = 'NaCl,0.1\nKCl,0.05\nMgSO4,0.02';
    this.setData({ componentInput: exampleData });
    wx.showToast({
      title: '已填充示例（将自动计算分子量）',
      icon: 'success',
      duration: 2000
    });
  },

  calculateMulti() {
    const { componentInput, totalVolume } = this.data;

    if (!componentInput.trim()) {
      wx.showToast({
        title: '请输入组分信息',
        icon: 'none'
      });
      return;
    }

    if (!totalVolume || Number(totalVolume) <= 0) {
      wx.showToast({
        title: '请输入有效的总体积',
        icon: 'none'
      });
      return;
    }

    // 解析输入（支持智能分子量计算）
    const lines = componentInput.trim().split('\n');
    const components = [];
    const autoCalculated = []; // 记录自动计算的分子量

    for (const line of lines) {
      const parts = line.trim().split(/[,，\s]+/);
      if (parts.length >= 2) {
        const name = parts[0];
        const targetConc = parseFloat(parts[1]);
        let molWeight = parts[2] ? parseFloat(parts[2]) : null;
        const density = parts[3] ? parseFloat(parts[3]) : null;
        
        // 如果没有提供分子量，尝试自动计算
        if (!molWeight || isNaN(molWeight)) {
          const calculated = this.calculateMolecularWeight(name);
          if (calculated) {
            molWeight = calculated;
            autoCalculated.push({ name, molWeight: calculated.toFixed(2) });
          }
        }
        
        if (molWeight && !isNaN(targetConc)) {
          components.push({
            name,
            targetConc,
            molWeight,
            density: density && !isNaN(density) ? density : null
          });
        }
      }
    }

    if (components.length === 0) {
      wx.showToast({
        title: '未找到有效组分',
        icon: 'none'
      });
      return;
    }
    
    // 自动计算的分子量已记录在autoCalculated数组中
    // 不需要调试输出，已在结果中显示

    const result = calculateMultiComponent(components, parseFloat(totalVolume));

    if (result.error) {
      wx.showToast({
        title: result.error,
        icon: 'none',
        duration: 3000
      });
      return;
    }

    // 格式化结果
    let resultText = `✨ 配方计算结果\n\n`;
    resultText += `目标体积：${result.totalVolume}\n`;
    resultText += `总质量：${result.totalMass}\n\n`;
    
    // 显示自动计算的分子量
    if (autoCalculated.length > 0) {
      resultText += `💡 自动计算的分子量：\n`;
      autoCalculated.forEach(item => {
        resultText += `   ${item.name}: ${item.molWeight} g/mol\n`;
      });
      resultText += `\n`;
    }
    
    resultText += `📋 各组分用量：\n`;

    result.components.forEach((comp, idx) => {
      resultText += `${idx + 1}. ${comp.name}\n`;
      resultText += `   浓度：${comp.targetConc} M\n`;
      resultText += `   分子量：${comp.molWeight.toFixed(2)} g/mol\n`;
      resultText += `   质量：${comp.mass} g\n`;
      if (comp.volume) {
        resultText += `   体积：约${comp.volume} mL\n`;
      }
      resultText += `\n`;
    });

    resultText += `${result.steps}`;

    this.setData({
      multiResult: result,
      multiResultText: resultText
    });

    historyService.add({
      tool: '配方计算器-多组分',
      input: `${components.length}种组分, ${totalVolume}mL`,
      result: `总质量${result.totalMass}`
    });
  },

  /**
   * ========== pH缓冲液 ==========
   */

  handleBufferSystemChange(e) {
    this.setData({ bufferSystemIndex: Number(e.detail.value) });
  },

  handleTargetPHInput(e) {
    this.setData({ targetPH: e.detail.value });
  },

  handleBufferVolumeInput(e) {
    this.setData({ bufferVolume: e.detail.value });
  },

  handleBufferConcentrationInput(e) {
    this.setData({ bufferConcentration: e.detail.value });
  },

  calculateBufferSolution() {
    const { bufferSystemIndex, targetPH, bufferVolume, bufferConcentration, _bufferSystemsData } = this.data;

    if (!targetPH) {
      wx.showToast({
        title: '请输入目标pH',
        icon: 'none'
      });
      return;
    }

    const bufferType = _bufferSystemsData[bufferSystemIndex].id;
    const result = calculateBuffer(
      bufferType,
      parseFloat(targetPH),
      parseFloat(bufferVolume),
      parseFloat(bufferConcentration)
    );

    if (result.error) {
      wx.showToast({
        title: result.error,
        icon: 'none',
        duration: 3000
      });
      if (result.suggestion) {
        setTimeout(() => {
          wx.showToast({
            title: result.suggestion,
            icon: 'none',
            duration: 3000
          });
        }, 3000);
      }
      return;
    }

    // 格式化结果
    let resultText = `🧪 ${result.bufferName} 配制方案\n\n`;
    resultText += `目标pH：${result.targetPH}\n`;
    resultText += `pKa：${result.pKa}\n`;
    resultText += `[A-]/[HA]比例：${result.ratio}\n\n`;
    
    resultText += `📋 组分用量：\n\n`;
    result.components.forEach((comp, idx) => {
      resultText += `${idx + 1}. ${comp.name} (${comp.role})\n`;
      resultText += `   质量：${comp.mass} g\n`;
      resultText += `   浓度：${comp.concentration} M\n\n`;
    });

    resultText += `${result.steps}`;

    this.setData({
      bufferResult: result,
      bufferResultText: resultText
    });

    historyService.add({
      tool: '配方计算器-缓冲液',
      input: `${result.bufferName}, pH=${result.targetPH}`,
      result: '配制方案已生成'
    });
  },

  /**
   * ========== 水热参数 ==========
   */

  handleSolventChange(e) {
    this.setData({ solventIndex: Number(e.detail.value) });
  },

  handleFillVolumeInput(e) {
    this.setData({ fillVolume: e.detail.value });
  },

  handleAutoclaveVolumeInput(e) {
    this.setData({ autoclaveVolume: e.detail.value });
  },

  handleTemperatureInput(e) {
    this.setData({ temperature: e.detail.value });
  },

  calculateHydro() {
    const { solventTypes, solventIndex, fillVolume, autoclaveVolume, temperature } = this.data;

    if (!fillVolume || !autoclaveVolume || !temperature) {
      wx.showToast({
        title: '请填写所有参数',
        icon: 'none'
      });
      return;
    }

    const solvent = solventTypes[solventIndex];
    const result = calculateHydrothermal(
      solvent,
      parseFloat(fillVolume),
      parseFloat(autoclaveVolume),
      parseFloat(temperature)
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
    let resultText = `🔥 水热反应参数分析\n\n`;
    resultText += `溶剂：${solvent}\n`;
    resultText += `填充体积：${result.fillVolume}\n`;
    resultText += `反应釜容积：${result.autoclaveVolume}\n`;
    resultText += `填充度：${result.fillRatio}\n`;
    resultText += `反应温度：${result.temperature}\n`;
    resultText += `预期压力：${result.pressureEstimate}\n\n`;

    resultText += `⚠️ 安全评估：\n${result.safetyWarning}\n\n`;
    if (result.tempWarning) {
      resultText += `${result.tempWarning}\n\n`;
    }

    resultText += `${result.recommendations}\n\n`;
    resultText += `${result.note}`;

    this.setData({
      hydroResult: result,
      hydroResultText: resultText
    });

    historyService.add({
      tool: '配方计算器-水热参数',
      input: `${fillVolume}/${autoclaveVolume}mL, ${temperature}°C`,
      result: `填充度${result.fillRatio}`
    });
  },

  /**
   * 清空结果
   */
  clearResult() {
    const { currentTool } = this.data;

    switch (currentTool) {
      case 'multi-component':
        this.setData({
          componentInput: '',
          multiResult: null,
          multiResultText: ''
        });
        break;
      case 'buffer':
        this.setData({
          targetPH: '',
          bufferResult: null,
          bufferResultText: ''
        });
        break;
      case 'hydrothermal':
        this.setData({
          fillVolume: '',
          autoclaveVolume: '',
          temperature: '',
          hydroResult: null,
          hydroResultText: ''
        });
        break;
    }
  },

  /**
   * 导出结果
   */
  exportResult() {
    const { currentTool, multiResultText, bufferResultText, hydroResultText } = this.data;

    let text = '';
    switch (currentTool) {
      case 'multi-component':
        text = multiResultText;
        break;
      case 'buffer':
        text = bufferResultText;
        break;
      case 'hydrothermal':
        text = hydroResultText;
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

