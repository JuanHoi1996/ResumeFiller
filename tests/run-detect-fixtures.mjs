/**
 * Run detectField fixtures against the current content.js (no browser).
 * Usage: node tests/run-detect-fixtures.mjs
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const fixturesDir = path.join(__dirname, 'fixtures', 'detectField');
const contentPath = path.join(root, 'content.js');

function loadDetectField(hostname = 'example.com') {
  const source = fs.readFileSync(contentPath, 'utf8');

  const sandbox = {
    console,
    window: {
      location: { hostname, href: `https://${hostname}/` },
      HTMLInputElement: { prototype: {} },
      HTMLTextAreaElement: { prototype: {} }
    },
    document: {
      addEventListener() {},
      contains() {
        return true;
      },
      createElement() {
        return { style: {}, remove() {}, value: '', select() {} };
      },
      body: {
        appendChild() {},
        removeChild() {}
      },
      querySelector() {
        return null;
      },
      querySelectorAll() {
        return [];
      },
      getElementById() {
        return null;
      },
      activeElement: null
    },
    chrome: {
      runtime: {
        getManifest: () => ({ version: '2.3.0' }),
        onMessage: { addListener() {} },
        lastError: null
      }
    },
    navigator: {
      clipboard: {
        writeText: async () => {}
      }
    },
    Event: class Event {
      constructor(type, init = {}) {
        this.type = type;
        Object.assign(this, init);
      }
    },
    InputEvent: class InputEvent {
      constructor(type, init = {}) {
        this.type = type;
        Object.assign(this, init);
      }
    },
    MouseEvent: class MouseEvent {
      constructor(type, init = {}) {
        this.type = type;
        Object.assign(this, init);
      }
    },
    KeyboardEvent: class KeyboardEvent {
      constructor(type, init = {}) {
        this.type = type;
        Object.assign(this, init);
      }
    },
    Object,
    String,
    Array,
    Math,
    JSON,
    RegExp,
    Boolean,
    Number,
    Error,
    Set,
    Map,
    Promise,
    setTimeout,
    clearTimeout
  };
  sandbox.globalThis = sandbox;
  sandbox.self = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: 'content.js' });
  if (typeof sandbox.detectField !== 'function') {
    throw new Error('detectField not found in sandbox — content.js load failed');
  }
  return sandbox;
}

function mockElement(spec = {}) {
  const tagName = (spec.tagName || 'INPUT').toUpperCase();
  const attrs = { ...(spec.attrs || {}) };
  return {
    tagName,
    type: spec.type || (tagName === 'TEXTAREA' ? 'textarea' : 'text'),
    isContentEditable: Boolean(spec.isContentEditable),
    getAttribute(name) {
      const v = attrs[name];
      return v == null ? null : String(v);
    },
    matches() {
      return false;
    },
    closest() {
      return null;
    },
    querySelector() {
      return null;
    },
    querySelectorAll() {
      return [];
    },
    dispatchEvent() {
      return true;
    },
    focus() {},
    style: {}
  };
}

function loadFixtures() {
  return fs
    .readdirSync(fixturesDir)
    .filter(f => f.endsWith('.json'))
    .sort()
    .map(f => {
      const full = path.join(fixturesDir, f);
      return { file: f, ...JSON.parse(fs.readFileSync(full, 'utf8')) };
    });
}

function main() {
  const fixtures = loadFixtures();
  const results = [];
  let hardFail = 0;
  let softFail = 0;
  let pass = 0;

  for (const fx of fixtures) {
    const sandbox = loadDetectField(fx.hostname || 'example.com');
    const el = mockElement(fx.element);
    const got = sandbox.detectField(
      el,
      fx.label || '',
      fx.placeholder || '',
      fx.context || '',
      fx.section ?? null
    );
    const expect = fx.expect ?? '';
    const ok = got === expect;
    const soft = Boolean(fx.soft);
    const row = {
      id: fx.id || fx.file,
      file: fx.file,
      soft,
      expect,
      got,
      ok,
      section: fx.section || null,
      origin: fx.origin || ''
    };
    results.push(row);
    if (ok) {
      pass += 1;
      console.log(`PASS  ${row.id} → ${got || '(empty)'}`);
    } else if (soft) {
      softFail += 1;
      console.log(`WARN  ${row.id} expect=${JSON.stringify(expect)} got=${JSON.stringify(got)}`);
    } else {
      hardFail += 1;
      console.log(`FAIL  ${row.id} expect=${JSON.stringify(expect)} got=${JSON.stringify(got)}`);
    }
  }

  const baseline = {
    generatedAt: new Date().toISOString(),
    contentSource: 'content.js',
    totals: { all: fixtures.length, pass, softFail, hardFail },
    results
  };
  const outPath = path.join(__dirname, 'baseline-detectField.json');
  fs.writeFileSync(outPath, JSON.stringify(baseline, null, 2), 'utf8');

  console.log('---');
  console.log(
    `fixtures=${fixtures.length} pass=${pass} softFail=${softFail} hardFail=${hardFail}`
  );
  console.log(`baseline → ${outPath}`);
  process.exit(hardFail > 0 ? 1 : 0);
}

main();
