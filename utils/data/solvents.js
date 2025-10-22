// UTF-8, no BOM
// 溶剂数据库
// 数据来源：CRC Handbook of Chemistry and Physics

const SOLVENT_DATA = [
  {
    name: '水',
    nameEn: 'Water',
    formula: 'H2O',
    cas: '7732-18-5',
    polarity: 10.2,
    boilingPoint: 100,
    meltingPoint: 0,
    density: 1.00,
    viscosity: 0.89,
    dielectricConstant: 78.5,
    refractiveIndex: 1.333,
    uvCutoff: 190,
    safety: 'low',
    evaporationRate: 'slow',
    miscibility: {
      water: 'yes',
      alcohols: 'yes',
      ethers: 'partial'
    },
    applications: ['水溶液', '重结晶', '萃取'],
    notes: '通用溶剂，极性最强'
  },
  {
    name: '甲醇',
    nameEn: 'Methanol',
    formula: 'CH3OH',
    cas: '67-56-1',
    polarity: 5.1,
    boilingPoint: 64.7,
    meltingPoint: -97.6,
    density: 0.79,
    viscosity: 0.54,
    dielectricConstant: 32.7,
    refractiveIndex: 1.328,
    uvCutoff: 205,
    safety: 'high',
    evaporationRate: 'fast',
    miscibility: {
      water: 'yes',
      alcohols: 'yes',
      ethers: 'yes'
    },
    applications: ['HPLC', '萃取', '重结晶'],
    notes: '⚠️ 剧毒！损害视神经，严禁口服'
  },
  {
    name: '乙醇',
    nameEn: 'Ethanol',
    formula: 'C2H5OH',
    cas: '64-17-5',
    polarity: 4.3,
    boilingPoint: 78.4,
    meltingPoint: -114.1,
    density: 0.79,
    viscosity: 1.08,
    dielectricConstant: 24.5,
    refractiveIndex: 1.361,
    uvCutoff: 210,
    safety: 'low',
    evaporationRate: 'medium',
    miscibility: {
      water: 'yes',
      alcohols: 'yes',
      ethers: 'yes'
    },
    applications: ['溶剂', '重结晶', '洗涤'],
    notes: '常用安全溶剂'
  },
  {
    name: '异丙醇',
    nameEn: 'Isopropanol',
    formula: 'C3H7OH',
    cas: '67-63-0',
    polarity: 3.9,
    boilingPoint: 82.6,
    meltingPoint: -89.5,
    density: 0.78,
    viscosity: 2.04,
    dielectricConstant: 19.9,
    refractiveIndex: 1.377,
    uvCutoff: 210,
    safety: 'low',
    evaporationRate: 'medium',
    miscibility: {
      water: 'yes',
      alcohols: 'yes',
      ethers: 'yes'
    },
    applications: ['清洗', '萃取'],
    notes: '清洗常用，挥发较慢'
  },
  {
    name: '丙酮',
    nameEn: 'Acetone',
    formula: 'C3H6O',
    cas: '67-64-1',
    polarity: 5.1,
    boilingPoint: 56.1,
    meltingPoint: -94.7,
    density: 0.78,
    viscosity: 0.30,
    dielectricConstant: 20.7,
    refractiveIndex: 1.359,
    uvCutoff: 330,
    safety: 'medium',
    evaporationRate: 'very fast',
    miscibility: {
      water: 'yes',
      alcohols: 'yes',
      ethers: 'yes'
    },
    applications: ['清洗', '萃取', '溶剂'],
    notes: '挥发性极强，易燃'
  },
  {
    name: 'DMF',
    nameEn: 'N,N-Dimethylformamide',
    formula: 'C3H7NO',
    cas: '68-12-2',
    polarity: 6.4,
    boilingPoint: 153,
    meltingPoint: -61,
    density: 0.95,
    viscosity: 0.80,
    dielectricConstant: 36.7,
    refractiveIndex: 1.430,
    uvCutoff: 270,
    safety: 'high',
    evaporationRate: 'slow',
    miscibility: {
      water: 'yes',
      alcohols: 'yes',
      ethers: 'yes'
    },
    applications: ['反应溶剂', '电化学', '溶解高分子'],
    notes: '⚠️ 对肝脏有损害，孕妇禁用，必须在通风柜中操作'
  },
  {
    name: 'DMSO',
    nameEn: 'Dimethyl sulfoxide',
    formula: 'C2H6OS',
    cas: '67-68-5',
    polarity: 7.2,
    boilingPoint: 189,
    meltingPoint: 18.5,
    density: 1.10,
    viscosity: 1.99,
    dielectricConstant: 46.7,
    refractiveIndex: 1.479,
    uvCutoff: 268,
    safety: 'medium',
    evaporationRate: 'very slow',
    miscibility: {
      water: 'yes',
      alcohols: 'yes',
      ethers: 'yes'
    },
    applications: ['反应溶剂', '低温反应', '细胞冻存'],
    notes: '⚠️ 可携带其他化学品透过皮肤'
  },
  {
    name: '乙腈',
    nameEn: 'Acetonitrile',
    formula: 'CH3CN',
    cas: '75-05-8',
    polarity: 5.8,
    boilingPoint: 81.6,
    meltingPoint: -48.8,
    density: 0.78,
    viscosity: 0.34,
    dielectricConstant: 37.5,
    refractiveIndex: 1.344,
    uvCutoff: 190,
    safety: 'medium',
    evaporationRate: 'fast',
    miscibility: {
      water: 'yes',
      alcohols: 'yes',
      ethers: 'yes'
    },
    applications: ['HPLC', '萃取', '反应溶剂'],
    notes: 'HPLC常用，极性适中'
  },
  {
    name: '乙酸乙酯',
    nameEn: 'Ethyl acetate',
    formula: 'C4H8O2',
    cas: '141-78-6',
    polarity: 4.4,
    boilingPoint: 77.1,
    meltingPoint: -83.6,
    density: 0.90,
    viscosity: 0.42,
    dielectricConstant: 6.0,
    refractiveIndex: 1.372,
    uvCutoff: 256,
    safety: 'low',
    evaporationRate: 'fast',
    miscibility: {
      water: 'partial',
      alcohols: 'yes',
      ethers: 'yes'
    },
    applications: ['萃取', '重结晶', '柱层析'],
    notes: '常用萃取溶剂'
  },
  {
    name: '四氢呋喃',
    nameEn: 'Tetrahydrofuran',
    formula: 'C4H8O',
    cas: '109-99-9',
    polarity: 4.0,
    boilingPoint: 66,
    meltingPoint: -108.4,
    density: 0.89,
    viscosity: 0.46,
    dielectricConstant: 7.6,
    refractiveIndex: 1.407,
    uvCutoff: 212,
    safety: 'medium',
    evaporationRate: 'fast',
    miscibility: {
      water: 'yes',
      alcohols: 'yes',
      ethers: 'yes'
    },
    applications: ['聚合反应', 'GPC溶剂'],
    notes: '⚠️ 易形成爆炸性过氧化物'
  },
  {
    name: '二氯甲烷',
    nameEn: 'Dichloromethane',
    formula: 'CH2Cl2',
    cas: '75-09-2',
    polarity: 3.1,
    boilingPoint: 39.6,
    meltingPoint: -96.7,
    density: 1.33,
    viscosity: 0.41,
    dielectricConstant: 8.9,
    refractiveIndex: 1.424,
    uvCutoff: 233,
    safety: 'high',
    evaporationRate: 'very fast',
    miscibility: {
      water: 'no',
      alcohols: 'yes',
      ethers: 'yes'
    },
    applications: ['萃取', '柱层析', '反应溶剂'],
    notes: '⚠️ 疑似致癌物，必须在通风柜操作'
  },
  {
    name: '氯仿',
    nameEn: 'Chloroform',
    formula: 'CHCl3',
    cas: '67-66-3',
    polarity: 4.1,
    boilingPoint: 61.2,
    meltingPoint: -63.5,
    density: 1.48,
    viscosity: 0.54,
    dielectricConstant: 4.8,
    refractiveIndex: 1.446,
    uvCutoff: 245,
    safety: 'high',
    evaporationRate: 'fast',
    miscibility: {
      water: 'no',
      alcohols: 'yes',
      ethers: 'yes'
    },
    applications: ['NMR溶剂', '萃取'],
    notes: '⚠️ 疑似致癌物，光照下分解产生光气'
  },
  {
    name: '正己烷',
    nameEn: 'n-Hexane',
    formula: 'C6H14',
    cas: '110-54-3',
    polarity: 0.1,
    boilingPoint: 68.7,
    meltingPoint: -95,
    density: 0.66,
    viscosity: 0.30,
    dielectricConstant: 1.9,
    refractiveIndex: 1.375,
    uvCutoff: 200,
    safety: 'high',
    evaporationRate: 'fast',
    miscibility: {
      water: 'no',
      alcohols: 'no',
      ethers: 'yes'
    },
    applications: ['萃取', '重结晶', '柱层析'],
    notes: '⚠️ 对神经系统有损害，影响生育'
  },
  {
    name: '甲苯',
    nameEn: 'Toluene',
    formula: 'C7H8',
    cas: '108-88-3',
    polarity: 2.4,
    boilingPoint: 110.6,
    meltingPoint: -95,
    density: 0.87,
    viscosity: 0.55,
    dielectricConstant: 2.4,
    refractiveIndex: 1.497,
    uvCutoff: 286,
    safety: 'medium',
    evaporationRate: 'medium',
    miscibility: {
      water: 'no',
      alcohols: 'yes',
      ethers: 'yes'
    },
    applications: ['反应溶剂', '重结晶', '清洗'],
    notes: '有神经毒性，孕妇禁用'
  },
  {
    name: '乙醚',
    nameEn: 'Diethyl ether',
    formula: 'C4H10O',
    cas: '60-29-7',
    polarity: 2.8,
    boilingPoint: 34.6,
    meltingPoint: -116.3,
    density: 0.71,
    viscosity: 0.22,
    dielectricConstant: 4.3,
    refractiveIndex: 1.353,
    uvCutoff: 218,
    safety: 'high',
    evaporationRate: 'very fast',
    miscibility: {
      water: 'partial',
      alcohols: 'yes',
      ethers: 'yes'
    },
    applications: ['萃取', 'Grignard反应'],
    notes: '⚠️ 极易燃，易形成过氧化物'
  }
];

