import { people } from 'perf-testing';

export const name = 'Baseline: List via {{{ rawHTML }}}';

function makeHTML() {
  let html = '<table></tbody>';

  people.forEach((p) => {
    html +=
      '<tr>' +
      `<td class='name'>${p.name}</td>` +
      `<td class='email'>${p.email}</td>` +
      `<td class='company'>${p.company}</td>` +
      `<td class='city'>"${p.city}</td>` +
      `<td class='url'><a href='${p.url}'>Link</a></td>` +
      '</tr>';
  });

  html += '</tbody></table>';

  return html;
}

<template>{{{(makeHTML)}}}</template>
