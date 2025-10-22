// UTF-8, no BOM
// 晶体学计算工具：理论密度、晶胞体积、晶面间距、晶面夹角

const METADATA = {
  version: '1.0.0',
  lastUpdated: '2025-10-18',
  sources: {
    density: 'International Tables for Crystallography',
    dSpacing: 'Crystal Structure Analysis Principles and Practice',
    constants: 'Avogadro constant: 6.02214076×10²³ mol⁻¹'
  }
};

// 阿伏伽德罗常数
const AVOGADRO_NUMBER = 6.02214076e23; // mol⁻¹

/**
 * 解析化学式计算摩尔质量
 * 简化版：只支持常见元素
 */
function parseFormulaAndCalculateMass(formula) {
  // 简单的元素摩尔质量表
  const atomicMasses = {
    H: 1.008, C: 12.011, N: 14.007, O: 15.999, F: 18.998,
    Na: 22.990, Mg: 24.305, Al: 26.982, Si: 28.085, P: 30.974,
    S: 32.06, Cl: 35.45, K: 39.098, Ca: 40.078, Ti: 47.867,
    V: 50.942, Cr: 51.996, Mn: 54.938, Fe: 55.845, Co: 58.933,
    Ni: 58.693, Cu: 63.546, Zn: 65.38, Ga: 69.723, Ge: 72.630,
    As: 74.922, Se: 78.971, Br: 79.904, Rb: 85.468, Sr: 87.62,
    Y: 88.906, Zr: 91.224, Nb: 92.906, Mo: 95.95, Ag: 107.868,
    Cd: 112.414, In: 114.818, Sn: 118.710, Sb: 121.760, Te: 127.60,
    I: 126.904, Cs: 132.905, Ba: 137.327, La: 138.905, Ce: 140.116,
    Pr: 140.908, Nd: 144.242, W: 183.84, Pt: 195.084, Au: 196.967,
    Hg: 200.592, Pb: 207.2, Bi: 208.980
  };

  let totalMass = 0;
  // 简化解析：Element[数字]模式
  const pattern = /([A-Z][a-z]?)(\d*)/g;
  let match;

  while ((match = pattern.exec(formula)) !== null) {
    const element = match[1];
    const count = match[2] ? parseInt(match[2]) : 1;

    if (atomicMasses[element]) {
      totalMass += atomicMasses[element] * count;
    } else {
      return { error: `未识别的元素: ${element}`, errorCode: 'UNKNOWN_ELEMENT' };
    }
  }

  if (totalMass === 0) {
    return { error: '无法解析化学式', errorCode: 'PARSE_ERROR' };
  }

  return { molWeight: totalMass };
}

/**
 * 计算晶胞体积
 * @param {object} latticeParams - {a, b, c, alpha, beta, gamma}
 * @param {string} crystalSystem - 晶系类型
 * @returns {object} 晶胞体积(Ų)
 */
