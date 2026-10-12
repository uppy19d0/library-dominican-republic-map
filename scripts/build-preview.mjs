import { build } from 'esbuild';
import { copyFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
const output = resolve('docs/demo/assets');
await mkdir(output, { recursive: true });
await build({
  stdin: { contents: "import './src/element.ts'; export * from './src/geodata.ts';", resolveDir: process.cwd(), loader: 'ts' },
  outfile: resolve(output, 'runtime.js'), bundle: true, format: 'esm', platform: 'browser', target: 'es2020', minify: true,
  define: { 'process.env.NODE_ENV': '"production"' },
});
await copyFile('dist/styles.css', resolve(output, 'styles.css'));
console.log('Built self-hosted preview runtime from locked dependencies.');
