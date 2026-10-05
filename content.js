chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'removePunishment') {
    const container = document.getElementById('taskmaster-punishment-container');
    if (container) container.remove();
  }
});

if (!document.getElementById('taskmaster-punishment-container')) {
  
  chrome.storage.local.get(['sillyImages'], (data) => {
    const images = data.sillyImages;
    if (!images || images.length === 0) return;

    const container = document.createElement('div');
    container.id = 'taskmaster-punishment-container';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100vw';
    container.style.height = '100vh';
    container.style.pointerEvents = 'none'; 
    container.style.zIndex = '2147483647'; 
    container.style.backgroundColor = 'rgba(0,0,0,0.5)';
    document.body.appendChild(container);

    const totalImages = 80;
    let currentImages = 0;

    function spawnImage() {
      if (currentImages >= totalImages) {
        clearInterval(spawnInterval);
        
        const box = document.createElement('div');
        box.style.position = 'absolute';
        box.style.top = '50%';
        box.style.left = '50%';
        box.style.transform = 'translate(-50%, -50%)';
        box.style.backgroundColor = 'black';
        box.style.padding = '40px';
        box.style.borderRadius = '20px';
        box.style.border = '5px solid #ff4757';
        box.style.textAlign = 'center';
        box.style.pointerEvents = 'auto';
        box.style.boxShadow = '0 0 50px #ff4757';

        const text = document.createElement('h1');
        text.textContent = "GET BACK TO WORK!";
        text.style.color = '#ff4757';
        text.style.fontSize = '4rem';
        text.style.fontFamily = 'Impact, sans-serif';
        text.style.margin = '0 0 20px 0';

        const snoozeBtn = document.createElement('button');
        snoozeBtn.textContent = "Snooze (5 Minutes)";
        snoozeBtn.style.padding = '15px 30px';
        snoozeBtn.style.fontSize = '1.5rem';
        snoozeBtn.style.cursor = 'pointer';
        snoozeBtn.style.backgroundColor = '#ff4757';
        snoozeBtn.style.color = 'white';
        snoozeBtn.style.border = 'none';
        snoozeBtn.style.borderRadius = '10px';
        snoozeBtn.style.fontWeight = 'bold';
        
        snoozeBtn.addEventListener('click', () => {
          chrome.runtime.sendMessage({ action: 'snooze' });
        });

        box.appendChild(text);
        box.appendChild(snoozeBtn);
        container.appendChild(box);
        return;
      }

      const img = document.createElement('img');
      img.src = images[Math.floor(Math.random() * images.length)];
      
      const size = Math.floor(Math.random() * 200) + 150;
      img.style.width = `${size}px`;
      img.style.height = 'auto';
      img.style.position = 'absolute';
      
      const x = Math.floor(Math.random() * (window.innerWidth + size)) - size;
      const y = Math.floor(Math.random() * (window.innerHeight + size)) - size;
      img.style.left = `${x}px`;
      img.style.top = `${y}px`;
      
      const rotation = Math.floor(Math.random() * 360);
      img.style.transform = `rotate(${rotation}deg)`;
      
      img.style.boxShadow = '0 10px 25px rgba(0,0,0,0.8)';
      img.style.borderRadius = '15px';
      img.style.pointerEvents = 'auto'; 
      
      container.appendChild(img);
      currentImages++;
    }

    const spawnInterval = setInterval(spawnImage, 100); 
  });
}
