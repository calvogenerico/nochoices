import {OptionalValue} from "./optional-value.js"
import {Some} from "./some.js"
import {None} from "./none.js"

export type FlattenOption<T> = T extends Option<infer U>
    ? U
    : T

export type MapFn<A, B> = (a: A) => B
export type Predicate<A> = (a: A) => boolean
export type GeneratorFn<A> = () => A
export type GeneratorOptFn<A> = () => Option<A>
export type ZipWithFn<A, B, C> = (a: A, b: B) => C
export type MapToOptionFn<A, B> = (a: A) => Option<B>


/**
 *
 * An Option<T> represents a value of type T that can be present ot not.
 * Values inside options cannot be used directly, which ensures a safe
 * data consumption.
 *
 * There are several ways to create an optional value:
 *
 *
 * @example
 * ```ts
 * const none = Option.None()
 * const some = Option.Some('foo')
 * const nullable: string | null = 'bar'
 * const maybe = Option.fromNullable(nullable)
 * ```
 *
 * An optional can also be created combining other optionals:
 *
 * @example
 * ```ts
 * const opt1 = Option.None()
 * const opt2 = Option.Some('foo')
 * const opt3 = opt1.or(opt2)
 * ```
 *
 * Optional values can also perform operations
 *
 * @example
 * ```ts
 * const opt = Option.Some('foo')
 * const opt2 = opt.map(v => v + 'bar') // === Some('foobar')
 * const opt3 = opt.filter(v => v.length === 0) // === None
 * ```
 *
 * @param T - The type of the object wrapped by the optional
 */
export class Option<T> {
  private value: OptionalValue<T>

  private constructor (value: OptionalValue<T>) {
    this.value = value
  }

  /**
   * Creates an instance of Option with a value. (Some)
   *
   * @static
   * @param {T} value - The value to be wrapped in an Option.
   * @typeparam T - Type of the value that the Option may contain.
   * @returns {Option<T>} An instance of Option containing the provided value ( Some(value) ).
   * @contructor
   *
   * @example
   * ```ts
   * const some = Option.Some('foo')
   * some.unwrap() === 'foo' // true
   * ```
   */
  static Some<T> (value: T): Option<T> {
    return new Option(new Some(value))
  }


  /**
   * Creates an empty optional value (represents no value).
   *
   * @static
   * @typeparam T - Type of the value that the Option may contain.
   * @returns {Option<T>} An instance of Option without a value ( None() ).
   *
   * @example
   * ```ts
   * const none = Option.None()
   * none.isNone() // true
   * ```
   */
  static None<T> (): Option<T> {
    return new Option<T>(new None())
  }

  /**
   * Creates an instance of Option from a nullable value.
   * If the provided value is null or undefined, it returns an Option without a value (None).
   * Otherwise, it wraps the provided value in an Option (Some).
   *
   * @static
   * @param {T | null | undefined} param - The value to be wrapped in an Option.
   * @typeparam T - Type of the value that the Option may contain.
   * @returns {Option<T>} An instance of Option containing the provided value if it's not null or undefined, otherwise an Option without a value.
   *
   * @example
   * ```ts
   * const nullable: string | null = null
   * const maybe = Option.fromNullable(nullable) // None
   * const nullable2: string | null = 'foo'
   * const maybe2 = Option.fromNullable(nullable2) // Some('foo')
   * ```
   */
  static fromNullable<T> (param: T | null | undefined): Option<T> {
    if (param === null || param === undefined) {
      return Option.None()
    } else {
      return Option.Some(param)
    }
  }


  /**
   * Checks if the Option instance does not contain a value.
   *
   * @returns {boolean} Returns true if the Option instance does not contain a value, otherwise false.
   *
   * @example
   * ```ts
   * const none = Option.None()
   * none.isNone() // true
   * const some = Option.Some('foo')
   * some.isNone() // false
   * ```
   */
  isNone (): boolean {
    return this.value.isAbsent()
  }

/**
 * Checks if the Option instance contains a value.
 *
 * @returns {boolean} Returns true if the Option instance contains a value, otherwise false.
 *
 * @example
 * ```ts
 * const none = Option.None()
 * none.isSome() // false
 * const some = Option.Some('foo')
 * some.isSome() // true
 * ```
 */
  isSome (): boolean {
    return this.value.isPresent()
  }

  map<M> (fn: MapFn<T, M>): Option<M> {
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

  mapOr<U> (defaultValue: U, mapFn: MapFn<T, U>): U {
    return this.map(mapFn).unwrapOr(defaultValue)
  }

  mapOrElse<U> (defFn: () => U, mapFn: MapFn<T, U>): U {
    return this.map(mapFn).unwrapOrElse(defFn)
  }

  zip<U> (another: Option<U>): Option<[T, U]> {
    return this.value.zip(another.value)
  }

  zipWith<U, V> (another: Option<U>, zipWithFn: ZipWithFn<T, U, V>): Option<V> {
    return this.value.zipWith(another.value, zipWithFn)
  }

  and<V> (another: Option<V>): Option<V> {
    return this.value.and(another)
  }

  or (another: Option<T>): Option<T> {
    return this.value.or(this, another)
  }

  xor (another: Option<T>): Option<T> {
    return this.value.xor(another.value)
  }

  andThen<U> (fn: MapToOptionFn<T, U>): Option<U> {
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
