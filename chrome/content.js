replaceTextInElement(document.body);
document.body.setAttribute('data-processed', 'true');

const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        node.textContent = processText(node.textContent);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        replaceTextInElement(node);
      }
    });
  });
});
observer.observe(document.body, {
  childList: true,
  subtree: true
});

function replaceTextInElement(element) {
  if (!element.hasAttribute('data-processed')) {
    if (element.childNodes.length) {
      element.childNodes.forEach(child => {
        switch (child.nodeType) {
          case Node.ELEMENT_NODE:
            replaceTextInElement(child);
            break;
          case Node.TEXT_NODE:
            child.textContent = processText(child.textContent);
            break;
        }
      });
    }
    element.setAttribute('data-processed', 'true');
  }
}

function processText(text) {
  return text.split(/(\W+)/).map(part => {
    if (/\p{L}+/u.test(part)) {
      const lowerPart = part.toLowerCase();
      if (lowerPart.endsWith('en')) {
        return part.slice(0, -2) + 'ne';
      }
    }
    return part;
  }).join('');
}
