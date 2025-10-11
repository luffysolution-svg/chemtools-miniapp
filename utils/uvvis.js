// UTF-8, no BOM
// Beer–Lambert 定律：A = ε l c

function solveBeerLambert(inputs) {
  // inputs: { A, eps, l, c }
  const A = inputs.A !== undefined && inputs.A !== '' ? Number(inputs.A) : null;
  const eps = inputs.eps !== undefined && inputs.eps !== '' ? Number(inputs.eps) : null; // L·mol⁻¹·cm⁻¹
  const l = inputs.l !== undefined && inputs.l !== '' ? Number(inputs.l) : null;         // cm
  const c = inputs.c !== undefined && inputs.c !== '' ? Number(inputs.c) : null;         // mol·L⁻¹

  const known = [A, eps, l, c].filter(v => v !== null && Number.isFinite(v)).length;
  if (known < 2) return { error: '至少已知其中两项（A、ε、l、c）' };

  // 优先：若 A、ε、l 均已知，则 c
  if (A !== null && eps !== null && l !== null) {
    if (eps === 0 || l === 0) return { error: 'ε 与 l 需为非零' };
    return { c: A / (eps * l) };
  }
  // 若 A、ε、c 已知，则 l
  if (A !== null && eps !== null && c !== null) {
    if (eps === 0 || c === 0) return { error: 'ε 与 c 需为非零' };
    return { l: A / (eps * c) };
  }
  // 若 A、l、c 已知，则 ε
  if (A !== null && l !== null && c !== null) {
    if (l === 0 || c === 0) return { error: 'l 与 c 需为非零' };
    return { eps: A / (l * c) };
  }
  // 若 ε、l、c 已知，则 A
  if (eps !== null && l !== null && c !== null) {
    return { A: eps * l * c };
  }
  // 其它任意两项 → 缺一可先设定默认再解；这里返回提示
  return { error: '请提供可直接求解的两项组合，例如 (A, ε, l) / (A, ε, c) / (A, l, c) / (ε, l, c)' };
}

function batchSolveBeerLambert(rows) {
  // rows: Array<{ label?: string, A?: string|number, eps?: string|number, l?: string|number, c?: string|number }>
  return rows.map((r, idx) => {
    const res = solveBeerLambert(r);
    const label = r.label || `#${idx + 1}`;
    return { label, input: r, result: res };
  });
}

/**
 * 计算吸收边（absorption edge）对应的带隙能量
 * 使用Tauc Plot方法：(αhν)^n = A(hν - Eg)
 * @param {Array} data - 数组 [{wavelength: nm, absorbance: A}]
 * @param {string} type - 'direct' 或 'indirect'，决定 n 的值
 * @returns {object} - { Eg: eV, wavelength: nm, method: string, note: string }
 */
function calculateBandGap(data, type = 'direct') {
  if (!Array.isArray(data) || data.length < 3) {
    return { error: '需要至少3个数据点（波长和吸光度）' };
  }
  
  const n = type === 'direct' ? 2 : 0.5; // 直接带隙 n=2，间接带隙 n=0.5
  
  // 转换数据: wavelength(nm) -> energy(eV), absorbance -> (αhν)^n
  const processedData = data.map(point => {
    const lambda = Number(point.wavelength);
    const A = Number(point.absorbance);
    
    if (!Number.isFinite(lambda) || !Number.isFinite(A) || lambda <= 0) {
      return null;
    }
    
    const E = 1240 / lambda; // eV
    const alpha = A; // 简化假设：α ∝ A（需要知道样品厚度才能精确计算）
    const tauc = Math.pow(alpha * E, n);
    
    return { E, tauc };
  }).filter(d => d !== null && Number.isFinite(d.tauc));
  
  if (processedData.length < 3) {
    return { error: '有效数据点不足，请检查输入' };
  }
  
  // 找到吸收边：在Tauc plot中找到线性区域的截距
  // 简化方法：找到 (αhν)^n 开始快速上升的点
  // 更精确的方法需要线性拟合
  
  // 对数据按能量排序
  processedData.sort((a, b) => a.E - b.E);
  
  // 寻找最大梯度位置（吸收边位置）
  let maxGradient = 0;
  let edgeIndex = 0;
  
  for (let i = 1; i < processedData.length - 1; i++) {
    const dE = processedData[i + 1].E - processedData[i - 1].E;
    const dTauc = processedData[i + 1].tauc - processedData[i - 1].tauc;
    const gradient = Math.abs(dTauc / dE);
    
    if (gradient > maxGradient) {
      maxGradient = gradient;
      edgeIndex = i;
    }
  }
  
  const Eg = processedData[edgeIndex].E;
  const wavelength = 1240 / Eg;
  
  return {
    Eg: Number(Eg.toFixed(2)),
    wavelength: Number(wavelength.toFixed(1)),
    type: type,
    method: 'Tauc Plot（简化）',
    note: `${type === 'direct' ? '直接' : '间接'}带隙估算，基于吸收边位置。精确值需要线性拟合。`,
    warning: '此方法为简化估算，建议使用专业软件（如Origin）进行Tauc plot线性拟合获得更准确结果。',
    dataPoints: processedData.length
  };
}

