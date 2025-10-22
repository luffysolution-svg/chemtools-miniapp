/**
 * 谱学数据库
 * 包含NMR、质谱(MS)、荧光光谱数据
 */

// ========== NMR数据库 ==========

/**
 * ¹H NMR化学位移数据（相对于TMS，δ ppm）
 */
const h1_nmr_data = [
  {
    group: 'R-CH₃',
    name: '甲基',
    shift_range: '0.8-1.0',
    typical: 0.9,
    multiplicity: '单峰/双峰/三峰',
    integration: 3,
    environment: '脂肪族'
  },
  {
    group: 'R-CH₂-R',
    name: '亚甲基',
    shift_range: '1.2-1.4',
    typical: 1.3,
    multiplicity: '多重峰',
    integration: 2,
    environment: '脂肪族'
  },
  {
    group: 'R-CH-R₂',
    name: '次甲基',
    shift_range: '1.4-1.7',
    typical: 1.5,
    multiplicity: '多重峰',
    integration: 1,
    environment: '脂肪族'
  },
  {
    group: 'C=C-CH₃',
    name: '烯丙基甲基',
    shift_range: '1.6-1.9',
    typical: 1.7,
    multiplicity: '单峰',
    integration: 3,
    environment: '不饱和邻位'
  },
  {
    group: 'Ar-CH₃',
    name: '芳香甲基',
    shift_range: '2.2-2.5',
    typical: 2.3,
    multiplicity: '单峰',
    integration: 3,
    environment: '芳香族'
  },
  {
    group: 'R-O-CH₃',
    name: '甲氧基',
    shift_range: '3.3-3.7',
    typical: 3.5,
    multiplicity: '单峰',
    integration: 3,
    environment: '醚'
  },
  {
    group: 'R-O-CH₂-R',
    name: '醚亚甲基',
    shift_range: '3.4-3.8',
    typical: 3.6,
    multiplicity: '四重峰等',
    integration: 2,
    environment: '醚'
  },
  {
    group: 'R-N-CH₃',
    name: 'N-甲基',
    shift_range: '2.3-2.9',
    typical: 2.5,
    multiplicity: '单峰',
    integration: 3,
    environment: '胺'
  },
  
  // ========== 新增¹H NMR数据（20组）==========
  
  // 杂环化合物
  {
    group: '吡啶-H(α)',
    name: '吡啶α位氢',
    shift_range: '8.4-8.6',
    typical: 8.5,
    multiplicity: '双峰',
    integration: 1,
    environment: '吡啶α位（邻位氮）'
  },
  {
    group: '吡啶-H(β)',
    name: '吡啶β位氢',
    shift_range: '7.2-7.4',
    typical: 7.3,
    multiplicity: '双峰',
    integration: 1,
    environment: '吡啶β位（间位氮）'
  },
  {
    group: '吡啶-H(γ)',
    name: '吡啶γ位氢',
    shift_range: '7.6-7.8',
    typical: 7.7,
    multiplicity: '三重峰',
    integration: 1,
    environment: '吡啶γ位（对位氮）'
  },
  {
    group: '呋喃-H(α)',
    name: '呋喃α位氢',
    shift_range: '7.3-7.4',
    typical: 7.35,
    multiplicity: '双峰',
    integration: 1,
    environment: '呋喃α位（邻位氧）'
  },
  {
    group: '呋喃-H(β)',
    name: '呋喃β位氢',
    shift_range: '6.2-6.4',
    typical: 6.3,
    multiplicity: '双峰',
    integration: 1,
    environment: '呋喃β位（间位氧）'
  },
  {
    group: '噻吩-H(α)',
    name: '噻吩α位氢',
    shift_range: '7.1-7.3',
    typical: 7.2,
    multiplicity: '双峰',
    integration: 1,
    environment: '噻吩α位（邻位硫）'
  },
  {
    group: '噻吩-H(β)',
    name: '噻吩β位氢',
    shift_range: '7.0-7.2',
    typical: 7.1,
    multiplicity: '双峰',
    integration: 1,
    environment: '噻吩β位（间位硫）'
  },
  {
    group: '吡咯-H(α)',
    name: '吡咯α位氢',
    shift_range: '6.6-6.9',
    typical: 6.7,
    multiplicity: '三重峰',
    integration: 1,
    environment: '吡咯α位（邻位NH）'
  },
  {
    group: '吡咯-NH',
    name: '吡咯氮氢',
    shift_range: '8.0-9.0',
    typical: 8.5,
    multiplicity: '宽单峰',
    integration: 1,
    environment: '吡咯NH（可交换）'
  },
  {
    group: '咪唑-H(2)',
    name: '咪唑2位氢',
    shift_range: '7.5-7.8',
    typical: 7.6,
    multiplicity: '单峰',
    integration: 1,
    environment: '咪唑2位（两氮之间）'
  },
  {
    group: '咪唑-H(4,5)',
    name: '咪唑4,5位氢',
    shift_range: '7.0-7.2',
    typical: 7.1,
    multiplicity: '单峰',
    integration: 1,
    environment: '咪唑4,5位'
  },
  
  // 官能团（扩展）
  {
    group: 'R-CO-NH₂',
    name: '酰胺氢',
    shift_range: '5.5-8.5',
    typical: 7.0,
    multiplicity: '宽峰',
    integration: 2,
    environment: '伯酰胺（可交换）'
  },
  {
    group: 'Ar-SO₂-NH₂',
    name: '磺酰胺氢',
    shift_range: '6.5-7.5',
    typical: 7.0,
    multiplicity: '宽单峰',
    integration: 2,
    environment: '磺酰胺（可交换）'
  },
  {
    group: 'R-SH',
    name: '硫醇氢',
    shift_range: '1.0-2.0',
    typical: 1.5,
    multiplicity: '三重峰',
    integration: 1,
    environment: '硫醇（可交换）'
  },
  {
    group: 'R-C≡C-H',
    name: '炔氢',
    shift_range: '1.8-3.0',
    typical: 2.5,
    multiplicity: '单峰',
    integration: 1,
    environment: '末端炔烃'
  },
  {
    group: 'R-NO₂邻位-H',
    name: '硝基邻位氢',
    shift_range: '8.1-8.3',
    typical: 8.2,
    multiplicity: '双峰',
    integration: 1,
    environment: '芳香硝基化合物'
  },
  {
    group: 'R-CN邻位-H',
    name: '氰基邻位氢',
    shift_range: '7.5-7.8',
    typical: 7.65,
    multiplicity: '双峰',
    integration: 1,
    environment: '芳香腈化合物'
  },
  
  // 特殊结构
  {
    group: '烯丙位-CH₂',
    name: '烯丙基亚甲基',
    shift_range: '2.0-2.5',
    typical: 2.2,
    multiplicity: '双峰',
    integration: 2,
    environment: '烯丙位（-C=C-CH₂-）'
  },
  {
    group: '苄位-CH₂',
    name: '苄基亚甲基',
    shift_range: '3.5-4.5',
    typical: 4.0,
    multiplicity: '单峰',
    integration: 2,
    environment: '苄位（Ar-CH₂-）'
  },
  {
    group: 'R-O-CO-CH₃',
    name: '乙酰基甲基',
    shift_range: '1.9-2.3',
    typical: 2.1,
    multiplicity: '单峰',
    integration: 3,
    environment: '乙酸酯'
  },
  {
    group: 'C=C-H',
    name: '烯烃氢',
    shift_range: '4.5-6.0',
    typical: 5.3,
    multiplicity: '双峰/多重峰',
    integration: 1,
    environment: '烯烃'
  },
  {
    group: 'Ar-H',
    name: '芳香氢',
    shift_range: '6.5-8.5',
    typical: 7.3,
    multiplicity: '单峰/双峰/多重峰',
    integration: 1,
    environment: '芳香族'
  },
  {
    group: 'R-CHO',
    name: '醛氢',
    shift_range: '9.5-10.0',
    typical: 9.7,
    multiplicity: '单峰/双峰',
    integration: 1,
    environment: '羰基'
  },
  {
    group: 'R-COOH',
    name: '羧酸氢',
    shift_range: '10.5-12.0',
    typical: 11.0,
    multiplicity: '单峰(可交换)',
    integration: 1,
    environment: '羧基'
  },
  {
    group: 'R-OH',
    name: '醇羟基',
    shift_range: '1.0-5.5',
    typical: 2.5,
    multiplicity: '单峰(可交换)',
    integration: 1,
    environment: '羟基(可交换)'
  },
  {
    group: 'Ar-OH',
    name: '酚羟基',
    shift_range: '4.0-7.0',
    typical: 5.5,
    multiplicity: '单峰(可交换)',
    integration: 1,
    environment: '酚(可交换)'
  },
  {
    group: 'R-NH₂',
    name: '伯胺',
    shift_range: '0.5-5.0',
    typical: 1.5,
    multiplicity: '单峰(可交换)',
    integration: 2,
    environment: '胺(可交换)'
  }
];

