/**
 * 化学药品缩写数据库 - 增强版 v2.0
 * 包含详细的物理、化学性质和安全信息
 * 数据持续更新中
 */

// 基础数据（首次加载，轻量级）
const abbreviationsBasicData = [
  // ========== 有机溶剂 ==========
  {
    abbr: 'DMF',
    full: 'N,N-Dimethylformamide',
    chinese: 'N,N-二甲基甲酰胺',
    category: '有机溶剂',
    description: '常用极性非质子溶剂',
    cas: '68-12-2',
    formula: 'C3H7NO',
    mw: 73.09
  },
  {
    abbr: 'DMSO',
    full: 'Dimethyl sulfoxide',
    chinese: '二甲基亚砜',
    category: '有机溶剂',
    description: '极性非质子溶剂，吸湿性强',
    cas: '67-68-5',
    formula: 'C2H6OS',
    mw: 78.13
  },
  {
    abbr: 'THF',
    full: 'Tetrahydrofuran',
    chinese: '四氢呋喃',
    category: '有机溶剂',
    description: '常用醚类溶剂',
    cas: '109-99-9',
    formula: 'C4H8O',
    mw: 72.11
  },
  {
    abbr: 'DCM',
    full: 'Dichloromethane',
    chinese: '二氯甲烷',
    category: '有机溶剂',
    description: '也称为亚甲基氯',
    cas: '75-09-2',
    formula: 'CH2Cl2',
    mw: 84.93
  },
  {
    abbr: 'EtOH',
    full: 'Ethanol',
    chinese: '乙醇',
    category: '有机溶剂',
    description: '常用醇类溶剂',
    cas: '64-17-5',
    formula: 'C2H6O',
    mw: 46.07
  },
  {
    abbr: 'MeOH',
    full: 'Methanol',
    chinese: '甲醇',
    category: '有机溶剂',
    description: '低级醇溶剂',
    cas: '67-56-1',
    formula: 'CH4O',
    mw: 32.04
  },
  {
    abbr: 'ACN',
    full: 'Acetonitrile',
    chinese: '乙腈',
    category: '有机溶剂',
    description: '极性非质子溶剂',
    cas: '75-05-8',
    formula: 'C2H3N',
    mw: 41.05
  },
  {
    abbr: 'NMP',
    full: 'N-Methyl-2-pyrrolidone',
    chinese: 'N-甲基-2-吡咯烷酮',
    category: '有机溶剂',
    description: '高沸点极性溶剂',
    cas: '872-50-4',
    formula: 'C5H9NO',
    mw: 99.13
  },
  {
    abbr: 'DMAc',
    full: 'N,N-Dimethylacetamide',
    chinese: 'N,N-二甲基乙酰胺',
    category: '有机溶剂',
    description: '极性非质子溶剂',
    cas: '127-19-5',
    formula: 'C4H9NO',
    mw: 87.12
  },
  {
    abbr: 'EA',
    full: 'Ethyl acetate',
    chinese: '乙酸乙酯',
    category: '有机溶剂',
    description: '常用酯类溶剂',
    cas: '141-78-6',
    formula: 'C4H8O2',
    mw: 88.11
  },
  {
    abbr: 'Acetone',
    full: 'Acetone',
    chinese: '丙酮',
    category: '有机溶剂',
    description: '常用酮类溶剂',
    cas: '67-64-1',
    formula: 'C3H6O',
    mw: 58.08
  },
  {
    abbr: 'Toluene',
    full: 'Toluene',
    chinese: '甲苯',
    category: '有机溶剂',
    description: '常用芳香烃溶剂',
    cas: '108-88-3',
    formula: 'C7H8',
    mw: 92.14
  },
  {
    abbr: 'Hexane',
    full: 'n-Hexane',
    chinese: '正己烷',
    category: '有机溶剂',
    description: '非极性脂肪烃溶剂',
    cas: '110-54-3',
    formula: 'C6H14',
    mw: 86.18
  },
  {
    abbr: 'CHCl3',
    full: 'Chloroform',
    chinese: '氯仿',
    category: '有机溶剂',
    description: '三氯甲烷',
    cas: '67-66-3',
    formula: 'CHCl3',
    mw: 119.38
  },
  {
    abbr: 'IPA',
    full: 'Isopropyl alcohol',
    chinese: '异丙醇',
    category: '有机溶剂',
    description: '2-丙醇',
    cas: '67-63-0',
    formula: 'C3H8O',
    mw: 60.10
  },
  {
    abbr: 'MEK',
    full: 'Methyl ethyl ketone',
    chinese: '甲基乙基酮',
    category: '有机溶剂',
    description: '丁酮，2-丁酮',
    cas: '78-93-3',
    formula: 'C4H8O',
    mw: 72.11
  },
  {
    abbr: 'Dioxane',
    full: '1,4-Dioxane',
    chinese: '1,4-二氧六环',
    category: '有机溶剂',
    description: '环醚类溶剂',
    cas: '123-91-1',
    formula: 'C4H8O2',
    mw: 88.11
  },
  {
    abbr: 'Pyridine',
    full: 'Pyridine',
    chinese: '吡啶',
    category: '有机溶剂',
    description: '碱性杂环溶剂',
    cas: '110-86-1',
    formula: 'C5H5N',
    mw: 79.10
  },

  // ========== 酸碱试剂 ==========
  {
    abbr: 'HCl',
    full: 'Hydrochloric acid',
    chinese: '盐酸',
    category: '酸碱试剂',
    description: '强酸',
    cas: '7647-01-0',
    formula: 'HCl',
    mw: 36.46
  },
  {
    abbr: 'H2SO4',
    full: 'Sulfuric acid',
    chinese: '硫酸',
    category: '酸碱试剂',
    description: '强酸',
    cas: '7664-93-9',
    formula: 'H2SO4',
    mw: 98.08
  },
  {
    abbr: 'HNO3',
    full: 'Nitric acid',
    chinese: '硝酸',
    category: '酸碱试剂',
    description: '强酸，氧化性',
    cas: '7697-37-2',
    formula: 'HNO3',
    mw: 63.01
  },
  {
    abbr: 'AcOH',
    full: 'Acetic acid',
    chinese: '乙酸',
    category: '酸碱试剂',
    description: '醋酸，弱酸',
    cas: '64-19-7',
    formula: 'CH3COOH',
    mw: 60.05
  },
  {
    abbr: 'TFA',
    full: 'Trifluoroacetic acid',
    chinese: '三氟乙酸',
    category: '酸碱试剂',
    description: '强有机酸',
    cas: '76-05-1',
    formula: 'C2HF3O2',
    mw: 114.02
  },
  {
    abbr: 'NaOH',
    full: 'Sodium hydroxide',
    chinese: '氢氧化钠',
    category: '酸碱试剂',
    description: '强碱，烧碱',
    cas: '1310-73-2',
    formula: 'NaOH',
    mw: 40.00
  },
  {
    abbr: 'KOH',
    full: 'Potassium hydroxide',
    chinese: '氢氧化钾',
    category: '酸碱试剂',
    description: '强碱',
    cas: '1310-58-3',
    formula: 'KOH',
    mw: 56.11
  },
  {
    abbr: 'NH3',
    full: 'Ammonia',
    chinese: '氨',
    category: '酸碱试剂',
    description: '弱碱，氨水',
    cas: '7664-41-7',
    formula: 'NH3',
    mw: 17.03
  },
  {
    abbr: 'TEA',
    full: 'Triethanolamine',
    chinese: '三乙醇胺',
    category: '酸碱试剂',
    description: '弱碱，pH调节剂',
    cas: '102-71-6',
    formula: 'C6H15NO3',
    mw: 149.19
  },

  // ========== 配体和螯合剂 ==========
  {
    abbr: 'EDTA',
    full: 'Ethylenediaminetetraacetic acid',
    chinese: '乙二胺四乙酸',
    category: '配体/螯合剂',
    description: '强螯合剂',
    cas: '60-00-4',
    formula: 'C10H16N2O8',
    mw: 292.24
  },
  {
    abbr: 'DTPA',
    full: 'Diethylenetriaminepentaacetic acid',
    chinese: '二乙烯三胺五乙酸',
    category: '配体/螯合剂',
    description: '强螯合剂',
    cas: '67-43-6',
    formula: 'C14H23N3O10',
    mw: 393.35
  },
  {
    abbr: 'Phen',
    full: '1,10-Phenanthroline',
    chinese: '1,10-菲啰啉',
    category: '配体/螯合剂',
    description: '双齿配体',
    cas: '66-71-7',
    formula: 'C12H8N2',
    mw: 180.21
  },
  {
    abbr: 'Bpy',
    full: '2,2\'-Bipyridine',
    chinese: '2,2\'-联吡啶',
    category: '配体/螯合剂',
    description: '双齿配体',
    cas: '366-18-7',
    formula: 'C10H8N2',
    mw: 156.18
  },

  // ========== 表面活性剂 ==========
  {
    abbr: 'PVP',
    full: 'Polyvinylpyrrolidone',
    chinese: '聚乙烯吡咯烷酮',
    category: '表面活性剂',
    description: '常用稳定剂和分散剂',
    cas: '9003-39-8',
    formula: '(C6H9NO)n',
    mw: null
  },
  {
    abbr: 'CTAB',
    full: 'Cetyltrimethylammonium bromide',
    chinese: '十六烷基三甲基溴化铵',
    category: '表面活性剂',
    description: '阳离子表面活性剂',
    cas: '57-09-0',
    formula: 'C19H42BrN',
    mw: 364.45
  },
  {
    abbr: 'SDS',
    full: 'Sodium dodecyl sulfate',
    chinese: '十二烷基硫酸钠',
    category: '表面活性剂',
    description: '阴离子表面活性剂',
    cas: '151-21-3',
    formula: 'C12H25NaO4S',
    mw: 288.38
  },
  {
    abbr: 'Triton X-100',
    full: 'Polyoxyethylene octyl phenyl ether',
    chinese: '聚乙二醇辛基苯基醚',
    category: '表面活性剂',
    description: '非离子表面活性剂',
    cas: '9002-93-1',
    formula: 'C14H22O(C2H4O)n',
    mw: null
  },
  {
    abbr: 'Tween 20',
    full: 'Polysorbate 20',
    chinese: '聚山梨醇酯20',
    category: '表面活性剂',
    description: '非离子表面活性剂',
    cas: '9005-64-5',
    formula: 'C58H114O26',
    mw: 1227.54
  },

  // ========== 还原剂 ==========
  {
    abbr: 'NaBH4',
    full: 'Sodium borohydride',
    chinese: '硼氢化钠',
    category: '还原剂',
    description: '温和还原剂',
    cas: '16940-66-2',
    formula: 'NaBH4',
    mw: 37.83
  },
  {
    abbr: 'LiAlH4',
    full: 'Lithium aluminum hydride',
    chinese: '氢化铝锂',
    category: '还原剂',
    description: '强还原剂',
    cas: '16853-85-3',
    formula: 'LiAlH4',
    mw: 37.95
  },
  {
    abbr: 'Zn',
    full: 'Zinc',
    chinese: '锌',
    category: '还原剂',
    description: '金属还原剂',
    cas: '7440-66-6',
    formula: 'Zn',
    mw: 65.38
  },
  {
    abbr: 'Hydrazine',
    full: 'Hydrazine',
    chinese: '肼',
    category: '还原剂',
    description: '强还原剂',
    cas: '302-01-2',
    formula: 'N2H4',
    mw: 32.05
  },

  // ========== 氧化剂 ==========
  {
    abbr: 'H2O2',
    full: 'Hydrogen peroxide',
    chinese: '过氧化氢',
    category: '氧化剂',
    description: '温和氧化剂',
    cas: '7722-84-1',
    formula: 'H2O2',
    mw: 34.01
  },
  {
    abbr: 'KMnO4',
    full: 'Potassium permanganate',
    chinese: '高锰酸钾',
    category: '氧化剂',
    description: '强氧化剂',
    cas: '7722-64-7',
    formula: 'KMnO4',
    mw: 158.03
  },
  {
    abbr: 'PCC',
    full: 'Pyridinium chlorochromate',
    chinese: '氯铬酸吡啶盐',
    category: '氧化剂',
    description: '醇氧化剂',
    cas: '26299-14-9',
    formula: 'C5H6ClCrNO3',
    mw: 215.55
  },
  {
    abbr: 'PDC',
    full: 'Pyridinium dichromate',
    chinese: '重铬酸吡啶盐',
    category: '氧化剂',
    description: '醇氧化剂',
    cas: '20039-37-6',
    formula: '(C5H5NH)2Cr2O7',
    mw: 376.22
  },

  // ========== 前驱体 ==========
  {
    abbr: 'TEOS',
    full: 'Tetraethyl orthosilicate',
    chinese: '正硅酸乙酯',
    category: '前驱体',
    description: '硅源前驱体',
    cas: '78-10-4',
    formula: 'C8H20O4Si',
    mw: 208.33
  },
  {
    abbr: 'TBOT',
    full: 'Titanium(IV) butoxide',
    chinese: '钛酸丁酯',
    category: '前驱体',
    description: '钛源前驱体',
    cas: '5593-70-4',
    formula: 'C16H36O4Ti',
    mw: 340.32
  },
  {
    abbr: 'TTIP',
    full: 'Titanium(IV) isopropoxide',
    chinese: '钛酸异丙酯',
    category: '前驱体',
    description: '钛源前驱体',
    cas: '546-68-9',
    formula: 'C12H28O4Ti',
    mw: 284.22
  },

  // ========== 缓冲剂 ==========
  {
    abbr: 'PBS',
    full: 'Phosphate buffered saline',
    chinese: '磷酸盐缓冲液',
    category: '缓冲剂',
    description: 'pH 7.4缓冲液',
    cas: null,
    formula: null,
    mw: null
  },
  {
    abbr: 'Tris',
    full: 'Tris(hydroxymethyl)aminomethane',
    chinese: '三羟甲基氨基甲烷',
    category: '缓冲剂',
    description: '生物缓冲剂',
    cas: '77-86-1',
    formula: 'C4H11NO3',
    mw: 121.14
  },
  {
    abbr: 'HEPES',
    full: '4-(2-hydroxyethyl)-1-piperazineethanesulfonic acid',
    chinese: '羟乙基哌嗪乙磺酸',
    category: '缓冲剂',
    description: '生物缓冲剂',
    cas: '7365-45-9',
    formula: 'C8H18N2O4S',
    mw: 238.30
  },
  {
    abbr: 'MES',
    full: '2-(N-morpholino)ethanesulfonic acid',
    chinese: '2-吗啉乙磺酸',
    category: '缓冲剂',
    description: '生物缓冲剂',
    cas: '4432-31-9',
    formula: 'C6H13NO4S',
    mw: 195.24
  },

  // ========== 聚合物 ==========
  {
    abbr: 'PEG',
    full: 'Polyethylene glycol',
    chinese: '聚乙二醇',
    category: '聚合物',
    description: '水溶性聚合物',
    cas: '25322-68-3',
    formula: 'H(OCH2CH2)nOH',
    mw: null
  },
  {
    abbr: 'PVA',
    full: 'Polyvinyl alcohol',
    chinese: '聚乙烯醇',
    category: '聚合物',
    description: '水溶性高分子',
    cas: '9002-89-5',
    formula: '(C2H4O)n',
    mw: null
  },
  {
    abbr: 'PMMA',
    full: 'Polymethyl methacrylate',
    chinese: '聚甲基丙烯酸甲酯',
    category: '聚合物',
    description: '有机玻璃',
    cas: '9011-14-7',
    formula: '(C5H8O2)n',
    mw: null
  },
  {
    abbr: 'PS',
    full: 'Polystyrene',
    chinese: '聚苯乙烯',
    category: '聚合物',
    description: '通用塑料',
    cas: '9003-53-6',
    formula: '(C8H8)n',
    mw: null
  },
  {
    abbr: 'PTFE',
    full: 'Polytetrafluoroethylene',
    chinese: '聚四氟乙烯',
    category: '聚合物',
    description: '特氟龙，不粘涂层',
    cas: '9002-84-0',
    formula: '(C2F4)n',
    mw: null
  },
  {
    abbr: 'PEDOT',
    full: 'Poly(3,4-ethylenedioxythiophene)',
    chinese: '聚3,4-乙撑二氧噻吩',
    category: '导电聚合物',
    description: '导电聚合物',
    cas: '126213-50-1',
    formula: '(C6H4O2S)n',
    mw: null
  },

  // ========== 纳米材料（仅术语，无详细物化数据）==========
  {
    abbr: 'CNT',
    full: 'Carbon nanotube',
    chinese: '碳纳米管',
    category: '纳米材料',
    description: '一维碳纳米材料'
  },
  {
    abbr: 'SWCNT',
    full: 'Single-walled carbon nanotube',
    chinese: '单壁碳纳米管',
    category: '纳米材料',
    description: '单层石墨烯卷曲形成'
  },
  {
    abbr: 'MWCNT',
    full: 'Multi-walled carbon nanotube',
    chinese: '多壁碳纳米管',
    category: '纳米材料',
    description: '多层同心碳纳米管'
  },
  {
    abbr: 'GO',
    full: 'Graphene oxide',
    chinese: '氧化石墨烯',
    category: '纳米材料',
    description: '石墨烯氧化物'
  },
  {
    abbr: 'rGO',
    full: 'Reduced graphene oxide',
    chinese: '还原氧化石墨烯',
    category: '纳米材料',
    description: '还原后的氧化石墨烯'
  },
  {
    abbr: 'QD',
    full: 'Quantum dot',
    chinese: '量子点',
    category: '纳米材料',
    description: '零维半导体纳米晶'
  },
  {
    abbr: 'MOF',
    full: 'Metal-organic framework',
    chinese: '金属有机框架',
    category: '纳米材料',
    description: '多孔配位聚合物'
  },
  {
    abbr: 'COF',
    full: 'Covalent organic framework',
    chinese: '共价有机框架',
    category: '纳米材料',
    description: '共价键连接的多孔材料'
  },
  {
    abbr: 'AuNP',
    full: 'Gold nanoparticle',
    chinese: '金纳米颗粒',
    category: '纳米材料',
    description: '纳米金颗粒'
  },
  {
    abbr: 'AgNP',
    full: 'Silver nanoparticle',
    chinese: '银纳米颗粒',
    category: '纳米材料',
    description: '纳米银颗粒'
  },

  // ========== 表征技术 ==========
  {
    abbr: 'XRD',
    full: 'X-ray diffraction',
    chinese: 'X射线衍射',
    category: '表征技术',
    description: '晶体结构分析'
  },
  {
    abbr: 'SEM',
    full: 'Scanning electron microscopy',
    chinese: '扫描电子显微镜',
    category: '表征技术',
    description: '形貌表征'
  },
  {
    abbr: 'TEM',
    full: 'Transmission electron microscopy',
    chinese: '透射电子显微镜',
    category: '表征技术',
    description: '高分辨形貌分析'
  },
  {
    abbr: 'HRTEM',
    full: 'High-resolution TEM',
    chinese: '高分辨透射电子显微镜',
    category: '表征技术',
    description: '原子级分辨率'
  },
  {
    abbr: 'AFM',
    full: 'Atomic force microscopy',
    chinese: '原子力显微镜',
    category: '表征技术',
    description: '表面形貌分析'
  },
  {
    abbr: 'XPS',
    full: 'X-ray photoelectron spectroscopy',
    chinese: 'X射线光电子能谱',
    category: '表征技术',
    description: '表面化学分析'
  },
  {
    abbr: 'EDX',
    full: 'Energy-dispersive X-ray spectroscopy',
    chinese: '能量色散X射线谱',
    category: '表征技术',
    description: '元素分析'
  },
  {
    abbr: 'FTIR',
    full: 'Fourier-transform infrared spectroscopy',
    chinese: '傅里叶变换红外光谱',
    category: '表征技术',
    description: '化学键分析'
  },
  {
    abbr: 'UV-Vis',
    full: 'Ultraviolet-visible spectroscopy',
    chinese: '紫外-可见光谱',
    category: '表征技术',
    description: '光学性质分析'
  },
  {
    abbr: 'PL',
    full: 'Photoluminescence',
    chinese: '光致发光',
    category: '表征技术',
    description: '发光性质测试'
  },
  {
    abbr: 'BET',
    full: 'Brunauer-Emmett-Teller',
    chinese: 'BET比表面积',
    category: '表征技术',
    description: '比表面积测定方法'
  },
  {
    abbr: 'TGA',
    full: 'Thermogravimetric analysis',
    chinese: '热重分析',
    category: '表征技术',
    description: '热稳定性分析'
  },
  {
    abbr: 'DSC',
    full: 'Differential scanning calorimetry',
    chinese: '差示扫描量热法',
    category: '表征技术',
    description: '热性质分析'
  },
  {
    abbr: 'DLS',
    full: 'Dynamic light scattering',
    chinese: '动态光散射',
    category: '表征技术',
    description: '粒径分析'
  },
  {
    abbr: 'NMR',
    full: 'Nuclear magnetic resonance',
    chinese: '核磁共振',
    category: '表征技术',
    description: '分子结构分析'
  },
  {
    abbr: 'ESR',
    full: 'Electron spin resonance',
    chinese: '电子自旋共振',
    category: '表征技术',
    description: '自由基检测'
  },

  // ========== 电化学技术 ==========
  {
    abbr: 'CV',
    full: 'Cyclic voltammetry',
    chinese: '循环伏安法',
    category: '电化学技术',
    description: '电化学分析方法'
  },
  {
    abbr: 'EIS',
    full: 'Electrochemical impedance spectroscopy',
    chinese: '电化学阻抗谱',
    category: '电化学技术',
    description: '界面性质分析'
  },
  {
    abbr: 'LSV',
    full: 'Linear sweep voltammetry',
    chinese: '线性扫描伏安法',
    category: '电化学技术',
    description: '电化学分析技术'
  },
  {
    abbr: 'CA',
    full: 'Chronoamperometry',
    chinese: '计时电流法',
    category: '电化学技术',
    description: '电流-时间曲线'
  },

  // ========== 电催化反应 ==========
  {
    abbr: 'HER',
    full: 'Hydrogen evolution reaction',
    chinese: '析氢反应',
    category: '电催化',
    description: '产氢电化学反应'
  },
  {
    abbr: 'OER',
    full: 'Oxygen evolution reaction',
    chinese: '析氧反应',
    category: '电催化',
    description: '产氧电化学反应'
  },
  {
    abbr: 'ORR',
    full: 'Oxygen reduction reaction',
    chinese: '氧还原反应',
    category: '电催化',
    description: '氧气还原反应'
  },
  {
    abbr: 'CO2RR',
    full: 'CO2 reduction reaction',
    chinese: '二氧化碳还原反应',
    category: '电催化',
    description: 'CO2电化学还原'
  },
  {
    abbr: 'NRR',
    full: 'Nitrogen reduction reaction',
    chinese: '氮还原反应',
    category: '电催化',
    description: '电化学固氮'
  },

  // ========== 催化剂 ==========
  {
    abbr: 'Pd/C',
    full: 'Palladium on carbon',
    chinese: '碳载钯',
    category: '催化剂',
    description: '加氢催化剂',
    cas: null,
    formula: null,
    mw: null
  },
  {
    abbr: 'Pt/C',
    full: 'Platinum on carbon',
    chinese: '碳载铂',
    category: '催化剂',
    description: '加氢催化剂',
    cas: null,
    formula: null,
    mw: null
  },
  {
    abbr: 'Ru/C',
    full: 'Ruthenium on carbon',
    chinese: '碳载钌',
    category: '催化剂',
    description: '加氢催化剂',
    cas: null,
    formula: null,
    mw: null
  },
  {
    abbr: 'TiO2',
    full: 'Titanium dioxide',
    chinese: '二氧化钛',
    category: '催化剂',
    description: '光催化剂',
    cas: '13463-67-7',
    formula: 'TiO2',
    mw: 79.87
  },
  {
    abbr: 'ZnO',
    full: 'Zinc oxide',
    chinese: '氧化锌',
    category: '催化剂',
    description: '光催化剂、半导体',
    cas: '1314-13-2',
    formula: 'ZnO',
    mw: 81.38
  },
  {
    abbr: 'Al2O3',
    full: 'Aluminum oxide',
    chinese: '氧化铝',
    category: '催化剂',
    description: '催化剂载体',
    cas: '1344-28-1',
    formula: 'Al2O3',
    mw: 101.96
  },
  {
    abbr: 'CeO2',
    full: 'Cerium oxide',
    chinese: '氧化铈',
    category: '催化剂',
    description: '催化剂、氧载体',
    cas: '1306-38-3',
    formula: 'CeO2',
    mw: 172.11
  },

  // ========== 有机试剂 ==========
  {
    abbr: 'DIPEA',
    full: 'N,N-Diisopropylethylamine',
    chinese: 'N,N-二异丙基乙胺',
    category: '有机试剂',
    description: '有机碱，Hünig碱',
    cas: '7087-68-5',
    formula: 'C8H19N',
    mw: 129.24
  },
  {
    abbr: 'DBU',
    full: '1,8-Diazabicyclo[5.4.0]undec-7-ene',
    chinese: '1,8-二氮杂双环[5.4.0]十一碳-7-烯',
    category: '有机试剂',
    description: '强有机碱',
    cas: '6674-22-2',
    formula: 'C9H16N2',
    mw: 152.24
  },
  {
    abbr: 'DMAP',
    full: '4-Dimethylaminopyridine',
    chinese: '4-二甲氨基吡啶',
    category: '有机试剂',
    description: '酰化催化剂',
    cas: '1122-58-3',
    formula: 'C7H10N2',
    mw: 122.17
  },
  {
    abbr: 'DCC',
    full: 'N,N\'-Dicyclohexylcarbodiimide',
    chinese: 'N,N\'-二环己基碳二亚胺',
    category: '有机试剂',
    description: '缩合试剂',
    cas: '538-75-0',
    formula: 'C13H22N2',
    mw: 206.33
  },
  {
    abbr: 'EDC',
    full: '1-Ethyl-3-(3-dimethylaminopropyl)carbodiimide',
    chinese: '1-乙基-3-(3-二甲氨基丙基)碳二亚胺',
    category: '有机试剂',
    description: '缩合试剂',
    cas: '25952-53-8',
    formula: 'C8H17N3',
    mw: 155.24
  },
  {
    abbr: 'HATU',
    full: '1-[Bis(dimethylamino)methylene]-1H-1,2,3-triazolo[4,5-b]pyridinium 3-oxide hexafluorophosphate',
    chinese: '六氟磷酸偶氮三唑四甲基脲鎓',
    category: '有机试剂',
    description: '肽偶联试剂',
    cas: '148893-10-1',
    formula: 'C11H16F6N7OP',
    mw: 380.23
  },
  {
    abbr: 'HOBt',
    full: 'Hydroxybenzotriazole',
    chinese: '羟基苯并三氮唑',
    category: '有机试剂',
    description: '肽偶联添加剂',
    cas: '2592-95-2',
    formula: 'C6H5N3O',
    mw: 135.12
  },
  {
    abbr: 'TBAF',
    full: 'Tetrabutylammonium fluoride',
    chinese: '四丁基氟化铵',
    category: '有机试剂',
    description: '脱硅保护基试剂',
    cas: '429-41-4',
    formula: 'C16H36FN',
    mw: 261.46
  },
  {
    abbr: 'TBAB',
    full: 'Tetrabutylammonium bromide',
    chinese: '四丁基溴化铵',
    category: '有机试剂',
    description: '相转移催化剂',
    cas: '1643-19-2',
    formula: 'C16H36BrN',
    mw: 322.37
  },
  {
    abbr: 'TBACl',
    full: 'Tetrabutylammonium chloride',
    chinese: '四丁基氯化铵',
    category: '有机试剂',
    description: '相转移催化剂',
    cas: '1112-67-0',
    formula: 'C16H36ClN',
    mw: 277.92
  },
  {
    abbr: 'PPh3',
    full: 'Triphenylphosphine',
    chinese: '三苯基膦',
    category: '有机试剂',
    description: '配体、还原剂',
    cas: '603-35-0',
    formula: 'C18H15P',
    mw: 262.29
  },
  {
    abbr: 'DIAD',
    full: 'Diisopropyl azodicarboxylate',
    chinese: '偶氮二甲酸二异丙酯',
    category: '有机试剂',
    description: 'Mitsunobu反应试剂',
    cas: '2446-83-5',
    formula: 'C8H14N2O4',
    mw: 202.21
  },
  {
    abbr: 'DEAD',
    full: 'Diethyl azodicarboxylate',
    chinese: '偶氮二甲酸二乙酯',
    category: '有机试剂',
    description: 'Mitsunobu反应试剂',
    cas: '1972-28-7',
    formula: 'C6H10N2O4',
    mw: 174.15
  },
  {
    abbr: 'Boc2O',
    full: 'Di-tert-butyl dicarbonate',
    chinese: '二碳酸二叔丁酯',
    category: '有机试剂',
    description: 'Boc保护试剂',
    cas: '24424-99-5',
    formula: 'C10H18O5',
    mw: 218.25
  },
  {
    abbr: 'Fmoc-Cl',
    full: 'Fluorenylmethyloxycarbonyl chloride',
    chinese: '芴甲氧羰基氯',
    category: '有机试剂',
    description: 'Fmoc保护试剂',
    cas: '28920-43-6',
    formula: 'C15H11ClO2',
    mw: 258.70
  },
  {
    abbr: 'Cbz-Cl',
    full: 'Benzyl chloroformate',
    chinese: '氯甲酸苄酯',
    category: '有机试剂',
    description: 'Cbz保护试剂',
    cas: '501-53-1',
    formula: 'C8H7ClO2',
    mw: 170.59
  },
  {
    abbr: 'TMS-Cl',
    full: 'Trimethylsilyl chloride',
    chinese: '三甲基氯硅烷',
    category: '有机试剂',
    description: '硅保护试剂',
    cas: '75-77-4',
    formula: 'C3H9ClSi',
    mw: 108.64
  },
  {
    abbr: 'TBS-Cl',
    full: 'tert-Butyldimethylsilyl chloride',
    chinese: '叔丁基二甲基氯硅烷',
    category: '有机试剂',
    description: 'TBS保护试剂',
    cas: '18162-48-6',
    formula: 'C6H15ClSi',
    mw: 150.72
  },
  {
    abbr: 'TIPS-Cl',
    full: 'Triisopropylsilyl chloride',
    chinese: '三异丙基氯硅烷',
    category: '有机试剂',
    description: 'TIPS保护试剂',
    cas: '13154-24-0',
    formula: 'C9H21ClSi',
    mw: 192.80
  },
  {
    abbr: 'TMSOTf',
    full: 'Trimethylsilyl trifluoromethanesulfonate',
    chinese: '三氟甲磺酸三甲基硅酯',
    category: '有机试剂',
    description: '硅化试剂、Lewis酸',
    cas: '27607-77-8',
    formula: 'C4H9F3O3SSi',
    mw: 222.26
  },

  // ========== 更多溶剂 ==========
  {
    abbr: 'DME',
    full: '1,2-Dimethoxyethane',
    chinese: '1,2-二甲氧基乙烷',
    category: '有机溶剂',
    description: '醚类溶剂',
    cas: '110-71-4',
    formula: 'C4H10O2',
    mw: 90.12
  },
  {
    abbr: 'Diglyme',
    full: 'Diethylene glycol dimethyl ether',
    chinese: '二乙二醇二甲醚',
    category: '有机溶剂',
    description: '高沸点醚类溶剂',
    cas: '111-96-6',
    formula: 'C6H14O3',
    mw: 134.17
  },
  {
    abbr: 'MTBE',
    full: 'Methyl tert-butyl ether',
    chinese: '甲基叔丁基醚',
    category: '有机溶剂',
    description: '醚类溶剂',
    cas: '1634-04-4',
    formula: 'C5H12O',
    mw: 88.15
  },
  {
    abbr: 'CPME',
    full: 'Cyclopentyl methyl ether',
    chinese: '环戊基甲醚',
    category: '有机溶剂',
    description: '绿色溶剂',
    cas: '5614-37-9',
    formula: 'C6H12O',
    mw: 100.16
  },
  {
    abbr: '2-MeTHF',
    full: '2-Methyltetrahydrofuran',
    chinese: '2-甲基四氢呋喃',
    category: '有机溶剂',
    description: '绿色醚类溶剂',
    cas: '96-47-9',
    formula: 'C5H10O',
    mw: 86.13
  },
  {
    abbr: 'GBL',
    full: 'γ-Butyrolactone',
    chinese: 'γ-丁内酯',
    category: '有机溶剂',
    description: '环状酯溶剂',
    cas: '96-48-0',
    formula: 'C4H6O2',
    mw: 86.09
  },
  {
    abbr: 'NMF',
    full: 'N-Methylformamide',
    chinese: 'N-甲基甲酰胺',
    category: '有机溶剂',
    description: '极性溶剂',
    cas: '123-39-7',
    formula: 'C2H5NO',
    mw: 59.07
  },
  {
    abbr: 'Sulfolane',
    full: 'Sulfolane',
    chinese: '环丁砜',
    category: '有机溶剂',
    description: '高极性溶剂',
    cas: '126-33-0',
    formula: 'C4H8O2S',
    mw: 120.17
  },
  {
    abbr: 'PC',
    full: 'Propylene carbonate',
    chinese: '碳酸丙烯酯',
    category: '有机溶剂',
    description: '高介电常数溶剂',
    cas: '108-32-7',
    formula: 'C4H6O3',
    mw: 102.09
  },
  {
    abbr: 'EC',
    full: 'Ethylene carbonate',
    chinese: '碳酸乙烯酯',
    category: '有机溶剂',
    description: '锂电池电解液',
    cas: '96-49-1',
    formula: 'C3H4O3',
    mw: 88.06
  },
  {
    abbr: 'DCE',
    full: '1,2-Dichloroethane',
    chinese: '1,2-二氯乙烷',
    category: '有机溶剂',
    description: '卤代烃溶剂',
    cas: '107-06-2',
    formula: 'C2H4Cl2',
    mw: 98.96
  },
  {
    abbr: 'TCE',
    full: 'Trichloroethylene',
    chinese: '三氯乙烯',
    category: '有机溶剂',
    description: '卤代烃溶剂',
    cas: '79-01-6',
    formula: 'C2HCl3',
    mw: 131.39
  },
  {
    abbr: 'CB',
    full: 'Chlorobenzene',
    chinese: '氯苯',
    category: '有机溶剂',
    description: '芳香卤代烃',
    cas: '108-90-7',
    formula: 'C6H5Cl',
    mw: 112.56
  },
  {
    abbr: 'o-DCB',
    full: '1,2-Dichlorobenzene',
    chinese: '邻二氯苯',
    category: '有机溶剂',
    description: '高沸点芳香卤代烃',
    cas: '95-50-1',
    formula: 'C6H4Cl2',
    mw: 147.00
  },
  {
    abbr: 'HFIP',
    full: 'Hexafluoroisopropanol',
    chinese: '六氟异丙醇',
    category: '有机溶剂',
    description: '强极性氟醇',
    cas: '920-66-1',
    formula: 'C3H2F6O',
    mw: 168.04
  },
  {
    abbr: 'TFE',
    full: '2,2,2-Trifluoroethanol',
    chinese: '三氟乙醇',
    category: '有机溶剂',
    description: '氟代醇',
    cas: '75-89-8',
    formula: 'C2H3F3O',
    mw: 100.04
  },

  // ========== 盐类 ==========
  {
    abbr: 'NaCl',
    full: 'Sodium chloride',
    chinese: '氯化钠',
    category: '无机盐',
    description: '食盐',
    cas: '7647-14-5',
    formula: 'NaCl',
    mw: 58.44
  },
  {
    abbr: 'KCl',
    full: 'Potassium chloride',
    chinese: '氯化钾',
    category: '无机盐',
    description: '钾盐',
    cas: '7447-40-7',
    formula: 'KCl',
    mw: 74.55
  },
  {
    abbr: 'CaCl2',
    full: 'Calcium chloride',
    chinese: '氯化钙',
    category: '无机盐',
    description: '干燥剂',
    cas: '10043-52-4',
    formula: 'CaCl2',
    mw: 110.98
  },
  {
    abbr: 'MgSO4',
    full: 'Magnesium sulfate',
    chinese: '硫酸镁',
    category: '无机盐',
    description: '干燥剂',
    cas: '7487-88-9',
    formula: 'MgSO4',
    mw: 120.37
  },
  {
    abbr: 'Na2SO4',
    full: 'Sodium sulfate',
    chinese: '硫酸钠',
    category: '无机盐',
    description: '干燥剂',
    cas: '7757-82-6',
    formula: 'Na2SO4',
    mw: 142.04
  },
  {
    abbr: 'NH4Cl',
    full: 'Ammonium chloride',
    chinese: '氯化铵',
    category: '无机盐',
    description: '铵盐',
    cas: '12125-02-9',
    formula: 'NH4Cl',
    mw: 53.49
  },
  {
    abbr: 'K2CO3',
    full: 'Potassium carbonate',
    chinese: '碳酸钾',
    category: '无机盐',
    description: '碱',
    cas: '584-08-7',
    formula: 'K2CO3',
    mw: 138.21
  },
  {
    abbr: 'Na2CO3',
    full: 'Sodium carbonate',
    chinese: '碳酸钠',
    category: '无机盐',
    description: '纯碱',
    cas: '497-19-8',
    formula: 'Na2CO3',
    mw: 105.99
  },
  {
    abbr: 'NaHCO3',
    full: 'Sodium bicarbonate',
    chinese: '碳酸氢钠',
    category: '无机盐',
    description: '小苏打',
    cas: '144-55-8',
    formula: 'NaHCO3',
    mw: 84.01
  },
  {
    abbr: 'Na2S2O3',
    full: 'Sodium thiosulfate',
    chinese: '硫代硫酸钠',
    category: '无机盐',
    description: '海波',
    cas: '7772-98-7',
    formula: 'Na2S2O3',
    mw: 158.11
  },
  {
    abbr: 'AgNO3',
    full: 'Silver nitrate',
    chinese: '硝酸银',
    category: '无机盐',
    description: '银盐',
    cas: '7761-88-8',
    formula: 'AgNO3',
    mw: 169.87
  },
  {
    abbr: 'CuSO4',
    full: 'Copper(II) sulfate',
    chinese: '硫酸铜',
    category: '无机盐',
    description: '铜盐',
    cas: '7758-98-7',
    formula: 'CuSO4',
    mw: 159.61
  },
  {
    abbr: 'FeSO4',
    full: 'Iron(II) sulfate',
    chinese: '硫酸亚铁',
    category: '无机盐',
    description: '亚铁盐',
    cas: '7720-78-7',
    formula: 'FeSO4',
    mw: 151.91
  },
  {
    abbr: 'FeCl3',
    full: 'Iron(III) chloride',
    chinese: '氯化铁',
    category: '无机盐',
    description: '铁盐',
    cas: '7705-08-0',
    formula: 'FeCl3',
    mw: 162.20
  },
  {
    abbr: 'ZnSO4',
    full: 'Zinc sulfate',
    chinese: '硫酸锌',
    category: '无机盐',
    description: '锌盐',
    cas: '7733-02-0',
    formula: 'ZnSO4',
    mw: 161.47
  },
  {
    abbr: 'CdCl2',
    full: 'Cadmium chloride',
    chinese: '氯化镉',
    category: '无机盐',
    description: '镉盐，剧毒',
    cas: '10108-64-2',
    formula: 'CdCl2',
    mw: 183.32
  },
  {
    abbr: 'PbAc2',
    full: 'Lead(II) acetate',
    chinese: '乙酸铅',
    category: '无机盐',
    description: '铅盐，有毒',
    cas: '301-04-2',
    formula: 'Pb(CH3COO)2',
    mw: 325.29
  },

  // ========== 更多纳米材料 ==========
  {
    abbr: 'MXene',
    full: 'MXene',
    chinese: 'MXene',
    category: '纳米材料',
    description: '二维过渡金属碳/氮化物'
  },
  {
    abbr: 'BP',
    full: 'Black phosphorus',
    chinese: '黑磷',
    category: '纳米材料',
    description: '二维材料'
  },
  {
    abbr: 'MoS2',
    full: 'Molybdenum disulfide',
    chinese: '二硫化钼',
    category: '纳米材料',
    description: '二维半导体材料',
    cas: '1317-33-5',
    formula: 'MoS2',
    mw: 160.07
  },
  {
    abbr: 'WS2',
    full: 'Tungsten disulfide',
    chinese: '二硫化钨',
    category: '纳米材料',
    description: '二维半导体材料',
    cas: '12138-09-9',
    formula: 'WS2',
    mw: 247.97
  },
  {
    abbr: 'h-BN',
    full: 'Hexagonal boron nitride',
    chinese: '六方氮化硼',
    category: '纳米材料',
    description: '二维绝缘材料',
    cas: '10043-11-5',
    formula: 'BN',
    mw: 24.82
  },
  {
    abbr: 'g-C3N4',
    full: 'Graphitic carbon nitride',
    chinese: '石墨相氮化碳',
    category: '纳米材料',
    description: '聚合物半导体光催化剂'
  },
  {
    abbr: 'UiO-66',
    full: 'UiO-66',
    chinese: 'UiO-66',
    category: '纳米材料',
    description: '锆基MOF材料'
  },
  {
    abbr: 'ZIF-8',
    full: 'Zeolitic imidazolate framework-8',
    chinese: '沸石咪唑酯骨架-8',
    category: '纳米材料',
    description: 'ZIF类MOF材料'
  },
  {
    abbr: 'MIL-101',
    full: 'Materials of Institute Lavoisier-101',
    chinese: 'MIL-101',
    category: '纳米材料',
    description: '铬基MOF材料'
  },

  // ========== 更多表征技术 ==========
  {
    abbr: 'SAXS',
    full: 'Small-angle X-ray scattering',
    chinese: '小角X射线散射',
    category: '表征技术',
    description: '纳米结构分析'
  },
  {
    abbr: 'STEM',
    full: 'Scanning transmission electron microscopy',
    chinese: '扫描透射电子显微镜',
    category: '表征技术',
    description: '高分辨成像'
  },
  {
    abbr: 'EELS',
    full: 'Electron energy loss spectroscopy',
    chinese: '电子能量损失谱',
    category: '表征技术',
    description: '元素和电子结构分析'
  },
  {
    abbr: 'SAED',
    full: 'Selected area electron diffraction',
    chinese: '选区电子衍射',
    category: '表征技术',
    description: '晶体结构分析'
  },
  {
    abbr: 'ICP-MS',
    full: 'Inductively coupled plasma mass spectrometry',
    chinese: '电感耦合等离子体质谱',
    category: '表征技术',
    description: '痕量元素分析'
  },
  {
    abbr: 'ICP-OES',
    full: 'Inductively coupled plasma optical emission spectrometry',
    chinese: '电感耦合等离子体发射光谱',
    category: '表征技术',
    description: '元素定量分析'
  },
  {
    abbr: 'GC-MS',
    full: 'Gas chromatography-mass spectrometry',
    chinese: '气相色谱-质谱联用',
    category: '表征技术',
    description: '有机物分析'
  },
  {
    abbr: 'LC-MS',
    full: 'Liquid chromatography-mass spectrometry',
    chinese: '液相色谱-质谱联用',
    category: '表征技术',
    description: '有机物/生物分子分析'
  },
  {
    abbr: 'HPLC',
    full: 'High-performance liquid chromatography',
    chinese: '高效液相色谱',
    category: '表征技术',
    description: '分离与纯化'
  },
  {
    abbr: 'GPC',
    full: 'Gel permeation chromatography',
    chinese: '凝胶渗透色谱',
    category: '表征技术',
    description: '聚合物分子量测定'
  },
  {
    abbr: 'ESI-MS',
    full: 'Electrospray ionization mass spectrometry',
    chinese: '电喷雾电离质谱',
    category: '表征技术',
    description: '生物分子质谱'
  },
  {
    abbr: 'MALDI-TOF',
    full: 'Matrix-assisted laser desorption/ionization time-of-flight',
    chinese: '基质辅助激光解吸电离飞行时间质谱',
    category: '表征技术',
    description: '生物大分子分析'
  },
  {
    abbr: 'EPR',
    full: 'Electron paramagnetic resonance',
    chinese: '电子顺磁共振',
    category: '表征技术',
    description: '自由基和顺磁性物质分析'
  },
  {
    abbr: 'STM',
    full: 'Scanning tunneling microscopy',
    chinese: '扫描隧道显微镜',
    category: '表征技术',
    description: '原子级表面成像'
  },
  {
    abbr: 'MFM',
    full: 'Magnetic force microscopy',
    chinese: '磁力显微镜',
    category: '表征技术',
    description: '磁畴成像'
  },
  {
    abbr: 'EFM',
    full: 'Electrostatic force microscopy',
    chinese: '静电力显微镜',
    category: '表征技术',
    description: '表面电性测量'
  },
  {
    abbr: 'SIMS',
    full: 'Secondary ion mass spectrometry',
    chinese: '二次离子质谱',
    category: '表征技术',
    description: '表面元素深度分析'
  },
  {
    abbr: 'TOF-SIMS',
    full: 'Time-of-flight secondary ion mass spectrometry',
    chinese: '飞行时间二次离子质谱',
    category: '表征技术',
    description: '表面成像分析'
  },
  {
    abbr: 'UPS',
    full: 'Ultraviolet photoelectron spectroscopy',
    chinese: '紫外光电子能谱',
    category: '表征技术',
    description: '价带电子结构分析'
  },
  {
    abbr: 'AES',
    full: 'Auger electron spectroscopy',
    chinese: '俄歇电子能谱',
    category: '表征技术',
    description: '表面元素分析'
  },
  {
    abbr: 'LEED',
    full: 'Low-energy electron diffraction',
    chinese: '低能电子衍射',
    category: '表征技术',
    description: '表面晶体结构分析'
  },

  // ========== 光学与光谱技术 ==========
  {
    abbr: 'TRPL',
    full: 'Time-resolved photoluminescence',
    chinese: '时间分辨光致发光',
    category: '表征技术',
    description: '载流子寿命测量'
  },
  {
    abbr: 'EL',
    full: 'Electroluminescence',
    chinese: '电致发光',
    category: '表征技术',
    description: '电致发光性质'
  },
  {
    abbr: 'CL',
    full: 'Cathodoluminescence',
    chinese: '阴极发光',
    category: '表征技术',
    description: '电子束激发发光'
  },
  {
    abbr: 'TA',
    full: 'Transient absorption',
    chinese: '瞬态吸收光谱',
    category: '表征技术',
    description: '超快动力学研究'
  },
  {
    abbr: 'IPCE',
    full: 'Incident photon-to-current efficiency',
    chinese: '入射光子-电流转换效率',
    category: '表征技术',
    description: '光电性能表征'
  },
  {
    abbr: 'EQE',
    full: 'External quantum efficiency',
    chinese: '外量子效率',
    category: '表征技术',
    description: '器件效率测试'
  },
  {
    abbr: 'IQE',
    full: 'Internal quantum efficiency',
    chinese: '内量子效率',
    category: '表征技术',
    description: '器件效率测试'
  },

  // ========== 电化学与电池技术 ==========
  {
    abbr: 'GCD',
    full: 'Galvanostatic charge-discharge',
    chinese: '恒流充放电',
    category: '电化学技术',
    description: '电池性能测试'
  },
  {
    abbr: 'GITT',
    full: 'Galvanostatic intermittent titration technique',
    chinese: '恒流间歇滴定技术',
    category: '电化学技术',
    description: '扩散系数测定'
  },
  {
    abbr: 'PITT',
    full: 'Potentiostatic intermittent titration technique',
    chinese: '恒电位间歇滴定技术',
    category: '电化学技术',
    description: '扩散系数测定'
  },
  {
    abbr: 'SEI',
    full: 'Solid electrolyte interphase',
    chinese: '固体电解质界面膜',
    category: '电化学',
    description: '锂电池界面层'
  },
  {
    abbr: 'CEI',
    full: 'Cathode electrolyte interphase',
    chinese: '正极电解质界面',
    category: '电化学',
    description: '电池界面'
  },

  // ========== 其他缩写 ==========
  {
    abbr: 'RT',
    full: 'Room temperature',
    chinese: '室温',
    category: '实验条件',
    description: '约20-25°C'
  },
  {
    abbr: 'r.t.',
    full: 'Room temperature',
    chinese: '室温',
    category: '实验条件',
    description: '约20-25°C'
  },
  {
    abbr: 'DFT',
    full: 'Density functional theory',
    chinese: '密度泛函理论',
    category: '计算方法',
    description: '量子化学计算方法'
  },
  {
    abbr: 'MD',
    full: 'Molecular dynamics',
    chinese: '分子动力学',
    category: '计算方法',
    description: '模拟方法'
  },
  {
    abbr: 'MC',
    full: 'Monte Carlo',
    chinese: '蒙特卡洛',
    category: '计算方法',
    description: '随机模拟方法'
  },
  {
    abbr: 'TD-DFT',
    full: 'Time-dependent density functional theory',
    chinese: '含时密度泛函理论',
    category: '计算方法',
    description: '激发态计算'
  },
  {
    abbr: 'PCM',
    full: 'Polarizable continuum model',
    chinese: '极化连续介质模型',
    category: '计算方法',
    description: '溶剂化模型'
  },
  {
    abbr: 'HOMO',
    full: 'Highest occupied molecular orbital',
    chinese: '最高占据分子轨道',
    category: '理论化学',
    description: '前线轨道'
  },
  {
    abbr: 'LUMO',
    full: 'Lowest unoccupied molecular orbital',
    chinese: '最低未占据分子轨道',
    category: '理论化学',
    description: '前线轨道'
  },
  {
    abbr: 'SCE',
    full: 'Saturated calomel electrode',
    chinese: '饱和甘汞电极',
    category: '电化学',
    description: '参比电极'
  },
  {
    abbr: 'Ag/AgCl',
    full: 'Silver/silver chloride electrode',
    chinese: '银/氯化银电极',
    category: '电化学',
    description: '参比电极'
  },
  {
    abbr: 'RHE',
    full: 'Reversible hydrogen electrode',
    chinese: '可逆氢电极',
    category: '电化学',
    description: '参比电极'
  },
  {
    abbr: 'SHE',
    full: 'Standard hydrogen electrode',
    chinese: '标准氢电极',
    category: '电化学',
    description: '标准参比电极'
  },
  {
    abbr: 'NHE',
    full: 'Normal hydrogen electrode',
    chinese: '标准氢电极',
    category: '电化学',
    description: '标准参比电极'
  },
  {
    abbr: 'FTO',
    full: 'Fluorine-doped tin oxide',
    chinese: '氟掺杂氧化锡',
    category: '材料',
    description: '透明导电玻璃'
  },
  {
    abbr: 'ITO',
    full: 'Indium tin oxide',
    chinese: '铟锡氧化物',
    category: '材料',
    description: '透明导电材料'
  },
  {
    abbr: 'HTL',
    full: 'Hole transport layer',
    chinese: '空穴传输层',
    category: '器件结构',
    description: '太阳能电池组件'
  },
  {
    abbr: 'ETL',
    full: 'Electron transport layer',
    chinese: '电子传输层',
    category: '器件结构',
    description: '太阳能电池组件'
  },
  {
    abbr: 'PCE',
    full: 'Power conversion efficiency',
    chinese: '光电转换效率',
    category: '性能指标',
    description: '太阳能电池效率'
  },
  {
    abbr: 'Voc',
    full: 'Open-circuit voltage',
    chinese: '开路电压',
    category: '性能指标',
    description: '电池电压参数'
  },
  {
    abbr: 'Jsc',
    full: 'Short-circuit current density',
    chinese: '短路电流密度',
    category: '性能指标',
    description: '电池电流参数'
  },
  {
    abbr: 'FF',
    full: 'Fill factor',
    chinese: '填充因子',
    category: '性能指标',
    description: '太阳能电池参数'
  },
  {
    abbr: 'QY',
    full: 'Quantum yield',
    chinese: '量子产率',
    category: '性能指标',
    description: '发光效率'
  },
  {
    abbr: 'PLQY',
    full: 'Photoluminescence quantum yield',
    chinese: '光致发光量子产率',
    category: '性能指标',
    description: '发光材料效率'
  },
  {
    abbr: 'FWHM',
    full: 'Full width at half maximum',
    chinese: '半峰全宽',
    category: '性能指标',
    description: '峰形参数'
  },
  {
    abbr: 'TOF',
    full: 'Turnover frequency',
    chinese: '转化频率',
    category: '性能指标',
    description: '催化活性参数'
  },
  {
    abbr: 'TON',
    full: 'Turnover number',
    chinese: '转化数',
    category: '性能指标',
    description: '催化效率参数'
  },
  {
    abbr: 'Faradaic',
    full: 'Faradaic efficiency',
    chinese: '法拉第效率',
    category: '性能指标',
    description: '电化学转化效率'
  },
  {
    abbr: 'BET',
    full: 'Brunauer-Emmett-Teller',
    chinese: 'BET比表面积',
    category: '性能指标',
    description: '比表面积'
  },
  {
    abbr: 'BJH',
    full: 'Barrett-Joyner-Halenda',
    chinese: 'BJH孔径分布',
    category: '性能指标',
    description: '孔结构分析'
  },

  // ========== 更多有机溶剂 ==========
  {
    abbr: 'Benzene',
    full: 'Benzene',
    chinese: '苯',
    category: '有机溶剂',
    description: '芳香烃溶剂',
    cas: '71-43-2',
    formula: 'C6H6',
    mw: 78.11
  },
  {
    abbr: 'Xylene',
    full: 'Xylene',
    chinese: '二甲苯',
    category: '有机溶剂',
    description: '芳香烃溶剂',
    cas: '1330-20-7',
    formula: 'C8H10',
    mw: 106.17
  },
  {
    abbr: 'Mesitylene',
    full: '1,3,5-Trimethylbenzene',
    chinese: '1,3,5-三甲基苯',
    category: '有机溶剂',
    description: '芳香烃溶剂',
    cas: '108-67-8',
    formula: 'C9H12',
    mw: 120.19
  },
  {
    abbr: 'CCl4',
    full: 'Carbon tetrachloride',
    chinese: '四氯化碳',
    category: '有机溶剂',
    description: '卤代烃溶剂',
    cas: '56-23-5',
    formula: 'CCl4',
    mw: 153.82
  },
  {
    abbr: 'CS2',
    full: 'Carbon disulfide',
    chinese: '二硫化碳',
    category: '有机溶剂',
    description: '硫化物溶剂',
    cas: '75-15-0',
    formula: 'CS2',
    mw: 76.14
  },
  {
    abbr: 'n-BuOH',
    full: 'n-Butanol',
    chinese: '正丁醇',
    category: '有机溶剂',
    description: '醇类溶剂',
    cas: '71-36-3',
    formula: 'C4H10O',
    mw: 74.12
  },
  {
    abbr: 't-BuOH',
    full: 'tert-Butanol',
    chinese: '叔丁醇',
    category: '有机溶剂',
    description: '醇类溶剂',
    cas: '75-65-0',
    formula: 'C4H10O',
    mw: 74.12
  },
  {
    abbr: 'Glycerol',
    full: 'Glycerol',
    chinese: '甘油',
    category: '有机溶剂',
    description: '多元醇',
    cas: '56-81-5',
    formula: 'C3H8O3',
    mw: 92.09
  },
  {
    abbr: 'EG',
    full: 'Ethylene glycol',
    chinese: '乙二醇',
    category: '有机溶剂',
    description: '二元醇',
    cas: '107-21-1',
    formula: 'C2H6O2',
    mw: 62.07
  },
  {
    abbr: 'DEG',
    full: 'Diethylene glycol',
    chinese: '二乙二醇',
    category: '有机溶剂',
    description: '多元醇',
    cas: '111-46-6',
    formula: 'C4H10O3',
    mw: 106.12
  },

  // ========== 更多有机试剂和保护基 ==========
  {
    abbr: 'Ac2O',
    full: 'Acetic anhydride',
    chinese: '乙酸酐',
    category: '有机试剂',
    description: '酰化试剂',
    cas: '108-24-7',
    formula: 'C4H6O3',
    mw: 102.09
  },
  {
    abbr: 'BnBr',
    full: 'Benzyl bromide',
    chinese: '溴化苄',
    category: '有机试剂',
    description: '苄基化试剂',
    cas: '100-39-0',
    formula: 'C7H7Br',
    mw: 171.04
  },
  {
    abbr: 'MeI',
    full: 'Methyl iodide',
    chinese: '碘甲烷',
    category: '有机试剂',
    description: '甲基化试剂',
    cas: '74-88-4',
    formula: 'CH3I',
    mw: 141.94
  },
  {
    abbr: 'EtI',
    full: 'Ethyl iodide',
    chinese: '碘乙烷',
    category: '有机试剂',
    description: '乙基化试剂',
    cas: '75-03-6',
    formula: 'C2H5I',
    mw: 155.97
  },
  {
    abbr: 'AllylBr',
    full: 'Allyl bromide',
    chinese: '烯丙基溴',
    category: '有机试剂',
    description: '烯丙基化试剂',
    cas: '106-95-6',
    formula: 'C3H5Br',
    mw: 120.98
  },
  {
    abbr: 'TsCl',
    full: 'p-Toluenesulfonyl chloride',
    chinese: '对甲苯磺酰氯',
    category: '有机试剂',
    description: 'Tosyl保护试剂',
    cas: '98-59-9',
    formula: 'C7H7ClO2S',
    mw: 190.65
  },
  {
    abbr: 'MsCl',
    full: 'Methanesulfonyl chloride',
    chinese: '甲磺酰氯',
    category: '有机试剂',
    description: 'Mesyl保护试剂',
    cas: '124-63-0',
    formula: 'CH3ClO2S',
    mw: 114.55
  },
  {
    abbr: 'NBS',
    full: 'N-Bromosuccinimide',
    chinese: 'N-溴代丁二酰亚胺',
    category: '有机试剂',
    description: '溴化试剂',
    cas: '128-08-5',
    formula: 'C4H4BrNO2',
    mw: 177.98
  },
  {
    abbr: 'NCS',
    full: 'N-Chlorosuccinimide',
    chinese: 'N-氯代丁二酰亚胺',
    category: '有机试剂',
    description: '氯化试剂',
    cas: '128-09-6',
    formula: 'C4H4ClNO2',
    mw: 133.53
  },
  {
    abbr: 'NIS',
    full: 'N-Iodosuccinimide',
    chinese: 'N-碘代丁二酰亚胺',
    category: '有机试剂',
    description: '碘化试剂',
    cas: '516-12-1',
    formula: 'C4H4INO2',
    mw: 224.98
  },
  {
    abbr: 'DDQ',
    full: '2,3-Dichloro-5,6-dicyano-1,4-benzoquinone',
    chinese: '2,3-二氯-5,6-二氰基-1,4-苯醌',
    category: '氧化剂',
    description: '温和氧化剂',
    cas: '84-58-2',
    formula: 'C8Cl2N2O2',
    mw: 227.00
  },
  {
    abbr: 'IBX',
    full: '2-Iodoxybenzoic acid',
    chinese: '2-碘酰基苯甲酸',
    category: '氧化剂',
    description: '醇氧化剂',
    cas: '61717-82-6',
    formula: 'C7H5IO4',
    mw: 280.02
  },
  {
    abbr: 'DMP',
    full: 'Dess-Martin periodinane',
    chinese: 'Dess-Martin氧化剂',
    category: '氧化剂',
    description: '醇氧化剂',
    cas: '87413-09-0',
    formula: 'C13H13IO8',
    mw: 424.14
  },
  {
    abbr: 'mCPBA',
    full: 'meta-Chloroperoxybenzoic acid',
    chinese: '间氯过氧苯甲酸',
    category: '氧化剂',
    description: '环氧化试剂',
    cas: '937-14-4',
    formula: 'C7H5ClO3',
    mw: 172.57
  },
  {
    abbr: 'TEMPO',
    full: '2,2,6,6-Tetramethylpiperidine-1-oxyl',
    chinese: '2,2,6,6-四甲基哌啶氧化物',
    category: '氧化剂',
    description: '自由基催化氧化',
    cas: '2564-83-2',
    formula: 'C9H18NO',
    mw: 156.25
  },
  {
    abbr: 'AIBN',
    full: 'Azobisisobutyronitrile',
    chinese: '偶氮二异丁腈',
    category: '有机试剂',
    description: '自由基引发剂',
    cas: '78-67-1',
    formula: 'C8H12N4',
    mw: 164.21
  },

  // ========== 金属有机化合物 ==========
  {
    abbr: 'n-BuLi',
    full: 'n-Butyllithium',
    chinese: '正丁基锂',
    category: '金属有机试剂',
    description: '强碱、亲核试剂',
    cas: '109-72-8',
    formula: 'C4H9Li',
    mw: 64.06
  },
  {
    abbr: 't-BuLi',
    full: 'tert-Butyllithium',
    chinese: '叔丁基锂',
    category: '金属有机试剂',
    description: '强碱',
    cas: '594-19-4',
    formula: 'C4H9Li',
    mw: 64.06
  },
  {
    abbr: 'PhLi',
    full: 'Phenyllithium',
    chinese: '苯基锂',
    category: '金属有机试剂',
    description: '有机锂试剂',
    cas: '591-51-5',
    formula: 'C6H5Li',
    mw: 84.05
  },
  {
    abbr: 'MeMgBr',
    full: 'Methylmagnesium bromide',
    chinese: '甲基溴化镁',
    category: '金属有机试剂',
    description: 'Grignard试剂',
    cas: '75-16-1',
    formula: 'CH3MgBr',
    mw: 119.25
  },
  {
    abbr: 'PhMgBr',
    full: 'Phenylmagnesium bromide',
    chinese: '苯基溴化镁',
    category: '金属有机试剂',
    description: 'Grignard试剂',
    cas: '100-58-3',
    formula: 'C6H5MgBr',
    mw: 181.31
  },
  {
    abbr: 'Me3Al',
    full: 'Trimethylaluminum',
    chinese: '三甲基铝',
    category: '金属有机试剂',
    description: '甲基化试剂',
    cas: '75-24-1',
    formula: 'C3H9Al',
    mw: 72.09
  },
  {
    abbr: 'Et3Al',
    full: 'Triethylaluminum',
    chinese: '三乙基铝',
    category: '金属有机试剂',
    description: '乙基化试剂',
    cas: '97-93-8',
    formula: 'C6H15Al',
    mw: 114.17
  },
  {
    abbr: 'DIBAL-H',
    full: 'Diisobutylaluminum hydride',
    chinese: '二异丁基氢化铝',
    category: '还原剂',
    description: '温和还原剂',
    cas: '1191-15-7',
    formula: 'C8H19Al',
    mw: 142.22
  },

  // ========== 离子液体 ==========
  {
    abbr: 'BMIM',
    full: '1-Butyl-3-methylimidazolium',
    chinese: '1-丁基-3-甲基咪唑',
    category: '离子液体',
    description: '咪唑类离子液体阳离子'
  },
  {
    abbr: 'EMIM',
    full: '1-Ethyl-3-methylimidazolium',
    chinese: '1-乙基-3-甲基咪唑',
    category: '离子液体',
    description: '咪唑类离子液体阳离子'
  },
  {
    abbr: 'BMPy',
    full: '1-Butyl-1-methylpyrrolidinium',
    chinese: '1-丁基-1-甲基吡咯烷',
    category: '离子液体',
    description: '吡咯烷类离子液体阳离子'
  },
  {
    abbr: 'BF4',
    full: 'Tetrafluoroborate',
    chinese: '四氟硼酸根',
    category: '离子液体',
    description: '离子液体阴离子',
    formula: 'BF4⁻',
    mw: 86.80
  },
  {
    abbr: 'PF6',
    full: 'Hexafluorophosphate',
    chinese: '六氟磷酸根',
    category: '离子液体',
    description: '离子液体阴离子',
    formula: 'PF6⁻',
    mw: 144.96
  },
  {
    abbr: 'Tf2N',
    full: 'Bis(trifluoromethylsulfonyl)imide',
    chinese: '双三氟甲基磺酰亚胺',
    category: '离子液体',
    description: '离子液体阴离子',
    formula: 'C2F6NO4S2⁻',
    mw: 280.14
  },

  // ========== 生物相关试剂 ==========
  {
    abbr: 'BSA',
    full: 'Bovine serum albumin',
    chinese: '牛血清白蛋白',
    category: '生物试剂',
    description: '蛋白质标准品'
  },
  {
    abbr: 'FBS',
    full: 'Fetal bovine serum',
    chinese: '胎牛血清',
    category: '生物试剂',
    description: '细胞培养添加剂'
  },
  {
    abbr: 'DMEM',
    full: 'Dulbecco\'s Modified Eagle Medium',
    chinese: 'Dulbecco改良Eagle培养基',
    category: '生物试剂',
    description: '细胞培养基'
  },
  {
    abbr: 'MTT',
    full: '3-(4,5-Dimethylthiazol-2-yl)-2,5-diphenyltetrazolium bromide',
    chinese: '噻唑蓝',
    category: '生物试剂',
    description: '细胞活性检测'
  },
  {
    abbr: 'CCK-8',
    full: 'Cell Counting Kit-8',
    chinese: '细胞增殖/毒性检测试剂盒',
    category: '生物试剂',
    description: '细胞活性检测'
  },
  {
    abbr: 'DAPI',
    full: '4\',6-Diamidino-2-phenylindole',
    chinese: '4,6-二脒基-2-苯基吲哚',
    category: '生物试剂',
    description: '核染色剂'
  },
  {
    abbr: 'PI',
    full: 'Propidium iodide',
    chinese: '碘化丙啶',
    category: '生物试剂',
    description: '核染色剂'
  },
  {
    abbr: 'FITC',
    full: 'Fluorescein isothiocyanate',
    chinese: '异硫氰酸荧光素',
    category: '生物试剂',
    description: '荧光标记剂'
  },

  // ========== 钙钛矿材料 ==========
  {
    abbr: 'MAPbI3',
    full: 'Methylammonium lead iodide',
    chinese: '碘化甲胺铅',
    category: '钙钛矿材料',
    description: '有机-无机杂化钙钛矿',
    formula: 'CH3NH3PbI3'
  },
  {
    abbr: 'FAPbI3',
    full: 'Formamidinium lead iodide',
    chinese: '碘化甲脒铅',
    category: '钙钛矿材料',
    description: '有机-无机杂化钙钛矿',
    formula: 'HC(NH2)2PbI3'
  },
  {
    abbr: 'CsPbBr3',
    full: 'Cesium lead bromide',
    chinese: '溴化铯铅',
    category: '钙钛矿材料',
    description: '全无机钙钛矿量子点',
    formula: 'CsPbBr3'
  },
  {
    abbr: 'MA',
    full: 'Methylammonium',
    chinese: '甲胺',
    category: '钙钛矿前驱体',
    description: '钙钛矿A位阳离子',
    formula: 'CH3NH3⁺'
  },
  {
    abbr: 'FA',
    full: 'Formamidinium',
    chinese: '甲脒',
    category: '钙钛矿前驱体',
    description: '钙钛矿A位阳离子',
    formula: 'HC(NH2)2⁺'
  },

  // ========== 干燥剂和脱水剂 ==========
  {
    abbr: 'P2O5',
    full: 'Phosphorus pentoxide',
    chinese: '五氧化二磷',
    category: '干燥剂',
    description: '强力干燥剂',
    cas: '1314-56-3',
    formula: 'P2O5',
    mw: 141.94
  },
  {
    abbr: 'BaO',
    full: 'Barium oxide',
    chinese: '氧化钡',
    category: '干燥剂',
    description: '碱性干燥剂',
    cas: '1304-28-5',
    formula: 'BaO',
    mw: 153.33
  },
  {
    abbr: 'Molecular Sieves',
    full: 'Molecular sieves',
    chinese: '分子筛',
    category: '干燥剂',
    description: '常用3Å、4Å、5Å分子筛'
  },
  {
    abbr: 'Drierite',
    full: 'Calcium sulfate',
    chinese: '硫酸钙',
    category: '干燥剂',
    description: '中性干燥剂',
    cas: '7778-18-9',
    formula: 'CaSO4',
    mw: 136.14
  },

  // ========== 气体 ==========
  {
    abbr: 'N2',
    full: 'Nitrogen',
    chinese: '氮气',
    category: '气体',
    description: '惰性气体',
    formula: 'N2',
    mw: 28.01
  },
  {
    abbr: 'Ar',
    full: 'Argon',
    chinese: '氩气',
    category: '气体',
    description: '惰性气体',
    formula: 'Ar',
    mw: 39.95
  },
  {
    abbr: 'O2',
    full: 'Oxygen',
    chinese: '氧气',
    category: '气体',
    description: '助燃气体',
    formula: 'O2',
    mw: 32.00
  },
  {
    abbr: 'CO2',
    full: 'Carbon dioxide',
    chinese: '二氧化碳',
    category: '气体',
    description: '温室气体',
    formula: 'CO2',
    mw: 44.01
  },
  {
    abbr: 'CO',
    full: 'Carbon monoxide',
    chinese: '一氧化碳',
    category: '气体',
    description: '有毒气体',
    formula: 'CO',
    mw: 28.01
  },
  {
    abbr: 'H2',
    full: 'Hydrogen',
    chinese: '氢气',
    category: '气体',
    description: '易燃气体',
    formula: 'H2',
    mw: 2.02
  },

  // ========== 更多无机化合物 ==========
  {
    abbr: 'Na2S',
    full: 'Sodium sulfide',
    chinese: '硫化钠',
    category: '无机盐',
    description: '硫化物',
    cas: '1313-82-2',
    formula: 'Na2S',
    mw: 78.04
  },
  {
    abbr: 'KI',
    full: 'Potassium iodide',
    chinese: '碘化钾',
    category: '无机盐',
    description: '碘盐',
    cas: '7681-11-0',
    formula: 'KI',
    mw: 166.00
  },
  {
    abbr: 'NaI',
    full: 'Sodium iodide',
    chinese: '碘化钠',
    category: '无机盐',
    description: '碘盐',
    cas: '7681-82-5',
    formula: 'NaI',
    mw: 149.89
  },
  {
    abbr: 'KBr',
    full: 'Potassium bromide',
    chinese: '溴化钾',
    category: '无机盐',
    description: '溴盐',
    cas: '7758-02-3',
    formula: 'KBr',
    mw: 119.00
  },
  {
    abbr: 'NaBr',
    full: 'Sodium bromide',
    chinese: '溴化钠',
    category: '无机盐',
    description: '溴盐',
    cas: '7647-15-6',
    formula: 'NaBr',
    mw: 102.89
  },
  {
    abbr: 'Na3PO4',
    full: 'Sodium phosphate',
    chinese: '磷酸钠',
    category: '无机盐',
    description: '磷酸盐',
    cas: '7601-54-9',
    formula: 'Na3PO4',
    mw: 163.94
  },
  {
    abbr: 'K3PO4',
    full: 'Potassium phosphate',
    chinese: '磷酸钾',
    category: '无机盐',
    description: '磷酸盐',
    cas: '7778-53-2',
    formula: 'K3PO4',
    mw: 212.27
  },
  {
    abbr: 'NH4OAc',
    full: 'Ammonium acetate',
    chinese: '乙酸铵',
    category: '无机盐',
    description: '缓冲剂',
    cas: '631-61-8',
    formula: 'CH3COONH4',
    mw: 77.08
  },
  {
    abbr: 'NaNO3',
    full: 'Sodium nitrate',
    chinese: '硝酸钠',
    category: '无机盐',
    description: '硝酸盐',
    cas: '7631-99-4',
    formula: 'NaNO3',
    mw: 84.99
  },
  {
    abbr: 'KNO3',
    full: 'Potassium nitrate',
    chinese: '硝酸钾',
    category: '无机盐',
    description: '硝酸盐',
    cas: '7757-79-1',
    formula: 'KNO3',
    mw: 101.10
  },
  {
    abbr: 'CuO',
    full: 'Copper(II) oxide',
    chinese: '氧化铜',
    category: '无机化合物',
    description: '铜氧化物',
    cas: '1317-38-0',
    formula: 'CuO',
    mw: 79.55
  },
  {
    abbr: 'Fe2O3',
    full: 'Iron(III) oxide',
    chinese: '三氧化二铁',
    category: '无机化合物',
    description: '铁红',
    cas: '1309-37-1',
    formula: 'Fe2O3',
    mw: 159.69
  },
  {
    abbr: 'Fe3O4',
    full: 'Iron(II,III) oxide',
    chinese: '四氧化三铁',
    category: '无机化合物',
    description: '磁性氧化铁',
    cas: '1317-61-9',
    formula: 'Fe3O4',
    mw: 231.53
  },
  {
    abbr: 'MnO2',
    full: 'Manganese dioxide',
    chinese: '二氧化锰',
    category: '氧化剂',
    description: '氧化剂、催化剂',
    cas: '1313-13-9',
    formula: 'MnO2',
    mw: 86.94
  },
  {
    abbr: 'SnO2',
    full: 'Tin dioxide',
    chinese: '二氧化锡',
    category: '无机化合物',
    description: '半导体材料',
    cas: '18282-10-5',
    formula: 'SnO2',
    mw: 150.71
  },
  {
    abbr: 'WO3',
    full: 'Tungsten trioxide',
    chinese: '三氧化钨',
    category: '无机化合物',
    description: '催化剂、电致变色材料',
    cas: '1314-35-8',
    formula: 'WO3',
    mw: 231.84
  },

  // ========== 有机合成试剂和催化剂（新增）==========
  {
    abbr: 'TMSCl',
    full: 'Chlorotrimethylsilane',
    chinese: '氯三甲基硅烷',
    category: '有机试剂',
    description: '硅保护试剂',
    cas: '75-77-4',
    formula: 'C3H9ClSi',
    mw: 108.64
  },
  {
    abbr: 'TBDMSCl',
    full: 'tert-Butyldimethylsilyl chloride',
    chinese: '叔丁基二甲基硅基氯',
    category: '有机试剂',
    description: 'TBS保护试剂',
    cas: '18162-48-6',
    formula: 'C6H15ClSi',
    mw: 150.72
  },
  {
    abbr: 'TIPSCl',
    full: 'Triisopropylsilyl chloride',
    chinese: '三异丙基硅基氯',
    category: '有机试剂',
    description: 'TIPS保护试剂',
    cas: '13154-24-0',
    formula: 'C9H21ClSi',
    mw: 192.80
  },
  {
    abbr: 'TBDPS-Cl',
    full: 'tert-Butyldiphenylsilyl chloride',
    chinese: '叔丁基二苯基硅基氯',
    category: '有机试剂',
    description: '大位阻硅保护试剂',
    cas: '58479-61-1',
    formula: 'C16H19ClSi',
    mw: 274.86
  },
  {
    abbr: 'TBHP',
    full: 'tert-Butyl hydroperoxide',
    chinese: '过氧化叔丁基',
    category: '氧化剂',
    description: '有机过氧化物氧化剂',
    cas: '75-91-2',
    formula: 'C4H10O2',
    mw: 90.12
  },
  {
    abbr: 'MCPBA',
    full: 'meta-Chloroperbenzoic acid',
    chinese: '间氯过氧苯甲酸',
    category: '氧化剂',
    description: '环氧化试剂',
    cas: '937-14-4',
    formula: 'C7H5ClO3',
    mw: 172.57
  },
  {
    abbr: 'Oxone',
    full: 'Potassium peroxymonosulfate',
    chinese: '过一硫酸氢钾',
    category: '氧化剂',
    description: '强氧化剂',
    cas: '70693-62-8',
    formula: 'K5O18S4',
    mw: 614.76
  },
  {
    abbr: 'NMO',
    full: 'N-Methylmorpholine N-oxide',
    chinese: 'N-甲基吗啉氮氧化物',
    category: '氧化剂',
    description: 'Upjohn双羟化共氧化剂',
    cas: '7529-22-8',
    formula: 'C5H11NO2',
    mw: 117.15
  },
  {
    abbr: 'TEMPO',
    full: '(2,2,6,6-Tetramethylpiperidin-1-yl)oxyl',
    chinese: '四甲基哌啶氮氧自由基',
    category: '氧化剂',
    description: '自由基催化氧化',
    cas: '2564-83-2',
    formula: 'C9H18NO',
    mw: 156.25
  },
  {
    abbr: 'PIDA',
    full: 'Phenyliodine diacetate',
    chinese: '二乙酰氧碘苯',
    category: '氧化剂',
    description: '高价碘氧化剂',
    cas: '3240-34-4',
    formula: 'C10H11IO4',
    mw: 322.09
  },
  {
    abbr: 'PIFA',
    full: 'Bis(trifluoroacetoxy)iodobenzene',
    chinese: '双三氟乙酰氧碘苯',
    category: '氧化剂',
    description: '高价碘氧化剂',
    cas: '2712-78-9',
    formula: 'C10H5F6IO4',
    mw: 434.04
  },
  {
    abbr: 'BH3·THF',
    full: 'Borane-tetrahydrofuran complex',
    chinese: '硼烷-四氢呋喃络合物',
    category: '还原剂',
    description: '温和还原剂',
    cas: '14044-65-6',
    formula: 'C4H11BO',
    mw: 85.94
  },
  {
    abbr: 'BH3·SMe2',
    full: 'Borane-dimethyl sulfide complex',
    chinese: '硼烷-二甲硫醚络合物',
    category: '还原剂',
    description: '温和还原剂',
    cas: '13292-87-0',
    formula: 'C2H9BS',
    mw: 75.97
  },
  {
    abbr: 'Red-Al',
    full: 'Sodium bis(2-methoxyethoxy)aluminum hydride',
    chinese: '双(2-甲氧基乙氧基)氢化铝钠',
    category: '还原剂',
    description: '温和还原剂',
    cas: '22722-98-1',
    formula: 'C6H16AlNaO4',
    mw: 202.16
  },
  {
    abbr: 'LDA',
    full: 'Lithium diisopropylamide',
    chinese: '二异丙基氨基锂',
    category: '有机碱',
    description: '强碱、非亲核碱',
    cas: '4111-54-0',
    formula: 'C6H14LiN',
    mw: 107.13
  },
  {
    abbr: 'LiHMDS',
    full: 'Lithium bis(trimethylsilyl)amide',
    chinese: '双三甲基硅基氨基锂',
    category: '有机碱',
    description: '强碱、非亲核碱',
    cas: '4039-32-1',
    formula: 'C6H18LiNSi2',
    mw: 167.32
  },
  {
    abbr: 'NaHMDS',
    full: 'Sodium bis(trimethylsilyl)amide',
    chinese: '双三甲基硅基氨基钠',
    category: '有机碱',
    description: '强碱、非亲核碱',
    cas: '1070-89-9',
    formula: 'C6H18NNaSi2',
    mw: 183.37
  },
  {
    abbr: 'KHMDS',
    full: 'Potassium bis(trimethylsilyl)amide',
    chinese: '双三甲基硅基氨基钾',
    category: '有机碱',
    description: '强碱、非亲核碱',
    cas: '40949-94-8',
    formula: 'C6H18KNSi2',
    mw: 199.48
  },
  {
    abbr: 'LTMP',
    full: 'Lithium tetramethylpiperidide',
    chinese: '四甲基哌啶锂',
    category: '有机碱',
    description: '强非亲核碱',
    cas: '38227-87-1',
    formula: 'C9H18LiN',
    mw: 147.19
  },
  {
    abbr: 'DBN',
    full: '1,5-Diazabicyclo[4.3.0]non-5-ene',
    chinese: '1,5-二氮杂双环[4.3.0]壬-5-烯',
    category: '有机碱',
    description: '有机强碱',
    cas: '3001-72-7',
    formula: 'C7H12N2',
    mw: 124.18
  },
  {
    abbr: 'DABCO',
    full: '1,4-Diazabicyclo[2.2.2]octane',
    chinese: '1,4-二氮杂双环[2.2.2]辛烷',
    category: '有机碱',
    description: '有机碱、催化剂',
    cas: '280-57-9',
    formula: 'C6H12N2',
    mw: 112.17
  },
  {
    abbr: 'Et3N',
    full: 'Triethylamine',
    chinese: '三乙胺',
    category: '有机碱',
    description: '常用有机碱',
    cas: '121-44-8',
    formula: 'C6H15N',
    mw: 101.19
  },
  {
    abbr: 'i-Pr2NEt',
    full: 'N,N-Diisopropylethylamine',
    chinese: 'N,N-二异丙基乙胺',
    category: '有机碱',
    description: 'Hünig碱',
    cas: '7087-68-5',
    formula: 'C8H19N',
    mw: 129.24
  },
  {
    abbr: 'PyBOP',
    full: 'Benzotriazol-1-yl-oxytripyrrolidinophosphonium hexafluorophosphate',
    chinese: '六氟磷酸苯并三氮唑-1-基-氧基三吡咯烷基鏻',
    category: '有机试剂',
    description: '肽偶联试剂',
    cas: '128625-52-5',
    formula: 'C18H28F6N5OP2',
    mw: 520.39
  },
  {
    abbr: 'HBTU',
    full: 'O-Benzotriazole-N,N,N\',N\'-tetramethyl-uronium-hexafluoro-phosphate',
    chinese: '六氟磷酸四甲基脲鎓苯并三氮唑',
    category: '有机试剂',
    description: '肽偶联试剂',
    cas: '94790-37-1',
    formula: 'C11H16F6N5OP',
    mw: 379.24
  },
  {
    abbr: 'TBTU',
    full: 'O-(Benzotriazol-1-yl)-N,N,N\',N\'-tetramethyluronium tetrafluoroborate',
    chinese: '四氟硼酸四甲基脲鎓苯并三氮唑',
    category: '有机试剂',
    description: '肽偶联试剂',
    cas: '125700-67-6',
    formula: 'C11H16BF4N5O',
    mw: 321.08
  },
  {
    abbr: 'COMU',
    full: '(1-Cyano-2-ethoxy-2-oxoethylidenaminooxy)dimethylamino-morpholino-carbenium hexafluorophosphate',
    chinese: '六氟磷酸碳二亚胺脲鎓盐',
    category: '有机试剂',
    description: '新型肽偶联试剂',
    cas: '1075198-30-9',
    formula: 'C13H21F6N4O4P',
    mw: 438.29
  },
  {
    abbr: 'TCEP',
    full: 'Tris(2-carboxyethyl)phosphine',
    chinese: '三(2-羧乙基)膦',
    category: '还原剂',
    description: '二硫键还原剂',
    cas: '51805-45-9',
    formula: 'C9H15O6P',
    mw: 250.18
  },
  {
    abbr: 'DTT',
    full: 'Dithiothreitol',
    chinese: '二硫苏糖醇',
    category: '还原剂',
    description: '二硫键还原剂',
    cas: '3483-12-3',
    formula: 'C4H10O2S2',
    mw: 154.25
  },
  {
    abbr: 'MMPP',
    full: 'Magnesium monoperoxyphthalate',
    chinese: '单过氧邻苯二甲酸镁',
    category: '氧化剂',
    description: '环氧化试剂',
    cas: '84665-66-7',
    formula: 'C16H14MgO10',
    mw: 398.59
  },
  {
    abbr: 'Burgess Reagent',
    full: 'Methyl N-(triethylammoniumsulfonyl)carbamate',
    chinese: 'Burgess试剂',
    category: '有机试剂',
    description: '脱水试剂',
    cas: '29684-56-8',
    formula: 'C8H18N2O4S',
    mw: 238.30
  },
  {
    abbr: 'Martin Sulfurane',
    full: 'Bis[α,α-bis(trifluoromethyl)benzenemethanolato]diphenylsulfur',
    chinese: 'Martin硫烷',
    category: '有机试剂',
    description: '脱水脱氧试剂',
    cas: '39796-98-0',
    formula: 'C34H16F12O2S',
    mw: 732.53
  },
  {
    abbr: 'Lawesson\'s Reagent',
    full: '2,4-Bis(4-methoxyphenyl)-1,3,2,4-dithiadiphosphetane 2,4-disulfide',
    chinese: 'Lawesson试剂',
    category: '有机试剂',
    description: '硫化试剂',
    cas: '19172-47-5',
    formula: 'C14H14O2P2S4',
    mw: 404.46
  },
  {
    abbr: 'Tf2O',
    full: 'Trifluoromethanesulfonic anhydride',
    chinese: '三氟甲磺酸酐',
    category: '有机试剂',
    description: '三氟甲磺酰化试剂',
    cas: '358-23-6',
    formula: 'C2F6O5S2',
    mw: 282.13
  },
  {
    abbr: 'TfOH',
    full: 'Trifluoromethanesulfonic acid',
    chinese: '三氟甲磺酸',
    category: '酸碱试剂',
    description: '超强酸',
    cas: '1493-13-6',
    formula: 'CF3SO3H',
    mw: 150.08
  },
  {
    abbr: 'MsOH',
    full: 'Methanesulfonic acid',
    chinese: '甲磺酸',
    category: '酸碱试剂',
    description: '强有机酸',
    cas: '75-75-2',
    formula: 'CH4O3S',
    mw: 96.11
  },
  {
    abbr: 'TsOH',
    full: 'p-Toluenesulfonic acid',
    chinese: '对甲苯磺酸',
    category: '酸碱试剂',
    description: '有机强酸催化剂',
    cas: '104-15-4',
    formula: 'C7H8O3S',
    mw: 172.20
  },
  {
    abbr: 'CSA',
    full: 'Camphorsulfonic acid',
    chinese: '樟脑磺酸',
    category: '酸碱试剂',
    description: '手性有机酸',
    cas: '3144-16-9',
    formula: 'C10H16O4S',
    mw: 232.30
  },
  {
    abbr: 'PPTS',
    full: 'Pyridinium p-toluenesulfonate',
    chinese: '对甲苯磺酸吡啶盐',
    category: '酸碱试剂',
    description: '温和酸催化剂',
    cas: '24057-28-1',
    formula: 'C12H13NO3S',
    mw: 251.30
  },
  {
    abbr: 'Selectfluor',
    full: '1-Chloromethyl-4-fluoro-1,4-diazoniabicyclo[2.2.2]octane bis(tetrafluoroborate)',
    chinese: 'Selectfluor氟化试剂',
    category: '有机试剂',
    description: '亲电氟化试剂',
    cas: '140681-55-6',
    formula: 'C7H14B2ClF9N2',
    mw: 354.25
  },
  {
    abbr: 'NFSI',
    full: 'N-Fluorobenzenesulfonimide',
    chinese: 'N-氟苯磺酰亚胺',
    category: '有机试剂',
    description: '氟化试剂',
    cas: '133745-75-2',
    formula: 'C12H10FNO4S2',
    mw: 315.34
  },
  {
    abbr: 'DAST',
    full: 'Diethylaminosulfur trifluoride',
    chinese: '二乙氨基三氟化硫',
    category: '有机试剂',
    description: '亲核氟化脱氧试剂',
    cas: '38078-09-0',
    formula: 'C4H10F3NS',
    mw: 161.19
  },
  {
    abbr: 'Deoxo-Fluor',
    full: 'Bis(2-methoxyethyl)aminosulfur trifluoride',
    chinese: '双(2-甲氧基乙基)氨基三氟化硫',
    category: '有机试剂',
    description: '氟化脱氧试剂',
    cas: '202289-38-1',
    formula: 'C6H14F3NO2S',
    mw: 221.24
  },
  {
    abbr: 'TMSCN',
    full: 'Trimethylsilyl cyanide',
    chinese: '三甲基硅基氰',
    category: '有机试剂',
    description: '氰化试剂',
    cas: '7677-24-9',
    formula: 'C4H9NSi',
    mw: 99.21
  },
  {
    abbr: 'TMSI',
    full: 'Trimethylsilyl iodide',
    chinese: '三甲基硅基碘',
    category: '有机试剂',
    description: '脱保护试剂',
    cas: '16029-98-4',
    formula: 'C3H9ISi',
    mw: 200.09
  },
  {
    abbr: 'TMEDA',
    full: 'N,N,N\',N\'-Tetramethylethylenediamine',
    chinese: 'N,N,N\',N\'-四甲基乙二胺',
    category: '有机试剂',
    description: '配体、络合剂',
    cas: '110-18-9',
    formula: 'C6H16N2',
    mw: 116.20
  },
  {
    abbr: 'HMPA',
    full: 'Hexamethylphosphoramide',
    chinese: '六甲基磷酰三胺',
    category: '有机溶剂',
    description: '极性溶剂、配体',
    cas: '680-31-9',
    formula: 'C6H18N3OP',
    mw: 179.20
  },
  {
    abbr: 'Hunig\'s Base',
    full: 'N,N-Diisopropylethylamine',
    chinese: 'Hünig碱',
    category: '有机碱',
    description: '非亲核碱',
    cas: '7087-68-5',
    formula: 'C8H19N',
    mw: 129.24
  },
  {
    abbr: 'Proton Sponge',
    full: '1,8-Bis(dimethylamino)naphthalene',
    chinese: '1,8-双(二甲氨基)萘',
    category: '有机碱',
    description: '强非亲核碱',
    cas: '20734-58-1',
    formula: 'C14H18N2',
    mw: 214.31
  },

  // ========== 现代分析技术和能源材料（新增）==========
  {
    abbr: 'MALDI',
    full: 'Matrix-assisted laser desorption/ionization',
    chinese: '基质辅助激光解吸电离',
    category: '表征技术',
    description: '软电离质谱技术'
  },
  {
    abbr: 'SERS',
    full: 'Surface-enhanced Raman spectroscopy',
    chinese: '表面增强拉曼光谱',
    category: '表征技术',
    description: '高灵敏拉曼技术'
  },
  {
    abbr: 'PXRD',
    full: 'Powder X-ray diffraction',
    chinese: '粉末X射线衍射',
    category: '表征技术',
    description: '晶体结构分析'
  },
  {
    abbr: 'EXAFS',
    full: 'Extended X-ray absorption fine structure',
    chinese: '扩展X射线吸收精细结构',
    category: '表征技术',
    description: '局域结构分析'
  },
  {
    abbr: 'XANES',
    full: 'X-ray absorption near edge structure',
    chinese: 'X射线吸收近边结构',
    category: '表征技术',
    description: '价态和配位环境分析'
  },
  {
    abbr: 'TOF-MS',
    full: 'Time-of-flight mass spectrometry',
    chinese: '飞行时间质谱',
    category: '表征技术',
    description: '高精度质量分析'
  },
  {
    abbr: 'FRET',
    full: 'Förster resonance energy transfer',
    chinese: '荧光共振能量转移',
    category: '表征技术',
    description: '分子间相互作用检测'
  },
  {
    abbr: 'CLSM',
    full: 'Confocal laser scanning microscopy',
    chinese: '激光共聚焦显微镜',
    category: '表征技术',
    description: '三维高分辨成像'
  },
  {
    abbr: 'Cryo-EM',
    full: 'Cryogenic electron microscopy',
    chinese: '冷冻电子显微镜',
    category: '表征技术',
    description: '生物大分子结构分析'
  },
  {
    abbr: 'NSOM',
    full: 'Near-field scanning optical microscopy',
    chinese: '近场扫描光学显微镜',
    category: '表征技术',
    description: '超分辨光学成像'
  },
  {
    abbr: 'PLE',
    full: 'Photoluminescence excitation',
    chinese: '光致发光激发谱',
    category: '表征技术',
    description: '发光材料表征'
  },
  {
    abbr: 'CW-EPR',
    full: 'Continuous-wave electron paramagnetic resonance',
    chinese: '连续波电子顺磁共振',
    category: '表征技术',
    description: '自由基检测'
  },
  {
    abbr: 'SECM',
    full: 'Scanning electrochemical microscopy',
    chinese: '扫描电化学显微镜',
    category: '电化学技术',
    description: '电化学表面成像'
  },
  {
    abbr: 'RRDE',
    full: 'Rotating ring-disk electrode',
    chinese: '旋转环盘电极',
    category: '电化学技术',
    description: '电催化产物检测'
  },
  {
    abbr: 'DEMS',
    full: 'Differential electrochemical mass spectrometry',
    chinese: '差分电化学质谱',
    category: '电化学技术',
    description: '电化学产物在线检测'
  },
  {
    abbr: 'OEMS',
    full: 'Online electrochemical mass spectrometry',
    chinese: '在线电化学质谱',
    category: '电化学技术',
    description: '电化学反应实时监测'
  },
  {
    abbr: 'SWV',
    full: 'Square wave voltammetry',
    chinese: '方波伏安法',
    category: '电化学技术',
    description: '高灵敏电化学分析'
  },
  {
    abbr: 'DPV',
    full: 'Differential pulse voltammetry',
    chinese: '差分脉冲伏安法',
    category: '电化学技术',
    description: '痕量电化学检测'
  },
  {
    abbr: 'NPV',
    full: 'Normal pulse voltammetry',
    chinese: '常规脉冲伏安法',
    category: '电化学技术',
    description: '电化学分析方法'
  },
  {
    abbr: 'ECSA',
    full: 'Electrochemical surface area',
    chinese: '电化学活性表面积',
    category: '性能指标',
    description: '电催化剂活性面积'
  },
  {
    abbr: 'LiFePO4',
    full: 'Lithium iron phosphate',
    chinese: '磷酸铁锂',
    category: '材料',
    description: '锂电池正极材料',
    formula: 'LiFePO4'
  },
  {
    abbr: 'LiCoO2',
    full: 'Lithium cobalt oxide',
    chinese: '钴酸锂',
    category: '材料',
    description: '锂电池正极材料',
    formula: 'LiCoO2'
  },
  {
    abbr: 'LMO',
    full: 'Lithium manganese oxide',
    chinese: '锰酸锂',
    category: '材料',
    description: '锂电池正极材料',
    formula: 'LiMn2O4'
  },
  {
    abbr: 'NMC',
    full: 'Nickel manganese cobalt oxide',
    chinese: '镍钴锰酸锂',
    category: '材料',
    description: '三元锂电池正极材料',
    formula: 'Li(NixMnyCoz)O2'
  },
  {
    abbr: 'NCA',
    full: 'Nickel cobalt aluminum oxide',
    chinese: '镍钴铝酸锂',
    category: '材料',
    description: '锂电池正极材料',
    formula: 'LiNi0.8Co0.15Al0.05O2'
  },
  {
    abbr: 'LTO',
    full: 'Lithium titanate',
    chinese: '钛酸锂',
    category: '材料',
    description: '锂电池负极材料',
    formula: 'Li4Ti5O12'
  },
  {
    abbr: 'LLZ',
    full: 'Lithium lanthanum zirconium oxide',
    chinese: '氧化锆镧锂',
    category: '材料',
    description: '固态电解质',
    formula: 'Li7La3Zr2O12'
  },
  {
    abbr: 'LAGP',
    full: 'Lithium aluminum germanium phosphate',
    chinese: '磷酸铝锗锂',
    category: '材料',
    description: '固态电解质',
    formula: 'Li1.5Al0.5Ge1.5(PO4)3'
  },
  {
    abbr: 'PEO',
    full: 'Polyethylene oxide',
    chinese: '聚氧化乙烯',
    category: '聚合物',
    description: '固态聚合物电解质',
    formula: '(CH2CH2O)n'
  },
  {
    abbr: 'PVDF',
    full: 'Polyvinylidene fluoride',
    chinese: '聚偏氟乙烯',
    category: '聚合物',
    description: '锂电池粘结剂',
    cas: '24937-79-9',
    formula: '(C2H2F2)n'
  },
  {
    abbr: 'CMC',
    full: 'Carboxymethyl cellulose',
    chinese: '羧甲基纤维素',
    category: '聚合物',
    description: '水性粘结剂',
    cas: '9000-11-7',
    formula: '(C6H7O2(OH)2OCH2COONa)n'
  },
  {
    abbr: 'PAA',
    full: 'Polyacrylic acid',
    chinese: '聚丙烯酸',
    category: '聚合物',
    description: '锂电池粘结剂',
    cas: '9003-01-4',
    formula: '(C3H4O2)n'
  },
  {
    abbr: 'LiTFSI',
    full: 'Lithium bis(trifluoromethanesulfonyl)imide',
    chinese: '双三氟甲磺酰亚胺锂',
    category: '电解质盐',
    description: '锂电池电解质盐',
    cas: '90076-65-6',
    formula: 'LiC2F6NO4S2',
    mw: 287.09
  },
  {
    abbr: 'LiPF6',
    full: 'Lithium hexafluorophosphate',
    chinese: '六氟磷酸锂',
    category: '电解质盐',
    description: '锂电池电解质盐',
    cas: '21324-40-3',
    formula: 'LiPF6',
    mw: 151.91
  },
  {
    abbr: 'LiBF4',
    full: 'Lithium tetrafluoroborate',
    chinese: '四氟硼酸锂',
    category: '电解质盐',
    description: '锂电池电解质盐',
    cas: '14283-07-9',
    formula: 'LiBF4',
    mw: 93.75
  },
  {
    abbr: 'LiClO4',
    full: 'Lithium perchlorate',
    chinese: '高氯酸锂',
    category: '电解质盐',
    description: '锂电池电解质盐',
    cas: '7791-03-9',
    formula: 'LiClO4',
    mw: 106.39
  },
  {
    abbr: 'DMC',
    full: 'Dimethyl carbonate',
    chinese: '碳酸二甲酯',
    category: '有机溶剂',
    description: '锂电池电解液溶剂',
    cas: '616-38-6',
    formula: 'C3H6O3',
    mw: 90.08
  },
  {
    abbr: 'DEC',
    full: 'Diethyl carbonate',
    chinese: '碳酸二乙酯',
    category: '有机溶剂',
    description: '锂电池电解液溶剂',
    cas: '105-58-8',
    formula: 'C5H10O3',
    mw: 118.13
  },
  {
    abbr: 'EMC',
    full: 'Ethyl methyl carbonate',
    chinese: '碳酸甲乙酯',
    category: '有机溶剂',
    description: '锂电池电解液溶剂',
    cas: '623-53-0',
    formula: 'C4H8O3',
    mw: 104.10
  },
  {
    abbr: 'VC',
    full: 'Vinylene carbonate',
    chinese: '碳酸亚乙烯酯',
    category: '有机溶剂',
    description: '电解液添加剂',
    cas: '872-36-6',
    formula: 'C3H2O3',
    mw: 86.05
  },
  {
    abbr: 'FEC',
    full: 'Fluoroethylene carbonate',
    chinese: '氟代碳酸乙烯酯',
    category: '有机溶剂',
    description: '电解液添加剂',
    cas: '114435-02-8',
    formula: 'C3H3FO3',
    mw: 106.05
  },
  {
    abbr: 'LiNO3',
    full: 'Lithium nitrate',
    chinese: '硝酸锂',
    category: '电解质盐',
    description: '锂硫电池电解液添加剂',
    cas: '7790-69-4',
    formula: 'LiNO3',
    mw: 68.95
  },
  {
    abbr: 'LiPS5Cl',
    full: 'Lithium phosphorus sulfide chloride',
    chinese: '氯硫化磷锂',
    category: '材料',
    description: '固态电解质',
    formula: 'Li6PS5Cl'
  },
  {
    abbr: 'LLZO',
    full: 'Lithium lanthanum zirconium oxide',
    chinese: '氧化锆镧锂（石榴石型）',
    category: '材料',
    description: '固态电解质',
    formula: 'Li7La3Zr2O12'
  },
  {
    abbr: 'LIPON',
    full: 'Lithium phosphorus oxynitride',
    chinese: '磷酸氧氮化锂',
    category: '材料',
    description: '薄膜固态电解质',
    formula: 'LixPOyNz'
  },
  {
    abbr: 'LPS',
    full: 'Lithium phosphorus sulfide',
    chinese: '硫化磷锂',
    category: '材料',
    description: '固态电解质',
    formula: 'Li3PS4'
  },
  {
    abbr: 'LSCF',
    full: 'Lanthanum strontium cobalt ferrite',
    chinese: '镧锶钴铁氧化物',
    category: '材料',
    description: '固体氧化物燃料电池阴极',
    formula: 'La0.6Sr0.4Co0.2Fe0.8O3'
  },
  {
    abbr: 'YSZ',
    full: 'Yttria-stabilized zirconia',
    chinese: '钇稳定氧化锆',
    category: '材料',
    description: '固体氧化物燃料电池电解质',
    formula: '(ZrO2)1-x(Y2O3)x'
  },
  {
    abbr: 'BSCF',
    full: 'Barium strontium cobalt ferrite',
    chinese: '钡锶钴铁氧化物',
    category: '材料',
    description: '固体氧化物燃料电池阴极',
    formula: 'Ba0.5Sr0.5Co0.8Fe0.2O3'
  },

  // ========== 半导体、光电材料和生物试剂（新增）==========
  {
    abbr: 'GaN',
    full: 'Gallium nitride',
    chinese: '氮化镓',
    category: '半导体材料',
    description: '宽禁带半导体',
    cas: '25617-97-4',
    formula: 'GaN',
    mw: 83.73
  },
  {
    abbr: 'SiC',
    full: 'Silicon carbide',
    chinese: '碳化硅',
    category: '半导体材料',
    description: '宽禁带半导体',
    cas: '409-21-2',
    formula: 'SiC',
    mw: 40.10
  },
  {
    abbr: 'InP',
    full: 'Indium phosphide',
    chinese: '磷化铟',
    category: '半导体材料',
    description: 'III-V族半导体',
    cas: '22398-80-7',
    formula: 'InP',
    mw: 145.79
  },
  {
    abbr: 'GaAs',
    full: 'Gallium arsenide',
    chinese: '砷化镓',
    category: '半导体材料',
    description: 'III-V族半导体',
    cas: '1303-00-0',
    formula: 'GaAs',
    mw: 144.64
  },
  {
    abbr: 'CdS',
    full: 'Cadmium sulfide',
    chinese: '硫化镉',
    category: '半导体材料',
    description: 'II-VI族半导体量子点',
    cas: '1306-23-6',
    formula: 'CdS',
    mw: 144.48
  },
  {
    abbr: 'CdSe',
    full: 'Cadmium selenide',
    chinese: '硒化镉',
    category: '半导体材料',
    description: 'II-VI族半导体量子点',
    cas: '1306-24-7',
    formula: 'CdSe',
    mw: 191.37
  },
  {
    abbr: 'CdTe',
    full: 'Cadmium telluride',
    chinese: '碲化镉',
    category: '半导体材料',
    description: 'II-VI族半导体量子点',
    cas: '1306-25-8',
    formula: 'CdTe',
    mw: 240.01
  },
  {
    abbr: 'PbS',
    full: 'Lead sulfide',
    chinese: '硫化铅',
    category: '半导体材料',
    description: 'IV-VI族半导体量子点',
    cas: '1314-87-0',
    formula: 'PbS',
    mw: 239.27
  },
  {
    abbr: 'InGaN',
    full: 'Indium gallium nitride',
    chinese: '氮化铟镓',
    category: '半导体材料',
    description: 'LED发光材料',
    formula: 'InxGa1-xN'
  },
  {
    abbr: 'CIGS',
    full: 'Copper indium gallium selenide',
    chinese: '铜铟镓硒',
    category: '材料',
    description: '薄膜太阳能电池',
    formula: 'CuInxGa1-xSe2'
  },
  {
    abbr: 'CZTS',
    full: 'Copper zinc tin sulfide',
    chinese: '铜锌锡硫',
    category: '材料',
    description: '薄膜太阳能电池',
    formula: 'Cu2ZnSnS4'
  },
  {
    abbr: 'Spiro-OMeTAD',
    full: '2,2\',7,7\'-Tetrakis[N,N-di(4-methoxyphenyl)amino]-9,9\'-spirobifluorene',
    chinese: 'Spiro-OMeTAD空穴传输材料',
    category: '有机材料',
    description: '钙钛矿太阳能电池HTL',
    cas: '207739-72-8',
    formula: 'C81H68N4O8',
    mw: 1225.43
  },
  {
    abbr: 'PCBM',
    full: 'Phenyl-C61-butyric acid methyl ester',
    chinese: '苯基-C61-丁酸甲酯',
    category: '有机材料',
    description: '有机太阳能电池受体',
    cas: '160848-22-6',
    formula: 'C72H14O2',
    mw: 910.88
  },
  {
    abbr: 'P3HT',
    full: 'Poly(3-hexylthiophene)',
    chinese: '聚3-己基噻吩',
    category: '聚合物',
    description: '有机太阳能电池给体',
    cas: '104934-50-1',
    formula: '(C10H14S)n'
  },
  {
    abbr: 'PTB7',
    full: 'Poly[[4,8-bis[(2-ethylhexyl)oxy]benzo[1,2-b:4,5-b\']dithiophene-2,6-diyl][3-fluoro-2-[(2-ethylhexyl)carbonyl]thieno[3,4-b]thiophenediyl]]',
    chinese: 'PTB7聚合物给体',
    category: '聚合物',
    description: '有机太阳能电池给体'
  },
  {
    abbr: 'PANI',
    full: 'Polyaniline',
    chinese: '聚苯胺',
    category: '导电聚合物',
    description: '导电聚合物',
    cas: '25233-30-1',
    formula: '(C6H4NH)n'
  },
  {
    abbr: 'PPy',
    full: 'Polypyrrole',
    chinese: '聚吡咯',
    category: '导电聚合物',
    description: '导电聚合物',
    cas: '30604-81-0',
    formula: '(C4H2NH)n'
  },
  {
    abbr: 'PSS',
    full: 'Poly(styrene sulfonate)',
    chinese: '聚苯乙烯磺酸',
    category: '聚合物',
    description: 'PEDOT:PSS组分',
    cas: '25704-18-1',
    formula: '(C8H7NaO3S)n'
  },
  {
    abbr: 'Alq3',
    full: 'Tris(8-hydroxyquinolinato)aluminum',
    chinese: '三(8-羟基喹啉)铝',
    category: '有机材料',
    description: 'OLED发光材料',
    cas: '2085-33-8',
    formula: 'C27H18AlN3O3',
    mw: 459.43
  },
  {
    abbr: 'TPD',
    full: 'N,N\'-Bis(3-methylphenyl)-N,N\'-diphenylbenzidine',
    chinese: 'N,N\'-双(3-甲基苯基)-N,N\'-二苯基联苯胺',
    category: '有机材料',
    description: 'OLED空穴传输材料',
    cas: '65181-78-4',
    formula: 'C38H32N2',
    mw: 516.67
  },
  {
    abbr: 'NPB',
    full: 'N,N\'-Di(1-naphthyl)-N,N\'-diphenyl-(1,1\'-biphenyl)-4,4\'-diamine',
    chinese: 'N,N\'-二(1-萘基)-N,N\'-二苯基联苯胺',
    category: '有机材料',
    description: 'OLED空穴传输材料',
    cas: '123847-85-8',
    formula: 'C44H32N2',
    mw: 588.74
  },
  {
    abbr: 'BCP',
    full: 'Bathocuproine',
    chinese: '2,9-二甲基-4,7-二苯基-1,10-菲咯啉',
    category: '有机材料',
    description: 'OLED电子传输材料',
    cas: '4733-39-5',
    formula: 'C26H20N2',
    mw: 360.45
  },
  {
    abbr: 'Ir(ppy)3',
    full: 'Tris(2-phenylpyridine)iridium',
    chinese: '三(2-苯基吡啶)铱',
    category: '有机材料',
    description: 'OLED磷光材料',
    cas: '94928-86-6',
    formula: 'C33H24IrN3',
    mw: 654.77
  },
  {
    abbr: 'TAZ',
    full: '3-(4-Biphenylyl)-4-phenyl-5-tert-butylphenyl-1,2,4-triazole',
    chinese: '3-(4-联苯基)-4-苯基-5-叔丁基苯基-1,2,4-三氮唑',
    category: '有机材料',
    description: 'OLED电子传输材料',
    cas: '196046-46-5',
    formula: 'C30H27N3',
    mw: 429.56
  },
  {
    abbr: 'TAPC',
    full: '1,1-Bis[(di-4-tolylamino)phenyl]cyclohexane',
    chinese: '1,1-双[(二-4-甲苯基氨基)苯基]环己烷',
    category: '有机材料',
    description: 'OLED空穴传输材料',
    cas: '217997-14-7',
    formula: 'C40H42N2',
    mw: 558.77
  },
  {
    abbr: 'TPBi',
    full: '2,2\',2"-(1,3,5-Benzinetriyl)-tris(1-phenyl-1-H-benzimidazole)',
    chinese: '2,2\',2"-(1,3,5-苯三基)-三(1-苯基-1-H-苯并咪唑)',
    category: '有机材料',
    description: 'OLED电子传输材料',
    cas: '147366-66-9',
    formula: 'C45H30N6',
    mw: 662.76
  },
  {
    abbr: 'TPBI',
    full: '1,3,5-Tris(1-phenyl-1H-benzimidazol-2-yl)benzene',
    chinese: '1,3,5-三(1-苯基-1H-苯并咪唑-2-基)苯',
    category: '有机材料',
    description: 'OLED电子传输材料',
    cas: '147366-66-9',
    formula: 'C45H30N6',
    mw: 662.76
  },
  {
    abbr: 'PPF',
    full: 'Poly(9,9-dioctylfluorene)',
    chinese: '聚(9,9-二辛基芴)',
    category: '聚合物',
    description: 'PLED发光材料',
    formula: '(C29H40)n'
  },
  {
    abbr: 'MEH-PPV',
    full: 'Poly[2-methoxy-5-(2-ethylhexyloxy)-1,4-phenylenevinylene]',
    chinese: '聚[2-甲氧基-5-(2-乙基己氧基)-1,4-苯撑乙烯]',
    category: '聚合物',
    description: 'PLED发光材料',
    formula: '(C17H24O2)n'
  },
  {
    abbr: 'SnO2',
    full: 'Tin dioxide',
    chinese: '二氧化锡',
    category: '无机材料',
    description: '电子传输层材料',
    cas: '18282-10-5',
    formula: 'SnO2',
    mw: 150.71
  },
  {
    abbr: 'NiOx',
    full: 'Nickel oxide',
    chinese: '氧化镍',
    category: '无机材料',
    description: '空穴传输层材料',
    cas: '1313-99-1',
    formula: 'NiO',
    mw: 74.69
  },
  {
    abbr: 'TEMED',
    full: 'N,N,N\',N\'-Tetramethylethylenediamine',
    chinese: 'N,N,N\',N\'-四甲基乙二胺',
    category: '生物试剂',
    description: 'SDS-PAGE催化剂',
    cas: '110-18-9',
    formula: 'C6H16N2',
    mw: 116.20
  },
  {
    abbr: 'APS',
    full: 'Ammonium persulfate',
    chinese: '过硫酸铵',
    category: '生物试剂',
    description: 'SDS-PAGE引发剂',
    cas: '7727-54-0',
    formula: '(NH4)2S2O8',
    mw: 228.20
  },
  {
    abbr: 'PMSF',
    full: 'Phenylmethylsulfonyl fluoride',
    chinese: '苯甲基磺酰氟',
    category: '生物试剂',
    description: '蛋白酶抑制剂',
    cas: '329-98-6',
    formula: 'C7H7FO2S',
    mw: 174.19
  },
  {
    abbr: 'IPTG',
    full: 'Isopropyl β-D-1-thiogalactopyranoside',
    chinese: '异丙基-β-D-硫代半乳糖苷',
    category: '生物试剂',
    description: '基因表达诱导剂',
    cas: '367-93-1',
    formula: 'C9H18O5S',
    mw: 238.30
  },
  {
    abbr: 'X-Gal',
    full: '5-Bromo-4-chloro-3-indolyl-β-D-galactopyranoside',
    chinese: '5-溴-4-氯-3-吲哚-β-D-半乳糖苷',
    category: '生物试剂',
    description: 'β-半乳糖苷酶底物',
    cas: '7240-90-6',
    formula: 'C14H15BrClNO6',
    mw: 408.63
  },
  {
    abbr: 'EDTA-Na2',
    full: 'Ethylenediaminetetraacetic acid disodium salt',
    chinese: 'EDTA二钠',
    category: '生物试剂',
    description: '金属离子螯合剂',
    cas: '6381-92-6',
    formula: 'C10H14N2Na2O8',
    mw: 336.21
  },
  {
    abbr: 'TAE',
    full: 'Tris-acetate-EDTA buffer',
    chinese: 'Tris-乙酸-EDTA缓冲液',
    category: '生物试剂',
    description: 'DNA电泳缓冲液'
  },
  {
    abbr: 'TBE',
    full: 'Tris-borate-EDTA buffer',
    chinese: 'Tris-硼酸-EDTA缓冲液',
    category: '生物试剂',
    description: 'DNA电泳缓冲液'
  },
  {
    abbr: 'TE',
    full: 'Tris-EDTA buffer',
    chinese: 'Tris-EDTA缓冲液',
    category: '生物试剂',
    description: 'DNA保存缓冲液'
  },
  {
    abbr: 'ATP',
    full: 'Adenosine triphosphate',
    chinese: '三磷酸腺苷',
    category: '生物试剂',
    description: '能量分子',
    cas: '56-65-5',
    formula: 'C10H16N5O13P3',
    mw: 507.18
  },
  {
    abbr: 'NAD+',
    full: 'Nicotinamide adenine dinucleotide',
    chinese: '烟酰胺腺嘌呤二核苷酸',
    category: '生物试剂',
    description: '辅酶',
    cas: '53-84-9',
    formula: 'C21H27N7O14P2',
    mw: 663.43
  },
  {
    abbr: 'NADH',
    full: 'Nicotinamide adenine dinucleotide (reduced)',
    chinese: '还原型烟酰胺腺嘌呤二核苷酸',
    category: '生物试剂',
    description: '还原型辅酶',
    cas: '58-68-4',
    formula: 'C21H29N7O14P2',
    mw: 665.44
  },
  {
    abbr: 'NADP+',
    full: 'Nicotinamide adenine dinucleotide phosphate',
    chinese: '烟酰胺腺嘌呤二核苷酸磷酸',
    category: '生物试剂',
    description: '辅酶',
    cas: '53-59-8',
    formula: 'C21H28N7O17P3',
    mw: 743.41
  },
  {
    abbr: 'CoA',
    full: 'Coenzyme A',
    chinese: '辅酶A',
    category: '生物试剂',
    description: '酰基转移辅酶',
    cas: '85-61-0',
    formula: 'C21H36N7O16P3S',
    mw: 767.53
  },
  {
    abbr: 'FAD',
    full: 'Flavin adenine dinucleotide',
    chinese: '黄素腺嘌呤二核苷酸',
    category: '生物试剂',
    description: '辅酶',
    cas: '146-14-5',
    formula: 'C27H33N9O15P2',
    mw: 785.55
  },
  {
    abbr: 'FMN',
    full: 'Flavin mononucleotide',
    chinese: '黄素单核苷酸',
    category: '生物试剂',
    description: '辅酶',
    cas: '146-17-8',
    formula: 'C17H21N4O9P',
    mw: 456.34
  },
  {
    abbr: 'GSH',
    full: 'Glutathione (reduced)',
    chinese: '谷胱甘肽（还原型）',
    category: '生物试剂',
    description: '抗氧化剂',
    cas: '70-18-8',
    formula: 'C10H17N3O6S',
    mw: 307.32
  },
  {
    abbr: 'GSSG',
    full: 'Glutathione disulfide (oxidized)',
    chinese: '谷胱甘肽（氧化型）',
    category: '生物试剂',
    description: '氧化型谷胱甘肽',
    cas: '27025-41-8',
    formula: 'C20H32N6O12S2',
    mw: 612.63
  },

  // ========== 金属有机催化剂、配位化学和其他缩写（新增）==========
  {
    abbr: 'Grubbs I',
    full: 'Benzylidene-bis(tricyclohexylphosphine)dichlororuthenium',
    chinese: 'Grubbs第一代催化剂',
    category: '催化剂',
    description: '烯烃复分解催化剂',
    cas: '172222-30-9',
    formula: 'C43H72Cl2P2Ru',
    mw: 823.94
  },
  {
    abbr: 'Grubbs II',
    full: '1,3-Bis(2,4,6-trimethylphenyl)-2-imidazolidinylidene)dichloro(phenylmethylene)(tricyclohexylphosphine)ruthenium',
    chinese: 'Grubbs第二代催化剂',
    category: '催化剂',
    description: '烯烃复分解催化剂',
    cas: '246047-72-3',
    formula: 'C46H65Cl2N2PRu',
    mw: 848.97
  },
  {
    abbr: 'Hoveyda-Grubbs',
    full: '1,3-Bis(2,4,6-trimethylphenyl)-2-imidazolidinylidene)dichloro(o-isopropoxyphenylmethylene)ruthenium',
    chinese: 'Hoveyda-Grubbs催化剂',
    category: '催化剂',
    description: '烯烃复分解催化剂',
    cas: '301224-40-8',
    formula: 'C31H38Cl2N2ORu',
    mw: 626.62
  },
  {
    abbr: 'Wilkinson\'s',
    full: 'Chlorotris(triphenylphosphine)rhodium(I)',
    chinese: 'Wilkinson催化剂',
    category: '催化剂',
    description: '均相加氢催化剂',
    cas: '14694-95-2',
    formula: 'C54H45ClP3Rh',
    mw: 925.21
  },
  {
    abbr: 'Lindlar',
    full: 'Lindlar catalyst',
    chinese: 'Lindlar催化剂',
    category: '催化剂',
    description: 'Pd/CaCO3+Pb催化剂',
    cas: '7440-05-3'
  },
  {
    abbr: 'BINAP',
    full: '2,2\'-Bis(diphenylphosphino)-1,1\'-binaphthyl',
    chinese: '2,2\'-双(二苯基膦)-1,1\'-联萘',
    category: '配体',
    description: '手性双膦配体',
    cas: '98327-87-8',
    formula: 'C44H32P2',
    mw: 622.66
  },
  {
    abbr: 'BINOL',
    full: '1,1\'-Bi-2-naphthol',
    chinese: '1,1\'-联-2-萘酚',
    category: '配体',
    description: '手性配体和催化剂',
    cas: '602-09-5',
    formula: 'C20H14O2',
    mw: 286.33
  },
  {
    abbr: 'BOX',
    full: 'Bis(oxazoline)',
    chinese: '双噁唑啉',
    category: '配体',
    description: '手性配体'
  },
  {
    abbr: 'SALEN',
    full: 'N,N\'-Bis(salicylidene)ethylenediamine',
    chinese: 'N,N\'-双(水杨醛)乙二胺',
    category: '配体',
    description: '四齿Schiff碱配体',
    cas: '94-93-9',
    formula: 'C16H16N2O2',
    mw: 268.31
  },
  {
    abbr: 'DPPE',
    full: '1,2-Bis(diphenylphosphino)ethane',
    chinese: '1,2-双(二苯基膦)乙烷',
    category: '配体',
    description: '双齿膦配体',
    cas: '1663-45-2',
    formula: 'C26H24P2',
    mw: 398.42
  },
  {
    abbr: 'DPPP',
    full: '1,3-Bis(diphenylphosphino)propane',
    chinese: '1,3-双(二苯基膦)丙烷',
    category: '配体',
    description: '双齿膦配体',
    cas: '6737-42-4',
    formula: 'C27H26P2',
    mw: 412.44
  },
  {
    abbr: 'DPPF',
    full: '1,1\'-Bis(diphenylphosphino)ferrocene',
    chinese: '1,1\'-双(二苯基膦)二茂铁',
    category: '配体',
    description: '双齿膦配体',
    cas: '12150-46-8',
    formula: 'C34H28FeP2',
    mw: 554.37
  },
  {
    abbr: 'XPhos',
    full: '2-Dicyclohexylphosphino-2\',4\',6\'-triisopropylbiphenyl',
    chinese: '2-二环己基膦-2\',4\',6\'-三异丙基联苯',
    category: '配体',
    description: 'Buchwald配体',
    cas: '564483-18-7',
    formula: 'C33H49P',
    mw: 476.71
  },
  {
    abbr: 'SPhos',
    full: '2-Dicyclohexylphosphino-2\',6\'-dimethoxybiphenyl',
    chinese: '2-二环己基膦-2\',6\'-二甲氧基联苯',
    category: '配体',
    description: 'Buchwald配体',
    cas: '657408-07-6',
    formula: 'C26H35O2P',
    mw: 410.53
  },
  {
    abbr: 'RuPhos',
    full: '2-Dicyclohexylphosphino-2\',6\'-diisopropoxybiphenyl',
    chinese: '2-二环己基膦-2\',6\'-二异丙氧基联苯',
    category: '配体',
    description: 'Buchwald配体',
    cas: '787618-22-8',
    formula: 'C30H43O2P',
    mw: 466.63
  },
  {
    abbr: 'CuAAC',
    full: 'Copper-catalyzed azide-alkyne cycloaddition',
    chinese: '铜催化叠氮-炔环加成',
    category: '反应',
    description: 'Click化学反应'
  },
  {
    abbr: 'Suzuki',
    full: 'Suzuki-Miyaura coupling',
    chinese: 'Suzuki偶联反应',
    category: '反应',
    description: '钯催化交叉偶联'
  },
  {
    abbr: 'Heck',
    full: 'Heck reaction',
    chinese: 'Heck反应',
    category: '反应',
    description: '钯催化烯烃芳基化'
  },
  {
    abbr: 'Stille',
    full: 'Stille coupling',
    chinese: 'Stille偶联反应',
    category: '反应',
    description: '钯催化偶联反应'
  },
  {
    abbr: 'Negishi',
    full: 'Negishi coupling',
    chinese: 'Negishi偶联反应',
    category: '反应',
    description: '钯催化锌试剂偶联'
  },
  {
    abbr: 'Sonogashira',
    full: 'Sonogashira coupling',
    chinese: 'Sonogashira偶联反应',
    category: '反应',
    description: '钯催化炔烃偶联'
  },
  {
    abbr: 'Buchwald-Hartwig',
    full: 'Buchwald-Hartwig amination',
    chinese: 'Buchwald-Hartwig胺化',
    category: '反应',
    description: '钯催化C-N键形成'
  },
  {
    abbr: 'Mitsunobu',
    full: 'Mitsunobu reaction',
    chinese: 'Mitsunobu反应',
    category: '反应',
    description: '醇羟基取代反应'
  },
  {
    abbr: 'Sharpless',
    full: 'Sharpless epoxidation/dihydroxylation',
    chinese: 'Sharpless环氧化/双羟化',
    category: '反应',
    description: '不对称氧化反应'
  },
  {
    abbr: 'Diels-Alder',
    full: 'Diels-Alder reaction',
    chinese: 'Diels-Alder反应',
    category: '反应',
    description: '[4+2]环加成'
  },
  {
    abbr: 'Wittig',
    full: 'Wittig reaction',
    chinese: 'Wittig反应',
    category: '反应',
    description: '羰基烯化反应'
  },
  {
    abbr: 'Claisen',
    full: 'Claisen condensation',
    chinese: 'Claisen缩合',
    category: '反应',
    description: '酯缩合反应'
  },
  {
    abbr: 'Aldol',
    full: 'Aldol reaction',
    chinese: '羟醛缩合反应',
    category: '反应',
    description: '羰基α-碳亲核加成'
  },
  {
    abbr: 'Mannich',
    full: 'Mannich reaction',
    chinese: 'Mannich反应',
    category: '反应',
    description: '氨甲基化反应'
  },
  {
    abbr: 'Michael',
    full: 'Michael addition',
    chinese: 'Michael加成',
    category: '反应',
    description: '共轭加成反应'
  },
  {
    abbr: 'Friedel-Crafts',
    full: 'Friedel-Crafts reaction',
    chinese: 'Friedel-Crafts反应',
    category: '反应',
    description: '芳香烃烷基化/酰基化'
  },
  {
    abbr: 'Grignard',
    full: 'Grignard reaction',
    chinese: 'Grignard反应',
    category: '反应',
    description: '有机镁试剂反应'
  },
  {
    abbr: 'DCC coupling',
    full: 'Dicyclohexylcarbodiimide coupling',
    chinese: 'DCC缩合反应',
    category: '反应',
    description: '酰胺/酯形成'
  },
  {
    abbr: 'Swern',
    full: 'Swern oxidation',
    chinese: 'Swern氧化',
    category: '反应',
    description: '醇氧化成醛酮'
  },
  {
    abbr: 'PCC',
    full: 'Pyridinium chlorochromate oxidation',
    chinese: 'PCC氧化',
    category: '反应',
    description: '醇氧化'
  },
  {
    abbr: 'Jones',
    full: 'Jones oxidation',
    chinese: 'Jones氧化',
    category: '反应',
    description: '铬酸氧化醇'
  },
  {
    abbr: 'Birch',
    full: 'Birch reduction',
    chinese: 'Birch还原',
    category: '反应',
    description: '芳环还原'
  },
  {
    abbr: 'Wolff-Kishner',
    full: 'Wolff-Kishner reduction',
    chinese: 'Wolff-Kishner还原',
    category: '反应',
    description: '羰基还原成亚甲基'
  },
  {
    abbr: 'Clemmensen',
    full: 'Clemmensen reduction',
    chinese: 'Clemmensen还原',
    category: '反应',
    description: '锌汞齐还原羰基'
  },
  {
    abbr: 'Baeyer-Villiger',
    full: 'Baeyer-Villiger oxidation',
    chinese: 'Baeyer-Villiger氧化',
    category: '反应',
    description: '酮氧化成酯'
  },
  {
    abbr: 'Pinacol',
    full: 'Pinacol coupling',
    chinese: '频哪醇偶联',
    category: '反应',
    description: '羰基还原偶联'
  },
  {
    abbr: 'Ullmann',
    full: 'Ullmann reaction',
    chinese: 'Ullmann偶联',
    category: '反应',
    description: '铜催化C-N/C-O偶联'
  },
  {
    abbr: 'Glaser',
    full: 'Glaser coupling',
    chinese: 'Glaser偶联',
    category: '反应',
    description: '末端炔烃氧化偶联'
  },
  {
    abbr: 'Cadiot-Chodkiewicz',
    full: 'Cadiot-Chodkiewicz coupling',
    chinese: 'Cadiot-Chodkiewicz偶联',
    category: '反应',
    description: '炔烃交叉偶联'
  },
  {
    abbr: 'Corey-Fuchs',
    full: 'Corey-Fuchs reaction',
    chinese: 'Corey-Fuchs反应',
    category: '反应',
    description: '醛转化为末端炔'
  },
  {
    abbr: 'Hofmann',
    full: 'Hofmann elimination',
    chinese: 'Hofmann消除',
    category: '反应',
    description: '季铵盐消除'
  },
  {
    abbr: 'Curtius',
    full: 'Curtius rearrangement',
    chinese: 'Curtius重排',
    category: '反应',
    description: '酰基叠氮重排'
  },
  {
    abbr: 'Schmidt',
    full: 'Schmidt reaction',
    chinese: 'Schmidt反应',
    category: '反应',
    description: '羰基与HN3反应'
  },
  {
    abbr: 'Beckmann',
    full: 'Beckmann rearrangement',
    chinese: 'Beckmann重排',
    category: '反应',
    description: '肟重排成酰胺'
  },
  {
    abbr: 'Favorskii',
    full: 'Favorskii rearrangement',
    chinese: 'Favorskii重排',
    category: '反应',
    description: 'α-卤代酮重排'
  },
  {
    abbr: 'Pericyclic',
    full: 'Pericyclic reaction',
    chinese: '周环反应',
    category: '反应',
    description: '协同反应'
  },
];

