// 与网页生产版保持一致：从网页端同步的 50 种主流半导体材料
// 数据来源：多个权威数据库和学术文献

// 元数据
const METADATA = {
  version: '2.2.0',
  lastUpdated: '2025-10-18',
  totalMaterials: 136, // 新增34种材料（钙钛矿11种、量子点10种、拓扑材料10种、2D材料3种）
  sources: {
    bandGaps: [
      'Semiconductors Basic Data (ed. O. Madelung, Springer)',
      'Properties of Group-IV, III-V and II-VI Semiconductors (Adachi, 2005)',
      'Electronic Archive: New Semiconductor Materials (Ioffe Institute)',
      'NREL Band Gap Database',
      'Materials Project (materials.org)'
    ],
    mobilities: [
      'Semiconductor Material and Device Characterization (Schroder, 2015)',
      'Electronic Archive: New Semiconductor Materials (Ioffe Institute)'
    ],
    crystalStructure: [
      'International Tables for Crystallography',
      'Crystal Structures Database (Springer Materials)'
    ],
    casNumbers: [
      'CAS Registry (American Chemical Society)',
      'PubChem (NCBI)'
    ],
    physicalProperties: [
      'CRC Handbook of Chemistry and Physics',
      'Landolt-Börnstein Database',
      'Materials Project (materials.org)',
      'NIST Materials Data Repository'
    ]
  },
  dataQuality: {
    bandGap: '±0.05 eV（典型实验误差）',
    mobility: '约1-2个数量级（取决于纯度、温度、制备方法）',
    energyLevels: '±0.1 eV（相对于真空能级）',
    latticeConstant: '±0.001 Å',
    density: '±0.1 g/cm³',
    thermalConductivity: '约±10%'
  },
  notes: [
    '带隙值和能带位置均为室温（300 K）近似值',
    '迁移率数据为典型单晶材料的实验值，实际值可能因材料纯度、晶体质量、掺杂等因素有显著差异',
    'VBM和CBM位置相对于真空能级（0 eV）',
    '部分材料（如氧化物）的能带位置可能随pH、掺杂、表面态等变化',
    '物性数据（密度、热导率等）为室温典型值',
    '数据仅供科研和教学参考，实际应用请参考最新文献'
  ],
  disclaimer: '本数据库仅用于教学和科研参考，不保证所有数据的绝对准确性。使用者应根据具体应用场景参考最新学术文献。'
};

/**
 * 获取模块元数据
 * @returns {object} 元数据对象
 */
function getMetadata() {
  return METADATA;
}

/**
 * 根据材料名称或化学式搜索半导体材料（性能优化版）
 * @param {string} query - 搜索关键词
 * @returns {array} 匹配的材料数组
 */
function searchMaterials(query) {
  if (!query || typeof query !== 'string') {
    return {
      error: '搜索关键词必须为非空字符串',
      errorCode: 'INVALID_QUERY'
    };
  }
  
  const q = query.toLowerCase().trim();
  
  if (q.length === 0) {
    return {
      error: '搜索关键词不能为空',
      errorCode: 'EMPTY_QUERY'
    };
  }
  
  // 优化：使用for循环代替filter，性能更好
  const results = [];
  for (let i = 0; i < semiconductorMaterials.length; i++) {
    const material = semiconductorMaterials[i];
    if (material.name.toLowerCase().includes(q) ||
        material.formula.toLowerCase().includes(q) ||
        (material.aliases && material.aliases.some(alias => alias.toLowerCase().includes(q)))) {
      results.push(material);
    }
  }
  
  return results;
}

/**
 * 按带隙范围筛选半导体材料
 * @param {number} minGap - 最小带隙（eV）
 * @param {number} maxGap - 最大带隙（eV）
 * @returns {array|object} 筛选结果或错误对象
 */
function filterByBandGap(minGap, maxGap) {
  const min = Number(minGap);
  const max = Number(maxGap);
  
  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return {
      error: '带隙范围必须为有效数字',
      errorCode: 'INVALID_NUMBER'
    };
  }
  
  if (min < 0 || max < 0) {
    return {
      error: '带隙不能为负数',
      errorCode: 'NEGATIVE_BANDGAP'
    };
  }
  
  if (min > max) {
    return {
      error: '最小带隙不能大于最大带隙',
      errorCode: 'INVALID_RANGE',
      received: { min, max }
    };
  }
  
  if (min > 10 || max > 10) {
    console.warn(`带隙范围超过 10 eV，这超出了大多数半导体材料的范围`);
  }
  
  const results = semiconductorMaterials.filter(material => {
    const gap = material.bandGap?.value;
    return gap !== undefined && gap >= min && gap <= max;
  });
  
  return results;
}

/**
 * 按应用领域筛选半导体材料
 * @param {string} application - 应用关键词
 * @returns {array|object} 筛选结果或错误对象
 */
function filterByApplication(application) {
  if (!application || typeof application !== 'string') {
    return {
      error: '应用关键词必须为非空字符串',
      errorCode: 'INVALID_APPLICATION'
    };
  }
  
  const app = application.toLowerCase().trim();
  
  const results = semiconductorMaterials.filter(material => {
    return material.applications && material.applications.toLowerCase().includes(app);
  });
  
  return results;
}

/**
 * 获取所有可用的应用类别
 * @returns {array} 应用类别数组
 */
function getApplicationCategories() {
  const apps = new Set();
  semiconductorMaterials.forEach(material => {
    if (material.applications) {
      material.applications.split('、').forEach(app => {
        apps.add(app.trim());
      });
    }
  });
  return Array.from(apps).sort();
}

// 性能优化：缓存统计结果
let _cachedStats = null;

/**
 * 获取材料统计信息（带缓存优化）
 * @param {boolean} forceRefresh - 强制刷新缓存
 * @returns {object} 统计信息
 */
function getMaterialsStatistics(forceRefresh = false) {
  // 如果有缓存且不需要刷新，直接返回
  if (_cachedStats && !forceRefresh) {
    return _cachedStats;
  }
  
  const stats = {
    total: semiconductorMaterials.length,
    byBandGapType: {
      direct: 0,
      indirect: 0,
      semimetal: 0,
      metallic: 0
    },
    bandGapRange: {
      min: Infinity,
      max: -Infinity,
      average: 0
    },
    byCrystalStructure: {},
    byMaterialType: {
      oxides: 0,
      sulfides: 0,
      iii_v: 0,
      ii_vi: 0,
      others: 0
    }
  };
  
  let totalGap = 0;
  let count = 0;
  
  // 优化：使用for循环代替forEach，性能更好
  for (let i = 0; i < semiconductorMaterials.length; i++) {
    const material = semiconductorMaterials[i];
    // 带隙类型统计
    if (material.bandGap?.type) {
      stats.byBandGapType[material.bandGap.type]++;
    }
    
    // 带隙范围统计
    if (material.bandGap?.value !== undefined) {
      const gap = material.bandGap.value;
      if (gap < stats.bandGapRange.min) stats.bandGapRange.min = gap;
      if (gap > stats.bandGapRange.max) stats.bandGapRange.max = gap;
      totalGap += gap;
      count++;
    }
    
    // 晶体结构统计
    if (material.crystalStructure) {
      stats.byCrystalStructure[material.crystalStructure] = 
        (stats.byCrystalStructure[material.crystalStructure] || 0) + 1;
    }
    
    // 材料类型统计（简单分类）
    const formula = material.formula.toLowerCase();
    if (formula.includes('o')) stats.byMaterialType.oxides++;
    else if (formula.includes('s')) stats.byMaterialType.sulfides++;
    else if (['ga', 'in', 'al'].some(el => formula.includes(el)) && 
             ['as', 'p', 'n'].some(el => formula.includes(el))) {
      stats.byMaterialType.iii_v++;
    } else if (['zn', 'cd', 'hg'].some(el => formula.includes(el)) && 
               ['s', 'se', 'te'].some(el => formula.includes(el))) {
      stats.byMaterialType.ii_vi++;
    } else {
      stats.byMaterialType.others++;
    }
  }
  
  stats.bandGapRange.average = count > 0 ? totalGap / count : 0;
  
  // 缓存结果
  _cachedStats = stats;
  
  return stats;
}

