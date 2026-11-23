// 姓名：王一鸣 | 学号：24002060518 | 时间：2026-11-23 | 大模型：DeepSeek-V4.1-Flash
// 知识库路由
const wangymExpress = require('express');
const wangymRouter = wangymExpress.Router();
const wangymKbController = require('../controllers/wangym_kbController');

wangymRouter.get('/list', wangymKbController.wangymListKbs);
wangymRouter.post('/create', wangymKbController.wangymCreateKb);
wangymRouter.delete('/file/:fileId', wangymKbController.wangymDeleteKbFile);
wangymRouter.get('/:id/files', wangymKbController.wangymListKbFiles);
wangymRouter.post('/:id/upload', wangymKbController.wangymUploadKbFile);
wangymRouter.delete('/:id', wangymKbController.wangymDeleteKb);
wangymRouter.post('/ask', wangymKbController.wangymAskKb);

module.exports = wangymRouter;
