/**
 * 结果展示卡片组件
 * 提供统一的结果展示、复制、导出功能
 */

const { exportService } = require('../../services/export');
const { historyService } = require('../../services/history');

Component({
  options: {
    styleIsolation: 'shared',
    multipleSlots: true
  },

  properties: {
    // 标题
    title: {
      type: String,
      value: '结果'
    },
    // 类型（影响样式）
    type: {
      type: String,
      value: 'default' // default, success, warning, error
    },
    // 结果文本（用于复制）
    result: {
      type: String,
      value: ''
    },
    // 提示文本
    hint: {
      type: String,
      value: ''
    },
    // 是否显示复制按钮
    showCopy: {
      type: Boolean,
      value: true
    },
    // 是否显示导出按钮
    showExport: {
      type: Boolean,
      value: false
    },
    // 是否显示保存到历史按钮
    showHistory: {
      type: Boolean,
      value: false
    },
    // 历史记录相关信息
    historyType: {
      type: String,
      value: ''
    },
    historyInput: {
      type: String,
      value: ''
    },
    // === 元数据相关（新增） ===
    // 单位
    unit: {
      type: String,
      value: ''
    },
    // 精度说明
    precision: {
      type: String,
      value: ''
    },
    // 计算公式
    formula: {
      type: String,
      value: ''
    },
    // 计算条件（数组或字符串）
    conditions: {
      type: null,
      value: null
    },
    // 警告信息
    warning: {
      type: String,
      value: ''
    },
    // 数据来源
    dataSource: {
      type: String,
      value: ''
    },
    // 是否显示元数据区域
    showMetadata: {
      type: Boolean,
      value: true
    },
    // 是否默认展开元数据
    metadataExpanded: {
      type: Boolean,
      value: false
    }
  },
  
  data: {
    // 元数据是否展开
    isMetadataExpanded: false,
    // 条件是否为数组
    isConditionsArray: false,
    // 条件显示文本（如果是字符串）
    conditionsText: '',
    // 条件列表（如果是数组）
    conditionsList: []
  },
  
  observers: {
    'conditions': function(newVal) {
      if (newVal) {
        if (Array.isArray(newVal)) {
          this.setData({
            isConditionsArray: true,
            conditionsList: newVal,
            conditionsText: ''
          });
        } else {
          this.setData({
            isConditionsArray: false,
            conditionsText: newVal,
            conditionsList: []
          });
        }
      } else {
        this.setData({
          isConditionsArray: false,
          conditionsText: '',
          conditionsList: []
        });
      }
    }
  },
  
  lifetimes: {
    attached() {
      // 设置初始展开状态
      this.setData({
        isMetadataExpanded: this.properties.metadataExpanded
      });
      
      // 初始化条件数据
      const conditions = this.properties.conditions;
      if (conditions) {
        if (Array.isArray(conditions)) {
          this.setData({
            isConditionsArray: true,
            conditionsList: conditions
          });
        } else {
          this.setData({
            isConditionsArray: false,
            conditionsText: conditions
          });
        }
      }
    }
  },

  methods: {
    /**
     * 切换元数据展开状态
     */
    toggleMetadata() {
      this.setData({
        isMetadataExpanded: !this.data.isMetadataExpanded
      });
    },
    
    /**
     * 复制结果
     */
    handleCopy() {
      const text = this.properties.result;
      if (!text) {
        wx.showToast({
          title: '暂无可复制内容',
          icon: 'none'
        });
        return;
      }

      exportService.copyToClipboard(text).then(() => {
        this.triggerEvent('copy', { text });
      }).catch(err => {
        console.error('Copy failed:', err);
      });
    },

    /**
     * 导出结果
     */
    handleExport() {
      const text = this.properties.result;
      if (!text) {
        wx.showToast({
          title: '暂无可导出内容',
          icon: 'none'
        });
        return;
      }

      // 显示导出选项
      wx.showActionSheet({
        itemList: ['复制到剪贴板', '保存为文本文件'],
        success: (res) => {
          if (res.tapIndex === 0) {
            this.handleCopy();
          } else if (res.tapIndex === 1) {
            const fileName = `${this.properties.title}_${Date.now()}.txt`;
            exportService.saveAsFile(text, fileName).then(() => {
              this.triggerEvent('export', { text, fileName });
            });
          }
        }
      });
    },

    /**
     * 保存到历史记录（增强版，包含元数据）
     */
    handleSaveHistory() {
      const { 
        historyType, 
        title, 
        historyInput, 
        result,
        unit,
        precision,
        formula,
        conditions,
        warning,
        dataSource
      } = this.properties;
      
      if (!historyType || !result) {
        wx.showToast({
          title: '保存失败',
          icon: 'none'
        });
        return;
      }

      // 构建元数据对象
      const metadata = {};
      if (unit) metadata.unit = unit;
      if (precision) metadata.precision = precision;
      if (formula) metadata.formula = formula;
      if (conditions) metadata.conditions = conditions;
      if (warning) metadata.warning = warning;
      if (dataSource) metadata.dataSource = dataSource;

      historyService.add({
        type: historyType,
        title: title,
        input: historyInput,
        result: result,
        metadata: metadata
      });

      wx.showToast({
        title: '已保存到历史',
        icon: 'success'
      });

      this.triggerEvent('historysaved', { 
        type: historyType, 
        title, 
        input: historyInput, 
        result,
        metadata
      });
    }
  }
});

