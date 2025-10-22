/**
 * 配位场理论计算器
 */

const {
  calculateCrystalFieldSplitting,
  generateOrbitalDiagram,
  searchKnownComplexes,
  getSupportedMetals,
  getSupportedLigands
} = require('../../../utils/ligand-field-theory');

Page({
  data: {
    // 金属离子选项
    metalOptions: [],
    metalIndex: 0,
    selectedMetal: 'Cr3+',
    
    // 几何构型选项
    geometryOptions: [
      { value: 'octahedral', name: '八面体 (Oh)' },
      { value: 'tetrahedral', name: '四面体 (Td)' },
      { value: 'square-planar', name: '平面四方 (D4h)' }
    ],
    geometryIndex: 0,
    selectedGeometry: 'octahedral',
    
    // 配体选项
    ligandOptions: [],
    ligandSlots: [0, 0, 0, 0, 0, 0], // 6个配体位置，默认H2O
    
    // 计算结果
    result: null,
    orbitalDiagram: null,
    
    // 已知配合物
    knownComplexes: [],
    allComplexes: [],
    
    // 文本映射
    spinStateText: {
      'high-spin': '高自旋',
      'low-spin': '低自旋',
      'normal': '正常'
    }
  },

  onLoad() {
    this.initializeData();
    this.loadKnownComplexes();
  },

  /**
   * 初始化数据
   */
  initializeData() {
    // 获取支持的金属离子
    const metals = getSupportedMetals();
    const metalOptions = metals.map(m => m.ion);
    
    // 获取支持的配体
    const ligands = getSupportedLigands();
    const ligandOptions = ligands.map(l => l.ligand);
    
    this.setData({
      metalOptions,
      ligandOptions
    });
  },

  /**
   * 加载已知配合物数据
   */
  loadKnownComplexes() {
    const complexes = searchKnownComplexes();
    this.setData({
      knownComplexes: complexes,
      allComplexes: complexes
    });
  },

  /**
   * 金属离子改变
   */
  onMetalChange(e) {
    const index = e.detail.value;
    this.setData({
      metalIndex: index,
      selectedMetal: this.data.metalOptions[index]
    });
  },

  /**
   * 几何构型改变
   */
  onGeometryChange(e) {
    const index = e.detail.value;
    const geometry = this.data.geometryOptions[index];
    
    // 调整配体位置数量
    let slots;
    if (geometry.value === 'tetrahedral') {
      slots = [0, 0, 0, 0]; // 4个配体
    } else if (geometry.value === 'square-planar') {
      slots = [0, 0, 0, 0]; // 4个配体
    } else {
      slots = [0, 0, 0, 0, 0, 0]; // 6个配体
    }
    
    this.setData({
      geometryIndex: index,
      selectedGeometry: geometry.value,
      ligandSlots: slots
    });
  },

  /**
   * 配体改变
   */
  onLigandChange(e) {
    const index = e.currentTarget.dataset.index;
    const value = e.detail.value;
    
    const ligandSlots = [...this.data.ligandSlots];
    ligandSlots[index] = value;
    
    this.setData({
      ligandSlots
    });
  },

  /**
   * 计算
   */
  calculate() {
    const { selectedMetal, selectedGeometry, ligandSlots, ligandOptions } = this.data;
    
    if (!selectedMetal) {
      wx.showToast({
        title: '请选择金属离子',
        icon: 'none'
      });
      return;
    }
    
    // 获取配体列表
    const ligands = ligandSlots.map(index => ligandOptions[index]);
    
    // 计算晶体场分裂能
    const result = calculateCrystalFieldSplitting(selectedMetal, ligands, selectedGeometry);
    
    if (!result.success) {
      wx.showToast({
        title: result.error,
        icon: 'none'
      });
      return;
    }
    
    // 生成d轨道能级图
    const orbitalDiagram = generateOrbitalDiagram(
      selectedMetal,
      result.delta,
      result.spinState,
      selectedGeometry
    );
    
    this.setData({
      result,
      orbitalDiagram
    }, () => {
      // 绘制轨道图
      if (orbitalDiagram) {
        this.drawOrbitalDiagram();
      }
    });
    
    // 添加到历史
    this.addToHistory(result);
  },

  /**
   * 绘制d轨道能级图
   */
  drawOrbitalDiagram() {
    const { orbitalDiagram } = this.data;
    if (!orbitalDiagram) return;
    
    const ctx = wx.createCanvasContext('orbitalCanvas', this);
    const width = 350;
    const height = 400;
    
    // 清空画布
    ctx.clearRect(0, 0, width, height);
    
    // 绘制能级线
    const centerX = width / 2;
    const baseY = height - 50;
    const scale = 150 / Math.abs(orbitalDiagram.delta.value); // 能级缩放比例
    
    orbitalDiagram.levels.forEach((level, index) => {
      const y = baseY - level.energy * scale * 100;
      const lineWidth = 80;
      const startX = centerX - lineWidth / 2;
      
      // 绘制能级线
      ctx.setStrokeStyle('#1f3c88');
      ctx.setLineWidth(3);
      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(startX + lineWidth, y);
      ctx.stroke();
      
      // 绘制电子
      level.electrons.forEach((count, orbitIndex) => {
        const electronX = startX + (orbitIndex + 0.5) * (lineWidth / level.electrons.length);
        
        if (count >= 1) {
          // 自旋向上
          ctx.beginPath();
          ctx.moveTo(electronX - 3, y + 10);
          ctx.lineTo(electronX - 3, y - 10);
          ctx.setStrokeStyle('#ff4444');
          ctx.setLineWidth(2);
          ctx.stroke();
          
          // 箭头
          ctx.beginPath();
          ctx.moveTo(electronX - 3, y - 10);
          ctx.lineTo(electronX - 6, y - 5);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(electronX - 3, y - 10);
          ctx.lineTo(electronX, y - 5);
          ctx.stroke();
        }
        
        if (count >= 2) {
          // 自旋向下
          ctx.beginPath();
          ctx.moveTo(electronX + 3, y + 10);
          ctx.lineTo(electronX + 3, y - 10);
          ctx.setStrokeStyle('#4444ff');
          ctx.setLineWidth(2);
          ctx.stroke();
          
          // 箭头
          ctx.beginPath();
          ctx.moveTo(electronX + 3, y + 10);
          ctx.lineTo(electronX, y + 5);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(electronX + 3, y + 10);
          ctx.lineTo(electronX + 6, y + 5);
          ctx.stroke();
        }
      });
      
      // 标注能级名称
      ctx.setFontSize(14);
      ctx.setFillStyle('#333');
      ctx.fillText(level.name, startX + lineWidth + 10, y + 5);
      
      // 标注能量值
      ctx.setFontSize(12);
      ctx.setFillStyle('#666');
      ctx.fillText(`${level.energyValue} cm⁻¹`, startX + lineWidth + 10, y + 20);
    });
    
    // 绘制Δ标记
    if (orbitalDiagram.levels.length >= 2) {
      const level1 = orbitalDiagram.levels[0];
      const level2 = orbitalDiagram.levels[1];
      const y1 = baseY - level1.energy * scale * 100;
      const y2 = baseY - level2.energy * scale * 100;
      
      ctx.setStrokeStyle('#28a745');
      ctx.setLineWidth(2);
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(centerX + 50, y1);
      ctx.lineTo(centerX + 50, y2);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Δ标签
      ctx.setFontSize(16);
      ctx.setFillStyle('#28a745');
      ctx.fillText(orbitalDiagram.delta.label, centerX + 55, (y1 + y2) / 2);
    }
    
    ctx.draw();
  },

  /**
   * 搜索配合物
   */
  onSearchComplex(e) {
    const query = e.detail.value.trim();
    
    if (!query) {
      this.setData({ knownComplexes: this.data.allComplexes });
      return;
    }
    
    const results = searchKnownComplexes(query);
    this.setData({ knownComplexes: results });
  },

  /**
   * 添加到历史
   */
  addToHistory(result) {
    try {
      const history = wx.getStorageSync('chemtools:history') || [];
      
      history.unshift({
        type: 'ligand-field',
        timestamp: Date.now(),
        input: {
          metalIon: this.data.selectedMetal,
          geometry: this.data.selectedGeometry
        },
        output: result
      });
      
      // 限制历史记录数量
      if (history.length > 50) {
        history.pop();
      }
      
      wx.setStorageSync('chemtools:history', history);
    } catch (e) {
      console.error('保存历史失败:', e);
    }
  }
});

