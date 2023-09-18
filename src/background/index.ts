const key = 'STORE_KEY_V2';

function getStore() {
  return chrome.storage.local.get(key);
}

const listeners: Record<number, chrome.runtime.Port> = {};

async function handleConnections() {
  chrome.runtime.onConnect.addListener(async (port) => {
    if (port.name === 'avokado') {
      console.log('avokado connected');
      port.postMessage({ store: (await getStore())?.[key] || {} });

      (port as any).id = Math.random().toString();

      listeners[(port as any).id] = port;

      port.onDisconnect.addListener(() => {
        delete listeners[(port as any).id];
      });
    }

    if (port.name === 'popup') {
      port.postMessage({ store: (await getStore())?.[key] || {} });

      port.onMessage.addListener((msg) => {
        if (msg.type === 'setStore') {
          chrome.storage.local.set({ [key]: msg.store });
          Object.values(listeners).forEach((listener) => {
            listener.postMessage({ store: msg.store });
          });
        }
      });
    }
  });
}

handleConnections();
export {};
