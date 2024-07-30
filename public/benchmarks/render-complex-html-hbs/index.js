/* global TestClient */

(function () {
  let templates = {
    "complex-list-main":
      "<div>" +
      "<ul>" +
      "{{#each items}}" +
      "<li>{{{raw 'complex-list-data' data=a}}} {{{raw 'complex-list-data' data=b}}} {{{raw 'complex-list-data' data=c}}} {{{raw 'complex-list-data' data=d}}}</li>" +
      "<li>{{{raw 'complex-list-data' data=a}}} {{{raw 'complex-list-data' data=b}}} {{{raw 'complex-list-data' data=c}}} {{{raw 'complex-list-data' data=d}}}</li>" +
      "<li>{{{raw 'complex-list-component' a=a b=b c=c d=d}}}</li>" +
      "<li>{{{raw 'complex-list-component' a=a b=b c=c d=d}}}</li>" +
      "{{/each}}" +
      "</ul>" +
      "</div>",

    "complex-list-component":
      "<div>" +
      "a: {{a}}" +
      "b: {{b}}" +
      "c: {{c}}" +
      "d: {{d}}" +
      "{{{raw 'complex-list-nested' a=a}}}" +
      "</div>",

    "complex-list-nested": "<div>a: {{a}}</div>",

    "complex-list-data": "<div>{{data}}</div>",
  };

  let compiledTemplates = {};

  let listItems;

  TestClient.run({
    name: "Render Complex List (Raw HBS)",

    setup: function () {
      const EmberObject = require("@ember/object").default;
      const computed = require("@ember/object").computed;
      const A = require("@ember/array").A;

      const MyThing = EmberObject.extend({
        d: computed("a", "b", function () {
          return this.get("a") + this.get("b");
        }),
      });

      listItems = A([]);

      for (let i = 0; i < 50; i++) {
        listItems.pushObject(
          MyThing.create({
            a: "a" + i,
            b: "b" + i,
            c: "c" + i,
          }),
        );
      }

      // eslint-disable-next-line ember/no-global-jquery
      return $.getScript("/ember/handlebars.js").then(function () {
        /* global Handlebars */
        Handlebars.registerHelper("raw", function (templateName, helper) {
          return compiledTemplates[templateName](helper.hash);
        });

        Object.keys(templates).forEach((templateName) => {
          compiledTemplates[templateName] = Handlebars.compile(
            templates[templateName],
          );
        });
      });
    },

    reset: function () {
      document.getElementById("scratch").innerHTML = "";
    },

    test: function () {
      document.getElementById("scratch").innerHTML = compiledTemplates[
        "complex-list-main"
      ]({
        items: listItems,
      });
    },
  });
})();
