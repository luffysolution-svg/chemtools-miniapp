/**
 * 配位场理论计算器
 * 计算晶体场分裂能、预测配合物颜色、生成d轨道能级图
 * 
 * @version 8.0.0
 * @author ChemTools Team
 */

/**
 * 配体场强数据（分光化学序列）
 * 相对场强值（以H2O为1.00基准）
 */
const LIGAND_FIELD_STRENGTH = {
  'I-': 0.6,
  'Br-': 0.7,
  'SCN-': 0.7,
  'Cl-': 0.8,
  'F-': 0.9,
  'OH-': 0.95,
  'H2O': 1.0,
  'NCS-': 1.05,
  'NH3': 1.25,
  'en': 1.28,
  'bipy': 1.33,
  'phen': 1.35,
  'NO2-': 1.40,
  'CN-': 1.70,
  'CO': 1.80
};

/**
 * 金属离子配位场参数
 * Δ0值为八面体配合物的典型分裂能（cm-1）
 */
const METAL_ION_PARAMETERS = {
  // 3d金属
  'Ti3+': { dn: 'd1', Δ0_typical: 20300, racah_B: 695 },
  'V3+': { dn: 'd2', Δ0_typical: 17850, racah_B: 755 },
  'Cr3+': { dn: 'd3', Δ0_typical: 17400, racah_B: 918 },
  'Mn2+': { dn: 'd5', Δ0_typical: 8500, racah_B: 960 },
  'Fe2+': { dn: 'd6', Δ0_typical: 10400, racah_B: 1058 },
  'Fe3+': { dn: 'd5', Δ0_typical: 14000, racah_B: 1015 },
  'Co2+': { dn: 'd7', Δ0_typical: 9300, racah_B: 971 },
  'Co3+': { dn: 'd6', Δ0_typical: 22900, racah_B: 620 },
  'Ni2+': { dn: 'd8', Δ0_typical: 8500, racah_B: 1041 },
  'Cu2+': { dn: 'd9', Δ0_typical: 12600, racah_B: 1239 },
  
  // 4d金属
  'Mo3+': { dn: 'd3', Δ0_typical: 19800, racah_B: 460 },
  'Rh3+': { dn: 'd6', Δ0_typical: 27200, racah_B: 420 },
  'Pd2+': { dn: 'd8', Δ0_typical: 20000, racah_B: 540 },
  
  // 5d金属
  'Ir3+': { dn: 'd6', Δ0_typical: 32000, racah_B: 390 },
  'Pt2+': { dn: 'd8', Δ0_typical: 28000, racah_B: 480 },
  'Pt4+': { dn: 'd6', Δ0_typical: 36000, racah_B: 350 }
};

/**
 * d轨道电子构型（高自旋/低自旋）
 */
const D_ELECTRON_CONFIGURATIONS = {
  'd1': { electrons: 1, highSpin: [1,0,0,0,0], lowSpin: [1,0,0,0,0], unpaired: 1 },
  'd2': { electrons: 2, highSpin: [1,1,0,0,0], lowSpin: [1,1,0,0,0], unpaired: 2 },
  'd3': { electrons: 3, highSpin: [1,1,1,0,0], lowSpin: [1,1,1,0,0], unpaired: 3 },
  'd4': { electrons: 4, highSpin: [1,1,1,1,0], lowSpin: [2,1,1,0,0], unpaired: { high: 4, low: 2 } },
  'd5': { electrons: 5, highSpin: [1,1,1,1,1], lowSpin: [2,2,1,0,0], unpaired: { high: 5, low: 1 } },
  'd6': { electrons: 6, highSpin: [2,1,1,1,1], lowSpin: [2,2,2,0,0], unpaired: { high: 4, low: 0 } },
  'd7': { electrons: 7, highSpin: [2,2,1,1,1], lowSpin: [2,2,2,1,0], unpaired: { high: 3, low: 1 } },
  'd8': { electrons: 8, highSpin: [2,2,2,1,1], lowSpin: [2,2,2,2,0], unpaired: { high: 2, low: 0 } },
  'd9': { electrons: 9, highSpin: [2,2,2,2,1], lowSpin: [2,2,2,2,1], unpaired: 1 },
  'd10': { electrons: 10, highSpin: [2,2,2,2,2], lowSpin: [2,2,2,2,2], unpaired: 0 }
};

