document.addEventListener('DOMContentLoaded', () => {
    const domainInput = document.getElementById('domainInput');
    const addDomainButton = document.getElementById('addDomainButton');
    const addCurrentSiteButton = document.getElementById('addCurrentSiteButton');
    const toggleAllSitesCheckbox = document.getElementById('toggleAllSites');
    const domainList = document.getElementById('domainList');

    function loadSavedDomains() {
        // Load saved domains from chrome storage
        chrome?.storage?.sync.get(['domains'], ({ domains }) => {
            if (domains && Array.isArray(domains)) {
                domains.forEach(domain => addDomainToList(domain));
            }
        });
    }

    // Initialize the toggleAllSitesCheckbox
    chrome?.storage?.sync.get(['allSites'], ({ allSites }) => {
        console.log(allSites);
        if (allSites === true || allSites === false) {
            toggleAllSitesCheckbox.checked = allSites;
        } else {
            toggleAllSitesCheckbox.checked = true;
        }
    });

    chrome.storage.onChanged.addListener((changes, areaName) => {
        console.log('here', changes, areaName);
        if (areaName === 'sync' && changes.domains) {
            linkObserver.disconnect();
            modifyLinksIfNeeded();
        }
    });

    // Add domain event listener for button click
    addDomainButton.addEventListener('click', addDomain);

    // Add domain event listener for pressing 'Enter' in the input field
    domainInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addDomain();
        }
    });

    // Add current site event listener for button click
    addCurrentSiteButton.addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
                const currentTab = tabs[0];
                let domain = new URL(currentTab.url).hostname;
                domainInput.value = domain;
                addDomain();
            }
        });
    });

    toggleAllSitesCheckbox.addEventListener('change', (event) => {
        const isChecked = event.target.checked;
    
        if (!chrome?.storage?.sync) {
            console.error('Chrome storage API is unavailable. This script requires the extension context.');
            return;
        }
    
        // Save the checkbox value to the `allSites` variable in Chrome storage
        chrome.storage.sync.set({ allSites: isChecked }, () => {
            console.log(`All sites toggle saved as: ${isChecked}`);
        });
    });

    // Function to add domain to storage and UI
    function addDomain() {
        let domain = domainInput.value.trim();
        if (domain) {
            if (!domain.startsWith('http://') && !domain.startsWith('https://')) {
                domain = 'https://' + domain;
            }
            domain = new URL(domain).hostname; // Extract hostname to ensure consistency

            if (!chrome?.storage?.sync) {
                console.error('Chrome storage API is unavailable. This script requires the extension context.');
                return;
            }
            chrome.storage.sync.get(['domains'], ({ domains }) => {
                if (!domains || !Array.isArray(domains)) {
                    domains = [];
                }
                if (!domains.includes(domain)) {
                    domains.push(domain);
                    chrome.storage.sync.set({ domains }, () => {
                        addDomainToList(domain);
                        domainInput.value = '';
                    });
                }
            });
        }
    }

    // Add domain to the UI list
    function addDomainToList(domain) {
        const li = document.createElement('li');
        li.textContent = domain;

        const removeButton = document.createElement('button');
        removeButton.innerHTML = '<i class="fas fa-trash-alt"></i>Remove';
        removeButton.addEventListener('click', () => {
            chrome.storage.sync.get(['domains'], ({ domains }) => {
                if (domains && Array.isArray(domains)) {
                    const updatedDomains = domains.filter(d => d !== domain);
                    chrome.storage.sync.set({ domains: updatedDomains }, () => {
                        li.remove();
                    });
                }
            });
        });

        li.appendChild(removeButton);
        domainList.appendChild(li);
    }
});
