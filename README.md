# Auto New Tab Chrome Extension

**Auto New Tab** is a lightweight Chrome extension that ensures links open seamlessly in new tabs, enhancing your browsing experience. It works automatically on all websites, whether content is static or dynamically loaded.

---

## Features

- **Automatic New Tab Opening**: Forces all specified links to open in new tabs instead of new windows.
- **Dynamic Compatibility**: Handles dynamically added links using a `MutationObserver`.
- **Secure Browsing**: Adds `rel="noopener noreferrer"` for secure link handling.
- **Customizable Behavior**: Includes options to enable or exclude specific sites.

---

## How It Works

- **Link Handling**: The extension scans for anchor (`<a>`) tags and adjusts the `target="_blank"` attribute for consistent tab behavior.
- **Dynamic Monitoring**: Observes DOM changes and ensures new links adhere to the same rules.
- **Customizable Options**: Enable for all sites or configure domain-specific rules directly in the extension's settings popup.

---

## Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/edj4960/auto-new-tab.git
   cd auto-new-tab
   ```

## Load the Extension in Chrome

1. Open Chrome and go to `chrome://extensions/`.
2. Enable **Developer Mode** (top right).
3. Click **Load unpacked** and select the cloned repository folder.

---

## Usage

### Enable the Extension

- Once loaded, the extension will automatically handle links on all websites.

### Configure Settings

- Click the extension icon to open the settings popup.
- Choose to enable it for all sites or configure domain-specific rules.

### Reload Current Tab

- After updating settings, you can reload the current tab directly from the popup for immediate changes.

---

## Contribution

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m "Description of changes"`.
4. Push the branch: `git push origin feature-name`.
5. Open a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
