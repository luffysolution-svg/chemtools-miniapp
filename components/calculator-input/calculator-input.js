/**
 * 通用计算器输入组件
 * 支持数字、文本输入，带验证和提示
 */
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
    // 标签
    label: {
      type: String,
      value: ''
    },
    // 输入类型
    type: {
      type: String,
      value: 'text' // text, digit, number
    },
    // 占位符
    placeholder: {
      type: String,
      value: '请输入'
    },
    // 单位
    unit: {
      type: String,
      value: ''
    },
    // 图标
    icon: {
      type: String,
      value: ''
    },
    // 错误信息
    error: {
      type: String,
      value: ''
    },
    // 提示信息
    hint: {
      type: String,
      value: ''
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      value: false
    },
    // 最大长度
    maxlength: {
      type: Number,
      value: 140
    },
    // 验证规则
    validator: {
      type: String,
      value: '' // 'number', 'positive', 'integer', 'formula', 'custom'
    },
    // 自定义验证函数名（需要在页面中定义）
    customValidator: {
      type: String,
      value: ''
    }
  },

  data: {
    focused: false
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
    },

    handleBlur(e) {
      this.setData({ focused: false });
      const value = e.detail.value;
      
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

