const SEP = '____';

function keyFor(name: string, version: string, altName: string) {
  return name + SEP + version + SEP + altName;
}

function partsForKey(key: string) {
  let [name, version, altName] = key.split(SEP);

  return { name, version, altName };
}

export function store(
  testName: string,
  emberVersion: string,
  altName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  benchmarkResults: any
) {
  let key = keyFor(testName, emberVersion, altName);

  let results = { ...benchmarkResults };

  // This data is too big to be useful
  results.numSamples = results.samples.length;
  delete results.samples;

  localStorage.setItem(key, JSON.stringify(results));
}

export function load(testName: string, emberVersion: string, altName: string) {
  let key = keyFor(testName, emberVersion, altName);

  let stringified = localStorage.getItem(key);

  if (!stringified) return;

  let parsed = JSON.parse(stringified);

  return parsed;
}

export function clearAll() {
  let keys = allKeys();

  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];

    if (!key) continue;

    localStorage.removeItem(key);
  }
}

function allKeys() {
  let results = [];

  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);

    if (!key) continue;
    if (!key.includes(SEP)) continue;

    results.push(key);
  }

  return results;
}

export function loadAll() {
  let results = [];

  let keys = allKeys();

  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];

    if (!key) continue;

    let { name, version, altName } = partsForKey(key);

    if (!name || !version || !altName) continue;

    let result = load(name, version, altName);

    results.push({
      name,
      version,
      results: result,
    });
  }

  return results;
}
