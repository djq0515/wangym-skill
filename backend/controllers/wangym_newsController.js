// 姓名：王一鸣 | 学号：24002060518 | 时间：2026-11-23 | 大模型：DeepSeek-V4.1-Flash
// 科技新闻控制器
const { wangymFindAllNews } = require('../models/wangym_newsModel');

// GET /api/news 获取科技新闻列表
async function wangymGetNewsList(wangymReq, wangymRes) {
  try {
    const wangymRows = await wangymFindAllNews();
    wangymRes.json({ code: 0, msg: '获取科技新闻列表成功', data: wangymRows });
  } catch (wangymErr) {
    console.error('[wangym_news] 查询失败：', wangymErr.message);
    wangymRes.json({ code: 1, msg: '获取科技新闻列表失败：' + wangymErr.message, data: null });
  }
}

module.exports = { wangymGetNewsList };
