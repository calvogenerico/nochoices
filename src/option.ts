import {OptionalValue} from "./optional-value.js"
import {Some} from "./some.js"
import {None} from "./none.js"

export type FlattenOption<T> = T extends Option<infer U>
    ? U
    : T

export class Option<T> {
  private value: OptionalValue<T>

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
    return this.map(mapFn).unwrapOr(defaultValue)
  }

  mapOrElse<U>(defFn: () => U, mapFn: (value: T) => U): U {
    return this.map(mapFn).unwrapOrElse(defFn)
  }

  zip<U>(another: Option<U>): Option<[T, U]> {
    return this.value.zip(another.value)
  }

  zipWith<U, V>(another: Option<U>, zipWithFn: (t: T, u: U) => V): Option<V> {
    return this.value.zipWith(another.value, zipWithFn)
  }

  and<V>(another: Option<V>): Option<V> {
    return this.value.and(another)
  }

  or(another: Option<T>): Option<T> {
    return this.value.or(this, another)
  }

  xor(another: Option<T>): Option<T> {
    return this.value.xor(another.value)
  }

  andThen <U>(fn: (t: T) => Option<U>): Option<U> {
    return this.value.andThen(fn)
  }

  orElse (fn: () => Option<T>): Option<T> {
    return this.value.orElse(fn)
  }

  insert (value: T): Option<T> {
    this.value = new Some(value)
    return this
  }

  getOrInsert (value: T): T {
    this.value = this.value.getOrInsert(value)
    return this.unwrap()
  }

  getOrInsertWith (fn: () => T): T {
    this.value = this.value.getOrInsertWith(fn)
    return this.unwrap()
  }

  take (): Option<T> {
    const takeValue = this.value.takeValue()
    this.value = new None()
    return takeValue
  }
}
