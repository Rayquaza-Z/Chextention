document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('taskInput');
  const dailyCheck = document.getElementById('dailyCheck');
  const addBtn = document.getElementById('addBtn');
  const taskList = document.getElementById('taskList');
  const imageInput = document.getElementById('imageInput');
  const previewContainer = document.getElementById('previewContainer');

  chrome.storage.local.get(['tasks', 'sillyImages'], (data) => {
    const tasks = data.tasks || [];
    renderTasks(tasks);
    if (data.sillyImages && data.sillyImages.length > 0) {
      renderPreviews(data.sillyImages);
    }
  });

  addBtn.addEventListener('click', () => {
    const text = taskInput.value.trim();
    if (!text) return;
    
    chrome.storage.local.get(['tasks'], (data) => {
      const tasks = data.tasks || [];
      tasks.push({
        id: Date.now(),
        text: text,
        completed: false,
        isDaily: dailyCheck.checked
      });
      
      chrome.storage.local.set({ tasks }, () => {
        renderTasks(tasks);
        taskInput.value = '';
        dailyCheck.checked = false;
      });
    });
  });

  imageInput.addEventListener('change', (e) => {
    const files = e.target.files;
    if (files.length === 0) return;
    
    let base64Images = [];
    let filesProcessed = 0;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        base64Images.push(event.target.result);
        filesProcessed++;
        
        if (filesProcessed === files.length) {
          chrome.storage.local.set({ sillyImages: base64Images }, () => {
            renderPreviews(base64Images);
          });
        }
      };
      reader.readAsDataURL(file);
    });
  });

  function renderPreviews(images) {
    previewContainer.innerHTML = '';
    images.forEach(src => {
      const img = document.createElement('img');
      img.src = src;
      img.style.height = '60px';
      img.style.borderRadius = '5px';
      previewContainer.appendChild(img);
    });
  }

  function renderTasks(tasks) {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
      const li = document.createElement('li');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.completed;
      
      const span = document.createElement('span');
      span.textContent = task.text + (task.isDaily ? ' 🔄' : '');
      if (task.completed) span.className = 'completed';

      checkbox.addEventListener('change', () => {
        tasks[index].completed = checkbox.checked;
        chrome.storage.local.set({ tasks }, () => {
          renderTasks(tasks);
          if (checkbox.checked) {
             chrome.runtime.sendMessage({ action: 'taskCompleted' });
          }
        });
      });

      li.appendChild(checkbox);
      li.appendChild(span);
      taskList.appendChild(li);
    });
  }
});
