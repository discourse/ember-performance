const definedScenarios = import.meta.glob('./scenarios/*', {
  eager: true,
});

let scenariosByName = {};

for (let [filePath, esModule] of Object.entries(definedScenarios)) {
  let { name, default: component } = esModule;

  if (!name) {
    throw new Error(`Scenario at ${filePath} did not export a name`);
  }
  if (!component) {
    throw new Error(
      `Scenario at ${filePath} did not export a component (as a default export)`,
    );
  }

  scenariosByName[name] = component;
}

export const scenarios = scenariosByName;