/**
 * 计算晶体场分裂能
 * 
 * @param {string} metalIon - 金属离子（如 'Cr3+'）
 * @param {string[]} ligands - 配体列表（6个，如 ['H2O', 'H2O', 'H2O', 'H2O', 'H2O', 'H2O']）
 * @param {string} geometry - 几何构型（'octahedral', 'tetrahedral', 'square-planar'）
 * @returns {object} 计算结果
 */
function calculateCrystalFieldSplitting(metalIon, ligands, geometry = 'octahedral') {
  // 验证输入
  if (!METAL_ION_PARAMETERS[metalIon]) {
    return {
      success: false,
      error: '不支持的金属离子'
    };
  }

  const metalData = METAL_ION_PARAMETERS[metalIon];
  
  // 计算平均配体场强
  let totalFieldStrength = 0;
  let validLigands = 0;
  
  ligands.forEach(ligand => {
    if (LIGAND_FIELD_STRENGTH[ligand]) {
      totalFieldStrength += LIGAND_FIELD_STRENGTH[ligand];
      validLigands++;
    }
  });
  
  if (validLigands === 0) {
    return {
      success: false,
      error: '没有有效的配体'
    };
  }
  
  const averageFieldStrength = totalFieldStrength / validLigands;
  
  // 计算Δ值
  let delta = metalData.Δ0_typical * averageFieldStrength;
  
  // 几何构型修正
  if (geometry === 'tetrahedral') {
    delta = delta * 4 / 9; // 四面体Δt ≈ 4/9 Δo
  } else if (geometry === 'square-planar') {
    delta = delta * 1.3; // 平面四方场强更大
  }
  
  // 判断高自旋/低自旋
  const spinState = determineSpinState(metalData.dn, delta, metalData.racah_B);
  
  // 预测颜色
  const color = predictColor(delta);
  
  // 计算配体场稳定化能
  const lfse = calculateLFSE(metalData.dn, delta, spinState, geometry);
  
  return {
    success: true,
    metalIon,
    dn: metalData.dn,
    geometry,
    delta: Math.round(delta),
    deltaInKJ: Math.round(delta * 0.01196), // cm-1 to kJ/mol
    deltaInEV: (delta * 0.000124).toFixed(3), // cm-1 to eV
    spinState,
    color,
    lfse,
    unpaired: getUnpairedElectrons(metalData.dn, spinState),
    magnetic: getUnpairedElectrons(metalData.dn, spinState) > 0 ? '顺磁性' : '抗磁性'
  };
}

/**
 * 判断高自旋/低自旋
 */
function determineSpinState(dn, delta, racahB) {
  // 计算自旋配对能 P
  const P = racahB * getPairingEnergyFactor(dn);
  
  // d4-d7可能存在高低自旋转变
  if (['d4', 'd5', 'd6', 'd7'].includes(dn)) {
    if (delta > P) {
      return 'low-spin'; // 低自旋（强场）
    } else {
      return 'high-spin'; // 高自旋（弱场）
    }
  }
  
  // d1-d3, d8-d10只有一种自旋状态
  return 'normal';
}

/**
 * 获取配对能因子
 */
function getPairingEnergyFactor(dn) {
  const factors = {
    'd4': 1.0,
    'd5': 2.0,
    'd6': 2.5,
    'd7': 2.0
  };
  return factors[dn] || 1.0;
}

/**
 * 预测配合物颜色
 */
function predictColor(delta) {
  // 根据d-d跃迁能量预测颜色
  // λ(nm) = 10^7 / Δ(cm-1)
  const wavelength = 10000000 / delta;
  
  let absorbedColor, complementaryColor;
  
  if (wavelength < 400) {
    absorbedColor = '紫外';
    complementaryColor = '无色/白色';
  } else if (wavelength < 450) {
    absorbedColor = '紫色';
    complementaryColor = '黄绿色';
  } else if (wavelength < 490) {
    absorbedColor = '蓝色';
    complementaryColor = '黄色/橙色';
  } else if (wavelength < 560) {
    absorbedColor = '绿色';
    complementaryColor = '红色/紫红色';
  } else if (wavelength < 590) {
    absorbedColor = '黄色';
    complementaryColor = '紫色';
  } else if (wavelength < 630) {
    absorbedColor = '橙色';
    complementaryColor: '蓝色';
  } else if (wavelength < 700) {
    absorbedColor = '红色';
    complementaryColor = '绿色';
  } else {
    absorbedColor = '近红外';
    complementaryColor = '淡色/无色';
  }
  
  return {
    wavelength: Math.round(wavelength),
    absorbedColor,
    observedColor: complementaryColor,
    notes: `吸收${absorbedColor}光（${Math.round(wavelength)}nm），显${complementaryColor}`
  };
}