const originalMaterials = [
  // 金属氧化物半导体
  { 
    name:'二氧化钛', 
    formula:'TiO₂', 
    aliases:['二氧化钛','tio2','titanium dioxide','钛白粉'], 
    bandGap:{ value:3.2, type:'indirect', temperature:'300 K' }, 
    valenceBand:2.7, 
    conductionBand:-0.5, 
    crystalStructure:'锐钛矿/金红石', 
    electronMobility:'≈ 20 cm²·V⁻¹·s⁻¹', 
    holeMobility:'≈ 1 cm²·V⁻¹·s⁻¹',
    mobility: { electron: 20, hole: 1 },
    excitonBindingEnergy: 4,
    dielectricConstant: 80,
    carrier: { type: 'n型（本征）', concentration: '1e18 cm-3（氧空位）' },
    applications:'光催化、太阳能电池、自清洁涂层', 
    casNumber:'1317-70-0', 
    molecularWeight:79.866, 
    latticeConstant:{ a:3.78, c:9.51, unit:'Å', note:'锐钛矿相' }, 
    density:3.89, 
    thermalConductivity:11.7,
    stability: '化学稳定性高，光稳定',
    notes: '最常用光催化剂，锐钛矿相活性高于金红石相'
  },
  { 
    name:'氧化锌', 
    formula:'ZnO', 
    aliases:['氧化锌','zno','zinc oxide'], 
    bandGap:{ value:3.3, type:'direct', temperature:'300 K' }, 
    valenceBand:2.9, 
    conductionBand:-0.4, 
    crystalStructure:'纤锌矿结构', 
    electronMobility:'≈ 200 cm²·V⁻¹·s⁻¹', 
    holeMobility:'≈ 5 cm²·V⁻¹·s⁻¹',
    mobility: { electron: 200, hole: 5 },
    excitonBindingEnergy: 60,
    dielectricConstant: 8.5,
    carrier: { type: 'n型', concentration: '1e17 cm-3（本征缺陷）' },
    applications:'透明导电膜、紫外LED、压电器件', 
    casNumber:'1314-13-2', 
    molecularWeight:81.4, 
    latticeConstant:{ a:3.25, c:5.21, unit:'Å' }, 
    density:5.61, 
    thermalConductivity:54,
    stability: '空气中稳定',
    notes: '大激子结合能，室温激子发光'
  },
  { 
    name:'三氧化钨', 
    formula:'WO₃', 
    aliases:['三氧化钨','wo3','tungsten trioxide'], 
    bandGap:{ value:2.8, type:'indirect', temperature:'300 K' }, 
    valenceBand:3.2, 
    conductionBand:0.4, 
    crystalStructure:'钙钛矿相关结构', 
    electronMobility:'≈ 12 cm²·V⁻¹·s⁻¹', 
    holeMobility:'≈ 2 cm²·V⁻¹·s⁻¹',
    mobility: { electron: 12, hole: 2 },
    excitonBindingEnergy: 3,
    dielectricConstant: 20,
    carrier: { type: 'n型', concentration: '1e18 cm-3（氧空位）' },
    applications:'电致变色、光催化、气敏传感器', 
    casNumber:'1314-35-8', 
    molecularWeight:231.84,
    latticeConstant: { a: 7.30, b: 7.54, c: 7.69, unit: 'Å', note: '单斜相' },
    density: 7.16,
    thermalConductivity: 3.0,
    stability: '空气中稳定',
    notes: '电致变色材料，氧空位导致n型导电'
  },
  { 
    name:'氧化铜', 
    formula:'CuO', 
    aliases:['氧化铜','cuo','copper oxide'], 
    bandGap:{ value:1.4, type:'direct', temperature:'300 K' }, 
    valenceBand:1.8, 
    conductionBand:0.4, 
    crystalStructure:'单斜结构', 
    electronMobility:'≈ 0.1 cm²·V⁻¹·s⁻¹', 
    holeMobility:'≈ 0.1 cm²·V⁻¹·s⁻¹',
    mobility: { electron: 0.1, hole: 0.1 },
    excitonBindingEnergy: 150,
    dielectricConstant: 18,
    carrier: { type: 'p型', concentration: '1e19 cm-3' },
    applications:'太阳能电池、光催化、抗菌材料', 
    casNumber:'163686-95-1', 
    molecularWeight:79.55,
    latticeConstant: { a: 4.68, b: 3.42, c: 5.13, unit: 'Å' },
    density: 6.31,
    thermalConductivity: 33,
    stability: '空气中稳定',
    notes: 'p型氧化物半导体，低成本'
  },
  { 
    name:'氧化铟', 
    formula:'In₂O₃', 
    aliases:['氧化铟','in2o3','indium oxide'], 
    bandGap:{ value:3.6, type:'direct', temperature:'300 K' }, 
    valenceBand:3.2, 
    conductionBand:-0.4, 
    crystalStructure:'立方结构', 
    electronMobility:'≈ 30 cm²·V⁻¹·s⁻¹', 
    holeMobility:'≈ 2 cm²·V⁻¹·s⁻¹',
    mobility: { electron: 30, hole: 2 },
    excitonBindingEnergy: 5,
    dielectricConstant: 9,
    carrier: { type: 'n型（简并）', concentration: '1e20 cm-3' },
    applications:'透明导电膜、显示器', 
    casNumber:'1312-43-2', 
    molecularWeight:277.63,
    latticeConstant: { a: 10.12, unit: 'Å' },
    density: 7.18,
    thermalConductivity: 9.0,
    stability: '空气中稳定',
    notes: 'ITO（掺锡）是最常用透明导电材料'
  },
  { 
    name:'氧化镍', 
    formula:'NiO', 
    aliases:['氧化镍','nio','nickel oxide'], 
    bandGap:{ value:3.4, type:'direct', temperature:'300 K' }, 
    valenceBand:1.7, 
    conductionBand:-1.7, 
    crystalStructure:'岩盐结构', 
    electronMobility:'≈ 0.1 cm²·V⁻¹·s⁻¹', 
    holeMobility:'≈ 2.8 cm²·V⁻¹·s⁻¹',
    mobility: { electron: 0.1, hole: 2.8 },
    excitonBindingEnergy: 800,
    dielectricConstant: 11.9,
    carrier: { type: 'p型', concentration: '1e18 cm-3' },
    applications:'电池电极、电致变色、传感器', 
    casNumber:'11099-02-8', 
    molecularWeight:74.693,
    latticeConstant: { a: 4.17, unit: 'Å' },
    density: 6.67,
    thermalConductivity: 18,
    stability: '空气中稳定',
    notes: 'p型透明导电氧化物，空穴传输层'
  },
  { 
    name:'四氧化三钴', 
    formula:'Co₃O₄', 
    aliases:['四氧化三钴','co3o4','cobalt oxide'], 
    bandGap:{ value:1.6, type:'direct', temperature:'300 K' }, 
    valenceBand:1.8, 
    conductionBand:0.2, 
    crystalStructure:'尖晶石结构', 
    electronMobility:'≈ 0.3 cm²·V⁻¹·s⁻¹', 
    holeMobility:'≈ 3.2 cm²·V⁻¹·s⁻¹',
    mobility: { electron: 0.3, hole: 3.2 },
    excitonBindingEnergy: 200,
    dielectricConstant: 12,
    carrier: { type: 'p型', concentration: '1e19 cm-3' },
    applications:'锂电池、电催化、传感器', 
    casNumber:'11104-61-3', 
    molecularWeight:240.797,
    latticeConstant: { a: 8.08, unit: 'Å' },
    density: 6.11,
    thermalConductivity: 4.5,
    stability: '空气中稳定',
    notes: '混合价态氧化物，电催化活性高'
  },
  { 
    name:'二氧化锡', 
    formula:'SnO₂', 
    aliases:['二氧化锡','sno2','tin oxide'], 
    bandGap:{ value:3.6, type:'direct', temperature:'300 K' }, 
    valenceBand:4.0, 
    conductionBand:0.4, 
    crystalStructure:'金红石结构', 
    electronMobility:'≈ 250 cm²·V⁻¹·s⁻¹', 
    holeMobility:'≈ 2 cm²·V⁻¹·s⁻¹',
    mobility: { electron: 250, hole: 2 },
    excitonBindingEnergy: 5,
    dielectricConstant: 13.5,
    carrier: { type: 'n型（简并）', concentration: '1e20 cm-3' },
    applications:'气敏传感器、透明导电膜', 
    casNumber:'18282-10-5', 
    molecularWeight:150.71,
    latticeConstant: { a: 4.74, c: 3.19, unit: 'Å' },
    density: 6.95,
    thermalConductivity: 60,
    stability: '高温稳定',
    notes: 'FTO（掺氟）透明导电材料，气敏性能优异'
  },
  { 
    name:'三氧化二铁', 
    formula:'Fe₂O₃', 
    aliases:['三氧化二铁','fe2o3','iron oxide','赤铁矿'], 
    bandGap:{ value:2.2, type:'indirect', temperature:'300 K' }, 
    valenceBand:2.4, 
    conductionBand:0.2, 
    crystalStructure:'刚玉结构', 
    electronMobility:'≈ 0.1 cm²·V⁻¹·s⁻¹', 
    holeMobility:'≈ 0.01 cm²·V⁻¹·s⁻¹',
    mobility: { electron: 0.1, hole: 0.01 },
    excitonBindingEnergy: 50,
    dielectricConstant: 12,
    carrier: { type: 'n型', concentration: '1e16 cm-3' },
    applications:'光催化、磁性材料、颜料', 
    casNumber:'1309-37-1', 
    molecularWeight:159.69,
    latticeConstant: { a: 5.04, c: 13.75, unit: 'Å', note: '六方' },
    density: 5.26,
    thermalConductivity: 6.0,
    stability: '极其稳定，抗腐蚀',
    notes: '磁性半导体，低成本，环境友好'
  },
  { 
    name:'钒酸铋', 
    formula:'BiVO₄', 
    aliases:['钒酸铋','bivo4','bismuth vanadate'], 
    bandGap:{ value:2.4, type:'direct', temperature:'300 K' }, 
    valenceBand:2.9, 
    conductionBand:0.5, 
    crystalStructure:'单斜白钨矿结构', 
    electronMobility:'≈ 0.05 cm²·V⁻¹·s⁻¹', 
    holeMobility:'≈ 0.02 cm²·V⁻¹·s⁻¹',
    mobility: { electron: 0.05, hole: 0.02 },
    excitonBindingEnergy: 10,
    dielectricConstant: 68,
    carrier: { type: 'n型', concentration: '1e17 cm-3' },
    applications:'光催化分解水、颜料', 
    casNumber:'14059-33-7', 
    molecularWeight:323.92,
    latticeConstant: { a: 5.20, b: 5.09, c: 11.70, unit: 'Å' },
    density: 6.95,
    thermalConductivity: 1.2,
    stability: '化学稳定性好',
    notes: '可见光响应光催化剂，能带位置适合分解水'
  },

  // 金属硫化物半导体
  { 
    name:'硫化镉', 
    formula:'CdS', 
    aliases:['硫化镉','cds','cadmium sulfide'], 
    bandGap:{ value:2.4, type:'direct', temperature:'300 K' }, 
    valenceBand:2.0, 
    conductionBand:-0.4, 
    crystalStructure:'纤锌矿/闪锌矿结构', 
    electronMobility:'≈ 340 cm²·V⁻¹·s⁻¹', 
    holeMobility:'≈ 50 cm²·V⁻¹·s⁻¹',
    mobility: { electron: 340, hole: 50 },
    excitonBindingEnergy: 28,
    dielectricConstant: 8.9,
    carrier: { type: 'n型', concentration: '1e16 cm-3（本征）' },
    applications:'太阳能电池、光电器件、发光材料', 
    casNumber:'1306-23-6', 
    molecularWeight:144.47, 
    latticeConstant:{ a:5.82, c:6.71, unit:'Å', note:'纤锌矿' }, 
    density:4.82, 
    thermalConductivity:20.0, 
    warnings:['⚠️ 含镉，具有毒性，处理时需注意安全'],
    stability: '空气中稳定，避免酸性环境',
    notes: 'II-VI族经典半导体，量子点核心材料'
  },
  { 
    name:'硫化锌', 
    formula:'ZnS', 
    aliases:['硫化锌','zns','zinc sulfide','闪锌矿'], 
    bandGap:{ value:3.7, type:'direct', temperature:'300 K' }, 
    valenceBand:1.8, 
    conductionBand:-1.9, 
    crystalStructure:'闪锌矿/纤锌矿结构', 
    electronMobility:'≈ 165 cm²·V⁻¹·s⁻¹', 
    holeMobility:'≈ 5 cm²·V⁻¹·s⁻¹',
    mobility: { electron: 165, hole: 5 },
    excitonBindingEnergy: 39,
    dielectricConstant: 8.3,
    carrier: { type: 'n型', concentration: '1e15 cm-3' },
    applications:'发光材料、红外窗口、荧光粉', 
    casNumber:'1314-98-3', 
    molecularWeight:97.4,
    latticeConstant: { a: 5.41, unit: 'Å', note: '闪锌矿' },
    density: 4.09,
    thermalConductivity: 27,
    stability: '空气中稳定',
    notes: '宽带隙II-VI族半导体，荧光材料'
  },
  { 
    name:'二硫化钼', 
    formula:'MoS₂', 
    aliases:['二硫化钼','mos2','molybdenum disulfide'], 
    bandGap:{ value:1.8, type:'indirect', temperature:'300 K' }, 
    valenceBand:1.8, 
    conductionBand:-0.1, 
    crystalStructure:'层状六方结构', 
    electronMobility:'≈ 200 cm²·V⁻¹·s⁻¹', 
    holeMobility:'≈ 180 cm²·V⁻¹·s⁻¹',
    mobility: { electron: 200, hole: 180 },
    excitonBindingEnergy: 300,
    dielectricConstant: 15,
    carrier: { type: 'n型', concentration: '可调' },
    applications:'晶体管、润滑剂、锂电池', 
    casNumber:'1317-33-5', 
    molecularWeight:160.1,
    latticeConstant: { a: 3.16, c: 12.29, unit: 'Å' },
    density: 5.06,
    thermalConductivity: 34.5,
    stability: '空气中稳定',
    notes: '典型2D半导体，单层直接带隙1.8eV，多层间接带隙1.2eV'
  },
  { 
    name:'二硫化钨', 
    formula:'WS₂', 
    aliases:['二硫化钨','ws2','tungsten disulfide'], 
    bandGap:{ value:2.1, type:'indirect', temperature:'300 K' }, 
    valenceBand:1.6, 
    conductionBand:-0.5, 
    crystalStructure:'层状六方结构', 
    electronMobility:'≈ 250 cm²·V⁻¹·s⁻¹', 
    holeMobility:'≈ 150 cm²·V⁻¹·s⁻¹',
    mobility: { electron: 250, hole: 150 },
    excitonBindingEnergy: 320,
    dielectricConstant: 13,
    carrier: { type: 'n型', concentration: '可调' },
    applications:'电子器件、润滑剂', 
    casNumber:'12138-09-9', 
    molecularWeight:248.0,
    latticeConstant: { a: 3.15, c: 12.32, unit: 'Å' },
    density: 7.50,
    thermalConductivity: 32,
    stability: '空气中稳定',
    notes: '与MoS2类似，激子结合能更大'
  },
  { 
    name:'硫化铅', 
    formula:'PbS', 
    aliases:['硫化铅','pbs','lead sulfide','方铅矿'], 
    bandGap:{ value:0.4, type:'direct', temperature:'300 K' }, 
    valenceBand:0.9, 
    conductionBand:0.5, 
    crystalStructure:'岩盐结构', 
    electronMobility:'≈ 600 cm²·V⁻¹·s⁻¹', 
    holeMobility:'≈ 700 cm²·V⁻¹·s⁻¹',
    mobility: { electron: 600, hole: 700 },
    excitonBindingEnergy: 25,
    dielectricConstant: 170,
    carrier: { type: '双极性', concentration: '1e17 cm-3' },
    applications:'红外探测器、太阳能电池', 
    casNumber:'1314-87-0', 
    molecularWeight:239.27, 
    latticeConstant:{ a:5.94, unit:'Å' }, 
    density:7.60, 
    thermalConductivity:2.5, 
    warnings:['⚠️ 含铅，具有毒性，处理时需注意安全'],
    stability: '空气中稳定',
    notes: '窄带隙IV-VI族半导体，高介电常数，红外量子点材料'
  },

  // III-V族半导体
  { 
    name:'砷化镓', 
    formula:'GaAs', 
    aliases:['砷化镓','gaas','gallium arsenide'], 
    bandGap:{ value:1.4, type:'direct', temperature:'300 K' }, 
    valenceBand:0.8, 
    conductionBand:-0.6, 
    crystalStructure:'闪锌矿结构', 
    electronMobility:'≈ 8500 cm²·V⁻¹·s⁻¹', 
    holeMobility:'≈ 400 cm²·V⁻¹·s⁻¹',
    mobility: { electron: 8500, hole: 400 },
    excitonBindingEnergy: 4.2,
    dielectricConstant: 12.9,
    carrier: { type: 'n型（掺杂）', concentration: '可调' },
    applications:'RF器件、LED、激光器', 
    casNumber:'1303-00-0', 
    molecularWeight:144.645, 
    latticeConstant:{ a:5.65, unit:'Å' }, 
    density:5.32, 
    thermalConductivity:55,
    stability: '空气中稳定，高温下易氧化',
    notes: '高迁移率，直接带隙，III-V族半导体的代表'
  },
  { 
    name:'磷化铟', 
    formula:'InP', 
    aliases:['磷化铟','inp','indium phosphide'], 
    bandGap:{ value:1.3, type:'direct', temperature:'300 K' }, 
    valenceBand:0.7, 
    conductionBand:-0.6, 
    crystalStructure:'闪锌矿结构', 
    electronMobility:'≈ 5400 cm²·V⁻¹·s⁻¹', 
    holeMobility:'≈ 200 cm²·V⁻¹·s⁻¹',
    mobility: { electron: 5400, hole: 200 },
    excitonBindingEnergy: 5,
    dielectricConstant: 12.4,
    carrier: { type: 'n型或p型（掺杂）', concentration: '可调' },
    applications:'高频器件、光纤通信', 
    casNumber:'22398-80-7', 
    molecularWeight:145.792, 
    latticeConstant:{ a:5.87, unit:'Å' }, 
    density:4.81, 
    thermalConductivity:68,
    stability: '空气中稳定',
    notes: '直接带隙，光纤通信1.55μm波段激光器材料'
  },
  { 
    name:'氮化镓', 
    formula:'GaN', 
    aliases:['氮化镓','gan','gallium nitride'], 
    bandGap:{ value:3.4, type:'direct', temperature:'300 K' }, 
    valenceBand:1.8, 
    conductionBand:-1.6, 
    crystalStructure:'纤锌矿结构', 
    electronMobility:'≈ 1200 cm²·V⁻¹·s⁻¹', 
    holeMobility:'≈ 10 cm²·V⁻¹·s⁻¹',
    mobility: { electron: 1200, hole: 10 },
    excitonBindingEnergy: 25,
    dielectricConstant: 9.5,
    carrier: { type: 'n型（非故意掺杂）', concentration: '1e16-1e17 cm-3' },
    applications:'功率器件、蓝光LED、RF器件', 
    casNumber:'25617-97-4', 
    molecularWeight:83.73, 
    latticeConstant:{ a:3.19, c:5.19, unit:'Å' }, 
    density:6.15, 
    thermalConductivity:130,
    stability: '高温稳定，化学惰性',
    notes: '第三代半导体，宽带隙，高击穿场强'
  },
  { 
    name:'磷化镓', 
    formula:'GaP', 
    aliases:['磷化镓','gap','gallium phosphide'], 
    bandGap:{ value:2.3, type:'indirect', temperature:'300 K' }, 
    valenceBand:1.5, 
    conductionBand:-0.8, 
    crystalStructure:'闪锌矿结构', 
    electronMobility:'≈ 110 cm²·V⁻¹·s⁻¹', 
    holeMobility:'≈ 75 cm²·V⁻¹·s⁻¹',
    mobility: { electron: 110, hole: 75 },
    excitonBindingEnergy: 18,
    dielectricConstant: 11.1,
    carrier: { type: 'n型或p型', concentration: '可调' },
    applications:'绿光LED、红光LED', 
    casNumber:'12063-98-8', 
    molecularWeight:100.7, 
    latticeConstant:{ a:5.45, unit:'Å' }, 
    density:4.14, 
    thermalConductivity:110,
    stability: '空气中稳定',
    notes: '间接带隙，掺氮后可发光'
  },
  { 
    name:'砷化铟', 
    formula:'InAs', 
    aliases:['砷化铟','inas','indium arsenide'], 
    bandGap:{ value:0.36, type:'direct', temperature:'300 K' }, 
    valenceBand:0.2, 
    conductionBand:-0.16, 
    crystalStructure:'闪锌矿结构', 
    electronMobility:'≈ 33000 cm²·V⁻¹·s⁻¹', 
    holeMobility:'≈ 460 cm²·V⁻¹·s⁻¹',
    mobility: { electron: 33000, hole: 460 },
    excitonBindingEnergy: 1.2,
    dielectricConstant: 15.15,
    carrier: { type: 'n型', concentration: '1e16 cm-3（本征）' },
    applications:'红外探测器、高速器件', 
    casNumber:'1303-11-3', 
    molecularWeight:189.7, 
    latticeConstant:{ a:6.06, unit:'Å' }, 
    density:5.67, 
    thermalConductivity:27,
    stability: '空气中稳定',
    notes: '最高电子迁移率III-V族半导体'
  },
  { name:'铝镓砷', formula:'Al₀.₃Ga₀.₇As', aliases:['铝镓砷','algaas','aluminum gallium arsenide'], bandGap:{ value:1.85, type:'direct', temperature:'300 K' }, valenceBand:1.1, conductionBand:-0.75, crystalStructure:'闪锌矿结构', electronMobility:'≈ 3000 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 250 cm²·V⁻¹·s⁻¹', mobility:{ electron:3000, hole:250 }, excitonBindingEnergy:5, dielectricConstant:12, carrier:{ type:'n型或p型', concentration:'可调' }, applications:'红光LED、激光二极管、异质结晶体管', molecularWeight:116.2, latticeConstant:{ a:5.65, unit:'Å', note:'接近GaAs衬底' }, density:4.85, thermalConductivity:45, stability:'空气中稳定', notes:'与GaAs晶格匹配，异质结材料' },
  { name:'铟镓砷', formula:'In₀.₅₃Ga₀.₄₇As', aliases:['铟镓砷','ingaas','indium gallium arsenide'], bandGap:{ value:0.75, type:'direct', temperature:'300 K' }, valenceBand:0.5, conductionBand:-0.25, crystalStructure:'闪锌矿结构', electronMobility:'≈ 13000 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 350 cm²·V⁻¹·s⁻¹', mobility:{ electron:13000, hole:350 }, excitonBindingEnergy:2, dielectricConstant:14, carrier:{ type:'n型', concentration:'可调' }, applications:'光纤通信激光器(1.55μm)、红外探测器、高速晶体管', molecularWeight:163.8, latticeConstant:{ a:5.87, unit:'Å', note:'与InP衬底晶格匹配' }, density:5.50, thermalConductivity:35, stability:'空气中稳定', notes:'光通信1.55μm波段核心材料' },
  { name:'铟镓磷', formula:'In₀.₅Ga₀.₅P', aliases:['铟镓磷','ingap','indium gallium phosphide'], bandGap:{ value:1.9, type:'direct', temperature:'300 K' }, valenceBand:1.3, conductionBand:-0.6, crystalStructure:'闪锌矿结构', electronMobility:'≈ 1500 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 120 cm²·V⁻¹·s⁻¹', mobility:{ electron:1500, hole:120 }, excitonBindingEnergy:8, dielectricConstant:11.5, carrier:{ type:'n型或p型', concentration:'可调' }, applications:'黄绿光LED(550-570nm)、高效太阳能电池', molecularWeight:123.2, latticeConstant:{ a:5.65, unit:'Å' }, density:4.48, thermalConductivity:65, stability:'空气中稳定', notes:'高效LED材料，带隙可调' },
  { name:'铝铟磷', formula:'Al₀.₅₂In₀.₄₈P', aliases:['铝铟磷','alinp','aluminum indium phosphide'], bandGap:{ value:2.3, type:'indirect', temperature:'300 K' }, valenceBand:1.6, conductionBand:-0.7, crystalStructure:'闪锌矿结构', electronMobility:'≈ 180 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 80 cm²·V⁻¹·s⁻¹', mobility:{ electron:180, hole:80 }, excitonBindingEnergy:12, dielectricConstant:10, carrier:{ type:'n型', concentration:'可调' }, applications:'高效LED窗口层、太阳能电池', molecularWeight:79.3, latticeConstant:{ a:5.65, unit:'Å', note:'与GaAs衬底晶格匹配' }, density:3.59, thermalConductivity:85, stability:'空气中稳定', notes:'LED窗口层，提高出光效率' },
  { name:'砷化镓磷', formula:'GaAs₀.₅P₀.₅', aliases:['砷化镓磷','gaasp','gallium arsenide phosphide'], bandGap:{ value:1.9, type:'indirect', temperature:'300 K' }, valenceBand:1.4, conductionBand:-0.5, crystalStructure:'闪锌矿结构', electronMobility:'≈ 1200 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 150 cm²·V⁻¹·s⁻¹', mobility:{ electron:1200, hole:150 }, excitonBindingEnergy:10, dielectricConstant:11.8, carrier:{ type:'n型或p型', concentration:'可调' }, applications:'红橙光LED、光电二极管', molecularWeight:122.7, latticeConstant:{ a:5.55, unit:'Å' }, density:4.73, thermalConductivity:82, stability:'空气中稳定', notes:'带隙可调（1.4-2.3eV），红橙光LED' },
  { name:'铝镓氮', formula:'Al₀.₃Ga₀.₇N', aliases:['铝镓氮','algan','aluminum gallium nitride'], bandGap:{ value:3.8, type:'direct', temperature:'300 K' }, valenceBand:2.2, conductionBand:-1.6, crystalStructure:'纤锌矿结构', electronMobility:'≈ 600 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 8 cm²·V⁻¹·s⁻¹', mobility:{ electron:600, hole:8 }, excitonBindingEnergy:35, dielectricConstant:9, carrier:{ type:'n型', concentration:'可调' }, applications:'紫外LED(280-320nm)、高功率HEMT器件', molecularWeight:77.2, latticeConstant:{ a:3.16, c:5.17, unit:'Å' }, density:5.89, thermalConductivity:110, stability:'高温稳定', notes:'紫外LED，HEMT高电子迁移率晶体管' },
  { name:'铟镓氮', formula:'In₀.₁₅Ga₀.₈₅N', aliases:['铟镓氮','ingan','indium gallium nitride'], bandGap:{ value:2.8, type:'direct', temperature:'300 K' }, valenceBand:1.5, conductionBand:-1.3, crystalStructure:'纤锌矿结构', electronMobility:'≈ 900 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 15 cm²·V⁻¹·s⁻¹', mobility:{ electron:900, hole:15 }, excitonBindingEnergy:20, dielectricConstant:10, carrier:{ type:'n型', concentration:'可调' }, applications:'蓝绿光LED(450-520nm)、激光二极管', molecularWeight:100.5, latticeConstant:{ a:3.24, c:5.26, unit:'Å' }, density:6.32, thermalConductivity:95, stability:'空气中稳定', notes:'蓝光LED核心材料，带隙可调' },
  { name:'铟镓砷磷', formula:'InGaAsP', aliases:['铟镓砷磷','ingaasp','indium gallium arsenide phosphide'], bandGap:{ value:1.15, type:'direct', temperature:'300 K' }, valenceBand:0.7, conductionBand:-0.45, crystalStructure:'闪锌矿结构', electronMobility:'≈ 4500 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 180 cm²·V⁻¹·s⁻¹', mobility:{ electron:4500, hole:180 }, excitonBindingEnergy:3, dielectricConstant:13, carrier:{ type:'n型或p型', concentration:'可调' }, applications:'光纤通信激光器(1.3-1.55μm)、光放大器、光电探测器', molecularWeight:155.5, latticeConstant:{ a:5.87, unit:'Å', note:'四元合金，可调带隙0.95-1.35eV' }, density:5.15, thermalConductivity:40, stability:'空气中稳定', notes:'四元合金，光通信核心材料' },

  // 碳化物和氮化物半导体
  { 
    name:'碳化硅', 
    formula:'SiC', 
    aliases:['碳化硅','sic','silicon carbide','金刚砂'], 
    bandGap:{ value:3.3, type:'indirect', temperature:'300 K' }, 
    valenceBand:2.2, 
    conductionBand:-1.1, 
    crystalStructure:'4H-SiC六方结构', 
    electronMobility:'≈ 950 cm²·V⁻¹·s⁻¹', 
    holeMobility:'≈ 120 cm²·V⁻¹·s⁻¹',
    mobility: { electron: 950, hole: 120 },
    excitonBindingEnergy: 18,
    dielectricConstant: 9.7,
    carrier: { type: 'n型或p型（掺杂）', concentration: '可调' },
    applications:'高温高功率器件、电动汽车', 
    casNumber:'409-21-2', 
    molecularWeight:40.096,
    latticeConstant: { a: 3.08, c: 10.05, unit: 'Å', note: '4H多型' },
    density: 3.21,
    thermalConductivity: 490,
    stability: '极高温稳定（>1600°C）',
    notes: '第三代半导体，高击穿场强，耐高温'
  },
  { 
    name:'氮化硼', 
    formula:'BN', 
    aliases:['氮化硼','bn','boron nitride'], 
    bandGap:{ value:5.9, type:'indirect', temperature:'300 K' }, 
    valenceBand:3.5, 
    conductionBand:-2.4, 
    crystalStructure:'六方层状结构', 
    electronMobility:'≈ 200 cm²·V⁻¹·s⁻¹', 
    holeMobility:'≈ 20 cm²·V⁻¹·s⁻¹',
    mobility: { electron: 200, hole: 20 },
    excitonBindingEnergy: 700,
    dielectricConstant: 5.1,
    carrier: { type: '绝缘体（掺杂可调）', concentration: '<1e10 cm-3' },
    applications:'绝缘材料、散热材料', 
    casNumber:'10043-11-5', 
    molecularWeight:24.82,
    latticeConstant: { a: 2.50, c: 6.66, unit: 'Å', note: '六方' },
    density: 2.27,
    thermalConductivity: 600,
    stability: '极高温稳定（>2000°C）',
    notes: '超宽带隙，类石墨烯结构，深紫外发光'
  },
  { 
    name:'氮化铝', 
    formula:'AlN', 
    aliases:['氮化铝','aln','aluminum nitride'], 
    bandGap:{ value:6.2, type:'direct', temperature:'300 K' }, 
    valenceBand:3.8, 
    conductionBand:-2.4, 
    crystalStructure:'纤锌矿结构', 
    electronMobility:'≈ 300 cm²·V⁻¹·s⁻¹', 
    holeMobility:'≈ 10 cm²·V⁻¹·s⁻¹',
    mobility: { electron: 300, hole: 10 },
    excitonBindingEnergy: 80,
    dielectricConstant: 8.5,
    carrier: { type: 'n型（掺杂）', concentration: '可调' },
    applications:'深紫外LED、高功率器件', 
    casNumber:'24304-00-5', 
    molecularWeight:40.99,
    latticeConstant: { a: 3.11, c: 4.98, unit: 'Å' },
    density: 3.26,
    thermalConductivity: 285,
    stability: '高温化学稳定',
    notes: '超宽带隙，深紫外发光，高热导率'
  },

  // 钙钛矿和复合氧化物
  { 
    name:'钛酸锶', 
    formula:'SrTiO₃', 
    aliases:['钛酸锶','srtio3','strontium titanate'], 
    bandGap:{ value:3.2, type:'indirect', temperature:'300 K' }, 
    valenceBand:2.6, 
    conductionBand:-0.6, 
    crystalStructure:'立方钙钛矿结构', 
    electronMobility:'≈ 5 cm²·V⁻¹·s⁻¹', 
    holeMobility:'≈ 1 cm²·V⁻¹·s⁻¹',
    mobility: { electron: 5, hole: 1 },
    excitonBindingEnergy: 6,
    dielectricConstant: 300,
    carrier: { type: 'n型（掺杂）', concentration: '可调' },
    applications:'光催化、电子器件基底', 
    casNumber:'12060-59-2', 
    molecularWeight:183.49,
    latticeConstant: { a: 3.91, unit: 'Å' },
    density: 5.12,
    thermalConductivity: 12,
    stability: '化学稳定性极高',
    notes: '量子材料平台，超高介电常数，二维电子气'
  },
  { 
    name:'钛酸钡', 
    formula:'BaTiO₃', 
    aliases:['钛酸钡','batio3','barium titanate'], 
    bandGap:{ value:3.2, type:'indirect', temperature:'300 K' }, 
    valenceBand:2.8, 
    conductionBand:-0.4, 
    crystalStructure:'四方钙钛矿结构', 
    electronMobility:'≈ 0.5 cm²·V⁻¹·s⁻¹', 
    holeMobility:'≈ 0.1 cm²·V⁻¹·s⁻¹',
    mobility: { electron: 0.5, hole: 0.1 },
    excitonBindingEnergy: 8,
    dielectricConstant: 1700,
    carrier: { type: '绝缘体（掺杂可调）', concentration: '<1e12 cm-3' },
    applications:'压电陶瓷、铁电材料', 
    casNumber:'12047-27-7', 
    molecularWeight:233.19,
    latticeConstant: { a: 3.99, c: 4.04, unit: 'Å', note: '四方相' },
    density: 6.02,
    thermalConductivity: 3.0,
    stability: '空气中稳定',
    notes: '铁电材料，超高介电常数，居里温度120°C'
  },

  // 其他重要半导体
  { name:'硫化锑', formula:'Sb₂S₃', aliases:['硫化锑','sb2s3','antimony sulfide','辉锑矿'], bandGap:{ value:1.7, type:'direct', temperature:'300 K' }, valenceBand:1.3, conductionBand:-0.4, crystalStructure:'斜方结构', electronMobility:'≈ 15 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 2 cm²·V⁻¹·s⁻¹', mobility:{ electron:15, hole:2 }, excitonBindingEnergy:250, dielectricConstant:18, carrier:{ type:'p型', concentration:'1e17 cm-3' }, applications:'太阳能电池、热电材料', casNumber:'1315-04-4', molecularWeight:339.7, latticeConstant:{ a:11.31, b:11.28, c:3.84, unit:'Å' }, density:4.64, thermalConductivity:1.6, stability:'空气中稳定', notes:'各向异性，适合薄膜太阳能电池' },
  { name:'硫化铋', formula:'Bi₂S₃', aliases:['硫化铋','bi2s3','bismuth sulfide'], bandGap:{ value:1.3, type:'direct', temperature:'300 K' }, valenceBand:0.9, conductionBand:-0.4, crystalStructure:'斜方结构', electronMobility:'≈ 450 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 680 cm²·V⁻¹·s⁻¹', mobility:{ electron:450, hole:680 }, excitonBindingEnergy:100, dielectricConstant:47, carrier:{ type:'n型', concentration:'1e17 cm-3' }, applications:'热电材料、太阳能电池', casNumber:'1345-07-9', molecularWeight:514.2, latticeConstant:{ a:11.15, b:11.30, c:3.98, unit:'Å' }, density:6.78, thermalConductivity:0.9, stability:'空气中稳定', notes:'高载流子迁移率，适合热电应用' },
  { name:'硫化锡', formula:'SnS', aliases:['硫化锡','sns','tin sulfide'], bandGap:{ value:1.3, type:'indirect', temperature:'300 K' }, valenceBand:0.9, conductionBand:-0.4, crystalStructure:'斜方结构', electronMobility:'≈ 100 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 90 cm²·V⁻¹·s⁻¹', mobility:{ electron:100, hole:90 }, excitonBindingEnergy:180, dielectricConstant:17, carrier:{ type:'p型', concentration:'1e16 cm-3' }, applications:'太阳能电池、锂电池', casNumber:'1314-95-0', molecularWeight:150.78, latticeConstant:{ a:11.18, b:3.98, c:4.33, unit:'Å' }, density:5.08, thermalConductivity:2.4, stability:'空气中稳定', notes:'低成本，无毒，环境友好' },
  { name:'硫化银', formula:'Ag₂S', aliases:['硫化银','ag2s','silver sulfide'], bandGap:{ value:1.0, type:'direct', temperature:'300 K' }, valenceBand:0.6, conductionBand:-0.4, crystalStructure:'单斜结构', electronMobility:'≈ 400 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 300 cm²·V⁻¹·s⁻¹', mobility:{ electron:400, hole:300 }, excitonBindingEnergy:50, dielectricConstant:7, carrier:{ type:'p型', concentration:'1e16 cm-3' }, applications:'红外探测器、电池', casNumber:'12751-47-2', molecularWeight:247.80, latticeConstant:{ a:4.23, b:6.93, c:7.87, unit:'Å' }, density:7.23, thermalConductivity:1.5, stability:'空气中稳定', notes:'窄带隙，近红外响应' },
  { name:'硫化汞', formula:'HgS', aliases:['硫化汞','hgs','mercury sulfide','朱砂'], bandGap:{ value:2.1, type:'direct', temperature:'300 K' }, valenceBand:1.8, conductionBand:-0.3, crystalStructure:'六方/立方结构', electronMobility:'≈ 10 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 5 cm²·V⁻¹·s⁻¹', mobility:{ electron:10, hole:5 }, excitonBindingEnergy:40, dielectricConstant:10, carrier:{ type:'p型', concentration:'1e15 cm-3' }, applications:'颜料、光电器件', casNumber:'1344-48-5', molecularWeight:232.66, latticeConstant:{ a:4.15, c:9.50, unit:'Å', note:'六方' }, density:8.10, thermalConductivity:1.0, warnings:['⚠️ 含汞，具有毒性，处理时需注意安全'], stability:'空气中稳定', notes:'天然红色颜料（辰砂），光电性能受相变影响' },
  { name:'硫化铜', formula:'CuS', aliases:['硫化铜','cus','copper sulfide'], bandGap:{ value:2.0, type:'direct', temperature:'300 K' }, valenceBand:1.2, conductionBand:-0.8, crystalStructure:'六方结构', electronMobility:'≈ 100 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 25 cm²·V⁻¹·s⁻¹', mobility:{ electron:100, hole:25 }, excitonBindingEnergy:35, dielectricConstant:12, carrier:{ type:'p型', concentration:'1e19 cm-3（金属性）' }, applications:'太阳能电池、光催化', casNumber:'1317-40-4', molecularWeight:95.61, latticeConstant:{ a:3.79, c:16.34, unit:'Å' }, density:4.76, thermalConductivity:3.5, stability:'空气中稳定', notes:'p型导电，接近金属性质' },
  { name:'二硫化铁', formula:'FeS₂', aliases:['二硫化铁','fes2','iron sulfide','黄铁矿'], bandGap:{ value:0.95, type:'indirect', temperature:'300 K' }, valenceBand:0.4, conductionBand:-0.55, crystalStructure:'立方黄铁矿结构', electronMobility:'≈ 360 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 100 cm²·V⁻¹·s⁻¹', mobility:{ electron:360, hole:100 }, excitonBindingEnergy:30, dielectricConstant:15, carrier:{ type:'n型', concentration:'1e18 cm-3' }, applications:'太阳能电池、光催化', casNumber:'1317-97-1', molecularWeight:119.98, latticeConstant:{ a:5.42, unit:'Å' }, density:5.02, thermalConductivity:19, stability:'空气中稳定，避免氧化', notes:'愚人金，地壳丰度高，低成本' },
  { name:'五氧化二钽', formula:'Ta₂O₅', aliases:['五氧化二钽','ta2o5','tantalum pentoxide'], bandGap:{ value:4.0, type:'indirect', temperature:'300 K' }, valenceBand:3.1, conductionBand:-0.9, crystalStructure:'斜方结构', electronMobility:'≈ 1 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 0.1 cm²·V⁻¹·s⁻¹', mobility:{ electron:1, hole:0.1 }, excitonBindingEnergy:10, dielectricConstant:25, carrier:{ type:'n型（掺杂）', concentration:'低' }, applications:'光催化、介电材料', casNumber:'1314-61-0', molecularWeight:441.89, latticeConstant:{ a:6.20, b:40.29, c:3.89, unit:'Å' }, density:8.20, thermalConductivity:3.8, stability:'化学稳定性极高', notes:'宽带隙，高折射率，光学薄膜' },
  { name:'硒化镉', formula:'CdSe', aliases:['硒化镉','cdse','cadmium selenide'], bandGap:{ value:1.7, type:'direct', temperature:'300 K' }, valenceBand:1.2, conductionBand:-0.5, crystalStructure:'闪锌矿/纤锌矿结构', electronMobility:'≈ 650 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 60 cm²·V⁻¹·s⁻¹', mobility:{ electron:650, hole:60 }, excitonBindingEnergy:15, dielectricConstant:10.2, carrier:{ type:'n型', concentration:'1e15 cm-3' }, applications:'量子点、太阳能电池、LED', casNumber:'1306-24-7', molecularWeight:191.37, latticeConstant:{ a:6.05, unit:'Å' }, density:5.81, thermalConductivity:9, stability:'空气中稳定', notes:'量子点经典材料，发光效率高' },
  { name:'碲化镉', formula:'CdTe', aliases:['碲化镉','cdte','cadmium telluride'], bandGap:{ value:1.5, type:'direct', temperature:'300 K' }, valenceBand:1.0, conductionBand:-0.5, crystalStructure:'闪锌矿结构', electronMobility:'≈ 1050 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 100 cm²·V⁻¹·s⁻¹', mobility:{ electron:1050, hole:100 }, excitonBindingEnergy:10, dielectricConstant:10.9, carrier:{ type:'p型', concentration:'1e14 cm-3（本征）' }, applications:'太阳能电池、X射线探测器', casNumber:'1306-25-8', molecularWeight:240.01, latticeConstant:{ a:6.48, unit:'Å' }, density:5.85, thermalConductivity:7, stability:'空气中稳定', notes:'薄膜太阳能电池主流材料，效率>20%' },
  { name:'硫化铜铟', formula:'CuInS₂', aliases:['硫化铜铟','cis','cuin2','copper indium sulfide'], bandGap:{ value:1.5, type:'direct', temperature:'300 K' }, valenceBand:1.0, conductionBand:-0.5, crystalStructure:'黄铜矿结构', electronMobility:'≈ 16 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 2 cm²·V⁻¹·s⁻¹', mobility:{ electron:16, hole:2 }, excitonBindingEnergy:40, dielectricConstant:13.6, carrier:{ type:'p型', concentration:'1e16 cm-3' }, applications:'薄膜太阳能电池', casNumber:'12018-95-0', molecularWeight:242.5, latticeConstant:{ a:5.52, c:11.12, unit:'Å' }, density:4.75, thermalConductivity:3.2, stability:'空气中稳定', notes:'CIGS太阳能电池材料，无镉环保' },
  { name:'氧化亚铜', formula:'Cu₂O', aliases:['氧化亚铜','cu2o','cuprous oxide'], bandGap:{ value:2.0, type:'direct', temperature:'300 K' }, valenceBand:1.8, conductionBand:-0.2, crystalStructure:'立方结构', electronMobility:'≈ 100 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 80 cm²·V⁻¹·s⁻¹', mobility:{ electron:100, hole:80 }, excitonBindingEnergy:150, dielectricConstant:7.6, carrier:{ type:'p型', concentration:'1e16 cm-3' }, applications:'太阳能电池、光催化', casNumber:'1317-39-1', molecularWeight:143.09, latticeConstant:{ a:4.27, unit:'Å' }, density:6.00, thermalConductivity:12, stability:'空气中易氧化为CuO', notes:'p型氧化物，大激子结合能' },
  { name:'二硫化锡', formula:'SnS₂', aliases:['二硫化锡','sns2','tin disulfide'], bandGap:{ value:2.2, type:'indirect', temperature:'300 K' }, valenceBand:1.8, conductionBand:-0.4, crystalStructure:'层状六方结构', electronMobility:'≈ 230 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 90 cm²·V⁻¹·s⁻¹', mobility:{ electron:230, hole:90 }, excitonBindingEnergy:100, dielectricConstant:15, carrier:{ type:'n型', concentration:'1e17 cm-3' }, applications:'晶体管、光电器件', casNumber:'1315-01-1', molecularWeight:182.84, latticeConstant:{ a:3.65, c:5.90, unit:'Å' }, density:4.50, thermalConductivity:2.8, stability:'空气中稳定', notes:'2D层状结构，类MoS2' },
  { name:'氧化镓', formula:'Ga₂O₃', aliases:['氧化镓','ga2o3','gallium oxide'], bandGap:{ value:4.8, type:'indirect', temperature:'300 K' }, valenceBand:3.8, conductionBand:-1.0, crystalStructure:'单斜结构', electronMobility:'≈ 300 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 10 cm²·V⁻¹·s⁻¹', mobility:{ electron:300, hole:10 }, excitonBindingEnergy:20, dielectricConstant:10, carrier:{ type:'n型', concentration:'可调' }, applications:'高功率器件、深紫外探测', casNumber:'12024-21-4', molecularWeight:187.44, latticeConstant:{ a:12.23, b:3.04, c:5.80, unit:'Å' }, density:5.95, thermalConductivity:27, stability:'高温稳定', notes:'超宽带隙，第四代半导体候选材料' },
  { name:'钼酸铋', formula:'Bi₂MoO₆', aliases:['钼酸铋','bi2moo6','bismuth molybdate'], bandGap:{ value:2.7, type:'indirect', temperature:'300 K' }, valenceBand:2.8, conductionBand:0.1, crystalStructure:'奥尔托斜方结构', electronMobility:'≈ 10 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 5 cm²·V⁻¹·s⁻¹', mobility:{ electron:10, hole:5 }, excitonBindingEnergy:15, dielectricConstant:50, carrier:{ type:'n型', concentration:'1e17 cm-3' }, applications:'光催化、颜料', casNumber:'13565-96-3', molecularWeight:609.77, latticeConstant:{ a:5.50, b:16.26, c:5.49, unit:'Å' }, density:6.77, thermalConductivity:1.2, stability:'化学稳定', notes:'可见光响应光催化剂' },
  { name:'钨酸铋', formula:'Bi₂WO₆', aliases:['钨酸铋','bi2wo6','bismuth tungstate'], bandGap:{ value:2.8, type:'indirect', temperature:'300 K' }, valenceBand:3.1, conductionBand:0.3, crystalStructure:'层状结构', electronMobility:'≈ 12 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 3 cm²·V⁻¹·s⁻¹', mobility:{ electron:12, hole:3 }, excitonBindingEnergy:18, dielectricConstant:60, carrier:{ type:'n型', concentration:'1e17 cm-3' }, applications:'光催化', casNumber:'13595-25-0', molecularWeight:713.69, latticeConstant:{ a:5.44, b:16.43, c:5.46, unit:'Å' }, density:8.28, thermalConductivity:1.0, stability:'化学稳定', notes:'层状结构，可见光催化活性高' },

  // 传统IV族和III-V族半导体（旧格式数据，已在前面有新版本）
  
  // 新兴二维材料
  { name:'石墨烯', formula:'C', aliases:['石墨烯','graphene'], bandGap:{ value:0.0, type:'semimetal', temperature:'300 K' }, valenceBand:0.0, conductionBand:0.0, crystalStructure:'单层六方结构', electronMobility:'≈ 15000 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 15000 cm²·V⁻¹·s⁻¹', mobility:{ electron:15000, hole:15000 }, excitonBindingEnergy:null, dielectricConstant:2.5, carrier:{ type:'半金属（双极性）', concentration:'可调' }, applications:'高速电子器件、透明电极', casNumber:'7782-42-5', molecularWeight:12.011, latticeConstant:{ a:2.46, unit:'Å' }, density:2.267, thermalConductivity:5300, warnings:['⚠️ 零带隙半金属，价带和导带在狄拉克点相遇'], stability:'化学稳定', notes:'零带隙，超高迁移率，狄拉克费米子' },

  // 新增材料（54种）- 扩展到106种总数
  // 更多III-V族化合物
  { name:'砷化铝', formula:'AlAs', aliases:['砷化铝','alas','aluminum arsenide'], bandGap:{ value:2.16, type:'indirect', temperature:'300 K' }, valenceBand:1.5, conductionBand:-0.66, crystalStructure:'闪锌矿结构', electronMobility:'≈ 280 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 200 cm²·V⁻¹·s⁻¹', mobility:{ electron:280, hole:200 }, excitonBindingEnergy:15, dielectricConstant:10.1, carrier:{ type:'n型或p型', concentration:'可调' }, applications:'异质结构、量子阱', casNumber:'22831-42-1', molecularWeight:101.903, latticeConstant:{ a:5.66, unit:'Å' }, density:3.76, thermalConductivity:91, stability:'空气中稳定', notes:'AlGaAs异质结材料组分' },
  { name:'磷化铝', formula:'AlP', aliases:['磷化铝','alp','aluminum phosphide'], bandGap:{ value:2.45, type:'indirect', temperature:'300 K' }, valenceBand:1.6, conductionBand:-0.85, crystalStructure:'闪锌矿结构', electronMobility:'≈ 80 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 40 cm²·V⁻¹·s⁻¹', mobility:{ electron:80, hole:40 }, excitonBindingEnergy:20, dielectricConstant:9.8, carrier:{ type:'n型', concentration:'可调' }, applications:'农药、LED', casNumber:'20859-73-8', molecularWeight:57.955, latticeConstant:{ a:5.46, unit:'Å' }, density:2.42, thermalConductivity:90, stability:'空气中稳定', notes:'间接带隙，也用于磷化氢农药' },
  { name:'锑化镓', formula:'GaSb', aliases:['锑化镓','gasb','gallium antimonide'], bandGap:{ value:0.73, type:'direct', temperature:'300 K' }, valenceBand:0.5, conductionBand:-0.23, crystalStructure:'闪锌矿结构', electronMobility:'≈ 5000 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 850 cm²·V⁻¹·s⁻¹', mobility:{ electron:5000, hole:850 }, excitonBindingEnergy:2.5, dielectricConstant:15.7, carrier:{ type:'p型（本征）', concentration:'1e17 cm-3' }, applications:'红外探测器、热电器件', casNumber:'12064-03-8', molecularWeight:191.483, latticeConstant:{ a:6.10, unit:'Å' }, density:5.61, thermalConductivity:33, stability:'空气中稳定', notes:'窄带隙，红外探测1-5μm' },
  { name:'锑化铟', formula:'InSb', aliases:['锑化铟','insb','indium antimonide'], bandGap:{ value:0.17, type:'direct', temperature:'300 K' }, valenceBand:0.1, conductionBand:-0.07, crystalStructure:'闪锌矿结构', electronMobility:'≈ 77000 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 850 cm²·V⁻¹·s⁻¹', mobility:{ electron:77000, hole:850 }, excitonBindingEnergy:0.5, dielectricConstant:17.7, carrier:{ type:'n型', concentration:'2e16 cm-3（本征）' }, applications:'红外探测器、磁传感器', casNumber:'1312-41-0', molecularWeight:236.578, latticeConstant:{ a:6.48, unit:'Å' }, density:5.78, thermalConductivity:18, stability:'空气中稳定', notes:'最高电子迁移率的半导体，窄带隙' },
  { name:'氮化铟', formula:'InN', aliases:['氮化铟','inn','indium nitride'], bandGap:{ value:0.7, type:'direct', temperature:'300 K' }, valenceBand:0.4, conductionBand:-0.3, crystalStructure:'纤锌矿结构', electronMobility:'≈ 3200 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 30 cm²·V⁻¹·s⁻¹', mobility:{ electron:3200, hole:30 }, excitonBindingEnergy:8, dielectricConstant:15.3, carrier:{ type:'n型', concentration:'1e18 cm-3（表面电子积累）' }, applications:'太阳能电池、红外LED', casNumber:'25617-98-5', molecularWeight:128.825, latticeConstant:{ a:3.54, c:5.70, unit:'Å' }, density:6.81, thermalConductivity:45, stability:'空气中稳定', notes:'窄带隙氮化物，近红外发光' },
  
  // 更多II-VI族化合物
  { name:'硒化锌', formula:'ZnSe', aliases:['硒化锌','znse','zinc selenide'], bandGap:{ value:2.7, type:'direct', temperature:'300 K' }, valenceBand:1.7, conductionBand:-1.0, crystalStructure:'闪锌矿结构', electronMobility:'≈ 530 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 28 cm²·V⁻¹·s⁻¹', mobility:{ electron:530, hole:28 }, excitonBindingEnergy:20, dielectricConstant:9.1, carrier:{ type:'n型', concentration:'1e15 cm-3' }, applications:'蓝绿光LED、激光器', casNumber:'1315-09-9', molecularWeight:144.35, latticeConstant:{ a:5.67, unit:'Å' }, density:5.27, thermalConductivity:18, stability:'空气中稳定', notes:'蓝绿光LED，量子点材料' },
  { name:'碲化锌', formula:'ZnTe', aliases:['碲化锌','znte','zinc telluride'], bandGap:{ value:2.26, type:'direct', temperature:'300 K' }, valenceBand:1.5, conductionBand:-0.76, crystalStructure:'闪锌矿结构', electronMobility:'≈ 340 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 100 cm²·V⁻¹·s⁻¹', mobility:{ electron:340, hole:100 }, excitonBindingEnergy:13, dielectricConstant:10.4, carrier:{ type:'p型', concentration:'1e15 cm-3' }, applications:'太阳能电池、探测器', casNumber:'1315-11-3', molecularWeight:192.99, latticeConstant:{ a:6.10, unit:'Å' }, density:6.34, thermalConductivity:18, stability:'空气中稳定', notes:'p型II-VI族半导体' },
  { name:'硒化汞', formula:'HgSe', aliases:['硒化汞','hgse','mercury selenide'], bandGap:{ value:0.30, type:'direct', temperature:'300 K' }, valenceBand:0.2, conductionBand:-0.1, crystalStructure:'闪锌矿结构', electronMobility:'≈ 20000 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 300 cm²·V⁻¹·s⁻¹', mobility:{ electron:20000, hole:300 }, excitonBindingEnergy:1, dielectricConstant:25, carrier:{ type:'n型', concentration:'1e17 cm-3' }, applications:'红外探测器', casNumber:'20601-83-6', molecularWeight:279.55, latticeConstant:{ a:6.08, unit:'Å' }, density:8.25, thermalConductivity:3, warnings:['⚠️ 含汞，具有毒性，处理时需注意安全'], stability:'空气中稳定', notes:'窄带隙，高迁移率' },
  { name:'碲化汞', formula:'HgTe', aliases:['碲化汞','hgte','mercury telluride'], bandGap:{ value:0.00, type:'semimetal', temperature:'300 K' }, valenceBand:0.00, conductionBand:0.00, crystalStructure:'闪锌矿结构', electronMobility:'≈ 25000 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 400 cm²·V⁻¹·s⁻¹', mobility:{ electron:25000, hole:400 }, excitonBindingEnergy:null, dielectricConstant:20, carrier:{ type:'半金属', concentration:'高' }, applications:'红外探测器、拓扑绝缘体', casNumber:'12068-90-5', molecularWeight:328.19, latticeConstant:{ a:6.46, unit:'Å' }, density:8.12, thermalConductivity:2.7, warnings:['⚠️ 含汞，具有毒性，处理时需注意安全','⚠️ 零带隙半金属，能带在Γ点反转'], stability:'空气中稳定', notes:'拓扑绝缘体，HgCdTe红外探测器组分' },
  { name:'硒化铅', formula:'PbSe', aliases:['硒化铅','pbse','lead selenide'], bandGap:{ value:0.27, type:'direct', temperature:'300 K' }, valenceBand:0.7, conductionBand:0.43, crystalStructure:'岩盐结构', electronMobility:'≈ 1000 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 1500 cm²·V⁻¹·s⁻¹', mobility:{ electron:1000, hole:1500 }, excitonBindingEnergy:20, dielectricConstant:210, carrier:{ type:'双极性', concentration:'1e17 cm-3' }, applications:'红外探测器、热电材料', casNumber:'12069-00-0', molecularWeight:286.16, latticeConstant:{ a:6.12, unit:'Å' }, density:8.27, thermalConductivity:2.5, warnings:['⚠️ 含铅，具有毒性，处理时需注意安全'], stability:'空气中稳定', notes:'中红外探测，热电材料，量子点' },
  { name:'碲化铅', formula:'PbTe', aliases:['碲化铅','pbte','lead telluride'], bandGap:{ value:0.31, type:'direct', temperature:'300 K' }, valenceBand:0.8, conductionBand:0.49, crystalStructure:'岩盐结构', electronMobility:'≈ 1600 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 750 cm²·V⁻¹·s⁻¹', mobility:{ electron:1600, hole:750 }, excitonBindingEnergy:22, dielectricConstant:400, carrier:{ type:'双极性', concentration:'1e18 cm-3' }, applications:'热电材料、红外探测', casNumber:'1314-91-6', molecularWeight:334.80, latticeConstant:{ a:6.46, unit:'Å' }, density:8.16, thermalConductivity:2.2, warnings:['⚠️ 含铅，具有毒性，处理时需注意安全'], stability:'空气中稳定', notes:'最佳中温热电材料之一，ZT>1.5' },
  
  // 更多层状材料（TMDs）
  { name:'二硫化铪', formula:'HfS₂', aliases:['二硫化铪','hfs2','hafnium disulfide'], bandGap:{ value:2.0, type:'indirect', temperature:'300 K' }, valenceBand:1.5, conductionBand:-0.5, crystalStructure:'层状六方结构', electronMobility:'≈ 150 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 100 cm²·V⁻¹·s⁻¹', mobility:{ electron:150, hole:100 }, excitonBindingEnergy:180, dielectricConstant:11, carrier:{ type:'n型', concentration:'可调' }, applications:'电子器件、光电器件', casNumber:'18855-94-2', molecularWeight:242.63, latticeConstant:{ a:3.63, c:5.84, unit:'Å' }, density:6.03, thermalConductivity:12, stability:'空气中稳定', notes:'2D材料，单层直接带隙2.9eV' },
  { name:'二硒化钼', formula:'MoSe₂', aliases:['二硒化钼','mose2','molybdenum diselenide'], bandGap:{ value:1.5, type:'indirect', temperature:'300 K' }, valenceBand:1.4, conductionBand:-0.1, crystalStructure:'层状六方结构', electronMobility:'≈ 100 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 90 cm²·V⁻¹·s⁻¹', mobility:{ electron:100, hole:90 }, excitonBindingEnergy:250, dielectricConstant:16, carrier:{ type:'n型', concentration:'可调' }, applications:'晶体管、光电器件', casNumber:'12058-18-3', molecularWeight:253.88, latticeConstant:{ a:3.29, c:12.90, unit:'Å' }, density:6.90, thermalConductivity:2.4, stability:'空气中稳定', notes:'2D材料，单层1.5eV，多层1.1eV' },
  { name:'二碲化钼', formula:'MoTe₂', aliases:['二碲化钼','mote2','molybdenum ditelluride'], bandGap:{ value:1.0, type:'indirect', temperature:'300 K' }, valenceBand:1.0, conductionBand:-0.1, crystalStructure:'层状六方结构', electronMobility:'≈ 200 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 150 cm²·V⁻¹·s⁻¹', mobility:{ electron:200, hole:150 }, excitonBindingEnergy:200, dielectricConstant:18, carrier:{ type:'双极性', concentration:'可调' }, applications:'相变材料、电子器件', casNumber:'12058-20-7', molecularWeight:351.14, latticeConstant:{ a:3.52, c:13.97, unit:'Å' }, density:7.70, thermalConductivity:2.1, stability:'空气中稳定', notes:'2H和1T\'相变，拓扑半金属相' },
  { name:'二硒化钨', formula:'WSe₂', aliases:['二硒化钨','wse2','tungsten diselenide'], bandGap:{ value:1.65, type:'indirect', temperature:'300 K' }, valenceBand:1.5, conductionBand:-0.15, crystalStructure:'层状六方结构', electronMobility:'≈ 150 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 250 cm²·V⁻¹·s⁻¹', mobility:{ electron:150, hole:250 }, excitonBindingEnergy:280, dielectricConstant:14, carrier:{ type:'p型', concentration:'可调' }, applications:'晶体管、谷电子学', casNumber:'12067-46-8', molecularWeight:341.76, latticeConstant:{ a:3.28, c:12.96, unit:'Å' }, density:9.32, thermalConductivity:2.5, stability:'空气中稳定', notes:'罕见p型2D半导体，高空穴迁移率' },
  { name:'二碲化钨', formula:'WTe₂', aliases:['二碲化钨','wte2','tungsten ditelluride'], bandGap:{ value:0.7, type:'indirect', temperature:'300 K' }, valenceBand:0.7, conductionBand:-0.1, crystalStructure:'层状正交结构', electronMobility:'≈ 300 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 200 cm²·V⁻¹·s⁻¹', mobility:{ electron:300, hole:200 }, excitonBindingEnergy:150, dielectricConstant:16, carrier:{ type:'双极性', concentration:'可调' }, applications:'自旋电子学、相变材料', casNumber:'12067-76-4', molecularWeight:439.04, latticeConstant:{ a:3.47, c:14.07, unit:'Å' }, density:9.43, thermalConductivity:1.8, stability:'空气中稳定', notes:'Weyl半金属候选材料，量子霍尔效应' },
  
  // 钙钛矿材料（旧版本，已被semiconductors-extended.js中的新版本替代）
  { name:'碘化铅甲胺', formula:'CH₃NH₃PbI₃', aliases:['mapi','甲胺碘化铅','methylammonium lead iodide'], bandGap:{ value:1.55, type:'direct', temperature:'300 K' }, valenceBand:1.05, conductionBand:-0.50, crystalStructure:'立方钙钛矿结构', electronMobility:'≈ 160 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 105 cm²·V⁻¹·s⁻¹', mobility:{ electron:20, hole:15 }, excitonBindingEnergy:15, dielectricConstant:70, carrier:{ type:'双极性', concentration:'1e16 cm-3' }, applications:'太阳能电池、LED', casNumber:'69507-00-4', molecularWeight:620.98, latticeConstant:{ a:6.31, unit:'Å' }, density:4.29, thermalConductivity:0.5, warnings:['⚠️ 有机钙钛矿材料，对湿度敏感，易降解','⚠️ 含铅，具有毒性'], stability:'湿度敏感，需封装', notes:'第一代钙钛矿太阳能电池，PCE>25%' },
  { name:'溴化铅甲胺', formula:'CH₃NH₃PbBr₃', aliases:['mapb','甲胺溴化铅','methylammonium lead bromide'], bandGap:{ value:2.3, type:'direct', temperature:'300 K' }, valenceBand:1.43, conductionBand:-0.80, crystalStructure:'立方钙钛矿结构', electronMobility:'≈ 115 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 60 cm²·V⁻¹·s⁻¹', mobility:{ electron:25, hole:20 }, excitonBindingEnergy:40, dielectricConstant:58, carrier:{ type:'双极性', concentration:'1e15 cm-3' }, applications:'LED、光电探测', casNumber:'69507-02-6', molecularWeight:383.86, latticeConstant:{ a:5.93, unit:'Å' }, density:3.58, thermalConductivity:0.4, warnings:['⚠️ 有机钙钛矿材料，对湿度敏感，易降解','⚠️ 含铅，具有毒性'], stability:'相对稳定，仍需保护', notes:'绿光LED，窄发射峰FWHM<20nm' },
  { name:'氯化铅甲胺', formula:'CH₃NH₃PbCl₃', aliases:['mapc','甲胺氯化铅','methylammonium lead chloride'], bandGap:{ value:3.1, type:'direct', temperature:'300 K' }, valenceBand:1.68, conductionBand:-1.20, crystalStructure:'立方钙钛矿结构', electronMobility:'≈ 75 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 40 cm²·V⁻¹·s⁻¹', mobility:{ electron:18, hole:12 }, excitonBindingEnergy:55, dielectricConstant:45, carrier:{ type:'双极性', concentration:'1e14 cm-3' }, applications:'光电器件', casNumber:'69507-01-5', molecularWeight:276.60, latticeConstant:{ a:5.68, unit:'Å' }, density:3.06, thermalConductivity:0.5, warnings:['⚠️ 有机钙钛矿材料，对湿度敏感，易降解','⚠️ 含铅，具有毒性'], stability:'稳定性较差', notes:'蓝光发射材料' },
  { name:'碘化铅铯', formula:'CsPbI₃', aliases:['铯铅碘','cesium lead iodide'], bandGap:{ value:1.73, type:'direct', temperature:'300 K' }, valenceBand:1.13, conductionBand:-0.60, crystalStructure:'立方钙钛矿结构', electronMobility:'≈ 210 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 125 cm²·V⁻¹·s⁻¹', mobility:{ electron:22, hole:17 }, excitonBindingEnergy:20, dielectricConstant:65, carrier:{ type:'双极性', concentration:'1e16 cm-3' }, applications:'太阳能电池、量子点', casNumber:'18480-07-4', molecularWeight:721.63, latticeConstant:{ a:6.29, unit:'Å' }, density:4.95, thermalConductivity:0.45, warnings:['⚠️ 无机钙钛矿，黑相在室温不稳定','⚠️ 含铅，具有毒性'], stability:'相稳定性问题，α相需稳定化', notes:'全无机，热稳定性优于MA系' },
  
  // 有机半导体
  { name:'并五苯', formula:'C₂₂H₁₄', aliases:['pentacene','并五苯'], bandGap:{ value:1.85, type:'direct', temperature:'300 K' }, valenceBand:1.6, conductionBand:-0.25, crystalStructure:'单斜结构', electronMobility:'≈ 5 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 40 cm²·V⁻¹·s⁻¹', mobility:{ electron:5, hole:40 }, excitonBindingEnergy:300, dielectricConstant:3.5, carrier:{ type:'p型（空穴传输）', concentration:'可调' }, applications:'有机晶体管、光电器件', casNumber:'135-48-8', molecularWeight:278.35, latticeConstant:{ a:7.90, b:6.06, c:16.01, unit:'Å' }, density:1.30, thermalConductivity:0.6, stability:'对氧气敏感，需封装', notes:'高空穴迁移率有机半导体' },
  { name:'酞菁铜', formula:'C₃₂H₁₆CuN₈', aliases:['copper phthalocyanine','cupc'], bandGap:{ value:1.8, type:'direct', temperature:'300 K' }, valenceBand:1.2, conductionBand:-0.6, crystalStructure:'单斜结构', electronMobility:'≈ 0.02 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 0.03 cm²·V⁻¹·s⁻¹', mobility:{ electron:0.02, hole:0.03 }, excitonBindingEnergy:500, dielectricConstant:4, carrier:{ type:'p型', concentration:'低' }, applications:'有机太阳能电池、传感器', casNumber:'147-14-8', molecularWeight:576.07, latticeConstant:{ a:19.6, b:4.79, c:14.6, unit:'Å', note:'α相单斜' }, density:1.62, thermalConductivity:0.4, stability:'空气中稳定', notes:'蓝色染料，有机太阳能电池给体材料' },
  
  // 更多氧化物半导体
  { name:'氧化钴', formula:'CoO', aliases:['氧化钴','coo','cobalt monoxide'], bandGap:{ value:2.6, type:'direct', temperature:'300 K' }, valenceBand:1.4, conductionBand:-1.2, crystalStructure:'岩盐结构', electronMobility:'≈ 0.3 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 10 cm²·V⁻¹·s⁻¹', mobility:{ electron:0.3, hole:10 }, excitonBindingEnergy:400, dielectricConstant:12.9, carrier:{ type:'p型', concentration:'1e18 cm-3' }, applications:'电池电极、催化剂', casNumber:'1307-96-6', molecularWeight:74.933, latticeConstant:{ a:4.26, unit:'Å' }, density:6.44, thermalConductivity:4.5, stability:'空气中稳定', notes:'反铁磁半导体，p型空穴传输材料' },
  { name:'五氧化二铌', formula:'Nb₂O₅', aliases:['五氧化二铌','nb2o5','niobium pentoxide'], bandGap:{ value:3.4, type:'indirect', temperature:'300 K' }, valenceBand:3.0, conductionBand:-0.4, crystalStructure:'单斜结构', electronMobility:'≈ 5 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 1 cm²·V⁻¹·s⁻¹', mobility:{ electron:5, hole:1 }, excitonBindingEnergy:12, dielectricConstant:42, carrier:{ type:'n型', concentration:'低' }, applications:'光催化、电致变色', casNumber:'1313-96-8', molecularWeight:265.81, latticeConstant:{ a:6.17, unit:'Å' }, density:4.47, thermalConductivity:3.0, stability:'化学稳定', notes:'高介电常数，光催化活性' },
  { name:'氧化钒', formula:'V₂O₅', aliases:['五氧化二钒','v2o5','vanadium pentoxide'], bandGap:{ value:2.3, type:'indirect', temperature:'300 K' }, valenceBand:2.5, conductionBand:0.2, crystalStructure:'斜方层状结构', electronMobility:'≈ 0.05 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 0.01 cm²·V⁻¹·s⁻¹', mobility:{ electron:0.05, hole:0.01 }, excitonBindingEnergy:8, dielectricConstant:20, carrier:{ type:'n型', concentration:'1e18 cm-3' }, applications:'电池电极、智能窗', casNumber:'1314-62-1', molecularWeight:181.88, latticeConstant:{ a:11.51, b:3.56, c:4.37, unit:'Å' }, density:3.36, thermalConductivity:3.5, stability:'空气中稳定', notes:'层状结构，多价态，电致变色' },
  { name:'氧化锰', formula:'MnO₂', aliases:['二氧化锰','mno2','manganese dioxide'], bandGap:{ value:2.2, type:'direct', temperature:'300 K' }, valenceBand:2.0, conductionBand:-0.2, crystalStructure:'金红石结构', electronMobility:'≈ 1 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 2 cm²·V⁻¹·s⁻¹', mobility:{ electron:1, hole:2 }, excitonBindingEnergy:50, dielectricConstant:10, carrier:{ type:'p型', concentration:'1e17 cm-3' }, applications:'电池、催化剂', casNumber:'1313-13-9', molecularWeight:86.937, latticeConstant:{ a:4.40, c:2.87, unit:'Å' }, density:5.03, thermalConductivity:1.8, stability:'空气中稳定', notes:'锰电池正极材料' },
  { name:'氧化锆', formula:'ZrO₂', aliases:['二氧化锆','zro2','zirconia'], bandGap:{ value:5.0, type:'indirect', temperature:'300 K' }, valenceBand:3.2, conductionBand:-1.8, crystalStructure:'单斜/四方/立方结构', electronMobility:'≈ 1 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 0.1 cm²·V⁻¹·s⁻¹', mobility:{ electron:1, hole:0.1 }, excitonBindingEnergy:15, dielectricConstant:25, carrier:{ type:'绝缘体', concentration:'<1e10 cm-3' }, applications:'固体电解质、陶瓷', casNumber:'1314-23-4', molecularWeight:123.22, latticeConstant:{ a:5.09, unit:'Å' }, density:5.68, thermalConductivity:2.0, stability:'化学稳定性极高', notes:'固体电解质，耐高温' },
  { name:'氧化铈', formula:'CeO₂', aliases:['二氧化铈','ceo2','ceria'], bandGap:{ value:3.2, type:'indirect', temperature:'300 K' }, valenceBand:2.8, conductionBand:-0.4, crystalStructure:'萤石结构', electronMobility:'≈ 0.1 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 0.01 cm²·V⁻¹·s⁻¹', mobility:{ electron:0.1, hole:0.01 }, excitonBindingEnergy:8, dielectricConstant:26, carrier:{ type:'n型（氧空位）', concentration:'可调' }, applications:'催化剂、固体氧化物燃料电池', casNumber:'1306-38-3', molecularWeight:172.115, latticeConstant:{ a:5.41, unit:'Å' }, density:7.22, thermalConductivity:12, stability:'空气中稳定', notes:'三效催化剂，储氧材料' },
  { name:'氧化镧', formula:'La₂O₃', aliases:['三氧化二镧','la2o3','lanthanum oxide'], bandGap:{ value:5.5, type:'indirect', temperature:'300 K' }, valenceBand:3.8, conductionBand:-1.7, crystalStructure:'六方结构', electronMobility:'≈ 0.5 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 0.1 cm²·V⁻¹·s⁻¹', mobility:{ electron:0.5, hole:0.1 }, excitonBindingEnergy:10, dielectricConstant:27, carrier:{ type:'绝缘体', concentration:'<1e10 cm-3' }, applications:'介电材料、催化剂', casNumber:'1312-81-8', molecularWeight:325.809, latticeConstant:{ a:3.94, unit:'Å' }, density:6.51, thermalConductivity:2.5, stability:'吸湿性强', notes:'高k介电材料' },
  
  // 硫族化合物
  { name:'硒化锡', formula:'SnSe', aliases:['硒化锡','snse','tin selenide'], bandGap:{ value:0.9, type:'indirect', temperature:'300 K' }, valenceBand:0.6, conductionBand:-0.3, crystalStructure:'斜方层状结构', electronMobility:'≈ 250 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 160 cm²·V⁻¹·s⁻¹', mobility:{ electron:250, hole:160 }, excitonBindingEnergy:120, dielectricConstant:16, carrier:{ type:'p型', concentration:'1e17 cm-3' }, applications:'热电材料、太阳能电池', casNumber:'1315-06-6', molecularWeight:197.67, latticeConstant:{ a:11.50, b:4.15, c:4.45, unit:'Å' }, density:6.18, thermalConductivity:0.7, stability:'空气中稳定', notes:'超低热导率，ZT>2.6，最佳热电材料' },
  { name:'碲化锡', formula:'SnTe', aliases:['碲化锡','snte','tin telluride'], bandGap:{ value:0.18, type:'direct', temperature:'300 K' }, valenceBand:0.5, conductionBand:0.32, crystalStructure:'岩盐结构', electronMobility:'≈ 2500 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 1500 cm²·V⁻¹·s⁻¹', mobility:{ electron:2500, hole:1500 }, excitonBindingEnergy:10, dielectricConstant:45, carrier:{ type:'p型', concentration:'1e20 cm-3' }, applications:'热电材料、红外探测', casNumber:'12040-02-7', molecularWeight:246.31, latticeConstant:{ a:6.32, unit:'Å' }, density:6.45, thermalConductivity:2.8, stability:'空气中稳定', notes:'窄带隙热电材料，拓扑晶体绝缘体' },
  { name:'硒化锗', formula:'GeSe', aliases:['硒化锗','gese','germanium selenide'], bandGap:{ value:1.14, type:'indirect', temperature:'300 K' }, valenceBand:0.8, conductionBand:-0.34, crystalStructure:'斜方层状结构', electronMobility:'≈ 140 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 90 cm²·V⁻¹·s⁻¹', mobility:{ electron:140, hole:90 }, excitonBindingEnergy:90, dielectricConstant:14, carrier:{ type:'p型', concentration:'1e16 cm-3' }, applications:'热电材料、光电器件', casNumber:'12065-11-1', molecularWeight:151.56, latticeConstant:{ a:10.83, b:3.83, c:4.40, unit:'Å' }, density:5.57, thermalConductivity:1.6, stability:'空气中稳定', notes:'各向异性2D材料' },
  { name:'碲化锗', formula:'GeTe', aliases:['碲化锗','gete','germanium telluride'], bandGap:{ value:0.60, type:'direct', temperature:'300 K' }, valenceBand:0.5, conductionBand:-0.1, crystalStructure:'菱方结构', electronMobility:'≈ 900 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 600 cm²·V⁻¹·s⁻¹', mobility:{ electron:900, hole:600 }, excitonBindingEnergy:20, dielectricConstant:60, carrier:{ type:'p型', concentration:'1e20 cm-3' }, applications:'相变存储器、热电材料', casNumber:'12025-39-1', molecularWeight:200.21, latticeConstant:{ a:5.98, unit:'Å' }, density:6.16, thermalConductivity:2.2, stability:'空气中稳定', notes:'PCM存储材料，铁电性' },
  { name:'硒化砷', formula:'As₂Se₃', aliases:['硒化砷','as2se3','arsenic selenide'], bandGap:{ value:1.8, type:'indirect', temperature:'300 K' }, valenceBand:1.2, conductionBand:-0.6, crystalStructure:'单斜层状结构', electronMobility:'≈ 1 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 0.5 cm²·V⁻¹·s⁻¹', mobility:{ electron:1, hole:0.5 }, excitonBindingEnergy:80, dielectricConstant:10, carrier:{ type:'绝缘体', concentration:'低' }, applications:'红外光学、相变材料', casNumber:'1303-36-2', molecularWeight:386.72, latticeConstant:{ a:12.05, unit:'Å' }, density:4.75, thermalConductivity:0.13, stability:'空气中稳定', notes:'硫系玻璃，红外透明' },
  { name:'硫化砷', formula:'As₂S₃', aliases:['硫化砷','as2s3','arsenic sulfide','雄黄'], bandGap:{ value:2.5, type:'indirect', temperature:'300 K' }, valenceBand:1.5, conductionBand:-1.0, crystalStructure:'单斜层状结构', electronMobility:'≈ 2 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 1 cm²·V⁻¹·s⁻¹', mobility:{ electron:2, hole:1 }, excitonBindingEnergy:100, dielectricConstant:8, carrier:{ type:'绝缘体', concentration:'低' }, applications:'红外光学、光存储', casNumber:'1303-33-9', molecularWeight:246.04, latticeConstant:{ a:11.49, unit:'Å' }, density:3.46, thermalConductivity:0.2, stability:'空气中稳定', notes:'硫系玻璃，天然雄黄矿物' },
  
  // 磷化物和砷化物
  { name:'磷化镉', formula:'Cd₃P₂', aliases:['磷化镉','cd3p2','cadmium phosphide'], bandGap:{ value:0.5, type:'direct', temperature:'300 K' }, valenceBand:0.3, conductionBand:-0.2, crystalStructure:'四方结构', electronMobility:'≈ 1000 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 400 cm²·V⁻¹·s⁻¹', mobility:{ electron:1000, hole:400 }, excitonBindingEnergy:12, dielectricConstant:17, carrier:{ type:'n型', concentration:'1e16 cm-3' }, applications:'红外探测器、太阳能电池', casNumber:'12014-28-7', molecularWeight:399.18, latticeConstant:{ a:9.55, c:17.00, unit:'Å' }, density:5.00, thermalConductivity:4, stability:'空气中稳定', notes:'窄带隙II-V族化合物' },
  { name:'磷化锌', formula:'Zn₃P₂', aliases:['磷化锌','zn3p2','zinc phosphide'], bandGap:{ value:1.5, type:'direct', temperature:'300 K' }, valenceBand:1.0, conductionBand:-0.5, crystalStructure:'四方结构', electronMobility:'≈ 180 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 50 cm²·V⁻¹·s⁻¹', mobility:{ electron:180, hole:50 }, excitonBindingEnergy:25, dielectricConstant:11, carrier:{ type:'p型', concentration:'1e16 cm-3' }, applications:'太阳能电池、熏蒸剂', casNumber:'1314-84-7', molecularWeight:258.12, latticeConstant:{ a:8.09, c:11.47, unit:'Å' }, density:4.55, thermalConductivity:16, stability:'空气中稳定', notes:'低成本薄膜太阳能电池材料' },
  { name:'砷化镉', formula:'Cd₃As₂', aliases:['砷化镉','cd3as2','cadmium arsenide'], bandGap:{ value:0.14, type:'direct', temperature:'300 K' }, valenceBand:0.1, conductionBand:-0.04, crystalStructure:'四方结构', electronMobility:'≈ 30000 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 500 cm²·V⁻¹·s⁻¹', mobility:{ electron:30000, hole:500 }, excitonBindingEnergy:1, dielectricConstant:20, carrier:{ type:'狄拉克半金属', concentration:'高' }, applications:'狄拉克半金属、红外探测', casNumber:'12006-15-4', molecularWeight:487.08, latticeConstant:{ a:12.67, c:25.48, unit:'Å' }, density:6.36, thermalConductivity:5, stability:'空气中稳定', notes:'3D狄拉克半金属，超高迁移率' },
  
  // 氮族化合物（已删除金属材料TiN、ZrN）
  
  // 复合氧化物和钙钛矿
  { name:'铌酸钡锶', formula:'Ba₀.₆Sr₀.₄TiO₃', aliases:['bst','barium strontium titanate'], bandGap:{ value:3.4, type:'indirect', temperature:'300 K' }, valenceBand:2.8, conductionBand:-0.6, crystalStructure:'立方钙钛矿结构', electronMobility:'≈ 1 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 0.2 cm²·V⁻¹·s⁻¹', mobility:{ electron:1, hole:0.2 }, excitonBindingEnergy:8, dielectricConstant:500, carrier:{ type:'绝缘体（可调）', concentration:'低' }, applications:'可调电容器、铁电材料', casNumber:'12009-14-2', molecularWeight:218.7, latticeConstant:{ a:3.95, unit:'Å' }, density:5.35, thermalConductivity:3.5, stability:'空气中稳定', notes:'可调介电常数材料' },
  { name:'铌酸锂', formula:'LiNbO₃', aliases:['铌酸锂','linbo3','lithium niobate'], bandGap:{ value:4.0, type:'indirect', temperature:'300 K' }, valenceBand:3.2, conductionBand:-0.8, crystalStructure:'三方结构', electronMobility:'≈ 1 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 0.1 cm²·V⁻¹·s⁻¹', mobility:{ electron:1, hole:0.1 }, excitonBindingEnergy:10, dielectricConstant:33, carrier:{ type:'绝缘体', concentration:'<1e10 cm-3' }, applications:'电光调制器、表面声波器件', casNumber:'12031-63-9', molecularWeight:147.846, latticeConstant:{ a:5.15, c:13.86, unit:'Å' }, density:4.64, thermalConductivity:5.6, stability:'化学稳定', notes:'非线性光学材料，电光效应' },
  { name:'钽酸锂', formula:'LiTaO₃', aliases:['钽酸锂','litao3','lithium tantalate'], bandGap:{ value:4.4, type:'indirect', temperature:'300 K' }, valenceBand:3.5, conductionBand:-0.9, crystalStructure:'三方结构', electronMobility:'≈ 1 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 0.1 cm²·V⁻¹·s⁻¹', mobility:{ electron:1, hole:0.1 }, excitonBindingEnergy:12, dielectricConstant:43, carrier:{ type:'绝缘体', concentration:'<1e10 cm-3' }, applications:'声表面波器件、非线性光学', casNumber:'12031-66-2', molecularWeight:235.887, latticeConstant:{ a:5.15, c:13.78, unit:'Å' }, density:7.45, thermalConductivity:4.2, stability:'化学稳定', notes:'SAW器件，声光调制' },
  { name:'钛酸铅', formula:'PbTiO₃', aliases:['钛酸铅','pbtio3','lead titanate'], bandGap:{ value:3.4, type:'indirect', temperature:'300 K' }, valenceBand:2.8, conductionBand:-0.6, crystalStructure:'四方钙钛矿结构', electronMobility:'≈ 0.5 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 0.1 cm²·V⁻¹·s⁻¹', mobility:{ electron:0.5, hole:0.1 }, excitonBindingEnergy:10, dielectricConstant:200, carrier:{ type:'绝缘体', concentration:'低' }, applications:'铁电材料、压电陶瓷', casNumber:'12060-00-3', molecularWeight:303.08, latticeConstant:{ a:3.90, c:4.15, unit:'Å' }, density:7.52, thermalConductivity:2.0, stability:'空气中稳定', notes:'高居里温度铁电材料' },
  { name:'锰酸镧', formula:'LaMnO₃', aliases:['锰酸镧','lamno3','lanthanum manganite'], bandGap:{ value:1.1, type:'indirect', temperature:'300 K' }, valenceBand:0.7, conductionBand:-0.4, crystalStructure:'斜方钙钛矿结构', electronMobility:'≈ 0.01 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 0.05 cm²·V⁻¹·s⁻¹', mobility:{ electron:0.01, hole:0.05 }, excitonBindingEnergy:50, dielectricConstant:25, carrier:{ type:'绝缘体（掺杂可调）', concentration:'低' }, applications:'催化剂、巨磁阻材料', casNumber:'12063-79-5', molecularWeight:231.844, latticeConstant:{ a:5.54, unit:'Å' }, density:6.57, thermalConductivity:2.2, stability:'空气中稳定', notes:'庞磁阻材料，掺杂产生CMR效应' },
  
  // 其他化合物（已删除金属材料WC、TiB₂）
  { name:'氮化硅', formula:'Si₃N₄', aliases:['氮化硅','si3n4','silicon nitride'], bandGap:{ value:5.0, type:'indirect', temperature:'300 K' }, valenceBand:3.2, conductionBand:-1.8, crystalStructure:'六方/三方结构', electronMobility:'≈ 20 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 5 cm²·V⁻¹·s⁻¹', mobility:{ electron:20, hole:5 }, excitonBindingEnergy:15, dielectricConstant:7.5, carrier:{ type:'绝缘体', concentration:'<1e10 cm-3' }, applications:'高温陶瓷、介电材料', casNumber:'12033-89-5', molecularWeight:140.283, latticeConstant:{ a:7.75, c:5.62, unit:'Å' }, density:3.17, thermalConductivity:30, stability:'极高温稳定', notes:'高温结构陶瓷，介电薄膜' },
  { name:'碲化铋', formula:'Bi₂Te₃', aliases:['碲化铋','bi2te3','bismuth telluride'], bandGap:{ value:0.15, type:'indirect', temperature:'300 K' }, valenceBand:0.15, conductionBand:-0.05, crystalStructure:'层状菱方结构', electronMobility:'≈ 1100 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 680 cm²·V⁻¹·s⁻¹', mobility:{ electron:1100, hole:680 }, excitonBindingEnergy:3, dielectricConstant:100, carrier:{ type:'p型', concentration:'1e19 cm-3' }, applications:'热电材料、拓扑绝缘体', casNumber:'1304-82-1', molecularWeight:800.76, latticeConstant:{ a:4.38, c:30.50, unit:'Å' }, density:7.86, thermalConductivity:1.5, stability:'空气中稳定', notes:'室温热电材料，拓扑绝缘体' },
  { name:'硒化铋', formula:'Bi₂Se₃', aliases:['硒化铋','bi2se3','bismuth selenide'], bandGap:{ value:0.30, type:'indirect', temperature:'300 K' }, valenceBand:0.25, conductionBand:-0.05, crystalStructure:'层状菱方结构', electronMobility:'≈ 600 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 400 cm²·V⁻¹·s⁻¹', mobility:{ electron:600, hole:400 }, excitonBindingEnergy:5, dielectricConstant:90, carrier:{ type:'n型', concentration:'1e19 cm-3' }, applications:'热电材料、拓扑绝缘体', casNumber:'12068-69-8', molecularWeight:654.84, latticeConstant:{ a:4.14, c:28.64, unit:'Å' }, density:6.82, thermalConductivity:1.2, stability:'空气中稳定', notes:'拓扑绝缘体，表面态导电' },
  { name:'硒化锑', formula:'Sb₂Se₃', aliases:['硒化锑','sb2se3','antimony selenide'], bandGap:{ value:1.2, type:'direct', temperature:'300 K' }, valenceBand:0.8, conductionBand:-0.4, crystalStructure:'斜方层状结构', electronMobility:'≈ 50 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 10 cm²·V⁻¹·s⁻¹', mobility:{ electron:50, hole:10 }, excitonBindingEnergy:200, dielectricConstant:20, carrier:{ type:'p型', concentration:'1e17 cm-3' }, applications:'太阳能电池、热电材料', casNumber:'1315-05-5', molecularWeight:480.4, latticeConstant:{ a:11.77, b:11.62, c:3.98, unit:'Å' }, density:5.81, thermalConductivity:2.5, stability:'空气中稳定', notes:'各向异性薄膜太阳能电池' },
  { name:'碲化锑', formula:'Sb₂Te₃', aliases:['碲化锑','sb2te3','antimony telluride'], bandGap:{ value:0.28, type:'indirect', temperature:'300 K' }, valenceBand:0.25, conductionBand:-0.03, crystalStructure:'层状菱方结构', electronMobility:'≈ 425 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 360 cm²·V⁻¹·s⁻¹', mobility:{ electron:425, hole:360 }, excitonBindingEnergy:4, dielectricConstant:110, carrier:{ type:'p型', concentration:'1e19 cm-3' }, applications:'热电材料、相变存储', casNumber:'1327-50-0', molecularWeight:626.32, latticeConstant:{ a:4.26, c:30.45, unit:'Å' }, density:6.50, thermalConductivity:1.5, stability:'空气中稳定', notes:'拓扑绝缘体，热电ZT~1' },

  // ========== 新增材料（50种）v2.2.0 ==========
  
  // 钙钛矿太阳能电池材料（仅新增11种，删除与原始数据重复的4种）
  { name:'碘化铅甲脒', formula:'HC(NH₂)₂PbI₃', aliases:['碘化铅甲脒','fapbi3','甲脒铅碘','fapi','formamidinium lead iodide'], bandGap:{ value:1.48, type:'direct', temperature:'300 K' }, valenceBand:1.5, conductionBand:0.02, crystalStructure:'立方/三方钙钛矿', electronMobility:'≈ 30 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 40 cm²·V⁻¹·s⁻¹', mobility:{ electron:30, hole:40 }, excitonBindingEnergy:12, dielectricConstant:75, carrier:{ type:'双极性', concentration:'1e16 cm-3' }, applications:'高效钙钛矿太阳能电池、光伏器件', molecularWeight:632.0, latticeConstant:{ a:6.36, unit:'Å', note:'立方相' }, density:4.08, thermalConductivity:0.4, stability:'湿度敏感，需封装', notes:'FA钙钛矿，PCE>26%，带隙更窄', warnings:['⚠️ 含铅，处理时需注意安全'] },
  { name:'溴化铅甲脒', formula:'HC(NH₂)₂PbBr₃', aliases:['溴化铅甲脒','fapbbr3','甲脒铅溴','formamidinium lead bromide'], bandGap:{ value:2.2, type:'direct', temperature:'300 K' }, valenceBand:2.2, conductionBand:-0.05, crystalStructure:'立方钙钛矿', electronMobility:'≈ 20 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 35 cm²·V⁻¹·s⁻¹', mobility:{ electron:20, hole:35 }, excitonBindingEnergy:35, dielectricConstant:60, carrier:{ type:'双极性', concentration:'1e15 cm-3' }, applications:'绿光LED、混合钙钛矿组分', molecularWeight:399.9, latticeConstant:{ a:6.00, unit:'Å' }, density:3.82, thermalConductivity:0.35, stability:'相对稳定', notes:'绿光发射，窄发射峰', warnings:['⚠️ 含铅，处理时需注意安全'] },
  { name:'碘化锡甲胺', formula:'CH₃NH₃SnI₃', aliases:['碘化锡甲胺','masni3','甲胺锡碘','masi','methylammonium tin iodide'], bandGap:{ value:1.3, type:'direct', temperature:'300 K' }, valenceBand:1.4, conductionBand:0.1, crystalStructure:'立方钙钛矿', electronMobility:'≈ 2000 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 300 cm²·V⁻¹·s⁻¹', mobility:{ electron:2000, hole:300 }, excitonBindingEnergy:18, dielectricConstant:60, carrier:{ type:'双极性', concentration:'1e16 cm-3' }, applications:'无铅钙钛矿太阳能电池、晶体管', molecularWeight:575.5, latticeConstant:{ a:6.24, unit:'Å' }, density:3.9, thermalConductivity:0.6, stability:'Sn²⁺易氧化，稳定性差', notes:'无铅替代，迁移率高但稳定性差', warnings:['⚠️ Sn²⁺易氧化，稳定性较差'] },
  { name:'溴化铯铅', formula:'CsPbBr₃', aliases:['溴化铯铅','cspbbr3','铯铅溴','cesium lead bromide'], bandGap:{ value:2.3, type:'direct', temperature:'300 K' }, valenceBand:2.4, conductionBand:0.1, crystalStructure:'正交/立方钙钛矿', electronMobility:'≈ 35 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 55 cm²·V⁻¹·s⁻¹', mobility:{ electron:35, hole:55 }, excitonBindingEnergy:30, dielectricConstant:56, carrier:{ type:'双极性', concentration:'1e15 cm-3' }, applications:'全无机钙钛矿LED、量子点、显示器', casNumber:'18656-54-3', molecularWeight:579.8, latticeConstant:{ a:5.87, unit:'Å', note:'正交相' }, density:4.83, thermalConductivity:0.4, stability:'热稳定性好', notes:'全无机，高PLQY>90%', warnings:['⚠️ 含铅，但热稳定性优于有机钙钛矿'] },
  { name:'碘化铅铯甲胺混合', formula:'Cs₀.₀₅(MA)₀.₉₅PbI₃', aliases:['铯甲胺混合铅碘','cs-ma-pbi3','mixed cation perovskite'], bandGap:{ value:1.57, type:'direct', temperature:'300 K' }, valenceBand:1.6, conductionBand:0.03, crystalStructure:'立方钙钛矿', electronMobility:'≈ 70 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 110 cm²·V⁻¹·s⁻¹', mobility:{ electron:70, hole:110 }, excitonBindingEnergy:16, dielectricConstant:68, carrier:{ type:'双极性', concentration:'1e16 cm-3' }, applications:'高稳定性钙钛矿太阳能电池(>22%)', molecularWeight:610, latticeConstant:{ a:6.30, unit:'Å' }, density:4.18, thermalConductivity:0.5, stability:'Cs掺杂提升稳定性', notes:'混合阳离子稳定化策略', warnings:['⚠️ 含铅，但Cs掺杂提高稳定性'] },
  { name:'三阳离子钙钛矿', formula:'Cs₀.₀₅(MA)₀.₁₇(FA)₀.₇₈PbI₂.₅Br₀.₅', aliases:['三阳离子钙钛矿','triple cation perovskite','tc-pvk'], bandGap:{ value:1.63, type:'direct', temperature:'300 K' }, valenceBand:1.65, conductionBand:0.02, crystalStructure:'立方钙钛矿', electronMobility:'≈ 60 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 85 cm²·V⁻¹·s⁻¹', mobility:{ electron:60, hole:85 }, excitonBindingEnergy:14, dielectricConstant:65, carrier:{ type:'双极性', concentration:'1e16 cm-3' }, applications:'高效稳定钙钛矿太阳能电池(>23%)', molecularWeight:595, latticeConstant:{ a:6.28, unit:'Å' }, density:4.1, thermalConductivity:0.45, stability:'混合组分最优稳定性', notes:'混合阳离子+卤素，PCE>25%', warnings:['⚠️ 含铅，混合组分提供最佳稳定性和效率'] },
  { name:'碘化铋银', formula:'(CH₃NH₃)₂AgBiI₆', aliases:['碘化铋银','ma2agbii6','银铋双钙钛矿'], bandGap:{ value:2.0, type:'indirect', temperature:'300 K' }, valenceBand:2.2, conductionBand:0.2, crystalStructure:'双钙钛矿结构', electronMobility:'≈ 0.05 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 0.04 cm²·V⁻¹·s⁻¹', mobility:{ electron:0.05, hole:0.04 }, excitonBindingEnergy:60, dielectricConstant:40, carrier:{ type:'双极性', concentration:'1e14 cm-3' }, applications:'无铅钙钛矿太阳能电池、X射线探测器', molecularWeight:1235, latticeConstant:{ a:8.28, unit:'Å' }, density:4.3, thermalConductivity:0.3, stability:'湿度敏感', notes:'双钙钛矿，无铅环保', warnings:[] },
  { name:'溴化铋铯', formula:'Cs₃Bi₂Br₉', aliases:['溴化铋铯','cs3bi2br9','铯铋溴'], bandGap:{ value:2.6, type:'indirect', temperature:'300 K' }, valenceBand:2.7, conductionBand:0.1, crystalStructure:'零维钙钛矿', electronMobility:'≈ 1.5 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 0.8 cm²·V⁻¹·s⁻¹', mobility:{ electron:1.5, hole:0.8 }, excitonBindingEnergy:320, dielectricConstant:38, carrier:{ type:'绝缘体', concentration:'低' }, applications:'无铅光伏材料、白光LED', casNumber:'123333-85-1', molecularWeight:1356, latticeConstant:{ a:7.89, unit:'Å' }, density:4.56, thermalConductivity:0.25, stability:'空气中稳定', notes:'0D钙钛矿，白光发射', warnings:[] },
  { name:'碘化锗铯', formula:'Cs₂GeI₆', aliases:['碘化锗铯','cs2gei6','铯锗碘'], bandGap:{ value:1.6, type:'direct', temperature:'300 K' }, valenceBand:1.7, conductionBand:0.1, crystalStructure:'零维钙钛矿', electronMobility:'≈ 23 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 18 cm²·V⁻¹·s⁻¹', mobility:{ electron:23, hole:18 }, excitonBindingEnergy:45, dielectricConstant:50, carrier:{ type:'双极性', concentration:'1e15 cm-3' }, applications:'无铅钙钛矿光伏、光电探测', molecularWeight:1027, latticeConstant:{ a:8.47, unit:'Å' }, density:4.7, thermalConductivity:0.35, stability:'空气中稳定', notes:'无铅环保，0D钙钛矿', warnings:[] },
  { name:'氯碘化铅铯', formula:'CsPb(Cl/I)₃', aliases:['混合卤素铯铅','cs-pbcli3','mixed halide cesium lead'], bandGap:{ value:1.90, type:'direct', temperature:'300 K' }, valenceBand:1.9, conductionBand:-0.05, crystalStructure:'立方钙钛矿', electronMobility:'≈ 300 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 80 cm²·V⁻¹·s⁻¹', mobility:{ electron:300, hole:80 }, excitonBindingEnergy:22, dielectricConstant:62, carrier:{ type:'双极性', concentration:'1e16 cm-3' }, applications:'可调带隙LED、串联太阳能电池', molecularWeight:685, latticeConstant:{ a:6.10, unit:'Å', note:'混合卤素可调' }, density:4.9, thermalConductivity:0.4, stability:'相分离风险', notes:'卤素混合可调带隙1.73-2.9eV', warnings:['⚠️ 含铅，卤素混合可调带隙1.73-2.9eV'] },
  { name:'碘化锡铯', formula:'CsSnI₃', aliases:['碘化锡铯','cssni3','铯锡碘','cesium tin iodide'], bandGap:{ value:1.3, type:'direct', temperature:'300 K' }, valenceBand:1.4, conductionBand:0.1, crystalStructure:'正交钙钛矿', electronMobility:'≈ 585 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 115 cm²·V⁻¹·s⁻¹', mobility:{ electron:585, hole:115 }, excitonBindingEnergy:20, dielectricConstant:58, carrier:{ type:'双极性', concentration:'1e16 cm-3' }, applications:'无铅全无机钙钛矿太阳能电池', casNumber:'1307-97-1', molecularWeight:655.3, latticeConstant:{ a:6.22, unit:'Å' }, density:4.8, thermalConductivity:0.5, stability:'Sn²⁺易氧化，稳定性差', notes:'无铅全无机，高迁移率但易氧化', warnings:['⚠️ Sn²⁺易氧化，需惰性气氛保护'] },

  // 二维层状材料（仅新增3种，其他已在原始数据中）
  { name:'黑磷', formula:'P', aliases:['黑磷','black phosphorus','bp'], bandGap:{ value:0.3, type:'direct', temperature:'300 K' }, valenceBand:0.3, conductionBand:-0.05, crystalStructure:'层状正交结构', electronMobility:'≈ 1000 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 640 cm²·V⁻¹·s⁻¹', mobility:{ electron:1000, hole:640 }, excitonBindingEnergy:80, dielectricConstant:10, carrier:{ type:'双极性', concentration:'可调' }, applications:'晶体管、红外探测器、锂电池负极', casNumber:'7723-14-0', molecularWeight:30.97, latticeConstant:{ a:3.31, b:10.47, c:4.37, unit:'Å' }, density:2.69, thermalConductivity:35, stability:'空气中易氧化', notes:'厚度可调带隙0.3-2.0eV，各向异性', warnings:['⚠️ 空气中易氧化降解，需密封保存'] },
  { name:'硫化铼', formula:'ReS₂', aliases:['硫化铼','res2','rhenium disulfide'], bandGap:{ value:1.5, type:'direct', temperature:'300 K' }, valenceBand:1.4, conductionBand:-0.1, crystalStructure:'畸变层状1T\'结构', electronMobility:'≈ 30 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 20 cm²·V⁻¹·s⁻¹', mobility:{ electron:30, hole:20 }, excitonBindingEnergy:150, dielectricConstant:12, carrier:{ type:'n型', concentration:'可调' }, applications:'各向异性器件、光电探测器、催化剂', casNumber:'12038-67-4', molecularWeight:250.3, latticeConstant:{ a:6.42, b:6.51, c:6.38, unit:'Å' }, density:7.5, thermalConductivity:46, stability:'空气中稳定', notes:'畸变1T\'相，面内各向异性', warnings:[] },
  { name:'硒化铼', formula:'ReSe₂', aliases:['硒化铼','rese2','rhenium diselenide'], bandGap:{ value:1.3, type:'direct', temperature:'300 K' }, valenceBand:1.2, conductionBand:-0.1, crystalStructure:'畸变层状1T\'结构', electronMobility:'≈ 50 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 30 cm²·V⁻¹·s⁻¹', mobility:{ electron:50, hole:30 }, excitonBindingEnergy:140, dielectricConstant:13, carrier:{ type:'n型', concentration:'可调' }, applications:'各向异性光电器件、场效应管', casNumber:'12038-66-3', molecularWeight:344.2, latticeConstant:{ a:6.60, b:6.72, c:6.61, unit:'Å' }, density:8.0, thermalConductivity:42, stability:'空气中稳定', notes:'畸变1T\'相，各向异性吸收', warnings:[] },

  // 量子点与纳米材料（10种）
  { name:'CdSe量子点', formula:'CdSe-QD', aliases:['硒化镉量子点','cdse quantum dot','cdse-qd'], bandGap:{ value:2.5, type:'direct', temperature:'300 K' }, valenceBand:2.2, conductionBand:-0.3, crystalStructure:'纤锌矿纳米晶', electronMobility:'≈ 300 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 40 cm²·V⁻¹·s⁻¹', mobility:{ electron:300, hole:40 }, excitonBindingEnergy:18, dielectricConstant:10, carrier:{ type:'n型', concentration:'可调' }, applications:'显示器、生物成像、LED、太阳能电池', molecularWeight:191.37, latticeConstant:{ note:'纳米晶，尺寸2-10nm' }, density:5.81, thermalConductivity:9, stability:'空气中稳定', notes:'经典量子点，PLQY>90%', warnings:['⚠️ 含镉，尺寸调控带隙1.7-3.0eV'] },
  { name:'PbS量子点', formula:'PbS-QD', aliases:['硫化铅量子点','pbs quantum dot','pbs-qd'], bandGap:{ value:1.3, type:'direct', temperature:'300 K' }, valenceBand:1.2, conductionBand:-0.1, crystalStructure:'岩盐纳米晶', electronMobility:'≈ 400 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 500 cm²·V⁻¹·s⁻¹', mobility:{ electron:400, hole:500 }, excitonBindingEnergy:28, dielectricConstant:170, carrier:{ type:'双极性', concentration:'可调' }, applications:'红外探测器、太阳能电池、光电导器', molecularWeight:239.27, latticeConstant:{ note:'纳米晶，尺寸3-15nm' }, density:7.60, thermalConductivity:2.5, stability:'空气中稳定', notes:'近红外量子点，多激子产生', warnings:['⚠️ 含铅，尺寸调控带隙0.4-2.0eV'] },
  { name:'InP量子点', formula:'InP-QD', aliases:['磷化铟量子点','inp quantum dot','inp-qd'], bandGap:{ value:2.4, type:'direct', temperature:'300 K' }, valenceBand:2.2, conductionBand:-0.2, crystalStructure:'闪锌矿纳米晶', electronMobility:'≈ 200 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 80 cm²·V⁻¹·s⁻¹', mobility:{ electron:200, hole:80 }, excitonBindingEnergy:8, dielectricConstant:12, carrier:{ type:'n型', concentration:'可调' }, applications:'无镉量子点显示、生物成像、LED', molecularWeight:145.79, latticeConstant:{ note:'纳米晶，尺寸2-8nm' }, density:4.81, thermalConductivity:68, stability:'空气中稳定', notes:'无镉环保，QLED显示器', warnings:['环保替代CdSe，尺寸调控1.8-2.8eV'] },
  { name:'CsPbBr₃量子点', formula:'CsPbBr₃-QD', aliases:['溴化铯铅量子点','cspbbr3 quantum dot','perovskite qd'], bandGap:{ value:2.4, type:'direct', temperature:'300 K' }, valenceBand:2.5, conductionBand:0.1, crystalStructure:'钙钛矿纳米晶', electronMobility:'≈ 40 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 60 cm²·V⁻¹·s⁻¹', mobility:{ electron:40, hole:60 }, excitonBindingEnergy:35, dielectricConstant:56, carrier:{ type:'双极性', concentration:'1e15 cm-3' }, applications:'高色纯度LED、显示器、激光器', molecularWeight:579.8, latticeConstant:{ note:'纳米晶，尺寸4-15nm' }, density:4.83, thermalConductivity:0.4, stability:'湿度敏感', notes:'钙钛矿QD，PLQY接近100%', warnings:['⚠️ 含铅，但量子产率高达90-100%'] },
  { name:'Ag₂S量子点', formula:'Ag₂S-QD', aliases:['硫化银量子点','ag2s quantum dot','ag2s-qd'], bandGap:{ value:1.1, type:'direct', temperature:'300 K' }, valenceBand:0.7, conductionBand:-0.4, crystalStructure:'单斜纳米晶', electronMobility:'≈ 250 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 200 cm²·V⁻¹·s⁻¹', mobility:{ electron:250, hole:200 }, excitonBindingEnergy:55, dielectricConstant:7, carrier:{ type:'p型', concentration:'可调' }, applications:'近红外生物成像(NIR-II窗口)、光热治疗', molecularWeight:247.80, latticeConstant:{ note:'纳米晶，尺寸2-10nm' }, density:7.23, thermalConductivity:1.5, stability:'空气中稳定', notes:'NIR-II生物窗口1000-1400nm', warnings:['环保无毒，尺寸调控0.9-1.5eV'] },
  { name:'CuInS₂量子点', formula:'CuInS₂-QD', aliases:['硫化铜铟量子点','cis quantum dot','cis-qd'], bandGap:{ value:1.5, type:'direct', temperature:'300 K' }, valenceBand:1.2, conductionBand:-0.3, crystalStructure:'黄铜矿纳米晶', electronMobility:'≈ 20 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 5 cm²·V⁻¹·s⁻¹', mobility:{ electron:20, hole:5 }, excitonBindingEnergy:42, dielectricConstant:13.6, carrier:{ type:'p型', concentration:'可调' }, applications:'无镉红光LED、太阳能电池、生物标记', molecularWeight:242.5, latticeConstant:{ note:'纳米晶，尺寸3-8nm' }, density:4.75, thermalConductivity:3.2, stability:'空气中稳定', notes:'无镉环保，红光发射', warnings:['环保材料，可见光区发光'] },
  { name:'碳量子点', formula:'C-QD', aliases:['碳量子点','carbon quantum dot','cqd','graphene quantum dot'], bandGap:{ value:2.8, type:'direct', temperature:'300 K' }, valenceBand:2.5, conductionBand:-0.3, crystalStructure:'石墨烯纳米片', electronMobility:'≈ 1000 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 800 cm²·V⁻¹·s⁻¹', mobility:{ electron:1000, hole:800 }, excitonBindingEnergy:100, dielectricConstant:2.5, carrier:{ type:'双极性', concentration:'可调' }, applications:'生物传感、细胞成像、光催化、LED', molecularWeight:144, latticeConstant:{ note:'纳米晶，尺寸1-10nm' }, density:2.0, thermalConductivity:200, stability:'空气中稳定', notes:'无毒环保，表面功能化', warnings:['无毒环保，表面可功能化'] },
  { name:'硅量子点', formula:'Si-QD', aliases:['硅量子点','silicon quantum dot','si-qd'], bandGap:{ value:2.0, type:'indirect', temperature:'300 K' }, valenceBand:1.8, conductionBand:-0.2, crystalStructure:'金刚石纳米晶', electronMobility:'≈ 100 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 50 cm²·V⁻¹·s⁻¹', mobility:{ electron:100, hole:50 }, excitonBindingEnergy:50, dielectricConstant:11.7, carrier:{ type:'n型或p型', concentration:'可调' }, applications:'生物成像、LED、太阳能电池', molecularWeight:28.09, latticeConstant:{ note:'纳米晶，尺寸1-5nm' }, density:2.33, thermalConductivity:148, stability:'空气中稳定', notes:'无毒，表面钝化稳定', warnings:['无毒，尺寸调控1.2-3.5eV，可见光发光'] },
  { name:'ZnO量子点', formula:'ZnO-QD', aliases:['氧化锌量子点','zno quantum dot','zno-qd'], bandGap:{ value:3.6, type:'direct', temperature:'300 K' }, valenceBand:3.2, conductionBand:-0.4, crystalStructure:'纤锌矿纳米晶', electronMobility:'≈ 150 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 10 cm²·V⁻¹·s⁻¹', mobility:{ electron:150, hole:10 }, excitonBindingEnergy:65, dielectricConstant:8.5, carrier:{ type:'n型', concentration:'可调' }, applications:'紫外LED、太阳能电池、传感器', molecularWeight:81.4, latticeConstant:{ note:'纳米晶，尺寸2-8nm' }, density:5.61, thermalConductivity:54, stability:'空气中稳定', notes:'紫外发光，表面缺陷发可见光', warnings:['无毒环保，紫外区发光，表面缺陷发可见光'] },
  { name:'CdTe量子点', formula:'CdTe-QD', aliases:['碲化镉量子点','cdte quantum dot','cdte-qd'], bandGap:{ value:2.1, type:'direct', temperature:'300 K' }, valenceBand:1.8, conductionBand:-0.3, crystalStructure:'闪锌矿纳米晶', electronMobility:'≈ 600 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 70 cm²·V⁻¹·s⁻¹', mobility:{ electron:600, hole:70 }, excitonBindingEnergy:12, dielectricConstant:10.9, carrier:{ type:'p型', concentration:'可调' }, applications:'生物传感、荧光探针、太阳能电池', molecularWeight:240.01, latticeConstant:{ note:'纳米晶，尺寸2-8nm' }, density:5.85, thermalConductivity:7, stability:'空气中稳定', notes:'水溶性QD，生物标记', warnings:['⚠️ 含镉，尺寸调控1.5-2.5eV，水溶性好'] },

  // 拓扑材料与新奇半导体（10种）
  { name:'碲化铋锑', formula:'Bi₁.₅Sb₀.₅Te₃', aliases:['碲化铋锑','bisbtc','bi-sb-te','bismuth antimony telluride'], bandGap:{ value:0.2, type:'indirect', temperature:'300 K' }, valenceBand:0.2, conductionBand:-0.05, crystalStructure:'层状菱方结构', electronMobility:'≈ 800 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 500 cm²·V⁻¹·s⁻¹', mobility:{ electron:800, hole:500 }, excitonBindingEnergy:3, dielectricConstant:105, carrier:{ type:'拓扑表面态', concentration:'表面导电' }, applications:'拓扑绝缘体、热电材料、自旋电子学', molecularWeight:750, latticeConstant:{ a:4.32, c:30.48, unit:'Å' }, density:7.7, thermalConductivity:1.4, stability:'空气中稳定', notes:'拓扑绝缘体，表面态导电', warnings:['表面态导电，体内绝缘'] },
  { name:'四硒化三铁', formula:'Fe₃Se₄', aliases:['四硒化三铁','fe3se4','iron selenide'], bandGap:{ value:0.0, type:'metallic', temperature:'300 K' }, valenceBand:0.0, conductionBand:0.0, crystalStructure:'单斜结构', electronMobility:'≈ 10 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 5 cm²·V⁻¹·s⁻¹', mobility:{ electron:10, hole:5 }, excitonBindingEnergy:null, dielectricConstant:15, carrier:{ type:'金属性', concentration:'高' }, applications:'磁性半导体、自旋电子器件', molecularWeight:483.5, latticeConstant:{ a:6.20, b:3.52, c:11.26, unit:'Å' }, density:6.8, thermalConductivity:5, stability:'空气中稳定', notes:'室温铁磁性，Tc>320K', warnings:['磁性材料，室温铁磁性'] },
  { name:'氮化镓锰', formula:'Ga₁₋ₓMnₓN', aliases:['氮化镓锰','gan:mn','mn-doped gan'], bandGap:{ value:3.2, type:'direct', temperature:'300 K' }, valenceBand:1.7, conductionBand:-1.5, crystalStructure:'纤锌矿结构', electronMobility:'≈ 600 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 8 cm²·V⁻¹·s⁻¹', mobility:{ electron:600, hole:8 }, excitonBindingEnergy:28, dielectricConstant:9.5, carrier:{ type:'n型（磁性）', concentration:'可调' }, applications:'稀磁半导体、自旋LED、量子器件', molecularWeight:88.5, latticeConstant:{ a:3.19, c:5.19, unit:'Å', note:'掺杂5-10% Mn' }, density:6.2, thermalConductivity:120, stability:'空气中稳定', notes:'室温铁磁性，自旋电子学', warnings:['磁性掺杂，居里温度>300K'] },
  { name:'硒化亚铁', formula:'FeSe', aliases:['硒化亚铁','fese','iron selenide'], bandGap:{ value:0.0, type:'semimetal', temperature:'300 K' }, valenceBand:0.0, conductionBand:0.0, crystalStructure:'四方层状结构', electronMobility:'≈ 100 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 50 cm²·V⁻¹·s⁻¹', mobility:{ electron:100, hole:50 }, excitonBindingEnergy:null, dielectricConstant:12, carrier:{ type:'半金属', concentration:'高' }, applications:'高温超导体、磁性材料、催化剂', casNumber:'1310-32-3', molecularWeight:134.8, latticeConstant:{ a:3.77, c:5.52, unit:'Å' }, density:5.3, thermalConductivity:10, stability:'空气中稳定', notes:'低温超导，Tc≈8K（单层>100K）', warnings:['低温超导体，Tc≈8K'] },
  { name:'硒化铬', formula:'CrSe', aliases:['硒化铬','crse','chromium selenide'], bandGap:{ value:0.0, type:'metallic', temperature:'300 K' }, valenceBand:0.0, conductionBand:0.0, crystalStructure:'六方NiAs结构', electronMobility:'≈ 5 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 3 cm²·V⁻¹·s⁻¹', mobility:{ electron:5, hole:3 }, excitonBindingEnergy:null, dielectricConstant:10, carrier:{ type:'金属性', concentration:'高' }, applications:'磁性半导体、催化剂', casNumber:'12053-13-3', molecularWeight:131.0, latticeConstant:{ a:3.68, c:6.00, unit:'Å' }, density:6.1, thermalConductivity:8, stability:'空气中稳定', notes:'反铁磁性，TN≈300K', warnings:['磁性材料，反铁磁性'] },
  { name:'三碲化铪', formula:'HfTe₂', aliases:['三碲化铪','hfte2','hafnium telluride'], bandGap:{ value:0.0, type:'semimetal', temperature:'300 K' }, valenceBand:0.0, conductionBand:0.0, crystalStructure:'层状CdI₂结构', electronMobility:'≈ 3000 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 1000 cm²·V⁻¹·s⁻¹', mobility:{ electron:3000, hole:1000 }, excitonBindingEnergy:null, dielectricConstant:18, carrier:{ type:'半金属', concentration:'高' }, applications:'拓扑半金属、量子器件', casNumber:'34626-20-1', molecularWeight:433.7, latticeConstant:{ a:3.96, c:6.68, unit:'Å' }, density:9.2, thermalConductivity:5, stability:'空气中稳定', notes:'外尔半金属，手性费米弧', warnings:['外尔半金属，手性载流子'] },
  { name:'三碲化锆', formula:'ZrTe₂', aliases:['三碲化锆','zrte2','zirconium telluride'], bandGap:{ value:0.0, type:'semimetal', temperature:'300 K' }, valenceBand:0.0, conductionBand:0.0, crystalStructure:'层状CdI₂结构', electronMobility:'≈ 2500 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 800 cm²·V⁻¹·s⁻¹', mobility:{ electron:2500, hole:800 }, excitonBindingEnergy:null, dielectricConstant:16, carrier:{ type:'半金属', concentration:'高' }, applications:'拓扑半金属、量子材料', casNumber:'12166-49-9', molecularWeight:346.7, latticeConstant:{ a:3.95, c:6.65, unit:'Å' }, density:6.9, thermalConductivity:6, stability:'空气中稳定', notes:'外尔半金属候选', warnings:['外尔半金属'] },
  { name:'三碲化钽', formula:'TaTe₂', aliases:['三碲化钽','tate2','tantalum telluride'], bandGap:{ value:0.0, type:'semimetal', temperature:'300 K' }, valenceBand:0.0, conductionBand:0.0, crystalStructure:'层状1T结构', electronMobility:'≈ 4000 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 1500 cm²·V⁻¹·s⁻¹', mobility:{ electron:4000, hole:1500 }, excitonBindingEnergy:null, dielectricConstant:20, carrier:{ type:'半金属', concentration:'高' }, applications:'拓扑半金属、电荷密度波', casNumber:'12067-66-2', molecularWeight:436.6, latticeConstant:{ a:3.48, c:6.50, unit:'Å' }, density:9.9, thermalConductivity:4, stability:'空气中稳定', notes:'CDW材料，Tc≈170K', warnings:['电荷密度波材料'] },
  { name:'砷化镓铟', formula:'InₓGa₁₋ₓAs', aliases:['砷化镓铟','ingaas','indium gallium arsenide'], bandGap:{ value:0.75, type:'direct', temperature:'300 K' }, valenceBand:0.5, conductionBand:-0.25, crystalStructure:'闪锌矿结构', electronMobility:'≈ 13000 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 350 cm²·V⁻¹·s⁻¹', mobility:{ electron:13000, hole:350 }, excitonBindingEnergy:2, dielectricConstant:14, carrier:{ type:'n型', concentration:'可调' }, applications:'红外探测器、高速晶体管、光纤通信', molecularWeight:163.8, latticeConstant:{ a:5.87, unit:'Å', note:'x=0.53与InP衬底匹配' }, density:5.50, thermalConductivity:35, stability:'空气中稳定', notes:'成分可调带隙0.36-1.42eV', warnings:['成分可调，带隙0.36-1.42eV'] },
  { name:'砷化铝镓铟', formula:'AlₓGaᵧIn₁₋ₓ₋ᵧAs', aliases:['砷化铝镓铟','algainas','quaternary iii-v'], bandGap:{ value:1.2, type:'direct', temperature:'300 K' }, valenceBand:0.8, conductionBand:-0.4, crystalStructure:'闪锌矿结构', electronMobility:'≈ 5000 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 200 cm²·V⁻¹·s⁻¹', mobility:{ electron:5000, hole:200 }, excitonBindingEnergy:3, dielectricConstant:13, carrier:{ type:'n型或p型', concentration:'可调' }, applications:'光纤通信激光器、光放大器、异质结', molecularWeight:148, latticeConstant:{ a:5.87, unit:'Å', note:'四元合金晶格匹配InP' }, density:5.2, thermalConductivity:40, stability:'空气中稳定', notes:'四元合金，独立调节带隙和晶格', warnings:['四元合金，带隙可调0.75-1.9eV'] }
];

