function testPlugin() {
  return {
    name: 'tmp-name',
    async resolveId(id, importer) {
      if (id.startsWith('sub-build:')) {
        const newId = await this.resolveId(id.slice('sub-build:'.length), importer);
        return 'sub-build:' + newId;
      }
      return null;
    },
    load(id) {
      if (!id.startsWith('sub-build:')) return null;
      const input = id.slice('sub-build:'.length);
      return `export default import(${JSON.stringify(input)}); // BWAHAHAH TOP HACKS`;
    },
    renderChunk(code) {
      const re = /import\((.*)\); \/\/ BWAHAHAH TOP HACKS/g;
      return code.replace(re, '$1;');
    }
  }
}

const esm = {
  plugins: [testPlugin()],
  input: 'src/index.js',
  output: {
    dir: 'build/',
    format: 'esm',
    entryFileNames: '[name]-[hash].js',
  },
};

export default [esm];
