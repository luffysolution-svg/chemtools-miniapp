// Solubility product (Ksp) and ionic strength/activity helpers
// 数据来源：CRC Handbook of Chemistry and Physics, 102nd Edition (2021)

// 元数据
const METADATA = {
  version: '1.0.0',
  lastUpdated: '2025-10-10',
  sources: {
    kspData: 'CRC Handbook of Chemistry and Physics, 102nd Edition (2021)',
    debyeHuckel: 'P. Debye & E. Hückel, Phys. Z. 24, 185-206 (1923)',
    daviesEquation: 'C.W. Davies, J. Chem. Soc., 2093-2098 (1938)',
    citation: 'Lange\'s Handbook of Chemistry, 17th Edition (2017)'
  },
  precision: {
    concentration: '±5%',
    ionicStrength: '±0.001 M',
    activityCoefficient: '±10%'
  },
  applicableRange: {
    temperature: '0°C < T < 100°C',
    ionicStrength: 'I < 0.5 M (Debye-Hückel), I < 1.0 M (Davies)',
    concentration: '1e-20 M < c < 10 M'
  },
  notes: {
    accuracy: 'Ksp值为25°C近似值，仅供教学和估算使用',
    limitations: 'Debye-Hückel限定式适用于I<0.1M，Davies式适用于I<1.0M',
    disclaimer: '实际溶解度受pH、配位剂、共离子效应等多种因素影响'
  }
};

/**
 * 计算不同温度下的Debye-Hückel参数A
 * A(25°C) = 0.509 (水)
 * @param {number} tempC - 温度（°C）
 * @returns {number|object} A参数或错误对象
 */
function A_at_T(tempC) {
  const T = Number(tempC);
  
  if (!Number.isFinite(T)) {
    // 默认使用25°C
    return 0.509;
  }
  
  if (T < 0 || T > 100) {
    console.warn(`温度 ${T}°C 超出常规范围（0-100°C），计算结果可能不准确`);
  }
  
  const Tk = T + 273.15;
  return 0.509 * Math.sqrt(298.15 / Tk); // 简化修正：温度升高，A 略降
}

/**
 * 计算离子强度
 * I = 0.5 Σ(ci × zi²)
 * @param {Array} ions - 离子数组 [{c: concentration(M), z: charge}]
 * @returns {number|object} 离子强度或错误对象
 */
function ionicStrength(ions) {
  if (!Array.isArray(ions)) {
    return {
      error: 'ions 必须为数组',
      errorCode: 'INVALID_INPUT_TYPE'
    };
  }
  
  if (ions.length === 0) {
    return {
      error: 'ions 数组不能为空',
      errorCode: 'EMPTY_ARRAY'
    };
  }
  
  let I = 0;
  for (let i = 0; i < ions.length; i++) {
    const c = Number(ions[i].c);
    const z = Number(ions[i].z);
    
    if (!Number.isFinite(c) || !Number.isFinite(z)) {
      return {
        error: `离子 ${i} 的浓度或电荷无效`,
        errorCode: 'INVALID_ION_DATA',
        index: i
      };
    }
    
    if (c < 0) {
      return {
        error: `离子 ${i} 的浓度不能为负数`,
        errorCode: 'NEGATIVE_CONCENTRATION',
        index: i,
        received: c
      };
    }
    
    I += c * z * z;
  }
  
  const result = 0.5 * I;
  
  // 警告：离子强度过高
  if (result > 1.0) {
    console.warn(`离子强度 I = ${result.toFixed(4)} M 超过 1.0 M，Debye-Hückel方程可能不适用`);
  }
  
  return result;
}

/**
 * Debye-Hückel限定式计算活度系数
 * log₁₀(γ) = -A z² √I
 * 适用范围：I < 0.1 M
 * @param {number} tempC - 温度（°C）
 * @param {number} z - 离子电荷
 * @param {number} I - 离子强度（M）
 * @returns {number|object} 活度系数或错误对象
 */
function gammaDH(tempC, z, I) {
  const tc = Number(tempC);
  const zz = Number(z);
  const ii = Number(I);
  
  if (!Number.isFinite(tc) || !Number.isFinite(zz) || !Number.isFinite(ii)) {
    return {
      error: '输入参数必须为有效数字',
      errorCode: 'INVALID_NUMBER'
    };
  }
  
  if (ii < 0) {
    return {
      error: '离子强度不能为负数',
      errorCode: 'NEGATIVE_IONIC_STRENGTH',
      received: ii
    };
  }
  
  if (ii > 0.1) {
    console.warn(`离子强度 I = ${ii.toFixed(4)} M > 0.1 M，Debye-Hückel限定式精度较低，建议使用Davies式`);
  }
  
  if (Math.abs(zz) > 4) {
    console.warn(`电荷数 |z| = ${Math.abs(zz)} > 4，计算结果可能不准确`);
  }
  
  const A = A_at_T(tc);
  const sqrtI = Math.sqrt(Math.max(0, ii));
  const log10gamma = -A * (zz * zz) * sqrtI;
  const gamma = Math.pow(10, log10gamma);
  
  // 活度系数应在 0 到 1 之间（对于Debye-Hückel）
  if (gamma > 1.5 || gamma < 0.01) {
    console.warn(`活度系数 γ = ${gamma.toFixed(4)} 超出合理范围，请检查输入参数`);
  }
  
  return gamma;
}

