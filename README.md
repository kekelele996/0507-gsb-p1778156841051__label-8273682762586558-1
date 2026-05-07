# Animal Theme Dynamic Website

## 🛠 Tech Stack
- Frontend: React 18 + Vite + Tailwind CSS + Ant Design
- Backend: Laravel 11 (PHP 8.4)
- Database: MySQL 8.0

## 🚀 启动指南 (How to Run)
1. 确保 Docker Desktop 已启动。
2. 在根目录执行：`docker compose up --build`
3. 等待容器启动完成（后端会自动执行 `migrate + seed`）...

## 🔗 服务地址 (Services)
- Frontend: http://localhost:3001
- Backend API: http://localhost:8000/api
- Database: localhost:3307 (user: root / pass: root)

## 🧪 测试账号
- Admin: admin@example.com / password
- 无需手动 seed，容器启动后账号会自动创建或更新

## ✨ 功能特性
- **用户认证**: 登录、注册 (Laravel Sanctum)
- **动物画廊**: 动态展示、搜索、管理 (CRUD)
- **图片来源**: 使用 Pexels 搜索结果中的图片直链
- **留言板**: 访客留言、用户标识
- **虚拟参观**: 沉浸式首页体验
- **美化设计**: "Modern Organic" 野性主题

## 🐳 Docker 配置
- 镜像源: 配置了 USTC 国内源 (Debian/Alpine)
- 容器化: 100% 容器化 (Frontend Nginx, Backend Apache, MySQL)
