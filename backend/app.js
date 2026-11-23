// 姓名：王一鸣 | 学号：24002060518 | 时间：2026-11-23 | 大模型：DeepSeek-V4.1-Flash
// 后端入口：Express 服务，端口 8201，托管 frontend 静态资源，开放跨域
const path = require('path');
const express = require('express');
const cors = require('cors');

const wangymNewsRoutes = require('./routes/wangym_newsRoutes');
const wangymGalleryRoutes = require('./routes/wangym_galleryRoutes');
const wangymDatabaseRoutes = require('./routes/wangym_databaseRoutes');
const wangymChatRoutes = require('./routes/wangym_chatRoutes');
const wangymKbRoutes = require('./routes/wangym_kbRoutes');

const wangymApp = express();
const wangymPort = 8201;

// 所有跨域访问均放行
wangymApp.use(cors());
wangymApp.use(express.json({ limit: '12mb' }));
wangymApp.use(express.urlencoded({ extended: true }));

// 业务接口（统一 /api/ 前缀）
wangymApp.use('/api/news', wangymNewsRoutes);
wangymApp.use('/api/gallery', wangymGalleryRoutes);
wangymApp.use('/api/database', wangymDatabaseRoutes);
wangymApp.use('/api/chat', wangymChatRoutes);
wangymApp.use('/api/kb', wangymKbRoutes);

// 托管前端静态页面
wangymApp.use(express.static(path.join(__dirname, '..', 'frontend')));

// 未匹配的接口统一返回 JSON
wangymApp.use('/api', (wangymReq, wangymRes) => {
  wangymRes.status(404).json({ code: 404, msg: '接口不存在：' + wangymReq.originalUrl, data: null });
});

// 全局异常处理
wangymApp.use((wangymErr, wangymReq, wangymRes, wangymNext) => {
  console.error('[wangym_app] 服务异常：', wangymErr.message);
  wangymRes.status(500).json({ code: 500, msg: '服务器内部错误：' + wangymErr.message, data: null });
});

wangymApp.listen(wangymPort, () => {
  console.log('后端服务已启动：http://localhost:' + wangymPort);
  console.log('前端页面入口：http://localhost:' + wangymPort + '/index.html');
});
