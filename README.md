## WorkerPool based on worker_threads that allows executing synchronous functions asynchronously using Workers stored in pool
[![Build Status](https://travis-ci.org/DarthPigrum/worker-executor.svg?branch=master)](https://travis-ci.org/DarthPigrum/worker-executor)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/77ced1d9e53b482286b86f29039d160f)](https://www.codacy.com/app/DarthPigrum/worker-executor?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=DarthPigrum/worker-executor&amp;utm_campaign=Badge_Grade)
[![npm version](https://badge.fury.io/js/worker-executor.svg)](https://badge.fury.io/js/worker-executor)
### Usage
```javascript
const WorkerPool = require('worker-executor');
const hardFunction = (n) => {
  const somelib = require('somelib'); //require should be inside the function
  //do some calculations
  return `Result of calculations #${n}`;
};
const pool = new WorkerPool(4);
const emptyPool = new WorkerPool();
emptyPool.allowSpawn = true; //set this flag if you want to allow spawning additional forks
const task1 = pool.run(hardFunction, 1);
const task2 = emptyPool.run(hardFunction, 2);
task1.promise.then(console.log);
task2.promise.then(console.log);

```
