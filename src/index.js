import childURL from 'sub-build:./child.js';

const worker = new Worker(childURL);
import('./common').then(({ hello }) => console.log(hello));