/**
 * ¹³C NMR化学位移数据（相对于TMS，δ ppm）
 */
const c13_nmr_data = [
  {
    group: 'R-CH₃',
    name: '脂肪甲基',
    shift_range: '8-30',
    typical: 15,
    environment: '脂肪族'
  },
  {
    group: 'R-CH₂-R',
    name: '脂肪亚甲基',
    shift_range: '15-55',
    typical: 30,
    environment: '脂肪族'
  },
  {
    group: 'R₃C-H',
    name: '脂肪次甲基',
    shift_range: '20-60',
    typical: 40,
    environment: '脂肪族'
  },
  {
    group: 'R₄C',
    name: '季碳',
    shift_range: '30-40',
    typical: 35,
    environment: '脂肪族'
  },
  {
    group: 'C≡C',
    name: '炔碳',
    shift_range: '65-85',
    typical: 75,
    environment: '炔烃'
  },
  {
    group: 'C=C',
    name: '烯碳',
    shift_range: '100-150',
    typical: 130,
    environment: '烯烃'
  },
  {
    group: 'Ar-C',
    name: '芳香碳',
    shift_range: '110-160',
    typical: 128,
    environment: '芳香族'
  },
  {
    group: 'R-O-CH₃',
    name: '醚甲基',
    shift_range: '50-60',
    typical: 55,
    environment: '醚'
  },
  {
    group: 'R-C≡N',
    name: '腈碳',
    shift_range: '115-130',
    typical: 120,
    environment: '腈'
  },
  {
    group: 'R-CHO',
    name: '醛羰基',
    shift_range: '190-205',
    typical: 200,
    environment: '醛'
  },
  {
    group: 'R-CO-R',
    name: '酮羰基',
    shift_range: '205-220',
    typical: 210,
    environment: '酮'
  },
  {
    group: 'R-COOH',
    name: '羧基',
    shift_range: '170-185',
    typical: 178,
    environment: '羧酸'
  },
  {
    group: 'R-COO-R',
    name: '酯羰基',
    shift_range: '160-175',
    typical: 170,
    environment: '酯'
  },
  {
    group: 'Ar-C=O',
    name: '芳香酮',
    shift_range: '190-200',
    typical: 195,
    environment: '芳香酮'
  }
];