function calculateCellVolume(latticeParams, crystalSystem = 'triclinic') {
  const { a, b, c, alpha, beta, gamma } = latticeParams;

  // 参数验证
  if (!a || !b || !c) {
    return { error: '请提供晶格参数a, b, c', errorCode: 'MISSING_PARAMS' };
  }

  const A = Number(a);
  const B = Number(b);
  const C = Number(c);

  if (!isFinite(A) || !isFinite(B) || !isFinite(C) || A <= 0 || B <= 0 || C <= 0) {
    return { error: '晶格参数必须为正数', errorCode: 'INVALID_PARAMS' };
  }

  let volume;

  switch (crystalSystem) {
    case 'cubic':
      // 立方：a=b=c, α=β=γ=90°
      volume = A * A * A;
      break;

    case 'tetragonal':
      // 四方：a=b≠c, α=β=γ=90°
      volume = A * A * C;
      break;

    case 'orthorhombic':
      // 正交：a≠b≠c, α=β=γ=90°
      volume = A * B * C;
      break;

    case 'hexagonal':
    case 'trigonal':
      // 六方/三方：a=b≠c, α=β=90°, γ=120°
      volume = Math.sqrt(3) / 2 * A * A * C;
      break;

    case 'monoclinic':
      // 单斜：a≠b≠c, α=γ=90°≠β
      if (!beta) {
        return { error: '单斜晶系需要提供β角', errorCode: 'MISSING_BETA' };
      }
      const betaRad = Number(beta) * Math.PI / 180;
      volume = A * B * C * Math.sin(betaRad);
      break;

    case 'triclinic':
      // 三斜：a≠b≠c, α≠β≠γ≠90°
      if (!alpha || !beta || !gamma) {
        return { error: '三斜晶系需要提供α, β, γ角', errorCode: 'MISSING_ANGLES' };
      }
      const alphaRad = Number(alpha) * Math.PI / 180;
      const betaRad2 = Number(beta) * Math.PI / 180;
      const gammaRad = Number(gamma) * Math.PI / 180;

      const cosAlpha = Math.cos(alphaRad);
      const cosBeta = Math.cos(betaRad2);
      const cosGamma = Math.cos(gammaRad);

      volume = A * B * C * Math.sqrt(
        1 - cosAlpha * cosAlpha - cosBeta * cosBeta - cosGamma * cosGamma
        + 2 * cosAlpha * cosBeta * cosGamma
      );
      break;

    default:
      return { error: `不支持的晶系: ${crystalSystem}`, errorCode: 'UNSUPPORTED_SYSTEM' };
  }

  return {
    volume: parseFloat(volume.toFixed(4)),
    unit: 'ų',
    crystalSystem,
    formula: getCellVolumeFormula(crystalSystem)
  };
}

/**
 * 获取晶胞体积公式
 */
function getCellVolumeFormula(crystalSystem) {
  const formulas = {
    cubic: 'V = a³',
    tetragonal: 'V = a²c',
    orthorhombic: 'V = abc',
    hexagonal: 'V = √3/2 · a²c',
    trigonal: 'V = √3/2 · a²c',
    monoclinic: 'V = abc·sinβ',
    triclinic: 'V = abc√(1 - cos²α - cos²β - cos²γ + 2cosα cosβ cosγ)'
  };
  return formulas[crystalSystem] || 'Unknown';
}

/**
 * 计算理论密度
 * ρ = (Z × M) / (N_A × V_cell)
 * 
 * @param {string} formula - 化学式
 * @param {object} latticeParams - 晶格参数
 * @param {number} Z - 每个晶胞中的分子数
 * @param {string} crystalSystem - 晶系
 * @returns {object} 理论密度(g/cm³)
 */
function calculateTheoreticalDensity(formula, latticeParams, Z, crystalSystem = 'cubic') {
  // 解析化学式
  const parseResult = parseFormulaAndCalculateMass(formula);
  if (parseResult.error) {
    return parseResult;
  }

  const M = parseResult.molWeight; // g/mol

  // 计算晶胞体积
  const volumeResult = calculateCellVolume(latticeParams, crystalSystem);
  if (volumeResult.error) {
    return volumeResult;
  }

  const V = volumeResult.volume; // Ų

  // 参数验证
  const z = Number(Z);
  if (!isFinite(z) || z <= 0) {
    return { error: 'Z值必须为正整数', errorCode: 'INVALID_Z' };
  }

  // 计算密度
  // ρ = (Z × M) / (N_A × V)
  // V需要从Ų转换为cm³: 1 Ų = 10⁻²⁴ cm³
  const V_cm3 = V * 1e-24;
  const density = (z * M) / (AVOGADRO_NUMBER * V_cm3);

  return {
    density: parseFloat(density.toFixed(4)),
    unit: 'g/cm³',
    formula,
    molWeight: M.toFixed(4),
    cellVolume: V.toFixed(4),
    Z: z,
    crystalSystem,
    calculation: `ρ = (${z} × ${M.toFixed(2)}) / (6.022e23 × ${V_cm3.toExponential(2)}) = ${density.toFixed(4)} g/cm³`
  };
}

/**
 * 计算致密度（实测密度与理论密度的比值）
 */
