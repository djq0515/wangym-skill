// 姓名：王一鸣 | 学号：24002060518 | 时间：2026-11-23 | 大模型：DeepSeek-V4.1-Flash
// 知识库控制器：知识库管理、文件上传解析、基于知识库的 RAG 问答
const wangymKbModel = require('../models/wangym_kbModel');
const { wangymParseBuffer, wangymSplitChunks } = require('../utils/wangym_kbParser');

const WANGYM_MAX_FILE_SIZE = 8 * 1024 * 1024;
const WANGYM_MODEL = 'deepseek-ai/DeepSeek-V4-Flash';

function wangymFail(wangymRes, wangymMsg, wangymCode = 1) {
  return wangymRes.json({ code: wangymCode, msg: wangymMsg, data: null });
}

// 中文按二元组、英文按单词切分，用于关键词检索
function wangymTokenize(wangymText) {
  const wangymClean = String(wangymText || '').toLowerCase().replace(/[^\u4e00-\u9fa5a-z0-9]+/g, ' ');
  const wangymTokens = new Set();
  for (const wangymWord of wangymClean.split(' ')) {
    if (!wangymWord) continue;
    if (/^[a-z0-9]+$/.test(wangymWord)) {
      if (wangymWord.length > 1) wangymTokens.add(wangymWord);
      continue;
    }
    for (let wangymIndex = 0; wangymIndex < wangymWord.length - 1; wangymIndex++) {
      wangymTokens.add(wangymWord.slice(wangymIndex, wangymIndex + 2));
    }
  }
  return [...wangymTokens];
}

function wangymScoreChunk(wangymQuestion, wangymTokens, wangymChunk) {
  const wangymContent = String(wangymChunk.wangym_content || '').toLowerCase();
  let wangymScore = 0;
  for (const wangymToken of wangymTokens) {
    if (wangymContent.includes(wangymToken)) {
      wangymScore += wangymToken.length > 1 ? 2 : 1;
    }
  }
  if (wangymQuestion && wangymContent.includes(wangymQuestion.toLowerCase())) {
    wangymScore += 6;
  }
  return wangymScore;
}

// 列出知识库
async function wangymListKbs(wangymReq, wangymRes) {
  try {
    const wangymRows = await wangymKbModel.wangymListKb();
    console.log('[wangym_kb] 知识库列表查询成功，共', wangymRows.length, '个');
    wangymRes.json({ code: 0, msg: '查询成功', data: { wangym_list: wangymRows } });
  } catch (wangymErr) {
    console.error('[wangym_kb] 查询知识库失败：', wangymErr.message);
    wangymFail(wangymRes, '查询知识库失败：' + wangymErr.message);
  }
}

// 新建知识库
async function wangymCreateKb(wangymReq, wangymRes) {
  try {
    const wangymName = String(wangymReq.body.wangym_name || '').trim();
    const wangymDescription = String(wangymReq.body.wangym_description || '').trim();
    if (!wangymName) {
      return wangymFail(wangymRes, '知识库名称不能为空');
    }
    const wangymId = await wangymKbModel.wangymCreateKb(wangymName, wangymDescription);
    console.log('[wangym_kb] 新建知识库成功：', { wangymId, wangymName });
    wangymRes.json({ code: 0, msg: '创建成功', data: { wangym_id: wangymId } });
  } catch (wangymErr) {
    console.error('[wangym_kb] 新建知识库失败：', wangymErr.message);
    wangymFail(wangymRes, '新建知识库失败：' + wangymErr.message);
  }
}

// 删除知识库
async function wangymDeleteKb(wangymReq, wangymRes) {
  try {
    const wangymId = Number(wangymReq.params.id);
    if (!wangymId) {
      return wangymFail(wangymRes, '知识库 ID 不合法');
    }
    const wangymKb = await wangymKbModel.wangymGetKb(wangymId);
    if (!wangymKb) {
      return wangymFail(wangymRes, '知识库不存在');
    }
    await wangymKbModel.wangymDeleteKb(wangymId);
    console.log('[wangym_kb] 删除知识库成功：', wangymId);
    wangymRes.json({ code: 0, msg: '删除成功', data: { wangym_id: wangymId } });
  } catch (wangymErr) {
    console.error('[wangym_kb] 删除知识库失败：', wangymErr.message);
    wangymFail(wangymRes, '删除知识库失败：' + wangymErr.message);
  }
}

