// UTF-8, no BOM
// 常用谱学参考小表：XPS 结合能、拉曼/IR 官能团峰位（离线）

const xpsBindingEnergies = [
  // C 1s 峰位
  { element: 'C', state: 'C 1s', be: 284.8, note: 'sp2 C-C/C-H 参考（石墨）', uncertainty: 0.2 },
  { element: 'C', state: 'C 1s', be: 285.0, note: 'sp3 C-C/C-H（金刚石）', uncertainty: 0.2 },
  { element: 'C', state: 'C 1s', be: 286.5, note: 'C-O（醇、醚）', uncertainty: 0.3 },
  { element: 'C', state: 'C 1s', be: 288.0, note: 'C=O（羰基）', uncertainty: 0.3 },
  { element: 'C', state: 'C 1s', be: 289.0, note: 'O-C=O（羧基、碳酸盐）', uncertainty: 0.3 },
  { element: 'C', state: 'C 1s', be: 283.8, note: 'C-F（氟化物）', uncertainty: 0.3 },
  { element: 'C', state: 'C 1s', be: 291.4, note: 'CF2（聚四氟乙烯）', uncertainty: 0.3 },
  
  // O 1s 峰位
  { element: 'O', state: 'O 1s', be: 530.0, note: '晶格氧（金属氧化物）', uncertainty: 0.3 },
  { element: 'O', state: 'O 1s', be: 531.0, note: '金属氧化物 M–O', uncertainty: 0.3 },
  { element: 'O', state: 'O 1s', be: 532.0, note: '羟基 -OH', uncertainty: 0.3 },
  { element: 'O', state: 'O 1s', be: 532.5, note: '羰基 C=O', uncertainty: 0.3 },
  { element: 'O', state: 'O 1s', be: 533.0, note: '吸附水', uncertainty: 0.3 },
  { element: 'O', state: 'O 1s', be: 531.5, note: 'Si-O-Si（硅氧键）', uncertainty: 0.3 },
  
  // N 1s 峰位
  { element: 'N', state: 'N 1s', be: 398.5, note: '氮化物 N^3−', uncertainty: 0.3 },
  { element: 'N', state: 'N 1s', be: 399.8, note: '胺 -NH2/吡啶类', uncertainty: 0.3 },
  { element: 'N', state: 'N 1s', be: 400.5, note: '吡咯类', uncertainty: 0.3 },
  { element: 'N', state: 'N 1s', be: 401.8, note: '季铵 N^+', uncertainty: 0.3 },
  { element: 'N', state: 'N 1s', be: 406.0, note: '硝基 -NO2', uncertainty: 0.3 },
  
  // Si 2p 峰位
  { element: 'Si', state: 'Si 2p', be: 99.3, note: 'Si^0（单质硅）', uncertainty: 0.2 },
  { element: 'Si', state: 'Si 2p', be: 99.8, note: 'Si-C（碳化硅）', uncertainty: 0.2 },
  { element: 'Si', state: 'Si 2p', be: 102.0, note: 'SiOx 亚氧化物', uncertainty: 0.3 },
  { element: 'Si', state: 'Si 2p', be: 103.3, note: 'SiO2', uncertainty: 0.2 },
  { element: 'Si', state: 'Si 2p', be: 101.8, note: 'Si-N（氮化硅）', uncertainty: 0.3 },
  
  // Cu 2p 峰位
  { element: 'Cu', state: 'Cu 2p3/2', be: 932.6, note: 'Cu^0/Cu^+', uncertainty: 0.3 },
  { element: 'Cu', state: 'Cu 2p3/2', be: 933.8, note: 'Cu2O', uncertainty: 0.3 },
  { element: 'Cu', state: 'Cu 2p3/2', be: 934.6, note: 'Cu^2+（CuO），伴随卫星峰', uncertainty: 0.3 },
  { element: 'Cu', state: 'Cu 2p3/2', be: 935.5, note: 'Cu(OH)2', uncertainty: 0.3 },
  
  // Fe 2p 峰位
  { element: 'Fe', state: 'Fe 2p3/2', be: 706.8, note: 'Fe^0（金属铁）', uncertainty: 0.3 },
  { element: 'Fe', state: 'Fe 2p3/2', be: 709.6, note: 'Fe^2+（FeO）', uncertainty: 0.3 },
  { element: 'Fe', state: 'Fe 2p3/2', be: 710.8, note: 'Fe^3+（Fe2O3）', uncertainty: 0.3 },
  { element: 'Fe', state: 'Fe 2p3/2', be: 711.5, note: 'FeOOH（羟基氧化铁）', uncertainty: 0.3 },
  
  // Ti 2p 峰位
  { element: 'Ti', state: 'Ti 2p3/2', be: 454.0, note: 'Ti^0（金属钛）', uncertainty: 0.3 },
  { element: 'Ti', state: 'Ti 2p3/2', be: 455.0, note: 'Ti^2+（TiO）', uncertainty: 0.3 },
  { element: 'Ti', state: 'Ti 2p3/2', be: 457.0, note: 'Ti^3+（Ti2O3/缺陷）', uncertainty: 0.3 },
  { element: 'Ti', state: 'Ti 2p3/2', be: 458.8, note: 'Ti^4+（TiO2）', uncertainty: 0.2 },
  { element: 'Ti', state: 'Ti 2p3/2', be: 460.0, note: 'TiOx 过氧化态', uncertainty: 0.3 },
  
  // Al 2p 峰位
  { element: 'Al', state: 'Al 2p', be: 72.9, note: 'Al^0（金属铝）', uncertainty: 0.2 },
  { element: 'Al', state: 'Al 2p', be: 74.7, note: 'Al^3+（Al2O3）', uncertainty: 0.2 },
  { element: 'Al', state: 'Al 2p', be: 75.5, note: 'Al(OH)3', uncertainty: 0.3 },
  
  // S 2p 峰位
  { element: 'S', state: 'S 2p3/2', be: 161.5, note: '硫化物 S^2−（金属硫化物）', uncertainty: 0.3 },
  { element: 'S', state: 'S 2p3/2', be: 162.0, note: 'S^2−（硫化物）', uncertainty: 0.3 },
  { element: 'S', state: 'S 2p3/2', be: 163.5, note: 'S-C（有机硫）', uncertainty: 0.3 },
  { element: 'S', state: 'S 2p3/2', be: 164.0, note: '单质硫 S^0', uncertainty: 0.3 },
  { element: 'S', state: 'S 2p3/2', be: 165.0, note: 'S-S（二硫键）', uncertainty: 0.3 },
  { element: 'S', state: 'S 2p3/2', be: 166.5, note: 'SO3^2−（亚硫酸盐）', uncertainty: 0.3 },
  { element: 'S', state: 'S 2p3/2', be: 168.5, note: 'S^6+（SO4^2− 硫酸盐）', uncertainty: 0.3 },
  
  // 金标准参考
  { element: 'Au', state: 'Au 4f7/2', be: 84.0, note: 'Au^0（金标准，校准用）', uncertainty: 0.1 },
  { element: 'Au', state: 'Au 4f7/2', be: 85.2, note: 'Au^+', uncertainty: 0.3 },
  { element: 'Au', state: 'Au 4f7/2', be: 86.8, note: 'Au^3+', uncertainty: 0.3 },
  
  // Ag 3d 峰位
  { element: 'Ag', state: 'Ag 3d5/2', be: 368.2, note: 'Ag^0（金属银）', uncertainty: 0.2 },
  { element: 'Ag', state: 'Ag 3d5/2', be: 367.5, note: 'Ag2O', uncertainty: 0.3 },
  { element: 'Ag', state: 'Ag 3d5/2', be: 368.7, note: 'AgCl', uncertainty: 0.3 },
  
  // 更多金属元素
  { element: 'Zn', state: 'Zn 2p3/2', be: 1021.8, note: 'Zn^0（金属锌）', uncertainty: 0.3 },
  { element: 'Zn', state: 'Zn 2p3/2', be: 1022.0, note: 'ZnO', uncertainty: 0.3 },
  { element: 'Zn', state: 'Zn 2p3/2', be: 1022.5, note: 'ZnS', uncertainty: 0.3 },
  
  { element: 'Ni', state: 'Ni 2p3/2', be: 852.6, note: 'Ni^0（金属镍）', uncertainty: 0.3 },
  { element: 'Ni', state: 'Ni 2p3/2', be: 854.0, note: 'Ni^2+（NiO）', uncertainty: 0.3 },
  { element: 'Ni', state: 'Ni 2p3/2', be: 856.0, note: 'Ni(OH)2', uncertainty: 0.3 },
  { element: 'Ni', state: 'Ni 2p3/2', be: 855.5, note: 'NiOOH', uncertainty: 0.3 },
  
  { element: 'Co', state: 'Co 2p3/2', be: 778.2, note: 'Co^0（金属钴）', uncertainty: 0.3 },
  { element: 'Co', state: 'Co 2p3/2', be: 780.0, note: 'Co^2+（CoO）', uncertainty: 0.3 },
  { element: 'Co', state: 'Co 2p3/2', be: 779.8, note: 'Co3O4', uncertainty: 0.3 },
  { element: 'Co', state: 'Co 2p3/2', be: 781.0, note: 'Co^3+', uncertainty: 0.3 },
  
  { element: 'Mn', state: 'Mn 2p3/2', be: 638.7, note: 'Mn^0（金属锰）', uncertainty: 0.3 },
  { element: 'Mn', state: 'Mn 2p3/2', be: 640.8, note: 'Mn^2+（MnO）', uncertainty: 0.3 },
  { element: 'Mn', state: 'Mn 2p3/2', be: 641.8, note: 'Mn^3+（Mn2O3）', uncertainty: 0.3 },
  { element: 'Mn', state: 'Mn 2p3/2', be: 642.5, note: 'Mn^4+（MnO2）', uncertainty: 0.3 },
  
  { element: 'Mo', state: 'Mo 3d5/2', be: 228.0, note: 'Mo^0（金属钼）', uncertainty: 0.3 },
  { element: 'Mo', state: 'Mo 3d5/2', be: 229.0, note: 'Mo^4+（MoS2）', uncertainty: 0.3 },
  { element: 'Mo', state: 'Mo 3d5/2', be: 232.5, note: 'Mo^6+（MoO3）', uncertainty: 0.3 },
  
  { element: 'W', state: 'W 4f7/2', be: 31.4, note: 'W^0（金属钨）', uncertainty: 0.3 },
  { element: 'W', state: 'W 4f7/2', be: 32.5, note: 'W^4+（WS2）', uncertainty: 0.3 },
  { element: 'W', state: 'W 4f7/2', be: 35.7, note: 'W^6+（WO3）', uncertainty: 0.3 },
  
  // P 2p 峰位
  { element: 'P', state: 'P 2p', be: 130.0, note: '磷化物 P^3−', uncertainty: 0.3 },
  { element: 'P', state: 'P 2p', be: 133.3, note: '磷酸盐 PO4^3−', uncertainty: 0.3 },
  { element: 'P', state: 'P 2p', be: 134.5, note: '有机磷', uncertainty: 0.3 },
  
  // F 1s 峰位
  { element: 'F', state: 'F 1s', be: 685.0, note: '金属氟化物 F^−', uncertainty: 0.3 },
  { element: 'F', state: 'F 1s', be: 688.5, note: 'C-F（有机氟）', uncertainty: 0.3 },
  { element: 'F', state: 'F 1s', be: 686.5, note: '无机氟化物', uncertainty: 0.3 },
  
  // Cl 2p 峰位
  { element: 'Cl', state: 'Cl 2p3/2', be: 198.0, note: '氯化物 Cl^−', uncertainty: 0.3 },
  { element: 'Cl', state: 'Cl 2p3/2', be: 199.5, note: '有机氯', uncertainty: 0.3 },
  
  // Sn 3d 峰位
  { element: 'Sn', state: 'Sn 3d5/2', be: 484.9, note: 'Sn^0（金属锡）', uncertainty: 0.3 },
  { element: 'Sn', state: 'Sn 3d5/2', be: 486.8, note: 'Sn^2+（SnO）', uncertainty: 0.3 },
  { element: 'Sn', state: 'Sn 3d5/2', be: 487.2, note: 'Sn^4+（SnO2）', uncertainty: 0.3 },
  
  // Pb 4f 峰位
  { element: 'Pb', state: 'Pb 4f7/2', be: 137.0, note: 'Pb^0（金属铅）', uncertainty: 0.3 },
  { element: 'Pb', state: 'Pb 4f7/2', be: 138.5, note: 'Pb^2+（PbO）', uncertainty: 0.3 },
  { element: 'Pb', state: 'Pb 4f7/2', be: 139.0, note: 'PbO2', uncertainty: 0.3 },
  { element: 'Pb', state: 'Pb 4f7/2', be: 138.3, note: 'PbS', uncertainty: 0.3 },
  
  // Bi 4f 峰位
  { element: 'Bi', state: 'Bi 4f7/2', be: 156.9, note: 'Bi^0（金属铋）', uncertainty: 0.3 },
  { element: 'Bi', state: 'Bi 4f7/2', be: 159.3, note: 'Bi^3+（Bi2O3）', uncertainty: 0.3 },
  { element: 'Bi', state: 'Bi 4f7/2', be: 158.5, note: 'BiVO4', uncertainty: 0.3 }
];

