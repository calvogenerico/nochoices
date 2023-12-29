import {OptionalValue} from "./optional-value.js"
import {FlattenOption, Option} from "./option.js"
import {Some} from "./some.js"

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
    return defaultValue
  }

  unwrapOrElse (defaultFn: () => T): T {
    return defaultFn()
  }

  flatten (): Option<FlattenOption<T>> {
    return Option.None()
  }

  zip<U> (_another: OptionalValue<U>): Option<[T, U]> {
    return Option.None()
  }

  zipWithSome<U> (_some: Some<U>): Option<[U, T]> {
    return Option.None()
  }

  zipWith<U, V> (_another: OptionalValue<U>, _zipWithFn: (t: T, u: U) => V): Option<V> {
    return Option.None()
  }

  zipWithWithSome<U, V> (_some: Some<U>, _zipWithFn: (u: U, t: T) => V): Option<V> {
    return Option.None()
  }

  and<V>(_another: Option<V>): Option<V> {
    return Option.None()
  }

  or(_self: Option<T>, another: Option<T>): Option<T> {
    return another
  }

  xor(another: OptionalValue<T>): Option<T> {
    return another.xorWithNone()
  }

  xorWithNone (): Option<T> {
    return Option.None()
  }

  xorWithSome (some: Some<T>): Option<T> {
    return Option.Some(some.unwrap())
  }

  andThen<U> (_fn: (t: T) => Option<U>): Option<U> {
    return Option.None()
  }

  orElse (fn: () => Option<T>): Option<T> {
    return fn()
  }

  getOrInsert (value: T): OptionalValue<T> {
    return new Some(value);
  }

  getOrInsertWith (fn: () => T): OptionalValue<T> {
    return new Some(fn());
  }

  takeValue (): Option<T> {
    return Option.None();
  }

  isSomeAnd (_andFn: (t: T) => boolean): boolean {
    return false;
  }

  ifSome (_param: (t: T) => void): void {
    /* no-op */
  }
}