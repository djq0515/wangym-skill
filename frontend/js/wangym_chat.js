// 姓名：王一鸣 | 学号：24002060518 | 时间：2026-11-23 | 大模型：DeepSeek-V4.1-Flash
// AI 聊天 / 在线客服共用脚本：发送消息到 /api/chat 并渲染对话
(function () {
  var wangymBox = document.getElementById('wangym_chat_box');
  if (!wangymBox) {
    return;
  }

  var wangymMessagesEl = document.getElementById('wangym_chat_messages');
  var wangymForm = document.getElementById('wangym_chat_form');
  var wangymInput = document.getElementById('wangym_chat_input');
  var wangymSendBtn = document.getElementById('wangym_chat_send');

  var wangymProvider = wangymBox.dataset.provider || 'siliconflow';
  var wangymSystem = wangymBox.dataset.system || '你是一个有用的助手。';
  var wangymWelcome = wangymBox.dataset.welcome || '你好，有什么可以帮你？';
  var wangymHistory = [{ role: 'system', content: wangymSystem }];
  var wangymSending = false;

  function wangymScrollBottom() {
    wangymMessagesEl.scrollTop = wangymMessagesEl.scrollHeight;
  }

  function wangymAppendMessage(wangymRole, wangymText) {
    var wangymRow = document.createElement('div');
    wangymRow.className = 'wangym_chat_msg ' + (wangymRole === 'user' ? 'is_user' : 'is_ai');

    var wangymBubble = document.createElement('div');
    wangymBubble.className = 'wangym_chat_bubble';
    wangymBubble.textContent = wangymText;

    wangymRow.appendChild(wangymBubble);
    wangymMessagesEl.appendChild(wangymRow);
    wangymScrollBottom();
    return wangymRow;
  }

  function wangymAppendError(wangymText) {
    var wangymRow = wangymAppendMessage('ai', wangymText);
    wangymRow.classList.add('is_error');
  }

  async function wangymSendMessage(wangymText) {
    wangymSending = true;
    wangymSendBtn.disabled = true;
    wangymSendBtn.textContent = '发送中...';

    wangymAppendMessage('user', wangymText);
    wangymHistory.push({ role: 'user', content: wangymText });

    var wangymTyping = wangymAppendMessage('ai', '正在思考...');
    wangymTyping.classList.add('is_typing');

    var wangymPayload = { provider: wangymProvider, messages: wangymHistory };
    console.log('[wangym_chat] 发送给后端的数据：', wangymPayload);

    try {
      var wangymResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(wangymPayload)
      });
      var wangymResult = await wangymResponse.json();
      console.log('[wangym_chat] 从后端接收到的数据：', wangymResult);

      wangymTyping.remove();

      if (wangymResult.code !== 0) {
        throw new Error(wangymResult.msg || '对话失败');
      }

      var wangymReply = (wangymResult.data && wangymResult.data.wangym_reply) || '（模型没有返回内容）';
      wangymAppendMessage('ai', wangymReply);
      wangymHistory.push({ role: 'assistant', content: wangymReply });
    } catch (wangymErr) {
      if (wangymTyping.parentNode) {
        wangymTyping.remove();
      }
      console.error('[wangym_chat] 请求出错：', wangymErr.message);
      wangymAppendError('发送失败：' + wangymErr.message);
    } finally {
      wangymSending = false;
      wangymSendBtn.disabled = false;
      wangymSendBtn.textContent = '发送';
      wangymInput.focus();
    }
  }

  wangymForm.addEventListener('submit', function (wangymEvent) {
    wangymEvent.preventDefault();
    var wangymText = wangymInput.value.trim();
    if (!wangymText || wangymSending) {
      return;
    }
    wangymInput.value = '';
    wangymSendMessage(wangymText);
  });

  wangymInput.addEventListener('keydown', function (wangymEvent) {
    if (wangymEvent.key === 'Enter' && !wangymEvent.shiftKey) {
      wangymEvent.preventDefault();
      wangymForm.requestSubmit();
    }
  });

  wangymAppendMessage('ai', wangymWelcome);
  console.log('[wangym_chat] 页面初始化完成，provider=' + wangymProvider);
})();
