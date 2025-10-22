// UTF-8, no BOM
// 电学性质计算工具：电导率、电阻率、介电常数

const METADATA = {
  version: '1.0.0',
  lastUpdated: '2025-10-18',
  sources: {
    fourProbe: 'Van der Pauw method',
    dielectric: 'Electromagnetism textbooks',
    arrhenius: 'Arrhenius conductivity theory'
  }
};

// 真空介电常数
const EPSILON_0 = 8.854187817e-12; // F/m

/**
 * 四探针法电导率计算
 * σ = ln(2) / (π·t) × I/V
 * 
 * @param {number} voltage - 电压(V)
 * @param {number} current - 电流(A 或 mA)
 * @param {number} thickness - 样品厚度(cm 或 mm)
 * @param {object} options - {currentUnit: 'A'|'mA', thicknessUnit: 'cm'|'mm'}
 * @returns {object} 电导率(S/m, S/cm)
 */
function calculateConductivity4Probe(voltage, current, thickness, options = {}) {
  const V = Number(voltage);
  let I = Number(current);
  let t = Number(thickness);

  if (!isFinite(V) || !isFinite(I) || !isFinite(t)) {
    return { error: '请输入有效的数值', errorCode: 'INVALID_INPUT' };
  }

  if (V <= 0 || I <= 0 || t <= 0) {
    return { error: '电压、电流和厚度必须为正数', errorCode: 'INVALID_RANGE' };
  }

  const { currentUnit = 'mA', thicknessUnit = 'cm' } = options;

  // 统一单位
  if (currentUnit === 'mA') I = I / 1000; // 转换为A
  if (thicknessUnit === 'mm') t = t / 10; // 转换为cm

  // σ = ln(2) / (π·t) × I/V  (S/cm)
  const sigma_per_cm = (Math.log(2) / (Math.PI * t)) * (I / V);
  
  // 转换为S/m
  const sigma_per_m = sigma_per_cm * 100;

  // 电阻率
  const rho_cm = 1 / sigma_per_cm; // Ω·cm
  const rho_m = 1 / sigma_per_m;   // Ω·m

  return {
    conductivity: {
      value_SI: parseFloat(sigma_per_m.toFixed(4)),
      value_CGS: parseFloat(sigma_per_cm.toFixed(6)),
      unit_SI: 'S/m',
      unit_CGS: 'S/cm'
    },
    resistivity: {
      value_SI: parseFloat(rho_m.toFixed(4)),
      value_CGS: parseFloat(rho_cm.toFixed(6)),
      unit_SI: 'Ω·m',
      unit_CGS: 'Ω·cm'
    },
    formula: 'σ = ln(2)/(π·t) × I/V',
    input: {
      voltage: `${voltage} V`,
      current: `${current} ${currentUnit}`,
      thickness: `${thickness} ${thicknessUnit}`
    }
  };
}

/**
 * 两探针法电导率计算（块体样品）
 * σ = L / (R·A)
 * 
 * @param {number} resistance - 电阻(Ω)
 * @param {number} length - 样品长度(cm)
 * @param {number} area - 横截面积(cm²)
 * @returns {object} 电导率
 */
function calculateConductivityBulk(resistance, length, area) {
  const R = Number(resistance);
  const L = Number(length);
  const A = Number(area);

  if (!isFinite(R) || !isFinite(L) || !isFinite(A)) {
    return { error: '请输入有效的数值', errorCode: 'INVALID_INPUT' };
  }

  if (R <= 0 || L <= 0 || A <= 0) {
    return { error: '电阻、长度和面积必须为正数', errorCode: 'INVALID_RANGE' };
  }

  // σ = L / (R·A)  (S/cm)
  const sigma_per_cm = L / (R * A);
  const sigma_per_m = sigma_per_cm * 100;

  const rho_cm = 1 / sigma_per_cm;
  const rho_m = 1 / sigma_per_m;

  return {
    conductivity: {
      value_SI: parseFloat(sigma_per_m.toFixed(4)),
      value_CGS: parseFloat(sigma_per_cm.toFixed(6)),
      unit_SI: 'S/m',
      unit_CGS: 'S/cm'
    },
    resistivity: {
      value_SI: parseFloat(rho_m.toFixed(4)),
      value_CGS: parseFloat(rho_cm.toFixed(6)),
      unit_SI: 'Ω·m',
      unit_CGS: 'Ω·cm'
    },
    formula: 'σ = L/(R·A)',
    input: { resistance: `${R} Ω`, length: `${L} cm`, area: `${A} cm²` }
  };
}

