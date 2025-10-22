// UTF-8, no BOM
// 化学品安全数据库
// 数据来源：GHS（全球化学品统一分类和标签制度）

/**
 * 化学品安全数据
 * 包含常用100+种化学品的安全信息
 */
const CHEMICAL_SAFETY_DATA = [
  {
    name: '盐酸',
    nameEn: 'Hydrochloric acid',
    cas: '7647-01-0',
    formula: 'HCl',
    ghsHazards: ['H314', 'H335'],
    hazardStatements: ['造成严重皮肤灼伤和眼损伤', '可能引起呼吸道刺激'],
    pictograms: ['腐蚀', '感叹号'],
    precautions: ['戴防护手套/眼罩', '在通风良好处使用', '避免吸入气体'],
    incompatible: ['碱类', '活泼金属', '氧化剂', '氨'],
    storage: '阴凉通风处，与不相容物质分开存放，使用玻璃或塑料容器',
    disposal: '中和后排放，稀释至pH 6-9',
    firstAid: {
      skin: '立即脱去污染的衣着，用大量流动清水冲洗至少15分钟',
      eyes: '立即提起眼睑，用流动清水或生理盐水冲洗至少15分钟，就医',
      inhalation: '迅速脱离现场至空气新鲜处，保持呼吸道通畅，如呼吸困难给输氧',
      ingestion: '用水漱口，给饮牛奶或蛋清，就医'
    },
    notes: '浓盐酸具有挥发性，会产生白雾'
  },
  {
    name: '硫酸',
    nameEn: 'Sulfuric acid',
    cas: '7664-93-9',
    formula: 'H2SO4',
    ghsHazards: ['H314'],
    hazardStatements: ['造成严重皮肤灼伤和眼损伤'],
    pictograms: ['腐蚀'],
    precautions: ['戴防护手套/眼罩', '防止吸入蒸气', '严禁与水直接混合'],
    incompatible: ['碱类', '活泼金属', '有机物', '水（稀释时注意）'],
    storage: '阴凉通风处，远离可燃物',
    disposal: '中和后排放',
    firstAid: {
      skin: '立即脱去污染衣着，用大量流动清水冲洗至少15分钟，不可直接用水冲洗浓硫酸',
      eyes: '立即提起眼睑，用流动清水冲洗至少15分钟，就医',
      inhalation: '脱离现场至空气新鲜处',
      ingestion: '禁止催吐，立即就医'
    },
    notes: '⚠️ 稀释时务必将酸加入水中，严禁反向操作'
  },
  {
    name: '硝酸',
    nameEn: 'Nitric acid',
    cas: '7697-37-2',
    formula: 'HNO3',
    ghsHazards: ['H272', 'H314'],
    hazardStatements: ['可能加剧燃烧；氧化剂', '造成严重皮肤灼伤和眼损伤'],
    pictograms: ['氧化性', '腐蚀'],
    precautions: ['远离热源/火花', '戴防护手套/眼罩', '防止吸入蒸气'],
    incompatible: ['可燃物', '还原剂', '碱', '金属', '有机物'],
    storage: '阴凉通风处，远离可燃物和还原剂',
    disposal: '中和后排放',
    firstAid: {
      skin: '立即脱去污染衣着，用大量流动清水冲洗至少15分钟',
      eyes: '立即提起眼睑，用流动清水冲洗至少15分钟，就医',
      inhalation: '脱离现场至空气新鲜处，就医',
      ingestion: '禁止催吐，立即就医'
    },
    notes: '强氧化性酸，与有机物接触可能引起燃烧'
  },
  {
    name: '氢氧化钠',
    nameEn: 'Sodium hydroxide',
    cas: '1310-73-2',
    formula: 'NaOH',
    ghsHazards: ['H314'],
    hazardStatements: ['造成严重皮肤灼伤和眼损伤'],
    pictograms: ['腐蚀'],
    precautions: ['戴防护手套/眼罩', '防止吸入粉尘'],
    incompatible: ['酸类', '铝', '锌', '醇类', '卤代烃'],
    storage: '密闭保存，防潮',
    disposal: '中和后排放',
    firstAid: {
      skin: '立即脱去污染衣着，用大量流动清水冲洗至少15分钟',
      eyes: '立即提起眼睑，用流动清水冲洗至少15分钟，就医',
      inhalation: '脱离现场至空气新鲜处',
      ingestion: '用水漱口，给饮牛奶或蛋清，禁止催吐，就医'
    },
    notes: '固体易吸潮，溶于水放热'
  },
  {
    name: '氨水',
    nameEn: 'Ammonia solution',
    cas: '1336-21-6',
    formula: 'NH3·H2O',
    ghsHazards: ['H314', 'H400'],
    hazardStatements: ['造成严重皮肤灼伤和眼损伤', '对水生生物毒性极大'],
    pictograms: ['腐蚀', '环境'],
    precautions: ['戴防护手套/眼罩', '避免排入环境', '通风良好处使用'],
    incompatible: ['酸类', '卤素', '重金属'],
    storage: '阴凉通风处，远离热源和酸类',
    disposal: '中和后处理，不得直接排入环境',
    firstAid: {
      skin: '脱去污染衣着，用流动清水冲洗',
      eyes: '立即提起眼睑，用流动清水冲洗至少15分钟，就医',
      inhalation: '迅速脱离现场至新鲜空气处，保持呼吸道通畅',
      ingestion: '用水漱口，给饮牛奶，就医'
    },
    notes: '有刺激性气味，易挥发'
  },
  {
    name: '乙醇 / EtOH',
    nameEn: 'Ethanol (EtOH)',
    cas: '64-17-5',
    formula: 'C2H5OH',
    ghsHazards: ['H225'],
    hazardStatements: ['高度易燃液体和蒸气'],
    pictograms: ['易燃'],
    precautions: ['远离热源/火花/明火', '容器保持接地', '使用防爆电器'],
    incompatible: ['强氧化剂', '酸类', '碱金属'],
    storage: '阴凉通风处，远离火源',
    disposal: '回收或焚烧处理',
    firstAid: {
      skin: '脱去污染衣着，用肥皂水和清水彻底冲洗',
      eyes: '提起眼睑，用流动清水冲洗',
      inhalation: '脱离现场至空气新鲜处',
      ingestion: '饮足量温水，催吐，就医'
    },
    notes: '常用溶剂，注意通风防火'
  },
  {
    name: 'DMF',
    nameEn: 'N,N-Dimethylformamide',
    cas: '68-12-2',
    formula: 'C3H7NO',
    ghsHazards: ['H312', 'H319', 'H332', 'H360D'],
    hazardStatements: ['皮肤接触有害', '造成严重眼刺激', '吸入有害', '可能对胎儿造成伤害'],
    pictograms: ['感叹号', '健康危害'],
    precautions: ['避免皮肤接触', '戴防护手套/眼罩', '使用通风柜', '孕妇避免接触'],
    incompatible: ['强氧化剂', '卤化物', '强酸'],
    storage: '阴凉通风处，密闭保存',
    disposal: '焚烧处理',
    firstAid: {
      skin: '脱去污染衣着，用肥皂水和清水彻底冲洗',
      eyes: '提起眼睑，用流动清水冲洗至少15分钟',
      inhalation: '脱离现场至空气新鲜处，就医',
      ingestion: '催吐，就医'
    },
    notes: '⚠️ 对肝脏有损害，孕妇禁用，必须在通风柜中操作'
  },
  {
    name: 'DMSO / 二甲基亚砜',
    nameEn: 'Dimethyl sulfoxide (DMSO)',
    cas: '67-68-5',
    formula: 'C2H6OS',
    ghsHazards: ['H227'],
    hazardStatements: ['可燃液体'],
    pictograms: ['感叹号'],
    precautions: ['远离热源', '戴防护手套', '避免长时间接触'],
    incompatible: ['强氧化剂', '过氧化物', '碘化物'],
    storage: '阴凉通风处，密闭保存',
    disposal: '焚烧处理',
    firstAid: {
      skin: '脱去污染衣着，用流动清水冲洗，DMSO可促进其他化学品透皮吸收',
      eyes: '提起眼睑，用流动清水冲洗',
      inhalation: '通风良好处',
      ingestion: '就医'
    },
    notes: '⚠️ 可携带其他化学品透过皮肤，处理时需特别注意'
  },
  {
    name: '丙酮',
    nameEn: 'Acetone',
    cas: '67-64-1',
    formula: 'C3H6O',
    ghsHazards: ['H225', 'H319', 'H336'],
    hazardStatements: ['高度易燃液体和蒸气', '造成严重眼刺激', '可能引起昏睡或眩晕'],
    pictograms: ['易燃', '感叹号'],
    precautions: ['远离热源/火花', '使用通风柜', '避免吸入蒸气'],
    incompatible: ['强氧化剂', '强碱'],
    storage: '阴凉通风处，远离火源',
    disposal: '回收或焚烧处理',
    firstAid: {
      skin: '脱去污染衣着，用肥皂水和清水冲洗',
      eyes: '提起眼睑，用流动清水冲洗',
      inhalation: '脱离现场至空气新鲜处',
      ingestion: '饮水，催吐'
    },
    notes: '常用溶剂，挥发性强，注意防火'
  },
  {
    name: '四氢呋喃 / THF',
    nameEn: 'Tetrahydrofuran (THF)',
    cas: '109-99-9',
    formula: 'C4H8O',
    ghsHazards: ['H225', 'H319', 'H335'],
    hazardStatements: ['高度易燃液体和蒸气', '造成严重眼刺激', '可能引起呼吸道刺激'],
    pictograms: ['易燃', '感叹号'],
    precautions: ['远离热源/火花', '避免吸入蒸气', '使用通风柜'],
    incompatible: ['强氧化剂', '强酸'],
    storage: '阴凉通风处，远离火源，防止过氧化物生成',
    disposal: '焚烧处理',
    firstAid: {
      skin: '脱去污染衣着，用肥皂水和清水冲洗',
      eyes: '提起眼睑，用流动清水冲洗',
      inhalation: '脱离现场至空气新鲜处',
      ingestion: '催吐，就医'
    },
    notes: '⚠️ 易形成爆炸性过氧化物，长期存放需检查'
  },
  {
    name: '过氧化氢',
    nameEn: 'Hydrogen peroxide',
    cas: '7722-84-1',
    formula: 'H2O2',
    ghsHazards: ['H271', 'H302', 'H314', 'H332'],
    hazardStatements: ['可能引起火灾或爆炸；强氧化剂', '吞咽有害', '造成严重皮肤灼伤和眼损伤', '吸入有害'],
    pictograms: ['氧化性', '腐蚀', '感叹号'],
    precautions: ['远离热源/可燃物', '戴防护手套/眼罩', '在通风良好处使用'],
    incompatible: ['可燃物', '还原剂', '有机物', '金属', '碱'],
    storage: '阴凉通风处，远离可燃物，避免光照',
    disposal: '稀释后排放',
    firstAid: {
      skin: '立即用大量水冲洗至少15分钟',
      eyes: '立即提起眼睑，用流动清水冲洗至少15分钟，就医',
      inhalation: '脱离现场至空气新鲜处',
      ingestion: '饮大量水，就医，禁止催吐'
    },
    notes: '强氧化剂，高浓度危险性大，易分解'
  },
  {
    name: '甲醇 / MeOH',
    nameEn: 'Methanol (MeOH)',
    cas: '67-56-1',
    formula: 'CH3OH',
    ghsHazards: ['H225', 'H301', 'H311', 'H331', 'H370'],
    hazardStatements: ['高度易燃液体和蒸气', '吞咽会中毒', '皮肤接触会中毒', '吸入会中毒', '对器官造成损害'],
    pictograms: ['易燃', '骷髅', '健康危害'],
    precautions: ['远离热源/火花', '戴防护手套/眼罩', '避免吸入蒸气', '使用通风柜'],
    incompatible: ['强氧化剂', '酸类', '碱金属'],
    storage: '阴凉通风处，远离火源',
    disposal: '焚烧处理',
    firstAid: {
      skin: '脱去污染衣着，用肥皂水和清水彻底冲洗',
      eyes: '提起眼睑，用流动清水冲洗',
      inhalation: '迅速脱离现场至空气新鲜处，就医',
      ingestion: '立即就医，可能需要洗胃'
    },
    notes: '⚠️ 剧毒！可通过皮肤吸收，损害视神经，严禁口服'
  },
  {
    name: '乙腈 / MeCN / ACN',
    nameEn: 'Acetonitrile (MeCN, ACN)',
    cas: '75-05-8',
    formula: 'CH3CN',
    ghsHazards: ['H225', 'H302', 'H312', 'H332'],
    hazardStatements: ['高度易燃液体和蒸气', '吞咽有害', '皮肤接触有害', '吸入有害'],
    pictograms: ['易燃', '感叹号'],
    precautions: ['远离热源', '使用通风柜', '戴防护手套'],
    incompatible: ['强氧化剂', '强酸', '强碱'],
    storage: '阴凉通风处，远离火源',
    disposal: '焚烧处理',
    firstAid: {
      skin: '脱去污染衣着，用肥皂水和清水冲洗',
      eyes: '提起眼睑，用流动清水冲洗',
      inhalation: '脱离现场至空气新鲜处',
      ingestion: '饮水，就医'
    },
    notes: 'HPLC常用溶剂，易燃'
  },
  {
    name: '氯仿 / CHCl₃',
    nameEn: 'Chloroform / Trichloromethane',
    cas: '67-66-3',
    formula: 'CHCl3',
    ghsHazards: ['H302', 'H315', 'H351', 'H373'],
    hazardStatements: ['吞咽有害', '造成皮肤刺激', '怀疑致癌', '长期或反复接触可能对器官造成伤害'],
    pictograms: ['感叹号', '健康危害'],
    precautions: ['使用通风柜', '戴防护手套', '避免吸入蒸气', '避免长期接触'],
    incompatible: ['强氧化剂', '强碱', '活泼金属', '光'],
    storage: '避光、阴凉通风处，密闭保存',
    disposal: '焚烧处理',
    firstAid: {
      skin: '脱去污染衣着，用肥皂水和清水冲洗',
      eyes: '提起眼睑，用流动清水冲洗',
      inhalation: '脱离现场至空气新鲜处，就医',
      ingestion: '就医'
    },
    notes: '⚠️ 疑似致癌物，光照下分解产生剧毒光气'
  },
  {
    name: '正己烷',
    nameEn: 'n-Hexane',
    cas: '110-54-3',
    formula: 'C6H14',
    ghsHazards: ['H225', 'H304', 'H315', 'H336', 'H361f', 'H373'],
    hazardStatements: ['高度易燃液体和蒸气', '吞咽并进入呼吸道可能致命', '造成皮肤刺激', '可能引起昏睡或眩晕', '怀疑对生育能力造成伤害', '长期或反复接触可能对器官造成伤害'],
    pictograms: ['易燃', '健康危害'],
    precautions: ['远离热源', '使用通风柜', '戴防护手套', '避免长期吸入'],
    incompatible: ['强氧化剂'],
    storage: '阴凉通风处，远离火源',
    disposal: '焚烧处理',
    firstAid: {
      skin: '脱去污染衣着，用肥皂水和清水冲洗',
      eyes: '提起眼睑，用流动清水冲洗',
      inhalation: '脱离现场至空气新鲜处，就医',
      ingestion: '禁止催吐，立即就医'
    },
    notes: '⚠️ 对神经系统有损害，长期接触影响生育能力'
  },
  {
    name: '甲苯',
    nameEn: 'Toluene',
    cas: '108-88-3',
    formula: 'C7H8',
    ghsHazards: ['H225', 'H304', 'H315', 'H336', 'H361d', 'H373'],
    hazardStatements: ['高度易燃液体和蒸气', '吞咽并进入呼吸道可能致命', '造成皮肤刺激', '可能引起昏睡或眩晕', '怀疑对未出生婴儿造成伤害', '长期或反复接触可能对器官造成伤害'],
    pictograms: ['易燃', '健康危害'],
    precautions: ['远离热源', '使用通风柜', '戴防护手套', '孕妇避免接触'],
    incompatible: ['强氧化剂', '强酸'],
    storage: '阴凉通风处，远离火源',
    disposal: '焚烧处理',
    firstAid: {
      skin: '脱去污染衣着，用肥皂水和清水冲洗',
      eyes: '提起眼睑，用流动清水冲洗',
      inhalation: '脱离现场至空气新鲜处',
      ingestion: '禁止催吐，就医'
    },
    notes: '常用溶剂，有神经毒性，孕妇禁用'
  },
  {
    name: '乙酸乙酯 / EA / EtOAc',
    nameEn: 'Ethyl acetate (EA, EtOAc)',
    cas: '141-78-6',
    formula: 'C4H8O2',
    ghsHazards: ['H225', 'H319', 'H336'],
    hazardStatements: ['高度易燃液体和蒸气', '造成严重眼刺激', '可能引起昏睡或眩晕'],
    pictograms: ['易燃', '感叹号'],
    precautions: ['远离热源', '避免吸入蒸气', '使用通风良好处'],
    incompatible: ['强氧化剂', '强酸', '强碱'],
    storage: '阴凉通风处，远离火源',
    disposal: '焚烧处理',
    firstAid: {
      skin: '用肥皂水和清水冲洗',
      eyes: '提起眼睑，用流动清水冲洗',
      inhalation: '脱离现场至空气新鲜处',
      ingestion: '催吐'
    },
    notes: '常用溶剂，挥发性强，相对安全'
  },
  {
    name: '二氯甲烷 / DCM',
    nameEn: 'Dichloromethane (DCM)',
    cas: '75-09-2',
    formula: 'CH2Cl2',
    ghsHazards: ['H351'],
    hazardStatements: ['怀疑致癌'],
    pictograms: ['健康危害'],
    precautions: ['使用通风柜', '戴防护手套', '避免吸入蒸气'],
    incompatible: ['强氧化剂', '强碱', '活泼金属'],
    storage: '阴凉通风处，密闭保存',
    disposal: '回收或焚烧处理',
    firstAid: {
      skin: '脱去污染衣着，用肥皂水和清水冲洗',
      eyes: '提起眼睑，用流动清水冲洗',
      inhalation: '脱离现场至空气新鲜处，就医',
      ingestion: '就医'
    },
    notes: '⚠️ 疑似致癌物，必须在通风柜中操作'
  },
  {
    name: 'NMP',
    nameEn: 'N-Methyl-2-pyrrolidone',
    cas: '872-50-4',
    formula: 'C5H9NO',
    ghsHazards: ['H315', 'H319', 'H335', 'H360D'],
    hazardStatements: ['造成皮肤刺激', '造成严重眼刺激', '可能引起呼吸道刺激', '可能对未出生婴儿造成伤害'],
    pictograms: ['感叹号', '健康危害'],
    precautions: ['使用通风柜', '戴防护手套/眼罩', '孕妇避免接触'],
    incompatible: ['强氧化剂', '强酸'],
    storage: '阴凉通风处，密闭保存',
    disposal: '焚烧处理',
    firstAid: {
      skin: '脱去污染衣着，用肥皂水和清水冲洗',
      eyes: '提起眼睑，用流动清水冲洗至少15分钟',
      inhalation: '脱离现场至空气新鲜处',
      ingestion: '就医'
    },
    notes: '⚠️ 对生殖系统有害，孕妇禁用'
  },
  {
    name: 'EDTA',
    nameEn: 'Ethylenediaminetetraacetic acid',
    cas: '60-00-4',
    formula: 'C10H16N2O8',
    ghsHazards: ['H319'],
    hazardStatements: ['造成严重眼刺激'],
    pictograms: ['感叹号'],
    precautions: ['戴防护眼罩', '避免吸入粉尘'],
    incompatible: ['强氧化剂', '强酸', '强碱'],
    storage: '常温保存，避免受潮',
    disposal: '作为一般化学废物处理',
    firstAid: {
      skin: '用水冲洗',
      eyes: '提起眼睑，用流动清水冲洗至少15分钟',
      inhalation: '脱离现场至空气新鲜处',
      ingestion: '饮水，就医'
    },
    notes: '常用螯合剂，相对安全'
  },
  {
    name: 'TFA',
    nameEn: 'Trifluoroacetic acid',
    cas: '76-05-1',
    formula: 'C2HF3O2',
    ghsHazards: ['H314', 'H332'],
    hazardStatements: ['造成严重皮肤灼伤和眼损伤', '吸入有害'],
    pictograms: ['腐蚀'],
    precautions: ['戴防护手套/眼罩', '使用通风柜', '防止吸入蒸气'],
    incompatible: ['碱类', '醇类', '胺类'],
    storage: '阴凉通风处，密闭保存，防潮',
    disposal: '中和后排放',
    firstAid: {
      skin: '立即脱去污染衣着，用大量流动清水冲洗至少15分钟',
      eyes: '立即提起眼睑，用流动清水冲洗至少15分钟，就医',
      inhalation: '迅速脱离现场至空气新鲜处，就医',
      ingestion: '禁止催吐，立即就医'
    },
    notes: '⚠️ 强酸性，腐蚀性强，挥发性大，必须在通风柜中操作'
  },
  {
    name: 'HFIP',
    nameEn: 'Hexafluoroisopropanol',
    cas: '920-66-1',
    formula: 'C3H2F6O',
    ghsHazards: ['H302', 'H314', 'H332'],
    hazardStatements: ['吞咽有害', '造成严重皮肤灼伤和眼损伤', '吸入有害'],
    pictograms: ['腐蚀', '感叹号'],
    precautions: ['戴防护手套/眼罩', '使用通风柜', '避免皮肤接触'],
    incompatible: ['碱类', '胺类', '金属'],
    storage: '阴凉通风处，密闭保存',
    disposal: '专业处理',
    firstAid: {
      skin: '立即脱去污染衣着，用大量流动清水冲洗至少15分钟',
      eyes: '立即提起眼睑，用流动清水冲洗至少15分钟，就医',
      inhalation: '脱离现场至空气新鲜处，就医',
      ingestion: '就医'
    },
    notes: '⚠️ 强酸性溶剂，价格昂贵，必须在通风柜操作'
  },
  {
    name: 'TEA',
    nameEn: 'Triethylamine',
    cas: '121-44-8',
    formula: 'C6H15N',
    ghsHazards: ['H225', 'H302', 'H312', 'H314', 'H332'],
    hazardStatements: ['高度易燃液体和蒸气', '吞咽有害', '皮肤接触有害', '造成严重皮肤灼伤和眼损伤', '吸入有害'],
    pictograms: ['易燃', '腐蚀'],
    precautions: ['远离热源', '戴防护手套/眼罩', '使用通风柜'],
    incompatible: ['强氧化剂', '强酸', '卤代烃'],
    storage: '阴凉通风处，远离火源，密闭保存',
    disposal: '焚烧处理',
    firstAid: {
      skin: '立即脱去污染衣着，用大量流动清水冲洗',
      eyes: '立即提起眼睑，用流动清水冲洗至少15分钟，就医',
      inhalation: '脱离现场至空气新鲜处',
      ingestion: '就医'
    },
    notes: '⚠️ 有刺激性鱼腥味，易燃，必须在通风柜中操作'
  },
  {
    name: 'DIPEA',
    nameEn: 'N,N-Diisopropylethylamine / Hünig\'s base',
    cas: '7087-68-5',
    formula: 'C8H19N',
    ghsHazards: ['H225', 'H302', 'H314'],
    hazardStatements: ['高度易燃液体和蒸气', '吞咽有害', '造成严重皮肤灼伤和眼损伤'],
    pictograms: ['易燃', '腐蚀'],
    precautions: ['远离热源', '戴防护手套/眼罩', '使用通风柜'],
    incompatible: ['强氧化剂', '强酸'],
    storage: '阴凉通风处，远离火源，密闭保存',
    disposal: '焚烧处理',
    firstAid: {
      skin: '立即脱去污染衣着，用大量流动清水冲洗',
      eyes: '立即提起眼睑，用流动清水冲洗至少15分钟，就医',
      inhalation: '脱离现场至空气新鲜处',
      ingestion: '就医'
    },
    notes: '常用有机碱，比TEA碱性更弱，位阻更大'
  },
  {
    name: 'TMS',
    nameEn: 'Tetramethylsilane',
    cas: '75-76-3',
    formula: 'C4H12Si',
    ghsHazards: ['H224'],
    hazardStatements: ['极度易燃液体和蒸气'],
    pictograms: ['易燃'],
    precautions: ['远离热源/火花/明火', '使用防爆电器', '容器保持接地'],
    incompatible: ['强氧化剂'],
    storage: '阴凉通风处，远离火源，密闭保存',
    disposal: '焚烧处理',
    firstAid: {
      skin: '用肥皂水和清水冲洗',
      eyes: '用流动清水冲洗',
      inhalation: '脱离现场至空气新鲜处',
      ingestion: '就医'
    },
    notes: 'NMR内标物质，极易燃'
  },
  {
    name: 'SOCl₂',
    nameEn: 'Thionyl chloride',
    cas: '7719-09-7',
    formula: 'SOCl2',
    ghsHazards: ['H302', 'H314', 'H335'],
    hazardStatements: ['吞咽有害', '造成严重皮肤灼伤和眼损伤', '可能引起呼吸道刺激'],
    pictograms: ['腐蚀'],
    precautions: ['戴防护手套/眼罩', '使用通风柜', '防止吸入蒸气', '隔绝空气'],
    incompatible: ['水', '醇类', '胺类', '碱类'],
    storage: '阴凉干燥处，密闭保存，隔绝空气和水分',
    disposal: '缓慢加入冰水中分解后中和',
    firstAid: {
      skin: '立即脱去污染衣着，用大量流动清水冲洗至少15分钟',
      eyes: '立即提起眼睑，用流动清水冲洗至少15分钟，就医',
      inhalation: '迅速脱离现场至空气新鲜处，就医',
      ingestion: '禁止催吐，立即就医'
    },
    notes: '⚠️ 遇水剧烈反应产生HCl和SO₂，必须严格隔绝水分，在通风柜操作'
  },
  {
    name: 'POCl₃',
    nameEn: 'Phosphorus oxychloride',
    cas: '10025-87-3',
    formula: 'POCl3',
    ghsHazards: ['H302', 'H314', 'H335'],
    hazardStatements: ['吞咽有害', '造成严重皮肤灼伤和眼损伤', '可能引起呼吸道刺激'],
    pictograms: ['腐蚀'],
    precautions: ['戴防护手套/眼罩', '使用通风柜', '防止吸入蒸气', '隔绝空气'],
    incompatible: ['水', '醇类', '胺类', '碱类'],
    storage: '阴凉干燥处，密闭保存，隔绝空气和水分',
    disposal: '缓慢加入冰水中分解后中和',
    firstAid: {
      skin: '立即脱去污染衣着，用大量流动清水冲洗至少15分钟',
      eyes: '立即提起眼睑，用流动清水冲洗至少15分钟，就医',
      inhalation: '迅速脱离现场至空气新鲜处，就医',
      ingestion: '禁止催吐，立即就医'
    },
    notes: '⚠️ 遇水剧烈反应产生H₃PO₄和HCl，必须严格隔绝水分'
  },
  {
    name: 'Pd/C',
    nameEn: 'Palladium on carbon',
    cas: '7440-05-3',
    formula: 'Pd/C',
    ghsHazards: ['H228', 'H315', 'H319', 'H335'],
    hazardStatements: ['易燃固体', '造成皮肤刺激', '造成严重眼刺激', '可能引起呼吸道刺激'],
    pictograms: ['易燃', '感叹号'],
    precautions: ['远离热源', '避免产生粉尘', '在湿润状态下操作', '避免吸入粉尘'],
    incompatible: ['强氧化剂', '氢气（干燥时）'],
    storage: '密闭保存，保持湿润，避光，远离热源',
    disposal: '回收贵金属，专业处理',
    firstAid: {
      skin: '用肥皂水和清水冲洗',
      eyes: '提起眼睑，用流动清水冲洗',
      inhalation: '脱离现场至空气新鲜处',
      ingestion: '就医'
    },
    notes: '⚠️ 干燥状态下遇氢气可能自燃，必须湿润保存和使用，过滤后不可干燥'
  },
  {
    name: 'LiAlH₄',
    nameEn: 'Lithium aluminum hydride / LAH',
    cas: '16853-85-3',
    formula: 'LiAlH4',
    ghsHazards: ['H260', 'H314'],
    hazardStatements: ['遇水释放易燃气体，可能自燃', '造成严重皮肤灼伤和眼损伤'],
    pictograms: ['遇水放出易燃气体', '腐蚀'],
    precautions: ['远离水分', '使用通风柜', '戴防护手套/眼罩', '在惰性气氛下操作'],
    incompatible: ['水', '醇类', '酸类', '卤代烃', '酯类', '空气'],
    storage: '密闭保存，充氩气或氮气保护，远离水分',
    disposal: '在通风柜中缓慢加入异丙醇中分解',
    firstAid: {
      skin: '立即用干布拭去，再用大量水冲洗',
      eyes: '立即提起眼睑，用流动清水冲洗至少15分钟，就医',
      inhalation: '脱离现场至空气新鲜处，就医',
      ingestion: '禁止催吐，立即就医'
    },
    notes: '⚠️ 遇水剧烈反应放出氢气并自燃，必须在惰性气氛下操作，严格无水'
  },
  {
    name: 'NaBH₄',
    nameEn: 'Sodium borohydride',
    cas: '16940-66-2',
    formula: 'NaBH4',
    ghsHazards: ['H260', 'H301', 'H314'],
    hazardStatements: ['遇水释放易燃气体', '吞咽会中毒', '造成严重皮肤灼伤和眼损伤'],
    pictograms: ['遇水放出易燃气体', '腐蚀', '骷髅'],
    precautions: ['远离水分', '戴防护手套/眼罩', '避免吸入粉尘'],
    incompatible: ['水', '酸类', '氧化剂', '卤代烃'],
    storage: '密闭保存，干燥处，远离水分',
    disposal: '在通风柜中缓慢加入异丙醇或乙醇中分解',
    firstAid: {
      skin: '立即脱去污染衣着，用大量流动清水冲洗',
      eyes: '立即提起眼睑，用流动清水冲洗至少15分钟，就医',
      inhalation: '脱离现场至空气新鲜处',
      ingestion: '就医'
    },
    notes: '常用还原剂，与水反应放出氢气，注意防潮'
  },
  {
    name: 'KMnO₄',
    nameEn: 'Potassium permanganate',
    cas: '7722-64-7',
    formula: 'KMnO4',
    ghsHazards: ['H272', 'H302', 'H410'],
    hazardStatements: ['可能加剧燃烧；氧化剂', '吞咽有害', '对水生生物毒性极大并具有长期持续影响'],
    pictograms: ['氧化性', '感叹号', '环境'],
    precautions: ['远离可燃物', '戴防护手套', '避免排入环境'],
    incompatible: ['可燃物', '还原剂', '浓硫酸', '有机物'],
    storage: '阴凉通风处，远离可燃物和还原剂',
    disposal: '还原后中和处理',
    firstAid: {
      skin: '用大量水冲洗',
      eyes: '提起眼睑，用流动清水冲洗至少15分钟',
      inhalation: '脱离现场至空气新鲜处',
      ingestion: '饮水稀释，就医'
    },
    notes: '强氧化剂，与有机物、浓硫酸等反应可能爆炸或着火'
  },
  {
    name: 'K₂Cr₂O₇',
    nameEn: 'Potassium dichromate',
    cas: '7778-50-9',
    formula: 'K2Cr2O7',
    ghsHazards: ['H272', 'H301', 'H312', 'H314', 'H317', 'H330', 'H334', 'H340', 'H350', 'H360FD', 'H372', 'H410'],
    hazardStatements: ['可能加剧燃烧；氧化剂', '吞咽会中毒', '皮肤接触会中毒', '造成严重皮肤灼伤和眼损伤', '可能导致皮肤过敏反应', '吸入致命', '可能引起过敏或哮喘症状或呼吸困难', '可能致癌', '可能致癌', '可能对生育能力或未出生婴儿造成伤害', '长期或反复接触会对器官造成伤害', '对水生生物毒性极大'],
    pictograms: ['氧化性', '腐蚀', '骷髅', '健康危害', '环境'],
    precautions: ['戴防护手套/眼罩/面罩', '使用通风柜', '避免吸入粉尘/蒸气', '孕妇避免接触'],
    incompatible: ['可燃物', '还原剂', '有机物', '酸类'],
    storage: '密闭保存，远离可燃物',
    disposal: '还原后重金属处理',
    firstAid: {
      skin: '立即脱去污染衣着，用大量流动清水冲洗至少15分钟，就医',
      eyes: '立即提起眼睑，用流动清水冲洗至少15分钟，就医',
      inhalation: '迅速脱离现场至空气新鲜处，立即就医',
      ingestion: '立即就医'
    },
    notes: '⚠️ 剧毒！致癌物质，强氧化剂，六价铬化合物，必须严格防护'
  },
  {
    name: '苯',
    nameEn: 'Benzene',
    cas: '71-43-2',
    formula: 'C6H6',
    ghsHazards: ['H225', 'H304', 'H315', 'H319', 'H340', 'H350', 'H372'],
    hazardStatements: ['高度易燃液体和蒸气', '吞咽并进入呼吸道可能致命', '造成皮肤刺激', '造成严重眼刺激', '可能致癌', '可能致癌', '长期或反复接触会对器官造成伤害'],
    pictograms: ['易燃', '健康危害'],
    precautions: ['远离热源', '使用通风柜', '戴防护手套/眼罩', '避免长期接触'],
    incompatible: ['强氧化剂'],
    storage: '阴凉通风处，远离火源，密闭保存',
    disposal: '焚烧处理',
    firstAid: {
      skin: '脱去污染衣着，用肥皂水和清水冲洗',
      eyes: '提起眼睑，用流动清水冲洗',
      inhalation: '迅速脱离现场至空气新鲜处，就医',
      ingestion: '禁止催吐，立即就医'
    },
    notes: '⚠️ 一级致癌物！对造血系统有严重损害，能被皮肤吸收，尽量用甲苯代替'
  },
  {
    name: 'CS₂',
    nameEn: 'Carbon disulfide',
    cas: '75-15-0',
    formula: 'CS2',
    ghsHazards: ['H224', 'H301', 'H311', 'H315', 'H319', 'H331', 'H336', 'H361fd', 'H372'],
    hazardStatements: ['极度易燃液体和蒸气', '吞咽会中毒', '皮肤接触会中毒', '造成皮肤刺激', '造成严重眼刺激', '吸入会中毒', '可能引起昏睡或眩晕', '怀疑对生育能力或未出生婴儿造成伤害', '长期或反复接触会对器官造成伤害'],
    pictograms: ['易燃', '骷髅', '健康危害'],
    precautions: ['远离热源/火花/明火', '使用通风柜', '戴防护手套/眼罩', '避免吸入蒸气'],
    incompatible: ['氧化剂', '胺类', '叠氮化物'],
    storage: '阴凉通风处，远离火源，密闭保存，避光',
    disposal: '焚烧处理',
    firstAid: {
      skin: '立即脱去污染衣着，用肥皂水和清水彻底冲洗',
      eyes: '提起眼睑，用流动清水冲洗至少15分钟，就医',
      inhalation: '迅速脱离现场至空气新鲜处，立即就医',
      ingestion: '立即就医'
    },
    notes: '⚠️ 剧毒！极易燃，对神经系统有严重损害，蒸气比空气重，必须在通风柜操作'
  },
  {
    name: 'IPA / i-PrOH / 异丙醇',
    nameEn: 'Isopropanol (IPA, i-PrOH)',
    cas: '67-63-0',
    formula: 'C3H8O',
    ghsHazards: ['H225', 'H319', 'H336'],
    hazardStatements: ['高度易燃液体和蒸气', '造成严重眼刺激', '可能引起昏睡或眩晕'],
    pictograms: ['易燃', '感叹号'],
    precautions: ['远离热源', '避免吸入蒸气', '使用通风良好处'],
    incompatible: ['强氧化剂', '强酸'],
    storage: '阴凉通风处，远离火源',
    disposal: '焚烧处理',
    firstAid: {
      skin: '用肥皂水和清水冲洗',
      eyes: '提起眼睑，用流动清水冲洗',
      inhalation: '脱离现场至空气新鲜处',
      ingestion: '饮水，催吐'
    },
    notes: '常用清洗溶剂，比乙醇毒性略大'
  },
  {
    name: '吡啶',
    nameEn: 'Pyridine',
    cas: '110-86-1',
    formula: 'C5H5N',
    ghsHazards: ['H225', 'H302', 'H312', 'H332'],
    hazardStatements: ['高度易燃液体和蒸气', '吞咽有害', '皮肤接触有害', '吸入有害'],
    pictograms: ['易燃', '感叹号'],
    precautions: ['远离热源', '使用通风柜', '戴防护手套', '避免吸入蒸气'],
    incompatible: ['强氧化剂', '强酸'],
    storage: '阴凉通风处，远离火源，密闭保存',
    disposal: '焚烧处理',
    firstAid: {
      skin: '脱去污染衣着，用肥皂水和清水冲洗',
      eyes: '提起眼睑，用流动清水冲洗',
      inhalation: '脱离现场至空气新鲜处',
      ingestion: '饮水，就医'
    },
    notes: '有强烈臭味，常用碱和溶剂，必须在通风柜中操作'
  },
  {
    name: '1,4-二氧六环',
    nameEn: '1,4-Dioxane',
    cas: '123-91-1',
    formula: 'C4H8O2',
    ghsHazards: ['H225', 'H319', 'H335', 'H351'],
    hazardStatements: ['高度易燃液体和蒸气', '造成严重眼刺激', '可能引起呼吸道刺激', '怀疑致癌'],
    pictograms: ['易燃', '健康危害'],
    precautions: ['远离热源', '使用通风柜', '戴防护手套', '避免长期接触'],
    incompatible: ['强氧化剂'],
    storage: '阴凉通风处，远离火源，避光，检查过氧化物',
    disposal: '焚烧处理',
    firstAid: {
      skin: '脱去污染衣着，用肥皂水和清水冲洗',
      eyes: '提起眼睑，用流动清水冲洗',
      inhalation: '脱离现场至空气新鲜处，就医',
      ingestion: '就医'
    },
    notes: '⚠️ 疑似致癌物，易形成过氧化物，必须在通风柜操作'
  },
  {
    name: '二甲苯',
    nameEn: 'Xylene',
    cas: '1330-20-7',
    formula: 'C8H10',
    ghsHazards: ['H226', 'H304', 'H312', 'H315', 'H332'],
    hazardStatements: ['易燃液体和蒸气', '吞咽并进入呼吸道可能致命', '皮肤接触有害', '造成皮肤刺激', '吸入有害'],
    pictograms: ['易燃', '健康危害'],
    precautions: ['远离热源', '使用通风柜', '戴防护手套'],
    incompatible: ['强氧化剂'],
    storage: '阴凉通风处，远离火源',
    disposal: '焚烧处理',
    firstAid: {
      skin: '脱去污染衣着，用肥皂水和清水冲洗',
      eyes: '提起眼睑，用流动清水冲洗',
      inhalation: '脱离现场至空气新鲜处',
      ingestion: '禁止催吐，就医'
    },
    notes: '常用溶剂，毒性比甲苯低，可替代苯使用'
  },
  {
    name: '石油醚',
    nameEn: 'Petroleum ether',
    cas: '8032-32-4',
    formula: 'C5-C7',
    ghsHazards: ['H224', 'H304', 'H315', 'H336', 'H411'],
    hazardStatements: ['极度易燃液体和蒸气', '吞咽并进入呼吸道可能致命', '造成皮肤刺激', '可能引起昏睡或眩晕', '对水生生物有毒并具有长期持续影响'],
    pictograms: ['易燃', '健康危害', '环境'],
    precautions: ['远离热源/火花/明火', '使用通风柜', '戴防护手套'],
    incompatible: ['强氧化剂'],
    storage: '阴凉通风处，远离火源',
    disposal: '焚烧处理',
    firstAid: {
      skin: '脱去污染衣着，用肥皂水和清水冲洗',
      eyes: '提起眼睑，用流动清水冲洗',
      inhalation: '脱离现场至空气新鲜处',
      ingestion: '禁止催吐，就医'
    },
    notes: '极易燃，常用于柱层析，注意通风'
  },
  {
    name: 'HOAc',
    nameEn: 'Acetic acid / Glacial acetic acid',
    cas: '64-19-7',
    formula: 'CH3COOH',
    ghsHazards: ['H226', 'H314'],
    hazardStatements: ['易燃液体和蒸气', '造成严重皮肤灼伤和眼损伤'],
    pictograms: ['易燃', '腐蚀'],
    precautions: ['远离热源', '戴防护手套/眼罩', '使用通风柜'],
    incompatible: ['碱类', '氧化剂', '强碱'],
    storage: '阴凉通风处，远离热源',
    disposal: '中和后排放',
    firstAid: {
      skin: '立即脱去污染衣着，用大量流动清水冲洗至少15分钟',
      eyes: '立即提起眼睑，用流动清水冲洗至少15分钟，就医',
      inhalation: '脱离现场至空气新鲜处',
      ingestion: '饮水稀释，就医'
    },
    notes: '冰醋酸，有刺激性气味，腐蚀性强'
  },
  {
    name: '甲酸',
    nameEn: 'Formic acid',
    cas: '64-18-6',
    formula: 'HCOOH',
    ghsHazards: ['H226', 'H302', 'H314', 'H331'],
    hazardStatements: ['易燃液体和蒸气', '吞咽有害', '造成严重皮肤灼伤和眼损伤', '吸入会中毒'],
    pictograms: ['易燃', '腐蚀'],
    precautions: ['远离热源', '戴防护手套/眼罩', '使用通风柜'],
    incompatible: ['碱类', '氧化剂', '活泼金属'],
    storage: '阴凉通风处，远离热源',
    disposal: '中和后排放',
    firstAid: {
      skin: '立即脱去污染衣着，用大量流动清水冲洗至少15分钟',
      eyes: '立即提起眼睑，用流动清水冲洗至少15分钟，就医',
      inhalation: '迅速脱离现场至空气新鲜处，就医',
      ingestion: '饮水稀释，禁止催吐，就医'
    },
    notes: '强酸性，腐蚀性强，刺激性大'
  },
  {
    name: '磷酸',
    nameEn: 'Phosphoric acid',
    cas: '7664-38-2',
    formula: 'H3PO4',
    ghsHazards: ['H290', 'H314'],
    hazardStatements: ['可能腐蚀金属', '造成严重皮肤灼伤和眼损伤'],
    pictograms: ['腐蚀'],
    precautions: ['戴防护手套/眼罩', '使用防腐蚀容器'],
    incompatible: ['碱类', '活泼金属'],
    storage: '阴凉通风处，使用防腐蚀容器',
    disposal: '中和后排放',
    firstAid: {
      skin: '立即脱去污染衣着，用大量流动清水冲洗',
      eyes: '立即提起眼睑，用流动清水冲洗至少15分钟，就医',
      inhalation: '脱离现场至空气新鲜处',
      ingestion: '饮水稀释，就医'
    },
    notes: '中强酸，腐蚀性较弱，常用于缓冲液'
  },
  {
    name: 'KOH',
    nameEn: 'Potassium hydroxide',
    cas: '1310-58-3',
    formula: 'KOH',
    ghsHazards: ['H290', 'H302', 'H314'],
    hazardStatements: ['可能腐蚀金属', '吞咽有害', '造成严重皮肤灼伤和眼损伤'],
    pictograms: ['腐蚀'],
    precautions: ['戴防护手套/眼罩', '防止吸入粉尘'],
    incompatible: ['酸类', '铝', '锌', '醇类'],
    storage: '密闭保存，防潮',
    disposal: '中和后排放',
    firstAid: {
      skin: '立即脱去污染衣着，用大量流动清水冲洗至少15分钟',
      eyes: '立即提起眼睑，用流动清水冲洗至少15分钟，就医',
      inhalation: '脱离现场至空气新鲜处',
      ingestion: '用水漱口，给饮牛奶，禁止催吐，就医'
    },
    notes: '强碱，腐蚀性强，易吸潮，溶于水放热'
  },
  {
    name: 'NaH',
    nameEn: 'Sodium hydride',
    cas: '7646-69-7',
    formula: 'NaH',
    ghsHazards: ['H260', 'H314'],
    hazardStatements: ['遇水释放易燃气体，可能自燃', '造成严重皮肤灼伤和眼损伤'],
    pictograms: ['遇水放出易燃气体', '腐蚀'],
    precautions: ['远离水分', '使用通风柜', '戴防护手套/眼罩', '在惰性气氛下操作'],
    incompatible: ['水', '醇类', '酸类', '卤代烃', '空气'],
    storage: '密闭保存，充氩气或氮气保护，远离水分，通常浸在矿物油中',
    disposal: '在通风柜中缓慢加入异丙醇或乙醇中分解',
    firstAid: {
      skin: '立即用干布拭去，再用大量水冲洗',
      eyes: '立即提起眼睑，用流动清水冲洗至少15分钟，就医',
      inhalation: '脱离现场至空气新鲜处，就医',
      ingestion: '禁止催吐，立即就医'
    },
    notes: '⚠️ 强碱，遇水剧烈反应放出氢气并自燃，必须在惰性气氛下操作'
  },
  {
    name: 't-BuOK',
    nameEn: 'Potassium tert-butoxide',
    cas: '865-47-4',
    formula: 'C4H9KO',
    ghsHazards: ['H250', 'H260', 'H314'],
    hazardStatements: ['接触空气会自燃', '遇水释放易燃气体', '造成严重皮肤灼伤和眼损伤'],
    pictograms: ['自燃', '遇水放出易燃气体', '腐蚀'],
    precautions: ['远离水分和空气', '使用通风柜', '戴防护手套/眼罩', '在手套箱或惰性气氛下操作'],
    incompatible: ['水', '醇类', '酸类', '空气', '氧气'],
    storage: '密闭保存，充氩气保护，远离水分和空气',
    disposal: '在通风柜中缓慢加入叔丁醇中分解',
    firstAid: {
      skin: '立即用干布拭去，再用大量水冲洗',
      eyes: '立即提起眼睑，用流动清水冲洗至少15分钟，就医',
      inhalation: '脱离现场至空气新鲜处，就医',
      ingestion: '禁止催吐，立即就医'
    },
    notes: '⚠️ 极强碱，遇水或空气自燃，必须在手套箱或严格惰性气氛下操作'
  },
  {
    name: 'DMAP',
    nameEn: '4-Dimethylaminopyridine',
    cas: '1122-58-3',
    formula: 'C7H10N2',
    ghsHazards: ['H301', 'H312', 'H315', 'H319', 'H335'],
    hazardStatements: ['吞咽会中毒', '皮肤接触有害', '造成皮肤刺激', '造成严重眼刺激', '可能引起呼吸道刺激'],
    pictograms: ['骷髅', '感叹号'],
    precautions: ['戴防护手套/眼罩', '避免吸入粉尘', '使用通风柜'],
    incompatible: ['强氧化剂', '强酸'],
    storage: '阴凉通风处，密闭保存',
    disposal: '作为危险化学废物处理',
    firstAid: {
      skin: '脱去污染衣着，用肥皂水和清水彻底冲洗',
      eyes: '提起眼睑，用流动清水冲洗至少15分钟',
      inhalation: '脱离现场至空气新鲜处',
      ingestion: '立即就医'
    },
    notes: '常用催化剂，毒性较大，操作时注意防护'
  },
  {
    name: 'DBU',
    nameEn: '1,8-Diazabicyclo[5.4.0]undec-7-ene',
    cas: '6674-22-2',
    formula: 'C9H16N2',
    ghsHazards: ['H302', 'H314', 'H318'],
    hazardStatements: ['吞咽有害', '造成严重皮肤灼伤和眼损伤', '造成严重眼损伤'],
    pictograms: ['腐蚀'],
    precautions: ['戴防护手套/眼罩/面罩', '使用通风柜', '避免皮肤接触'],
    incompatible: ['强氧化剂', '强酸'],
    storage: '阴凉通风处，密闭保存',
    disposal: '中和后处理',
    firstAid: {
      skin: '立即脱去污染衣着，用大量流动清水冲洗至少15分钟',
      eyes: '立即提起眼睑，用流动清水冲洗至少15分钟，就医',
      inhalation: '脱离现场至空气新鲜处',
      ingestion: '就医'
    },
    notes: '强有机碱，腐蚀性强，必须严格防护'
  },
  {
    name: 'DCC',
    nameEn: 'N,N\'-Dicyclohexylcarbodiimide',
    cas: '538-75-0',
    formula: 'C13H22N2',
    ghsHazards: ['H302', 'H315', 'H317', 'H319', 'H334', 'H335'],
    hazardStatements: ['吞咽有害', '造成皮肤刺激', '可能导致皮肤过敏反应', '造成严重眼刺激', '吸入可能引起过敏或哮喘症状或呼吸困难', '可能引起呼吸道刺激'],
    pictograms: ['感叹号', '健康危害'],
    precautions: ['戴防护手套/眼罩', '使用通风柜', '避免吸入粉尘', '过敏体质避免接触'],
    incompatible: ['水', '强氧化剂', '强酸'],
    storage: '阴凉通风处，密闭保存，防潮',
    disposal: '加入大量水中水解后处理',
    firstAid: {
      skin: '脱去污染衣着，用肥皂水和清水彻底冲洗',
      eyes: '提起眼睑，用流动清水冲洗至少15分钟',
      inhalation: '脱离现场至空气新鲜处，就医',
      ingestion: '就医'
    },
    notes: '⚠️ 常用缩合剂，可能引起过敏反应，遇水分解，使用时注意通风'
  },
  {
    name: 'EDC / EDCI',
    nameEn: '1-Ethyl-3-(3-dimethylaminopropyl)carbodiimide',
    cas: '25952-53-8',
    formula: 'C8H17N3',
    ghsHazards: ['H302', 'H315', 'H319', 'H335'],
    hazardStatements: ['吞咽有害', '造成皮肤刺激', '造成严重眼刺激', '可能引起呼吸道刺激'],
    pictograms: ['感叹号'],
    precautions: ['戴防护手套/眼罩', '使用通风柜', '避免吸入粉尘'],
    incompatible: ['水', '强氧化剂', '强酸'],
    storage: '阴凉干燥处，密闭保存，-20°C冷藏更佳',
    disposal: '加入大量水中水解后处理',
    firstAid: {
      skin: '脱去污染衣着，用肥皂水和清水冲洗',
      eyes: '提起眼睑，用流动清水冲洗至少15分钟',
      inhalation: '脱离现场至空气新鲜处',
      ingestion: '就医'
    },
    notes: '常用缩合剂，比DCC水溶性好，副产物易去除'
  },
  {
    name: 'TBAF',
    nameEn: 'Tetrabutylammonium fluoride',
    cas: '429-41-4',
    formula: 'C16H36FN',
    ghsHazards: ['H301', 'H311', 'H314', 'H331'],
    hazardStatements: ['吞咽会中毒', '皮肤接触会中毒', '造成严重皮肤灼伤和眼损伤', '吸入会中毒'],
    pictograms: ['骷髅', '腐蚀'],
    precautions: ['戴防护手套/眼罩', '使用通风柜', '避免皮肤接触', '使用塑料器皿'],
    incompatible: ['水', '玻璃器皿', '硅胶'],
    storage: '阴凉干燥处，密闭保存，使用塑料容器',
    disposal: '加入大量水中稀释后中和',
    firstAid: {
      skin: '立即脱去污染衣着，用大量流动清水冲洗至少15分钟，就医',
      eyes: '立即提起眼睑，用流动清水冲洗至少15分钟，就医',
      inhalation: '迅速脱离现场至空气新鲜处，就医',
      ingestion: '立即就医'
    },
    notes: '⚠️ 剧毒！腐蚀玻璃，必须使用塑料器皿，严格防护'
  },
  {
    name: '溴',
    nameEn: 'Bromine',
    cas: '7726-95-6',
    formula: 'Br2',
    ghsHazards: ['H330', 'H314', 'H400'],
    hazardStatements: ['吸入致命', '造成严重皮肤灼伤和眼损伤', '对水生生物毒性极大'],
    pictograms: ['骷髅', '腐蚀', '环境'],
    precautions: ['戴防护手套/眼罩/面罩', '使用通风柜', '避免吸入蒸气', '远离水体'],
    incompatible: ['有机物', '金属', '氨', '磷', '还原剂'],
    storage: '阴凉通风处，密闭保存，使用防腐蚀容器',
    disposal: '用硫代硫酸钠还原后处理',
    firstAid: {
      skin: '立即脱去污染衣着，用大量流动清水冲洗至少15分钟，就医',
      eyes: '立即提起眼睑，用流动清水冲洗至少15分钟，立即就医',
      inhalation: '迅速脱离现场至空气新鲜处，立即就医',
      ingestion: '立即就医'
    },
    notes: '⚠️ 剧毒！强腐蚀性，挥发性强，必须在通风柜严格防护下操作'
  },
  {
    name: '碘',
    nameEn: 'Iodine',
    cas: '7553-56-2',
    formula: 'I2',
    ghsHazards: ['H312', 'H332', 'H400'],
    hazardStatements: ['皮肤接触有害', '吸入有害', '对水生生物毒性极大'],
    pictograms: ['感叹号', '环境'],
    precautions: ['戴防护手套', '避免吸入蒸气', '避免排入环境'],
    incompatible: ['金属', '氨', '磷', '乙炔'],
    storage: '阴凉通风处，密闭保存',
    disposal: '用硫代硫酸钠还原后处理',
    firstAid: {
      skin: '脱去污染衣着，用肥皂水和清水冲洗',
      eyes: '提起眼睑，用流动清水冲洗',
      inhalation: '脱离现场至空气新鲜处',
      ingestion: '饮淀粉溶液，就医'
    },
    notes: '升华性强，有色，对皮肤有刺激，淀粉遇碘变蓝'
  },
  {
    name: 'TsCl',
    nameEn: 'p-Toluenesulfonyl chloride / Tosyl chloride',
    cas: '98-59-9',
    formula: 'C7H7ClO2S',
    ghsHazards: ['H302', 'H314'],
    hazardStatements: ['吞咽有害', '造成严重皮肤灼伤和眼损伤'],
    pictograms: ['腐蚀'],
    precautions: ['戴防护手套/眼罩', '使用通风柜', '防止吸入粉尘'],
    incompatible: ['水', '醇类', '胺类', '碱类'],
    storage: '阴凉干燥处，密闭保存，防潮',
    disposal: '缓慢加入稀碱溶液中水解',
    firstAid: {
      skin: '立即脱去污染衣着，用大量流动清水冲洗',
      eyes: '立即提起眼睑，用流动清水冲洗至少15分钟，就医',
      inhalation: '脱离现场至空气新鲜处',
      ingestion: '就医'
    },
    notes: '常用保护基试剂，遇水分解，注意防潮'
  },
  {
    name: 'Tf₂O',
    nameEn: 'Trifluoromethanesulfonic anhydride / Triflic anhydride',
    cas: '358-23-6',
    formula: 'C2F6O5S2',
    ghsHazards: ['H302', 'H314', 'H332'],
    hazardStatements: ['吞咽有害', '造成严重皮肤灼伤和眼损伤', '吸入有害'],
    pictograms: ['腐蚀'],
    precautions: ['戴防护手套/眼罩', '使用通风柜', '在惰性气氛下操作', '远离水分'],
    incompatible: ['水', '醇类', '胺类', '碱类'],
    storage: '阴凉干燥处，密闭保存，充氩气保护，防潮',
    disposal: '在冰浴下缓慢加入稀碱溶液中水解',
    firstAid: {
      skin: '立即脱去污染衣着，用大量流动清水冲洗至少15分钟',
      eyes: '立即提起眼睑，用流动清水冲洗至少15分钟，就医',
      inhalation: '迅速脱离现场至空气新鲜处，就医',
      ingestion: '禁止催吐，立即就医'
    },
    notes: '⚠️ 强酰化试剂，遇水剧烈反应，腐蚀性极强，价格昂贵'
  },
  {
    name: '乙酰氯',
    nameEn: 'Acetyl chloride',
    cas: '75-36-5',
    formula: 'CH3COCl',
    ghsHazards: ['H225', 'H302', 'H314', 'H332'],
    hazardStatements: ['高度易燃液体和蒸气', '吞咽有害', '造成严重皮肤灼伤和眼损伤', '吸入有害'],
    pictograms: ['易燃', '腐蚀'],
    precautions: ['远离热源', '戴防护手套/眼罩', '使用通风柜', '远离水分'],
    incompatible: ['水', '醇类', '胺类', '碱类'],
    storage: '阴凉通风处，远离火源和水分，密闭保存',
    disposal: '在冰浴下缓慢加入稀碱溶液中水解',
    firstAid: {
      skin: '立即脱去污染衣着，用大量流动清水冲洗',
      eyes: '立即提起眼睑，用流动清水冲洗至少15分钟，就医',
      inhalation: '脱离现场至空气新鲜处',
      ingestion: '禁止催吐，就医'
    },
    notes: '遇水剧烈反应产生HCl和醋酸，挥发性强，刺激性大'
  },
  {
    name: '硫酸镁',
    nameEn: 'Magnesium sulfate',
    cas: '7487-88-9',
    formula: 'MgSO4',
    ghsHazards: [],
    hazardStatements: ['无重大危害'],
    pictograms: [],
    precautions: ['避免吸入粉尘', '避免接触眼睛'],
    incompatible: ['强氧化剂'],
    storage: '常温保存，防潮',
    disposal: '可作为一般固体废物处理',
    firstAid: {
      skin: '用水冲洗',
      eyes: '用流动清水冲洗',
      inhalation: '脱离现场至空气新鲜处',
      ingestion: '饮水稀释'
    },
    notes: '常用干燥剂，相对安全，无水和七水合物'
  },
  {
    name: '硫酸钠',
    nameEn: 'Sodium sulfate',
    cas: '7757-82-6',
    formula: 'Na2SO4',
    ghsHazards: [],
    hazardStatements: ['无重大危害'],
    pictograms: [],
    precautions: ['避免吸入粉尘'],
    incompatible: ['强氧化剂'],
    storage: '常温保存',
    disposal: '可作为一般固体废物处理',
    firstAid: {
      skin: '用水冲洗',
      eyes: '用流动清水冲洗',
      inhalation: '脱离现场至空气新鲜处',
      ingestion: '饮水稀释'
    },
    notes: '常用干燥剂，相对安全，无水和十水合物'
  },
  {
    name: 'NaHCO₃',
    nameEn: 'Sodium bicarbonate / Baking soda',
    abbreviation: 'NaHCO3',
    cas: '144-55-8',
    un: 'Not regulated',
    einecs: '205-633-8',
    formula: 'NaHCO3',
    molecularWeight: 84.01,
    ghsHazards: [],
    hazardStatements: ['无重大危害'],
    pictograms: [],
    precautions: ['避免吸入粉尘'],
    incompatible: ['强酸'],
    storage: '常温保存，防潮',
    storageTemp: '室温（15-25°C）',
    shelfLife: '长期稳定',
    disposal: '可直接排放',
    firstAid: {
      skin: '用水冲洗',
      eyes: '用流动清水冲洗',
      inhalation: '脱离现场至空气新鲜处',
      ingestion: '饮水'
    },
    notes: '小苏打，常用中和剂和缓冲剂，安全无毒'
  },
  // ========== 新增化学品（42种） v8.0.0 ==========
  // 有机溶剂类（10种）
  {
    name: '正己烷',
    nameEn: 'n-Hexane',
    abbreviation: 'Hex',
    cas: '110-54-3',
    un: 'UN1208',
    einecs: '203-777-6',
    formula: 'C6H14',
    molecularWeight: 86.18,
    ghsHazards: ['H225', 'H304', 'H315', 'H336', 'H361f', 'H411'],
    hazardStatements: ['高度易燃液体和蒸气', '吞咽并进入呼吸道可能致命', '造成皮肤刺激', '可能引起困倦或眩晕', '怀疑对生育能力造成伤害', '对水生生物有毒并具有长期持续影响'],
    pictograms: ['火焰', '健康危害', '感叹号', '环境'],
    precautions: ['远离热源/火花', '避免吸入蒸气', '戴防护手套', '通风良好处使用'],
    incompatible: ['强氧化剂', '强酸'],
    storage: '阴凉通风处，远离火源',
    storageTemp: '2-8°C（易挥发）',
    shelfLife: '2年（密封）',
    disposal: '焚烧或回收',
    firstAid: {
      skin: '脱去污染衣着，用肥皂水和清水彻底冲洗',
      eyes: '用流动清水冲洗至少15分钟',
      inhalation: '脱离现场至空气新鲜处，如呼吸困难给输氧',
      ingestion: '禁止催吐，立即就医'
    },
    notes: '常用于萃取和色谱，蒸气压高，易挥发'
  },
  {
    name: '环己烷',
    nameEn: 'Cyclohexane',
    abbreviation: 'cHex',
    cas: '110-82-7',
    un: 'UN1145',
    einecs: '203-806-2',
    formula: 'C6H12',
    molecularWeight: 84.16,
    ghsHazards: ['H225', 'H304', 'H315', 'H336', 'H410'],
    hazardStatements: ['高度易燃液体和蒸气', '吞咽并进入呼吸道可能致命', '造成皮肤刺激', '可能引起困倦或眩晕', '对水生生物毒性极大并具有长期持续影响'],
    pictograms: ['火焰', '健康危害', '感叹号', '环境'],
    precautions: ['远离热源', '避免吸入蒸气', '防止排入环境'],
    incompatible: ['强氧化剂'],
    storage: '阴凉通风处，远离火源',
    storageTemp: '室温（避免高温）',
    shelfLife: '3年',
    disposal: '焚烧处理',
    firstAid: {
      skin: '脱去污染衣着，用肥皂水冲洗',
      eyes: '用流动清水冲洗15分钟',
      inhalation: '脱离现场，给输氧',
      ingestion: '禁止催吐，就医'
    },
    notes: '常用溶剂，比正己烷毒性略低'
  },
  {
    name: '叔丁醇',
    nameEn: 'tert-Butanol',
    abbreviation: 't-BuOH',
    cas: '75-65-0',
    un: 'UN1120',
    einecs: '200-889-7',
    formula: 'C4H10O',
    molecularWeight: 74.12,
    ghsHazards: ['H225', 'H302', 'H315', 'H319', 'H335', 'H336'],
    hazardStatements: ['高度易燃液体和蒸气', '吞咽有害', '造成皮肤刺激', '造成严重眼刺激', '可能引起呼吸道刺激', '可能引起困倦或眩晕'],
    pictograms: ['火焰', '感叹号'],
    precautions: ['远离热源', '戴防护手套/眼罩', '通风良好处使用'],
    incompatible: ['强氧化剂', '强酸'],
    storage: '阴凉通风处，远离火源',
    storageTemp: '室温',
    shelfLife: '3年',
    disposal: '焚烧处理',
    firstAid: {
      skin: '用肥皂水和清水冲洗',
      eyes: '用流动清水冲洗15分钟',
      inhalation: '脱离现场至空气新鲜处',
      ingestion: '漱口，饮水，就医'
    },
    notes: '常用溶剂，熔点25.5°C，冬天易凝固'
  },
  {
    name: '1,4-二氧六环',
    nameEn: '1,4-Dioxane',
    abbreviation: 'Dioxane',
    cas: '123-91-1',
    un: 'UN1165',
    einecs: '204-661-8',
    formula: 'C4H8O2',
    molecularWeight: 88.11,
    ghsHazards: ['H225', 'H319', 'H335', 'H351'],
    hazardStatements: ['高度易燃液体和蒸气', '造成严重眼刺激', '可能引起呼吸道刺激', '怀疑致癌'],
    pictograms: ['火焰', '健康危害', '感叹号'],
    precautions: ['远离热源', '避免吸入蒸气', '戴防护手套/眼罩', '使用个人防护设备'],
    incompatible: ['强氧化剂', '强酸'],
    storage: '阴凉通风处，远离火源，使用抗静电容器',
    storageTemp: '室温（避光）',
    shelfLife: '2年（易形成过氧化物）',
    disposal: '焚烧处理',
    firstAid: {
      skin: '脱去污染衣着，用肥皂水冲洗',
      eyes: '用流动清水冲洗15分钟',
      inhalation: '脱离现场，给输氧',
      ingestion: '漱口，就医'
    },
    notes: '⚠️ 怀疑致癌，长期暴露于空气中易形成爆炸性过氧化物，使用前需检测'
  },
  {
    name: '乙腈',
    nameEn: 'Acetonitrile',
    abbreviation: 'MeCN / ACN',
    cas: '75-05-8',
    un: 'UN1648',
    einecs: '200-835-2',
    formula: 'CH3CN',
    molecularWeight: 41.05,
    ghsHazards: ['H225', 'H302', 'H312', 'H319', 'H332'],
    hazardStatements: ['高度易燃液体和蒸气', '吞咽有害', '皮肤接触有害', '造成严重眼刺激', '吸入有害'],
    pictograms: ['火焰', '感叹号'],
    precautions: ['远离热源', '戴防护手套/眼罩', '通风良好处使用', '避免吸入蒸气'],
    incompatible: ['强氧化剂', '强还原剂', '强酸', '强碱'],
    storage: '阴凉通风处，远离火源',
    storageTemp: '室温',
    shelfLife: '3年',
    disposal: '焚烧处理',
    firstAid: {
      skin: '脱去污染衣着，用肥皂水冲洗',
      eyes: '用流动清水冲洗15分钟',
      inhalation: '脱离现场，给输氧',
      ingestion: '漱口，就医'
    },
    notes: 'HPLC常用溶剂，极性介于水和甲醇之间'
  },
  {
    name: '乙二醇',
    nameEn: 'Ethylene glycol',
    abbreviation: 'EG',
    cas: '107-21-1',
    un: 'Not regulated',
    einecs: '203-473-3',
    formula: 'C2H6O2',
    molecularWeight: 62.07,
    ghsHazards: ['H302'],
    hazardStatements: ['吞咽有害'],
    pictograms: ['感叹号'],
    precautions: ['避免食入', '使用后彻底清洗'],
    incompatible: ['强氧化剂', '强酸'],
    storage: '常温保存',
    storageTemp: '室温',
    shelfLife: '长期稳定',
    disposal: '焚烧处理',
    firstAid: {
      skin: '用肥皂水冲洗',
      eyes: '用流动清水冲洗',
      inhalation: '脱离现场',
      ingestion: '禁止催吐，立即就医'
    },
    notes: '防冻剂主要成分，有甜味但有毒，误食危险'
  },
  {
    name: '氯苯',
    nameEn: 'Chlorobenzene',
    abbreviation: 'PhCl',
    cas: '108-90-7',
    un: 'UN1134',
    einecs: '203-628-5',
    formula: 'C6H5Cl',
    molecularWeight: 112.56,
    ghsHazards: ['H226', 'H332', 'H411'],
    hazardStatements: ['易燃液体和蒸气', '吸入有害', '对水生生物有毒并具有长期持续影响'],
    pictograms: ['火焰', '感叹号', '环境'],
    precautions: ['远离热源', '避免吸入蒸气', '防止排入环境', '通风良好处使用'],
    incompatible: ['强氧化剂', '强碱'],
    storage: '阴凉通风处，远离火源',
    storageTemp: '室温',
    shelfLife: '3年',
    disposal: '焚烧或专业回收',
    firstAid: {
      skin: '脱去污染衣着，用肥皂水冲洗',
      eyes: '用流动清水冲洗15分钟',
      inhalation: '脱离现场，给输氧',
      ingestion: '漱口，就医'
    },
    notes: '芳香烃溶剂，有特殊气味'
  },
  {
    name: '邻二氯苯',
    nameEn: 'o-Dichlorobenzene',
    abbreviation: 'o-DCB',
    cas: '95-50-1',
    un: 'UN1591',
    einecs: '202-425-9',
    formula: 'C6H4Cl2',
    molecularWeight: 147.00,
    ghsHazards: ['H302', 'H319', 'H411'],
    hazardStatements: ['吞咽有害', '造成严重眼刺激', '对水生生物有毒并具有长期持续影响'],
    pictograms: ['感叹号', '环境'],
    precautions: ['避免食入', '戴防护眼罩', '防止排入环境'],
    incompatible: ['强氧化剂', '铝'],
    storage: '阴凉通风处',
    storageTemp: '室温',
    shelfLife: '3年',
    disposal: '焚烧或专业回收',
    firstAid: {
      skin: '用肥皂水冲洗',
      eyes: '用流动清水冲洗15分钟',
      inhalation: '脱离现场',
      ingestion: '漱口，就医'
    },
    notes: '高沸点溶剂，用于高温反应'
  },
  {
    name: '正丁醇',
    nameEn: 'n-Butanol',
    abbreviation: 'n-BuOH',
    cas: '71-36-3',
    un: 'UN1120',
    einecs: '200-751-6',
    formula: 'C4H10O',
    molecularWeight: 74.12,
    ghsHazards: ['H226', 'H302', 'H315', 'H318', 'H335', 'H336'],
    hazardStatements: ['易燃液体和蒸气', '吞咽有害', '造成皮肤刺激', '造成严重眼损伤', '可能引起呼吸道刺激', '可能引起困倦或眩晕'],
    pictograms: ['火焰', '感叹号', '腐蚀'],
    precautions: ['远离热源', '戴防护手套/眼罩', '通风良好处使用'],
    incompatible: ['强氧化剂', '强酸', '铬酸酐', '过氯酸'],
    storage: '阴凉通风处，远离火源',
    storageTemp: '室温',
    shelfLife: '3年',
    disposal: '焚烧处理',
    firstAid: {
      skin: '用肥皂水冲洗',
      eyes: '用流动清水冲洗至少15分钟，就医',
      inhalation: '脱离现场，给输氧',
      ingestion: '漱口，就医'
    },
    notes: '中等极性溶剂，可与大多数有机溶剂混溶'
  },
  {
    name: '异丙醇',
    nameEn: 'Isopropanol / 2-Propanol',
    abbreviation: 'IPA / i-PrOH',
    cas: '67-63-0',
    un: 'UN1219',
    einecs: '200-661-7',
    formula: 'C3H8O',
    molecularWeight: 60.10,
    ghsHazards: ['H225', 'H319', 'H336'],
    hazardStatements: ['高度易燃液体和蒸气', '造成严重眼刺激', '可能引起困倦或眩晕'],
    pictograms: ['火焰', '感叹号'],
    precautions: ['远离热源', '戴防护眼罩', '通风良好处使用'],
    incompatible: ['强氧化剂', '铝', '过氧化物'],
    storage: '阴凉通风处，远离火源',
    storageTemp: '室温',
    shelfLife: '3年',
    disposal: '焚烧处理',
    firstAid: {
      skin: '用肥皂水冲洗',
      eyes: '用流动清水冲洗15分钟',
      inhalation: '脱离现场',
      ingestion: '漱口，就医'
    },
    notes: '常用清洗溶剂和消毒剂，75%水溶液可消毒'
  },
  // 有机试剂类（15种）
  {
    name: '对甲苯磺酸',
    nameEn: 'p-Toluenesulfonic acid',
    abbreviation: 'TsOH / PTSA',
    cas: '104-15-4',
    un: 'UN2585',
    einecs: '203-180-0',
    formula: 'C7H8O3S',
    molecularWeight: 172.20,
    ghsHazards: ['H314'],
    hazardStatements: ['造成严重皮肤灼伤和眼损伤'],
    pictograms: ['腐蚀'],
    precautions: ['戴防护手套/眼罩', '防止吸入粉尘'],
    incompatible: ['强碱', '强氧化剂'],
    storage: '阴凉干燥处，密闭保存',
    storageTemp: '室温',
    shelfLife: '5年',
    disposal: '中和后排放',
    firstAid: {
      skin: '立即脱去污染衣着，用大量流动清水冲洗至少15分钟',
      eyes: '立即提起眼睑，用流动清水冲洗至少15分钟，就医',
      inhalation: '脱离现场',
      ingestion: '漱口，禁止催吐，就医'
    },
    notes: '有机酸催化剂，常用于酯化反应，吸湿性强'
  },
  {
    name: '对甲苯磺酰氯',
    nameEn: 'p-Toluenesulfonyl chloride',
    abbreviation: 'TsCl / Tosyl chloride',
    cas: '98-59-9',
    un: 'Not regulated',
    einecs: '202-684-8',
    formula: 'C7H7ClO2S',
    molecularWeight: 190.65,
    ghsHazards: ['H302', 'H314', 'H335'],
    hazardStatements: ['吞咽有害', '造成严重皮肤灼伤和眼损伤', '可能引起呼吸道刺激'],
    pictograms: ['腐蚀', '感叹号'],
    precautions: ['戴防护手套/眼罩', '防止吸入粉尘', '在通风橱中操作'],
    incompatible: ['水', '醇类', '胺类', '强碱'],
    storage: '阴凉干燥处，密闭保存，远离水分',
    storageTemp: '2-8°C（推荐）',
    shelfLife: '2年（密封干燥）',
    disposal: '碱性水解后中和',
    firstAid: {
      skin: '立即脱去污染衣着，用大量流动清水冲洗',
      eyes: '立即用流动清水冲洗至少15分钟，就医',
      inhalation: '脱离现场，给输氧',
      ingestion: '漱口，禁止催吐，就医'
    },
    notes: '常用保护基试剂，遇水分解产生HCl，刺激性强'
  },
  {
    name: '三氟甲磺酸',
    nameEn: 'Trifluoromethanesulfonic acid',
    abbreviation: 'TfOH',
    cas: '1493-13-6',
    un: 'UN2699',
    einecs: '216-087-5',
    formula: 'CF3SO3H',
    molecularWeight: 150.08,
    ghsHazards: ['H314'],
    hazardStatements: ['造成严重皮肤灼伤和眼损伤'],
    pictograms: ['腐蚀'],
    precautions: ['戴防护手套/眼罩', '在通风橱中操作', '防止吸入蒸气'],
    incompatible: ['碱类', '水（大量）'],
    storage: '阴凉干燥处，密闭保存，使用玻璃瓶',
    storageTemp: '室温',
    shelfLife: '5年',
    disposal: '稀释后中和',
    firstAid: {
      skin: '立即脱去污染衣着，用大量流动清水冲洗',
      eyes: '立即用流动清水冲洗至少15分钟，就医',
      inhalation: '脱离现场',
      ingestion: '禁止催吐，就医'
    },
    notes: '超强酸催化剂，酸性比硫酸强1000倍，使用需格外小心'
  },
  {
    name: '三氟甲磺酸酐',
    nameEn: 'Trifluoromethanesulfonic anhydride',
    abbreviation: 'Tf2O',
    cas: '358-23-6',
    un: 'UN2924',
    einecs: '206-643-8',
    formula: 'C2F6O5S2',
    molecularWeight: 282.13,
    ghsHazards: ['H314', 'H335'],
    hazardStatements: ['造成严重皮肤灼伤和眼损伤', '可能引起呼吸道刺激'],
    pictograms: ['腐蚀', '感叹号'],
    precautions: ['戴防护手套/眼罩', '在通风橱中操作', '远离水分'],
    incompatible: ['水', '醇类', '胺类', '碱类'],
    storage: '阴凉干燥处，密闭保存，氮气保护',
    storageTemp: '2-8°C',
    shelfLife: '1年（密封）',
    disposal: '在冰浴下缓慢加入碱溶液中水解',
    firstAid: {
      skin: '立即脱去污染衣着，用大量流动清水冲洗',
      eyes: '立即用流动清水冲洗至少15分钟，就医',
      inhalation: '脱离现场，给输氧',
      ingestion: '禁止催吐，立即就医'
    },
    notes: '强酰化试剂，遇水剧烈反应，操作需在无水条件下'
  },
  {
    name: '三乙胺',
    nameEn: 'Triethylamine',
    abbreviation: 'TEA / Et3N',
    cas: '121-44-8',
    un: 'UN1296',
    einecs: '204-469-4',
    formula: 'C6H15N',
    molecularWeight: 101.19,
    ghsHazards: ['H225', 'H302', 'H312', 'H314', 'H332'],
    hazardStatements: ['高度易燃液体和蒸气', '吞咽有害', '皮肤接触有害', '造成严重皮肤灼伤和眼损伤', '吸入有害'],
    pictograms: ['火焰', '腐蚀', '感叹号'],
    precautions: ['远离热源', '戴防护手套/眼罩', '在通风橱中操作'],
    incompatible: ['强氧化剂', '强酸', '酰氯', '酸酐'],
    storage: '阴凉通风处，远离火源，密闭保存',
    storageTemp: '2-8°C',
    shelfLife: '3年',
    disposal: '焚烧处理',
    firstAid: {
      skin: '立即脱去污染衣着，用大量流动清水冲洗',
      eyes: '立即用流动清水冲洗至少15分钟，就医',
      inhalation: '脱离现场，给输氧',
      ingestion: '漱口，就医'
    },
    notes: '常用有机碱，特殊鱼腥味，腐蚀性强'
  },
  {
    name: '二异丙基乙胺',
    nameEn: 'N,N-Diisopropylethylamine',
    abbreviation: 'DIPEA / Hunig\'s base',
    cas: '7087-68-5',
    un: 'UN2733',
    einecs: '230-392-0',
    formula: 'C8H19N',
    molecularWeight: 129.24,
    ghsHazards: ['H225', 'H302', 'H314', 'H332'],
    hazardStatements: ['高度易燃液体和蒸气', '吞咽有害', '造成严重皮肤灼伤和眼损伤', '吸入有害'],
    pictograms: ['火焰', '腐蚀', '感叹号'],
    precautions: ['远离热源', '戴防护手套/眼罩', '在通风橱中操作'],
    incompatible: ['强氧化剂', '强酸'],
    storage: '阴凉通风处，远离火源',
    storageTemp: '2-8°C',
    shelfLife: '3年',
    disposal: '焚烧处理',
    firstAid: {
      skin: '立即脱去污染衣着，用大量流动清水冲洗',
      eyes: '立即用流动清水冲洗至少15分钟，就医',
      inhalation: '脱离现场，给输氧',
      ingestion: '漱口，就医'
    },
    notes: 'Hünig碱，位阻大的有机碱，常用于肽合成'
  },
  {
    name: '吡啶',
    nameEn: 'Pyridine',
    abbreviation: 'Py',
    cas: '110-86-1',
    un: 'UN1282',
    einecs: '203-809-9',
    formula: 'C5H5N',
    molecularWeight: 79.10,
    ghsHazards: ['H225', 'H302', 'H312', 'H332'],
    hazardStatements: ['高度易燃液体和蒸气', '吞咽有害', '皮肤接触有害', '吸入有害'],
    pictograms: ['火焰', '感叹号'],
    precautions: ['远离热源', '戴防护手套', '在通风橱中操作', '避免吸入蒸气'],
    incompatible: ['强氧化剂', '强酸', '酰氯'],
    storage: '阴凉通风处，远离火源',
    storageTemp: '室温',
    shelfLife: '3年',
    disposal: '焚烧处理',
    firstAid: {
      skin: '脱去污染衣着，用肥皂水冲洗',
      eyes: '用流动清水冲洗15分钟',
      inhalation: '脱离现场，给输氧',
      ingestion: '漱口，就医'
    },
    notes: '芳香杂环碱，特殊恶臭，难以去除，常用溶剂和催化剂'
  },
  {
    name: '4-二甲氨基吡啶',
    nameEn: '4-Dimethylaminopyridine',
    abbreviation: 'DMAP',
    cas: '1122-58-3',
    un: 'Not regulated',
    einecs: '214-353-5',
    formula: 'C7H10N2',
    molecularWeight: 122.17,
    ghsHazards: ['H301', 'H311', 'H314', 'H331'],
    hazardStatements: ['吞咽会中毒', '皮肤接触会中毒', '造成严重皮肤灼伤和眼损伤', '吸入会中毒'],
    pictograms: ['骷髅', '腐蚀'],
    precautions: ['戴防护手套/眼罩/面罩', '在通风橱中操作', '避免吸入粉尘'],
    incompatible: ['强氧化剂', '强酸', '酰氯'],
    storage: '阴凉干燥处，密闭保存，锁存',
    storageTemp: '2-8°C',
    shelfLife: '5年',
    disposal: '专业回收或焚烧',
    firstAid: {
      skin: '立即脱去污染衣着，用大量流动清水冲洗至少15分钟，就医',
      eyes: '立即用流动清水冲洗至少15分钟，就医',
      inhalation: '脱离现场，给输氧，就医',
      ingestion: '立即就医，不要催吐'
    },
    notes: '⚠️ 高毒性！强亲核催化剂，使用需格外小心，皮肤吸收快'
  },
  {
    name: '二环己基碳二亚胺',
    nameEn: 'N,N\'-Dicyclohexylcarbodiimide',
    abbreviation: 'DCC',
    cas: '538-75-0',
    un: 'Not regulated',
    einecs: '208-704-1',
    formula: 'C13H22N2',
    molecularWeight: 206.33,
    ghsHazards: ['H315', 'H317', 'H319', 'H334', 'H335'],
    hazardStatements: ['造成皮肤刺激', '可能造成皮肤过敏反应', '造成严重眼刺激', '吸入可能引起过敏或哮喘症状或呼吸困难', '可能引起呼吸道刺激'],
    pictograms: ['健康危害', '感叹号'],
    precautions: ['戴防护手套/眼罩/面罩', '在通风橱中操作', '避免吸入粉尘'],
    incompatible: ['水', '酸', '氧化剂'],
    storage: '阴凉干燥处，密闭保存，2-8°C最佳',
    storageTemp: '2-8°C',
    shelfLife: '2年',
    disposal: '水解后处理',
    firstAid: {
      skin: '脱去污染衣着，用肥皂水和清水冲洗',
      eyes: '用流动清水冲洗15分钟，就医',
      inhalation: '脱离现场，如有过敏反应立即就医',
      ingestion: '漱口，就医'
    },
    notes: '⚠️ 可能引起过敏反应，常用缩合试剂，肽合成常用'
  },
  {
    name: '1-乙基-3-(3-二甲氨基丙基)碳二亚胺',
    nameEn: '1-Ethyl-3-(3-dimethylaminopropyl)carbodiimide',
    abbreviation: 'EDC / EDCI',
    cas: '25952-53-8',
    un: 'Not regulated',
    einecs: '247-379-0',
    formula: 'C8H17N3',
    molecularWeight: 155.24,
    ghsHazards: ['H302', 'H315', 'H319', 'H335'],
    hazardStatements: ['吞咽有害', '造成皮肤刺激', '造成严重眼刺激', '可能引起呼吸道刺激'],
    pictograms: ['感叹号'],
    precautions: ['戴防护手套/眼罩', '在通风橱中操作'],
    incompatible: ['水', '强氧化剂'],
    storage: '阴凉干燥处，密闭保存',
    storageTemp: '-20°C（长期）或2-8°C（短期）',
    shelfLife: '2年（-20°C）',
    disposal: '水解后处理',
    firstAid: {
      skin: '用肥皂水冲洗',
      eyes: '用流动清水冲洗15分钟',
      inhalation: '脱离现场',
      ingestion: '漱口，就医'
    },
    notes: '水溶性缩合试剂，比DCC更易处理，肽合成常用'
  },
  {
    name: '羰基二咪唑',
    nameEn: 'Carbonyldiimidazole',
    abbreviation: 'CDI',
    cas: '530-62-1',
    un: 'Not regulated',
    einecs: '208-485-9',
    formula: 'C7H6N4O',
    molecularWeight: 162.15,
    ghsHazards: ['H302', 'H315', 'H319', 'H335'],
    hazardStatements: ['吞咽有害', '造成皮肤刺激', '造成严重眼刺激', '可能引起呼吸道刺激'],
    pictograms: ['感叹号'],
    precautions: ['戴防护手套/眼罩', '避免吸入粉尘', '在通风橱中操作'],
    incompatible: ['水', '醇类', '胺类', '羧酸'],
    storage: '阴凉干燥处，密闭保存，氮气或氩气保护',
    storageTemp: '2-8°C',
    shelfLife: '2年',
    disposal: '水解后处理',
    firstAid: {
      skin: '用肥皂水冲洗',
      eyes: '用流动清水冲洗15分钟',
      inhalation: '脱离现场',
      ingestion: '漱口，就医'
    },
    notes: '温和的缩合试剂，遇水分解，常用于酯化和酰胺化'
  },
  {
    name: '氢化铝锂',
    nameEn: 'Lithium aluminum hydride',
    abbreviation: 'LAH / LiAlH4',
    cas: '16853-85-3',
    un: 'UN1410',
    einecs: '240-877-9',
    formula: 'LiAlH4',
    molecularWeight: 37.95,
    ghsHazards: ['H260', 'H314'],
    hazardStatements: ['遇水释放易燃气体，可自燃', '造成严重皮肤灼伤和眼损伤'],
    pictograms: ['火焰', '腐蚀'],
    precautions: ['远离水分', '在惰性气体保护下操作', '戴防护手套/眼罩', '准备干砂灭火'],
    incompatible: ['水', '醇类', '酸', '氧化剂', '含活泼氢的化合物'],
    storage: '在手套箱或干燥器中保存，矿物油覆盖',
    storageTemp: '室温（干燥）',
    shelfLife: '5年（干燥条件）',
    disposal: '在冰浴下缓慢加入乙酸乙酯中猝灭，然后加水分解',
    firstAid: {
      skin: '小心去除残留物（勿用水），用干布擦拭后就医',
      eyes: '勿用水冲洗！用矿物油冲洗后就医',
      inhalation: '脱离现场',
      ingestion: '禁止催吐，立即就医'
    },
    notes: '⚠️ 遇水剧烈反应！强还原剂，操作必须在无水无氧条件下，灭火用干砂不用水'
  },
  {
    name: '硼氢化钠',
    nameEn: 'Sodium borohydride',
    abbreviation: 'NaBH4',
    cas: '16940-66-2',
    un: 'UN1426',
    einecs: '241-004-4',
    formula: 'NaBH4',
    molecularWeight: 37.83,
    ghsHazards: ['H260', 'H301', 'H314'],
    hazardStatements: ['遇水释放易燃气体', '吞咽会中毒', '造成严重皮肤灼伤和眼损伤'],
    pictograms: ['火焰', '腐蚀', '骷髅'],
    precautions: ['远离水分', '戴防护手套/眼罩', '在通风橱中操作'],
    incompatible: ['水', '酸', '醇类（低pH）', '氧化剂'],
    storage: '阴凉干燥处，密闭保存',
    storageTemp: '室温（干燥）',
    shelfLife: '5年（干燥）',
    disposal: '在冰浴下缓慢加入稀酸中分解',
    firstAid: {
      skin: '立即脱去污染衣着，用大量流动清水冲洗',
      eyes: '立即用流动清水冲洗至少15分钟，就医',
      inhalation: '脱离现场',
      ingestion: '禁止催吐，立即就医'
    },
    notes: '温和还原剂，比LAH安全，可在醇溶液中使用但需碱性条件'
  },
  {
    name: '高锰酸钾',
    nameEn: 'Potassium permanganate',
    abbreviation: 'KMnO4',
    cas: '7722-64-7',
    un: 'UN1490',
    einecs: '231-760-3',
    formula: 'KMnO4',
    molecularWeight: 158.03,
    ghsHazards: ['H272', 'H302', 'H410'],
    hazardStatements: ['可能加剧燃烧；氧化剂', '吞咽有害', '对水生生物毒性极大并具有长期持续影响'],
    pictograms: ['氧化性', '感叹号', '环境'],
    precautions: ['远离可燃物', '戴防护手套', '防止排入环境'],
    incompatible: ['可燃物', '还原剂', '有机物', '硫酸', '甘油'],
    storage: '阴凉通风处，远离可燃物和还原剂',
    storageTemp: '室温',
    shelfLife: '长期稳定',
    disposal: '还原后中和排放',
    firstAid: {
      skin: '用大量清水冲洗，会留下褐色斑点',
      eyes: '用流动清水冲洗15分钟',
      inhalation: '脱离现场',
      ingestion: '漱口，就医'
    },
    notes: '强氧化剂，与有机物接触可能引起燃烧或爆炸'
  },
  {
    name: '重铬酸钾',
    nameEn: 'Potassium dichromate',
    abbreviation: 'K2Cr2O7',
    cas: '7778-50-9',
    un: 'UN3288',
    einecs: '231-906-6',
    formula: 'K2Cr2O7',
    molecularWeight: 294.18,
    ghsHazards: ['H272', 'H301', 'H312', 'H314', 'H317', 'H330', 'H334', 'H340', 'H350', 'H360FD', 'H372', 'H410'],
    hazardStatements: ['可能加剧燃烧', '吞咽会中毒', '皮肤接触会中毒', '造成严重皮肤灼伤和眼损伤', '可能造成皮肤过敏反应', '吸入致命', '吸入可能引起过敏或哮喘', '可能致癌', '可能对生育能力或胎儿造成伤害', '长期或反复接触会对器官造成伤害', '对水生生物毒性极大'],
    pictograms: ['氧化性', '骷髅', '腐蚀', '健康危害', '环境'],
    precautions: ['远离可燃物', '戴防护手套/眼罩/面罩', '在通风橱中操作', '避免吸入粉尘', '使用个人防护设备'],
    incompatible: ['可燃物', '还原剂', '有机物', '硫酸', '醇类'],
    storage: '阴凉干燥通风处，远离可燃物，锁存',
    storageTemp: '室温',
    shelfLife: '长期稳定',
    disposal: '还原后中和，专业处理',
    firstAid: {
      skin: '立即脱去污染衣着，用大量流动清水冲洗至少15分钟，就医',
      eyes: '立即用流动清水冲洗至少15分钟，就医',
      inhalation: '脱离现场，给输氧，立即就医',
      ingestion: '禁止催吐，立即就医'
    },
    notes: '⚠⚠⚠ 剧毒！致癌！强氧化剂，使用需极度小心，皮肤染色难以去除'
  }
];

