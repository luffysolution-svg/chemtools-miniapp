// UTF-8, no BOM
// 络合剂/掩蔽剂稳定常数（简表），25 ℃、稀溶液近似，用于快速估算
// 数据源：教材常用值与公开资料的代表性数量级，仅供教学/实验前估算使用。
// 结构：ligands: { key, name, note }, complexes: { ligandKey: { metalKey: { n, logBeta } } }

const ligands = [
  { key: 'edta', name: 'EDTA', note: '总体络合 1:1，logβ≈8~25（视金属）' },
  { key: 'nh3', name: 'NH₃', note: '与 Cu²⁺强，其他中等' },
  { key: 'en', name: 'en（乙二胺）', note: '双齿，Ni²⁺、Cu²⁺较强' },
  { key: 'bpy', name: 'bpy（联吡啶）', note: '平面芳香双齿，Cu²⁺/Fe²⁺较强' },
  { key: 'ox', name: 'C₂O₄²⁻（草酸根）', note: '双齿，Fe³⁺强' },
  { key: 'cit', name: '柠檬酸根', note: '多齿，Ca²⁺/Fe³⁺配位' },
  { key: 'cn', name: 'CN⁻', note: '强配体，注意安全' },
  { key: 'scn', name: 'SCN⁻', note: '硫氰酸根，软配体' },
  { key: 's2o3', name: 'S₂O₃²⁻（硫代硫酸根）', note: '与 Ag⁺较强' },
  { key: 'f', name: 'F⁻', note: '硬配体，Zr⁴⁺/Fe³⁺较强' },
  { key: 'cl', name: 'Cl⁻', note: '卤素配体，中等偏弱' },
  { key: 'br', name: 'Br⁻', note: '较 Cl⁻更软' },
  { key: 'i', name: 'I⁻', note: '软配体，与 Ag⁺强' }
];

const metals = [
  { key: 'cu2', name: 'Cu²⁺' },
  { key: 'ni2', name: 'Ni²⁺' },
  { key: 'zn2', name: 'Zn²⁺' },
  { key: 'fe3', name: 'Fe³⁺' },
  { key: 'fe2', name: 'Fe²⁺' },
  { key: 'co2', name: 'Co²⁺' },
  { key: 'ag', name: 'Ag⁺' },
  { key: 'pb2', name: 'Pb²⁺' },
  { key: 'ca2', name: 'Ca²⁺' },
  { key: 'mg2', name: 'Mg²⁺' },
  { key: 'al3', name: 'Al³⁺' },
  { key: 'zr4', name: 'Zr⁴⁺' }
];

// complexes[ligandKey][metalKey] = { n, logBeta }
const complexes = {
  edta: {
    cu2: { n: 1, logBeta: 18.8 },
    ni2: { n: 1, logBeta: 18.6 },
    zn2: { n: 1, logBeta: 16.5 },
    fe3: { n: 1, logBeta: 25.1 },
    fe2: { n: 1, logBeta: 14.3 },
    co2: { n: 1, logBeta: 16.3 },
    pb2: { n: 1, logBeta: 18.0 },
    ca2: { n: 1, logBeta: 10.7 },
    mg2: { n: 1, logBeta: 8.7 },
    al3: { n: 1, logBeta: 16.1 },
    zr4: { n: 1, logBeta: 29.0 }
  },
  nh3: {
    cu2: { n: 4, logBeta: 13.0 }, // [Cu(NH3)4]2+
    ni2: { n: 6, logBeta: 8.6 },  // 代表数量级
    zn2: { n: 4, logBeta: 9.0 },
    ag:  { n: 2, logBeta: 7.0 }
  },
  en: {
    cu2: { n: 2, logBeta: 11.0 },
    ni2: { n: 3, logBeta: 18.0 },
    fe2: { n: 3, logBeta: 17.0 }
  },
  bpy: {
    cu2: { n: 2, logBeta: 12.0 },
    fe2: { n: 3, logBeta: 17.6 }
  },
  ox: {
    fe3: { n: 3, logBeta: 20.0 },
    ni2: { n: 3, logBeta: 12.0 },
    cu2: { n: 2, logBeta: 9.0 },
    ca2: { n: 1, logBeta: 3.0 }
  },
  cit: {
    fe3: { n: 1, logBeta: 12.0 },
    ca2: { n: 1, logBeta: 4.0 },
    al3: { n: 1, logBeta: 8.0 }
  },
  cn: {
    ag:  { n: 2, logBeta: 21.0 }, // [Ag(CN)2]-
    fe3: { n: 6, logBeta: 35.0 },
    ni2: { n: 4, logBeta: 26.0 },
    cu2: { n: 4, logBeta: 25.0 }
  },
  scn: {
    fe3: { n: 6, logBeta: 9.0 },
    cu2: { n: 4, logBeta: 8.0 },
    ag:  { n: 2, logBeta: 6.0 }
  },
  s2o3: {
    ag:  { n: 2, logBeta: 13.0 }
  },
  f: {
    fe3: { n: 6, logBeta: 6.0 },
    zr4: { n: 6, logBeta: 30.0 },
    al3: { n: 6, logBeta: 12.0 }
  },
  cl: {
    ag:  { n: 2, logBeta: 5.0 },
    cu2: { n: 4, logBeta: 1.2 },
    fe3: { n: 6, logBeta: 2.0 }
  },
  br: {
    ag:  { n: 2, logBeta: 6.5 }
  },
  i: {
    ag:  { n: 2, logBeta: 8.0 }
  }
};

function listLigands() {
  return ligands.slice();
}

function listMetalsForLigand(ligandKey) {
  const map = complexes[ligandKey] || {};
  const keys = Object.keys(map);
  return metals.filter(m => keys.indexOf(m.key) !== -1);
}

function getComplex(ligandKey, metalKey) {
  const map = complexes[ligandKey] || {};
  return map[metalKey] || null;
}

function computeConditional(ligandKey, metalKey, L, M0) {
  const c = getComplex(ligandKey, metalKey);
  if (!c) return { error: '所选配体/金属不在数据表中' };
  const n = c.n;
  const beta = Math.pow(10, c.logBeta);
  const Lpos = Math.max(0, Number(L) || 0);
  const Mpos = Math.max(0, Number(M0) || 0);
  const Kcond = beta * Math.pow(Lpos, n);
  const fraction = Kcond / (1 + Kcond); // 近似：M_free = M0/(1+Kcond)
  const Mfree = Mpos * (1 - fraction);
  const ML = Mpos - Mfree;
  return {
    n,
    logBeta: c.logBeta,
    beta,
    Kcond,
    fraction,
    Mfree,
    ML
  };
}

module.exports = {
  listLigands,
  listMetalsForLigand,
  getComplex,
  computeConditional
};
