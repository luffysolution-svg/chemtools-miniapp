/**
 * 实验常数数据库
 * 包含常用缓冲液pKa、溶剂物性、标准电极电位、晶体场分裂能等
 * 
 * @version 8.0.0
 * @author ChemTools Team
 */

/**
 * 常用缓冲液pKa值数据
 * 数据来源：NIST, CRC Handbook
 */
const BUFFER_PKA_DATA = [
  // 磷酸盐缓冲液
  {
    name: '磷酸盐缓冲液 PBS',
    nameEn: 'Phosphate Buffered Saline',
    abbreviation: 'PBS',
    compound: 'H3PO4/H2PO4-/HPO42-',
    pka1: 2.15,
    pka2: 7.20,
    pka3: 12.35,
    bufferRange: '6.0-8.0',
    optimalPH: 7.4,
    preparation: '8.0g NaCl, 0.2g KCl, 1.44g Na2HPO4, 0.24g KH2PO4, 定容至1L',
    temperature: 25,
    notes: '生理pH缓冲液，生物实验最常用'
  },
  {
    name: 'Tris缓冲液',
    nameEn: 'Tris(hydroxymethyl)aminomethane',
    abbreviation: 'Tris',
    compound: 'Tris',
    pka1: 8.06,
    pka2: null,
    pka3: null,
    bufferRange: '7.0-9.0',
    optimalPH: 8.0,
    preparation: '根据所需pH值和浓度，用HCl调节',
    temperature: 25,
    notes: 'pH受温度影响大（-0.028 pH/°C），常用于蛋白质实验'
  },
  {
    name: '醋酸盐缓冲液',
    nameEn: 'Acetate Buffer',
    abbreviation: 'HOAc/NaOAc',
    compound: 'CH3COOH/CH3COO-',
    pka1: 4.76,
    pka2: null,
    pka3: null,
    bufferRange: '3.6-5.6',
    optimalPH: 4.8,
    preparation: '醋酸钠和醋酸混合，调节pH',
    temperature: 25,
    notes: '弱酸性缓冲液，常用于酶反应'
  },
  {
    name: '柠檬酸盐缓冲液',
    nameEn: 'Citrate Buffer',
    abbreviation: 'Citrate',
    compound: 'C6H8O7/C6H7O7-',
    pka1: 3.13,
    pka2: 4.76,
    pka3: 6.40,
    bufferRange: '3.0-6.5',
    optimalPH: 5.5,
    preparation: '柠檬酸和柠檬酸钠混合',
    temperature: 25,
    notes: '抗氧化性好，常用于食品和生物化学'
  },
  {
    name: 'HEPES缓冲液',
    nameEn: '4-(2-hydroxyethyl)-1-piperazineethanesulfonic acid',
    abbreviation: 'HEPES',
    compound: 'HEPES',
    pka1: 7.48,
    pka2: null,
    pka3: null,
    bufferRange: '6.8-8.2',
    optimalPH: 7.5,
    preparation: 'HEPES粉末溶解后用NaOH调pH',
    temperature: 25,
    notes: '生物缓冲液，pH稳定性好，温度系数小'
  },
  {
    name: 'MES缓冲液',
    nameEn: '2-(N-morpholino)ethanesulfonic acid',
    abbreviation: 'MES',
    compound: 'MES',
    pka1: 6.15,
    pka2: null,
    pka3: null,
    bufferRange: '5.5-6.7',
    optimalPH: 6.2,
    preparation: 'MES粉末溶解后用NaOH调pH',
    temperature: 25,
    notes: '低pH生物缓冲液，不与金属离子络合'
  },
  {
    name: 'MOPS缓冲液',
    nameEn: '3-(N-morpholino)propanesulfonic acid',
    abbreviation: 'MOPS',
    compound: 'MOPS',
    pka1: 7.20,
    pka2: null,
    pka3: null,
    bufferRange: '6.5-7.9',
    optimalPH: 7.2,
    preparation: 'MOPS粉末溶解后用NaOH调pH',
    temperature: 25,
    notes: '中性pH缓冲液，常用于植物细胞培养'
  },
  {
    name: '碳酸盐缓冲液',
    nameEn: 'Carbonate Buffer',
    abbreviation: 'CO3',
    compound: 'H2CO3/HCO3-/CO32-',
    pka1: 6.35,
    pka2: 10.33,
    pka3: null,
    bufferRange: '9.2-10.8',
    optimalPH: 10.0,
    preparation: 'Na2CO3和NaHCO3混合',
    temperature: 25,
    notes: '碱性缓冲液，CO2影响pH值'
  },
  {
    name: '硼酸盐缓冲液',
    nameEn: 'Borate Buffer',
    abbreviation: 'Borate',
    compound: 'H3BO3/H2BO3-',
    pka1: 9.24,
    pka2: null,
    pka3: null,
    bufferRange: '8.1-9.2',
    optimalPH: 9.0,
    preparation: '硼酸和硼砂混合',
    temperature: 25,
    notes: '弱碱性缓冲液，电泳常用'
  },
  {
    name: 'Good\'s缓冲液 - PIPES',
    nameEn: 'Piperazine-N,N\'-bis(2-ethanesulfonic acid)',
    abbreviation: 'PIPES',
    compound: 'PIPES',
    pka1: 6.76,
    pka2: null,
    pka3: null,
    bufferRange: '6.1-7.5',
    optimalPH: 6.8,
    preparation: 'PIPES粉末溶解后用NaOH调pH',
    temperature: 25,
    notes: 'Good\'s缓冲液之一，pH稳定'
  }
];

