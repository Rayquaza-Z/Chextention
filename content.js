chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'removePunishment') {
    const container = document.getElementById('taskmaster-punishment-container');
    if (container) container.remove();
  }
});

if (!document.getElementById('taskmaster-punishment-container')) {
  
  chrome.storage.local.get(['sillyImages'], (data) => {
    let images = data.sillyImages;
    if (!images || images.length === 0) {
      images = [
        chrome.runtime.getURL('assets/default1.jpg'),
        chrome.runtime.getURL('assets/default2.jpg'),
        chrome.runtime.getURL('assets/default3.jpg')
      ];
    }

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
        box.style.backgroundColor = '#FFD700';
        box.style.padding = '60px 80px';
        box.style.border = '8px solid #000';
        box.style.textAlign = 'center';
        box.style.pointerEvents = 'auto';
        box.style.boxShadow = '16px 16px 0px #000';
        box.style.display = 'flex';
        box.style.flexDirection = 'column';
        box.style.alignItems = 'center';
        box.style.gap = '30px';

        const text = document.createElement('h1');
        text.textContent = "GET BACK TO WORK!";
        text.style.color = '#000';
        text.style.fontSize = '5rem';
        text.style.fontFamily = '"Courier New", Courier, monospace';
        text.style.fontWeight = '900';
        text.style.textTransform = 'uppercase';
        text.style.margin = '0';
        text.style.letterSpacing = '-2px';

        const snoozeBtn = document.createElement('button');
        snoozeBtn.textContent = "Snooze (5 Minutes)";
        snoozeBtn.style.padding = '20px 40px';
        snoozeBtn.style.fontSize = '2rem';
        snoozeBtn.style.cursor = 'pointer';
        snoozeBtn.style.backgroundColor = '#FF4757';
        snoozeBtn.style.color = '#000';
        snoozeBtn.style.border = '6px solid #000';
        snoozeBtn.style.fontWeight = '900';
        snoozeBtn.style.fontFamily = 'sans-serif';
        snoozeBtn.style.boxShadow = '8px 8px 0px #000';
        snoozeBtn.style.transition = 'transform 0.1s, box-shadow 0.1s';
        
        snoozeBtn.onmousedown = () => {
          snoozeBtn.style.transform = 'translate(4px, 4px)';
          snoozeBtn.style.boxShadow = '4px 4px 0px #000';
        };
        snoozeBtn.onmouseup = () => {
          snoozeBtn.style.transform = 'none';
          snoozeBtn.style.boxShadow = '8px 8px 0px #000';
        };
        snoozeBtn.onmouseleave = () => {
          snoozeBtn.style.transform = 'none';
          snoozeBtn.style.boxShadow = '8px 8px 0px #000';
        };
        
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
