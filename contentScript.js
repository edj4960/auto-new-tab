// Function to modify links to open in new tabs
function modifyLinks() {
  console.log('Running modifyLinks function'); // Log when the function is triggered
  
  const links = document.links; // Use document.links to get only <a> elements with href attributes
  console.log(`Found ${links.length} links on the page`); // Log the total number of links found
  
  // Loop through all links and modify only those with target="_blank"
  Array.from(links).forEach(link => {
    console.log(`Modifying link: ${link.href}`); // Log the link being modified
    link.setAttribute('target', '_blank'); // Ensure it opens in a new tab
    link.setAttribute('rel', 'noopener noreferrer'); // Security best practice
  });
}

// Run initially for any links that exist on page load
console.log('Initial modification of links on page load');
modifyLinks();

// Set up a MutationObserver to watch for changes in the DOM
const observer = new MutationObserver((mutationsList) => {
  console.log('DOM changes detected'); // Log when the DOM changes

  mutationsList.forEach((mutation) => {
    if (mutation.addedNodes.length > 0) {
      console.log(`Mutation detected: ${mutation.addedNodes.length} nodes added`); // Log the number of added nodes
      modifyLinks(); // Modify any new links added to the page
    }
  });
});

// Observe the entire document for changes
observer.observe(document.body, {
  childList: true, // Detect direct children added/removed
  subtree: true,   // Detect changes deep within the DOM tree
});

console.log('MutationObserver set up and observing the DOM'); // Log that the observer is running