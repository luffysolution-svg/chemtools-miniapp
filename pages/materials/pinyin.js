/**
 * 简化的拼音搜索工具
 * 仅包含化学材料中常用的汉字拼音映射
 */

// 常用汉字到拼音的映射（仅包含材料化学相关）
const pinyinMap = {
  // 元素名称
  '氢': 'qing', '氦': 'hai', '锂': 'li', '铍': 'pi', '硼': 'peng',
  '碳': 'tan', '氮': 'dan', '氧': 'yang', '氟': 'fu', '氖': 'nai',
  '钠': 'na', '镁': 'mei', '铝': 'lv', '硅': 'gui', '磷': 'lin',
  '硫': 'liu', '氯': 'lv', '氩': 'ya', '钾': 'jia', '钙': 'gai',
  '钪': 'kang', '钛': 'tai', '钒': 'fan', '铬': 'ge', '锰': 'meng',
  '铁': 'tie', '钴': 'gu', '镍': 'nie', '铜': 'tong', '锌': 'xin',
  '镓': 'jia', '锗': 'zhe', '砷': 'shen', '硒': 'xi', '溴': 'xiu',
  '氪': 'ke', '铷': 'ru', '锶': 'si', '钇': 'yi', '锆': 'gao',
  '铌': 'ni', '钼': 'mu', '锝': 'de', '钌': 'liao', '铑': 'lao',
  '钯': 'ba', '银': 'yin', '镉': 'ge', '铟': 'yin', '锡': 'xi',
  '锑': 'ti', '碲': 'di', '碘': 'dian', '氙': 'xian', '铯': 'se',
  '钡': 'bei', '镧': 'lan', '铈': 'shi', '镨': 'pu', '钕': 'nv',
  '钷': 'po', '钐': 'shan', '铕': 'you', '钆': 'ga', '铽': 'te',
  '镝': 'di', '钬': 'huo', '铒': 'er', '铥': 'diu', '镱': 'yi',
  '镥': 'lu', '铪': 'ha', '钽': 'tan', '钨': 'wu', '铼': 'lai',
  '锇': 'e', '铱': 'yi', '铂': 'bo', '金': 'jin', '汞': 'gong',
  '铊': 'ta', '铅': 'qian', '铋': 'bi', '钋': 'po', '砹': 'ai',
  '氡': 'dong', '钫': 'fang', '镭': 'lei', '锕': 'a', '钍': 'tu',
  '镤': 'pu', '铀': 'you', '镎': 'na', '钚': 'bu', '镅': 'mei',
  
  // 材料相关
  '半': 'ban', '导': 'dao', '体': 'ti', '材': 'cai', '料': 'liao',
  '合': 'he', '金': 'jin', '属': 'shu', '氧': 'yang', '化': 'hua',
  '物': 'wu', '硫': 'liu', '碳': 'tan', '钢': 'gang', '铁': 'tie',
  '晶': 'jing', '石': 'shi', '墨': 'mo', '烯': 'xi', '纳': 'na',
  '米': 'mi', '管': 'guan', '片': 'pian', '薄': 'bo', '膜': 'mo',
  '层': 'ceng', '涂': 'tu', '聚': 'ju', '合': 'he', '物': 'wu',
  '陶': 'tao', '瓷': 'ci', '玻': 'bo', '璃': 'li', '纤': 'xian',
  '维': 'wei', '复': 'fu', '合': 'he', '电': 'dian', '池': 'chi',
  '催': 'cui', '化': 'hua', '剂': 'ji', '吸': 'xi', '附': 'fu',
  '光': 'guang', '伏': 'fu', '太': 'tai', '阳': 'yang', '能': 'neng',
  '传': 'chuan', '感': 'gan', '器': 'qi', '磁': 'ci', '性': 'xing',
  '超': 'chao', '导': 'dao', '高': 'gao', '温': 'wen', '低': 'di',
  '压': 'ya', '力': 'li', '强': 'qiang', '度': 'du', '韧': 'ren',
  
  // 其他常用字
  '的': 'de', '和': 'he', '及': 'ji', '与': 'yu', '或': 'huo',
  '等': 'deng', '类': 'lei', '型': 'xing', '单': 'dan', '双': 'shuang',
  '三': 'san', '多': 'duo', '元': 'yuan', '二': 'er', '四': 'si',
  '五': 'wu', '六': 'liu', '七': 'qi', '八': 'ba', '九': 'jiu',
  '十': 'shi', '百': 'bai', '千': 'qian', '万': 'wan'
};

