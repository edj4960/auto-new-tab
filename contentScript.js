// Function to modify all page links to open in a new tab securely
function setLinksToOpenInNewTab(links) {
  links.forEach(link => {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  });
}

// Observe changes in the DOM to modify new links
const linkObserver = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    const newLinks = Array.from(mutation.addedNodes).flatMap(node =>
      node.nodeType === Node.ELEMENT_NODE ? Array.from(node.getElementsByTagName('a')) : []
    );
    setLinksToOpenInNewTab(newLinks);
  });
});

function modifyLinksIfNeeded() {
  // Retrieve user-configured domains from storage
  chrome.storage.sync.get(['domains'], ({ domains }) => {
    if (!domains || !Array.isArray(domains)) return;

    const currentDomain = window.location.hostname;

    // Check if the current domain matches any user-configured domains
    const shouldModifyLinks = domains.some(domain => {
      const domainHostname = new URL(domain.startsWith('http') ? domain : 'https://' + domain).hostname;
      return currentDomain.includes(domainHostname);
    });

    if (shouldModifyLinks) {
      // Modify existing links on the page
      setLinksToOpenInNewTab(Array.from(document.links));

      // Start observing the document body for changes to apply link modification
      linkObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }
  });
}

// Initial run to modify links if needed
modifyLinksIfNeeded();

// Listen for changes in the storage and update the links accordingly
chrome.storage.onChanged.addListener((changes, areaName) => {
  console.log('here', changes, areaName);
  if (areaName === 'sync' && changes.domains) {
    // Stop the observer before re-running link modification to prevent redundant operations
    linkObserver.disconnect();
    modifyLinksIfNeeded();
  }
});
