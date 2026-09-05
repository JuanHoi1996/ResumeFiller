# detectField fixtures

Signal-level regression tests for `detectField` (no browser).

## Run

```bash
node tests/run-detect-fixtures.mjs
```

Writes `tests/baseline-detectField.json`.

## Fixture schema

```json
{
  "id": "unique-id",
  "origin": "where this case came from",
  "section": "internships",
  "hostname": "example.com",
  "element": { "tagName": "INPUT", "type": "text", "attrs": {} },
  "label": "",
  "placeholder": "",
  "context": "",
  "expect": "fieldName or empty string",
  "soft": false
}
```

- `soft: true` — known risk / desired future behavior; failure is WARN, does not fail CI exit code.
- Empty `expect` means “must not map to a wrong field” (return `''`).

## Scope

These fixtures exercise **keyword detection only** (label/placeholder/context/section + minimal element attrs).  
They do **not** yet cover `getLabelText` DOM climbing or `resolveScopedRoot` (need page HTML fixtures later).
