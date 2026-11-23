// 姓名：王一鸣 | 学号：24002060518 | 时间：2026-11-23 | 大模型：DeepSeek-V4.1-Flash
// 数据库连接测试路由
const express = require('express');
const { wangymTestDatabase } = require('../controllers/wangym_databaseController');

const wangymDatabaseRouter = express.Router();

wangymDatabaseRouter.post('/test', wangymTestDatabase);

module.exports = wangymDatabaseRouter;
