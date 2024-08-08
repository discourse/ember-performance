import { run, schedule } from '@ember/runloop';

import { MicroBenchmark } from 'common';

export const name = 'Ember.run';

async function test() {
  let promise = new Promise((resolve) => {
    // eslint-disable-next-line ember/no-runloop
    run(() => {
      // eslint-disable-next-line ember/no-runloop
      schedule('afterRender', resolve);
    });
  });

  await promise;
}

<template><MicroBenchmark @name={{name}} @test={{test}} /></template>
