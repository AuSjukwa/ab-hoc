/**
 * 联合类型 => 交叉类型
 */
export type UnionToIntersection<T> = (T extends any ? (arg: T) => void : never) extends (T: infer P) => void
    ? P
    : never;

/**
 * 联合类型 => 交叉函数类型
 * @example 1 | 2 | 3 => (() => 1) & (() => 2) & (() => 3)
 */
export type UnionToFnIntersection<T> = (T extends any ? (arg: () => T) => void : never) extends (arg: infer P) => void
    ? P
    : never;

/**
 * @example 1 | 2 | 3 => ((v: 1) => any) | ((v: 2) => any) | ((v: 3) => any)
 */
export type UnionToFnUnoin<T, ReturnType = any> = UnionToFnIntersection<T> extends () => infer R
    ? ((props: R) => ReturnType) | UnionToFnUnoin<Exclude<T, R>, ReturnType>
    : never;

/**
 * @example { a: number } & { a: string; b: boolean; } => { a: string | number; b: boolean; }
 */
export type ObjectUnion<T> = T & Omit<UnionToIntersection<T>, keyof T>;

export type ABKey = string | number | symbol;
