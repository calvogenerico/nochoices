import {OptionalValue} from "./optional-value.js"
import {Some} from "./some.js"
import {None} from "./none.js"

export type FlattenOption<T> = T extends Option<infer U>
    ? U
    : T

type MapFn<A, B> = (a: A) => B
type Predicate<A> = (a: A) => boolean
type GeneratorFn<A> = () => A
type GeneratorOptFn<A> = () => Option<A>
type ZipWithFn<A, B, C> = (a: A, b: B) => C
type MapToOptionFn<A, B> = (a: A) => Option<B>

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

  map <M>(fn: MapFn<T, M>): Option<M> {
    return this.value.map(fn)
  }

  unwrap (): T {
    return this.value.unwrap()
  }

  filter (fn: Predicate<T>): Option<T> {
    return this.value.filter(fn)
  }

  expect (err: Error): T {
    return this.value.expect(err)
  }

  unwrapOr (defaultValue: T): T {
    return this.value.unwrapOr(defaultValue)
  }

  unwrapOrElse (defaultFn: GeneratorFn<T>): T {
    return this.value.unwrapOrElse(defaultFn)
  }

  flatten (): Option<FlattenOption<T>> {
    return this.value.flatten()
  }

  mapOr<U>(defaultValue: U, mapFn: MapFn<T, U>): U {
    return this.map(mapFn).unwrapOr(defaultValue)
  }

  mapOrElse<U>(defFn: () => U, mapFn: MapFn<T, U>): U {
    return this.map(mapFn).unwrapOrElse(defFn)
  }

  zip<U>(another: Option<U>): Option<[T, U]> {
    return this.value.zip(another.value)
  }

  zipWith<U, V>(another: Option<U>, zipWithFn: ZipWithFn<T, U, V>): Option<V> {
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

  andThen <U>(fn: MapToOptionFn<T, U>): Option<U> {
    return this.value.andThen(fn)
  }

  orElse (fn: GeneratorOptFn<T>): Option<T> {
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

  getOrInsertWith (fn: GeneratorFn<T>): T {
    this.value = this.value.getOrInsertWith(fn)
    return this.unwrap()
  }

  take (): Option<T> {
    const takeValue = this.value.takeValue()
    this.value = new None()
    return takeValue
  }

  replace (newValue: T): Option<T> {
    const oldValue = this.value
    this.value = new Some(newValue)
    return new Option<T>(oldValue)
  }

  isSomeAnd (andFn: Predicate<T>): boolean {
    return this.value.isSomeAnd(andFn)
  }

  ifSome (fn: (t: T) => void): Option<T> {
    this.value.ifSome(fn)
    return this
  }

  ifNone (fn: () => void): Option<T> {
    this.value.ifNone(fn)
    return this
  }

  inspect (param: (t: T) => void) {
    this.ifSome(param)
  }

  takeIf (param: Predicate<T>): Option<T> {
    return this.filter(param).andThen(() => this.take())
  }

  toArray (): T[] {
    return this.value.toArray()
  }
}
