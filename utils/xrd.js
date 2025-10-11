// UTF-8, no BOM
// XRD 计算组合包：d-2θ 互算、常见靶材、常见晶系的 d 间距公式
// 数据来源：International Tables for Crystallography

// 元数据
const METADATA = {
  version: '1.0.0',
  lastUpdated: '2025-10-10',
  sources: {
    wavelengths: 'International Tables for Crystallography, Vol. C (2006)',
    formulas: 'Bragg\'s Law: nλ = 2d sinθ',
    citation: 'W. H. Bragg & W. L. Bragg, Proc. R. Soc. Lond. A 88, 428-438 (1913)'
  },
  precision: {
    angle: '±0.01°',
    dSpacing: '±0.001 Å',
    wavelength: '精确值（定义）'
  },
  applicableRange: {
    theta2: '0° < 2θ < 180°',
    dSpacing: '0.5 Å < d < 100 Å',
    wavelength: '0.1 Å < λ < 10 Å'
  }
};

// 常见X射线靶材波长（单位：Å）
const TARGETS = [
  { 
    key: 'cukalpha', 
    name: 'Cu Kα', 
    lambda: 1.5406,
    description: '最常用的X射线源',
    energy: '8.05 keV'
  },
  { 
    key: 'cokalpha', 
    name: 'Co Kα', 
    lambda: 1.7890,
    description: '用于铁基材料',
    energy: '6.93 keV'
  },
  { 
    key: 'mokatheta', 
    name: 'Mo Kα', 
    lambda: 0.7093,
    description: '用于高角度测量',
    energy: '17.48 keV'
  }
];

function listTargets() { return TARGETS.slice(); }

function getMetadata() { return METADATA; }

/**
 * 根据衍射角计算晶面间距
 * Bragg定律：nλ = 2d sinθ (n=1)
 * 
 * @param {number} theta2Deg - 衍射角 2θ (度)
 * @param {number} lambda - X射线波长 (Å)
 * @returns {object} { d, unit, precision, conditions } 或 { error, errorCode }
 */
function dFromTheta2(theta2Deg, lambda) {
  // 输入类型转换
  const t = Number(theta2Deg);
  const lam = Number(lambda);
  
  // 基本有效性检查
  if (!isFinite(t) || !isFinite(lam)) {
    return { 
      error: '输入必须为有效数字', 
      errorCode: 'INVALID_NUMBER',
      input: { theta2: theta2Deg, lambda }
    };
  }
  
  // 范围检查：2θ 应在 0-180° 之间
  if (t <= 0 || t >= 180) {
    return { 
      error: '衍射角 2θ 应在 0° 到 180° 之间', 
      errorCode: 'OUT_OF_RANGE',
      validRange: '0° < 2θ < 180°',
      received: t
    };
  }
  
  // 波长检查：合理的X射线波长范围
  if (lam <= 0.1 || lam > 10) {
    return { 
      error: 'X射线波长应在 0.1 到 10 Å 之间', 
      errorCode: 'INVALID_WAVELENGTH',
      validRange: '0.1 Å < λ < 10 Å',
      received: lam
    };
  }
  
  // 精度检查：角度太小时精度不足
  if (t < 1) {
    return { 
      error: '衍射角过小（< 1°），计算精度不足', 
      errorCode: 'PRECISION_TOO_LOW',
      suggestion: '建议 2θ > 1°'
    };
  }
  
  // 计算
  const theta = (t * Math.PI / 180) / 2;  // 转换为弧度并除以2
  const s = Math.sin(theta);
  
  // 检查 sinθ 是否接近0
  if (Math.abs(s) < 1e-10) {
    return { 
      error: 'sinθ 接近零，无法计算', 
      errorCode: 'DIVISION_BY_ZERO'
    };
  }
  
  const d = lam / (2 * s);
  
  // 结果合理性检查
  if (d < 0.5 || d > 100) {
    return {
      d,
      unit: 'Å',
      warning: `计算结果 d = ${d.toFixed(4)} Å 超出常规范围（0.5-100 Å），请检查输入参数`,
      precision: '±0.001 Å',
      conditions: ['n = 1', `λ = ${lam} Å`, `2θ = ${t}°`]
    };
  }
  
  return { 
    d: parseFloat(d.toFixed(4)),  // 保留4位小数
    unit: 'Å',
    precision: '±0.001 Å',
    conditions: ['n = 1', `λ = ${lam} Å`, `2θ = ${t}°`],
    formula: 'd = λ / (2 sinθ)'
  };
}

