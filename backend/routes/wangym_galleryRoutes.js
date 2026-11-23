// 姓名：王一鸣 | 学号：24002060518 | 时间：2026-11-23 | 大模型：DeepSeek-V4.1-Flash
// 图文列表路由
const express = require('express');
const { wangymGetGalleryList } = require('../controllers/wangym_galleryController');

const wangymGalleryRouter = express.Router();

wangymGalleryRouter.get('/', wangymGetGalleryList);

module.exports = wangymGalleryRouter;
