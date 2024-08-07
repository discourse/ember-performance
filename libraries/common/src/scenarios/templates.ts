export const templates = {
  'render-list':
    '<table>' +
    '<tbody>' +
    '{{#each @data.people as |p|}}' +
    '<tr>' +
    "<td class='name'>{{p.name}}</td>" +
    "<td class='email'>{{p.email}}</td>" +
    '{{#let p.company as |company|}}' +
    "<td class='company'>{{p.company}}</td>" +
    '{{/let}}' +
    '{{#if p.city}}' +
    "<td class='city'>{{p.city}}</td>" +
    "<td class='url'><a href='{{p.url}}'>Link</a></td>" +
    '{{/if}}' +
    '</tr>' +
    '{{/each}}' +
    '</tbody>' +
    '</table>',

  'render-simple-ember-list':
    '<table>' +
    '<tbody>' +
    '{{#each @data.people as |p|}}' +
    '<tr>' +
    "<td class='name'>{{p.name}}</td>" +
    "<td class='email'>{{p.email}}</td>" +
    '</tr>' +
    '{{/each}}' +
    '</tbody>' +
    '</table>',

  'render-list-link-to':
    '<table>' +
    '<tbody>' +
    '{{#each @data.people as |p|}}' +
    '<tr>' +
    "<td class='name'>{{p.name}}</td>" +
    "<td class='email'>{{p.email}}</td>" +
    "<td class='email'>{{#link-to route='index'}}{{p.name}}{{/link-to}}</td>" +
    '</tr>' +
    '{{/each}}' +
    '</tbody>' +
    '</table>',

  'link-template': "{{#link-to route='index'}}Howdy!{{/link-to}}",

  'render-list-unbound':
    '<table>' +
    '<tbody>' +
    '{{#each @data.people as |p|}}' +
    "<td class='name'>{{unbound p.name}}</td>" +
    "<td class='email'>{{unbound p.email}}</td>" +
    "<td class='company'>{{unbound p.company}}</td>" +
    "<td class='city'>{{unbound p.city}}</td>" +
    "<td class='url'><a href='{{unbound p.url}}'>Link</a></td>" +
    '{{/each}}' +
    '</tbody>' +
    '</table>',

  'complex-list-main':
    '<ul>' +
    '{{#each @data.items as |item|}}' +
    '<li>{{buffer-render data=item.a}} {{buffer-render data=item.b}} {{buffer-render data=item.c}} {{buffer-render data=item.d}}</li>' +
    '<li>{{buffer-render data=item.a}} {{buffer-render data=item.b}} {{buffer-render data=item.c}} {{buffer-render data=item.d}}</li>' +
    '<li>{{component-render a=item.a b=item.b c=item.c d=item.d}}</li>' +
    '<li>{{component-render a=item.a b=item.b c=item.c d=item.d}}</li>' +
    '{{/each}}' +
    '</ul>',

  'complex-list-component':
    'a: {{@a}}' + 'b: {{@b}}' + 'c: {{@c}}' + 'd: {{@d}}' + '{{nested-component a=@a}}',

  'complex-list-nested': 'a: {{@a}}',

  'complex-list-data': '{{@data}}',
};

/**
 * NOTES:
 *   from the original: any -wrapped suffixed template is just the same template withouth the -wrapped sufix, but with an extra wrapping div.
 */
