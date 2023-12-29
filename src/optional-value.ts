import {FlattenOption, Option} from "./option.js";
import {Some} from "./some.js";
import {None} from "./none.js";

export abstract class OptionalValue<T> {
  abstract isPresent (): boolean

  abstract isAbsent (): boolean

  abstract unwrap (): T

  abstract map<M> (fn: (a: T) => M): Option<M>

  abstract filter (fn: (a: T) => boolean): Option<T>

  abstract expect (err: Error): T

  abstract unwrapOr (defaultValue: T): T

  abstract unwrapOrElse (defaultFn: () => T): T

  abstract flatten (): Option<FlattenOption<T>>

  abstract zip<U> (another: OptionalValue<U>): Option<[T, U]>

  abstract zipWithSome<U>(some: Some<U>): Option<[U, T]>

  abstract zipWith<U, V>(another: OptionalValue<U>, zipWithFn: (t: T, u: U) => V): Option<V>

  abstract zipWithWithSome<U, V>(some: Some<U>, zipWithFn: (u: U, t: T) => V): Option<V>

  abstract and<V>(another: Option<V>): Option<V>;

  abstract or(another: Option<T>): Option<T>

  abstract xor(another: OptionalValue<T>): Option<T>

  abstract xorWithNone(): Option<T>

  abstract xorWithSome(some: Some<T>): Option<T>
}