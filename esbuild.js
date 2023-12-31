import * as esbuild from 'esbuild'

await esbuild.build({
  entryPoints: ['src/index.ts'],
  format: 'esm',
  target: 'es2020',
  sourcemap: true,
  minify: true,
  bundle: true,
  outfile: 'dist/index.es2020.js',
})

await esbuild.build({
  entryPoints: ['src/index.ts'],
  format: 'iife',
  target: ['chrome120','firefox120','edge120', 'safari17'],
  sourcemap: true,
  minify: true,
  bundle: true,
  outfile: 'dist/index.iife.js',
})