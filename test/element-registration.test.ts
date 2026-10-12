import assert from 'node:assert/strict';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
import { resolve } from 'node:path';
import { build } from 'esbuild';

test('bundled element-only imports retain Web Component registration', async () => {
  const registered = new Map<string, unknown>();
  const bundle = await build({
    stdin: { contents: "import './src/element.ts';", resolveDir: resolve('.'), loader: 'ts' },
    bundle: true, write: false, format: 'iife', platform: 'browser', target: 'es2020',
    minify: true, define: { 'process.env.NODE_ENV': '"production"' },
  });
  runInNewContext(bundle.outputFiles[0].text, {
    HTMLElement: class {}, setTimeout, clearTimeout, console,
    customElements: { get: (name: string) => registered.get(name), define: (name: string, constructor: unknown) => registered.set(name, constructor) },
  });
  assert.equal(typeof registered.get('dr-map'), 'function');
});
