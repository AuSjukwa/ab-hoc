import React, { createContext, useContext } from 'react';
import { type ABKey, type ObjectUnion, type UnionToFnUnoin, type UnionToIntersection, strategy } from 'core';

export function abHocGenerator() {
    const AbContext = createContext<ABKey[]>([]);

    return {
        AbContext,
        hoc: <T extends React.ComponentType<any>, O extends { [key: string]: React.ComponentType<any> }>(
            base: T,
            ab: O,
        ) => {
            return ((props: any) => {
                const abKeys = useContext(AbContext);
                const HitComponent = strategy(abKeys)(base, ab);
                return <HitComponent {...props} />;
            }) as UnionToIntersection<
                UnionToFnUnoin<ObjectUnion<React.ComponentProps<T | O[keyof O]>>, React.ReactNode>
            >;
        },
    };
}

const { hoc, AbContext } = abHocGenerator();
export { AbContext, hoc as withAbHoc };