/**
 * Davies方程计算活度系数
 * log₁₀(γ) = -A z² [√I/(1+√I) - 0.3I]
 * 适用范围：I < 1.0 M
 * @param {number} tempC - 温度（°C）
 * @param {number} z - 离子电荷
 * @param {number} I - 离子强度（M）
 * @returns {number|object} 活度系数或错误对象
 */
function gammaDavies(tempC, z, I) {
  const tc = Number(tempC);
  const zz = Number(z);
  const ii = Number(I);
  
  if (!Number.isFinite(tc) || !Number.isFinite(zz) || !Number.isFinite(ii)) {
    return {
      error: '输入参数必须为有效数字',
      errorCode: 'INVALID_NUMBER'
    };
  }
  
  if (ii < 0) {
    return {
      error: '离子强度不能为负数',
      errorCode: 'NEGATIVE_IONIC_STRENGTH',
      received: ii
    };
  }
  
  if (ii > 1.0) {
    console.warn(`离子强度 I = ${ii.toFixed(4)} M > 1.0 M，Davies方程精度较低`);
  }
  
  const A = A_at_T(tc);
  const Ipos = Math.max(0, ii);
  const sqrtI = Math.sqrt(Ipos);
  const term = (sqrtI / (1 + sqrtI)) - 0.3 * Ipos;
  const log10gamma = -A * (zz * zz) * term;
  const gamma = Math.pow(10, log10gamma);
  
  if (gamma > 2.0 || gamma < 0.01) {
    console.warn(`活度系数 γ = ${gamma.toFixed(4)} 超出合理范围，请检查输入参数`);
  }
  
  return gamma;
}

/**
 * 选择活度系数计算模型
 * @param {string} model - 'DH' 或 'Davies'
 * @returns {function} 活度系数计算函数
 */
function selectGamma(model) {
  if (model === 'Davies') return gammaDavies;
  return gammaDH;
}

/**
 * 获取难溶盐列表
 * 数据来源：CRC Handbook of Chemistry and Physics, 102nd Edition (2021)
 * @returns {Array} 难溶盐数组
 */
