/**
 * 全局搜索服务 v3.9.4
 * 提供跨页面、跨数据库的统一搜索功能
 * 支持：工具、缩写、半导体、元素、光谱、Ksp、参比电极、X射线源
 */

// 搜索索引（按需构建，减少内存占用）
let searchIndex = null;
let indexBuilt = false;

// 搜索历史（轻量级，最多20条）
const MAX_SEARCH_HISTORY = 20;

/**
 * 获取常用化学缩写（轻量级，避免分包引用）
 */
function getCommonAbbreviations() {
  return [
    // 有机溶剂
    { abbr: 'DMF', full: 'N,N-Dimethylformamide', chinese: 'N,N-二甲基甲酰胺', category: '有机溶剂' },
    { abbr: 'DMSO', full: 'Dimethyl sulfoxide', chinese: '二甲基亚砜', category: '有机溶剂' },
    { abbr: 'THF', full: 'Tetrahydrofuran', chinese: '四氢呋喃', category: '有机溶剂' },
    { abbr: 'DCM', full: 'Dichloromethane', chinese: '二氯甲烷', category: '有机溶剂' },
    { abbr: 'EA', full: 'Ethyl acetate', chinese: '乙酸乙酯', category: '有机溶剂' },
    { abbr: 'MeOH', full: 'Methanol', chinese: '甲醇', category: '有机溶剂' },
    { abbr: 'EtOH', full: 'Ethanol', chinese: '乙醇', category: '有机溶剂' },
    { abbr: 'ACN', full: 'Acetonitrile', chinese: '乙腈', category: '有机溶剂' },
    { abbr: 'NMP', full: 'N-Methyl-2-pyrrolidone', chinese: 'N-甲基吡咯烷酮', category: '有机溶剂' },
    { abbr: 'DMAc', full: 'N,N-Dimethylacetamide', chinese: 'N,N-二甲基乙酰胺', category: '有机溶剂' },
    
    // 碱和催化剂
    { abbr: 'TEA', full: 'Triethylamine', chinese: '三乙胺', category: '碱' },
    { abbr: 'DIPEA', full: 'N,N-Diisopropylethylamine', chinese: 'N,N-二异丙基乙胺', category: '碱' },
    { abbr: 'DBU', full: '1,8-Diazabicyclo[5.4.0]undec-7-ene', chinese: '1,8-二氮杂双环[5.4.0]十一碳-7-烯', category: '碱' },
    { abbr: 'DMAP', full: '4-Dimethylaminopyridine', chinese: '4-二甲氨基吡啶', category: '催化剂' },
    { abbr: 'Py', full: 'Pyridine', chinese: '吡啶', category: '碱' },
    
    // 缩合剂和偶联剂
    { abbr: 'DCC', full: 'N,N-Dicyclohexylcarbodiimide', chinese: 'N,N-二环己基碳二亚胺', category: '缩合剂' },
    { abbr: 'EDC', full: '1-Ethyl-3-(3-dimethylaminopropyl)carbodiimide', chinese: '1-乙基-3-(3-二甲氨基丙基)碳二亚胺', category: '缩合剂' },
    { abbr: 'HATU', full: 'Hexafluorophosphate Azabenzotriazole Tetramethyl Uronium', chinese: '六氟磷酸氮唑苯并三唑四甲基脲', category: '缩合剂' },
    { abbr: 'HOBt', full: 'Hydroxybenzotriazole', chinese: '羟基苯并三唑', category: '缩合剂' },
    
    // 保护基
    { abbr: 'Boc', full: 'tert-Butoxycarbonyl', chinese: '叔丁氧羰基', category: '保护基' },
    { abbr: 'Fmoc', full: 'Fluorenylmethyloxycarbonyl', chinese: '芴甲氧羰基', category: '保护基' },
    { abbr: 'Cbz', full: 'Benzyloxycarbonyl', chinese: '苄氧羰基', category: '保护基' },
    { abbr: 'TBS', full: 'tert-Butyldimethylsilyl', chinese: '叔丁基二甲基硅基', category: '保护基' },
    { abbr: 'TIPS', full: 'Triisopropylsilyl', chinese: '三异丙基硅基', category: '保护基' },
    
    // 氧化剂和还原剂
    { abbr: 'mCPBA', full: 'meta-Chloroperoxybenzoic acid', chinese: '间氯过氧苯甲酸', category: '氧化剂' },
    { abbr: 'PCC', full: 'Pyridinium chlorochromate', chinese: '氯铬酸吡啶盐', category: '氧化剂' },
    { abbr: 'PDC', full: 'Pyridinium dichromate', chinese: '重铬酸吡啶盐', category: '氧化剂' },
    { abbr: 'NaBH4', full: 'Sodium borohydride', chinese: '硼氢化钠', category: '还原剂' },
    { abbr: 'LiAlH4', full: 'Lithium aluminium hydride', chinese: '氢化铝锂', category: '还原剂' },
    { abbr: 'DIBAL-H', full: 'Diisobutylaluminium hydride', chinese: '二异丁基氢化铝', category: '还原剂' },
    
    // 试剂
    { abbr: 'LDA', full: 'Lithium diisopropylamide', chinese: '二异丙基氨基锂', category: '试剂' },
    { abbr: 'NBS', full: 'N-Bromosuccinimide', chinese: 'N-溴代琥珀酰亚胺', category: '试剂' },
    { abbr: 'TFA', full: 'Trifluoroacetic acid', chinese: '三氟乙酸', category: '酸' },
    { abbr: 'TFAA', full: 'Trifluoroacetic anhydride', chinese: '三氟乙酸酐', category: '试剂' },
    { abbr: 'Ac2O', full: 'Acetic anhydride', chinese: '乙酸酐', category: '试剂' },
    
    // 表征技术
    { abbr: 'NMR', full: 'Nuclear Magnetic Resonance', chinese: '核磁共振', category: '表征' },
    { abbr: 'FTIR', full: 'Fourier Transform Infrared Spectroscopy', chinese: '傅里叶变换红外光谱', category: '表征' },
    { abbr: 'XRD', full: 'X-Ray Diffraction', chinese: 'X射线衍射', category: '表征' },
    { abbr: 'XPS', full: 'X-ray Photoelectron Spectroscopy', chinese: 'X射线光电子能谱', category: '表征' },
    { abbr: 'SEM', full: 'Scanning Electron Microscopy', chinese: '扫描电子显微镜', category: '表征' },
    { abbr: 'TEM', full: 'Transmission Electron Microscopy', chinese: '透射电子显微镜', category: '表征' },
    { abbr: 'TGA', full: 'Thermogravimetric Analysis', chinese: '热重分析', category: '表征' },
    { abbr: 'DSC', full: 'Differential Scanning Calorimetry', chinese: '差示扫描量热法', category: '表征' },
    { abbr: 'GC', full: 'Gas Chromatography', chinese: '气相色谱', category: '表征' },
    { abbr: 'HPLC', full: 'High Performance Liquid Chromatography', chinese: '高效液相色谱', category: '表征' },
    { abbr: 'MS', full: 'Mass Spectrometry', chinese: '质谱', category: '表征' },
    { abbr: 'ESI-MS', full: 'Electrospray Ionization Mass Spectrometry', chinese: '电喷雾电离质谱', category: '表征' },
    { abbr: 'MALDI-TOF', full: 'Matrix-Assisted Laser Desorption/Ionization Time-of-Flight', chinese: '基质辅助激光解吸电离飞行时间质谱', category: '表征' },
    
    // 材料化学
    { abbr: 'MOF', full: 'Metal-Organic Framework', chinese: '金属有机框架', category: '材料' },
    { abbr: 'COF', full: 'Covalent Organic Framework', chinese: '共价有机框架', category: '材料' },
    { abbr: 'PVA', full: 'Polyvinyl alcohol', chinese: '聚乙烯醇', category: '材料' },
    { abbr: 'PVP', full: 'Polyvinylpyrrolidone', chinese: '聚乙烯吡咯烷酮', category: '材料' },
    { abbr: 'PEDOT', full: 'Poly(3,4-ethylenedioxythiophene)', chinese: '聚3,4-乙撑二氧噻吩', category: '材料' },
    { abbr: 'PSS', full: 'Poly(styrene sulfonate)', chinese: '聚苯乙烯磺酸', category: '材料' },
    { abbr: 'PCBM', full: '[6,6]-Phenyl-C61-butyric acid methyl ester', chinese: '[6,6]-苯基-C61-丁酸甲酯', category: '材料' },
    { abbr: 'P3HT', full: 'Poly(3-hexylthiophene)', chinese: '聚3-己基噻吩', category: '材料' },
    { abbr: 'ITO', full: 'Indium Tin Oxide', chinese: '氧化铟锡', category: '材料' },
    { abbr: 'FTO', full: 'Fluorine-doped Tin Oxide', chinese: '氟掺杂氧化锡', category: '材料' },
    
    // 缓冲液
    { abbr: 'PBS', full: 'Phosphate Buffered Saline', chinese: '磷酸盐缓冲液', category: '缓冲液' },
    { abbr: 'Tris', full: 'Tris(hydroxymethyl)aminomethane', chinese: '三羟甲基氨基甲烷', category: '缓冲液' },
    { abbr: 'HEPES', full: '4-(2-Hydroxyethyl)piperazine-1-ethanesulfonic acid', chinese: '4-(2-羟乙基)哌嗪-1-乙磺酸', category: '缓冲液' },
    { abbr: 'MES', full: '2-(N-Morpholino)ethanesulfonic acid', chinese: '2-(N-吗啉代)乙磺酸', category: '缓冲液' }
  ];
}

