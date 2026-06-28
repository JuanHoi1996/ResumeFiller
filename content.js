function setNativeValue(element, value) {
  const inputSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    'value'
  )?.set;
  const textareaSetter = Object.getOwnPropertyDescriptor(
    window.HTMLTextAreaElement.prototype,
    'value'
  )?.set;

  if (element.tagName === 'INPUT' && inputSetter) {
    inputSetter.call(element, value);
  } else if (element.tagName === 'TEXTAREA' && textareaSetter) {
    textareaSetter.call(element, value);
  } else {
    element.value = value;
  }

  ['input', 'change', 'blur'].forEach(eventType => {
    const event = new Event(eventType, { bubbles: true, cancelable: true });
    Object.defineProperty(event, 'target', { value: element, enumerable: true });
    element.dispatchEvent(event);
  });
}

function setContentEditableValue(element, value) {
  if (!element) return;
  element.focus?.();
  element.textContent = String(value ?? '');

  const inputEvent = new InputEvent('input', {
    bubbles: true,
    cancelable: true,
    data: String(value ?? '')
  });
  element.dispatchEvent(inputEvent);
  element.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
  element.dispatchEvent(new Event('blur', { bubbles: true, cancelable: true }));
}

let lastInteractedField = null;
let lastContextMenuTarget = null;

function isFillableElement(element) {
  if (!element) return false;
  return (
    element.matches?.('input, textarea, select, [role="combobox"], [contenteditable="true"]') ||
    element.isContentEditable
  );
}

document.addEventListener(
  'focusin',
  event => {
    if (isFillableElement(event.target)) {
      lastInteractedField = event.target;
    }
  },
  true
);

document.addEventListener(
  'pointerdown',
  event => {
    const target = event.target?.closest?.('input, textarea, select, [role="combobox"], [contenteditable="true"]');
    if (isFillableElement(target)) {
      lastInteractedField = target;
    }
  },
  true
);

document.addEventListener(
  'contextmenu',
  event => {
    const t = event.target;
    if (isFillableElement(t)) {
      lastContextMenuTarget = t;
      return;
    }
    const closest = t?.closest?.('input, textarea, select, [role="combobox"], [contenteditable="true"]');
    lastContextMenuTarget = isFillableElement(closest) ? closest : null;
  },
  true
);

function getElementPlaceholder(element) {
  if (!element) return '';
  if (typeof element.placeholder === 'string' && element.placeholder.trim()) {
    return element.placeholder.trim();
  }
  return (
    element.getAttribute?.('placeholder') ||
    element.getAttribute?.('aria-placeholder') ||
    element.getAttribute?.('data-placeholder') ||
    ''
  ).trim();
}

function isBossSite() {
  return /(^|\.)zhipin\.com$/i.test(window.location.hostname);
}

function stripBossExampleSample(text) {
  const t = String(text || '').trim();
  const m = t.match(/^例如[:：]\s*(.+)$/);
  return m ? m[1].trim() : '';
}

function bossExampleSampleFromField(labelText, placeholder) {
  return stripBossExampleSample(placeholder) || stripBossExampleSample(labelText) || '';
}

function bossExampleLooksLikeJobTitle(sample) {
  const s = String(sample || '').trim();
  if (!s) return false;
  return /师|员|经理|总监|主管|工程师|开发|设计|产品|运营|顾问|专员|助理|架构|招聘|HR|策划|编辑|分析师|法务|销售|客服|主播|顾问/i.test(s);
}

function bossExampleLooksLikeSchoolName(sample) {
  const s = String(sample || '').trim();
  if (!s) return false;
  return /(大学|学院|专科学校|职业技术学院|职业技术|师范|医科|分校|研究院|校区|学校|中学|附中|小学|研究生院|高职)$/.test(s);
}

function getContextHintText(element) {
  if (!element) return '';
  const parts = [];

  const formItem = element.closest?.('.ant-form-item, .el-form-item, .ivu-form-item, .feishu-form-item, .lark-form-item');
  if (formItem) {
    const formLabel = formItem.querySelector(
      '.ant-form-item-label label, .el-form-item__label, .ivu-form-item-label, label'
    );
    if (formLabel) parts.push(formLabel.textContent || '');
  }

  // Feishu (Lark) Recruitment specific label finding
  const feishuLabel = element.closest?.('.field-container')?.querySelector('.field-label');
  if (feishuLabel) parts.push(feishuLabel.textContent || '');

  // Phoenix / Beisen-like form item labels (e.g. StarCharge / Beisen Phoenix)
  const phoenixItem = element.closest?.('.form-item--phoenix, [class*="form-item--phoenix"]');
  if (phoenixItem) {
    const titleNode = phoenixItem.querySelector?.('.form-item__title');
    const phoenixTitleLabel = titleNode?.querySelector?.('label.form-item__text');
    if (phoenixTitleLabel?.textContent?.trim()) parts.push(phoenixTitleLabel.textContent || '');

    // Fallback: if no title label found, grab any label.form-item__text within this item.
    if (!phoenixTitleLabel) {
      const anyLabel = phoenixItem.querySelector?.('label.form-item__text');
      if (anyLabel?.textContent?.trim()) parts.push(anyLabel.textContent || '');
    }

    // Also capture other label titles in the same row/group so "职务" can be disambiguated under "项目"
    const phoenixGroupRoot =
      phoenixItem.closest?.('.fields-row') ||
      phoenixItem.closest?.('.form-part-body') ||
      phoenixItem.closest?.('.form-part') ||
      phoenixItem.closest?.('.fields-col') ||
      null;
    if (phoenixGroupRoot) {
      const siblingLabels = Array.from(
        phoenixGroupRoot.querySelectorAll('label.form-item__text')
      )
        .map(l => (l.textContent || '').trim())
        .filter(Boolean);

      for (const t of siblingLabels.slice(0, 10)) {
        if (t && !parts.includes(t)) parts.push(t);
      }
    }
  }

  // Phoenix / Beisen-like form item labels
  const phoenixFormItem = element.closest?.(
    '.phoenix-form-item, [class*="phoenix-form-item"], .beisen-form-item, [class*="beisen-form-item"], [class*="form-item"]'
  );
  if (phoenixFormItem) {
    const phoenixLabel = phoenixFormItem.querySelector(
      '.phoenix-form-item__label, [class*="phoenix-form-item__label"], .beisen-form-item__label, [class*="beisen-form-item__label"], [class*="form-item__label"], label'
    );
    if (phoenixLabel) parts.push(phoenixLabel.textContent || '');
  }

  // Conservative ancestor sibling check (max 2 levels up, scan up to 2 previous siblings)
  let node = element;
  for (let i = 0; i < 2 && node; i += 1) {
    let prev = node.previousElementSibling;
    let scanCount = 0;
    while (prev && scanCount < 2) {
      const text = (prev.textContent || '').trim();
      if (text.length > 0 && text.length < 30) parts.push(text);
      prev = prev.previousElementSibling;
      scanCount += 1;
    }
    node = node.parentElement;
  }

  return parts.join(' ').trim();
}

