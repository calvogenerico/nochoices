import {Option} from "./option.js";

/**
 * Type alias for simple transformations functions.
 *
 * A transformation takes a Value if type A and return a value of type B.
 *
 * @param A - any type
 * @param B - any type
 *
 * @example
 * ```ts
 * // All the following are valid transformations
 * const f1: Transformation = (a: number): string => a.toString()
 * const f2: Transformation = (a: number): number => a + 2
 * const f3: Transformation = (_a: string): object => ({color: 'red'})
 * ```
 */
export type Transformation<A, B> = (a: A) => B

/**
 * Type alias for functions that given a value returns true or false.
 *
 * @param A - any type
 *
 * @example
 * ```ts
 * // All the following are valid predicate examples
 * const fn1 = (a: number) => a % 2 === 0
 * const fn2 = (a: string) => a.length === 3
 * const fn3 = (_a: any) => true
 * ```
 */
export type Predicate<A> = (a: A) => boolean

/**
 * Type alias for functions that take no parameters and return a Value.
 *
 * @example
 * ```ts
 * const fn1 = () => 10
 * const fn2 = () => "foo"
 * const fn3 = () => Option.None()
 * ```
 */
export type Generator<A> = () => A

/**
 * Type alias for functions that take no parameters and return an optional value.
 *
 * @param A - any type
 *
 * @example
 * ```ts
 * const fn1 = () => Option.Some(10)
 * const fn2 = () => Option.fromNullable(someOtherValue)
 * const fn3 = () => Option.None()
 * ```
 */
export type GenerateOption<A> = () => Option<A>

/**
 * Type alias for functions that 2 values and return any other value
 *
 * @param A - any type
 * @param B - any type
 * @param C - any type
 *
 * @example
 * ```ts
 * // All the following are valid examples
 * const fn1 = (a: number, b: number): number => a + b
 * const fn2 = (a: string, b: number): string => a.repeat(b)
 * const fn3 = (a: number, b: string): {a: number, b: string} => ({ a, b })
 * ```
 */
export type ZipTransformation<A, B, C> = (a: A, b: B) => C

/**
 * Similar to a {@link Transformation | `Transformation`} but the result has to
 * be an optional value
 *
 * @example
 * ```ts
 * // All the following are valid examples
 * const fn1 = (a: number) => Option.Some(number).filter(n => n % 2 === 0)
 * const fn2 = (a: string) => Option.None()
 * const fn3 = (a: number[]) => Option.fromNullable(a[0])
 * ```
 */
export type TransformToOption<A, B> = (a: A) => Option<B>

/**
 * Type helper for flatting options
 *
 * @param A - any type
 * @param B - any type
 *
 * FlattenOption<Option<Option<String>>> is equivalent to Option<String>
 * FlattenOption<Option<number>> is equivalent to number
 */
export type FlattenOption<A> = A extends Option<infer B>
  ? B
  : A