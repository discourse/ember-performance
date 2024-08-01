import { MicroBenchmark } from 'perf-testing';
import EmberObject from '@ember/object';

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

<template>
  <MicroBenchmark
    @name={{name}}
    @version={{@version}}
    @setup={{setup}}
    @test={{test}}
  />
</template>
