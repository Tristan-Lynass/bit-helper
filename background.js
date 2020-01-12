chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    changeInfo.url && chrome.tabs.sendMessage(tabId, {url: changeInfo.url});
});