// 姓名：王一鸣 | 学号：24002060518 | 时间：2026-11-23 | 大模型：DeepSeek-V4.1-Flash
// 科技新闻路由
const express = require('express');
const { wangymGetNewsList } = require('../controllers/wangym_newsController');

const wangymNewsRouter = express.Router();

wangymNewsRouter.get('/', wangymGetNewsList);

module.exports = wangymNewsRouter;