/**
 * 构建搜索索引（懒加载）
 */
function buildSearchIndex() {
  if (indexBuilt) return searchIndex;
  
  searchIndex = {
    // 化学缩写数据（延迟加载）
    abbreviations: null,
    // 半导体材料
    semiconductors: null,
    // 元素周期表
    elements: null,
    // 计算工具
    tools: [
      { name: '单位换算', type: '基础计算', page: '/pages/basic/unit/unit', keywords: ['单位', '换算', '转换'] },
      { name: 'pH计算', type: '基础计算', page: '/pages/basic/ph/ph', keywords: ['pH', '酸碱', '氢离子浓度'] },
      { name: '溶液配比', type: '基础计算', page: '/pages/basic/solution/solution', keywords: ['溶液', '配比', '稀释', '浓度'] },
      { name: '分子质量', type: '基础计算', page: '/pages/basic/molar/molar', keywords: ['分子量', '摩尔质量', '化学式'] },
      { name: '配方计算器', type: '基础计算', page: '/pages/basic/formula-calculator/formula-calculator', keywords: ['配方', '多组分', '缓冲液', '水热', 'PBS', 'Tris'] },
      { name: 'XRD分析工具', type: '高级计算', page: '/pages/advanced/xrd-enhanced/xrd-enhanced', keywords: ['XRD', 'X射线衍射', '晶面', '衍射角', 'd间距', 'Bragg', 'Scherrer', '晶粒尺寸', '晶格精修', '消光', '峰强', '晶系', 'd(hkl)'] },
      { name: '电化学计算', type: '高级计算', page: '/pages/advanced/electrochem/electrochem', keywords: ['电化学', 'Nernst', '电极电位'] },
      { name: '电池性能计算', type: '高级计算', page: '/pages/advanced/battery-calc/battery-calc', keywords: ['电池', '比容量', '库伦效率', '循环稳定性', '倍率性能'] },
      { name: '光催化性能计算', type: '高级计算', page: '/pages/advanced/photocatalysis/photocatalysis', keywords: ['光催化', '量子效率', 'AQE', '降解动力学', '活性对比'] },
      { name: '溶度积计算', type: '高级计算', page: '/pages/advanced/ksp/ksp', keywords: ['溶度积', 'Ksp', '沉淀', '溶解度'] },
      { name: '络合计算', type: '高级计算', page: '/pages/advanced/complexation/complexation', keywords: ['络合', '配位', '稳定常数'] },
      { name: '元素周期表', type: '材料数据', page: '/pages/materials/periodic/periodic', keywords: ['元素', '周期表', '原子'] },
      { name: '半导体材料', type: '材料数据', page: '/pages/materials/semiconductor/semiconductor', keywords: ['半导体', '带隙', '禁带宽度'] },
      { name: '化学缩写', type: '材料数据', page: '/pages/materials/abbreviation/abbreviation', keywords: ['缩写', '简称', '化学药品'] },
      { name: '晶体学计算', type: '材料数据', page: '/pages/materials/crystal-calc/crystal-calc', keywords: ['晶体', '理论密度', '晶胞体积', 'd间距', 'Miller指数'] },
      { name: 'BET表面积分析', type: '材料数据', page: '/pages/materials/bet-analysis/bet-analysis', keywords: ['BET', '表面积', 'Langmuir', 'Freundlich', '吸附', '孔径'] },
      { name: '化学品安全快查', type: '实验辅助', page: '/pages/tools/chemical-safety/chemical-safety', keywords: ['化学品', '安全', 'GHS', 'MSDS', '急救', '储存'] },
      { name: '电学性质计算', type: '材料数据', page: '/pages/materials/electrical-props/electrical-props', keywords: ['电导率', '电阻率', '介电常数', '四探针', '方块电阻'] },
      { name: '溶剂选择助手', type: '实验辅助', page: '/pages/tools/solvent-selector/solvent-selector', keywords: ['溶剂', '极性', '沸点', '重结晶', '萃取'] },
      { name: '光学性质计算', type: '材料数据', page: '/pages/materials/optical-props/optical-props', keywords: ['光学', '颜色', 'RGB', 'HSV', '量子产率', '荧光'] },
      { name: '空间群数据库', type: '材料数据', page: '/pages/materials/space-groups/space-groups', keywords: ['空间群', '晶系', '对称', '消光', 'space group', '晶体学', '点群', '对称元素'] },
      { name: '误差传递计算器', type: '基础计算', page: '/pages/tools/error-propagation/error-propagation', keywords: ['误差', '传递', 'error', 'propagation', '不确定度', '精度', '误差分析', '加减法', '乘除法', '幂函数', '对数', '三角函数'] },
      { name: 'DOI文献查询', type: '实验辅助', page: '/pages/tools/literature/literature', keywords: ['DOI', '文献', '引用', '参考文献', 'citation', 'bibtex', 'endnote', 'acs', 'nature', 'apa', 'gbt7714', '国标', '论文'] },
      { name: 'XPS/Raman峰位', type: '光谱工具', page: '/pages/spectroscopy/xps-raman/xps-raman', keywords: ['XPS', 'Raman', '光谱', '峰位'] },
      { name: 'UV-Vis计算', type: '光谱工具', page: '/pages/spectroscopy/uvvis/uvvis', keywords: ['UV-Vis', '紫外可见', 'Beer-Lambert', '吸光度'] },
      { name: 'UV-Vis增强版', type: '光谱工具', page: '/pages/spectroscopy/uvvis/uvvis-enhanced', keywords: ['Tauc Plot', '带隙', 'Bandgap', 'Kubelka-Munk', 'K-M转换', 'UV-Vis'] }
    ]
  };
  
  indexBuilt = true;
  return searchIndex;
}

