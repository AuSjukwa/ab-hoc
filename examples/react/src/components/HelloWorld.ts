import { lazy } from 'react';
import { asyncComponent, withAbHoc } from 'react-ab-hoc';

const HelloWorld = withAbHoc(
    lazy(() => import('./HelloWorldBase')),
    {
        s_a: asyncComponent(() => import('./HelloWorldA')),
        s_b: asyncComponent(() => {
            return new Promise<typeof import('./HelloWorldB')>((resolve) => {
                setTimeout(() => {
                    resolve(import('./HelloWorldB'));
                }, 300);
            });
        }),
    },
);
export default HelloWorld;
