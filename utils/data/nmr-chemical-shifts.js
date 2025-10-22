/**
 * NMR化学位移数据库
 * 包含常见溶剂、官能团、杂原子的1H-NMR和13C-NMR化学位移
 * 
 * @version 8.0.0
 * @author ChemTools Team
 * @dataSource SDBS, Cambridge Isotope Laboratories, 文献数据
 */

/**
 * 常见溶剂的NMR化学位移
 * 单位：ppm (相对于TMS)
 */
const SOLVENT_NMR_SHIFTS = [
  {
    solvent: 'CDCl3',
    name: '氘代氯仿',
    formula: 'CDCl3',
    proton: { shift: 7.26, multiplicity: 's', notes: '残留CHCl3' },
    carbon: { shift: 77.16, multiplicity: 't (1:1:1)', notes: 'CDCl3本身' },
    waterPeak: 1.56,
    notes: '最常用NMR溶剂'
  },
  {
    solvent: 'DMSO-d6',
    name: '氘代二甲亚砜',
    formula: 'CD3SOCD3',
    proton: { shift: 2.50, multiplicity: 'quintet', notes: '残留DMSO' },
    carbon: { shift: 39.52, multiplicity: 'septet', notes: 'CD3' },
    waterPeak: 3.33,
    notes: '极性溶剂，吸湿性强'
  },
  {
    solvent: 'D2O',
    name: '重水',
    formula: 'D2O',
    proton: { shift: 4.79, multiplicity: 's', notes: 'HDO' },
    carbon: null,
    waterPeak: null,
    notes: '水溶性化合物，需要外标'
  },
  {
    solvent: 'CD3CN',
    name: '氘代乙腈',
    formula: 'CD3CN',
    proton: { shift: 1.94, multiplicity: 'quintet', notes: '残留CH3CN' },
    carbon: { shift: 1.32, multiplicity: 'septet', notes: 'CD3' },
    waterPeak: 2.13,
    notes: '中等极性溶剂'
  },
  {
    solvent: 'CD3OD',
    name: '氘代甲醇',
    formula: 'CD3OD',
    proton: { shift: 3.31, multiplicity: 'quintet', notes: '残留CH3OH' },
    carbon: { shift: 49.00, multiplicity: 'septet', notes: 'CD3' },
    waterPeak: 4.87,
    notes: '质子溶剂，OH峰可交换'
  },
  {
    solvent: 'Acetone-d6',
    name: '氘代丙酮',
    formula: 'CD3COCD3',
    proton: { shift: 2.05, multiplicity: 'quintet', notes: '残留丙酮' },
    carbon: { shift: 29.84, multiplicity: 'septet', notes: 'CD3' },
    waterPeak: 2.84,
    notes: '常用溶剂'
  },
  {
    solvent: 'C6D6',
    name: '氘代苯',
    formula: 'C6D6',
    proton: { shift: 7.16, multiplicity: 's', notes: '残留C6H6' },
    carbon: { shift: 128.06, multiplicity: 't', notes: 'C6D6' },
    waterPeak: 0.40,
    notes: '非极性芳香溶剂'
  },
  {
    solvent: 'THF-d8',
    name: '氘代四氢呋喃',
    formula: 'C4D8O',
    proton: { shift: 1.72, multiplicity: 'm', notes: 'beta-H' },
    carbon: { shift: 25.31, multiplicity: 'm', notes: 'beta-C' },
    waterPeak: 2.45,
    notes: '常用醚类溶剂'
  },
  {
    solvent: 'Pyridine-d5',
    name: '氘代吡啶',
    formula: 'C5D5N',
    proton: { shift: 8.74, multiplicity: 'm', notes: 'ortho-H' },
    carbon: { shift: 123.87, multiplicity: 'm', notes: 'meta-C' },
    waterPeak: 4.96,
    notes: '碱性溶剂'
  },
  {
    solvent: 'Toluene-d8',
    name: '氘代甲苯',
    formula: 'C7D8',
    proton: { shift: 2.08, multiplicity: 's', notes: 'CH3' },
    carbon: { shift: 20.43, multiplicity: 'm', notes: 'CH3' },
    waterPeak: 0.40,
    notes: '非极性芳香溶剂'
  }
];

