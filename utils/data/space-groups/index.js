// UTF-8, no BOM
// 空间群数据库索引
// 数据来源：International Tables for Crystallography, Vol. A

const METADATA = {
  version: '1.0.0',
  lastUpdated: '2025-10-18',
  totalEntries: 230,
  sources: {
    reference: 'International Tables for Crystallography, Vol. A',
    standard: 'Hermann-Mauguin符号'
  },
  notes: {
    numbering: '1-230 国际编号',
    notation: '使用Hermann-Mauguin符号',
    systems: '7个晶系：三斜、单斜、正交、四方、三方、六方、立方'
  }
};

// 导入各晶系数据
const TRICLINIC_SGs = require('./triclinic');
const MONOCLINIC_SGs = require('./monoclinic');
const ORTHORHOMBIC_SGs = require('./orthorhombic');
const TETRAGONAL_SGs = require('./tetragonal');
const TRIGONAL_SGs = require('./trigonal');
const HEXAGONAL_SGs = require('./hexagonal');
const CUBIC_SGs = require('./cubic');

// 合并所有空间群数据
const ALL_SPACE_GROUPS = [
  ...TRICLINIC_SGs,
  ...MONOCLINIC_SGs,
  ...ORTHORHOMBIC_SGs,
  ...TETRAGONAL_SGs,
  ...TRIGONAL_SGs,
  ...HEXAGONAL_SGs,
  ...CUBIC_SGs
];

/**
 * 按编号查询空间群
 * @param {number} number - 空间群编号 (1-230)
 * @returns {object|null} 空间群数据
 */
function getByNumber(number) {
  return ALL_SPACE_GROUPS.find(sg => sg.number === number) || null;
}

/**
 * 按符号查询空间群
 * @param {string} symbol - Hermann-Mauguin符号
 * @returns {object|null} 空间群数据
 */
function getBySymbol(symbol) {
  const normalizedSymbol = symbol.trim();
  return ALL_SPACE_GROUPS.find(sg => sg.symbol === normalizedSymbol) || null;
}

/**
 * 按晶系筛选空间群
 * @param {string} system - 晶系名称
 * @returns {Array} 空间群列表
 */
function getBySystem(system) {
  const normalizedSystem = system.toLowerCase();
  return ALL_SPACE_GROUPS.filter(sg => sg.system.toLowerCase() === normalizedSystem);
}

/**
 * 按Laue类筛选
 * @param {string} laueClass - Laue类
 * @returns {Array} 空间群列表
 */
function getByLaueClass(laueClass) {
  return ALL_SPACE_GROUPS.filter(sg => sg.laueClass === laueClass);
}

/**
 * 搜索空间群（按编号、符号或晶系）
 * @param {string} keyword - 搜索关键词
 * @returns {Array} 匹配的空间群列表
 */
function search(keyword) {
  const normalizedKeyword = keyword.toLowerCase().trim();
  
  // 尝试作为数字查询
  const numberMatch = parseInt(keyword);
  if (!isNaN(numberMatch) && numberMatch >= 1 && numberMatch <= 230) {
    const result = getByNumber(numberMatch);
    return result ? [result] : [];
  }
  
  // 文本搜索
  return ALL_SPACE_GROUPS.filter(sg => {
    return sg.symbol.toLowerCase().includes(normalizedKeyword) ||
           sg.system.toLowerCase().includes(normalizedKeyword) ||
           sg.pointGroup.toLowerCase().includes(normalizedKeyword) ||
           (sg.schoenflies && sg.schoenflies.toLowerCase().includes(normalizedKeyword));
  });
}

/**
 * 获取晶系统计
 * @returns {object} 各晶系的空间群数量
 */
function getSystemStats() {
  const stats = {
    triclinic: 0,
    monoclinic: 0,
    orthorhombic: 0,
    tetragonal: 0,
    trigonal: 0,
    hexagonal: 0,
    cubic: 0
  };
  
  ALL_SPACE_GROUPS.forEach(sg => {
    stats[sg.system]++;
  });
  
  return stats;
}

/**
 * 获取所有空间群的简要列表
 * @returns {Array} 空间群编号和符号列表
 */
function getAllSummary() {
  return ALL_SPACE_GROUPS.map(sg => ({
    number: sg.number,
    symbol: sg.symbol,
    system: sg.system
  }));
}

module.exports = {
  ALL_SPACE_GROUPS,
  getByNumber,
  getBySymbol,
  getBySystem,
  getByLaueClass,
  search,
  getSystemStats,
  getAllSummary,
  getMetadata: () => METADATA,
  
  // 导出各晶系数据（可选，用于按需加载）
  TRICLINIC_SGs,
  MONOCLINIC_SGs,
  ORTHORHOMBIC_SGs,
  TETRAGONAL_SGs,
  TRIGONAL_SGs,
  HEXAGONAL_SGs,
  CUBIC_SGs
};

