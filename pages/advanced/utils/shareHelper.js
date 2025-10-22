/**
 * 分享辅助函数 v6.0.0
 * 为所有计算工具提供统一的分享功能（含分享卡片）
 */

/**
 * 通用分享结果函数
 * @param {Object} page - 页面实例(this)
 * @param {string} toolName - 工具名称
 * @param {string} toolId - 工具ID（用于统计）
 * @param {Object} inputs - 输入参数对象
 * @param {Object} results - 结果对象
 * @param {string} notes - 备注信息
 */
async function shareCalculationResult(page, toolName, toolId, inputs, results, notes = '') {
  if (!results || Object.keys(results).length === 0) {
    wx.showToast({
      title: '请先完成计算',
      icon: 'none'
    });
    return;
  }

  try {
    const app = getApp();
    const shareService = app.getShareService();

    const shareData = {
      title: `${toolName} - 计算结果`,
      toolName: toolName,
      toolId: toolId,
      inputs: inputs || {},
      results: results || {},
      notes: notes,
      path: getCurrentPages()[getCurrentPages().length - 1]?.route || '/pages/home/home'
    };

    await shareService.shareResult(shareData);
    
    // 记录统计
    const statisticsService = app.getStatisticsService?.();
    if (statisticsService) {
      statisticsService.recordShare({
        tool: toolId,
        toolName: toolName,
        channel: 'copy'
      });
    }
    
    return true;
  } catch (e) {
    console.error('分享失败:', e);
    wx.showToast({
      title: '分享失败',
      icon: 'none'
    });
    return false;
  }
}

/**
 * 通用复制结果函数
 */
async function copyCalculationResult(page, toolName, inputs, results) {
  if (!results || Object.keys(results).length === 0) {
    wx.showToast({
      title: '暂无结果可复制',
      icon: 'none'
    });
    return;
  }

  try {
    const app = getApp();
    const shareService = app.getShareService();

    const shareData = {
      title: `${toolName} - 计算结果`,
      inputs: inputs || {},
      results: results || {}
    };

    await shareService.copyToClipboard(shareData);
    return true;
  } catch (e) {
    console.error('复制失败:', e);
    return false;
  }
}

/**
 * 生成分享配置（用于onShareAppMessage）
 */
function getShareConfig(toolName, result, path) {
  if (result) {
    return {
      title: `${toolName}：查看我的计算结果`,
      path: path || '/pages/home/home',
      imageUrl: ''
    };
  }
  
  return {
    title: `${toolName} - 材料化学科研工具箱`,
    path: path || '/pages/home/home'
  };
}

/**
 * 生成分享卡片 (v6.0.0新增)
 * @param {string} toolName - 工具名称
 * @param {string} toolId - 工具ID
 * @param {Object} inputs - 输入参数
 * @param {Object} results - 结果对象
 * @param {string} notes - 备注信息
 */
async function generateShareCard(toolName, toolId, inputs, results, notes = '') {
  if (!results || Object.keys(results).length === 0) {
    wx.showToast({
      title: '请先完成计算',
      icon: 'none'
    });
    return false;
  }

  try {
    const shareData = {
      title: `${toolName} - 计算结果`,
      toolName: toolName,
      toolId: toolId,
      inputs: inputs || {},
      results: results || {},
      notes: notes
    };

    // 跳转到分享卡片页面
    wx.navigateTo({
      url: '/pages/settings/share-card/share-card',
      success: (res) => {
        // 通过eventChannel传递数据
        res.eventChannel.emit('shareData', shareData);
      },
      fail: (err) => {
        console.error('跳转失败:', err);
        wx.showToast({
          title: '打开失败',
          icon: 'none'
        });
      }
    });

    return true;
  } catch (e) {
    console.error('生成卡片失败:', e);
    wx.showToast({
      title: '生成失败',
      icon: 'none'
    });
    return false;
  }
}

/**
 * 带卡片的分享 (v6.0.0新增)
 * 显示选项让用户选择分享方式
 */
async function shareWithCard(toolName, toolId, inputs, results, notes = '') {
  if (!results || Object.keys(results).length === 0) {
    wx.showToast({
      title: '请先完成计算',
      icon: 'none'
    });
    return false;
  }

  wx.showActionSheet({
    itemList: ['生成精美卡片', '快速复制分享', '取消'],
    success: async (res) => {
      if (res.tapIndex === 0) {
        // 生成卡片
        await generateShareCard(toolName, toolId, inputs, results, notes);
      } else if (res.tapIndex === 1) {
        // 快速复制
        await shareCalculationResult(null, toolName, toolId, inputs, results, notes);
      }
    }
  });

  return true;
}

/**
 * 保存卡片到相册（占位函数，实际在分享卡片页面中使用）
 */
async function saveCardToAlbum(imagePath) {
  try {
    await wx.saveImageToPhotosAlbum({
      filePath: imagePath
    });
    
    wx.showToast({
      title: '已保存到相册',
      icon: 'success'
    });
    
    // 记录统计
    const app = getApp();
    const statisticsService = app.getStatisticsService?.();
    if (statisticsService) {
      statisticsService.recordShare({
        tool: 'unknown',
        channel: 'album'
      });
    }
    
    return true;
  } catch (e) {
    console.error('保存失败:', e);
    
    if (e.errMsg && e.errMsg.includes('auth deny')) {
      wx.showModal({
        title: '需要相册权限',
        content: '请在设置中开启相册权限',
        confirmText: '去设置',
        success: (res) => {
          if (res.confirm) {
            wx.openSetting();
          }
        }
      });
    } else {
      wx.showToast({
        title: '保存失败',
        icon: 'none'
      });
    }
    
    return false;
  }
}

module.exports = {
  shareCalculationResult,
  copyCalculationResult,
  getShareConfig,
  generateShareCard,
  shareWithCard,
  saveCardToAlbum
};