function getLabelText(element) {
  if (!element) return '';
  // High-Priority: 51job/xyz style explicit attributes
  const cname = element.getAttribute?.('cname');
  if (cname?.trim()) return cname.trim();
  const ename = element.getAttribute?.('ename');
  if (ename?.trim()) return ename.trim();

  // Phoenix / Beisen-like label (e.g. div.form-item--phoenix > div.form-item__title > label.form-item__text)
  const phoenixItem = element.closest?.('.form-item--phoenix, [class*="form-item--phoenix"]');
  if (phoenixItem) {
    // Prefer the canonical title structure, but fall back to any label.form-item__text inside the item.
    const titleNode = phoenixItem.querySelector?.('.form-item__title');
    const phoenixTitleLabel = titleNode?.querySelector?.('label.form-item__text');
    if (phoenixTitleLabel?.textContent?.trim()) return phoenixTitleLabel.textContent.trim();

    const anyLabel = phoenixItem.querySelector?.('label.form-item__text');
    if (anyLabel?.textContent?.trim()) return anyLabel.textContent.trim();
  }

  const ariaLabelledBy = element.getAttribute?.('aria-labelledby');
  if (ariaLabelledBy) {
    const labelNode = document.getElementById(ariaLabelledBy);
    if (labelNode?.textContent?.trim()) return labelNode.textContent.trim();
  }

  if (element.id) {
    const byFor = document.querySelector(`label[for="${element.id}"]`);
    if (byFor) return byFor.textContent.trim();
  }

  const byClosest = element.closest('label');
  if (byClosest) return byClosest.textContent.trim();

  let parent = element.parentElement;
  while (parent && parent !== document.body) {
    const directLabel = parent.querySelector(':scope > label');
    if (directLabel) return directLabel.textContent.trim();

    const formLabel = parent.querySelector(
      ':scope > .ant-form-item-label label, :scope > .el-form-item__label, :scope > .ivu-form-item-label'
    );
    if (formLabel) return formLabel.textContent.trim();

    const phoenixLabel = parent.querySelector(
      ':scope > .phoenix-form-item__label, :scope > [class*="phoenix-form-item__label"], :scope > .beisen-form-item__label, :scope > [class*="beisen-form-item__label"], :scope > [class*="form-item__label"]'
    );
    if (phoenixLabel) return phoenixLabel.textContent.trim();

    parent = parent.parentElement;
  }

  let prev = element.previousElementSibling;
  while (prev) {
    if (prev.tagName === 'LABEL') return prev.textContent.trim();
    // Support non-label tag elements that look like a label (e.g., text with colon at the end)
    if (prev.tagName === 'SPAN' || prev.tagName === 'DIV' || prev.tagName === 'TD' || prev.tagName === 'TH') {
      const text = (prev.textContent || '').trim();
      if (text && (text.endsWith(':') || text.endsWith('：') || text.length < 15)) {
        return text;
      }
    }
    prev = prev.previousElementSibling;
  }

  return (
    getElementPlaceholder(element) ||
    element.getAttribute('aria-label') ||
    element.getAttribute('aria-labelledby') ||
    element.getAttribute('name') ||
    ''
  ).trim();
}

function toCompactText(...parts) {
  return parts.join(' ').replace(/\s+/g, '');
}

function normalizeToYYYYMM(dateLike) {
  if (!dateLike) return '';
  const raw = String(dateLike).trim();
  const iso = raw.match(/^(\d{4})-(\d{1,2})(?:-(\d{1,2}))?$/);
  if (iso) return `${iso[1]}-${iso[2].padStart(2, '0')}`;

  const zh = raw.match(/(\d{4})年\s*(\d{1,2})月/);
  if (zh) return `${zh[1]}-${String(zh[2]).padStart(2, '0')}`;
  return raw;
}

const ENABLE_DATE_AUTOFILL = false;

function normalizeText(text) {
  return String(text || '').replace(/\s+/g, '').trim();
}

function isElementVisible(element) {
  if (!element) return false;
  const style = window.getComputedStyle(element);
  return (
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    style.opacity !== '0' &&
    element.offsetWidth > 0 &&
    element.offsetHeight > 0
  );
}

function getScopeHintKeywords(section) {
  const bySection = {
    personalInfos: ['个人信息', '基本信息', '姓名', '邮箱', '邮件', '手机', '手机号', '证件', '证件号', '身份证', '地址', '住址', '家庭住址', '户籍所在地', '户籍地址', '联系方式', '身高', '体重', '籍贯', '政治面貌'],
    internships: [
      '公司',
      '企业名称',
      '单位',
      '单位规模',
      '公司规模',
      '汇报对象',
      '部门',
      '职位',
      '岗位',
      '工作内容',
      '在职时间',
      '任职时间',
      '描述',
      '主要业绩',
      '职务',
      '离职原因',
      '实习',
      '实习经历',
      '工作经历'
    ],
    projects: ['项目', '项目名称', '项目描述', '项目经验', '项目职责', '项目成果', '项目链接', '起止时间', '项目内容', '主要业绩'],
    educations: ['学校', '院校', '学院', '在校经历', '核心课程', '主修课程', '教育经历', '学历', '专业', '课程', '荣誉'],
    selfEvaluations: ['自我评价', '个人评价', '自我介绍', '个人优势', '优势亮点', '评价内容'],
    languages: ['外语', '英语', '等级', '熟练程度', '语言能力'],
    computerSkills: ['计算机', '技能', '熟练程度', '软件', '编程', 'IT技能'],
    familyMembers: ['家庭成员', '成员', '关系', '姓名', '工作单位', '职务', '政治面貌', '联系电话', '父亲', '母亲', '配偶', '子女', '父母'],
    openQuestions: ['规划', '理由', '说明', '陈述', '性格', '特长', '爱好', '其他', '背景', '看法'],
    papers: ['论文', '发表', '刊物', '期刊', '会议', '作者', '链接', 'DOI', '检索'],
    gameExperience: ['游戏', '游玩', '品类', '时长', '频率', '本命', '段位', '等级', '成就', '审美', '见解']
  };
  return bySection[section] || bySection.internships;
}

function isLikelyEntryContainer(node, section) {
  if (!node || node === document.body || node === document.documentElement) return false;
  const controls = node.querySelectorAll?.('input, textarea, select, [role="combobox"], [contenteditable="true"]');
  const minControls = ['selfEvaluations', 'languages', 'computerSkills', 'openQuestions'].includes(section) ? 1 : 2;
  if (!controls || controls.length < minControls || controls.length > 60) return false;

  const text = normalizeText(node.textContent || '');
  const hitCount = getScopeHintKeywords(section).filter(keyword => text.includes(normalizeText(keyword))).length;
  // For single-field sections, one keyword hit is often enough to identify the box
  const minHits = ['selfEvaluations', 'languages', 'computerSkills'].includes(section) ? 1 : 2;
  return hitCount >= minHits;
}

