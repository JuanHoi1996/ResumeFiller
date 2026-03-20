const resumeData = {
  defaults: {
    companyType: "民营公司",
    workType: "实习"
  },
  defaultTemplate: {
    section: "internships",
    key: "default_internship"
  },
  personalInfos: {
    default_personal_info: {
      name: "示例",
      payload: {
        fullName: "张三",
        phone: "13800138000",
        email: "example@email.com",
        idNumber: "110101199001011234",
        homeAddress: "北京市朝阳区（请修改）",
        hukouLocation: "广东省广州市（请修改）"
      }
    }
  },
  educations: {
    default_education: {
      name: "示例",
      payload: {
        schoolName: "示例大学（请修改）",
        college: "经济与管理学院",
        major: "金融学（请修改）",
        educationExperience: "在校期间参与学生组织与学术项目，具备较强协作与执行能力。",
        coreCourses: "数据结构，操作系统，计算机网络，数据库系统，机器学习",
        educationSummary:
          "在校经历：参与学生组织与学术项目。\n核心课程：数据结构、操作系统、计算机网络、数据库系统、机器学习。"
      }
    }
  },
  internships: {
    default_internship: {
      name: "示例",
      payload: {
        company: "示例公司（请修改）",
        department: "示例部门",
        position: "示例岗位",
        location: "北京",
        start: "2025-01-01",
        end: "2025-03-31",
        content:
          "• 参与业务数据整理与分析，输出周报支持团队决策。\n" +
          "• 协助跨部门沟通与项目推进，跟踪关键节点并复盘。\n" +
          "• 独立完成流程优化小工具开发，提升日常协作效率。",
        industry: "互联网",
        companySize: "500-2000人",
        refereeName: "",
        refereePhone: "",
        refereeCompanyTitle: "",
        leaveReason: "实习期满",
        companyType: "民营公司",
        workType: "实习"
      }
    }
  },
  projects: {
    default_project: {
      name: "示例",
      payload: {
        projectName: "示例项目（请修改）",
        projectRoleTitle: "项目成员",
        techStack: "JavaScript, HTML, CSS",
        content:
          "• 负责核心功能开发与联调，保证功能按期上线。\n" +
          "• 设计并实现关键模块，提升可维护性与可扩展性。\n" +
          "• 通过问题排查与性能优化，改善用户体验。",
        projectDesc:
          "该项目用于演示网申插件默认项目模板。请根据个人真实经历修改项目背景与目标。",
        projectResponsibility:
          "负责需求分析、模块开发、联调测试与文档维护，推动项目按计划交付。",
        projectAchievement:
          "完成核心功能上线，满足业务需求并提升流程效率。"
      }
    }
  },
  selfEvaluations: {
    default_general: {
      shortName: "示例",
      title: "默认自我评价（请修改）",
      content:
        "具备扎实的学习能力与执行力，能够快速理解业务并推动落地。擅长跨团队协作与问题拆解，重视结果导向与持续复盘。"
    }
  },
  languages: {
    default_en: {
      name: "外语技能（英语）",
      content: "CET-6 (580分)；具备良好的英语听说读写能力，能够熟练查阅英文专业文档并进行流畅的商务沟通。"
    }
  },
  computerSkills: {
    default_skills: {
      name: "计算机技能",
      content: "熟练掌握 Python (NumPy, Pandas), SQL, JavaScript; 熟悉 Office 办公套件, Tableau 及基本的 Git 操作。"
    }
  },
  familyMembers: {
    default_family: {
      name: "家庭成员（示例）",
      payload: {
        familyRelation: "父亲",
        familyName: "张大三",
        familyCompany: "示例单位",
        familyPosition: "工程师",
        familyPhone: "13900139000",
        familyPoliticalStatus: "中共党员"
      }
    }
  },
  openQuestions: {
    career_quant: {
      name: "职业生涯规划 (量化/数据版)",
      payload: {
        content: "1. 近三年（专业深耕期）：依托我数学与金融复合背景，在应聘部门快速上手业务。利用 Python 自动化建模与量化分析能力，将数据驱动思维引入日常投研或风控流程，提升部门业务执行效率。\n2. 三至五年（能力破局期）：目标是成为部门内的“技术+业务”复合型专家。深耕 FICC 或大类资产定价领域，能够独立处理复杂金融产品的估值与风险穿透，在合规前提下通过模型优化提升资产配置的胜率。\n3. 远期愿景：致力于在公司的系统化转型中发挥中坚作用，利用金融科技手段助力银行在复杂市场环境下的精准定价与风险对冲。"
      }
    },
    career_ib: {
      name: "职业生涯规划 (投行/产业版)",
      payload: {
        content: "1. 近三年（实务锤炼期）：快速扎根投行业务一线。发挥我在中行投行部及中金财富实习中积累的尽职调查与 REITs 现金流建模能力，严谨对待每一份底稿与估值报告，辅助团队完成高质量的项目交付。\n2. 三至五年（产业专家期）：目标是成为特定行业的产业专家。结合我对轻工制造及电力能源行业的深度研究经验，通过敏锐的行业洞察力为客户提供更具增值性的融资方案，从“工具性服务”向“顾问式服务”转型。\n3. 远期愿景：在公司的平台上，成为具备长期主义价值发现能力的资深投行人，助力实体企业通过资本市场实现跨越式发展。"
      }
    },
    why_us: {
      name: "应聘理由 (示例)",
      payload: {
        content: "贵司作为行业领先的金融机构，具备完善的培养体系与广阔的业务平台。我个人的学术背景（数学+金融）与多段头部机构实习经历，使我能够迅速适应高强度的工作节奏，并为团队带来数据分析与业务研究的双重价值。"
      }
    }
  }
};
