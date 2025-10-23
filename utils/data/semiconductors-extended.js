/**
 * 半导体材料扩充数据（v8.0.0新增）
 * 包含钙钛矿、2D材料、量子点等新兴半导体材料
 * 
 * @version 8.0.0
 * @author ChemTools Team
 * @dataSource Materials Project, Nature Materials, Advanced Materials
 */

/**
 * 钙钛矿材料数据（20种）
 */
const PEROVSKITE_MATERIALS = [
  {
    name: 'CH3NH3PbI3',
    nameEn: 'Methylammonium Lead Iodide',
    abbreviation: 'MAPbI3',
    type: '有机-无机杂化钙钛矿',
    cas: '69507-68-4',
    formula: 'CH3NH3PbI3',
    bandgap: 1.55,
    bandgapType: '直接带隙',
    absorptionEdge: 800,
    crystal: '四方/立方（温度依赖）',
    applications: ['太阳能电池', '光电探测', 'LED'],
    // 能带位置（vs NHE, pH=0）
    valenceBand: 1.05,  // eV
    conductionBand: -0.50,  // eV
    // 新增属性 v8.0.0
    mobility: { electron: 20, hole: 15 }, // cm²/(V·s)
    excitonBindingEnergy: 15, // meV
    dielectricConstant: 70,
    carrier: { type: '双极性', concentration: '1e16 cm-3' },
    stability: '湿度敏感，需封装保护',
    notes: '第一代钙钛矿太阳能电池材料，PCE>25%'
  },
  {
    name: 'CH3NH3PbBr3',
    nameEn: 'Methylammonium Lead Bromide',
    abbreviation: 'MAPbBr3',
    type: '有机-无机杂化钙钛矿',
    formula: 'CH3NH3PbBr3',
    bandgap: 2.23,
    bandgapType: '直接带隙',
    absorptionEdge: 556,
    crystal: '立方',
    applications: ['绿光LED', '光电探测', '激光'],
    // 能带位置（vs NHE, pH=0）
    valenceBand: 1.43,  // eV
    conductionBand: -0.80,  // eV
    mobility: { electron: 25, hole: 20 },
    excitonBindingEnergy: 40,
    dielectricConstant: 58,
    carrier: { type: '双极性', concentration: '1e15 cm-3' },
    stability: '相对稳定，但仍需保护',
    notes: '绿光发射，窄发射峰（FWHM<20nm）'
  },
  {
    name: 'CH3NH3PbCl3',
    nameEn: 'Methylammonium Lead Chloride',
    abbreviation: 'MAPbCl3',
    type: '有机-无机杂化钙钛矿',
    formula: 'CH3NH3PbCl3',
    bandgap: 2.88,
    bandgapType: '直接带隙',
    absorptionEdge: 430,
    crystal: '立方',
    applications: ['蓝光LED', '光电探测'],
    // 能带位置（vs NHE, pH=0）
    valenceBand: 1.68,  // eV
    conductionBand: -1.20,  // eV
    mobility: { electron: 18, hole: 12 },
    excitonBindingEnergy: 55,
    dielectricConstant: 45,
    carrier: { type: '双极性', concentration: '1e14 cm-3' },
    stability: '稳定性较差',
    notes: '蓝光发射材料'
  },
  {
    name: 'CsPbI3',
    nameEn: 'Cesium Lead Iodide',
    abbreviation: 'CsPbI3',
    type: '全无机钙钛矿',
    formula: 'CsPbI3',
    bandgap: 1.73,
    bandgapType: '直接带隙',
    absorptionEdge: 716,
    crystal: '立方（α相）',
    applications: ['太阳能电池', '光电探测'],
    // 能带位置（vs NHE, pH=0）
    valenceBand: 1.13,  // eV
    conductionBand: -0.60,  // eV
    mobility: { electron: 22, hole: 17 },
    excitonBindingEnergy: 20,
    dielectricConstant: 65,
    carrier: { type: '双极性', concentration: '1e16 cm-3' },
    stability: '相稳定性问题，α相需稳定化',
    notes: '全无机，热稳定性优于MA系'
  },
  {
    name: 'CsPbBr3',
    nameEn: 'Cesium Lead Bromide',
    abbreviation: 'CsPbBr3',
    type: '全无机钙钛矿',
    formula: 'CsPbBr3',
    bandgap: 2.36,
    bandgapType: '直接带隙',
    absorptionEdge: 525,
    crystal: '正交/立方（温度依赖）',
    applications: ['绿光LED', '量子点', 'X射线探测'],
    // 能带位置（vs NHE, pH=0）
    valenceBand: 1.48,  // eV
    conductionBand: -0.88,  // eV
    mobility: { electron: 35, hole: 28 },
    excitonBindingEnergy: 38,
    dielectricConstant: 54,
    carrier: { type: '双极性', concentration: '1e15 cm-3' },
    stability: '高稳定性，可在空气中存放',
    notes: '最稳定的钙钛矿，PLQY>95%'
  },
  {
    name: 'FAPbI3',
    nameEn: 'Formamidinium Lead Iodide',
    abbreviation: 'FAPbI3',
    type: '有机-无机杂化钙钛矿',
    formula: 'CH(NH2)2PbI3',
    bandgap: 1.48,
    bandgapType: '直接带隙',
    absorptionEdge: 838,
    crystal: '立方/六方（温度依赖）',
    applications: ['太阳能电池', '光电探测'],
    // 能带位置（vs NHE, pH=0）
    valenceBand: 0.98,  // eV
    conductionBand: -0.50,  // eV
    mobility: { electron: 30, hole: 22 },
    excitonBindingEnergy: 12,
    dielectricConstant: 75,
    carrier: { type: '双极性', concentration: '1e16 cm-3' },
    stability: 'α相不稳定，需添加剂稳定',
    notes: '更窄带隙，理论PCE更高'
  },
  {
    name: 'Cs0.05FA0.95PbI3',
    nameEn: 'Cesium-Formamidinium Mixed Cation Perovskite',
    abbreviation: 'Cs-FA',
    type: '混合阳离子钙钛矿',
    formula: 'Cs0.05(CH(NH2)2)0.95PbI3',
    bandgap: 1.51,
    bandgapType: '直接带隙',
    absorptionEdge: 821,
    crystal: '立方',
    applications: ['高效太阳能电池'],
    // 能带位置（vs NHE, pH=0）
    valenceBand: 1.01,  // eV
    conductionBand: -0.50,  // eV
    mobility: { electron: 28, hole: 20 },
    excitonBindingEnergy: 13,
    dielectricConstant: 72,
    carrier: { type: '双极性', concentration: '1e16 cm-3' },
    stability: 'α相稳定化，热稳定性优异',
    notes: '当前最高效率钙钛矿太阳能电池材料之一'
  },
  {
    name: 'Cs2AgBiBr6',
    nameEn: 'Cesium Silver Bismuth Bromide',
    abbreviation: 'Cs2AgBiBr6',
    type: '双钙钛矿（无铅）',
    formula: 'Cs2AgBiBr6',
    bandgap: 2.19,
    bandgapType: '间接带隙',
    absorptionEdge: 566,
    // 能带位置（vs NHE, pH=0）
    valenceBand: 1.39,  // eV
    conductionBand: -0.80,  // eV
    crystal: '立方（双钙钛矿结构）',
    applications: ['无铅太阳能电池', '光电探测'],
    mobility: { electron: 12, hole: 8 },
    excitonBindingEnergy: 150,
    dielectricConstant: 40,
    carrier: { type: '双极性', concentration: '1e14 cm-3' },
    stability: '高稳定性，环境友好',
    notes: '无铅钙钛矿，间接带隙限制效率'
  },
  {
    name: 'CsSnI3',
    nameEn: 'Cesium Tin Iodide',
    abbreviation: 'CsSnI3',
    type: '全无机钙钛矿（无铅）',
    formula: 'CsSnI3',
    bandgap: 1.30,
    bandgapType: '直接带隙',
    absorptionEdge: 954,
    crystal: '正交/立方',
    applications: ['无铅太阳能电池', '红外探测'],
    // 能带位置（vs NHE, pH=0）
    valenceBand: 0.85,  // eV
    conductionBand: -0.45,  // eV
    mobility: { electron: 585, hole: 322 },
    excitonBindingEnergy: 18,
    dielectricConstant: 55,
    carrier: { type: '双极性', concentration: '1e17 cm-3（p型背景）' },
    stability: 'Sn2+易氧化成Sn4+，稳定性差',
    notes: '无铅钙钛矿，高迁移率但稳定性是挑战'
  },
  {
    name: '(BA)2(MA)3Pb4I13',
    nameEn: '2D Layered Perovskite',
    abbreviation: '2D Perovskite',
    type: '2D层状钙钛矿',
    formula: '(C4H9NH3)2(CH3NH3)3Pb4I13',
    bandgap: 1.85,
    bandgapType: '直接带隙',
    absorptionEdge: 670,
    crystal: '层状结构',
    applications: ['稳定太阳能电池', '发光二极管'],
    // 能带位置（vs NHE, pH=0）
    valenceBand: 1.18,  // eV
    conductionBand: -0.67,  // eV
    mobility: { electron: 5, hole: 3 },
    excitonBindingEnergy: 220,
    dielectricConstant: 35,
    carrier: { type: '双极性', concentration: '1e15 cm-3' },
    stability: '高稳定性，抗湿性好',
    notes: 'Ruddlesden-Popper相，n=4层'
  }
];

