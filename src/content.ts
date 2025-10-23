import { ethers } from 'ethers';

const ethRegex = /\b0x[a-fA-F0-9]{40}\b/g;

// @ts-expect-error - injected env variable
const provider = new ethers.InfuraProvider('mainnet', INFURA_API_KEY);

const generateLink = (displayText: string, address: string) => {
  return `
    <a 
      href="https://etherscan.io/address/${address}"
      target="_blank" 
      rel="noopener noreferrer"
      class="magic-link">
      ${displayText}
    </a>`;
};

// Async function to resolve ENS name for an address if exists
async function resolveENS(address: string): Promise<string> {
  try {
    const ensName = await provider.lookupAddress(address);
    return ensName || address;
  } catch {
    return address;
  }
}

async function highlightEthAddresses(node: Node): Promise<void> {
  if (node.nodeType && node.nodeType === Node.TEXT_NODE) {
    const textNode = node as Text;
    const text = textNode.textContent || '';
    let match: RegExpExecArray | null;
    const parent = textNode.parentNode;

    if (!parent) return;

    ethRegex.lastIndex = 0;

    let lastIndex = 0;
    const fragment = document.createDocumentFragment();

    // Collect promises for ENS resolutions
    const resolutionPromises: Promise<void>[] = [];

    while ((match = ethRegex.exec(text)) !== null) {
      // Append text before match
      if (match.index > lastIndex) {
        fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
      }

      const address = match[0];

      // Placeholder text node for async ENS resolution result
      const placeholderTextNode = document.createTextNode(address);
      fragment.appendChild(placeholderTextNode);

      // Create async resolution that replaces placeholder node when done
      const resolutionPromise = resolveENS(address).then(displayText => {
        const tempSpan = document.createElement('span');
        tempSpan.innerHTML = generateLink(displayText, address);
        if (placeholderTextNode.parentNode) {
          placeholderTextNode.parentNode.replaceChild(tempSpan, placeholderTextNode);
        }
      });

      resolutionPromises.push(resolutionPromise);

      lastIndex = match.index + address.length;
    }

    // Append text after last match
    if (lastIndex < text.length) {
      fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
    }

    if (fragment.childNodes.length > 0) {
      parent.replaceChild(fragment, textNode);

      // Await all asynchronous ENS resolutions
      await Promise.all(resolutionPromises);
    }
  } else {
    // For non-text nodes, process children recursively
    for (const child of Array.from(node.childNodes)) {
      await highlightEthAddresses(child);
    }
  }
}

document.body && highlightEthAddresses(document.body).catch(console.error);

setTimeout(highlightEthAddresses, 5000);