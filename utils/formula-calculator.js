// UTF-8, no BOM
// 配方计算器：多组分溶液配制、pH缓冲液配制、水热反应参数

const METADATA = {
  version: '1.0.0',
  lastUpdated: '2025-10-18',
  sources: {
    bufferSystems: 'Biochemistry textbooks, Good\'s buffers',
    hydrothermal: 'Handbook of Hydrothermal Technology',
    henderson: 'Henderson-Hasselbalch equation'
  }
};

/**
 * 多组分溶液配制计算
 * @param {Array} components - 组分数组 [{name, targetConc(M), molWeight(g/mol), density(g/mL)}]
 * @param {number} totalVolume - 目标总体积 (mL)
 * @returns {object} 配制方案
 */
function calculateMultiComponent(components, totalVolume) {
  if (!Array.isArray(components) || components.length === 0) {
    return {
      error: '请输入至少一个组分',
      errorCode: 'NO_COMPONENTS'
    };
  }

  if (!totalVolume || totalVolume <= 0) {
    return {
      error: '总体积必须大于0',
      errorCode: 'INVALID_VOLUME'
    };
  }

  const results = [];
  let totalMass = 0;

  for (const comp of components) {
    const { name, targetConc, molWeight, density } = comp;

    if (!name) continue;

    const conc = Number(targetConc);
    const mw = Number(molWeight);

    if (!isFinite(conc) || !isFinite(mw)) continue;
    if (conc < 0 || mw <= 0) continue;

    // 计算所需摩尔数
    const moles = (conc * totalVolume) / 1000; // mol
    
    // 计算所需质量
    const mass = moles * mw; // g

    // 如果提供了密度，也计算体积
    let volume = null;
    if (density && Number(density) > 0) {
      volume = mass / Number(density); // mL
    }

    totalMass += mass;

    results.push({
      name,
      targetConc: conc.toFixed(4),
      mass: mass.toFixed(4),
      volume: volume ? volume.toFixed(2) : null,
      unit: volume ? 'mL' : 'g'
    });
  }

  if (results.length === 0) {
    return {
      error: '没有有效的组分数据',
      errorCode: 'NO_VALID_DATA'
    };
  }

  // 生成配制步骤
  const steps = [
    '配制步骤：',
    '1. 准备干净的容量瓶或烧杯',
    '2. 依次称量各组分：'
  ];

  results.forEach((r, idx) => {
    steps.push(`   ${idx + 1}. ${r.name}: ${r.mass}g${r.volume ? ` (约${r.volume}mL)` : ''}`);
  });

  steps.push('3. 加入适量溶剂（如水）');
  steps.push(`4. 搅拌溶解，定容至${totalVolume}mL`);
  steps.push('5. 混匀后即可使用');

  return {
    totalVolume: `${totalVolume} mL`,
    components: results,
    totalMass: `${totalMass.toFixed(4)} g`,
    steps: steps.join('\n')
  };
}

/**
 * pH缓冲液配制计算
 * Henderson-Hasselbalch方程：pH = pKa + log([A-]/[HA])
 * 
 * @param {string} bufferType - 缓冲体系类型
 * @param {number} targetPH - 目标pH
 * @param {number} totalVolume - 总体积(mL)
 * @param {number} concentration - 总浓度(M)
 * @returns {object} 配制方案
 */
