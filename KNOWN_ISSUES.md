# Known Issues

This file lists known limitations and temporary workarounds.

## 1) Site-specific label drift
- **Symptom**: Same semantic field has different labels on different platforms.
- **Impact**: Some textareas/dropdowns may not match on first attempt.
- **Workaround**: Use template button again after scrolling into the target block; if still failing, fill once manually and report field label + screenshot.

## 2) Complex dropdown components
- **Symptom**: Industry/company type/work type may fail on custom dropdown widgets.
- **Impact**: Field highlighted but not selected.
- **Workaround**: Manual select for that field; keep other fields auto-filled.

## 3) Date autofill is currently muted
- **Symptom**: Start/end date can remain blank.
- **Reason**: Prevent destructive mismatch across incompatible date pickers.
- **Workaround**: Fill date manually after autofill.

## 4) Safari is not supported in current package
- **Symptom**: Chrome extension package cannot be loaded directly in Safari.
- **Workaround**: Use Chrome/Edge first. Safari adaptation should be a separate roadmap item.

## 5) Work content vs work achievement
- **Symptom**: Some sites have both `工作内容` and `工作业绩`.
- **Current behavior**: ResumeFiller intentionally avoids auto-filling `工作业绩` to reduce wrong writes.

## 6) Bank of China (Yingcai) Recognition Limitation
- **Symptom**: The system uses deep table nesting (TR/TD isolation), which makes it hard for the plugin to associate labels via context, leading to field misplacement or misses.
- **Workaround**: After clicking a specific input box on that page, use the plugin's **"Scoped Fill"** feature to fill near the cursor manually.

## 7) BOSS (Zhipin) Content & Scoped Fill Limitations
- **Symptom**:
  - Internships: only basic fields (company/department/position) are filled reliably; other internship long-text fields may not be populated.
  - Projects: long-text distribution between "project description" (long) and "project intro" (short) may be incorrect; one of the targets can remain empty.
  - Self-evaluation & Education: those sections may not be filled (or only partially filled) on some pages/components.
- **Workaround**: Use manual input (or the plugin's scoped filling after clicking the exact target input first). If it still fails, capture the label text + screenshot and add it to the report.
