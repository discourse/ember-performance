/* global TestClient */
(function () {
  let compiled;

  let template =
    "<table>" +
    "<tbody>" +
    "{{#each people}}" +
    "<tr>" +
    "<td class='name'>{{name}}</td>" +
    "<td class='email'>{{email}}</td>" +
    "<td class='company'>{{company}}</td>" +
    "<td class='city'>{{city}}</td>" +
    "<td class='url'><a href='{{url}}'>Link</a></td>" +
    "</tr>" +
    "{{/each}}" +
    "</tbody>" +
    "</table>";

  TestClient.run({
    name: "Baseline: Handlebars List",

    setup: function () {
      // eslint-disable-next-line ember/no-global-jquery
      return $.getScript("/ember/handlebars.js").then(function () {
        /* global Handlebars */
        compiled = Handlebars.compile(template);
      });
    },

    reset: function () {
      document.getElementById("scratch").innerHTML = "";
    },

    test: function () {
      document.getElementById("scratch").innerHTML = compiled({
        people: TestClient.PEOPLE_JSON,
      });
    },
  });
})();
