# 发布检查清单

每次灰度发布或公开发布前，请按此清单逐项检查。

## A. 版本与文档
- [ ] 更新 `manifest.json` 版本号。
- [ ] 在 `CHANGELOG.md` / `CHANGELOG.zh-CN.md` 补充本次发布说明。
- [ ] 在 `TEST_LOG.md` / `TEST_LOG.zh-CN.md` 追加本轮测试结果。
- [ ] 若行为变化，更新 `KNOWN_ISSUES.md` / `KNOWN_ISSUES.zh-CN.md`。
- [ ] 确认根目录含 `LICENSE`（MIT）且 README 已链接。

## B. 打包清洁度
- [ ] 确认插件目录仅包含运行必需文件：
  - `manifest.json`
  - `background.js`
  - `content.js`
  - `popup.html`
  - `popup.js`
  - `editor.html`
  - `editor.js`
  - `storage.js`
  - `data.js`
- [ ] 打包前删除临时文件：
  - `resumefiller-data-*.json`
  - 各类备份/临时文件
  - 与插件无关的文档或脚本
- [ ] 检查 zip 结构：压缩包根目录应直接包含 `manifest.json`。

## C. 功能冒烟测试
- [ ] Popup 模板列表正常渲染。
- [ ] Editor 可新增/编辑/删除实习经历。
- [ ] Editor 可新增/编辑/删除项目经历。
- [ ] Editor 可新增/编辑/删除自我评价。
- [ ] JSON 导出可用。
- [ ] JSON 导入可用。
- [ ] 保存后刷新，数据持久化正常。

## D. 站点回归
- [ ] BOSS：实习 + 项目 + 自我评价自动填充。
- [ ] 猎聘：实习 + 项目 + 自我评价自动填充。
- [ ] 国聘：实习 + 项目 + 自我评价自动填充。
- [ ] Hotjob 系（如 `wecruit.hotjob.cn`）：实习 + 项目 + 自我评价自动填充。
- [ ] 验证 `工作内容` 不会误写入 `工作业绩`。

## E. 灰度发布
- [ ] 选择测试人群（5-20 人）。
- [ ] 下发安装与反馈说明。
- [ ] 收集浏览器/系统/站点/字段级错误信息。