/**
 * 溶剂物性数据
 * 数据来源：CRC Handbook
 */
const SOLVENT_PROPERTIES = [
  {
    name: '水',
    nameEn: 'Water',
    formula: 'H2O',
    mw: 18.02,
    bp: 100.0,
    mp: 0.0,
    density: 1.000,
    viscosity: 0.890, // cP, 25°C
    dielectric: 78.4,
    dipole: 1.85, // D
    polarity: 10.2, // ET(30)
    miscibility: '与极性溶剂混溶',
    notes: '通用溶剂，高极性'
  },
  {
    name: '甲醇',
    nameEn: 'Methanol',
    formula: 'CH3OH',
    mw: 32.04,
    bp: 64.7,
    mp: -97.7,
    density: 0.791,
    viscosity: 0.544,
    dielectric: 32.7,
    dipole: 1.70,
    polarity: 5.1,
    miscibility: '与水、大多数有机溶剂混溶',
    notes: '有毒，极性质子溶剂'
  },
  {
    name: '乙醇',
    nameEn: 'Ethanol',
    formula: 'C2H5OH',
    mw: 46.07,
    bp: 78.4,
    mp: -114.1,
    density: 0.789,
    viscosity: 1.074,
    dielectric: 24.5,
    dipole: 1.69,
    polarity: 5.2,
    miscibility: '与水、大多数有机溶剂混溶',
    notes: '常用溶剂，相对安全'
  },
  {
    name: 'N,N-二甲基甲酰胺',
    nameEn: 'N,N-Dimethylformamide',
    formula: 'C3H7NO',
    mw: 73.09,
    bp: 153.0,
    mp: -60.4,
    density: 0.944,
    viscosity: 0.802,
    dielectric: 36.7,
    dipole: 3.82,
    polarity: 6.4,
    miscibility: '与水、大多数有机溶剂混溶',
    notes: '强极性非质子溶剂，有肝毒性'
  },
  {
    name: '二甲基亚砜',
    nameEn: 'Dimethyl sulfoxide',
    formula: 'C2H6OS',
    mw: 78.13,
    bp: 189.0,
    mp: 18.5,
    density: 1.100,
    viscosity: 1.996,
    dielectric: 46.7,
    dipole: 3.96,
    polarity: 7.2,
    miscibility: '与水、大多数有机溶剂混溶',
    notes: '强极性非质子溶剂，高沸点，吸湿性强'
  },
  {
    name: '四氢呋喃',
    nameEn: 'Tetrahydrofuran',
    formula: 'C4H8O',
    mw: 72.11,
    bp: 66.0,
    mp: -108.4,
    density: 0.889,
    viscosity: 0.456,
    dielectric: 7.6,
    dipole: 1.75,
    polarity: 4.0,
    miscibility: '与大多数有机溶剂混溶，微溶于水',
    notes: '常用醚类溶剂，易形成过氧化物'
  },
  {
    name: '二氯甲烷',
    nameEn: 'Dichloromethane',
    formula: 'CH2Cl2',
    mw: 84.93,
    bp: 39.6,
    mp: -96.7,
    density: 1.326,
    viscosity: 0.413,
    dielectric: 8.9,
    dipole: 1.60,
    polarity: 3.1,
    miscibility: '与大多数有机溶剂混溶，不溶于水',
    notes: '低沸点卤代烃，密度大于水'
  },
  {
    name: '氯仿',
    nameEn: 'Chloroform',
    formula: 'CHCl3',
    mw: 119.38,
    bp: 61.2,
    mp: -63.5,
    density: 1.483,
    viscosity: 0.537,
    dielectric: 4.8,
    dipole: 1.04,
    polarity: 4.1,
    miscibility: '与大多数有机溶剂混溶，微溶于水',
    notes: '常用萃取溶剂，有麻醉性，可能致癌'
  },
  {
    name: '乙酸乙酯',
    nameEn: 'Ethyl acetate',
    formula: 'C4H8O2',
    mw: 88.11,
    bp: 77.1,
    mp: -83.6,
    density: 0.902,
    viscosity: 0.423,
    dielectric: 6.0,
    dipole: 1.78,
    polarity: 4.4,
    miscibility: '与大多数有机溶剂混溶，微溶于水',
    notes: '常用酯类溶剂，果香味，安全性好'
  },
  {
    name: '正己烷',
    nameEn: 'n-Hexane',
    formula: 'C6H14',
    mw: 86.18,
    bp: 68.7,
    mp: -95.3,
    density: 0.655,
    viscosity: 0.297,
    dielectric: 1.9,
    dipole: 0.08,
    polarity: 0.1,
    miscibility: '与非极性溶剂混溶，不溶于水',
    notes: '非极性溶剂，常用于萃取和色谱'
  },
  {
    name: '甲苯',
    nameEn: 'Toluene',
    formula: 'C7H8',
    mw: 92.14,
    bp: 110.6,
    mp: -95.0,
    density: 0.867,
    viscosity: 0.560,
    dielectric: 2.4,
    dipole: 0.36,
    polarity: 2.4,
    miscibility: '与大多数有机溶剂混溶，不溶于水',
    notes: '芳香烃溶剂，常用于有机合成'
  },
  {
    name: '乙腈',
    nameEn: 'Acetonitrile',
    formula: 'CH3CN',
    mw: 41.05,
    bp: 81.6,
    mp: -45.7,
    density: 0.786,
    viscosity: 0.341,
    dielectric: 37.5,
    dipole: 3.92,
    polarity: 5.8,
    miscibility: '与水、大多数有机溶剂混溶',
    notes: 'HPLC常用，极性非质子溶剂'
  },
  {
    name: '丙酮',
    nameEn: 'Acetone',
    formula: 'C3H6O',
    mw: 58.08,
    bp: 56.1,
    mp: -94.7,
    density: 0.784,
    viscosity: 0.306,
    dielectric: 20.7,
    dipole: 2.88,
    polarity: 5.1,
    miscibility: '与水、大多数有机溶剂混溶',
    notes: '常用清洗溶剂，低毒'
  },
  {
    name: '乙醚',
    nameEn: 'Diethyl ether',
    formula: 'C4H10O',
    mw: 74.12,
    bp: 34.6,
    mp: -116.3,
    density: 0.708,
    viscosity: 0.224,
    dielectric: 4.3,
    dipole: 1.15,
    polarity: 2.8,
    miscibility: '与大多数有机溶剂混溶，微溶于水',
    notes: '低沸点醚，极易燃，易形成过氧化物'
  },
  {
    name: '1,4-二氧六环',
    nameEn: '1,4-Dioxane',
    formula: 'C4H8O2',
    mw: 88.11,
    bp: 101.1,
    mp: 11.8,
    density: 1.034,
    viscosity: 1.177,
    dielectric: 2.2,
    dipole: 0.45,
    polarity: 4.8,
    miscibility: '与水、大多数有机溶剂混溶',
    notes: '环醚溶剂，怀疑致癌，易形成过氧化物'
  }
];

