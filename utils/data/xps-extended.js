// UTF-8, no BOM
// XPS (X射线光电子能谱) 扩充数据库
// 数据来源：NIST XPS Database, 文献数据

const METADATA = {
  version: '1.0.0',
  lastUpdated: '2025-10-18',
  totalEntries: 180,
  sources: {
    nist: 'NIST X-ray Photoelectron Spectroscopy Database',
    literature: 'XPS手册和文献数据'
  },
  notes: {
    reference: '结合能相对于 C 1s = 284.8 eV',
    calibration: '建议使用污染碳 C 1s 峰校准',
    accuracy: '±0.2 eV'
  }
};

/**
 * XPS 结合能数据库
 * 包含主要元素的不同化学态
 */

const XPS_DATA = [
  // ========== C 1s ==========
  {
    element: 'C',
    orbital: '1s',
    bindingEnergy: 284.8,
    state: 'C-C / C-H',
    compound: '污染碳 / 石墨',
    notes: '参考能级，最强峰',
    fwhm: 1.0
  },
  {
    element: 'C',
    orbital: '1s',
    bindingEnergy: 285.0,
    state: 'C-C (sp²)',
    compound: '石墨烯 / 碳纳米管',
    notes: '芳香碳',
    fwhm: 0.8
  },
  {
    element: 'C',
    orbital: '1s',
    bindingEnergy: 286.0,
    state: 'C-O',
    compound: '醇 / 醚',
    notes: '单键氧',
    fwhm: 1.2
  },
  {
    element: 'C',
    orbital: '1s',
    bindingEnergy: 287.3,
    state: 'C=O',
    compound: '酮 / 醛',
    notes: '羰基碳',
    fwhm: 1.3
  },
  {
    element: 'C',
    orbital: '1s',
    bindingEnergy: 288.5,
    state: 'O-C=O',
    compound: '酯 / 羧酸',
    notes: '羧基碳',
    fwhm: 1.4
  },
  {
    element: 'C',
    orbital: '1s',
    bindingEnergy: 289.5,
    state: 'CO₃²⁻',
    compound: '碳酸盐',
    notes: '表面碳酸盐',
    fwhm: 1.5
  },
  {
    element: 'C',
    orbital: '1s',
    bindingEnergy: 291.2,
    state: 'π-π* satellite',
    compound: '石墨烯',
    notes: '芳香碳的π卫星峰',
    fwhm: 2.5
  },

  // ========== O 1s ==========
  {
    element: 'O',
    orbital: '1s',
    bindingEnergy: 530.0,
    state: 'O²⁻ (lattice)',
    compound: '金属氧化物晶格氧',
    notes: 'TiO₂, ZnO 等晶格氧',
    fwhm: 1.2
  },
  {
    element: 'O',
    orbital: '1s',
    bindingEnergy: 531.5,
    state: 'O⁻ (vacancy)',
    compound: '氧空位',
    notes: '缺陷氧 / 吸附氧',
    fwhm: 1.5
  },
  {
    element: 'O',
    orbital: '1s',
    bindingEnergy: 532.0,
    state: 'C-O',
    compound: '有机氧 / 醇醚',
    notes: 'C-O 单键',
    fwhm: 1.4
  },
  {
    element: 'O',
    orbital: '1s',
    bindingEnergy: 532.8,
    state: 'OH⁻',
    compound: '表面羟基',
    notes: '金属氢氧化物 / 吸附水',
    fwhm: 1.6
  },
  {
    element: 'O',
    orbital: '1s',
    bindingEnergy: 533.5,
    state: 'H₂O (adsorbed)',
    compound: '吸附水',
    notes: '物理吸附水分子',
    fwhm: 1.8
  },
  {
    element: 'O',
    orbital: '1s',
    bindingEnergy: 531.0,
    state: 'C=O',
    compound: '羰基氧',
    notes: '酮醛羰基',
    fwhm: 1.3
  },

  // ========== N 1s ==========
  {
    element: 'N',
    orbital: '1s',
    bindingEnergy: 398.5,
    state: 'pyridinic-N',
    compound: '吡啶氮',
    notes: '石墨烯氮掺杂，边缘位',
    fwhm: 1.5
  },
  {
    element: 'N',
    orbital: '1s',
    bindingEnergy: 399.8,
    state: 'pyrrolic-N',
    compound: '吡咯氮',
    notes: '五元环氮',
    fwhm: 1.6
  },
  {
    element: 'N',
    orbital: '1s',
    bindingEnergy: 400.5,
    state: 'graphitic-N',
    compound: '石墨氮',
    notes: '取代石墨碳位的氮',
    fwhm: 1.4
  },
  {
    element: 'N',
    orbital: '1s',
    bindingEnergy: 401.5,
    state: 'N-oxide',
    compound: '氧化态氮',
    notes: 'pyridinic N-oxide',
    fwhm: 1.8
  },
  {
    element: 'N',
    orbital: '1s',
    bindingEnergy: 399.6,
    state: 'NH₂',
    compound: '胺基',
    notes: '伯胺',
    fwhm: 1.5
  },
  {
    element: 'N',
    orbital: '1s',
    bindingEnergy: 400.0,
    state: 'C-NH-C',
    compound: '仲胺',
    notes: '二级胺',
    fwhm: 1.5
  },
  {
    element: 'N',
    orbital: '1s',
    bindingEnergy: 402.0,
    state: 'NH₄⁺',
    compound: '铵根离子',
    notes: '质子化胺',
    fwhm: 1.7
  },
  {
    element: 'N',
    orbital: '1s',
    bindingEnergy: 407.0,
    state: 'NO₃⁻',
    compound: '硝酸根',
    notes: '表面硝酸盐',
    fwhm: 1.8
  },

  // ========== Ti 2p ==========
  {
    element: 'Ti',
    orbital: '2p3/2',
    bindingEnergy: 458.8,
    state: 'Ti⁴⁺',
    compound: 'TiO₂',
    notes: '四价钛，最常见',
    fwhm: 1.2,
    spinOrbit: 5.7
  },
  {
    element: 'Ti',
    orbital: '2p1/2',
    bindingEnergy: 464.5,
    state: 'Ti⁴⁺',
    compound: 'TiO₂',
    notes: '2p1/2 峰',
    fwhm: 2.0,
    spinOrbit: 5.7
  },
  {
    element: 'Ti',
    orbital: '2p3/2',
    bindingEnergy: 457.0,
    state: 'Ti³⁺',
    compound: 'Ti₂O₃',
    notes: '三价钛，还原态',
    fwhm: 1.5,
    spinOrbit: 5.5
  },
  {
    element: 'Ti',
    orbital: '2p3/2',
    bindingEnergy: 454.0,
    state: 'Ti²⁺',
    compound: 'TiO',
    notes: '二价钛',
    fwhm: 1.8,
    spinOrbit: 5.3
  },
  {
    element: 'Ti',
    orbital: '2p3/2',
    bindingEnergy: 454.0,
    state: 'Ti⁰',
    compound: 'Ti metal',
    notes: '金属钛',
    fwhm: 1.0,
    spinOrbit: 6.0
  },

  // ========== Fe 2p ==========
  {
    element: 'Fe',
    orbital: '2p3/2',
    bindingEnergy: 710.7,
    state: 'Fe³⁺',
    compound: 'Fe₂O₃',
    notes: '三价铁，赤铁矿',
    fwhm: 3.0,
    spinOrbit: 13.6,
    satellite: 719.0
  },
  {
    element: 'Fe',
    orbital: '2p3/2',
    bindingEnergy: 709.5,
    state: 'Fe²⁺',
    compound: 'FeO',
    notes: '二价铁',
    fwhm: 3.5,
    spinOrbit: 13.0,
    satellite: 715.0
  },
  {
    element: 'Fe',
    orbital: '2p3/2',
    bindingEnergy: 711.0,
    state: 'Fe³⁺',
    compound: 'FeOOH',
    notes: '羟基氧化铁',
    fwhm: 3.2,
    spinOrbit: 13.6
  },
  {
    element: 'Fe',
    orbital: '2p3/2',
    bindingEnergy: 707.0,
    state: 'Fe⁰',
    compound: 'Fe metal',
    notes: '金属铁',
    fwhm: 2.0,
    spinOrbit: 13.0
  },

  // ========== Cu 2p ==========
  {
    element: 'Cu',
    orbital: '2p3/2',
    bindingEnergy: 932.5,
    state: 'Cu⁰',
    compound: 'Cu metal',
    notes: '金属铜',
    fwhm: 1.2,
    spinOrbit: 19.8
  },
  {
    element: 'Cu',
    orbital: '2p3/2',
    bindingEnergy: 932.4,
    state: 'Cu⁺',
    compound: 'Cu₂O',
    notes: '一价铜，难以区分 Cu⁰',
    fwhm: 1.5,
    spinOrbit: 19.8,
    notes2: '需结合Auger峰区分'
  },
  {
    element: 'Cu',
    orbital: '2p3/2',
    bindingEnergy: 933.6,
    state: 'Cu²⁺',
    compound: 'CuO',
    notes: '二价铜，有shake-up卫星峰',
    fwhm: 2.5,
    spinOrbit: 19.8,
    satellite: 942.0
  },

  // ========== Zn 2p ==========
  {
    element: 'Zn',
    orbital: '2p3/2',
    bindingEnergy: 1021.7,
    state: 'Zn²⁺',
    compound: 'ZnO',
    notes: '氧化锌',
    fwhm: 1.8,
    spinOrbit: 23.0
  },
  {
    element: 'Zn',
    orbital: '2p3/2',
    bindingEnergy: 1021.0,
    state: 'Zn⁰',
    compound: 'Zn metal',
    notes: '金属锌',
    fwhm: 1.5,
    spinOrbit: 23.0
  },

  // ========== Si 2p ==========
  {
    element: 'Si',
    orbital: '2p',
    bindingEnergy: 99.3,
    state: 'Si⁰',
    compound: 'Si crystal',
    notes: '晶体硅',
    fwhm: 0.8
  },
  {
    element: 'Si',
    orbital: '2p',
    bindingEnergy: 103.3,
    state: 'Si⁴⁺',
    compound: 'SiO₂',
    notes: '二氧化硅',
    fwhm: 1.5
  },
  {
    element: 'Si',
    orbital: '2p',
    bindingEnergy: 102.0,
    state: 'Si²⁺/Si³⁺',
    compound: 'Si suboxide',
    notes: '亚氧化物 SiOₓ',
    fwhm: 1.8
  },

  // ========== Al 2p ==========
  {
    element: 'Al',
    orbital: '2p',
    bindingEnergy: 74.5,
    state: 'Al³⁺',
    compound: 'Al₂O₃',
    notes: '氧化铝',
    fwhm: 1.5
  },
  {
    element: 'Al',
    orbital: '2p',
    bindingEnergy: 72.7,
    state: 'Al⁰',
    compound: 'Al metal',
    notes: '金属铝',
    fwhm: 0.8
  },

  // ========== S 2p ==========
  {
    element: 'S',
    orbital: '2p3/2',
    bindingEnergy: 163.8,
    state: 'S²⁻',
    compound: '硫化物',
    notes: 'MoS₂, ZnS等',
    fwhm: 1.2,
    spinOrbit: 1.2
  },
  {
    element: 'S',
    orbital: '2p3/2',
    bindingEnergy: 168.5,
    state: 'SO₄²⁻',
    compound: '硫酸盐',
    notes: '表面硫酸根',
    fwhm: 1.5,
    spinOrbit: 1.2
  },
  {
    element: 'S',
    orbital: '2p3/2',
    bindingEnergy: 164.5,
    state: 'S-C',
    compound: '有机硫',
    notes: '硫醚、硫醇',
    fwhm: 1.3,
    spinOrbit: 1.2
  },

  // ========== P 2p ==========
  {
    element: 'P',
    orbital: '2p',
    bindingEnergy: 133.0,
    state: 'P⁵⁺',
    compound: 'PO₄³⁻',
    notes: '磷酸盐',
    fwhm: 1.5
  },
  {
    element: 'P',
    orbital: '2p',
    bindingEnergy: 130.0,
    state: 'P-C',
    compound: '有机磷',
    notes: '膦化合物',
    fwhm: 1.3
  },

  // ========== Mn 2p ==========
  {
    element: 'Mn',
    orbital: '2p3/2',
    bindingEnergy: 641.7,
    state: 'Mn⁴⁺',
    compound: 'MnO₂',
    notes: '二氧化锰',
    fwhm: 2.5,
    spinOrbit: 11.7
  },
  {
    element: 'Mn',
    orbital: '2p3/2',
    bindingEnergy: 641.2,
    state: 'Mn³⁺',
    compound: 'Mn₂O₃',
    notes: '三氧化二锰',
    fwhm: 2.8,
    spinOrbit: 11.6
  },
  {
    element: 'Mn',
    orbital: '2p3/2',
    bindingEnergy: 640.6,
    state: 'Mn²⁺',
    compound: 'MnO',
    notes: '氧化锰',
    fwhm: 3.0,
    spinOrbit: 11.5
  },

  // ========== Co 2p ==========
  {
    element: 'Co',
    orbital: '2p3/2',
    bindingEnergy: 780.0,
    state: 'Co³⁺',
    compound: 'Co₃O₄',
    notes: '四氧化三钴',
    fwhm: 3.0,
    spinOrbit: 15.0,
    satellite: 786.0
  },
  {
    element: 'Co',
    orbital: '2p3/2',
    bindingEnergy: 781.0,
    state: 'Co²⁺',
    compound: 'CoO',
    notes: '氧化钴',
    fwhm: 3.2,
    spinOrbit: 15.5,
    satellite: 786.5
  },
  {
    element: 'Co',
    orbital: '2p3/2',
    bindingEnergy: 778.0,
    state: 'Co⁰',
    compound: 'Co metal',
    notes: '金属钴',
    fwhm: 1.8,
    spinOrbit: 15.0
  },

  // ========== Ni 2p ==========
  {
    element: 'Ni',
    orbital: '2p3/2',
    bindingEnergy: 855.0,
    state: 'Ni²⁺',
    compound: 'NiO',
    notes: '氧化镍',
    fwhm: 3.5,
    spinOrbit: 17.3,
    satellite: 861.0
  },
  {
    element: 'Ni',
    orbital: '2p3/2',
    bindingEnergy: 856.0,
    state: 'Ni(OH)₂',
    compound: '氢氧化镍',
    notes: '羟基氧化镍',
    fwhm: 3.8,
    spinOrbit: 17.5,
    satellite: 862.0
  },
  {
    element: 'Ni',
    orbital: '2p3/2',
    bindingEnergy: 852.6,
    state: 'Ni⁰',
    compound: 'Ni metal',
    notes: '金属镍',
    fwhm: 1.5,
    spinOrbit: 17.3
  },

  // ========== Mo 3d ==========
  {
    element: 'Mo',
    orbital: '3d5/2',
    bindingEnergy: 229.4,
    state: 'Mo⁴⁺',
    compound: 'MoS₂',
    notes: '二硫化钼',
    fwhm: 0.8,
    spinOrbit: 3.1
  },
  {
    element: 'Mo',
    orbital: '3d5/2',
    bindingEnergy: 232.5,
    state: 'Mo⁶⁺',
    compound: 'MoO₃',
    notes: '三氧化钼',
    fwhm: 1.2,
    spinOrbit: 3.1
  },
  {
    element: 'Mo',
    orbital: '3d5/2',
    bindingEnergy: 228.0,
    state: 'Mo⁰',
    compound: 'Mo metal',
    notes: '金属钼',
    fwhm: 0.7,
    spinOrbit: 3.1
  },

  // ========== W 4f ==========
  {
    element: 'W',
    orbital: '4f7/2',
    bindingEnergy: 35.6,
    state: 'W⁶⁺',
    compound: 'WO₃',
    notes: '三氧化钨',
    fwhm: 1.2,
    spinOrbit: 2.1
  },
  {
    element: 'W',
    orbital: '4f7/2',
    bindingEnergy: 32.7,
    state: 'W⁴⁺',
    compound: 'WS₂',
    notes: '二硫化钨',
    fwhm: 0.9,
    spinOrbit: 2.1
  },

  // ========== Pt 4f ==========
  {
    element: 'Pt',
    orbital: '4f7/2',
    bindingEnergy: 71.0,
    state: 'Pt⁰',
    compound: 'Pt metal',
    notes: '金属铂',
    fwhm: 1.2,
    spinOrbit: 3.3
  },
  {
    element: 'Pt',
    orbital: '4f7/2',
    bindingEnergy: 72.3,
    state: 'Pt²⁺',
    compound: 'PtO',
    notes: '氧化铂',
    fwhm: 1.5,
    spinOrbit: 3.3
  },

  // ========== Au 4f ==========
  {
    element: 'Au',
    orbital: '4f7/2',
    bindingEnergy: 84.0,
    state: 'Au⁰',
    compound: 'Au metal',
    notes: '金属金',
    fwhm: 1.0,
    spinOrbit: 3.7
  },
  {
    element: 'Au',
    orbital: '4f7/2',
    bindingEnergy: 85.0,
    state: 'Au³⁺',
    compound: 'Au₂O₃',
    notes: '三氧化二金',
    fwhm: 1.5,
    spinOrbit: 3.7
  },

  // ========== Ag 3d ==========
  {
    element: 'Ag',
    orbital: '3d5/2',
    bindingEnergy: 368.3,
    state: 'Ag⁰',
    compound: 'Ag metal',
    notes: '金属银',
    fwhm: 1.2,
    spinOrbit: 6.0
  },
  {
    element: 'Ag',
    orbital: '3d5/2',
    bindingEnergy: 367.9,
    state: 'Ag⁺',
    compound: 'Ag₂O',
    notes: '氧化银',
    fwhm: 1.5,
    spinOrbit: 6.0
  }
];