// 详细数据（按需加载）- 包含完整物化和安全信息
const abbreviationsDetailedData = {
  // ========== 有机溶剂详细数据 ==========
  'DMF': {
    physical: {
      appearance: '无色透明液体',
      meltingPoint: '-61°C',
      boilingPoint: '153°C',
      density: '0.944 g/mL (25°C)',
      solubility: '与水混溶',
      flashPoint: '58°C',
      vaporPressure: '0.52 kPa (25°C)',
      refractiveIndex: '1.4305'
    },
    safety: {
      toxicity: '中等毒性',
      hazards: ['可燃', '刺激性', '可能致癌', '肝毒性'],
      ghs: ['GHS07', 'GHS08'],
      handling: '避免吸入蒸气，使用通风橱操作，戴防护手套',
      storage: '密封保存于阴凉干燥处，远离热源和氧化剂',
      disposal: '作为有机溶剂废液处理，不得直接排放',
      ld50: '2800 mg/kg (大鼠经口)',
      firstAid: '吸入后立即移至新鲜空气处，如需要进行人工呼吸；皮肤接触用大量水冲洗'
    },
    usage: '有机合成溶剂、HPLC流动相、药物合成中间体、聚合物溶剂、电化学电解液',
    notes: '易吸水，使用前需用分子筛干燥处理。加热时易分解产生有毒气体。避免与强酸、强氧化剂接触'
  },

  'DMSO': {
    physical: {
      appearance: '无色透明液体',
      meltingPoint: '18.5°C',
      boilingPoint: '189°C',
      density: '1.100 g/mL (25°C)',
      solubility: '与水、醇、醚、酯、芳烃等混溶',
      flashPoint: '95°C',
      vaporPressure: '0.06 kPa (20°C)',
      refractiveIndex: '1.4793'
    },
    safety: {
      toxicity: '低毒',
      hazards: ['可燃', '吸湿性强', '易渗透皮肤', '携带其他物质渗透'],
      ghs: ['GHS07'],
      handling: '避免皮肤接触，戴防护手套。通风良好环境使用',
      storage: '密封保存，避光，防潮，室温保存',
      disposal: '可生物降解，作为有机溶剂废液处理',
      ld50: '14500 mg/kg (大鼠经口)',
      firstAid: '皮肤接触后立即脱去污染衣物，用大量水冲洗15分钟以上'
    },
    usage: '有机合成溶剂、细胞冻存保护剂、反应溶剂、药物递送载体、PCR反应抑制剂',
    notes: '极易吸水，可携带物质穿透皮肤进入体内，使用时特别注意防护。冬季易结晶，温水浴加热即可'
  },

  'THF': {
    physical: {
      appearance: '无色透明液体',
      meltingPoint: '-108.4°C',
      boilingPoint: '66°C',
      density: '0.889 g/mL (25°C)',
      solubility: '与水部分互溶(水溶性约8%)',
      flashPoint: '-14°C',
      vaporPressure: '19.3 kPa (25°C)',
      refractiveIndex: '1.4050'
    },
    safety: {
      toxicity: '中等毒性',
      hazards: ['高度易燃', '易形成过氧化物', '刺激性', '麻醉性'],
      ghs: ['GHS02', 'GHS07', 'GHS08'],
      handling: '远离火源、热源和氧化剂。使用前检测过氧化物，通风橱操作。使用铜丝或碘化钾试纸检测过氧化物',
      storage: '密封避光保存，加稳定剂(BHT)，4°C冷藏，定期检测过氧化物，开瓶后3个月内用完',
      disposal: '先除去过氧化物，再作为易燃有机溶剂废液处理',
      ld50: '1650 mg/kg (大鼠经口)',
      firstAid: '吸入后移至新鲜空气处；眼睛接触立即用大量水冲洗并就医'
    },
    usage: 'Grignard反应溶剂、有机锂试剂反应、聚合反应溶剂、色谱洗脱剂',
    notes: '易形成爆炸性过氧化物！存放时间不宜过长，使用前必须检测过氧化物。加稳定剂BHT可延长保存期'
  },

  'DCM': {
    physical: {
      appearance: '无色透明液体，有醚样气味',
      meltingPoint: '-96.7°C',
      boilingPoint: '39.6°C',
      density: '1.327 g/mL (25°C)',
      solubility: '微溶于水(2%)',
      flashPoint: '不可燃(不可燃溶剂)',
      vaporPressure: '47 kPa (20°C)',
      refractiveIndex: '1.4242'
    },
    safety: {
      toxicity: '中等毒性',
      hazards: ['可能致癌(2B类)', '麻醉性', '高挥发性', '肝肾毒性'],
      ghs: ['GHS07', 'GHS08'],
      handling: '通风良好环境使用，避免吸入蒸气。戴防护手套和护目镜',
      storage: '密封保存于阴凉通风处，避光',
      disposal: '作为卤代烃废液单独收集处理，不得混入其他废液',
      ld50: '1600 mg/kg (大鼠经口)',
      firstAid: '吸入大量蒸气后感到头晕，立即移至空气新鲜处，严重者送医'
    },
    usage: '萃取溶剂、清洗剂、反应溶剂、药物合成、脱咖啡因',
    notes: '不可燃但受热分解产生有毒的光气(COCl2)和HCl。不可用于碱性条件下。避免长期接触'
  },

  'EtOH': {
    physical: {
      appearance: '无色透明液体，有酒香',
      meltingPoint: '-114.1°C',
      boilingPoint: '78.4°C',
      density: '0.789 g/mL (25°C)',
      solubility: '与水混溶',
      flashPoint: '13°C',
      vaporPressure: '5.95 kPa (20°C)',
      refractiveIndex: '1.3611'
    },
    safety: {
      toxicity: '低毒',
      hazards: ['易燃', '蒸气可致醉', '长期接触皮肤可致干燥'],
      ghs: ['GHS02', 'GHS07'],
      handling: '远离火源、热源和氧化剂。通风良好环境使用',
      storage: '密封保存，阴凉通风，远离火源',
      disposal: '可生物降解，稀释后排放或回收蒸馏',
      ld50: '7060 mg/kg (大鼠经口)',
      firstAid: '误服大量后可引起酒精中毒，催吐并送医'
    },
    usage: '有机合成、溶剂、消毒剂、燃料、萃取剂、HPLC流动相',
    notes: '工业乙醇含有少量甲醇等杂质。无水乙醇极易吸水，使用前需检查纯度。医用酒精为75%水溶液'
  },

  'MeOH': {
    physical: {
      appearance: '无色透明液体',
      meltingPoint: '-97.6°C',
      boilingPoint: '64.7°C',
      density: '0.792 g/mL (25°C)',
      solubility: '与水混溶',
      flashPoint: '11°C',
      vaporPressure: '12.8 kPa (20°C)',
      refractiveIndex: '1.3288'
    },
    safety: {
      toxicity: '高毒！剧毒！',
      hazards: ['易燃', '剧毒', '可致失明', '致命', '神经毒性'],
      ghs: ['GHS02', 'GHS06', 'GHS08'],
      handling: '⚠️严格通风！避免吸入和皮肤接触，戴防护装备。专人操作',
      storage: '密封保存，阴凉通风，专人管理，设置警示标识',
      disposal: '作为危险废液处理，严禁倾倒下水道',
      ld50: '5628 mg/kg (大鼠经口)；人致死量约70-100 mL',
      firstAid: '⚠️紧急！误服立即催吐，喝大量水稀释，立即送医。可用乙醇解毒(竞争性抑制)'
    },
    usage: '有机合成、溶剂、燃料、防冻剂、甲醇燃料电池',
    notes: '⚠️剧毒！误服10mL可致失明，30mL可致命！代谢产物甲醛和甲酸造成视神经损伤。工业甲醇严禁饮用！使用时极度小心'
  },

  'ACN': {
    physical: {
      appearance: '无色透明液体',
      meltingPoint: '-45.7°C',
      boilingPoint: '81.6°C',
      density: '0.786 g/mL (25°C)',
      solubility: '与水混溶',
      flashPoint: '6°C',
      vaporPressure: '9.71 kPa (20°C)',
      refractiveIndex: '1.3442'
    },
    safety: {
      toxicity: '中等毒性',
      hazards: ['高度易燃', '有毒蒸气', '神经毒性'],
      ghs: ['GHS02', 'GHS07'],
      handling: '远离火源，通风操作，避免吸入蒸气',
      storage: '密封保存，阴凉通风，远离热源和氧化剂',
      disposal: '作为有机溶剂废液处理',
      ld50: '2460 mg/kg (大鼠经口)',
      firstAid: '吸入后移至新鲜空气处；皮肤接触用水冲洗'
    },
    usage: 'HPLC流动相、有机合成、DNA/RNA合成、锂电池电解液',
    notes: '高纯度试剂(HPLC级、色谱纯)用于分析。避免与强氧化剂接触'
  },

  'Acetone': {
    physical: {
      appearance: '无色透明液体，有特殊气味',
      meltingPoint: '-94.7°C',
      boilingPoint: '56.5°C',
      density: '0.791 g/mL (25°C)',
      solubility: '与水混溶',
      flashPoint: '-20°C',
      vaporPressure: '24.6 kPa (20°C)',
      refractiveIndex: '1.3588'
    },
    safety: {
      toxicity: '低毒',
      hazards: ['高度易燃', '蒸气可引起头晕'],
      ghs: ['GHS02', 'GHS07'],
      handling: '远离火源、热源。通风良好环境使用',
      storage: '密封保存，阴凉通风，远离火源',
      disposal: '可作为有机溶剂回收或废液处理',
      ld50: '5800 mg/kg (大鼠经口)',
      firstAid: '吸入大量蒸气后移至新鲜空气处'
    },
    usage: '有机合成、清洗剂、脱脂剂、溶剂、指甲油去除剂',
    notes: '常用清洗玻璃仪器。易挥发，注意密封。可溶解多种有机物和部分塑料'
  },

  'Toluene': {
    physical: {
      appearance: '无色透明液体',
      meltingPoint: '-95°C',
      boilingPoint: '110.6°C',
      density: '0.867 g/mL (25°C)',
      solubility: '不溶于水(0.05%)',
      flashPoint: '4°C',
      vaporPressure: '2.9 kPa (20°C)',
      refractiveIndex: '1.4961'
    },
    safety: {
      toxicity: '中等毒性',
      hazards: ['易燃', '麻醉性', '神经毒性', '生殖毒性'],
      ghs: ['GHS02', 'GHS07', 'GHS08'],
      handling: '严格通风，远离火源。避免长期吸入',
      storage: '密封保存，阴凉通风',
      disposal: '作为有机溶剂废液处理',
      ld50: '5000 mg/kg (大鼠经口)',
      firstAid: '吸入后立即移至空气新鲜处，严重者送医'
    },
    usage: '有机合成、溶剂、稀释剂、燃料添加剂、TNT原料',
    notes: '避免长期接触，有成瘾性。可溶解油脂、橡胶、树脂'
  },

  'Hexane': {
    physical: {
      appearance: '无色透明液体',
      meltingPoint: '-95°C',
      boilingPoint: '68.7°C',
      density: '0.659 g/mL (25°C)',
      solubility: '不溶于水',
      flashPoint: '-22°C',
      vaporPressure: '16.2 kPa (20°C)',
      refractiveIndex: '1.3751'
    },
    safety: {
      toxicity: '中等毒性',
      hazards: ['高度易燃', '神经毒性', '生殖毒性'],
      ghs: ['GHS02', 'GHS07', 'GHS08'],
      handling: '远离火源。严格通风，避免长期接触',
      storage: '密封保存，阴凉通风，远离火源',
      disposal: '作为有机溶剂废液处理',
      ld50: '28710 mg/kg (大鼠经口)',
      firstAid: '长期接触可致周围神经病变，立即就医'
    },
    usage: '萃取溶剂、色谱流动相、清洗剂、胶粘剂稀释剂',
    notes: '长期接触可引起多发性神经炎。非极性溶剂，常用于萃取脂溶性物质'
  },

  'CHCl3': {
    physical: {
      appearance: '无色透明液体，有特殊甜味',
      meltingPoint: '-63.5°C',
      boilingPoint: '61.2°C',
      density: '1.489 g/mL (25°C)',
      solubility: '微溶于水(0.8%)',
      flashPoint: '不可燃',
      vaporPressure: '21.3 kPa (20°C)',
      refractiveIndex: '1.4459'
    },
    safety: {
      toxicity: '中等毒性',
      hazards: ['疑似致癌物(2B类)', '麻醉性', '肝肾毒性', '光照分解产生光气'],
      ghs: ['GHS07', 'GHS08'],
      handling: '严格通风，避免吸入。避光保存，加入0.5-1%乙醇作稳定剂',
      storage: '棕色瓶避光保存，加稳定剂(乙醇)，密封',
      disposal: '作为卤代烃废液单独处理',
      ld50: '908 mg/kg (大鼠经口)',
      firstAid: '吸入后感到头晕恶心，立即移至空气新鲜处并就医'
    },
    usage: '有机合成、萃取溶剂、麻醉剂(已弃用)、NMR溶剂',
    notes: '光照下分解产生剧毒光气！必须避光保存并加稳定剂。不能与强碱接触'
  },

  'IPA': {
    physical: {
      appearance: '无色透明液体',
      meltingPoint: '-89.5°C',
      boilingPoint: '82.5°C',
      density: '0.786 g/mL (25°C)',
      solubility: '与水混溶',
      flashPoint: '12°C',
      vaporPressure: '4.4 kPa (20°C)',
      refractiveIndex: '1.3776'
    },
    safety: {
      toxicity: '低毒',
      hazards: ['易燃', '刺激性'],
      ghs: ['GHS02', 'GHS07'],
      handling: '远离火源，通风使用',
      storage: '密封保存，阴凉通风',
      disposal: '可回收或作为有机溶剂废液处理',
      ld50: '5045 mg/kg (大鼠经口)',
      firstAid: '误服大量后催吐并送医'
    },
    usage: '消毒剂(70%)、溶剂、清洗剂、半导体清洗',
    notes: '70%水溶液消毒效果最佳。比乙醇挥发慢，清洗效果好'
  },

  // ========== 酸碱试剂详细数据 ==========
  'HCl': {
    physical: {
      appearance: '无色至淡黄色液体(浓盐酸)',
      meltingPoint: '-114.2°C (纯HCl)',
      boilingPoint: '-85.1°C (纯HCl)',
      density: '1.18 g/mL (36-38%浓盐酸)',
      solubility: '易溶于水',
      flashPoint: '不可燃',
      vaporPressure: '高挥发性',
      refractiveIndex: null
    },
    safety: {
      toxicity: '腐蚀性',
      hazards: ['强腐蚀性', '刺激性', '挥发性强'],
      ghs: ['GHS05', 'GHS07'],
      handling: '戴防护手套、护目镜和口罩。通风橱操作',
      storage: '密封保存，阴凉通风，远离碱类',
      disposal: '中和后稀释排放',
      ld50: '900 mg/kg (兔经口)',
      firstAid: '皮肤接触立即用大量水冲洗；眼睛接触持续冲洗并就医'
    },
    usage: '酸化、水解、制备氯化物、pH调节、除锈',
    notes: '浓盐酸在空气中冒白雾(HCl气体)。不能与氧化剂混用'
  },

  'H2SO4': {
    physical: {
      appearance: '无色油状液体(浓硫酸)',
      meltingPoint: '10.4°C',
      boilingPoint: '337°C',
      density: '1.84 g/mL (98%浓硫酸)',
      solubility: '与水混溶(强放热！)',
      flashPoint: '不可燃',
      vaporPressure: '0.001 mmHg (25°C)',
      refractiveIndex: null
    },
    safety: {
      toxicity: '强腐蚀性',
      hazards: ['强腐蚀性', '强脱水性', '稀释强放热', '与水反应剧烈'],
      ghs: ['GHS05'],
      handling: '⚠️稀释时：酸入水！戴全套防护。避免皮肤接触',
      storage: '密封保存，阴凉干燥处。单独存放',
      disposal: '缓慢中和后稀释排放',
      ld50: '2140 mg/kg (大鼠经口)',
      firstAid: '⚠️皮肤接触立即用大量水冲洗20分钟以上！不可用碱中和'
    },
    usage: '脱水剂、磺化剂、催化剂、电池电解液、化肥生产',
    notes: '⚠️稀释时必须酸入水，绝不可水入酸！浓硫酸有强脱水性，可炭化有机物'
  },

  'HNO3': {
    physical: {
      appearance: '无色至淡黄色液体',
      meltingPoint: '-42°C',
      boilingPoint: '83°C (68%溶液)',
      density: '1.41 g/mL (68%溶液)',
      solubility: '与水混溶',
      flashPoint: '不可燃(但助燃)',
      vaporPressure: '高挥发性',
      refractiveIndex: null
    },
    safety: {
      toxicity: '强腐蚀性',
      hazards: ['强腐蚀性', '强氧化性', '光照分解', '助燃'],
      ghs: ['GHS03', 'GHS05'],
      handling: '戴防护装备。严格通风。远离有机物',
      storage: '棕色瓶避光保存，阴凉处。远离还原剂',
      disposal: '中和后稀释排放',
      ld50: '无准确数据(强腐蚀)',
      firstAid: '皮肤接触立即大量水冲洗；眼睛接触持续冲洗并就医'
    },
    usage: '硝化反应、氧化剂、蚀刻剂、制造炸药和化肥',
    notes: '光照分解产生NO2(红棕色)。可与金属反应产生氢气。王水=HCl:HNO3=3:1'
  },

  'AcOH': {
    physical: {
      appearance: '无色透明液体，有刺激性酸味',
      meltingPoint: '16.6°C',
      boilingPoint: '117.9°C',
      density: '1.049 g/mL (25°C)',
      solubility: '与水混溶',
      flashPoint: '39°C',
      vaporPressure: '1.55 kPa (20°C)',
      refractiveIndex: '1.3720'
    },
    safety: {
      toxicity: '中等毒性',
      hazards: ['可燃', '腐蚀性', '刺激性'],
      ghs: ['GHS02', 'GHS05'],
      handling: '通风使用，避免吸入蒸气。戴防护手套',
      storage: '密封保存，阴凉通风，远离碱类和氧化剂',
      disposal: '中和后稀释排放或回收',
      ld50: '3310 mg/kg (大鼠经口)',
      firstAid: '皮肤接触用大量水冲洗；误服后催吐并就医'
    },
    usage: '有机合成、溶剂、pH调节、食品添加剂(食用醋3-5%)',
    notes: '冰点16.6°C，冬季易结冰称"冰醋酸"。腐蚀性较弱但有刺激性'
  },

  'TFA': {
    physical: {
      appearance: '无色透明液体',
      meltingPoint: '-15.2°C',
      boilingPoint: '72.4°C',
      density: '1.489 g/mL (25°C)',
      solubility: '与水混溶',
      flashPoint: '不可燃',
      vaporPressure: '10.9 kPa (20°C)',
      refractiveIndex: '1.2850'
    },
    safety: {
      toxicity: '高毒性',
      hazards: ['强腐蚀性', '高挥发性', '刺激性'],
      ghs: ['GHS05', 'GHS07'],
      handling: '严格通风！戴防护装备。避免吸入',
      storage: '密封保存，阴凉处',
      disposal: '中和后处理',
      ld50: '200 mg/kg (大鼠经口)',
      firstAid: '皮肤接触立即大量水冲洗；吸入后移至新鲜空气处'
    },
    usage: '肽合成脱保护、有机合成催化剂、HPLC流动相添加剂',
    notes: '强有机酸(pKa=0.23)，腐蚀性强。常用于Boc保护基脱除'
  },

  'NaOH': {
    physical: {
      appearance: '白色固体(片状、粒状或块状)',
      meltingPoint: '318°C',
      boilingPoint: '1388°C',
      density: '2.13 g/cm³',
      solubility: '溶于水(强放热)',
      flashPoint: '不可燃',
      vaporPressure: null,
      refractiveIndex: null
    },
    safety: {
      toxicity: '强腐蚀性',
      hazards: ['强腐蚀性', '强碱性', '溶解放热', '吸湿性强'],
      ghs: ['GHS05'],
      handling: '⚠️戴防护手套和护目镜！溶解时缓慢加入，避免飞溅',
      storage: '密封保存，干燥处。与酸类分开存放',
      disposal: '中和后稀释排放',
      ld50: '无准确数据(强腐蚀)',
      firstAid: '⚠️皮肤接触立即大量水冲洗！不可用酸中和。眼睛接触持续冲洗并立即就医'
    },
    usage: '中和反应、皂化反应、pH调节、化工生产、清洗剂',
    notes: '极易吸潮潮解。溶于水强烈放热。可腐蚀玻璃，长期存放用塑料瓶。烧碱/火碱'
  },

  'TEA': {
    physical: {
      appearance: '无色至淡黄色粘稠液体',
      meltingPoint: '21.6°C',
      boilingPoint: '335°C',
      density: '1.124 g/mL (20°C)',
      solubility: '与水混溶',
      flashPoint: '179°C',
      vaporPressure: '<0.01 kPa (20°C)',
      refractiveIndex: '1.4852'
    },
    safety: {
      toxicity: '低至中等毒性',
      hazards: ['腐蚀性', '刺激性', '吸湿性'],
      ghs: ['GHS05', 'GHS07'],
      handling: '避免皮肤和眼睛接触，戴防护装备',
      storage: '密封保存，阴凉处，避免受热',
      disposal: '中和后处理',
      ld50: '8000 mg/kg (大鼠经口)',
      firstAid: '皮肤接触用大量水冲洗；眼睛接触持续冲洗并就医'
    },
    usage: 'pH调节、乳化剂、金属离子络合、缓冲液、水泥添加剂',
    notes: '弱碱(pKa≈7.8)。可吸收CO2形成碳酸盐。用于制备缓冲液'
  },

  // ========== 配体详细数据 ==========
  'EDTA': {
    physical: {
      appearance: '白色结晶粉末',
      meltingPoint: '240°C (分解)',
      boilingPoint: 'N/A',
      density: '0.86 g/cm³',
      solubility: '微溶于冷水，溶于热水和碱溶液',
      flashPoint: 'N/A (不燃)',
      vaporPressure: null,
      refractiveIndex: 'N/A'
    },
    safety: {
      toxicity: '低毒',
      hazards: ['粉尘刺激'],
      ghs: ['GHS07'],
      handling: '避免吸入粉尘，戴口罩操作',
      storage: '密封保存，干燥处',
      disposal: '中和后排放或回收',
      ld50: '2000 mg/kg (大鼠经口)',
      firstAid: '吸入粉尘后移至新鲜空气处'
    },
    usage: '金属离子螯合、分析化学、缓冲液添加剂、水处理、食品添加剂',
    notes: '常用二钠盐(EDTA-2Na)或四钠盐(EDTA-4Na)，溶解性更好。可螯合多种金属离子'
  },

  // ========== 表面活性剂详细数据 ==========
  'CTAB': {
    physical: {
      appearance: '白色至类白色粉末或颗粒',
      meltingPoint: '237-243°C',
      boilingPoint: 'N/A',
      density: '~1.0 g/cm³',
      solubility: '溶于水和醇',
      flashPoint: 'N/A',
      vaporPressure: null,
      refractiveIndex: 'N/A'
    },
    safety: {
      toxicity: '中等毒性',
      hazards: ['刺激性', '腐蚀性', '对水生生物有害'],
      ghs: ['GHS05', 'GHS07', 'GHS09'],
      handling: '避免接触皮肤和眼睛，戴防护装备。避免吸入粉尘',
      storage: '密封保存，干燥处',
      disposal: '中和后作为表面活性剂废液处理',
      ld50: '410 mg/kg (大鼠经口)',
      firstAid: '皮肤接触用大量水冲洗；眼睛接触持续冲洗并就医'
    },
    usage: '纳米材料合成模板、DNA提取、表面活性剂、消毒剂',
    notes: '水溶液有起泡性。可形成胶束和囊泡。CMC约1mM'
  },

  'SDS': {
    physical: {
      appearance: '白色至淡黄色粉末或颗粒',
      meltingPoint: '204-207°C',
      boilingPoint: 'N/A',
      density: '~1.1 g/cm³',
      solubility: '溶于水',
      flashPoint: '>100°C',
      vaporPressure: null,
      refractiveIndex: 'N/A'
    },
    safety: {
      toxicity: '低至中等毒性',
      hazards: ['刺激性', '对水生生物有害'],
      ghs: ['GHS07', 'GHS09'],
      handling: '避免吸入粉尘和接触皮肤',
      storage: '密封保存，干燥处',
      disposal: '作为表面活性剂废液处理',
      ld50: '1288 mg/kg (大鼠经口)',
      firstAid: '皮肤接触用水冲洗；误服后催吐并就医'
    },
    usage: 'SDS-PAGE电泳、蛋白质变性、清洗剂、乳化剂',
    notes: '阴离子表面活性剂。可使蛋白质变性。CMC约8mM'
  },

  // ========== 还原剂详细数据 ==========
  'NaBH4': {
    physical: {
      appearance: '白色至灰白色粉末或颗粒',
      meltingPoint: '400°C (分解)',
      boilingPoint: 'N/A',
      density: '1.07 g/cm³',
      solubility: '溶于水(缓慢分解)、醇',
      flashPoint: 'N/A',
      vaporPressure: null,
      refractiveIndex: 'N/A'
    },
    safety: {
      toxicity: '中等毒性',
      hazards: ['遇水放氢', '遇酸剧烈反应', '刺激性', '可燃'],
      ghs: ['GHS02', 'GHS05', 'GHS07'],
      handling: '避免接触水和酸。通风操作，远离火源',
      storage: '密封保存，干燥处。与酸类、氧化剂分开',
      disposal: '缓慢加入水中分解，收集氢气',
      ld50: '160 mg/kg (大鼠经口)',
      firstAid: '皮肤接触用大量水冲洗'
    },
    usage: '羰基还原、纳米金属合成、有机合成还原剂',
    notes: '温和还原剂，可还原醛酮但不还原酯。遇水缓慢分解放氢。碱性条件下稳定'
  },

  'LiAlH4': {
    physical: {
      appearance: '灰白色粉末',
      meltingPoint: '125°C (分解)',
      boilingPoint: 'N/A',
      density: '0.917 g/cm³',
      solubility: '溶于醚类，遇水剧烈反应',
      flashPoint: 'N/A',
      vaporPressure: null,
      refractiveIndex: 'N/A'
    },
    safety: {
      toxicity: '高毒性',
      hazards: ['遇水剧烈反应！', '自燃性', '腐蚀性', '放出氢气'],
      ghs: ['GHS02', 'GHS05', 'GHS06'],
      handling: '⚠️严格无水操作！惰性气体保护。远离水和火源',
      storage: '密封保存在惰性气体下，干燥处。矿物油保护',
      disposal: '⚠️缓慢加入乙酸乙酯或异丙醇中分解！绝不可直接加水',
      ld50: '无准确数据(剧烈反应)',
      firstAid: '⚠️遇水着火不可用水扑灭！用干粉灭火器。皮肤接触先除去固体再冲洗'
    },
    usage: '强还原剂，可还原酯、酰胺、腈等',
    notes: '⚠️强还原剂！遇水剧烈反应产生氢气和热！使用后残渣用乙酸乙酯猝灭。手套箱操作'
  },

  'H2O2': {
    physical: {
      appearance: '无色透明液体',
      meltingPoint: '-0.43°C',
      boilingPoint: '150.2°C',
      density: '1.45 g/mL (30%溶液)',
      solubility: '与水混溶',
      flashPoint: '不可燃(但助燃)',
      vaporPressure: '0.2 kPa (30%，20°C)',
      refractiveIndex: '1.4067'
    },
    safety: {
      toxicity: '中等毒性',
      hazards: ['强氧化性', '腐蚀性', '分解放氧', '遇有机物可燃'],
      ghs: ['GHS03', 'GHS05', 'GHS07'],
      handling: '避免接触有机物。通风使用，戴防护装备',
      storage: '避光保存，阴凉处。通气瓶盖',
      disposal: '稀释后缓慢排放或催化分解',
      ld50: '无准确数据(浓度相关)',
      firstAid: '皮肤接触大量水冲洗；眼睛接触持续冲洗并就医'
    },
    usage: '氧化剂、漂白剂、消毒剂、Fenton反应、纳米材料合成',
    notes: '光照或受热分解放氧。高浓度(>50%)极危险。常用3%、30%溶液'
  },

  // ========== 前驱体详细数据 ==========
  'TEOS': {
    physical: {
      appearance: '无色透明液体',
      meltingPoint: '-77°C',
      boilingPoint: '168°C',
      density: '0.933 g/mL (25°C)',
      solubility: '不溶于水(水解)',
      flashPoint: '52°C',
      vaporPressure: '0.15 kPa (20°C)',
      refractiveIndex: '1.3830'
    },
    safety: {
      toxicity: '中等毒性',
      hazards: ['可燃', '刺激性', '水解产生乙醇'],
      ghs: ['GHS02', 'GHS07'],
      handling: '通风使用，避免吸入。避免皮肤接触',
      storage: '密封保存，阴凉干燥处',
      disposal: '水解后作为有机溶剂废液处理',
      ld50: '6270 mg/kg (大鼠经口)',
      firstAid: '皮肤接触用水冲洗；误服后就医'
    },
    usage: 'Sol-gel法制备SiO2、硅基材料前驱体、表面改性',
    notes: '遇水缓慢水解。溶于乙醇等有机溶剂。Stöber法制备SiO2纳米颗粒'
  },

  // ========== 缓冲剂详细数据 ==========
  'Tris': {
    physical: {
      appearance: '白色结晶粉末',
      meltingPoint: '167-172°C',
      boilingPoint: '219-220°C (分解)',
      density: '1.353 g/cm³',
      solubility: '易溶于水',
      flashPoint: '>100°C',
      vaporPressure: null,
      refractiveIndex: 'N/A'
    },
    safety: {
      toxicity: '低毒',
      hazards: ['刺激性'],
      ghs: ['GHS07'],
      handling: '避免吸入粉尘',
      storage: '密封保存，室温',
      disposal: '稀释后排放',
      ld50: '5900 mg/kg (大鼠经口)',
      firstAid: '误服大量后就医'
    },
    usage: '生物缓冲液(pH 7-9)、电泳缓冲液、蛋白质溶解',
    notes: 'pKa=8.06(25°C)。温度依赖性强(-0.028 pH/°C)。Tris-HCl缓冲液常用'
  },

  'HEPES': {
    physical: {
      appearance: '白色结晶粉末',
      meltingPoint: '234-236°C',
      boilingPoint: 'N/A',
      density: null,
      solubility: '易溶于水',
      flashPoint: 'N/A',
      vaporPressure: null,
      refractiveIndex: 'N/A'
    },
    safety: {
      toxicity: '低毒',
      hazards: ['刺激性'],
      ghs: ['GHS07'],
      handling: '避免吸入粉尘',
      storage: '密封保存，室温',
      disposal: '稀释后排放',
      ld50: '>5000 mg/kg (大鼠经口)',
      firstAid: '一般无大碍'
    },
    usage: '细胞培养缓冲液(pH 6.8-8.2)、生化实验',
    notes: 'pKa=7.48(25°C)。温度依赖性小。Good\'s缓冲液之一。不与金属离子络合'
  }
};