/**
 * 标准电极电位数据（vs SHE, 25°C）
 * 数据来源：IUPAC, CRC Handbook
 * 单位：V
 */
const STANDARD_ELECTRODE_POTENTIALS = [
  // 强氧化剂
  { halfReaction: 'F2 + 2e- → 2F-', E0: 2.87, category: '强氧化剂', notes: '最强氧化剂' },
  { halfReaction: 'H2O2 + 2H+ + 2e- → 2H2O', E0: 1.78, category: '强氧化剂', notes: '过氧化氢' },
  { halfReaction: 'MnO4- + 8H+ + 5e- → Mn2+ + 4H2O', E0: 1.51, category: '强氧化剂', notes: '高锰酸根（酸性）' },
  { halfReaction: 'Cl2 + 2e- → 2Cl-', E0: 1.36, category: '强氧化剂', notes: '氯气' },
  { halfReaction: 'Cr2O72- + 14H+ + 6e- → 2Cr3+ + 7H2O', E0: 1.33, category: '强氧化剂', notes: '重铬酸根（酸性）' },
  { halfReaction: 'O2 + 4H+ + 4e- → 2H2O', E0: 1.23, category: '强氧化剂', notes: '氧气（酸性）' },
  { halfReaction: 'Br2 + 2e- → 2Br-', E0: 1.07, category: '强氧化剂', notes: '溴' },
  { halfReaction: 'NO3- + 4H+ + 3e- → NO + 2H2O', E0: 0.96, category: '强氧化剂', notes: '硝酸根' },
  
  // 贵金属
  { halfReaction: 'Ag+ + e- → Ag', E0: 0.80, category: '贵金属', notes: '银' },
  { halfReaction: 'Fe3+ + e- → Fe2+', E0: 0.77, category: '过渡金属', notes: '铁(III)/铁(II)' },
  { halfReaction: 'I2 + 2e- → 2I-', E0: 0.54, category: '卤素', notes: '碘' },
  { halfReaction: 'Cu2+ + 2e- → Cu', E0: 0.34, category: '过渡金属', notes: '铜' },
  { halfReaction: 'Cu2+ + e- → Cu+', E0: 0.16, category: '过渡金属', notes: '铜(II)/铜(I)' },
  
  // 参比电极
  { halfReaction: '2H+ + 2e- → H2', E0: 0.00, category: '参比电极', notes: '标准氢电极 (SHE)' },
  { halfReaction: 'AgCl + e- → Ag + Cl-', E0: 0.22, category: '参比电极', notes: '银/氯化银电极（饱和KCl）' },
  { halfReaction: 'Hg2Cl2 + 2e- → 2Hg + 2Cl-', E0: 0.27, category: '参比电极', notes: '饱和甘汞电极 (SCE)' },
  
  // 活泼金属
  { halfReaction: 'Pb2+ + 2e- → Pb', E0: -0.13, category: '重金属', notes: '铅' },
  { halfReaction: 'Sn2+ + 2e- → Sn', E0: -0.14, category: '重金属', notes: '锡' },
  { halfReaction: 'Ni2+ + 2e- → Ni', E0: -0.26, category: '过渡金属', notes: '镍' },
  { halfReaction: 'Co2+ + 2e- → Co', E0: -0.28, category: '过渡金属', notes: '钴' },
  { halfReaction: 'Cd2+ + 2e- → Cd', E0: -0.40, category: '重金属', notes: '镉' },
  { halfReaction: 'Fe2+ + 2e- → Fe', E0: -0.45, category: '过渡金属', notes: '铁' },
  { halfReaction: 'Cr3+ + 3e- → Cr', E0: -0.74, category: '过渡金属', notes: '铬' },
  { halfReaction: 'Zn2+ + 2e- → Zn', E0: -0.76, category: '过渡金属', notes: '锌' },
  { halfReaction: 'Mn2+ + 2e- → Mn', E0: -1.18, category: '过渡金属', notes: '锰' },
  { halfReaction: 'Al3+ + 3e- → Al', E0: -1.66, category: '活泼金属', notes: '铝' },
  { halfReaction: 'Mg2+ + 2e- → Mg', E0: -2.37, category: '活泼金属', notes: '镁' },
  { halfReaction: 'Na+ + e- → Na', E0: -2.71, category: '活泼金属', notes: '钠' },
  { halfReaction: 'Ca2+ + 2e- → Ca', E0: -2.87, category: '活泼金属', notes: '钙' },
  { halfReaction: 'K+ + e- → K', E0: -2.93, category: '活泼金属', notes: '钾' },
  { halfReaction: 'Li+ + e- → Li', E0: -3.05, category: '活泼金属', notes: '锂（最强还原剂）' },
  
  // 能源材料相关
  { halfReaction: 'O2 + 2H2O + 4e- → 4OH-', E0: 0.40, category: '氧还原', notes: 'ORR（碱性）' },
  { halfReaction: 'O2 + 4H+ + 4e- → 2H2O', E0: 1.23, category: '氧还原', notes: 'ORR（酸性）' },
  { halfReaction: '2H2O + 2e- → H2 + 2OH-', E0: -0.83, category: '氢析出', notes: 'HER（碱性）' },
  { halfReaction: '2H+ + 2e- → H2', E0: 0.00, category: '氢析出', notes: 'HER（酸性）' }
];

