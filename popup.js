document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('taskInput');
  const dailyCheck = document.getElementById('dailyCheck');
  const addBtn = document.getElementById('addBtn');
  const taskList = document.getElementById('taskList');
  const imageInput = document.getElementById('imageInput');
  const preview = document.getElementById('preview');

  // Load existing data from the browser's local storage
  chrome.storage.local.get(['tasks', 'sillyImage'], (data) => {
    const tasks = data.tasks || [];
    renderTasks(tasks);
    if (data.sillyImage) {
      preview.src = data.sillyImage;
      preview.style.display = 'block';
    }
  });

  // When "Add" is clicked, save the new task
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

  // Convert uploaded image to Base64 and save it to storage
  imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Image = event.target.result;
      chrome.storage.local.set({ sillyImage: base64Image }, () => {
        preview.src = base64Image;
        preview.style.display = 'block';
      });
    };
    reader.readAsDataURL(file);
  });

  // Draw the checklist on the screen
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

      // When a checkbox is clicked
      checkbox.addEventListener('change', () => {
        tasks[index].completed = checkbox.checked;
        chrome.storage.local.set({ tasks }, () => {
          renderTasks(tasks);
          
          if (checkbox.checked) {
             // TELL THE BACKGROUND SCRIPT TO RESET THE 1-HOUR TIMER!
             chrome.runtime.sendMessage({ action: 'taskCompleted' });
          }
        });
      });

      li.appendChild(checkbox);
      li.appendChild(span);
      taskList.appendChild(li);
    });
  }