/**
 * 全局搜索（轻量级版本）
 * @param {string} query - 搜索关键词
 * @param {object} options - 搜索选项
 * @returns {Array} 搜索结果
 */
function globalSearch(query, options = {}) {
  if (!query || query.trim() === '') return [];
  
  const {
    includeTools = true,
    includeAbbreviations = true,  // v3.9.3: 默认开启
    includeSemiconductors = true, // v3.9.3: 默认开启
    includeElements = true,       // v3.9.3: 默认开启
    includeSpectroscopy = true,   // v3.9.3: 新增光谱数据
    includeKsp = true,            // v3.9.3: 新增难溶盐数据
    includeReferences = true,     // v3.9.3: 新增参比电极数据
    includeXRays = true,          // v3.9.3: 新增X射线源数据
    limit = 50                    // v3.9.3: 增加默认限制
  } = options;
  
  const results = [];
  const index = buildSearchIndex();
  const normalizedQuery = query.toLowerCase().trim();
  
  // 搜索工具
  if (includeTools) {
    index.tools.forEach(tool => {
      const score = calculateRelevance(normalizedQuery, tool);
      if (score > 0) {
        results.push({
          ...tool,
          type: '工具',
          category: tool.type,
          relevance: score
        });
      }
    });
  }
  
  // 搜索化学缩写（轻量级数据）
  if (includeAbbreviations) {
    try {
      // 使用轻量级常用化学缩写数据（避免分包引用问题）
      const commonAbbreviations = getCommonAbbreviations();
      
      commonAbbreviations.forEach(item => {
        const score = calculateRelevanceForAbbreviation(normalizedQuery, item);
        if (score > 0) {
          results.push({
            type: '缩写',
            name: item.abbr,
            fullName: item.full,
            chineseName: item.chinese,
            category: item.category || '常用化学品',
            page: '/pages/materials/abbreviation/abbreviation',
            relevance: score
          });
        }
      });
    } catch (e) {
      console.error('搜索化学缩写失败:', e);
    }
  }
  
  // 搜索半导体材料
  if (includeSemiconductors) {
    try {
      const semiconductors = require('../utils/semiconductors');
      if (semiconductors && semiconductors.semiconductorMaterials) {
        semiconductors.semiconductorMaterials.forEach(item => {
          const score = calculateRelevanceForSemiconductor(normalizedQuery, item);
          if (score > 0) {
            // 兼容不同的bandGap数据格式
            let bandgapValue = null;
            if (item.bandGap) {
              if (typeof item.bandGap === 'object' && item.bandGap.value !== undefined) {
                bandgapValue = item.bandGap.value;
              } else if (typeof item.bandGap === 'number') {
                bandgapValue = item.bandGap;
              } else if (typeof item.bandGap === 'string') {
                const match = item.bandGap.match(/[\d.]+/);
                bandgapValue = match ? match[0] : item.bandGap;
              }
            }
            
            results.push({
              type: '半导体',
              name: item.name || item.nameEn || item.formula,
              formula: item.formula,
              bandgap: bandgapValue,
              category: item.category,
              page: '/pages/materials/semiconductor/semiconductor',
              relevance: score
            });
          }
        });
      }
    } catch (e) {
      console.error('搜索半导体材料失败:', e);
    }
  }
  
  // 搜索元素
  if (includeElements) {
    try {
      const periodic = require('../utils/periodic');
      if (periodic && periodic.periodicElements) {
        periodic.periodicElements.forEach(item => {
          const score = calculateRelevanceForElement(normalizedQuery, item);
          if (score > 0) {
            results.push({
              type: '元素',
              name: item.name,
              symbol: item.symbol,
              number: item.number,
              category: item.category,
              page: '/pages/materials/periodic/periodic',
              relevance: score
            });
          }
        });
      }
    } catch (e) {
      // 静默失败
    }
  }
  
  // 搜索光谱数据（XPS、Raman、IR）
  if (includeSpectroscopy) {
    try {
      // 简化的光谱数据搜索（只搜索元素和化合物名称）
      const spectroscopyData = [
        { name: 'XPS', desc: 'X射线光电子能谱峰位', page: '/pages/spectroscopy/xps-raman/xps-raman', keywords: ['XPS', 'X射线', '光电子', '峰位'] },
        { name: 'Raman', desc: '拉曼光谱峰位', page: '/pages/spectroscopy/xps-raman/xps-raman', keywords: ['Raman', '拉曼', '振动', '峰位'] },
        { name: 'IR', desc: '红外光谱峰位', page: '/pages/spectroscopy/xps-raman/xps-raman', keywords: ['IR', '红外', 'FTIR', '振动'] },
        { name: 'TiO2', desc: '二氧化钛光谱数据', page: '/pages/spectroscopy/xps-raman/xps-raman?compound=TiO2', keywords: ['TiO2', '二氧化钛', '锐钛矿', '金红石'] },
        { name: 'ZnO', desc: '氧化锌光谱数据', page: '/pages/spectroscopy/xps-raman/xps-raman?compound=ZnO', keywords: ['ZnO', '氧化锌'] },
        { name: 'C-C', desc: '碳碳键峰位', page: '/pages/spectroscopy/xps-raman/xps-raman?peak=C-C', keywords: ['C-C', '碳碳', '石墨烯'] },
        { name: 'C=O', desc: '碳氧双键峰位', page: '/pages/spectroscopy/xps-raman/xps-raman?peak=C=O', keywords: ['C=O', '羰基', '酮'] }
      ];
      
      spectroscopyData.forEach(item => {
        const score = calculateRelevance(normalizedQuery, item);
        if (score > 0) {
          results.push({
            type: '光谱',
            name: item.name,
            description: item.desc,
            page: item.page,
            relevance: score
          });
        }
      });
    } catch (e) {
      // 静默失败
    }
  }
  
  // 搜索难溶盐数据（Ksp）
  if (includeKsp) {
    try {
      const kspData = [
        { name: 'AgCl', chinese: '氯化银', ksp: '1.77×10⁻¹⁰', page: '/pages/advanced/ksp/ksp?salt=AgCl', keywords: ['AgCl', '氯化银', '银'] },
        { name: 'AgBr', chinese: '溴化银', ksp: '5.35×10⁻¹³', page: '/pages/advanced/ksp/ksp?salt=AgBr', keywords: ['AgBr', '溴化银'] },
        { name: 'AgI', chinese: '碘化银', ksp: '8.52×10⁻¹⁷', page: '/pages/advanced/ksp/ksp?salt=AgI', keywords: ['AgI', '碘化银'] },
        { name: 'PbSO4', chinese: '硫酸铅', ksp: '2.53×10⁻⁸', page: '/pages/advanced/ksp/ksp?salt=PbSO4', keywords: ['PbSO4', '硫酸铅', '铅'] },
        { name: 'BaSO4', chinese: '硫酸钡', ksp: '1.08×10⁻¹⁰', page: '/pages/advanced/ksp/ksp?salt=BaSO4', keywords: ['BaSO4', '硫酸钡', '钡'] },
        { name: 'CaCO3', chinese: '碳酸钙', ksp: '3.36×10⁻⁹', page: '/pages/advanced/ksp/ksp?salt=CaCO3', keywords: ['CaCO3', '碳酸钙', '钙', '石灰石'] },
        { name: 'Mg(OH)2', chinese: '氢氧化镁', ksp: '5.61×10⁻¹²', page: '/pages/advanced/ksp/ksp?salt=Mg(OH)2', keywords: ['氢氧化镁', '镁'] },
        { name: 'Fe(OH)3', chinese: '氢氧化铁', ksp: '2.79×10⁻³⁹', page: '/pages/advanced/ksp/ksp?salt=Fe(OH)3', keywords: ['氢氧化铁', '铁'] }
      ];
      
      kspData.forEach(item => {
        const score = calculateRelevance(normalizedQuery, item);
        if (score > 0) {
          results.push({
            type: 'Ksp',
            name: item.name,
            chineseName: item.chinese,
            ksp: item.ksp,
            page: item.page,
            relevance: score
          });
        }
      });
    } catch (e) {
      // 静默失败
    }
  }
  
  // 搜索参比电极数据
  if (includeReferences) {
    try {
      const referenceData = [
        { name: 'SHE', full: 'Standard Hydrogen Electrode', chinese: '标准氢电极', potential: '0.000 V', page: '/pages/advanced/electrochem/electrochem?ref=SHE', keywords: ['SHE', '标准氢', '氢电极'] },
        { name: 'SCE', full: 'Saturated Calomel Electrode', chinese: '饱和甘汞电极', potential: '+0.241 V', page: '/pages/advanced/electrochem/electrochem?ref=SCE', keywords: ['SCE', '甘汞', '汞'] },
        { name: 'Ag/AgCl', full: 'Silver/Silver Chloride', chinese: '银/氯化银电极', potential: '+0.197 V', page: '/pages/advanced/electrochem/electrochem?ref=AgAgCl', keywords: ['AgAgCl', '银氯化银', '银电极'] },
        { name: 'Hg/HgO', full: 'Mercury/Mercury Oxide', chinese: '汞/氧化汞电极', potential: '+0.098 V', page: '/pages/advanced/electrochem/electrochem?ref=HgHgO', keywords: ['HgHgO', '汞氧化汞'] },
        { name: 'Hg/Hg2SO4', full: 'Mercury/Mercury Sulfate', chinese: '汞/硫酸汞电极', potential: '+0.615 V', page: '/pages/advanced/electrochem/electrochem?ref=HgHg2SO4', keywords: ['硫酸汞'] }
      ];
      
      referenceData.forEach(item => {
        const score = calculateRelevance(normalizedQuery, item);
        if (score > 0) {
          results.push({
            type: '参比电极',
            name: item.name,
            fullName: item.full,
            chineseName: item.chinese,
            potential: item.potential,
            page: item.page,
            relevance: score
          });
        }
      });
    } catch (e) {
      // 静默失败
    }
  }
  
  // 搜索X射线源数据
  if (includeXRays) {
    try {
      const xrayData = [
        { name: 'Cu Kα', wavelength: '1.5406 Å', energy: '8.048 keV', page: '/pages/advanced/xrd/xrd?source=CuKa', keywords: ['Cu', '铜', 'CuKa', '1.5406'] },
        { name: 'Mo Kα', wavelength: '0.7107 Å', energy: '17.479 keV', page: '/pages/advanced/xrd/xrd?source=MoKa', keywords: ['Mo', '钼', 'MoKa', '0.7107'] },
        { name: 'Co Kα', wavelength: '1.7889 Å', energy: '6.930 keV', page: '/pages/advanced/xrd/xrd?source=CoKa', keywords: ['Co', '钴', 'CoKa'] },
        { name: 'Fe Kα', wavelength: '1.9373 Å', energy: '6.404 keV', page: '/pages/advanced/xrd/xrd?source=FeKa', keywords: ['Fe', '铁', 'FeKa'] },
        { name: 'Cr Kα', wavelength: '2.2897 Å', energy: '5.415 keV', page: '/pages/advanced/xrd/xrd?source=CrKa', keywords: ['Cr', '铬', 'CrKa'] }
      ];
      
      xrayData.forEach(item => {
        const score = calculateRelevance(normalizedQuery, item);
        if (score > 0) {
          results.push({
            type: 'X射线源',
            name: item.name,
            wavelength: item.wavelength,
            energy: item.energy,
            page: item.page,
            relevance: score
          });
        }
      });
    } catch (e) {
      // 静默失败
    }
  }
  
  // 按相关度排序
  results.sort((a, b) => b.relevance - a.relevance);
  
  // 限制结果数量
  return results.slice(0, limit);
}

