import EmberObject from '@ember/object';

import { MicroBenchmark } from 'common';

export const name = 'Ember.get';

// This test is for perf of *get*, and doesn't
// care about leaking data in module-space
let obj;

function setup() {
  obj = EmberObject.create({
    thingId: 1234,
    person: EmberObject.create({
      name: 'Evil Trout',
      pet: EmberObject.create({
        name: 'Rover',
      }),
    }),
  });
}

function test() {
  obj.get('thingId');
  obj.get('person.name');
  obj.get('person.pet.name');
}

<template><MicroBenchmark @name={{name}} @setup={{setup}} @test={{test}} /></template>