function containerHasPayloadField(node, payload, section) {
  if (!node || !payload) return false;
  const keys = new Set(Object.keys(payload));
  const controls = Array.from(
    node.querySelectorAll?.('input, textarea, select, [role="combobox"], [contenteditable="true"]') || []
  ).filter(isElementVisible);
  if (controls.length < 2) return false;

  // Open questions / fallback: do not depend on label/placeholder keywords.
  // We only need a visible large text control inside this container.
  if (section === 'openQuestions' && Object.prototype.hasOwnProperty.call(payload, 'content')) {
    return controls.some(el => el.tagName === 'TEXTAREA' || el.isContentEditable || el.getAttribute('role') === 'textbox');
  }

  const matchedFields = new Set();
  for (const element of controls) {
    const field = detectField(
      element,
      getLabelText(element),
      getElementPlaceholder(element),
      getContextHintText(element),
      section
    );
    if (field && keys.has(field)) {
      matchedFields.add(field);
    }
  }

  if (section === 'personalInfos') {
    const infoAnchors = ['fullName', 'phone', 'email', 'idNumber', 'height', 'weight', 'nativePlace', 'politicalStatus'];
    // For personal info, require at least 2 anchors to consider it a "full section" container,
    // otherwise it might stop at a single-field card (e.g. just Name card).
    const matchedCount = infoAnchors.filter(f => matchedFields.has(f)).length;
    return matchedCount >= 1; // We keep it at 1 for basic detection, but see resolveScopedRoot for the real fix
  }

  if (section === 'internships') {
    // For internships, avoid selecting "family/person cards" as entry containers.
    // Require at least one strong internship anchor field inside the container.
    // BOSS (zhipin) uses placeholder-only rows like "例如: 直聘网" — company/position must count as anchors.
    const internshipAnchors = [
      'start',
      'end',
      'content',
      'leaveReason',
      'companyType',
      'workType',
      'location',
      'industry',
      'company',
      'position'
    ];
    return internshipAnchors.some(f => matchedFields.has(f));
  }

  if (section === 'educations') {
    const educationAnchors = [
      'schoolName',
      'major',
      'college',
      'educationSummary',
      'educationExperience',
      'coreCourses'
    ];
    return educationAnchors.some(f => matchedFields.has(f));
  }

  if (section === 'papers') {
    const paperAnchors = ['paperName', 'paperChannel', 'paperLink', 'content'];
    return paperAnchors.some(f => matchedFields.has(f));
  }

  if (section === 'gameExperience') {
    const gameAnchors = ['gameList', 'gameFrequency', 'gameBest', 'gameInsight', 'content'];
    return gameAnchors.some(f => matchedFields.has(f));
  }

  if (matchedFields.size >= 2) return true;

  if (section === 'projects') {
    const projectAnchorFields = ['projectName', 'projectRoleTitle', 'projectDesc', 'content'];
    return projectAnchorFields.some(field => matchedFields.has(field)) && controls.length >= 3;
  }
  return false;
}

function resolveScopedRoot(section, payload) {
  const anchor =
    (lastInteractedField && document.contains(lastInteractedField) ? lastInteractedField : null) ||
    (isFillableElement(document.activeElement) ? document.activeElement : null);
  if (!anchor) return null;

  let node = anchor;
  for (let i = 0; i < 12 && node && node !== document.body; i += 1) {
    const likely = isLikelyEntryContainer(node, section);
    const payloadOk = containerHasPayloadField(node, payload, section);
    // Projects / educations / papers / games (e.g. BOSS Zhipin): keyword-only likely-container can stop too early
    // when fields are split across sibling cards — prefer payload-matching subtrees first.
    if (['projects', 'educations', 'papers', 'gameExperience'].includes(section)) {
      if (payloadOk) return node;
    } else if (section === 'personalInfos') {
      // For personal info, if we only found 1-2 fields, keep going up to find a larger section container
      // (e.g. common ancestor of Name card and Height card).
      const infoAnchors = ['fullName', 'phone', 'email', 'idNumber', 'height', 'weight', 'nativePlace', 'politicalStatus'];
      const matchedCount = infoAnchors.filter(f => {
        const matched = detectField(anchor, getLabelText(anchor), getElementPlaceholder(anchor), getContextHintText(anchor), section);
        return matched === f;
      }).length; // This is a simplified check, containerHasPayloadField is better

      // Re-run container check to get the actual count in this node
      const matchedFields = new Set();
      const controls = Array.from(node.querySelectorAll('input, textarea, select')).filter(isElementVisible);
      controls.forEach(el => {
        const f = detectField(el, getLabelText(el), getElementPlaceholder(el), getContextHintText(el), section);
        if (f && infoAnchors.includes(f)) matchedFields.add(f);
      });

      // If this container has most of our payload, or at least 3 fields, it's a good root.
      if (matchedFields.size >= 3 || matchedFields.size === Object.keys(payload).length) return node;
    } else {
      if (likely) return node;
      if (payloadOk) return node;
    }
    node = node.parentElement;
  }
  return null;
}

function splitCandidates(value) {
  return String(value || '')
    .split(/[\/、,，|]/)
    .map(v => v.trim())
    .filter(Boolean);
}

function emitInputEvents(element) {
  ['input', 'change', 'blur'].forEach(eventType => {
    const event = new Event(eventType, { bubbles: true, cancelable: true });
    Object.defineProperty(event, 'target', { value: element, enumerable: true });
    element.dispatchEvent(event);
  });
}

function trySelectOption(selectEl, targetValue) {
  if (!selectEl || selectEl.tagName !== 'SELECT') return false;
  const target = normalizeText(targetValue);
  if (!target) return false;

  const options = Array.from(selectEl.options || []);
  if (!options.length) return false;

  const direct = options.find(opt => normalizeText(opt.value) === target || normalizeText(opt.textContent) === target);
  const fuzzy = options.find(opt => {
    const valueText = normalizeText(opt.value);
    const labelText = normalizeText(opt.textContent);
    return valueText.includes(target) || target.includes(valueText) || labelText.includes(target) || target.includes(labelText);
  });
  const hit = direct || fuzzy;
  if (!hit) return false;

  selectEl.value = hit.value;
  if (selectEl.value !== hit.value) {
    selectEl.selectedIndex = options.indexOf(hit);
  }
  emitInputEvents(selectEl);
  return true;
}

function isSelectMatched(selectEl, targetValue) {
  if (!selectEl || selectEl.tagName !== 'SELECT') return false;
  const target = normalizeText(targetValue);
  if (!target) return false;
  const selected = selectEl.options?.[selectEl.selectedIndex];
  if (!selected) return false;
  const valueText = normalizeText(selected.value);
  const labelText = normalizeText(selected.textContent);
  return valueText.includes(target) || target.includes(valueText) || labelText.includes(target) || target.includes(labelText);
}

function tryFillLocationLikeElement(element, value) {
  if (!element || !value) return false;

  if (element.tagName === 'SELECT') {
    const text = String(value);
    const segments = text.split('/').map(s => s.trim()).filter(Boolean);
    const fallbackList = [text, segments[segments.length - 1], segments[segments.length - 2]].filter(Boolean);
    return fallbackList.some(candidate => trySelectOption(element, candidate));
  }

  if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
    setNativeValue(element, value);
    return true;
  }

  if (element.getAttribute('role') === 'combobox') {
    const innerInput = element.querySelector('input, textarea');
    if (!innerInput) return false;
    setNativeValue(innerInput, value);
    innerInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    innerInput.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true }));
    return true;
  }

  return false;
}

