// UTF-8, no BOM
// 光学性质计算工具：折射率、颜色空间转换、荧光量子产率

const METADATA = {
  version: '1.0.0',
  lastUpdated: '2025-10-18',
  sources: {
    fresnel: 'Fresnel equations',
    colorSpace: 'CIE 1931 color space',
    quantumYield: 'Relative fluorescence quantum yield method'
  }
};

/**
 * 颜色空间转换：RGB ↔ HSV
 */
function rgbToHsv(r, g, b) {
  // RGB值范围 0-255
  const R = r / 255;
  const G = g / 255;
  const B = b / 255;

  const max = Math.max(R, G, B);
  const min = Math.min(R, G, B);
  const delta = max - min;

  let h, s, v;

  // Value
  v = max;

  // Saturation
  s = max === 0 ? 0 : delta / max;

  // Hue
  if (delta === 0) {
    h = 0;
  } else if (max === R) {
    h = 60 * (((G - B) / delta) % 6);
  } else if (max === G) {
    h = 60 * (((B - R) / delta) + 2);
  } else {
    h = 60 * (((R - G) / delta) + 4);
  }

  if (h < 0) h += 360;

  return {
    h: parseFloat(h.toFixed(2)),
    s: parseFloat((s * 100).toFixed(2)),
    v: parseFloat((v * 100).toFixed(2)),
    unit: { h: '°', s: '%', v: '%' }
  };
}

/**
 * HSV转RGB
 */
function hsvToRgb(h, s, v) {
  // H: 0-360, S: 0-100, V: 0-100
  const S = s / 100;
  const V = v / 100;

  const c = V * S;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = V - c;

  let r, g, b;

  if (h >= 0 && h < 60) {
    [r, g, b] = [c, x, 0];
  } else if (h >= 60 && h < 120) {
    [r, g, b] = [x, c, 0];
  } else if (h >= 120 && h < 180) {
    [r, g, b] = [0, c, x];
  } else if (h >= 180 && h < 240) {
    [r, g, b] = [0, x, c];
  } else if (h >= 240 && h < 300) {
    [r, g, b] = [x, 0, c];
  } else {
    [r, g, b] = [c, 0, x];
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255)
  };
}

/**
 * 荧光量子产率计算（相对法）
 * Φs = Φr × (As/Ar) × (Is/Ir) × (ηs/ηr)²
 * 
 * @param {object} sample - {absorbance, fluorIntensity, refractiveIndex}
 * @param {object} reference - {absorbance, fluorIntensity, refractiveIndex, quantumYield}
 * @returns {object} 样品量子产率
 */
function calculateQuantumYield(sample, reference) {
  const As = Number(sample.absorbance);
  const Is = Number(sample.fluorIntensity);
  const ns = Number(sample.refractiveIndex);

  const Ar = Number(reference.absorbance);
  const Ir = Number(reference.fluorIntensity);
  const nr = Number(reference.refractiveIndex);
  const Phir = Number(reference.quantumYield);

  if (!isFinite(As) || !isFinite(Is) || !isFinite(ns) ||
      !isFinite(Ar) || !isFinite(Ir) || !isFinite(nr) || !isFinite(Phir)) {
    return { error: '请输入有效的数值', errorCode: 'INVALID_INPUT' };
  }

  if (As <= 0 || Ar <= 0 || Is <= 0 || Ir <= 0) {
    return { error: '吸光度和荧光强度必须为正数', errorCode: 'INVALID_RANGE' };
  }

  // Φs = Φr × (As/Ar) × (Is/Ir) × (ηs/ηr)²
  const Phis = Phir * (As / Ar) * (Is / Ir) * Math.pow(ns / nr, 2);

  return {
    quantumYield: parseFloat(Phis.toFixed(4)),
    unit: '',
    percentage: parseFloat((Phis * 100).toFixed(2)),
    formula: 'Φs = Φr × (As/Ar) × (Is/Ir) × (ηs/ηr)²',
    calculation: {
      absRatio: (As / Ar).toFixed(4),
      intensityRatio: (Is / Ir).toFixed(4),
      refractiveRatio: (ns / nr).toFixed(4),
      refractiveSquared: Math.pow(ns / nr, 2).toFixed(4)
    },
    note: '需要样品和参照物的吸光度接近（<0.1）以保证准确性'
  };
}

/**
 * 获取常用荧光标准参照物
 */
function getFluorescenceStandards() {
  return [
    {
      name: '硫酸奎宁',
      solvent: '0.1M H2SO4',
      excitation: 350,
      emission: 450,
      quantumYield: 0.546,
      refractiveIndex: 1.33,
      note: '紫外-蓝光区常用标准'
    },
    {
      name: '荧光素',
      solvent: '0.1M NaOH',
      excitation: 490,
      emission: 520,
      quantumYield: 0.95,
      refractiveIndex: 1.33,
      note: '绿光区标准'
    },
    {
      name: '罗丹明B',
      solvent: '乙醇',
      excitation: 540,
      emission: 625,
      quantumYield: 0.65,
      refractiveIndex: 1.36,
      note: '红光区标准'
    }
  ];
}

/**
 * 获取元数据
 */
function getMetadata() {
  return METADATA;
}

module.exports = {
  rgbToHsv,
  hsvToRgb,
  calculateQuantumYield,
  getFluorescenceStandards,
  getMetadata
};

