let isHidden = true;
let whitelist = [];

chrome.storage.local.get(['isHidden', 'whitelist'], (data) => {
  isHidden = data.isHidden !== false;
  whitelist = data.whitelist || [];
  updateBlockedTweets();
});

function updateBlockedTweets() {
  const tweets = document.querySelectorAll('article');
  let blockedCount = 0;

  tweets.forEach(tweet => {
    if (tweet.dataset.checked) return;

    const tweetText = tweet.innerText.toLowerCase();
    const usernameElement = tweet.querySelector('a[role="link"]');

    if (!usernameElement) return;

    let username = usernameElement.innerText.trim();
    if (!username.startsWith('@')) {
      username = '@' + username;
    }

    if (whitelist.includes(username)) {
      tweet.style.display = '';
      tweet.dataset.checked = 'true';
      return;
    }

    if (tweetText.includes('@grok')) {
      tweet.style.display = isHidden ? 'none' : '';
      tweet.dataset.checked = 'true';
      tweet.dataset.grokTweet = 'true';
      if (isHidden) blockedCount++;
    }
  });

  chrome.runtime.sendMessage({ action: 'updateBlockedCount', count: blockedCount });
}

const observer = new MutationObserver(updateBlockedTweets);
observer.observe(document.body, { childList: true, subtree: true });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleTweets') {
    isHidden = !isHidden;
    chrome.storage.local.set({ isHidden });

    let blockedCount = 0;
    document.querySelectorAll('[data-grok-tweet="true"]').forEach(tweet => {
      if (isHidden && !whitelist.includes(tweet.dataset.username)) {
        tweet.style.display = 'none';
        blockedCount++;
      } else {
        tweet.style.display = '';
      }
    });

    chrome.runtime.sendMessage({ action: 'updateBlockedCount', count: blockedCount });
    sendResponse({ isHidden });
  } else if (request.action === 'getStatus') {
    const currentBlocked = document.querySelectorAll('[data-grok-tweet="true"]:not([data-checked])').length;
    sendResponse({ isHidden, currentBlocked });
  } else if (request.action === 'updateWhitelist') {
    chrome.storage.local.get(['whitelist'], (data) => {
      whitelist = data.whitelist || [];
      updateBlockedTweets();
    });
  }
});