function isOptionTextMatched(optionText, targetValue) {
  const option = normalizeText(optionText);
  if (!option) return false;
  const candidates = splitCandidates(targetValue);
  if (!candidates.length) return false;
  return candidates.some(candidate => {
    const target = normalizeText(candidate);
    return option === target || option.includes(target) || target.includes(option);
  });
}

function clickElement(element) {
  if (!element) return;
  element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
  element.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
  element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
}

function getSingleChoiceValueText(element) {
  if (!element) return '';
  if (element.tagName === 'SELECT') {
    const selected = element.options?.[element.selectedIndex];
    return selected ? selected.textContent : '';
  }
  if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
    return element.value || '';
  }
  const combo = element.matches?.('[role="combobox"]') ? element : element.closest?.('[role="combobox"]');
  if (combo) {
    const input = combo.querySelector('input, textarea');
    if (input && input.value) return input.value;
    return combo.textContent || '';
  }
  return (element.textContent || '').trim();
}

function tryFillSingleChoiceDropdown(element, targetValue) {
  if (!element || !targetValue) return false;
  const candidates = splitCandidates(targetValue);
  if (!candidates.length) return false;

  if (element.tagName === 'SELECT') {
    return candidates.some(candidate => trySelectOption(element, candidate));
  }

  const root =
    element.closest?.('[role="combobox"], .ant-select, .el-select, .ivu-select, .n-select, .arco-select, .semi-select') ||
    element.parentElement ||
    element;

  clickElement(root);
  if (root !== element) clickElement(element);

  const optionSelectors = [
    '[role="option"]',
    '.ant-select-item-option-content',
    '.ant-select-item-option',
    '.el-select-dropdown__item',
    '.ivu-select-item',
    '.n-base-select-option',
    '.arco-select-option',
    '.semi-select-option',
    '.dropdown-item',
    'li[aria-selected]',
    'li[data-value]'
  ].join(',');

  const options = Array.from(document.querySelectorAll(optionSelectors)).filter(isElementVisible);
  const option = options.find(opt => isOptionTextMatched(opt.textContent, targetValue));
  if (option) {
    clickElement(option);
    emitInputEvents(element);
    return true;
  }

  const input = element.matches?.('input, textarea')
    ? element
    : root.querySelector?.('input, textarea');
  if (input) {
    const first = candidates[0];
    setNativeValue(input, first);
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    input.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true }));
    return true;
  }

  return false;
}

function resolveTemplate(dataSource, section, key) {
  if (!dataSource) return null;
  if (!section || !key) return null;
  const item = dataSource?.[section]?.[key];
  if (!item) return null;
  if (item.payload) return item.payload;

  if (section === 'familyMembers' && item.payload) return item.payload;
  if (section === 'openQuestions' && item.payload) return item.payload;

  if (section === 'selfEvaluations' && item.content) {
    return {
      selfEvaluation: item.content,
      content: item.content
    };
  }

  if (section === 'languages' && item.content) {
    return {
      languageSkills: item.content,
      content: item.content
    };
  }

  if (section === 'computerSkills' && item.content) {
    return {
      computerSkills: item.content,
      content: item.content
    };
  }

  return null;
}

function getDefaultPayload() {
  if (typeof resumeData === 'undefined') return null;
  const section = resumeData?.defaultTemplate?.section;
  const key = resumeData?.defaultTemplate?.key;
  return resolveTemplate(resumeData, section, key);
}