/**
 * 薄膜电导率计算（方块电阻法）
 * σ = 1 / (R_s × t)
 * 
 * @param {number} sheetResistance - 方块电阻(Ω/sq)
 * @param {number} thickness - 薄膜厚度(nm)
 * @returns {object} 电导率
 */
function calculateConductivityFilm(sheetResistance, thickness) {
  const Rs = Number(sheetResistance);
  const t = Number(thickness);

  if (!isFinite(Rs) || !isFinite(t)) {
    return { error: '请输入有效的数值', errorCode: 'INVALID_INPUT' };
  }

  if (Rs <= 0 || t <= 0) {
    return { error: '方块电阻和厚度必须为正数', errorCode: 'INVALID_RANGE' };
  }

  // 厚度从nm转换为cm
  const t_cm = t * 1e-7;

  // σ = 1 / (Rs × t)
  const sigma_per_cm = 1 / (Rs * t_cm);
  const sigma_per_m = sigma_per_cm * 100;

  return {
    conductivity: {
      value_SI: parseFloat(sigma_per_m.toFixed(4)),
      value_CGS: parseFloat(sigma_per_cm.toFixed(6)),
      unit_SI: 'S/m',
      unit_CGS: 'S/cm'
    },
    resistivity: {
      value_SI: parseFloat((1/sigma_per_m).toFixed(4)),
      value_CGS: parseFloat((1/sigma_per_cm).toFixed(6)),
      unit_SI: 'Ω·m',
      unit_CGS: 'Ω·cm'
    },
    formula: 'σ = 1/(Rs×t)',
    input: {
      sheetResistance: `${Rs} Ω/sq`,
      thickness: `${thickness} nm (${t_cm.toExponential(2)} cm)`
    }
  };
}

/**
 * 介电常数计算
 * εr = C·d / (ε0·A)
 * 
 * @param {number} capacitance - 电容(pF 或 nF)
 * @param {number} area - 电极面积(cm²)
 * @param {number} thickness - 介质厚度(mm)
 * @param {object} options - {capacitanceUnit: 'pF'|'nF'}
 * @returns {object} 相对介电常数
 */
function calculateDielectricConstant(capacitance, area, thickness, options = {}) {
  let C = Number(capacitance);
  const A = Number(area);
  const d = Number(thickness);

  if (!isFinite(C) || !isFinite(A) || !isFinite(d)) {
    return { error: '请输入有效的数值', errorCode: 'INVALID_INPUT' };
  }

  if (C <= 0 || A <= 0 || d <= 0) {
    return { error: '电容、面积和厚度必须为正数', errorCode: 'INVALID_RANGE' };
  }

  const { capacitanceUnit = 'pF' } = options;

  // 统一单位转换为F
  if (capacitanceUnit === 'pF') C = C * 1e-12;
  if (capacitanceUnit === 'nF') C = C * 1e-9;

  // 面积cm²转m²，厚度mm转m
  const A_m2 = A * 1e-4;
  const d_m = d * 1e-3;

  // εr = C·d / (ε0·A)
  const epsilonR = (C * d_m) / (EPSILON_0 * A_m2);

  // 介电损耗（如果适用，这里简化不计算）
  
  return {
    epsilonR: parseFloat(epsilonR.toFixed(2)),
    capacitance: `${capacitance} ${capacitanceUnit}`,
    area: `${A} cm²`,
    thickness: `${d} mm`,
    formula: 'εr = C·d/(ε0·A)',
    note: 'ε0 = 8.854×10⁻¹² F/m'
  };
}

/**
 * 介电损耗计算
 * tan δ = ε''/ε'
 */
function calculateDielectricLoss(epsilonReal, epsilonImag) {
  const er = Number(epsilonReal);
  const ei = Number(epsilonImag);

  if (!isFinite(er) || !isFinite(ei)) {
    return { error: '请输入有效的数值', errorCode: 'INVALID_INPUT' };
  }

  if (er <= 0) {
    return { error: '实部介电常数必须为正数', errorCode: 'INVALID_RANGE' };
  }

  const tanDelta = ei / er;

  return {
    tanDelta: parseFloat(tanDelta.toFixed(6)),
    epsilonReal: er,
    epsilonImag: ei,
    formula: 'tan δ = ε\'\'/ε\''
  };
}

/**
 * 获取元数据
 */
function getMetadata() {
  return METADATA;
}

module.exports = {
  calculateConductivity4Probe,
  calculateConductivityBulk,
  calculateConductivityFilm,
  calculateDielectricConstant,
  calculateDielectricLoss,
  getMetadata
};

