var openedTabs;

chrome.windows.onCreated.addListener(function (newWindow) {
  if (newWindow.type === "popup") {
    console.log("Popup-detected, killing it...");
    return;
  }
});

// Blocking all requests of ftps (client initiated as well as remote initiated)
chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    return {
      cancel: true
    };
  }, {
  urls: ["ftp://*/*"]
},
  ["blocking"]);

chrome.tabs.onCreated.addListener(function (tab) {
  if (!checkTabsLimitAndClose(tab.id, tab.openerTabId, tab.windowId)) {
    console.log(`tabs.onCreated: tab limit reached, start tab closing flow tabId ${tab.id}`);
    return;
  }});

function checkTabsLimitAndClose(tabId, openerTabId, windowId) {
  let openTabsCount = getOpenTabsCount();
  console.log(`checkTabsLimitAndClose: Open tabs Count: ${openTabsCount}, Max Tab Open Limit: 10`);
  if (openTabsCount < 10) {
    console.log("checkTabsLimitAndClose: Tab limit not reached. Allowed to open tab.");
    return true;
  }
  console.log("checkTabsLimitAndClose: Tabs limit reached.");
  closeTab(tabId);
}

function getOpenTabsCount() {
  chrome.tabs.query({windowType:'normal'}, function(tabs) {
    openedTabs = tabs.length
    console.log('Number of open tabs in all normal browser windows:',tabs.length);
}); 
  return openedTabs;
}

function closeTab(remoteTabId) {
  console.log(`Closing tab, chromeTabId: ${remoteTabId}`);
  chrome.tabs.remove(remoteTabId);
}
