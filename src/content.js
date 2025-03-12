let isHidden = true;
let whitelist = [];
let blockedTerms = new Set();

async function loadBlockedTerms() {
  try {
    const response = await fetch(chrome.runtime.getURL('ai-accounts.json'));
    const data = await response.json();
    blockedTerms = new Set(data.accounts.map(term => term.toLowerCase()));
    console.log("ai-accounts.json loaded: ", blockedTerms)
    updateBlockedTweets();
  } catch (error) {
    console.error('Error getting ai-accounts.json:', error);
  }
}

chrome.storage.local.get(['isHidden', 'whitelist'], (data) => {
  isHidden = data.isHidden !== false;
  whitelist = (data.whitelist || []).map(user => user.toLowerCase());
  loadBlockedTerms();
});

function containsBlockedTerm(tweetText) {
  const lowerText = tweetText.toLowerCase();
  return [...blockedTerms].some(term => lowerText.includes(term));
}

function updateBlockedTweets() {
  const tweets = document.querySelectorAll('article');
  let blockedCount = 0;

  tweets.forEach(tweet => {
    const tweetText = tweet.innerText.toLowerCase();
    const usernameElement = tweet.querySelector('a[role="link"]');

    if (!usernameElement) return;

    let username = usernameElement.getAttribute('href');
    if (!username) return;

    username = '@' + username.split('/').pop().toLowerCase();

    if (whitelist.includes(username)) {
      tweet.style.display = '';
      tweet.dataset.checked = 'true';
      return;
    }

    if (containsBlockedTerm(tweetText)) {
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
      tweet.style.display = isHidden ? 'none' : '';
      if (isHidden) blockedCount++;
    });

    chrome.runtime.sendMessage({ action: 'updateBlockedCount', count: blockedCount });
    sendResponse({ isHidden });
  } else if (request.action === 'getStatus') {
    const currentBlocked = document.querySelectorAll('[data-grok-tweet="true"][style*="display: none"]').length;
    sendResponse({ isHidden, currentBlocked });
  } else if (request.action === 'updateWhitelist') {
    chrome.storage.local.get(['whitelist'], (data) => {
      whitelist = (data.whitelist || []).map(user => user.toLowerCase());
      updateBlockedTweets();
    });
  }
});
