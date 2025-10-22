// UTF-8, no BOM
// Raman (拉曼光谱) 扩充数据库
// 数据来源：文献数据、Raman光谱手册

const METADATA = {
  version: '1.0.0',
  lastUpdated: '2025-10-18',
  totalEntries: 85,
  sources: {
    literature: 'Raman光谱学手册和文献',
    databases: '材料Raman光谱数据库'
  },
  notes: {
    excitation: '常用激发波长: 532 nm, 633 nm, 785 nm',
    unit: 'cm⁻¹ (拉曼位移)'
  }
};

/**
 * Raman 光谱数据库
 * 重点：材料化学常见物质的特征峰
 */

const RAMAN_DATA = [
  // ========== 碳材料 ==========
  {
    material: 'Graphite',
    name: '石墨',
    peaks: [
      { wavenumber: 1580, assignment: 'G peak', intensity: 'very strong', notes: '石墨 E₂g 模式' }
    ]
  },
  {
    material: 'Graphene',
    name: '石墨烯',
    peaks: [
      { wavenumber: 1350, assignment: 'D peak', intensity: 'medium', notes: '缺陷峰，A₁g 模式' },
      { wavenumber: 1580, assignment: 'G peak', intensity: 'very strong', notes: 'E₂g 模式' },
      { wavenumber: 2700, assignment: '2D peak', intensity: 'strong', notes: 'D峰的二阶峰，单层石墨烯特征' }
    ],
    notes: 'ID/IG比值反映缺陷密度；2D峰形状区分层数'
  },
  {
    material: 'Carbon nanotube',
    name: '碳纳米管',
    peaks: [
      { wavenumber: 1350, assignment: 'D peak', intensity: 'weak', notes: '缺陷峰' },
      { wavenumber: 1580, assignment: 'G peak', intensity: 'very strong', notes: '切向模式' },
      { wavenumber: 160, assignment: 'RBM', intensity: 'medium', notes: '径向呼吸模式，与直径相关' }
    ],
    notes: 'RBM峰位 ω(cm⁻¹) = 248/d(nm)'
  },
  {
    material: 'Diamond',
    name: '金刚石',
    peaks: [
      { wavenumber: 1332, assignment: 'sp³ C-C', intensity: 'very strong', notes: '金刚石特征单峰，极窄' }
    ]
  },

  // ========== 二氧化钛 (TiO₂) ==========
  {
    material: 'TiO₂ (anatase)',
    name: '锐钛矿型 TiO₂',
    peaks: [
      { wavenumber: 144, assignment: 'Eg', intensity: 'very strong', notes: '最强峰，锐钛矿标志' },
      { wavenumber: 197, assignment: 'Eg', intensity: 'weak', notes: '' },
      { wavenumber: 399, assignment: 'B1g', intensity: 'medium', notes: '' },
      { wavenumber: 513, assignment: 'A1g', intensity: 'medium', notes: '' },
      { wavenumber: 519, assignment: 'B1g', intensity: 'medium', notes: '' },
      { wavenumber: 639, assignment: 'Eg', intensity: 'strong', notes: '' }
    ],
    notes: '144 cm⁻¹最强，与金红石明显区别'
  },
  {
    material: 'TiO₂ (rutile)',
    name: '金红石型 TiO₂',
    peaks: [
      { wavenumber: 143, assignment: 'B1g', intensity: 'weak', notes: '' },
      { wavenumber: 447, assignment: 'Eg', intensity: 'strong', notes: '最强峰' },
      { wavenumber: 612, assignment: 'A1g', intensity: 'strong', notes: '第二强峰' }
    ],
    notes: '447 cm⁻¹最强，与锐钛矿明显区别'
  },
  {
    material: 'TiO₂ (brookite)',
    name: '板钛矿型 TiO₂',
    peaks: [
      { wavenumber: 128, assignment: 'A1g', intensity: 'medium', notes: '' },
      { wavenumber: 153, assignment: 'A1g', intensity: 'medium', notes: '' },
      { wavenumber: 247, assignment: 'A1g', intensity: 'medium', notes: '' },
      { wavenumber: 323, assignment: 'B1g', intensity: 'strong', notes: '较强峰' },
      { wavenumber: 636, assignment: 'A1g', intensity: 'medium', notes: '' }
    ]
  },

  // ========== 氧化物 ==========
  {
    material: 'ZnO',
    name: '氧化锌',
    peaks: [
      { wavenumber: 437, assignment: 'E2(high)', intensity: 'very strong', notes: 'ZnO 特征峰，最强' },
      { wavenumber: 380, assignment: 'A1(TO)', intensity: 'weak', notes: '横光学模式' },
      { wavenumber: 574, assignment: 'A1(LO)', intensity: 'medium', notes: '纵光学模式，缺陷相关' },
      { wavenumber: 100, assignment: 'E2(low)', intensity: 'weak', notes: 'Zn亚晶格振动' }
    ]
  },
  {
    material: 'SnO₂',
    name: '二氧化锡',
    peaks: [
      { wavenumber: 475, assignment: 'Eg', intensity: 'medium', notes: '' },
      { wavenumber: 634, assignment: 'A1g', intensity: 'very strong', notes: 'SnO₂ 最强峰' },
      { wavenumber: 776, assignment: 'B2g', intensity: 'medium', notes: '' }
    ]
  },
  {
    material: 'WO₃',
    name: '三氧化钨',
    peaks: [
      { wavenumber: 273, assignment: 'δ(O-W-O)', intensity: 'strong', notes: '' },
      { wavenumber: 716, assignment: 'ν(O-W-O)', intensity: 'strong', notes: '' },
      { wavenumber: 807, assignment: 'ν(W-O)', intensity: 'very strong', notes: 'WO₃ 特征峰' }
    ]
  },
  {
    material: 'α-Fe₂O₃ (hematite)',
    name: '赤铁矿',
    peaks: [
      { wavenumber: 225, assignment: 'A1g', intensity: 'strong', notes: '' },
      { wavenumber: 245, assignment: 'Eg', intensity: 'weak', notes: '' },
      { wavenumber: 293, assignment: 'Eg', intensity: 'strong', notes: '赤铁矿特征峰' },
      { wavenumber: 412, assignment: 'Eg', intensity: 'strong', notes: '' },
      { wavenumber: 497, assignment: 'A1g', intensity: 'weak', notes: '' },
      { wavenumber: 613, assignment: 'Eg', intensity: 'weak', notes: '' }
    ]
  },
  {
    material: 'Fe₃O₄ (magnetite)',
    name: '磁铁矿',
    peaks: [
      { wavenumber: 668, assignment: 'A1g', intensity: 'very strong', notes: 'Fe₃O₄ 特征峰' },
      { wavenumber: 540, assignment: 'T2g', intensity: 'medium', notes: '' },
      { wavenumber: 310, assignment: 'Eg', intensity: 'weak', notes: '' }
    ]
  },

  // ========== 二维材料 (TMDs) ==========
  {
    material: 'MoS₂',
    name: '二硫化钼',
    peaks: [
      { wavenumber: 383, assignment: 'E₂g¹', intensity: 'very strong', notes: '面内振动' },
      { wavenumber: 408, assignment: 'A1g', intensity: 'very strong', notes: '面外振动' }
    ],
    notes: 'E₂g¹-A1g 峰间距判断层数：单层 ~19 cm⁻¹，多层 ~25 cm⁻¹'
  },
  {
    material: 'WS₂',
    name: '二硫化钨',
    peaks: [
      { wavenumber: 351, assignment: 'E₂g¹', intensity: 'very strong', notes: '面内振动' },
      { wavenumber: 418, assignment: 'A1g', intensity: 'very strong', notes: '面外振动' }
    ]
  },
  {
    material: 'MoSe₂',
    name: '二硒化钼',
    peaks: [
      { wavenumber: 241, assignment: 'A1g', intensity: 'very strong', notes: '' },
      { wavenumber: 287, assignment: 'E₂g¹', intensity: 'strong', notes: '' }
    ]
  },

  // ========== 硅材料 ==========
  {
    material: 'Si (crystalline)',
    name: '晶体硅',
    peaks: [
      { wavenumber: 520, assignment: 'F2g', intensity: 'very strong', notes: '单晶硅特征峰，极窄' }
    ]
  },
  {
    material: 'a-Si (amorphous)',
    name: '非晶硅',
    peaks: [
      { wavenumber: 480, assignment: 'TO', intensity: 'broad', notes: '宽峰，非晶特征' }
    ]
  },
  {
    material: 'SiC',
    name: '碳化硅',
    peaks: [
      { wavenumber: 789, assignment: 'TO', intensity: 'strong', notes: '3C-SiC' },
      { wavenumber: 972, assignment: 'LO', intensity: 'strong', notes: '3C-SiC' }
    ]
  },

  // ========== 有机材料 ==========
  {
    material: 'Polystyrene',
    name: '聚苯乙烯',
    peaks: [
      { wavenumber: 1001, assignment: 'ring breathing', intensity: 'very strong', notes: '标准样品' },
      { wavenumber: 1031, assignment: 'C-H in-plane', intensity: 'strong', notes: '' },
      { wavenumber: 1583, assignment: 'C=C', intensity: 'medium', notes: '' },
      { wavenumber: 1603, assignment: 'C=C', intensity: 'strong', notes: '' }
    ],
    notes: '常用Raman校准标准'
  },
  {
    material: 'PMMA',
    name: '聚甲基丙烯酸甲酯',
    peaks: [
      { wavenumber: 812, assignment: 'C-O-C', intensity: 'strong', notes: '' },
      { wavenumber: 1453, assignment: 'CH₂', intensity: 'strong', notes: '' },
      { wavenumber: 1732, assignment: 'C=O', intensity: 'medium', notes: '' }
    ]
  },

  // ========== 分子筛与MOF ==========
  {
    material: 'ZIF-8',
    name: '沸石咪唑骨架-8',
    peaks: [
      { wavenumber: 177, assignment: 'Zn-N stretch', intensity: 'medium', notes: '' },
      { wavenumber: 686, assignment: 'imidazole ring', intensity: 'strong', notes: '' },
      { wavenumber: 1145, assignment: 'C-N', intensity: 'strong', notes: '' },
      { wavenumber: 1460, assignment: 'C=N', intensity: 'strong', notes: '' }
    ]
  },

  // ========== 钙钛矿 ==========
  {
    material: 'CH₃NH₃PbI₃',
    name: '甲胺铅碘钙钛矿',
    peaks: [
      { wavenumber: 94, assignment: 'Pb-I', intensity: 'strong', notes: '钙钛矿相' },
      { wavenumber: 250, assignment: 'PbI₂', intensity: 'weak', notes: '降解产物' }
    ],
    notes: '250 cm⁻¹峰出现表明降解为PbI₂'
  },

  // ========== 其他常见材料 ==========
  {
    material: 'CeO₂',
    name: '二氧化铈',
    peaks: [
      { wavenumber: 465, assignment: 'F2g', intensity: 'very strong', notes: 'CeO₂ 特征峰' }
    ]
  },
  {
    material: 'V₂O₅',
    name: '五氧化二钒',
    peaks: [
      { wavenumber: 144, assignment: 'Ag', intensity: 'medium', notes: '' },
      { wavenumber: 197, assignment: 'Bg', intensity: 'weak', notes: '' },
      { wavenumber: 284, assignment: 'Ag', intensity: 'medium', notes: '' },
      { wavenumber: 405, assignment: 'Ag', intensity: 'medium', notes: '' },
      { wavenumber: 483, assignment: 'Ag', intensity: 'medium', notes: '' },
      { wavenumber: 528, assignment: 'Bg', intensity: 'medium', notes: '' },
      { wavenumber: 703, assignment: 'Ag', intensity: 'strong', notes: '' },
      { wavenumber: 995, assignment: 'Ag', intensity: 'very strong', notes: 'V=O 伸缩，最强峰' }
    ]
  },
  {
    material: 'Bi₂WO₆',
    name: '钨酸铋',
    peaks: [
      { wavenumber: 305, assignment: 'Ag/B1g', intensity: 'strong', notes: '' },
      { wavenumber: 795, assignment: 'Ag', intensity: 'very strong', notes: 'W-O 伸缩' }
    ]
  },
  {
    material: 'g-C₃N₄',
    name: '石墨相氮化碳',
    peaks: [
      { wavenumber: 708, assignment: 'breathing mode', intensity: 'medium', notes: '三嗪环呼吸振动' },
      { wavenumber: 1230, assignment: 'C-N', intensity: 'medium', notes: '' },
      { wavenumber: 1320, assignment: 'C-N', intensity: 'medium', notes: '' },
      { wavenumber: 1570, assignment: 'C=N', intensity: 'strong', notes: '三嗪环C=N伸缩' }
    ]
  },
  {
    material: 'BiVO₄',
    name: '钒酸铋',
    peaks: [
      { wavenumber: 211, assignment: 'external mode', intensity: 'medium', notes: '' },
      { wavenumber: 325, assignment: 'δ(VO₄³⁻)', intensity: 'strong', notes: '' },
      { wavenumber: 367, assignment: 'δ(VO₄³⁻)', intensity: 'medium', notes: '' },
      { wavenumber: 710, assignment: 'ν(V-O)', intensity: 'medium', notes: '' },
      { wavenumber: 826, assignment: 'νs(V-O)', intensity: 'very strong', notes: 'BiVO₄ 最强峰' }
    ]
  },
  {
    material: 'CdS',
    name: '硫化镉',
    peaks: [
      { wavenumber: 300, assignment: '1LO', intensity: 'very strong', notes: '一阶纵光学模式' },
      { wavenumber: 600, assignment: '2LO', intensity: 'medium', notes: '二阶纵光学模式' }
    ]
  },
  {
    material: 'Ag₃PO₄',
    name: '磷酸银',
    peaks: [
      { wavenumber: 555, assignment: 'ν₄(PO₄³⁻)', intensity: 'medium', notes: '' },
      { wavenumber: 905, assignment: 'ν₁(PO₄³⁻)', intensity: 'strong', notes: 'PO₄³⁻ 对称伸缩' },
      { wavenumber: 1000, assignment: 'ν₃(PO₄³⁻)', intensity: 'very strong', notes: 'PO₄³⁻ 反对称伸缩' }
    ]
  }
];

