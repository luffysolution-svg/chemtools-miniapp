/**
 * 数据导出服务（增强版）
 * 支持多种格式的数据导出和分享
 * Version: 2.0.0
 */

class ExportService {
  constructor() {
    this.supportedFormats = ['text', 'markdown', 'csv', 'json'];
    this.templateStore = new Map();
    this._registerDefaultTemplates();
  }
  
  /**
   * 注册默认模板
   * @private
   */
  _registerDefaultTemplates() {
    // XRD计算模板
    this.templateStore.set('xrd', {
      title: 'XRD计算结果',
      format: (data) => {
        const lines = [];
        lines.push(`## ${data.title || 'XRD计算'}`);
        lines.push('');
        lines.push(`**计算时间**: ${new Date().toLocaleString('zh-CN')}`);
        lines.push('');
        
        if (data.input) {
          lines.push('### 输入参数');
          lines.push(data.input);
          lines.push('');
        }
        
        if (data.result) {
          lines.push('###计算结果');
          lines.push(data.result);
          lines.push('');
        }
        
        if (data.metadata) {
          if (data.metadata.formula) {
            lines.push(`**使用公式**: ${data.metadata.formula}`);
          }
          if (data.metadata.conditions && data.metadata.conditions.length > 0) {
            lines.push(`**计算条件**: ${data.metadata.conditions.join(', ')}`);
          }
          if (data.metadata.precision) {
            lines.push(`**精度**: ${data.metadata.precision}`);
          }
          if (data.metadata.dataSource) {
            lines.push(`**数据来源**: ${data.metadata.dataSource}`);
          }
        }
        
        lines.push('');
        lines.push('---');
        lines.push('*由化学计算工具生成*');
        
        return lines.join('\n');
      }
    });
  }
  
  /**
   * 注册自定义模板
   * @param {string} name - 模板名称
   * @param {function} formatter - 格式化函数
   */
  registerTemplate(name, formatter) {
    this.templateStore.set(name, formatter);
  }
  /**
   * 导出为CSV格式
   * @param {array} data - 数据数组
   * @param {array} headers - 表头
   * @returns {string} CSV字符串
   */
  toCSV(data, headers) {
    if (!data || data.length === 0) {
      return '';
    }

    const lines = [];
    
    // 添加表头
    if (headers && headers.length > 0) {
      lines.push(headers.join(','));
    }
    
    // 添加数据行
    data.forEach(row => {
      if (Array.isArray(row)) {
        lines.push(row.map(cell => this.escapeCSV(cell)).join(','));
      } else if (typeof row === 'object') {
        const values = headers.map(h => this.escapeCSV(row[h] || ''));
        lines.push(values.join(','));
      }
    });
    
    return lines.join('\n');
  }

