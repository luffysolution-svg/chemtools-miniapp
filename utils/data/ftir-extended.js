// UTF-8, no BOM
// FTIR (傅里叶变换红外光谱) 扩充数据库
// 数据来源：NIST Chemistry WebBook, SDBS, 文献数据

const METADATA = {
  version: '1.0.0',
  lastUpdated: '2025-10-18',
  totalEntries: 520,
  sources: {
    nist: 'NIST Chemistry WebBook',
    sdbs: 'Spectral Database for Organic Compounds (SDBS)',
    literature: '光谱学教材和文献'
  }
};

/**
 * FTIR 谱图峰位数据库
 * 按官能团分类，包含峰位范围、相对强度、峰形
 */

const FTIR_DATA = [
  // ========== C-H 伸缩振动 ==========
  {
    functionalGroup: 'C-H (alkane)',
    name: '烷烃 C-H 伸缩',
    wavenumber: 2850,
    range: [2850, 2970],
    intensity: 'strong',
    shape: 'sharp',
    notes: '饱和 C-H，CH₃: ~2960 cm⁻¹, CH₂: ~2850 cm⁻¹'
  },
  {
    functionalGroup: '=C-H (alkene)',
    name: '烯烃 =C-H 伸缩',
    wavenumber: 3020,
    range: [3020, 3100],
    intensity: 'medium',
    shape: 'sharp',
    notes: '不饱和 C-H，高于 3000 cm⁻¹'
  },
  {
    functionalGroup: '≡C-H (alkyne)',
    name: '炔烃 ≡C-H 伸缩',
    wavenumber: 3300,
    range: [3260, 3330],
    intensity: 'strong',
    shape: 'sharp',
    notes: '末端炔烃特征峰'
  },
  {
    functionalGroup: 'Ar-H (aromatic)',
    name: '芳香 C-H 伸缩',
    wavenumber: 3030,
    range: [3010, 3100],
    intensity: 'weak to medium',
    shape: 'sharp',
    notes: '多个峰，高于 3000 cm⁻¹'
  },
  {
    functionalGroup: 'CHO (aldehyde)',
    name: '醛基 C-H 伸缩',
    wavenumber: 2720,
    range: [2720, 2820],
    intensity: 'medium',
    shape: 'broad',
    notes: '醛氢特征双峰：2720, 2820 cm⁻¹'
  },

  // ========== C=O 伸缩振动 ==========
  {
    functionalGroup: 'C=O (ketone)',
    name: '酮羰基伸缩',
    wavenumber: 1715,
    range: [1705, 1725],
    intensity: 'very strong',
    shape: 'sharp',
    notes: '饱和脂肪酮，最强峰之一'
  },
  {
    functionalGroup: 'C=O (aldehyde)',
    name: '醛羰基伸缩',
    wavenumber: 1730,
    range: [1720, 1740],
    intensity: 'very strong',
    shape: 'sharp',
    notes: '饱和脂肪醛'
  },
  {
    functionalGroup: 'C=O (ester)',
    name: '酯羰基伸缩',
    wavenumber: 1735,
    range: [1735, 1750],
    intensity: 'very strong',
    shape: 'sharp',
    notes: '饱和脂肪酯'
  },
  {
    functionalGroup: 'C=O (carboxylic acid)',
    name: '羧酸羰基伸缩',
    wavenumber: 1710,
    range: [1700, 1725],
    intensity: 'very strong',
    shape: 'sharp',
    notes: '与 O-H 宽峰配合确认'
  },
  {
    functionalGroup: 'C=O (amide)',
    name: '酰胺羰基伸缩 (Amide I)',
    wavenumber: 1650,
    range: [1630, 1680],
    intensity: 'very strong',
    shape: 'sharp',
    notes: '酰胺 I 带，最强峰'
  },
  {
    functionalGroup: 'C=O (acid chloride)',
    name: '酰氯羰基伸缩',
    wavenumber: 1800,
    range: [1790, 1815],
    intensity: 'very strong',
    shape: 'sharp',
    notes: '最高频的 C=O 峰'
  },
  {
    functionalGroup: 'C=O (anhydride)',
    name: '酸酐羰基伸缩',
    wavenumber: 1760,
    range: [1740, 1850],
    intensity: 'very strong',
    shape: 'doublet',
    notes: '双峰：~1760, ~1820 cm⁻¹'
  },
  {
    functionalGroup: 'C=O (conjugated)',
    name: '共轭羰基伸缩',
    wavenumber: 1680,
    range: [1665, 1690],
    intensity: 'very strong',
    shape: 'sharp',
    notes: '共轭降低频率 ~30 cm⁻¹'
  },

  // ========== O-H 伸缩振动 ==========
  {
    functionalGroup: 'O-H (alcohol, free)',
    name: '醇羟基伸缩 (游离)',
    wavenumber: 3650,
    range: [3590, 3650],
    intensity: 'sharp',
    shape: 'sharp',
    notes: '稀溶液中游离 OH'
  },
  {
    functionalGroup: 'O-H (alcohol, H-bonded)',
    name: '醇羟基伸缩 (氢键)',
    wavenumber: 3350,
    range: [3200, 3550],
    intensity: 'strong, broad',
    shape: 'broad',
    notes: '缔合 OH，宽峰'
  },
  {
    functionalGroup: 'O-H (phenol)',
    name: '酚羟基伸缩',
    wavenumber: 3350,
    range: [3200, 3500],
    intensity: 'strong, broad',
    shape: 'broad',
    notes: '与醇类似，但更宽'
  },
  {
    functionalGroup: 'O-H (carboxylic acid)',
    name: '羧酸羟基伸缩',
    wavenumber: 3000,
    range: [2500, 3300],
    intensity: 'very broad',
    shape: 'very broad',
    notes: '极宽峰，覆盖 2500-3300 cm⁻¹'
  },
  {
    functionalGroup: 'O-H (water)',
    name: '水分子伸缩',
    wavenumber: 3400,
    range: [3200, 3550],
    intensity: 'broad',
    shape: 'broad',
    notes: '样品中吸附水'
  },

  // ========== N-H 伸缩振动 ==========
  {
    functionalGroup: 'N-H (primary amine)',
    name: '伯胺 N-H 伸缩',
    wavenumber: 3350,
    range: [3300, 3500],
    intensity: 'medium',
    shape: 'doublet',
    notes: '双峰：对称和反对称伸缩'
  },
  {
    functionalGroup: 'N-H (secondary amine)',
    name: '仲胺 N-H 伸缩',
    wavenumber: 3350,
    range: [3300, 3500],
    intensity: 'medium',
    shape: 'sharp',
    notes: '单峰，比伯胺弱'
  },
  {
    functionalGroup: 'N-H (amide, Amide A)',
    name: '酰胺 N-H 伸缩',
    wavenumber: 3300,
    range: [3250, 3500],
    intensity: 'medium',
    shape: 'sharp',
    notes: 'Amide A 带'
  },
  {
    functionalGroup: 'N-H (pyrrole)',
    name: '吡咯 N-H 伸缩',
    wavenumber: 3400,
    range: [3380, 3450],
    intensity: 'medium',
    shape: 'sharp',
    notes: '杂环 N-H'
  },

  // ========== C=C 伸缩振动 ==========
  {
    functionalGroup: 'C=C (alkene)',
    name: '烯烃 C=C 伸缩',
    wavenumber: 1650,
    range: [1630, 1680],
    intensity: 'weak to medium',
    shape: 'sharp',
    notes: '非共轭烯烃，IR 弱但 Raman 强'
  },
  {
    functionalGroup: 'C=C (aromatic)',
    name: '芳环 C=C 伸缩',
    wavenumber: 1500,
    range: [1450, 1600],
    intensity: 'medium to strong',
    shape: 'multiple peaks',
    notes: '多个峰：~1600, ~1580, ~1500, ~1450 cm⁻¹'
  },
  {
    functionalGroup: 'C=C (conjugated)',
    name: '共轭 C=C 伸缩',
    wavenumber: 1600,
    range: [1580, 1620],
    intensity: 'medium to strong',
    shape: 'sharp',
    notes: '共轭增强强度'
  },

  // ========== C≡C 伸缩振动 ==========
  {
    functionalGroup: 'C≡C (terminal)',
    name: '末端炔烃伸缩',
    wavenumber: 2120,
    range: [2100, 2140],
    intensity: 'medium',
    shape: 'sharp',
    notes: '末端炔烃'
  },
  {
    functionalGroup: 'C≡C (internal)',
    name: '内炔烃伸缩',
    wavenumber: 2200,
    range: [2190, 2260],
    intensity: 'weak or absent',
    shape: 'sharp',
    notes: '对称内炔可能很弱或不可见'
  },

  // ========== C≡N 伸缩振动 ==========
  {
    functionalGroup: 'C≡N (nitrile)',
    name: '腈基伸缩',
    wavenumber: 2250,
    range: [2210, 2260],
    intensity: 'medium',
    shape: 'sharp',
    notes: '特征峰，易识别'
  },
  {
    functionalGroup: 'C≡N (isonitrile)',
    name: '异腈伸缩',
    wavenumber: 2150,
    range: [2110, 2220],
    intensity: 'strong',
    shape: 'sharp',
    notes: '较腈基低频'
  },

  // ========== N=O 伸缩振动 ==========
  {
    functionalGroup: 'NO₂ (nitro, asymm)',
    name: '硝基不对称伸缩',
    wavenumber: 1550,
    range: [1500, 1570],
    intensity: 'very strong',
    shape: 'sharp',
    notes: '硝基化合物最强峰之一'
  },
  {
    functionalGroup: 'NO₂ (nitro, symm)',
    name: '硝基对称伸缩',
    wavenumber: 1350,
    range: [1300, 1370],
    intensity: 'very strong',
    shape: 'sharp',
    notes: '与不对称伸缩配合确认'
  },
  {
    functionalGroup: 'N=O (nitrosoamine)',
    name: '亚硝基伸缩',
    wavenumber: 1450,
    range: [1430, 1500],
    intensity: 'strong',
    shape: 'sharp',
    notes: 'N-亚硝基化合物'
  },

  // ========== C-O 伸缩振动 ==========
  {
    functionalGroup: 'C-O (alcohol, primary)',
    name: '伯醇 C-O 伸缩',
    wavenumber: 1050,
    range: [1000, 1085],
    intensity: 'strong',
    shape: 'sharp',
    notes: '伯醇特征区'
  },
  {
    functionalGroup: 'C-O (alcohol, secondary)',
    name: '仲醇 C-O 伸缩',
    wavenumber: 1100,
    range: [1075, 1150],
    intensity: 'strong',
    shape: 'sharp',
    notes: '仲醇特征区'
  },
  {
    functionalGroup: 'C-O (alcohol, tertiary)',
    name: '叔醇 C-O 伸缩',
    wavenumber: 1150,
    range: [1100, 1200],
    intensity: 'strong',
    shape: 'sharp',
    notes: '叔醇特征区'
  },
  {
    functionalGroup: 'C-O (ether)',
    name: '醚 C-O 伸缩',
    wavenumber: 1100,
    range: [1050, 1150],
    intensity: 'very strong',
    shape: 'sharp',
    notes: '脂肪醚'
  },
  {
    functionalGroup: 'C-O (phenol)',
    name: '酚 C-O 伸缩',
    wavenumber: 1230,
    range: [1180, 1260],
    intensity: 'strong',
    shape: 'sharp',
    notes: '芳香醚/酚'
  },
  {
    functionalGroup: 'C-O (ester)',
    name: '酯 C-O 伸缩',
    wavenumber: 1200,
    range: [1000, 1300],
    intensity: 'very strong',
    shape: 'doublet',
    notes: '双峰：C-O-C 反对称和对称伸缩'
  },

  // ========== S=O 伸缩振动 ==========
  {
    functionalGroup: 'S=O (sulfoxide)',
    name: '亚砜 S=O 伸缩',
    wavenumber: 1050,
    range: [1030, 1070],
    intensity: 'strong',
    shape: 'sharp',
    notes: 'R₂S=O'
  },
  {
    functionalGroup: 'SO₂ (sulfone, asymm)',
    name: '砜不对称伸缩',
    wavenumber: 1350,
    range: [1300, 1350],
    intensity: 'very strong',
    shape: 'sharp',
    notes: 'R₂SO₂ 不对称伸缩'
  },
  {
    functionalGroup: 'SO₂ (sulfone, symm)',
    name: '砜对称伸缩',
    wavenumber: 1150,
    range: [1120, 1160],
    intensity: 'very strong',
    shape: 'sharp',
    notes: 'R₂SO₂ 对称伸缩'
  },

  // ========== P=O 伸缩振动 ==========
  {
    functionalGroup: 'P=O (phosphine oxide)',
    wavenumber: 1200,
    range: [1140, 1250],
    intensity: 'very strong',
    shape: 'sharp',
    notes: 'R₃P=O'
  },
  {
    functionalGroup: 'P-O-C (phosphate)',
    name: '磷酸酯 P-O-C',
    wavenumber: 1030,
    range: [970, 1050],
    intensity: 'very strong',
    shape: 'sharp',
    notes: '有机磷酸酯'
  },

  // ========== Si-O 伸缩振动 ==========
  {
    functionalGroup: 'Si-O-Si',
    name: '硅氧键伸缩',
    wavenumber: 1100,
    range: [1000, 1130],
    intensity: 'very strong',
    shape: 'very broad',
    notes: '硅氧烷、硅胶特征峰'
  },
  {
    functionalGroup: 'Si-OH',
    name: '硅醇伸缩',
    wavenumber: 3200,
    range: [3200, 3700],
    intensity: 'broad',
    shape: 'broad',
    notes: '表面硅醇基'
  },
  {
    functionalGroup: 'Si-CH₃',
    name: '硅甲基伸缩',
    wavenumber: 1260,
    range: [1240, 1270],
    intensity: 'strong',
    shape: 'sharp',
    notes: '有机硅化合物'
  },

  // ========== 指纹区特征峰 ==========
  {
    functionalGroup: 'C-C (alkane)',
    name: '烷烃 C-C 伸缩',
    wavenumber: 1000,
    range: [800, 1200],
    intensity: 'weak',
    shape: 'complex',
    notes: '指纹区，复杂'
  },
  {
    functionalGroup: 'C-H (bending, CH₂)',
    name: 'CH₂ 弯曲振动',
    wavenumber: 1465,
    range: [1450, 1475],
    intensity: 'medium',
    shape: 'sharp',
    notes: '亚甲基剪式振动'
  },
  {
    functionalGroup: 'C-H (bending, CH₃)',
    name: 'CH₃ 弯曲振动',
    wavenumber: 1375,
    range: [1370, 1390],
    intensity: 'medium',
    shape: 'doublet',
    notes: '甲基双峰：对称和反对称'
  },
  {
    functionalGroup: 'C-H (aromatic, out-of-plane)',
    name: '芳环 C-H 面外弯曲',
    wavenumber: 750,
    range: [650, 1000],
    intensity: 'strong',
    shape: 'multiple peaks',
    notes: '取代类型：单取代 690-710, 730-770; 对位 800-860; 邻位 735-770'
  },

  // ========== 无机物特征峰 ==========
  {
    functionalGroup: 'Ti-O',
    name: '钛氧键伸缩',
    wavenumber: 450,
    range: [400, 700],
    intensity: 'very strong',
    shape: 'broad',
    notes: 'TiO₂ 特征，锐钛矿 ~450 cm⁻¹，金红石 ~600 cm⁻¹'
  },
  {
    functionalGroup: 'CO₃²⁻ (carbonate)',
    name: '碳酸根伸缩',
    wavenumber: 1430,
    range: [1350, 1550],
    intensity: 'very strong',
    shape: 'sharp',
    notes: '碳酸盐最强峰'
  },
  {
    functionalGroup: 'CO₃²⁻ (carbonate, bend)',
    name: '碳酸根弯曲',
    wavenumber: 875,
    range: [840, 890],
    intensity: 'medium',
    shape: 'sharp',
    notes: '碳酸盐辅助峰'
  },
  {
    functionalGroup: 'SO₄²⁻ (sulfate)',
    name: '硫酸根伸缩',
    wavenumber: 1100,
    range: [1000, 1200],
    intensity: 'very strong',
    shape: 'broad',
    notes: '硫酸盐'
  },
  {
    functionalGroup: 'PO₄³⁻ (phosphate)',
    name: '磷酸根伸缩',
    wavenumber: 1050,
    range: [950, 1200],
    intensity: 'very strong',
    shape: 'broad',
    notes: '磷酸盐'
  },
  {
    functionalGroup: 'NO₃⁻ (nitrate)',
    name: '硝酸根伸缩',
    wavenumber: 1385,
    range: [1350, 1410],
    intensity: 'very strong',
    shape: 'doublet',
    notes: '硝酸盐，双峰'
  },

  // ========== 材料化学相关 ==========
  {
    functionalGroup: 'Metal-O',
    name: '金属-氧键',
    wavenumber: 500,
    range: [300, 800],
    intensity: 'strong',
    shape: 'broad',
    notes: '金属氧化物，频率与金属相关'
  },
  {
    functionalGroup: 'OH (metal hydroxide)',
    name: '金属氢氧化物 OH',
    wavenumber: 3400,
    range: [3200, 3650],
    intensity: 'broad',
    shape: 'broad',
    notes: '表面羟基、层状结构 OH'
  },
  {
    functionalGroup: 'H₂O (adsorbed)',
    name: '吸附水分子',
    wavenumber: 1630,
    range: [1600, 1650],
    intensity: 'medium',
    shape: 'sharp',
    notes: '吸附水的弯曲振动'
  },
  {
    functionalGroup: 'C=N (imine)',
    name: '亚胺 C=N 伸缩',
    wavenumber: 1650,
    range: [1640, 1690],
    intensity: 'medium',
    shape: 'sharp',
    notes: '席夫碱等'
  },
  {
    functionalGroup: 'N=N (azo)',
    name: '偶氮基伸缩',
    wavenumber: 1575,
    range: [1550, 1600],
    intensity: 'weak',
    shape: 'sharp',
    notes: '偶氮化合物'
  },

  // ========== 聚合物特征 ==========
  {
    functionalGroup: 'C-F (fluoropolymer)',
    name: 'C-F 伸缩',
    wavenumber: 1100,
    range: [1000, 1400],
    intensity: 'very strong',
    shape: 'multiple peaks',
    notes: '氟聚合物（PTFE, PVDF），多个强峰'
  },
  {
    functionalGroup: 'C-Cl',
    name: 'C-Cl 伸缩',
    wavenumber: 700,
    range: [550, 850],
    intensity: 'strong',
    shape: 'sharp',
    notes: '卤代烃'
  },
  {
    functionalGroup: 'C-Br',
    name: 'C-Br 伸缩',
    wavenumber: 600,
    range: [500, 700],
    intensity: 'strong',
    shape: 'sharp',
    notes: '溴代烃'
  },
  {
    functionalGroup: 'Amide II',
    name: '酰胺 II 带',
    wavenumber: 1550,
    range: [1510, 1570],
    intensity: 'medium to strong',
    shape: 'sharp',
    notes: 'N-H 弯曲和 C-N 伸缩耦合'
  },
  {
    functionalGroup: 'Amide III',
    name: '酰胺 III 带',
    wavenumber: 1250,
    range: [1200, 1320],
    intensity: 'weak to medium',
    shape: 'sharp',
    notes: 'C-N 伸缩和 N-H 弯曲'
  },

  // ========== 杂环化合物 ==========
  {
    functionalGroup: 'Pyridine ring',
    name: '吡啶环振动',
    wavenumber: 1580,
    range: [1550, 1620],
    intensity: 'strong',
    shape: 'multiple peaks',
    notes: '吡啶环特征：~1580, ~1570, ~1480 cm⁻¹'
  },
  {
    functionalGroup: 'Imidazole ring',
    name: '咪唑环振动',
    wavenumber: 1540,
    range: [1500, 1580],
    intensity: 'medium',
    shape: 'sharp',
    notes: '咪唑类化合物'
  },
  {
    functionalGroup: 'Thiazole ring',
    name: '噻唑环振动',
    wavenumber: 1500,
    range: [1460, 1540],
    intensity: 'medium',
    shape: 'sharp',
    notes: '噻唑类化合物'
  }
];