/**
 * 晶体场分裂能数据
 * 数据来源：配位化学教材
 * 单位：cm^-1 或 kJ/mol
 */
const CRYSTAL_FIELD_SPLITTING = [
  // 八面体配合物
  {
    complex: '[Ti(H2O)6]3+',
    geometry: '八面体',
    metal: 'Ti',
    oxidation: 3,
    dn: 'd1',
    delta: 20300,
    unit: 'cm-1',
    color: '紫色',
    magnetic: '顺磁性（1个未配对电子）',
    notes: 'Ti(III)八面体，d-d跃迁'
  },
  {
    complex: '[V(H2O)6]3+',
    geometry: '八面体',
    metal: 'V',
    oxidation: 3,
    dn: 'd2',
    delta: 17850,
    unit: 'cm-1',
    color: '绿色',
    magnetic: '顺磁性（2个未配对电子）',
    notes: 'V(III)八面体'
  },
  {
    complex: '[Cr(H2O)6]3+',
    geometry: '八面体',
    metal: 'Cr',
    oxidation: 3,
    dn: 'd3',
    delta: 17400,
    unit: 'cm-1',
    color: '蓝紫色',
    magnetic: '顺磁性（3个未配对电子）',
    notes: 'Cr(III)八面体，常见配合物'
  },
  {
    complex: '[Cr(NH3)6]3+',
    geometry: '八面体',
    metal: 'Cr',
    oxidation: 3,
    dn: 'd3',
    delta: 21600,
    unit: 'cm-1',
    color: '黄色',
    magnetic: '顺磁性',
    notes: 'NH3配体，场强较水大'
  },
  {
    complex: '[Cr(CN)6]3-',
    geometry: '八面体',
    metal: 'Cr',
    oxidation: 3,
    dn: 'd3',
    delta: 26600,
    unit: 'cm-1',
    color: '黄色',
    magnetic: '顺磁性',
    notes: 'CN-是强场配体'
  },
  {
    complex: '[Mn(H2O)6]2+',
    geometry: '八面体',
    metal: 'Mn',
    oxidation: 2,
    dn: 'd5',
    delta: 8500,
    unit: 'cm-1',
    color: '粉红色',
    magnetic: '顺磁性（5个未配对电子，高自旋）',
    notes: 'Mn(II)高自旋配合物'
  },
  {
    complex: '[Fe(H2O)6]2+',
    geometry: '八面体',
    metal: 'Fe',
    oxidation: 2,
    dn: 'd6',
    delta: 10400,
    unit: 'cm-1',
    color: '淡绿色',
    magnetic: '顺磁性（4个未配对电子，高自旋）',
    notes: 'Fe(II)高自旋'
  },
  {
    complex: '[Fe(CN)6]4-',
    geometry: '八面体',
    metal: 'Fe',
    oxidation: 2,
    dn: 'd6',
    delta: 33800,
    unit: 'cm-1',
    color: '黄色',
    magnetic: '抗磁性（低自旋）',
    notes: 'Fe(II)低自旋，CN-强场配体'
  },
  {
    complex: '[Co(H2O)6]2+',
    geometry: '八面体',
    metal: 'Co',
    oxidation: 2,
    dn: 'd7',
    delta: 9300,
    unit: 'cm-1',
    color: '粉红色',
    magnetic: '顺磁性（高自旋）',
    notes: 'Co(II)八面体，高自旋'
  },
  {
    complex: '[Co(NH3)6]3+',
    geometry: '八面体',
    metal: 'Co',
    oxidation: 3,
    dn: 'd6',
    delta: 22900,
    unit: 'cm-1',
    color: '橙黄色',
    magnetic: '抗磁性（低自旋）',
    notes: 'Co(III)低自旋，动力学惰性'
  },
  {
    complex: '[Ni(H2O)6]2+',
    geometry: '八面体',
    metal: 'Ni',
    oxidation: 2,
    dn: 'd8',
    delta: 8500,
    unit: 'cm-1',
    color: '绿色',
    magnetic: '顺磁性（2个未配对电子）',
    notes: 'Ni(II)八面体'
  },
  {
    complex: '[Cu(H2O)6]2+',
    geometry: '八面体（畸变）',
    metal: 'Cu',
    oxidation: 2,
    dn: 'd9',
    delta: 12600,
    unit: 'cm-1',
    color: '蓝色',
    magnetic: '顺磁性（1个未配对电子）',
    notes: 'Jahn-Teller畸变，实际为4+2配位'
  },
  {
    complex: '[Zn(H2O)6]2+',
    geometry: '八面体',
    metal: 'Zn',
    oxidation: 2,
    dn: 'd10',
    delta: 0,
    unit: 'cm-1',
    color: '无色',
    magnetic: '抗磁性',
    notes: 'd10电子构型，无d-d跃迁'
  },
  // 四面体配合物
  {
    complex: '[CoCl4]2-',
    geometry: '四面体',
    metal: 'Co',
    oxidation: 2,
    dn: 'd7',
    delta: 3300,
    unit: 'cm-1',
    color: '蓝色',
    magnetic: '顺磁性（高自旋）',
    notes: '四面体Δt约为八面体Δo的4/9'
  },
  {
    complex: '[NiCl4]2-',
    geometry: '四面体',
    metal: 'Ni',
    oxidation: 2,
    dn: 'd8',
    delta: 3850,
    unit: 'cm-1',
    color: '蓝绿色',
    magnetic: '顺磁性',
    notes: '四面体配合物'
  },
  // 平面四方配合物
  {
    complex: '[PtCl4]2-',
    geometry: '平面四方',
    metal: 'Pt',
    oxidation: 2,
    dn: 'd8',
    delta: 28000,
    unit: 'cm-1',
    color: '红棕色',
    magnetic: '抗磁性',
    notes: 'Pt(II)平面四方，低自旋'
  },
  {
    complex: '[Ni(CN)4]2-',
    geometry: '平面四方',
    metal: 'Ni',
    oxidation: 2,
    dn: 'd8',
    delta: 30500,
    unit: 'cm-1',
    color: '无色',
    magnetic: '抗磁性',
    notes: 'Ni(II)平面四方，强场'
  }
];

