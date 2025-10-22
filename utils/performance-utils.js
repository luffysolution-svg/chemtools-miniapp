/**
 * 性能优化工具集
 * 包含防抖、节流、虚拟列表、IntersectionObserver等
 * 
 * @version 8.0.0
 * @author ChemTools Team
 */

/**
 * 防抖函数
 * 在事件触发n秒后执行回调，如果n秒内又触发则重新计时
 * 
 * @param {Function} func 要执行的函数
 * @param {number} wait 等待时间（毫秒）
 * @param {boolean} immediate 是否立即执行
 * @returns {Function} 防抖后的函数
 */
function debounce(func, wait = 300, immediate = false) {
  let timeout

  return function(...args) {
    const context = this
    const later = function() {
      timeout = null
      if (!immediate) func.apply(context, args)
    }

    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)

    if (callNow) func.apply(context, args)
  }
}

/**
 * 节流函数
 * 在规定时间内只执行一次
 * 
 * @param {Function} func 要执行的函数
 * @param {number} wait 间隔时间（毫秒）
 * @param {Object} options 配置选项
 * @returns {Function} 节流后的函数
 */
function throttle(func, wait = 300, options = {}) {
  let timeout, context, args
  let previous = 0

  const { leading = true, trailing = true } = options

  const later = function() {
    previous = leading === false ? 0 : Date.now()
    timeout = null
    func.apply(context, args)
    if (!timeout) context = args = null
  }

  const throttled = function(...newArgs) {
    const now = Date.now()
    if (!previous && leading === false) previous = now

    const remaining = wait - (now - previous)
    context = this
    args = newArgs

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = now
      func.apply(context, args)
      if (!timeout) context = args = null
    } else if (!timeout && trailing !== false) {
      timeout = setTimeout(later, remaining)
    }
  }

  throttled.cancel = function() {
    clearTimeout(timeout)
    previous = 0
    timeout = context = args = null
  }

  return throttled
}

/**
 * RequestAnimationFrame节流
 * 使用RAF实现更流畅的节流效果
 */
function rafThrottle(func) {
  let scheduled = false

  return function(...args) {
    if (scheduled) return

    scheduled = true
    const context = this

    requestAnimationFrame(() => {
      func.apply(context, args)
      scheduled = false
    })
  }
}

/**
 * 批量setData优化
 * 合并多次setData调用，减少渲染次数
 */
class BatchSetData {
  constructor(page, delay = 16) {
    this.page = page
    this.delay = delay
    this.pendingData = {}
    this.timer = null
  }

  set(data) {
    Object.assign(this.pendingData, data)

    if (this.timer) return

    this.timer = setTimeout(() => {
      if (this.page && Object.keys(this.pendingData).length > 0) {
        this.page.setData(this.pendingData)
        this.pendingData = {}
      }
      this.timer = null
    }, this.delay)
  }

  flush() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }

    if (this.page && Object.keys(this.pendingData).length > 0) {
      this.page.setData(this.pendingData)
      this.pendingData = {}
    }
  }
}

/**
 * IntersectionObserver 封装
 * 用于实现元素可见性监听和懒加载
 */
class IntersectionObserverHelper {
  constructor(options = {}) {
    const {
      threshold = [0, 0.25, 0.5, 0.75, 1],
      margins = { bottom: 50 },
      initialRatio = 0,
      observeAll = false
    } = options

    this.threshold = threshold
    this.margins = margins
    this.initialRatio = initialRatio
    this.observeAll = observeAll
    this.observers = new Map()
  }

  /**
   * 创建观察器
   */
  createObserver(page, selector, callback) {
    if (this.observers.has(selector)) {
      this.disconnect(selector)
    }

    const observer = page.createIntersectionObserver({
      thresholds: this.threshold,
      initialRatio: this.initialRatio,
      observeAll: this.observeAll
    })

    if (this.margins) {
      observer.relativeToViewport(this.margins)
    }

    observer.observe(selector, callback)
    this.observers.set(selector, observer)

    return observer
  }

  /**
   * 断开观察器
   */
  disconnect(selector) {
    const observer = this.observers.get(selector)
    if (observer) {
      observer.disconnect()
      this.observers.delete(selector)
    }
  }

  /**
   * 断开所有观察器
   */
  disconnectAll() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers.clear()
  }
}

/**
 * 虚拟列表管理器
 * 用于优化长列表渲染性能
 */
class VirtualListManager {
  constructor(options = {}) {
    const {
      itemHeight = 100,
      buffer = 3,
      containerHeight = 0
    } = options

    this.itemHeight = itemHeight
    this.buffer = buffer
    this.containerHeight = containerHeight || 0
    this.scrollTop = 0
    this.allData = []
  }

  /**
   * 设置全部数据
   */
  setData(data) {
    this.allData = data
    return this.getVisibleData()
  }

  /**
   * 更新滚动位置
   */
  updateScroll(scrollTop, containerHeight) {
    this.scrollTop = scrollTop
    if (containerHeight) {
      this.containerHeight = containerHeight
    }
    return this.getVisibleData()
  }

