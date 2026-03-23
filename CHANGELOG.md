# Changelog

All notable changes to ResumeFiller will be documented in this file.
## [2.0.0] - 2026-03-23

### Changes
- **Intent-based scoped filling (v2 refactor)**:
  - `detectField` now accepts an explicit `section` (intent) and locks mapping to the selected module.
  - `autoFill` filters fill targets by the template payload keys to reduce cross-module miswrites.
  - `scoped` mode now covers `personalInfos` as well.
- **BOSS (zhipin.com) safety improvements**: constrained long-text fallbacks to avoid overwriting other containers.

### Fixes
- **WeRecruit / 招商证券**: support self-evaluation label `评价内容` (maps to `selfEvaluation`).

## [1.6.10] - 2026-03-20

### Fixes
- **StarCharge (Beisen/Phoenix) projectName recognition**: Improved Phoenix label extraction fallbacks to ensure `项目名称` matches consistently.

## [1.6.9] - 2026-03-20

### Fixes
- **StarCharge (Beisen/Phoenix) label extraction tightened**: restricted Phoenix label queries to `.form-item__title label.form-item__text` to avoid same-group label capture causing regressions in project name/role mapping.

## [1.6.8] - 2026-03-20

### Fixes
- **StarCharge (Beisen/Phoenix) project role recognition**: For Phoenix forms where the project role label is `职务`, prefer collecting same-group labels from the `.fields-row` container and match via `项目名称/项目描述/...` anchors to classify `projectRoleTitle` correctly.

## [1.6.7] - 2026-03-20

### Fixes
- **StarCharge (Beisen/Phoenix) project role / project description**:
  - Improved Phoenix same-group label collection so that "职务" (project role) can be recognized as `projectRoleTitle` in project context.
  - Fixed "项目描述" mapping to the general `content` field, avoiding accidental fill into the short "项目介绍" (`projectDesc`).

## [1.6.6] - 2026-03-20

### Fixes
- **StarCharge (Beisen/Phoenix) project role detection**: When the project role label is "职务/职位/岗位" and the surrounding context is within "项目", prioritize `projectRoleTitle` to avoid misclassifying it as internship `position`.

## [1.6.5] - 2026-03-20

### Fixes
- **StarCharge (Beisen/Phoenix) field recognition improved**: Enhanced Phoenix label extraction for `form-item__title > label.form-item__text`, resolving missing internship/project/ID auto-fill.
- **Start/end time detection improved**: Prefer label-based start/end mapping (e.g. “开始时间/结束时间”).

## [1.6.4] - 2026-03-17

### Fixes
- **StarCharge (Beisen/Phoenix) form recognition improved**: Added Phoenix/Beisen label extraction (`form-item__label`, `aria-labelledby`) to fix broad field detection failures (ID number, education, internships, and projects).

## [1.6.3] - 2026-03-17

### Fixes
- **Teld \"Department\" field recognition**: Added mapping for `部门/请输入部门` to ensure it can be detected and auto-filled.

## [1.6.2] - 2026-03-17

### Added
- **Added "Major" field to Education**: editable in the editor and auto-fill supported on forms.

## [1.6.1] - 2026-03-17

### Added
- **Added "Hukou Location" field to Personal Info**: editable in the editor and auto-fill supported on forms.

## [1.6.0] - 2026-03-17

### Features
- **New "Open Questions (AI Writing)" Module**:
  - Designed for open-ended questions like "Career Planning", "Why Us?", and "Self-Introduction".
  - Support for multiple response versions/templates in the editor.
  - Intelligent detection of long text areas (Textareas) containing keywords like "Plan", "Reason", "Statement", etc.
  - Built-in customized templates for "Quant" and "IB" career paths based on user profile.

## [1.5.2] - 2026-03-17

### Fixes
- **Family Member Logic Overhaul**:
  - **Priority Correction**: Moved family member detection before job logic to prevent "Title/Company" fields from being misidentified as internship fields.
  - **Relation Mutual Exclusivity**: Implemented "Relation Guard" logic. When filling "Father" data, the plugin checks form labels. If a label explicitly mentions "Mother/Spouse", it will skip it, preventing the entire family form from being overwritten by a single person's data.

## [1.5.1] - 2026-03-17

### Fixes
- **Enhanced Family Member Recognition**: Added direct relation keywords like "Father/Mother/Spouse/Child" as triggers for detection, improving compatibility with flat form layouts that lack a generic "Family Member" header.

## [1.5.0] - 2026-03-17

### Features
- **New "Family Members" Module**:
  - Support for maintaining multiple family member records in the editor (Relation, Name, Company, Position, Phone, Political Status).
  - Added family member quick-fill entries in the popup menu with Scoped Fill support.
  - Added fuzzy matching logic for common family member form fields.

