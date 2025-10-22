/**
 * 有机材料数据库 v2.0
 * 数据来源：NIST, Materials Project, 权威期刊文献
 * 更新日期：2025-10-16
 */

// 核心数据 - 按需加载
const organicMaterialsCore = [
  // 导电聚合物（7种）
  {
    id: 'OM001',
    name: '聚吡咯',
    englishName: 'Polypyrrole',
    abbreviation: 'PPy',
    formula: '(C4H3N)n',
    cas: '30604-81-0',
    category: '导电聚合物',
    conductivity: '10-100 S/cm',
    bandgap: '2.8-3.2 eV',
    applications: ['电池电极', '传感器', '电致变色', '超级电容器'],
    properties: {
      stability: '良好（空气稳定）',
      processability: '电化学合成/化学氧化',
      color: '黑色',
      density: '1.5 g/cm³'
    },
    dataSource: 'NIST, Adv. Mater. 2018'
  },
  {
    id: 'OM002',
    name: '聚苯胺',
    englishName: 'Polyaniline',
    abbreviation: 'PANI',
    formula: '(C6H5NH)n',
    cas: '25233-30-1',
    category: '导电聚合物',
    conductivity: '0.1-10 S/cm',
    bandgap: '2.5-3.0 eV',
    applications: ['防腐涂层', '电磁屏蔽', '传感器', '柔性电子'],
    properties: {
      stability: '优秀（耐环境）',
      processability: '可掺杂调控',
      color: '蓝绿色至黑色',
      density: '1.3 g/cm³'
    },
    dataSource: 'NIST, Chem. Rev. 2020'
  },
  {
    id: 'OM003',
    name: '聚噻吩',
    englishName: 'Polythiophene',
    abbreviation: 'PT',
    formula: '(C4H2S)n',
    cas: '25233-34-5',
    category: '导电聚合物',
    conductivity: '10-1000 S/cm',
    bandgap: '2.0-2.5 eV',
    applications: ['有机太阳能电池', 'OLED', '传感器', '生物电子'],
    properties: {
      stability: '较好（需封装）',
      processability: '溶液加工',
      color: '红色至黑色',
      mobility: '0.1-1 cm²/V·s'
    },
    dataSource: 'Nature Mater. 2019'
  },
  {
    id: 'OM004',
    name: 'PEDOT:PSS',
    englishName: 'PEDOT:PSS',
    abbreviation: 'PEDOT:PSS',
    formula: '(C6H4O2S)n·(C6H8O8S2)m',
    cas: '155090-83-8',
    category: '导电聚合物',
    conductivity: '300-5000 S/cm',
    bandgap: '1.6-1.7 eV',
    applications: ['透明电极', '抗静电涂层', '有机电子', '柔性显示'],
    properties: {
      stability: '极佳（水分散稳定）',
      processability: '水溶液印刷',
      color: '深蓝色（透明薄膜）',
      transmittance: '>85% (可见光)'
    },
    dataSource: 'NIST, Adv. Funct. Mater. 2021'
  },
  {
    id: 'OM005',
    name: '聚(3-己基噻吩)',
    englishName: 'Poly(3-hexylthiophene)',
    abbreviation: 'P3HT',
    formula: '(C10H14S)n',
    cas: '104934-50-1',
    category: '导电聚合物',
    conductivity: '0.1-10 S/cm',
    bandgap: '1.9-2.1 eV',
    applications: ['有机太阳能电池', 'OFET', '生物传感'],
    properties: {
      stability: '中等（需封装）',
      processability: '溶液加工',
      mobility: '0.1-0.6 cm²/V·s',
      regioregularity: '>95%（高性能）'
    },
    dataSource: 'Science 2020'
  },
  {
    id: 'OM006',
    name: 'PANI导电水凝胶',
    englishName: 'PANI Conductive Hydrogel',
    abbreviation: 'PANI-Gel',
    formula: '(C6H5NH)n·H2O',
    cas: 'N/A',
    category: '导电聚合物',
    conductivity: '1-100 S/cm',
    bandgap: '2.5 eV',
    applications: ['柔性传感器', '可穿戴设备', '人工肌肉', '生物电极'],
    properties: {
      stability: '水环境稳定',
      processability: '原位聚合',
      elasticity: '可拉伸>500%',
      biocompatibility: '良好'
    },
    dataSource: 'Adv. Mater. 2022'
  },
  {
    id: 'OM007',
    name: 'TTF-TCNQ',
    englishName: 'Tetrathiafulvalene-Tetracyanoquinodimethane',
    abbreviation: 'TTF-TCNQ',
    formula: 'C6H4S4·C12H4N4',
    cas: '70407-18-2',
    category: '导电聚合物',
    conductivity: '500-1000 S/cm',
    bandgap: '0.3 eV',
    applications: ['有机导体', '分子电子学', '热电材料'],
    properties: {
      stability: '空气中稳定',
      processability: '升华法',
      type: '准一维导体',
      transition: '54K 金属-绝缘体转变'
    },
    dataSource: 'Nature 1973 (历史性工作)'
  },

  // 有机半导体 - 小分子（10种）
  {
    id: 'OM010',
    name: '并五苯',
    englishName: 'Pentacene',
    abbreviation: 'PEN',
    formula: 'C22H14',
    cas: '135-48-8',
    category: '有机半导体',
    mobility: '0.1-5 cm²/V·s',
    bandgap: '1.8-2.2 eV',
    molarMass: 278.35,
    applications: ['有机薄膜晶体管', 'OLED', '有机太阳能'],
    properties: {
      stability: '对氧敏感（需封装）',
      processability: '真空蒸镀',
      color: '深蓝色',
      crystal: '三斜晶系'
    },
    dataSource: 'NIST, Appl. Phys. Lett. 2019'
  },
  {
    id: 'OM011',
    name: '红荧烯',
    englishName: 'Rubrene',
    abbreviation: 'RUB',
    formula: 'C42H28',
    cas: '517-51-1',
    category: '有机半导体',
    mobility: '15-40 cm²/V·s',
    bandgap: '2.2 eV',
    molarMass: 532.68,
    applications: ['高性能OFET', '单晶器件', '激光'],
    properties: {
      stability: '单晶稳定',
      processability: '溶液生长/升华',
      color: '橙红色',
      crystal: '单斜晶系'
    },
    dataSource: 'Nature Mater. 2006'
  },
  {
    id: 'OM012',
    name: '酞菁铜',
    englishName: 'Copper phthalocyanine',
    abbreviation: 'CuPc',
    formula: 'C32H16CuN8',
    cas: '147-14-8',
    category: '有机半导体',
    mobility: '0.01-0.1 cm²/V·s',
    bandgap: '1.5-2.0 eV',
    molarMass: 576.07,
    applications: ['有机光伏', '气体传感', '光催化'],
    properties: {
      stability: '极佳（热稳定>400°C）',
      processability: '真空蒸镀/溶液',
      color: '蓝色',
      absorption: '600-750 nm'
    },
    dataSource: 'NIST, Chem. Soc. Rev. 2018'
  },
  {
    id: 'OM013',
    name: 'C8-BTBT',
    englishName: 'C8-BTBT',
    abbreviation: 'C8-BTBT',
    formula: 'C28H38S2',
    cas: '869718-97-8',
    category: '有机半导体',
    mobility: '10-30 cm²/V·s',
    bandgap: '2.8 eV',
    molarMass: 438.73,
    applications: ['超高迁移率OFET', '柔性电子', '射频标签'],
    properties: {
      stability: '优秀',
      processability: '溶液印刷',
      crystal: '层状结构',
      performance: '业界最高迁移率之一'
    },
    dataSource: 'Nature Commun. 2012'
  },
  {
    id: 'OM014',
    name: 'DNTT',
    englishName: 'Dinaphtho[2,3-b:2\',3\'-f]thieno[3,2-b]thiophene',
    abbreviation: 'DNTT',
    formula: 'C24H12S2',
    cas: '121123-72-0',
    category: '有机半导体',
    mobility: '8-11 cm²/V·s',
    bandgap: '3.0 eV',
    molarMass: 364.48,
    applications: ['高稳定性OFET', '柔性显示', '传感器阵列'],
    properties: {
      stability: '优异（空气稳定）',
      processability: '真空蒸镀',
      crystal: 'herringbone堆积',
      threshold: '低阈值电压'
    },
    dataSource: 'Adv. Mater. 2011'
  },
  {
    id: 'OM015',
    name: 'F8BT',
    englishName: 'Poly(9,9-dioctylfluorene-alt-benzothiadiazole)',
    abbreviation: 'F8BT',
    formula: '(C33H40N2S)n',
    cas: '210347-52-7',
    category: '有机半导体',
    mobility: '0.001-0.01 cm²/V·s',
    bandgap: '2.1 eV',
    applications: ['黄绿OLED', '激光二极管', '光伏器件'],
    properties: {
      stability: '良好',
      processability: '溶液加工',
      emission: '540 nm (绿光)',
      quantum_yield: '40-60%'
    },
    dataSource: 'Appl. Phys. Lett. 2000'
  },
  {
    id: 'OM016',
    name: 'P3HT纳米线',
    englishName: 'P3HT Nanowires',
    abbreviation: 'P3HT-NW',
    formula: '(C10H14S)n',
    cas: '104934-50-1',
    category: '有机半导体',
    mobility: '0.2-1.0 cm²/V·s',
    bandgap: '1.9 eV',
    applications: ['高效太阳能电池', '纳米传感器'],
    properties: {
      stability: '高结晶度增强稳定性',
      processability: '自组装形成',
      morphology: '一维纳米结构',
      crystallinity: '>90%'
    },
    dataSource: 'Nano Lett. 2015'
  },
  {
    id: 'OM017',
    name: '6,13-双(三异丙基硅乙炔基)并五苯',
    englishName: 'TIPS-pentacene',
    abbreviation: 'TIPS-PEN',
    formula: 'C44H54Si2',
    cas: '172463-43-9',
    category: '有机半导体',
    mobility: '1-5 cm²/V·s',
    bandgap: '1.9 eV',
    molarMass: 639.07,
    applications: ['溶液加工OFET', '柔性电子', '印刷电路'],
    properties: {
      stability: '优于并五苯',
      processability: '溶液印刷',
      solubility: '优秀（有机溶剂）',
      crystal: '大面积单晶'
    },
    dataSource: 'J. Am. Chem. Soc. 2001'
  },
  {
    id: 'OM018',
    name: 'DPP聚合物',
    englishName: 'Diketopyrrolopyrrole Polymer',
    abbreviation: 'DPP',
    formula: '(C18H12N2O2)n',
    cas: 'N/A',
    category: '有机半导体',
    mobility: '1-10 cm²/V·s',
    bandgap: '1.3-1.5 eV',
    applications: ['有机太阳能电池', 'OFET', 'NIR探测器'],
    properties: {
      stability: '优秀',
      processability: '溶液加工',
      absorption: 'NIR区域',
      performance: '高迁移率+窄带隙'
    },
    dataSource: 'Acc. Chem. Res. 2014'
  },
  {
    id: 'OM019',
    name: '苝四甲酸二酰亚胺',
    englishName: 'Perylene diimide',
    abbreviation: 'PDI',
    formula: 'C24H10N2O4',
    cas: '84878-87-9',
    category: '有机半导体',
    mobility: '0.1-1.0 cm²/V·s',
    bandgap: '2.1 eV',
    molarMass: 390.35,
    applications: ['n型有机半导体', '太阳能电池受体', '荧光染料'],
    properties: {
      stability: '极佳（光稳定）',
      processability: '溶液/蒸镀',
      color: '红色',
      electron_affinity: '3.9 eV'
    },
    dataSource: 'Chem. Rev. 2012'
  },

  // ========== 新增材料（30种）v2.1.0 ==========
  
  // MOF材料（8种）
  {
    id: 'OM020',
    name: 'MOF-5',
    englishName: 'MOF-5 (IRMOF-1)',
    abbreviation: 'MOF-5',
    formula: 'Zn4O(BDC)3',
    cas: '309726-85-8',
    category: 'MOF材料',
    applications: ['气体储存（H₂, CH₄）', '气体分离', '催化载体'],
    properties: {
      structure: '立方晶系，Fm-3m',
      surfaceArea: '3800 m²/g',
      poreSize: '1.1-1.5 nm',
      stability: '空气中不稳定，易水解',
      density: '0.59 g/cm³'
    },
    dataSource: 'Nature 1999, 402, 276'
  },
  {
    id: 'OM021',
    name: 'UiO-66',
    englishName: 'UiO-66',
    abbreviation: 'UiO-66',
    formula: 'Zr6O4(OH)4(BDC)6',
    cas: '1058035-54-9',
    category: 'MOF材料',
    applications: ['催化剂', '药物递送', 'CO₂捕获', '水净化'],
    properties: {
      structure: '立方晶系，Fm-3m',
      surfaceArea: '1200-1500 m²/g',
      poreSize: '0.6 nm',
      stability: '优异（水稳定、酸碱稳定）',
      thermalStability: '500°C'
    },
    dataSource: 'J. Am. Chem. Soc. 2008'
  },
  {
    id: 'OM022',
    name: 'HKUST-1',
    englishName: 'HKUST-1 (Cu-BTC)',
    abbreviation: 'HKUST-1',
    formula: 'Cu3(BTC)2',
    cas: '51937-85-0',
    category: 'MOF材料',
    applications: ['气体储存', '气体分离', '催化', '传感器'],
    properties: {
      structure: '立方晶系',
      surfaceArea: '1500-2000 m²/g',
      poreSize: '0.9 nm',
      stability: '中等（对水敏感）',
      color: '蓝色'
    },
    dataSource: 'Science 1999, 283, 1148'
  },
  {
    id: 'OM023',
    name: 'ZIF-8',
    englishName: 'Zeolitic Imidazolate Framework-8',
    abbreviation: 'ZIF-8',
    formula: 'Zn(MeIM)2',
    cas: '1046807-86-8',
    category: 'MOF材料',
    applications: ['膜分离', '催化', '药物递送', '传感器'],
    properties: {
      structure: '立方沸石拓扑',
      surfaceArea: '1600-1800 m²/g',
      poreSize: '0.34 nm (窗口)',
      stability: '优异（水热稳定）',
      thermalStability: '400°C'
    },
    dataSource: 'Proc. Natl. Acad. Sci. 2006'
  },
  {
    id: 'OM024',
    name: 'MIL-101(Cr)',
    englishName: 'MIL-101(Cr)',
    abbreviation: 'MIL-101',
    formula: 'Cr3F(H2O)2O[(O2C)-C6H4-(CO2)]3',
    cas: 'N/A',
    category: 'MOF材料',
    applications: ['气体吸附', '催化', '药物递送', '储能'],
    properties: {
      structure: '立方晶系',
      surfaceArea: '4100-5900 m²/g（最高之一）',
      poreSize: '2.9-3.4 nm',
      stability: '良好（水稳定）',
      thermalStability: '275°C'
    },
    dataSource: 'Science 2005, 309, 2040'
  },
  {
    id: 'OM025',
    name: 'PCN-222',
    englishName: 'PCN-222 (MOF-545)',
    abbreviation: 'PCN-222',
    formula: 'Zr6(μ3-O)8(OH)8(TCPP)2',
    cas: 'N/A',
    category: 'MOF材料',
    applications: ['光催化', '光动力治疗', '传感器', '人工光合成'],
    properties: {
      structure: '六方晶系',
      surfaceArea: '2200 m²/g',
      poreSize: '3.7 nm',
      stability: '优异',
      photoactivity: '卟啉基光活性'
    },
    dataSource: 'J. Am. Chem. Soc. 2012'
  },
  {
    id: 'OM026',
    name: 'CAU-1',
    englishName: 'CAU-1',
    abbreviation: 'CAU-1',
    formula: '[Al4(OH)2(OCH3)4(H2N-BDC)3]',
    cas: 'N/A',
    category: 'MOF材料',
    applications: ['CO₂捕获', '药物递送', '催化'],
    properties: {
      structure: '单斜晶系',
      surfaceArea: '1000 m²/g',
      poreSize: '0.46-0.54 nm',
      stability: '水稳定',
      functionalization: '氨基功能化'
    },
    dataSource: 'Chem. Commun. 2011'
  },
  {
    id: 'OM027',
    name: 'NU-1000',
    englishName: 'NU-1000',
    abbreviation: 'NU-1000',
    formula: 'Zr6(μ3-O)8(OH)8(TBAPy)2',
    cas: 'N/A',
    category: 'MOF材料',
    applications: ['催化', '气体储存', '解毒剂'],
    properties: {
      structure: '六方晶系',
      surfaceArea: '2320 m²/g',
      poreSize: '3.0 nm',
      stability: '优异',
      openMetal: '开放金属位点'
    },
    dataSource: 'Chem. Sci. 2013'
  },

  // 发光材料（8种）
  {
    id: 'OM028',
    name: 'Alq₃',
    englishName: 'Tris(8-hydroxyquinolinato)aluminium',
    abbreviation: 'Alq3',
    formula: 'Al(C9H6NO)3',
    cas: '2085-33-8',
    category: '发光材料',
    molarMass: 459.43,
    applications: ['OLED发光层', '绿光OLED', '显示器'],
    properties: {
      emission: '530 nm（绿光）',
      quantumYield: '20-30%',
      stability: '良好',
      processability: '真空蒸镀',
      HOMO: '-5.8 eV',
      LUMO: '-3.0 eV'
    },
    dataSource: 'Appl. Phys. Lett. 1987'
  },
  {
    id: 'OM029',
    name: 'Ir(ppy)₃',
    englishName: 'Tris(2-phenylpyridine)iridium',
    abbreviation: 'Ir(ppy)3',
    formula: 'Ir(C11H8N)3',
    cas: '94928-86-6',
    category: '发光材料',
    molarMass: 654.75,
    applications: ['磷光OLED', '绿光发射', '照明显示'],
    properties: {
      emission: '510 nm（绿光）',
      quantumYield: '95-100%（三线态）',
      lifetime: 'μs级（磷光）',
      processability: '真空蒸镀/溶液',
      HOMO: '-5.4 eV',
      LUMO: '-2.7 eV'
    },
    dataSource: 'Appl. Phys. Lett. 1999'
  },
  {
    id: 'OM030',
    name: 'TPD',
    englishName: 'N,N\'-Bis(3-methylphenyl)-N,N\'-diphenylbenzidine',
    abbreviation: 'TPD',
    formula: 'C38H32N2',
    cas: '65181-78-4',
    category: '发光材料',
    molarMass: 516.67,
    applications: ['OLED空穴传输层', 'p型有机材料', '太阳能电池'],
    properties: {
      holeMobility: '10⁻³ cm²/V·s',
      Tg: '60°C',
      processability: '真空蒸镀',
      HOMO: '-5.4 eV',
      LUMO: '-2.3 eV'
    },
    dataSource: 'Synth. Met. 1997'
  },
  {
    id: 'OM031',
    name: 'NPB',
    englishName: 'N,N\'-Di(1-naphthyl)-N,N\'-diphenyl-benzidine',
    abbreviation: 'NPB',
    formula: 'C44H32N2',
    cas: '123847-85-8',
    category: '发光材料',
    molarMass: 588.73,
    applications: ['OLED空穴传输', '蓝光OLED', '显示器'],
    properties: {
      holeMobility: '2×10⁻³ cm²/V·s',
      Tg: '96°C',
      stability: '优于TPD',
      processability: '真空蒸镀',
      HOMO: '-5.4 eV'
    },
    dataSource: 'Appl. Phys. Lett. 1998'
  },
  {
    id: 'OM032',
    name: 'TAPC',
    englishName: '1,1-Bis(4-(N,N-di(p-tolyl)amino)phenyl)cyclohexane',
    abbreviation: 'TAPC',
    formula: 'C44H42N2',
    cas: '889949-29-9',
    category: '发光材料',
    molarMass: 602.81,
    applications: ['OLED空穴传输', '高性能OLED', 'QLED'],
    properties: {
      holeMobility: '10⁻² cm²/V·s',
      Tg: '149°C',
      stability: '极佳',
      processability: '真空蒸镀',
      HOMO: '-5.5 eV'
    },
    dataSource: 'Adv. Mater. 2011'
  },
  {
    id: 'OM033',
    name: 'BCP',
    englishName: '2,9-Dimethyl-4,7-diphenyl-1,10-phenanthroline',
    abbreviation: 'BCP',
    formula: 'C26H20N2',
    cas: '1662-01-7',
    category: '发光材料',
    molarMass: 360.45,
    applications: ['OLED激子阻挡层', '电子传输', 'OLED器件'],
    properties: {
      bandgap: '3.5 eV',
      tripletEnergy: '2.5 eV',
      processability: '真空蒸镀',
      HOMO: '-6.7 eV',
      LUMO: '-3.2 eV'
    },
    dataSource: 'Appl. Phys. Lett. 1996'
  },
  {
    id: 'OM034',
    name: 'Bphen',
    englishName: '4,7-Diphenyl-1,10-phenanthroline',
    abbreviation: 'Bphen',
    formula: 'C24H16N2',
    cas: '1662-01-7',
    category: '发光材料',
    molarMass: 332.40,
    applications: ['OLED电子传输', '激子阻挡', 'OLED阴极界面'],
    properties: {
      electronMobility: '3.5×10⁻⁴ cm²/V·s',
      Tg: '62°C',
      processability: '真空蒸镀',
      HOMO: '-6.4 eV',
      LUMO: '-2.9 eV'
    },
    dataSource: 'Appl. Phys. Lett. 1998'
  },
  {
    id: 'OM035',
    name: 'Spiro-OMeTAD',
    englishName: '2,2\',7,7\'-Tetrakis(N,N-di-p-methoxyphenylamine)-9,9\'-spirobifluorene',
    abbreviation: 'Spiro-OMeTAD',
    formula: 'C81H68N4O8',
    cas: '207739-72-8',
    category: '发光材料',
    molarMass: 1225.42,
    applications: ['钙钛矿太阳能电池空穴传输', 'OLED', '固态染料敏化'],
    properties: {
      holeMobility: '2×10⁻⁴ cm²/V·s',
      Tg: '125°C',
      processability: '溶液旋涂',
      HOMO: '-5.0 eV',
      LUMO: '-2.0 eV'
    },
    dataSource: 'Nature 2013'
  },

  // 生物材料（7种）
  {
    id: 'OM036',
    name: '壳聚糖',
    englishName: 'Chitosan',
    abbreviation: 'CS',
    formula: '(C6H11NO4)n',
    cas: '9012-76-4',
    category: '生物材料',
    applications: ['组织工程', '药物递送', '伤口敷料', '抗菌材料'],
    properties: {
      biocompatibility: '优异',
      biodegradable: '可生物降解',
      antibacterial: '天然抗菌',
      processability: '水溶液/膜/支架',
      degreeDM: '脱乙酰度>70%'
    },
    dataSource: 'Biomaterials 2000'
  },
  {
    id: 'OM037',
    name: '聚乳酸',
    englishName: 'Polylactic acid',
    abbreviation: 'PLA',
    formula: '(C3H4O2)n',
    cas: '9051-89-2',
    category: '生物材料',
    applications: ['3D打印', '组织工程支架', '可降解包装', '药物缓释'],
    properties: {
      biocompatibility: '优秀',
      biodegradable: '可完全降解',
      Tm: '150-180°C',
      Tg: '55-65°C',
      processability: '注塑/3D打印/纤维'
    },
    dataSource: 'Biomacromolecules 2008'
  },
  {
    id: 'OM038',
    name: '聚己内酯',
    englishName: 'Polycaprolactone',
    abbreviation: 'PCL',
    formula: '(C6H10O2)n',
    cas: '24980-41-4',
    category: '生物材料',
    applications: ['组织工程', '药物缓释', '缝合线', '骨修复'],
    properties: {
      biocompatibility: '优异',
      degradationTime: '2-4年',
      Tm: '60°C',
      Tg: '-60°C',
      processability: '易加工成型'
    },
    dataSource: 'Adv. Drug Deliv. Rev. 2001'
  },
  {
    id: 'OM039',
    name: '透明质酸',
    englishName: 'Hyaluronic acid',
    abbreviation: 'HA',
    formula: '(C14H21NO11)n',
    cas: '9004-61-9',
    category: '生物材料',
    applications: ['软组织填充', '关节润滑', '化妆品', '药物递送'],
    properties: {
      biocompatibility: '极佳（人体天然）',
      biodegradable: '可降解',
      hydrophilicity: '高亲水性',
      viscosity: '高粘度',
      molecularWeight: '10⁴-10⁷ Da'
    },
    dataSource: 'Chem. Rev. 2011'
  },
  {
    id: 'OM040',
    name: '胶原蛋白',
    englishName: 'Collagen',
    abbreviation: 'Col',
    formula: '(C5H9NO)n',
    cas: '9007-34-5',
    category: '生物材料',
    applications: ['皮肤修复', '组织工程', '伤口愈合', '化妆品'],
    properties: {
      biocompatibility: '天然（人体主要结构蛋白）',
      biodegradable: '可降解',
      cellAdhesion: '优异细胞粘附',
      types: 'I、II、III型等',
      denaturation: '热敏性'
    },
    dataSource: 'Biomaterials 2000'
  },
  {
    id: 'OM041',
    name: '聚乙醇酸',
    englishName: 'Polyglycolic acid',
    abbreviation: 'PGA',
    formula: '(C2H2O2)n',
    cas: '26009-03-0',
    category: '生物材料',
    applications: ['可吸收缝合线', '组织工程', '药物递送', '骨钉'],
    properties: {
      biocompatibility: '优异',
      degradationTime: '6-12个月',
      Tm: '220-225°C',
      crystallinity: '高结晶度',
      strength: '高机械强度'
    },
    dataSource: 'J. Biomed. Mater. Res. 1991'
  },
  {
    id: 'OM042',
    name: '丝素蛋白',
    englishName: 'Silk fibroin',
    abbreviation: 'SF',
    formula: '(C15H23N5O6)n',
    cas: '9007-30-1',
    category: '生物材料',
    applications: ['组织工程', '药物递送', '伤口敷料', '植入材料'],
    properties: {
      biocompatibility: '优异',
      biodegradable: '缓慢降解',
      mechanicalStrength: '高强度',
      processability: '膜/纤维/水凝胶/支架',
      crystallinity: 'β-折叠结构'
    },
    dataSource: 'Biomaterials 2003'
  },

  // 功能聚合物（7种）
  {
    id: 'OM043',
    name: 'PVDF',
    englishName: 'Polyvinylidene fluoride',
    abbreviation: 'PVDF',
    formula: '(C2H2F2)n',
    cas: '24937-79-9',
    category: '功能聚合物',
    molarMass: 64.03,
    applications: ['压电传感器', '锂电池隔膜', '铁电材料', '膜分离'],
    properties: {
      piezoelectricity: '优异压电性',
      Tm: '170-175°C',
      chemicalResistance: '耐化学腐蚀',
      dielectric: '高介电常数',
      crystallinity: 'α、β、γ相'
    },
    dataSource: 'Macromolecules 2010'
  },
  {
    id: 'OM044',
    name: 'PNIPAM',
    englishName: 'Poly(N-isopropylacrylamide)',
    abbreviation: 'PNIPAM',
    formula: '(C6H11NO)n',
    cas: '25189-55-3',
    category: '功能聚合物',
    applications: ['温敏材料', '药物递送', '细胞培养', '智能水凝胶'],
    properties: {
      LCST: '32°C（体温附近）',
      thermoresponsive: '温度响应',
      biocompatibility: '良好',
      processability: '溶液聚合',
      swelling: '可逆溶胀/收缩'
    },
    dataSource: 'Angew. Chem. Int. Ed. 2002'
  },
  {
    id: 'OM045',
    name: '聚苯乙烯-聚丁二烯-聚苯乙烯',
    englishName: 'Styrene-Butadiene-Styrene',
    abbreviation: 'SBS',
    formula: '(C8H8)n-(C4H6)m-(C8H8)p',
    cas: '9003-55-8',
    category: '功能聚合物',
    applications: ['热塑性弹性体', '沥青改性', '鞋材', '粘合剂'],
    properties: {
      elasticity: '优异弹性',
      Tg: '-90°C（PB块）',
      processability: '热塑性加工',
      morphology: '微相分离',
      strength: '高拉伸强度'
    },
    dataSource: 'Polymer 1995'
  },
  {
    id: 'OM046',
    name: 'Nafion',
    englishName: 'Nafion',
    abbreviation: 'Nafion',
    formula: '(C7H14F13O5S)n',
    cas: '31175-20-9',
    category: '功能聚合物',
    applications: ['燃料电池质子交换膜', '电解', '传感器', '催化'],
    properties: {
      ionicConductivity: '0.1 S/cm',
      chemicalStability: '极强耐酸碱',
      Tm: '250-280°C',
      waterUptake: '高吸水性',
      ionExchange: '质子交换能力'
    },
    dataSource: 'Chem. Rev. 2004'
  },
  {
    id: 'OM047',
    name: 'PEI',
    englishName: 'Polyethyleneimine',
    abbreviation: 'PEI',
    formula: '(C2H5N)n',
    cas: '9002-98-6',
    category: '功能聚合物',
    applications: ['基因递送', 'CO₂捕获', '纸张增强', '絮凝剂'],
    properties: {
      cationic: '阳离子聚合物',
      buffering: '质子海绵效应',
      transfection: '基因转染',
      molecularWeight: '600-10⁶ Da',
      branching: '支链/线性'
    },
    dataSource: 'Adv. Drug Deliv. Rev. 2005'
  },
  {
    id: 'OM048',
    name: 'PVA',
    englishName: 'Poly(vinyl alcohol)',
    abbreviation: 'PVA',
    formula: '(C2H4O)n',
    cas: '9002-89-5',
    category: '功能聚合物',
    applications: ['水凝胶', '纤维', '包装膜', '3D打印'],
    properties: {
      hydrophilicity: '强亲水性',
      biodegradability: '部分可降解',
      Tm: '180-230°C',
      filmForming: '优异成膜性',
      hydrolysis: '水解度70-100%'
    },
    dataSource: 'Polymer 2001'
  },
  {
    id: 'OM049',
    name: 'PMMA',
    englishName: 'Poly(methyl methacrylate)',
    abbreviation: 'PMMA',
    formula: '(C5H8O2)n',
    cas: '9011-14-7',
    category: '功能聚合物',
    molarMass: 100.12,
    applications: ['有机玻璃', '光学元件', '3D打印', '骨水泥'],
    properties: {
      transparency: '>92%',
      Tg: '105°C',
      brittleness: '脆性较大',
      weatherResistance: '耐候性佳',
      refractive: '折射率1.49'
    },
    dataSource: 'Polymer Handbook 2005'
  }
];

