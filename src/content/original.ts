import './styles.css';

import twemoji from 'twemoji';
import { style, svg } from './css';

const emojis = ['❤️', '🔥', '👏', '⭐', '😠', '🥑'];

(window as any).AVOKADO_autoSend = false;

function generateEmoji(node: Node, emoji: string, replyNode: any) {
  var div = document.createElement('div');
  div.textContent = emoji;
  node.appendChild(div);
  div.classList.add('emoji-container');
  twemoji.parse(div, { className: 'emojiMax' });

  div.onclick = (event) => {
    event.stopPropagation();
    console.log('clicked emoji');
    replyNode.click();
    setTimeout(() => {
      document.execCommand('insertText', false, emoji);
      const tweetButton = document.querySelector('[data-testid="tweetButton"]');

      if (tweetButton) {
        (tweetButton as any).focus();

        if ((window as any).AVOKADO_autoSend) {
          (tweetButton as any).click();
        }
      }
    }, 200);
  };
}

function insertEmojiButton(tweetNode: any) {
  // Check if already added avokado
  const avokadoAttribute = tweetNode.getAttribute('avokado');

  if (avokadoAttribute) {
    return;
  }

  // Add style to dom

  // Create the button element
  const button = tweetNode.cloneNode(true);
  button.id = 'emoji-button';

  const overButton = button.querySelectorAll('div')[2];

  const buttonTexts = button.children[0].querySelectorAll('div');

  if (buttonTexts.length > 2) {
    button.children[0].querySelectorAll('div')[2].remove();
  }

  const classBackup = button.children[0].querySelector('svg').getAttribute('class');
  button.children[0].querySelector('svg').innerHTML = svg;
  button.children[0].querySelector('svg').setAttribute('class', classBackup);

  // Add tooltip
  const tooltip = document.createElement('div');
  tooltip.classList.add('tooltip');

  let closeTimeout: NodeJS.Timeout | null = null;
  let opened = false;
  const duration = 300;

  function hide() {
    tooltip.classList.remove('show-tooltip');
    closeTimeout = null;
    opened = false;

    overButton.style.backgroundColor = 'transparent';
    button.children[0].querySelector('svg').style.color = '';
  }

  function resetTimeout() {
    clearTimeout(closeTimeout!);
    closeTimeout = null;
  }

  tooltip.onmouseover = resetTimeout;

  tooltip.onmouseout = () => {
    closeTimeout = setTimeout(hide, duration);
  };

  button.onmouseover = () => {
    if (opened) {
      resetTimeout();
      return;
    }

    opened = true;

    tooltip.innerHTML = '';
    tooltip.classList.add('show-tooltip');

    emojis.forEach((emoji) => {
      generateEmoji(tooltip, emoji, tweetNode);
    });

    overButton.style.backgroundColor = 'rgba(29, 155, 240, 0.1)';
    button.children[0].querySelector('svg').style.color = 'rgb(29, 155, 240)';

    const separator = document.createElement('div');
    separator.classList.add('separator');
    //tooltip.appendChild(separator);

    const thumbUpDiv = document.createElement('div');
    thumbUpDiv.classList.add('emoji-container');
    thumbUpDiv.classList.add('thumb');

    thumbUpDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="rgb(83, 100, 113)" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M7 11v8a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-7a1 1 0 0 1 1 -1h3a4 4 0 0 0 4 -4v-1a2 2 0 0 1 4 0v5h3a2 2 0 0 1 2 2l-1 5a2 3 0 0 1 -2 2h-7a3 3 0 0 1 -3 -3"></path>
 </svg>`;

    //tooltip.appendChild(thumbUpDiv);

    const thumbDownDiv = document.createElement('div');
    thumbDownDiv.classList.add('emoji-container');
    thumbDownDiv.classList.add('thumb');

    thumbDownDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="rgb(83, 100, 113)" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M7 13v-8a1 1 0 0 0 -1 -1h-2a1 1 0 0 0 -1 1v7a1 1 0 0 0 1 1h3a4 4 0 0 1 4 4v1a2 2 0 0 0 4 0v-5h3a2 2 0 0 0 2 -2l-1 -5a2 3 0 0 0 -2 -2h-7a3 3 0 0 0 -3 3"></path>
 </svg>`;

    //tooltip.appendChild(thumbDownDiv);
  };

  button.onmouseout = () => {
    closeTimeout = setTimeout(hide, duration);
  };

  tweetNode.setAttribute('avokado', 'true');

  tweetNode.parentNode.parentNode.appendChild(tooltip);
  tweetNode.parentNode.parentNode.insertBefore(button, tweetNode.parentNode);
}

function handleMutation(mutation: MutationRecord) {
  if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
    mutation.addedNodes.forEach((node: Node) => {
      const selector = (node as HTMLElement)?.querySelector('[data-testid="reply"]');
      if (selector) {
        setTimeout(() => insertEmojiButton(selector), 200);
      }
    });
  }
}

function boot() {
  const ob = new MutationObserver((mutations: MutationRecord[]) =>
    mutations.forEach(handleMutation),
  );

  const config = { childList: true, subtree: true };
  ob.observe(document.body, config);
}

function attachStyles() {
  const styleElement = document.createElement('style');
  styleElement.innerHTML = style;
  document.head.appendChild(styleElement);
}

function connect() {
  const port = chrome.runtime.connect({ name: 'avokado' });

  port.onMessage.addListener((msg) => {
    (window as any).AVOKADO_autoSend = msg.store.autoSend;
  });
}

connect();
attachStyles();
boot();
