// 浓度制式换算（纯前端，无需云函数）。
// 说明：
// - 基础单位以 g/L 作为中间换算；
// - ppm 近似视为 mg/L（水溶液近似密度 1 g/mL 时成立）；
// - % (w/v) = g/100 mL；% (w/w) 需要密度（g/mL）才能精确换算到 g/L；
// - mol/L 需提供溶质摩尔质量（g/mol）。

function toNumber(x) {
  const n = Number(x);
  return Number.isFinite(n) ? n : NaN;
}

// 将任意已知制式转换为以 g/L 表示的基准浓度
function anyToGramPerLiter(value, unit, { density, molarMass } = {}) {
  const v = toNumber(value);
  if (!Number.isFinite(v)) return NaN;
  const d = toNumber(density); // g/mL，可选
  const M = toNumber(molarMass); // g/mol，可选
  switch (unit) {
    case 'g/L':
      return v;
    case 'mg/L':
      return v / 1000;
    case 'ug/mL':
      return v / 1000; // 1 µg/mL = 1 mg/L
    case 'ppm':
      return v / 1000; // 近似 mg/L
    case 'ppb':
      return v / 1e6; // 近似 g/L
    case '%(w/v)':
      // g/100 mL => g/L
      return v * 10;
    case '%(w/w)': {
      // 需要密度：每 100 g 溶液含 v g 溶质
      // 若密度 d(g/mL)，100 g 溶液体积约 100/d mL => 换到每 L（1000 mL）
      if (!Number.isFinite(d) || d <= 0) return NaN;
      const gPer100mL = (v / 100) * (100 * d); // v% w/w => 每100 mL 溶质克数
      return (gPer100mL) * (1000 / 100); // 放大到每升
    }
    case 'mol/L':
      if (!Number.isFinite(M) || M <= 0) return NaN;
      return v * M; // mol/L * g/mol = g/L
    default:
      return NaN;
  }
}

function gramPerLiterToAll(gPerL, { density, molarMass } = {}) {
  const d = toNumber(density);
  const M = toNumber(molarMass);
  const safe = (x) => (Number.isFinite(x) ? x : null);
  const mgPerL = gPerL * 1000;
  const result = {
    'g/L': gPerL,
    'mg/L': mgPerL,
    'ug/mL': mgPerL, // 1 mg/L = 1 µg/mL
    'ppm': mgPerL,   // 近似
    'ppb': mgPerL * 1000,
    '%(w/v)': gPerL / 10,
    '%(w/w)': null,
    'mol/L': null
  };
  if (Number.isFinite(d) && d > 0) {
    // 反推 w/w：设每 L 溶液质量约 1000*d g，溶质质量 gPerL
    result['%(w/w)'] = (gPerL / (1000 * d)) * 100;
  }
  if (Number.isFinite(M) && M > 0) {
    result['mol/L'] = gPerL / M;
  }
  // 统一保留 6 位以内有效数字显示建议在页面处理
  Object.keys(result).forEach(k => { result[k] = safe(result[k]); });
  return result;
}

function convertConcentration({ value, fromUnit, density, molarMass }) {
  const gPerL = anyToGramPerLiter(value, fromUnit, { density, molarMass });
  if (!Number.isFinite(gPerL)) {
    return { error: '缺少必要参数或输入无效（w/w 需密度、mol/L 需摩尔质量）' };
  }
  return { base: gPerL, all: gramPerLiterToAll(gPerL, { density, molarMass }) };
}

const concentrationUnits = ['g/L', 'mg/L', 'ug/mL', 'ppm', 'ppb', '%(w/v)', '%(w/w)', 'mol/L'];

module.exports = { convertConcentration, concentrationUnits };