function calculateBuffer(bufferType, targetPH, totalVolume = 1000, concentration = 0.1) {
  const bufferSystems = getBufferSystems();
  
  const buffer = bufferSystems.find(b => b.id === bufferType);
  
  if (!buffer) {
    return {
      error: '未找到指定的缓冲体系',
      errorCode: 'BUFFER_NOT_FOUND'
    };
  }

  const pH = Number(targetPH);
  const volume = Number(totalVolume);
  const conc = Number(concentration);

  if (!isFinite(pH) || !isFinite(volume) || !isFinite(conc)) {
    return {
      error: '请输入有效的数值',
      errorCode: 'INVALID_INPUT'
    };
  }

  if (pH < buffer.range[0] || pH > buffer.range[1]) {
    return {
      error: `目标pH(${pH})超出${buffer.name}的有效范围(${buffer.range[0]}-${buffer.range[1]})`,
      errorCode: 'PH_OUT_OF_RANGE',
      suggestion: `建议pH范围：${buffer.range[0]}-${buffer.range[1]}`
    };
  }

  // Henderson-Hasselbalch方程
  // pH = pKa + log([A-]/[HA])
  // [A-]/[HA] = 10^(pH - pKa)
  const ratio = Math.pow(10, pH - buffer.pKa);

  // [A-] + [HA] = C (总浓度)
  // [A-] = C * ratio / (1 + ratio)
  // [HA] = C / (1 + ratio)
  
  const concBase = conc * ratio / (1 + ratio);  // [A-]
  const concAcid = conc / (1 + ratio);          // [HA]

  // 计算所需质量
  const molesBase = (concBase * volume) / 1000;
  const molesAcid = (concAcid * volume) / 1000;

  const massBase = molesBase * buffer.baseComponent.molWeight;
  const massAcid = molesAcid * buffer.acidComponent.molWeight;

  const steps = [
    `配制${buffer.name} (pH ${pH})：`,
    `目标浓度：${conc} M，体积：${volume} mL\n`,
    `1. 称量${buffer.acidComponent.name}：${massAcid.toFixed(4)} g`,
    `2. 称量${buffer.baseComponent.name}：${massBase.toFixed(4)} g`,
    `3. 溶解于约${(volume * 0.8).toFixed(0)} mL去离子水中`,
    `4. 用pH计调节至精确pH值`,
    `5. 定容至${volume} mL`,
    `\n⚠️ 注意：实际pH可能受离子强度影响，需用pH计精确调节`
  ].join('\n');

  return {
    bufferName: buffer.name,
    targetPH: pH,
    pKa: buffer.pKa,
    ratio: ratio.toFixed(4),
    components: [
      {
        name: buffer.acidComponent.name,
        role: '酸性组分',
        mass: massAcid.toFixed(4),
        concentration: concAcid.toFixed(4),
        unit: 'g / M'
      },
      {
        name: buffer.baseComponent.name,
        role: '碱性组分',
        mass: massBase.toFixed(4),
        concentration: concBase.toFixed(4),
        unit: 'g / M'
      }
    ],
    steps
  };
}

/**
 * 水热反应参数计算
 * @param {string} solvent - 溶剂类型
 * @param {number} fillVolume - 填充体积(mL)
 * @param {number} autoclaveVolume - 反应釜容积(mL)
 * @param {number} temperature - 反应温度(°C)
 * @returns {object} 计算结果
 */
