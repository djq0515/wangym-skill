// 姓名：王一鸣 | 学号：24002060518 | 时间：2026-11-23 | 大模型：DeepSeek-V4.1-Flash
// 图文列表：请求后端接口并渲染卡片
(function () {
  var wangymGalleryApi = '/api/gallery';
  var wangymGalleryContainer = document.getElementById('wangym_gallery_container');

  function wangymShowError(wangymMessage) {
    wangymGalleryContainer.innerHTML = '';
    var wangymBox = document.createElement('div');
    wangymBox.className = 'wangym_state is_error is_show';
    var wangymTitle = document.createElement('div');
    wangymTitle.className = 'wangym_state_title';
    wangymTitle.textContent = '图文加载失败';
    var wangymDetail = document.createElement('div');
    wangymDetail.className = 'wangym_state_detail';
    wangymDetail.textContent = wangymMessage;
    wangymBox.appendChild(wangymTitle);
    wangymBox.appendChild(wangymDetail);
    wangymGalleryContainer.appendChild(wangymBox);
  }

  function wangymRenderGallery(wangymList) {
    wangymGalleryContainer.innerHTML = '';
    if (!wangymList || wangymList.length === 0) {
      var wangymEmpty = document.createElement('div');
      wangymEmpty.className = 'wangym_empty';
      wangymEmpty.textContent = '暂无图文数据';
      wangymGalleryContainer.appendChild(wangymEmpty);
      return;
    }

    wangymList.forEach(function (wangymItem) {
      var wangymCard = document.createElement('article');
      wangymCard.className = 'wangym_card wangym_gallery_card';

      var wangymCover = document.createElement('img');
      wangymCover.className = 'wangym_gallery_cover';
      wangymCover.src = wangymItem.wangym_image_url;
      wangymCover.alt = wangymItem.wangym_title;
      wangymCover.loading = 'lazy';

      var wangymBody = document.createElement('div');
      wangymBody.className = 'wangym_gallery_body';

      var wangymTitle = document.createElement('h2');
      wangymTitle.className = 'wangym_gallery_title';
      wangymTitle.textContent = wangymItem.wangym_title;

      var wangymDesc = document.createElement('p');
      wangymDesc.className = 'wangym_gallery_desc';
      wangymDesc.textContent = wangymItem.wangym_description;

      var wangymFoot = document.createElement('div');
      wangymFoot.className = 'wangym_gallery_foot';
      var wangymAuthor = document.createElement('span');
      wangymAuthor.textContent = '作者：' + wangymItem.wangym_author;
      var wangymLikes = document.createElement('span');
      wangymLikes.className = 'wangym_gallery_likes';
      wangymLikes.textContent = '♥ ' + wangymItem.wangym_likes;
      wangymFoot.appendChild(wangymAuthor);
      wangymFoot.appendChild(wangymLikes);

      wangymBody.appendChild(wangymTitle);
      wangymBody.appendChild(wangymDesc);
      wangymBody.appendChild(wangymFoot);
      wangymCard.appendChild(wangymCover);
      wangymCard.appendChild(wangymBody);
      wangymGalleryContainer.appendChild(wangymCard);
    });
  }

  async function wangymLoadGallery() {
    try {
      var wangymResponse = await fetch(wangymGalleryApi);
      var wangymResult = await wangymResponse.json();
      console.log('[wangym_gallery] 接口返回：', wangymResult);
      if (!wangymResponse.ok || wangymResult.code !== 0) {
        throw new Error(wangymResult.msg || ('请求失败，状态码 ' + wangymResponse.status));
      }
      wangymRenderGallery(wangymResult.data);
    } catch (wangymErr) {
      console.error('[wangym_gallery] 请求出错：', wangymErr.message);
      wangymShowError(wangymErr.message);
    }
  }

  wangymLoadGallery();
})();