/**
 * 1H-NMR 化学位移参考数据
 * 单位：ppm (相对于TMS)
 */
const PROTON_NMR_SHIFTS = [
  // 烷基
  { group: 'R-CH3', name: '甲基', range: [0.8, 1.0], typical: 0.9, notes: '饱和烷基' },
  { group: 'R-CH2-R', name: '亚甲基', range: [1.2, 1.4], typical: 1.3, notes: '链中亚甲基' },
  { group: 'R3C-H', name: '叔碳氢', range: [1.4, 1.7], typical: 1.5, notes: '取代度影响' },
  
  // 烯烃和炔烃
  { group: '=CH2', name: '烯烃氢', range: [4.6, 5.0], typical: 4.8, notes: '末端烯烃' },
  { group: '=CH-', name: '烯烃次甲基', range: [5.2, 5.7], typical: 5.5, notes: '顺反异构影响' },
  { group: 'RC≡CH', name: '末端炔烃', range: [1.8, 3.1], typical: 2.5, notes: '特征峰' },
  
  // 芳香族
  { group: 'Ar-H', name: '芳香氢', range: [6.5, 8.5], typical: 7.3, notes: '苯环氢' },
  { group: 'Ar-CH3', name: '芳甲基', range: [2.2, 2.5], typical: 2.3, notes: '苯环上甲基' },
  
  // 醇和酚
  { group: 'R-OH', name: '醇羟基', range: [0.5, 5.5], typical: 2.0, notes: '可交换，浓度/温度依赖' },
  { group: 'Ar-OH', name: '酚羟基', range: [4.0, 7.0], typical: 5.5, notes: '氢键影响' },
  
  // 醛和酮
  { group: 'R-CHO', name: '醛基氢', range: [9.4, 10.0], typical: 9.7, notes: '最低场' },
  { group: 'R-CO-CH3', name: '甲基酮', range: [2.1, 2.6], typical: 2.3, notes: '羰基邻位' },
  
  // 羧酸和酯
  { group: 'R-COOH', name: '羧酸氢', range: [10.5, 13.0], typical: 12.0, notes: '极低场，可交换' },
  { group: 'R-COO-CH3', name: '酯甲基', range: [3.6, 3.9], typical: 3.7, notes: '酯氧邻位' },
  
  // 胺
  { group: 'R-NH2', name: '伯胺', range: [0.5, 5.0], typical: 1.5, notes: '可交换，宽峰' },
  { group: 'R2NH', name: '仲胺', range: [0.5, 5.0], typical: 2.0, notes: '可交换' },
  { group: 'Ar-NH2', name: '芳胺', range: [3.0, 5.0], typical: 3.5, notes: '氢键影响' },
  
  // 醚
  { group: 'R-O-CH3', name: '甲氧基', range: [3.3, 3.4], typical: 3.3, notes: '醚氧邻位' },
  { group: 'R-O-CH2-R', name: '醚亚甲基', range: [3.4, 3.6], typical: 3.5, notes: '醚氧邻位' },
  
  // 卤代烃
  { group: 'R-CH2-Cl', name: '氯代亚甲基', range: [3.6, 3.8], typical: 3.7, notes: 'Cl邻位' },
  { group: 'R-CH2-Br', name: '溴代亚甲基', range: [3.4, 3.6], typical: 3.5, notes: 'Br邻位' },
  { group: 'R-CH2-I', name: '碘代亚甲基', range: [3.1, 3.3], typical: 3.2, notes: 'I邻位' },
  
  // 硝基和腈
  { group: 'R-NO2', name: '硝基邻位', range: [4.1, 4.4], typical: 4.3, notes: '吸电子基团' },
  { group: 'R-CN', name: '腈基邻位', range: [2.1, 2.3], typical: 2.2, notes: '弱吸电子' },
  
  // 杂环
  { group: 'Pyridine H', name: '吡啶氢', range: [7.0, 8.7], typical: 7.8, notes: '位置依赖' },
  { group: 'Furan H', name: '呋喃氢', range: [6.2, 7.4], typical: 6.8, notes: '芳香杂环' },
  { group: 'Thiophene H', name: '噻吩氢', range: [6.9, 7.3], typical: 7.1, notes: '芳香杂环' }
];

