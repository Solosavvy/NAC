# NAC Choir (scaffold)

This branch contains a minimal scaffold for the NAC Choir offline-first hymn streaming app.

To run locally:

1. npm install
2. npm run dev

What's included:
- Vite + React + TypeScript scaffold
- Tailwind CSS config and global styles
- Minimal components: Header, SearchBar, SongList, Player
- services/audioEngine.ts (singleton stub)
- lib/indexJsonLoader.ts parser
- public/index.json sample and manifest.json

Next steps (recommendations):
- Implement data loader to fetch /index.json and wire up SongList
- Implement AudioEngine features (IndexedDB caching, preloading, playback modes)
- Add PWA service worker and icons
- Flesh out UI components and category filters

