// Function to modify links to open in new tabs
function modifyLinks() {
  const links = document.links;
  
  Array.from(links).forEach(link => {
    link.setAttribute('target', '_blank'); // Ensure it opens in a new tab
    link.setAttribute('rel', 'noopener noreferrer'); // Security best practice
  });
}

// Run initially for any links that exist on page load
modifyLinks();

// Set up a MutationObserver to watch for changes in the DOM
const observer = new MutationObserver((mutationsList) => {
  mutationsList.forEach((mutation) => {
    if (mutation.addedNodes.length > 0) {
      modifyLinks(); // Modify any new links added to the page
    }
  });
});

// Observe the entire document for changes
observer.observe(document.body, {
  childList: true, // Detect direct children added/removed
  subtree: true,   // Detect changes deep within the DOM tree
});