/**
 * 2D材料数据（15种）
 */
const TWO_D_MATERIALS = [
  {
    name: 'MoS2',
    nameEn: 'Molybdenum Disulfide',
    type: '过渡金属硫化物',
    formula: 'MoS2',
    bandgap: 1.8, // 单层
    bandgapType: '直接带隙（单层）/间接带隙（多层）',
    crystal: '六方层状',
    applications: ['晶体管', '光电探测', '催化剂'],
    // 能带位置（vs NHE, pH=0）
    valenceBand: 1.8,  // eV
    conductionBand: 0.0,  // eV
    mobility: { electron: 200, hole: 10 }, // 单层
    excitonBindingEnergy: 300,
    dielectricConstant: 15,
    carrier: { type: 'n型', concentration: '可调' },
    layerDependence: '单层直接带隙1.8eV，多层间接带隙1.2eV',
    notes: '最典型的2D半导体，层数依赖带隙'
  },
  {
    name: 'WS2',
    nameEn: 'Tungsten Disulfide',
    type: '过渡金属硫化物',
    formula: 'WS2',
    bandgap: 2.0,
    bandgapType: '直接带隙（单层）',
    crystal: '六方层状',
    applications: ['光电器件', '催化剂'],
    // 能带位置（vs NHE, pH=0）
    valenceBand: 1.6,  // eV
    conductionBand: -0.4,  // eV
    mobility: { electron: 234, hole: 15 },
    excitonBindingEnergy: 320,
    dielectricConstant: 13,
    carrier: { type: 'n型', concentration: '可调' },
    layerDependence: '类似MoS2',
    notes: '与MoS2类似，激子结合能更大'
  },
  {
    name: 'MoSe2',
    nameEn: 'Molybdenum Diselenide',
    type: '过渡金属硒化物',
    formula: 'MoSe2',
    bandgap: 1.5,
    bandgapType: '直接带隙（单层）',
    crystal: '六方层状',
    applications: ['光电器件', '传感器'],
    // 能带位置（vs NHE, pH=0）
    valenceBand: 1.4,  // eV
    conductionBand: -0.1,  // eV
    mobility: { electron: 100, hole: 8 },
    excitonBindingEnergy: 250,
    dielectricConstant: 16,
    carrier: { type: 'n型', concentration: '可调' },
    layerDependence: '单层1.5eV，多层1.1eV',
    notes: '比MoS2带隙略窄'
  },
  {
    name: 'WSe2',
    nameEn: 'Tungsten Diselenide',
    type: '过渡金属硒化物',
    formula: 'WSe2',
    bandgap: 1.65,
    bandgapType: '直接带隙（单层）',
    crystal: '六方层状',
    applications: ['p型晶体管', '光电器件'],
    // 能带位置（vs NHE, pH=0）
    valenceBand: 1.5,  // eV
    conductionBand: -0.15,  // eV
    mobility: { electron: 140, hole: 250 },
    excitonBindingEnergy: 280,
    dielectricConstant: 14,
    carrier: { type: 'p型', concentration: '可调' },
    layerDependence: '单层1.65eV',
    notes: '罕见的高迁移率p型2D材料'
  },
  {
    name: 'Black Phosphorus',
    nameEn: 'Black Phosphorus',
    abbreviation: 'BP',
    type: '单元素2D材料',
    formula: 'P',
    bandgap: 0.3, // 多层，单层~2eV
    bandgapType: '直接带隙',
    crystal: '正交层状',
    applications: ['红外探测', '晶体管', '电池'],
    // 能带位置（vs NHE, pH=0）
    valenceBand: 0.3,  // V (多层值)
    conductionBand: -0.05,  // V
    mobility: { electron: 1000, hole: 600 },
    excitonBindingEnergy: 100,
    dielectricConstant: 8,
    carrier: { type: '双极性', concentration: '可调' },
    layerDependence: '强烈依赖层数：单层2.0eV，多层0.3eV',
    notes: '高迁移率，各向异性，空气中不稳定'
  },
  {
    name: 'SnS2',
    nameEn: 'Tin Disulfide',
    type: '金属硫化物',
    formula: 'SnS2',
    bandgap: 2.2,
    bandgapType: '间接带隙',
    crystal: '六方层状',
    applications: ['光电探测', '电池负极'],
    // 能带位置（vs NHE, pH=0）
    valenceBand: 1.8,  // V
    conductionBand: -0.4,  // V
    mobility: { electron: 50, hole: 5 },
    excitonBindingEnergy: 200,
    dielectricConstant: 18,
    carrier: { type: 'n型', concentration: '1e17 cm-3' },
    layerDependence: '多层2.2eV，单层2.6eV',
    notes: '无毒，地球丰度高，成本低'
  },
  {
    name: 'ReS2',
    nameEn: 'Rhenium Disulfide',
    type: '过渡金属硫化物',
    formula: 'ReS2',
    bandgap: 1.5,
    bandgapType: '直接带隙',
    crystal: '三斜层状',
    applications: ['光电器件', '催化剂'],
    // 能带位置（vs NHE, pH=0）
    valenceBand: 1.4,  // V
    conductionBand: -0.1,  // V
    mobility: { electron: 30, hole: 10 },
    excitonBindingEnergy: 180,
    dielectricConstant: 12,
    carrier: { type: 'n型', concentration: '可调' },
    layerDependence: '弱依赖（层间耦合弱）',
    notes: '各向异性显著，层间解耦'
  },
  {
    name: 'In2Se3',
    nameEn: 'Indium Selenide',
    abbreviation: 'α-In2Se3',
    type: '金属硒化物',
    formula: 'In2Se3',
    bandgap: 1.4,
    bandgapType: '直接带隙',
    crystal: '六方层状',
    applications: ['铁电器件', '光电探测', '相变存储'],
    // 能带位置（vs NHE, pH=0）
    valenceBand: 1.0,  // V
    conductionBand: -0.4,  // V
    mobility: { electron: 180, hole: 25 },
    excitonBindingEnergy: 150,
    dielectricConstant: 20,
    carrier: { type: 'n型', concentration: '1e16 cm-3' },
    layerDependence: '单层铁电性',
    notes: '2D铁电材料，极化可调'
  },
  {
    name: 'GaSe',
    nameEn: 'Gallium Selenide',
    type: '金属硒化物',
    formula: 'GaSe',
    bandgap: 2.0,
    bandgapType: '直接带隙',
    crystal: '六方层状',
    applications: ['非线性光学', '光电探测'],
    // 能带位置（vs NHE, pH=0）
    valenceBand: 1.4,  // V
    conductionBand: -0.6,  // V
    mobility: { electron: 280, hole: 50 },
    excitonBindingEnergy: 200,
    dielectricConstant: 10,
    carrier: { type: 'p型', concentration: '1e15 cm-3' },
    layerDependence: '多层2.0eV，单层3.0eV',
    notes: '优异的非线性光学性质'
  },
  {
    name: 'GaS',
    nameEn: 'Gallium Sulfide',
    type: '金属硫化物',
    formula: 'GaS',
    bandgap: 2.5,
    bandgapType: '间接带隙',
    crystal: '六方层状',
    applications: ['光电探测', '催化剂'],
    // 能带位置（vs NHE, pH=0）
    valenceBand: 1.7,  // V
    conductionBand: -0.8,  // V
    mobility: { electron: 150, hole: 30 },
    excitonBindingEnergy: 250,
    dielectricConstant: 9,
    carrier: { type: 'n型', concentration: '1e14 cm-3' },
    layerDependence: '多层2.5eV，单层3.3eV',
    notes: '比GaSe带隙更宽'
  },
  {
    name: 'Bi2Se3',
    nameEn: 'Bismuth Selenide',
    type: '拓扑绝缘体',
    formula: 'Bi2Se3',
    bandgap: 0.3,
    bandgapType: '间接带隙（体）',
    crystal: '六方层状',
    applications: ['拓扑电子学', '热电材料', '自旋电子学'],
    // 能带位置（vs NHE, pH=0）
    valenceBand: 0.25,  // V
    conductionBand: -0.05,  // V
    mobility: { electron: 600, hole: 100 },
    excitonBindingEnergy: null,
    dielectricConstant: 100,
    carrier: { type: 'n型（表面态）', concentration: '1e19 cm-3' },
    layerDependence: '3D拓扑绝缘体',
    notes: '表面态导电，体内绝缘，拓扑保护'
  },
  {
    name: 'Bi2Te3',
    nameEn: 'Bismuth Telluride',
    type: '拓扑绝缘体/热电材料',
    formula: 'Bi2Te3',
    bandgap: 0.15,
    bandgapType: '间接带隙',
    crystal: '六方层状',
    applications: ['热电器件', '拓扑电子学'],
    // 能带位置（vs NHE, pH=0）
    valenceBand: 0.15,  // V
    conductionBand: -0.05,  // V
    mobility: { electron: 1200, hole: 680 },
    excitonBindingEnergy: null,
    dielectricConstant: 120,
    carrier: { type: 'p型', concentration: '1e19 cm-3' },
    layerDependence: '厚度依赖拓扑性质',
    notes: '最佳室温热电材料之一，ZT~1'
  },
  {
    name: 'HfS2',
    nameEn: 'Hafnium Disulfide',
    type: '过渡金属硫化物',
    formula: 'HfS2',
    bandgap: 2.0,
    bandgapType: '间接带隙',
    crystal: '六方层状',
    applications: ['光电器件', '催化剂'],
    // 能带位置（vs NHE, pH=0）
    valenceBand: 1.5,  // V
    conductionBand: -0.5,  // V
    mobility: { electron: 1800, hole: 250 },
    excitonBindingEnergy: 180,
    dielectricConstant: 11,
    carrier: { type: 'n型', concentration: '可调' },
    layerDependence: '单层直接带隙2.9eV',
    notes: '高迁移率2D材料'
  },
  {
    name: 'ZrS2',
    nameEn: 'Zirconium Disulfide',
    type: '过渡金属硫化物',
    formula: 'ZrS2',
    bandgap: 1.7,
    bandgapType: '间接带隙',
    crystal: '六方层状',
    applications: ['光电器件', '催化剂'],
    // 能带位置（vs NHE, pH=0）
    valenceBand: 1.2,  // V
    conductionBand: -0.5,  // V
    mobility: { electron: 1100, hole: 180 },
    excitonBindingEnergy: 160,
    dielectricConstant: 12,
    carrier: { type: 'n型', concentration: '可调' },
    layerDependence: '多层1.7eV，单层2.4eV',
    notes: '与HfS2类似'
  },
  {
    name: 'GeS',
    nameEn: 'Germanium Sulfide',
    type: '金属硫化物',
    formula: 'GeS',
    bandgap: 1.65,
    bandgapType: '间接带隙',
    crystal: '正交层状',
    applications: ['光电探测', '太阳能电池'],
    // 能带位置（vs NHE, pH=0）
    valenceBand: 1.1,  // V
    conductionBand: -0.55,  // V
    mobility: { electron: 300, hole: 800 },
    excitonBindingEnergy: 180,
    dielectricConstant: 17,
    carrier: { type: 'p型', concentration: '1e16 cm-3' },
    layerDependence: '各向异性',
    notes: '高空穴迁移率，少数2D p型材料'
  }
];

