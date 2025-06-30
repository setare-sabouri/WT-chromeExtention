chrome.commands.onCommand.addListener((command) => {
  if (command === "replace-wordorflight") {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      if (tab?.id) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["content.js"]
        });
      }
    });
  }
});

//listens for the keyboard shortcut (Ctrl + M)
//and then injects content.js into the current tab (content.js is not injected automatically)
