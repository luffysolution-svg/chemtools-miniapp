/**
 * 元素周期表扩展数据 v3.9.0
 * 按需加载方案：分段数据文件
 */

// 数据分段加载缓存
const dataCache = {};

/**
 * 根据原子序数获取对应的数据文件
 */
function getDataFile(atomicNumber) {
  if (atomicNumber >= 1 && atomicNumber <= 30) return 'elements_1-30';
  if (atomicNumber >= 31 && atomicNumber <= 60) return 'elements_31-60';
  if (atomicNumber >= 61 && atomicNumber <= 90) return 'elements_61-90';
  if (atomicNumber >= 91 && atomicNumber <= 118) return 'elements_91-118';
  return null;
}

/**
 * 加载数据分段
 */
function loadDataSegment(segmentName) {
  if (!dataCache[segmentName]) {
    try {
      dataCache[segmentName] = require(`../../../utils/periodic-data/${segmentName}`);
    } catch (e) {
      // 数据段加载失败，返回null
      return null;
    }
  }
  return dataCache[segmentName];
}

/**
 * 获取元素的扩展数据
 */
function getExtendedData(atomicNumber) {
  const segmentName = getDataFile(atomicNumber);
  if (!segmentName) return null;
  
  const segment = loadDataSegment(segmentName);
  if (!segment) return null;
  
  return segment[atomicNumber] || null;
}

/**
 * 获取所有有扩展数据的元素
 */
function getAvailableExtendedElements() {
  const elements = [];
  for (let i = 1; i <= 118; i++) {
    elements.push(i);
  }
  return elements;
}

/**
 * 合并基础元素数据和扩展数据
 */
function mergeElementData(baseElement, atomicNumber) {
  const extended = getExtendedData(atomicNumber);
  if (!extended) {
    return baseElement;
  }
  
  return {
    ...baseElement,
    ...extended,
    hasExtendedData: true
  };
}

/**
 * 格式化氧化态显示
 */
function formatOxidationStates(states) {
  if (!Array.isArray(states) || states.length === 0) {
    return '—';
  }
  
  return states.map(state => {
    if (state > 0) return '+' + state;
    if (state < 0) return state.toString();
    return '0';
  }).join(', ');
}

/**
 * 获取族的中文名称
 */
function getGroupName(group) {
  if (group === null || group === undefined) return '—';
  
  const groupNames = {
    1: 'IA族（碱金属，除H）',
    2: 'IIA族（碱土金属）',
    3: 'IIIB族（钪族）',
    4: 'IVB族（钛族）',
    5: 'VB族（钒族）',
    6: 'VIB族（铬族）',
    7: 'VIIB族（锰族）',
    8: 'VIII族（铁族）',
    9: 'VIII族（钴族）',
    10: 'VIII族（镍族）',
    11: 'IB族（铜族）',
    12: 'IIB族（锌族）',
    13: 'IIIA族（硼族）',
    14: 'IVA族（碳族）',
    15: 'VA族（氮族）',
    16: 'VIA族（氧族）',
    17: 'VIIA族（卤素）',
    18: 'VIII族/0族（稀有气体）'
  };
  
  return groupNames[group] || `第${group}族`;
}

/**
 * 获取周期的中文名称
 */
function getPeriodName(period) {
  if (period === null || period === undefined) return '—';
  return `第${period}周期`;
}

/**
 * 获取区块的中文名称
 */
function getBlockName(block) {
  if (!block) return '—';
  
  const blockNames = {
    's': 's区（碱金属和碱土金属）',
    'p': 'p区（主族元素）',
    'd': 'd区（过渡金属）',
    'f': 'f区（镧系和锕系）'
  };
  
  return blockNames[block] || block + '区';
}

/**
 * 获取扩展数据统计信息
 */
function getExtendedDataStats() {
  const elements = getAvailableExtendedElements();
  const availableCount = elements.length;
  const totalElements = 118;
  const coveragePercent = ((availableCount / totalElements) * 100).toFixed(1);
  
  return {
    availableCount,
    totalElements,
    coveragePercent,
    missingCount: totalElements - availableCount,
    version: 'v3.9.0',
    lastUpdated: '2025-10-15',
    loadingMethod: '按需分段加载',
    segments: [
      '1-30: 常见元素（详细）',
      '31-60: 过渡金属与主族',
      '61-90: 镧系与重元素',
      '91-118: 锕系与超铀元素'
    ]
  };
}

module.exports = {
  getExtendedData,
  getAvailableExtendedElements,
  mergeElementData,
  formatOxidationStates,
  getGroupName,
  getPeriodName,
  getBlockName,
  getExtendedDataStats
};