/**
 * 将汉字转换为拼音
 * @param {string} text - 汉字文本
 * @returns {string} - 拼音（全部小写，无声调）
 */
function toPinyin(text) {
  if (!text) return '';
  
  let pinyin = '';
  for (let char of text) {
    if (pinyinMap[char]) {
      pinyin += pinyinMap[char];
    } else {
      // 非映射字符保持原样
      pinyin += char.toLowerCase();
    }
  }
  return pinyin;
}

/**
 * 获取拼音首字母
 * @param {string} text - 汉字文本
 * @returns {string} - 拼音首字母（小写）
 */
function getPinyinInitial(text) {
  if (!text) return '';
  
  let initials = '';
  for (let char of text) {
    if (pinyinMap[char]) {
      initials += pinyinMap[char][0]; // 取首字母
    } else if (/[a-zA-Z]/.test(char)) {
      initials += char.toLowerCase();
    }
  }
  return initials;
}

/**
 * 模糊匹配（支持拼音）
 * @param {string} target - 目标字符串
 * @param {string} keyword - 搜索关键词
 * @returns {boolean} - 是否匹配
 */
function fuzzyMatch(target, keyword) {
  if (!target || !keyword) return false;
  
  target = target.toLowerCase();
  keyword = keyword.toLowerCase();
  
  // 直接匹配
  if (target.includes(keyword)) return true;
  
  // 拼音全拼匹配
  const targetPinyin = toPinyin(target);
  if (targetPinyin.includes(keyword)) return true;
  
  // 拼音首字母匹配
  const targetInitials = getPinyinInitial(target);
  if (targetInitials.includes(keyword)) return true;
  
  return false;
}

/**
 * 计算相关度得分
 * @param {string} target - 目标字符串
 * @param {string} keyword - 搜索关键词
 * @returns {number} - 相关度分数（0-100）
 */
function relevanceScore(target, keyword) {
  if (!target || !keyword) return 0;
  
  target = target.toLowerCase();
  keyword = keyword.toLowerCase();
  let score = 0;
  
  // 1. 完全匹配 (100分)
  if (target === keyword) return 100;
  
  // 2. 开头匹配 (80分)
  if (target.startsWith(keyword)) return 80;
  
  // 3. 包含匹配 (60分)
  if (target.includes(keyword)) {
    // 关键词越靠前，分数越高
    const position = target.indexOf(keyword);
    score = 60 + (1 - position / target.length) * 10;
    return Math.floor(score);
  }
  
  // 4. 拼音全拼匹配 (50分)
  const targetPinyin = toPinyin(target);
  if (targetPinyin.includes(keyword)) {
    const position = targetPinyin.indexOf(keyword);
    score = 50 + (1 - position / targetPinyin.length) * 10;
    return Math.floor(score);
  }
  
  // 5. 拼音首字母匹配 (30分)
  const targetInitials = getPinyinInitial(target);
  if (targetInitials.includes(keyword)) {
    const position = targetInitials.indexOf(keyword);
    score = 30 + (1 - position / targetInitials.length) * 10;
    return Math.floor(score);
  }
  
  return 0;
}

module.exports = {
  toPinyin,
  getPinyinInitial,
  fuzzyMatch,
  relevanceScore
};