/**
 * 搜索溶剂
 */
function searchSolvent(query) {
  const q = query.toLowerCase().trim();
  return SOLVENT_DATA.filter(solvent =>
    solvent.name.includes(q) ||
    solvent.nameEn.toLowerCase().includes(q) ||
    solvent.formula.toLowerCase().includes(q) ||
    solvent.cas.includes(q)
  );
}

/**
 * 按极性筛选
 */
function filterByPolarity(minPolarity, maxPolarity) {
  return SOLVENT_DATA.filter(s => 
    s.polarity >= minPolarity && s.polarity <= maxPolarity
  );
}

/**
 * 按沸点筛选
 */
function filterByBoilingPoint(minBP, maxBP) {
  return SOLVENT_DATA.filter(s => 
    s.boilingPoint >= minBP && s.boilingPoint <= maxBP
  );
}

/**
 * 按安全等级筛选
 */
function filterBySafety(level) {
  // level: 'low', 'medium', 'high'
  return SOLVENT_DATA.filter(s => s.safety === level);
}

/**
 * 获取所有溶剂
 */
function getAllSolvents() {
  return SOLVENT_DATA;
}

/**
 * 溶剂对比
 */
function compareSolvents(solventNames) {
  return SOLVENT_DATA.filter(s => solventNames.includes(s.name));
}

module.exports = {
  SOLVENT_DATA,
  searchSolvent,
  filterByPolarity,
  filterByBoilingPoint,
  filterBySafety,
  getAllSolvents,
  compareSolvents
};

