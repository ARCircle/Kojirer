import { defineConfig } from 'tsup';

export default defineConfig({
  target: 'es2020',
  format: ['cjs', 'esm'],
  entry: {
    index: 'src/index.ts', 
    schema: 'src/gen/schema.ts',
  },
  clean: true,
  dts: true,
});