/**
 * 获取基础数据列表（快速加载）
 */
function getBasicData() {
  return abbreviationsBasicData;
}

/**
 * 获取详细数据（按需加载）
 * @param {string} abbr - 缩写
 */
function getDetailedData(abbr) {
  return abbreviationsDetailedData[abbr] || null;
}

/**
 * 搜索功能（优化版）
 */
function searchAbbreviation(query) {
  if (!query || query.trim() === '') {
    return abbreviationsBasicData;
  }

  const keyword = query.toLowerCase().trim();
  
  // 精确匹配优先
  const exactMatches = abbreviationsBasicData.filter(item => 
    item.abbr.toLowerCase() === keyword ||
    item.chinese === query ||
    item.cas === query
  );

  if (exactMatches.length > 0) {
    return exactMatches;
  }

  // 模糊匹配
  return abbreviationsBasicData.filter(item => {
    return item.abbr.toLowerCase().includes(keyword) ||
           item.full.toLowerCase().includes(keyword) ||
           item.chinese.includes(keyword) ||
           item.category.includes(keyword) ||
           item.description.includes(keyword) ||
           (item.cas && item.cas.includes(keyword)) ||
           (item.formula && item.formula.toLowerCase().includes(keyword));
  });
}

/**
 * 按分类获取
 */
