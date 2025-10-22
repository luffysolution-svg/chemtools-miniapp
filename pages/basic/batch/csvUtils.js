/**
 * CSV工具函数
 * 用于CSV数据的解析和生成
 */

/**
 * 解析CSV文本
 * @param {string} csvText - CSV格式的文本
 * @returns {Array<Array<string>>} 二维数组
 */
function parseCsv(csvText) {
  if (!csvText || typeof csvText !== 'string') {
    return [];
  }

  const lines = csvText.trim().split(/\r?\n/);
  const result = [];

  for (let line of lines) {
    if (!line.trim()) continue;

    // 简单CSV解析（不处理引号内的逗号）
    // 支持逗号、制表符分隔
    let values;
    if (line.includes('\t')) {
      values = line.split('\t');
    } else if (line.includes(',')) {
      values = line.split(',');
    } else {
      values = [line];
    }

    // 去除每个值的前后空格
    values = values.map(v => v.trim());
    
    if (values.length > 0 && values[0]) {
      result.push(values);
    }
  }

  return result;
}

/**
 * 生成CSV文本
 * @param {Array<Array<any>>} data - 二维数组
 * @param {string} delimiter - 分隔符，默认逗号
 * @returns {string} CSV格式文本
 */
function generateCsv(data, delimiter = ',') {
  if (!Array.isArray(data) || data.length === 0) {
    return '';
  }

  const lines = data.map(row => {
    if (!Array.isArray(row)) {
      return String(row);
    }

    return row.map(cell => {
      let value = String(cell == null ? '' : cell);
      
      // 如果包含分隔符、换行符或引号，需要用引号包围
      if (value.includes(delimiter) || value.includes('\n') || value.includes('"')) {
        value = '"' + value.replace(/"/g, '""') + '"';
      }
      
      return value;
    }).join(delimiter);
  });

  return lines.join('\n');
}

/**
 * 解析TSV文本（Tab分隔）
 * @param {string} tsvText - TSV格式的文本
 * @returns {Array<Array<string>>} 二维数组
 */
function parseTsv(tsvText) {
  if (!tsvText || typeof tsvText !== 'string') {
    return [];
  }

  const lines = tsvText.trim().split(/\r?\n/);
  const result = [];

  for (let line of lines) {
    if (!line.trim()) continue;

    const values = line.split('\t').map(v => v.trim());
    
    if (values.length > 0 && values[0]) {
      result.push(values);
    }
  }

  return result;
}

/**
 * 生成TSV文本
 * @param {Array<Array<any>>} data - 二维数组
 * @returns {string} TSV格式文本
 */
function generateTsv(data) {
  return generateCsv(data, '\t');
}

/**
 * 将对象数组转换为CSV
 * @param {Array<Object>} objects - 对象数组
 * @param {Array<string>} headers - 表头（可选，默认使用第一个对象的键）
 * @returns {string} CSV格式文本
 */
function objectsToCsv(objects, headers = null) {
  if (!Array.isArray(objects) || objects.length === 0) {
    return '';
  }

  // 获取表头
  if (!headers) {
    headers = Object.keys(objects[0]);
  }

  // 生成数据行
  const rows = objects.map(obj => {
    return headers.map(h => obj[h]);
  });

  // 添加表头
  return generateCsv([headers, ...rows]);
}

/**
 * 将CSV转换为对象数组
 * @param {string} csvText - CSV文本
 * @param {boolean} hasHeader - 是否包含表头（默认true）
 * @returns {Array<Object>} 对象数组
 */
function csvToObjects(csvText, hasHeader = true) {
  const data = parseCsv(csvText);
  
  if (data.length === 0) {
    return [];
  }

  if (!hasHeader) {
    // 没有表头，使用数字索引
    return data.map(row => {
      const obj = {};
      row.forEach((value, index) => {
        obj[index] = value;
      });
      return obj;
    });
  }

  // 第一行是表头
  const headers = data[0];
  const rows = data.slice(1);

  return rows.map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index] || '';
    });
    return obj;
  });
}

/**
 * 验证CSV格式
 * @param {string} csvText - CSV文本
 * @returns {Object} { valid: boolean, error: string, rowCount: number, columnCount: number }
 */
function validateCsv(csvText) {
  try {
    const data = parseCsv(csvText);
    
    if (data.length === 0) {
      return {
        valid: false,
        error: '没有有效数据',
        rowCount: 0,
        columnCount: 0
      };
    }

    // 检查列数是否一致
    const columnCounts = data.map(row => row.length);
    const firstColumnCount = columnCounts[0];
    const inconsistent = columnCounts.some(count => count !== firstColumnCount);

    if (inconsistent) {
      return {
        valid: true,
        error: '列数不一致（这可能是正常的）',
        rowCount: data.length,
        columnCount: firstColumnCount,
        warning: true
      };
    }

    return {
      valid: true,
      error: null,
      rowCount: data.length,
      columnCount: firstColumnCount
    };
  } catch (error) {
    return {
      valid: false,
      error: error.message,
      rowCount: 0,
      columnCount: 0
    };
  }
}

/**
 * 提取CSV的某一列
 * @param {string} csvText - CSV文本
 * @param {number} columnIndex - 列索引（从0开始）
 * @param {boolean} skipHeader - 是否跳过表头（默认false）
 * @returns {Array<string>} 列数据数组
 */
function extractColumn(csvText, columnIndex = 0, skipHeader = false) {
  const data = parseCsv(csvText);
  
  if (data.length === 0) {
    return [];
  }

  const startRow = skipHeader ? 1 : 0;
  return data.slice(startRow).map(row => row[columnIndex] || '').filter(v => v);
}

module.exports = {
  parseCsv,
  generateCsv,
  parseTsv,
  generateTsv,
  objectsToCsv,
  csvToObjects,
  validateCsv,
  extractColumn
};