/**
 * 13C-NMR 化学位移参考数据
 * 单位：ppm (相对于TMS)
 */
const CARBON_NMR_SHIFTS = [
  // 烷基碳
  { group: 'R-CH3', name: '甲基碳', range: [5, 20], typical: 15, notes: '饱和烷基' },
  { group: 'R-CH2-R', name: '亚甲基碳', range: [20, 30], typical: 25, notes: '链中碳' },
  { group: 'R2CH-R', name: '次甲基碳', range: [30, 50], typical: 40, notes: '取代度影响' },
  { group: 'R3C-R', name: '季碳', range: [30, 40], typical: 35, notes: '无氢季碳' },
  
  // 烯烃和炔烃碳
  { group: '=CH2', name: '烯烃碳', range: [110, 120], typical: 115, notes: '末端烯烃' },
  { group: '=CH-', name: '烯烃次甲基', range: [120, 140], typical: 130, notes: '内部烯烃' },
  { group: 'RC≡C', name: '炔烃碳', range: [70, 90], typical: 80, notes: '三键碳' },
  
  // 芳香族碳
  { group: 'Ar-C', name: '芳香碳', range: [110, 160], typical: 128, notes: '苯环碳' },
  { group: 'Ar-CH3', name: '芳甲基', range: [19, 22], typical: 21, notes: '苯环上甲基' },
  
  // 羰基碳
  { group: 'R-CHO', name: '醛基碳', range: [190, 205], typical: 200, notes: '最低场' },
  { group: 'R-CO-R', name: '酮羰基', range: [200, 220], typical: 210, notes: '对称酮' },
  { group: 'Ar-CO-R', name: '芳酮', range: [195, 200], typical: 197, notes: '芳香酮' },
  { group: 'R-COOH', name: '羧基碳', range: [165, 185], typical: 175, notes: '酸性羰基' },
  { group: 'R-COO-R', name: '酯羰基', range: [160, 175], typical: 170, notes: '酯基' },
  { group: 'R-CO-NH2', name: '酰胺羰基', range: [165, 180], typical: 173, notes: '酰胺' },
  
  // 醇醚碳
  { group: 'R-CH2-OH', name: '醇碳', range: [50, 70], typical: 60, notes: '羟基邻位' },
  { group: 'R-O-CH3', name: '甲氧基', range: [50, 60], typical: 55, notes: '醚氧邻位' },
  { group: 'R-O-CH2-R', name: '醚碳', range: [60, 75], typical: 68, notes: '醚氧邻位' },
  
  // 胺碳
  { group: 'R-CH2-NH2', name: '胺碳', range: [35, 50], typical: 42, notes: '氮邻位' },
  { group: 'R-N(CH3)2', name: 'N-二甲基', range: [35, 45], typical: 40, notes: '胺甲基' },
  
  // 卤代碳
  { group: 'R-CH2-Cl', name: '氯代碳', range: [40, 50], typical: 45, notes: 'Cl邻位' },
  { group: 'R-CH2-Br', name: '溴代碳', range: [25, 35], typical: 30, notes: 'Br邻位' },
  { group: 'R-CH2-I', name: '碘代碳', range: [5, 15], typical: 10, notes: 'I邻位，高场' },
  
  // 腈和硝基
  { group: 'R-CN', name: '腈碳', range: [115, 125], typical: 120, notes: '三键碳' },
  { group: 'R-NO2', name: '硝基邻位', range: [70, 85], typical: 78, notes: '强吸电子' }
];

/**
 * 常见化合物的完整NMR数据
 */
