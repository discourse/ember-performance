/* global MicroTestClient */

let ran;

function assert(assertion, message) {
  if (assert) {
    return;
  }

  throw new Error(message);
}

MicroTestClient.run({
  name: "Ember.run",

  setup: function () {
    this.runloop = require("@ember/runloop");
    ran = false;
  },

  test: function () {
    this.runloop.run(() => {
      this.runloop.schedule("afterRender", function () {
        ran = true;
      });
    });
  },

  teardown: function () {
    assert(ran, "expected the run loop to run");
  },
});
