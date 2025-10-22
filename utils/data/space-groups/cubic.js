// UTF-8, no BOM
// 立方晶系空间群 (36个，列出最常用的15个)

module.exports = [
  {
    number: 195,
    symbol: 'P23',
    system: 'cubic',
    laueClass: 'm-3',
    pointGroup: '23',
    centrosymmetric: false,
    extinction: [],
    generalPositions: 12,
    notes: '立方，简单',
    examples: []
  },
  {
    number: 198,
    symbol: 'P2₁3',
    system: 'cubic',
    laueClass: 'm-3',
    pointGroup: '23',
    centrosymmetric: false,
    extinction: ['h00,0k0,00l: h,k,l=2n'],
    generalPositions: 12,
    notes: '立方，手性',
    examples: ['某些蛋白质']
  },
  {
    number: 200,
    symbol: 'Pm-3',
    system: 'cubic',
    laueClass: 'm-3',
    pointGroup: 'm-3',
    centrosymmetric: true,
    extinction: [],
    generalPositions: 24,
    notes: '立方',
    examples: []
  },
  {
    number: 205,
    symbol: 'Pa-3',
    system: 'cubic',
    laueClass: 'm-3',
    pointGroup: 'm-3',
    centrosymmetric: true,
    extinction: ['0kl: k,l=2n', 'h0l: h,l=2n', 'hk0: h,k=2n'],
    generalPositions: 24,
    notes: '立方',
    examples: ['某些金属有机框架MOF']
  },
  {
    number: 213,
    symbol: 'P4₁32',
    system: 'cubic',
    laueClass: 'm-3m',
    pointGroup: '432',
    centrosymmetric: false,
    extinction: ['h00: h=4n', '0k0: k=4n', '00l: l=4n'],
    generalPositions: 24,
    notes: '立方，手性',
    examples: ['β-Mn₁₂O₁₉']
  },
  {
    number: 221,
    symbol: 'Pm-3m',
    system: 'cubic',
    laueClass: 'm-3m',
    pointGroup: 'm-3m',
    centrosymmetric: true,
    extinction: [],
    generalPositions: 48,
    notes: '立方，简单立方，最高对称性',
    examples: ['简单立方金属Po', '钙钛矿SrTiO₃']
  },
  {
    number: 224,
    symbol: 'Pn-3m',
    system: 'cubic',
    laueClass: 'm-3m',
    pointGroup: 'm-3m',
    centrosymmetric: true,
    extinction: ['0kl: k,l=2n', 'h0l: h,l=2n', 'hk0: h,k=2n', 'h00,0k0,00l: h,k,l=2n'],
    generalPositions: 48,
    notes: '立方，萤石型',
    examples: ['萤石CaF₂', 'UO₂']
  },
  {
    number: 225,
    symbol: 'Fm-3m',
    system: 'cubic',
    laueClass: 'm-3m',
    pointGroup: 'm-3m',
    centrosymmetric: true,
    extinction: ['hkl: h,k,l全奇或全偶'],
    generalPositions: 192,
    notes: '立方，面心立方fcc，极常见',
    examples: ['Cu, Ag, Au, Al, Ni', 'NaCl (岩盐)', 'MgO', '面心立方金属']
  },
  {
    number: 227,
    symbol: 'Fd-3m',
    system: 'cubic',
    laueClass: 'm-3m',
    pointGroup: 'm-3m',
    centrosymmetric: true,
    extinction: ['hkl: h,k,l全奇或全偶; h+k,k+l,h+l=4n', '0kl: k,l=4n; k,l=2n', 'h00: h=4n'],
    generalPositions: 192,
    notes: '立方，金刚石和闪锌矿型',
    examples: ['金刚石C', '硅Si', '闪锌矿ZnS', '尖晶石MgAl₂O₄']
  },
  {
    number: 228,
    symbol: 'Fd-3c',
    system: 'cubic',
    laueClass: 'm-3m',
    pointGroup: 'm-3m',
    centrosymmetric: true,
    extinction: ['hkl: h,k,l全奇或全偶; h+k,k+l,h+l=4n', 'hhl: l=4n'],
    generalPositions: 192,
    notes: '立方，萤石变体',
    examples: ['黄铁矿FeS₂']
  },
  {
    number: 229,
    symbol: 'Im-3m',
    system: 'cubic',
    laueClass: 'm-3m',
    pointGroup: 'm-3m',
    centrosymmetric: true,
    extinction: ['hkl: h+k+l=2n'],
    generalPositions: 96,
    notes: '立方，体心立方bcc',
    examples: ['Fe, Cr, W, Mo', 'CsCl型', '体心立方金属']
  },
  {
    number: 230,
    symbol: 'Ia-3d',
    system: 'cubic',
    laueClass: 'm-3m',
    pointGroup: 'm-3m',
    centrosymmetric: true,
    extinction: ['hkl: h+k+l=2n', '0kl: k+l=4n', 'hhl: 2h+l=4n', 'h00: h=4n'],
    generalPositions: 96,
    notes: '立方，体心，最后一个空间群',
    examples: ['石榴石型Y₃Al₅O₁₂', 'Mn₃O₄']
  }
];

