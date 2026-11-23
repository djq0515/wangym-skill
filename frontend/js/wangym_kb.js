// 姓名：王一鸣 | 学号：24002060518 | 时间：2026-11-23 | 大模型：DeepSeek-V4.1-Flash
// 知识库管理（RAG）页面逻辑
const wangymKbState = { wangymKbId: null, wangymKbs: [] };

const wangymKbListEl = document.getElementById('wangym_kb_list');
const wangymKbCurrentEl = document.getElementById('wangym_kb_current');
const wangymKbFilesEl = document.getElementById('wangym_kb_files');
const wangymKbAnswerEl = document.getElementById('wangym_kb_answer');
const wangymKbFileInput = document.getElementById('wangym_kb_file');
const wangymKbUploadBox = document.getElementById('wangym_kb_upload_box');

// 统一请求封装，响应与错误都输出到控制台
async function wangymKbRequest(wangymUrl, wangymOptions = {}) {
  const wangymResponse = await fetch(wangymUrl, wangymOptions);
  const wangymData = await wangymResponse.json();
  console.log('[wangym_kb] 接口响应：', wangymUrl, wangymData);
  if (wangymData.code !== 0) {
    console.error('[wangym_kb] 接口失败：', wangymData.msg);
    throw new Error(wangymData.msg || '接口调用失败');
  }
  return wangymData.data;
}

function wangymFormatSize(wangymBytes) {
  if (wangymBytes < 1024) return wangymBytes + ' B';
  if (wangymBytes < 1024 * 1024) return (wangymBytes / 1024).toFixed(1) + ' KB';
  return (wangymBytes / 1024 / 1024).toFixed(1) + ' MB';
}

// 加载知识库列表
async function wangymLoadKbs() {
  try {
    const wangymData = await wangymKbRequest('/api/kb/list');
    wangymKbState.wangymKbs = wangymData.wangym_list;
    wangymKbListEl.innerHTML = '';

    if (!wangymKbState.wangymKbs.length) {
      wangymKbListEl.innerHTML = '<p class="wangym_kb_empty">暂无知识库，请先新建。</p>';
      return;
    }

    wangymKbState.wangymKbs.forEach((wangymItem) => {
      const wangymNode = document.createElement('div');
      wangymNode.className = 'wangym_kb_item' + (wangymItem.wangym_id === wangymKbState.wangymKbId ? ' is_active' : '');
      wangymNode.dataset.wangymId = wangymItem.wangym_id;
      wangymNode.innerHTML =
        '<div class="wangym_kb_item_head">' +
        '<strong>' + wangymItem.wangym_name + '</strong>' +
        '<button class="wangym_kb_del" type="button" title="删除知识库">删除</button>' +
        '</div>' +
        '<p class="wangym_kb_item_desc">' + (wangymItem.wangym_description || '暂无说明') + '</p>' +
        '<p class="wangym_kb_item_meta">文件 ' + wangymItem.wangym_file_count + ' 个 · 切片 ' + wangymItem.wangym_chunk_count + ' 条</p>';

      wangymNode.addEventListener('click', (wangymEvent) => {
        if (wangymEvent.target.classList.contains('wangym_kb_del')) return;
        wangymSelectKb(wangymItem);
      });

      wangymNode.querySelector('.wangym_kb_del').addEventListener('click', async (wangymEvent) => {
        wangymEvent.stopPropagation();
        if (!confirm('确定删除知识库「' + wangymItem.wangym_name + '」及其全部文件吗？')) return;
        try {
          await wangymKbRequest('/api/kb/' + wangymItem.wangym_id, { method: 'DELETE' });
          if (wangymKbState.wangymKbId === wangymItem.wangym_id) {
            wangymKbState.wangymKbId = null;
            wangymKbCurrentEl.textContent = '请选择一个知识库';
            wangymKbFilesEl.innerHTML = '';
            wangymKbAnswerEl.innerHTML = '';
            wangymKbUploadBox.classList.add('is_disabled');
          }
          wangymLoadKbs();
        } catch (wangymErr) {
          alert(wangymErr.message);
        }
      });

      wangymKbListEl.appendChild(wangymNode);
    });
  } catch (wangymErr) {
    console.error('[wangym_kb] 加载知识库失败：', wangymErr.message);
    wangymKbListEl.innerHTML = '<p class="wangym_kb_empty">加载失败：' + wangymErr.message + '</p>';
  }
}

// 选择知识库并加载文件
async function wangymSelectKb(wangymKb) {
  wangymKbState.wangymKbId = wangymKb.wangym_id;
  wangymKbCurrentEl.textContent = wangymKb.wangym_name;
  wangymKbUploadBox.classList.remove('is_disabled');
  wangymKbAnswerEl.innerHTML = '';
  document.querySelectorAll('.wangym_kb_item').forEach((wangymNode) => {
    wangymNode.classList.toggle('is_active', Number(wangymNode.dataset.wangymId) === wangymKb.wangym_id);
  });
  await wangymLoadFiles();
}

