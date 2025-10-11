/**
 * 历史记录服务（增强版）
 * 管理用户的计算历史，支持详细的元数据和筛选
 * Version: 2.0.0
 */

const { storageService } = require('./storage');

class HistoryService {
  /**
   * 添加计算历史（增强版）
   * @param {object} params - 历史记录参数
   * @param {string} params.type - 计算类型（xrd/electrochem/ksp/conversion等）
   * @param {string} params.title - 标题
   * @param {string} params.input - 输入参数描述
   * @param {string} params.result - 计算结果描述
   * @param {object} params.metadata - 额外元数据
   * @param {string} params.metadata.formula - 使用的公式
   * @param {array} params.metadata.conditions - 计算条件数组
   * @param {string} params.metadata.precision - 精度说明
   * @param {string} params.metadata.unit - 结果单位
   * @param {object} params.metadata.rawData - 原始计算数据（用于重新计算）
   * @param {string} params.metadata.category - 所属类别（基础/高级/材料/谱学）
   * @param {string} params.metadata.warning - 警告信息（如果有）
   * @param {object} params.metadata.dataSource - 数据来源信息
   * @returns {boolean} 是否成功
   */
  add({ type, title, input, result, metadata = {} }) {
    // 构建增强的历史记录项
    const item = {
      type,
      title,
      input,
      result,
      metadata: {
        formula: metadata.formula || null,
        conditions: metadata.conditions || [],
        precision: metadata.precision || null,
        unit: metadata.unit || null,
        rawData: metadata.rawData || null,
        category: metadata.category || this._getCategoryByType(type),
        warning: metadata.warning || null,
        dataSource: metadata.dataSource || null,
        ...metadata  // 保留其他自定义字段
      },
      content: `${title}: ${input} → ${result}`,  // 用于去重
      tags: this._generateTags(type, title, input, result)  // 自动生成标签用于搜索
    };
    
    return storageService.addHistory(item);
  }
  
  /**
   * 根据类型获取类别
   * @private
   */
  _getCategoryByType(type) {
    const categoryMap = {
      'xrd': '高级计算',
      'electrochem': '高级计算',
      'ksp': '高级计算',
      'complexation': '高级计算',
      'unit': '基础计算',
      'ph': '基础计算',
      'solution': '基础计算',
      'concentration': '基础计算',
      'semiconductor': '材料分析',
      'element': '材料分析',
      'uvvis': '谱学分析',
      'ir': '谱学分析'
    };
    return categoryMap[type] || '其他';
  }
  
  /**
   * 生成搜索标签
   * @private
   */
  _generateTags(type, title, input, result) {
    const tags = new Set();
    tags.add(type);
    tags.add(this._getCategoryByType(type));
    
    // 从标题提取关键词
    const titleWords = title.split(/[\s、，,]/);
    titleWords.forEach(word => {
      if (word.length > 1) tags.add(word);
    });
    
    // 从输入提取关键词
    const inputWords = input.split(/[\s→=:：]/);
    inputWords.forEach(word => {
      const cleaned = word.trim().replace(/[()（）]/g, '');
      if (cleaned && cleaned.length > 1) tags.add(cleaned);
    });
    
    return Array.from(tags);
  }

  /**
   * 获取历史记录（增强版）
   * @param {object} options - 查询选项
   * @param {string} options.type - 按类型筛选
   * @param {string} options.category - 按类别筛选
   * @param {string} options.keyword - 关键词搜索
   * @param {string} options.dateFrom - 开始日期（ISO字符串）
   * @param {string} options.dateTo - 结束日期（ISO字符串）
   * @param {boolean} options.hasWarning - 仅显示有警告的记录
   * @param {string} options.sortBy - 排序方式（time/type/category）
   * @param {string} options.sortOrder - 排序顺序（asc/desc）
   * @param {number} options.limit - 限制数量
   * @returns {array} 历史记录列表
   */
  getList(options = {}) {
    const {
      type = null,
      category = null,
      keyword = null,
      dateFrom = null,
      dateTo = null,
      hasWarning = false,
      sortBy = 'time',
      sortOrder = 'desc',
      limit = 50
    } = options;
    
    let history = storageService.getHistory(limit * 2); // 获取更多以便筛选
    
    // 按类型筛选
    if (type) {
      history = history.filter(item => item.type === type);
    }
    
    // 按类别筛选
    if (category) {
      history = history.filter(item => 
        item.metadata && item.metadata.category === category
      );
    }
    
    // 关键词搜索
    if (keyword && keyword.trim()) {
      const kw = keyword.toLowerCase().trim();
      history = history.filter(item => {
        // 搜索标题、输入、结果、标签
        const searchFields = [
          item.title,
          item.input,
          item.result,
          ...(item.tags || [])
        ].join(' ').toLowerCase();
        
        return searchFields.includes(kw);
      });
    }
    
    // 日期范围筛选
    if (dateFrom) {
      const from = new Date(dateFrom).getTime();
      history = history.filter(item => item.timestamp >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo).getTime();
      history = history.filter(item => item.timestamp <= to);
    }
    
    // 仅显示有警告的
    if (hasWarning) {
      history = history.filter(item => 
        item.metadata && item.metadata.warning
      );
    }
    
    // 排序
    history.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        case 'category':
          const catA = (a.metadata && a.metadata.category) || '';
          const catB = (b.metadata && b.metadata.category) || '';
          comparison = catA.localeCompare(catB);
          break;
        case 'time':
        default:
          comparison = a.timestamp - b.timestamp;
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    // 限制数量
    return history.slice(0, limit);
  }
  