// 文件列表
async function wangymListKbFiles(wangymReq, wangymRes) {
  try {
    const wangymId = Number(wangymReq.params.id);
    if (!wangymId) {
      return wangymFail(wangymRes, '知识库 ID 不合法');
    }
    const wangymFiles = await wangymKbModel.wangymListFiles(wangymId);
    console.log('[wangym_kb] 知识库', wangymId, '文件数量：', wangymFiles.length);
    wangymRes.json({ code: 0, msg: '查询成功', data: { wangym_list: wangymFiles } });
  } catch (wangymErr) {
    console.error('[wangym_kb] 查询文件失败：', wangymErr.message);
    wangymFail(wangymRes, '查询文件失败：' + wangymErr.message);
  }
}

// 上传文件（Base64 JSON），解析后切片入库
async function wangymUploadKbFile(wangymReq, wangymRes) {
  try {
    const wangymKbId = Number(wangymReq.params.id);
    const wangymFileName = String(wangymReq.body.wangym_file_name || '').trim();
    const wangymFileBase64 = String(wangymReq.body.wangym_file_base64 || '');

    if (!wangymKbId) {
      return wangymFail(wangymRes, '知识库 ID 不合法');
    }
    if (!wangymFileName || !wangymFileBase64) {
      return wangymFail(wangymRes, '缺少文件名或文件内容');
    }

    const wangymKb = await wangymKbModel.wangymGetKb(wangymKbId);
    if (!wangymKb) {
      return wangymFail(wangymRes, '知识库不存在');
    }

    const wangymRaw = wangymFileBase64.replace(/^data:[^;]+;base64,/, '');
    const wangymBuffer = Buffer.from(wangymRaw, 'base64');
    if (wangymBuffer.length > WANGYM_MAX_FILE_SIZE) {
      return wangymFail(wangymRes, '文件超过 8MB 限制');
    }

    const wangymFileType = (wangymFileName.split('.').pop() || '').toLowerCase();
    console.log('[wangym_kb] 开始解析文件：', { wangymFileName, wangymBytes: wangymBuffer.length });

    const wangymText = await wangymParseBuffer(wangymBuffer, wangymFileName);
    const wangymChunks = wangymSplitChunks(wangymText);
    if (!wangymChunks.length) {
      return wangymFail(wangymRes, '未能从文件中解析出有效文本');
    }

    const wangymFileId = await wangymKbModel.wangymInsertFile(
      wangymKbId,
      wangymFileName,
      wangymFileType,
      wangymBuffer.length,
      wangymChunks.length
    );
    await wangymKbModel.wangymInsertChunks(wangymKbId, wangymFileId, wangymChunks);

    console.log('[wangym_kb] 文件入库完成：', {
      wangymFileId,
      wangymChunkCount: wangymChunks.length,
      wangymPreview: wangymChunks[0].slice(0, 60)
    });

    wangymRes.json({
      code: 0,
      msg: '上传并解析成功',
      data: {
        wangym_id: wangymFileId,
        wangym_file_name: wangymFileName,
        wangym_file_type: wangymFileType,
        wangym_file_size: wangymBuffer.length,
        wangym_chunk_count: wangymChunks.length,
        wangym_preview: wangymChunks[0].slice(0, 120)
      }
    });
  } catch (wangymErr) {
    console.error('[wangym_kb] 文件解析失败：', wangymErr.message);
    wangymFail(wangymRes, '文件解析失败：' + wangymErr.message);
  }
}

// 删除文件
async function wangymDeleteKbFile(wangymReq, wangymRes) {
  try {
    const wangymFileId = Number(wangymReq.params.fileId);
    if (!wangymFileId) {
      return wangymFail(wangymRes, '文件 ID 不合法');
    }
    await wangymKbModel.wangymDeleteFile(wangymFileId);
    console.log('[wangym_kb] 删除文件成功：', wangymFileId);
    wangymRes.json({ code: 0, msg: '删除成功', data: { wangym_id: wangymFileId } });
  } catch (wangymErr) {
    console.error('[wangym_kb] 删除文件失败：', wangymErr.message);
    wangymFail(wangymRes, '删除文件失败：' + wangymErr.message);
  }
}