/**
 * 量子点材料数据（13种）
 */
const QUANTUM_DOT_MATERIALS = [
  {
    name: 'CdSe',
    nameEn: 'Cadmium Selenide QD',
    type: 'II-VI量子点',
    formula: 'CdSe',
    bandgap: '1.74-2.8', // 尺寸依赖
    bandgapType: '直接带隙',
    crystal: '闪锌矿/纤锌矿',
    applications: ['显示器', '生物标记', 'LED'],
    // 能带位置（体材料，vs NHE, pH=0）
    valenceBand: 1.2,  // eV (尺寸依赖±0.3 eV)
    conductionBand: -0.5,  // eV
    mobility: { electron: 350, hole: 50 }, // 体材料值
    excitonBindingEnergy: 15,
    dielectricConstant: 10.2,
    carrier: { type: '双极性', concentration: '尺寸依赖' },
    sizeRange: '2-10 nm',
    emissionRange: '500-650 nm',
    plqy: '高达95%',
    notes: '经典量子点材料，量子限域效应显著'
  },
  {
    name: 'CdS',
    nameEn: 'Cadmium Sulfide QD',
    type: 'II-VI量子点',
    formula: 'CdS',
    bandgap: '2.42-3.2',
    bandgapType: '直接带隙',
    crystal: '闪锌矿/纤锌矿',
    applications: ['UV探测', '太阳能电池', '催化剂'],
    // 能带位置（vs NHE, pH=0）
    valenceBand: 2.0,  // V (尺寸依赖±0.3 V)
    conductionBand: -0.4,  // V
    mobility: { electron: 340, hole: 50 },
    excitonBindingEnergy: 28,
    dielectricConstant: 8.9,
    carrier: { type: 'n型', concentration: '尺寸依赖' },
    sizeRange: '2-8 nm',
    emissionRange: '400-520 nm',
    plqy: '高达80%',
    notes: '蓝光量子点，常作壳层材料'
  },
  {
    name: 'CdTe',
    nameEn: 'Cadmium Telluride QD',
    type: 'II-VI量子点',
    formula: 'CdTe',
    bandgap: '1.44-2.2',
    bandgapType: '直接带隙',
    crystal: '闪锌矿',
    applications: ['近红外探测', '生物成像', '太阳能电池'],
    // 能带位置（vs NHE, pH=0）
    valenceBand: 1.0,  // V (尺寸依赖±0.3 V)
    conductionBand: -0.5,  // V
    mobility: { electron: 1050, hole: 100 },
    excitonBindingEnergy: 10,
    dielectricConstant: 10.9,
    carrier: { type: 'p型', concentration: '尺寸依赖' },
    sizeRange: '2-6 nm',
    emissionRange: '550-800 nm',
    plqy: '高达85%',
    notes: '红光到近红外发射'
  },
  {
    name: 'InP',
    nameEn: 'Indium Phosphide QD',
    type: 'III-V量子点',
    formula: 'InP',
    bandgap: '1.35-2.4',
    bandgapType: '直接带隙',
    crystal: '闪锌矿',
    applications: ['无镉显示器', 'LED', '生物成像'],
    // 能带位置（vs NHE, pH=0）
    valenceBand: 0.7,  // eV (尺寸依赖±0.3 eV)
    conductionBand: -0.6,  // eV
    mobility: { electron: 5400, hole: 200 },
    excitonBindingEnergy: 20,
    dielectricConstant: 12.4,
    carrier: { type: 'n型', concentration: '尺寸依赖' },
    sizeRange: '2-6 nm',
    emissionRange: '500-700 nm',
    plqy: '高达90%（核壳结构）',
    notes: '无镉替代材料，环境友好'
  },
  {
    name: 'PbS',
    nameEn: 'Lead Sulfide QD',
    type: 'IV-VI量子点',
    formula: 'PbS',
    bandgap: '0.37-1.5',
    bandgapType: '直接带隙',
    crystal: '岩盐',
    applications: ['近红外探测', '太阳能电池', '光通讯'],
    // 能带位置（vs NHE, pH=0）
    valenceBand: 0.9,  // eV (尺寸依赖±0.4 eV)
    conductionBand: 0.5,  // eV
    mobility: { electron: 600, hole: 600 },
    excitonBindingEnergy: 25,
    dielectricConstant: 170,
    carrier: { type: '双极性', concentration: '尺寸依赖' },
    sizeRange: '3-10 nm',
    emissionRange: '900-2000 nm',
    plqy: '高达60%',
    notes: '近红外量子点，高介电常数'
  },
  {
    name: 'PbSe',
    nameEn: 'Lead Selenide QD',
    type: 'IV-VI量子点',
    formula: 'PbSe',
    bandgap: '0.28-1.2',
    bandgapType: '直接带隙',
    crystal: '岩盐',
    applications: ['中红外探测', '热光伏'],
    // 能带位置（vs NHE, pH=0）
    valenceBand: 0.7,  // V (尺寸依赖±0.4 V)
    conductionBand: 0.43,  // V
    mobility: { electron: 1000, hole: 1000 },
    excitonBindingEnergy: 20,
    dielectricConstant: 210,
    carrier: { type: '双极性', concentration: '尺寸依赖' },
    sizeRange: '4-12 nm',
    emissionRange: '1000-3000 nm',
    plqy: '高达50%',
    notes: '窄带隙近红外材料'
  },
  {
    name: 'CsPbBr3 QD',
    nameEn: 'Cesium Lead Bromide Quantum Dot',
    abbreviation: 'CsPbBr3 QD',
    type: '钙钛矿量子点',
    formula: 'CsPbBr3',
    bandgap: 2.4,
    bandgapType: '直接带隙',
    crystal: '立方钙钛矿',
    applications: ['绿光LED', '显示器', '激光'],
    // 能带位置（vs NHE, pH=0）
    valenceBand: 1.5,  // eV (尺寸依赖±0.2 eV)
    conductionBand: -0.9,  // eV
    mobility: { electron: 40, hole: 30 }, // QD值
    excitonBindingEnergy: 40,
    dielectricConstant: 50,
    carrier: { type: '双极性', concentration: '尺寸依赖' },
    sizeRange: '4-15 nm',
    emissionRange: '510-530 nm',
    plqy: '高达99%',
    notes: '超高PLQY，窄发射峰（FWHM<20nm）'
  },
  {
    name: 'CsPbI3 QD',
    nameEn: 'Cesium Lead Iodide Quantum Dot',
    abbreviation: 'CsPbI3 QD',
    type: '钙钛矿量子点',
    formula: 'CsPbI3',
    bandgap: 1.75,
    bandgapType: '直接带隙',
    crystal: '立方钙钛矿',
    applications: ['红光LED', '太阳能电池'],
    // 能带位置（vs NHE, pH=0）
    valenceBand: 1.15,  // eV (尺寸依赖±0.2 eV)
    conductionBand: -0.60,  // eV
    mobility: { electron: 35, hole: 25 },
    excitonBindingEnergy: 20,
    dielectricConstant: 60,
    carrier: { type: '双极性', concentration: '尺寸依赖' },
    sizeRange: '6-15 nm',
    emissionRange: '670-700 nm',
    plqy: '高达90%',
    notes: 'QD稳定α相，解决相稳定性问题'
  },
  {
    name: 'ZnSe',
    nameEn: 'Zinc Selenide QD',
    type: 'II-VI量子点',
    formula: 'ZnSe',
    bandgap: '2.7-3.6',
    bandgapType: '直接带隙',
    crystal: '闪锌矿',
    applications: ['蓝光LED', 'UV探测'],
    // 能带位置（vs NHE, pH=0）
    valenceBand: 1.7,  // V (尺寸依赖±0.3 V)
    conductionBand: -1.0,  // V
    mobility: { electron: 530, hole: 28 },
    excitonBindingEnergy: 20,
    dielectricConstant: 9.1,
    carrier: { type: 'n型', concentration: '尺寸依赖' },
    sizeRange: '2-6 nm',
    emissionRange: '380-480 nm',
    plqy: '高达70%',
    notes: '蓝光量子点'
  },
  {
    name: 'CuInS2',
    nameEn: 'Copper Indium Sulfide QD',
    abbreviation: 'CIS QD',
    type: 'I-III-VI量子点',
    formula: 'CuInS2',
    bandgap: '1.5-2.5',
    bandgapType: '直接带隙',
    crystal: '黄铜矿',
    applications: ['无镉LED', '太阳能电池', '生物成像'],
    // 能带位置（vs NHE, pH=0）
    valenceBand: 1.0,  // eV (尺寸依赖±0.3 eV)
    conductionBand: -0.5,  // eV
    mobility: { electron: 150, hole: 50 },
    excitonBindingEnergy: 100,
    dielectricConstant: 10,
    carrier: { type: 'p型', concentration: '尺寸依赖' },
    sizeRange: '2-5 nm',
    emissionRange: '520-850 nm',
    plqy: '高达80%',
    notes: '无镉环保量子点，宽发射可调'
  },
  {
    name: 'Si QD',
    nameEn: 'Silicon Quantum Dot',
    abbreviation: 'Si QD',
    type: '硅量子点',
    formula: 'Si',
    bandgap: '1.1-3.5',
    bandgapType: '间接带隙（体）/准直接（QD）',
    crystal: '金刚石',
    applications: ['生物成像', 'LED', '太阳能电池'],
    // 能带位置（vs NHE, pH=0）
    valenceBand: 1.8,  // V (尺寸依赖±0.5 V)
    conductionBand: -0.2,  // V
    mobility: { electron: 1400, hole: 450 },
    excitonBindingEnergy: 80,
    dielectricConstant: 11.7,
    carrier: { type: '双极性', concentration: '尺寸依赖' },
    sizeRange: '1-5 nm',
    emissionRange: '600-900 nm',
    plqy: '高达60%',
    notes: '无毒，CMOS兼容，但PLQY较低'
  },
  {
    name: 'Carbon QD',
    nameEn: 'Carbon Quantum Dot',
    abbreviation: 'CQD / C-dot',
    type: '碳量子点',
    formula: 'C',
    bandgap: '2.0-4.0',
    bandgapType: '可调',
    crystal: '石墨/无定形',
    applications: ['生物成像', '传感器', 'LED'],
    // 能带位置（vs NHE, pH=0）
    valenceBand: 2.5,  // V (尺寸和表面态依赖)
    conductionBand: -0.3,  // V
    mobility: { electron: null, hole: null },
    excitonBindingEnergy: null,
    dielectricConstant: null,
    carrier: { type: '可调', concentration: '表面态依赖' },
    sizeRange: '1-10 nm',
    emissionRange: '400-700 nm',
    plqy: '高达80%',
    notes: '低毒，生物相容性好，表面基团丰富'
  }
];

/**
 * 统计信息
 */
function getStatistics() {
  return {
    perovskites: PEROVSKITE_MATERIALS.length,
    twoDMaterials: TWO_D_MATERIALS.length,
    quantumDots: QUANTUM_DOT_MATERIALS.length,
    total: PEROVSKITE_MATERIALS.length + TWO_D_MATERIALS.length + QUANTUM_DOT_MATERIALS.length
  };
}

module.exports = {
  PEROVSKITE_MATERIALS,
  TWO_D_MATERIALS,
  QUANTUM_DOT_MATERIALS,
  getStatistics
};

