import {Option} from "./option.js";

/**
 * Tuple of 2 options.
 */
export type OptionDuo<A, B> = [Option<A>, Option<B>]

/**
 * Type safe function to unzip an option of a tuple of 2 into a tuple of 2 options.
 * @typeparam A - Any type
 * @typeparam B - Any type
 *
 * @param {[A, B]} opt - Option to unzip
 * @return {OptionDuo<A, B>} a tuple of 2 options.
 *
 * @example
 * ```ts
 * const opt: Option<[number, string]> = Option.Some([10, 'foo'])
 * const [optA, optB] =unzip(opt)
 * optA.unwrap() === 10 // true
 * optB.unwrap() === 'foo' // true
 * ```
 */
export function unzip<A, B> (opt: Option<[A, B]>): OptionDuo<A, B> {
  return opt.map<OptionDuo<A, B>>(([a, b]) => [Option.Some(a), Option.Some(b)])
      .unwrapOr([Option.None<A>(), Option.None<B>()])
}