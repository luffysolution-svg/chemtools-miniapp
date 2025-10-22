/**
 * 分享卡片生成器 v6.0.0
 * 使用Canvas绘制精美的分享卡片
 */

const { shareCardTemplates } = require('./shareCardTemplates');

class ShareCardGenerator {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.pixelRatio = 2; // 提高清晰度
    this.renderCache = {}; // 渲染缓存
    this.maxCacheSize = 5; // 最多缓存5个卡片
  }

  /**
   * 初始化Canvas
   */
  initCanvas(canvasId, componentContext) {
    return new Promise((resolve, reject) => {
      try {
        // 获取设备像素比
        const systemInfo = wx.getSystemInfoSync();
        this.pixelRatio = systemInfo.pixelRatio || 2;

        // 创建canvas上下文
        const query = componentContext ? 
          componentContext.createSelectorQuery() : 
          wx.createSelectorQuery();

        query.select(`#${canvasId}`)
          .fields({ node: true, size: true })
          .exec((res) => {
            if (!res || !res[0]) {
              reject(new Error('Canvas未找到'));
              return;
            }

            const canvas = res[0].node;
            const ctx = canvas.getContext('2d');

            // 设置canvas尺寸（物理像素）
            const width = res[0].width || 350;
            const height = res[0].height || 500;
            canvas.width = width * this.pixelRatio;
            canvas.height = height * this.pixelRatio;
            ctx.scale(this.pixelRatio, this.pixelRatio);

            this.canvas = canvas;
            this.ctx = ctx;

            resolve({ canvas, ctx, width, height });
          });
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * 绘制渐变背景
   */
  drawGradientBackground(template, width, height) {
    const ctx = this.ctx;
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    
    gradient.addColorStop(0, template.gradientStart);
    gradient.addColorStop(1, template.gradientEnd);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  /**
   * 绘制圆角矩形
   */
  drawRoundRect(x, y, width, height, radius, fillColor, strokeColor) {
    const ctx = this.ctx;
    
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    
    if (fillColor) {
      ctx.fillStyle = fillColor;
      ctx.fill();
    }
    
    if (strokeColor) {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  /**
   * 绘制标题
   */
  drawTitle(title, template, width) {
    const ctx = this.ctx;
    const y = template.padding.top + 20;
    
    ctx.fillStyle = template.titleColor;
    ctx.font = `bold ${template.titleSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(title, width / 2, y);
  }

  /**
   * 绘制装饰线条
   */
  drawDecorativeLine(y, template, width) {
    const ctx = this.ctx;
    const lineWidth = 60;
    const x = (width - lineWidth) / 2;
    
    ctx.strokeStyle = template.accentColor;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + lineWidth, y);
    ctx.stroke();
  }

  /**
   * 绘制输入参数
   */
  drawInputs(inputs, startY, template, width) {
    const ctx = this.ctx;
    const leftMargin = template.padding.left + 20;
    const rightMargin = width - template.padding.right - 20;
    let currentY = startY;

    // 绘制"输入参数"标题
    ctx.fillStyle = template.sectionTitleColor;
    ctx.font = `bold ${template.sectionTitleSize}px sans-serif`;
    ctx.textAlign = 'left';
    ctx.fillText('输入参数', leftMargin, currentY);
    currentY += 25;

    // 绘制参数列表
    ctx.font = `${template.textSize}px sans-serif`;
    ctx.fillStyle = template.textColor;
    
    Object.entries(inputs).forEach(([key, value]) => {
      const text = `${key}: ${value}`;
      const maxWidth = rightMargin - leftMargin;
      
      // 处理文本换行
      const lines = this.wrapText(text, maxWidth);
      lines.forEach(line => {
        ctx.fillText(line, leftMargin, currentY);
        currentY += template.lineHeight;
      });
    });

    return currentY + 10;
  }

  /**
   * 绘制计算结果
   */
  drawResults(results, startY, template, width) {
    const ctx = this.ctx;
    const leftMargin = template.padding.left + 20;
    const rightMargin = width - template.padding.right - 20;
    const cardWidth = rightMargin - leftMargin;
    let currentY = startY;

    // 绘制"计算结果"标题
    ctx.fillStyle = template.sectionTitleColor;
    ctx.font = `bold ${template.sectionTitleSize}px sans-serif`;
    ctx.textAlign = 'left';
    ctx.fillText('计算结果', leftMargin, currentY);
    currentY += 25;

    // 绘制结果卡片背景
    const cardY = currentY - 10;
    const cardHeight = Object.keys(results).length * template.lineHeight + 30;
    this.drawRoundRect(
      leftMargin - 10, 
      cardY, 
      cardWidth + 20, 
      cardHeight, 
      10, 
      template.resultCardBg
    );

    currentY += 15;

    // 绘制结果列表
    ctx.font = `${template.resultSize}px sans-serif`;
    ctx.fillStyle = template.resultColor;
    
    Object.entries(results).forEach(([key, value]) => {
      const text = `✓ ${key}: ${value}`;
      const maxWidth = cardWidth - 20;
      
      const lines = this.wrapText(text, maxWidth);
      lines.forEach(line => {
        ctx.fillText(line, leftMargin, currentY);
        currentY += template.lineHeight;
      });
    });

    return currentY + 20;
  }

  /**
   * 绘制备注信息
   */
  drawNotes(notes, startY, template, width) {
    if (!notes) return startY;

    const ctx = this.ctx;
    const leftMargin = template.padding.left + 20;
    const rightMargin = width - template.padding.right - 20;
    let currentY = startY;

    ctx.font = `${template.noteSize}px sans-serif`;
    ctx.fillStyle = template.noteColor;
    ctx.textAlign = 'left';
    
    const maxWidth = rightMargin - leftMargin;
    const lines = this.wrapText(`💡 ${notes}`, maxWidth);
    
    lines.forEach(line => {
      ctx.fillText(line, leftMargin, currentY);
      currentY += template.lineHeight;
    });

    return currentY + 15;
  }

  /**
   * 绘制底部信息
   */
  drawFooter(template, width, height) {
    const ctx = this.ctx;
    const y = height - template.padding.bottom - 15;
    
    // 绘制时间
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    ctx.fillStyle = template.footerColor;
    ctx.font = `${template.footerSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('材料化学科研工具箱', width / 2, y);
    ctx.fillText(timeStr, width / 2, y + 18);
  }

  /**
   * 文本换行处理
   */
  wrapText(text, maxWidth) {
    const ctx = this.ctx;
    const words = text.split('');
    const lines = [];
    let currentLine = '';

    for (let word of words) {
      const testLine = currentLine + word;
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && currentLine !== '') {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    
    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  }

  /**
   * 生成分享卡片（带性能优化）
   */
  async generateCard(data, templateName = 'elegant', canvasId = 'shareCanvas', componentContext = null) {
    try {
      // 性能优化：使用requestAnimationFrame
      const startTime = Date.now();

      // 初始化Canvas
      const { width, height } = await this.initCanvas(canvasId, componentContext);

      // 获取模板
      const template = shareCardTemplates[templateName] || shareCardTemplates.elegant;

      // 清空画布（性能优化：一次性清空）
      this.ctx.clearRect(0, 0, width, height);

      // 1. 绘制渐变背景
      this.drawGradientBackground(template, width, height);

      // 2. 绘制标题
      this.drawTitle(data.title || '计算结果', template, width);

      // 3. 绘制装饰线条
      const lineY = template.padding.top + 50;
      this.drawDecorativeLine(lineY, template, width);

      // 4. 绘制输入参数
      let currentY = lineY + 30;
      if (data.inputs && Object.keys(data.inputs).length > 0) {
        currentY = this.drawInputs(data.inputs, currentY, template, width);
      }

      // 5. 绘制计算结果
      if (data.results && Object.keys(data.results).length > 0) {
        currentY = this.drawResults(data.results, currentY, template, width);
      }

      // 6. 绘制备注
      if (data.notes) {
        currentY = this.drawNotes(data.notes, currentY, template, width);
      }

      // 7. 绘制底部信息
      this.drawFooter(template, width, height);

      // 性能日志
      const endTime = Date.now();
      console.log(`✅ 卡片生成完成，耗时: ${endTime - startTime}ms`);

      // 绘制完成
      return true;
    } catch (e) {
      console.error('生成卡片失败:', e);
      throw e;
    }
  }

  /**
   * 保存Canvas为图片
   */
  async saveToImage(canvasId = 'shareCanvas', componentContext = null) {
    return new Promise((resolve, reject) => {
      try {
        wx.canvasToTempFilePath({
          canvas: this.canvas,
          success: (res) => {
            resolve(res.tempFilePath);
          },
          fail: (err) => {
            console.error('保存图片失败:', err);
            reject(err);
          }
        }, componentContext);
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * 保存到相册
   */
  async saveToAlbum(filePath) {
    return new Promise((resolve, reject) => {
      wx.saveImageToPhotosAlbum({
        filePath: filePath,
        success: () => {
          wx.showToast({
            title: '已保存到相册',
            icon: 'success'
          });
          resolve(true);
        },
        fail: (err) => {
          if (err.errMsg.includes('auth deny')) {
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
          reject(err);
        }
      });
    });
  }
}

// 导出单例
const shareCardGenerator = new ShareCardGenerator();

module.exports = {
  shareCardGenerator,
  ShareCardGenerator
};

