import { describe, expect, it, vi } from 'vitest';
import { config, mount } from '@vue/test-utils';
import { h, nextTick, ref } from 'vue';
import { type ABKey, WithAbHocPlugin, abHocGenerator, asyncComponent, withAbHoc } from '../src';

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

describe('vue-ab-hoc', () => {
    const componentBase = () => h('div', 'Base');
    const componentA = () => h('div', 'A');
    const componentB = () => h('div', 'B');
    const abKeys = ref<ABKey[]>([]);

    config.global.plugins = [[WithAbHocPlugin, abKeys]];

    describe.each([
        { fnName: 'withAbHoc', hoc: withAbHoc, abKeys },
        {
            fnName: 'abHocGenerator',
            ...(() => {
                const abKeys = ref<ABKey[]>([]);
                return { hoc: abHocGenerator(abKeys), abKeys };
            })(),
        },
    ])('$fnName', ({ hoc, abKeys }) => {
        const component = mount(
            hoc(componentBase, {
                s_user_a: componentA,
                s_user_b: asyncComponent(async () => {
                    await sleep(100);
                    return componentB;
                }),
            }),
        );

        it('should mount component Base', () => {
            expect(component.isVisible()).toBeTruthy();
            expect(component.text()).toBe('Base');
        });

        it('should mount component A', async () => {
            abKeys.value.push('s_user_a');
            await nextTick();

            expect(component.isVisible()).toBeTruthy();
            expect(component.text()).toBe('A');
        });

        it('should mount component B after componentB request is resolved', async () => {
            abKeys.value = ['s_user_b'];
            await nextTick();

            expect(component.isVisible()).toBeTruthy();
            expect(component.text()).toBe('A');
            await sleep(100);
            expect(component.text()).toBe('B');
        });

        it('should mount component A when toggle component B and then toggle component A', async () => {
            abKeys.value = [];
            await nextTick();
            abKeys.value = ['s_user_b'];
            await nextTick();
            abKeys.value = ['s_user_a'];
            await nextTick();

            expect(component.isVisible()).toBeTruthy();
            expect(component.text()).toBe('A');
            await sleep(100);
            expect(component.text()).toBe('A');
        });
    });
});
