function enableSidePanelAction() {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
}

chrome.runtime.onInstalled.addListener(enableSidePanelAction);
chrome.runtime.onStartup.addListener(enableSidePanelAction);

enableSidePanelAction();
