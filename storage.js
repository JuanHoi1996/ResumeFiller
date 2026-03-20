(function attachResumeStorage() {
  const STORAGE_KEY = "resumeData";

  function cloneData(data) {
    if (!data) return data;
    return JSON.parse(JSON.stringify(data));
  }

  function getFallbackData() {
    if (typeof resumeData === "undefined") return null;
    return cloneData(resumeData);
  }

  function readStorage() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get([STORAGE_KEY], result => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }
        resolve(result?.[STORAGE_KEY] || null);
      });
    });
  }

  function writeStorage(data) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set({ [STORAGE_KEY]: data }, () => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }
        resolve();
      });
    });
  }

  async function getResumeData() {
    const stored = await readStorage();
    if (stored && typeof stored === "object") return stored;
    return getFallbackData();
  }

  async function ensureResumeData() {
    const current = await getResumeData();
    if (!current) return null;

    const stored = await readStorage();
    if (!stored) {
      await writeStorage(current);
    }
    return current;
  }

  async function saveResumeData(data) {
    if (!data || typeof data !== "object") {
      throw new Error("Invalid resume data");
    }
    await writeStorage(data);
    return data;
  }

  window.resumeStorage = {
    STORAGE_KEY,
    getResumeData,
    ensureResumeData,
    saveResumeData
  };
})();
