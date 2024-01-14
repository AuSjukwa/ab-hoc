import { type App, type Component, type MaybeRef, computed, defineComponent, h, isRef, ref, watch } from 'vue';
import { type ABKey, type ObjectUnion, type UnionToFnUnoin, type UnionToIntersection, strategy } from 'core';

type GetProps<T extends Component> = T extends new (...args: any[]) => any
    ? InstanceType<T>['$props']
    : T extends (props: infer P) => any
        ? P
        : any;

export function abHocGenerator(abKey: MaybeRef<ABKey[]>) {
    return <T extends Component, O extends { [key: string]: Component }>(base: T, ab: O) => {
        return defineComponent((_, ctx) => {
            const hitComponent = computed(() => strategy(isRef(abKey) ? abKey.value : abKey)(base, ab));
            return () => h(hitComponent.value, ctx.attrs, ctx.slots);
        }) as UnionToIntersection<UnionToFnUnoin<ObjectUnion<GetProps<T | O[keyof O]>>>>;
    };
}

const abKeys = ref<ABKey[]>([]);

export const WithAbHocPlugin = {
    install(_: App, option: MaybeRef<ABKey[]>) {
        watch(isRef(option) ? option : ref(option), (val) => {
            abKeys.value = val;
        });
        abKeys.value = isRef(option) ? option.value : option;
    },
};
export const withAbHoc = abHocGenerator(abKeys);