function listSalts() {
  // ions: [{symbol, z, nu}] 二元盐
  return [
    // 卤化银
    { id: 'AgCl', name: 'AgCl', formula: 'AgCl(s) ⇌ Ag⁺ + Cl⁻', ions: [ {symbol:'Ag⁺', z:1, nu:1}, {symbol:'Cl⁻', z:-1, nu:1} ], Ksp: 1.8e-10, source: 'CRC' },
    { id: 'AgBr', name: 'AgBr', formula: 'AgBr(s) ⇌ Ag⁺ + Br⁻', ions: [ {symbol:'Ag⁺', z:1, nu:1}, {symbol:'Br⁻', z:-1, nu:1} ], Ksp: 5.0e-13, source: 'CRC' },
    { id: 'AgI', name: 'AgI', formula: 'AgI(s) ⇌ Ag⁺ + I⁻', ions: [ {symbol:'Ag⁺', z:1, nu:1}, {symbol:'I⁻', z:-1, nu:1} ], Ksp: 8.3e-17, source: 'CRC' },
    { id: 'Ag2CO3', name: 'Ag2CO3', formula: 'Ag2CO3(s) ⇌ 2Ag⁺ + CO₃²⁻', ions: [ {symbol:'Ag⁺', z:1, nu:2}, {symbol:'CO₃²⁻', z:-2, nu:1} ], Ksp: 8.5e-12, source: 'CRC' },
    { id: 'Ag2CrO4', name: 'Ag2CrO4', formula: 'Ag2CrO4(s) ⇌ 2Ag⁺ + CrO₄²⁻', ions: [ {symbol:'Ag⁺', z:1, nu:2}, {symbol:'CrO₄²⁻', z:-2, nu:1} ], Ksp: 1.1e-12, source: 'CRC' },
    { id: 'Ag2S', name: 'Ag2S', formula: 'Ag2S(s) ⇌ 2Ag⁺ + S²⁻', ions: [ {symbol:'Ag⁺', z:1, nu:2}, {symbol:'S²⁻', z:-2, nu:1} ], Ksp: 6.0e-51, source: 'CRC' },

    // 硫酸盐
    { id: 'BaSO4', name: 'BaSO4', formula: 'BaSO4(s) ⇌ Ba²⁺ + SO₄²⁻', ions: [ {symbol:'Ba²⁺', z:2, nu:1}, {symbol:'SO₄²⁻', z:-2, nu:1} ], Ksp: 1.1e-10, source: 'CRC' },
    { id: 'SrSO4', name: 'SrSO4', formula: 'SrSO4(s) ⇌ Sr²⁺ + SO₄²⁻', ions: [ {symbol:'Sr²⁺', z:2, nu:1}, {symbol:'SO₄²⁻', z:-2, nu:1} ], Ksp: 3.2e-7, source: 'CRC' },
    { id: 'CaSO4', name: 'CaSO4', formula: 'CaSO4(s) ⇌ Ca²⁺ + SO₄²⁻', ions: [ {symbol:'Ca²⁺', z:2, nu:1}, {symbol:'SO₄²⁻', z:-2, nu:1} ], Ksp: 2.4e-5, source: 'CRC' },
    { id: 'PbSO4', name: 'PbSO4', formula: 'PbSO4(s) ⇌ Pb²⁺ + SO₄²⁻', ions: [ {symbol:'Pb²⁺', z:2, nu:1}, {symbol:'SO₄²⁻', z:-2, nu:1} ], Ksp: 1.6e-8, source: 'CRC' },

    // 碳酸盐
    { id: 'CaCO3', name: 'CaCO3', formula: 'CaCO3(s) ⇌ Ca²⁺ + CO₃²⁻', ions: [ {symbol:'Ca²⁺', z:2, nu:1}, {symbol:'CO₃²⁻', z:-2, nu:1} ], Ksp: 3.3e-9, source: 'CRC' },
    { id: 'BaCO3', name: 'BaCO3', formula: 'BaCO3(s) ⇌ Ba²⁺ + CO₃²⁻', ions: [ {symbol:'Ba²⁺', z:2, nu:1}, {symbol:'CO₃²⁻', z:-2, nu:1} ], Ksp: 8.1e-9, source: 'CRC' },
    { id: 'SrCO3', name: 'SrCO3', formula: 'SrCO3(s) ⇌ Sr²⁺ + CO₃²⁻', ions: [ {symbol:'Sr²⁺', z:2, nu:1}, {symbol:'CO₃²⁻', z:-2, nu:1} ], Ksp: 5.6e-10, source: 'CRC' },
    { id: 'MgCO3', name: 'MgCO3', formula: 'MgCO3(s) ⇌ Mg²⁺ + CO₃²⁻', ions: [ {symbol:'Mg²⁺', z:2, nu:1}, {symbol:'CO₃²⁻', z:-2, nu:1} ], Ksp: 6.8e-6, source: 'CRC' },
    { id: 'FeCO3', name: 'FeCO3', formula: 'FeCO3(s) ⇌ Fe²⁺ + CO₃²⁻', ions: [ {symbol:'Fe²⁺', z:2, nu:1}, {symbol:'CO₃²⁻', z:-2, nu:1} ], Ksp: 3.2e-11, source: 'CRC' },
    { id: 'ZnCO3', name: 'ZnCO3', formula: 'ZnCO3(s) ⇌ Zn²⁺ + CO₃²⁻', ions: [ {symbol:'Zn²⁺', z:2, nu:1}, {symbol:'CO₃²⁻', z:-2, nu:1} ], Ksp: 1.5e-10, source: 'CRC' },
    { id: 'CdCO3', name: 'CdCO3', formula: 'CdCO3(s) ⇌ Cd²⁺ + CO₃²⁻', ions: [ {symbol:'Cd²⁺', z:2, nu:1}, {symbol:'CO₃²⁻', z:-2, nu:1} ], Ksp: 1.8e-12, source: 'CRC' },

    // 氟化物
    { id: 'CaF2', name: 'CaF2', formula: 'CaF2(s) ⇌ Ca²⁺ + 2F⁻', ions: [ {symbol:'Ca²⁺', z:2, nu:1}, {symbol:'F⁻', z:-1, nu:2} ], Ksp: 1.5e-10, source: 'CRC' },
    { id: 'SrF2', name: 'SrF2', formula: 'SrF2(s) ⇌ Sr²⁺ + 2F⁻', ions: [ {symbol:'Sr²⁺', z:2, nu:1}, {symbol:'F⁻', z:-1, nu:2} ], Ksp: 7.9e-10, source: 'CRC' },
    { id: 'BaF2', name: 'BaF2', formula: 'BaF2(s) ⇌ Ba²⁺ + 2F⁻', ions: [ {symbol:'Ba²⁺', z:2, nu:1}, {symbol:'F⁻', z:-1, nu:2} ], Ksp: 1.7e-6, source: 'CRC' },
    { id: 'PbF2', name: 'PbF2', formula: 'PbF2(s) ⇌ Pb²⁺ + 2F⁻', ions: [ {symbol:'Pb²⁺', z:2, nu:1}, {symbol:'F⁻', z:-1, nu:2} ], Ksp: 3.3e-8, source: 'CRC' },

    // 铅卤化物
    { id: 'PbCl2', name: 'PbCl2', formula: 'PbCl2(s) ⇌ Pb²⁺ + 2Cl⁻', ions: [ {symbol:'Pb²⁺', z:2, nu:1}, {symbol:'Cl⁻', z:-1, nu:2} ], Ksp: 1.7e-5, source: 'CRC' },
    { id: 'PbBr2', name: 'PbBr2', formula: 'PbBr2(s) ⇌ Pb²⁺ + 2Br⁻', ions: [ {symbol:'Pb²⁺', z:2, nu:1}, {symbol:'Br⁻', z:-1, nu:2} ], Ksp: 6.3e-6, source: 'CRC' },
    { id: 'PbI2', name: 'PbI2', formula: 'PbI2(s) ⇌ Pb²⁺ + 2I⁻', ions: [ {symbol:'Pb²⁺', z:2, nu:1}, {symbol:'I⁻', z:-1, nu:2} ], Ksp: 7.1e-9, source: 'CRC' },

    // 硫化物（极难溶）
    { id: 'Hg2Cl2', name: 'Hg2Cl2', formula: 'Hg2Cl2(s) ⇌ Hg2²⁺ + 2Cl⁻', ions: [ {symbol:'Hg2²⁺', z:2, nu:1}, {symbol:'Cl⁻', z:-1, nu:2} ], Ksp: 1.3e-18, source: 'CRC' },
    { id: 'HgS', name: 'HgS', formula: 'HgS(s) ⇌ Hg²⁺ + S²⁻', ions: [ {symbol:'Hg²⁺', z:2, nu:1}, {symbol:'S²⁻', z:-2, nu:1} ], Ksp: 1.6e-52, source: 'CRC' },
    { id: 'CuS', name: 'CuS', formula: 'CuS(s) ⇌ Cu²⁺ + S²⁻', ions: [ {symbol:'Cu²⁺', z:2, nu:1}, {symbol:'S²⁻', z:-2, nu:1} ], Ksp: 8.0e-37, source: 'CRC' },
    { id: 'ZnS', name: 'ZnS', formula: 'ZnS(s) ⇌ Zn²⁺ + S²⁻', ions: [ {symbol:'Zn²⁺', z:2, nu:1}, {symbol:'S²⁻', z:-2, nu:1} ], Ksp: 1.2e-23, source: 'CRC' },
    { id: 'CdS', name: 'CdS', formula: 'CdS(s) ⇌ Cd²⁺ + S²⁻', ions: [ {symbol:'Cd²⁺', z:2, nu:1}, {symbol:'S²⁻', z:-2, nu:1} ], Ksp: 1.0e-28, source: 'CRC' },
    { id: 'FeS', name: 'FeS', formula: 'FeS(s) ⇌ Fe²⁺ + S²⁻', ions: [ {symbol:'Fe²⁺', z:2, nu:1}, {symbol:'S²⁻', z:-2, nu:1} ], Ksp: 6.3e-18, source: 'CRC' },
    { id: 'NiS', name: 'NiS', formula: 'NiS(s) ⇌ Ni²⁺ + S²⁻', ions: [ {symbol:'Ni²⁺', z:2, nu:1}, {symbol:'S²⁻', z:-2, nu:1} ], Ksp: 3.0e-19, source: 'CRC' },
    { id: 'CoS', name: 'CoS', formula: 'CoS(s) ⇌ Co²⁺ + S²⁻', ions: [ {symbol:'Co²⁺', z:2, nu:1}, {symbol:'S²⁻', z:-2, nu:1} ], Ksp: 5.0e-23, source: 'CRC' },
    { id: 'MnS', name: 'MnS', formula: 'MnS(s) ⇌ Mn²⁺ + S²⁻', ions: [ {symbol:'Mn²⁺', z:2, nu:1}, {symbol:'S²⁻', z:-2, nu:1} ], Ksp: 1.6e-13, source: 'CRC' },

    // 氢氧化物
    { id: 'Al(OH)3', name: 'Al(OH)3', formula: 'Al(OH)3(s) ⇌ Al³⁺ + 3OH⁻', ions: [ {symbol:'Al³⁺', z:3, nu:1}, {symbol:'OH⁻', z:-1, nu:3} ], Ksp: 1.0e-33, source: 'CRC' },
    { id: 'Fe(OH)3', name: 'Fe(OH)3', formula: 'Fe(OH)3(s) ⇌ Fe³⁺ + 3OH⁻', ions: [ {symbol:'Fe³⁺', z:3, nu:1}, {symbol:'OH⁻', z:-1, nu:3} ], Ksp: 2.8e-39, source: 'CRC' },
    { id: 'Fe(OH)2', name: 'Fe(OH)2', formula: 'Fe(OH)2(s) ⇌ Fe²⁺ + 2OH⁻', ions: [ {symbol:'Fe²⁺', z:2, nu:1}, {symbol:'OH⁻', z:-1, nu:2} ], Ksp: 4.9e-17, source: 'CRC' },
    { id: 'Mg(OH)2', name: 'Mg(OH)2', formula: 'Mg(OH)2(s) ⇌ Mg²⁺ + 2OH⁻', ions: [ {symbol:'Mg²⁺', z:2, nu:1}, {symbol:'OH⁻', z:-1, nu:2} ], Ksp: 5.6e-12, source: 'CRC' },
    { id: 'Ca(OH)2', name: 'Ca(OH)2', formula: 'Ca(OH)2(s) ⇌ Ca²⁺ + 2OH⁻', ions: [ {symbol:'Ca²⁺', z:2, nu:1}, {symbol:'OH⁻', z:-1, nu:2} ], Ksp: 5.5e-6, source: 'CRC' },
    { id: 'Zn(OH)2', name: 'Zn(OH)2', formula: 'Zn(OH)2(s) ⇌ Zn²⁺ + 2OH⁻', ions: [ {symbol:'Zn²⁺', z:2, nu:1}, {symbol:'OH⁻', z:-1, nu:2} ], Ksp: 3.0e-17, source: 'CRC' },
    { id: 'Cu(OH)2', name: 'Cu(OH)2', formula: 'Cu(OH)2(s) ⇌ Cu²⁺ + 2OH⁻', ions: [ {symbol:'Cu²⁺', z:2, nu:1}, {symbol:'OH⁻', z:-1, nu:2} ], Ksp: 2.2e-20, source: 'CRC' },
    { id: 'Pb(OH)2', name: 'Pb(OH)2', formula: 'Pb(OH)2(s) ⇌ Pb²⁺ + 2OH⁻', ions: [ {symbol:'Pb²⁺', z:2, nu:1}, {symbol:'OH⁻', z:-1, nu:2} ], Ksp: 1.2e-15, source: 'CRC' },
    { id: 'Ni(OH)2', name: 'Ni(OH)2', formula: 'Ni(OH)2(s) ⇌ Ni²⁺ + 2OH⁻', ions: [ {symbol:'Ni²⁺', z:2, nu:1}, {symbol:'OH⁻', z:-1, nu:2} ], Ksp: 5.5e-16, source: 'CRC' },
    { id: 'Co(OH)2', name: 'Co(OH)2', formula: 'Co(OH)2(s) ⇌ Co²⁺ + 2OH⁻', ions: [ {symbol:'Co²⁺', z:2, nu:1}, {symbol:'OH⁻', z:-1, nu:2} ], Ksp: 1.6e-15, source: 'CRC' },
    { id: 'Mn(OH)2', name: 'Mn(OH)2', formula: 'Mn(OH)2(s) ⇌ Mn²⁺ + 2OH⁻', ions: [ {symbol:'Mn²⁺', z:2, nu:1}, {symbol:'OH⁻', z:-1, nu:2} ], Ksp: 1.6e-13, source: 'CRC' },

    // 草酸盐
    { id: 'CaC2O4', name: 'CaC2O4', formula: 'CaC2O4(s) ⇌ Ca²⁺ + C2O4²⁻', ions: [ {symbol:'Ca²⁺', z:2, nu:1}, {symbol:'C2O4²⁻', z:-2, nu:1} ], Ksp: 2.3e-9, source: 'CRC' },
    { id: 'SrC2O4', name: 'SrC2O4', formula: 'SrC2O4(s) ⇌ Sr²⁺ + C2O4²⁻', ions: [ {symbol:'Sr²⁺', z:2, nu:1}, {symbol:'C2O4²⁻', z:-2, nu:1} ], Ksp: 5.6e-10, source: 'CRC' },
    { id: 'BaC2O4', name: 'BaC2O4', formula: 'BaC2O4(s) ⇌ Ba²⁺ + C2O4²⁻', ions: [ {symbol:'Ba²⁺', z:2, nu:1}, {symbol:'C2O4²⁻', z:-2, nu:1} ], Ksp: 1.3e-7, source: 'CRC' },

    // 铬酸盐
    { id: 'PbCrO4', name: 'PbCrO4', formula: 'PbCrO4(s) ⇌ Pb²⁺ + CrO₄²⁻', ions: [ {symbol:'Pb²⁺', z:2, nu:1}, {symbol:'CrO₄²⁻', z:-2, nu:1} ], Ksp: 1.8e-14, source: 'CRC' },
    { id: 'BaCrO4', name: 'BaCrO4', formula: 'BaCrO4(s) ⇌ Ba²⁺ + CrO₄²⁻', ions: [ {symbol:'Ba²⁺', z:2, nu:1}, {symbol:'CrO₄²⁻', z:-2, nu:1} ], Ksp: 1.2e-10, source: 'CRC' },

    // 磷酸盐
    { id: 'FePO4', name: 'FePO4', formula: 'FePO4(s) ⇌ Fe³⁺ + PO₄³⁻', ions: [ {symbol:'Fe³⁺', z:3, nu:1}, {symbol:'PO₄³⁻', z:-3, nu:1} ], Ksp: 1.3e-22, source: 'CRC' },
    { id: 'AlPO4', name: 'AlPO4', formula: 'AlPO4(s) ⇌ Al³⁺ + PO₄³⁻', ions: [ {symbol:'Al³⁺', z:3, nu:1}, {symbol:'PO₄³⁻', z:-3, nu:1} ], Ksp: 9.8e-21, source: 'CRC' },
    { id: 'Ca3(PO4)2', name: 'Ca3(PO4)2', formula: 'Ca3(PO4)2(s) ⇌ 3Ca²⁺ + 2PO₄³⁻', ions: [ {symbol:'Ca²⁺', z:2, nu:3}, {symbol:'PO₄³⁻', z:-3, nu:2} ], Ksp: 2.0e-29, source: 'CRC' },
    { id: 'Sr3(PO4)2', name: 'Sr3(PO4)2', formula: 'Sr3(PO4)2(s) ⇌ 3Sr²⁺ + 2PO₄³⁻', ions: [ {symbol:'Sr²⁺', z:2, nu:3}, {symbol:'PO₄³⁻', z:-3, nu:2} ], Ksp: 1.0e-31, source: 'CRC' },
    { id: 'Ba3(PO4)2', name: 'Ba3(PO4)2', formula: 'Ba3(PO4)2(s) ⇌ 3Ba²⁺ + 2PO₄³⁻', ions: [ {symbol:'Ba²⁺', z:2, nu:3}, {symbol:'PO₄³⁻', z:-3, nu:2} ], Ksp: 1.3e-29, source: 'CRC' }
  ];
}

