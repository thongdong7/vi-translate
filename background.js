chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "copy_prompt",
    title: "Copy prompt giải thích tiếng Việt",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "copy_prompt") {
    chrome.tabs.sendMessage(tab.id, { action: "copy_prompt" });
  }
});
