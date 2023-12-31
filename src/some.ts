import {OptionalValue} from "./optional-value.js"
import {FlattenOption, Option} from "./option.js"

export class Some<T> extends OptionalValue<T> {
  value: T

  constructor (value: T) {
    super()
    this.value = value
  }

  isPresent (): boolean {
    return true
  }

  isAbsent (): boolean {
    return false
  }

  unwrap (): T {
    return this.value
  }

  map<M> (fn: (a: T) => M): Option<M> {
    const newValue = fn(this.value)
    return Option.Some(newValue)
  }

  filter (fn: (a: T) => boolean): Option<T> {
    const res = fn(this.value)
    if (res) {
      return Option.Some(this.value)
    }
    return Option.None()
  }

  expect (_err: Error): T {
    return this.value
  }

  unwrapOr (_defaultValue: T): T {
    return this.value
  }

  unwrapOrElse (_defaultFn: () => T): T {
    return this.value
  }

  flatten (): Option<FlattenOption<T>> {
    if (this.value instanceof Option) {
      return this.value
    } else {
      return Option.Some(this.value) as Option<FlattenOption<T>>
    }
  }

  zip<U> (another: OptionalValue<U>): Option<[T, U]> {
    return another.zipWithSome(this)
  }

  zipWithSome<U> (some: Some<U>): Option<[U, T]> {
    return Option.Some([some.value, this.value])
  }

  and<V>(another: Option<V>): Option<V> {
    return another
  }

  or(self: Option<T>, _another: Option<T>): Option<T> {
    return self
  }

  xor(another: OptionalValue<T>): Option<T> {
    return another.xorWithSome(this)
  }

  xorWithNone (): Option<T> {
    return Option.Some(this.value)
  }

  xorWithSome (_some: Some<T>): Option<T> {
    return Option.None()
  }

  andThen<U> (fn: (t: T) => Option<U>): Option<U> {
    return fn(this.value)
  }

  orElse (_fn: () => Option<T>): Option<T> {
    return Option.Some(this.value)
  }

  getOrInsert (_value: T): OptionalValue<T> {
    return this;
  }

  getOrInsertWith (_fn: () => T): OptionalValue<T> {
    return this;
  }

  takeValue (): Option<T> {
    return Option.Some(this.value);
  }

  isSomeAnd (andFn: (t: T) => boolean): boolean {
    return andFn(this.value);
  }

  ifSome (param: (t: T) => void): void {
    param(this.value)
  }

  ifNone (_fn: () => void): void {
    /* no-op */
  }

  toArray (): T[] {
    return [this.value];
  }
}