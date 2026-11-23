// 姓名：王一鸣 | 学号：24002060518 | 时间：2026-11-23 | 大模型：DeepSeek-V4.1-Flash
// 科技新闻列表：请求后端接口并渲染
(function () {
  var wangymNewsApi = '/api/news';
  var wangymNewsContainer = document.getElementById('wangym_news_container');

  // 将时间格式化为 yyyy-mm-dd hh:mm
  function wangymFormatTime(wangymValue) {
    if (!wangymValue) {
      return '-';
    }
    var wangymDate = new Date(wangymValue);
    if (isNaN(wangymDate.getTime())) {
      return String(wangymValue);
    }
    function wangymPad(wangymNum) {
      return wangymNum < 10 ? '0' + wangymNum : String(wangymNum);
    }
    return wangymDate.getFullYear() + '-' + wangymPad(wangymDate.getMonth() + 1) + '-' + wangymPad(wangymDate.getDate()) +
      ' ' + wangymPad(wangymDate.getHours()) + ':' + wangymPad(wangymDate.getMinutes());
  }

  function wangymShowError(wangymMessage) {
    wangymNewsContainer.innerHTML = '';
    var wangymBox = document.createElement('div');
    wangymBox.className = 'wangym_state is_error is_show';
    var wangymTitle = document.createElement('div');
    wangymTitle.className = 'wangym_state_title';
    wangymTitle.textContent = '新闻加载失败';
    var wangymDetail = document.createElement('div');
    wangymDetail.className = 'wangym_state_detail';
    wangymDetail.textContent = wangymMessage;
    wangymBox.appendChild(wangymTitle);
    wangymBox.appendChild(wangymDetail);
    wangymNewsContainer.appendChild(wangymBox);
  }

  function wangymRenderNews(wangymList) {
    wangymNewsContainer.innerHTML = '';
    if (!wangymList || wangymList.length === 0) {
      var wangymEmpty = document.createElement('div');
      wangymEmpty.className = 'wangym_empty';
      wangymEmpty.textContent = '暂无新闻数据';
      wangymNewsContainer.appendChild(wangymEmpty);
      return;
    }

    wangymList.forEach(function (wangymItem) {
      var wangymArticle = document.createElement('article');
      wangymArticle.className = 'wangym_card wangym_news_item';

      var wangymMeta = document.createElement('div');
      wangymMeta.className = 'wangym_news_meta';
      var wangymSource = document.createElement('span');
      wangymSource.className = 'wangym_news_source';
      wangymSource.textContent = wangymItem.wangym_source;
      var wangymTime = document.createElement('span');
      wangymTime.textContent = '发布时间：' + wangymFormatTime(wangymItem.wangym_publish_time);
      wangymMeta.appendChild(wangymSource);
      wangymMeta.appendChild(wangymTime);

      var wangymTitle = document.createElement('h2');
      wangymTitle.className = 'wangym_news_title';
      var wangymTitleLink = document.createElement('a');
      wangymTitleLink.href = wangymItem.wangym_url;
      wangymTitleLink.target = '_blank';
      wangymTitleLink.rel = 'noopener';
      wangymTitleLink.textContent = wangymItem.wangym_title;
      wangymTitle.appendChild(wangymTitleLink);

      var wangymSummary = document.createElement('p');
      wangymSummary.className = 'wangym_news_summary';
      wangymSummary.textContent = wangymItem.wangym_summary;

      var wangymFoot = document.createElement('div');
      wangymFoot.className = 'wangym_news_foot';
      var wangymViews = document.createElement('span');
      wangymViews.textContent = '阅读 ' + wangymItem.wangym_views + ' 次';
      var wangymOrigin = document.createElement('a');
      wangymOrigin.href = wangymItem.wangym_url;
      wangymOrigin.target = '_blank';
      wangymOrigin.rel = 'noopener';
      wangymOrigin.textContent = '查看原文 →';
      wangymFoot.appendChild(wangymViews);
      wangymFoot.appendChild(wangymOrigin);

      wangymArticle.appendChild(wangymMeta);
      wangymArticle.appendChild(wangymTitle);
      wangymArticle.appendChild(wangymSummary);
      wangymArticle.appendChild(wangymFoot);
      wangymNewsContainer.appendChild(wangymArticle);
    });
  }

  async function wangymLoadNews() {
    try {
      var wangymResponse = await fetch(wangymNewsApi);
      var wangymResult = await wangymResponse.json();
      console.log('[wangym_news] 接口返回：', wangymResult);
      if (!wangymResponse.ok || wangymResult.code !== 0) {
        throw new Error(wangymResult.msg || ('请求失败，状态码 ' + wangymResponse.status));
      }
      wangymRenderNews(wangymResult.data);
    } catch (wangymErr) {
      console.error('[wangym_news] 请求出错：', wangymErr.message);
      wangymShowError(wangymErr.message);
    }
  }

  wangymLoadNews();
})();
