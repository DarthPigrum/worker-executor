'use strict';
const WorkerPool = require('..');
const numberOfThreads = 4;
const threadsInPool = 2;
const DATA = 'test';
const START = '00';
const pool = new WorkerPool(threadsInPool);
pool.allowSpawn = true;
const niceSHA = (data, start, thread, threadAmount) => {
  const crypto = require('crypto');
  let hash = '';
  let nonce = thread;
  for (;!hash.startsWith(start); nonce += threadAmount) {
    hash = crypto.createHash('sha256').update(data + nonce).digest('hex');
  }
  return { hash, nonce: nonce - threadAmount };
};
const findNiceSHA = (data, start, cores) => {
  let canceled = 0;
  let finished = 0;
  const threads = [];
  const promises = [];
  for (let i = 0; i < cores; i++) {
    threads[i] = pool.run(niceSHA, data, start, i, cores);
  }
  const cancelThreads = () => {
    for (const thread of threads) thread.cancel() ? canceled++ : finished++;
  };
  for (const i in threads) promises[i] = threads[i].promise;
  Promise.race(promises).then(res => {
    cancelThreads();
    if (res.hash.startsWith(START)) {
      if (canceled === numberOfThreads - 1 && finished === 1) {
        console.log('Tests passed');
        process.exit(0);
      } else { throw new Error('Cancelation error'); }
    } else { throw new Error('Calculation error'); }
  }).catch(err => { throw new Error(err); });
};
findNiceSHA(DATA, START, numberOfThreads);
