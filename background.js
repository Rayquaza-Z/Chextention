const ALARM_NAME = "slackerAlarm";
const TIME_LIMIT_MINUTES = 20;

chrome.runtime.onStartup.addListener(initializeExtension);
chrome.runtime.onInstalled.addListener(initializeExtension);

function initializeExtension() {
  resetAlarm();
  checkDailyReset();
}

function resetAlarm() {
  chrome.storage.local.set({ punishmentActive: false });
  chrome.alarms.create(ALARM_NAME, { delayInMinutes: TIME_LIMIT_MINUTES });
  
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach(tab => chrome.tabs.sendMessage(tab.id, { action: 'removePunishment' }).catch(() => {}));
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'taskCompleted') {
    resetAlarm();
  } else if (message.action === 'snooze') {
    chrome.storage.local.set({ punishmentActive: false });
    chrome.alarms.create(ALARM_NAME, { delayInMinutes: 5 });
    
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => chrome.tabs.sendMessage(tab.id, { action: 'removePunishment' }).catch(() => {}));
    });
  }
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_NAME) {
    chrome.storage.local.set({ punishmentActive: true }, () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
          chrome.scripting.executeScript({ target: { tabId: tabs[0].id }, files: ['content.js'] }).catch(() => {});
        }
      });
    });
  }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.storage.local.get(['punishmentActive'], (data) => {
    if (data.punishmentActive) {
      chrome.scripting.executeScript({ target: { tabId: activeInfo.tabId }, files: ['content.js'] }).catch(() => {});
    }
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    chrome.storage.local.get(['punishmentActive'], (data) => {
      if (data.punishmentActive) {
        chrome.scripting.executeScript({ target: { tabId: tabId }, files: ['content.js'] }).catch(() => {});
      }
    });
  }
});

function checkDailyReset() {
  chrome.storage.local.get(['tasks', 'lastResetDate'], (data) => {
    const today = new Date().toDateString();
    if (data.lastResetDate !== today) {
      let tasks = data.tasks || [];
      let changed = false;
      tasks = tasks.map(task => {
        if (task.isDaily) {
          task.completed = false;
          changed = true;
        }
        return task;
      });
      if (changed) chrome.storage.local.set({ tasks, lastResetDate: today });
      else chrome.storage.local.set({ lastResetDate: today });
    }
  });
}
