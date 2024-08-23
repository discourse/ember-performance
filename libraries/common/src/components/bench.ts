import { resource } from 'ember-resources';
import { Bench } from 'tinybench';

export type Options = {
  name: string;
  test: () => unknown;
} & Omit<ConstructorParameters<typeof Bench>, 'signal'>;

/**
 * One-off Bench.
 * In this whole suite of code in this monorepo, we don't directly compare bench results
 * in the same TinyBench run.
 * We have to load separate apps to get the results for each app and each app will load TinyBench,
 * and run its one test, and save those results to local storage for the host app to load and compare.
 */
export function OneOffTinyBench(
  optionsFn: () => { options: Options; updateStatus: (msg: string) => void }
) {
  return resource(({ on, owner }) => {
    let opts = optionsFn();
    let { name, test, ...options } = opts.options;

    let abortController = new AbortController();

    /**
     * QPs Must be configured in the application route
     */
    let router = owner.lookup('service:router');
    let queryParams = router.currentRoute?.queryParams ?? {};
    let { timePerTest } = queryParams;
    let time = timePerTest ? parseInt(timePerTest) : 1_000;

    let benchOptions = {
      ...options,
      time,
      signal: abortController.signal,
    };

    console.debug(`Options for ${name}: `, { options: benchOptions, queryParams });

    let bench = new Bench(benchOptions);

    on.cleanup(() => abortController.abort());

    bench.add(name, test, {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      beforeEach: options.beforeEach,
    });

    bench.addEventListener('abort', () => {
      opts.updateStatus('Benchmark aborted.');
    });

    bench.addEventListener('warmup', () => {
      opts.updateStatus('Warming up...');
    });

    bench.addEventListener('start', () => {
      opts.updateStatus('Running...');
    });

    bench.addEventListener('error', (error) => {
      opts.updateStatus(`Error! ${error.message}`);
    });

    bench.addEventListener('complete', () => {
      opts.updateStatus('Done!');
    });

    return bench;
  });
}
