import Benchmark from 'benchmark';

export function microbench(config) {
  return new Promise(function (resolve) {
    config.on.start();
    config.on.status('Running Micro Benchmark...');

    requestIdleCallback(() => {
      let suite = new Benchmark.Suite();

      suite.add(config.name, config.fn.test, {
        setup: config.fn.setup,
        teardown: config.fn.teardown,
      });

      suite.on('complete', function () {
        config.on.status('Finished');
        config.on.finish();
      });

      suite.on('cycle', function (evt) {
        console.log('running cycle');
        config.fn.reset();

        let r = evt.target;
        resolve({
          name: r.name,
          hz: r.hz,
          rme: r.stats.rme,
          deviation: r.stats.deviation,
          mean: r.stats.mean,
          samples: r.stats.sample.length,
          emberVersion: r.emberVersion,
          createdAt: new Date(),
        });
      });

      suite.on('error', function (evt) {
        let err = evt.target.error;
        config.on.error('Error: ' + err.message);
        throw err;
      });

      suite.run();
    });
  });
}