// RAG 问答：检索切片 → 拼装提示词 → 调用大模型
async function wangymAskKb(wangymReq, wangymRes) {
  try {
    const wangymKbId = Number(wangymReq.body.wangym_kb_id);
    const wangymQuestion = String(wangymReq.body.wangym_question || '').trim();

    if (!wangymKbId || !wangymQuestion) {
      return wangymFail(wangymRes, '知识库 ID 和问题都不能为空');
    }

    const wangymKb = await wangymKbModel.wangymGetKb(wangymKbId);
    if (!wangymKb) {
      return wangymFail(wangymRes, '知识库不存在');
    }

    const wangymChunks = await wangymKbModel.wangymGetChunks(wangymKbId);
    if (!wangymChunks.length) {
      return wangymFail(wangymRes, '该知识库还没有文件，请先上传');
    }

    const wangymTokens = wangymTokenize(wangymQuestion);
    const wangymRanked = wangymChunks
      .map((wangymChunk) => ({
        ...wangymChunk,
        wangym_score: wangymScoreChunk(wangymQuestion, wangymTokens, wangymChunk)
      }))
      .sort((wangymA, wangymB) => wangymB.wangym_score - wangymA.wangym_score);

    const wangymTop = wangymRanked.filter((wangymItem) => wangymItem.wangym_score > 0).slice(0, 3);
    console.log('[wangym_kb] 检索到切片：', wangymTop.map((wangymItem) => ({
      wangymFile: wangymItem.wangym_file_name,
      wangymScore: wangymItem.wangym_score
    })));

    if (!wangymTop.length) {
      return wangymRes.json({
        code: 0,
        msg: '未在知识库中找到相关内容',
        data: { wangym_answer: '知识库中没有检索到与该问题相关的内容，请换个问法或先上传相关资料。', wangym_sources: [] }
      });
    }

    const wangymContext = wangymTop
      .map((wangymItem, wangymIndex) => `【资料${wangymIndex + 1}｜${wangymItem.wangym_file_name}】\n${wangymItem.wangym_content}`)
      .join('\n\n');

    const wangymMessages = [
      {
        role: 'system',
        content: '你是知识库问答助手。只能依据用户提供的资料回答问题，回答要简洁、条理清晰；如果资料中没有答案，请明确说明“知识库中未找到相关内容”，不要编造。'
      },
      {
        role: 'user',
        content: `资料：\n${wangymContext}\n\n问题：${wangymQuestion}\n\n请依据上述资料作答，并在结尾用“参考：”列出用到的资料编号。`
      }
    ];

    const wangymPayload = { model: WANGYM_MODEL, messages: wangymMessages, temperature: 0.3, max_tokens: 1024, stream: false };
    console.log('[wangym_kb] 发送给大模型的数据：', JSON.stringify(wangymPayload, null, 2));

    const wangymResponse = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + process.env.SILICONFLOW_API_KEY
      },
      body: JSON.stringify(wangymPayload)
    });

    if (!wangymResponse.ok) {
      const wangymErrorText = await wangymResponse.text();
      console.error('[wangym_kb] 大模型接口返回错误：', wangymResponse.status, wangymErrorText);
      return wangymFail(wangymRes, '大模型调用失败：大模型接口返回状态码 ' + wangymResponse.status);
    }

    const wangymResult = await wangymResponse.json();
    console.log('[wangym_kb] 从大模型接收到的数据：', JSON.stringify(wangymResult, null, 2));

    const wangymAnswer = (wangymResult.choices && wangymResult.choices[0] && wangymResult.choices[0].message.content) || '';

    wangymRes.json({
      code: 0,
      msg: '问答成功',
      data: {
        wangym_answer: wangymAnswer,
        wangym_model: wangymResult.model || WANGYM_MODEL,
        wangym_usage: wangymResult.usage || null,
        wangym_sources: wangymTop.map((wangymItem) => ({
          wangym_file_name: wangymItem.wangym_file_name,
          wangym_chunk_index: wangymItem.wangym_chunk_index,
          wangym_score: wangymItem.wangym_score,
          wangym_snippet: wangymItem.wangym_content.slice(0, 120)
        }))
      }
    });
  } catch (wangymErr) {
    console.error('[wangym_kb] RAG 问答失败：', wangymErr.message);
    wangymFail(wangymRes, '问答失败：' + wangymErr.message);
  }
}

module.exports = {
  wangymListKbs,
  wangymCreateKb,
  wangymDeleteKb,
  wangymListKbFiles,
  wangymUploadKbFile,
  wangymDeleteKbFile,
  wangymAskKb
};
