// Function to modify links to open in new tabs
function modifyLinks() {
  const links = document.querySelectorAll('a[target="_blank"]');
  links.forEach(link => {
    link.setAttribute('target', '_blank'); // Ensures it opens in a new tab
    link.setAttribute('rel', 'noopener noreferrer'); // Security best practice
  });
}

// Run initially for any links that exist on page load
modifyLinks();

// Set up a MutationObserver to watch for changes in the DOM
const observer = new MutationObserver((mutationsList) => {
  mutationsList.forEach((mutation) => {
    // If nodes are added to the DOM
    if (mutation.addedNodes.length > 0) {
      // Run modifyLinks on any new anchor tags that were added
      modifyLinks();
    }
  });
});

// Observe the entire document for changes (you can adjust the target to specific containers if needed)
observer.observe(document.body, {
  childList: true, // Detect direct children added/removed
  subtree: true,   // Detect changes deep within the DOM tree
});
