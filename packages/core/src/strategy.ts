/**
 * 策略模式
 */
export default function strategy(strategies: (number | string | symbol)[]) {
    return <
        T,
        O extends {
            [key: number | string | symbol]: any
        },
    >(
        base: T,
        strats: O,
    ) => {
        const hit = strategies.find(key => strats[key]);
        return typeof hit !== 'undefined' ? (strats[hit] as O[keyof O]) : base;
    };
}
