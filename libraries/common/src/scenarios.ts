// Can't use eager: see: https://github.com/OpenSourceRaidGuild/babel-vite/issues/57
// eager: true,
// const definedScenarios = import.meta.glob('./scenarios/*');
import * as _3 from './scenarios/ember-get.gjs';
import * as _3_2 from './scenarios/ember-get-primed.gjs';
import * as _4 from './scenarios/ember-run.gjs';
import * as _6 from './scenarios/ember-set.gjs';
import * as _6_2 from './scenarios/ember-set-primed.gjs';
import * as _5 from './scenarios/string-classify.gjs';

const micro = [_3, _3_2, _4, _6, _6_2, _5];

import * as _1 from './scenarios/baseline-handlebars-list.gjs';
import * as _2 from './scenarios/baseline-inner-html.gjs';
import * as _7 from './scenarios/render-complex-html-classic.gjs';
import * as _8 from './scenarios/render-complex-html-glimmer.gjs';
import * as _9 from './scenarios/render-complex-html-glimmer-template-only.gjs';
import * as _13 from './scenarios/render-list.gjs';
import * as _20 from './scenarios/render-list-unbound-glimmer.gjs';
import * as _21 from './scenarios/render-list-unbound-glimmer-to.gjs';
import * as _13_1 from './scenarios/render-list-with-link-to.gjs';
import * as _10 from './scenarios/render-simple-list.gjs';
import * as _11 from './scenarios/render-simple-list-glimmer.gjs';
import * as _12 from './scenarios/render-simple-list-glimmer-to.gjs';

const rendering = {
  [`Slightly complex HTML`]: [_7, _8, _9],
  [`List`]: [_1, _2, _13, _13_1],
  [`Simple List`]: [_10, _11, _12],
  [`Unbound List`]: [_20, _21],
};

export const groups = { Micro: micro, Rendering: rendering };

import type { ComponentLike } from '@glint/template';

const definedScenarios = [...micro, ...Object.values(rendering).flat()];

let scenariosByName: Record<string, ComponentLike> = {};

// for (let [filePath, esModule] of Object.entries(definedScenarios)) {
for (let esModule of definedScenarios) {
  let filePath = `(Not available. See: https://github.com/OpenSourceRaidGuild/babel-vite/issues/57
)`;
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