function calculateRelativeDensity(measuredDensity, theoreticalDensity) {
  const measured = Number(measuredDensity);
  const theoretical = Number(theoreticalDensity);

  if (!isFinite(measured) || !isFinite(theoretical)) {
    return { error: '请输入有效的密度值', errorCode: 'INVALID_INPUT' };
  }

  if (theoretical <= 0) {
    return { error: '理论密度必须大于0', errorCode: 'INVALID_THEORETICAL' };
  }

  const relativeDensity = (measured / theoretical) * 100;

  let quality = 'excellent';
  let note = '';

  if (relativeDensity > 100) {
    quality = 'error';
    note = '⚠️ 实测密度大于理论密度，请检查测量或计算';
  } else if (relativeDensity > 98) {
    quality = 'excellent';
    note = '✓ 致密度优秀，接近理论值';
  } else if (relativeDensity > 95) {
    quality = 'good';
    note = '✓ 致密度良好';
  } else if (relativeDensity > 90) {
    quality = 'fair';
    note = '○ 致密度一般，可能存在孔隙';
  } else {
    quality = 'poor';
    note = '⚠️ 致密度较低，样品可能疏松多孔';
  }

  return {
    relativeDensity: parseFloat(relativeDensity.toFixed(2)),
    unit: '%',
    quality,
    note,
    porosity: parseFloat((100 - relativeDensity).toFixed(2))
  };
}

/**
 * 计算晶面间距 d_hkl
 * @param {number} h, k, l - Miller指数
 * @param {object} latticeParams - 晶格参数
 * @param {string} crystalSystem - 晶系
 * @returns {object} 晶面间距(Å)
 */
function calculateDSpacing(h, k, l, latticeParams, crystalSystem = 'cubic') {
  const { a, b, c } = latticeParams;

  const H = Number(h);
  const K = Number(k);
  const L = Number(l);
  const A = Number(a);
  const B = Number(b || a);
  const C = Number(c || a);

  if (!isFinite(H) || !isFinite(K) || !isFinite(L)) {
    return { error: '请输入有效的Miller指数', errorCode: 'INVALID_MILLER' };
  }

  if (H === 0 && K === 0 && L === 0) {
    return { error: 'Miller指数不能全为0', errorCode: 'ZERO_MILLER' };
  }

  let d;

  switch (crystalSystem) {
    case 'cubic':
      // 1/d² = (h²+k²+l²)/a²
      d = A / Math.sqrt(H * H + K * K + L * L);
      break;

    case 'tetragonal':
      // 1/d² = (h²+k²)/a² + l²/c²
      d = 1 / Math.sqrt((H * H + K * K) / (A * A) + (L * L) / (C * C));
      break;

    case 'orthorhombic':
      // 1/d² = h²/a² + k²/b² + l²/c²
      d = 1 / Math.sqrt((H * H) / (A * A) + (K * K) / (B * B) + (L * L) / (C * C));
      break;

    case 'hexagonal':
      // 1/d² = 4/3(h²+hk+k²)/a² + l²/c²
      d = 1 / Math.sqrt((4 / 3) * (H * H + H * K + K * K) / (A * A) + (L * L) / (C * C));
      break;

    default:
      return {
        error: `暂不支持${crystalSystem}晶系的d间距计算`,
        errorCode: 'UNSUPPORTED_SYSTEM',
        note: '目前支持：cubic, tetragonal, orthorhombic, hexagonal'
      };
  }

  return {
    d: parseFloat(d.toFixed(4)),
    unit: 'Å',
    hkl: `(${H}${K}${L})`,
    crystalSystem,
    formula: getDSpacingFormula(crystalSystem)
  };
}

/**
 * 获取d间距公式
 */
function getDSpacingFormula(crystalSystem) {
  const formulas = {
    cubic: '1/d² = (h²+k²+l²)/a²',
    tetragonal: '1/d² = (h²+k²)/a² + l²/c²',
    orthorhombic: '1/d² = h²/a² + k²/b² + l²/c²',
    hexagonal: '1/d² = 4/3(h²+hk+k²)/a² + l²/c²'
  };
  return formulas[crystalSystem] || 'Complex formula';
}

/**
 * 获取元数据
 */
function getMetadata() {
  return METADATA;
}

module.exports = {
  calculateTheoreticalDensity,
  calculateCellVolume,
  calculateRelativeDensity,
  calculateDSpacing,
  parseFormulaAndCalculateMass,
  getMetadata
};

