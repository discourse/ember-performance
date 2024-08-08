/* eslint-disable ember/no-classic-classes */
/* eslint-disable ember/require-tagless-components */
/* eslint-disable ember/no-classic-components */
/* eslint-disable ember/no-computed-properties-in-native-classes */
import Component from '@ember/component';

import { RenderBenchmark } from 'common';

import { people } from '../people.ts';

export const name = 'Render list (@ember/component)';

class List extends Component {
  <template>
    <table>
      <tbody>
        {{#each @data.people as |p|}}
          <tr>
            <td class="name">{{p.name}}</td>
            <td class="email">{{p.email}}</td>
            {{#let p.company as |company|}}
              <td class="company">{{company}}</td>
            {{/let}}
            {{#if p.city}}
              <td class="city">{{p.city}}</td>
              <td class="url"><a href="{{p.url}}">Link</a></td>
            {{/if}}
          </tr>
        {{/each}}
      </tbody>
    </table>
  </template>
}

const data = { people };

<template>
  <RenderBenchmark @name={{name}} @version={{@version}}>
    <List @data={{data}} />
  </RenderBenchmark>
</template>