  /**
   * 搜索历史记录
   * @param {string} keyword - 搜索关键词
   * @param {object} options - 额外选项
   * @returns {array} 匹配的记录
   */
  search(keyword, options = {}) {
    return this.getList({
      ...options,
      keyword,
      limit: options.limit || 20
    });
  }
  
  /**
   * 获取最近的记录
   * @param {number} count - 数量
   * @returns {array} 最近的记录
   */
  getRecent(count = 10) {
    return this.getList({
      sortBy: 'time',
      sortOrder: 'desc',
      limit: count
    });
  }
  
  /**
   * 按类别分组获取
   * @returns {object} 按类别分组的记录
   */
  getByCategory() {
    const history = this.getList({ limit: 200 });
    const grouped = {};
    
    history.forEach(item => {
      const cat = (item.metadata && item.metadata.category) || '其他';
      if (!grouped[cat]) {
        grouped[cat] = [];
      }
      grouped[cat].push(item);
    });
    
    return grouped;
  }

  /**
   * 删除指定历史记录
   * @param {string} id - 记录ID
   */
  remove(id) {
    const history = storageService.getHistory();
    const filtered = history.filter(item => item.id !== id);
    return storageService.set('chemtools:history', filtered);
  }

  /**
   * 清空所有历史
   */
  clear() {
    return storageService.clearHistory();
  }

  /**
   * 导出历史记录为文本（增强版）
   * @param {array} items - 要导出的记录
   * @param {object} options - 导出选项
   * @param {boolean} options.includeMetadata - 是否包含元数据
   * @param {boolean} options.includeFormula - 是否包含公式
   * @param {boolean} options.includeConditions - 是否包含计算条件
   * @returns {string} 格式化的文本
   */
  exportAsText(items = null, options = {}) {
    const {
      includeMetadata = true,
      includeFormula = true,
      includeConditions = true
    } = options;
    
    const history = items || this.getList();
    const lines = [
      '# 化学计算工具 - 历史记录',
      `导出时间: ${new Date().toLocaleString('zh-CN')}`,
      `记录数量: ${history.length}`,
      '',
      '---',
      ''
    ];
    
    history.forEach((item, index) => {
      const date = new Date(item.timestamp).toLocaleString('zh-CN');
      
      lines.push(`## ${index + 1}. ${item.title}`);
      lines.push(`**类型**: ${item.type}`);
      
      if (item.metadata && item.metadata.category) {
        lines.push(`**类别**: ${item.metadata.category}`);
      }
      
      lines.push(`**时间**: ${date}`);
      lines.push('');
      
      lines.push(`**输入**: ${item.input}`);
      lines.push(`**结果**: ${item.result}`);
      
      // 添加元数据
      if (includeMetadata && item.metadata) {
        if (item.metadata.unit) {
          lines.push(`**单位**: ${item.metadata.unit}`);
        }
        
        if (item.metadata.precision) {
          lines.push(`**精度**: ${item.metadata.precision}`);
        }
        
        if (includeFormula && item.metadata.formula) {
          lines.push(`**公式**: ${item.metadata.formula}`);
        }
        
        if (includeConditions && item.metadata.conditions && item.metadata.conditions.length > 0) {
          lines.push(`**条件**: ${item.metadata.conditions.join(', ')}`);
        }
        
        if (item.metadata.warning) {
          lines.push(`**⚠️ 警告**: ${item.metadata.warning}`);
        }
        
        if (item.metadata.dataSource) {
          lines.push(`**数据来源**: ${item.metadata.dataSource}`);
        }
      }
      
      lines.push('');
      lines.push('---');
      lines.push('');
    });
    
    lines.push('');
    lines.push('---');
    lines.push('*由化学计算工具自动生成*');
    
    return lines.join('\n');
  }

