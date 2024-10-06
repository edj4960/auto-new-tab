# Open Pop-up Links in New Tabs Chrome Extension

This Chrome extension forces pop-up links that usually open in a new window to open in a new tab instead. The extension modifies the `target="_blank"` behavior of links and works for both static and dynamically loaded content on websites.

## Features

- Automatically opens pop-up links in a new tab instead of a new window.
- Ensures secure link handling by adding `rel="noopener noreferrer"` to pop-up links.
- Works on dynamic websites (AJAX-loaded content) by using a `MutationObserver`.
  
## How It Works

The extension scans for all anchor (`<a>`) tags with the `target="_blank"` attribute. It modifies these links to ensure they open in a new tab rather than a new window. Additionally, the extension observes the DOM for any dynamically added content and applies the same behavior to new links.

## Installation and Setup

### Step 1: Clone the Repository

Clone the repository to your local machine:

```bash
git clone https://github.com/yourusername/chrome-popup-to-tab.git