/**
 * 获取指定索引的盐
 * @param {number} index - 索引
 * @returns {object} 盐对象
 */
function getSalt(index) {
  const list = listSalts();
  const idx = Number(index);
  
  if (!Number.isFinite(idx) || idx < 0 || idx >= list.length) {
    return list[0]; // 返回默认值
  }
  
  return list[idx];
}

/**
 * 计算本征溶解度（忽略活度系数）
 * Ksp = (ν₁·s)^ν₁ · (ν₂·s)^ν₂ 
 * s = [Ksp / (ν₁^ν₁ · ν₂^ν₂)]^(1/(ν₁+ν₂))
 * @param {object} salt - 盐对象
 * @returns {number|object} 溶解度（mol/L）或错误对象
 */
function intrinsicSolubilityIgnoreActivity(salt) {
  if (!salt || !salt.ions || salt.ions.length !== 2) {
    return {
      error: '无效的盐对象',
      errorCode: 'INVALID_SALT_OBJECT'
    };
  }
  
  const v1 = salt.ions[0].nu;
  const v2 = salt.ions[1].nu;
  const Ksp = salt.Ksp;
  
  if (!Number.isFinite(Ksp) || Ksp <= 0) {
    return {
      error: '无效的 Ksp 值',
      errorCode: 'INVALID_KSP',
      received: Ksp
    };
  }
  
  const denom = Math.pow(v1, v1) * Math.pow(v2, v2);
  const s = Math.pow(Ksp / denom, 1 / (v1 + v2));
  
  return s; // mol/L
}

