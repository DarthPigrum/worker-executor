'use strict';
const worker = require('worker_threads');
const vm = require('vm');
const context = { require };
worker.parentPort.on('message', msg => {
  try {
    const args = msg;
    const script = vm.createScript(args.shift());
    const fn = script.runInNewContext(context);
    const result = fn(...args);
    worker.parentPort.postMessage({ result });
  } catch (error) {
    worker.parentPort.postMessage({ error });
  }
});