## [1.4.0] - 2026-03-17

### Changes (Milestone: Stability Refactor)
- **Engine Robustness Overhaul**:
  - Restored conservative context-clearing lists and scan depths (back to v1.2.7 stability), eliminating cross-field "overfill" issues.
  - Stopped chasing 100% compatibility with extreme table-based systems like Bank of China (Yingcai), prioritizing 95% accuracy on mainstream platforms.
- **Retained All Enhanced Fields**: Despite the engine rollback, kept support for "Reason for Leaving", "College/Department", "Language Skills", "IT Skills", and "Full Referee Details".
- **Scoped Mode Optimization**: For stubborn fields, users are encouraged to use the "Scoped Fill" mode (Fill near cursor).

### Fixes
- Improved mutual exclusivity logic for Referee Name vs Title to reduce misplacement in loose layouts.

## [1.3.5] - 2026-03-17

### Fixed
- **Precision Referee Identification**: Fixed an issue where referee names were misidentified as titles in complex table layouts.
  - Refined logic: Only fills the "Title" field if "Title/Company" keywords are found in the direct label, preventing bleed from "Job Title" labels in previous rows.
- Enhanced field stability for systems with highly nested table structures like BOC (Yingcai).

## [1.3.4] - 2026-03-17

### Fixed
- **Resolved Context Hijacking**: Refactored detection order to ensure "Direct Labels" have the highest priority.
  - Fixed a major issue in BOC where "Reason for Leaving" keywords were hijacking referee name and company fields.
- **Enhanced Referee Detection**: Elevated fallback priority for referee-related fields, ensuring accurate mapping even in complex table layouts with multiple overlapping keywords.
- **Optimized Leave Reason Detection**: Added explicit exclusion for referee-related context.

## [1.3.3] - 2026-03-17

### Added
- Added support for "Reason for Leaving (`leaveReason`)" in internship templates.
- Updated Editor to support CRUD operations for the Reason for Leaving field.

### Fixed
- **Optimized `position` Detection**: Explicitly excluded labels containing "Leaving" keywords to prevent misfilling "Reason for Leaving" with the position title.
- Fine-tuned detection priority for "Referee Name" and "Referee Company/Position" to ensure accurate mapping in complex layouts.

## [1.3.2] - 2026-03-17

### Fixed
- **Detection Priority Refactor (Critical)**: Introduced "Direct Label First" principle to prevent context labels (like "Company") from hijacking all fields on the page.
  - The extension now prioritizes labels immediately adjacent to input fields.
  - Contextual clues are only used as fallbacks when direct labels are ambiguous or missing.
- **Refined `company` Matching**: Added multiple exclusion keywords to prevent "Company" context from leaking into position, referee, or phone fields.
- Fixed an issue where "Referee Name" was misidentified due to nearby company labels.

## [1.3.1] - 2026-03-17

### Fixed
- Fixed an issue in BOC (Yingcai) where "Referee Phone" could not be detected due to deep table nesting.
- **Deeper Context Scanning**: Increased `getContextHintText` tracing depth to **3 levels** (from 2), enabling detection of `<tr>` siblings in traditional table layouts.
- **Optimized Field Conflict Management**: Added explicit exclusion for referee keywords in work content detection.

## [1.3.0] - 2026-03-17

### Added
- Added support for "Referee Company/Position (`refereeCompanyTitle`)" in internship templates.
- Updated Editor to support CRUD operations for the referee's company/position field.

### Fixed
- **Refactored Field Detection Logic**: Significantly trimmed the context-clearing list in `detectField`.
  - Core internship/project fields (Company, Position, Description, Phone, Location) now always retain context hints.
  - Fixed an issue in systems like BOC where "Referee Phone" lost its context due to proximity with description-related labels.
- Improved referee information mapping accuracy.

## [1.2.9] - 2026-03-17

### Fixed
- Corrected context-clearing logic in `detectField`: No longer clearing context for name, phone, or email fields.
  - Fixed an issue in BOC (Yingcai) where "Referee Phone" could not be detected.
- Adjusted detection priority to ensure `refereePhone` is identified before personal `phone`.
- Improved field mapping robustness in table-based or loose form layouts.

## [1.2.8] - 2026-03-17

### Fixed
- Further improved compatibility for Bank of China (BOC/Yingcai) internship forms.
- **Optimized Field Detection**: Added `职务` as a valid keyword for Position Titles (`position`) and excluded referee-related keywords from personal position detection.
- **Improved Context Scanning**: `getContextHintText` now scans up to 3 previous siblings.
  - Fixes issues in loose form layouts (like BOC tables) where keywords like "Referee" are too far from the actual phone input.
