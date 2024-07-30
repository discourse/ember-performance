/* global RenderTemplateTestClient TestClient */

(function () {
  RenderTemplateTestClient.run({
    name: "Render List with link-to",

    setup: function () {
      this.setupTemplateTest("render-list-link-to", {
        people: TestClient.PEOPLE_JSON,
      });
    },

    reset: function () {
      this.hideComponent();
    },

    test: function () {
      this.showComponent();
    },
  });
})();
