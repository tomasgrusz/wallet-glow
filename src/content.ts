const ethRegex = /\b0x[a-fA-F0-9]{40}\b/g;

const generateLink = (address: string) => {
    return `
    <a 
        href="https://etherscan.io/address/${address}"
        target="_blank" 
        rel="noopener noreferrer"
        class="magic-link">
        ${address}
    </a>`;
}

function highlightEthAddresses(node: Node): void {
  if (node.nodeType === Node.TEXT_NODE) {
    const textNode = node as Text;
    const matches = textNode.textContent?.match(ethRegex);
    if (matches) {
      const span = document.createElement('span');
      span.innerHTML = textNode.textContent!.replace(ethRegex, (match: string) => generateLink(match));
      if (node.parentNode) {
        node.parentNode.replaceChild(span, node);
      }
    }
  } else {
    node.childNodes.forEach((child: ChildNode) => highlightEthAddresses(child));
  }
}

document.body && highlightEthAddresses(document.body);
