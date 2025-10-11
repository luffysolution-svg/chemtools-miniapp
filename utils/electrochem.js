// UTF-8, no BOM
// 电极电位换算与 Nernst 计算（离线）
// 数据来源：IUPAC推荐值

// 物理常数（CODATA 2018推荐值）
const R = 8.314462618; // J·mol⁻¹·K⁻¹, 气体常数
const F = 96485.33212; // C·mol⁻¹, 法拉第常数

// 元数据
const METADATA = {
  version: '1.0.0',
  lastUpdated: '2025-10-10',
  sources: {
    constants: 'CODATA 2018推荐值',
    referenceElectrodes: 'IUPAC Technical Report, Pure Appl. Chem. 79, 293 (2007)',
    nernstEquation: 'Nernst Equation: E = E° - (RT/nF) ln(Q)',
    citation: 'W. Nernst, Z. Phys. Chem. 4, 129 (1889)'
  },
  precision: {
    potential: '±0.001 V',
    temperature: '±0.1 K',
    pH: '±0.01'
  },
  applicableRange: {
    temperature: '-50°C < T < 200°C',
    pH: '0 < pH < 14',
    potential: '-5 V < E < 5 V',
    reactionQuotient: 'Q > 0',
    electronNumber: '1 ≤ n ≤ 10'
  }
};

/**
 * 将摄氏温度转换为开尔文温度
 * @param {number} tC - 摄氏温度
 * @returns {number|object} 开尔文温度或错误对象
 */
function toKelvin(tC) {
  const v = Number(tC);
  
  if (!Number.isFinite(v)) {
    return { 
      error: '温度必须为有效数字',
      errorCode: 'INVALID_NUMBER',
      defaultValue: 298.15
    };
  }
  
  // 温度范围检查
  if (v < -273.15) {
    return {
      error: '温度不能低于绝对零度',
      errorCode: 'BELOW_ABSOLUTE_ZERO',
      received: v
    };
  }
  
  if (v < -50 || v > 200) {
    // 警告但不阻止计算
    const TK = v + 273.15;
    console.warn(`温度 ${v}°C 超出常规范围（-50°C 到 200°C），计算结果可能不准确`);
    return TK;
  }
  
  return v + 273.15;
}

/**
 * 计算Nernst方程的斜率（每十倍浓度变化的电位变化）
 * Slope = 2.303 * RT / (nF)
 * @param {number} TK - 开尔文温度
 * @param {number} n - 转移电子数
 * @returns {number|object} 斜率（V）或错误对象
 */
function slopePerDecade(TK, n) {
  const tk = Number(TK);
  const nn = Number(n);
  
  // 验证温度
  if (!Number.isFinite(tk) || tk <= 0) {
    return {
      error: '温度必须为正数（开尔文）',
      errorCode: 'INVALID_TEMPERATURE'
    };
  }
  
  // 验证电子数
  if (!Number.isFinite(nn) || nn < 1 || nn > 10) {
    return {
      error: '转移电子数应在 1 到 10 之间',
      errorCode: 'INVALID_ELECTRON_NUMBER',
      validRange: '1 ≤ n ≤ 10',
      received: nn
    };
  }
  
  return (2.303 * R * tk) / (nn * F);
}

/**
 * 计算pH对电位的影响（每单位pH的电位变化）
 * Slope = 2.303 * RT / F = 0.05916 V (at 25°C)
 * @param {number} TK - 开尔文温度
 * @returns {number|object} 斜率（V/pH）或错误对象
 */
function slopePerPH(TK) {
  const tk = Number(TK);
  
  if (!Number.isFinite(tk) || tk <= 0) {
    return {
      error: '温度必须为正数（开尔文）',
      errorCode: 'INVALID_TEMPERATURE'
    };
  }
  
  return (2.303 * R * tk) / F;
}

// 常见参比电极相对 NHE 的电位差（25 ℃，单位：V）
// 来源：IUPAC Technical Report, Pure Appl. Chem. 79, 293 (2007)
const referenceList = [
  { 
    id: 'AgAgCl_sat', 
    name: 'Ag/AgCl (饱和 KCl)', 
    deltaNHE25: 0.197,
    description: '最常用的非水系参比电极',
    uncertainty: '±0.002 V'
  },
  { 
    id: 'AgAgCl_3M',  
    name: 'Ag/AgCl (3 M KCl)', 
    deltaNHE25: 0.210,
    description: '3 M KCl溶液体系',
    uncertainty: '±0.002 V'
  },
  { 
    id: 'SCE',        
    name: 'SCE（饱和甘汞）',     
    deltaNHE25: 0.241,
    description: '饱和甘汞电极',
    uncertainty: '±0.002 V'
  },
  { 
    id: 'NHE',        
    name: 'NHE（SHE）',         
    deltaNHE25: 0.000,
    description: '标准氢电极（定义为0 V）',
    uncertainty: '定义值'
  },
  { 
    id: 'RHE',        
    name: 'RHE（pH 依赖）',     
    deltaNHE25: null,
    description: '可逆氢电极，电位随pH变化',
    uncertainty: '依赖于pH测量精度'
  }
];