// ========== 质谱数据库 ==========

/**
 * 常见离子碎片及其质量
 */
const ms_fragments = [
  {
    fragment: 'M⁺',
    mass: null,
    name: '分子离子峰',
    description: '完整分子失去一个电子',
    intensity: '变化很大',
    info: '提供分子量信息'
  },
  {
    fragment: 'M-15',
    mass: -15,
    name: '失去甲基',
    description: '失去-CH₃',
    typical: '烷烃、芳香烃',
    info: '常见碎片'
  },
  {
    fragment: 'M-17',
    mass: -17,
    name: '失去羟基',
    description: '失去-OH',
    typical: '醇、酚',
    info: '羟基化合物'
  },
  {
    fragment: 'M-18',
    mass: -18,
    name: '失去水',
    description: '失去H₂O',
    typical: '醇、羧酸',
    info: '脱水反应'
  },
  {
    fragment: 'M-28',
    mass: -28,
    name: '失去CO',
    description: '失去一氧化碳',
    typical: '醌、酯、酰胺',
    info: '羰基化合物'
  },
  {
    fragment: 'M-29',
    mass: -29,
    name: '失去乙基或CHO',
    description: '失去-C₂H₅或-CHO',
    typical: '乙基化合物、醛',
    info: '常见碎片'
  },
  {
    fragment: 'M-31',
    mass: -31,
    name: '失去甲氧基',
    description: '失去-OCH₃',
    typical: '甲氧基化合物',
    info: '醚类'
  },
  {
    fragment: 'M-43',
    mass: -43,
    name: '失去乙酰基',
    description: '失去-COCH₃',
    typical: '酮、酯',
    info: '乙酰基化合物'
  },
  {
    fragment: 'M-45',
    mass: -45,
    name: '失去羧基',
    description: '失去-COOH',
    typical: '羧酸',
    info: '脱羧反应'
  },
  {
    fragment: 'M-46',
    mass: -46,
    name: '失去NO₂',
    description: '失去硝基',
    typical: '硝基化合物',
    info: '硝基化合物特征'
  },
  {
    fragment: 'm/z 43',
    mass: 43,
    name: 'CH₃CO⁺',
    description: '乙酰基正离子',
    typical: '甲基酮',
    info: '基峰(常见)'
  },
  {
    fragment: 'm/z 57',
    mass: 57,
    name: 'C₄H₉⁺',
    description: '丁基正离子',
    typical: '丁基化合物',
    info: '常见碎片'
  },
  {
    fragment: 'm/z 77',
    mass: 77,
    name: 'C₆H₅⁺',
    description: '苯基正离子',
    typical: '苯环化合物',
    info: '芳香族特征峰'
  },
  {
    fragment: 'm/z 91',
    mass: 91,
    name: 'C₇H₇⁺',
    description: '苄基/甲苯基正离子',
    typical: '苄基化合物',
    info: '基峰(常见)'
  },

  // ========== 新增复杂分子碎片模式（15种）==========
  
  // 芳香族碎片
  {
    fragment: 'm/z 105',
    mass: 105,
    name: 'C₇H₅O⁺',
    description: '苯甲酰基正离子',
    typical: '苯甲酸酯、苯酮',
    info: '苯甲酰基特征峰',
    structure: 'Ph-CO⁺'
  },
  {
    fragment: 'm/z 107',
    mass: 107,
    name: 'C₇H₇O⁺',
    description: '羟基甲苯基正离子',
    typical: '苯甲醇、甲酚衍生物',
    info: '常见于羟甲基苯化合物',
    structure: 'HOC₆H₄CH₂⁺'
  },
  {
    fragment: 'm/z 122',
    mass: 122,
    name: 'C₇H₆O₂⁺',
    description: '苯甲酸分子离子',
    typical: '苯甲酸及其衍生物',
    info: '苯甲酸M⁺',
    structure: 'Ph-COOH⁺'
  },
  
  // 含氮化合物碎片
  {
    fragment: 'm/z 30',
    mass: 30,
    name: 'CH₂=NH₂⁺',
    description: '亚胺离子',
    typical: '伯胺',
    info: 'McLafferty重排产物'
  },
  {
    fragment: 'm/z 58',
    mass: 58,
    name: 'C₂H₆NO⁺',
    description: '酰胺碎片',
    typical: 'N,N-二甲基酰胺',
    info: 'McLafferty重排',
    structure: 'Me₂N=C=OH⁺'
  },
  {
    fragment: 'm/z 86',
    mass: 86,
    name: 'C₄H₈NO⁺',
    description: '吗啉分子离子',
    typical: '吗啉、N-甲基丙酰胺',
    info: '含氮杂环'
  },
  {
    fragment: 'm/z 93',
    mass: 93,
    name: 'C₆H₇N⁺',
    description: '甲基吡啶离子',
    typical: '吡啶衍生物',
    info: '吡啶环特征峰'
  },
  
  // 含氧化合物碎片
  {
    fragment: 'm/z 45',
    mass: 45,
    name: 'C₂H₅O⁺',
    description: '乙氧基正离子',
    typical: '乙醚、乙酯',
    info: '乙氧基特征',
    structure: 'CH₃CH₂O⁺'
  },
  {
    fragment: 'm/z 59',
    mass: 59,
    name: 'C₂H₃O₂⁺',
    description: '乙酸基正离子',
    typical: '乙酸酯',
    info: 'McLafferty重排',
    structure: 'CH₃COOH⁺'
  },
  {
    fragment: 'm/z 73',
    mass: 73,
    name: 'C₃H₅O₂⁺',
    description: '丙酸基/丙烯酸基',
    typical: '丙酸酯、丙烯酸酯',
    info: 'McLafferty重排产物'
  },
  
  // 生物分子碎片
  {
    fragment: 'm/z 60',
    mass: 60,
    name: 'C₂H₄O₂⁺',
    description: '乙酸分子离子',
    typical: '乙酸、糖类',
    info: 'McLafferty+1峰',
    structure: 'CH₃COOH⁺'
  },
  {
    fragment: 'm/z 149',
    mass: 149,
    name: 'C₅H₅N₄O⁺',
    description: '腺嘌呤碎片',
    typical: '核苷酸、DNA',
    info: '嘌呤碱基特征',
    structure: 'Adenine+1'
  },
  {
    fragment: 'm/z 128',
    mass: 128,
    name: 'C₅H₈N₂O₃⁺',
    description: '谷氨酰胺碎片',
    typical: '氨基酸、肽',
    info: '氨基酸M⁺',
    application: '蛋白质组学'
  },
  
  // 复杂碎裂模式
  {
    fragment: 'McLafferty重排',
    name: 'McLafferty重排',
    description: 'γ-H转移到羰基氧，β-裂解',
    typical: '羰基化合物（酮、醛、酯、酰胺）',
    mechanism: 'γ氢迁移',
    info: '产生烯烃+稳定离子，特征性M-42等',
    example: 'M-42 (C₃H₆), M-56 (C₄H₈)'
  },
  {
    fragment: 'α-裂解',
    name: 'α-裂解',
    description: '羰基α位C-C键断裂',
    typical: '酮、醛、酯',
    mechanism: 'α位碳碳键断裂',
    info: 'RCO⁺ (m/z=R+29) 是基峰',
    example: 'CH₃CO⁺ (m/z 43), PhCO⁺ (m/z 105)'
  }
];

