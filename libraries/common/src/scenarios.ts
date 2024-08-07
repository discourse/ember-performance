// Can't use eager: see: https://github.com/OpenSourceRaidGuild/babel-vite/issues/57
// eager: true,
// const definedScenarios = import.meta.glob('./scenarios/*');
import * as _1 from './scenarios/baseline-handlebars-list.gjs';
import * as _2 from './scenarios/baseline-inner-html.gjs';
import * as _3 from './scenarios/ember-get.gjs';
import * as _3_2 from './scenarios/ember-get-primed.gjs';
import * as _4 from './scenarios/ember-run.gjs';
import * as _6 from './scenarios/ember-set.gjs';
import * as _6_2 from './scenarios/ember-set-primed.gjs';
import * as _7 from './scenarios/render-complex-html-classic.gjs';
import * as _5 from './scenarios/string-classify.gjs';

import type { ComponentLike } from '@glint/template';

const definedScenarios = {
  _1,
  _2,
  _3,
  _3_2,
  _6,
  _6_2,
  _4,
  _5,
  _7,
};

let scenariosByName: Record<
  string,
  ComponentLike<{
    Args: {};
  }>
> = {};

for (let [filePath, esModule] of Object.entries(definedScenarios)) {
  let { name, default: component } = esModule;

  if (!name) {
    throw new Error(`Scenario at ${filePath} did not export a name`);
  }

  if (!component) {
    throw new Error(`Scenario at ${filePath} did not export a component (as a default export)`);
  }

  scenariosByName[name] = component;
}

export const scenarios = scenariosByName;

export const benchmarkNames = Object.keys(scenarios);
