/**
 * DataCard学术组件
 * 学术风格的数据展示卡片
 * Version: 1.0.0
 */

Component({
  options: {
    styleIsolation: 'shared',
    multipleSlots: true
  },

  properties: {
    // 标题
    title: {
      type: String,
      value: ''
    },
    // 副标题
    subtitle: {
      type: String,
      value: ''
    },
    // 图标
    icon: {
      type: String,
      value: ''
    },
    // 徽章文字
    badge: {
      type: String,
      value: ''
    },
    // 徽章类型
    badgeType: {
      type: String,
      value: 'default' // 'default' | 'success' | 'warning' | 'danger' | 'info'
    },
    // 显示徽章
    showBadge: {
      type: Boolean,
      value: false
    },
    // 显示底部
    showFooter: {
      type: Boolean,
      value: false
    },
    // 左侧指示条
    indicator: {
      type: Boolean,
      value: false
    },
    // 指示条类型
    indicatorType: {
      type: String,
      value: 'primary' // 'primary' | 'success' | 'warning' | 'danger' | 'info'
    },
    // 卡片额外类名
    cardClass: {
      type: String,
      value: ''
    },
    // 是否可点击
    clickable: {
      type: Boolean,
      value: true
    }
  },

  methods: {
    /**
     * 点击处理
     */
    handleTap(e) {
      if (this.properties.clickable) {
        this.triggerEvent('tap', {});
      }
    },

    /**
     * 长按处理
     */
    handleLongPress(e) {
      this.triggerEvent('longpress', {});
    }
  }
});

