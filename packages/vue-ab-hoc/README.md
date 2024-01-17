# vue-ab-hoc

<img src="https://img.shields.io/npm/v/vue-ab-hoc?label=" alt="version" />

## Install

```shell
npm install vue-ab-hoc

yarn add vue-ab-hoc

pnpm install vue-ab-hoc
```

## Quick Start

```typescript
// AB.ts
import { withAbHoc } from 'vue-ab-hoc';
import ComponentBase from './ComponentBase';
import ComponentA from './ComponentA';
import ComponentB from './ComponentB';

export default withAbHoc(ComponentBase, {
    s_a: ComponentA,
    s_b: ComponentB,
});
```

```typescript
// main.ts
import { createApp, ref } from 'vue';
import { WithAbHocPlugin } from 'vue-ab-hoc';
import AB from './AB';

const abSigns = ref(['s_a']);

const app = createApp(AB);
app.use(WithAbHocPlugin, abSigns);
app.mount('#app');
```

## Generate a new A/B HOC

If you want a new ab HOC with different sign list, you can use `abHocGenerator` to generate a HOC.

```js
import { ref } from 'vue';
import { abHocGenerator } from 'vue-ab-hoc';

const abSigns = ref([]);
const withAbHoc = abHocGenerator(abSigns);
```