/**
 * 计算搜索相关度（增强版：支持模糊匹配）
 */
function calculateRelevance(query, item) {
  let score = 0;
  const queryLower = query.toLowerCase();
  
  // 名称完全匹配（最高权重）
  if (item.name && item.name.toLowerCase() === queryLower) {
    score += 100;
  }
  // 名称以查询开头
  else if (item.name && item.name.toLowerCase().startsWith(queryLower)) {
    score += 80;
  }
  // 名称包含查询
  else if (item.name && item.name.toLowerCase().includes(queryLower)) {
    score += 50;
  }
  // 模糊匹配（拼音首字母、部分字符）
  else if (item.name && fuzzyMatch(item.name.toLowerCase(), queryLower)) {
    score += 30;
  }
  
  // 关键词匹配
  if (item.keywords) {
    item.keywords.forEach(keyword => {
      const keywordLower = keyword.toLowerCase();
      if (keywordLower === queryLower) {
        score += 60;
      } else if (keywordLower.includes(queryLower)) {
        score += 20;
      } else if (queryLower.includes(keywordLower)) {
        score += 15;
      }
    });
  }
  
  // 类型匹配
  if (item.type && item.type.toLowerCase().includes(queryLower)) {
    score += 10;
  }
  
  // 其他字段匹配
  if (item.abbr && item.abbr.toLowerCase().includes(queryLower)) {
    score += 40;
  }
  if (item.formula && item.formula.toLowerCase().includes(queryLower)) {
    score += 35;
  }
  if (item.chinese && item.chinese.includes(query)) {
    score += 45;
  }
  
  return score;
}

