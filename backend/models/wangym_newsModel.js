// 姓名：王一鸣 | 学号：24002060518 | 时间：2026-11-23 | 大模型：DeepSeek-V4.1-Flash
// 科技新闻数据模型
const wangymPool = require('../config/wangym_db');

// 查询全部科技新闻（按发布时间倒序）
async function wangymFindAllNews() {
  const [wangymRows] = await wangymPool.query(
    'SELECT wangym_id, wangym_title, wangym_source, wangym_summary, wangym_content, wangym_url, wangym_views, wangym_publish_time FROM wangym_news ORDER BY wangym_publish_time DESC'
  );
  return wangymRows;
}

module.exports = { wangymFindAllNews };
