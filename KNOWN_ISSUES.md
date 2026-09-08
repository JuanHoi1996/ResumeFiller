# Known Issues

Current limitations and workarounds. Fixed behavior belongs in the changelog, not here.

## 1) Site-specific label drift
- **Symptom**: The same field uses very different labels across sites.
- **Impact**: Some inputs or dropdowns may miss on the first try.
- **Workaround**: Scroll to the target block and fill again; or click into the input and reuse the same template (Scoped Fill). If it still fails, fill manually and report the label plus a screenshot.

## 2) Complex custom dropdowns
- **Symptom**: Industry, company type, work type, and similar fields may not select reliably in custom widgets.
- **Impact**: The field may highlight without a real selection.
- **Workaround**: Choose that field by hand; keep the rest of the autofill.

## 3) Date autofill is muted
- **Symptom**: Start/end dates may stay blank.
- **Reason**: Date widgets differ by site; writing the wrong format is worse than skipping.
- **Workaround**: Enter dates manually after autofill.

## 4) Safari cannot load this package
- **Symptom**: The current build is a Chrome Manifest V3 extension and will not load in Safari.
- **Workaround**: Use Chrome or Edge (or another Chromium browser that can load unpacked extensions).

## 5) Work-achievement fields are skipped on purpose
- **Symptom**: Some sites have both work content and work achievement.
- **Current behavior**: Achievement is not autofilled, so duty text is not written into the achievement box.

## 6) BOSS (zhipin.com) long text and Scoped Fill
- **Symptom**:
  - Internships: company / department / title are relatively reliable; some long-text internship fields may not write.
  - Projects: long text may land in the wrong of “description” vs “intro/background”, leaving one empty.
  - Self-evaluation and education may fill only partially, or not at all, on some pages.
- **Workaround**: Type by hand, or focus the target input and run Scoped Fill. If it still fails, report the label plus a screenshot.

## 7) 51job (xyz.51job.com) custom dropdowns and “Other” boxes
- **Symptom**:
  - School and major often use custom dropdowns the extension cannot click.
  - When the dropdown cannot be filled, text may go into “other school” / “other major” inputs underneath.
- **Reason**: Legacy DOM and custom dropdown scripts; the extension does not override that logic.
- **Workaround**: Pick the correct dropdown value by hand and clear anything that landed in “Other”.

## 8) Tonghuashun campus (`campus.10jqka.com.cn`) GitHub / Scholar URLs may not write
- **Symptom**: Labels such as「Github主页」/「Scholar主页」are recognized, but the URL sometimes does not land in the input (the editor Personal Info fields `githubUrl` / `scholarUrl` must already be saved).
- **Impact**: Those two homepage fields may still need a manual paste; other personal-info fields can still autofill.
- **Workaround**: Paste the URL into the target box.
- **Sample**: `campus.10jqka.com.cn` resume page, Element UI `el-input`.

## 9) Agricultural Bank of China careers site: desktop page uses mobile-style input
- **Symptom**: Wheel scrolling barely works (or not at all) and the context menu is blocked. Side-panel fill is hard to aim; right-click **Copy field report** never appears.
- **Likely cause**: A full-page gesture layer, a custom scroller, and/or the page cancelling `contextmenu`.
- **Impact**: Autofill is not reliable on this site, and field reports cannot be copied from the page.
- **Workaround**: If Tab or click can still focus an input, try Scoped Fill; otherwise fill by hand. When reporting, include the careers-page URL. Saving the page as HTML usually does not reproduce the blocked wheel or context menu.