/**
 * 根据晶面间距计算衍射角
 * Bragg定律：2θ = 2 arcsin(λ / 2d)
 * 
 * @param {number} d - 晶面间距 (Å)
 * @param {number} lambda - X射线波长 (Å)
 * @returns {object} { theta2, unit, precision, conditions } 或 { error, errorCode }
 */
function theta2FromD(d, lambda) {
  // 输入类型转换
  const dd = Number(d);
  const lam = Number(lambda);
  
  // 基本有效性检查
  if (!isFinite(dd) || !isFinite(lam)) {
    return { 
      error: '输入必须为有效数字', 
      errorCode: 'INVALID_NUMBER',
      input: { d, lambda }
    };
  }
  
  // d 值检查
  if (dd <= 0) {
    return { 
      error: '晶面间距 d 必须为正数', 
      errorCode: 'INVALID_D_VALUE',
      received: dd
    };
  }
  
  // d 值合理性检查
  if (dd < 0.5 || dd > 100) {
    return {
      error: '晶面间距 d 超出常规范围',
      errorCode: 'OUT_OF_RANGE',
      validRange: '0.5 Å < d < 100 Å',
      received: dd,
      suggestion: '请检查输入单位是否为 Å'
    };
  }
  
  // 波长检查
  if (lam <= 0.1 || lam > 10) {
    return { 
      error: 'X射线波长应在 0.1 到 10 Å 之间', 
      errorCode: 'INVALID_WAVELENGTH',
      validRange: '0.1 Å < λ < 10 Å',
      received: lam
    };
  }
  
  // 计算 x = λ / 2d
  const x = lam / (2 * dd);
  
  // 几何可行性检查：x 必须 ≤ 1
  if (x > 1) {
    return { 
      error: '几何上无解：λ > 2d，无法满足Bragg条件', 
      errorCode: 'GEOMETRICALLY_IMPOSSIBLE',
      explanation: `λ/(2d) = ${x.toFixed(4)} > 1，arcsin 无定义`,
      suggestion: '请使用更小的波长或更大的 d 值'
    };
  }
  
  // 精度警告：x 接近 1 时，角度接近 90°，精度较低
  if (x > 0.95) {
    const theta = Math.asin(x);
    const theta2 = 2 * theta * 180 / Math.PI;
    
    return {
      theta2: parseFloat(theta2.toFixed(2)),
      unit: '度',
      precision: '±0.1°',
      warning: `衍射角接近 90°，测量精度较低`,
      conditions: ['n = 1', `λ = ${lam} Å`, `d = ${dd} Å`],
      formula: '2θ = 2 arcsin(λ / 2d)'
    };
  }
  
  // 正常计算
  const theta = Math.asin(x);
  const theta2 = 2 * theta * 180 / Math.PI;
  
  return { 
    theta2: parseFloat(theta2.toFixed(2)),  // 保留2位小数
    unit: '度',
    precision: '±0.01°',
    conditions: ['n = 1', `λ = ${lam} Å`, `d = ${dd} Å`],
    formula: '2θ = 2 arcsin(λ / 2d)'
  };
}

/**
 * 立方晶系晶面间距计算
 * d = a / √(h² + k² + l²)
 * 
 * @param {number} a - 晶格常数 (Å)
 * @param {number} h - Miller指数 h
 * @param {number} k - Miller指数 k
 * @param {number} l - Miller指数 l
 * @returns {object} { d, unit } 或 { error }
 */
