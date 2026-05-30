# ResumeFiller

用于网申场景的简历自动填充插件（开源）。

**语言：** [English](README.md) · 中文（本页）

**许可证：** [MIT](LICENSE)

## 它能做什么
- 维护简历模板（在插件自带编辑器里）。
- 一键填充到常见网申表单。
- 支持 **Scoped Fill（作用域填充，intent-based）**：先点中目标输入框，再运行对应模块模板，降低跨字段误填。

## 目前支持的网站与产品形态（侧重 / 验证过）
插件在**通用**识别（常见 UI 组件、label、placeholder）之外，对下列站点或 **ATS 形态**有专项或回归验证（详见 CHANGELOG）：

| 类型 | 举例 |
|------|------|
| **BOSS 直聘** | `zhipin.com` 简历编辑器与网申（有独立适配逻辑） |
| **国聘** | 政务类招聘门户（如 `iguopin.com` 等）；与 Hotjob 系不是同一产品 |
| **北森 Beisen** | 企业招聘 ATS（如 `zhiye.com` 招聘页）；页面 DOM 常见 `form-item--phoenix` 等类名（非官方产品英文名） |
| **Hotjob 系（大易）** | 上海大易云计算，典型域名为 `wecruit.hotjob.cn` 及同类 Hotjob 托管招聘站 |
| **飞书 Feishu / Lark** | 飞书招聘表单（如部分基金/企业招聘页） |
| **Moka** | 以 Moka 搭建的招聘官网 |

**其它常见招聘站**（如 **猎聘、智联招聘、实习僧、前程无忧** 等）多数依赖通用控件识别，**不保证**每个子域都测过；**中华英才系**等同类 ATS 视页面而定。若首次未命中，请**先点进目标输入框再填一次**，或反馈字段标签与截图。

## 支持的浏览器
本项目按 **Chrome（Manifest V3）** 打包。一般情况下也可用于大多数 **Chromium 内核浏览器** 的“加载未打包扩展”：
- Edge、Opera、Brave、Vivaldi
- 360 浏览器、QQ 浏览器
- 搜狗/猎豹等同类浏览器

如果遇到浏览器差异导致 label/控件结构变化，请在 Known Issues 里补充字段标签 + 截图。

## 安装方法（开发/本地测试）
1. 打开 `chrome://extensions`
2. 开启 **开发者模式**
3. 点击 **Load unpacked（加载已解压扩展）**
4. 选择包含 `manifest.json` 的 `ResumeFiller` 文件夹

## 使用方法
1. 打开插件侧边栏（`popup.html`）
2. 在编辑器中准备/加载你的简历数据（如需）
3. 在面板里点击你要填的模块模板按钮：
   - 基础信息、教育经历、实习经历、项目经历
   - 自我评价、外语技能、计算机技能
   - 家庭成员、论文发表、游戏经历、开放性问答
4. 首次命中失败时：
   - 先点进目标输入框，再点击同一个模板按钮一次（Scoped Fill）。

## 已知问题
- 请查看 [`KNOWN_ISSUES.md`](KNOWN_ISSUES.md) / `KNOWN_ISSUES.zh-CN.md`。

## 贡献与文档
- 更新日志：`CHANGELOG.md` / [`CHANGELOG.zh-CN.md`](CHANGELOG.zh-CN.md)
- 维护交接说明：仓库根目录 `HANDOVER.md`（如有）
