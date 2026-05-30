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

## 6) BOSS (Zhipin) Content & Scoped Fill Limitations
- **Symptom**:
  - Internships: only basic fields (company/department/position) are filled reliably; other internship long-text fields may not be populated.
  - Projects: long-text distribution between "project description" (long) and "project intro" (short) may be incorrect; one of the targets can remain empty.
  - Self-evaluation & Education: those sections may not be filled (or only partially filled) on some pages/components.
- **Workaround**: Use manual input (or the plugin's scoped filling after clicking the exact target input first). If it still fails, capture the label text + screenshot and add it to the report.

## 7) 51job (xyz.51job.com) Custom Dropdowns and "Other" Field Mis-detection
- **Symptom**:
  - **Dropdown Compatibility**: Fields like School and Major often use custom dropdown components in 51job-based sites, which the extension cannot currently simulate for selection.
  - **"Other" Field Mis-detection**: When primary dropdown fields cannot be filled, the extension may identify the "Other School" or "Other Major" text inputs below and fill them, leading to data misplacement.
- **Reason**: 51job sites use legacy DOM structures and heavy custom scripts for dropdowns; a conservative strategy is currently used to avoid interfering with their internal logic.
- **Workaround**: Manually select the correct item from the dropdown and clear the mis-filled content in the "Other" text fields.
