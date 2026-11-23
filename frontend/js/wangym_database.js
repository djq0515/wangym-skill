// 姓名：王一鸣 | 学号：24002060518 | 时间：2026-11-23 | 大模型：DeepSeek-V4.1-Flash
// 数据库连接测试页：提交表单并展示后端返回结果
(function () {
  var wangymDbForm = document.getElementById('wangym_db_form');
  var wangymDbState = document.getElementById('wangym_db_state');
  var wangymDbSubmit = document.getElementById('wangym_db_submit');

  function wangymSetState(wangymType, wangymTitle, wangymDetail) {
    wangymDbState.className = 'wangym_state is_show ' + wangymType;
    wangymDbState.innerHTML = '';

    var wangymTitleNode = document.createElement('div');
    wangymTitleNode.className = 'wangym_state_title';
    wangymTitleNode.textContent = wangymTitle;

    var wangymDetailNode = document.createElement('div');
    wangymDetailNode.className = 'wangym_state_detail';
    wangymDetailNode.textContent = wangymDetail;

    wangymDbState.appendChild(wangymTitleNode);
    wangymDbState.appendChild(wangymDetailNode);
  }

  async function wangymHandleSubmit(wangymEvent) {
    wangymEvent.preventDefault();

    var wangymPayload = {
      username: document.getElementById('wangym_username').value.trim(),
      password: document.getElementById('wangym_password').value,
      database: document.getElementById('wangym_database').value.trim()
    };
    console.log('[wangym_database] 提交的请求参数：', wangymPayload);

    if (!wangymPayload.username || !wangymPayload.database) {
      wangymSetState('is_error', '参数不完整', '用户名和数据库名不能为空。');
      console.error('[wangym_database] 参数不完整', wangymPayload);
      return;
    }

    wangymDbSubmit.disabled = true;
    wangymDbSubmit.textContent = '连接中...';

    try {
      var wangymResponse = await fetch('/api/database/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(wangymPayload)
      });
      var wangymResult = await wangymResponse.json();
      console.log('[wangym_database] 接口返回：', wangymResult);

      if (wangymResult.code === 0) {
        var wangymData = wangymResult.data || {};
        wangymSetState(
          'is_success',
          '数据库连接成功',
          'MySQL 版本：' + (wangymData.wangym_version || '-') +
            '\n当前用户：' + (wangymData.wangym_user || '-') +
            '\n当前数据库：' + (wangymData.wangym_database || '-')
        );
      } else {
        wangymSetState('is_error', '数据库连接失败', wangymResult.msg || '未知错误');
        console.error('[wangym_database] 连接失败：', wangymResult.msg);
      }
    } catch (wangymErr) {
      wangymSetState('is_error', '请求异常', wangymErr.message);
      console.error('[wangym_database] 请求出错：', wangymErr.message);
    } finally {
      wangymDbSubmit.disabled = false;
      wangymDbSubmit.textContent = '连接数据库';
    }
  }

  wangymDbForm.addEventListener('submit', wangymHandleSubmit);
})();
