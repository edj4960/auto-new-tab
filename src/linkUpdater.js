const LinkUpdater = {
  originalLinkAttributes: new WeakMap(), // Store original attributes here

  async modifyLinksIfNeeded() {
    const allSites = await SyncHandler.get('allSites', true);
    const key = allSites ? 'excludedDomains' : 'domains';
    const domains = await SyncHandler.get(key, []);
    
    if (!allSites && (!domains || !Array.isArray(domains))) return;
    
    const currentDomain = window.location.hostname;

    // Normalize domains and filter out invalid entries
    const normalizedDomains = domains
      .map(this.normalizeDomain)
      .filter(domain => domain !== null);
  
    const shouldModifyLinks = allSites
      ? !normalizedDomains.some(domain => currentDomain.includes(domain))
      : normalizedDomains.some(domain => currentDomain.includes(domain));
    
    let observer = null;
    if (shouldModifyLinks) {
      this.saveAndModifyLinks(Array.from(document.links));
      
      observer = this.observeLinks();
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
      
    }

    SyncHandler.onChange(() => {
      if (observer !== null) {
        observer.disconnect();
      }
      this.resetLinks();
      this.modifyLinksIfNeeded();
    });
  },

  observeLinks() {
    return new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        const newLinks = Array.from(mutation.addedNodes).flatMap(node =>
          node.nodeType === Node.ELEMENT_NODE ? Array.from(node.getElementsByTagName('a')) : []
        );
        this.saveAndModifyLinks(newLinks);
      });
    });
  },

  saveAndModifyLinks(links) {
    links.forEach(link => {
      // Save original attributes if not already saved
      if (!this.originalLinkAttributes.has(link)) {
        this.originalLinkAttributes.set(link, {
          target: link.getAttribute('target') || null,
          rel: link.getAttribute('rel') || null,
        });
      }

      // Modify the link to open in a new tab
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    });
  },

  resetLinks() {
    Array.from(document.links).forEach(link => {
      if (this.originalLinkAttributes.has(link)) {
        const originalAttrs = this.originalLinkAttributes.get(link);

        // Restore original attributes
        if (originalAttrs.target !== null) {
          link.setAttribute('target', originalAttrs.target);
        } else {
          link.removeAttribute('target');
        }

        if (originalAttrs.rel !== null) {
          link.setAttribute('rel', originalAttrs.rel);
        } else {
          link.removeAttribute('rel');
        }

        // Remove from WeakMap to avoid memory leaks
        this.originalLinkAttributes.delete(link);
      }
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
      return null; // Skip invalid domains
    }
  },
};

LinkUpdater.modifyLinksIfNeeded();
