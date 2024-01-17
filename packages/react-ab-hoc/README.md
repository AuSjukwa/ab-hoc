# react-ab-hoc

<img src="https://img.shields.io/npm/v/react-ab-hoc?label=" alt="version" />

## Install

```shell
npm install react-ab-hoc

yarn add react-ab-hoc

pnpm install react-ab-hoc
```

## Quick Start

```typescript
// AB.tsx
import { withAbHoc } from 'react-ab-hoc';
import ComponentBase from './ComponentBase';
import ComponentA from './ComponentA';
import ComponentB from './ComponentB';

export default withAbHoc(ComponentBase, {
    s_a: ComponentA,
    s_b: ComponentB,
});
```

```typescript
// App.tsx
import React from 'react';
import { AbContext } from 'react-ab-hoc';
import AB from './AB.tsx';

const App = () => {
    const abSigns = React.useState(['s_a']);

    return (
        <AbContext.Provider value={abSigns}>
            <AB />
        </AbContext.Provider>
    );
};
export default App;
```

## Generate a new A/B HOC

If you want a new ab HOC with different sign list, you can use `abHocGenerator` to generate a HOC.

```typescript
import { abHocGenerator } from 'react-ab-hoc';

const { hoc, AbContext } = abHocGenerator();
```
