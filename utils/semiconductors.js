// 与网页生产版保持一致：从网页端同步的 50 种主流半导体材料
// 数据来源：多个权威数据库和学术文献

// 元数据
const METADATA = {
  version: '2.0.0',
  lastUpdated: '2025-10-11',
  totalMaterials: 106,
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
 * 根据材料名称或化学式搜索半导体材料
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
  
  const results = semiconductorMaterials.filter(material => {
    return material.name.toLowerCase().includes(q) ||
           material.formula.toLowerCase().includes(q) ||
           (material.aliases && material.aliases.some(alias => alias.toLowerCase().includes(q)));
  });
  
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

/**
 * 获取材料统计信息
 * @returns {object} 统计信息
 */
function getMaterialsStatistics() {
  const stats = {
    total: semiconductorMaterials.length,
    byBandGapType: {
      direct: 0,
      indirect: 0
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
  
  semiconductorMaterials.forEach(material => {
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
  });
  
  stats.bandGapRange.average = count > 0 ? totalGap / count : 0;
  
  return stats;
}

const originalMaterials = [
  // 金属氧化物半导体
  { name:'二氧化钛', formula:'TiO₂', aliases:['二氧化钛','tio2','titanium dioxide','钛白粉'], bandGap:{ value:3.2, type:'indirect', temperature:'300 K' }, valenceBand:2.7, conductionBand:-0.5, crystalStructure:'锐钛矿/金红石', electronMobility:'≈ 20 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 1 cm²·V⁻¹·s⁻¹', applications:'光催化、太阳能电池、自清洁涂层', casNumber:'1317-70-0', molecularWeight:79.866, latticeConstant:{ a:3.78, c:9.51, unit:'Å', note:'锐钛矿相' }, density:3.89, thermalConductivity:11.7 },
  { name:'氧化锌', formula:'ZnO', aliases:['氧化锌','zno','zinc oxide'], bandGap:{ value:3.3, type:'direct', temperature:'300 K' }, valenceBand:2.9, conductionBand:-0.4, crystalStructure:'纤锌矿结构', electronMobility:'≈ 200 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 5 cm²·V⁻¹·s⁻¹', applications:'透明导电膜、紫外LED、压电器件', casNumber:'1314-13-2', molecularWeight:81.4, latticeConstant:{ a:3.25, c:5.21, unit:'Å' }, density:5.61, thermalConductivity:54 },
  { name:'三氧化钨', formula:'WO₃', aliases:['三氧化钨','wo3','tungsten trioxide'], bandGap:{ value:2.8, type:'indirect', temperature:'300 K' }, valenceBand:3.2, conductionBand:0.4, crystalStructure:'钙钛矿相关结构', electronMobility:'≈ 12 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 2 cm²·V⁻¹·s⁻¹', applications:'电致变色、光催化、气敏传感器', casNumber:'1314-35-8', molecularWeight:231.84 },
  { name:'氧化铜', formula:'CuO', aliases:['氧化铜','cuo','copper oxide'], bandGap:{ value:1.4, type:'direct', temperature:'300 K' }, valenceBand:1.8, conductionBand:0.4, crystalStructure:'单斜结构', electronMobility:'≈ 0.1 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 0.1 cm²·V⁻¹·s⁻¹', applications:'太阳能电池、光催化、抗菌材料', casNumber:'163686-95-1', molecularWeight:79.55 },
  { name:'氧化铟', formula:'In₂O₃', aliases:['氧化铟','in2o3','indium oxide'], bandGap:{ value:3.6, type:'direct', temperature:'300 K' }, valenceBand:3.2, conductionBand:-0.4, crystalStructure:'立方结构', electronMobility:'≈ 30 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 2 cm²·V⁻¹·s⁻¹', applications:'透明导电膜、显示器', casNumber:'1312-43-2', molecularWeight:277.63 },
  { name:'氧化镍', formula:'NiO', aliases:['氧化镍','nio','nickel oxide'], bandGap:{ value:3.4, type:'direct', temperature:'300 K' }, valenceBand:1.7, conductionBand:-1.7, crystalStructure:'岩盐结构', electronMobility:'≈ 0.1 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 2.8 cm²·V⁻¹·s⁻¹', applications:'电池电极、电致变色、传感器', casNumber:'11099-02-8', molecularWeight:74.693 },
  { name:'四氧化三钴', formula:'Co₃O₄', aliases:['四氧化三钴','co3o4','cobalt oxide'], bandGap:{ value:1.6, type:'direct', temperature:'300 K' }, valenceBand:1.8, conductionBand:0.2, crystalStructure:'尖晶石结构', electronMobility:'≈ 0.3 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 3.2 cm²·V⁻¹·s⁻¹', applications:'锂电池、电催化、传感器', casNumber:'11104-61-3', molecularWeight:240.797 },
  { name:'二氧化锡', formula:'SnO₂', aliases:['二氧化锡','sno2','tin oxide'], bandGap:{ value:3.6, type:'direct', temperature:'300 K' }, valenceBand:4.0, conductionBand:0.4, crystalStructure:'金红石结构', electronMobility:'≈ 250 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 2 cm²·V⁻¹·s⁻¹', applications:'气敏传感器、透明导电膜', casNumber:'18282-10-5', molecularWeight:150.71 },
  { name:'三氧化二铁', formula:'Fe₂O₃', aliases:['三氧化二铁','fe2o3','iron oxide','赤铁矿'], bandGap:{ value:2.2, type:'indirect', temperature:'300 K' }, valenceBand:2.4, conductionBand:0.2, crystalStructure:'刚玉结构', electronMobility:'≈ 0.1 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 0.01 cm²·V⁻¹·s⁻¹', applications:'光催化、磁性材料、颜料', casNumber:'1309-37-1', molecularWeight:159.69 },
  { name:'钒酸铋', formula:'BiVO₄', aliases:['钒酸铋','bivo4','bismuth vanadate'], bandGap:{ value:2.4, type:'direct', temperature:'300 K' }, valenceBand:2.9, conductionBand:0.5, crystalStructure:'单斜白钨矿结构', electronMobility:'≈ 0.05 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 0.02 cm²·V⁻¹·s⁻¹', applications:'光催化分解水、颜料', casNumber:'14059-33-7', molecularWeight:323.92 },

  // 金属硫化物半导体
  { name:'硫化镉', formula:'CdS', aliases:['硫化镉','cds','cadmium sulfide'], bandGap:{ value:2.4, type:'direct', temperature:'300 K' }, valenceBand:2.0, conductionBand:-0.4, crystalStructure:'纤锌矿/闪锌矿结构', electronMobility:'≈ 340 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 50 cm²·V⁻¹·s⁻¹', applications:'太阳能电池、光电器件、发光材料', casNumber:'1306-23-6', molecularWeight:144.47 },
  { name:'硫化锌', formula:'ZnS', aliases:['硫化锌','zns','zinc sulfide','闪锌矿'], bandGap:{ value:3.7, type:'direct', temperature:'300 K' }, valenceBand:1.8, conductionBand:-1.9, crystalStructure:'闪锌矿/纤锌矿结构', electronMobility:'≈ 165 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 5 cm²·V⁻¹·s⁻¹', applications:'发光材料、红外窗口、荧光粉', casNumber:'1314-98-3', molecularWeight:97.4 },
  { name:'二硫化钼', formula:'MoS₂', aliases:['二硫化钼','mos2','molybdenum disulfide'], bandGap:{ value:1.8, type:'indirect', temperature:'300 K' }, valenceBand:1.8, conductionBand:0.0, crystalStructure:'层状六方结构', electronMobility:'≈ 200 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 180 cm²·V⁻¹·s⁻¹', applications:'晶体管、润滑剂、锂电池', casNumber:'1317-33-5', molecularWeight:160.1 },
  { name:'二硫化钨', formula:'WS₂', aliases:['二硫化钨','ws2','tungsten disulfide'], bandGap:{ value:2.1, type:'indirect', temperature:'300 K' }, valenceBand:1.6, conductionBand:-0.5, crystalStructure:'层状六方结构', electronMobility:'≈ 250 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 150 cm²·V⁻¹·s⁻¹', applications:'电子器件、润滑剂', casNumber:'12138-09-9', molecularWeight:248.0 },
  { name:'硫化铅', formula:'PbS', aliases:['硫化铅','pbs','lead sulfide','方铅矿'], bandGap:{ value:0.4, type:'direct', temperature:'300 K' }, valenceBand:0.9, conductionBand:0.5, crystalStructure:'岩盐结构', electronMobility:'≈ 600 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 700 cm²·V⁻¹·s⁻¹', applications:'红外探测器、太阳能电池', casNumber:'1314-87-0', molecularWeight:239 },
  { name:'硫化锑', formula:'Sb₂S₃', aliases:['硫化锑','sb2s3','antimony sulfide','辉锑矿'], bandGap:{ value:1.7, type:'direct', temperature:'300 K' }, valenceBand:1.3, conductionBand:-0.4, crystalStructure:'斜方结构', electronMobility:'≈ 15 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 2 cm²·V⁻¹·s⁻¹', applications:'太阳能电池、热电材料', casNumber:'1315-04-4', molecularWeight:339.7 },
  { name:'硫化铋', formula:'Bi₂S₃', aliases:['硫化铋','bi2s3','bismuth sulfide'], bandGap:{ value:1.3, type:'direct', temperature:'300 K' }, valenceBand:0.9, conductionBand:-0.4, crystalStructure:'斜方结构', electronMobility:'≈ 450 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 680 cm²·V⁻¹·s⁻¹', applications:'热电材料、太阳能电池', casNumber:'1345-07-9', molecularWeight:514.2 },
  { name:'硫化锡', formula:'SnS', aliases:['硫化锡','sns','tin sulfide'], bandGap:{ value:1.3, type:'indirect', temperature:'300 K' }, valenceBand:0.9, conductionBand:-0.4, crystalStructure:'斜方结构', electronMobility:'≈ 100 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 90 cm²·V⁻¹·s⁻¹', applications:'太阳能电池、锂电池', casNumber:'1314-95-0', molecularWeight:150.78 },
  { name:'硫化银', formula:'Ag₂S', aliases:['硫化银','ag2s','silver sulfide'], bandGap:{ value:1.0, type:'direct', temperature:'300 K' }, valenceBand:0.6, conductionBand:-0.4, crystalStructure:'单斜结构', electronMobility:'≈ 400 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 300 cm²·V⁻¹·s⁻¹', applications:'红外探测器、电池', casNumber:'12751-47-2', molecularWeight:247.80 },
  { name:'硫化汞', formula:'HgS', aliases:['硫化汞','hgs','mercury sulfide','朱砂'], bandGap:{ value:2.1, type:'direct', temperature:'300 K' }, valenceBand:1.8, conductionBand:-0.3, crystalStructure:'六方/立方结构', electronMobility:'≈ 10 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 5 cm²·V⁻¹·s⁻¹', applications:'颜料、光电器件', casNumber:'1344-48-5', molecularWeight:232.66 },

  // III-V族半导体
  { name:'砷化镓', formula:'GaAs', aliases:['砷化镓','gaas','gallium arsenide'], bandGap:{ value:1.4, type:'direct', temperature:'300 K' }, valenceBand:0.8, conductionBand:-0.6, crystalStructure:'闪锌矿结构', electronMobility:'≈ 8500 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 400 cm²·V⁻¹·s⁻¹', applications:'RF器件、LED、激光器', casNumber:'1303-00-0', molecularWeight:144.645, latticeConstant:{ a:5.65, unit:'Å' }, density:5.32, thermalConductivity:55 },
  { name:'磷化铟', formula:'InP', aliases:['磷化铟','inp','indium phosphide'], bandGap:{ value:1.3, type:'direct', temperature:'300 K' }, valenceBand:0.7, conductionBand:-0.6, crystalStructure:'闪锌矿结构', electronMobility:'≈ 5400 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 200 cm²·V⁻¹·s⁻¹', applications:'高频器件、光纤通信', casNumber:'22398-80-7', molecularWeight:145.792, latticeConstant:{ a:5.87, unit:'Å' }, density:4.81, thermalConductivity:68 },
  { name:'氮化镓', formula:'GaN', aliases:['氮化镓','gan','gallium nitride'], bandGap:{ value:3.4, type:'direct', temperature:'300 K' }, valenceBand:1.8, conductionBand:-1.6, crystalStructure:'纤锌矿结构', electronMobility:'≈ 1200 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 10 cm²·V⁻¹·s⁻¹', applications:'功率器件、蓝光LED、RF器件', casNumber:'25617-97-4', molecularWeight:83.73, latticeConstant:{ a:3.19, c:5.19, unit:'Å' }, density:6.15, thermalConductivity:130 },
  { name:'磷化镓', formula:'GaP', aliases:['磷化镓','gap','gallium phosphide'], bandGap:{ value:2.3, type:'indirect', temperature:'300 K' }, valenceBand:1.5, conductionBand:-0.8, crystalStructure:'闪锌矿结构', electronMobility:'≈ 110 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 75 cm²·V⁻¹·s⁻¹', applications:'绿光LED、红光LED', casNumber:'12063-98-8', molecularWeight:100.7, latticeConstant:{ a:5.45, unit:'Å' }, density:4.14, thermalConductivity:110 },
  { name:'砷化铟', formula:'InAs', aliases:['砷化铟','inas','indium arsenide'], bandGap:{ value:0.36, type:'direct', temperature:'300 K' }, valenceBand:0.2, conductionBand:-0.16, crystalStructure:'闪锌矿结构', electronMobility:'≈ 33000 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 460 cm²·V⁻¹·s⁻¹', applications:'红外探测器、高速器件', casNumber:'1303-11-3', molecularWeight:189.7, latticeConstant:{ a:6.06, unit:'Å' }, density:5.67, thermalConductivity:27 },

  // 碳化物和氮化物半导体
  { name:'碳化硅', formula:'SiC', aliases:['碳化硅','sic','silicon carbide','金刚砂'], bandGap:{ value:3.3, type:'indirect', temperature:'300 K' }, valenceBand:2.2, conductionBand:-1.1, crystalStructure:'4H-SiC六方结构', electronMobility:'≈ 950 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 120 cm²·V⁻¹·s⁻¹', applications:'高温高功率器件、电动汽车', casNumber:'409-21-2', molecularWeight:40.096 },
  { name:'氮化硼', formula:'BN', aliases:['氮化硼','bn','boron nitride'], bandGap:{ value:5.9, type:'indirect', temperature:'300 K' }, valenceBand:3.5, conductionBand:-2.4, crystalStructure:'六方层状结构', electronMobility:'≈ 200 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 20 cm²·V⁻¹·s⁻¹', applications:'绝缘材料、散热材料', casNumber:'10043-11-5', molecularWeight:24.82 },
  { name:'氮化铝', formula:'AlN', aliases:['氮化铝','aln','aluminum nitride'], bandGap:{ value:6.2, type:'direct', temperature:'300 K' }, valenceBand:3.8, conductionBand:-2.4, crystalStructure:'纤锌矿结构', electronMobility:'≈ 300 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 10 cm²·V⁻¹·s⁻¹', applications:'深紫外LED、高功率器件', casNumber:'24304-00-5', molecularWeight:40.99 },

  // 钙钛矿和复合氧化物
  { name:'钛酸锶', formula:'SrTiO₃', aliases:['钛酸锶','srtio3','strontium titanate'], bandGap:{ value:3.2, type:'indirect', temperature:'300 K' }, valenceBand:2.6, conductionBand:-0.6, crystalStructure:'立方钙钛矿结构', electronMobility:'≈ 5 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 1 cm²·V⁻¹·s⁻¹', applications:'光催化、电子器件基底', casNumber:'12060-59-2', molecularWeight:183.49 },
  { name:'钛酸钡', formula:'BaTiO₃', aliases:['钛酸钡','batio3','barium titanate'], bandGap:{ value:3.2, type:'indirect', temperature:'300 K' }, valenceBand:2.8, conductionBand:-0.4, crystalStructure:'四方钙钛矿结构', electronMobility:'≈ 0.5 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 0.1 cm²·V⁻¹·s⁻¹', applications:'压电陶瓷、铁电材料', casNumber:'12047-27-7', molecularWeight:233.19 },

  // 其他重要半导体
  { name:'硫化铜', formula:'CuS', aliases:['硫化铜','cus','copper sulfide'], bandGap:{ value:2.0, type:'direct', temperature:'300 K' }, valenceBand:1.2, conductionBand:-0.8, crystalStructure:'六方结构', electronMobility:'≈ 100 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 25 cm²·V⁻¹·s⁻¹', applications:'太阳能电池、光催化', casNumber:'1317-40-4', molecularWeight:95.61 },
  { name:'二硫化铁', formula:'FeS₂', aliases:['二硫化铁','fes2','iron sulfide','黄铁矿'], bandGap:{ value:0.95, type:'indirect', temperature:'300 K' }, valenceBand:0.4, conductionBand:-0.55, crystalStructure:'立方黄铁矿结构', electronMobility:'≈ 360 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 100 cm²·V⁻¹·s⁻¹', applications:'太阳能电池、光催化', casNumber:'1317-97-1', molecularWeight:119.98 },
  { name:'五氧化二钽', formula:'Ta₂O₅', aliases:['五氧化二钽','ta2o5','tantalum pentoxide'], bandGap:{ value:4.0, type:'indirect', temperature:'300 K' }, valenceBand:3.1, conductionBand:-0.9, crystalStructure:'斜方结构', electronMobility:'≈ 1 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 0.1 cm²·V⁻¹·s⁻¹', applications:'光催化、介电材料', casNumber:'1314-61-0', molecularWeight:441.89 },
  { name:'硒化镉', formula:'CdSe', aliases:['硒化镉','cdse','cadmium selenide'], bandGap:{ value:1.7, type:'direct', temperature:'300 K' }, valenceBand:1.2, conductionBand:-0.5, crystalStructure:'闪锌矿/纤锌矿结构', electronMobility:'≈ 650 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 60 cm²·V⁻¹·s⁻¹', applications:'量子点、太阳能电池、LED', casNumber:'1306-24-7', molecularWeight:191.37 },
  { name:'碲化镉', formula:'CdTe', aliases:['碲化镉','cdte','cadmium telluride'], bandGap:{ value:1.5, type:'direct', temperature:'300 K' }, valenceBand:1.0, conductionBand:-0.5, crystalStructure:'闪锌矿结构', electronMobility:'≈ 1050 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 100 cm²·V⁻¹·s⁻¹', applications:'太阳能电池、X射线探测器', casNumber:'1306-25-8', molecularWeight:240.01 },
  { name:'硫化铜铟', formula:'CuInS₂', aliases:['硫化铜铟','cis','cuin2','copper indium sulfide'], bandGap:{ value:1.5, type:'direct', temperature:'300 K' }, valenceBand:1.0, conductionBand:-0.5, crystalStructure:'黄铜矿结构', electronMobility:'≈ 16 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 2 cm²·V⁻¹·s⁻¹', applications:'薄膜太阳能电池', casNumber:'12018-95-0', molecularWeight:242.5 },
  { name:'氧化亚铜', formula:'Cu₂O', aliases:['氧化亚铜','cu2o','cuprous oxide'], bandGap:{ value:2.0, type:'direct', temperature:'300 K' }, valenceBand:1.8, conductionBand:-0.2, crystalStructure:'立方结构', electronMobility:'≈ 100 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 80 cm²·V⁻¹·s⁻¹', applications:'太阳能电池、光催化', casNumber:'1317-39-1', molecularWeight:143.09 },
  { name:'二硫化锡', formula:'SnS₂', aliases:['二硫化锡','sns2','tin disulfide'], bandGap:{ value:2.2, type:'indirect', temperature:'300 K' }, valenceBand:1.8, conductionBand:-0.4, crystalStructure:'层状六方结构', electronMobility:'≈ 230 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 90 cm²·V⁻¹·s⁻¹', applications:'晶体管、光电器件', casNumber:'1315-01-1', molecularWeight:182.84 },
  { name:'氧化镓', formula:'Ga₂O₃', aliases:['氧化镓','ga2o3','gallium oxide'], bandGap:{ value:4.8, type:'indirect', temperature:'300 K' }, valenceBand:3.8, conductionBand:-1.0, crystalStructure:'单斜结构', electronMobility:'≈ 300 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 10 cm²·V⁻¹·s⁻¹', applications:'高功率器件、深紫外探测', casNumber:'12024-21-4', molecularWeight:187.44 },
  { name:'钼酸铋', formula:'Bi₂MoO₆', aliases:['钼酸铋','bi2moo6','bismuth molybdate'], bandGap:{ value:2.7, type:'indirect', temperature:'300 K' }, valenceBand:2.8, conductionBand:0.1, crystalStructure:'奥尔托斜方结构', electronMobility:'≈ 10 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 5 cm²·V⁻¹·s⁻¹', applications:'光催化、颜料', casNumber:'13565-96-3', molecularWeight:609.77 },
  { name:'钨酸铋', formula:'Bi₂WO₆', aliases:['钨酸铋','bi2wo6','bismuth tungstate'], bandGap:{ value:2.8, type:'indirect', temperature:'300 K' }, valenceBand:3.1, conductionBand:0.3, crystalStructure:'层状结构', electronMobility:'≈ 12 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 3 cm²·V⁻¹·s⁻¹', applications:'光催化', casNumber:'13595-25-0', molecularWeight:713.69 },

  // 传统IV族和III-V族半导体
  { name:'硅', formula:'Si', aliases:['硅','si','silicon'], bandGap:{ value:1.12, type:'indirect', temperature:'300 K' }, valenceBand:1.0, conductionBand:-0.12, crystalStructure:'金刚石结构', electronMobility:'≈ 1350 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 480 cm²·V⁻¹·s⁻¹', applications:'集成电路、太阳能电池', casNumber:'7440-21-3', molecularWeight:28.085, latticeConstant:{ a:5.43, unit:'Å' }, density:2.33, thermalConductivity:148 },
  { name:'锗', formula:'Ge', aliases:['锗','ge','germanium'], bandGap:{ value:0.66, type:'indirect', temperature:'300 K' }, valenceBand:0.66, conductionBand:0.0, crystalStructure:'金刚石结构', electronMobility:'≈ 3900 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 1900 cm²·V⁻¹·s⁻¹', applications:'红外探测器、高频器件', casNumber:'7440-56-4', molecularWeight:72.63, latticeConstant:{ a:5.66, unit:'Å' }, density:5.32, thermalConductivity:60 },
  { name:'金刚石', formula:'C', aliases:['金刚石','diamond','c','钻石'], bandGap:{ value:5.5, type:'indirect', temperature:'300 K' }, valenceBand:2.5, conductionBand:-3.0, crystalStructure:'金刚石结构', electronMobility:'≈ 2200 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 1600 cm²·V⁻¹·s⁻¹', applications:'高功率器件、高频器件', casNumber:'7782-40-3', molecularWeight:12.011, latticeConstant:{ a:3.57, unit:'Å' }, density:3.52, thermalConductivity:2200 },

  // 新兴二维材料
  { name:'石墨烯', formula:'C', aliases:['石墨烯','graphene'], bandGap:{ value:0.0, type:'direct', temperature:'300 K' }, valenceBand:0.0, conductionBand:0.0, crystalStructure:'单层六方结构', electronMobility:'≈ 15000 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 15000 cm²·V⁻¹·s⁻¹', applications:'高速电子器件、透明电极', casNumber:'7782-42-5', molecularWeight:12.011, latticeConstant:{ a:2.46, unit:'Å' }, density:2.267, thermalConductivity:5300 },

  // 新增材料（54种）- 扩展到106种总数
  // 更多III-V族化合物
  { name:'砷化铝', formula:'AlAs', aliases:['砷化铝','alas','aluminum arsenide'], bandGap:{ value:2.16, type:'indirect', temperature:'300 K' }, valenceBand:1.5, conductionBand:-0.66, crystalStructure:'闪锌矿结构', electronMobility:'≈ 280 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 200 cm²·V⁻¹·s⁻¹', applications:'异质结构、量子阱', casNumber:'22831-42-1', molecularWeight:101.903, latticeConstant:{ a:5.66, unit:'Å' }, density:3.76, thermalConductivity:91 },
  { name:'磷化铝', formula:'AlP', aliases:['磷化铝','alp','aluminum phosphide'], bandGap:{ value:2.45, type:'indirect', temperature:'300 K' }, valenceBand:1.6, conductionBand:-0.85, crystalStructure:'闪锌矿结构', electronMobility:'≈ 80 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 40 cm²·V⁻¹·s⁻¹', applications:'农药、LED', casNumber:'20859-73-8', molecularWeight:57.955, latticeConstant:{ a:5.46, unit:'Å' }, density:2.42, thermalConductivity:90 },
  { name:'锑化镓', formula:'GaSb', aliases:['锑化镓','gasb','gallium antimonide'], bandGap:{ value:0.73, type:'direct', temperature:'300 K' }, valenceBand:0.5, conductionBand:-0.23, crystalStructure:'闪锌矿结构', electronMobility:'≈ 5000 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 850 cm²·V⁻¹·s⁻¹', applications:'红外探测器、热电器件', casNumber:'12064-03-8', molecularWeight:191.483, latticeConstant:{ a:6.10, unit:'Å' }, density:5.61, thermalConductivity:33 },
  { name:'锑化铟', formula:'InSb', aliases:['锑化铟','insb','indium antimonide'], bandGap:{ value:0.17, type:'direct', temperature:'300 K' }, valenceBand:0.1, conductionBand:-0.07, crystalStructure:'闪锌矿结构', electronMobility:'≈ 77000 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 850 cm²·V⁻¹·s⁻¹', applications:'红外探测器、磁传感器', casNumber:'1312-41-0', molecularWeight:236.578, latticeConstant:{ a:6.48, unit:'Å' }, density:5.78, thermalConductivity:18 },
  { name:'氮化铟', formula:'InN', aliases:['氮化铟','inn','indium nitride'], bandGap:{ value:0.7, type:'direct', temperature:'300 K' }, valenceBand:0.4, conductionBand:-0.3, crystalStructure:'纤锌矿结构', electronMobility:'≈ 3200 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 30 cm²·V⁻¹·s⁻¹', applications:'太阳能电池、红外LED', casNumber:'25617-98-5', molecularWeight:128.825, latticeConstant:{ a:3.54, c:5.70, unit:'Å' }, density:6.81, thermalConductivity:45 },
  
  // 更多II-VI族化合物
  { name:'硒化锌', formula:'ZnSe', aliases:['硒化锌','znse','zinc selenide'], bandGap:{ value:2.7, type:'direct', temperature:'300 K' }, valenceBand:1.7, conductionBand:-1.0, crystalStructure:'闪锌矿结构', electronMobility:'≈ 530 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 28 cm²·V⁻¹·s⁻¹', applications:'蓝绿光LED、激光器', casNumber:'1315-09-9', molecularWeight:144.35, latticeConstant:{ a:5.67, unit:'Å' }, density:5.27, thermalConductivity:18 },
  { name:'碲化锌', formula:'ZnTe', aliases:['碲化锌','znte','zinc telluride'], bandGap:{ value:2.26, type:'direct', temperature:'300 K' }, valenceBand:1.5, conductionBand:-0.76, crystalStructure:'闪锌矿结构', electronMobility:'≈ 340 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 100 cm²·V⁻¹·s⁻¹', applications:'太阳能电池、探测器', casNumber:'1315-11-3', molecularWeight:192.99, latticeConstant:{ a:6.10, unit:'Å' }, density:6.34, thermalConductivity:18 },
  { name:'硒化镉', formula:'CdSe', aliases:['硒化镉','cdse','cadmium selenide'], bandGap:{ value:1.7, type:'direct', temperature:'300 K' }, valenceBand:1.2, conductionBand:-0.5, crystalStructure:'闪锌矿/纤锌矿结构', electronMobility:'≈ 650 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 60 cm²·V⁻¹·s⁻¹', applications:'量子点、太阳能电池、LED', casNumber:'1306-24-7', molecularWeight:191.37, latticeConstant:{ a:6.05, unit:'Å' }, density:5.81, thermalConductivity:9 },
  { name:'硒化汞', formula:'HgSe', aliases:['硒化汞','hgse','mercury selenide'], bandGap:{ value:0.30, type:'direct', temperature:'300 K' }, valenceBand:0.2, conductionBand:-0.1, crystalStructure:'闪锌矿结构', electronMobility:'≈ 20000 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 300 cm²·V⁻¹·s⁻¹', applications:'红外探测器', casNumber:'20601-83-6', molecularWeight:279.55, latticeConstant:{ a:6.08, unit:'Å' }, density:8.25, thermalConductivity:3 },
  { name:'碲化汞', formula:'HgTe', aliases:['碲化汞','hgte','mercury telluride'], bandGap:{ value:-0.15, type:'direct', temperature:'300 K' }, valenceBand:-0.15, conductionBand:0.0, crystalStructure:'闪锌矿结构', electronMobility:'≈ 25000 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 400 cm²·V⁻¹·s⁻¹', applications:'红外探测器、拓扑绝缘体', casNumber:'12068-90-5', molecularWeight:328.19, latticeConstant:{ a:6.46, unit:'Å' }, density:8.12, thermalConductivity:2.7 },
  { name:'硒化铅', formula:'PbSe', aliases:['硒化铅','pbse','lead selenide'], bandGap:{ value:0.27, type:'direct', temperature:'300 K' }, valenceBand:0.7, conductionBand:0.43, crystalStructure:'岩盐结构', electronMobility:'≈ 1000 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 1500 cm²·V⁻¹·s⁻¹', applications:'红外探测器、热电材料', casNumber:'12069-00-0', molecularWeight:286.16, latticeConstant:{ a:6.12, unit:'Å' }, density:8.27, thermalConductivity:2.5 },
  { name:'碲化铅', formula:'PbTe', aliases:['碲化铅','pbte','lead telluride'], bandGap:{ value:0.31, type:'direct', temperature:'300 K' }, valenceBand:0.8, conductionBand:0.49, crystalStructure:'岩盐结构', electronMobility:'≈ 1600 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 750 cm²·V⁻¹·s⁻¹', applications:'热电材料、红外探测', casNumber:'1314-91-6', molecularWeight:334.80, latticeConstant:{ a:6.46, unit:'Å' }, density:8.16, thermalConductivity:2.2 },
  
  // 更多层状材料（TMDs）
  { name:'二硫化铪', formula:'HfS₂', aliases:['二硫化铪','hfs2','hafnium disulfide'], bandGap:{ value:2.0, type:'indirect', temperature:'300 K' }, valenceBand:1.5, conductionBand:-0.5, crystalStructure:'层状六方结构', electronMobility:'≈ 150 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 100 cm²·V⁻¹·s⁻¹', applications:'电子器件、光电器件', casNumber:'18855-94-2', molecularWeight:242.63, latticeConstant:{ a:3.63, c:5.84, unit:'Å' }, density:6.03, thermalConductivity:12 },
  { name:'二硒化钼', formula:'MoSe₂', aliases:['二硒化钼','mose2','molybdenum diselenide'], bandGap:{ value:1.5, type:'indirect', temperature:'300 K' }, valenceBand:1.4, conductionBand:-0.1, crystalStructure:'层状六方结构', electronMobility:'≈ 100 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 90 cm²·V⁻¹·s⁻¹', applications:'晶体管、光电器件', casNumber:'12058-18-3', molecularWeight:253.88, latticeConstant:{ a:3.29, c:12.90, unit:'Å' }, density:6.90, thermalConductivity:2.4 },
  { name:'二碲化钼', formula:'MoTe₂', aliases:['二碲化钼','mote2','molybdenum ditelluride'], bandGap:{ value:1.0, type:'indirect', temperature:'300 K' }, valenceBand:1.0, conductionBand:0.0, crystalStructure:'层状六方结构', electronMobility:'≈ 200 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 150 cm²·V⁻¹·s⁻¹', applications:'相变材料、电子器件', casNumber:'12058-20-7', molecularWeight:351.14, latticeConstant:{ a:3.52, c:13.97, unit:'Å' }, density:7.70, thermalConductivity:2.1 },
  { name:'二硒化钨', formula:'WSe₂', aliases:['二硒化钨','wse2','tungsten diselenide'], bandGap:{ value:1.65, type:'indirect', temperature:'300 K' }, valenceBand:1.5, conductionBand:-0.15, crystalStructure:'层状六方结构', electronMobility:'≈ 150 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 250 cm²·V⁻¹·s⁻¹', applications:'晶体管、谷电子学', casNumber:'12067-46-8', molecularWeight:341.76, latticeConstant:{ a:3.28, c:12.96, unit:'Å' }, density:9.32, thermalConductivity:2.5 },
  { name:'二碲化钨', formula:'WTe₂', aliases:['二碲化钨','wte2','tungsten ditelluride'], bandGap:{ value:0.7, type:'indirect', temperature:'300 K' }, valenceBand:0.7, conductionBand:0.0, crystalStructure:'层状正交结构', electronMobility:'≈ 300 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 200 cm²·V⁻¹·s⁻¹', applications:'自旋电子学、相变材料', casNumber:'12067-76-4', molecularWeight:439.04, latticeConstant:{ a:3.47, c:14.07, unit:'Å' }, density:9.43, thermalConductivity:1.8 },
  
  // 钙钛矿材料
  { name:'碘化铅甲胺', formula:'CH₃NH₃PbI₃', aliases:['mapi','甲胺碘化铅','methylammonium lead iodide'], bandGap:{ value:1.55, type:'direct', temperature:'300 K' }, valenceBand:0.9, conductionBand:-0.65, crystalStructure:'立方钙钛矿结构', electronMobility:'≈ 160 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 105 cm²·V⁻¹·s⁻¹', applications:'太阳能电池、LED', casNumber:'69507-00-4', molecularWeight:620.98, latticeConstant:{ a:6.31, unit:'Å' }, density:4.29, thermalConductivity:0.5 },
  { name:'溴化铅甲胺', formula:'CH₃NH₃PbBr₃', aliases:['mapb','甲胺溴化铅','methylammonium lead bromide'], bandGap:{ value:2.3, type:'direct', temperature:'300 K' }, valenceBand:1.5, conductionBand:-0.8, crystalStructure:'立方钙钛矿结构', electronMobility:'≈ 115 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 60 cm²·V⁻¹·s⁻¹', applications:'LED、光电探测', casNumber:'69507-02-6', molecularWeight:383.86, latticeConstant:{ a:5.93, unit:'Å' }, density:3.58, thermalConductivity:0.4 },
  { name:'氯化铅甲胺', formula:'CH₃NH₃PbCl₃', aliases:['mapc','甲胺氯化铅','methylammonium lead chloride'], bandGap:{ value:3.1, type:'direct', temperature:'300 K' }, valenceBand:2.2, conductionBand:-0.9, crystalStructure:'立方钙钛矿结构', electronMobility:'≈ 75 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 40 cm²·V⁻¹·s⁻¹', applications:'光电器件', casNumber:'69507-01-5', molecularWeight:276.60, latticeConstant:{ a:5.68, unit:'Å' }, density:3.06, thermalConductivity:0.5 },
  { name:'碘化铅铯', formula:'CsPbI₃', aliases:['铯铅碘','cesium lead iodide'], bandGap:{ value:1.73, type:'direct', temperature:'300 K' }, valenceBand:1.0, conductionBand:-0.73, crystalStructure:'立方钙钛矿结构', electronMobility:'≈ 210 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 125 cm²·V⁻¹·s⁻¹', applications:'太阳能电池、量子点', casNumber:'18480-07-4', molecularWeight:721.63, latticeConstant:{ a:6.29, unit:'Å' }, density:4.95, thermalConductivity:0.45 },
  
  // 有机半导体
  { name:'并五苯', formula:'C₂₂H₁₄', aliases:['pentacene','并五苯'], bandGap:{ value:1.85, type:'direct', temperature:'300 K' }, valenceBand:1.6, conductionBand:-0.25, crystalStructure:'单斜结构', electronMobility:'≈ 5 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 40 cm²·V⁻¹·s⁻¹', applications:'有机晶体管、光电器件', casNumber:'135-48-8', molecularWeight:278.35, latticeConstant:{ a:7.90, b:6.06, c:16.01, unit:'Å' }, density:1.30, thermalConductivity:0.6 },
  { name:'酞菁铜', formula:'C₃₂H₁₆CuN₈', aliases:['copper phthalocyanine','cupc'], bandGap:{ value:1.8, type:'direct', temperature:'300 K' }, valenceBand:1.2, conductionBand:-0.6, crystalStructure:'单斜结构', electronMobility:'≈ 0.02 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 0.03 cm²·V⁻¹·s⁻¹', applications:'有机太阳能电池、传感器', casNumber:'147-14-8', molecularWeight:576.07, density:1.62, thermalConductivity:0.4 },
  
  // 更多氧化物半导体
  { name:'氧化钴', formula:'CoO', aliases:['氧化钴','coo','cobalt monoxide'], bandGap:{ value:2.6, type:'direct', temperature:'300 K' }, valenceBand:1.4, conductionBand:-1.2, crystalStructure:'岩盐结构', electronMobility:'≈ 0.3 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 10 cm²·V⁻¹·s⁻¹', applications:'电池电极、催化剂', casNumber:'1307-96-6', molecularWeight:74.933, latticeConstant:{ a:4.26, unit:'Å' }, density:6.44, thermalConductivity:4.5 },
  { name:'五氧化二铌', formula:'Nb₂O₅', aliases:['五氧化二铌','nb2o5','niobium pentoxide'], bandGap:{ value:3.4, type:'indirect', temperature:'300 K' }, valenceBand:3.0, conductionBand:-0.4, crystalStructure:'单斜结构', electronMobility:'≈ 5 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 1 cm²·V⁻¹·s⁻¹', applications:'光催化、电致变色', casNumber:'1313-96-8', molecularWeight:265.81, latticeConstant:{ a:6.17, unit:'Å' }, density:4.47, thermalConductivity:3.0 },
  { name:'氧化钒', formula:'V₂O₅', aliases:['五氧化二钒','v2o5','vanadium pentoxide'], bandGap:{ value:2.3, type:'indirect', temperature:'300 K' }, valenceBand:2.5, conductionBand:0.2, crystalStructure:'斜方层状结构', electronMobility:'≈ 0.05 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 0.01 cm²·V⁻¹·s⁻¹', applications:'电池电极、智能窗', casNumber:'1314-62-1', molecularWeight:181.88, latticeConstant:{ a:11.51, b:3.56, c:4.37, unit:'Å' }, density:3.36, thermalConductivity:3.5 },
  { name:'氧化锰', formula:'MnO₂', aliases:['二氧化锰','mno2','manganese dioxide'], bandGap:{ value:2.2, type:'direct', temperature:'300 K' }, valenceBand:2.0, conductionBand:-0.2, crystalStructure:'金红石结构', electronMobility:'≈ 1 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 2 cm²·V⁻¹·s⁻¹', applications:'电池、催化剂', casNumber:'1313-13-9', molecularWeight:86.937, latticeConstant:{ a:4.40, c:2.87, unit:'Å' }, density:5.03, thermalConductivity:1.8 },
  { name:'氧化锆', formula:'ZrO₂', aliases:['二氧化锆','zro2','zirconia'], bandGap:{ value:5.0, type:'indirect', temperature:'300 K' }, valenceBand:3.2, conductionBand:-1.8, crystalStructure:'单斜/四方/立方结构', electronMobility:'≈ 1 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 0.1 cm²·V⁻¹·s⁻¹', applications:'固体电解质、陶瓷', casNumber:'1314-23-4', molecularWeight:123.22, latticeConstant:{ a:5.09, unit:'Å' }, density:5.68, thermalConductivity:2.0 },
  { name:'氧化铈', formula:'CeO₂', aliases:['二氧化铈','ceo2','ceria'], bandGap:{ value:3.2, type:'indirect', temperature:'300 K' }, valenceBand:2.8, conductionBand:-0.4, crystalStructure:'萤石结构', electronMobility:'≈ 0.1 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 0.01 cm²·V⁻¹·s⁻¹', applications:'催化剂、固体氧化物燃料电池', casNumber:'1306-38-3', molecularWeight:172.115, latticeConstant:{ a:5.41, unit:'Å' }, density:7.22, thermalConductivity:12 },
  { name:'氧化镧', formula:'La₂O₃', aliases:['三氧化二镧','la2o3','lanthanum oxide'], bandGap:{ value:5.5, type:'indirect', temperature:'300 K' }, valenceBand:3.8, conductionBand:-1.7, crystalStructure:'六方结构', electronMobility:'≈ 0.5 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 0.1 cm²·V⁻¹·s⁻¹', applications:'介电材料、催化剂', casNumber:'1312-81-8', molecularWeight:325.809, latticeConstant:{ a:3.94, unit:'Å' }, density:6.51, thermalConductivity:2.5 },
  
  // 硫族化合物
  { name:'硒化锡', formula:'SnSe', aliases:['硒化锡','snse','tin selenide'], bandGap:{ value:0.9, type:'indirect', temperature:'300 K' }, valenceBand:0.6, conductionBand:-0.3, crystalStructure:'斜方层状结构', electronMobility:'≈ 250 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 160 cm²·V⁻¹·s⁻¹', applications:'热电材料、太阳能电池', casNumber:'1315-06-6', molecularWeight:197.67, latticeConstant:{ a:11.50, b:4.15, c:4.45, unit:'Å' }, density:6.18, thermalConductivity:0.7 },
  { name:'碲化锡', formula:'SnTe', aliases:['碲化锡','snte','tin telluride'], bandGap:{ value:0.18, type:'direct', temperature:'300 K' }, valenceBand:0.5, conductionBand:0.32, crystalStructure:'岩盐结构', electronMobility:'≈ 2500 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 1500 cm²·V⁻¹·s⁻¹', applications:'热电材料、红外探测', casNumber:'12040-02-7', molecularWeight:246.31, latticeConstant:{ a:6.32, unit:'Å' }, density:6.45, thermalConductivity:2.8 },
  { name:'硒化锗', formula:'GeSe', aliases:['硒化锗','gese','germanium selenide'], bandGap:{ value:1.14, type:'indirect', temperature:'300 K' }, valenceBand:0.8, conductionBand:-0.34, crystalStructure:'斜方层状结构', electronMobility:'≈ 140 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 90 cm²·V⁻¹·s⁻¹', applications:'热电材料、光电器件', casNumber:'12065-11-1', molecularWeight:151.56, latticeConstant:{ a:10.83, b:3.83, c:4.40, unit:'Å' }, density:5.57, thermalConductivity:1.6 },
  { name:'碲化锗', formula:'GeTe', aliases:['碲化锗','gete','germanium telluride'], bandGap:{ value:0.60, type:'direct', temperature:'300 K' }, valenceBand:0.5, conductionBand:-0.1, crystalStructure:'菱方结构', electronMobility:'≈ 900 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 600 cm²·V⁻¹·s⁻¹', applications:'相变存储器、热电材料', casNumber:'12025-39-1', molecularWeight:200.21, latticeConstant:{ a:5.98, unit:'Å' }, density:6.16, thermalConductivity:2.2 },
  { name:'硒化砷', formula:'As₂Se₃', aliases:['硒化砷','as2se3','arsenic selenide'], bandGap:{ value:1.8, type:'indirect', temperature:'300 K' }, valenceBand:1.2, conductionBand:-0.6, crystalStructure:'单斜层状结构', electronMobility:'≈ 1 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 0.5 cm²·V⁻¹·s⁻¹', applications:'红外光学、相变材料', casNumber:'1303-36-2', molecularWeight:386.72, latticeConstant:{ a:12.05, unit:'Å' }, density:4.75, thermalConductivity:0.13 },
  { name:'硫化砷', formula:'As₂S₃', aliases:['硫化砷','as2s3','arsenic sulfide','雄黄'], bandGap:{ value:2.5, type:'indirect', temperature:'300 K' }, valenceBand:1.5, conductionBand:-1.0, crystalStructure:'单斜层状结构', electronMobility:'≈ 2 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 1 cm²·V⁻¹·s⁻¹', applications:'红外光学、光存储', casNumber:'1303-33-9', molecularWeight:246.04, latticeConstant:{ a:11.49, unit:'Å' }, density:3.46, thermalConductivity:0.2 },
  
  // 磷化物和砷化物
  { name:'磷化镉', formula:'Cd₃P₂', aliases:['磷化镉','cd3p2','cadmium phosphide'], bandGap:{ value:0.5, type:'direct', temperature:'300 K' }, valenceBand:0.3, conductionBand:-0.2, crystalStructure:'四方结构', electronMobility:'≈ 1000 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 400 cm²·V⁻¹·s⁻¹', applications:'红外探测器、太阳能电池', casNumber:'12014-28-7', molecularWeight:399.18, latticeConstant:{ a:9.55, c:17.00, unit:'Å' }, density:5.00, thermalConductivity:4 },
  { name:'磷化锌', formula:'Zn₃P₂', aliases:['磷化锌','zn3p2','zinc phosphide'], bandGap:{ value:1.5, type:'direct', temperature:'300 K' }, valenceBand:1.0, conductionBand:-0.5, crystalStructure:'四方结构', electronMobility:'≈ 180 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 50 cm²·V⁻¹·s⁻¹', applications:'太阳能电池、熏蒸剂', casNumber:'1314-84-7', molecularWeight:258.12, latticeConstant:{ a:8.09, c:11.47, unit:'Å' }, density:4.55, thermalConductivity:16 },
  { name:'砷化镉', formula:'Cd₃As₂', aliases:['砷化镉','cd3as2','cadmium arsenide'], bandGap:{ value:0.14, type:'direct', temperature:'300 K' }, valenceBand:0.1, conductionBand:-0.04, crystalStructure:'四方结构', electronMobility:'≈ 30000 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 500 cm²·V⁻¹·s⁻¹', applications:'狄拉克半金属、红外探测', casNumber:'12006-15-4', molecularWeight:487.08, latticeConstant:{ a:12.67, c:25.48, unit:'Å' }, density:6.36, thermalConductivity:5 },
  
  // 氮族化合物
  { name:'氮化钛', formula:'TiN', aliases:['氮化钛','tin','titanium nitride'], bandGap:{ value:0.0, type:'direct', temperature:'300 K' }, valenceBand:0.0, conductionBand:0.0, crystalStructure:'岩盐结构', electronMobility:'≈ 10 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 5 cm²·V⁻¹·s⁻¹', applications:'硬质涂层、扩散势垒', casNumber:'25583-20-4', molecularWeight:61.874, latticeConstant:{ a:4.24, unit:'Å' }, density:5.22, thermalConductivity:19 },
  { name:'氮化锆', formula:'ZrN', aliases:['氮化锆','zrn','zirconium nitride'], bandGap:{ value:0.0, type:'direct', temperature:'300 K' }, valenceBand:0.0, conductionBand:0.0, crystalStructure:'岩盐结构', electronMobility:'≈ 8 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 4 cm²·V⁻¹·s⁻¹', applications:'硬质涂层、高温陶瓷', casNumber:'25658-42-8', molecularWeight:105.225, latticeConstant:{ a:4.58, unit:'Å' }, density:7.09, thermalConductivity:20 },
  
  // 复合氧化物和钙钛矿
  { name:'铌酸钡锶', formula:'Ba₀.₆Sr₀.₄TiO₃', aliases:['bst','barium strontium titanate'], bandGap:{ value:3.4, type:'indirect', temperature:'300 K' }, valenceBand:2.8, conductionBand:-0.6, crystalStructure:'立方钙钛矿结构', electronMobility:'≈ 1 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 0.2 cm²·V⁻¹·s⁻¹', applications:'可调电容器、铁电材料', casNumber:'12009-14-2', molecularWeight:218.7, latticeConstant:{ a:3.95, unit:'Å' }, density:5.35, thermalConductivity:3.5 },
  { name:'铌酸锂', formula:'LiNbO₃', aliases:['铌酸锂','linbo3','lithium niobate'], bandGap:{ value:4.0, type:'indirect', temperature:'300 K' }, valenceBand:3.2, conductionBand:-0.8, crystalStructure:'三方结构', electronMobility:'≈ 1 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 0.1 cm²·V⁻¹·s⁻¹', applications:'电光调制器、表面声波器件', casNumber:'12031-63-9', molecularWeight:147.846, latticeConstant:{ a:5.15, c:13.86, unit:'Å' }, density:4.64, thermalConductivity:5.6 },
  { name:'钽酸锂', formula:'LiTaO₃', aliases:['钽酸锂','litao3','lithium tantalate'], bandGap:{ value:4.4, type:'indirect', temperature:'300 K' }, valenceBand:3.5, conductionBand:-0.9, crystalStructure:'三方结构', electronMobility:'≈ 1 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 0.1 cm²·V⁻¹·s⁻¹', applications:'声表面波器件、非线性光学', casNumber:'12031-66-2', molecularWeight:235.887, latticeConstant:{ a:5.15, c:13.78, unit:'Å' }, density:7.45, thermalConductivity:4.2 },
  { name:'钛酸铅', formula:'PbTiO₃', aliases:['钛酸铅','pbtio3','lead titanate'], bandGap:{ value:3.4, type:'indirect', temperature:'300 K' }, valenceBand:2.8, conductionBand:-0.6, crystalStructure:'四方钙钛矿结构', electronMobility:'≈ 0.5 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 0.1 cm²·V⁻¹·s⁻¹', applications:'铁电材料、压电陶瓷', casNumber:'12060-00-3', molecularWeight:303.08, latticeConstant:{ a:3.90, c:4.15, unit:'Å' }, density:7.52, thermalConductivity:2.0 },
  { name:'锰酸镧', formula:'LaMnO₃', aliases:['锰酸镧','lamno3','lanthanum manganite'], bandGap:{ value:1.1, type:'indirect', temperature:'300 K' }, valenceBand:0.7, conductionBand:-0.4, crystalStructure:'斜方钙钛矿结构', electronMobility:'≈ 0.01 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 0.05 cm²·V⁻¹·s⁻¹', applications:'催化剂、巨磁阻材料', casNumber:'12063-79-5', molecularWeight:231.844, latticeConstant:{ a:5.54, unit:'Å' }, density:6.57, thermalConductivity:2.2 },
  
  // 其他化合物
  { name:'碳化钨', formula:'WC', aliases:['碳化钨','wc','tungsten carbide'], bandGap:{ value:0.0, type:'direct', temperature:'300 K' }, valenceBand:0.0, conductionBand:0.0, crystalStructure:'六方简单结构', electronMobility:'≈ 5 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 2 cm²·V⁻¹·s⁻¹', applications:'硬质合金、切削工具', casNumber:'12070-12-1', molecularWeight:195.85, latticeConstant:{ a:2.91, c:2.84, unit:'Å' }, density:15.63, thermalConductivity:110 },
  { name:'氮化硅', formula:'Si₃N₄', aliases:['氮化硅','si3n4','silicon nitride'], bandGap:{ value:5.0, type:'indirect', temperature:'300 K' }, valenceBand:3.2, conductionBand:-1.8, crystalStructure:'六方/三方结构', electronMobility:'≈ 20 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 5 cm²·V⁻¹·s⁻¹', applications:'高温陶瓷、介电材料', casNumber:'12033-89-5', molecularWeight:140.283, latticeConstant:{ a:7.75, c:5.62, unit:'Å' }, density:3.17, thermalConductivity:30 },
  { name:'硼化钛', formula:'TiB₂', aliases:['硼化钛','tib2','titanium diboride'], bandGap:{ value:0.0, type:'direct', temperature:'300 K' }, valenceBand:0.0, conductionBand:0.0, crystalStructure:'六方结构', electronMobility:'≈ 8 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 3 cm²·V⁻¹·s⁻¹', applications:'硬质材料、高温电极', casNumber:'12045-63-5', molecularWeight:69.489, latticeConstant:{ a:3.03, c:3.23, unit:'Å' }, density:4.52, thermalConductivity:96 },
  { name:'碲化铋', formula:'Bi₂Te₃', aliases:['碲化铋','bi2te3','bismuth telluride'], bandGap:{ value:0.15, type:'indirect', temperature:'300 K' }, valenceBand:0.15, conductionBand:0.0, crystalStructure:'层状菱方结构', electronMobility:'≈ 1100 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 680 cm²·V⁻¹·s⁻¹', applications:'热电材料、拓扑绝缘体', casNumber:'1304-82-1', molecularWeight:800.76, latticeConstant:{ a:4.38, c:30.50, unit:'Å' }, density:7.86, thermalConductivity:1.5 },
  { name:'硒化铋', formula:'Bi₂Se₃', aliases:['硒化铋','bi2se3','bismuth selenide'], bandGap:{ value:0.30, type:'indirect', temperature:'300 K' }, valenceBand:0.25, conductionBand:-0.05, crystalStructure:'层状菱方结构', electronMobility:'≈ 600 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 400 cm²·V⁻¹·s⁻¹', applications:'热电材料、拓扑绝缘体', casNumber:'12068-69-8', molecularWeight:654.84, latticeConstant:{ a:4.14, c:28.64, unit:'Å' }, density:6.82, thermalConductivity:1.2 },
  { name:'硒化锑', formula:'Sb₂Se₃', aliases:['硒化锑','sb2se3','antimony selenide'], bandGap:{ value:1.2, type:'direct', temperature:'300 K' }, valenceBand:0.8, conductionBand:-0.4, crystalStructure:'斜方层状结构', electronMobility:'≈ 50 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 10 cm²·V⁻¹·s⁻¹', applications:'太阳能电池、热电材料', casNumber:'1315-05-5', molecularWeight:480.4, latticeConstant:{ a:11.77, b:11.62, c:3.98, unit:'Å' }, density:5.81, thermalConductivity:2.5 },
  { name:'碲化锑', formula:'Sb₂Te₃', aliases:['碲化锑','sb2te3','antimony telluride'], bandGap:{ value:0.28, type:'indirect', temperature:'300 K' }, valenceBand:0.25, conductionBand:-0.03, crystalStructure:'层状菱方结构', electronMobility:'≈ 425 cm²·V⁻¹·s⁻¹', holeMobility:'≈ 360 cm²·V⁻¹·s⁻¹', applications:'热电材料、相变存储', casNumber:'1327-50-0', molecularWeight:626.32, latticeConstant:{ a:4.26, c:30.45, unit:'Å' }, density:6.50, thermalConductivity:1.5 }
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
  getMaterialsStatistics
};
