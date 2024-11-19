// import { SyncHandler } from './syncHandler.js';

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
    const allSites = await SyncHandler.get('allSites');
    const key = allSites ? 'excludedDomains' : 'domains';
    const domains = await SyncHandler.get(key);
    
    if (!allSites && (!domains || !Array.isArray(domains))) return;
    
    const currentDomain = window.location.hostname;

    console.log(allSites, key, domains, currentDomain);

    const shouldModifyLinks = allSites
      ? !domains.some(domain => currentDomain.includes(new URL(domain).hostname))
      : domains.some(domain => currentDomain.includes(new URL(domain).hostname));

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
};

LinkUpdater.modifyLinksIfNeeded();
