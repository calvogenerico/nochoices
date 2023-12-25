import {OptionalValue} from "./optional-value.js";
import {Some} from "./some.js";
import {None} from "./none.js";

export class Option<T> {
  private value: OptionalValue<T>;

  private constructor (value: OptionalValue<T>) {
    this.value = value
  }

  static Some<T>(value: T): Option<T> {
    return new Option(new Some(value))
  }

  static None<T>(): Option<T> {
    return new Option<T>(new None())
  }

  isNone(): boolean {
    return this.value.isAbsent()
  }

  isSome(): boolean {
    return this.value.isPresent()
  }

  map <M>(fn: (a: T) => M): Option<M> {
    return this.value.map(fn)
  }

  unwrap (): T {
    return this.value.unwrap()
  }

  filter (fn: (a: T) => boolean): Option<T> {
    return this.value.filter(fn)
  }

  expect (err: Error): T {
    return this.value.expect(err)
  }

  unwrapOr (defaultValue: T): T {
    return this.value.unwrapOr(defaultValue)
  }

  unwrapOrElse (defaultFn: () => T): T {
    return this.value.unwrapOrElse(defaultFn)
  }

  flatten (): Option<FlattenOption<T>> {
    return this.value.flatten()
  }

  mapOr<U>(defaultValue: U, mapFn: (value: T) => U): U {
    return this.value.mapOr(defaultValue, mapFn)
  }
}

export type FlattenOption<T> = T extends Option<infer U>
    ? U
    : T