  /**
   * 转义CSV单元格内容
   * @param {*} value - 单元格值
   * @returns {string} 转义后的值
   */
  escapeCSV(value) {
    if (value === null || value === undefined) {
      return '';
    }
    const str = String(value);
    // 如果包含逗号、引号或换行，用引号包裹
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  /**
   * 导出为Markdown表格
   * @param {array} data - 数据数组
   * @param {array} headers - 表头
   * @returns {string} Markdown表格字符串
   */
  toMarkdownTable(data, headers) {
    if (!data || data.length === 0) {
      return '';
    }

    const lines = [];
    
    // 添加表头
    if (headers && headers.length > 0) {
      lines.push('| ' + headers.join(' | ') + ' |');
      lines.push('| ' + headers.map(() => '---').join(' | ') + ' |');
    }
    
    // 添加数据行
    data.forEach(row => {
      if (Array.isArray(row)) {
        lines.push('| ' + row.join(' | ') + ' |');
      } else if (typeof row === 'object') {
        const values = headers.map(h => row[h] || '');
        lines.push('| ' + values.join(' | ') + ' |');
      }
    });
    
    return lines.join('\n');
  }

  /**
   * 格式化计算结果为可分享文本（增强版）
   * @param {object} params - 参数
   * @param {string} params.title - 标题
   * @param {object} params.inputs - 输入数据
   * @param {string|object} params.result - 结果（可以是字符串或对象）
   * @param {string} params.note - 备注
   * @param {object} params.metadata - 元数据（公式、条件、精度等）
   * @param {string} params.format - 输出格式（text/markdown）
   * @param {string} params.template - 使用的模板名称
   * @returns {string} 格式化文本
   */
  formatResult(params) {
    const { 
      title, 
      inputs, 
      result, 
      note = '', 
      metadata = {},
      format = 'text',
      template = null
    } = params;
    
    // 如果指定了模板，使用模板
    if (template && this.templateStore.has(template)) {
      const templateFormatter = this.templateStore.get(template);
      return templateFormatter.format(params);
    }
    
    const lines = [];
    const isMD = format === 'markdown';
    
    // 标题
    lines.push(isMD ? `# ${title}` : `【${title}】`);
    lines.push('');
    
    // 时间
    lines.push(isMD ? `**生成时间**: ${new Date().toLocaleString('zh-CN')}` : `生成时间: ${new Date().toLocaleString('zh-CN')}`);
    lines.push('');
    
    // 输入参数
    if (inputs && Object.keys(inputs).length > 0) {
      lines.push(isMD ? '## 输入参数' : '输入参数：');
      lines.push('');
      Object.entries(inputs).forEach(([key, value]) => {
        lines.push(isMD ? `- **${key}**: ${value}` : `  ${key}: ${value}`);
      });
      lines.push('');
    }
    
    // 计算结果
    lines.push(isMD ? '## 计算结果' : '计算结果：');
    lines.push('');
    
    if (typeof result === 'object') {
      // 结果是对象，格式化显示
      Object.entries(result).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          lines.push(isMD ? `- **${key}**: ${value}` : `  ${key}: ${value}`);
        }
      });
    } else {
      lines.push(result);
    }
    lines.push('');
    
    // 元数据
    if (metadata && Object.keys(metadata).length > 0) {
      lines.push(isMD ? '## 详细信息' : '详细信息：');
      lines.push('');
      
      if (metadata.formula) {
        lines.push(isMD ? `**公式**: ${metadata.formula}` : `公式: ${metadata.formula}`);
      }
      
      if (metadata.unit) {
        lines.push(isMD ? `**单位**: ${metadata.unit}` : `单位: ${metadata.unit}`);
      }
      
      if (metadata.precision) {
        lines.push(isMD ? `**精度**: ${metadata.precision}` : `精度: ${metadata.precision}`);
      }
      
      if (metadata.conditions && metadata.conditions.length > 0) {
        lines.push(isMD ? `**计算条件**: ${metadata.conditions.join(', ')}` : `计算条件: ${metadata.conditions.join(', ')}`);
      }
      
      if (metadata.warning) {
        lines.push(isMD ? `**⚠️ 警告**: ${metadata.warning}` : `⚠️ 警告: ${metadata.warning}`);
      }
      
      if (metadata.dataSource) {
        lines.push(isMD ? `**数据来源**: ${metadata.dataSource}` : `数据来源: ${metadata.dataSource}`);
      }
      
      lines.push('');
    }
    
    // 备注
    if (note) {
      lines.push(isMD ? '## 备注' : '备注：');
      lines.push(note);
      lines.push('');
    }
    
    // 页脚
    lines.push(isMD ? '---' : '━━━━━━━━━');
    lines.push(isMD ? '*由化学计算工具自动生成*' : '来自：化学计算工具');
    
    return lines.join('\n');
  }
  
  /**
   * 导出完整计算报告（包含多个结果）
   * @param {array} results - 结果数组
   * @param {string} reportTitle - 报告标题
   * @param {object} options - 选项
   * @returns {string} 格式化的报告
   */
  exportReport(results, reportTitle = '计算报告', options = {}) {
    const { 
      format = 'markdown',
      includeIndex = true,
      includeSummary = true,
      includeTimestamp = true
    } = options;
    
    const lines = [];
    const isMD = format === 'markdown';
    
    // 报告标题
    lines.push(isMD ? `# ${reportTitle}` : reportTitle);
    lines.push('');
    
    // 生成时间
    if (includeTimestamp) {
      lines.push(`生成时间: ${new Date().toLocaleString('zh-CN')}`);
      lines.push('');
    }
    
    // 摘要统计
    if (includeSummary && results.length > 0) {
      lines.push(isMD ? '## 摘要' : '═══ 摘要 ═══');
      lines.push('');
      lines.push(`共 ${results.length} 条计算记录`);
      
      // 按类别统计
      const byCategory = {};
      results.forEach(r => {
        const cat = (r.metadata && r.metadata.category) || '其他';
        byCategory[cat] = (byCategory[cat] || 0) + 1;
      });
      
      lines.push('');
      lines.push('按类别统计:');
      Object.entries(byCategory).forEach(([cat, count]) => {
        lines.push(isMD ? `- ${cat}: ${count} 条` : `  ${cat}: ${count} 条`);
      });
      
      lines.push('');
      lines.push(isMD ? '---' : '━━━━━━━━━');
      lines.push('');
    }
    
    // 各个结果
    results.forEach((result, index) => {
      if (includeIndex) {
        lines.push(isMD ? `## ${index + 1}. ${result.title}` : `【${index + 1}】${result.title}`);
      } else {
        lines.push(isMD ? `## ${result.title}` : `【${result.title}】`);
      }
      
      lines.push('');
      
      if (result.timestamp) {
        lines.push(`时间: ${new Date(result.timestamp).toLocaleString('zh-CN')}`);
        lines.push('');
      }
      
      lines.push(`输入: ${result.input}`);
      lines.push(`结果: ${result.result}`);
      
      if (result.metadata) {
        if (result.metadata.unit) {
          lines.push(`单位: ${result.metadata.unit}`);
        }
        if (result.metadata.precision) {
          lines.push(`精度: ${result.metadata.precision}`);
        }
        if (result.metadata.formula) {
          lines.push(`公式: ${result.metadata.formula}`);
        }
      }
      
      lines.push('');
      lines.push(isMD ? '---' : '─────────');
      lines.push('');
    });
    
    // 页脚
    lines.push('');
    lines.push(isMD ? '*由化学计算工具自动生成*' : '═══════════════');
    lines.push(isMD ? '' : '由化学计算工具生成');
    
    return lines.join('\n');
  }

  /**
   * 复制文本到剪贴板（增强版）
   * @param {string} text - 要复制的文本
   * @param {object} options - 选项
   * @param {string} options.successMessage - 成功提示
   * @param {boolean} options.showToast - 是否显示提示
   * @returns {Promise} 复制结果
   */
  async copyToClipboard(text, options = {}) {
    const {
      successMessage = '已复制到剪贴板',
      showToast = true
    } = options;
    
    return new Promise((resolve, reject) => {
      wx.setClipboardData({
        data: text,
        success: () => {
          if (showToast) {
            wx.showToast({
              title: successMessage,
              icon: 'success',
              duration: 1500
            });
          }
          resolve(text);
        },
        fail: (err) => {
          if (showToast) {
            wx.showToast({
              title: '复制失败',
              icon: 'none',
              duration: 1500
            });
          }
          reject(err);
        }
      });
    });
  }
  
  /**
   * 快速复制并分享
   * @param {string} text - 文本内容
   * @param {object} options - 选项
   * @returns {Promise} 操作结果
   */
  async copyAndShare(text, options = {}) {
    try {
      await this.copyToClipboard(text, options);
      
      // 提示用户可以分享
      wx.showModal({
        title: '已复制',
        content: '内容已复制到剪贴板，是否前往分享？',
        confirmText: '去分享',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            // 触发分享（需要在页面的 onShareAppMessage 中处理）
            wx.showShareMenu({
              withShareTicket: true,
              menus: ['shareAppMessage', 'shareTimeline']
            });
          }
        }
      });
      
      return true;
    } catch (error) {
      console.error('复制分享失败:', error);
      return false;
    }
  }

  /**
   * 分享文本
   * @param {string} text - 要分享的文本
   * @param {string} title - 分享标题
   */
  share(text, title = '计算结果') {
    // 微信小程序分享需要在页面的 onShareAppMessage 中处理
    // 这里提供数据格式化
    return {
      title: `材料化学工具箱 - ${title}`,
      path: '/pages/home/home',
      imageUrl: '', // 可以添加分享图片
      content: text
    };
  }

  /**
   * 保存为文件（使用微信 API）
   * @param {string} content - 文件内容
   * @param {string} fileName - 文件名
   * @param {object} options - 选项
   * @returns {Promise} 文件路径
   */
  async saveAsFile(content, fileName = 'export.txt', options = {}) {
    const {
      encoding = 'utf8',
      showToast = true
    } = options;
    
    const fs = wx.getFileSystemManager();
    const filePath = `${wx.env.USER_DATA_PATH}/${fileName}`;
    
    return new Promise((resolve, reject) => {
      fs.writeFile({
        filePath,
        data: content,
        encoding,
        success: () => {
          if (showToast) {
            wx.showToast({
              title: '导出成功',
              icon: 'success',
              duration: 1500
            });
          }
          resolve(filePath);
        },
        fail: (err) => {
          if (showToast) {
            wx.showToast({
              title: '导出失败',
              icon: 'none',
              duration: 1500
            });
          }
          reject(err);
        }
      });
    });
  }
  
  /**
   * 导出并提供操作选项
   * @param {string} content - 内容
   * @param {string} title - 标题
   * @param {object} options - 选项
   * @returns {Promise} 操作结果
   */
  async exportWithOptions(content, title = '导出数据', options = {}) {
    return new Promise((resolve) => {
      wx.showActionSheet({
        itemList: ['复制到剪贴板', '保存为文件', '分享给好友'],
        success: async (res) => {
          switch (res.tapIndex) {
            case 0:
              // 复制到剪贴板
              await this.copyToClipboard(content, { successMessage: '已复制' });
              resolve({ action: 'copy', success: true });
              break;
              
            case 1:
              // 保存为文件
              try {
                const fileName = `${title}_${Date.now()}.txt`;
                const filePath = await this.saveAsFile(content, fileName);
                resolve({ action: 'save', success: true, filePath });
              } catch (error) {
                resolve({ action: 'save', success: false, error });
              }
              break;
              
            case 2:
              // 分享
              await this.copyAndShare(content);
              resolve({ action: 'share', success: true });
              break;
          }
        },
        fail: () => {
          resolve({ action: 'cancel', success: false });
        }
      });
    });
  }
  
  /**
   * 批量导出多种格式
   * @param {object} data - 数据对象
   * @param {string} baseName - 基础文件名
   * @returns {Promise} 导出结果
   */
  async exportMultipleFormats(data, baseName = 'export') {
    const results = {};
    
    try {
      // 导出为 TXT
      const textContent = this.formatResult(data);
      results.text = await this.saveAsFile(textContent, `${baseName}.txt`);
      
      // 导出为 Markdown
      const mdContent = this.formatResult({ ...data, format: 'markdown' });
      results.markdown = await this.saveAsFile(mdContent, `${baseName}.md`);
      
      // 导出为 JSON
      const jsonContent = JSON.stringify(data, null, 2);
      results.json = await this.saveAsFile(jsonContent, `${baseName}.json`);
      
      wx.showToast({
        title: `已导出${Object.keys(results).length}个文件`,
        icon: 'success',
        duration: 2000
      });
      
      return { success: true, results };
    } catch (error) {
      console.error('批量导出失败:', error);
      return { success: false, error, results };
    }
  }
  
  /**
   * 获取支持的导出格式
   * @returns {array} 格式列表
   */
  getSupportedFormats() {
    return this.supportedFormats;
  }
  
  /**
   * 获取文件扩展名
   * @param {string} format - 格式名称
   * @returns {string} 文件扩展名
   */
  getFileExtension(format) {
    const extensions = {
      'text': '.txt',
      'markdown': '.md',
      'csv': '.csv',
      'json': '.json'
    };
    return extensions[format] || '.txt';
  }
}

// 导出单例
const exportService = new ExportService();

module.exports = {
  exportService
};

