import { people } from 'perf-testing';

export const name = 'Baseline: Handlebars List';

<template>
  <table>
    <tbody>
      {{#each people as |person|}}
        <tr>
          <td class='name'>{{person.name}}</td>
          <td class='email'>{{person.email}}</td>
          <td class='company'>{{person.company}}</td>
          <td class='city'>{{person.city}}</td>
          <td class='url'><a href={{person.url}}>Link</a></td>
        </tr>
      {{/each}}
    </tbody>
  </table>
</template>
