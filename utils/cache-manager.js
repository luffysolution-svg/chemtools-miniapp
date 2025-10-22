/**
 * 智能缓存管理器
 * 实现多级缓存：内存缓存 → Storage → 云数据库
 * 特性：
 * - LRU（最近最少使用）淘汰策略
 * - TTL（Time To Live）过期机制
 * - 自动预热和刷新
 * - 缓存命中率统计
 * 
 * @version 8.0.0
 * @author ChemTools Team
 */

/**
 * LRU缓存节点
 */
class CacheNode {
  constructor(key, value, ttl) {
    this.key = key
    this.value = value
    this.prev = null
    this.next = null
    this.expireTime = ttl ? Date.now() + ttl : null
  }

  isExpired() {
    return this.expireTime && Date.now() > this.expireTime
  }
}

/**
 * LRU缓存实现
 */
class LRUCache {
  constructor(capacity = 100, defaultTTL = 5 * 60 * 1000) {
    this.capacity = capacity
    this.defaultTTL = defaultTTL
    this.cache = new Map()
    this.head = new CacheNode(null, null)
    this.tail = new CacheNode(null, null)
    this.head.next = this.tail
    this.tail.prev = this.head

    // 统计信息
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      expirations: 0
    }
  }

  /**
   * 获取缓存
   */
  get(key) {
    const node = this.cache.get(key)
    
    if (!node) {
      this.stats.misses++
      return null
    }

    // 检查是否过期
    if (node.isExpired()) {
      this.remove(key)
      this.stats.expirations++
      this.stats.misses++
      return null
    }

    // 移动到链表头部（最近使用）
    this.moveToHead(node)
    this.stats.hits++
    return node.value
  }

  /**
   * 设置缓存
   */
  set(key, value, ttl) {
    let node = this.cache.get(key)

    if (node) {
      // 更新现有节点
      node.value = value
      node.expireTime = ttl ? Date.now() + ttl : (this.defaultTTL ? Date.now() + this.defaultTTL : null)
      this.moveToHead(node)
    } else {
      // 创建新节点
      node = new CacheNode(key, value, ttl || this.defaultTTL)
      this.cache.set(key, node)
      this.addToHead(node)

      // 检查容量，超出则淘汰最久未使用的
      if (this.cache.size > this.capacity) {
        const removed = this.removeTail()
        this.cache.delete(removed.key)
        this.stats.evictions++
      }
    }
  }

  /**
   * 删除缓存
   */
  remove(key) {
    const node = this.cache.get(key)
    if (node) {
      this.removeNode(node)
      this.cache.delete(key)
      return true
    }
    return false
  }

  /**
   * 清空缓存
   */
  clear() {
    this.cache.clear()
    this.head.next = this.tail
    this.tail.prev = this.head
  }

  /**
   * 获取缓存大小
   */
  size() {
    return this.cache.size
  }

  /**
   * 获取命中率
   */
  getHitRate() {
    const total = this.stats.hits + this.stats.misses
    return total > 0 ? (this.stats.hits / total * 100).toFixed(2) + '%' : '0%'
  }

  /**
   * 获取统计信息
   */
  getStats() {
    return {
      ...this.stats,
      size: this.cache.size,
      capacity: this.capacity,
      hitRate: this.getHitRate()
    }
  }

  /**
   * 重置统计信息
   */
  resetStats() {
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      expirations: 0
    }
  }

  // === 内部方法 ===

  addToHead(node) {
    node.prev = this.head
    node.next = this.head.next
    this.head.next.prev = node
    this.head.next = node
  }

  removeNode(node) {
    node.prev.next = node.next
    node.next.prev = node.prev
  }

  moveToHead(node) {
    this.removeNode(node)
    this.addToHead(node)
  }

  removeTail() {
    const node = this.tail.prev
    this.removeNode(node)
    return node
  }
}

/**
 * 多级缓存管理器
 */
class CacheManager {
  constructor(options = {}) {
    const {
      memoryCapacity = 100,
      memoryTTL = 5 * 60 * 1000, // 5分钟
      storageTTL = 24 * 60 * 60 * 1000, // 24小时
      storagePrefix = 'chemtools:cache:',
      enableCloud = false
    } = options

    // L1: 内存缓存（LRU）
    this.memoryCache = new LRUCache(memoryCapacity, memoryTTL)

    // L2: Storage缓存配置
    this.storageTTL = storageTTL
    this.storagePrefix = storagePrefix

    // L3: 云缓存
    this.enableCloud = enableCloud

    // 预热任务队列
    this.warmupQueue = []
  }

