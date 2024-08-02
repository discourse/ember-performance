(function () {
  let STORAGE_KEY = "ember-performance-session";

  // A TestItem represents a test we want to perform
  let TestItem = function () {};

  TestItem.build = function (testGroup, test) {
    let testItem = new TestItem();
    testItem.testGroup = testGroup;
    testItem.test = test;
    return testItem;
  };

  TestItem.prototype.serialize = function () {
    return {
      test: this.test,
      result: this.result,
    };
  };

  TestItem.deserialize = function (testGroup, data) {
    let testItem = new TestItem();
    testItem.testGroup = testGroup;
    testItem.test = data.test;
    testItem.result = data.result;
    return testItem;
  };

  //A TestGroup represents a group of tests for a particular Ember version
  let TestGroup = function () {
    this.testItems = [];
    this.currentTestItemIndex = 0;
    this.compiledTemplates = {};
  };

  TestGroup.build = function (session, emberVersion, tests) {
    let testGroup = new TestGroup();
    testGroup.session = session;
    testGroup.emberVersion = emberVersion;

    tests.forEach(function (test) {
      testGroup.testItems.push(TestItem.build(testGroup, test));
    });

    return testGroup;
  };

  TestGroup.prototype.requiresTemplateCompilation = function () {
    return Object.keys(this.compiledTemplates).length === 0;
  };

  TestGroup.prototype.currentTestItem = function () {
    return this.testItems[this.currentTestItemIndex];
  };

  TestGroup.prototype.remainingTestCount = function () {
    return this.testItems.length - this.currentTestItemIndex;
  };

  TestGroup.prototype.isComplete = function () {
    return this.remainingTestCount() === 0;
  };

  TestGroup.prototype.progress = function () {
    this.currentTestItemIndex++;
  };

  TestGroup.prototype.getReport = function () {
    let results = [];
    this.testItems.forEach(function (testItem) {
      if (testItem.result) {
        results.push(testItem.result);
      }
    });
    return {
      id: this.id,
      emberVersion: this.emberVersion,
      results,
    };
  };

  TestGroup.prototype.serialize = function () {
    return {
      id: this.id || TestGroup.generateUUID(),
      emberVersion: this.emberVersion,
      currentTestItemIndex: this.currentTestItemIndex,
      testItems: this.testItems.map(function (testItem) {
        return testItem.serialize();
      }),
      compiledTemplates: this.compiledTemplates,
    };
  };

  TestGroup.deserialize = function (session, data) {
    let self = this;
    let testGroup = new TestGroup();
    testGroup.id = data.id;
    testGroup.session = session;
    testGroup.emberVersion = data.emberVersion;
    testGroup.currentTestItemIndex = data.currentTestItemIndex;
    testGroup.testItems = data.testItems.map(function (testItemData) {
      return TestItem.deserialize(self, testItemData);
    });

    testGroup.compiledTemplates = data.compiledTemplates;
    return testGroup;
  };

  TestGroup.generateUUID = function () {
    // thanks http://stackoverflow.com/a/873856
    let s = [];
    let hexDigits = "0123456789abcdef";
    for (let i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    // eslint-disable-next-line no-bitwise
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    return s.join("");
  };

  // A TestSession is the way we can perist the work we need to do between browser reloads
  let TestSession = (window.TestSession = function () {
    this.testGroups = [];
    this.currentTestGroupIndex = 0;
    this.enableProfile = false;
  });

  TestSession.prototype.serialize = function () {
    let result = {
      featureFlags: JSON.stringify(this.featureFlags),
      testGroups: this.testGroups.map(function (testGroup) {
        return testGroup.serialize();
      }),
      currentTestGroupIndex: this.currentTestGroupIndex,
      enableProfile: this.enableProfile,
    };

    return result;
  };

  TestSession.deserialize = function (data) {
    let testSession = new TestSession();
    testSession.featureFlags = JSON.parse(data.featureFlags);

    if (data.testGroups) {
      let self = this;
      data.testGroups.forEach(function (testGroupData) {
        testSession.testGroups.push(TestGroup.deserialize(self, testGroupData));
      });
    }

    testSession.currentTestGroupIndex = data.currentTestGroupIndex;
    testSession.enableProfile = data.enableProfile;
    return testSession;
  };

  TestSession.persist = function (session) {
    let toStore = JSON.stringify(session.serialize());
    localStorage.setItem(STORAGE_KEY, toStore);
  };

  TestSession.recover = function () {
    let toRestore = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!toRestore) {
      return;
    }

    return TestSession.deserialize(toRestore);
  };

  TestSession.prototype.getReport = function () {
    let report = {
      id: this.id,
      featureFlags: this.featureFlags,
    };
    report.testGroupReports = this.testGroups.map(function (testGroup) {
      return testGroup.getReport();
    });
    return report;
  };

  TestSession.prototype.setup = function (emberVersions, tests) {
    let self = this;
    this.testGroups = [];
    emberVersions.forEach(function (emberVersion) {
      self.testGroups.push(TestGroup.build(self, emberVersion, tests));
    });
  };

  TestSession.prototype.progress = function () {
    let testGroup = this.currentTestGroup();
    testGroup.progress();

    if (testGroup.isComplete()) {
      this.currentTestGroupIndex++;
    }

    this.save();
  };

  TestSession.prototype.save = function () {
    TestSession.persist(this);
  };

  TestSession.prototype.currentTestGroup = function () {
    return this.testGroups[this.currentTestGroupIndex];
  };

  TestSession.prototype.currentTestItem = function () {
    return this.currentTestGroup().currentTestItem();
  };

  TestSession.prototype.remainingTestCount = function () {
    let count = 0;

    this.testGroups.forEach(function (testGroup) {
      count += testGroup.remainingTestCount();
    });

    return count;
  };

  TestSession.prototype.isComplete = function () {
    return this.remainingTestCount() === 0;
  };

  TestSession.prototype.isTestEnabled = function (test) {
    let firstTestGroup = this.testGroups[0];

    if (firstTestGroup) {
      for (let i = 0; i < firstTestGroup.testItems.length; i++) {
        let testItem = firstTestGroup.testItems[i];
        if (testItem.test.path === test.path) {
          return testItem.test.isEnabled;
        }
      }
      return false;
    } else {
      return true;
    }
  };

  TestSession.prototype.isVersionEnabled = function (emberVersion) {
    for (let i = 0; i < this.testGroups.length; i++) {
      let testGroup = this.testGroups[i];
      if (testGroup.emberVersion.name === emberVersion.name) {
        return true;
      }
    }
    return false;
  };

  TestSession.prototype.getCompiledTemplate = function (templateName) {
    let compiled = this.currentTestGroup().compiledTemplates[templateName];
    if (!compiled) {
      throw "Missing template " + templateName;
    }
    return compiled;
  };

  TestSession.prototype.goToNextUrl = function () {
    if (this.isComplete()) {
      document.location.href = "/";
    } else {
      let testGroup = this.currentTestGroup();
      if (testGroup.requiresTemplateCompilation()) {
        document.location.href = "/compile-templates/index.html";
      } else {
        document.location.href =
          "/benchmarks" + this.currentTestItem().test.path + "/index.html";
      }
    }
  };
})();
