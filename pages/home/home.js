// 首页 - 工具导航
// v8.0.0 按照材料化学的科研分类重新组织了工具分类

const { storageService } = require('../../services/storage');
const { debounce } = require('../../utils/performance-utils');

// 快捷搜索标签
const QUICK_SEARCH_TAGS = [
  'pH', 'XRD', 'DMF', 'DMSO', 'TiO2', 
  '半导体', '单位换算', '溶度积', 
  '元素周期表', '络合', '电化学', 'Beer-Lambert',
  '钙钛矿', '量子点', '缓冲液', 'DMAP'
];

// v8.0.0 按科研标准重新分类的工具数据
const ALL_TOOLS = [
  // ========== 1. 基础计算工具 ==========
  { 
    id: 'unit', name: '单位换算', icon: '🔁', 
    description: '长度、质量、温度、能量等单位转换', 
    path: '/pages/basic/unit/unit', 
    category: '基础计算工具', 
    keywords: ['单位', '换算', '转换', '长度', '质量', '温度']
  },
  { 
    id: 'ph', name: 'pH计算', icon: '🧪', 
    description: '酸碱溶液pH值计算', 
    path: '/pages/basic/ph/ph', 
    category: '基础计算工具', 
    keywords: ['ph', '酸碱', '溶液', '计算']
  },
  { 
    id: 'solution', name: '溶液配比', icon: '⚗️', 
    description: '溶液混合与稀释计算', 
    path: '/pages/basic/solution/solution', 
    category: '基础计算工具', 
    keywords: ['溶液', '配比', '稀释', '混合', '浓度']
  },
  { 
    id: 'molar', name: '分子质量', icon: '🧬', 
    description: '化学式摩尔质量计算', 
    path: '/pages/basic/molar/molar', 
    category: '基础计算工具', 
    keywords: ['分子', '质量', '摩尔', '化学式']
  },
  { 
    id: 'batch', name: '批量计算', icon: '⚡', 
    description: '单位换算、XRD、稀释的批量计算', 
    path: '/pages/basic/batch/batch', 
    category: '基础计算工具', 
    keywords: ['批量', '多个', '导入', '导出', 'csv']
  },
  { 
    id: 'formula-calculator', name: '配方计算器', icon: '🧮', 
    description: '多组分溶液、pH缓冲液、水热参数', 
    path: '/pages/basic/formula-calculator/formula-calculator', 
    category: '基础计算工具', 
    keywords: ['配方', '多组分', '缓冲液', '水热']
  },

  // ========== 2. 晶体学与结构分析 ==========
  { 
    id: 'xrd-enhanced', name: 'XRD分析工具', icon: '📐', 
    description: 'd-2θ互算、晶系d(hkl)、Scherrer公式、晶格精修', 
    path: '/pages/advanced/xrd-enhanced/xrd-enhanced', 
    category: '晶体学与结构分析', 
    keywords: ['xrd', '衍射', '晶体', 'scherrer', '晶粒']
  },
  { 
    id: 'crystal-calc', name: '晶体学计算', icon: '💎', 
    description: '理论密度、晶胞体积、d间距', 
    path: '/pages/materials/crystal-calc/crystal-calc', 
    category: '晶体学与结构分析', 
    keywords: ['晶体', '密度', '晶胞', 'd间距']
  },
  { 
    id: 'space-groups', name: '空间群数据库', icon: '💎', 
    description: '230个空间群完整查询、消光规则、对称元素', 
    path: '/pages/materials/space-groups/space-groups', 
    category: '晶体学与结构分析', 
    keywords: ['空间群', '晶系', '对称', '消光']
  },

  // ========== 3. 电化学与能源材料 ==========
  { 
    id: 'electrochem', name: '电化学计算', icon: '⚡', 
    description: '电极电位换算与Nernst方程', 
    path: '/pages/advanced/electrochem/electrochem', 
    category: '电化学与能源材料', 
    keywords: ['电化学', '电位', 'nernst', '电极']
  },
  { 
    id: 'battery-calc', name: '电池性能计算', icon: '🔋', 
    description: '比容量、库伦效率、循环稳定性', 
    path: '/pages/advanced/battery-calc/battery-calc', 
    category: '电化学与能源材料', 
    keywords: ['电池', '比容量', '库伦效率', '循环']
  },
  { 
    id: 'photocatalysis', name: '光催化性能', icon: '☀️', 
    description: '量子效率、降解动力学、活性对比', 
    path: '/pages/advanced/photocatalysis/photocatalysis', 
    category: '电化学与能源材料', 
    keywords: ['光催化', '量子效率', 'aqe', '降解']
  },

  // ========== 4. 光谱与表征技术 ==========
  { 
    id: 'xps-raman', name: 'XPS/Raman/IR', icon: '📊', 
    description: '谱学峰位查询参考', 
    path: '/pages/spectroscopy/xps-raman/xps-raman', 
    category: '光谱与表征技术', 
    keywords: ['xps', 'raman', 'ir', '谱学', '峰位']
  },
  { 
    id: 'uvvis', name: 'Beer-Lambert', icon: '🌈', 
    description: 'UV-Vis吸光度计算', 
    path: '/pages/spectroscopy/uvvis/uvvis', 
    category: '光谱与表征技术', 
    keywords: ['beer', 'lambert', 'uv', 'vis', '吸光度']
  },
  { 
    id: 'uvvis-enhanced', name: 'Tauc Plot分析', icon: '📈', 
    description: 'Tauc Plot带隙分析 + K-M转换', 
    path: '/pages/spectroscopy/uvvis/uvvis-enhanced', 
    category: '光谱与表征技术', 
    keywords: ['tauc', 'plot', '带隙', 'bandgap']
  },

  // ========== 5. 材料数据库 ==========
  { 
    id: 'periodic', name: '元素周期表', icon: '🧮', 
    description: '查询元素性质与参数', 
    path: '/pages/materials/periodic/periodic', 
    category: '材料数据库', 
    keywords: ['元素', '周期表', '性质', '参数']
  },
  { 
    id: 'semiconductor', name: '半导体数据库', icon: '💡', 
    description: '150种半导体材料（含钙钛矿、2D、量子点）', 
    path: '/pages/materials/semiconductor/semiconductor', 
    category: '材料数据库', 
    keywords: ['半导体', '材料', '带隙', '钙钛矿', '量子点', '2d材料']
  },
  { 
    id: 'semiconductor-extras', name: '半导体小工具', icon: '🔦', 
    description: 'Eg↔λ互算、少子估算', 
    path: '/pages/materials/semiconductor-extras/semiconductor-extras', 
    category: '材料数据库', 
    keywords: ['半导体', '波长', '带隙']
  },
  { 
    id: 'abbreviation', name: '化学药品缩写', icon: '📚', 
    description: '材料与化学药品常见缩写查询', 
    path: '/pages/materials/abbreviation/abbreviation', 
    category: '材料数据库', 
    keywords: ['缩写', '简称', '药品', '材料']
  },
  { 
    id: 'organic-materials', name: '有机材料数据库', icon: '🧪', 
    description: '导电聚合物、有机半导体、MOF材料', 
    path: '/pages/materials/organic-materials/organic-materials', 
    category: '材料数据库', 
    keywords: ['有机', '材料', '聚合物', 'mof']
  },
  { 
    id: 'chemical-safety', name: '化学品安全', icon: '⚠️', 
    description: '72种化学品GHS危险性、急救措施（v8.0扩充）', 
    path: '/pages/tools/chemical-safety/chemical-safety', 
    category: '材料数据库', 
    keywords: ['安全', '化学品', 'ghs', '危险', 'msds']
  },
  { 
    id: 'solvent-selector', name: '溶剂选择助手', icon: '🧴', 
    description: '溶剂性质查询、极性对比、安全评估', 
    path: '/pages/tools/solvent-selector/solvent-selector', 
    category: '材料数据库', 
    keywords: ['溶剂', '极性', '沸点', '重结晶']
  },
  { 
    id: 'experimental-constants', name: '实验常数数据库', icon: '📋', 
    description: '缓冲液pKa、电极电位、晶体场（v8.0新增）', 
    path: '/pages/databases/experimental-constants/experimental-constants', 
    category: '材料数据库', 
    keywords: ['缓冲液', 'pka', '电极电位', '晶体场', '溶剂']
  },

  // ========== 6. 热力学与动力学 ==========
  { 
    id: 'thermodynamics', name: '热力学计算', icon: '🔥', 
    description: 'Gibbs自由能、平衡常数、Van\'t Hoff', 
    path: '/pages/advanced/thermodynamics/thermodynamics', 
    category: '热力学与动力学', 
    keywords: ['热力学', 'gibbs', '自由能', '平衡常数']
  },
  { 
    id: 'kinetics', name: '动力学计算', icon: '⏱️', 
    description: 'Arrhenius方程、活化能、反应级数', 
    path: '/pages/advanced/kinetics/kinetics', 
    category: '热力学与动力学', 
    keywords: ['动力学', 'arrhenius', '活化能']
  },
  { 
    id: 'ksp', name: '溶度积/沉淀', icon: '💧', 
    description: 'Ksp计算、沉淀判断', 
    path: '/pages/advanced/ksp/ksp', 
    category: '热力学与动力学', 
    keywords: ['溶度积', 'ksp', '沉淀']
  },
  { 
    id: 'complexation', name: '络合/掩蔽估算', icon: '🧷', 
    description: '条件稳定常数、络合分数', 
    path: '/pages/advanced/complexation/complexation', 
    category: '热力学与动力学', 
    keywords: ['络合', '掩蔽', '稳定常数']
  },

  // ========== 7. 数据处理与分析 ==========
  { 
    id: 'bet-analysis', name: 'BET表面积分析', icon: '🔬', 
    description: 'BET表面积、吸附等温线拟合', 
    path: '/pages/materials/bet-analysis/bet-analysis', 
    category: '数据处理与分析', 
    keywords: ['bet', '表面积', 'langmuir', '吸附']
  },
  { 
    id: 'electrical-props', name: '电学性质计算', icon: '⚡', 
    description: '电导率、电阻率、介电常数', 
    path: '/pages/materials/electrical-props/electrical-props', 
    category: '数据处理与分析', 
    keywords: ['电导率', '电阻率', '介电常数']
  },
  { 
    id: 'optical-props', name: '光学性质计算', icon: '🌈', 
    description: '颜色空间转换、荧光量子产率', 
    path: '/pages/materials/optical-props/optical-props', 
    category: '数据处理与分析', 
    keywords: ['光学', '颜色', 'rgb', '量子产率']
  },
  { 
    id: 'error-propagation', name: '误差传递计算器', icon: '📏', 
    description: '加减乘除、幂函数、对数、三角函数误差分析', 
    path: '/pages/tools/error-propagation/error-propagation', 
    category: '数据处理与分析', 
    keywords: ['误差', '传递', '不确定度', '精度']
  },
  { 
    id: 'ligand-field', name: '配位场理论', icon: '🔬', 
    description: 'Δ值计算、d轨道能级图、颜色预测（v8.0新增）', 
    path: '/pages/data-analysis/ligand-field/ligand-field', 
    category: '数据处理与分析', 
    keywords: ['配位场', '晶体场', '配合物', '颜色', 'delta']
  },

  // ========== 8. 文献与辅助工具 ==========
  { 
    id: 'literature', name: 'DOI文献查询', icon: '📖', 
    description: 'DOI查询与6种引用格式生成', 
    path: '/pages/tools/literature/literature', 
    category: '文献与辅助工具', 
    keywords: ['doi', '文献', '引用', 'bibtex', 'acs']
  }
];