// 加载文件列表
async function wangymLoadFiles() {
  if (!wangymKbState.wangymKbId) return;
  try {
    const wangymData = await wangymKbRequest('/api/kb/' + wangymKbState.wangymKbId + '/files');
    wangymKbFilesEl.innerHTML = '';

    if (!wangymData.wangym_list.length) {
      wangymKbFilesEl.innerHTML = '<p class="wangym_kb_empty">还没有文件，请上传知识库文件。</p>';
      return;
    }

    const wangymTable = document.createElement('table');
    wangymTable.className = 'wangym_kb_table';
    wangymTable.innerHTML =
      '<thead><tr><th>文件名</th><th>类型</th><th>大小</th><th>切片</th><th>操作</th></tr></thead><tbody></tbody>';
    const wangymBody = wangymTable.querySelector('tbody');

    wangymData.wangym_list.forEach((wangymFile) => {
      const wangymTr = document.createElement('tr');
      wangymTr.innerHTML =
        '<td>' + wangymFile.wangym_file_name + '</td>' +
        '<td>' + wangymFile.wangym_file_type + '</td>' +
        '<td>' + wangymFormatSize(wangymFile.wangym_file_size) + '</td>' +
        '<td>' + wangymFile.wangym_chunk_count + '</td>' +
        '<td><button class="wangym_kb_del" type="button">删除</button></td>';

      wangymTr.querySelector('.wangym_kb_del').addEventListener('click', async () => {
        if (!confirm('确定删除文件「' + wangymFile.wangym_file_name + '」吗？')) return;
        try {
          await wangymKbRequest('/api/kb/file/' + wangymFile.wangym_id, { method: 'DELETE' });
          await wangymLoadFiles();
          wangymLoadKbs();
        } catch (wangymErr) {
          alert(wangymErr.message);
        }
      });

      wangymBody.appendChild(wangymTr);
    });

    wangymKbFilesEl.appendChild(wangymTable);
  } catch (wangymErr) {
    console.error('[wangym_kb] 加载文件失败：', wangymErr.message);
    wangymKbFilesEl.innerHTML = '<p class="wangym_kb_empty">加载失败：' + wangymErr.message + '</p>';
  }
}

// 读取文件为 Base64
function wangymReadFileBase64(wangymFile) {
  return new Promise((wangymResolve, wangymReject) => {
    const wangymReader = new FileReader();
    wangymReader.onload = () => wangymResolve(String(wangymReader.result).split(',')[1] || '');
    wangymReader.onerror = () => wangymReject(new Error('读取文件失败'));
    wangymReader.readAsDataURL(wangymFile);
  });
}

// 上传文件
wangymKbFileInput.addEventListener('change', async () => {
  if (!wangymKbState.wangymKbId) {
    alert('请先选择知识库');
    return;
  }
  const wangymFiles = Array.from(wangymKbFileInput.files || []);
  for (const wangymFile of wangymFiles) {
    try {
      console.log('[wangym_kb] 准备上传：', wangymFile.name, wangymFile.size);
      const wangymBase64 = await wangymReadFileBase64(wangymFile);
      const wangymData = await wangymKbRequest('/api/kb/' + wangymKbState.wangymKbId + '/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wangym_file_name: wangymFile.name, wangym_file_base64: wangymBase64 })
      });
      console.log('[wangym_kb] 上传成功：', wangymData);
    } catch (wangymErr) {
      console.error('[wangym_kb] 上传失败：', wangymFile.name, wangymErr.message);
      alert(wangymFile.name + ' 上传失败：' + wangymErr.message);
    }
  }
  wangymKbFileInput.value = '';
  await wangymLoadFiles();
  wangymLoadKbs();
});

// 新建知识库
document.getElementById('wangym_kb_create_form').addEventListener('submit', async (wangymEvent) => {
  wangymEvent.preventDefault();
  const wangymName = document.getElementById('wangym_kb_name').value.trim();
  const wangymDesc = document.getElementById('wangym_kb_desc').value.trim();
  if (!wangymName) return;
  try {
    await wangymKbRequest('/api/kb/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wangym_name: wangymName, wangym_description: wangymDesc })
    });
    document.getElementById('wangym_kb_name').value = '';
    document.getElementById('wangym_kb_desc').value = '';
    await wangymLoadKbs();
  } catch (wangymErr) {
    alert(wangymErr.message);
  }
});

// RAG 问答
document.getElementById('wangym_kb_ask_form').addEventListener('submit', async (wangymEvent) => {
  wangymEvent.preventDefault();
  if (!wangymKbState.wangymKbId) {
    alert('请先选择知识库');
    return;
  }
  const wangymQuestion = document.getElementById('wangym_kb_question').value.trim();
  if (!wangymQuestion) return;

  wangymKbAnswerEl.innerHTML = '<p class="wangym_kb_empty">正在检索并生成回答…</p>';

  try {
    const wangymData = await wangymKbRequest('/api/kb/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wangym_kb_id: wangymKbState.wangymKbId, wangym_question: wangymQuestion })
    });

    console.log('[wangym_kb] 问答结果：', wangymData);

    const wangymSources = (wangymData.wangym_sources || [])
      .map((wangymSource) =>
        '<li><strong>' + wangymSource.wangym_file_name + '</strong>（匹配分 ' + wangymSource.wangym_score + '）<br />' +
        '<span>' + wangymSource.wangym_snippet + '…</span></li>'
      )
      .join('');

    wangymKbAnswerEl.innerHTML =
      '<div class="wangym_kb_reply"><h3>回答</h3><p>' + String(wangymData.wangym_answer || '').replace(/\n/g, '<br />') + '</p>' +
      '<p class="wangym_kb_meta">模型：' + (wangymData.wangym_model || '-') + '</p></div>' +
      (wangymSources ? '<div class="wangym_kb_sources"><h3>引用资料</h3><ul>' + wangymSources + '</ul></div>' : '');
  } catch (wangymErr) {
    console.error('[wangym_kb] 问答失败：', wangymErr.message);
    wangymKbAnswerEl.innerHTML = '<p class="wangym_kb_empty">问答失败：' + wangymErr.message + '</p>';
  }
});

wangymKbUploadBox.classList.add('is_disabled');
wangymLoadKbs();