function listReferenceNames() {
  const arr = [];
  for (let i = 0; i < referenceList.length; i += 1) arr.push(referenceList[i].name);
  return arr;
}

function refIdByIndex(index) {
  const i = Number(index) || 0;
  return referenceList[i] ? referenceList[i].id : referenceList[0].id;
}

function deltaToNHE(refId, T_C, pH) {
  const TK = toKelvin(T_C);
  const ph = Number(pH) || 0;
  // 统一采用 E_vs_NHE = E_vs_ref + delta
  if (refId === 'RHE') {
    return slopePerPH(TK) * ph; // 添加 pH 依赖，25℃约 +0.05916·pH
  }
  // 其余参比采用 25 ℃ 代表值
  for (let i = 0; i < referenceList.length; i += 1) {
    if (referenceList[i].id === refId) return referenceList[i].deltaNHE25 || 0;
  }
  return 0;
}

/**
 * 将电位从参比电极转换为相对于NHE的电位
 * @param {number} E_vs_ref - 相对于参比电极的电位（V）
 * @param {string} refId - 参比电极ID
 * @param {number} T_C - 温度（°C）
 * @param {number} pH - pH值（仅用于RHE）
 * @returns {number|object} 相对于NHE的电位或错误对象
 */
function convertVsNHE(E_vs_ref, refId, T_C, pH) {
  const e = Number(E_vs_ref);
  const tc = Number(T_C);
  const ph = Number(pH);
  
  // 验证电位
  if (!Number.isFinite(e)) {
    return {
      error: '电位必须为有效数字',
      errorCode: 'INVALID_NUMBER',
      parameter: 'E_vs_ref'
    };
  }
  
  if (e < -5 || e > 5) {
    return {
      error: '电位超出常规范围',
      errorCode: 'OUT_OF_RANGE',
      validRange: '-5 V < E < 5 V',
      received: e,
      warning: '极端电位值可能导致水分解或其他副反应'
    };
  }
  
  // 验证参比电极ID
  const validRefIds = referenceList.map(ref => ref.id);
  if (!validRefIds.includes(refId)) {
    return {
      error: `无效的参比电极ID: ${refId}`,
      errorCode: 'INVALID_REFERENCE_ID',
      validIds: validRefIds
    };
  }
  
  // 验证温度
  if (!Number.isFinite(tc)) {
    return {
      error: '温度必须为有效数字',
      errorCode: 'INVALID_NUMBER',
      parameter: 'T_C'
    };
  }
  
  // 如果是RHE，验证pH
  if (refId === 'RHE') {
    if (!Number.isFinite(ph) || ph < 0 || ph > 14) {
      return {
        error: 'pH值应在 0 到 14 之间',
        errorCode: 'INVALID_PH',
        validRange: '0 < pH < 14',
        received: ph
      };
    }
  }
  
  const delta = deltaToNHE(refId, tc, ph);
  
  return {
    E_vs_NHE: parseFloat((e + delta).toFixed(4)),
    unit: 'V',
    precision: '±0.001 V',
    conditions: [
      `T = ${tc}°C`,
      `参比电极: ${referenceList.find(ref => ref.id === refId)?.name || refId}`,
      refId === 'RHE' ? `pH = ${ph}` : null
    ].filter(Boolean),
    formula: 'E(vs NHE) = E(vs Ref) + ΔE(Ref vs NHE)'
  };
}

/**
 * 将电位从NHE转换为相对于RHE的电位
 * E(vs RHE) = E(vs NHE) - 0.05916·pH (at 25°C)
 * @param {number} E_vs_NHE - 相对于NHE的电位（V）
 * @param {number} T_C - 温度（°C）
 * @param {number} pH - pH值
 * @returns {object} 结果对象或错误对象
 */
function convertVsRHE(E_vs_NHE, T_C, pH) {
  const e = Number(E_vs_NHE);
  const tc = Number(T_C);
  const ph = Number(pH);
  
  // 验证电位
  if (!Number.isFinite(e)) {
    return {
      error: '电位必须为有效数字',
      errorCode: 'INVALID_NUMBER',
      parameter: 'E_vs_NHE'
    };
  }
  
  // 验证温度
  if (!Number.isFinite(tc)) {
    return {
      error: '温度必须为有效数字',
      errorCode: 'INVALID_NUMBER',
      parameter: 'T_C'
    };
  }
  
  // 验证pH
  if (!Number.isFinite(ph) || ph < 0 || ph > 14) {
    return {
      error: 'pH值应在 0 到 14 之间',
      errorCode: 'INVALID_PH',
      validRange: '0 < pH < 14',
      received: ph
    };
  }
  
  const TK = toKelvin(tc);
  if (typeof TK === 'object' && TK.error) {
    return TK; // 返回温度转换错误
  }
  
  const slope = slopePerPH(TK);
  const E_vs_RHE = e - slope * ph;
  
  return {
    E_vs_RHE: parseFloat(E_vs_RHE.toFixed(4)),
    unit: 'V',
    precision: '±0.001 V',
    conditions: [
      `T = ${tc}°C`,
      `pH = ${ph}`,
      `斜率 = ${slope.toFixed(5)} V/pH`
    ],
    formula: 'E(vs RHE) = E(vs NHE) - (RT/F)·ln(10)·pH'
  };
}

