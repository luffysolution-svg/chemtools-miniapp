/**
 * 元素周期表轻量级数据
 * 仅包含列表显示所需的基本信息
 * 用于快速加载和列表展示
 */

// 轻量级元素数据（仅包含显示必需字段）
const periodicElementsLite = [
  { number: 1, symbol: 'H', name: '氢', atomicMass: 1.008, category: 'nonmetal' },
  { number: 2, symbol: 'He', name: '氦', atomicMass: 4.003, category: 'noble-gas' },
  { number: 3, symbol: 'Li', name: '锂', atomicMass: 6.941, category: 'alkali' },
  { number: 4, symbol: 'Be', name: '铍', atomicMass: 9.012, category: 'alkaline' },
  { number: 5, symbol: 'B', name: '硼', atomicMass: 10.81, category: 'metalloid' },
  { number: 6, symbol: 'C', name: '碳', atomicMass: 12.01, category: 'nonmetal' },
  { number: 7, symbol: 'N', name: '氮', atomicMass: 14.01, category: 'nonmetal' },
  { number: 8, symbol: 'O', name: '氧', atomicMass: 16.00, category: 'nonmetal' },
  { number: 9, symbol: 'F', name: '氟', atomicMass: 19.00, category: 'halogen' },
  { number: 10, symbol: 'Ne', name: '氖', atomicMass: 20.18, category: 'noble-gas' },
  { number: 11, symbol: 'Na', name: '钠', atomicMass: 22.99, category: 'alkali' },
  { number: 12, symbol: 'Mg', name: '镁', atomicMass: 24.31, category: 'alkaline' },
  { number: 13, symbol: 'Al', name: '铝', atomicMass: 26.98, category: 'post-transition' },
  { number: 14, symbol: 'Si', name: '硅', atomicMass: 28.09, category: 'metalloid' },
  { number: 15, symbol: 'P', name: '磷', atomicMass: 30.97, category: 'nonmetal' },
  { number: 16, symbol: 'S', name: '硫', atomicMass: 32.07, category: 'nonmetal' },
  { number: 17, symbol: 'Cl', name: '氯', atomicMass: 35.45, category: 'halogen' },
  { number: 18, symbol: 'Ar', name: '氩', atomicMass: 39.95, category: 'noble-gas' },
  { number: 19, symbol: 'K', name: '钾', atomicMass: 39.10, category: 'alkali' },
  { number: 20, symbol: 'Ca', name: '钙', atomicMass: 40.08, category: 'alkaline' },
  { number: 21, symbol: 'Sc', name: '钪', atomicMass: 44.96, category: 'transition' },
  { number: 22, symbol: 'Ti', name: '钛', atomicMass: 47.87, category: 'transition' },
  { number: 23, symbol: 'V', name: '钒', atomicMass: 50.94, category: 'transition' },
  { number: 24, symbol: 'Cr', name: '铬', atomicMass: 52.00, category: 'transition' },
  { number: 25, symbol: 'Mn', name: '锰', atomicMass: 54.94, category: 'transition' },
  { number: 26, symbol: 'Fe', name: '铁', atomicMass: 55.85, category: 'transition' },
  { number: 27, symbol: 'Co', name: '钴', atomicMass: 58.93, category: 'transition' },
  { number: 28, symbol: 'Ni', name: '镍', atomicMass: 58.69, category: 'transition' },
  { number: 29, symbol: 'Cu', name: '铜', atomicMass: 63.55, category: 'transition' },
  { number: 30, symbol: 'Zn', name: '锌', atomicMass: 65.38, category: 'transition' },
  { number: 31, symbol: 'Ga', name: '镓', atomicMass: 69.72, category: 'post-transition' },
  { number: 32, symbol: 'Ge', name: '锗', atomicMass: 72.63, category: 'metalloid' },
  { number: 33, symbol: 'As', name: '砷', atomicMass: 74.92, category: 'metalloid' },
  { number: 34, symbol: 'Se', name: '硒', atomicMass: 78.97, category: 'nonmetal' },
  { number: 35, symbol: 'Br', name: '溴', atomicMass: 79.90, category: 'halogen' },
  { number: 36, symbol: 'Kr', name: '氪', atomicMass: 83.80, category: 'noble-gas' },
  { number: 37, symbol: 'Rb', name: '铷', atomicMass: 85.47, category: 'alkali' },
  { number: 38, symbol: 'Sr', name: '锶', atomicMass: 87.62, category: 'alkaline' },
  { number: 39, symbol: 'Y', name: '钇', atomicMass: 88.91, category: 'transition' },
  { number: 40, symbol: 'Zr', name: '锆', atomicMass: 91.22, category: 'transition' },
  { number: 41, symbol: 'Nb', name: '铌', atomicMass: 92.91, category: 'transition' },
  { number: 42, symbol: 'Mo', name: '钼', atomicMass: 95.95, category: 'transition' },
  { number: 43, symbol: 'Tc', name: '锝', atomicMass: 98, category: 'transition' },
  { number: 44, symbol: 'Ru', name: '钌', atomicMass: 101.1, category: 'transition' },
  { number: 45, symbol: 'Rh', name: '铑', atomicMass: 102.9, category: 'transition' },
  { number: 46, symbol: 'Pd', name: '钯', atomicMass: 106.4, category: 'transition' },
  { number: 47, symbol: 'Ag', name: '银', atomicMass: 107.9, category: 'transition' },
  { number: 48, symbol: 'Cd', name: '镉', atomicMass: 112.4, category: 'transition' },
  { number: 49, symbol: 'In', name: '铟', atomicMass: 114.8, category: 'post-transition' },
  { number: 50, symbol: 'Sn', name: '锡', atomicMass: 118.7, category: 'post-transition' },
  { number: 51, symbol: 'Sb', name: '锑', atomicMass: 121.8, category: 'metalloid' },
  { number: 52, symbol: 'Te', name: '碲', atomicMass: 127.6, category: 'metalloid' },
  { number: 53, symbol: 'I', name: '碘', atomicMass: 126.9, category: 'halogen' },
  { number: 54, symbol: 'Xe', name: '氙', atomicMass: 131.3, category: 'noble-gas' },
  { number: 55, symbol: 'Cs', name: '铯', atomicMass: 132.9, category: 'alkali' },
  { number: 56, symbol: 'Ba', name: '钡', atomicMass: 137.3, category: 'alkaline' },
  { number: 57, symbol: 'La', name: '镧', atomicMass: 138.9, category: 'lanthanoid' },
  { number: 58, symbol: 'Ce', name: '铈', atomicMass: 140.1, category: 'lanthanoid' },
  { number: 59, symbol: 'Pr', name: '镨', atomicMass: 140.9, category: 'lanthanoid' },
  { number: 60, symbol: 'Nd', name: '钕', atomicMass: 144.2, category: 'lanthanoid' },
  { number: 61, symbol: 'Pm', name: '钷', atomicMass: 145, category: 'lanthanoid' },
  { number: 62, symbol: 'Sm', name: '钐', atomicMass: 150.4, category: 'lanthanoid' },
  { number: 63, symbol: 'Eu', name: '铕', atomicMass: 152.0, category: 'lanthanoid' },
  { number: 64, symbol: 'Gd', name: '钆', atomicMass: 157.3, category: 'lanthanoid' },
  { number: 65, symbol: 'Tb', name: '铽', atomicMass: 158.9, category: 'lanthanoid' },
  { number: 66, symbol: 'Dy', name: '镝', atomicMass: 162.5, category: 'lanthanoid' },
  { number: 67, symbol: 'Ho', name: '钬', atomicMass: 164.9, category: 'lanthanoid' },
  { number: 68, symbol: 'Er', name: '铒', atomicMass: 167.3, category: 'lanthanoid' },
  { number: 69, symbol: 'Tm', name: '铥', atomicMass: 168.9, category: 'lanthanoid' },
  { number: 70, symbol: 'Yb', name: '镱', atomicMass: 173.1, category: 'lanthanoid' },
  { number: 71, symbol: 'Lu', name: '镥', atomicMass: 175.0, category: 'lanthanoid' },
  { number: 72, symbol: 'Hf', name: '铪', atomicMass: 178.5, category: 'transition' },
  { number: 73, symbol: 'Ta', name: '钽', atomicMass: 180.9, category: 'transition' },
  { number: 74, symbol: 'W', name: '钨', atomicMass: 183.8, category: 'transition' },
  { number: 75, symbol: 'Re', name: '铼', atomicMass: 186.2, category: 'transition' },
  { number: 76, symbol: 'Os', name: '锇', atomicMass: 190.2, category: 'transition' },
  { number: 77, symbol: 'Ir', name: '铱', atomicMass: 192.2, category: 'transition' },
  { number: 78, symbol: 'Pt', name: '铂', atomicMass: 195.1, category: 'transition' },
  { number: 79, symbol: 'Au', name: '金', atomicMass: 197.0, category: 'transition' },
  { number: 80, symbol: 'Hg', name: '汞', atomicMass: 200.6, category: 'transition' },
  { number: 81, symbol: 'Tl', name: '铊', atomicMass: 204.4, category: 'post-transition' },
  { number: 82, symbol: 'Pb', name: '铅', atomicMass: 207.2, category: 'post-transition' },
  { number: 83, symbol: 'Bi', name: '铋', atomicMass: 209.0, category: 'post-transition' },
  { number: 84, symbol: 'Po', name: '钋', atomicMass: 209, category: 'post-transition' },
  { number: 85, symbol: 'At', name: '砹', atomicMass: 210, category: 'halogen' },
  { number: 86, symbol: 'Rn', name: '氡', atomicMass: 222, category: 'noble-gas' },
  { number: 87, symbol: 'Fr', name: '钫', atomicMass: 223, category: 'alkali' },
  { number: 88, symbol: 'Ra', name: '镭', atomicMass: 226, category: 'alkaline' },
  { number: 89, symbol: 'Ac', name: '锕', atomicMass: 227, category: 'actinoid' },
  { number: 90, symbol: 'Th', name: '钍', atomicMass: 232.0, category: 'actinoid' },
  { number: 91, symbol: 'Pa', name: '镤', atomicMass: 231.0, category: 'actinoid' },
  { number: 92, symbol: 'U', name: '铀', atomicMass: 238.0, category: 'actinoid' },
  { number: 93, symbol: 'Np', name: '镎', atomicMass: 237, category: 'actinoid' },
  { number: 94, symbol: 'Pu', name: '钚', atomicMass: 244, category: 'actinoid' },
  { number: 95, symbol: 'Am', name: '镅', atomicMass: 243, category: 'actinoid' },
  { number: 96, symbol: 'Cm', name: '锔', atomicMass: 247, category: 'actinoid' },
  { number: 97, symbol: 'Bk', name: '锫', atomicMass: 247, category: 'actinoid' },
  { number: 98, symbol: 'Cf', name: '锎', atomicMass: 251, category: 'actinoid' },
  { number: 99, symbol: 'Es', name: '锿', atomicMass: 252, category: 'actinoid' },
  { number: 100, symbol: 'Fm', name: '镄', atomicMass: 257, category: 'actinoid' },
  { number: 101, symbol: 'Md', name: '钔', atomicMass: 258, category: 'actinoid' },
  { number: 102, symbol: 'No', name: '锘', atomicMass: 259, category: 'actinoid' },
  { number: 103, symbol: 'Lr', name: '铹', atomicMass: 266, category: 'actinoid' },
  { number: 104, symbol: 'Rf', name: '𬬻', atomicMass: 267, category: 'transition' },
  { number: 105, symbol: 'Db', name: '𬭊', atomicMass: 268, category: 'transition' },
  { number: 106, symbol: 'Sg', name: '𬭳', atomicMass: 269, category: 'transition' },
  { number: 107, symbol: 'Bh', name: '𬭛', atomicMass: 270, category: 'transition' },
  { number: 108, symbol: 'Hs', name: '𬭶', atomicMass: 277, category: 'transition' },
  { number: 109, symbol: 'Mt', name: '鿏', atomicMass: 278, category: 'transition' },
  { number: 110, symbol: 'Ds', name: '𫟼', atomicMass: 281, category: 'transition' },
  { number: 111, symbol: 'Rg', name: '𬬭', atomicMass: 282, category: 'transition' },
  { number: 112, symbol: 'Cn', name: '鿔', atomicMass: 285, category: 'transition' },
  { number: 113, symbol: 'Nh', name: '鿭', atomicMass: 286, category: 'post-transition' },
  { number: 114, symbol: 'Fl', name: '𫓧', atomicMass: 289, category: 'post-transition' },
  { number: 115, symbol: 'Mc', name: '镆', atomicMass: 290, category: 'post-transition' },
  { number: 116, symbol: 'Lv', name: '𫟷', atomicMass: 293, category: 'post-transition' },
  { number: 117, symbol: 'Ts', name: '鿬', atomicMass: 294, category: 'halogen' },
  { number: 118, symbol: 'Og', name: '鿫', atomicMass: 294, category: 'noble-gas' }
];

/**
 * 根据原子序数获取完整元素数据（按需加载）
 */
function getElementDetail(atomicNumber) {
  try {
    const periodicModule = require('../../../utils/periodic');
    if (periodicModule && periodicModule.periodicElements) {
      return periodicModule.periodicElements.find(el => el.number === atomicNumber);
    }
  } catch (error) {
    // 加载完整数据失败，使用轻量级数据
  }
  // 降级：返回轻量级数据
  return periodicElementsLite.find(el => el.number === atomicNumber);
}

module.exports = {
  periodicElementsLite,
  getElementDetail
};

