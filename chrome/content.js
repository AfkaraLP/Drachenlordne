function processPage() {
  if (window.drachenlordProcessed) return;
  window.drachenlordProcessed = true;

  if (window.drachenlordObserver) {
    window.drachenlordObserver.disconnect();
  }

  setTimeout(() => {
    processTextNodes();

    const observer = new MutationObserver((mutations) => {
      let shouldProcess = false;
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          shouldProcess = true;
        }
      });

      if (shouldProcess) {
        setTimeout(processTextNodes, 100);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    window.drachenlordObserver = observer;
  }, 1000);
}

function processTextNodes() {
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function(node) {
        if (node.parentNode.tagName === 'SCRIPT' ||
          node.parentNode.tagName === 'STYLE' ||
          node.parentNode.classList.contains('drachenlord-processed')) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    },
    false
  );

  let textNode;
  const processedNodes = [];

  while (textNode = walker.nextNode()) {
    const originalText = textNode.textContent;
    const processedText = processText(originalText);
    if (originalText !== processedText) {
      textNode.parentNode.classList.add('drachenlord-processed');
      textNode.textContent = processedText;
      processedNodes.push(textNode);
    }
  }
}

if (document.readyState === 'complete') {
  processPage();
} else {
  window.addEventListener('load', processPage);
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
