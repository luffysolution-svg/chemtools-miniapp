/**
 * 分享卡片生成页面 v6.0.0
 */

const { shareCardGenerator } = require('../../../utils/shareCardGenerator');
const { getTemplateList } = require('../../../utils/shareCardTemplates');

Page({
  data: {
    // 卡片数据
    cardData: null,
    
    // 模板列表
    templates: [],
    templateNames: [],
    currentTemplateIndex: 1, // 默认精美版
    
    // 生成状态
    generating: false,
    generated: false,
    imagePath: '',
    
    // Canvas尺寸
    canvasWidth: 350,
    canvasHeight: 500
  },

  onLoad(options) {
    // 获取传入的数据
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('shareData', (data) => {
      this.setData({ cardData: data });
      
      // 自动生成卡片
      setTimeout(() => {
        this.generateCard();
      }, 500);
    });

    // 初始化模板列表
    const templates = getTemplateList();
    const templateNames = templates.map(t => t.displayName);
    
    this.setData({
      templates,
      templateNames
    });
  },

  /**
   * 模板切换
   */
  handleTemplateChange(e) {
    const index = Number(e.detail.value);
    this.setData({ 
      currentTemplateIndex: index,
      generated: false 
    });
    
    // 重新生成卡片
    this.generateCard();
  },

  /**
   * 生成卡片
   */
  async generateCard() {
    const { cardData, templates, currentTemplateIndex } = this.data;
    
    if (!cardData) {
      wx.showToast({
        title: '缺少数据',
        icon: 'none'
      });
      return;
    }

    this.setData({ generating: true });

    try {
      const template = templates[currentTemplateIndex];
      
      // 生成卡片
      await shareCardGenerator.generateCard(
        cardData,
        template.name,
        'shareCanvas',
        this
      );

      this.setData({ 
        generating: false,
        generated: true 
      });

      wx.showToast({
        title: '生成成功',
        icon: 'success',
        duration: 1500
      });

    } catch (e) {
      this.setData({ generating: false });
      
      wx.showToast({
        title: '生成失败: ' + (e.message || '未知错误'),
        icon: 'none'
      });
    }
  },

  /**
   * 保存到相册
   */
  async saveToAlbum() {
    const { generated } = this.data;
    
    if (!generated) {
      wx.showToast({
        title: '请先生成卡片',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({ title: '保存中...' });

    try {
      // 转换为图片
      const imagePath = await shareCardGenerator.saveToImage('shareCanvas', this);
      
      // 保存到相册
      await shareCardGenerator.saveToAlbum(imagePath);
      
      wx.hideLoading();
      
      // 记录分享统计
      this.recordShare('album');
      
    } catch (e) {
      wx.hideLoading();
      wx.showToast({
        title: '保存失败',
        icon: 'none'
      });
    }
  },

  /**
   * 分享到好友
   */
  async shareToFriend() {
    const { generated } = this.data;
    
    if (!generated) {
      wx.showToast({
        title: '请先生成卡片',
        icon: 'none'
      });
      return;
    }

    try {
      // 转换为图片
      const imagePath = await shareCardGenerator.saveToImage('shareCanvas', this);
      
      this.setData({ imagePath });
      
      wx.showToast({
        title: '长按卡片分享',
        icon: 'none',
        duration: 2000
      });
      
      // 记录分享统计
      this.recordShare('friend');
      
    } catch (e) {
      wx.showToast({
        title: '操作失败',
        icon: 'none'
      });
    }
  },

  /**
   * 记录分享统计
   */
  recordShare(channel) {
    try {
      const app = getApp();
      const statisticsService = app.getStatisticsService?.();
      
      if (statisticsService && this.data.cardData) {
        statisticsService.recordShare({
          tool: this.data.cardData.toolName || 'unknown',
          channel: channel,
          template: this.data.templates[this.data.currentTemplateIndex].name
        });
      }
    } catch (e) {
      // 静默处理统计错误
    }
  },

  /**
   * 返回
   */
  goBack() {
    wx.navigateBack();
  },

  /**
   * 分享配置
   */
  onShareAppMessage() {
    const { imagePath, cardData } = this.data;
    
    if (imagePath) {
      return {
        title: cardData?.title || '分享我的计算结果',
        imageUrl: imagePath,
        path: '/pages/home/home'
      };
    }
    
    return {
      title: '材料化学科研工具箱',
      path: '/pages/home/home'
    };
  },

  /**
   * 分享到朋友圈
   */
  onShareTimeline() {
    const { imagePath, cardData } = this.data;
    
    return {
      title: cardData?.title || '材料化学科研工具箱',
      imageUrl: imagePath || '',
      query: ''
    };
  }
});

