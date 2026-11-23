@echo off
chcp 65001 >nul
title 知乎制作和模仿 - 后端服务
cd /d "%~dp0backend"
echo ==========================================
echo   知乎制作和模仿 - 后端服务
echo   访问地址: http://localhost:8201
echo   请先确认 MySQL 服务已启动
echo ==========================================
echo.
node app.js
echo.
echo 服务已停止，按任意键关闭窗口...
pause >nul
