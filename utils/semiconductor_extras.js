// UTF-8, no BOM
// 半导体补充小工具：Eg↔λ 互算、光谱区段判定、内禀载流子浓度简表与少子估算

function energyToWavelengthNm(Eg) {
  const E = Number(Eg);
  if (!isFinite(E) || E <= 0) return { error: '请输入有效 Eg(eV)>0' };
  // E(eV) = 1240 / λ(nm)
  return { lambdaNm: 1240 / E };
}

function wavelengthToEnergyEv(lambdaNm) {
  const L = Number(lambdaNm);
  if (!isFinite(L) || L <= 0) return { error: '请输入有效 λ(nm)>0' };
  return { Eg: 1240 / L };
}

function spectralRegion(lambdaNm) {
  const L = Number(lambdaNm);
  if (!isFinite(L) || L <= 0) return '—';
  if (L < 400) return 'UV';
  if (L <= 700) return 'VIS';
  if (L <= 2500) return 'NIR';
  return 'IR';
}

// 300 K 代表性内禀浓度（数量级，cm^-3）
const intrinsicTable = [
  { key: 'si', name: 'Si', ni: 1.0e10 },
  { key: 'ge', name: 'Ge', ni: 2.5e13 },
  { key: 'gaas', name: 'GaAs', ni: 2.0e6 },
  { key: 'inp', name: 'InP', ni: 1.0e7 }
];

function listIntrinsicMaterials() {
  return intrinsicTable.slice();
}

// 少子浓度近似：n0·p0 ≈ ni^2（忽略复合与温度/能带结构差异）
function minorityFromMajority(ni, majority) {
  const niVal = Math.max(0, Number(ni) || 0);
  const maj = Math.max(0, Number(majority) || 0);
  if (!(isFinite(niVal) && isFinite(maj)) || niVal <= 0 || maj <= 0) {
    return { error: '请输入有效 ni 与多数载流子浓度' };
  }
  const minority = (niVal * niVal) / maj;
  return { minority };
}

module.exports = {
  energyToWavelengthNm,
  wavelengthToEnergyEv,
  spectralRegion,
  listIntrinsicMaterials,
  minorityFromMajority
};
