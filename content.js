chrome.storage.local.get(['sillyImage'], (data) => {
  if (!data.sillyImage) return; // If they haven't uploaded an image yet, do nothing.

  // Check if we already started the invasion on this page to avoid duplicates
  if (document.getElementById('taskmaster-punishment-container')) return;

  // Create an invisible container for all our images
  const container = document.createElement('div');
  container.id = 'taskmaster-punishment-container';
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100vw';
  container.style.height = '100vh';
  container.style.pointerEvents = 'none'; // Let clicks pass through the empty spaces
  container.style.zIndex = '2147483647'; // Max z-index to stay on top of everything
  document.body.appendChild(container);

  const totalImages = 50; // The screen will fill with 50 images
  let currentImages = 0;

  // Function to spawn one image at a random location
  function spawnImage() {
    // If we've reached 50 images, stop the loop and show the warning text
    if (currentImages >= totalImages) {
      clearInterval(spawnInterval);
      
      const text = document.createElement('h1');
      text.textContent = "GET BACK TO WORK!";
      text.style.position = 'absolute';
      text.style.top = '50%';
      text.style.left = '50%';
      text.style.transform = 'translate(-50%, -50%)'; // Perfectly center it
      text.style.color = '#ff4757';
      text.style.fontSize = '6rem';
      text.style.fontFamily = 'Impact, sans-serif';
      text.style.textAlign = 'center';
      text.style.textShadow = '4px 4px 0px white, -4px -4px 0px white, 4px -4px 0px white, -4px 4px 0px white';
      text.style.pointerEvents = 'auto'; // Block clicks in the middle
      container.appendChild(text);
      return;
    }

    // Create the image element
    const img = document.createElement('img');
    img.src = data.sillyImage;
    
    // Randomize the size slightly for a chaotic effect (between 100px and 250px)
    const size = Math.floor(Math.random() * 150) + 100;
    img.style.width = `${size}px`;
    img.style.height = 'auto';
    img.style.position = 'absolute';
    
    // Random position within the browser window boundaries
    const x = Math.floor(Math.random() * (window.innerWidth - size));
    const y = Math.floor(Math.random() * (window.innerHeight - size));
    img.style.left = `${x}px`;
    img.style.top = `${y}px`;
    
    // Add some random rotation to make it look messy
    const rotation = Math.floor(Math.random() * 360);
    img.style.transform = `rotate(${rotation}deg)`;
    
    // Styling
    img.style.boxShadow = '0 5px 15px rgba(0,0,0,0.5)';
    img.style.borderRadius = '10px';
    img.style.pointerEvents = 'auto'; // Block clicks wherever an image lands
    
    // Add the image to the screen and increase the counter
    container.appendChild(img);
    currentImages++;
  }

  // Run the spawnImage function every 150 milliseconds!
  const spawnInterval = setInterval(spawnImage, 150);