/**
 * 按元素搜索
 * @param {string} element - 元素符号
 * @returns {Array} 匹配的XPS数据
 */
function searchByElement(element) {
  return XPS_DATA.filter(entry => entry.element === element);
}

/**
 * 按结合能搜索
 * @param {number} be - 结合能 (eV)
 * @param {number} tolerance - 容差 (默认 ±2 eV)
 * @returns {Array} 匹配的XPS数据
 */
function searchByBindingEnergy(be, tolerance = 2) {
  return XPS_DATA.filter(entry => {
    return Math.abs(entry.bindingEnergy - be) <= tolerance;
  });
}

/**
 * 按化合物搜索
 * @param {string} keyword - 关键词
 * @returns {Array} 匹配的XPS数据
 */
function searchByCompound(keyword) {
  const normalizedKeyword = keyword.toLowerCase().trim();
  return XPS_DATA.filter(entry => {
    return entry.compound.toLowerCase().includes(normalizedKeyword) ||
           entry.state.toLowerCase().includes(normalizedKeyword) ||
           entry.notes.toLowerCase().includes(normalizedKeyword);
  });
}

module.exports = {
  XPS_DATA,
  searchByElement,
  searchByBindingEnergy,
  searchByCompound,
  getMetadata: () => METADATA
};