function dCubic(a, h, k, l) {
  // 参数验证
  const params = [a, h, k, l];
  if (params.some(p => !isFinite(Number(p)))) {
    return { error: '所有参数必须为有效数字', errorCode: 'INVALID_NUMBER' };
  }
  
  const aa = Number(a);
  const hh = Number(h);
  const kk = Number(k);
  const ll = Number(l);
  
  // 晶格常数检查
  if (aa <= 0 || aa > 50) {
    return { 
      error: '晶格常数 a 应在 0 到 50 Å 之间', 
      errorCode: 'INVALID_LATTICE_PARAMETER',
      validRange: '0 < a < 50 Å',
      received: aa
    };
  }
  
  // Miller指数检查：不能全为0
  if (hh === 0 && kk === 0 && ll === 0) {
    return { 
      error: 'Miller指数 (hkl) 不能全为零', 
      errorCode: 'INVALID_MILLER_INDICES'
    };
  }
  
  // 计算
  const denominator = Math.sqrt(hh*hh + kk*kk + ll*ll);
  const d = aa / denominator;
  
  return {
    d: parseFloat(d.toFixed(4)),
    unit: 'Å',
    latticeType: '立方晶系',
    millerIndices: `(${Math.abs(hh)}${Math.abs(kk)}${Math.abs(ll)})`,
    formula: 'd = a / √(h² + k² + l²)'
  };
}

/**
 * 四方晶系晶面间距计算
 * 1/d² = (h² + k²)/a² + l²/c²
 * 
 * @param {number} a - 晶格常数 a (Å)
 * @param {number} c - 晶格常数 c (Å)
 * @param {number} h - Miller指数 h
 * @param {number} k - Miller指数 k
 * @param {number} l - Miller指数 l
 * @returns {object} { d, unit } 或 { error }
 */
function dTetragonal(a, c, h, k, l) {
  // 参数验证
  const params = [a, c, h, k, l];
  if (params.some(p => !isFinite(Number(p)))) {
    return { error: '所有参数必须为有效数字', errorCode: 'INVALID_NUMBER' };
  }
  
  const aa = Number(a);
  const cc = Number(c);
  const hh = Number(h);
  const kk = Number(k);
  const ll = Number(l);
  
  // 晶格常数检查
  if (aa <= 0 || aa > 50 || cc <= 0 || cc > 50) {
    return { 
      error: '晶格常数 a, c 应在 0 到 50 Å 之间', 
      errorCode: 'INVALID_LATTICE_PARAMETER'
    };
  }
  
  // Miller指数检查
  if (hh === 0 && kk === 0 && ll === 0) {
    return { 
      error: 'Miller指数 (hkl) 不能全为零', 
      errorCode: 'INVALID_MILLER_INDICES'
    };
  }
  
  // 计算
  const term = (hh*hh + kk*kk)/(aa*aa) + (ll*ll)/(cc*cc);
  if (term <= 0) {
    return { error: '计算错误：分母为零或负数', errorCode: 'CALCULATION_ERROR' };
  }
  
  const d = 1 / Math.sqrt(term);
  
  return {
    d: parseFloat(d.toFixed(4)),
    unit: 'Å',
    latticeType: '四方晶系',
    millerIndices: `(${Math.abs(hh)}${Math.abs(kk)}${Math.abs(ll)})`,
    formula: '1/d² = (h² + k²)/a² + l²/c²'
  };
}

/**
 * 正交晶系晶面间距计算
 * 1/d² = h²/a² + k²/b² + l²/c²
 * 
 * @param {number} a - 晶格常数 a (Å)
 * @param {number} b - 晶格常数 b (Å)
 * @param {number} c - 晶格常数 c (Å)
 * @param {number} h - Miller指数 h
 * @param {number} k - Miller指数 k
 * @param {number} l - Miller指数 l
 * @returns {object} { d, unit } 或 { error }
 */