const COMMON_COMPOUNDS_NMR = [
  {
    compound: '乙酸乙酯',
    formula: 'CH3COOCH2CH3',
    protonNMR: [
      { position: 'CH3CO-', shift: 2.04, multiplicity: 's', integration: 3, notes: '酮甲基' },
      { position: '-OCH2-', shift: 4.12, multiplicity: 'q', J: 7.2, integration: 2, notes: '酯氧邻位' },
      { position: '-CH3', shift: 1.26, multiplicity: 't', J: 7.2, integration: 3, notes: '甲基' }
    ],
    carbonNMR: [
      { position: 'C=O', shift: 171.0, notes: '酯羰基' },
      { position: '-OCH2-', shift: 60.5, notes: '酯氧邻位' },
      { position: 'CH3CO-', shift: 21.0, notes: '酮甲基' },
      { position: '-CH3', shift: 14.2, notes: '甲基' }
    ],
    solvent: 'CDCl3'
  },
  {
    compound: '苯甲醛',
    formula: 'C6H5CHO',
    protonNMR: [
      { position: 'CHO', shift: 10.0, multiplicity: 's', integration: 1, notes: '醛基' },
      { position: 'ortho-H', shift: 7.87, multiplicity: 'd', J: 7.5, integration: 2, notes: '邻位' },
      { position: 'meta-H', shift: 7.60, multiplicity: 't', J: 7.5, integration: 2, notes: '间位' },
      { position: 'para-H', shift: 7.52, multiplicity: 't', J: 7.5, integration: 1, notes: '对位' }
    ],
    carbonNMR: [
      { position: 'CHO', shift: 192.0, notes: '醛羰基' },
      { position: 'ipso-C', shift: 136.0, notes: '羰基连接碳' },
      { position: 'ortho-C', shift: 129.0, notes: '邻位碳' },
      { position: 'meta-C', shift: 129.5, notes: '间位碳' },
      { position: 'para-C', shift: 134.0, notes: '对位碳' }
    ],
    solvent: 'CDCl3'
  },
  {
    compound: '对硝基苯胺',
    formula: '4-NO2-C6H4-NH2',
    protonNMR: [
      { position: 'NH2', shift: 4.10, multiplicity: 'br s', integration: 2, notes: '伯胺' },
      { position: 'H-2,6', shift: 8.10, multiplicity: 'd', J: 8.8, integration: 2, notes: 'NO2邻位' },
      { position: 'H-3,5', shift: 6.62, multiplicity: 'd', J: 8.8, integration: 2, notes: 'NH2邻位' }
    ],
    carbonNMR: [
      { position: 'C-1 (NH2)', shift: 153.0, notes: '胺连接碳' },
      { position: 'C-4 (NO2)', shift: 137.0, notes: '硝基连接碳' },
      { position: 'C-2,6', shift: 126.0, notes: '硝基邻位碳' },
      { position: 'C-3,5', shift: 113.0, notes: '胺邻位碳' }
    ],
    solvent: 'DMSO-d6'
  },
  {
    compound: '苯乙酮',
    formula: 'C6H5COCH3',
    protonNMR: [
      { position: 'COCH3', shift: 2.58, multiplicity: 's', integration: 3, notes: '酮甲基' },
      { position: 'ortho-H', shift: 7.96, multiplicity: 'd', J: 7.5, integration: 2, notes: '邻位' },
      { position: 'meta-H', shift: 7.58, multiplicity: 't', J: 7.5, integration: 2, notes: '间位' },
      { position: 'para-H', shift: 7.47, multiplicity: 't', J: 7.5, integration: 1, notes: '对位' }
    ],
    carbonNMR: [
      { position: 'C=O', shift: 198.0, notes: '酮羰基' },
      { position: 'ipso-C', shift: 137.0, notes: '羰基连接碳' },
      { position: 'ortho-C', shift: 128.5, notes: '邻位碳' },
      { position: 'meta-C', shift: 128.3, notes: '间位碳' },
      { position: 'para-C', shift: 133.0, notes: '对位碳' },
      { position: 'CH3', shift: 26.5, notes: '酮甲基' }
    ],
    solvent: 'CDCl3'
  },
  {
    compound: '苯甲醇',
    formula: 'C6H5CH2OH',
    protonNMR: [
      { position: 'CH2', shift: 4.65, multiplicity: 's', integration: 2, notes: '亚甲基' },
      { position: 'OH', shift: 2.15, multiplicity: 'br s', integration: 1, notes: '羟基，可交换' },
      { position: 'Ar-H', shift: 7.35, multiplicity: 'm', integration: 5, notes: '芳香氢' }
    ],
    carbonNMR: [
      { position: 'CH2', shift: 65.0, notes: '亚甲基' },
      { position: 'ipso-C', shift: 141.0, notes: 'CH2连接碳' },
      { position: 'Ar-C', shift: 127.5, notes: '芳香碳（平均）' }
    ],
    solvent: 'CDCl3'
  }
];

