// UTF-8, no BOM
// 三斜晶系空间群 (2个)

module.exports = [
  {
    number: 1,
    symbol: 'P1',
    schoenflies: 'C₁¹',
    system: 'triclinic',
    laueClass: '-1',
    pointGroup: '1',
    centrosymmetric: false,
    extinction: [],
    generalPositions: 1,
    equivalentPositions: ['(x,y,z)'],
    symmetryElements: ['无对称操作'],
    notes: '三斜晶系，最简单的空间群，完全不对称',
    examples: ['K₂Cr₂O₇ (重铬酸钾)', 'CuSO₄·5H₂O']
  },
  {
    number: 2,
    symbol: 'P-1',
    schoenflies: 'Cᵢ¹',
    system: 'triclinic',
    laueClass: '-1',
    pointGroup: '-1',
    centrosymmetric: true,
    extinction: [],
    generalPositions: 2,
    equivalentPositions: ['(x,y,z)', '(-x,-y,-z)'],
    symmetryElements: ['反演中心 (0,0,0)'],
    notes: '三斜晶系，具有反演中心，最常见的三斜空间群',
    examples: ['α-石英 (低温相部分结构)', '多数有机分子晶体']
  }
];

