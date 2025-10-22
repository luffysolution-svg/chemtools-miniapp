/**
 * 分享卡片模板配置 v6.0.0
 * 提供多种精美的卡片样式模板
 */

/**
 * 简洁模板 - 纯色背景+基础信息
 */
const simpleTemplate = {
  name: 'simple',
  displayName: '简洁版',
  description: '纯色背景，简洁清晰',
  
  // 背景渐变
  gradientStart: '#f7f9fc',
  gradientEnd: '#e3e9f0',
  
  // 色彩方案
  titleColor: '#1f3c88',
  sectionTitleColor: '#2c5aa0',
  textColor: '#333333',
  resultColor: '#1a73e8',
  noteColor: '#666666',
  footerColor: '#999999',
  accentColor: '#1f3c88',
  resultCardBg: 'rgba(255, 255, 255, 0.9)',
  
  // 字体大小
  titleSize: 22,
  sectionTitleSize: 16,
  textSize: 14,
  resultSize: 15,
  noteSize: 12,
  footerSize: 11,
  
  // 间距
  padding: {
    top: 30,
    bottom: 30,
    left: 25,
    right: 25
  },
  lineHeight: 24,
  
  // 特殊效果
  shadowEnabled: false
};

/**
 * 精美模板 - 渐变背景+图标+装饰
 */
const elegantTemplate = {
  name: 'elegant',
  displayName: '精美版',
  description: '渐变背景，视觉精美',
  
  // 背景渐变（蓝紫渐变）
  gradientStart: '#667eea',
  gradientEnd: '#764ba2',
  
  // 色彩方案（白色为主）
  titleColor: '#ffffff',
  sectionTitleColor: '#ffffff',
  textColor: 'rgba(255, 255, 255, 0.95)',
  resultColor: '#ffffff',
  noteColor: 'rgba(255, 255, 255, 0.85)',
  footerColor: 'rgba(255, 255, 255, 0.7)',
  accentColor: '#ffd700',
  resultCardBg: 'rgba(255, 255, 255, 0.15)',
  
  // 字体大小
  titleSize: 24,
  sectionTitleSize: 17,
  textSize: 14,
  resultSize: 16,
  noteSize: 12,
  footerSize: 11,
  
  // 间距
  padding: {
    top: 35,
    bottom: 35,
    left: 25,
    right: 25
  },
  lineHeight: 26,
  
  // 特殊效果
  shadowEnabled: true
};

/**
 * 数据模板 - 适合数据展示
 */
const dataTemplate = {
  name: 'data',
  displayName: '数据版',
  description: '突出数据，专业感强',
  
  // 背景渐变（深蓝渐变）
  gradientStart: '#1e3c72',
  gradientEnd: '#2a5298',
  
  // 色彩方案
  titleColor: '#ffffff',
  sectionTitleColor: '#4fc3f7',
  textColor: 'rgba(255, 255, 255, 0.9)',
  resultColor: '#00e676',
  noteColor: 'rgba(255, 255, 255, 0.75)',
  footerColor: 'rgba(255, 255, 255, 0.6)',
  accentColor: '#00e676',
  resultCardBg: 'rgba(255, 255, 255, 0.1)',
  
  // 字体大小
  titleSize: 23,
  sectionTitleSize: 17,
  textSize: 14,
  resultSize: 17,
  noteSize: 12,
  footerSize: 11,
  
  // 间距
  padding: {
    top: 35,
    bottom: 35,
    left: 25,
    right: 25
  },
  lineHeight: 25,
  
  // 特殊效果
  shadowEnabled: true
};

/**
 * 清新模板 - 绿色渐变
 */
const freshTemplate = {
  name: 'fresh',
  displayName: '清新版',
  description: '绿色系，清新自然',
  
  // 背景渐变（绿色渐变）
  gradientStart: '#56ab2f',
  gradientEnd: '#a8e063',
  
  // 色彩方案
  titleColor: '#ffffff',
  sectionTitleColor: '#ffffff',
  textColor: 'rgba(255, 255, 255, 0.95)',
  resultColor: '#ffffff',
  noteColor: 'rgba(255, 255, 255, 0.85)',
  footerColor: 'rgba(255, 255, 255, 0.7)',
  accentColor: '#ffffff',
  resultCardBg: 'rgba(255, 255, 255, 0.2)',
  
  // 字体大小
  titleSize: 24,
  sectionTitleSize: 17,
  textSize: 14,
  resultSize: 16,
  noteSize: 12,
  footerSize: 11,
  
  // 间距
  padding: {
    top: 35,
    bottom: 35,
    left: 25,
    right: 25
  },
  lineHeight: 26,
  
  // 特殊效果
  shadowEnabled: true
};

/**
 * 暖色模板 - 橙红渐变
 */
const warmTemplate = {
  name: 'warm',
  displayName: '暖色版',
  description: '橙红系，温暖活力',
  
  // 背景渐变（橙红渐变）
  gradientStart: '#f2709c',
  gradientEnd: '#ff9472',
  
  // 色彩方案
  titleColor: '#ffffff',
  sectionTitleColor: '#ffffff',
  textColor: 'rgba(255, 255, 255, 0.95)',
  resultColor: '#ffffff',
  noteColor: 'rgba(255, 255, 255, 0.85)',
  footerColor: 'rgba(255, 255, 255, 0.7)',
  accentColor: '#ffe135',
  resultCardBg: 'rgba(255, 255, 255, 0.18)',
  
  // 字体大小
  titleSize: 24,
  sectionTitleSize: 17,
  textSize: 14,
  resultSize: 16,
  noteSize: 12,
  footerSize: 11,
  
  // 间距
  padding: {
    top: 35,
    bottom: 35,
    left: 25,
    right: 25
  },
  lineHeight: 26,
  
  // 特殊效果
  shadowEnabled: true
};

/**
 * 所有模板集合
 */
const shareCardTemplates = {
  simple: simpleTemplate,
  elegant: elegantTemplate,
  data: dataTemplate,
  fresh: freshTemplate,
  warm: warmTemplate
};

/**
 * 获取模板列表（用于选择器）
 */
function getTemplateList() {
  return Object.values(shareCardTemplates).map(template => ({
    name: template.name,
    displayName: template.displayName,
    description: template.description
  }));
}

/**
 * 根据主题自动选择模板
 */
function getTemplateByTheme(theme) {
  const themeTemplateMap = {
    'light': 'simple',
    'blue': 'elegant',
    'green': 'fresh',
    'purple': 'elegant',
    'orange': 'warm',
    'pink': 'warm',
    'red': 'warm'
  };
  
  return shareCardTemplates[themeTemplateMap[theme]] || shareCardTemplates.elegant;
}

module.exports = {
  shareCardTemplates,
  getTemplateList,
  getTemplateByTheme,
  
  // 导出单个模板
  simpleTemplate,
  elegantTemplate,
  dataTemplate,
  freshTemplate,
  warmTemplate
};

