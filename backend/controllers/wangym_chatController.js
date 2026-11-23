// 姓名：王一鸣 | 学号：24002060518 | 时间：2026-11-23 | 大模型：DeepSeek-V4.1-Flash
// AI 聊天控制器：转发请求到硅基流动 / 七牛（OpenAI 兼容接口），并在控制台输出收发数据
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const wangymProviders = {
  siliconflow: {
    wangymUrl: 'https://api.siliconflow.cn/v1/chat/completions',
    wangymKeyEnv: 'SILICONFLOW_API_KEY',
    wangymModelEnv: 'SILICONFLOW_MODEL',
    wangymDefaultModel: 'deepseek-ai/DeepSeek-V4-Flash'
  },
  qiniu: {
    wangymUrl: 'https://api.qnaigc.com/v1/chat/completions',
    wangymKeyEnv: 'QINIU_API_KEY',
    wangymModelEnv: 'QINIU_MODEL',
    wangymDefaultModel: 'qiniu/conatus-free'
  }
};

// POST /api/chat 发送对话消息给大模型
async function wangymChat(wangymReq, wangymRes) {
  const wangymBody = wangymReq.body || {};
  const wangymProviderName = String(wangymBody.provider || 'siliconflow');
  const wangymMessages = wangymBody.messages;

  if (!Array.isArray(wangymMessages) || wangymMessages.length === 0) {
    return wangymRes.json({ code: 1, msg: 'messages 不能为空', data: null });
  }

  const wangymProvider = wangymProviders[wangymProviderName];
  if (!wangymProvider) {
    return wangymRes.json({ code: 1, msg: '不支持的模型提供方：' + wangymProviderName, data: null });
  }

  const wangymApiKey = process.env[wangymProvider.wangymKeyEnv];
  if (!wangymApiKey) {
    return wangymRes.json({
      code: 1,
      msg: '未配置 API Key，请在 backend/.env 中填写 ' + wangymProvider.wangymKeyEnv,
      data: null
    });
  }

  const wangymModel = process.env[wangymProvider.wangymModelEnv] || wangymProvider.wangymDefaultModel;
  const wangymPayload = { model: wangymModel, messages: wangymMessages, stream: false };

  console.log('[wangym_chat] 发送给大模型的数据（' + wangymProviderName + '）：', JSON.stringify(wangymPayload));

  try {
    const wangymResponse = await fetch(wangymProvider.wangymUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + wangymApiKey
      },
      body: JSON.stringify(wangymPayload),
      signal: AbortSignal.timeout(60000)
    });

    const wangymResult = await wangymResponse.json();
    console.log('[wangym_chat] 从大模型接收到的数据（' + wangymProviderName + '）：', JSON.stringify(wangymResult));

    if (!wangymResponse.ok) {
      const wangymMessage = (wangymResult.error && wangymResult.error.message) || ('大模型接口返回状态码 ' + wangymResponse.status);
      return wangymRes.json({ code: 1, msg: '大模型调用失败：' + wangymMessage, data: null });
    }

    const wangymReply = wangymResult.choices && wangymResult.choices[0] && wangymResult.choices[0].message
      ? wangymResult.choices[0].message.content
      : '';

    wangymRes.json({
      code: 0,
      msg: '对话成功',
      data: {
        wangym_reply: wangymReply,
        wangym_model: wangymResult.model || wangymModel,
        wangym_usage: wangymResult.usage || null
      }
    });
  } catch (wangymErr) {
    console.error('[wangym_chat] 调用异常：', wangymErr.message);
    wangymRes.json({ code: 1, msg: '大模型调用异常：' + wangymErr.message, data: null });
  }
}

module.exports = { wangymChat };
