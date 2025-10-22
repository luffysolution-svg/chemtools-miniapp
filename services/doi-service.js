/**
 * DOI查询服务
 * 通过Crossref API查询文献元数据
 * 支持LRU缓存和离线降级
 */

const CROSSREF_API = 'https://api.crossref.org/works/';
const CACHE_KEY = 'doi_query_cache';
const CACHE_MAX_SIZE = 100;
const CACHE_EXPIRY_HOURS = 24;
const REQUEST_TIMEOUT = 10000; // 10秒

/**
 * DOI格式验证
 */
function validateDOI(doi) {
  const DOI_REGEX = /^10\.\d{4,9}\/[-._;()/:A-Za-z0-9]+$/;
  return DOI_REGEX.test(doi);
}

/**
 * LRU缓存类
 */
class LRUCache {
  constructor(maxSize = 100) {
    this.maxSize = maxSize;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return null;
    
    const item = this.cache.get(key);
    
    // 检查是否过期
    const now = Date.now();
    if (now - item.timestamp > CACHE_EXPIRY_HOURS * 3600 * 1000) {
      this.cache.delete(key);
      return null;
    }
    
    // 更新访问顺序（删除后重新添加到末尾）
    this.cache.delete(key);
    this.cache.set(key, item);
    
    return item.data;
  }

  set(key, data) {
    // 如果已存在，先删除
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    
    // 如果超出大小限制，删除最旧的项（第一个）
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    // 添加新项
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }
}

// 全局缓存实例
let cacheInstance = null;

/**
 * 获取缓存实例
 */
function getCache() {
  if (!cacheInstance) {
    cacheInstance = new LRUCache(CACHE_MAX_SIZE);
    
    // 从本地存储加载缓存
    try {
      const saved = wx.getStorageSync(CACHE_KEY);
      if (saved && saved.cache) {
        saved.cache.forEach(item => {
          cacheInstance.cache.set(item.key, item.value);
        });
      }
    } catch (e) {
      console.error('加载缓存失败:', e);
    }
  }
  return cacheInstance;
}

/**
 * 保存缓存到本地存储
 */
function saveCache() {
  try {
    const cache = getCache();
    const data = {
      cache: Array.from(cache.cache.entries()).map(([key, value]) => ({
        key,
        value
      })),
      timestamp: Date.now()
    };
    wx.setStorageSync(CACHE_KEY, data);
  } catch (e) {
    console.error('保存缓存失败:', e);
  }
}

/**
 * 清除缓存
 */
function clearCache() {
  const cache = getCache();
  cache.clear();
  try {
    wx.removeStorageSync(CACHE_KEY);
  } catch (e) {
    console.error('清除缓存失败:', e);
  }
}

/**
 * 解析Crossref返回的元数据
 */
function parseMetadata(data) {
  if (!data || !data.message) {
    throw new Error('Invalid response data');
  }

  const msg = data.message;
  
  // 提取作者信息
  const authors = (msg.author || []).map(author => ({
    given: author.given || '',
    family: author.family || '',
    name: author.name || ''
  }));

  // 提取日期
  let year, month, day;
  if (msg.published && msg.published['date-parts'] && msg.published['date-parts'][0]) {
    const dateParts = msg.published['date-parts'][0];
    year = dateParts[0];
    month = dateParts[1];
    day = dateParts[2];
  } else if (msg['published-print'] && msg['published-print']['date-parts'] && msg['published-print']['date-parts'][0]) {
    const dateParts = msg['published-print']['date-parts'][0];
    year = dateParts[0];
    month = dateParts[1];
    day = dateParts[2];
  }

  // 提取页码
  let pages = msg.page || '';
  
  // 提取期刊名
  let journal = '';
  if (msg['container-title'] && msg['container-title'].length > 0) {
    journal = msg['container-title'][0];
  }

  return {
    doi: msg.DOI,
    title: (msg.title && msg.title[0]) || '',
    authors: authors,
    journal: journal,
    journalShort: msg['short-container-title'] ? msg['short-container-title'][0] : journal,
    volume: msg.volume || '',
    issue: msg.issue || '',
    pages: pages,
    year: year,
    month: month,
    day: day,
    publisher: msg.publisher || '',
    type: msg.type || '',
    url: msg.URL || `https://doi.org/${msg.DOI}`,
    // 额外信息
    abstract: msg.abstract || '',
    issn: (msg.ISSN && msg.ISSN[0]) || '',
    language: msg.language || 'en'
  };
}

/**
 * 查询DOI元数据
 * @param {string} doi - DOI标识符
 * @returns {Promise<Object>} 文献元数据
 */
function queryDOI(doi) {
  return new Promise((resolve, reject) => {
    // 清理和验证DOI
    doi = doi.trim();
    if (!validateDOI(doi)) {
      reject({
        code: 'INVALID_DOI',
        message: 'DOI格式不正确'
      });
      return;
    }

    // 检查缓存
    const cache = getCache();
    const cached = cache.get(doi);
    if (cached) {
      console.log('从缓存加载:', doi);
      resolve({
        data: cached,
        fromCache: true
      });
      return;
    }

    // 发起网络请求
    const url = CROSSREF_API + encodeURIComponent(doi);
    
    wx.request({
      url: url,
      method: 'GET',
      timeout: REQUEST_TIMEOUT,
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        if (res.statusCode === 200) {
          try {
            const metadata = parseMetadata(res.data);
            
            // 存入缓存
            cache.set(doi, metadata);
            saveCache();
            
            resolve({
              data: metadata,
              fromCache: false
            });
          } catch (e) {
            reject({
              code: 'PARSE_ERROR',
              message: '解析文献数据失败: ' + e.message
            });
          }
        } else if (res.statusCode === 404) {
          reject({
            code: 'NOT_FOUND',
            message: '未找到该DOI对应的文献'
          });
        } else if (res.statusCode === 429) {
          reject({
            code: 'RATE_LIMIT',
            message: 'API请求频率超限，请稍后再试'
          });
        } else {
          reject({
            code: 'API_ERROR',
            message: `API返回错误: ${res.statusCode}`
          });
        }
      },
      fail: (err) => {
        console.error('DOI查询失败:', err);
        reject({
          code: 'NETWORK_ERROR',
          message: '网络请求失败，请检查网络连接'
        });
      }
    });
  });
}

/**
 * 获取缓存统计信息
 */
function getCacheStats() {
  const cache = getCache();
  return {
    size: cache.size(),
    maxSize: CACHE_MAX_SIZE,
    expiryHours: CACHE_EXPIRY_HOURS
  };
}

module.exports = {
  validateDOI,
  queryDOI,
  clearCache,
  getCacheStats
};