/**
 * 按名称、英文名、缩写或CAS号搜索化学品
 * 支持中文名、英文全名、英文缩写、分子式、CAS号
 */
function searchChemical(query) {
  const q = query.toLowerCase().trim();
  return CHEMICAL_SAFETY_DATA.filter(chem => {
    // 搜索中文名
    if (chem.name.toLowerCase().includes(q)) return true;
    
    // 搜索英文名（包含缩写）
    if (chem.nameEn.toLowerCase().includes(q)) return true;
    
    // 搜索CAS号
    if (chem.cas.includes(q)) return true;
    
    // 搜索分子式
    if (chem.formula.toLowerCase().includes(q)) return true;
    
    // 额外搜索：提取名称中的缩写（如 "EA / EtOAc" 中的 EA）
    const abbreviations = chem.name.match(/[A-Z]{2,}/g);
    if (abbreviations && abbreviations.some(abbr => abbr.toLowerCase().includes(q))) {
      return true;
    }
    
    // 额外搜索：提取英文名中的缩写
    const enAbbreviations = chem.nameEn.match(/\b[A-Z]{2,}\b/g);
    if (enAbbreviations && enAbbreviations.some(abbr => abbr.toLowerCase() === q)) {
      return true;
    }
    
    return false;
  });
}

/**
 * 获取所有化学品列表
 */
function getAllChemicals() {
  return CHEMICAL_SAFETY_DATA.map(c => ({
    name: c.name,
    nameEn: c.nameEn,
    cas: c.cas,
    formula: c.formula,
    hazardLevel: getHazardLevel(c.ghsHazards)
  }));
}

/**
 * 评估危险等级
 */
function getHazardLevel(ghsHazards) {
  if (!ghsHazards || ghsHazards.length === 0) return 'low';
  
  // 高危：致死、致癌、腐蚀
  if (ghsHazards.some(h => h.startsWith('H3') && parseInt(h.slice(1)) < 320)) {
    return 'high';
  }
  // 中危：有害
  if (ghsHazards.some(h => h.startsWith('H3') || h.startsWith('H2'))) {
    return 'medium';
  }
  return 'low';
}

module.exports = {
  CHEMICAL_SAFETY_DATA,
  searchChemical,
  getAllChemicals
};

