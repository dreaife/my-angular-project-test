# My Angular Project

## 简介

这是一个基于 Angular 的前端项目，提供用户认证和动画信息展示功能。项目使用 Amazon Cognito 进行用户管理，并通过 GitHub Pages 部署。API 来自 [Bangumi API](https://bangumi.github.io/api/)。

GitHub Pages 地址：[https://dreaife.github.io/my-angular-project-test/](https://dreaife.github.io/my-angular-project-test/)

## 功能

- 用户注册、登录和密码重置
- 动画信息的展示和搜索
- 项目详情页跳转
- 自动化部署到 GitHub Pages

## 安装

### 环境要求

- Node.js 版本 20 或更高
- Angular CLI

### 安装步骤

1. 克隆项目到本地：

   ```bash
   git clone https://github.com/dreaife/my-angular-project-test.git
   cd my-angular-project-test
   ```

2. 安装依赖：

   ```bash
   npm install
   npm install -g @angular/cli
   ```

3. 启动开发服务器：

   ```bash
   ng serve
   ```

## 使用说明

- 访问 `http://localhost:4200` 查看项目。
- 使用注册功能创建新用户，或使用已有账号登录。

## 部署

项目使用 GitHub Actions 自动化部署到 GitHub Pages。每次推送到 `master` 分支时，项目会自动构建并部署。

## 贡献

欢迎贡献代码！请提交 Pull Request 或报告问题。

## 许可证

该项目使用 MIT 许可证。

## 联系方式

如有问题，请联系 [nghqs877261793@gmail.com](mailto:nghqs877261793@gmail.com)。
