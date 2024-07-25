/* global RenderTemplateTestClient */

(function () {
  RenderTemplateTestClient.run({
    name: "Render Complex List (Glimmer) - 10000 items",

    setup() {
      const EmberObject = require("@ember/object").default;
      const computed = require("@ember/object").computed;
      const A = require("@ember/array").A;

      const MyThing = EmberObject.extend({
        d: computed("a", "b", function () {
          return this.get("a") + this.get("b");
        }),
      });

      let listItems = A([]);
      for (let i = 0; i < 10000; i++) {
        listItems.pushObject(
          MyThing.create({
            a: "a" + i,
            b: "b" + i,
            c: "c" + i,
          }),
        );
      }

      this.setupTemplateTest(
        "complex-list-main-wrapped",
        { items: listItems },
        { componentMode: "glimmer" },
      );

      this.registry.register(
        "template:components/component-render",
        this.template("complex-list-component-wrapped"),
      );
      this.registry.register(
        "template:components/nested-component",
        this.template("complex-list-nested-wrapped"),
      );
      this.registry.register(
        "template:components/buffer-render",
        this.template("complex-list-data-wrapped"),
      );

      const GlimmerComponent = require("@glimmer/component").default;
      this.registry.register(
        "component:component-render",
        class extends GlimmerComponent {},
      );
      this.registry.register(
        "component:nested-component",
        class extends GlimmerComponent {},
      );
      this.registry.register(
        "component:buffer-render",
        class extends GlimmerComponent {},
      );
    },

    reset() {
      this.hideComponent();
    },

    test() {
      this.showComponent();
    },
  });
})();
