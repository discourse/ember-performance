/* global MicroTestClient */
let obj;

MicroTestClient.run({
  name: "Ember.get",

  setup: function () {
    const EmberObject = require("@ember/object").default;

    obj = EmberObject.create({
      thingId: 1234,
      person: EmberObject.create({
        name: "Evil Trout",
        pet: EmberObject.create({
          name: "Rover",
        }),
      }),
    });
  },

  test: function () {
    obj.get("thingId");
    obj.get("person.name");
    obj.get("person.pet.name");
  },
});
