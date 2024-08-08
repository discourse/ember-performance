/* eslint-disable ember/no-classic-classes */
/* eslint-disable ember/no-empty-glimmer-component-classes */
/* eslint-disable ember/require-tagless-components */
/* eslint-disable ember/no-classic-components */
/* eslint-disable ember/no-computed-properties-in-native-classes */
import { A } from '@ember/array';
import EmberObject, { computed } from '@ember/object';

import { RenderBenchmark } from 'common';

export const name = 'Render complex html (template-only)';

const BufferRender = <template>{{@data}}</template>;
const NestedComponent = <template>a: {{@a}}</template>;

const ComponentRender = <template>
  a:
  {{@a}}
  b:
  {{@b}}
  c:
  {{@c}}
  d:
  {{@d}}
  <NestedComponent @a={{@a}} />
</template>;

const MyThing = EmberObject.extend({
  d: computed('a', 'b', function () {
    return this.a + this.b;
  }),
});

let listItems = A([]);

for (let i = 0; i < 50; i++) {
  listItems.pushObject(
    MyThing.create({
      a: 'a' + i,
      b: 'b' + i,
      c: 'c' + i,
    })
  );
}

const data = { items: listItems };

const ComplexListMain = <template>
  <div>
    <ul>
      {{#each @data.items as |item|}}
        <li>
          <BufferRender @data={{item.a}} />
          <BufferRender @data={{item.b}} />
          <BufferRender @data={{item.c}} />
          <BufferRender @data={{item.d}} />
        </li>
        <li>
          <BufferRender @data={{item.a}} />
          <BufferRender @data={{item.b}} />
          <BufferRender @data={{item.c}} />
          <BufferRender @data={{item.d}} />
        </li>
        <li>
          <ComponentRender @a={{item.a}} @b={{item.b}} @c={{item.c}} @d={{item.d}} />
        </li>
        <li>
          <ComponentRender @a={{item.a}} @b={{item.b}} @c={{item.c}} @d={{item.d}} />
        </li>
      {{/each}}
    </ul>
  </div>
</template>;

<template>
  <RenderBenchmark @name={{name}} @version={{@version}}>
    <ComplexListMain @data={{data}} />
  </RenderBenchmark>
</template>