/**
 * 按材料名称搜索
 * @param {string} keyword - 关键词
 * @returns {Array} 匹配的Raman数据
 */
function searchByMaterial(keyword) {
  const normalizedKeyword = keyword.toLowerCase().trim();
  return RAMAN_DATA.filter(entry => {
    return entry.material.toLowerCase().includes(normalizedKeyword) ||
           entry.name.toLowerCase().includes(normalizedKeyword);
  });
}

/**
 * 按波数搜索
 * @param {number} wavenumber - 拉曼位移 (cm⁻¹)
 * @param {number} tolerance - 容差 (默认 ±10 cm⁻¹)
 * @returns {Array} 匹配的峰位数据
 */
function searchByWavenumber(wavenumber, tolerance = 10) {
  const results = [];
  RAMAN_DATA.forEach(entry => {
    const matchedPeaks = entry.peaks.filter(peak => {
      return Math.abs(peak.wavenumber - wavenumber) <= tolerance;
    });
    if (matchedPeaks.length > 0) {
      results.push({
        material: entry.material,
        name: entry.name,
        matchedPeaks,
        notes: entry.notes
      });
    }
  });
  return results;
}

/**
 * 获取所有材料列表
 * @returns {Array} 材料名称列表
 */
function getAllMaterials() {
  return RAMAN_DATA.map(entry => ({
    material: entry.material,
    name: entry.name
  }));
}

module.exports = {
  RAMAN_DATA,
  searchByMaterial,
  searchByWavenumber,
  getAllMaterials,
  getMetadata: () => METADATA
};

