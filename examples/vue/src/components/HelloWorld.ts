import { defineAsyncComponent } from 'vue';
import { asyncComponent, withAbHoc } from 'vue-ab-hoc';

export default withAbHoc(
    defineAsyncComponent(() => import('./HelloWorld.vue')),
    {
        s_a: asyncComponent(() => import('./HelloWorldA.vue')),
        s_b: asyncComponent(() => new Promise<typeof import('./HelloWorldB.vue')>((resolve) => {
            setTimeout(() => {
                resolve(import('./HelloWorldB.vue'));
            }, 300);
        })),
    },
);
