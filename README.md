# muteAI Chrome Extension

![](https://github.com/gallardoS/BlockGrok/blob/main/resources/muteAI-640.png)
**muteAI** is a Chrome extension that automatically hides tweets from AI-generated accounts on X (formerly Twitter). It uses a predefined list of AI-generated accounts to filter out their tweets from your timeline.

![](https://github.com/gallardoS/BlockGrok/blob/main/resources/toggle.gif)

- Automatically hides tweets from/containing mentions to AI-generated accounts (like `@grok` or `@AskPerplexity` ).
- Toggle between **Muting** (hiding tweets) and **Showing** (revealing tweets).
- Whitelist users whose tweets should not be blocked, even if they mention them.
- Persistent settings stored using `chrome.storage.local`.

## How to Use
### Muting Tweets
- Click on the extension icon to open the popup.
- The toggle switch allows you to enable or disable **Muting**.
- The extension will automatically hide tweets mentioning AI accounts.

### Managing the Whitelist

![](https://github.com/gallardoS/BlockGrok/blob/main/resources/whitelist.gif)

- Add users by entering their `@username` (if `@` is missing, it will be added automatically).
- Click **Add** or press **Enter** to whitelist a user.
- Click on a username in the list to remove them from the whitelist.

### Real-time Updates
- The extension updates in real time without requiring a page reload.
- The list of AI-generated accounts is periodically refreshed.

## AI Accounts List
The list of AI-generated accounts is stored in [`ai-accounts.json`](https://github.com/gallardoS/BlockGrok/blob/main/src/ai-accounts.json). The extension automatically loads and applies this list when filtering tweets.

## Installation
1. Download or clone this repository.
2. Open **Chrome** and go to `chrome://extensions/`.
3. Enable **Developer mode** (toggle switch at the top-right).
4. Click **Load unpacked** and select the `src` folder.
5. The **muteAI** extension should now be visible in your Chrome extensions bar.

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

