import {Option} from "./option.js"

/**
 * Flattens nested options in one level. This function
 * is similar to {@link Option.flatten} but more typesafe.
 *
 * Using this function is possible to ensure at compile time that the
 * target is optional is actually a nested optional.
 *
 * @typeparam T - Any type
 * @param {Option<Option<T>>} opt - Optional to flatten
 * @returns {Option<T>} Flattened option
 *
 * @example
 * ```ts
 * const opt1 = Option.Some(Option.Some(10))
 * flatten(opt1).unwrap() // 10
 *
 * const opt2: Option<Option<string>> = Option.None()
 * const flatten2: Option<string>= flatten(opt2)
 * flatten2.isNone() // true
 * ```
 */
export function flatten<T>(opt: Option<Option<T>>): Option<T> {
  return opt.unwrapOr(Option.None())
}