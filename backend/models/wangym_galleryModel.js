// 姓名：王一鸣 | 学号：24002060518 | 时间：2026-11-23 | 大模型：DeepSeek-V4.1-Flash
// 图文列表数据模型
const wangymPool = require('../config/wangym_db');

// 查询全部图文数据（按创建时间倒序）
async function wangymFindAllGallery() {
  const [wangymRows] = await wangymPool.query(
    'SELECT wangym_id, wangym_title, wangym_description, wangym_image_url, wangym_author, wangym_likes, wangym_create_time FROM wangym_gallery ORDER BY wangym_create_time DESC'
  );
  return wangymRows;
}

module.exports = { wangymFindAllGallery };
