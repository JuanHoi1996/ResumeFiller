document.addEventListener('DOMContentLoaded', () => {
  const openDataBtn = document.getElementById('openDataBtn');
  const reloadBtn = document.getElementById('reloadBtn');
  const personalInfoMenu = document.getElementById('personalInfoMenu');
  const educationMenu = document.getElementById('educationMenu');
  const internshipMenu = document.getElementById('internshipMenu');
  const projectMenu = document.getElementById('projectMenu');
  const selfEvaluationMenu = document.getElementById('selfEvaluationMenu');
  const languageMenu = document.getElementById('languageMenu');
  const computerSkillsMenu = document.getElementById('computerSkillsMenu');
  const familyMemberMenu = document.getElementById('familyMemberMenu');
  const paperMenu = document.getElementById('paperMenu');
  const gameExperienceMenu = document.getElementById('gameExperienceMenu');
  const openQuestionMenu = document.getElementById('openQuestionMenu');
  const status = document.getElementById('status');

  function showStatus(message, isSuccess = true) {
    status.textContent = message;
    status.className = `status ${isSuccess ? 'success' : 'error'}`;
    status.style.display = 'block';
    
    setTimeout(() => {
      status.style.display = 'none';
    }, 3000);
  }

  async function getActiveTab() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) throw new Error('无法获取当前标签页');
    return tab;
  }

  async function sendFillMessage(payload) {
    const tab = await getActiveTab();
    await chrome.tabs.sendMessage(tab.id, payload);
  }

  function createTemplateButton(section, key, name) {
    const button = document.createElement('button');
    button.className = 'template-btn';
    button.textContent = name;
    button.addEventListener('click', async () => {
      try {
        await sendFillMessage({
          action: 'autoFillByKey',
          section,
          key,
          scoped: ['personalInfos', 'internships', 'projects', 'educations', 'selfEvaluations', 'languages', 'computerSkills', 'familyMembers', 'papers', 'gameExperience', 'openQuestions'].includes(section)
        });
        showStatus(`已执行：${name}`);
      } catch (error) {
        console.error('模板填充失败:', error);
        showStatus(`填充失败: ${error.message}`, false);
      }
    });
    return button;
  }

  async function getMenuData() {
    if (!window.resumeStorage) {
      return typeof resumeData !== 'undefined' ? resumeData : null;
    }
    return window.resumeStorage.ensureResumeData();
  }

  async function renderTemplateMenus() {
    const data = await getMenuData();
    if (!data) {
      showStatus('未找到可用的简历数据', false);
      return;
    }

    personalInfoMenu.innerHTML = '';
    educationMenu.innerHTML = '';
    internshipMenu.innerHTML = '';
    projectMenu.innerHTML = '';
    selfEvaluationMenu.innerHTML = '';
    languageMenu.innerHTML = '';
    computerSkillsMenu.innerHTML = '';
    familyMemberMenu.innerHTML = '';
    paperMenu.innerHTML = '';
    gameExperienceMenu.innerHTML = '';
    openQuestionMenu.innerHTML = '';

    Object.entries(data.personalInfos || {}).forEach(([key, item]) => {
      personalInfoMenu.appendChild(createTemplateButton('personalInfos', key, item.name || key));
    });

    Object.entries(data.educations || {}).forEach(([key, item]) => {
      educationMenu.appendChild(createTemplateButton('educations', key, item.name || key));
    });

    Object.entries(data.internships || {}).forEach(([key, item]) => {
      internshipMenu.appendChild(createTemplateButton('internships', key, item.name || key));
    });

    Object.entries(data.projects || {}).forEach(([key, item]) => {
      projectMenu.appendChild(createTemplateButton('projects', key, item.name || key));
    });

    Object.entries(data.selfEvaluations || {}).forEach(([key, item]) => {
      selfEvaluationMenu.appendChild(
        createTemplateButton('selfEvaluations', key, item.shortName || item.name || key)
      );
    });

    Object.entries(data.languages || {}).forEach(([key, item]) => {
      languageMenu.appendChild(createTemplateButton('languages', key, item.shortName || item.name || key));
    });

    Object.entries(data.computerSkills || {}).forEach(([key, item]) => {
      computerSkillsMenu.appendChild(
        createTemplateButton('computerSkills', key, item.shortName || item.name || key)
      );
    });

    Object.entries(data.familyMembers || {}).forEach(([key, item]) => {
      familyMemberMenu.appendChild(createTemplateButton('familyMembers', key, item.name || key));
    });

    Object.entries(data.papers || {}).forEach(([key, item]) => {
      paperMenu.appendChild(createTemplateButton('papers', key, item.name || key));
    });

    Object.entries(data.gameExperience || {}).forEach(([key, item]) => {
      gameExperienceMenu.appendChild(createTemplateButton('gameExperience', key, item.name || key));
    });

    Object.entries(data.openQuestions || {}).forEach(([key, item]) => {
      openQuestionMenu.appendChild(createTemplateButton('openQuestions', key, item.name || key));
    });
  }

  openDataBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('editor.html') });
  });

  reloadBtn.addEventListener('click', async () => {
    try {
      const tab = await getActiveTab();
      await chrome.tabs.reload(tab.id);
      showStatus('当前页面已刷新');
    } catch (error) {
      showStatus('刷新失败: ' + error.message, false);
    }
  });

  renderTemplateMenus().catch(error => {
    console.error('加载模板失败:', error);
    showStatus(`加载失败: ${error.message}`, false);
  });
});

