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
      '计算结果下方会显示适用范围和精度说明，记得看一下警告信息',
      '所有计算都会自动保存到历史记录，不用担心丢失',
      '长按计算结果可以快速复制，很方便',
      '常用的工具可以收藏，下次直接在首页找到',
      '不知道工具在哪？用搜索功能试试',
      '材料数据库可以按带隙、应用类型筛选，很好用',
      'XRD计算记得选对射线源，不同射线源波长不一样',
      '电化学计算中温度和pH对结果影响很大，注意检查',
      '历史记录太多？可以按类别和时间筛选',
      '结果可以导出为多种格式，写论文的时候挺方便'
    ],
    
    // 数据来源
    dataSources: [],
    
    // 数据质量
    dataQuality: [
      {
        level: 'high',
        levelText: '高精度',
        title: '基础物理化学常数',
        description: '这些数据来自CODATA 2018推荐值，比如气体常数R、法拉第常数F等，精度很高（6位以上有效数字）'
      },
      {
        level: 'medium',
        levelText: '中等精度',
        title: '标准参考数据',
        description: '来自NIST、CRC手册这些权威来源，像元素性质、常见化合物数据，精度一般在3-5位有效数字'
      },
      {
        level: 'reference',
        levelText: '参考级',
        title: '文献数据',
        description: '从科研文献收集的实验数据，比如一些材料性质、溶度积等。精度取决于原文献，建议使用前多查几篇文献对照一下'
      }
    ],
    
    // 常见问题
    faqs: [
      {
        question: '计算结果的精度怎么样？',
        answer: '不同数据精度不一样。基础物理化学常数用的是CODATA 2018推荐值，最准确；元素数据这些来自NIST等权威来源；文献数据会标注出处。具体精度在结果页面会说明。'
      },
      {
        question: '为什么有时候会显示警告？',
        answer: '警告一般是参数接近或超出常用范围了，比如XRD计算角度太小、温度不在常规范围等。不一定是错的，但建议谨慎使用，最好做实验验证一下。'
      },
      {
        question: '历史记录会保存多久？',
        answer: '历史记录都保存在你的手机上，除非你手动清除或卸载小程序，否则一直都在。数据不会上传到服务器，比较安全。'
      },
      {
        question: 'XRD计算为什么要选射线源？',
        answer: '不同射线源波长不一样，直接影响布拉格方程的结果。Cu Kα是最常用的实验室X射线源(λ=1.5406Å)，我还加了Mo Kα、Co Kα等其他常用的。'
      },
      {
        question: '电化学的参比电极怎么选？',
        answer: '看你的实验体系：水溶液一般用Ag/AgCl或SCE；非水体系常用Fc/Fc⁺。工具支持多种参比电极和NHE或RHE之间的转换。'
      },
      {
        question: '溶度积计算考虑活度系数了吗？',
        answer: '考虑了。提供了Debye-Hückel和Davies方程两种模型。低离子强度(I<0.1M)用Debye-Hückel，高离子强度用Davies方程更准。'
      },
      {
        question: '怎么导出计算结果？',
        answer: '点结果区域的导出按钮，可以复制、保存或分享。支持纯文本、Markdown、CSV、JSON等格式。'
      },
      {
        question: '发现数据错了怎么办？',
        answer: '非常感谢反馈！请通过"反馈与建议"告诉我，包括错误的数据、正确的值和参考来源。我会尽快核实更新。'
      },
      {
        question: '可以离线用吗？',
        answer: '可以！所有功能和数据都在小程序里，不需要联网。只有分享或反馈时才需要网络。'
      },
      {
        question: '以后会加什么功能？',
        answer: '计划加更多材料数据、光谱分析工具、化学反应平衡计算等。也欢迎你提建议，帮我改进工具。'
      }
    ]
  },

  onLoad(options) {
    // 加载各模块的数据来源信息
    this.loadDataSources();
    
    // 如果URL参数指定了标签页，就切换过去
    if (options.tab) {
      this.setData({ activeTab: parseInt(options.tab) || 0 });
    }
  },

  // 把sources对象转换成引用列表格式
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

  // 加载各个模块的数据来源信息
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

  // 切换标签页
  switchTab(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({ 
      activeTab: index,
      expandedFaq: null // 切换标签时把FAQ收起来
    });
  },

  // 展开/收起FAQ
  toggleFaq(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      expandedFaq: this.data.expandedFaq === index ? null : index
    });
  },

  // 打开反馈功能
  openFeedback() {
    wx.showModal({
      title: '反馈功能',
      content: '感谢支持！当前版本还没集成反馈系统，可以通过微信小程序自带的"意见反馈"功能提交问题或建议。',
      showCancel: false,
      confirmText: '知道了'
    });
  },

  // 返回首页
  goHome() {
    wx.switchTab({
      url: '/pages/home/home'
    });
  },

  // 分享给好友
  onShareAppMessage() {
    return {
      title: '材料化学计算工具 - 使用帮助',
      path: '/pages/help/help',
      imageUrl: ''
    };
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: '材料化学计算工具 - 科研必备',
      query: '',
      imageUrl: ''
    };
  }
});

