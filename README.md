# Fusic JSON

Fusic JSON is a private, local-first JSON formatter and multi-document workspace. JSON is processed in your browser and saved in IndexedDB; there is no account, server, analytics, or cloud sync.

## Development

```bash
npm install
npm run dev
```

Useful commands: `npm run test`, `npm run build`, and `npm run preview`.

## Deployment

This is a static Vite app and can be deployed to Vercel with the default Vite preset. Build command: `npm run build`; output directory: `dist`. No environment variables are required.

## Privacy

Documents never leave the browser. A URL containing `?doc=` only identifies a document already stored in the same browser profile; it is not a share link.