function log10(x) {
  return Math.log(x) / Math.log(10);
}

/**
 * Nernst方程计算实际电位
 * E = E° - (RT/nF)·ln(Q) = E° - (0.05916/n)·log(Q) (at 25°C)
 * @param {number} E0_vs_NHE - 标准电位（相对于NHE，V）
 * @param {number} n - 转移电子数
 * @param {number} T_C - 温度（°C）
 * @param {number} Q - 反应商
 * @returns {object} 结果对象或错误对象
 */
function nernstE(E0_vs_NHE, n, T_C, Q) {
  const e0 = Number(E0_vs_NHE);
  const nn = Number(n);
  const tc = Number(T_C);
  const q = Number(Q);
  
  // 验证标准电位
  if (!Number.isFinite(e0)) {
    return {
      error: '标准电位必须为有效数字',
      errorCode: 'INVALID_NUMBER',
      parameter: 'E0_vs_NHE'
    };
  }
  
  if (e0 < -5 || e0 > 5) {
    return {
      error: '标准电位超出常规范围',
      errorCode: 'OUT_OF_RANGE',
      validRange: '-5 V < E° < 5 V',
      received: e0
    };
  }
  
  // 验证电子数
  if (!Number.isFinite(nn) || nn < 1 || nn > 10) {
    return {
      error: '转移电子数应在 1 到 10 之间',
      errorCode: 'INVALID_ELECTRON_NUMBER',
      validRange: '1 ≤ n ≤ 10',
      received: nn
    };
  }
  
  // 验证温度
  if (!Number.isFinite(tc)) {
    return {
      error: '温度必须为有效数字',
      errorCode: 'INVALID_NUMBER',
      parameter: 'T_C'
    };
  }
  
  // 验证反应商
  if (!Number.isFinite(q)) {
    return {
      error: '反应商必须为有效数字',
      errorCode: 'INVALID_NUMBER',
      parameter: 'Q'
    };
  }
  
  if (q <= 0) {
    return {
      error: '反应商 Q 必须为正数',
      errorCode: 'INVALID_Q_VALUE',
      received: q,
      explanation: '反应商定义为产物活度与反应物活度的比值，必须为正'
    };
  }
  
  if (q < 1e-20 || q > 1e20) {
    return {
      error: '反应商超出合理范围',
      errorCode: 'Q_OUT_OF_RANGE',
      validRange: '1e-20 < Q < 1e20',
      received: q,
      warning: '极端反应商值可能表示输入错误或非平衡状态'
    };
  }
  
  // 转换温度
  const TK = toKelvin(tc);
  if (typeof TK === 'object' && TK.error) {
    return TK; // 返回温度转换错误
  }
  
  // 计算斜率
  const slope = slopePerDecade(TK, nn);
  if (typeof slope === 'object' && slope.error) {
    return slope; // 返回斜率计算错误
  }
  
  // 计算电位
  const e = e0 - slope * log10(q);
  
  // 结果合理性检查
  if (!Number.isFinite(e)) {
    return {
      error: '计算结果无效',
      errorCode: 'CALCULATION_ERROR',
      inputs: { E0: e0, n: nn, T: tc, Q: q }
    };
  }
  
  return {
    E: parseFloat(e.toFixed(4)),
    unit: 'V',
    precision: '±0.001 V',
    slope: parseFloat(slope.toFixed(5)),
    slopeUnit: 'V/decade',
    conditions: [
      `E° = ${e0} V (vs NHE)`,
      `n = ${nn}`,
      `T = ${tc}°C (${TK.toFixed(2)} K)`,
      `Q = ${q.toExponential(3)}`
    ],
    formula: 'E = E° - (2.303RT/nF)·log(Q)',
    notes: tc === 25 ? `在25°C时，斜率 = ${slope.toFixed(5)} V ≈ 0.05916/n V` : null
  };
}

/**
 * 获取模块元数据
 * @returns {object} 元数据对象
 */
function getMetadata() {
  return METADATA;
}

/**
 * 获取参比电极详细信息
 * @returns {array} 参比电极列表
 */
function getReferenceList() {
  return referenceList;
}

module.exports = {
  // 元数据
  getMetadata,
  getReferenceList,
  
  // 参比电极相关
  listReferenceNames,
  refIdByIndex,
  deltaToNHE,
  
  // 电位转换
  convertVsNHE,
  convertVsRHE,
  
  // Nernst方程
  nernstE,
  slopePerDecade,
  slopePerPH,
  
  // 工具函数
  toKelvin
};
