/**
 * 通用计算器输入组件（增强版）
 * 支持数字、文本输入，带验证、提示、历史记录、预设值、实时计算和自动补全
 * Version: 2.0.0
 */

const { inputHistoryService } = require('../../services/inputHistory');
const { getPresets } = require('../../utils/input-presets');

Component({
  options: {
    styleIsolation: 'shared'
  },

  properties: {
    // ===== 基础属性 =====
    value: {
      type: String,
      value: ''
    },
    label: {
      type: String,
      value: ''
    },
    type: {
      type: String,
      value: 'text' // text, digit, number
    },
    placeholder: {
      type: String,
      value: '请输入'
    },
    unit: {
      type: String,
      value: ''
    },
    icon: {
      type: String,
      value: ''
    },
    error: {
      type: String,
      value: ''
    },
    hint: {
      type: String,
      value: ''
    },
    disabled: {
      type: Boolean,
      value: false
    },
    maxlength: {
      type: Number,
      value: 140
    },
    validator: {
      type: String,
      value: '' // 'number', 'positive', 'integer', 'formula', 'custom'
    },
    customValidator: {
      type: String,
      value: ''
    },
    
    // ===== 增强属性 =====
    // 启用历史记录
    enableHistory: {
      type: Boolean,
      value: false
    },
    // 历史记录工具类型
    historyTool: {
      type: String,
      value: ''
    },
    // 历史记录字段名
    historyField: {
      type: String,
      value: 'default'
    },
    // 预设值数组
    presets: {
      type: Array,
      value: []
    },
    // 实时计算模式
    realtime: {
      type: Boolean,
      value: false
    },
    // 实时计算延迟（毫秒）
    realtimeDelay: {
      type: Number,
      value: 500
    },
    // 自动补全建议
    suggestions: {
      type: Array,
      value: []
    },
    // 触摸区域大小
    touchArea: {
      type: String,
      value: 'normal' // 'normal' | 'large'
    }
  },

  data: {
    focused: false,
    showHistory: false,
    historyList: [],
    showSuggestions: false,
    realtimeTimer: null
  },

  lifetimes: {
    attached() {
      // 加载历史记录
      if (this.properties.enableHistory && this.properties.historyTool) {
        this.loadHistory();
      }
    },
    
    detached() {
      // 清理定时器
      if (this.data.realtimeTimer) {
        clearTimeout(this.data.realtimeTimer);
      }
    }
  },

  methods: {
    handleInput(e) {
      const value = e.detail.value;
      
      // 触发输入事件
      this.triggerEvent('input', { value });
      
      // 实时验证
      if (this.properties.validator) {
        const error = this.validate(value);
        this.triggerEvent('validate', { value, error });
      }
      
      // 实时计算
      if (this.properties.realtime && value) {
        this.triggerRealtimeCalculate(value);
      }
      
      // 显示自动补全建议
      if (this.properties.suggestions.length > 0) {
        this.showSuggestionsDropdown(value);
      }
    },

    handleBlur(e) {
      const value = e.detail.value;
      
      // 延迟隐藏下拉框，以便点击事件能触发
      setTimeout(() => {
        this.setData({ 
          focused: false,
          showHistory: false,
          showSuggestions: false
        });
      }, 200);
      
      // 保存到历史记录
      if (this.properties.enableHistory && value && this.properties.historyTool) {
        inputHistoryService.addHistory(
          this.properties.historyTool,
          value,
          this.properties.historyField
        );
        this.loadHistory();
      }
      
      // 失焦验证
      if (this.properties.validator) {
        const error = this.validate(value);
        this.triggerEvent('blur', { value, error });
      } else {
        this.triggerEvent('blur', { value });
      }
    },

    handleFocus(e) {
      this.setData({ focused: true });
      this.triggerEvent('focus', { value: e.detail.value });
    },

    handleIconTap() {
      this.triggerEvent('icontap');
    },

    /**
     * 切换历史记录显示
     */
    toggleHistory() {
      if (!this.properties.enableHistory) return;
      
      this.setData({ 
        showHistory: !this.data.showHistory,
        showSuggestions: false
      });
    },

    /**
     * 加载历史记录
     */
    loadHistory() {
      if (!this.properties.historyTool) return;
      
      const history = inputHistoryService.getHistory(
        this.properties.historyTool,
        this.properties.historyField
      );
      
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
      this.triggerEvent('change', { value });
    },

    /**
     * 清除历史记录
     */
    clearHistoryList() {
      if (!this.properties.historyTool) return;
      
      inputHistoryService.clearHistory(
        this.properties.historyTool,
        this.properties.historyField
      );
      
      this.setData({ 
        historyList: [],
        showHistory: false
      });
      
      wx.showToast({
        title: '已清除历史',
        icon: 'success',
        duration: 1500
      });
    },

    /**
     * 选择预设值
     */
    selectPreset(e) {
      const value = e.currentTarget.dataset.value;
      this.triggerEvent('input', { value });
      this.triggerEvent('change', { value });
      
      // 如果启用实时计算，触发计算
      if (this.properties.realtime) {
        this.triggerRealtimeCalculate(value);
      }
    },

    /**
     * 显示自动补全建议
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
        suggestions: filtered.slice(0, 5)
      });
    },

    /**
     * 选择建议
     */
    selectSuggestion(e) {
      const value = e.currentTarget.dataset.value;
      this.setData({ showSuggestions: false });
      this.triggerEvent('input', { value });
      this.triggerEvent('change', { value });
    },

    /**
     * 触发实时计算
     */
    triggerRealtimeCalculate(value) {
      // 清除之前的定时器
      if (this.data.realtimeTimer) {
        clearTimeout(this.data.realtimeTimer);
      }
      
      // 设置新的定时器（防抖）
      const timer = setTimeout(() => {
        this.triggerEvent('realtimecalculate', { value });
      }, this.properties.realtimeDelay);
      
      this.setData({ realtimeTimer: timer });
    },

    /**
     * 验证输入值
     * @param {string} value - 输入值
     * @returns {string} 错误信息，无错误返回空字符串
     */
    validate(value) {
      const { validator, customValidator } = this.properties;
      
      if (!value) {
        return '';
      }

      switch (validator) {
        case 'number':
          if (isNaN(Number(value))) {
            return '请输入有效的数字';
          }
          break;
          
        case 'positive':
          if (isNaN(Number(value)) || Number(value) <= 0) {
            return '请输入大于0的数字';
          }
          break;
          
        case 'integer':
          if (isNaN(Number(value)) || !Number.isInteger(Number(value))) {
            return '请输入整数';
          }
          break;
          
        case 'formula':
          // 化学式验证：基本检查是否包含大写字母开头
          if (!/^[A-Z]/.test(value)) {
            return '化学式应以大写字母开头';
          }
          break;
          
        case 'custom':
          // 自定义验证需要页面实现
          if (customValidator) {
            const page = getCurrentPages()[getCurrentPages().length - 1];
            if (page && typeof page[customValidator] === 'function') {
              return page[customValidator](value);
            }
          }
          break;
      }
      
      return '';
    }
  }
});

