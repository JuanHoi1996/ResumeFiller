# Test Log

This file tracks gray-test results across sites and versions.

## Test template
Use this block for each new test round:

```
Date:
Version:
Tester:
Browser/OS:
Site:
Page:
Result: Pass / Partial / Fail
Details:
Issue link/screenshot:
```

---

## 2026-06-28 | 2.2.4

### Environment
- Browser/OS: Chrome on Windows
- Data source: storage-first

### Site results
- Feishu Recruiting (`dedao.jobs.feishu.cn`)
  - Projects · **project link** (`project[0].link` / `data-cy="project[0].linkInput"`): Pass

### Editor page
- Projects · project link field CRUD / persist: Pass

---

## 2026-02-25 | 1.1.0-beta.1

### Environment
- Browser/OS: Chrome on Windows
- Data source mode: storage-first (`chrome.storage.local`)

### Site results
- BOSS直聘
  - Internship autofill: Pass
  - Project autofill: Pass
  - Self-evaluation autofill: Pass (`个人优势` recognized)
- 猎聘
  - Internship autofill: Partial -> fixed
  - Issue: `工作内容` not filled when page uses `职责业绩`/`优势亮点` style labels
  - Status: fixed in current build
- 国聘
  - Internship autofill: Partial -> fixed
  - Issue: `工作内容` text area not hit by old fallback
  - Status: fixed in current build
- Envision (Moka)
  - Full flow (internship/project/self-evaluation): Pass
  - Scoped fill on repeated editable blocks: Pass
  - Project section compatibility:
    - `项目经验` container-level label: fixed
    - `项目名称` + `项目描述` field targeting: fixed

### Editor page
- Internship CRUD: Pass
- Project CRUD: Pass
- Self-evaluation CRUD: Pass
- JSON export: Pass
- JSON import: Pass
- Persist after save/reload: Pass
