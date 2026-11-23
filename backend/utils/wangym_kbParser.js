// 姓名：王一鸣 | 学号：24002060518 | 时间：2026-11-23 | 大模型：DeepSeek-V4.1-Flash
// 知识库文件解析与文本切分（支持 txt/md/docx/pptx/pdf，doc/ppt 采用尽力解析）
const AdmZip = require('adm-zip');

let wangymPDFParse = null;
try {
  wangymPDFParse = require('pdf-parse').PDFParse;
} catch (wangymLoadErr) {
  console.warn('[wangym_kb] pdf-parse 不可用：', wangymLoadErr.message);
}

function wangymDecodeEntities(wangymText) {
  return wangymText
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
}

function wangymXmlToText(wangymXml) {
  return wangymDecodeEntities(
    wangymXml
      .replace(/<w:tab[^>]*\/>/g, '\t')
      .replace(/<w:br[^>]*\/>/g, '\n')
      .replace(/<\/w:p>/g, '\n')
      .replace(/<[^>]+>/g, '')
  );
}

// 二进制 doc/ppt：尽力抽取可读字符串（UTF-16LE 与 ASCII）
function wangymExtractBinaryText(wangymBuffer) {
  const wangymParts = [];
  for (let wangymOffset = 0; wangymOffset < 2; wangymOffset++) {
    let wangymCurrent = '';
    for (let wangymIndex = wangymOffset; wangymIndex + 1 < wangymBuffer.length; wangymIndex += 2) {
      const wangymCode = wangymBuffer.readUInt16LE(wangymIndex);
      const wangymPrintable =
        (wangymCode >= 0x4e00 && wangymCode <= 0x9fff) ||
        (wangymCode >= 0x3000 && wangymCode <= 0x303f) ||
        (wangymCode >= 0xff00 && wangymCode <= 0xffef) ||
        (wangymCode >= 32 && wangymCode <= 126) ||
        wangymCode === 10 || wangymCode === 13;
      if (wangymPrintable) {
        wangymCurrent += String.fromCharCode(wangymCode);
      } else {
        if (wangymCurrent.trim().length >= 4) {
          wangymParts.push(wangymCurrent.trim());
        }
        wangymCurrent = '';
      }
    }
    if (wangymCurrent.trim().length >= 4) {
      wangymParts.push(wangymCurrent.trim());
    }
  }
  return wangymParts.join('\n');
}

async function wangymParseBuffer(wangymBuffer, wangymFileName) {
  const wangymExt = (wangymFileName.split('.').pop() || '').toLowerCase();

  if (['txt', 'md', 'csv', 'json', ''].includes(wangymExt)) {
    return wangymBuffer.toString('utf8');
  }

  if (wangymExt === 'docx') {
    const wangymZip = new AdmZip(wangymBuffer);
    const wangymEntry = wangymZip.getEntry('word/document.xml');
    if (!wangymEntry) {
      throw new Error('docx 文件缺少 word/document.xml');
    }
    return wangymXmlToText(wangymEntry.getData().toString('utf8'));
  }

  if (wangymExt === 'pptx') {
    const wangymZip = new AdmZip(wangymBuffer);
    const wangymSlides = wangymZip
      .getEntries()
      .filter((wangymItem) => /^ppt\/slides\/slide\d+\.xml$/.test(wangymItem.entryName))
      .sort((wangymA, wangymB) => {
        const wangymNA = parseInt(wangymA.entryName.match(/(\d+)/)[1], 10);
        const wangymNB = parseInt(wangymB.entryName.match(/(\d+)/)[1], 10);
        return wangymNA - wangymNB;
      });

    if (wangymSlides.length === 0) {
      throw new Error('pptx 文件缺少幻灯片内容');
    }

    const wangymTexts = wangymSlides.map((wangymSlide, wangymIndex) => {
      const wangymXml = wangymSlide.getData().toString('utf8');
      const wangymMatches = wangymXml.match(/<a:t>([\s\S]*?)<\/a:t>/g) || [];
      const wangymContent = wangymMatches
        .map((wangymNode) => wangymDecodeEntities(wangymNode.replace(/<\/?a:t>/g, '')))
        .join(' ');
      return '第 ' + (wangymIndex + 1) + ' 页：' + wangymContent;
    });

    return wangymTexts.join('\n');
  }

  if (wangymExt === 'pdf') {
    if (!wangymPDFParse) {
      throw new Error('PDF 解析组件未安装，无法解析 PDF');
    }
    const wangymParser = new wangymPDFParse({ data: wangymBuffer });
    const wangymResult = await wangymParser.getText();
    const wangymText = (wangymResult && (wangymResult.text || wangymResult)) || '';
    if (typeof wangymParser.destroy === 'function') {
      await wangymParser.destroy();
    }
    return String(wangymText);
  }

  if (wangymExt === 'doc' || wangymExt === 'ppt') {
    const wangymText = wangymExtractBinaryText(wangymBuffer);
    if (wangymText.replace(/\s/g, '').length < 20) {
      throw new Error('旧版 ' + wangymExt + ' 二进制格式解析失败，请另存为 ' + wangymExt + 'x 后重试');
    }
    return wangymText;
  }

  throw new Error('暂不支持的文件类型：' + wangymExt);
}

// 按段落聚合成约 450 字的切片，带 80 字重叠
function wangymSplitChunks(wangymText) {
  const wangymClean = String(wangymText || '')
    .replace(/\r/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  if (!wangymClean) {
    return [];
  }

  const wangymParagraphs = wangymClean.split('\n').map((wangymLine) => wangymLine.trim()).filter(Boolean);
  const wangymChunks = [];
  let wangymBufferText = '';

  const wangymPush = () => {
    const wangymValue = wangymBufferText.trim();
    if (wangymValue) {
      wangymChunks.push(wangymValue.slice(0, 1200));
    }
  };

  for (const wangymParagraph of wangymParagraphs) {
    if ((wangymBufferText + '\n' + wangymParagraph).length > 450 && wangymBufferText) {
      wangymPush();
      wangymBufferText = wangymBufferText.slice(-80);
    }
    wangymBufferText += '\n' + wangymParagraph;
  }
  wangymPush();

  return wangymChunks.length ? wangymChunks : [wangymClean.slice(0, 800)];
}

module.exports = { wangymParseBuffer, wangymSplitChunks };