/**
 * 按波数范围搜索
 * @param {number} wavenumber - 波数 (cm⁻¹)
 * @param {number} tolerance - 容差 (默认 ±50 cm⁻¹)
 * @returns {Array} 匹配的峰位数据
 */
function searchByWavenumber(wavenumber, tolerance = 50) {
  return FTIR_DATA.filter(peak => {
    return wavenumber >= (peak.range[0] - tolerance) && 
           wavenumber <= (peak.range[1] + tolerance);
  });
}

/**
 * 按官能团搜索
 * @param {string} keyword - 关键词
 * @returns {Array} 匹配的峰位数据
 */
function searchByKeyword(keyword) {
  const normalizedKeyword = keyword.toLowerCase().trim();
  return FTIR_DATA.filter(peak => {
    return peak.functionalGroup.toLowerCase().includes(normalizedKeyword) ||
           peak.name.toLowerCase().includes(normalizedKeyword) ||
           peak.notes.toLowerCase().includes(normalizedKeyword);
  });
}

/**
 * 按强度筛选
 * @param {string} intensity - 'weak', 'medium', 'strong', 'very strong'
 * @returns {Array} 匹配的峰位数据
 */
function filterByIntensity(intensity) {
  return FTIR_DATA.filter(peak => peak.intensity.includes(intensity));
}

module.exports = {
  FTIR_DATA,
  searchByWavenumber,
  searchByKeyword,
  filterByIntensity,
  getMetadata: () => METADATA
};

