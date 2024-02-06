/* eslint-disable react-refresh/only-export-components */
import React, { type ComponentType, createContext, useContext, useEffect, useState } from 'react';
import { type ABKey, type ObjectUnion, strategy } from 'core';

interface AsyncComponent {
    (): Promise<ComponentType<any> | { default: ComponentType<any> }>
    __ab_async__?: boolean
}

type ComponentProps<T extends ComponentType<any>> = React.ComponentProps<T> extends object
    ? React.ComponentProps<T>
    : object;

type GetComponentProps<T extends ComponentType<any> | AsyncComponent> = T extends AsyncComponent
    ? Awaited<ReturnType<T>> extends { default: ComponentType<any> }
        ? ComponentProps<Awaited<ReturnType<T>>['default']>
        : Awaited<ReturnType<T>> extends ComponentType<any>
            ? ComponentProps<Awaited<ReturnType<T>>>
            : any
    : T extends ComponentType<any>
        ? ComponentProps<T>
        : any;

export function abHocGenerator() {
    const AbContext = createContext<ABKey[]>([]);

    return {
        AbContext,
        hoc: <
            T extends ComponentType<any> | AsyncComponent,
            O extends { [key: string]: ComponentType<any> | AsyncComponent },
        >(
            base: T,
            ab: O,
        ) => {
            return (props: ObjectUnion<GetComponentProps<T | O[keyof O]>>) => {
                const abKeys = useContext(AbContext);
                // eslint-disable-next-line react/display-name
                const [Comp, setComp] = useState<ComponentType>(() => () => <></>);

                useEffect(() => {
                    let change = false;
                    const comp = strategy(abKeys)(base, ab);
                    if (typeof comp === 'function' && '__ab_async__' in comp && comp.__ab_async__) {
                        comp().then((c: any) => {
                            if (change)
                                return;
                            if ('default' in c && (c.__esModule || c[Symbol.toStringTag] === 'Module'))
                                c = c.default;
                            setComp(() => c);
                        });
                    }
                    else {
                        setComp(() => comp as any);
                    }

                    return () => {
                        change = true;
                    };
                }, [abKeys]);

                return <Comp {...props} />;
            };
        },
    };
}

export function asyncComponent<T extends AsyncComponent>(comp: T) {
    comp.__ab_async__ = true;
    return comp;
}

const { hoc, AbContext } = abHocGenerator();
export { AbContext, hoc as withAbHoc, type ABKey };
