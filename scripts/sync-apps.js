import { getPackages } from "@manypkg/get-packages";
import { packageJson } from "ember-apply";

const CWD = process.cwd();
const result = await getPackages(CWD);

for (let pkg of result.packages) {
  let manifest = pkg.packageJson;

  if (['common', 'perf-testing'].includes(manifest.name)) {
    await packageJson.removeDependencies(['common', 'perf-testing'], pkg.dir);
    continue;
  }

  await packageJson.addDependencies(
    {
      common: "workspace:^",
      "perf-testing": "workspace:^",
    },
    pkg.dir,
  );
}
