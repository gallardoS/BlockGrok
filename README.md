# BlockGrok Chrome Extension

BlockGrok is a Chrome extension that automatically hides tweets mentioning `@grok` on X (formerly Twitter). It also provides a whitelist feature to exclude specific users from being affected by the filtering.

## Features
- Automatically hides tweets containing `@grok`.
- Toggle between **Muting** (hiding tweets) and **Showing** (revealing tweets).
- Displays the number of tweets currently blocked on the page.
- Whitelist feature: Add users whose tweets should not be blocked, even if they mention `@grok`.
- Persistent settings stored using `chrome.storage.local`.

## How to Use
### Muting Tweets
- Click on the extension icon to open the popup.
- The toggle switch allows you to enable or disable **Muting**.
- The extension will automatically hide tweets mentioning `@grok`.

### Managing the Whitelist
- Navigate to the **Whitelist** tab in the popup.
- Add users by entering their `@username` (if `@` is missing, it will be added automatically).
- Click **Add** or press **Enter** to whitelist a user.
- Click on a username in the list to remove them from the whitelist.

### Real-time Updates
- The extension updates in real time without requiring a page reload.
- The number of tweets blocked will update dynamically in the popup.

## Installation
1. Download or clone this repository.
2. Open **Chrome** and go to `chrome://extensions/`.
3. Enable **Developer mode** (toggle switch at the top-right).
4. Click **Load unpacked** and select the repo.
5. The BlockGrok extension should now be visible in your Chrome extensions bar.

## Permissions
- **Storage:** Saves user settings (whitelist, toggle state).
- **Active Tab & Scripting:** Allows modifying the webpage to hide tweets.

## Troubleshooting
- If the extension does not work, try refreshing the page.
- Ensure that `chrome://extensions/` has the extension enabled.
- If you encounter issues, check the **Developer Console** in Chrome (`F12` → Console tab) for errors.

## Contributing
Contributions, bug reports, and feature requests are welcome! Feel free to open an issue or submit a pull request.

## Contact
For bugs, feedback, or suggestions, reach out on X (Twitter) at [@swamigallardo](https://x.com/swamigallardo).