// 按需加载的扩展数据
const organicMaterialsExtended = [];

// 分类索引（优化查询）
const categories = {
  '导电聚合物': ['OM001', 'OM002', 'OM003', 'OM004', 'OM005', 'OM006', 'OM007'],
  '有机半导体': ['OM010', 'OM011', 'OM012', 'OM013', 'OM014', 'OM015', 'OM016', 'OM017', 'OM018', 'OM019'],
  'MOF材料': ['OM020', 'OM021', 'OM022', 'OM023', 'OM024', 'OM025', 'OM026', 'OM027'],
  '发光材料': ['OM028', 'OM029', 'OM030', 'OM031', 'OM032', 'OM033', 'OM034', 'OM035'],
  '生物材料': ['OM036', 'OM037', 'OM038', 'OM039', 'OM040', 'OM041', 'OM042'],
  '功能聚合物': ['OM043', 'OM044', 'OM045', 'OM046', 'OM047', 'OM048', 'OM049']
};

// 搜索功能（优化）
function searchOrganicMaterial(keyword) {
  if (!keyword) return organicMaterialsCore;
  
  const lowerKeyword = keyword.toLowerCase();
  return organicMaterialsCore.filter(material => 
    material.name.includes(keyword) ||
    material.englishName.toLowerCase().includes(lowerKeyword) ||
    material.abbreviation.toLowerCase().includes(lowerKeyword) ||
    material.formula.toLowerCase().includes(lowerKeyword) ||
    (material.cas && material.cas.includes(keyword))
  );
}

// 按类别获取
function getMaterialsByCategory(category) {
  const ids = categories[category];
  if (!ids) return [];
  return organicMaterialsCore.filter(m => ids.includes(m.id));
}

// 按ID获取
function getMaterialById(id) {
  return organicMaterialsCore.find(material => material.id === id);
}

// 获取统计信息
function getStatistics() {
  return {
    total: organicMaterialsCore.length,
    categories: Object.keys(categories).length,
    withCAS: organicMaterialsCore.filter(m => m.cas && m.cas !== 'N/A').length
  };
}

module.exports = {
  organicMaterialsData: organicMaterialsCore,
  categories,
  searchOrganicMaterial,
  getMaterialsByCategory,
  getMaterialById,
  getStatistics
};

