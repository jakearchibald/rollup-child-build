import childURL from 'sub-build:./child.js';

const worker = new Worker(childURL);
