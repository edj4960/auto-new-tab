const LinkUpdater = {
  async modifyLinksIfNeeded() {
    const allSites = await SyncHandler.get('allSites');
    const key = allSites ? 'excludedDomains' : 'domains';
    const domains = await SyncHandler.get(key);
    
    if (!allSites && (!domains || !Array.isArray(domains))) return;
    
    const currentDomain = window.location.hostname;

    console.log(allSites, key, domains, currentDomain);
    
    // Normalize domains and filter out invalid entries
    const normalizedDomains = domains
      .map(this.normalizeDomain)
      .filter(domain => domain !== null);
  
    const shouldModifyLinks = allSites
      ? !normalizedDomains.some(domain => currentDomain.includes(domain))
      : normalizedDomains.some(domain => currentDomain.includes(domain));
    
    console.log(shouldModifyLinks);
    
    if (shouldModifyLinks) {
      this.setLinksToOpenInNewTab(Array.from(document.links));
      
      const observer = this.observeLinks();
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
      
      SyncHandler.onChange(changes => {
        if (changes[key]) {
          observer.disconnect();
          this.modifyLinksIfNeeded();
        }
      });
    }
  },

  observeLinks() {
    return new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        const newLinks = Array.from(mutation.addedNodes).flatMap(node =>
          node.nodeType === Node.ELEMENT_NODE ? Array.from(node.getElementsByTagName('a')) : []
        );
        this.setLinksToOpenInNewTab(newLinks);
      });
    });
  },

  setLinksToOpenInNewTab(links) {
    links.forEach(link => {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    });
  },

  normalizeDomain(domain) {
    try {
      // Ensure domain has a protocol
      if (!domain.startsWith('http://') && !domain.startsWith('https://')) {
        domain = `https://${domain}`;
      }
      // Attempt to construct a valid URL
      return new URL(domain).hostname;
    } catch (error) {
      console.error(`Invalid domain: ${domain}`, error);
      return null; // Skip invalid domains
    }
  },
};

LinkUpdater.modifyLinksIfNeeded();