const semiconductorMaterials = [...originalMaterials];

/**
 * 获取半导体材料列表
 * @returns {array} 半导体材料数组
 */
function getMaterials() {
  return semiconductorMaterials;
}

/**
 * 根据索引获取材料
 * @param {number} index - 材料索引
 * @returns {object|null} 材料对象或错误对象
 */
function getMaterialByIndex(index) {
  const idx = Number(index);
  
  if (!Number.isFinite(idx) || idx < 0 || idx >= semiconductorMaterials.length) {
    return {
      error: '无效的材料索引',
      errorCode: 'INVALID_INDEX',
      validRange: `0 - ${semiconductorMaterials.length - 1}`
    };
  }
  
  return semiconductorMaterials[idx];
}

/**
 * 根据CAS号获取材料
 * @param {string} casNumber - CAS号
 * @returns {object|null} 材料对象或错误
 */
function getMaterialByCAS(casNumber) {
  if (!casNumber || typeof casNumber !== 'string') {
    return {
      error: 'CAS号必须为非空字符串',
      errorCode: 'INVALID_CAS'
    };
  }
  
  const material = semiconductorMaterials.find(m => m.casNumber === casNumber);
  
  if (!material) {
    return {
      error: `未找到CAS号为 ${casNumber} 的材料`,
      errorCode: 'NOT_FOUND'
    };
  }
  
  return material;
}

