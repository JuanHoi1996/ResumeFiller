# ResumeFiller

Open-source resume autofill assistant for job applications.

**Languages:** English (this file) · [中文说明](README.zh-CN.md)

**License:** [MIT](LICENSE)

## What it does
- Lets you maintain resume templates (in the built-in editor).
- One-click autofill into common online application forms.
- Uses **scoped fill** (intent-based) to reduce cross-field miswrites: you can click the target input first, then run the corresponding template.

## Sites & ATS ecosystems (focus / tested)
The extension combines **generic** heuristics (common UI libraries, labels, placeholders) with **targeted** fixes where we have reports. Changelog-backed examples include:

| Area | Examples |
|------|----------|
| **BOSS Zhipin** | `zhipin.com` resume editor & application forms (dedicated handling) |
| **Guopin (国聘)** | Government-style recruitment portal (`iguopin.com` and similar); not the same product as Hotjob |
| **Beisen (北森)** | Enterprise ATS (e.g. `zhiye.com` career sites); DOM often uses `form-item--phoenix` class names |
| **Hotjob (大易)** | Shanghai Dayee Cloud (`wecruit.hotjob.cn` and related Hotjob-hosted career sites) |
| **Feishu / Lark** | Recruitment pages on Feishu/Lark forms |
| **Moka** | Marketing career sites built on Moka |

**Often usable** on other major boards via generic controls: **Liepin**, **Zhaopin (智联)**, **Shixiseng**, **51job**, etc. Other vendor families (**ChinaHR-style** portals, etc.) may work depending on DOM. If a field misses, use **scoped fill** and report the label + screenshot.

## Supported browsers
This extension is packaged for **Chrome (Manifest V3)**. In practice it should work on most **Chromium-based** browsers via “Load unpacked”:
- Edge, Opera, Brave, Vivaldi
- 360 Browser, QQ Browser
- Sogou/Cheetah Browser etc.

If a browser-specific component differs, please report the label text + a screenshot in the Known Issues.

## How to install (development / local test)
1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `ResumeFiller` folder (or the folder containing `manifest.json`)

## How to use
1. Open the extension side panel (`popup.html`)
2. Load your resume data in the editor (if needed)
3. On the panel, click a template button under the module you want:
   - Personal Info, Education, Internships, Projects
   - Self Evaluations, Language Skills, Computer Skills
   - Family Members, Papers, Game Experience, Open Questions
4. If a field doesn’t match on the first attempt:
   - Click into the exact input box first, then click the same template button again (**Scoped Fill**).

## Known issues
- See `KNOWN_ISSUES.md` / [`KNOWN_ISSUES.zh-CN.md`](KNOWN_ISSUES.zh-CN.md).

## Contributing & docs
- Changelog: `CHANGELOG.md` / [`CHANGELOG.zh-CN.md`](CHANGELOG.zh-CN.md)
- Handover notes (for maintainers): see repo root `HANDOVER.md` if present
