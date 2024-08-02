// Can't use eager: see: https://github.com/OpenSourceRaidGuild/babel-vite/issues/57
// eager: true,
// const definedScenarios = import.meta.glob('./scenarios/*');
import * as _1 from './scenarios/baseline-handlebars-list.gjs';
import * as _2 from './scenarios/baseline-inner-html.gjs';
import * as _3 from './scenarios/ember-get.gjs';

const definedScenarios = {
  _1,
  _2,
  _3,
};

let scenariosByName = {};

for (let [filePath, esModule] of Object.entries(definedScenarios)) {
  let { name, default: component } = esModule;

  console.log(esModule);

  if (!name) {
    throw new Error(`Scenario at ${filePath} did not export a name`);
  }

  if (!component) {
    throw new Error(`Scenario at ${filePath} did not export a component (as a default export)`);
  }

  scenariosByName[name] = component;
}

export const scenarios = scenariosByName;
