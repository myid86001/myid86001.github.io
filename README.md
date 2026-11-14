# 未定集

一个可以慢慢填充的个人网站。包含首页、记录、项目、试验场和关于页面。主题与搜索无需外部服务，波形实验在浏览器本地运行。

## 本地预览

需要 Node.js 24。

```sh
npm ci
npm run build
npm run check
npm run dev
```

打开 http://127.0.0.1:4173。修改文件后重新运行构建并刷新页面。

## 添加文章或项目

复制 `templates/note.md` 到 `content/notes/` 或 `content/projects/`。文件名使用小写英文、数字和连字符，例如 `first-note.md`。填写标题、摘要、日期和标签，正文使用 Markdown。

- 默认 `draft: true` 不进入网站输出或搜索；完成后改为 `draft: false`。
- 公开 GitHub 仓库内的源文件仍然公开。私人草稿请保存在仓库外，`draft` 仅控制是否生成网页。
- 支持 Markdown 标题目录、代码块、表格与本地 KaTeX 数学公式。
- 行内公式使用一对美元符号，独立公式使用两行双美元符号包围。
- 图片放到 `public/images/`，文章中可用 `../../images/文件名.jpg` 引用。
- 文章按日期倒序排列，标题、摘要、标签会自动进入搜索。

## 修改网站与加入互动

- `site.config.mjs`：网站名称、描述、域名与根路径。
- `src/templates.mjs`：页面结构与文案。
- `src/styles.css`：颜色、字体、移动布局和明暗主题。
- `src/app.js`：搜索、主题和探索地图。
- `src/lab.js`：波形交互。可按这一方式添加独立实验脚本。
- `scripts/build.mjs`：Markdown 到静态页面的构建过程。

页面以静态 HTML 输出，可直接访问与分享，不依赖前端路由。没有评论服务、分析追踪、账号系统或外部字体请求。此版本的搜索匹配标题、摘要、标签和栏目，不是全文搜索。

## 当前发布状态

网站和仓库现已公开：[访问未定集](https://myid86001.github.io/)。公开仓库的源文件、历史提交和网站内容可能被任何人查看，请勿提交私人资料。`draft` 只控制页面是否生成，不提供访问保护。

## GitHub Pages

此仓库使用 `myid86001.github.io` 作为用户站点仓库。在仓库 Settings → Pages → Build and deployment 中选择 GitHub Actions。启用 `Publish website` 工作流后，向 `main` 推送会触发 `.github/workflows/pages.yml`，安装依赖、构建、检查并发布 `dist/`。若页面没有更新，请先检查工作流是否启用以及最近一次运行的结果。

依赖使用锁文件；不要提交 `node_modules/`、`dist/`、本地截图或环境变量文件。若改为项目站点，应同时调整 `site.config.mjs` 的 `base` 和链接检查逻辑。

## 内容与来源

记录栏目收录了电磁学交互讲义；入口源文件为 `content/notes/electromagnetism.md`，完整页面为 `public/learn/physics/electromagnetism/index.html`。试验场提供两道同频正弦波的理想化叠加示意，含参数与模型说明。关于页保留最初参考笔记的链接；站点未复制其讲义正文。

发布时保留第三方依赖中的许可文件。没有为本项目主动授予额外的开源许可证。