// ========== 能带边位置计算功能 (v6.3.0新增) ==========

/**
 * 计算能带边位置
 * @param {number} bandgap - 带隙 (eV)
 * @param {number} electronAffinity - 电子亲和能 χ (eV)
 * @param {number} pH - pH值 (默认0，用于vs NHE计算)
 * @returns {object} 能带边位置
 */
function calculateBandEdges(bandgap, electronAffinity, pH = 0) {
  // 输入验证
  if (!isFinite(bandgap) || !isFinite(electronAffinity)) {
    return {
      error: '带隙和电子亲和能必须是有效数字',
      errorCode: 'INVALID_INPUT'
    };
  }

  if (bandgap <= 0) {
    return {
      error: '带隙必须大于0',
      errorCode: 'INVALID_BANDGAP'
    };
  }

  if (pH < 0 || pH > 14) {
    return {
      error: 'pH值必须在0-14之间',
      errorCode: 'INVALID_PH'
    };
  }

  // 计算能带边位置
  // CBM (vs Vacuum) = -χ
  // VBM (vs Vacuum) = CBM - Eg = -χ - Eg
  const cbm_vacuum = -electronAffinity;
  const vbm_vacuum = cbm_vacuum - bandgap;

  // vs NHE转换：E(vs NHE) = E(vs Vacuum) + 4.5 eV
  let cbm_nhe = cbm_vacuum + 4.5;
  let vbm_nhe = vbm_vacuum + 4.5;

  // pH修正：E(pH) = E(pH=0) - 0.059 × pH
  cbm_nhe = cbm_nhe - 0.059 * pH;
  vbm_nhe = vbm_nhe - 0.059 * pH;

  return {
    bandgap,
    electronAffinity,
    pH,
    // vs Vacuum
    cbm_vacuum: parseFloat(cbm_vacuum.toFixed(3)),
    vbm_vacuum: parseFloat(vbm_vacuum.toFixed(3)),
    // vs NHE
    cbm_nhe: parseFloat(cbm_nhe.toFixed(3)),
    vbm_nhe: parseFloat(vbm_nhe.toFixed(3)),
    notes: [
      `导带底（CBM）= ${cbm_nhe.toFixed(2)} V vs NHE`,
      `价带顶（VBM）= ${vbm_nhe.toFixed(2)} V vs NHE`,
      `带隙 Eg = ${bandgap.toFixed(2)} eV`,
      pH !== 0 ? `pH修正：-${(0.059 * pH).toFixed(3)} V` : 'pH = 0 (标准态)'
    ]
  };
}