- **Supported Composite Referee Fields**: Better detection of composite fields like "Company/Position" for referees, ensuring values reach the appropriate target.

## [1.2.7] - 2026-03-17

### Added
- Added support for "College/Department" field in education templates.
- Improved field detection for labels containing `院系`, `学院`, or `学部`.
- Updated Editor to support CRUD operations for the College field.

## [1.2.6] - 2026-03-17

### Fixed
- Improved field detection accuracy for Bank of China (BOC/Yingcai) and other traditional form layouts.
- **Fixed Context Bleed**: Tightened `getContextHintText` tracing depth and added length constraints to previous sibling text capture.
- **Optimized Label Detection**: `getLabelText` now recognizes colon-terminated text in `SPAN/DIV/TD/TH` elements as valid labels.
- **Enhanced Exclusion Logic**: Added mutual exclusion keywords to prevent misidentification (e.g., exclude "Email" keywords from phone detection, and "ID/Certificate" keywords from name detection).

## [1.2.5] - 2026-03-17

### Fixed
- Improved compatibility for ICBC official recruitment site (internship form).
- Optimized `position` detection: Exclude labels containing `级别` (e.g., "Position Level") from being filled as position titles.
- Added `主要业绩` (Major Achievements) as a valid mapping for the generic `content` field.
- Updated `fillGeneralWorkContentFallback` to include `主要业绩` in the work description detection.

## [1.2.4] - 2026-03-17

### Added
- Added support for `languages` (Foreign Language) and `computerSkills` detection and autofill.
- Added default templates for language and computer skills in `data.js`.
- Enabled Scoped (Anti-mis-fill) mode for `selfEvaluations`, `languages`, and `computerSkills`.
  - Filling these sections now targets only the currently interacted field, preventing unwanted overwrites of other form fields.

### Fixed
- Improved compatibility for Feishu (Lark) recruitment platform "Description" labels.

## [1.2.3] - 2026-03-17

### Fixed
- Improved compatibility for Feishu (Lark) Recruitment platform (e.g., GF Fund).
- Added generic recognition for labels containing `描述` (Description), mapping them to internship/project `content`.
- Optimized internship section detection (`描述` is now a container scoping keyword).

## [1.2.2] - 2026-02-25

### Added
- Added `homeAddress` field to personal info templates and Editor form.

### Fixed
- Added compatibility for project textareas labeled as `项目内容` (mapped to generic project `content`).

## [1.2.1] - 2026-02-25

### Fixed
- Added scoped autofill mode for repeated-entry pages (fills only the currently edited block for internships/projects/educations).
- Fixed Moka-style project section compatibility where labels like `项目经验` may be used.
- Fixed project section field targeting on Moka-style pages (`projectName` and generic project description mapping).
- Verified end-to-end autofill flow on Envision recruiting site (Moka-based).

## [1.2.0] - 2026-02-25

### Added
- Added `personalInfos` template section with autofill support for:
  - full name
  - phone number
  - email
  - ID number
- Added `educations` template section with autofill support for:
  - school name
  - campus experience
  - core courses
- Extended Editor to support CRUD for:
  - personal infos
  - educations
- Extended Popup to render quick-fill template buttons for personal info and education sections.

### Changed
- Upgraded form field detection logic to distinguish personal contact fields from referee contact fields.
- Extended text-field event triggering to include education text fields.

## [1.1.0-beta.1] - 2026-02-25

### Added
- Created `ResumeFiller` as a generic extension fork based on EasyResume.
- Added `storage.js` and unified runtime data source to `chrome.storage.local`.
- Added `editor.html` + `editor.js` for in-browser resume data management.
- Added CRUD support for:
  - internships
  - projects
  - self evaluations
- Added JSON import/export in Editor.
- Added EasyResume-to-ResumeFiller import template: `easyresume-import.json`.

### Changed
- Replaced personal default dataset with generic defaults in `data.js`.
- Updated product naming to `ResumeFiller` in manifest, popup, and logs.
- Switched popup template rendering from static `data.js` to storage-first loading.
- Updated content autofill flow to use storage-first resume data.

### Fixed
- Fixed missing autofill for labels such as `职责业绩`.
- Added support for self-evaluation label `优势亮点`.
- Fixed wrong fill target where BOSS `工作内容` could be written into `工作业绩`.
- Restricted `工作业绩/业绩成果` from being treated as `content` target fields.

---

## Versioning policy
- Patch (`x.y.Z`): bug fixes and compatibility fixes.
- Minor (`x.Y.0`): backward-compatible feature additions.
- Note: Chrome extension `manifest.version` must be numeric dot-separated only.
