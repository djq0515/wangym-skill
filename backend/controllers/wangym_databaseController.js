// 姓名：王一鸣 | 学号：24002060518 | 时间：2026-11-23 | 大模型：DeepSeek-V4.1-Flash
// 数据库连接测试控制器
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mysql = require('mysql2/promise');

// POST /api/database/test 使用用户输入的账号密码测试数据库连接
async function wangymTestDatabase(wangymReq, wangymRes) {
  const wangymBody = wangymReq.body || {};
  const wangymUser = String(wangymBody.username || '').trim();
  const wangymPassword = String(wangymBody.password || '');
  const wangymDatabase = String(wangymBody.database || '').trim();

  if (!wangymUser || !wangymDatabase) {
    return wangymRes.json({ code: 1, msg: '用户名和数据库名不能为空', data: null });
  }

  let wangymConnection = null;
  try {
    wangymConnection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      port: 3306,
      user: wangymUser,
      password: wangymPassword,
      database: wangymDatabase,
      charset: 'utf8mb4'
    });
    const [wangymRows] = await wangymConnection.query(
      'SELECT VERSION() AS wangym_version, DATABASE() AS wangym_database, CURRENT_USER() AS wangym_user'
    );
    wangymRes.json({
      code: 0,
      msg: '数据库连接成功',
      data: wangymRows[0]
    });
  } catch (wangymErr) {
    console.error('[wangym_database] 连接失败：', wangymErr.message);
    wangymRes.json({ code: 1, msg: '数据库连接失败：' + wangymErr.message, data: null });
  } finally {
    if (wangymConnection) {
      await wangymConnection.end().catch(() => {});
    }
  }
}

module.exports = { wangymTestDatabase };