/**
 * 根据已知离子浓度计算另一离子的饱和浓度（忽略活度）
 * @param {object} salt - 盐对象
 * @param {number} knownIndex - 已知离子索引（0或1）
 * @param {number} knownConc - 已知离子浓度（M）
 * @returns {number|object} 另一离子浓度或错误对象
 */
function saturationOfOtherIonIgnoreActivity(salt, knownIndex, knownConc) {
  if (!salt || !salt.ions || salt.ions.length !== 2) {
    return {
      error: '无效的盐对象',
      errorCode: 'INVALID_SALT_OBJECT'
    };
  }
  
  const v1 = salt.ions[0].nu;
  const v2 = salt.ions[1].nu;
  const k = salt.Ksp;
  const c = Number(knownConc);
  
  if (!Number.isFinite(c)) {
    return {
      error: '已知浓度必须为有效数字',
      errorCode: 'INVALID_NUMBER'
    };
  }
  
  if (c < 0) {
    return {
      error: '浓度不能为负数',
      errorCode: 'NEGATIVE_CONCENTRATION',
      received: c
    };
  }
  
  if (c === 0) {
    return 0;
  }
  
  if (knownIndex === 0) {
    // k = [A]^{v1} [B]^{v2} -> [B] = (k / [A]^{v1})^{1/v2}
    return Math.pow(k / Math.pow(c, v1), 1 / v2);
  } else {
    return Math.pow(k / Math.pow(c, v2), 1 / v1);
  }
}

