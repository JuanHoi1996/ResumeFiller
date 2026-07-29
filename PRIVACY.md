# ResumeFiller Privacy Policy

**Last updated:** 2026-07-29  
**Applies to:** the ResumeFiller browser extension

**Summary:** Resume templates you enter are stored only in your browser’s local extension storage. ResumeFiller does **not** upload resume data to our servers, run telemetry, or sell data. When you click autofill, selected fields are written into the recruitment page you currently have open (that site’s privacy policy then applies).

Browsable copy: [`privacy.html`](privacy.html) in this repository. 

Chinese (authoritative for CN store listings): [PRIVACY.zh-CN.md](PRIVACY.zh-CN.md).

## 1. What information we process

Only resume template data you voluntarily enter or import in the editor, which may include name, phone, email, ID numbers, addresses, political status, emergency contacts, family members, education/work/project history, and similar fields—some of which may be sensitive. Avoid storing real resumes on shared devices; clear data when finished.

You are responsible for ensuring you have the right to enter, store, and submit **third-party** information (e.g. family members, emergency contacts, referees). ResumeFiller only stores what you provide locally and, when you click autofill, writes it into the page you have open.

## 2. Where it is stored

Data is kept in `chrome.storage.local` on your device. Uninstalling the extension or using **Clear local data** in the editor removes saved resume data (or resets to neutral sample placeholders).

## 3. What we do not do

- Upload resume content to developer or third-party servers
- Analytics, advertising tracking, or remote code loading
- Require an account or login

## 4. Autofill and field reports

- **Autofill:** Values are written into form controls on the active tab. The destination site may further process that data under its own policy.
- **Field report (context menu):** Copies a sanitized field structure (no entered values; URL without query/hash) to your clipboard for you to paste into feedback channels. We do not transmit the clipboard contents.

## 5. Permissions

| Permission | Purpose |
|------------|---------|
| `storage` | Save resume templates locally |
| `sidePanel` | Side panel UI |
| `contextMenus` | “Report this field” menu item |
| `clipboardWrite` | Write the field report to the clipboard |
| Host `<all_urls>` | Inject content scripts to detect and fill forms (core feature) |

## 6. How to clear data

Open the resume editor and click **Clear local data**, or remove the extension from the browser’s extensions page.

## 7. Contact

https://github.com/JuanHoi1996/ResumeFiller/issues
