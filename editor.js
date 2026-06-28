document.addEventListener("DOMContentLoaded", async () => {
  const status = document.getElementById("status");
  const itemList = document.getElementById("itemList");
  const addItemBtn = document.getElementById("addItemBtn");
  const deleteItemBtn = document.getElementById("deleteItemBtn");
  const setDefaultBtn = document.getElementById("setDefaultBtn");
  const exportBtn = document.getElementById("exportBtn");
  const importBtn = document.getElementById("importBtn");
  const saveBtn = document.getElementById("saveBtn");
  const importFileInput = document.getElementById("importFileInput");

  const sectionTabs = {
    personalInfos: document.getElementById("tabPersonalInfos"),
    educations: document.getElementById("tabEducations"),
    internships: document.getElementById("tabInternships"),
    projects: document.getElementById("tabProjects"),
    selfEvaluations: document.getElementById("tabSelfEvaluations"),
    languages: document.getElementById("tabLanguages"),
    computerSkills: document.getElementById("tabComputerSkills"),
    familyMembers: document.getElementById("tabFamilyMembers"),
    papers: document.getElementById("tabPapers"),
    gameExperience: document.getElementById("tabGameExperience"),
    openQuestions: document.getElementById("tabOpenQuestions")
  };

  const formBlocks = {
    personalInfos: document.getElementById("personalInfoForm"),
    educations: document.getElementById("educationForm"),
    internships: document.getElementById("internshipForm"),
    projects: document.getElementById("projectForm"),
    selfEvaluations: document.getElementById("selfEvaluationForm"),
    languages: document.getElementById("languageForm"),
    computerSkills: document.getElementById("computerForm"),
    familyMembers: document.getElementById("familyMemberForm"),
    papers: document.getElementById("paperForm"),
    gameExperience: document.getElementById("gameExperienceForm"),
    openQuestions: document.getElementById("openQuestionForm")
  };

  const personalInfoFields = {
    name: document.getElementById("personalName"),
    key: document.getElementById("personalKey"),
    fullName: document.getElementById("fullName"),
    phone: document.getElementById("phone"),
    email: document.getElementById("email"),
    idNumber: document.getElementById("idNumber"),
    height: document.getElementById("height"),
    weight: document.getElementById("weight"),
    nativePlace: document.getElementById("nativePlace"),
    politicalStatus: document.getElementById("politicalStatus"),
    emergencyContact: document.getElementById("emergencyContact"),
    emergencyPhone: document.getElementById("emergencyPhone"),
    homeAddress: document.getElementById("homeAddress"),
    hukouLocation: document.getElementById("hukouLocation")
  };

  const educationFields = {
    name: document.getElementById("educationName"),
    key: document.getElementById("educationKey"),
    schoolName: document.getElementById("schoolName"),
    college: document.getElementById("college"),
    major: document.getElementById("major"),
    start: document.getElementById("eduStart"),
    end: document.getElementById("eduEnd"),
    educationExperience: document.getElementById("educationExperience"),
    coreCourses: document.getElementById("coreCourses"),
    educationSummary: document.getElementById("educationSummary")
  };

  const internshipFields = {
    name: document.getElementById("internshipName"),
    key: document.getElementById("internshipKey"),
    company: document.getElementById("company"),
    department: document.getElementById("department"),
    position: document.getElementById("position"),
    location: document.getElementById("location"),
    start: document.getElementById("start"),
    end: document.getElementById("end"),
    industry: document.getElementById("industry"),
    companySize: document.getElementById("companySize"),
    companyType: document.getElementById("companyType"),
    workType: document.getElementById("workType"),
    refereeName: document.getElementById("refereeName"),
    leaveReason: document.getElementById("leaveReason"),
    refereeCompanyTitle: document.getElementById("refereeCompanyTitle"),
    refereePhone: document.getElementById("refereePhone"),
    content: document.getElementById("internshipContent")
  };

  const projectFields = {
    name: document.getElementById("projectNameLabel"),
    key: document.getElementById("projectKey"),
    projectName: document.getElementById("projectName"),
    projectRoleTitle: document.getElementById("projectRoleTitle"),
    start: document.getElementById("projStart"),
    end: document.getElementById("projEnd"),
    techStack: document.getElementById("techStack"),
    projectLink: document.getElementById("projectLink"),
    content: document.getElementById("projectContent"),
    projectDesc: document.getElementById("projectDesc"),
    projectResponsibility: document.getElementById("projectResponsibility"),
    projectAchievement: document.getElementById("projectAchievement")
  };

  const selfEvalFields = {
    shortName: document.getElementById("selfEvalShortName"),
    key: document.getElementById("selfEvalKey"),
    title: document.getElementById("selfEvalTitle"),
    content: document.getElementById("selfEvalContent")
  };

  const languageFields = {
    name: document.getElementById("langShortName"),
    key: document.getElementById("langKey"),
    dateEarned: document.getElementById("langDate"),
    content: document.getElementById("langContent")
  };

  const computerFields = {
    name: document.getElementById("compShortName"),
    key: document.getElementById("compKey"),
    dateEarned: document.getElementById("compDate"),
    content: document.getElementById("compContent")
  };

  const familyMemberFields = {
    name: document.getElementById("familyNameLabel"),
    key: document.getElementById("familyKey"),
    familyRelation: document.getElementById("familyRelation"),
    familyName: document.getElementById("familyName"),
    familyCompany: document.getElementById("familyCompany"),
    familyPosition: document.getElementById("familyPosition"),
    familyPhone: document.getElementById("familyPhone"),
    familyPoliticalStatus: document.getElementById("familyPoliticalStatus")
  };

  const paperFields = {
    name: document.getElementById("paperNameLabel"),
    key: document.getElementById("paperKey"),
    paperName: document.getElementById("paperName"),
    paperChannel: document.getElementById("paperChannel"),
    authorOrder: document.getElementById("authorOrder"),
    paperLevel: document.getElementById("paperLevel"),
    paperStatus: document.getElementById("paperStatus"),
    paperLink: document.getElementById("paperLink"),
    content: document.getElementById("paperContent")
  };

  const gameExperienceFields = {
    name: document.getElementById("gameNameLabel"),
    key: document.getElementById("gameKey"),
    gameList: document.getElementById("gameList"),
    gameFrequency: document.getElementById("gameFrequency"),
    gameBest: document.getElementById("gameBest"),
    gameAchievement: document.getElementById("gameAchievement"),
    gameInsight: document.getElementById("gameInsight"),
    content: document.getElementById("gameContent")
  };

  const openQuestionFields = {
    name: document.getElementById("openQuesName"),
    key: document.getElementById("openQuesKey"),
    content: document.getElementById("openQuesContent")
  };

  const state = {
    data: null,
    currentSection: "personalInfos",
    currentKeyBySection: {
      personalInfos: "",
      educations: "",
      internships: "",
      projects: "",
      selfEvaluations: "",
      languages: "",
      computerSkills: "",
      familyMembers: "",
      papers: "",
      gameExperience: "",
      openQuestions: ""
    }
  };

  function showStatus(message, isError = false) {
    status.textContent = message;
    status.style.color = isError ? "#b91c1c" : "#166534";
  }

  function getSectionMap(section) {
    return state.data?.[section] || {};
  }

  function getCurrentKey() {
    return state.currentKeyBySection[state.currentSection] || "";
  }

  function setCurrentKey(key) {
    state.currentKeyBySection[state.currentSection] = key;
  }

  function getCurrentSectionEntries() {
    return Object.entries(getSectionMap(state.currentSection));
  }

  function createDefaultPersonalInfo(name) {
    return {
      name: name || "基础信息",
      payload: {
        fullName: "",
        phone: "",
        email: "",
        idNumber: "",
        homeAddress: "",
        hukouLocation: ""
      }
    };
  }

  function createDefaultEducation(name) {
    return {
      name: name || "教育经历",
      payload: {
        schoolName: "",
        college: "",
        major: "",
        educationExperience: "",
        coreCourses: "",
        educationSummary: ""
      }
    };
  }

  function createDefaultInternship(name) {
    return {
      name: name || "未命名实习",
      payload: {
        company: "",
        department: "",
        position: "",
        location: "",
        start: "",
        end: "",
        content: "",
        industry: "",
        companySize: "",
        refereeName: "",
        refereePhone: "",
        refereeCompanyTitle: "",
        leaveReason: "",
        companyType: state.data?.defaults?.companyType || "",
        workType: state.data?.defaults?.workType || ""
      }
    };
  }

  function createDefaultProject(name) {
    return {
      name: name || "未命名项目",
      payload: {
        projectName: "",
        projectRoleTitle: "",
        techStack: "",
        projectLink: "",
        content: "",
        projectDesc: "",
        projectResponsibility: "",
        projectAchievement: ""
      }
    };
  }

  function createDefaultSelfEvaluation() {
    return {
      shortName: "通用版",
      title: "默认自我评价",
      content: ""
    };
  }

  function createDefaultLanguage() {
    return {
      name: "新外语技能",
      content: ""
    };
  }

  function createDefaultComputer() {
    return {
      name: "新计算机技能",
      content: ""
    };
  }

  function createDefaultFamilyMember(name) {
    return {
      name: name || "新家庭成员",
      payload: {
        familyRelation: "",
        familyName: "",
        familyCompany: "",
        familyPosition: "",
        familyPhone: "",
        familyPoliticalStatus: ""
      }
    };
  }

  function createDefaultOpenQuestion(name) {
    return {
      name: name || "新开放性问答",
      payload: {
        content: ""
      }
    };
  }

  function createDefaultPaper(name) {
    return {
      name: name || "新论文",
      payload: {
        paperName: "",
        paperChannel: "",
        authorOrder: "",
        paperLevel: "",
        paperStatus: "",
        paperLink: "",
        content: ""
      }
    };
  }

  function createDefaultGame(name) {
    return {
      name: name || "新游戏经历",
      payload: {
        gameList: "",
        gameFrequency: "",
        gameBest: "",
        gameAchievement: "",
        gameInsight: "",
        content: ""
      }
    };
  }

  function createDefaultItem(section, name) {
    if (section === "personalInfos") return createDefaultPersonalInfo(name);
    if (section === "educations") return createDefaultEducation(name);
    if (section === "internships") return createDefaultInternship(name);
    if (section === "projects") return createDefaultProject(name);
    if (section === "selfEvaluations") return createDefaultSelfEvaluation();
    if (section === "languages") return createDefaultLanguage();
    if (section === "computerSkills") return createDefaultComputer();
    if (section === "familyMembers") return createDefaultFamilyMember(name);
    if (section === "papers") return createDefaultPaper(name);
    if (section === "gameExperience") return createDefaultGame(name);
    if (section === "openQuestions") return createDefaultOpenQuestion(name);
  }

  function getDisplayName(section, key, item) {
    if (section === "selfEvaluations") return item?.shortName || item?.title || key;
    return item?.name || key;
  }

  function renderTabs() {
    Object.entries(sectionTabs).forEach(([section, button]) => {
      button.classList.toggle("active", section === state.currentSection);
    });
  }

  function renderFormsVisibility() {
    Object.entries(formBlocks).forEach(([section, form]) => {
      form.classList.toggle("hidden", section !== state.currentSection);
    });
  }

  function renderItemList() {
    itemList.innerHTML = "";
    getCurrentSectionEntries().forEach(([key, item]) => {
      const button = document.createElement("button");
      button.className = `list-item ${key === getCurrentKey() ? "active" : ""}`;
      button.textContent = getDisplayName(state.currentSection, key, item);
      button.addEventListener("click", () => {
        persistCurrentFormToState();
        setCurrentKey(key);
        renderItemList();
        renderCurrentForm();
      });
      itemList.appendChild(button);
    });
  }

  function renderPersonalInfoForm(item, key) {
    const payload = item?.payload || {};
    personalInfoFields.name.value = item?.name || "";
    personalInfoFields.key.value = key || "";
    personalInfoFields.fullName.value = payload.fullName || "";
    personalInfoFields.phone.value = payload.phone || "";
    personalInfoFields.email.value = payload.email || "";
    personalInfoFields.idNumber.value = payload.idNumber || "";
    personalInfoFields.height.value = payload.height || "";
    personalInfoFields.weight.value = payload.weight || "";
    personalInfoFields.nativePlace.value = payload.nativePlace || "";
    personalInfoFields.politicalStatus.value = payload.politicalStatus || "";
    personalInfoFields.emergencyContact.value = payload.emergencyContact || "";
    personalInfoFields.emergencyPhone.value = payload.emergencyPhone || "";
    personalInfoFields.homeAddress.value = payload.homeAddress || "";
    personalInfoFields.hukouLocation.value = payload.hukouLocation || "";
  }

  function renderEducationForm(item, key) {
    const payload = item?.payload || {};
    educationFields.name.value = item?.name || "";
    educationFields.key.value = key || "";
    educationFields.schoolName.value = payload.schoolName || "";
    educationFields.college.value = payload.college || "";
    educationFields.major.value = payload.major || "";
    educationFields.start.value = payload.start || "";
    educationFields.end.value = payload.end || "";
    educationFields.educationExperience.value = payload.educationExperience || "";
    educationFields.coreCourses.value = payload.coreCourses || "";
    educationFields.educationSummary.value = payload.educationSummary || "";
  }

  function renderInternshipForm(item, key) {
    const payload = item?.payload || {};
    internshipFields.name.value = item?.name || "";
    internshipFields.key.value = key || "";
    internshipFields.company.value = payload.company || "";
    internshipFields.department.value = payload.department || "";
    internshipFields.position.value = payload.position || "";
    internshipFields.location.value = payload.location || "";
    internshipFields.start.value = payload.start || "";
    internshipFields.end.value = payload.end || "";
    internshipFields.industry.value = payload.industry || "";
    internshipFields.companySize.value = payload.companySize || "";
    internshipFields.companyType.value = payload.companyType || "";
    internshipFields.workType.value = payload.workType || "";
    internshipFields.refereeName.value = payload.refereeName || "";
    internshipFields.leaveReason.value = payload.leaveReason || "";
    internshipFields.refereeCompanyTitle.value = payload.refereeCompanyTitle || "";
    internshipFields.refereePhone.value = payload.refereePhone || "";
    internshipFields.content.value = payload.content || "";
  }

  function renderProjectForm(item, key) {
    const payload = item?.payload || {};
    projectFields.name.value = item?.name || "";
    projectFields.key.value = key || "";
    projectFields.projectName.value = payload.projectName || "";
    projectFields.projectRoleTitle.value = payload.projectRoleTitle || "";
    projectFields.start.value = payload.start || "";
    projectFields.end.value = payload.end || "";
    projectFields.techStack.value = payload.techStack || "";
    projectFields.projectLink.value = payload.projectLink || "";
    projectFields.content.value = payload.content || "";
    projectFields.projectDesc.value = payload.projectDesc || "";
    projectFields.projectResponsibility.value = payload.projectResponsibility || "";
    projectFields.projectAchievement.value = payload.projectAchievement || "";
  }

  function renderSelfEvaluationForm(item, key) {
    selfEvalFields.shortName.value = item?.shortName || "";
    selfEvalFields.key.value = key || "";
    selfEvalFields.title.value = item?.title || "";
    selfEvalFields.content.value = item?.content || "";
  }

  function renderLanguageForm(item, key) {
    languageFields.name.value = item?.name || "";
    languageFields.key.value = key || "";
    languageFields.dateEarned.value = item?.dateEarned || "";
    languageFields.content.value = item?.content || "";
  }

  function renderComputerForm(item, key) {
    computerFields.name.value = item?.name || "";
    computerFields.key.value = key || "";
    computerFields.dateEarned.value = item?.dateEarned || "";
    computerFields.content.value = item?.content || "";
  }

  function renderFamilyMemberForm(item, key) {
    const payload = item?.payload || {};
    familyMemberFields.name.value = item?.name || "";
    familyMemberFields.key.value = key || "";
    familyMemberFields.familyRelation.value = payload.familyRelation || "";
    familyMemberFields.familyName.value = payload.familyName || "";
    familyMemberFields.familyCompany.value = payload.familyCompany || "";
    familyMemberFields.familyPosition.value = payload.familyPosition || "";
    familyMemberFields.familyPhone.value = payload.familyPhone || "";
    familyMemberFields.familyPoliticalStatus.value = payload.familyPoliticalStatus || "";
  }

  function renderPaperForm(item, key) {
    const payload = item?.payload || {};
    paperFields.name.value = item?.name || "";
    paperFields.key.value = key || "";
    paperFields.paperName.value = payload.paperName || "";
    paperFields.paperChannel.value = payload.paperChannel || "";
    paperFields.authorOrder.value = payload.authorOrder || "";
    paperFields.paperLevel.value = payload.paperLevel || "";
    paperFields.paperStatus.value = payload.paperStatus || "";
    paperFields.paperLink.value = payload.paperLink || "";
    paperFields.content.value = payload.content || "";
  }

  function renderGameExperienceForm(item, key) {
    const payload = item?.payload || {};
    gameExperienceFields.name.value = item?.name || "";
    gameExperienceFields.key.value = key || "";
    gameExperienceFields.gameList.value = payload.gameList || "";
    gameExperienceFields.gameFrequency.value = payload.gameFrequency || "";
    gameExperienceFields.gameBest.value = payload.gameBest || "";
    gameExperienceFields.gameAchievement.value = payload.gameAchievement || "";
    gameExperienceFields.gameInsight.value = payload.gameInsight || "";
    gameExperienceFields.content.value = payload.content || "";
  }

  function renderOpenQuestionForm(item, key) {
    const payload = item?.payload || {};
    openQuestionFields.name.value = item?.name || "";
    openQuestionFields.key.value = key || "";
    openQuestionFields.content.value = payload.content || "";
  }

  function renderCurrentForm() {
    const key = getCurrentKey();
    const item = getSectionMap(state.currentSection)?.[key];
    if (!item) return;
    if (state.currentSection === "personalInfos") return renderPersonalInfoForm(item, key);
    if (state.currentSection === "educations") return renderEducationForm(item, key);
    if (state.currentSection === "internships") return renderInternshipForm(item, key);
    if (state.currentSection === "projects") return renderProjectForm(item, key);
    if (state.currentSection === "selfEvaluations") return renderSelfEvaluationForm(item, key);
    if (state.currentSection === "languages") return renderLanguageForm(item, key);
    if (state.currentSection === "computerSkills") return renderComputerForm(item, key);
    if (state.currentSection === "familyMembers") return renderFamilyMemberForm(item, key);
    if (state.currentSection === "papers") return renderPaperForm(item, key);
    if (state.currentSection === "gameExperience") return renderGameExperienceForm(item, key);
    return renderOpenQuestionForm(item, key);
  }

  function persistPersonalInfoForm(item) {
    item.name = personalInfoFields.name.value.trim() || "基础信息";
    item.payload = {
      ...item.payload,
      fullName: personalInfoFields.fullName.value.trim(),
      phone: personalInfoFields.phone.value.trim(),
      email: personalInfoFields.email.value.trim(),
      idNumber: personalInfoFields.idNumber.value.trim(),
      height: personalInfoFields.height.value.trim(),
      weight: personalInfoFields.weight.value.trim(),
      nativePlace: personalInfoFields.nativePlace.value.trim(),
      politicalStatus: personalInfoFields.politicalStatus.value.trim(),
      emergencyContact: personalInfoFields.emergencyContact.value.trim(),
      emergencyPhone: personalInfoFields.emergencyPhone.value.trim(),
      homeAddress: personalInfoFields.homeAddress.value.trim(),
      hukouLocation: personalInfoFields.hukouLocation.value.trim()
    };
  }

  function persistEducationForm(item) {
    item.name = educationFields.name.value.trim() || "教育经历";
    item.payload = {
      ...item.payload,
      schoolName: educationFields.schoolName.value.trim(),
      college: educationFields.college.value.trim(),
      major: educationFields.major.value.trim(),
      start: educationFields.start.value.trim(),
      end: educationFields.end.value.trim(),
      educationExperience: educationFields.educationExperience.value.trim(),
      coreCourses: educationFields.coreCourses.value.trim(),
      educationSummary: educationFields.educationSummary.value.trim()
    };
  }

  function persistInternshipForm(item) {
    item.name = internshipFields.name.value.trim() || "未命名实习";
    item.payload = {
      ...item.payload,
      company: internshipFields.company.value.trim(),
      department: internshipFields.department.value.trim(),
      position: internshipFields.position.value.trim(),
      location: internshipFields.location.value.trim(),
      start: internshipFields.start.value.trim(),
      end: internshipFields.end.value.trim(),
      industry: internshipFields.industry.value.trim(),
      companySize: internshipFields.companySize.value.trim(),
      companyType: internshipFields.companyType.value.trim(),
      workType: internshipFields.workType.value.trim(),
      refereeName: internshipFields.refereeName.value.trim(),
      leaveReason: internshipFields.leaveReason.value.trim(),
      refereeCompanyTitle: internshipFields.refereeCompanyTitle.value.trim(),
      refereePhone: internshipFields.refereePhone.value.trim(),
      content: internshipFields.content.value.trim()
    };
  }

  function persistProjectForm(item) {
    item.name = projectFields.name.value.trim() || "未命名项目";
    item.payload = {
      ...item.payload,
      projectName: projectFields.projectName.value.trim(),
      projectRoleTitle: projectFields.projectRoleTitle.value.trim(),
      start: projectFields.start.value.trim(),
      end: projectFields.end.value.trim(),
      techStack: projectFields.techStack.value.trim(),
      projectLink: projectFields.projectLink.value.trim(),
      content: projectFields.content.value.trim(),
      projectDesc: projectFields.projectDesc.value.trim(),
      projectResponsibility: projectFields.projectResponsibility.value.trim(),
      projectAchievement: projectFields.projectAchievement.value.trim()
    };
  }

  function persistSelfEvaluationForm(item) {
    item.shortName = selfEvalFields.shortName.value.trim() || "通用版";
    item.title = selfEvalFields.title.value.trim() || "默认自我评价";
    item.content = selfEvalFields.content.value.trim();
  }

  function persistLanguageForm(item) {
    item.name = languageFields.name.value.trim() || "新外语技能";
    item.dateEarned = languageFields.dateEarned.value.trim();
    item.content = languageFields.content.value.trim();
  }

  function persistComputerForm(item) {
    item.name = computerFields.name.value.trim() || "新计算机技能";
    item.dateEarned = computerFields.dateEarned.value.trim();
    item.content = computerFields.content.value.trim();
  }

  function persistFamilyMemberForm(item) {
    item.name = familyMemberFields.name.value.trim() || "新家庭成员";
    item.payload = {
      ...item.payload,
      familyRelation: familyMemberFields.familyRelation.value.trim(),
      familyName: familyMemberFields.familyName.value.trim(),
      familyCompany: familyMemberFields.familyCompany.value.trim(),
      familyPosition: familyMemberFields.familyPosition.value.trim(),
      familyPhone: familyMemberFields.familyPhone.value.trim(),
      familyPoliticalStatus: familyMemberFields.familyPoliticalStatus.value.trim()
    };
  }

  function persistPaperForm(item) {
    item.name = paperFields.name.value.trim() || "新论文";
    item.payload = {
      ...item.payload,
      paperName: paperFields.paperName.value.trim(),
      paperChannel: paperFields.paperChannel.value.trim(),
      authorOrder: paperFields.authorOrder.value.trim(),
      paperLevel: paperFields.paperLevel.value.trim(),
      paperStatus: paperFields.paperStatus.value.trim(),
      paperLink: paperFields.paperLink.value.trim(),
      content: paperFields.content.value.trim()
    };
  }

  function persistGameExperienceForm(item) {
    item.name = gameExperienceFields.name.value.trim() || "新游戏经历";
    item.payload = {
      ...item.payload,
      gameList: gameExperienceFields.gameList.value.trim(),
      gameFrequency: gameExperienceFields.gameFrequency.value.trim(),
      gameBest: gameExperienceFields.gameBest.value.trim(),
      gameAchievement: gameExperienceFields.gameAchievement.value.trim(),
      gameInsight: gameExperienceFields.gameInsight.value.trim(),
      content: gameExperienceFields.content.value.trim()
    };
  }

  function persistOpenQuestionForm(item) {
    item.name = openQuestionFields.name.value.trim() || "新开放性问答";
    item.payload = {
      ...item.payload,
      content: openQuestionFields.content.value.trim()
    };
  }

  function persistCurrentFormToState() {
    const key = getCurrentKey();
    if (!key) return;
    const sectionMap = getSectionMap(state.currentSection);
    const item = sectionMap[key];
    if (!item) return;
    if (state.currentSection === "personalInfos") return persistPersonalInfoForm(item);
    if (state.currentSection === "educations") return persistEducationForm(item);
    if (state.currentSection === "internships") return persistInternshipForm(item);
    if (state.currentSection === "projects") return persistProjectForm(item);
    if (state.currentSection === "selfEvaluations") return persistSelfEvaluationForm(item);
    if (state.currentSection === "languages") return persistLanguageForm(item);
    if (state.currentSection === "computerSkills") return persistComputerForm(item);
    if (state.currentSection === "familyMembers") return persistFamilyMemberForm(item);
    if (state.currentSection === "papers") return persistPaperForm(item);
    if (state.currentSection === "gameExperience") return persistGameExperienceForm(item);
    return persistOpenQuestionForm(item);
  }

  function createNewKey(section) {
    const prefixMap = {
      personalInfos: "personal_info",
      educations: "education",
      internships: "internship",
      projects: "project",
      selfEvaluations: "self_eval",
      languages: "language",
      computerSkills: "computer",
      familyMembers: "family",
      papers: "paper",
      gameExperience: "game",
      openQuestions: "open_ques"
    };
    return `${prefixMap[section]}_${Date.now()}`;
  }

  function ensureSectionHasItem(section) {
    state.data[section] = state.data[section] || {};
    const keys = Object.keys(state.data[section]);
    if (keys.length > 0) {
      state.currentKeyBySection[section] = state.currentKeyBySection[section] || keys[0];
      return;
    }

    const keyMap = {
      personalInfos: "default_personal_info",
      educations: "default_education",
      internships: "default_internship",
      projects: "default_project",
      selfEvaluations: "default_general",
      languages: "default_en",
      computerSkills: "default_skills",
      familyMembers: "default_family",
      papers: "default_paper",
      gameExperience: "default_game",
      openQuestions: "career_quant"
    };
    const nameMap = {
      personalInfos: "基础信息",
      educations: "默认教育经历",
      internships: "默认实习经历",
      projects: "默认项目经历",
      selfEvaluations: "默认自我评价",
      languages: "外语技能",
      computerSkills: "计算机技能",
      familyMembers: "家庭成员",
      papers: "论文发表",
      gameExperience: "游戏经历",
      openQuestions: "开放性问答"
    };
    const key = keyMap[section];
    state.data[section][key] = createDefaultItem(section, nameMap[section]);
    state.currentKeyBySection[section] = key;
  }

  function refreshUI() {
    renderTabs();
    renderFormsVisibility();
    renderItemList();
    renderCurrentForm();
  }

  function switchSection(section) {
    if (!section || section === state.currentSection) return;
    persistCurrentFormToState();
    state.currentSection = section;
    ensureSectionHasItem(section);
    refreshUI();
  }

  function downloadJson(filename, content) {
    const blob = new Blob([content], { type: "application/json;charset=utf-8" });
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(objectUrl);
  }

  function normalizeImportedData(raw) {
    const data = raw && typeof raw === "object" ? raw : {};
    data.defaults = data.defaults || { companyType: "", workType: "" };
    data.personalInfos = data.personalInfos || {};
    data.educations = data.educations || {};
    data.internships = data.internships || {};
    data.projects = data.projects || {};
    data.selfEvaluations = data.selfEvaluations || {};
    data.languages = data.languages || {};
    data.computerSkills = data.computerSkills || {};
    data.familyMembers = data.familyMembers || {};
    data.papers = data.papers || {};
    data.gameExperience = data.gameExperience || {};
    data.openQuestions = data.openQuestions || {};

    if (Object.keys(data.personalInfos).length === 0) {
      data.personalInfos.default_personal_info = createDefaultPersonalInfo("基础信息");
    }
    if (Object.keys(data.educations).length === 0) {
      data.educations.default_education = createDefaultEducation("默认教育经历");
    }
    if (Object.keys(data.internships).length === 0) {
      data.internships.default_internship = createDefaultInternship("默认实习经历");
    }
    if (Object.keys(data.projects).length === 0) {
      data.projects.default_project = createDefaultProject("默认项目经历");
    }
    if (Object.keys(data.selfEvaluations).length === 0) {
      data.selfEvaluations.default_general = createDefaultSelfEvaluation();
    }
    if (Object.keys(data.languages).length === 0) {
      data.languages.default_en = createDefaultLanguage();
    }
    if (Object.keys(data.computerSkills).length === 0) {
      data.computerSkills.default_skills = createDefaultComputer();
    }
    if (Object.keys(data.familyMembers).length === 0) {
      data.familyMembers.default_family = createDefaultFamilyMember("家庭成员");
    }
    if (Object.keys(data.papers).length === 0) {
      data.papers.default_paper = createDefaultPaper("默认论文发表");
    }
    if (Object.keys(data.gameExperience).length === 0) {
      data.gameExperience.default_game = createDefaultGame("默认游戏经历");
    }
    if (Object.keys(data.openQuestions).length === 0) {
      data.openQuestions.career_quant = createDefaultOpenQuestion("开放性问答");
    }

    if (!data.defaultTemplate || !data.defaultTemplate.section || !data.defaultTemplate.key) {
      data.defaultTemplate = { section: "internships", key: Object.keys(data.internships)[0] };
    }
    return data;
  }

  function handleImportFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          resolve(normalizeImportedData(JSON.parse(String(reader.result || "{}"))));
        } catch {
          reject(new Error("JSON 解析失败"));
        }
      };
      reader.onerror = () => reject(new Error("文件读取失败"));
      reader.readAsText(file, "utf-8");
    });
  }

  async function loadInitialData() {
    if (!window.resumeStorage) throw new Error("resumeStorage 不可用");
    const data = await window.resumeStorage.ensureResumeData();
    if (!data) throw new Error("未找到可用的简历数据");
    state.data = normalizeImportedData(data);
    ["personalInfos", "educations", "internships", "projects", "selfEvaluations", "languages", "computerSkills", "familyMembers", "papers", "gameExperience", "openQuestions"].forEach(ensureSectionHasItem);
    refreshUI();
  }

  Object.entries(sectionTabs).forEach(([section, button]) => {
    button.addEventListener("click", () => switchSection(section));
  });

  addItemBtn.addEventListener("click", () => {
    persistCurrentFormToState();
    const key = createNewKey(state.currentSection);
    const defaultNameMap = {
      personalInfos: "新个人信息",
      educations: "新教育经历",
      internships: "新实习经历",
      projects: "新项目经历",
      selfEvaluations: "新自我评价",
      languages: "新外语技能",
      computerSkills: "新计算机技能",
      familyMembers: "新家庭成员",
      papers: "新论文",
      gameExperience: "新游戏经历",
      openQuestions: "新开放性问答"
    };
    state.data[state.currentSection][key] = createDefaultItem(state.currentSection, defaultNameMap[state.currentSection]);
    setCurrentKey(key);
    refreshUI();
    showStatus("已新增条目，记得点击保存到本地。");
  });

  deleteItemBtn.addEventListener("click", () => {
    const sectionMap = getSectionMap(state.currentSection);
    const keys = Object.keys(sectionMap);
    if (keys.length <= 1) {
      showStatus("当前类型至少保留一条记录。", true);
      return;
    }
    delete sectionMap[getCurrentKey()];
    setCurrentKey(Object.keys(sectionMap)[0]);
    refreshUI();
    showStatus("已删除当前条目，记得点击保存到本地。");
  });

  setDefaultBtn.addEventListener("click", () => {
    const key = getCurrentKey();
    if (!key) return;
    persistCurrentFormToState();
    state.data.defaultTemplate = { section: state.currentSection, key };
    showStatus("已设置默认模板，记得点击保存到本地。");
  });

  exportBtn.addEventListener("click", () => {
    try {
      persistCurrentFormToState();
      downloadJson(`resumefiller-data-${Date.now()}.json`, JSON.stringify(state.data, null, 2));
      showStatus("已导出 JSON。");
    } catch (error) {
      showStatus(`导出失败: ${error.message}`, true);
    }
  });

  importBtn.addEventListener("click", () => {
    importFileInput.value = "";
    importFileInput.click();
  });

  importFileInput.addEventListener("change", async event => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;
      persistCurrentFormToState();
      state.data = await handleImportFile(file);
      ["personalInfos", "educations", "internships", "projects", "selfEvaluations", "languages", "computerSkills", "familyMembers", "papers", "gameExperience", "openQuestions"].forEach(ensureSectionHasItem);
      refreshUI();
      showStatus("导入成功，请点击保存到本地。");
    } catch (error) {
      showStatus(`导入失败: ${error.message}`, true);
    }
  });

  saveBtn.addEventListener("click", async () => {
    try {
      persistCurrentFormToState();
      await window.resumeStorage.saveResumeData(state.data);
      refreshUI();
      showStatus("已保存到 chrome.storage.local。");
    } catch (error) {
      showStatus(`保存失败: ${error.message}`, true);
    }
  });

  try {
    await loadInitialData();
    showStatus("数据已加载。");
  } catch (error) {
    showStatus(`初始化失败: ${error.message}`, true);
  }
});