  /**
   * 获取缓存（多级查找）
   */
  async get(key) {
    try {
      // L1: 内存缓存
      let value = this.memoryCache.get(key)
      if (value !== null) {
        return value
      }

      // L2: Storage缓存
      value = this.getFromStorage(key)
      if (value !== null) {
        // 回填到内存缓存
        this.memoryCache.set(key, value)
        return value
      }

      // L3: 云缓存（如果启用）
      if (this.enableCloud) {
        value = await this.getFromCloud(key)
        if (value !== null) {
          // 回填到Storage和内存
          this.setToStorage(key, value)
          this.memoryCache.set(key, value)
          return value
        }
      }

      return null
    } catch (error) {
      console.error('Cache get error:', error)
      return null
    }
  }

  /**
   * 设置缓存（多级写入）
   */
  set(key, value, options = {}) {
    try {
      const { memoryOnly = false, storageOnly = false, ttl } = options

      // 写入内存
      if (!storageOnly) {
        this.memoryCache.set(key, value, ttl)
      }

      // 写入Storage
      if (!memoryOnly) {
        this.setToStorage(key, value, ttl)
      }

      // 写入云端（异步，不等待）
      if (this.enableCloud && !memoryOnly && !storageOnly) {
        this.setToCloud(key, value).catch(err => {
          console.error('Cloud cache set error:', err)
        })
      }
    } catch (error) {
      console.error('Cache set error:', error)
    }
  }

  /**
   * 删除缓存
   */
  remove(key) {
    try {
      // 删除内存缓存
      this.memoryCache.remove(key)

      // 删除Storage缓存
      wx.removeStorageSync(this.storagePrefix + key)

      // 删除云缓存（异步）
      if (this.enableCloud) {
        this.removeFromCloud(key).catch(err => {
          console.error('Cloud cache remove error:', err)
        })
      }
    } catch (error) {
      console.error('Cache remove error:', error)
    }
  }

  /**
   * 清空所有缓存
   */
  clear() {
    try {
      // 清空内存
      this.memoryCache.clear()

      // 清空Storage中的缓存项
      const info = wx.getStorageInfoSync()
      info.keys.forEach(key => {
        if (key.startsWith(this.storagePrefix)) {
          wx.removeStorageSync(key)
        }
      })

      console.log('Cache cleared')
    } catch (error) {
      console.error('Cache clear error:', error)
    }
  }

  /**
   * 缓存预热
   */
  async warmup(keys, fetcher) {
    for (const key of keys) {
      const value = await this.get(key)
      if (value === null) {
        try {
          const data = await fetcher(key)
          this.set(key, data)
        } catch (error) {
          console.error(`Warmup failed for key: ${key}`, error)
        }
      }
    }
  }

  /**
   * 获取统计信息
   */
  getStats() {
    return {
      memory: this.memoryCache.getStats(),
      storage: this.getStorageStats()
    }
  }

  // === Storage操作 ===

  getFromStorage(key) {
    try {
      const data = wx.getStorageSync(this.storagePrefix + key)
      if (!data) return null

      // 检查是否过期
      if (data.expireTime && Date.now() > data.expireTime) {
        wx.removeStorageSync(this.storagePrefix + key)
        return null
      }

      return data.value
    } catch (error) {
      console.error('Storage get error:', error)
      return null
    }
  }

  setToStorage(key, value, ttl) {
    try {
      const data = {
        value,
        createTime: Date.now(),
        expireTime: ttl ? Date.now() + ttl : Date.now() + this.storageTTL
      }
      wx.setStorageSync(this.storagePrefix + key, data)
    } catch (error) {
      console.error('Storage set error:', error)
    }
  }

  getStorageStats() {
    try {
      const info = wx.getStorageInfoSync()
      const cacheKeys = info.keys.filter(key => key.startsWith(this.storagePrefix))
      
      return {
        keys: cacheKeys.length,
        currentSize: info.currentSize,
        limitSize: info.limitSize
      }
    } catch (error) {
      return { keys: 0, currentSize: 0, limitSize: 0 }
    }
  }

}

/**
 * 全局缓存管理器实例
 */
const cacheManager = new CacheManager({
  memoryCapacity: 100,
  memoryTTL: 5 * 60 * 1000, // 5分钟
  storageTTL: 24 * 60 * 60 * 1000, // 24小时
  storagePrefix: 'chemtools:cache:',
  enableCloud: false  // 初始禁用云缓存，后续可开启
})

/**
 * 缓存装饰器工厂
 * 用于自动缓存函数返回值
 */
function cacheable(options = {}) {
  const { ttl, keyGenerator } = options

  return function(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value

    descriptor.value = async function(...args) {
      // 生成缓存key
      const cacheKey = keyGenerator ? 
        keyGenerator(...args) : 
        `${propertyKey}:${JSON.stringify(args)}`

      // 尝试从缓存获取
      let result = await cacheManager.get(cacheKey)
      
      if (result !== null) {
        return result
      }

      // 执行原方法
      result = await originalMethod.apply(this, args)

      // 存入缓存
      if (result !== null && result !== undefined) {
        cacheManager.set(cacheKey, result, { ttl })
      }

      return result
    }

    return descriptor
  }
}

module.exports = {
  CacheManager,
  LRUCache,
  cacheManager,
  cacheable
}