/**
 * 同位素峰型模式
 */
const isotope_patterns = [
  {
    element: 'Cl',
    pattern: 'M : M+2 = 3:1',
    description: '³⁵Cl : ³⁷Cl = 3:1',
    info: '氯原子特征'
  },
  {
    element: 'Br',
    pattern: 'M : M+2 = 1:1',
    description: '⁷⁹Br : ⁸¹Br = 1:1',
    info: '溴原子特征'
  },
  {
    element: 'S',
    pattern: 'M : M+2 = 100:4.4',
    description: '³²S : ³⁴S',
    info: '硫原子贡献'
  },
  {
    element: 'Si',
    pattern: 'M : M+1 : M+2 = 100:5.1:3.4',
    description: '²⁸Si : ²⁹Si : ³⁰Si',
    info: '硅原子特征'
  }
];

// ========== 荧光光谱数据库 ==========

/**
 * 常见荧光染料和标记物
 */
const fluorescence_data = [
  {
    name: '荧光素(Fluorescein)',
    excitation: 490,
    emission: 520,
    stokes_shift: 30,
    color: '绿色',
    quantum_yield: 0.93,
    applications: ['生物成像', '细胞标记', 'ELISA'],
    solvent: '水/缓冲液',
    pH_sensitive: true
  },
  {
    name: '罗丹明B (Rhodamine B)',
    excitation: 540,
    emission: 625,
    stokes_shift: 85,
    color: '橙红色',
    quantum_yield: 0.70,
    applications: ['激光染料', '生物染色', '示踪'],
    solvent: '水/乙醇',
    pH_sensitive: false
  },
  {
    name: 'DAPI',
    excitation: 358,
    emission: 461,
    stokes_shift: 103,
    color: '蓝色',
    quantum_yield: 0.60,
    applications: ['DNA染色', '细胞核标记', '荧光显微镜'],
    solvent: '水',
    specificity: 'DNA结合'
  },
  {
    name: 'GFP (绿色荧光蛋白)',
    excitation: 488,
    emission: 509,
    stokes_shift: 21,
    color: '绿色',
    quantum_yield: 0.79,
    applications: ['蛋白标记', '活细胞成像', '基因表达'],
    biological: true,
    photobleaching: '中等'
  },
  {
    name: 'Cy3',
    excitation: 550,
    emission: 570,
    stokes_shift: 20,
    color: '橙色',
    quantum_yield: 0.15,
    applications: ['DNA/RNA标记', '免疫荧光', 'FISH'],
    solvent: '水/DMF',
    photostability: '好'
  },
  {
    name: 'Cy5',
    excitation: 649,
    emission: 670,
    stokes_shift: 21,
    color: '红色',
    quantum_yield: 0.28,
    applications: ['多色成像', 'DNA测序', '蛋白分析'],
    solvent: '水/DMF',
    photostability: '好'
  },
  {
    name: 'FITC (异硫氰酸荧光素)',
    excitation: 495,
    emission: 519,
    stokes_shift: 24,
    color: '绿色',
    quantum_yield: 0.90,
    applications: ['抗体标记', '流式细胞术', '免疫组化'],
    solvent: '水/缓冲液',
    reactive_group: '-N=C=S'
  },
  {
    name: 'Texas Red',
    excitation: 589,
    emission: 615,
    stokes_shift: 26,
    color: '红色',
    quantum_yield: 0.92,
    applications: ['多重标记', '生物成像', '免疫荧光'],
    solvent: '水',
    photostability: '极好'
  },
  {
    name: '尼罗红 (Nile Red)',
    excitation: 552,
    emission: 636,
    stokes_shift: 84,
    color: '红色',
    quantum_yield: 0.38,
    applications: ['脂质染色', '膜研究', '溶剂极性探针'],
    solvent: '有机溶剂',
    solvatochromic: true
  },
  {
    name: '香豆素6',
    excitation: 466,
    emission: 504,
    stokes_shift: 38,
    color: '绿色',
    quantum_yield: 0.78,
    applications: ['激光染料', '太阳能电池', '传感器'],
    solvent: '乙醇',
    photostability: '中等'
  },
  {
    name: '吖啶橙 (Acridine Orange)',
    excitation: 502,
    emission: '525/650',
    color: '绿色/红色',
    quantum_yield: 0.46,
    applications: ['核酸染色', 'DNA/RNA区分', '细胞活力'],
    solvent: '水',
    metachromatic: 'DNA绿色, RNA红色'
  },
  {
    name: '量子点 QD525',
    excitation: '宽范围',
    emission: 525,
    color: '绿色',
    quantum_yield: 0.70,
    applications: ['生物标记', '长时程成像', '多重标记'],
    photostability: '极好',
    size: '~5 nm'
  },
  {
    name: '量子点 QD605',
    excitation: '宽范围',
    emission: 605,
    color: '橙色',
    quantum_yield: 0.65,
    applications: ['生物标记', '多色成像', '传感器'],
    photostability: '极好',
    size: '~8 nm'
  },

  // ========== 新增荧光染料（10种）==========
  
  // 近红外染料（NIR）
  {
    name: 'ICG (吲哚菁绿)',
    excitation: 780,
    emission: 820,
    stokes_shift: 40,
    color: '近红外',
    quantum_yield: 0.13,
    applications: ['生物医学成像', '血管造影', '肿瘤成像', 'NIR-I窗口'],
    solvent: '水/血液',
    FDA_approved: true,
    penetration: '深层组织成像'
  },
  {
    name: 'Cy7',
    excitation: 750,
    emission: 773,
    stokes_shift: 23,
    color: '近红外',
    quantum_yield: 0.28,
    applications: ['活体成像', 'DNA标记', '蛋白质标记', 'NIR-I窗口'],
    solvent: '水/DMF',
    photostability: '良好',
    penetration: '组织穿透力强'
  },
  {
    name: 'Cy7.5',
    excitation: 788,
    emission: 808,
    stokes_shift: 20,
    color: '近红外',
    quantum_yield: 0.25,
    applications: ['深层组织成像', '肿瘤检测', '手术导航'],
    solvent: '水/DMF',
    photostability: '好',
    penetration: 'NIR-I窗口，深层穿透'
  },
  {
    name: 'IR-820',
    excitation: 820,
    emission: 850,
    stokes_shift: 30,
    color: '近红外',
    quantum_yield: 0.10,
    applications: ['光热治疗', 'NIR成像', '光动力治疗'],
    solvent: '乙醇/DMSO',
    photothermal: '高光热转换效率',
    penetration: 'NIR-I窗口'
  },
  {
    name: 'IR-1061',
    excitation: 1061,
    emission: 1080,
    stokes_shift: 19,
    color: '近红外II区',
    quantum_yield: 0.05,
    applications: ['NIR-II生物成像', '血管成像', '脑成像'],
    solvent: '有机溶剂',
    penetration: '超深层组织穿透（NIR-II窗口）',
    biocompatibility: '需表面修饰'
  },
  
  // 双光子激发染料
  {
    name: 'Cascade Blue',
    excitation: 400,
    excitation_2P: 760,
    emission: 420,
    color: '蓝色',
    quantum_yield: 0.54,
    applications: ['双光子显微镜', '深层组织成像', '神经成像'],
    two_photon: true,
    cross_section: '12 GM',
    photostability: '优秀'
  },
  {
    name: 'Alexa Fluor 488',
    excitation: 495,
    excitation_2P: 800,
    emission: 519,
    color: '绿色',
    quantum_yield: 0.92,
    applications: ['免疫荧光', '双光子成像', '活细胞成像'],
    two_photon: true,
    cross_section: '18 GM',
    photostability: '极佳',
    pH_range: '4-10'
  },
  {
    name: 'Alexa Fluor 594',
    excitation: 590,
    emission: 617,
    stokes_shift: 27,
    color: '红色',
    quantum_yield: 0.66,
    applications: ['多重标记', '共聚焦显微镜', '免疫组化'],
    photostability: '极佳',
    pH_insensitive: true,
    brightness: '极高'
  },
  
  // 新型荧光染料
  {
    name: 'Atto 647N',
    excitation: 644,
    emission: 669,
    stokes_shift: 25,
    color: '深红',
    quantum_yield: 0.65,
    applications: ['单分子检测', 'STORM超分辨', 'STED显微镜'],
    photostability: '极强',
    photobleaching: '极低',
    FRET_pair: 'Atto 550'
  },
  {
    name: 'Janelia Fluor 646',
    excitation: 646,
    emission: 664,
    stokes_shift: 18,
    color: '红色',
    quantum_yield: 0.54,
    applications: ['活细胞成像', '神经元标记', 'FRAP/FRET'],
    photostability: '优异',
    cell_permeability: '优秀',
    bioorthogonal: 'HaloTag配体'
  }
];