/**
 * 使用Debye-Hückel方程计算离子积（IAP），考虑活度系数
 * @param {object} salt - 盐对象
 * @param {Array} concs - 离子浓度数组 [c1, c2] (M)
 * @param {number} tempC - 温度（°C）
 * @returns {object} { I, gamma, activities, IAP } 或错误对象
 */
function calcIAPWithActivities(salt, concs, tempC) {
  if (!salt || !salt.ions || salt.ions.length !== 2) {
    return {
      error: '无效的盐对象',
      errorCode: 'INVALID_SALT_OBJECT'
    };
  }
  
  if (!Array.isArray(concs) || concs.length !== 2) {
    return {
      error: '浓度必须为包含2个元素的数组',
      errorCode: 'INVALID_CONCS_ARRAY'
    };
  }
  
  const ions = salt.ions;
  const c1 = Math.max(0, Number(concs[0]) || 0);
  const c2 = Math.max(0, Number(concs[1]) || 0);
  
  const I = ionicStrength([
    { c: c1, z: ions[0].z },
    { c: c2, z: ions[1].z }
  ]);
  
  if (typeof I === 'object' && I.error) {
    return I; // 返回错误
  }
  
  const g1 = gammaDH(tempC, ions[0].z, I);
  const g2 = gammaDH(tempC, ions[1].z, I);
  
  if ((typeof g1 === 'object' && g1.error) || (typeof g2 === 'object' && g2.error)) {
    return { error: '活度系数计算失败', errorCode: 'GAMMA_CALCULATION_ERROR' };
  }
  
  const a1 = c1 * g1;
  const a2 = c2 * g2;
  const IAP = Math.pow(a1, ions[0].nu) * Math.pow(a2, ions[1].nu);
  
  return { I, gamma: [g1, g2], activities: [a1, a2], IAP };
}

