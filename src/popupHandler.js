import { SyncHandler } from './syncHandler.js';

document.addEventListener('DOMContentLoaded', async () => {
  const domainInput = document.getElementById('domainInput');
  const addDomainButton = document.getElementById('addDomainButton');
  const addCurrentSiteButton = document.getElementById('addCurrentSiteButton');
  const toggleAllSitesCheckbox = document.getElementById('toggleAllSites');
  const domainList = document.getElementById('domainList');

  // Initialize toggleAllSitesCheckbox
  const allSites = await SyncHandler.get('allSites');
  toggleAllSitesCheckbox.checked = allSites || false;

  // Event Listener for toggleAllSitesCheckbox
  toggleAllSitesCheckbox.addEventListener('change', async event => {
    await SyncHandler.set('allSites', event.target.checked);
    console.log(`All sites toggle saved as: ${event.target.checked}`);
  });

  // Load and display saved domains
  const domains = await SyncHandler.get('domains');
  if (domains && Array.isArray(domains)) {
    domains.forEach(domain => addDomainToList(domain));
  }

  addDomainButton.addEventListener('click', addDomain);

  domainInput.addEventListener('keypress', event => {
    if (event.key === 'Enter') addDomain();
  });

  addCurrentSiteButton.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, async tabs => {
      if (tabs.length > 0) {
        const currentTab = tabs[0];
        const domain = new URL(currentTab.url).hostname;
        domainInput.value = domain;
        addDomain();
      }
    });
  });

  // Function to add a domain
  async function addDomain() {
    let domain = domainInput.value.trim();
    if (!domain) return;

    if (!domain.startsWith('http://') && !domain.startsWith('https://')) {
      domain = 'https://' + domain;
    }
    domain = new URL(domain).hostname;

    const domains = (await SyncHandler.get('domains')) || [];
    if (!domains.includes(domain)) {
      domains.push(domain);
      await SyncHandler.set('domains', domains);
      addDomainToList(domain);
      domainInput.value = '';
    }
  }

  // Function to add a domain to the UI list
  function addDomainToList(domain) {
    const li = document.createElement('li');
    li.textContent = domain;

    const removeButton = document.createElement('button');
    removeButton.innerHTML = '<i class="fas fa-trash-alt"></i>Remove';
    removeButton.addEventListener('click', async () => {
      const domains = (await SyncHandler.get('domains')) || [];
      const updatedDomains = domains.filter(d => d !== domain);
      await SyncHandler.set('domains', updatedDomains);
      li.remove();
    });

    li.appendChild(removeButton);
    domainList.appendChild(li);
  }
});