  /**
   * 获取可见数据
   */
  getVisibleData() {
    if (!this.allData || this.allData.length === 0) {
      return {
        visibleData: [],
        startIndex: 0,
        endIndex: 0,
        offsetY: 0,
        totalHeight: 0
      }
    }

    // 计算可视区域内的数据索引
    const startIndex = Math.max(0, Math.floor(this.scrollTop / this.itemHeight) - this.buffer)
    const visibleCount = Math.ceil(this.containerHeight / this.itemHeight)
    const endIndex = Math.min(
      this.allData.length,
      startIndex + visibleCount + this.buffer * 2
    )

    // 获取可见数据
    const visibleData = this.allData.slice(startIndex, endIndex).map((item, index) => ({
      ...item,
      _virtualIndex: startIndex + index
    }))

    // 计算偏移量
    const offsetY = startIndex * this.itemHeight
    const totalHeight = this.allData.length * this.itemHeight

    return {
      visibleData,
      startIndex,
      endIndex,
      offsetY,
      totalHeight
    }
  }

  /**
   * 获取数据总量
   */
  getTotal() {
    return this.allData.length
  }
}

/**
 * 页面加载性能监控
 */
class PerformanceMonitor {
  constructor() {
    this.marks = new Map()
    this.measures = []
  }

  /**
   * 标记时间点
   */
  mark(name) {
    this.marks.set(name, Date.now())
  }

  /**
   * 测量时间差
   */
  measure(name, startMark, endMark) {
    const start = this.marks.get(startMark)
    const end = endMark ? this.marks.get(endMark) : Date.now()

    if (start) {
      const duration = end - start
      this.measures.push({
        name,
        startMark,
        endMark: endMark || 'now',
        duration,
        timestamp: Date.now()
      })
      return duration
    }

    return null
  }

  /**
   * 获取所有测量结果
   */
  getMeasures() {
    return this.measures
  }

  /**
   * 清除标记
   */
  clearMarks() {
    this.marks.clear()
  }

  /**
   * 清除测量结果
   */
  clearMeasures() {
    this.measures = []
  }

  /**
   * 生成性能报告
   */
  getReport() {
    const report = {}
    this.measures.forEach(measure => {
      report[measure.name] = measure.duration
    })
    return report
  }
}

/**
 * 图片懒加载管理器
 */
class LazyLoadManager {
  constructor(page, options = {}) {
    this.page = page
    this.options = {
      rootMargin: 50,
      placeholder: '/images/placeholder.png',
      ...options
    }
    this.observer = null
    this.loadedImages = new Set()
  }

  /**
   * 初始化懒加载
   */
  init(selector = '.lazy-image') {
    if (!this.page) return

    this.observer = this.page.createIntersectionObserver({
      thresholds: [0],
      observeAll: true
    }).relativeToViewport({ bottom: this.options.rootMargin })

    this.observer.observe(selector, (res) => {
      if (res.intersectionRatio > 0) {
        this.loadImage(res.id, res.dataset)
      }
    })
  }

  /**
   * 加载图片
   */
  loadImage(id, dataset) {
    const src = dataset.src
    if (!src || this.loadedImages.has(id)) return

    this.loadedImages.add(id)
    
    // 更新图片src
    const updateData = {}
    updateData[dataset.field || 'src'] = src
    
    if (this.page && this.page.setData) {
      this.page.setData(updateData)
    }
  }

  /**
   * 销毁观察器
   */
  destroy() {
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }
    this.loadedImages.clear()
  }
}

/**
 * 数据分页管理器
 */
class PaginationManager {
  constructor(options = {}) {
    const {
      pageSize = 20,
      initialPage = 1
    } = options

    this.pageSize = pageSize
    this.currentPage = initialPage
    this.allData = []
    this.hasMore = true
  }

  /**
   * 设置全部数据
   */
  setData(data) {
    this.allData = data
    this.currentPage = 1
    this.hasMore = data.length > this.pageSize
    return this.getCurrentPageData()
  }

  /**
   * 加载下一页
   */
  loadMore() {
    if (!this.hasMore) {
      return {
        data: [],
        hasMore: false,
        currentPage: this.currentPage
      }
    }

    this.currentPage++
    const pageData = this.getCurrentPageData()
    
    this.hasMore = this.currentPage * this.pageSize < this.allData.length

    return {
      data: pageData,
      hasMore: this.hasMore,
      currentPage: this.currentPage
    }
  }

  /**
   * 获取当前页数据
   */
  getCurrentPageData() {
    const start = (this.currentPage - 1) * this.pageSize
    const end = start + this.pageSize
    return this.allData.slice(start, end)
  }

  /**
   * 获取所有已加载数据
   */
  getLoadedData() {
    const end = this.currentPage * this.pageSize
    return this.allData.slice(0, end)
  }

  /**
   * 重置分页
   */
  reset() {
    this.currentPage = 1
    this.hasMore = this.allData.length > this.pageSize
  }
}

module.exports = {
  debounce,
  throttle,
  rafThrottle,
  BatchSetData,
  IntersectionObserverHelper,
  VirtualListManager,
  PerformanceMonitor,
  LazyLoadManager,
  PaginationManager
}