/**
 * 荧光量子产率参考标准
 */
const quantum_yield_standards = [
  {
    name: '硫酸奎宁',
    solvent: '0.1M H₂SO₄',
    excitation: 350,
    quantum_yield: 0.546,
    temperature: '25°C'
  },
  {
    name: '荧光素',
    solvent: '0.1M NaOH',
    excitation: 490,
    quantum_yield: 0.95,
    temperature: '25°C'
  },
  {
    name: '罗丹明6G',
    solvent: '乙醇',
    excitation: 530,
    quantum_yield: 0.95,
    temperature: '25°C'
  }
];

// 搜索功能
function searchNMR(keyword, type = 'H1') {
  const data = type === 'H1' ? h1_nmr_data : c13_nmr_data;
  const lowerKeyword = keyword.toLowerCase();
  return data.filter(item => 
    item.group.toLowerCase().includes(lowerKeyword) ||
    item.name.includes(keyword) ||
    item.environment.includes(keyword)
  );
}

function searchMS(keyword) {
  const lowerKeyword = keyword.toLowerCase();
  return ms_fragments.filter(item => 
    item.fragment.toLowerCase().includes(lowerKeyword) ||
    item.name.includes(keyword) ||
    item.description.includes(keyword)
  );
}

function searchFluorescence(keyword) {
  const lowerKeyword = keyword.toLowerCase();
  return fluorescence_data.filter(item => 
    item.name.toLowerCase().includes(lowerKeyword) ||
    item.color.includes(keyword) ||
    item.applications.some(app => app.includes(keyword))
  );
}

// 根据化学位移范围查找可能的基团
function identifyGroupByShift(shift, type = 'H1') {
  const data = type === 'H1' ? h1_nmr_data : c13_nmr_data;
  return data.filter(item => {
    const range = item.shift_range.split('-').map(parseFloat);
    return shift >= range[0] && shift <= range[1];
  });
}

module.exports = {
  h1_nmr_data,
  c13_nmr_data,
  ms_fragments,
  isotope_patterns,
  fluorescence_data,
  quantum_yield_standards,
  searchNMR,
  searchMS,
  searchFluorescence,
  identifyGroupByShift
};