/**
 * 计算配体场稳定化能 (LFSE)
 */
function calculateLFSE(dn, delta, spinState, geometry) {
  const config = D_ELECTRON_CONFIGURATIONS[dn];
  if (!config) return null;
  
  let lfse = 0;
  
  if (geometry === 'octahedral') {
    // 八面体：t2g能量 -0.4Δ0，eg能量 +0.6Δ0
    const electrons = spinState === 'high-spin' ? config.highSpin : 
                     (spinState === 'low-spin' ? config.lowSpin : config.highSpin);
    
    // t2g（3个轨道）：dxy, dyz, dxz
    const t2g_electrons = electrons[0] + electrons[1] + electrons[2];
    // eg（2个轨道）：dx2-y2, dz2  
    const eg_electrons = electrons[3] + electrons[4];
    
    lfse = -0.4 * t2g_electrons + 0.6 * eg_electrons;
    
  } else if (geometry === 'tetrahedral') {
    // 四面体：e能量 -0.6Δt，t2能量 +0.4Δt
    // 注意：这里delta已经是Δt了
    const electrons = config.highSpin; // 四面体通常是高自旋
    
    const e_electrons = electrons[3] + electrons[4];
    const t2_electrons = electrons[0] + electrons[1] + electrons[2];
    
    lfse = -0.6 * e_electrons + 0.4 * t2_electrons;
    
  } else if (geometry === 'square-planar') {
    // 平面四方：能级分裂更复杂
    // 简化计算：d8总是低自旋
    lfse = -1.2; // 近似值
  }
  
  return {
    value: lfse,
    unit: 'Δ0',
    inCm: Math.round(lfse * delta),
    inKJ: Math.round(lfse * delta * 0.01196),
    notes: `LFSE = ${lfse.toFixed(2)}Δ0 = ${Math.round(lfse * delta)} cm⁻¹`
  };
}

/**
 * 获取未配对电子数
 */
function getUnpairedElectrons(dn, spinState) {
  const config = D_ELECTRON_CONFIGURATIONS[dn];
  if (!config) return 0;
  
  if (spinState === 'high-spin') {
    return typeof config.unpaired === 'object' ? config.unpaired.high : config.unpaired;
  } else if (spinState === 'low-spin') {
    return typeof config.unpaired === 'object' ? config.unpaired.low : config.unpaired;
  }
  
  return config.unpaired;
}

/**
 * 生成d轨道能级图数据
 */
function generateOrbitalDiagram(metalIon, delta, spinState, geometry) {
  const metalData = METAL_ION_PARAMETERS[metalIon];
  if (!metalData) return null;
  
  const config = D_ELECTRON_CONFIGURATIONS[metalData.dn];
  const electrons = spinState === 'high-spin' ? config.highSpin : 
                   (spinState === 'low-spin' ? config.lowSpin : config.highSpin);
  
  if (geometry === 'octahedral') {
    return {
      geometry: '八面体',
      levels: [
        {
          name: 'eg',
          orbitals: ['dx2-y2', 'dz2'],
          energy: 0.6,
          energyValue: Math.round(0.6 * delta),
          electrons: [electrons[3], electrons[4]],
          totalElectrons: electrons[3] + electrons[4],
          degeneracy: 2
        },
        {
          name: 't2g',
          orbitals: ['dxy', 'dyz', 'dxz'],
          energy: -0.4,
          energyValue: Math.round(-0.4 * delta),
          electrons: [electrons[0], electrons[1], electrons[2]],
          totalElectrons: electrons[0] + electrons[1] + electrons[2],
          degeneracy: 3
        }
      ],
      delta: {
        value: delta,
        unit: 'cm^-1',
        label: 'Delta0'
      }
    };
  } else if (geometry === 'tetrahedral') {
    return {
      geometry: '四面体',
      levels: [
        {
          name: 't2',
          orbitals: ['dxy', 'dyz', 'dxz'],
          energy: 0.4,
          energyValue: Math.round(0.4 * delta),
          electrons: [electrons[0], electrons[1], electrons[2]],
          totalElectrons: electrons[0] + electrons[1] + electrons[2],
          degeneracy: 3
        },
        {
          name: 'e',
          orbitals: ['dx2-y2', 'dz2'],
          energy: -0.6,
          energyValue: Math.round(-0.6 * delta),
          electrons: [electrons[3], electrons[4]],
          totalElectrons: electrons[3] + electrons[4],
          degeneracy: 2
        }
      ],
      delta: {
        value: delta,
        unit: 'cm^-1',
        label: 'Delta-t'
      }
    };
  } else if (geometry === 'square-planar') {
    return {
      geometry: '平面四方',
      levels: [
        {
          name: 'dx2-y2',
          orbitals: ['dx2-y2'],
          energy: 1.2,
          energyValue: Math.round(1.2 * delta),
          electrons: [electrons[4]],
          totalElectrons: electrons[4],
          degeneracy: 1
        },
        {
          name: 'dxy',
          orbitals: ['dxy'],
          energy: 0.2,
          energyValue: Math.round(0.2 * delta),
          electrons: [electrons[0]],
          totalElectrons: electrons[0],
          degeneracy: 1
        },
        {
          name: 'dxz, dyz',
          orbitals: ['dxz', 'dyz'],
          energy: -0.4,
          energyValue: Math.round(-0.4 * delta),
          electrons: [electrons[1], electrons[2]],
          totalElectrons: electrons[1] + electrons[2],
          degeneracy: 2
        },
        {
          name: 'dz2',
          orbitals: ['dz2'],
          energy: -1.2,
          energyValue: Math.round(-1.2 * delta),
          electrons: [electrons[3]],
          totalElectrons: electrons[3],
          degeneracy: 1
        }
      ],
      delta: {
        value: delta,
        unit: 'cm^-1',
        label: 'Delta-sp'
      }
    };
  }
  
  return null;
}