/**
 * 配体场强序列（分光化学序列）
 */
const SPECTROCHEMICAL_SERIES = {
  weakField: ['I-', 'Br-', 'S2-', 'SCN-', 'Cl-', 'NO3-', 'F-'],
  mediumField: ['OH-', 'C2O42-', 'H2O', 'NCS-', 'CH3CN', 'Py', 'NH3'],
  strongField: ['en', 'bipy', 'phen', 'NO2-', 'CN-', 'CO'],
  notes: '配体场强从弱到强的顺序，影响晶体场分裂能Δ的大小'
};

/**
 * 常见离子颜色
 */
const ION_COLORS = [
  { ion: 'Cr3+', color: '绿色/紫色', dn: 'd3', notes: '八面体配合物' },
  { ion: 'Mn2+', color: '粉红色', dn: 'd5', notes: '高自旋d5，颜色淡' },
  { ion: 'Fe2+', color: '淡绿色', dn: 'd6', notes: '易被氧化' },
  { ion: 'Fe3+', color: '黄褐色', dn: 'd5', notes: '水解显酸性' },
  { ion: 'Co2+', color: '粉红色', dn: 'd7', notes: '八面体' },
  { ion: 'Ni2+', color: '绿色', dn: 'd8', notes: '八面体' },
  { ion: 'Cu2+', color: '蓝色', dn: 'd9', notes: 'Jahn-Teller效应' },
  { ion: 'MnO4-', color: '紫色', dn: 'd0', notes: '电荷转移跃迁' },
  { ion: 'Cr2O72-', color: '橙红色', dn: 'd0', notes: '电荷转移跃迁' },
  { ion: 'CrO42-', color: '黄色', dn: 'd0', notes: '电荷转移跃迁' }
];

