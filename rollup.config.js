import { resolve, dirname } from 'path';
import { rollup } from 'rollup';

let cachedOptions;

function testPlugin() {
  return {
    name: 'tmp-name',
    options(o) {
      cachedOptions = cachedOptions || o;
      return null;
    },
    resolveId(id, importer) {
      if (id.startsWith('sub-build:')) {
        const newId = resolve(dirname(importer), id.slice('sub-build:'.length));
        console.log(importer, id.slice('sub-build:'.length), newId);
        return 'sub-build:' + newId;
      }
      return null;
    },
    async load(id) {
      if (!id.startsWith('sub-build:')) return null;
      const input = id.slice('sub-build:'.length);
      const opts = { ...cachedOptions, input };
      const bundle = await rollup(opts);
      const { output } = await bundle.generate({ format: 'esm' });

      let assetId;

      for (const chunkOrAsset of output) {
        assetId = this.emitAsset(chunkOrAsset.fileName, chunkOrAsset.source || chunkOrAsset.code);
      }

      return `export default import.meta.ROLLUP_ASSET_URL_${assetId}`;
    }
  }
}

const esm = {
  plugins: [testPlugin()],
  input: 'src/index.js',
  output: {
    file: 'build/index.mjs',
    format: 'esm'
  },
};

export default [esm];
