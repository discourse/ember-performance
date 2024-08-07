/* eslint-disable ember/no-classic-classes */
/* eslint-disable ember/require-tagless-components */
/* eslint-disable ember/no-classic-components */
/* eslint-disable ember/no-computed-properties-in-native-classes */

import { RenderBenchmark } from 'common';

import { people } from '../people.ts';

export const name = 'Render list (template-only)';

const List = <template>
  <div>
    <table>
      <tbody>
        {{#each @data.people as |p|}}
          <tr>
            <td class="name">{{unbound p.name}}</td>
            <td class="email">{{unbound p.email}}</td>
            <td class="company">{{unbound p.company}}</td>
            <td class="city">{{unbound p.city}}</td>
            <td class="url"><a href="{{unbound p.url}}">Link</a></td>
          </tr>
        {{/each}}
      </tbody>
    </table>
  </div>
</template>;

const data = { people };

<template>
  <RenderBenchmark @name={{name}} @version={{@version}}>
    <List @data={{data}} />
  </RenderBenchmark>
</template>
