// 姓名：王一鸣 | 学号：24002060518 | 时间：2026-11-23 | 大模型：DeepSeek-V4.1-Flash
// 图文列表控制器
const { wangymFindAllGallery } = require('../models/wangym_galleryModel');

// GET /api/gallery 获取图文列表
async function wangymGetGalleryList(wangymReq, wangymRes) {
  try {
    const wangymRows = await wangymFindAllGallery();
    wangymRes.json({ code: 0, msg: '获取图文列表成功', data: wangymRows });
  } catch (wangymErr) {
    console.error('[wangym_gallery] 查询失败：', wangymErr.message);
    wangymRes.json({ code: 1, msg: '获取图文列表失败：' + wangymErr.message, data: null });
  }
}

module.exports = { wangymGetGalleryList };
