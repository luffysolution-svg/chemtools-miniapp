// UTF-8, no BOM
// 半导体电子亲和能数据库
// 数据来源：文献数据和实验测量值

const METADATA = {
  version: '1.0.0',
  lastUpdated: '2025-10-18',
  totalEntries: 55,
  sources: {
    reference1: 'J. Phys. Chem. C 114, 11814 (2010)',
    reference2: 'Energy Environ. Sci. 5, 6460 (2012)',
    reference3: 'Chem. Rev. 110, 6446 (2010)',
    note: '电子亲和能定义：真空能级到导带底的能量差'
  },
  notes: {
    definition: '电子亲和能 χ：真空能级到导带底（CBM）的能量差',
    reference: '绝对电极电位：NHE = -4.5 eV vs Vacuum',
    calculation: 'CBM(vs NHE) = χ - 4.5 eV; VBM = CBM - Eg'
  }
};

/**
 * 半导体电子亲和能数据
 */
const ELECTRON_AFFINITY_DATA = [
  // ========== TiO₂系列 ==========
  {
    material: 'TiO₂ (anatase)',
    name: '锐钛矿型二氧化钛',
    formula: 'TiO₂',
    bandgap: 3.2,
    electronAffinity: 4.0,
    bandgapType: 'indirect',
    cbm_vs_vacuum: -4.0,
    vbm_vs_vacuum: -7.2,
    cbm_vs_nhe: 0.5,
    vbm_vs_nhe: 3.7,
    notes: '最常用光催化剂，锐钛矿相',
    applications: ['光催化', '太阳能电池', '光解水'],
    source: 'J. Phys. Chem. C 114, 11814 (2010)'
  },
  {
    material: 'TiO₂ (rutile)',
    name: '金红石型二氧化钛',
    formula: 'TiO₂',
    bandgap: 3.0,
    electronAffinity: 4.2,
    bandgapType: 'direct',
    cbm_vs_vacuum: -4.2,
    vbm_vs_vacuum: -7.2,
    cbm_vs_nhe: 0.3,
    vbm_vs_nhe: 3.3,
    notes: '金红石相，热力学稳定相',
    applications: ['光催化', '颜料'],
    source: 'J. Phys. Chem. C 114, 11814 (2010)'
  },

  // ========== ZnO ==========
  {
    material: 'ZnO',
    name: '氧化锌',
    formula: 'ZnO',
    bandgap: 3.37,
    electronAffinity: 4.35,
    bandgapType: 'direct',
    cbm_vs_vacuum: -4.35,
    vbm_vs_vacuum: -7.72,
    cbm_vs_nhe: 0.15,
    vbm_vs_nhe: 3.52,
    notes: 'n型半导体，直接带隙',
    applications: ['压电器件', '紫外探测器', '透明导电膜'],
    source: 'Chem. Rev. 110, 6446 (2010)'
  },

  // ========== WO₃ ==========
  {
    material: 'WO₃',
    name: '三氧化钨',
    formula: 'WO₃',
    bandgap: 2.8,
    electronAffinity: 4.3,
    bandgapType: 'indirect',
    cbm_vs_vacuum: -4.3,
    vbm_vs_vacuum: -7.1,
    cbm_vs_nhe: 0.2,
    vbm_vs_nhe: 3.0,
    notes: '可见光响应，光致变色',
    applications: ['光解水', '电致变色', '气体传感器'],
    source: 'Energy Environ. Sci. 5, 6460 (2012)'
  },

  // ========== Fe₂O₃ ==========
  {
    material: 'α-Fe₂O₃ (hematite)',
    name: '赤铁矿',
    formula: 'Fe₂O₃',
    bandgap: 2.1,
    electronAffinity: 4.9,
    bandgapType: 'indirect',
    cbm_vs_vacuum: -4.9,
    vbm_vs_vacuum: -7.0,
    cbm_vs_nhe: -0.4,
    vbm_vs_nhe: 1.7,
    notes: '窄带隙，可见光吸收好',
    applications: ['光解水', '光催化'],
    source: 'Energy Environ. Sci. 5, 6460 (2012)'
  },

  // ========== BiVO₄ ==========
  {
    material: 'BiVO₄',
    name: '钒酸铋',
    formula: 'BiVO₄',
    bandgap: 2.4,
    electronAffinity: 4.3,
    bandgapType: 'direct',
    cbm_vs_vacuum: -4.3,
    vbm_vs_vacuum: -6.7,
    cbm_vs_nhe: 0.2,
    vbm_vs_nhe: 2.6,
    notes: '可见光响应，光解水阳极',
    applications: ['光解水', '光催化降解'],
    source: 'Energy Environ. Sci. 5, 6460 (2012)'
  },

  // ========== CdS ==========
  {
    material: 'CdS',
    name: '硫化镉',
    formula: 'CdS',
    bandgap: 2.4,
    electronAffinity: 4.5,
    bandgapType: 'direct',
    cbm_vs_vacuum: -4.5,
    vbm_vs_vacuum: -6.9,
    cbm_vs_nhe: 0.0,
    vbm_vs_nhe: 2.4,
    notes: '可见光吸收，量子点材料',
    applications: ['太阳能电池', '光催化', '量子点'],
    source: 'Chem. Rev. 110, 6446 (2010)'
  },

  // ========== ZnS ==========
  {
    material: 'ZnS',
    name: '硫化锌',
    formula: 'ZnS',
    bandgap: 3.66,
    electronAffinity: 3.9,
    bandgapType: 'direct',
    cbm_vs_vacuum: -3.9,
    vbm_vs_vacuum: -7.56,
    cbm_vs_nhe: 0.6,
    vbm_vs_nhe: 4.26,
    notes: '宽带隙，紫外响应',
    applications: ['荧光材料', '量子点'],
    source: 'Chem. Rev. 110, 6446 (2010)'
  },

  // ========== SnO₂ ==========
  {
    material: 'SnO₂',
    name: '二氧化锡',
    formula: 'SnO₂',
    bandgap: 3.6,
    electronAffinity: 4.5,
    bandgapType: 'direct',
    cbm_vs_vacuum: -4.5,
    vbm_vs_vacuum: -8.1,
    cbm_vs_nhe: 0.0,
    vbm_vs_nhe: 3.6,
    notes: 'n型宽带隙半导体',
    applications: ['气体传感器', '透明导电膜', '太阳能电池'],
    source: 'Chem. Rev. 110, 6446 (2010)'
  },

  // ========== g-C₃N₄ ==========
  {
    material: 'g-C₃N₄',
    name: '石墨相氮化碳',
    formula: 'C₃N₄',
    bandgap: 2.7,
    electronAffinity: 4.3,
    bandgapType: 'indirect',
    cbm_vs_vacuum: -4.3,
    vbm_vs_vacuum: -7.0,
    cbm_vs_nhe: 0.2,
    vbm_vs_nhe: 2.9,
    notes: '非金属聚合物半导体',
    applications: ['光催化', 'CO₂还原', '产氢'],
    source: 'Energy Environ. Sci. 5, 6460 (2012)'
  },

  // ========== Cu₂O ==========
  {
    material: 'Cu₂O',
    name: '氧化亚铜',
    formula: 'Cu₂O',
    bandgap: 2.17,
    electronAffinity: 3.2,
    bandgapType: 'direct',
    cbm_vs_vacuum: -3.2,
    vbm_vs_vacuum: -5.37,
    cbm_vs_nhe: 1.3,
    vbm_vs_nhe: 3.47,
    notes: 'p型半导体，可见光响应',
    applications: ['太阳能电池', '光催化'],
    source: 'Energy Environ. Sci. 5, 6460 (2012)'
  },

  // ========== CuO ==========
  {
    material: 'CuO',
    name: '氧化铜',
    formula: 'CuO',
    bandgap: 1.2,
    electronAffinity: 4.07,
    bandgapType: 'indirect',
    cbm_vs_vacuum: -4.07,
    vbm_vs_vacuum: -5.27,
    cbm_vs_nhe: 0.43,
    vbm_vs_nhe: 1.63,
    notes: '窄带隙p型半导体',
    applications: ['光催化', '太阳能电池'],
    source: 'J. Phys. Chem. C 114, 11814 (2010)'
  },

  // ========== SrTiO₃ ==========
  {
    material: 'SrTiO₃',
    name: '钛酸锶',
    formula: 'SrTiO₃',
    bandgap: 3.2,
    electronAffinity: 3.9,
    bandgapType: 'indirect',
    cbm_vs_vacuum: -3.9,
    vbm_vs_vacuum: -7.1,
    cbm_vs_nhe: 0.6,
    vbm_vs_nhe: 3.8,
    notes: '钙钛矿结构，立方',
    applications: ['光催化', '衬底材料'],
    source: 'J. Phys. Chem. C 114, 11814 (2010)'
  },

  // ========== BaTiO₃ ==========
  {
    material: 'BaTiO₃',
    name: '钛酸钡',
    formula: 'BaTiO₃',
    bandgap: 3.3,
    electronAffinity: 3.9,
    bandgapType: 'indirect',
    cbm_vs_vacuum: -3.9,
    vbm_vs_vacuum: -7.2,
    cbm_vs_nhe: 0.6,
    vbm_vs_nhe: 3.9,
    notes: '铁电材料',
    applications: ['铁电器件', '光催化'],
    source: 'J. Phys. Chem. C 114, 11814 (2010)'
  },

  // ========== NiO ==========
  {
    material: 'NiO',
    name: '氧化镍',
    formula: 'NiO',
    bandgap: 3.6,
    electronAffinity: 1.8,
    bandgapType: 'direct',
    cbm_vs_vacuum: -1.8,
    vbm_vs_vacuum: -5.4,
    cbm_vs_nhe: 2.7,
    vbm_vs_nhe: 6.3,
    notes: 'p型宽带隙半导体',
    applications: ['透明导电膜', '催化剂'],
    source: 'Energy Environ. Sci. 5, 6460 (2012)'
  },

  // ========== ZrO₂ ==========
  {
    material: 'ZrO₂',
    name: '二氧化锆',
    formula: 'ZrO₂',
    bandgap: 5.0,
    electronAffinity: 3.3,
    bandgapType: 'indirect',
    cbm_vs_vacuum: -3.3,
    vbm_vs_vacuum: -8.3,
    cbm_vs_nhe: 1.2,
    vbm_vs_nhe: 6.2,
    notes: '宽带隙绝缘体',
    applications: ['氧传感器', '固体电解质'],
    source: 'Chem. Rev. 110, 6446 (2010)'
  },

  // ========== Ta₂O₅ ==========
  {
    material: 'Ta₂O₅',
    name: '五氧化二钽',
    formula: 'Ta₂O₅',
    bandgap: 3.9,
    electronAffinity: 4.0,
    bandgapType: 'indirect',
    cbm_vs_vacuum: -4.0,
    vbm_vs_vacuum: -7.9,
    cbm_vs_nhe: 0.5,
    vbm_vs_nhe: 4.4,
    notes: '紫外响应',
    applications: ['光催化', '光解水'],
    source: 'Energy Environ. Sci. 5, 6460 (2012)'
  },

  // ========== V₂O₅ ==========
  {
    material: 'V₂O₅',
    name: '五氧化二钒',
    formula: 'V₂O₅',
    bandgap: 2.3,
    electronAffinity: 4.7,
    bandgapType: 'indirect',
    cbm_vs_vacuum: -4.7,
    vbm_vs_vacuum: -7.0,
    cbm_vs_nhe: -0.2,
    vbm_vs_nhe: 2.1,
    notes: '可见光响应',
    applications: ['锂电池正极', '催化剂'],
    source: 'Energy Environ. Sci. 5, 6460 (2012)'
  },

  // ========== In₂O₃ ==========
  {
    material: 'In₂O₃',
    name: '氧化铟',
    formula: 'In₂O₃',
    bandgap: 3.75,
    electronAffinity: 4.45,
    bandgapType: 'direct',
    cbm_vs_vacuum: -4.45,
    vbm_vs_vacuum: -8.2,
    cbm_vs_nhe: 0.05,
    vbm_vs_nhe: 3.8,
    notes: 'n型透明导体',
    applications: ['透明导电膜', 'ITO'],
    source: 'Chem. Rev. 110, 6446 (2010)'
  },

  // ========== Ga₂O₃ ==========
  {
    material: 'β-Ga₂O₃',
    name: '氧化镓',
    formula: 'Ga₂O₃',
    bandgap: 4.8,
    electronAffinity: 4.0,
    bandgapType: 'direct',
    cbm_vs_vacuum: -4.0,
    vbm_vs_vacuum: -8.8,
    cbm_vs_nhe: 0.5,
    vbm_vs_nhe: 5.3,
    notes: '超宽带隙',
    applications: ['功率器件', '日盲紫外探测'],
    source: 'Chem. Rev. 110, 6446 (2010)'
  },

  // ========== Si ==========
  {
    material: 'Si',
    name: '硅',
    formula: 'Si',
    bandgap: 1.12,
    electronAffinity: 4.05,
    bandgapType: 'indirect',
    cbm_vs_vacuum: -4.05,
    vbm_vs_vacuum: -5.17,
    cbm_vs_nhe: 0.45,
    vbm_vs_nhe: 1.57,
    notes: '最重要的半导体',
    applications: ['微电子', '太阳能电池'],
    source: '标准数据'
  },

  // ========== GaAs ==========
  {
    material: 'GaAs',
    name: '砷化镓',
    formula: 'GaAs',
    bandgap: 1.43,
    electronAffinity: 4.07,
    bandgapType: 'direct',
    cbm_vs_vacuum: -4.07,
    vbm_vs_vacuum: -5.5,
    cbm_vs_nhe: 0.43,
    vbm_vs_nhe: 1.86,
    notes: 'III-V族直接带隙',
    applications: ['高效太阳能电池', '激光二极管'],
    source: '标准数据'
  },

  // ========== GaN ==========
  {
    material: 'GaN',
    name: '氮化镓',
    formula: 'GaN',
    bandgap: 3.4,
    electronAffinity: 4.1,
    bandgapType: 'direct',
    cbm_vs_vacuum: -4.1,
    vbm_vs_vacuum: -7.5,
    cbm_vs_nhe: 0.4,
    vbm_vs_nhe: 3.8,
    notes: '宽带隙III-V族',
    applications: ['蓝光LED', '功率器件'],
    source: '标准数据'
  },

  // ========== MoS₂ ==========
  {
    material: 'MoS₂ (bulk)',
    name: '二硫化钼（体相）',
    formula: 'MoS₂',
    bandgap: 1.29,
    electronAffinity: 4.2,
    bandgapType: 'indirect',
    cbm_vs_vacuum: -4.2,
    vbm_vs_vacuum: -5.49,
    cbm_vs_nhe: 0.3,
    vbm_vs_nhe: 1.59,
    notes: '二维材料，层状',
    applications: ['润滑剂', '催化剂', '晶体管'],
    source: 'Energy Environ. Sci. 5, 6460 (2012)'
  },

  {
    material: 'MoS₂ (monolayer)',
    name: '二硫化钼（单层）',
    formula: 'MoS₂',
    bandgap: 1.9,
    electronAffinity: 4.0,
    bandgapType: 'direct',
    cbm_vs_vacuum: -4.0,
    vbm_vs_vacuum: -5.9,
    cbm_vs_nhe: 0.5,
    vbm_vs_nhe: 2.4,
    notes: '单层直接带隙',
    applications: ['场效应管', '光电器件'],
    source: 'Nature Nanotechnology 7, 699 (2012)'
  },

  // ========== WS₂ ==========
  {
    material: 'WS₂',
    name: '二硫化钨',
    formula: 'WS₂',
    bandgap: 1.35,
    electronAffinity: 4.0,
    bandgapType: 'indirect',
    cbm_vs_vacuum: -4.0,
    vbm_vs_vacuum: -5.35,
    cbm_vs_nhe: 0.5,
    vbm_vs_nhe: 1.85,
    notes: '二维过渡金属硫化物',
    applications: ['催化剂', '晶体管'],
    source: 'Energy Environ. Sci. 5, 6460 (2012)'
  },

  // ========== AgBr ==========
  {
    material: 'AgBr',
    name: '溴化银',
    formula: 'AgBr',
    bandgap: 2.6,
    electronAffinity: 4.3,
    bandgapType: 'indirect',
    cbm_vs_vacuum: -4.3,
    vbm_vs_vacuum: -6.9,
    cbm_vs_nhe: 0.2,
    vbm_vs_nhe: 2.8,
    notes: '卤化银',
    applications: ['光催化', '摄影材料'],
    source: 'J. Phys. Chem. C 114, 11814 (2010)'
  },

  // ========== Ag₃PO₄ ==========
  {
    material: 'Ag₃PO₄',
    name: '磷酸银',
    formula: 'Ag₃PO₄',
    bandgap: 2.4,
    electronAffinity: 4.5,
    bandgapType: 'indirect',
    cbm_vs_vacuum: -4.5,
    vbm_vs_vacuum: -6.9,
    cbm_vs_nhe: 0.0,
    vbm_vs_nhe: 2.4,
    notes: '可见光高活性',
    applications: ['光催化', 'O₂生成'],
    source: 'Energy Environ. Sci. 5, 6460 (2012)'
  },

  // ========== BiOCl ==========
  {
    material: 'BiOCl',
    name: '氯氧化铋',
    formula: 'BiOCl',
    bandgap: 3.5,
    electronAffinity: 3.8,
    bandgapType: 'indirect',
    cbm_vs_vacuum: -3.8,
    vbm_vs_vacuum: -7.3,
    cbm_vs_nhe: 0.7,
    vbm_vs_nhe: 4.2,
    notes: '层状结构',
    applications: ['光催化降解'],
    source: 'J. Phys. Chem. C 114, 11814 (2010)'
  },

  // ========== Bi₂WO₆ ==========
  {
    material: 'Bi₂WO₆',
    name: '钨酸铋',
    formula: 'Bi₂WO₆',
    bandgap: 2.8,
    electronAffinity: 4.2,
    bandgapType: 'indirect',
    cbm_vs_vacuum: -4.2,
    vbm_vs_vacuum: -7.0,
    cbm_vs_nhe: 0.3,
    vbm_vs_nhe: 3.1,
    notes: 'Aurivillius结构',
    applications: ['光催化'],
    source: 'Energy Environ. Sci. 5, 6460 (2012)'
  },

  // ========== Bi₂MoO₆ ==========
  {
    material: 'Bi₂MoO₆',
    name: '钼酸铋',
    formula: 'Bi₂MoO₆',
    bandgap: 2.7,
    electronAffinity: 4.3,
    bandgapType: 'indirect',
    cbm_vs_vacuum: -4.3,
    vbm_vs_vacuum: -7.0,
    cbm_vs_nhe: 0.2,
    vbm_vs_nhe: 2.9,
    notes: 'Aurivillius结构',
    applications: ['光催化'],
    source: 'Energy Environ. Sci. 5, 6460 (2012)'
  },

  // ========== CeO₂ ==========
  {
    material: 'CeO₂',
    name: '二氧化铈',
    formula: 'CeO₂',
    bandgap: 3.2,
    electronAffinity: 4.4,
    bandgapType: 'indirect',
    cbm_vs_vacuum: -4.4,
    vbm_vs_vacuum: -7.6,
    cbm_vs_nhe: 0.1,
    vbm_vs_nhe: 3.3,
    notes: '储氧材料',
    applications: ['催化剂载体', '固体电解质'],
    source: 'Chem. Rev. 110, 6446 (2010)'
  },

  // ========== La₂Ti₂O₇ ==========
  {
    material: 'La₂Ti₂O₇',
    name: '钛酸镧',
    formula: 'La₂Ti₂O₇',
    bandgap: 3.8,
    electronAffinity: 3.8,
    bandgapType: 'indirect',
    cbm_vs_vacuum: -3.8,
    vbm_vs_vacuum: -7.6,
    cbm_vs_nhe: 0.7,
    vbm_vs_nhe: 4.5,
    notes: '层状钙钛矿',
    applications: ['光催化'],
    source: 'J. Phys. Chem. C 114, 11814 (2010)'
  },

  // ========== NaTaO₃ ==========
  {
    material: 'NaTaO₃',
    name: '钽酸钠',
    formula: 'NaTaO₃',
    bandgap: 4.0,
    electronAffinity: 3.7,
    bandgapType: 'indirect',
    cbm_vs_vacuum: -3.7,
    vbm_vs_vacuum: -7.7,
    cbm_vs_nhe: 0.8,
    vbm_vs_nhe: 4.8,
    notes: '高活性产氢',
    applications: ['光解水产氢'],
    source: 'Energy Environ. Sci. 5, 6460 (2012)'
  },

  // ========== KTaO₃ ==========
  {
    material: 'KTaO₃',
    name: '钽酸钾',
    formula: 'KTaO₃',
    bandgap: 3.6,
    electronAffinity: 4.0,
    bandgapType: 'indirect',
    cbm_vs_vacuum: -4.0,
    vbm_vs_vacuum: -7.6,
    cbm_vs_nhe: 0.5,
    vbm_vs_nhe: 4.1,
    notes: '钙钛矿结构',
    applications: ['光催化'],
    source: 'J. Phys. Chem. C 114, 11814 (2010)'
  }
];