function detectField(element, labelText, placeholder, contextText, section = null) {
  const type = (element.type || '').toLowerCase();
  const cname = (element.getAttribute?.('cname') || '').trim();
  const ename = (element.getAttribute?.('ename') || '').trim();

  // Combine label, placeholder, and 51job specific attributes for primary matching
  const primaryText = toCompactText(labelText, placeholder, cname, ename);
  const extendedText = toCompactText(labelText, placeholder, contextText, cname, ename);
  const normalizedSection = section ? String(section).trim() : null;

  // 1. Context Bleed Protection: Clear context for generic fields that often trigger false positives
  let effectiveContext = contextText;
  if (
    primaryText.includes('姓名') ||
    primaryText.includes('邮箱') ||
    primaryText.includes('邮件') ||
    primaryText.includes('证件') ||
    primaryText.includes('身份证') ||
    primaryText.includes('学校') ||
    primaryText.includes('院校') ||
    primaryText.includes('学院') ||
    primaryText.includes('职务') ||
    primaryText.includes('职位') ||
    primaryText.includes('岗位') ||
    primaryText.includes('电话') ||
    primaryText.includes('手机') ||
    primaryText.includes('联系方式') ||
    primaryText.includes('描述') ||
    primaryText.includes('地址') ||
    primaryText.includes('住址') ||
    primaryText.includes('公司') ||
    primaryText.includes('单位') ||
    primaryText.includes('职业') ||
    primaryText.includes('职务') ||
    primaryText.includes('身高') ||
    primaryText.includes('体重') ||
    primaryText.includes('离职原因')
  ) {
    effectiveContext = '';
  }

  const text = effectiveContext ? extendedText : primaryText;

  // 2. High-Priority Direct Mappings (Check Primary Labels first)
  const isPersonalInfoSection = !normalizedSection || normalizedSection === 'personalInfos';
  if (isPersonalInfoSection && (primaryText.includes('家庭住址') || primaryText.includes('家庭地址') || primaryText.includes('现居地址'))) return 'homeAddress';
  if (isPersonalInfoSection && (primaryText.includes('户籍所在地') || primaryText.includes('户籍地址') || primaryText.includes('户籍'))) return 'hukouLocation';
  if (
    isPersonalInfoSection &&
    normalizedSection !== 'familyMembers' &&
    primaryText.includes('姓名') &&
    !primaryText.includes('联系人') &&
    !primaryText.includes('证明人')
  ) {
    return 'fullName';
  }
  if (isPersonalInfoSection && (primaryText.includes('邮箱') || primaryText.includes('邮件'))) return 'email';
  if (isPersonalInfoSection && (primaryText.includes('手机号') || primaryText.includes('手机号码'))) {
    return 'phone';
  }
  if (isPersonalInfoSection && (primaryText.includes('证件号码') || primaryText.includes('证件号') || primaryText.includes('身份证'))) return 'idNumber';
  if (isPersonalInfoSection && (primaryText.includes('身高') || primaryText.includes('Height'))) return 'height';
  if (isPersonalInfoSection && (primaryText.includes('体重') || primaryText.includes('Weight'))) return 'weight';
  if (isPersonalInfoSection && (primaryText.includes('籍贯') || primaryText.includes('出生地'))) return 'nativePlace';
  if (isPersonalInfoSection && (primaryText.includes('政治面貌') || primaryText.includes('面貌'))) return 'politicalStatus';
  if (isPersonalInfoSection && (primaryText.includes('紧急联系人') || primaryText.includes('联系人姓名'))) return 'emergencyContact';
  if (isPersonalInfoSection && (primaryText.includes('紧急联系电话') || primaryText.includes('紧急联系人电话') || primaryText.includes('联系人电话'))) return 'emergencyPhone';

  // Paper Logic
  if (normalizedSection === 'papers') {
    if (text.includes('论文名称') || text.includes('题目') || text.includes('标题')) return 'paperName';
    if (text.includes('发表渠道') || text.includes('发布渠道') || text.includes('刊物') || text.includes('期刊') || text.includes('会议')) return 'paperChannel';
    if (text.includes('作者顺序') || text.includes('排名')) return 'authorOrder';
    if (text.includes('链接') || text.includes('URL') || text.includes('DOI')) return 'paperLink';
    if (text.includes('发表等级') || text.includes('收录') || text.includes('级别')) return 'paperLevel';
    if (text.includes('发表状态') || text.includes('状态')) return 'paperStatus';
    if (text.includes('描述') || text.includes('简介') || text.includes('摘要')) return 'content';
  }

  // Game Experience Logic (Common in Game Industry Recruitment)
  if (normalizedSection === 'gameExperience') {
    if (text.includes('游玩的游戏') || text.includes('常用') || text.includes('经常玩') || text.includes('游戏列表') || text.includes('游戏名')) return 'gameList';
    if (text.includes('频率') || text.includes('时长') || text.includes('多久')) return 'gameFrequency';
    if (text.includes('本命') || text.includes('最喜欢') || text.includes('最热爱')) return 'gameBest';
    if (text.includes('成就') || text.includes('段位') || text.includes('等级') || text.includes('荣誉') || text.includes('最高')) return 'gameAchievement';
    if (text.includes('见解') || text.includes('审美') || text.includes('分析') || text.includes('看法') || text.includes('为何喜欢')) return 'gameInsight';
    if (text.includes('描述') || text.includes('经历') || text.includes('总结')) return 'content';
  }

  // Phoenix often uses label like "开始时间/结束时间" while placeholder is just "请选择"
  if (
    primaryText.includes('开始时间') ||
    primaryText.includes('开始日期') ||
    primaryText.includes('入职时间') ||
    primaryText.includes('在职时间')
  ) return 'start';
  if (
    primaryText.includes('结束时间') ||
    primaryText.includes('结束日期') ||
    primaryText.includes('离职时间')
  ) return 'end';

  // Internship content label is commonly "实习内容"
  if (primaryText.includes('实习内容') || primaryText.includes('实习描述')) return 'content';

  if (primaryText.includes('部门') && !primaryText.includes('学院')) return 'department';
  
  // 3. Section-Specific Mappings (with Context)
  // Family Member Logic (PRIORITY: Before Job Logic to avoid generic "Title/Company" conflicts)
  if (normalizedSection === 'familyMembers') {
    if (text.includes('关系') || text.includes('称谓')) return 'familyRelation';
    if (text.includes('姓名')) return 'familyName';
    // Prioritize specific position/job labels to avoid context bleed from "Company"
    if (text.includes('职务') || text.includes('职称') || text.includes('职位') || text.includes('职业')) return 'familyPosition';
    if (text.includes('工作单位') || text.includes('单位') || text.includes('单位及职务')) return 'familyCompany';
    if (text.includes('电话') || text.includes('手机') || text.includes('联系方式')) return 'familyPhone';
    if (text.includes('政治面貌') || text.includes('面貌')) return 'familyPoliticalStatus';
  }

  // Open Questions Logic
  // (intentionally removed) openQuestions no longer relies on label/placeholder keywords.

  // Referee Logic
  if (
    normalizedSection === 'internships' &&
    (text.includes('证明人') || text.includes('联系人') || text.includes('汇报对象') || text.includes('汇报人'))
  ) {
    if (primaryText.includes('电话') || primaryText.includes('手机') || primaryText.includes('联系方式')) return 'refereePhone';
    // Strict Title detection for referees to avoid hijacking the Name field
    if (primaryText.includes('单位') || primaryText.includes('职务') || primaryText.includes('单位及职务')) return 'refereeCompanyTitle';
    // If the label is JUST "Referee" or similar, it's most likely the name
    if (primaryText.includes('证明人') || primaryText.includes('联系人') || primaryText.includes('汇报对象') || primaryText.includes('汇报人') || primaryText === '') {
      return 'refereeName';
    }
  }

  // Education Logic
  if (normalizedSection === 'educations') {
    if (
      isBossSite() &&
      element.tagName === 'INPUT' &&
      (type === 'text' || type === 'search' || type === '')
    ) {
      const egSample = bossExampleSampleFromField(labelText, placeholder);
      if (egSample) {
        return bossExampleLooksLikeSchoolName(egSample) ? 'schoolName' : 'major';
      }
    }
    if (isBossSite() && element.tagName === 'TEXTAREA') {
      const pt = primaryText;
      if (pt.includes('在校担任') || pt.includes('获得荣誉') || pt.includes('所学主要课程')) {
        return 'educationSummary';
      }
    }
    if (text.includes('在校经历/核心课程')) return 'educationSummary';
    if (text.includes('在校经历') || text.includes('校园经历')) return 'educationExperience';
    if (text.includes('核心课程') || text.includes('主修课程') || text.includes('专业课程')) return 'coreCourses';
    if (text.includes('学院') || text.includes('院系') || text.includes('学部')) return 'college';
    if (text.includes('专业') && !text.includes('课程')) return 'major';
    if (text.includes('学校名称') || text.includes('毕业院校') || text.includes('学校')) return 'schoolName';
  }

  // Project role: Phoenix/Beisen may label "project role" as just "职务"
  // Use extendedText to detect the "project context" so we don't hijack internship positions.
  if (normalizedSection === 'projects' && (
    (primaryText.includes('职务') || primaryText.includes('职位') || primaryText.includes('岗位')) &&
    (extendedText.includes('项目名称') || extendedText.includes('项目描述') || extendedText.includes('项目背景') || extendedText.includes('项目概述') || extendedText.includes('项目内容') || extendedText.includes('项目经验'))
  )) {
    return 'projectRoleTitle';
  }

  // Internship/Job Logic
  if (normalizedSection === 'internships') {
    if (
      isBossSite() &&
      element.tagName === 'INPUT' &&
      (type === 'text' || type === 'search' || type === '')
    ) {
      const egSample = bossExampleSampleFromField(labelText, placeholder);
      if (egSample) {
        return bossExampleLooksLikeJobTitle(egSample) ? 'position' : 'company';
      }
    }
    if (text.includes('离职原因')) return 'leaveReason';
    if (text.includes('单位性质')) return 'companyType';
    if (text.includes('工作性质')) return 'workType';
    if (text.includes('部门') || text.includes('团队') || text.includes('产品部')) return 'department';
    if (text.includes('单位规模') || text.includes('公司规模')) return 'companySize';
    if (primaryText.includes('企业名称')) return 'company';
    if (text.includes('职务') || text.includes('职位') || text.includes('岗位')) {
      if (!text.includes('类别') && !text.includes('级别') && !text.includes('等级')) return 'position';
    }
    if (
      (text.includes('单位') || text.includes('公司')) &&
      !text.includes('规模') &&
      !text.includes('性质') &&
      !text.includes('类型') &&
      !text.includes('行业')
    ) {
      // Avoid misclassifying "measurement unit" placeholders, e.g. placeholder="（单位：cm）"
      const placeholderStr = String(placeholder || '');
      const labelStr = String(labelText || '');
      const isMeasurePlaceholder = /单位[:：]/.test(placeholderStr) && !/单位规模|单位性质|单位及职务/.test(placeholderStr);
      const labelHasCompanyUnit = labelStr.includes('单位') || labelStr.includes('公司');
      if (isMeasurePlaceholder && !labelHasCompanyUnit) return '';
      return 'company';
    }
  }

  // Project Logic
  if (normalizedSection === 'projects') {
    const dataCy = (element.getAttribute?.('data-cy') || '').toLowerCase();
    const elId = (element.id || '').toLowerCase();
    const elName = (element.name || '').toLowerCase();
    const attrHint = `${dataCy} ${elId} ${elName}`;
    if (
      /project[^a-z]*link|projectlink|linkinput/.test(attrHint) ||
      attrHint.includes('.link')
    ) {
      return 'projectLink';
    }
    if (
      isBossSite() &&
      element.tagName === 'INPUT' &&
      (type === 'text' || type === 'search' || type === '')
    ) {
      const egSample = bossExampleSampleFromField(labelText, placeholder);
      if (egSample) {
        return bossExampleLooksLikeJobTitle(egSample) ? 'projectRoleTitle' : 'projectName';
      }
    }
    if (text.includes('项目名称')) return 'projectName';
    if (text.includes('项目角色')) return 'projectRoleTitle';
    if (text.includes('技术栈')) return 'techStack';
    if (
      text.includes('项目链接') ||
      text.includes('项目网址') ||
      text.includes('项目URL') ||
      text.includes('项目地址') ||
      text.includes('仓库链接') ||
      text.includes('源码链接') ||
      text.includes('GitHub') ||
      text.includes('github') ||
      (primaryText === '链接' && !text.includes('论文'))
    ) {
      return 'projectLink';
    }
    if (text.includes('项目职责') || (text.includes('职责') && normalizedSection === 'projects')) return 'projectResponsibility';
    if (text.includes('项目成果') || text.includes('项目业绩')) return 'projectAchievement';
    if (text.includes('项目内容') || text.includes('项目描述')) return 'content';
    // Moka / Generic: if we are in projects section and label is just "内容" or "职责"
    if (normalizedSection === 'projects') {
      if (primaryText === '内容' || primaryText === '项目内容') return 'content';
      if (primaryText === '职责' || primaryText === '项目职责') return 'projectResponsibility';
    }
    // StarCharge / Phoenix: "项目描述" is closer to the general "项目描述（通用）" field (content),
    // while "项目介绍" maps to the shorter "项目介绍" field (projectDesc).
    if (text.includes('项目描述')) return 'content';
    // BOSS resume: placeholder text contains "项目经验" but maps to the long bullet field (content), not projectDesc
    if (
      text.includes('描述该项目') ||
      (text.includes('描述') && text.includes('项目') && text.includes('招聘者')) ||
      (text.includes('展示') && text.includes('项目经验'))
    ) {
      return 'content';
    }
    if (text.includes('项目介绍') || text.includes('项目背景') || text.includes('项目概述') || text.includes('项目概况') || text.includes('项目经验')) return 'projectDesc';
  }

  if (
    isBossSite() &&
    normalizedSection === 'internships' &&
    element.tagName === 'TEXTAREA'
  ) {
    const pt = primaryText;
    if (
      pt.includes('主要负责') ||
      pt.includes('店面管理') ||
      pt.includes('客单价') ||
      (/\d、/.test(pt) && (pt.includes('负责') || pt.includes('制定') || pt.includes('分析') || pt.includes('销售')))
    ) {
      return 'content';
    }
  }

  // Skills & Self-Eval
  if (normalizedSection === 'selfEvaluations') {
    if (
      text.includes('自我评价') ||
      text.includes('个人评价') ||
      text.includes('自我介绍') ||
      text.includes('个人优势') ||
      text.includes('优势亮点') ||
      text.includes('评价内容')
    ) {
      return 'selfEvaluation';
    }
  }
  if (normalizedSection === 'languages') {
    if (text.includes('获得时间') || text.includes('证书时间') || text.includes('日期') || text.includes('时间')) return 'dateEarned';
    if (text.includes('外语') || text.includes('英语')) return 'languageSkills';
  }
  if (normalizedSection === 'computerSkills') {
    if (text.includes('获得时间') || text.includes('证书时间') || text.includes('日期') || text.includes('时间')) return 'dateEarned';
    if (text.includes('计算机') || text.includes('IT技能')) return 'computerSkills';
  }

  // Generic Fallbacks
  if (text.includes('住址') || text.includes('地址') || text.includes('地点') || text.includes('城市')) return 'homeAddress';
  if (text.includes('户籍所在地') || text.includes('户籍地址') || text.includes('户籍')) return 'hukouLocation';
  if (
    (normalizedSection === 'internships' ||
      normalizedSection === 'projects' ||
      normalizedSection === 'selfEvaluations' ||
      normalizedSection === 'openQuestions' ||
      normalizedSection === 'languages' ||
      normalizedSection === 'computerSkills') &&
    (text.includes('描述') || text.includes('主要工作') || text.includes('职责业绩') || text.includes('主要业绩'))
  ) {
    // Prevent internship/project "content" from being mis-mapped into education "specialty description" fields
    // where the label/placeholder is like "专业描述".
    if (normalizedSection !== 'educations' && text.includes('专业') && text.includes('描述')) return '';
    return 'content';
  }

  // Final Date/Placeholder fallbacks
  if ((type === 'date' || type === 'text') && (placeholder.includes('开始') || placeholder.includes('入职'))) return 'start';
  if ((type === 'date' || type === 'text') && (placeholder.includes('结束') || placeholder.includes('离职'))) return 'end';

  return '';
}

