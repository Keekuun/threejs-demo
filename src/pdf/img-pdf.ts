import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// 获取需要操作的 DOM 元素
const exportButton = document.getElementById('export-pdf-btn') as HTMLButtonElement;
const contentToExport = document.getElementById('pdf-content') as HTMLDivElement;

if (!exportButton || !contentToExport) {
  throw new Error("关键的 DOM 元素未找到！");
}

/**
 * 生成并下载 PDF 的核心函数 (最终修复版)
 */
const generatePdf3 = async () => {
  exportButton.disabled = true;
  exportButton.innerText = '生成中...';

  try {
    // 1. 将DOM元素渲染到源canvas上
    const sourceCanvas = await html2canvas(contentToExport, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    });
    // 保存图片
    downloadImg(sourceCanvas.toDataURL('image/webp'))

    // 2. 定义PDF的边距和尺寸
    const TOP_MARGIN = 5;
    const BOTTOM_MARGIN = 5;
    const LEFT_MARGIN = 5;
    const RIGHT_MARGIN = 5;

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // PDF页面中可用于放置内容区域的尺寸
    const contentWidth = pdfWidth - LEFT_MARGIN - RIGHT_MARGIN;
    const contentHeight = pdfHeight - TOP_MARGIN - BOTTOM_MARGIN;

    // 3. 【核心修复】分页逻辑 - 按像素精确裁剪和放置

    // 计算一页PDF内容区高度对应在源canvas上的像素高度
    const contentHeightInPx = contentHeight * (sourceCanvas.width / contentWidth);

    let sourceY = 0; // 追踪在源canvas上已处理到的Y轴位置（单位：像素）

    while (sourceY < sourceCanvas.height) {
      // 如果不是第一页, 添加新页面
      if (sourceY > 0) {
        pdf.addPage();
      }

      // 计算当前页要裁剪的高度：取“整页高度”和“剩余高度”中的较小者
      const sliceHeight = Math.min(sourceCanvas.height - sourceY, contentHeightInPx);

      // 创建一个临时canvas，其尺寸就是当前切片的精确尺寸
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = sourceCanvas.width;
      tempCanvas.height = sliceHeight; // canvas高度不再固定，而是动态计算
      const ctx = tempCanvas.getContext('2d');
      if (!ctx) throw new Error('无法获取2D上下文');

      // 从源canvas精准裁剪出当前页的内容
      ctx.drawImage(
        sourceCanvas,
        0, sourceY,               // 源canvas的裁剪起点
        sourceCanvas.width, sliceHeight, // 源canvas的裁剪尺寸
        0, 0,                      // 目标canvas的绘制起点
        sourceCanvas.width, sliceHeight  // 目标canvas的绘制尺寸
      );

      const pageImgData = tempCanvas.toDataURL('image/webp');
      // 【关键】计算此切片在PDF中应占的高度，保持宽高比
      // 这对于最后一页至关重要，它不会再被拉伸
      const pdfImageHeight = (sliceHeight * contentWidth) / sourceCanvas.width;

      // 将裁剪好的、尺寸正确的图片添加到PDF
      pdf.addImage(
        pageImgData,
        'WEBP',
        LEFT_MARGIN,
        TOP_MARGIN,
        contentWidth,
        pdfImageHeight // 使用计算出的、保持宽高比的高度
      );

      // 更新已处理的Y轴位置
      sourceY += sliceHeight;
    }

    pdf.save('html-pdf3.pdf');

  } catch (error) {
    console.error('生成 PDF 时出错:', error);
    alert('抱歉，生成 PDF 失败，请查看控制台获取更多信息。');
  } finally {
    exportButton.disabled = false;
    exportButton.innerText = '生成并下载 PDF';
  }
};

/**
 * 生成并下载 PDF 的边距版
 */
