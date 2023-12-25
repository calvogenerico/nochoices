import {FlattenOption, Option} from "./option.js";
import {Some} from "./some.js";

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

  abstract mapOr<U> (defaultValue: U, mapFn: (value: T) => U): U

  abstract mapOrElse<U> (defFn: () => U, mapFn: (value: T) => U): U

  abstract zip<U> (another: OptionalValue<U>): Option<[T, U]>

  abstract zipWithSome<U>(some: Some<U>): Option<[U, T]>
}