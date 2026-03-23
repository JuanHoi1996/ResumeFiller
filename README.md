# ResumeFiller

Open-source resume autofill assistant for job applications.

## What it does
- Lets you maintain resume templates (in the built-in editor).
- One-click autofill into common online application forms.
- Uses **scoped fill** (intent-based) to reduce cross-field miswrites: you can click the target input first, then run the corresponding template.

## Supported browsers
This extension is packaged for **Chrome (Manifest V3)**. In practice it should work on most **Chromium-based** browsers via “Load unpacked”:
- Edge, Opera, Brave, Vivaldi
- 360 Browser, QQ Browser
- Sogou/猎豹等同类浏览器

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
   - Family Members, Open Questions
4. If a field doesn’t match on the first attempt:
   - Click into the exact input box first, then click the same template button again (**Scoped Fill**).

## Known issues
- See `KNOWN_ISSUES.md` / `KNOWN_ISSUES.zh-CN.md`.
- Some sites (e.g. Bank of China “Yingcai” deep table layouts) may require manual help even with scoped fill.

