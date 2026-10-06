chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'playAlarm') {
    const audio = document.getElementById('alarmAudio');
    audio.play().catch(e => console.error("Offscreen audio error:", e));
  } else if (message.action === 'stopAlarm') {
    const audio = document.getElementById('alarmAudio');
    audio.pause();
    audio.currentTime = 0;
  }
});