/**
 * 计算化学缩写的相关度
 */
function calculateRelevanceForAbbreviation(query, item) {
  let score = 0;
  const queryLower = query.toLowerCase();
  
  // 缩写完全匹配（最高权重）
  if (item.abbr && item.abbr.toLowerCase() === queryLower) {
    score += 100;
  }
  // 缩写包含查询
  else if (item.abbr && item.abbr.toLowerCase().includes(queryLower)) {
    score += 70;
  }
  
  // 全称匹配
  if (item.full && item.full.toLowerCase().includes(queryLower)) {
    score += 60;
  }
  
  // 中文名匹配
  if (item.chinese && item.chinese.includes(query)) {
    score += 50;
  }
  
  // 分类匹配
  if (item.category && item.category.includes(query)) {
    score += 20;
  }
  
  return score;
}

/**
 * 计算半导体材料的相关度
 */
function calculateRelevanceForSemiconductor(query, item) {
  let score = 0;
  const queryLower = query.toLowerCase();
  
  // 化学式完全匹配（最高权重）- 忽略大小写
  if (item.formula) {
    const formulaLower = item.formula.toLowerCase();
    if (formulaLower === queryLower) {
      score += 100;
    }
    // 化学式包含查询
    else if (formulaLower.includes(queryLower)) {
      score += 80;
    }
    // 查询包含在化学式中（如tio2匹配TiO2）
    else if (queryLower.includes(formulaLower)) {
      score += 70;
    }
  }
  
  // 名称匹配
  if (item.name && item.name.toLowerCase().includes(queryLower)) {
    score += 70;
  }
  
  // 英文名匹配
  if (item.nameEn && item.nameEn.toLowerCase().includes(queryLower)) {
    score += 70;
  }
  
  // 中文名匹配
  if (item.chinese && item.chinese.includes(query)) {
    score += 60;
  }
  
  // 类别匹配
  if (item.category && item.category.includes(query)) {
    score += 30;
  }
  
  // 别名匹配
  if (item.aliases && Array.isArray(item.aliases)) {
    item.aliases.forEach(alias => {
      if (alias.toLowerCase().includes(queryLower)) {
        score += 40;
      }
    });
  }
  
  return score;
}