/**
 * 判断异质结类型
 * @param {object} material1 - 材料1的能带信息 {name, cbm_nhe, vbm_nhe}
 * @param {object} material2 - 材料2的能带信息 {name, cbm_nhe, vbm_nhe}
 * @returns {object} 异质结类型和说明
 */
function determineHeterojunctionType(material1, material2) {
  // 输入验证
  if (!material1 || !material2) {
    return {
      error: '请提供两种材料的能带信息',
      errorCode: 'MISSING_MATERIAL'
    };
  }

  const { cbm_nhe: cbm1, vbm_nhe: vbm1, name: name1 } = material1;
  const { cbm_nhe: cbm2, vbm_nhe: vbm2, name: name2 } = material2;

  if (!isFinite(cbm1) || !isFinite(vbm1) || !isFinite(cbm2) || !isFinite(vbm2)) {
    return {
      error: '能带位置必须是有效数字',
      errorCode: 'INVALID_BAND_POSITION'
    };
  }

  // 确保material1的CBM更高（更负）
  let mat1 = material1, mat2 = material2;
  if (cbm1 < cbm2) {
    [mat1, mat2] = [mat2, mat1];
  }

  const cbm_high = mat1.cbm_nhe;
  const vbm_high = mat1.vbm_nhe;
  const cbm_low = mat2.cbm_nhe;
  const vbm_low = mat2.vbm_nhe;

  let type, description, electronTransfer, holeTransfer;

  // 判断类型
  if (vbm_high < cbm_low) {
    // Type-III: 破裂型（无重叠）
    type = 'Type-III (Broken gap)';
    description = '破裂型异质结，能带完全不重叠，电子和空穴分别位于不同材料';
    electronTransfer = `电子：${mat1.name} (CBM ${cbm_high.toFixed(2)}V) → ${mat2.name} (CBM ${cbm_low.toFixed(2)}V)`;
    holeTransfer = `空穴：${mat2.name} (VBM ${vbm_low.toFixed(2)}V) → ${mat1.name} (VBM ${vbm_high.toFixed(2)}V)`;
  } else if (cbm_high > vbm_low && vbm_high < cbm_low) {
    // Type-II: 交错型
    type = 'Type-II (Staggered gap)';
    description = '交错型异质结，电子和空穴分离，有利于电荷分离';
    electronTransfer = `电子：${mat1.name} (CBM ${cbm_high.toFixed(2)}V) → ${mat2.name} (CBM ${cbm_low.toFixed(2)}V)`;
    holeTransfer = `空穴：${mat2.name} (VBM ${vbm_low.toFixed(2)}V) → ${mat1.name} (VBM ${vbm_high.toFixed(2)}V)`;
  } else {
    // Type-I: 跨骑型
    type = 'Type-I (Straddling gap)';
    description = '跨骑型异质结，一种材料的能带完全包含另一种，电子和空穴都向窄带隙材料转移';
    
    // 判断谁的带隙更窄
    const eg1 = mat1.vbm_nhe - mat1.cbm_nhe;
    const eg2 = mat2.vbm_nhe - mat2.cbm_nhe;
    const narrower = eg1 < eg2 ? mat1 : mat2;
    const wider = eg1 < eg2 ? mat2 : mat1;
    
    electronTransfer = `电子：${wider.name} → ${narrower.name} (CBM ${narrower.cbm_nhe.toFixed(2)}V)`;
    holeTransfer = `空穴：${wider.name} → ${narrower.name} (VBM ${narrower.vbm_nhe.toFixed(2)}V)`;
  }

  return {
    type,
    description,
    material1: {
      name: mat1.name,
      cbm: mat1.cbm_nhe,
      vbm: mat1.vbm_nhe,
      bandgap: (mat1.vbm_nhe - mat1.cbm_nhe).toFixed(2)
    },
    material2: {
      name: mat2.name,
      cbm: mat2.cbm_nhe,
      vbm: mat2.vbm_nhe,
      bandgap: (mat2.vbm_nhe - mat2.cbm_nhe).toFixed(2)
    },
    electronTransfer,
    holeTransfer,
    notes: [
      type,
      description,
      '',
      '📊 能带对齐：',
      `${mat1.name}: CBM = ${mat1.cbm_nhe.toFixed(2)} V, VBM = ${mat1.vbm_nhe.toFixed(2)} V`,
      `${mat2.name}: CBM = ${mat2.cbm_nhe.toFixed(2)} V, VBM = ${mat2.vbm_nhe.toFixed(2)} V`,
      '',
      '⚡ 载流子转移：',
      electronTransfer,
      holeTransfer,
      '',
      type === 'Type-II (Staggered gap)' ? '💡 Type-II有利于光催化和太阳能电池' : 
      type === 'Type-I (Straddling gap)' ? '💡 Type-I常用于量子阱和激光器' :
      '💡 Type-III较少见，能带完全分离'
    ]
  };
}

