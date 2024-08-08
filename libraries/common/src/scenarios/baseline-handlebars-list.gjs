import { people } from 'common';
import { RenderBenchmark } from 'common';

export const name = 'Baseline: Handlebars List';

<template>
  <RenderBenchmark @name={{name}} @version={{@version}}>
    <table>
      <tbody>
        {{#each people as |person|}}
          <tr>
            <td class="name">{{person.name}}</td>
            <td class="email">{{person.email}}</td>
            <td class="company">{{person.company}}</td>
            <td class="city">{{person.city}}</td>
            <td class="url"><a href={{person.url}}>Link</a></td>
          </tr>
        {{/each}}
      </tbody>
    </table>
  </RenderBenchmark>
</template>
