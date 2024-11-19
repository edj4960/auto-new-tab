document.addEventListener('DOMContentLoaded', async () => {
  const domainInput = document.getElementById('domainInput');
  const addDomainButton = document.getElementById('addDomainButton');
  const addCurrentSiteButton = document.getElementById('addCurrentSiteButton');
  const toggleAllSitesCheckbox = document.getElementById('toggleAllSites');
  const domainList = document.getElementById('domainList');
  const domainsTitle = document.getElementById('domainsTitle');

  const updateUI = async () => {
    const allSites = await SyncHandler.get('allSites');
    toggleAllSitesCheckbox.checked = allSites || false;

    // Update title and buttons based on allSites state
    domainsTitle.textContent = allSites ? 'Excluded Domains' : 'Included Domains';
    addDomainButton.innerHTML = `<i class="fas ${allSites ? 'fa-minus' : 'fa-plus'}"></i>${allSites ? 'Exclude Domain' : 'Add Domain'}`;
    addCurrentSiteButton.innerHTML = `<i class="fas fa-globe"></i>${allSites ? 'Exclude Current Site' : 'Add Current Site'}`;

    const key = allSites ? 'excludedDomains' : 'domains';
    const domains = await SyncHandler.get(key);
    domainList.innerHTML = ''; // Clear the list
    if (domains && Array.isArray(domains)) {
      domains.forEach(domain => addDomainToList(domain, key));
    }
  };

  async function addDomain() {
    let domain = domainInput.value.trim();
    if (!domain) return;
  
    const normalizedDomain = LinkUpdater.normalizeDomain(domain);
    if (!normalizedDomain) {
      alert('Invalid domain. Please try again.');
      return;
    }
  
    const allSites = await SyncHandler.get('allSites');

    const key = allSites ? 'excludedDomains' : 'domains';
    const domains = (await SyncHandler.get(key)) || [];
  
    if (!domains.includes(normalizedDomain)) {
      domains.push(normalizedDomain);
      await SyncHandler.set(key, domains);
      addDomainToList(normalizedDomain, key);
      domainInput.value = '';
    }
  }

  const addDomainToList = (domain, key) => {
    const li = document.createElement('li');
    li.textContent = domain;

    const removeButton = document.createElement('button');
    removeButton.innerHTML = '<i class="fas fa-trash-alt"></i>Remove';
    removeButton.addEventListener('click', async () => {
      const domains = (await SyncHandler.get(key)) || [];
      const updatedDomains = domains.filter(d => d !== domain);
      await SyncHandler.set(key, updatedDomains);
      li.remove();
    });

    li.appendChild(removeButton);
    domainList.appendChild(li);
  };

  toggleAllSitesCheckbox.addEventListener('change', async () => {
    await SyncHandler.set('allSites', toggleAllSitesCheckbox.checked);
    updateUI();
  });

  addDomainButton.addEventListener('click', addDomain);

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

  domainInput.addEventListener('keypress', event => {
    if (event.key === 'Enter') addDomain();
  });

  updateUI();
});
