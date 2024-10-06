document.addEventListener('click', function (e) {
    const target = e.target;
    if (target.tagName === 'A' && target.hasAttribute('target') && target.getAttribute('target') === '_blank') {
      e.preventDefault();
      const linkUrl = target.href;
      window.open(linkUrl, '_blank'); // Open in new tab
    }
  }, false);
  