/**
 * 按材料名称搜索
 * @param {string} keyword - 关键词
 * @returns {Array} 匹配的数据
 */
function searchByName(keyword) {
  const normalizedKeyword = keyword.toLowerCase().trim();
  return ELECTRON_AFFINITY_DATA.filter(entry => {
    return entry.material.toLowerCase().includes(normalizedKeyword) ||
           entry.name.toLowerCase().includes(normalizedKeyword) ||
           entry.formula.toLowerCase().includes(normalizedKeyword);
  });
}

/**
 * 按带隙范围搜索
 * @param {number} minEg - 最小带隙 (eV)
 * @param {number} maxEg - 最大带隙 (eV)
 * @returns {Array} 匹配的数据
 */
function searchByBandgap(minEg, maxEg) {
  return ELECTRON_AFFINITY_DATA.filter(entry => {
    return entry.bandgap >= minEg && entry.bandgap <= maxEg;
  });
}

/**
 * 按应用筛选
 * @param {string} application - 应用关键词
 * @returns {Array} 匹配的数据
 */
function searchByApplication(application) {
  const normalizedApp = application.toLowerCase().trim();
  return ELECTRON_AFFINITY_DATA.filter(entry => {
    return entry.applications && entry.applications.some(app => 
      app.toLowerCase().includes(normalizedApp)
    );
  });
}

/**
 * 获取所有材料列表
 * @returns {Array} 材料列表
 */
function getAllMaterials() {
  return ELECTRON_AFFINITY_DATA.map(entry => ({
    material: entry.material,
    name: entry.name,
    bandgap: entry.bandgap
  }));
}

module.exports = {
  ELECTRON_AFFINITY_DATA,
  searchByName,
  searchByBandgap,
  searchByApplication,
  getAllMaterials,
  getMetadata: () => METADATA
};