/**
 * 计算元素的相关度
 */
function calculateRelevanceForElement(query, item) {
  let score = 0;
  const queryLower = query.toLowerCase();
  
  // 元素符号完全匹配（最高权重）
  if (item.symbol && item.symbol.toLowerCase() === queryLower) {
    score += 100;
  }
  // 元素符号包含查询
  else if (item.symbol && item.symbol.toLowerCase().includes(queryLower)) {
    score += 80;
  }
  
  // 中文名称完全匹配
  if (item.name && item.name === query) {
    score += 100;
  }
  // 中文名称包含查询
  else if (item.name && item.name.includes(query)) {
    score += 70;
  }
  
  // 英文名称匹配
  if (item.nameEn && item.nameEn.toLowerCase().includes(queryLower)) {
    score += 60;
  }
  
  // 原子序数匹配
  if (item.number && item.number.toString() === query) {
    score += 50;
  }
  
  // 类别匹配
  if (item.category && item.category.includes(query)) {
    score += 30;
  }
  
  return score;
}

/**
 * 模糊匹配算法（支持跳字匹配）
 * 例如：查询"xrd"可以匹配"XRD计算"
 */
function fuzzyMatch(text, query) {
  let textIndex = 0;
  let queryIndex = 0;
  
  while (textIndex < text.length && queryIndex < query.length) {
    if (text[textIndex] === query[queryIndex]) {
      queryIndex++;
    }
    textIndex++;
  }
  
  return queryIndex === query.length;
}

/**
 * 快速搜索（只搜索工具）
 */
function quickSearch(query) {
  return globalSearch(query, {
    includeTools: true,
    includeAbbreviations: false,
    includeSemiconductors: false,
    includeElements: false,
    limit: 10
  });
}

module.exports = {
  globalSearch,
  quickSearch,
  buildSearchIndex
};