/**
 * 检查材料是否适合光催化还原/氧化反应
 * @param {number} cbm_nhe - 导带底位置 (V vs NHE)
 * @param {number} vbm_nhe - 价带顶位置 (V vs NHE)
 * @param {number} pH - pH值
 * @returns {object} 适用性分析
 */
function checkPhotocatalyticSuitability(cbm_nhe, vbm_nhe, pH = 7) {
  // 输入验证
  if (!isFinite(cbm_nhe) || !isFinite(vbm_nhe)) {
    return {
      error: '能带位置必须是有效数字',
      errorCode: 'INVALID_INPUT'
    };
  }

  // 标准电极电位（vs NHE，pH=0）
  const H2_H2O_pH0 = 0.0; // H⁺/H₂
  const O2_H2O_pH0 = 1.23; // O₂/H₂O

  // pH修正
  const H2_H2O = H2_H2O_pH0 - 0.059 * pH;
  const O2_H2O = O2_H2O_pH0 - 0.059 * pH;

  // 判断还原能力（产H₂）
  const canReduceH = cbm_nhe > H2_H2O;
  const reductionOverpotential = cbm_nhe - H2_H2O;

  // 判断氧化能力（产O₂）
  const canOxidizeH2O = vbm_nhe < O2_H2O;
  const oxidationOverpotential = O2_H2O - vbm_nhe;

  // 判断是否可以全解水
  const canSplitWater = canReduceH && canOxidizeH2O;

  return {
    pH,
    H2_reduction: {
      potential: H2_H2O.toFixed(3),
      suitable: canReduceH,
      overpotential: reductionOverpotential.toFixed(3),
      note: canReduceH ? 
        `✓ 可产H₂，过电位 ${Math.abs(reductionOverpotential).toFixed(2)} V` : 
        `✗ 不可产H₂，CBM位置过低 ${Math.abs(reductionOverpotential).toFixed(2)} V`
    },
    O2_evolution: {
      potential: O2_H2O.toFixed(3),
      suitable: canOxidizeH2O,
      overpotential: oxidationOverpotential.toFixed(3),
      note: canOxidizeH2O ? 
        `✓ 可产O₂，过电位 ${Math.abs(oxidationOverpotential).toFixed(2)} V` : 
        `✗ 不可产O₂，VBM位置过高 ${Math.abs(oxidationOverpotential).toFixed(2)} V`
    },
    waterSplitting: {
      suitable: canSplitWater,
      note: canSplitWater ? 
        '✓ 理论上可以全解水' : 
        '✗ 不适合全解水，需要助催化剂或牺牲剂'
    },
    summary: [
      `pH = ${pH}`,
      `H⁺/H₂ = ${H2_H2O.toFixed(2)} V vs NHE`,
      `O₂/H₂O = ${O2_H2O.toFixed(2)} V vs NHE`,
      '',
      `CBM = ${cbm_nhe.toFixed(2)} V ${canReduceH ? '(可还原H⁺)' : '(不可还原H⁺)'}`,
      `VBM = ${vbm_nhe.toFixed(2)} V ${canOxidizeH2O ? '(可氧化H₂O)' : '(不可氧化H₂O)'}`,
      '',
      canSplitWater ? '💧 可用于光催化全解水' : '⚠️ 需要助催化剂或牺牲剂'
    ]
  };
}

module.exports = { 
  // 数据
  semiconductorMaterials,
  
  // 元数据
  getMetadata,
  
  // 查询函数
  getMaterials,
  getMaterialByIndex,
  getMaterialByCAS,
  searchMaterials,
  
  // 筛选函数
  filterByBandGap,
  filterByApplication,
  
  // 统计函数
  getApplicationCategories,
  getMaterialsStatistics,

  // 能带边计算（v6.3.0新增）
  calculateBandEdges,
  determineHeterojunctionType,
  checkPhotocatalyticSuitability
};