/**
 * 将吸收光谱波长转换为能量
 * @param {number} wavelength - 波长(nm)
 * @returns {object} - { energy: eV, note: string }
 */
function wavelengthToEnergy(wavelength) {
  const lambda = Number(wavelength);
  
  if (!Number.isFinite(lambda) || lambda <= 0) {
    return { error: '波长必须为正数' };
  }
  
  const energy = 1240 / lambda; // E(eV) = 1240 / λ(nm)
  
  return {
    energy: Number(energy.toFixed(3)),
    wavelength: lambda,
    unit: 'eV',
    formula: 'E(eV) = 1240 / λ(nm)',
    note: '基于 E = hc/λ 公式'
  };
}

/**
 * 能量转换为波长
 * @param {number} energy - 能量(eV)
 * @returns {object} - { wavelength: nm, note: string }
 */
function energyToWavelength(energy) {
  const E = Number(energy);
  
  if (!Number.isFinite(E) || E <= 0) {
    return { error: '能量必须为正数' };
  }
  
  const wavelength = 1240 / E; // λ(nm) = 1240 / E(eV)
  
  return {
    wavelength: Number(wavelength.toFixed(1)),
    energy: E,
    unit: 'nm',
    formula: 'λ(nm) = 1240 / E(eV)',
    note: '基于 λ = hc/E 公式'
  };
}

/**
 * 判断光的颜色区域
 * @param {number} wavelength - 波长(nm)
 * @returns {object} - { region: string, color: string, note: string }
 */
function getSpectralRegion(wavelength) {
  const lambda = Number(wavelength);
  
  if (!Number.isFinite(lambda) || lambda <= 0) {
    return { error: '波长必须为正数' };
  }
  
  let region, color, energy;
  
  if (lambda < 200) {
    region = '远紫外（Far UV）';
    color = '不可见';
  } else if (lambda < 280) {
    region = '中紫外（UV-C）';
    color = '不可见';
  } else if (lambda < 315) {
    region = '中紫外（UV-B）';
    color = '不可见';
  } else if (lambda < 400) {
    region = '近紫外（UV-A）';
    color = '不可见';
  } else if (lambda < 450) {
    region = '可见光';
    color = '紫/蓝';
  } else if (lambda < 495) {
    region = '可见光';
    color = '蓝';
  } else if (lambda < 570) {
    region = '可见光';
    color = '绿';
  } else if (lambda < 590) {
    region = '可见光';
    color = '黄';
  } else if (lambda < 620) {
    region = '可见光';
    color = '橙';
  } else if (lambda < 750) {
    region = '可见光';
    color = '红';
  } else if (lambda < 2500) {
    region = '近红外（NIR）';
    color = '不可见';
  } else if (lambda < 25000) {
    region = '中红外（MIR）';
    color = '不可见';
  } else {
    region = '远红外（FIR）';
    color = '不可见';
  }
  
  energy = (1240 / lambda).toFixed(2);
  
  return {
    wavelength: lambda,
    region: region,
    color: color,
    energy: Number(energy),
    unit: { wavelength: 'nm', energy: 'eV' },
    visible: lambda >= 380 && lambda <= 750
  };
}

/**
 * Kubelka-Munk 函数计算（用于漫反射光谱）
 * F(R) = (1-R)² / (2R)
 * @param {number} reflectance - 反射率 R (0-1 或 0-100%)
 * @returns {object} - { F_R: number, note: string }
 */
function kubelkaMunk(reflectance) {
  let R = Number(reflectance);
  
  if (!Number.isFinite(R)) {
    return { error: '反射率必须为有效数字' };
  }
  
  // 如果输入是百分比，转换为小数
  if (R > 1) {
    R = R / 100;
  }
  
  if (R <= 0 || R >= 1) {
    return { error: '反射率必须在 0 到 1 之间（或 0% 到 100%）' };
  }
  
  const F_R = Math.pow(1 - R, 2) / (2 * R);
  
  return {
    F_R: Number(F_R.toFixed(4)),
    reflectance: R,
    formula: 'F(R) = (1-R)² / (2R)',
    note: 'Kubelka-Munk函数，用于漫反射光谱分析。F(R) ∝ α/s（吸收系数/散射系数）',
    application: '粉末样品的带隙计算：plot [F(R)×hν]^n vs hν'
  };
}

module.exports = {
  solveBeerLambert,
  batchSolveBeerLambert,
  calculateBandGap,
  wavelengthToEnergy,
  energyToWavelength,
  getSpectralRegion,
  kubelkaMunk
};
