/**
 * SearchInput学术组件
 * 学术风格的搜索输入框，支持历史记录、热门搜索、智能建议
 * Version: 1.0.0
 */

const { inputHistoryService } = require('../../services/inputHistory');

Component({
  options: {
    styleIsolation: 'shared'
  },

  properties: {
    // 输入值
    value: {
      type: String,
      value: ''
    },
    // 占位符
    placeholder: {
      type: String,
      value: '搜索...'
    },
    // 最大长度
    maxlength: {
      type: Number,
      value: 100
    },
    // 启用历史记录
    enableHistory: {
      type: Boolean,
      value: true
    },
    // 历史记录标识
    historyKey: {
      type: String,
      value: 'search'
    },
    // 热门搜索列表
    hotSearches: {
      type: Array,
      value: []
    },
    // 搜索建议列表
    suggestions: {
      type: Array,
      value: []
    },
    // 显示热门搜索
    showHot: {
      type: Boolean,
      value: false
    }
  },

  data: {
    focused: false,
    showHistory: false,
    showHotSearches: false,
    showSuggestions: false,
    historyList: []
  },

  lifetimes: {
    attached() {
      this.loadHistory();
    }
  },

  methods: {
    /**
     * 输入处理
     */
    handleInput(e) {
      const value = e.detail.value;
      this.triggerEvent('input', { value });
      
      // 显示搜索建议
      if (value && this.properties.suggestions.length > 0) {
        this.showSuggestionsDropdown(value);
      } else {
        this.setData({ showSuggestions: false });
      }
    },

    /**
     * 聚焦处理
     */
    handleFocus(e) {
      this.setData({ 
        focused: true,
        showHotSearches: this.properties.showHot && !this.properties.value
      });
      this.triggerEvent('focus', { value: e.detail.value });
    },

    /**
     * 失焦处理
     */
    handleBlur(e) {
      setTimeout(() => {
        this.setData({ 
          focused: false,
          showHistory: false,
          showHotSearches: false,
          showSuggestions: false
        });
      }, 200);
      
      // 保存到历史记录
      const value = e.detail.value;
      if (this.properties.enableHistory && value && value.trim()) {
        inputHistoryService.addHistory(this.properties.historyKey, value.trim());
        this.loadHistory();
      }
      
      this.triggerEvent('blur', { value });
    },

    /**
     * 确认搜索
     */
    handleConfirm(e) {
      const value = e.detail.value;
      if (value && value.trim()) {
        // 保存到历史
        if (this.properties.enableHistory) {
          inputHistoryService.addHistory(this.properties.historyKey, value.trim());
          this.loadHistory();
        }
        this.triggerEvent('search', { value: value.trim() });
      }
    },

    /**
     * 清除输入
     */
    clearInput() {
      this.triggerEvent('input', { value: '' });
      this.triggerEvent('clear');
      this.setData({ showSuggestions: false });
    },

    /**
     * 切换历史记录显示
     */
    toggleHistory() {
      this.setData({ 
        showHistory: !this.data.showHistory,
        showHotSearches: false,
        showSuggestions: false
      });
    },

    /**
     * 加载历史记录
     */
    loadHistory() {
      if (!this.properties.enableHistory) return;
      
      const history = inputHistoryService.getHistory(this.properties.historyKey);
      this.setData({ historyList: history });
    },

    /**
     * 选择历史记录
     */
    selectHistory(e) {
      const value = e.currentTarget.dataset.value;
      this.setData({ 
        showHistory: false 
      });
      this.triggerEvent('input', { value });
      this.triggerEvent('search', { value });
    },

    /**
     * 清除历史记录
     */
    clearHistory() {
      if (!this.properties.historyKey) return;
      
      inputHistoryService.clearHistory(this.properties.historyKey);
      this.setData({ 
        historyList: [],
        showHistory: false
      });
      
      wx.showToast({
        title: '历史已清除',
        icon: 'success',
        duration: 1500
      });
    },

    /**
     * 选择热门搜索
     */
    selectHot(e) {
      const value = e.currentTarget.dataset.value;
      this.setData({ showHotSearches: false });
      this.triggerEvent('input', { value });
      this.triggerEvent('search', { value });
    },

    /**
     * 显示搜索建议
     */
    showSuggestionsDropdown(input) {
      if (!input || this.properties.suggestions.length === 0) {
        this.setData({ showSuggestions: false });
        return;
      }
      
      const filtered = this.properties.suggestions.filter(item => 
        item.toLowerCase().includes(input.toLowerCase())
      );
      
      this.setData({ 
        showSuggestions: filtered.length > 0,
        suggestions: filtered.slice(0, 8)
      });
    },

    /**
     * 选择建议
     */
    selectSuggestion(e) {
      const value = e.currentTarget.dataset.value;
      this.setData({ showSuggestions: false });
      this.triggerEvent('input', { value });
      this.triggerEvent('search', { value });
    }
  }
});