const vibrationalPeaks = [
  // ==========  IR 红外光谱峰位 ==========
  
  // O-H 伸缩振动
  { mode: 'O–H 伸缩(氢键)', region: 'IR', pos: 3300, unit: 'cm⁻¹', note: '3200–3600 宽峰（醇、酚）', intensity: 'strong' },
  { mode: 'O–H 伸缩(游离)', region: 'IR', pos: 3650, unit: 'cm⁻¹', note: '≈3650 尖锐（游离羟基）', intensity: 'medium' },
  { mode: 'O–H 弯曲', region: 'IR', pos: 1640, unit: 'cm⁻¹', note: '1630–1670（水）', intensity: 'medium' },
  { mode: 'O–H 弯曲(醇)', region: 'IR', pos: 1450, unit: 'cm⁻¹', note: '1300–1420（醇羟基）', intensity: 'medium' },
  
  // N-H 伸缩振动
  { mode: 'N–H 伸缩', region: 'IR', pos: 3350, unit: 'cm⁻¹', note: '3300–3500（较尖锐，伯胺）', intensity: 'medium' },
  { mode: 'N–H 伸缩(酰胺)', region: 'IR', pos: 3300, unit: 'cm⁻¹', note: '3200–3400（酰胺I带）', intensity: 'medium' },
  { mode: 'N–H 弯曲', region: 'IR', pos: 1560, unit: 'cm⁻¹', note: '1500–1650（酰胺II带）', intensity: 'strong' },
  
  // C-H 伸缩振动
  { mode: 'C–H 芳香', region: 'IR', pos: 3030, unit: 'cm⁻¹', note: '3010–3100（芳香）', intensity: 'medium' },
  { mode: 'C–H 脂肪', region: 'IR', pos: 2920, unit: 'cm⁻¹', note: '2850–2950（CH2, CH3）', intensity: 'strong' },
  { mode: 'C–H 醛基', region: 'IR', pos: 2720, unit: 'cm⁻¹', note: '2700–2900（醛CHO）', intensity: 'medium' },
  { mode: 'CH2 剪式振动', region: 'IR', pos: 1465, unit: 'cm⁻¹', note: '1450–1470', intensity: 'medium' },
  { mode: 'CH3 对称弯曲', region: 'IR', pos: 1375, unit: 'cm⁻¹', note: '1370–1380', intensity: 'medium' },
  
  // C=O 伸缩振动
  { mode: 'C=O 酮', region: 'IR', pos: 1715, unit: 'cm⁻¹', note: '1705–1725（脂肪族酮）', intensity: 'very strong' },
  { mode: 'C=O 醛', region: 'IR', pos: 1730, unit: 'cm⁻¹', note: '1720–1740（脂肪族醛）', intensity: 'very strong' },
  { mode: 'C=O 酯', region: 'IR', pos: 1735, unit: 'cm⁻¹', note: '1735–1750（酯）', intensity: 'very strong' },
  { mode: 'C=O 羧酸', region: 'IR', pos: 1710, unit: 'cm⁻¹', note: '1700–1725（羧酸）', intensity: 'very strong' },
  { mode: 'C=O 酰胺', region: 'IR', pos: 1650, unit: 'cm⁻¹', note: '1630–1680（酰胺I带）', intensity: 'very strong' },
  { mode: 'C=O 酸酐', region: 'IR', pos: 1820, unit: 'cm⁻¹', note: '1800–1850, 1750–1775（双峰）', intensity: 'very strong' },
  
  // C=C, C=N 伸缩
  { mode: 'C=C 芳香环', region: 'IR', pos: 1600, unit: 'cm⁻¹', note: '1450–1600（芳香骨架）', intensity: 'medium' },
  { mode: 'C=C 烯烃', region: 'IR', pos: 1650, unit: 'cm⁻¹', note: '1620–1680（烯烃）', intensity: 'medium' },
  { mode: 'C=N 伸缩', region: 'IR', pos: 1640, unit: 'cm⁻¹', note: '1615–1690（亚胺）', intensity: 'medium' },
  
  // C≡C, C≡N 伸缩
  { mode: 'C≡N 伸缩', region: 'IR', pos: 2250, unit: 'cm⁻¹', note: '2210–2260（腈）', intensity: 'medium' },
  { mode: 'C≡C 伸缩', region: 'IR', pos: 2150, unit: 'cm⁻¹', note: '2100–2260（炔烃，弱）', intensity: 'weak' },
  
  // C-O 伸缩
  { mode: 'C–O 醚', region: 'IR', pos: 1100, unit: 'cm⁻¹', note: '1050–1150（醚、醇）', intensity: 'strong' },
  { mode: 'C–O 酯', region: 'IR', pos: 1200, unit: 'cm⁻¹', note: '1150–1300（酯）', intensity: 'strong' },
  { mode: 'C–O 羧酸', region: 'IR', pos: 1300, unit: 'cm⁻¹', note: '1250–1320（羧酸）', intensity: 'strong' },
  
  // 无机基团
  { mode: 'Si–O–Si 伸缩', region: 'IR', pos: 1100, unit: 'cm⁻¹', note: '1000–1150（硅氧玻璃/硅酸盐）', intensity: 'very strong' },
  { mode: 'Si–O–Si 弯曲', region: 'IR', pos: 800, unit: 'cm⁻¹', note: '750–850', intensity: 'strong' },
  { mode: 'Si–O 伸缩', region: 'IR', pos: 900, unit: 'cm⁻¹', note: '850–1000（Si-O）', intensity: 'strong' },
  { mode: 'NO2 反对称伸缩', region: 'IR', pos: 1550, unit: 'cm⁻¹', note: '1500–1570（硝基）', intensity: 'very strong' },
  { mode: 'NO2 对称伸缩', region: 'IR', pos: 1370, unit: 'cm⁻¹', note: '1300–1390（硝基）', intensity: 'strong' },
  { mode: 'SO2 反对称伸缩', region: 'IR', pos: 1350, unit: 'cm⁻¹', note: '1300–1380（磺酸基）', intensity: 'very strong' },
  { mode: 'SO2 对称伸缩', region: 'IR', pos: 1150, unit: 'cm⁻¹', note: '1100–1200（磺酸基）', intensity: 'very strong' },
  { mode: 'PO4 伸缩', region: 'IR', pos: 1000, unit: 'cm⁻¹', note: '900–1100（磷酸盐）', intensity: 'strong' },
  { mode: 'CO3 伸缩', region: 'IR', pos: 1430, unit: 'cm⁻¹', note: '1350–1500（碳酸盐）', intensity: 'very strong' },
  
  // 卤素化合物
  { mode: 'C–F 伸缩', region: 'IR', pos: 1100, unit: 'cm⁻¹', note: '1000–1400（强且多峰）', intensity: 'very strong' },
  { mode: 'C–Cl 伸缩', region: 'IR', pos: 700, unit: 'cm⁻¹', note: '600–800', intensity: 'strong' },
  { mode: 'C–Br 伸缩', region: 'IR', pos: 600, unit: 'cm⁻¹', note: '500–700', intensity: 'strong' },
  { mode: 'C–I 伸缩', region: 'IR', pos: 500, unit: 'cm⁻¹', note: '~500', intensity: 'medium' },
  
  // ==========  Raman 拉曼光谱峰位 ==========
  
  // 碳材料特征峰
  { mode: '石墨/石墨烯 G 峰', region: 'Raman', pos: 1580, unit: 'cm⁻¹', note: '≈1580（E2g模式）', intensity: 'very strong' },
  { mode: '石墨/石墨烯 D 峰', region: 'Raman', pos: 1350, unit: 'cm⁻¹', note: '≈1350（缺陷/边缘相关）', intensity: 'strong' },
  { mode: '石墨烯 2D 峰', region: 'Raman', pos: 2700, unit: 'cm⁻¹', note: '2650–2750（二阶峰，层数敏感）', intensity: 'strong' },
  { mode: '石墨烯 D+G 峰', region: 'Raman', pos: 2950, unit: 'cm⁻¹', note: '≈2950（组合峰）', intensity: 'weak' },
  { mode: '碳纳米管 RBM', region: 'Raman', pos: 200, unit: 'cm⁻¹', note: '100–350（径向呼吸模式，直径敏感）', intensity: 'medium' },
  { mode: '金刚石', region: 'Raman', pos: 1332, unit: 'cm⁻¹', note: '≈1332（一级峰）', intensity: 'very strong' },
  
  // 过渡金属二硫化物（TMDs）
  { mode: 'MoS2 E¹2g', region: 'Raman', pos: 383, unit: 'cm⁻¹', note: '380–386（面内模式，层数相关）', intensity: 'strong' },
  { mode: 'MoS2 A1g', region: 'Raman', pos: 408, unit: 'cm⁻¹', note: '404–411（面外模式，层数相关）', intensity: 'strong' },
  { mode: 'WS2 E¹2g', region: 'Raman', pos: 356, unit: 'cm⁻¹', note: '≈356（面内）', intensity: 'strong' },
  { mode: 'WS2 A1g', region: 'Raman', pos: 420, unit: 'cm⁻¹', note: '≈420（面外）', intensity: 'strong' },
  { mode: 'MoSe2 A1g', region: 'Raman', pos: 241, unit: 'cm⁻¹', note: '≈241', intensity: 'strong' },
  { mode: 'WSe2 A1g', region: 'Raman', pos: 250, unit: 'cm⁻¹', note: '≈250', intensity: 'strong' },
  
  // 半导体材料
  { mode: 'Si 单晶', region: 'Raman', pos: 520, unit: 'cm⁻¹', note: '≈520（一级峰，参考标准）', intensity: 'very strong' },
  { mode: 'Ge 单晶', region: 'Raman', pos: 300, unit: 'cm⁻¹', note: '≈300', intensity: 'very strong' },
  { mode: 'GaAs LO', region: 'Raman', pos: 292, unit: 'cm⁻¹', note: '≈292（纵光学模式）', intensity: 'strong' },
  { mode: 'GaAs TO', region: 'Raman', pos: 269, unit: 'cm⁻¹', note: '≈269（横光学模式）', intensity: 'medium' },
  { mode: 'GaN A1(LO)', region: 'Raman', pos: 734, unit: 'cm⁻¹', note: '≈734', intensity: 'strong' },
  { mode: 'GaN E2(high)', region: 'Raman', pos: 567, unit: 'cm⁻¹', note: '≈567（质量评价）', intensity: 'very strong' },
  { mode: 'InP LO', region: 'Raman', pos: 345, unit: 'cm⁻¹', note: '≈345', intensity: 'strong' },
  
  // 金属氧化物
  { mode: 'TiO2 锐钛矿 Eg', region: 'Raman', pos: 144, unit: 'cm⁻¹', note: '≈144（主峰）', intensity: 'very strong' },
  { mode: 'TiO2 锐钛矿 A1g', region: 'Raman', pos: 513, unit: 'cm⁻¹', note: '≈513', intensity: 'medium' },
  { mode: 'TiO2 金红石 A1g', region: 'Raman', pos: 612, unit: 'cm⁻¹', note: '≈612（主峰）', intensity: 'very strong' },
  { mode: 'TiO2 金红石 Eg', region: 'Raman', pos: 447, unit: 'cm⁻¹', note: '≈447', intensity: 'medium' },
  { mode: 'ZnO E2(high)', region: 'Raman', pos: 437, unit: 'cm⁻¹', note: '≈437（主峰，无缺陷）', intensity: 'very strong' },
  { mode: 'ZnO A1(LO)', region: 'Raman', pos: 574, unit: 'cm⁻¹', note: '≈574（缺陷相关）', intensity: 'medium' },
  { mode: 'SnO2 A1g', region: 'Raman', pos: 634, unit: 'cm⁻¹', note: '≈634（主峰）', intensity: 'strong' },
  { mode: 'SnO2 B2g', region: 'Raman', pos: 776, unit: 'cm⁻¹', note: '≈776', intensity: 'medium' },
  { mode: 'Fe2O3 赤铁矿 A1g', region: 'Raman', pos: 225, unit: 'cm⁻¹', note: '≈225', intensity: 'strong' },
  { mode: 'Fe2O3 赤铁矿 Eg', region: 'Raman', pos: 293, unit: 'cm⁻¹', note: '≈293', intensity: 'medium' },
  { mode: 'Fe3O4 磁铁矿 A1g', region: 'Raman', pos: 668, unit: 'cm⁻¹', note: '≈668', intensity: 'strong' },
  { mode: 'CuO Ag', region: 'Raman', pos: 296, unit: 'cm⁻¹', note: '≈296（主峰）', intensity: 'strong' },
  { mode: 'CuO Bg', region: 'Raman', pos: 344, unit: 'cm⁻¹', note: '≈344', intensity: 'medium' },
  { mode: 'Cu2O', region: 'Raman', pos: 520, unit: 'cm⁻¹', note: '≈520（禁阻但常见）', intensity: 'weak' },
  { mode: 'WO3', region: 'Raman', pos: 806, unit: 'cm⁻¹', note: '≈806（W-O伸缩）', intensity: 'strong' },
  { mode: 'NiO', region: 'Raman', pos: 1100, unit: 'cm⁻¹', note: '≈1100（二声子）', intensity: 'weak' },
  { mode: 'Co3O4', region: 'Raman', pos: 690, unit: 'cm⁻¹', note: '≈690（A1g，主峰）', intensity: 'very strong' },
  
  // 钙钛矿材料
  { mode: 'SrTiO3', region: 'Raman', pos: 178, unit: 'cm⁻¹', note: '≈178（主峰，缺陷激活）', intensity: 'weak' },
  { mode: 'BaTiO3', region: 'Raman', pos: 306, unit: 'cm⁻¹', note: '≈306（E(TO+LO)）', intensity: 'strong' },
  { mode: 'LaMnO3', region: 'Raman', pos: 490, unit: 'cm⁻¹', note: '≈490（Ag拉伸模式）', intensity: 'strong' },
  
  // 其他材料
  { mode: 'SiC 6H-SiC', region: 'Raman', pos: 789, unit: 'cm⁻¹', note: '≈789（E2）', intensity: 'strong' },
  { mode: 'SiC 4H-SiC', region: 'Raman', pos: 776, unit: 'cm⁻¹', note: '≈776（E2）', intensity: 'strong' },
  { mode: 'h-BN E2g', region: 'Raman', pos: 1366, unit: 'cm⁻¹', note: '≈1366（面内）', intensity: 'very strong' },
  { mode: 'AlN E2(high)', region: 'Raman', pos: 657, unit: 'cm⁻¹', note: '≈657', intensity: 'strong' },
  { mode: 'InAs LO', region: 'Raman', pos: 240, unit: 'cm⁻¹', note: '≈240', intensity: 'strong' },
  { mode: 'CdS LO', region: 'Raman', pos: 305, unit: 'cm⁻¹', note: '≈305', intensity: 'strong' },
  { mode: 'CdSe LO', region: 'Raman', pos: 213, unit: 'cm⁻¹', note: '≈213', intensity: 'strong' },
  { mode: 'CdTe LO', region: 'Raman', pos: 171, unit: 'cm⁻¹', note: '≈171', intensity: 'strong' },
  
  // 生物分子标记峰
  { mode: '蛋白质酰胺I', region: 'Raman', pos: 1650, unit: 'cm⁻¹', note: '1640–1680（C=O伸缩）', intensity: 'medium' },
  { mode: '蛋白质酰胺III', region: 'Raman', pos: 1240, unit: 'cm⁻¹', note: '1230–1295（C-N伸缩+N-H弯曲）', intensity: 'medium' },
  { mode: 'DNA/RNA 磷酸骨架', region: 'Raman', pos: 1090, unit: 'cm⁻¹', note: '≈1090（PO2-对称伸缩）', intensity: 'strong' },
  { mode: 'Phe 苯丙氨酸', region: 'Raman', pos: 1003, unit: 'cm⁻¹', note: '≈1003（强特征峰）', intensity: 'strong' },
  { mode: 'Trp 色氨酸', region: 'Raman', pos: 760, unit: 'cm⁻¹', note: '≈760', intensity: 'medium' },
  { mode: 'Tyr 酪氨酸', region: 'Raman', pos: 850, unit: 'cm⁻¹', note: '≈850（对位取代苯环）', intensity: 'medium' }
];

function listXps() { return xpsBindingEnergies.slice(); }
function listVibrational() { return vibrationalPeaks.slice(); }

module.exports = {
  listXps,
  listVibrational
};