function fillBossWorkContentOnly(contentValue, scopeRoot = document) {
  if (!isBossSite() || !contentValue) return false;

  const longTextInputs = Array.from(
    scopeRoot.querySelectorAll('textarea, [contenteditable="true"], [role="textbox"]')
  ).filter(isElementVisible);

  const candidate = longTextInputs.find(element => {
    const hint = toCompactText(
      getLabelText(element),
      getElementPlaceholder(element),
      getContextHintText(element)
    );
    const bossWorkLike =
      hint.includes('工作内容') ||
      hint.includes('主要负责') ||
      hint.includes('店面管理') ||
      hint.includes('客单价') ||
      (/\d、/.test(hint) && (hint.includes('负责') || hint.includes('制定') || hint.includes('分析') || hint.includes('销售')));
    return bossWorkLike && !hint.includes('工作业绩') && !hint.includes('业绩成果') && !hint.includes('描述该项目');
  });

  if (!candidate) return false;

  const currentText = candidate.isContentEditable ? String(candidate.textContent || '') : String(candidate.value || '');
  if (currentText.trim().length > 2) return false; // Avoid overriding user/already-filled value

  if (candidate.isContentEditable) {
    setContentEditableValue(candidate, contentValue);
  } else {
    setNativeValue(candidate, contentValue);
  }

  candidate.style.backgroundColor = '#d9fdd3';
  candidate.style.border = '2px solid #2e7d32';
  console.log('[ResumeFiller] BOSS专用兜底: 已定向填充工作内容');
  return true;
}

