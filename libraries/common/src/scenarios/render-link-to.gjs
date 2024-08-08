import { LinkTo } from '@ember/routing';

import { RenderBenchmark } from 'common';

export const name = 'Render list (template-only)';

const Test = <template>
  <LinkTo @route="index">Howdy!</LinkTo>
</template>;

<template>
  <RenderBenchmark @name={{name}} @version={{@version}}>
    <Test />
  </RenderBenchmark>
</template>