function getByCategory(category) {
  if (!category || category === '全部') {
    return abbreviationsBasicData;
  }
  return abbreviationsBasicData.filter(item => item.category === category);
}

// 缓存计算结果，避免重复计算
let _cachedCategories = null;
let _cachedCategoryStats = null;
let _cachedStatistics = null;

/**
 * 获取所有分类（带缓存）
 */
function getAllCategories() {
  if (_cachedCategories) {
    return _cachedCategories;
  }
  const categories = [...new Set(abbreviationsBasicData.map(item => item.category))];
  _cachedCategories = categories.sort();
  return _cachedCategories;
}

/**
 * 获取分类统计（带缓存）
 */
function getCategoryStats() {
  if (_cachedCategoryStats) {
    return _cachedCategoryStats;
  }
  const stats = {};
  abbreviationsBasicData.forEach(item => {
    if (!stats[item.category]) {
      stats[item.category] = 0;
    }
    stats[item.category]++;
  });
  _cachedCategoryStats = stats;
  return _cachedCategoryStats;
}

/**
 * 检查是否有详细数据
 */
function hasDetailedData(abbr) {
  return !!abbreviationsDetailedData[abbr];
}

/**
 * 获取数据统计信息（带缓存）
 */
function getDataStatistics() {
  if (_cachedStatistics) {
    return _cachedStatistics;
  }
  
  // 使用单次遍历统计所有信息
  let withCAS = 0;
  let withFormula = 0;
  let withMW = 0;
  
  abbreviationsBasicData.forEach(item => {
    if (item.cas) withCAS++;
    if (item.formula) withFormula++;
    if (item.mw) withMW++;
  });
  
  _cachedStatistics = {
    totalCount: abbreviationsBasicData.length,
    categoriesCount: getAllCategories().length,
    detailedCount: Object.keys(abbreviationsDetailedData).length,
    withCAS,
    withFormula,
    withMW
  };
  
  return _cachedStatistics;
}

module.exports = {
  getBasicData,
  getDetailedData,
  searchAbbreviation,
  getByCategory,
  getAllCategories,
  getCategoryStats,
  hasDetailedData,
  getDataStatistics
};
