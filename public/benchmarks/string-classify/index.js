/* global MicroTestClient */

const stringArray = [];

(function () {
  MicroTestClient.run({
    name: "String Classify",

    setup: function () {
      this.EmberString = require("@ember/string");

      function createRandomWord(length) {
        const consonants = "bcdfghjklmnpqrstvwxyz".split(""),
          vowels = "aeiou".split(""),
          rand = function (limit) {
            return Math.floor(Math.random() * limit);
          };
        let word = "";

        length = parseInt(length, 10);

        for (let i = 0; i < length / 2; i++) {
          let randConsonant = consonants[rand(consonants.length)],
            randVowel = vowels[rand(vowels.length)];
          word += i === 0 ? randConsonant.toUpperCase() : randConsonant;
          word += i * 2 < length - 1 ? randVowel : "";
        }
        return word;
      }

      for (let i = 0; i < 1000; i++) {
        stringArray.push(createRandomWord(5));
      }
    },

    test: function () {
      stringArray.forEach((string) => {
        // eslint-disable-next-line ember/no-string-prototype-extensions
        this.EmberString.classify(string);
      });
    },
  });
})();
