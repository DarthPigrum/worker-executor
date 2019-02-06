# WorkerPool based on worker_threads that allows executing synchronous functions asynchronously using Workers stored in pool.
## Usage
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