/**
 * 查询已知配合物数据
 */
function searchKnownComplexes(query) {
  const { CRYSTAL_FIELD_SPLITTING } = require('./data/experimental-constants');
  
  if (!query) return CRYSTAL_FIELD_SPLITTING;
  
  const q = query.toLowerCase();
  return CRYSTAL_FIELD_SPLITTING.filter(complex =>
    complex.complex.toLowerCase().includes(q) ||
    complex.metal.toLowerCase().includes(q) ||
    complex.color.toLowerCase().includes(q)
  );
}

/**
 * 按金属分组配合物
 */
function getComplexesByMetal(metal) {
  const { CRYSTAL_FIELD_SPLITTING } = require('./data/experimental-constants');
  
  return CRYSTAL_FIELD_SPLITTING.filter(c => c.metal === metal);
}

/**
 * 获取支持的金属离子列表
 */
function getSupportedMetals() {
  return Object.keys(METAL_ION_PARAMETERS).map(ion => ({
    ion,
    ...METAL_ION_PARAMETERS[ion]
  }));
}

/**
 * 获取支持的配体列表
 */
function getSupportedLigands() {
  return Object.keys(LIGAND_FIELD_STRENGTH).map(ligand => ({
    ligand,
    fieldStrength: LIGAND_FIELD_STRENGTH[ligand],
    relative: (LIGAND_FIELD_STRENGTH[ligand] * 100).toFixed(0) + '%'
  })).sort((a, b) => b.fieldStrength - a.fieldStrength);
}

/**
 * 光谱化学序列说明
 */
function getSpectrochemicalSeries() {
  return {
    series: 'I⁻ < Br⁻ < S²⁻ < SCN⁻ < Cl⁻ < NO₃⁻ < F⁻ < OH⁻ < C₂O₄²⁻ < H₂O < NCS⁻ < NH₃ < en < bipy < phen < NO₂⁻ < CN⁻ < CO',
    weakField: ['I⁻', 'Br⁻', 'S²⁻', 'SCN⁻', 'Cl⁻', 'F⁻'],
    mediumField: ['OH⁻', 'H₂O', 'NH₃'],
    strongField: ['en', 'bipy', 'phen', 'CN⁻', 'CO'],
    notes: '从左到右配体场强逐渐增强，强场配体倾向形成低自旋配合物'
  };
}

module.exports = {
  calculateCrystalFieldSplitting,
  generateOrbitalDiagram,
  searchKnownComplexes,
  getComplexesByMetal,
  getSupportedMetals,
  getSupportedLigands,
  getSpectrochemicalSeries,
  LIGAND_FIELD_STRENGTH,
  METAL_ION_PARAMETERS,
  D_ELECTRON_CONFIGURATIONS
};

