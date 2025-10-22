// UTF-8, no BOM
// 四方晶系空间群 (68个，列出最常用的12个)

module.exports = [
  {
    number: 75,
    symbol: 'P4',
    system: 'tetragonal',
    laueClass: '4/m',
    pointGroup: '4',
    centrosymmetric: false,
    extinction: [],
    generalPositions: 4,
    notes: '四方，4次旋转轴',
    examples: []
  },
  {
    number: 79,
    symbol: 'I4',
    system: 'tetragonal',
    laueClass: '4/m',
    pointGroup: '4',
    centrosymmetric: false,
    extinction: ['hkl: h+k+l=2n'],
    generalPositions: 8,
    notes: '四方，体心',
    examples: ['SnO₂ (金红石型)', 'TiO₂ (金红石)']
  },
  {
    number: 82,
    symbol: 'I-4',
    system: 'tetragonal',
    laueClass: '4/m',
    pointGroup: '-4',
    centrosymmetric: false,
    extinction: ['hkl: h+k+l=2n'],
    generalPositions: 8,
    notes: '四方，反四次轴',
    examples: ['黄铜矿CuFeS₂']
  },
  {
    number: 87,
    symbol: 'I4/m',
    system: 'tetragonal',
    laueClass: '4/m',
    pointGroup: '4/m',
    centrosymmetric: true,
    extinction: ['hkl: h+k+l=2n'],
    generalPositions: 16,
    notes: '四方，体心，反演中心',
    examples: ['金红石TiO₂', '锡石SnO₂']
  },
  {
    number: 122,
    symbol: 'I-42d',
    system: 'tetragonal',
    laueClass: '4/mmm',
    pointGroup: '-42m',
    centrosymmetric: false,
    extinction: ['hkl: h+k+l=2n', '0kl: k+l=2n', 'hhl: l=2n'],
    generalPositions: 16,
    notes: '四方，黄铜矿型结构',
    examples: ['黄铜矿CuFeS₂', 'ZnS (闪锌矿)']
  },
  {
    number: 123,
    symbol: 'P4/mmm',
    system: 'tetragonal',
    laueClass: '4/mmm',
    pointGroup: '4/mmm',
    centrosymmetric: true,
    extinction: [],
    generalPositions: 16,
    notes: '四方，最高对称性',
    examples: []
  },
  {
    number: 129,
    symbol: 'P4/nmm',
    system: 'tetragonal',
    laueClass: '4/mmm',
    pointGroup: '4/mmm',
    centrosymmetric: true,
    extinction: ['h00: h=2n', '0k0: k=2n', 'hk0: h+k=2n'],
    generalPositions: 16,
    notes: '四方，常见',
    examples: []
  },
  {
    number: 136,
    symbol: 'P4₂/mnm',
    system: 'tetragonal',
    laueClass: '4/mmm',
    pointGroup: '4/mmm',
    centrosymmetric: true,
    extinction: ['h00: h=2n', '0k0: k=2n', '00l: l=2n', 'hk0: h+k=2n'],
    generalPositions: 16,
    notes: '四方',
    examples: ['金红石型结构']
  },
  {
    number: 139,
    symbol: 'I4/mmm',
    system: 'tetragonal',
    laueClass: '4/mmm',
    pointGroup: '4/mmm',
    centrosymmetric: true,
    extinction: ['hkl: h+k+l=2n'],
    generalPositions: 32,
    notes: '四方，体心，常见高对称结构',
    examples: ['YBa₂Cu₃O₇ (超导体)', 'LaFeAsO']
  },
  {
    number: 141,
    symbol: 'I4₁/amd',
    system: 'tetragonal',
    laueClass: '4/mmm',
    pointGroup: '4/mmm',
    centrosymmetric: true,
    extinction: ['hkl: h+k+l=2n', 'hhl: 2h+l=4n', '00l: l=4n'],
    generalPositions: 32,
    notes: '四方，尖晶石变体',
    examples: ['尖晶石MgAl₂O₄变体']
  }
];

