import { defineManifest } from '@crxjs/vite-plugin';

export default defineManifest({
  name: 'Avokado for Twitter',
  description:
    'Enhance your Twitter experience by seamlessly integrating emoji reactions directly into your Twitter timeline.',
  version: '0.0.2',
  manifest_version: 3,
  icons: {
    '16': 'img/logo-16.png',
    '32': 'img/logo-34.png',
    '48': 'img/logo-48.png',
    '128': 'img/logo-128.png',
  },
  action: {
    default_popup: 'popup.html',
    default_icon: 'img/logo-48.png',
  },
  background: {
    service_worker: 'src/background/index.ts',
    type: 'module',
  },
  content_scripts: [
    {
      matches: ['https://twitter.com/*'],
      js: ['src/content/index.ts'],
      run_at: 'document_start',
      all_frames: true,
    },
  ],
  web_accessible_resources: [
    {
      resources: ['img/logo-16.png', 'img/logo-34.png', 'img/logo-48.png', 'img/logo-128.png'],
      matches: [],
    },
  ],
  permissions: ['storage'],
});
