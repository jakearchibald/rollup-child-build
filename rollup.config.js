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
      return `export default import(${JSON.stringify(input)}); // TROLOLOLOLOL fix this`;
    },
    renderChunk(code) {
      const re = /import\((.*)\); \/\/ TROLOLOLOLOL fix this/g
      return code.replace(re, '$1');
    }
  }
}

const esm = {
  plugins: [testPlugin()],
  input: 'src/index.js',
  output: {
    dir: 'build/',
    format: 'esm'
  },
};

export default [esm];
