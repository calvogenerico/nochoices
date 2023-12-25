import {OptionalValue} from "./optional-value.js";
import {FlattenOption, Option} from "./option.js";

export class None<T> extends OptionalValue<T> {
  isPresent (): boolean {
    return false
  }

  isAbsent (): boolean {
    return true
  }

  unwrap (): T {
    throw new Error('unwrap over None.')
  }

  map<M> (_fn: (a: T) => M): Option<M> {
    return Option.None()
  }

  filter (_fn: (a: T) => boolean): Option<T> {
    return Option.None()
  }

  expect (err: Error): T {
    throw err
  }

  unwrapOr (defaultValue: T): T {
    return defaultValue;
  }

  unwrapOrElse (defaultFn: () => T): T {
    return defaultFn();
  }

  flatten (): Option<FlattenOption<T>> {
    return Option.None();
  }

  mapOr<U> (defaultValue: U, _mapFn: (value: T) => U): U {
    return defaultValue;
  }

  mapOrElse<U> (defFn: () => U, _mapFn: (value: T) => U): U {
    return defFn();
  }
}