const generatePdf2 = async () => {
  exportButton.disabled = true;
  exportButton.innerText = '生成中...';

  try {
    const canvas = await html2canvas(contentToExport, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/webp');
    // 保存图片
    downloadImg(imgData)
    // --- ⬇️定义 PDF 的边距 (单位: 毫米 mm) ---
    // 我这里设置为 10mm，您可以根据需要调整
    const TOP_MARGIN = 10;
    const BOTTOM_MARGIN = 10;
    const LEFT_MARGIN = 10;
    const RIGHT_MARGIN = 10;
    // --- ⬆️定义 PDF 的边距 ---

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // --- ⬇️ 计算内容区域的尺寸 ---
    const contentWidth = pdfWidth - LEFT_MARGIN - RIGHT_MARGIN;
    const contentHeight = pdfHeight - TOP_MARGIN - BOTTOM_MARGIN; // 每页可用的内容高度
    // --- ⬆️ 计算内容区域的尺寸 ---

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // --- ⬇️ 计算图片的整体缩放后高度 ---
    // 根据内容区域的宽度，等比计算出图片在PDF中的总高度
    const totalImgHeight = (canvasHeight * contentWidth) / canvasWidth;
    // --- ⬆️ 计算图片的整体缩放后高度 ---


    let renderedHeight = 0; // 已渲染到PDF上的图片高度

    // --- ⬇️ MODIFIED: 全新的、更健壮的分页逻辑 ---
    while (renderedHeight < totalImgHeight) {
      // 如果不是第一页，则需要添加新页面
      if (renderedHeight > 0) {
        pdf.addPage();
      }

      // 计算当前页图片的Y轴偏移量。
      // 这个偏移量是负数，表示将巨大的单张图片向上移动，以显示当前页应该显示的部分。
      const pageImageYOffset = -renderedHeight;

      // 添加图片到当前页
      // x 坐标是左边距
      // y 坐标是上边距 + 偏移量
      // 宽度是内容宽度
      // 高度是图片总高度
      pdf.addImage(imgData, 'WEBP', LEFT_MARGIN, TOP_MARGIN + pageImageYOffset, contentWidth, totalImgHeight);

      // 更新已渲染的高度
      renderedHeight += contentHeight;
    }
    // --- ⬆️ 全新的、更健壮的分页逻辑 ---

    pdf.save('html-pdf2.pdf');

  } catch (error) {
    console.error('生成 PDF 时出错:', error);
    alert('抱歉，生成 PDF 失败，请查看控制台获取更多信息。');
  } finally {
    exportButton.disabled = false;
    exportButton.innerText = '生成并下载 PDF';
  }
};

/**
 * 生成并下载 PDF 的核心函数
 */
const generatePdf1 = async () => {
  // 1. 禁用按钮，提供用户反馈，防止重复点击
  exportButton.disabled = true;
  exportButton.innerText = '生成中...';

  try {
    // 2. 使用 html2canvas 将 DOM 元素转换为 canvas
    const canvas = await html2canvas(contentToExport, {
      // 提高渲染质量，值越高，越清晰
      scale: 2,
      // 允许 canvas 渲染跨域图片
      useCORS: true,
      // 渲染前元素的背景色（对于透明元素）
      backgroundColor: '#ffffff',
    });

    // 3. 将 canvas 转换为图片数据 (DataURL)
    const imgData = canvas.toDataURL('image/webp');
    // 保存图片
    downloadImg(imgData)

    // 4. 初始化 jsPDF 实例
    // 'p' (Portrait): 纵向, 'mm': 单位毫米, 'a4': 纸张尺寸
    const pdf = new jsPDF('p', 'mm', 'a4');

    // 5. 计算 PDF 页面和图片尺寸，以保证图片能完整地、按比例地放入 PDF
    const pdfWidth = pdf.internal.pageSize.getWidth(); // A4 纸宽度（毫米）
    const pdfHeight = pdf.internal.pageSize.getHeight(); // A4 纸高度（毫米）
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // 计算图片在PDF中的适配高度
    const imgHeight = (canvasHeight * pdfWidth) / canvasWidth;

    const paddingTop = 10
    const paddingBottom = 10
    let position = paddingTop;
    let heightLeft = imgHeight + paddingBottom;

    // 6. 将图片添加到 PDF 中
    // addImage(imageData, format, x, y, width, height)
    pdf.addImage(imgData, 'WEBP', 0, position, pdfWidth, imgHeight - paddingBottom);
    heightLeft -= pdfHeight;

    // 7. 【分页处理】如果图片高度超过一页，则添加新页
    while (heightLeft > paddingTop) {
      position = heightLeft - imgHeight; // 更新下一页图片的起始 Y 坐标
      pdf.addPage();
      pdf.addImage(imgData, 'WEBP', 0, position + paddingTop, pdfWidth, imgHeight - paddingBottom);
      heightLeft+=paddingBottom
      heightLeft -= pdfHeight;
    }

    // 8. 保存 PDF 文件
    pdf.save('html-pdf1.pdf');
  } catch (error) {
    console.error('生成 PDF 时出错:', error);
    alert('抱歉，生成 PDF 失败，请查看控制台获取更多信息。');
  } finally {
    // 9. 无论成功与否，都要恢复按钮状态
    exportButton.disabled = false;
    exportButton.innerText = '生成并下载 PDF';
  }
}

// 绑定点击事件
// generatePdf1 会导致上下头部分页处缺失
// generatePdf2 会导致上下头部分页处会重复
// 选择最终的结果3
exportButton.onclick = generatePdf3


function downloadImg(imgData: string) {
  const link = document.createElement('a');
  link.href = imgData;
  link.download = 'html-img.webp';
  link.click();
}