/**
 * NMR耦合常数典型值
 * 单位：Hz
 */
const COUPLING_CONSTANTS = [
  { type: '3J(H-H) vicinal', name: '邻位偶合', range: [6, 8], typical: 7, notes: '二面角依赖' },
  { type: '2J(H-H) geminal', name: '偕位偶合', range: [10, 16], typical: 13, notes: '同碳上' },
  { type: '3J(H-H) trans', name: '反式烯烃', range: [12, 18], typical: 15, notes: '大偶合常数' },
  { type: '3J(H-H) cis', name: '顺式烯烃', range: [6, 12], typical: 9, notes: '中等偶合' },
  { type: '3J(H-H) ortho', name: '芳环邻位', range: [7, 10], typical: 8, notes: '芳香偶合' },
  { type: '4J(H-H) meta', name: '芳环间位', range: [1, 3], typical: 2, notes: '小偶合' },
  { type: '5J(H-H) para', name: '芳环对位', range: [0, 1], typical: 0.5, notes: '很小' }
];

/**
 * 搜索溶剂NMR数据
 */
function searchSolventNMR(query) {
  const q = query.toLowerCase();
  return SOLVENT_NMR_SHIFTS.filter(s =>
    s.solvent.toLowerCase().includes(q) ||
    s.name.toLowerCase().includes(q)
  );
}

/**
 * 搜索质子NMR位移
 */
function searchProtonShift(query) {
  const q = query.toLowerCase();
  return PROTON_NMR_SHIFTS.filter(s =>
    s.group.toLowerCase().includes(q) ||
    s.name.toLowerCase().includes(q)
  );
}

/**
 * 搜索碳NMR位移
 */
function searchCarbonShift(query) {
  const q = query.toLowerCase();
  return CARBON_NMR_SHIFTS.filter(s =>
    s.group.toLowerCase().includes(q) ||
    s.name.toLowerCase().includes(q)
  );
}

/**
 * 搜索常见化合物NMR
 */
function searchCompoundNMR(query) {
  const q = query.toLowerCase();
  return COMMON_COMPOUNDS_NMR.filter(c =>
    c.compound.toLowerCase().includes(q) ||
    c.formula.toLowerCase().includes(q)
  );
}

/**
 * 按化学位移范围查找官能团
 */
function findGroupByShift(shift, nucleus = 'H') {
  const data = nucleus === 'H' ? PROTON_NMR_SHIFTS : CARBON_NMR_SHIFTS;
  
  return data.filter(item => {
    return shift >= item.range[0] && shift <= item.range[1];
  }).sort((a, b) => {
    // 按与typical值的接近程度排序
    return Math.abs(a.typical - shift) - Math.abs(b.typical - shift);
  });
}

/**
 * 统计信息
 */
function getStatistics() {
  return {
    solvents: SOLVENT_NMR_SHIFTS.length,
    protonShifts: PROTON_NMR_SHIFTS.length,
    carbonShifts: CARBON_NMR_SHIFTS.length,
    compounds: COMMON_COMPOUNDS_NMR.length,
    couplingConstants: COUPLING_CONSTANTS.length,
    total: SOLVENT_NMR_SHIFTS.length + PROTON_NMR_SHIFTS.length + 
           CARBON_NMR_SHIFTS.length + COMMON_COMPOUNDS_NMR.length + 
           COUPLING_CONSTANTS.length
  };
}

module.exports = {
  SOLVENT_NMR_SHIFTS,
  PROTON_NMR_SHIFTS,
  CARBON_NMR_SHIFTS,
  COMMON_COMPOUNDS_NMR,
  COUPLING_CONSTANTS,
  searchSolventNMR,
  searchProtonShift,
  searchCarbonShift,
  searchCompoundNMR,
  findGroupByShift,
  getStatistics
};

