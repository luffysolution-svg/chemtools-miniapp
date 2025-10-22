// UTF-8, no BOM
// 正交晶系空间群 (59个，列出最常用的15个)

module.exports = [
  {
    number: 16,
    symbol: 'P222',
    system: 'orthorhombic',
    laueClass: 'mmm',
    pointGroup: '222',
    centrosymmetric: false,
    extinction: [],
    generalPositions: 4,
    notes: '正交，三个2次旋转轴',
    examples: []
  },
  {
    number: 19,
    symbol: 'P2₁2₁2₁',
    system: 'orthorhombic',
    laueClass: 'mmm',
    pointGroup: '222',
    centrosymmetric: false,
    extinction: ['h00: h=2n', '0k0: k=2n', '00l: l=2n'],
    generalPositions: 4,
    notes: '正交，手性空间群，蛋白质晶体常见',
    examples: ['大量蛋白质', '手性有机化合物']
  },
  {
    number: 21,
    symbol: 'C222',
    system: 'orthorhombic',
    laueClass: 'mmm',
    pointGroup: '222',
    centrosymmetric: false,
    extinction: ['hkl: h+k=2n'],
    generalPositions: 8,
    notes: '正交，C心格子',
    examples: []
  },
  {
    number: 33,
    symbol: 'Pna2₁',
    system: 'orthorhombic',
    laueClass: 'mmm',
    pointGroup: 'mm2',
    centrosymmetric: false,
    extinction: ['h0l: h=2n', '0kl: k+l=2n', '00l: l=2n'],
    generalPositions: 4,
    notes: '正交，常见极性空间群',
    examples: ['铁电材料']
  },
  {
    number: 47,
    symbol: 'Pmmm',
    system: 'orthorhombic',
    laueClass: 'mmm',
    pointGroup: 'mmm',
    centrosymmetric: true,
    extinction: [],
    generalPositions: 8,
    notes: '正交，最高对称性',
    examples: ['钙钛矿结构']
  },
  {
    number: 62,
    symbol: 'Pnma',
    system: 'orthorhombic',
    laueClass: 'mmm',
    pointGroup: 'mmm',
    centrosymmetric: true,
    extinction: ['0kl: k+l=2n', 'h0l: h=2n', 'hk0: h=2n', 'h00: h=2n', '0k0: k=2n', '00l: l=2n'],
    generalPositions: 8,
    notes: '**正交晶系最常用**，许多钙钛矿和尖晶石结构',
    examples: ['LiFePO₄', 'YBa₂Cu₃O₇', 'GdFeO₃型钙钛矿']
  },
  {
    number: 63,
    symbol: 'Cmcm',
    system: 'orthorhombic',
    laueClass: 'mmm',
    pointGroup: 'mmm',
    centrosymmetric: true,
    extinction: ['hkl: h+k=2n', 'h0l: l=2n', '0kl: k=2n'],
    generalPositions: 16,
    notes: '正交，C心格子',
    examples: []
  },
  {
    number: 64,
    symbol: 'Cmca',
    system: 'orthorhombic',
    laueClass: 'mmm',
    pointGroup: 'mmm',
    centrosymmetric: true,
    extinction: ['hkl: h+k=2n', '0kl: k,l=2n', 'hk0: h=2n'],
    generalPositions: 16,
    notes: '正交，常见',
    examples: []
  },
  {
    number: 71,
    symbol: 'Immm',
    system: 'orthorhombic',
    laueClass: 'mmm',
    pointGroup: 'mmm',
    centrosymmetric: true,
    extinction: ['hkl: h+k+l=2n'],
    generalPositions: 16,
    notes: '正交，体心',
    examples: ['某些金属间化合物']
  },
  {
    number: 74,
    symbol: 'Imma',
    system: 'orthorhombic',
    laueClass: 'mmm',
    pointGroup: 'mmm',
    centrosymmetric: true,
    extinction: ['hkl: h+k+l=2n', '0kl: k,l=2n', 'hk0: h=2n'],
    generalPositions: 16,
    notes: '正交，体心',
    examples: []
  }
];