function calculateHydrothermal(solvent, fillVolume, autoclaveVolume, temperature) {
  const fill = Number(fillVolume);
  const total = Number(autoclaveVolume);
  const temp = Number(temperature);

  if (!isFinite(fill) || !isFinite(total) || !isFinite(temp)) {
    return {
      error: '请输入有效的数值',
      errorCode: 'INVALID_INPUT'
    };
  }

  if (fill <= 0 || total <= 0 || fill > total) {
    return {
      error: '填充体积必须大于0且小于反应釜容积',
      errorCode: 'INVALID_VOLUME'
    };
  }

  // 计算填充度
  const fillRatio = (fill / total) * 100;

  // 安全性评估
  let safetyLevel = 'safe';
  let safetyWarning = '';

  if (fillRatio > 80) {
    safetyLevel = 'danger';
    safetyWarning = '⛔ 危险！填充度过高(>80%)，可能发生爆炸！';
  } else if (fillRatio > 70) {
    safetyLevel = 'warning';
    safetyWarning = '⚠️ 警告！填充度较高(>70%)，存在安全隐患';
  } else if (fillRatio < 30) {
    safetyLevel = 'low-efficiency';
    safetyWarning = '💡 填充度较低(<30%)，反应效率可能不佳';
  } else {
    safetyWarning = '✓ 填充度合理（30-70%）';
  }

  // 温度安全性
  let tempWarning = '';
  if (temp > 230) {
    tempWarning = '⚠️ 温度过高(>230°C)，需使用特殊耐高温反应釜';
  } else if (temp > 200) {
    tempWarning = '💡 高温反应(>200°C)，注意安全';
  }

  // 简化的饱和蒸汽压估算（仅适用于水）
  let pressureEstimate = null;
  if (solvent === 'water' || solvent === '水') {
    // Antoine方程简化
    // 水的饱和蒸汽压（近似）
    if (temp >= 100 && temp <= 350) {
      // 粗略估算：每10°C压力约增加0.5MPa（100-200°C范围）
      pressureEstimate = 0.1 + (temp - 100) * 0.05;
      pressureEstimate = Math.min(pressureEstimate, 20); // 上限20MPa
    }
  }

  const recommendations = [
    '安全建议：',
    '• 填充度建议：40-70%',
    '• 升温速率：2-5°C/min',
    '• 降温方式：自然降温',
    '• 检查反应釜密封',
    '• 确认安全阀正常',
    solvent === '水' || solvent === 'water' ? '• 水热反应具有自生压力' : '• 注意溶剂的饱和蒸汽压'
  ];

  return {
    fillVolume: `${fill} mL`,
    autoclaveVolume: `${total} mL`,
    fillRatio: `${fillRatio.toFixed(1)}%`,
    temperature: `${temp} °C`,
    pressureEstimate: pressureEstimate ? `约${pressureEstimate.toFixed(1)} MPa (仅供参考)` : '需查阅溶剂饱和蒸汽压数据',
    safetyLevel,
    safetyWarning,
    tempWarning,
    recommendations: recommendations.join('\n'),
    note: '⚠️ 以上数据仅供参考，实际操作请严格遵守设备说明书'
  };
}

/**
 * 获取缓冲体系数据库
 */
function getBufferSystems() {
  return [
    {
      id: 'pbs',
      name: 'PBS (磷酸盐缓冲液)',
      pKa: 7.2,
      range: [6.5, 8.0],
      acidComponent: {
        name: 'NaH2PO4',
        molWeight: 119.98
      },
      baseComponent: {
        name: 'Na2HPO4',
        molWeight: 141.96
      }
    },
    {
      id: 'tris',
      name: 'Tris缓冲液',
      pKa: 8.1,
      range: [7.0, 9.0],
      acidComponent: {
        name: 'Tris·HCl',
        molWeight: 157.60
      },
      baseComponent: {
        name: 'Tris',
        molWeight: 121.14
      }
    },
    {
      id: 'acetate',
      name: '乙酸缓冲液',
      pKa: 4.76,
      range: [3.8, 5.8],
      acidComponent: {
        name: 'CH3COOH',
        molWeight: 60.05
      },
      baseComponent: {
        name: 'CH3COONa',
        molWeight: 82.03
      }
    },
    {
      id: 'citrate',
      name: '柠檬酸缓冲液',
      pKa: 6.4,
      range: [5.5, 7.5],
      acidComponent: {
        name: '柠檬酸',
        molWeight: 192.12
      },
      baseComponent: {
        name: '柠檬酸钠',
        molWeight: 258.07
      }
    }
  ];
}

/**
 * 列出所有可用的缓冲体系
 */
function listBufferSystems() {
  return getBufferSystems().map(b => ({
    id: b.id,
    name: b.name,
    pKa: b.pKa,
    range: b.range
  }));
}

/**
 * 获取元数据
 */
function getMetadata() {
  return METADATA;
}

module.exports = {
  calculateMultiComponent,
  calculateBuffer,
  calculateHydrothermal,
  listBufferSystems,
  getMetadata
};

