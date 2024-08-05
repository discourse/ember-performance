const SEP = '____';

function keyFor(name: string, version: string) {
  return name + SEP + version;
}

function partsForKey(key: string) {
  let [name, version] = key.split(SEP);

  return { name, version };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export function loadAll() {
  let results = [];

  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);

    if (!key) continue;
    if (!key.includes(SEP)) continue;

    let { name, version } = partsForKey(key);

    if (!name || !version) continue;

    let result = load(name, version);

    results.push({
      name,
      version,
      results: result,
    });
  }

  return results;
}
