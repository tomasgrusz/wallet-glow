const ethRegex = /\b0x[a-fA-F0-9]{40}\b/g;

function highlightEthAddresses(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    const matches = node.textContent.match(ethRegex);
    if (matches) {
      const span = document.createElement('span');
      span.innerHTML = node.textContent.replace(ethRegex, match =>
        `<a href="https://etherscan.io/address/${match}" target="_blank" rel="noopener noreferrer" style="
          background: linear-gradient(90deg, #ff0080, #7928ca, #00c6ff, #ff0080);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: bold;
          text-decoration: none;
        ">${match}</a>`
      );
      node.parentNode.replaceChild(span, node);
    }
  } else {
    node.childNodes.forEach(highlightEthAddresses);
  }
}

document.body && highlightEthAddresses(document.body);