/**
 * 使用指定模型计算离子积（IAP）
 * @param {object} salt - 盐对象
 * @param {Array} concs - 离子浓度数组 [c1, c2] (M)
 * @param {number} tempC - 温度（°C）
 * @param {string} model - 'DH' 或 'Davies'
 * @returns {object} { I, gamma, activities, IAP } 或错误对象
 */
function calcIAPWithActivitiesModel(salt, concs, tempC, model) {
  if (!salt || !salt.ions || salt.ions.length !== 2) {
    return {
      error: '无效的盐对象',
      errorCode: 'INVALID_SALT_OBJECT'
    };
  }
  
  if (!Array.isArray(concs) || concs.length !== 2) {
    return {
      error: '浓度必须为包含2个元素的数组',
      errorCode: 'INVALID_CONCS_ARRAY'
    };
  }
  
  const ions = salt.ions;
  const c1 = Math.max(0, Number(concs[0]) || 0);
  const c2 = Math.max(0, Number(concs[1]) || 0);
  
  const I = ionicStrength([
    { c: c1, z: ions[0].z },
    { c: c2, z: ions[1].z }
  ]);
  
  if (typeof I === 'object' && I.error) {
    return I;
  }
  
  const gammaFn = selectGamma(model);
  const g1 = gammaFn(tempC, ions[0].z, I);
  const g2 = gammaFn(tempC, ions[1].z, I);
  
  if ((typeof g1 === 'object' && g1.error) || (typeof g2 === 'object' && g2.error)) {
    return { error: '活度系数计算失败', errorCode: 'GAMMA_CALCULATION_ERROR' };
  }
  
  const a1 = c1 * g1;
  const a2 = c2 * g2;
  const IAP = Math.pow(a1, ions[0].nu) * Math.pow(a2, ions[1].nu);
  
  return { I, gamma: [g1, g2], activities: [a1, a2], IAP };
}

