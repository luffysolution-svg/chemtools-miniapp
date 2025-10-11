/**
 * 骨架屏组件
 */

Component({
  properties: {
    // 骨架屏类型: card, list, tool, table
    type: {
      type: String,
      value: 'card'
    },
    // 显示的行数
    rows: {
      type: Number,
      value: 3
    },
    // 是否显示
    loading: {
      type: Boolean,
      value: true
    }
  },

  data: {
    
  },

  methods: {
    
  }
});

