function enableSidePanelAction() {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
}

function ensureContextMenus() {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: 'resumeFiller-report-field',
      title: 'ResumeFiller · 上报此输入框',
      contexts: ['editable']
    });
  });
}

chrome.runtime.onInstalled.addListener(() => {
  enableSidePanelAction();
  ensureContextMenus();
});
chrome.runtime.onStartup.addListener(() => {
  enableSidePanelAction();
  ensureContextMenus();
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== 'resumeFiller-report-field' || tab?.id == null) return;
  chrome.tabs.sendMessage(tab.id, { action: 'reportField' }).catch(() => {});
});

enableSidePanelAction();
ensureContextMenus();