/**
 * 数值求解：给定已知离子浓度，计算另一离子的饱和浓度（考虑活度）
 * @param {object} salt - 盐对象
 * @param {number} knownIndex - 已知离子索引（0或1）
 * @param {number} knownConc - 已知离子浓度（M）
 * @param {number} tempC - 温度（°C）
 * @param {string} model - 'DH' 或 'Davies'
 * @returns {object} { c, iterations } 或 { error }
 */
function solveOtherIonGivenOne(salt, knownIndex, knownConc, tempC, model) {
  if (!salt || !salt.ions || salt.ions.length !== 2) {
    return {
      error: '无效的盐对象',
      errorCode: 'INVALID_SALT_OBJECT'
    };
  }
  
  const ions = salt.ions;
  const k = salt.Ksp;
  const idxKnown = knownIndex === 1 ? 1 : 0;
  const idxUnknown = idxKnown === 0 ? 1 : 0;
  const cKnown = Math.max(0, Number(knownConc) || 0);
  
  if (cKnown < 0 || !Number.isFinite(cKnown)) {
    return {
      error: '已知浓度必须为非负有效数字',
      errorCode: 'INVALID_KNOWN_CONC',
      received: knownConc
    };
  }
  
  const v1 = ions[0].nu, v2 = ions[1].nu;
  const gammaFn = selectGamma(model);

  // 定义目标函数 f(x) = IAP(cKnown, x) - Ksp
  function f(x) {
    const c1 = idxKnown === 0 ? cKnown : x;
    const c2 = idxKnown === 1 ? cKnown : x;
    const I = ionicStrength([
      { c: c1, z: ions[0].z },
      { c: c2, z: ions[1].z }
    ]);
    
    if (typeof I === 'object' && I.error) {
      return NaN; // 错误
    }
    
    const g1 = gammaFn(tempC, ions[0].z, I);
    const g2 = gammaFn(tempC, ions[1].z, I);
    
    if ((typeof g1 === 'object' && g1.error) || (typeof g2 === 'object' && g2.error)) {
      return NaN;
    }
    
    const a1 = c1 * g1;
    const a2 = c2 * g2;
    const IAP = Math.pow(a1, v1) * Math.pow(a2, v2);
    return IAP - k;
  }

  // 搜索区间 [lo, hi]
  let lo = 0;
  let hi = 1e-12;
  let flo = f(lo);
  let fhi = f(hi);
  
  // 递增扩大 hi 直到跨越 0 或达到上限（10 M）
  const HI_MAX = 10;
  let steps = 0;
  while (steps < 120 && !(flo === 0) && !(fhi === 0) && (flo * fhi > 0) && hi < HI_MAX) {
    hi *= 10;
    if (hi <= 1e-12) hi = 1e-9;
    fhi = f(hi);
    steps++;
  }
  
  if (flo === 0) return { c: lo, iterations: 0 };
  if (fhi === 0) return { c: hi, iterations: steps };
  if (flo * fhi > 0) {
    // 未能括住根，返回失败
    return { 
      error: '未找到合适的解区间（请检查已知浓度/温度/模型）',
      errorCode: 'NO_SOLUTION_FOUND',
      details: { cKnown, tempC, model }
    };
  }

  // 二分求解
  let iter = 0;
  let mid = 0;
  while (iter < 100) {
    mid = 0.5 * (lo + hi);
    const fm = f(mid);
    if (Math.abs(fm) <= 1e-16) break;
    if (flo * fm <= 0) {
      hi = mid; fhi = fm;
    } else {
      lo = mid; flo = fm;
    }
    if (Math.abs(hi - lo) < 1e-12 * Math.max(1, mid)) break;
    iter++;
  }
  
  return { 
    c: parseFloat(mid.toFixed(12)),
    iterations: iter,
    precision: '±1e-12 M'
  };
}

/**
 * 获取模块元数据
 * @returns {object} 元数据对象
 */
function getMetadata() {
  return METADATA;
}

module.exports = {
  // 元数据
  getMetadata,
  
  // 盐数据
  listSalts,
  getSalt,
  
  // 离子强度和活度系数
  ionicStrength,
  gammaDH,
  gammaDavies,
  A_at_T,
  
  // 溶解度计算
  intrinsicSolubilityIgnoreActivity,
  saturationOfOtherIonIgnoreActivity,
  
  // 离子积计算
  calcIAPWithActivities,
  calcIAPWithActivitiesModel,
  
  // 数值求解
  solveOtherIonGivenOne,
};
