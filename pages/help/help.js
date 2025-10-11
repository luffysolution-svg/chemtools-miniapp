// pages/help/help.js
const xrdUtil = require('../../utils/xrd');
const electrochemUtil = require('../../utils/electrochem');
const kspUtil = require('../../utils/ksp');
const conversionsUtil = require('../../utils/conversions');
const semiconductorsUtil = require('../../utils/semiconductors');
const periodicUtil = require('../../utils/periodic');

Page({
  data: {
    activeTab: 0,
    expandedFaq: null,
    
    // 功能模块
    modules: [
      {
        id: 1,
        icon: '🔄',
        name: '单位转换',
        desc: '支持长度、质量、体积、能量、浓度等多种单位的转换，覆盖常用科研单位'
      },
      {
        id: 2,
        icon: '⚗️',
        name: '溶液配制',
        desc: '计算溶液稀释、浓度转换、pH计算等，适用于实验室日常配制'
      },
      {
        id: 3,
        icon: '📐',
        name: 'XRD分析',
        desc: '布拉格方程计算、晶面间距、不同晶系的d值计算，支持Cu Kα等多种射线源'
      },
      {
        id: 4,
        icon: '⚡',
        name: '电化学计算',
        desc: '参比电极转换、能斯特方程、电势计算，包含常用参比电极数据'
      },
      {
        id: 5,
        icon: '💧',
        name: '溶度积计算',
        desc: '难溶盐溶解度、沉淀平衡、离子浓度计算，考虑活度系数修正'
      },
      {
        id: 6,
        icon: '🔬',
        name: '材料数据库',
        desc: '半导体材料、元素周期表数据，包含带隙、晶体结构等关键参数'
      }
    ],
    
    // 使用技巧
    tips: [
      '计算结果会显示适用范围和精度，注意查看警告信息',
      '所有计算都会保存在历史记录中，可以随时查看',
      '长按计算结果可以快速复制或分享',
      '收藏常用工具，可在"我的"页面快速访问',
      '使用搜索功能快速定位所需工具',
      '在材料数据库中可以按带隙、应用等筛选材料',
      'XRD计算支持多种射线源，注意选择正确的波长',
      '电化学计算中温度和pH会显著影响结果',
      '历史记录支持按类别、时间等多种方式筛选',
      '导出功能支持文本、Markdown、CSV、JSON等多种格式'
    ],
    
    // 数据来源
    dataSources: [],
    
    // 数据质量
    dataQuality: [
      {
        level: 'high',
        levelText: '高精度',
        title: '基础物理化学常数',
        description: '来自CODATA 2018推荐值，如气体常数R、法拉第常数F等，精度可达6位以上有效数字'
      },
      {
        level: 'medium',
        levelText: '中等精度',
        title: '标准参考数据',
        description: '来自NIST、CRC手册等权威来源，如元素性质、常见化合物数据，精度通常为3-5位有效数字'
      },
      {
        level: 'reference',
        levelText: '参考级',
        title: '文献数据',
        description: '来自科研文献的实验数据，如部分材料性质、溶度积等，精度依赖于原始文献，建议交叉验证'
      }
    ],
    
    // 常见问题
    faqs: [
      {
        question: '计算结果的精度如何？',
        answer: '不同模块的精度不同。基础物理化学常数采用CODATA 2018推荐值，精度最高；标准参考数据来自NIST等权威来源；文献数据会标注原始来源。具体精度会在计算结果中标明。'
      },
      {
        question: '为什么有些计算会显示警告？',
        answer: '警告通常出现在参数接近或超出适用范围时，例如XRD计算中角度过小、温度超出常规范围等。这并不意味着结果错误，但建议您谨慎使用并进行实验验证。'
      },
      {
        question: '历史记录会保存多久？',
        answer: '历史记录保存在本地设备上，除非您主动清除或卸载小程序，否则会一直保留。数据不会上传到服务器，保护您的隐私。'
      },
      {
        question: 'XRD计算为什么需要选择射线源？',
        answer: '不同射线源的波长不同，会直接影响布拉格方程的计算结果。Cu Kα是最常用的实验室X射线源(λ=1.5406Å)，我们还提供了Mo Kα、Co Kα等其他常用射线源。'
      },
      {
        question: '电化学计算中的参比电极如何选择？',
        answer: '根据您的实验体系选择：水溶液体系常用Ag/AgCl或SCE；非水体系常用Fc/Fc⁺。工具支持多种参比电极与NHE或RHE之间的转换。'
      },
      {
        question: '溶度积计算考虑了活度系数吗？',
        answer: '是的。工具提供了Debye-Hückel和Davies方程两种活度系数计算模型，可根据离子强度进行选择。低离子强度(I<0.1M)使用Debye-Hückel，高离子强度使用Davies方程更准确。'
      },
      {
        question: '如何导出计算结果？',
        answer: '点击计算结果区域的导出按钮，可以选择复制到剪贴板、保存为文件或分享给好友。支持纯文本、Markdown、CSV、JSON等多种格式。'
      },
      {
        question: '发现数据错误应该怎么办？',
        answer: '非常感谢您的反馈！请通过"反馈与建议"功能告诉我们，包括错误的数据、正确的值以及参考来源。我们会尽快核实并更新。'
      },
      {
        question: '可以离线使用吗？',
        answer: '可以！所有计算功能和数据库都内置在小程序中，不需要网络连接即可使用。只有在分享或反馈功能时需要联网。'
      },
      {
        question: '未来会添加哪些功能？',
        answer: '我们计划添加更多材料数据、光谱分析工具、化学反应平衡计算等功能。也欢迎您提出建议，帮助我们改进工具。'
      }
    ]
  },

  onLoad(options) {
    // 加载各模块的元数据
    this.loadDataSources();
    
    // 如果通过参数指定了标签页，则切换到对应标签
    if (options.tab) {
      this.setData({ activeTab: parseInt(options.tab) || 0 });
    }
  },

  /**
   * 转换 sources 对象为引用数组
   */
  convertSourcesToReferences(sourcesObj) {
    if (!sourcesObj) return [];
    
    const references = [];
    
    // 如果已经是数组，直接处理
    if (Array.isArray(sourcesObj)) {
      sourcesObj.forEach((source, index) => {
        references.push({
          label: `[${index + 1}]`,
          text: source
        });
      });
      return references;
    }
    
    // 如果是对象，遍历处理
    let index = 1;
    Object.entries(sourcesObj).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // 如果值是数组，展开数组
        value.forEach(item => {
          references.push({
            label: `[${index}]`,
            text: `${item}`
          });
          index++;
        });
      } else {
        // 如果值是字符串或其他类型
        references.push({
          label: `[${index}]`,
          text: `${value}`
        });
        index++;
      }
    });
    
    return references;
  },

  /**
   * 加载数据来源信息
   */
  loadDataSources() {
    const sources = [];
    
    // XRD 数据来源
    try {
      const xrdMetadata = xrdUtil.getMetadata();
      sources.push({
        id: 'xrd',
        icon: '📐',
        title: 'XRD计算',
        description: 'X射线衍射分析中的布拉格方程和晶面间距计算',
        version: xrdMetadata.version,
        lastUpdated: xrdMetadata.lastUpdated,
        references: this.convertSourcesToReferences(xrdMetadata.sources)
      });
    } catch (e) {
      console.error('XRD metadata error:', e);
    }
    
    // 电化学数据来源
    try {
      const electrochemMetadata = electrochemUtil.getMetadata();
      sources.push({
        id: 'electrochem',
        icon: '⚡',
        title: '电化学计算',
        description: '参比电极电势、能斯特方程等电化学计算',
        version: electrochemMetadata.version,
        lastUpdated: electrochemMetadata.lastUpdated,
        references: this.convertSourcesToReferences(electrochemMetadata.sources)
      });
    } catch (e) {
      console.error('Electrochem metadata error:', e);
    }
    
    // Ksp 数据来源
    try {
      const kspMetadata = kspUtil.getMetadata();
      sources.push({
        id: 'ksp',
        icon: '💧',
        title: '溶度积计算',
        description: '难溶盐的溶解平衡、活度系数修正',
        version: kspMetadata.version,
        lastUpdated: kspMetadata.lastUpdated,
        references: this.convertSourcesToReferences(kspMetadata.sources)
      });
    } catch (e) {
      console.error('Ksp metadata error:', e);
    }
    
    // 单位转换数据来源
    try {
      const conversionsMetadata = conversionsUtil.getMetadata();
      sources.push({
        id: 'conversions',
        icon: '🔄',
        title: '单位转换',
        description: '基于SI国际单位制的各类单位转换',
        version: conversionsMetadata.version,
        lastUpdated: conversionsMetadata.lastUpdated,
        references: this.convertSourcesToReferences(conversionsMetadata.sources)
      });
    } catch (e) {
      console.error('Conversions metadata error:', e);
    }
    
    // 半导体材料数据来源
    try {
      const semiconductorsMetadata = semiconductorsUtil.getMetadata();
      sources.push({
        id: 'semiconductors',
        icon: '💎',
        title: '半导体材料数据库',
        description: '常见半导体材料的带隙、晶体结构等性质',
        version: semiconductorsMetadata.version,
        lastUpdated: semiconductorsMetadata.lastUpdated,
        references: this.convertSourcesToReferences(semiconductorsMetadata.sources)
      });
    } catch (e) {
      console.error('Semiconductors metadata error:', e);
    }
    
    // 元素周期表数据来源
    try {
      const periodicMetadata = periodicUtil.getMetadata();
      sources.push({
        id: 'periodic',
        icon: '⚛️',
        title: '元素周期表',
        description: '118种化学元素的基本性质与数据',
        version: periodicMetadata.version,
        lastUpdated: periodicMetadata.lastUpdated,
        references: this.convertSourcesToReferences(periodicMetadata.sources)
      });
    } catch (e) {
      console.error('Periodic metadata error:', e);
    }
    
    this.setData({ dataSources: sources });
  },

  /**
   * 切换标签页
   */
  switchTab(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({ 
      activeTab: index,
      expandedFaq: null // 切换标签时收起FAQ
    });
  },

  /**
   * 展开/收起FAQ
   */
  toggleFaq(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      expandedFaq: this.data.expandedFaq === index ? null : index
    });
  },

  /**
   * 打开反馈
   */
  openFeedback() {
    wx.showModal({
      title: '反馈功能',
      content: '感谢您的支持！当前版本暂未集成反馈系统，您可以通过小程序的"意见反馈"功能提交问题或建议。',
      showCancel: false,
      confirmText: '知道了'
    });
  },

  /**
   * 返回首页
   */
  goHome() {
    wx.switchTab({
      url: '/pages/home/home'
    });
  },

  /**
   * 分享配置
   */
  onShareAppMessage() {
    return {
      title: '化学计算工具 - 使用帮助',
      path: '/pages/help/help',
      imageUrl: ''
    };
  },

  /**
   * 分享到朋友圈
   */
  onShareTimeline() {
    return {
      title: '化学计算工具 - 科研必备',
      query: '',
      imageUrl: ''
    };
  }
});