function fillGeneralWorkContentFallback(contentValue, scopeRoot = document) {
  if (!contentValue) return false;

  const longTextInputs = Array.from(
    scopeRoot.querySelectorAll('textarea, [contenteditable="true"], [role="textbox"]')
  ).filter(isElementVisible);

  const candidate = longTextInputs.find(element => {
    const hint = toCompactText(
      getLabelText(element),
      getElementPlaceholder(element),
      getContextHintText(element)
    );
    const looksLikeWorkField =
      hint.includes('工作内容') ||
      hint.includes('职责业绩') ||
      hint.includes('岗位职责') ||
      hint.includes('工作职责') ||
      hint.includes('职责描述') ||
      hint.includes('工作描述') ||
      hint.includes('任职描述') ||
      hint.includes('内容描述') ||
      hint.includes('描述') ||
      hint.includes('主要业绩');
    const looksLikeAchievementField = hint.includes('工作业绩') || hint.includes('业绩成果');
    const looksLikeProjectField = hint.includes('项目');
    return looksLikeWorkField && !looksLikeProjectField && !looksLikeAchievementField;
  });

  if (!candidate) return false;

  const currentText = candidate.isContentEditable ? String(candidate.textContent || '') : String(candidate.value || '');
  if (currentText.trim().length > 2) return false; // Avoid overriding user/already-filled value

  if (candidate.isContentEditable) {
    setContentEditableValue(candidate, contentValue);
  } else {
    setNativeValue(candidate, contentValue);
  }

  candidate.style.backgroundColor = '#d9fdd3';
  candidate.style.border = '2px solid #2e7d32';
  console.log('[ResumeFiller] 通用兜底: 已定向填充工作内容');
  return true;
}

function autoFill(payload, dataSource, scopeRoot = document, section = null) {
  if (!payload) throw new Error('未找到模板数据');

  const defaults = dataSource?.defaults || {};
  const data =
    section === 'internships'
      ? { ...defaults, ...payload }
      : { ...payload };

  const allowedFields = new Set(Object.keys(payload));
  if (section === 'internships') {
    // Keep known internship defaults (e.g. companyType/workType) fillable if the template omits them.
    Object.keys(defaults).forEach(k => allowedFields.add(k));
  }

  const results = [];
  let contentFilled = false;
  let projectDescFilled = false;

  // Open questions fallback: fill the current scope's first visible text control,
  // regardless of its label/placeholder.
  if (section === 'openQuestions' && data && typeof data.content === 'string') {
    const contentValue = data.content.trim();
    if (contentValue) {
      // Priority: If the anchor (where user clicked) is already a valid long-text input, use it directly.
      const anchor = (lastInteractedField && document.contains(lastInteractedField)) ? lastInteractedField : document.activeElement;
      const isAnchorValid = anchor && isElementVisible(anchor) && (anchor.tagName === 'TEXTAREA' || anchor.isContentEditable || anchor.getAttribute('role') === 'textbox');
      
      const targetCandidate = isAnchorValid ? anchor : Array.from(
        scopeRoot.querySelectorAll('textarea, [contenteditable="true"], [role="textbox"], input')
      ).filter(isElementVisible).find(
        el => el.tagName === 'TEXTAREA' || el.isContentEditable || el.getAttribute('role') === 'textbox'
      );

      if (targetCandidate) {
        if (targetCandidate.isContentEditable) {
          setContentEditableValue(targetCandidate, contentValue);
        } else {
          setNativeValue(targetCandidate, contentValue);
        }
        targetCandidate.style.backgroundColor = '#d9fdd3';
        targetCandidate.style.border = '2px solid #2e7d32';
        results.push({
          index: 1,
          field: 'content',
          label: 'openQuestions(指向填充)',
          value: contentValue.slice(0, 80),
          success: true
        });
        return { success: true, total: 1, filled: 1, results };
      }
    }
  }

  const elements = Array.from(
    scopeRoot.querySelectorAll('input, textarea, select, [role="combobox"], [contenteditable="true"]')
  ).filter(isElementVisible);

  console.log(`[ResumeFiller] 找到 ${elements.length} 个可见表单元素`);

  elements.forEach((element, index) => {
    const labelText = getLabelText(element);
    const placeholder = getElementPlaceholder(element);
    const contextText = getContextHintText(element);
    const field = detectField(element, labelText, placeholder, contextText, section);
    if (!field) return;
    if (!allowedFields.has(field)) return;

    // Relationship Guard: If filling a family member, ensure the label matches the specific relation if it exists
    if (data.familyRelation && field.startsWith('family')) {
      const relation = toCompactText(data.familyRelation);
      const label = toCompactText(labelText, placeholder, contextText);
      // If the form label specifies a DIFFERENT relation than the data, skip it
      // e.g. Trying to fill "Father" data into "Mother" label
      const commonRelations = ['父亲', '母亲', '配偶', '子女', '子女姓名', '父母'];
      const otherRelations = commonRelations.filter(r => r !== relation && !relation.includes(r));
      if (otherRelations.some(r => label.includes(r)) && !label.includes(relation)) {
        console.log(`[ResumeFiller] 关系不匹配跳过: ${label} != ${relation}`);
        return;
      }
    }

    const value = data[field];
    if (value === undefined || value === null || value === '') return;

    try {
      const type = (element.type || '').toLowerCase();
      let filledBySpecialHandler = false;
      let fillSucceeded = true;

      if (field === 'companyType' || field === 'workType' || field === 'companySize' || field === 'industry') {
        filledBySpecialHandler = tryFillSingleChoiceDropdown(element, value);
        if (!filledBySpecialHandler) {
          element.style.backgroundColor = '#fff59d';
          element.style.border = '2px solid #fbc02d';
          console.log(`[ResumeFiller] ${field}下拉未匹配到选项，请手动选择: ${value}`);
        }
      }

      if (!filledBySpecialHandler && field === 'location') {
        filledBySpecialHandler = tryFillLocationLikeElement(element, value);
      }

      if (field === 'start' || field === 'end') {
        if (!ENABLE_DATE_AUTOFILL) {
          results.push({
            index: index + 1,
            field,
            label: labelText || placeholder,
            value: String(value).slice(0, 80),
            success: true,
            muted: true
          });
          console.log(`[ResumeFiller] 已静音日期自动填充: ${field}`);
          return;
        }
        const month = normalizeToYYYYMM(value);
        const dateValue = type === 'date' ? `${month}-01` : month;
        setNativeValue(element, dateValue);
      } else if (!filledBySpecialHandler && element.isContentEditable) {
        setContentEditableValue(element, value);
      } else if (!filledBySpecialHandler) {
        setNativeValue(element, value);
      }

      if (field === 'content') contentFilled = true;
    if (field === 'projectDesc') projectDescFilled = true;

      if (field === 'companyType' || field === 'workType' || field === 'companySize' || field === 'industry') {
        if (element.tagName === 'SELECT') {
          fillSucceeded = isSelectMatched(element, value);
        } else {
          fillSucceeded = isOptionTextMatched(getSingleChoiceValueText(element), value);
        }
      } else if (element.tagName === 'SELECT') {
        fillSucceeded = isSelectMatched(element, value);
      }

      if (!fillSucceeded) {
        element.style.backgroundColor = '#fff59d';
        element.style.border = '2px solid #fbc02d';
      }

      // Trigger input event on all large text fields so char-count widgets update
      if (
        [
          'content',
          'projectDesc',
          'projectResponsibility',
          'projectAchievement',
          'selfEvaluation',
          'educationExperience',
          'coreCourses',
          'educationSummary',
          'languageSkills',
          'computerSkills'
        ].includes(field)
      ) {
        const inputEvent = new Event('input', { bubbles: true, cancelable: true });
        Object.defineProperty(inputEvent, 'target', { value: element, enumerable: true });
        element.dispatchEvent(inputEvent);
      }

      if (fillSucceeded) {
        element.style.backgroundColor = '#d9fdd3';
        element.style.border = '2px solid #2e7d32';
      }

      results.push({
        index: index + 1,
        field,
        label: labelText || placeholder,
        value: String(value).slice(0, 80),
        success: fillSucceeded
      });
    } catch (error) {
      results.push({
        index: index + 1,
        field,
        label: labelText || placeholder,
        error: error.message,
        success: false
      });
    }
  });

  if (section === 'internships' && data.content) {
    const fallbackOk =
      fillBossWorkContentOnly(data.content, scopeRoot) || fillGeneralWorkContentFallback(data.content, scopeRoot);
    if (fallbackOk) {
      results.push({
        index: -1,
        field: 'content',
        label: '工作内容兜底',
        value: String(data.content).slice(0, 80),
        success: true
      });
      contentFilled = true;
    }
  }

  // Extra BOSS-safe fallback for project descriptions: only fill when the target textarea is still empty.
  if (section === 'projects' && isBossSite()) {
    const longTextInputs = Array.from(
      scopeRoot.querySelectorAll('textarea, [contenteditable="true"], [role="textbox"]')
    ).filter(isElementVisible);

    const findEmptyCandidate = (predicate, shouldFillValue) => {
      if (!shouldFillValue) return null;
      const candidate = longTextInputs.find(element => {
        const hint = toCompactText(getLabelText(element), getElementPlaceholder(element), getContextHintText(element));
        return predicate(hint);
      });
      if (!candidate) return null;
      const currentText = candidate.isContentEditable ? String(candidate.textContent || '') : String(candidate.value || '');
      if (currentText.trim().length > 2) return null;
      return candidate;
    };

    const contentTarget = findEmptyCandidate(
      hint =>
        hint.includes('项目描述') ||
        hint.includes('描述该项目') ||
        (hint.includes('描述') && hint.includes('项目') && hint.includes('招聘者')) ||
        (hint.includes('展示') && hint.includes('项目经验')),
      data.content
    );
    if (contentTarget) {
      if (contentTarget.isContentEditable) setContentEditableValue(contentTarget, data.content);
      else setNativeValue(contentTarget, data.content);
      results.push({
        index: -2,
        field: 'content',
        label: '项目描述(BOSS兜底)',
        value: String(data.content).slice(0, 80),
        success: true
      });
      contentFilled = true;
    }

    const projectDescTarget = findEmptyCandidate(
      hint =>
        hint.includes('项目介绍') ||
        hint.includes('项目背景') ||
        hint.includes('项目概述') ||
        hint.includes('项目概况') ||
        hint.includes('项目经验'),
      data.projectDesc
    );
    if (projectDescTarget) {
      if (projectDescTarget.isContentEditable) setContentEditableValue(projectDescTarget, data.projectDesc);
      else setNativeValue(projectDescTarget, data.projectDesc);
      results.push({
        index: -3,
        field: 'projectDesc',
        label: '项目介绍(BOSS兜底)',
        value: String(data.projectDesc).slice(0, 80),
        success: true
      });
      projectDescFilled = true;
    }
  }

  const filled = results.filter(r => r.success).length;
  console.log(`[ResumeFiller] 填充完成，成功 ${filled} 项`);
  return { success: true, total: elements.length, filled, results };
}

