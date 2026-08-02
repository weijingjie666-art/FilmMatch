import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';

const root = new URL('./', import.meta.url);
const dist = new URL('./dist/', root);

await rm(dist, { recursive: true, force: true });
await mkdir(new URL('./server/', dist), { recursive: true });
await mkdir(new URL('./.openai/', dist), { recursive: true });
await cp(new URL('./index.html', root), new URL('./index.html', dist));
await cp(new URL('./src/', root), new URL('./src/', dist), { recursive: true });
await cp(new URL('./.openai/hosting.json', root), new URL('./.openai/hosting.json', dist));

const assetPaths = [
  'index.html',
  'src/main.js',
  'src/styles.css',
  'src/overrides.css',
  'src/image-layout.css',
  'src/data/cameras.js',
  'src/data/all-cameras.js',
  'src/data/camera-expansion.js',
  'src/data/camera-expansion-2.js',
  'src/data/camera-expansion-3.js',
  'src/data/camera-expansion-4.js',
  'src/data/knowledge-base.js',
  'src/data/film-library.js',
  'src/data/film-prices.js',
  'src/data/camera-images.js',
];
const filmLibrarySource = await readFile(new URL('./src/data/film-library.js', root), 'utf8');
const assets = Object.fromEntries(
  await Promise.all(
    assetPaths.map(async (assetPath) => {
      let content = await readFile(new URL(`./${assetPath}`, root), 'utf8');
      if (assetPath === 'src/data/knowledge-base.js') {
        content = content.replace(
          "import { FILM_LIBRARY_ROWS } from './film-library.js';",
          `${filmLibrarySource}\n`,
        );
      }
      return [`/${assetPath}`, content];
    }),
  ),
);

const worker = `// FilmMatch hosted bundle: data modules are embedded for reliable static delivery.\nconst assets = ${JSON.stringify(assets)};
const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
};

const worker = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname === '/' ? '/index.html' : url.pathname;
    const body = assets[pathname];
    if (body === undefined) return new Response('Not Found', { status: 404 });

    const extension = pathname.slice(pathname.lastIndexOf('.'));
    return new Response(body, {
      headers: {
        'cache-control': pathname === '/index.html' ? 'no-cache' : 'public, max-age=3600',
        'content-type': contentTypes[extension] || 'text/plain; charset=utf-8',
      },
    });
  },
};

export default worker;
`;

await writeFile(new URL('./server/index.js', dist), worker, 'utf8');
console.log('FilmMatch static deployment bundle created in dist/.');
