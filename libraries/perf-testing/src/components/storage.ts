const SEP = '____';

function keyFor(name: string, version: string) {
  return name + SEP + version;
}

export function store(testName: string, emberVersion: string, benchmarkResults: any) {
  let key = keyFor(testName, emberVersion);

  let results = { ...benchmarkResults };

  // This data is too big to be useful
  delete results.samples;

  localStorage.setItem(key, JSON.stringify(results));
}

export function load(testName: string, emberVersion: string) {
  let key = keyFor(testName, emberVersion);

  let stringified = localStorage.getItem(key);

  if (!stringified) return;

  let parsed = JSON.parse(stringified);

  return parsed;
}
