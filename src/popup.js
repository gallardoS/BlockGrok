document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('toggle');
  const statusText = document.getElementById('toggle-status');
  const whitelistInput = document.getElementById('whitelist-input');
  const addWhitelistBtn = document.getElementById('add-whitelist');
  const whitelistList = document.getElementById('whitelist-list');
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.tab).classList.add('active');
    });
  });

  function addUserToWhitelist() {
    let username = whitelistInput.value.trim();
    if (username.length > 0) {
      if (!username.startsWith('@')) {
        username = '@' + username;
      }
      chrome.storage.local.get(['whitelist'], (data) => {
        const whitelist = data.whitelist || [];
        if (!whitelist.includes(username)) {
          whitelist.push(username);
          chrome.storage.local.set({ whitelist }, () => {
            loadWhitelist();
            updateContentScript();
          });
        }
      });
      whitelistInput.value = '';
    }
  }

  function loadWhitelist() {
    chrome.storage.local.get(['whitelist'], (data) => {
      whitelistList.innerHTML = '';
      const whitelist = data.whitelist || [];
      whitelist.forEach(username => {
        const li = document.createElement('li');
        li.textContent = username;
        li.style.cursor = 'pointer';
        li.addEventListener('click', () => removeWhitelist(username));
        whitelistList.appendChild(li);
      });
    });
  }

  function removeWhitelist(username) {
    chrome.storage.local.get(['whitelist'], (data) => {
      let whitelist = data.whitelist || [];
      whitelist = whitelist.filter(user => user !== username);
      chrome.storage.local.set({ whitelist }, () => {
        loadWhitelist();
        updateContentScript();
      });
    });
  }

  function updateContentScript() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'updateWhitelist' });
    });
  }

  addWhitelistBtn.addEventListener('click', addUserToWhitelist);

  whitelistInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      addUserToWhitelist();
    }
  });

  loadWhitelist();

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'getStatus' }, (response) => {
      if (response) {
        toggle.checked = response.isHidden;
        statusText.textContent = response.isHidden ? 'Muting' : 'Showing';
      }
    });
  });

  toggle.addEventListener('change', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleTweets' }, (response) => {
        if (response) {
          statusText.textContent = response.isHidden ? 'Muting' : 'Showing';
        }
      });
    });
  });
});
