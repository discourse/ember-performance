import EmberObject from '@ember/object';

import { MicroBenchmark } from 'common';

export const name = 'Ember.set (primed)';

// This test is for perf of *get*, and doesn't
// care about leaking data in module-space
let obj;

function setup() {
  obj = EmberObject.create({
    person: EmberObject.create({
      pet: EmberObject.create({}),
    }),
  });

  obj.set('thingId', 1234);
  obj.set('person.name', 'Robin');
  obj.set('person.pet.name', 'Nibbler');
}

function test() {
  obj.set('thingId', 1234);
  obj.set('person.name', 'Robin');
  obj.set('person.pet.name', 'Nibbler');
}

<template>
  <MicroBenchmark @name={{name}} @version={{@version}} @setup={{setup}} @test={{test}} />
</template>