/**
 * 搜索缓冲液
 */
function searchBuffer(query) {
  const q = query.toLowerCase();
  return BUFFER_PKA_DATA.filter(buffer => 
    buffer.name.toLowerCase().includes(q) ||
    buffer.nameEn.toLowerCase().includes(q) ||
    buffer.abbreviation.toLowerCase().includes(q)
  );
}

/**
 * 根据pH范围查找合适的缓冲液
 */
function findBufferByPH(targetPH, tolerance = 0.5) {
  return BUFFER_PKA_DATA.filter(buffer => {
    const range = buffer.bufferRange.split('-').map(parseFloat);
    return targetPH >= (range[0] - tolerance) && targetPH <= (range[1] + tolerance);
  }).sort((a, b) => {
    // 优先选择optimal pH最接近目标pH的
    return Math.abs(a.optimalPH - targetPH) - Math.abs(b.optimalPH - targetPH);
  });
}

/**
 * 搜索溶剂
 */
function searchSolvent(query) {
  const q = query.toLowerCase();
  return SOLVENT_PROPERTIES.filter(solvent =>
    solvent.name.toLowerCase().includes(q) ||
    solvent.nameEn.toLowerCase().includes(q) ||
    solvent.formula.toLowerCase().includes(q)
  );
}

/**
 * 按极性排序溶剂
 */
