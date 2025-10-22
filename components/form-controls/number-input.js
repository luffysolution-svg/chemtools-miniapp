/**
 * 数字输入框组件（带单位选择）
 */

Component({
  properties: {
    label: {
      type: String,
      value: ''
    },
    value: {
      type: [String, Number],
      value: ''
    },
    placeholder: {
      type: String,
      value: '请输入数字'
    },
    units: {
      type: Array,
      value: []
    },
    currentUnit: {
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
    min: {
      type: Number,
      value: null
    },
    max: {
      type: Number,
      value: null
    },
    precision: {
      type: Number,
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
    errorMessage: '',
    unitIndex: 0
  },

  lifetimes: {
    attached() {
      // 初始化单位索引
      if (this.data.units.length > 0 && this.data.currentUnit) {
        const index = this.data.units.indexOf(this.data.currentUnit)
        if (index >= 0) {
          this.setData({ unitIndex: index })
        }
      }
    }
  },

  methods: {
    /**
     * 输入事件
     */
    handleInput(e) {
      let value = e.detail.value

      // 触发change事件
      this.triggerEvent('change', { 
        value,
        unit: this.data.currentUnit || this.data.units[0]
      })

      // 实时验证
      this.validate(value)
    },

    /**
     * 失焦事件
     */
    handleBlur(e) {
      const value = e.detail.value
      this.triggerEvent('blur', { 
        value,
        unit: this.data.currentUnit || this.data.units[0]
      })
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
      this.triggerEvent('confirm', { 
        value,
        unit: this.data.currentUnit || this.data.units[0]
      })
    },

    /**
     * 显示单位选择器
     */
    showUnitPicker() {
      if (this.data.disabled) return
      
      wx.showActionSheet({
        itemList: this.data.units,
        success: (res) => {
          this.handleUnitChange({ detail: { value: res.tapIndex } })
        }
      })
    },

    /**
     * 单位改变
     */
    handleUnitChange(e) {
      const index = e.detail.value
      const unit = this.data.units[index]
      
      this.setData({
        unitIndex: index,
        currentUnit: unit
      })

      this.triggerEvent('unitChange', { 
        unit,
        value: this.data.value
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

      // 数字格式验证
      const num = parseFloat(value)
      if (value && isNaN(num)) {
        this.setData({
          error: true,
          errorMessage: '请输入有效的数字'
        })
        return false
      }

      // 范围验证
      if (this.data.min !== null && num < this.data.min) {
        this.setData({
          error: true,
          errorMessage: `数值不能小于${this.data.min}`
        })
        return false
      }

      if (this.data.max !== null && num > this.data.max) {
        this.setData({
          error: true,
          errorMessage: `数值不能大于${this.data.max}`
        })
        return false
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

