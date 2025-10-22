/**
 * 标准输入框组件
 * 
 * @properties
 * - label: 输入框标签
 * - value: 输入值
 * - type: 输入类型（text/number/digit/idcard）
 * - placeholder: 占位符
 * - unit: 单位
 * - required: 是否必填
 * - disabled: 是否禁用
 * - clearable: 是否显示清除按钮
 * - maxlength: 最大长度
 * - validator: 验证函数
 * - hint: 提示文本
 * - focus: 是否自动聚焦
 * 
 * @events
 * - change: 值改变事件
 * - blur: 失去焦点事件
 * - focus: 获得焦点事件
 * - confirm: 确认事件
 */

Component({
  options: {
    multipleSlots: true
  },

  properties: {
    label: {
      type: String,
      value: ''
    },
    value: {
      type: String,
      value: ''
    },
    type: {
      type: String,
      value: 'text'
    },
    placeholder: {
      type: String,
      value: '请输入'
    },
    unit: {
      type: String,
      value: ''
    },
    required: {
      type: Boolean,
      value: false
    },
    disabled: {
      type: Boolean,
      value: false
    },
    clearable: {
      type: Boolean,
      value: true
    },
    maxlength: {
      type: Number,
      value: 140
    },
    validator: {
      type: Function,
      value: null
    },
    hint: {
      type: String,
      value: ''
    },
    focus: {
      type: Boolean,
      value: false
    }
  },

  data: {
    error: false,
    errorMessage: ''
  },

  methods: {
    /**
     * 输入事件
     */
    handleInput(e) {
      const value = e.detail.value
      
      // 触发change事件
      this.triggerEvent('change', { value })

      // 实时验证（可选）
      if (this.data.validator) {
        this.validate(value)
      }
    },

    /**
     * 失焦事件
     */
    handleBlur(e) {
      const value = e.detail.value

      // 触发blur事件
      this.triggerEvent('blur', { value })

      // 失焦时验证
      this.validate(value)
    },

    /**
     * 聚焦事件
     */
    handleFocus(e) {
      this.triggerEvent('focus', { value: e.detail.value })
    },

    /**
     * 确认事件
     */
    handleConfirm(e) {
      const value = e.detail.value
      this.triggerEvent('confirm', { value })
    },

    /**
     * 清除输入
     */
    handleClear() {
      this.triggerEvent('change', { value: '' })
      this.setData({
        error: false,
        errorMessage: ''
      })
    },

    /**
     * 验证输入
     */
    validate(value) {
      // 必填验证
      if (this.data.required && !value) {
        this.setData({
          error: true,
          errorMessage: '此项为必填项'
        })
        return false
      }

      // 自定义验证
      if (this.data.validator) {
        const result = this.data.validator(value)
        if (result !== true) {
          this.setData({
            error: true,
            errorMessage: result || '输入格式不正确'
          })
          return false
        }
      }

      // 验证通过
      this.setData({
        error: false,
        errorMessage: ''
      })
      return true
    }
  }
})

