document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('toggle');
  const statusText = document.getElementById('toggle-status');
  const slider = document.querySelector('.slider');
  const whitelistInput = document.getElementById('whitelist-input');
  const addWhitelistBtn = document.getElementById('add-whitelist');
  const whitelistList = document.getElementById('whitelist-list');
  const versionElement = document.getElementById('version');

  function updateToggleUI(isHidden) {
    statusText.textContent = isHidden ? '❌ Muting @grok' : '👁️ Showing @grok';
    slider.style.backgroundColor = isHidden ? '#4caf50' : '#888';
  }

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

      if (whitelist.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.textContent = "no whitelisted users yet";
        emptyMessage.style.color = "#888";
        emptyMessage.style.fontStyle = "italic";
        emptyMessage.style.textAlign = "center";
        whitelistList.appendChild(emptyMessage);
      } else {
        whitelist.forEach(username => {
          const li = document.createElement('li');
          li.textContent = username;
          li.style.cursor = 'pointer';
          li.addEventListener('click', () => removeWhitelist(username));
          whitelistList.appendChild(li);
        });
      }
      updateContentScript();
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
        updateToggleUI(response.isHidden);
      }
    });
  });

  toggle.addEventListener('change', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleTweets' }, (response) => {
        if (response) {
          updateToggleUI(response.isHidden);
        }
      });
    });
  });

  chrome.runtime.getManifest && versionElement && (versionElement.textContent = `v${chrome.runtime.getManifest().version}`);
});
