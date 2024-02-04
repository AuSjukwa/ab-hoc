import { type App, type Component, type MaybeRef, defineComponent, h, isRef, ref, shallowRef, watch } from 'vue';
import { type ABKey, type ObjectUnion, type UnionToFnUnoin, type UnionToIntersection, strategy } from 'core';

interface AsyncComponent {
    (): Promise<Component>
    __ab_async__?: boolean
}

type GetAsyncComponent<T extends AsyncComponent> = Awaited<ReturnType<T>> extends { default: Component }
    ? Awaited<ReturnType<T>>['default']
    : Awaited<ReturnType<T>>;

type GetComponentProps<T extends Component> = T extends new (...args: any[]) => any
    ? InstanceType<T>['$props']
    : T extends (props: infer P) => any
        ? P
        : any;

type GetProps<T extends Component | AsyncComponent> = T extends AsyncComponent
    ? GetComponentProps<GetAsyncComponent<T>>
    : GetComponentProps<T>;

export function abHocGenerator(abKeys: MaybeRef<ABKey[]>) {
    return <T extends Component | AsyncComponent, O extends { [key: string]: Component | AsyncComponent }>(
        base: T,
        ab: O,
    ) => {
        return defineComponent((_, ctx) => {
            const hitted = shallowRef<Component | null>(null);
            let latestRequest: Promise<Component> | null = null;

            watch(
                abKeys,
                () => {
                    const com = strategy(isRef(abKeys) ? abKeys.value : abKeys)(base, ab);
                    if (typeof com === 'function' && '__ab_async__' in com && com.__ab_async__) {
                        const currentRequest = com();
                        latestRequest = currentRequest;
                        currentRequest
                            .then((comp: any) => {
                                if (currentRequest !== latestRequest)
                                    return;

                                if (comp && (comp.__esModule || comp[Symbol.toStringTag] === 'Module'))
                                    comp = comp.default;
                                hitted.value = comp;
                            });
                    }
                    else {
                        hitted.value = com;
                    }
                },
                { immediate: true },
            );

            return () => (hitted.value ? h(hitted.value, ctx.attrs, ctx.slots) : null);
        }) as UnionToIntersection<UnionToFnUnoin<ObjectUnion<GetProps<T | O[keyof O]>>>>;
    };
}

export function asyncComponent<T extends AsyncComponent>(comp: T): T {
    comp.__ab_async__ = true;
    return comp;
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
export { type ABKey };
