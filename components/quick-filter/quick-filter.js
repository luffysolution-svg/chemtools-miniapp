/**
 * QuickFilter学术组件
 * 学术风格的快捷筛选按钮组
 * Version: 1.0.0
 */

Component({
  options: {
    styleIsolation: 'shared'
  },

  properties: {
    // 筛选项列表 [{label: '金属', value: 'metal', count: 10}]
    filters: {
      type: Array,
      value: []
    },
    // 选中的值（单选：String，多选：Array）
    selected: {
      type: null,
      value: null
    },
    // 筛选模式
    mode: {
      type: String,
      value: 'single' // 'single' | 'multiple'
    },
    // 标题
    title: {
      type: String,
      value: ''
    },
    // 显示数量
    showCount: {
      type: Boolean,
      value: false
    },
    // 显示清除按钮
    showClear: {
      type: Boolean,
      value: true
    }
  },

  data: {
    hasSelection: false
  },

  observers: {
    'selected': function(newVal) {
      this.updateHasSelection(newVal);
    }
  },

  methods: {
    /**
     * 判断是否选中
     */
    isSelected(value) {
      const { selected, mode } = this.properties;
      
      if (mode === 'multiple') {
        return Array.isArray(selected) && selected.includes(value);
      } else {
        return selected === value;
      }
    },

    /**
     * 切换筛选项
     */
    toggleFilter(e) {
      const value = e.currentTarget.dataset.value;
      const { selected, mode } = this.properties;
      
      let newSelected;
      
      if (mode === 'multiple') {
        // 多选模式
        const currentSelected = Array.isArray(selected) ? [...selected] : [];
        const index = currentSelected.indexOf(value);
        
        if (index > -1) {
          currentSelected.splice(index, 1);
        } else {
          currentSelected.push(value);
        }
        
        newSelected = currentSelected;
      } else {
        // 单选模式
        newSelected = selected === value ? null : value;
      }
      
      this.triggerEvent('change', { 
        value: newSelected,
        mode: mode
      });
    },

    /**
     * 清除所有选择
     */
    clearAll() {
      const newSelected = this.properties.mode === 'multiple' ? [] : null;
      this.triggerEvent('change', { 
        value: newSelected,
        mode: this.properties.mode
      });
      this.triggerEvent('clear');
    },

    /**
     * 更新是否有选择
     */
    updateHasSelection(selected) {
      let hasSelection = false;
      
      if (this.properties.mode === 'multiple') {
        hasSelection = Array.isArray(selected) && selected.length > 0;
      } else {
        hasSelection = selected !== null && selected !== undefined && selected !== '';
      }
      
      this.setData({ hasSelection });
    }
  }
});