  /**
   * 导出为JSON格式
   * @param {array} items - 要导出的记录
   * @returns {string} JSON字符串
   */
  exportAsJSON(items = null) {
    const history = items || this.getList();
    return JSON.stringify(history, null, 2);
  }

  /**
   * 获取统计信息（增强版）
   * @returns {object} 统计数据
   */
  getStatistics() {
    const history = storageService.getHistory();
    const stats = {
      total: history.length,
      byType: {},
      byCategory: {},
      byDate: {},
      withWarnings: 0,
      recent: history.slice(0, 5),
      mostUsedTypes: [],
      dateRange: {
        earliest: null,
        latest: null
      }
    };

    if (history.length === 0) {
      return stats;
    }

    // 按类型和类别统计
    history.forEach(item => {
      // 类型统计
      if (!stats.byType[item.type]) {
        stats.byType[item.type] = 0;
      }
      stats.byType[item.type]++;
      
      // 类别统计
      const category = (item.metadata && item.metadata.category) || '其他';
      if (!stats.byCategory[category]) {
        stats.byCategory[category] = 0;
      }
      stats.byCategory[category]++;
      
      // 日期统计（按天）
      const date = new Date(item.timestamp).toLocaleDateString('zh-CN');
      if (!stats.byDate[date]) {
        stats.byDate[date] = 0;
      }
      stats.byDate[date]++;
      
      // 警告统计
      if (item.metadata && item.metadata.warning) {
        stats.withWarnings++;
      }
    });

    // 最常用的类型（Top 5）
    stats.mostUsedTypes = Object.entries(stats.byType)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([type, count]) => ({ type, count }));

    // 日期范围
    const timestamps = history.map(item => item.timestamp);
    stats.dateRange.earliest = new Date(Math.min(...timestamps));
    stats.dateRange.latest = new Date(Math.max(...timestamps));

    return stats;
  }
  
  /**
   * 获取使用趋势（按日期）
   * @param {number} days - 最近多少天
   * @returns {array} 每日使用量
   */
  getTrend(days = 7) {
    const history = this.getList({ limit: 1000 });
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    const trend = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const dayStart = now - i * oneDayMs;
      const dayEnd = dayStart + oneDayMs;
      const date = new Date(dayStart).toLocaleDateString('zh-CN');
      
      const count = history.filter(item => 
        item.timestamp >= dayStart && item.timestamp < dayEnd
      ).length;
      
      trend.push({ date, count });
    }
    
    return trend;
  }
  
  /**
   * 批量导出为CSV格式
   * @param {array} items - 要导出的记录
   * @returns {string} CSV字符串
   */
  exportAsCSV(items = null) {
    const history = items || this.getList();
    const lines = [];
    
    // CSV头部
    lines.push('序号,时间,类型,类别,标题,输入,结果,单位,精度,公式,条件,警告');
    
    // CSV数据行
    history.forEach((item, index) => {
      const date = new Date(item.timestamp).toLocaleString('zh-CN');
      const category = (item.metadata && item.metadata.category) || '';
      const unit = (item.metadata && item.metadata.unit) || '';
      const precision = (item.metadata && item.metadata.precision) || '';
      const formula = (item.metadata && item.metadata.formula) || '';
      const conditions = (item.metadata && item.metadata.conditions) ? 
        item.metadata.conditions.join('; ') : '';
      const warning = (item.metadata && item.metadata.warning) || '';
      
      // CSV行（转义逗号和引号）
      const csvRow = [
        index + 1,
        `"${date}"`,
        item.type,
        category,
        `"${item.title}"`,
        `"${item.input}"`,
        `"${item.result}"`,
        unit,
        precision,
        `"${formula}"`,
        `"${conditions}"`,
        warning
      ].join(',');
      
      lines.push(csvRow);
    });
    
    return lines.join('\n');
  }
}

// 导出单例
const historyService = new HistoryService();

module.exports = {
  historyService
};

