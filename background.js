const ALARM_NAME = "slackerAlarm";
const TIME_LIMIT_MINUTES = 60; // 1 hour

// Run this when the browser opens
chrome.runtime.onStartup.addListener(initializeExtension);
chrome.runtime.onInstalled.addListener(initializeExtension);

function initializeExtension() {
  resetAlarm();
  checkDailyReset();
}

function resetAlarm() {
  chrome.alarms.create(ALARM_NAME, { delayInMinutes: TIME_LIMIT_MINUTES });
  console.log("Timer reset for 60 minutes!");
}

// Listen for the "I finished a task" message from popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'taskCompleted') {
    resetAlarm(); 
  }
});

// When the alarm rings, execute the punishment!
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_NAME) {
    // Find the tab the user is currently looking at
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        // Inject the punishment script into that tab
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          files: ['content.js']
        });
      }
    });
    // Keep nagging them every 1 minute until they finish a task
    chrome.alarms.create(ALARM_NAME, { delayInMinutes: 1 }); 
  }
});

// Logic to uncheck "Daily" tasks if it is a new day
function checkDailyReset() {
  chrome.storage.local.get(['tasks', 'lastResetDate'], (data) => {
    const today = new Date().toDateString();
    
    if (data.lastResetDate !== today) {
      let tasks = data.tasks || [];
      let changed = false;
      
      tasks = tasks.map(task => {
        if (task.isDaily) {
          task.completed = false; // Uncheck it!
          changed = true;
        }
        return task;
      });

      if (changed) {
        chrome.storage.local.set({ tasks, lastResetDate: today });
      } else {
        chrome.storage.local.set({ lastResetDate: today });
      }
    }
  });