Page({
  data: {
    searchQuery: '',
    recentTools: [],
    filteredTools: [],
    isSearching: false,
    showContent: false,
    showTools: false,
    quickSearchTags: QUICK_SEARCH_TAGS,
    
    // v8.0.0 新分类结构
    toolsByCategory: {},
    categories: [
      { id: 'basic', name: '基础计算工具', icon: '🧮', color: '#1f3c88' },
      { id: 'crystal', name: '晶体学与结构分析', icon: '💎', color: '#8e44ad' },
      { id: 'electrochem', name: '电化学与能源材料', icon: '🔋', color: '#27ae60' },
      { id: 'spectro', name: '光谱与表征技术', icon: '📊', color: '#e74c3c' },
      { id: 'database', name: '材料数据库', icon: '📚', color: '#3498db' },
      { id: 'thermo', name: '热力学与动力学', icon: '🔥', color: '#e67e22' },
      { id: 'analysis', name: '数据处理与分析', icon: '📈', color: '#16a085' },
      { id: 'utils', name: '文献与辅助工具', icon: '📖', color: '#95a5a6' }
    ],
    
    displayedTools: [],
    showAllCategories: false
  },
  
  options: {
    pureDataPattern: /^_/
  },

  onLoad() {
    this.setData({ showContent: false });
    this.initializeToolsByCategory();
    
    wx.nextTick(() => {
      this.setData({ showContent: true });
    });
    
    setTimeout(() => {
      this.setData({ showTools: true });
      this.loadRecentTools();
    }, 100);
    
    this._allTools = ALL_TOOLS;
    
    // 使用防抖优化搜索
    this.debouncedSearch = debounce(this.performSearch.bind(this), 300);
  },

  onShow() {
    if (this._hasNavigated) {
      this.loadRecentTools();
      this._hasNavigated = false;
    }
  },

  onHide() {
    this._hasNavigated = true;
  },

  // 初始化工具分类数据
  initializeToolsByCategory() {
    const categorized = {
      basic: [],
      crystal: [],
      electrochem: [],
      spectro: [],
      database: [],
      thermo: [],
      analysis: [],
      utils: []
    };
    
    // 按类别分类工具
    ALL_TOOLS.forEach(tool => {
      const categoryMap = {
        '基础计算工具': 'basic',
        '晶体学与结构分析': 'crystal',
        '电化学与能源材料': 'electrochem',
        '光谱与表征技术': 'spectro',
        '材料数据库': 'database',
        '热力学与动力学': 'thermo',
        '数据处理与分析': 'analysis',
        '文献与辅助工具': 'utils'
      };
      
      const categoryId = categoryMap[tool.category];
      if (categoryId && categorized[categoryId]) {
        categorized[categoryId].push(tool);
      }
    });
    
    this.setData({ toolsByCategory: categorized });
  },

  // 加载最近使用的工具（最多显示6个）
  loadRecentTools() {
    try {
      const recentTools = storageService.get('chemtools:recent_tools', []) || [];
      this.setData({ recentTools: recentTools.slice(0, 6) });
    } catch (e) {
      console.error('加载最近工具失败:', e);
    }
  },

  // 处理搜索输入
  onSearchInput(e) {
    const query = e.detail.value;
    this.setData({ searchQuery: query });
    
    if (!query.trim()) {
      this.setData({ 
        isSearching: false,
        filteredTools: [] 
      });
      return;
    }
    
    this.setData({ isSearching: true });
    this.debouncedSearch(query);
  },

  // 执行搜索（匹配工具名称、描述和关键词）
  performSearch(query) {
    const q = query.toLowerCase().trim();
    const results = ALL_TOOLS.filter(tool => {
      return tool.name.toLowerCase().includes(q) ||
             tool.description.toLowerCase().includes(q) ||
             tool.keywords.some(kw => kw.toLowerCase().includes(q));
    });
    
    this.setData({ filteredTools: results });
  },

  // 点击快速搜索标签
  onQuickSearchTag(e) {
    const tag = e.currentTarget.dataset.tag;
    this.setData({ searchQuery: tag });
    this.performSearch(tag);
    this.setData({ isSearching: true });
  },

  // 清除搜索内容
  clearSearch() {
    this.setData({
      searchQuery: '',
      isSearching: false,
      filteredTools: []
    });
  },

  // 跳转到工具页面
  navigateToTool(e) {
    const path = e.currentTarget.dataset.path;
    const toolId = e.currentTarget.dataset.id;
    
    if (path) {
      // 更新最近使用记录
      this.updateRecentTools(toolId);
      
    wx.navigateTo({
      url: path,
        fail: (err) => {
          console.error('页面跳转失败:', err);
          wx.showToast({
            title: '页面加载失败',
            icon: 'none'
          });
        }
      });
      }
  },

  // 更新最近使用的工具列表
  updateRecentTools(toolId) {
    try {
      const tool = ALL_TOOLS.find(t => t.id === toolId);
      if (!tool) return;
      
      let recentTools = storageService.get('chemtools:recent_tools', []) || [];
      
      // 先移除已存在的记录（避免重复）
      recentTools = recentTools.filter(t => t.id !== toolId);
      
      // 把新点击的工具添加到最前面
      recentTools.unshift({
        id: tool.id,
        name: tool.name,
        icon: tool.icon,
        path: tool.path,
        timestamp: Date.now()
      });
      
      // 最多保留10条记录
      if (recentTools.length > 10) {
        recentTools = recentTools.slice(0, 10);
      }
      
      storageService.set('chemtools:recent_tools', recentTools);
    } catch (e) {
      console.error('更新最近工具失败:', e);
    }
  },

  // 跳转到搜索页面
  navigateToSearch() {
    wx.navigateTo({
      url: '/pages/search/search'
    });
  },

  // 展开/收起分类
  toggleCategory(e) {
    const categoryId = e.currentTarget.dataset.category;
    const key = `showCategory_${categoryId}`;
    this.setData({
      [key]: !this.data[key]
    });
  }
});