function getSolventsByPolarity(ascending = true) {
  const sorted = [...SOLVENT_PROPERTIES].sort((a, b) => 
    ascending ? a.polarity - b.polarity : b.polarity - a.polarity
  );
  return sorted;
}

/**
 * 搜索电极电位
 */
function searchElectrodePotential(query) {
  const q = query.toLowerCase();
  return STANDARD_ELECTRODE_POTENTIALS.filter(electrode =>
    electrode.halfReaction.toLowerCase().includes(q) ||
    electrode.category.toLowerCase().includes(q)
  );
}

/**
 * 按电位排序
 */
function getElectrodePotentialsSorted(ascending = false) {
  return [...STANDARD_ELECTRODE_POTENTIALS].sort((a, b) =>
    ascending ? a.E0 - b.E0 : b.E0 - a.E0
  );
}

/**
 * 搜索晶体场分裂能
 */
function searchCrystalField(query) {
  const q = query.toLowerCase();
  return CRYSTAL_FIELD_SPLITTING.filter(cf =>
    cf.complex.toLowerCase().includes(q) ||
    cf.metal.toLowerCase().includes(q) ||
    cf.geometry.toLowerCase().includes(q)
  );
}

/**
 * 按金属离子分组
 */
function getCrystalFieldByMetal() {
  const grouped = {};
  CRYSTAL_FIELD_SPLITTING.forEach(cf => {
    if (!grouped[cf.metal]) {
      grouped[cf.metal] = [];
    }
    grouped[cf.metal].push(cf);
  });
  return grouped;
}

module.exports = {
  // 缓冲液相关
  BUFFER_PKA_DATA,
  searchBuffer,
  findBufferByPH,
  
  // 溶剂相关
  SOLVENT_PROPERTIES,
  searchSolvent,
  getSolventsByPolarity,
  
  // 电极电位相关
  STANDARD_ELECTRODE_POTENTIALS,
  searchElectrodePotential,
  getElectrodePotentialsSorted,
  
  // 晶体场相关
  CRYSTAL_FIELD_SPLITTING,
  SPECTROCHEMICAL_SERIES,
  ION_COLORS,
  searchCrystalField,
  getCrystalFieldByMetal
};

