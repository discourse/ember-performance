export function onRenderIsh(fn: () => void) {
  (async () => {
    await Promise.resolve();
    fn();
  })();
}
