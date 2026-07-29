# Release Checklist

Use this checklist before each gray release or public release.

## A. Version and docs
- [ ] Update `manifest.json` version.
- [ ] Add release notes to `CHANGELOG.md`.
- [ ] Append latest test round to `TEST_LOG.md`.
- [ ] Update `KNOWN_ISSUES.md` if behavior changed.
- [ ] Confirm `LICENSE` (MIT) is present and linked from README.

## B. Package hygiene
- [ ] Ensure extension folder includes only runtime files:
  - `manifest.json`
  - `background.js`
  - `content.js`
  - `popup.html`
  - `popup.js`
  - `editor.html`
  - `editor.js`
  - `privacy.html`
  - `storage.js`
  - `data.js`
- [ ] Remove temporary files before packaging:
  - `resumefiller-data-*.json`
  - backup/temp files
  - unrelated docs/scripts (Markdown can be omitted from store ZIP; keep `privacy.html`)
- [ ] Zip structure check: archive root directly contains `manifest.json`.

## C. Functional smoke tests
- [ ] Popup renders templates correctly.
- [ ] Sticky top Edit / Reload bar remains visible while scrolling the side panel.
- [ ] Editor can add/edit/delete internships.
- [ ] Editor can add/edit/delete projects.
- [ ] Editor can add/edit/delete self evaluations.
- [ ] Export JSON works.
- [ ] Import JSON works.
- [ ] Save to storage and reload persistence works.
- [ ] First editor open shows privacy notice; acknowledge dismisses it.
- [ ] Clear local data confirms, then restores neutral sample data.
- [ ] Side panel / editor can open `privacy.html`.

## D. Site regression checks
- [ ] BOSS: internship + project + self evaluation autofill.
- [ ] 猎聘: internship + project + self evaluation autofill.
- [ ] Guopin: internship + project + self evaluation autofill.
- [ ] Hotjob (e.g. `wecruit.hotjob.cn`): internship + project + self evaluation autofill.
- [ ] Verify work content does not write into work achievement fields.

## E. Store / privacy (Edge, etc.)
- [ ] GitHub Pages enabled; store privacy URL reachable (e.g. `https://juanhoi1996.github.io/ResumeFiller/privacy.html`).
- [ ] Privacy questionnaire matches the policy (local storage, fill writes to target page, no remote telemetry).
- [ ] Permission disclosure matches `manifest.json` (no unused `scripting` / `activeTab`).

## F. Gray rollout
- [ ] Select tester group (5-20 users).
- [ ] Share install + feedback instructions.
- [ ] Collect browser/OS/site/field-level failure reports.
