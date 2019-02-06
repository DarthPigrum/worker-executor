'use strict';
const { Worker } = require('worker_threads');
module.exports = class WorkerPool {
  constructor(size = 0) {
    this.workers = [];
    this.allowSpawn = false;
    for (let n = 0; n < size; n++) this.workers.push(new Worker('./worker.js'));
  }
  run(fn, ...args) {
    if (this.workers.length === 0 && !this.allowSpawn) {
      const promise = new Promise((resolve, reject) =>
        reject(new Error('Pool size exceeded')));
      return { promise };
    }
    const fromPool = (this.workers.length !== 0);
    const worker = fromPool ? this.workers.pop() : new Worker('./worker.js');
    worker.postMessage([fn.toString(), ...args]);
    let done = false;
    const promise = new Promise((resolve, reject) => {
      worker.on('message', msg => {
        done = true;
        fromPool ? this.workers.push(worker) : worker.terminate();
        msg.error ? reject(msg.error) : resolve(msg.result);
      });
    });
    const cancel = () => {
      if (!done) {
        done = true;
        worker.terminate();
        if (fromPool) this.workers.push(new Worker('./worker.js'));
        return true;
      } else { return false; }
    };
    return { promise, cancel };
  }
};