function resolveReportTargetElement() {
  if (lastContextMenuTarget && document.contains(lastContextMenuTarget) && isFillableElement(lastContextMenuTarget)) {
    return lastContextMenuTarget;
  }
  const active = document.activeElement;
  if (isFillableElement(active)) return active;
  return null;
}

function buildFieldReportText(element) {
  const manifest = chrome.runtime.getManifest();
  const version = manifest?.version || '';
  const labelText = getLabelText(element);
  const placeholder = getElementPlaceholder(element);
  const contextHint = getContextHintText(element);
  let html = element?.outerHTML || '';
  const max = 80000;
  if (html.length > max) {
    html = `${html.slice(0, max)}\n... [truncated ${html.length - max} chars]`;
  }
  return [
    'ResumeFiller field report (beta)',
    `Version: ${version}`,
    `URL: ${location.href}`,
    `Time: ${new Date().toISOString()}`,
    '---',
    `Label: ${labelText}`,
    `Placeholder: ${placeholder}`,
    `Context hint: ${contextHint}`,
    '--- outerHTML ---',
    html,
    '--- end ---'
  ].join('\n');
}

async function copyReportToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  }
}

function showReportToast(message) {
  const el = document.createElement('div');
  el.textContent = message;
  el.style.cssText =
    'position:fixed;z-index:2147483647;left:50%;top:24px;transform:translateX(-50%);' +
    'background:#1b5e20;color:#fff;padding:10px 16px;border-radius:8px;font:14px/1.4 system-ui,sans-serif;' +
    'box-shadow:0 4px 12px rgba(0,0,0,.25);max-width:90vw;';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3500);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'reportField') {
    (async () => {
      try {
        const element = resolveReportTargetElement();
        if (!element) {
          sendResponse({ success: false, error: '未找到可上报的输入框（请先在输入框上右键）' });
          return;
        }
        const text = buildFieldReportText(element);
        await copyReportToClipboard(text);
        showReportToast('ResumeFiller：已复制到剪贴板，可粘贴到反馈/工单');
        sendResponse({ success: true });
      } catch (error) {
        sendResponse({ success: false, error: error.message });
      }
    })();
    return true;
  }

  (async () => {
    try {
      const dataSource = window.resumeStorage
        ? await window.resumeStorage.ensureResumeData()
        : (typeof resumeData !== 'undefined' ? resumeData : null);

      if (!dataSource) throw new Error('未找到可用的简历数据');

      if (request.action === 'autoFillByKey') {
        const payload = resolveTemplate(dataSource, request.section, request.key);
        let scopeRoot = document;
        if (request.scoped) {
          const scoped = resolveScopedRoot(request.section, payload);
          if (scoped) {
            scopeRoot = scoped;
          } else {
            console.warn('[ResumeFiller] scoped模式未命中容器，已降级为整页填充');
          }
        }
        const result = autoFill(payload, dataSource, scopeRoot, request.section);
        sendResponse({ success: true, result });
        return;
      }

      if (request.action === 'autoFill') {
        const section = dataSource?.defaultTemplate?.section;
        const key = dataSource?.defaultTemplate?.key;
        const payload = resolveTemplate(dataSource, section, key) || getDefaultPayload();
        const result = autoFill(payload, dataSource, document, section);
        sendResponse({ success: true, result });
        return;
      }
    } catch (error) {
      console.error('[ResumeFiller] 执行错误:', error);
      sendResponse({ success: false, error: error.message });
      return;
    }

    sendResponse({ success: false, error: '未知 action' });
  })();

  return true;
});
