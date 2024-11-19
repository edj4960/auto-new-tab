import { SyncHandler } from './syncHandler.js';

const LinkUpdater = {
  setLinksToOpenInNewTab(links) {
    links.forEach(link => {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    });
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

  async modifyLinksIfNeeded() {
    const domains = await SyncHandler.get('domains');
    if (!domains || !Array.isArray(domains)) return;

    const currentDomain = window.location.hostname;
    const shouldModifyLinks = domains.some(domain => {
      const domainHostname = new URL(domain.startsWith('http') ? domain : 'https://' + domain).hostname;
      return currentDomain.includes(domainHostname);
    });

    if (shouldModifyLinks) {
      this.setLinksToOpenInNewTab(Array.from(document.links));

      const observer = this.observeLinks();
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      SyncHandler.onChange(changes => {
        if (changes.domains) {
          observer.disconnect();
          this.modifyLinksIfNeeded();
        }
      });
    }
  },
};

// Initialize the script
LinkUpdater.modifyLinksIfNeeded();
