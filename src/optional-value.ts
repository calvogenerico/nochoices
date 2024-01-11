import {Option} from "./option.js"
import {Some} from "./some.js"
import {AreEqual, FlattenOption} from "./types.js";

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

  abstract zipWithSome<U> (some: Some<U>): Option<[U, T]>

  abstract and<V> (another: Option<V>): Option<V>

  abstract or (self: Option<T>, another: Option<T>): Option<T>

  abstract xor (another: OptionalValue<T>): Option<T>

  abstract xorWithNone (): Option<T>

  abstract xorWithSome (some: Some<T>): Option<T>

  abstract andThen<U> (fn: (t: T) => Option<U>): Option<U>

  abstract orElse (fn: () => Option<T>): Option<T>

  abstract getOrInsert (value: T): OptionalValue<T>

  abstract getOrInsertWith (fn: () => T): OptionalValue<T>

  abstract takeValue (): Option<T>

  abstract isSomeAnd (andFn: (t: T) => boolean): boolean

  abstract ifSome (param: (t: T) => void): void

  abstract ifNone (fn: () => void): void

  abstract toArray (): T[]

  abstract equals (another: OptionalValue<T>): boolean

  abstract equalsBy (another: OptionalValue<T>, equality: AreEqual<T>)
}