function dOrthorhombic(a, b, c, h, k, l) {
  // 参数验证
  const params = [a, b, c, h, k, l];
  if (params.some(p => !isFinite(Number(p)))) {
    return { error: '所有参数必须为有效数字', errorCode: 'INVALID_NUMBER' };
  }
  
  const aa = Number(a);
  const bb = Number(b);
  const cc = Number(c);
  const hh = Number(h);
  const kk = Number(k);
  const ll = Number(l);
  
  // 晶格常数检查
  if (aa <= 0 || aa > 50 || bb <= 0 || bb > 50 || cc <= 0 || cc > 50) {
    return { 
      error: '晶格常数 a, b, c 应在 0 到 50 Å 之间', 
      errorCode: 'INVALID_LATTICE_PARAMETER'
    };
  }
  
  // Miller指数检查
  if (hh === 0 && kk === 0 && ll === 0) {
    return { 
      error: 'Miller指数 (hkl) 不能全为零', 
      errorCode: 'INVALID_MILLER_INDICES'
    };
  }
  
  // 计算
  const term = (hh*hh)/(aa*aa) + (kk*kk)/(bb*bb) + (ll*ll)/(cc*cc);
  if (term <= 0) {
    return { error: '计算错误：分母为零或负数', errorCode: 'CALCULATION_ERROR' };
  }
  
  const d = 1 / Math.sqrt(term);
  
  return {
    d: parseFloat(d.toFixed(4)),
    unit: 'Å',
    latticeType: '正交晶系',
    millerIndices: `(${Math.abs(hh)}${Math.abs(kk)}${Math.abs(ll)})`,
    formula: '1/d² = h²/a² + k²/b² + l²/c²'
  };
}

/**
 * 六方晶系晶面间距计算
 * 1/d² = (4/3)(h² + hk + k²)/a² + l²/c²
 * 
 * @param {number} a - 晶格常数 a (Å)
 * @param {number} c - 晶格常数 c (Å)
 * @param {number} h - Miller指数 h
 * @param {number} k - Miller指数 k
 * @param {number} l - Miller指数 l
 * @returns {object} { d, unit } 或 { error }
 */
function dHexagonal(a, c, h, k, l) {
  // 参数验证
  const params = [a, c, h, k, l];
  if (params.some(p => !isFinite(Number(p)))) {
    return { error: '所有参数必须为有效数字', errorCode: 'INVALID_NUMBER' };
  }
  
  const aa = Number(a);
  const cc = Number(c);
  const hh = Number(h);
  const kk = Number(k);
  const ll = Number(l);
  
  // 晶格常数检查
  if (aa <= 0 || aa > 50 || cc <= 0 || cc > 50) {
    return { 
      error: '晶格常数 a, c 应在 0 到 50 Å 之间', 
      errorCode: 'INVALID_LATTICE_PARAMETER'
    };
  }
  
  // Miller指数检查
  if (hh === 0 && kk === 0 && ll === 0) {
    return { 
      error: 'Miller指数 (hkl) 不能全为零', 
      errorCode: 'INVALID_MILLER_INDICES'
    };
  }
  
  // 计算
  const term = (4/3) * (hh*hh + hh*kk + kk*kk) / (aa*aa) + (ll*ll)/(cc*cc);
  if (term <= 0) {
    return { error: '计算错误：分母为零或负数', errorCode: 'CALCULATION_ERROR' };
  }
  
  const d = 1 / Math.sqrt(term);
  
  return {
    d: parseFloat(d.toFixed(4)),
    unit: 'Å',
    latticeType: '六方晶系',
    millerIndices: `(${Math.abs(hh)}${Math.abs(kk)}${Math.abs(ll)})`,
    formula: '1/d² = (4/3)(h² + hk + k²)/a² + l²/c²'
  };
}

module.exports = {
  // 元数据
  getMetadata,
  
  // 靶材信息
  listTargets,
  
  // Bragg定律计算
  dFromTheta2,
  theta2FromD,
  
  // 晶系计算
  dCubic,
  dTetragonal,
  dOrthorhombic,
  dHexagonal
};
