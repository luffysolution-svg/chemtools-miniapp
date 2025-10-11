/**
 * 工具卡片组件
 * 用于首页功能导航
 */
Component({
  options: {
    styleIsolation: 'shared'
  },

  properties: {
    // 图标
    icon: {
      type: String,
      value: '🔧'
    },
    // 标题
    title: {
      type: String,
      value: ''
    },
    // 描述
    description: {
      type: String,
      value: ''
    },
    // 卡片大小
    size: {
      type: String,
      value: 'normal' // normal, large, small
    },
    // 是否显示箭头
    showArrow: {
      type: Boolean,
      value: true
    },
    // 徽章文字
    badge: {
      type: String,
      value: ''
    },
    // 跳转路径
    path: {
      type: String,
      value: ''
    }
  },

  methods: {
    handleTap() {
      const { path } = this.properties;
      
      if (path) {
        wx.navigateTo({
          url: path,
          fail: () => {
            wx.switchTab({
              url: path
            });
          }
        });
      }
      
      this.triggerEvent('tap', { path });
    }
  }
});

