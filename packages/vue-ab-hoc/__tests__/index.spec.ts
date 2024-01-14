import { describe, expect, it } from 'vitest';
import { config, mount } from '@vue/test-utils';
import { h, nextTick, ref } from 'vue';
import { WithAbHocPlugin, abHocGenerator, withAbHoc } from '../src';

describe('vue-ab-hoc', () => {
    const componentBase = () => h('div', 'Base');
    const componentA = () => h('div', 'A');
    const componentB = () => h('div', 'B');
    const abKeys = ref<string[]>([]);

    config.global.plugins = [[WithAbHocPlugin, abKeys]];

    const component = mount(
        withAbHoc(componentBase, {
            s_user_a: componentA,
            s_user_b: componentB,
        }),
    );

    describe('withAbHoc', () => {
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
    });

    describe('abHocGenerator', () => {
        const abKeys = ref<string[]>([]);
        const abHoc = abHocGenerator(abKeys);
        const component = mount(abHoc(componentBase, {
            s_user_a: componentA,
            s_user_b: componentB,
        }));

        it('should mount component Base', () => {
            expect(component.isVisible()).toBeTruthy();
            expect(component.text()).toBe('Base');
        });

        it('should mount component B', async () => {
            abKeys.value.push('s_user_b');

            await nextTick();
            expect(component.isVisible()).toBeTruthy();
            expect(component.text()).toBe('B');
        });
    });
});
