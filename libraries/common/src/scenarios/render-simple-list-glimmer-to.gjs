/* eslint-disable ember/no-classic-classes */
/* eslint-disable ember/no-empty-glimmer-component-classes */
/* eslint-disable ember/require-tagless-components */
/* eslint-disable ember/no-classic-components */
/* eslint-disable ember/no-computed-properties-in-native-classes */

import { RenderBenchmark } from 'common';

import { people } from '../people.ts';

export const name = 'Render simple list (template-only)';

const SimpleList = <template>
  <table>
    <tbody>
      {{#each @data.people as |p|}}
        <tr>
          <td class="name">{{p.name}}</td>
          <td class="email">{{p.email}}</td>
        </tr>
      {{/each}}
    </tbody>
  </table>
</template>;

const data = { people };

<template>
  <RenderBenchmark @name={{name}} @version={{@version}}>
    <SimpleList @data={{data}} />
  </RenderBenchmark>
</template>
