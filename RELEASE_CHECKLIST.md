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
  - `storage.js`
  - `data.js`
- [ ] Remove temporary files before packaging:
  - `resumefiller-data-*.json`
  - backup/temp files
  - unrelated docs/scripts
- [ ] Zip structure check: archive root directly contains `manifest.json`.

## C. Functional smoke tests
- [ ] Popup renders templates correctly.
- [ ] Editor can add/edit/delete internships.
- [ ] Editor can add/edit/delete projects.
- [ ] Editor can add/edit/delete self evaluations.
- [ ] Export JSON works.
- [ ] Import JSON works.
- [ ] Save to storage and reload persistence works.

## D. Site regression checks
- [ ] BOSS: internship + project + self evaluation autofill.
- [ ] 猎聘: internship + project + self evaluation autofill.
- [ ] Guopin: internship + project + self evaluation autofill.
- [ ] Hotjob (e.g. `wecruit.hotjob.cn`): internship + project + self evaluation autofill.
- [ ] Verify work content does not write into work achievement fields.

## E. Gray rollout
- [ ] Select tester group (5-20 users).
- [ ] Share install + feedback instructions.
- [ ] Collect browser/OS/site/field-level failure reports.
