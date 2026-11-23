// 姓名：王一鸣 | 学号：24002060518 | 时间：2026-11-23 | 大模型：DeepSeek-V4.1-Flash
// AI 聊天路由
const express = require('express');
const { wangymChat } = require('../controllers/wangym_chatController');

const wangymChatRouter = express.Router();

wangymChatRouter.post('/', wangymChat);

module.exports = wangymChatRouter;
