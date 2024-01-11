import {OptionalValue} from "./optional-value.js"
import {Some} from "./some.js"
import {None} from "./none.js"
import {
  AreEqual,
  FlattenOption,
  GenerateOption,
  Generator,
  Predicate,
  Transformation,
  TransformToOption,
  ZipTransformation
} from "./types.js";


/**
 *
 * An Option<T> represents a value of type T that can be present ot not.
 * Values inside options cannot be used directly, which ensures a safe
 * data consumption.
 *
 * There are several ways to create an optional value:
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
  /**
   * @hidden
   * @private
   */
  private value: OptionalValue<T>

  /**
   * @hidden
   * @param value
   * @private
   */
  private constructor (value: OptionalValue<T>) {
    this.value = value
  }

  /**
   * Creates an instance of Option with a value. (Some)
   *
   * @param value - The value to be wrapped in an Option.
   * @typeParam T - Type of the value that the Option may contain.
   * @returns An instance of Option containing the provided value ( Some(value) ).
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
   * @typeParam T - Type of the value that the Option may contain.
   * @returns An instance of Option without a value ( None() ).
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
   * @param param - The value to be wrapped in an Option.
   * @typeParam T - Type of the value that the Option may contain.
   * @returns An instance of Option containing the provided value if it's not null or undefined, otherwise an Option without a value.
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
   * Returns true if the instance does not contain a value. Returns false otherwise.
   *
   * @returns true if instance is none, otherwise true
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
   * @returns Returns true if the Option instance contains a value, otherwise false.
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


  /**
   * Transforms the value contained in the Option instance using the provided mapping function.
   * If the Option instance does not contain a value (None), it returns a new Option without a value.
   * If the Option instance contains a value (Some), it applies the mapping function to the value and returns a new
   * option with the mapped value.
   *
   * @param  fn - The mapping function to apply to the value.
   * @typeParam M - The type of the value that the new Option may contain after applying the mapping function.
   * @returns A new Option with the mapped value.
   *
   * @example
   * ```ts
   * const some = Option.Some(5)
   * const newSome = some.map(value => value * 2) // Some(10)
   * const none = Option.None<number>()
   * const newNone = none.map(value => value * 2) // None
   * ```
   */
  map<M> (fn: Transformation<T, M>): Option<M> {
    return this.value.map(fn)
  }

  /**
   * Unwraps the value contained in the Option instance.
   * If the Option instance does not contain a value (None), it throws an error.
   * If the Option instance contains a value (Some), it returns the value.
   *
   * This method is better suited for testing or inspection.
   * Use it with care. There are safer alternatives to this operation
   * like {@link Option.unwrapOr | `unwrapOr`}, {@link Option.unwrapOrElse | `unwrapOrElse`},
   * {@link Option.getOrInsert | `getOrInsert`}, {@link Option.getOrInsertWith | `getOrInsertWith`},
   * {@link Option.take | `take`} or {@link Option.takeIf | `takeIf`}.
   *
   * If the desire is throw an error in case of a missing value, `expect` it's a better
   * alternative that allows for more expressive errors.
   *
   * @returns The value contained in the Option instance.
   * @throws If the Option instance does not contain a value.
   *
   * @example
   * ```ts
   * const some = Option.Some('foo')
   * some.unwrap() // 'foo'
   * const none = Option.None()
   * none.unwrap() // throws Error
   * ```
   */
  unwrap (): T {
    return this.value.unwrap()
  }

  /**
   * Unwraps the value contained in the Option instance or returns a default value if the Option
   * instance does not contain a value.
   * This is a safer alternative to `unwrap` where the normal flow of the program can be ensured.
   *
   * @param defaultValue - Value returned when current instance is None.
   * @returns The value contained in the Option instance or the provided default value.
   *
   * @example
   * ```ts
   * const some = Option.Some('foo')
   * some.unwrapOr('bar') // 'foo'
   * const none = Option.None()
   * none.unwrapOr('bar') // 'bar'
   * ```
   */
  unwrapOr (defaultValue: T): T {
    return this.value.unwrapOr(defaultValue)
  }

  /**
   * Returns the contained value. If there is no value it executes the provided function and
   * returns the result of that.
   * This is a safer alternative to plain `unwrap` that ensures that the flow of the program
   * can continue in case there is a missing value.
   *
   * @param defaultFn - When instance is None, this function is called to create
   * a default value.
   * @returns The value contained in the intance or the generated default value.
   *
   * @example
   * ```ts
   * const some = Option.Some('foo')
   * some.unwrapOrElse(() => 'bar') // 'foo'
   * const none = Option.None()
   * none.unwrapOrElse(() => 'bar') // 'bar'
   * ```
   */
  unwrapOrElse (defaultFn: Generator<T>): T {
    return this.value.unwrapOrElse(defaultFn)
  }

  /**
   * Filters the value contained in the Option instance using the provided predicate function.
   *
   * - If the Option instance does not contain a value (None), it returns a new Option without a
   *   value.
   * - If the Option instance contains a value (Some) and the predicate function returns true when
   *   applied to the value, it returns a new Option with the same value.
   * - If the Option instance contains a value (Some) and the predicate function returns false when
   *   applied to the value, it returns a new Option without a value (None).
   *
   * @param fn - The predicate function used to filter.
   * @returns A new Option with the value if the predicate function returns true,
   * otherwise an Option without a value.
   *
   * @example
   * ```ts
   * const opt1 = Option.Some(5)
   * const newOpt1 = opt1.filter(value => value > 3) // Some(5)
   * const opt2 = Option.None<number>()
   * const newOpt2 = opt2.filter(value => value > 3) // None
   * ```
   */
  filter (fn: Predicate<T>): Option<T> {
    return this.value.filter(fn)
  }

  /**
   * If there is a value present returns it, otherwise throws the error specified as argument.
   *
   * This is the right method to use when you an error should be raised if the optional is empty.
   *
   * @param err - The error to throw if the Option instance does not contain a value.
   * @returns The value contained in the Option instance.
   * @throws The provided error if the Option instance does not contain a value.
   *
   * @example
   * ```ts
   * const some = Option.Some('foo')
   * some.expect(new Error('No value')) // 'foo'
   * const none = Option.None()
   * none.expect(new Error('No value')) // throws Error: 'No value'
   * ```
   */
  expect (err: Error): T {
    return this.value.expect(err)
  }

  /**
   * Flattens nested options.
   * An `Option<Option<T>>` returns an `Option<T>` with the same value inside (or no value in case of None).
   *
   * In case the option is not nested, it returns the same option.
   *
   * There is a type safer alternative to this method as an exported function {@link flatten}
   *
   * @returns Flatterned version of the option.
   *
   * @example
   * ```ts
   * const some = Option.Some(Option.Some('foo'))
   * some.flatten() // Some('foo')
   * const none = Option.None()
   * none.flatten() // None
   * ```
   */
  flatten (): Option<FlattenOption<T>> {
    return this.value.flatten()
  }


  /**
   * Returns the value inside the optional after applying the given transformation. If the
   * optional is empty it returns the default value
   *
   * @param defaultValue - The default value to return if the Option instance does not contain a value.
   * @param mapFn - The mapping function to apply to the value.
   * @returns The transformed contained value, or the provided default.
   *
   * @example
   * ```ts
   * const some = Option.Some(5)
   * const result = some.mapOr(0, value => value * 2) // 10
   * const none = Option.None<number>()
   * const result2 = none.mapOr(0, value => value * 2) // 0
   * ```
   */
  mapOr<U> (defaultValue: U, mapFn: Transformation<T, U>): U {
    return this.map(mapFn).unwrapOr(defaultValue)
  }

  /**
   * Returns the value inside the optional after applying the given transformation. If the
   * optional is empty it execs the generator function and returns the result of it.
   *
   * The generator function is not called if there is a value.
   *
   * @param defFn - The default value generation function to call if the Option instance
   * does not contain a value.
   * @param mapFn - The mapping function to apply to the value.
   * @returns The transformed value, or the default generated value.
   *
   * @example
   * ```ts
   * const some = Option.Some(5)
   * const result = some.mapOrElse(() => 0, value => value * 2) // 10
   * const none = Option.None<number>()
   * const result2 = none.mapOrElse(() => 0, value => value * 2) // 0
   * ```
   */
  mapOrElse<U> (defFn: () => U, mapFn: Transformation<T, U>): U {
    return this.map(mapFn).unwrapOrElse(defFn)
  }

  /**
   * Combines 2 options into an option with a tuple of size 2 inside.
   * In case tha any of the options (this, or the argument) is none, the result is going to be none.
   *
   * @param another - The other Option instance to combine with.
   * @typeParam U - The type of the value that the other Option may contain.
   * @returns A new Option typed with a tuple of the 2 values.
   *
   * @example
   * ```ts
   * const some1 = Option.Some('foo')
   * const some2 = Option.Some(5)
   * const result = some1.zip(some2) // Some(['foo', 5])
   * const none = Option.None()
   * const result2 = some1.zip(none) // None
   * ```
   */
  zip<U> (another: Option<U>): Option<[T, U]> {
    return this.value.zip(another.value)
  }


  /**
   * Combines 2 options and then applies a transformation. The result is an option
   * types as the result of the transformation. If any of the original options
   * is empty the result will be empty.
   *
   * @param another - The other Option instance to combine with.
   * @param zipWithFn - The transformation function to apply to the
   * values of both Option instances.
   * @typeParam U - The type of the value that the other Option may contain.
   * @typeParam V - The type returned by the transformation.
   * @returns A new Option containing the result of applying the transformation
   * function to both values if both Option instances contain a value,
   * otherwise an Option without a value.
   *
   * @example
   * ```ts
   * const some1 = Option.Some('foo')
   * const some2 = Option.Some(5)
   * const result = some1.zipWith(some2, (a, b) => a + b) // Some('foo5')
   * const none = Option.None()
   * const result2 = some1.zipWith(none, (a, b) => a + b) // None
   * ```
   */
  zipWith<U, V> (another: Option<U>, zipWithFn: ZipTransformation<T, U, V>): Option<V> {
    return this.zip(another).map(([t, u]) => zipWithFn(t, u))
  }

  /**
   * Returns a new option that is only present if both values (this, and the argument)
   * are present. The value returned is the value contained in the option received as argument.
   *
   * This method behaves similar to the `&&` operator, but translated to optional values instead
   * of booleans.
   *
   * @param another - Another optional value.
   * @typeParam V - The type of the value that the other Option may contain.
   * @returns The result of applying an `and` operation between the 2 optionals.
   *
   * @example
   * ```ts
   * const some = Option.Some('foo')
   * const another = Option.Some(5)
   * const result = some.and(another) // Some(5)
   * const none = Option.None()
   * const result2 = none.and(another) // None
   * const result3 = some.and(none) // None
   * ```
   */
  and<V> (another: Option<V>): Option<V> {
    return this.value.and(another)
  }


  /**
   * Returns a new Option instance that is only present if any of the instances
   * (this, and the argument) are present.
   * If `this` is present it returns the value contained in `this`. Otherwise returns
   * the value contained in the argument
   *
   * This operation behaves similar to the `||` but adapted from booleans to options.
   *
   * @param another - The other Option instance to combine with.
   * @returns A new option only present if any is present
   *
   * @example
   * ```ts
   * const some = Option.Some('foo')
   * const another = Option.Some('bar')
   * const result = some.or(another) // Some('foo')
   * const none = Option.None()
   * const result2 = none.or(another) // Some('bar')
   * const result3 = some.or(none) // Some('foo')
   * const result4 = none.or(none) // None
   * ```
   */
  or (another: Option<T>): Option<T> {
    return this.value.or(this, another)
  }

  /**
   * Returns a new Option instance that is only present if exactly one of the instances
   * (this, and the argument) are present. The value is the value of the present optional
   * or None if both are None.
   *
   * This operation behaves similar to the `xor` (exclusive or) operation but
   * adapted from booleans to options.
   *
   * @param another - The other Option instance to combine with.
   * @returns A new Option instance that is only present if exactly one of the instances (this, and the argument) are present.
   *
   * @example
   * ```ts
   * const some = Option.Some('foo')
   * const another = Option.Some('bar')
   * const result = some.xor(another) // None
   * const none = Option.None()
   * const result2 = none.xor(another) // Some('bar')
   * const result3 = some.xor(none) // Some('foo')
   * const result4 = none.xor(none) // None
   * ```
   */
  xor (another: Option<T>): Option<T> {
    return this.value.xor(another.value)
  }

  /**
   * Similar to {@link Option.and | `and` }, but allowing the second optional to be generated
   * lazily. The provided fn is not executed if `this` is None.
   *
   * @param fn - Function to generate the second option. It takes the
   * content of the current instance as argument.
   * @typeParam U - The type returned by the given function.
   * @returns A new option only present if this is Some and the result
   * of the function is Some. The value is the one returned by the function.
   *
   * @example
   * ```ts
   * const some = Option.Some(5)
   * const newSome = some.andThen(value => Option.Some(value * 2)) // Some(10)
   * const none = Option.None<number>()
   * const newNone = none.andThen(value => Option.Some(value * 2)) // None
   * ```
   */
  andThen<U> (fn: TransformToOption<T, U>): Option<U> {
    return this.value.andThen(fn)
  }

  /**
   * Similar to {@link Option.or | `or`} but allowing to generate the second option
   * lazily. The generator fn will only be called if needed.
   *
   * @param fn - function to generate an optional value to test agains
   * `this`.
   * @returns A new option only present if any of the options is present.
   *
   * @example
   * ```ts
   * const some = Option.Some('foo')
   * const result = some.orElse(() => Option.Some('bar')) // Some('foo')
   * const none = Option.None()
   * const result2 = none.orElse(() => Option.Some('bar')) // Some('bar')
   * const result3 = none.orElse(() => Option.None()) // None
   * ```
   */
  orElse (fn: GenerateOption<T>): Option<T> {
    return this.value.orElse(fn)
  }

  /**
   * Inserts a value into the Option instance, replacing the current value if it exists.
   *
   * @param value - The value to be inserted into the Option instance.
   * @returns The Option instance itself.
   *
   * @example
   * ```ts
   * const none = Option.None()
   * none.insert('foo') // Some('foo')
   * const some = Option.Some('bar')
   * some.insert('foo') // Some('foo')
   * ```
   */
  insert (value: T): Option<T> {
    this.value = new Some(value)
    return this
  }

  /**
   * If the instance contains a value returns that value.
   * If the instance is empty it inserts the value provided by argument, and returns the value.
   *
   * Notice that if the instance already had a value this method does not replace it and the
   * argument is ignored.
   *
   * @param value - The value to be inserted and returned if the instance is None.
   * @returns The value contained in the Option instance after the operation.
   *
   * @example
   * ```ts
   * const opt1 = Option.None()
   * opt1.getOrInsert('foo') // 'foo'
   * opt1.isPresent() // true
   *
   * const opt2 = Option.Some('bar')
   * opt2.getOrInsert('foo') // 'bar'
   * ```
   */
  getOrInsert (value: T): T {
    this.value = this.value.getOrInsert(value)
    return this.unwrap()
  }

  /**
   * Similar to {@link Option.insert | `insert` } but allowing the inserted value to be calculated
   * lazily.
   *
   * If the instance is Some the value inside the option is present and the generator
   * function is ignored.
   *
   * If the instance is None, the provided function is called, and the result is inserted
   * into the instance and returned.
   *
   * @param fn - Function to generate the value to insert and return in case of none.
   * @returns The value contained in the Option instance after the operation.
   *
   * @example
   * ```ts
   * const opt1 = Option.None()
   * opt1.getOrInsertWith(() => 'foo') // 'foo'
   * opt1.isPresent() // true
   *
   * const opt2 = Option.Some('bar')
   * opt2.getOrInsertWith(() => 'foo') // 'bar'
   * ```
   */
  getOrInsertWith (fn: Generator<T>): T {
    this.value = this.value.getOrInsertWith(fn)
    return this.unwrap()
  }

  /**
   * Takes the value inside the instance and returned inside a new Option.
   *
   * If the instance is Some, it gets transformed into None
   *
   * If the instance is None, it gets unnafected and theresult is None.
   *
   * @returns A new Option instance containing the value originally
   * contained in the Option instance.
   *
   * @example
   * ```ts
   * const opt1 = Option.Some('foo')
   * const taken = opt1.take() // Some('foo')
   * opt1.isNone() // true
   * const none = Option.None()
   * const takenFromNone = none.take() // None
   * none.isNone() // true
   * ```
   */
  take (): Option<T> {
    const takeValue = this.value.takeValue()
    this.value = new None()
    return takeValue
  }

  /**
   * Replaces the contained value of an option with the one provided as argument.
   *
   * @param newValue - The new value to be inserted into the Option instance.
   * @returns A new Option instance containing the old value.
   *
   * @example
   * ```ts
   * const opt1 = Option.Some('foo')
   * const oldSome = opt1.replace('bar') // Some('foo')
   * opt1.unwrap() // 'bar'
   * const opt2 = Option.None()
   * const oldNone = opt2.replace('foo') // None
   * opt2.unwrap() // 'foo'
   * ```
   */
  replace (newValue: T): Option<T> {
    const oldValue = this.value
    this.value = new Some(newValue)
    return new Option<T>(oldValue)
  }

  /**
   * Returns true if and only if the current instance is Some and the value fulfills the given
   * predicate.
   *
   * This is the options equivalent to do something like the following but in the world
   * of optionals.
   *
   * ```ts
   * if (a && myCondition(a)) {
   *   //...
   * }
   * ```
   *
   * @param andFn - The predicate function to apply to the contained value.
   * @returns Returns true if the Option instance contains a value and the predicate
   * function returns true when applied to the value, otherwise false.
   *
   * @example
   * ```ts
   * const some = Option.Some(5)
   * const result = some.isSomeAnd(value => value > 3) // true
   * const none = Option.None<number>()
   * const result2 = none.isSomeAnd(value => value > 3) // false
   * ```
   */
  isSomeAnd (andFn: Predicate<T>): boolean {
    return this.value.isSomeAnd(andFn)
  }

  /**
   * Returns true if and only if the current instance is Some and the value does not fulfill the given
   * predicate.
   *
   * This is the options equivalent to do something like the following but in the world
   * of optionals.
   *
   * ```ts
   * if (a && !myCondition(a)) {
   *   //...
   * }
   * ```
   *
   * @param condition - The predicate function to apply to the contained value.
   * @returns Returns true if the Option instance contains a value and the predicate
   * function returns false when applied to the value, otherwise true.
   *
   * @example
   * ```ts
   * const some = Option.Some(5)
   * const result = some.isSomeBut(value => value > 3) // false
   * const none = Option.None<number>()
   * const result2 = none.isSomeBut(value => value > 3) // false
   * ```
   */
  isSomeBut (condition: Predicate<T>) {
    return this.value.isSomeAnd((t) => !condition(t))
  }

  /**
   * Allows to execute a block of code only if the instance is Some. It always
   * returns the current instance.
   *
   * It also allows to expressive chains like this:
   *
   * ```ts
   * let opt: Option<number>
   * opt.ifSome((value) => {
   *   console.log(`value: ${value}`)
   * }).orElse(() => {
   *   console.log('no value')
   * })
   * ```
   *
   * @param fn - Function executed if instance is some.
   * @returns Itself.
   *
   * @example
   * ```ts
   * const some = Option.Some('foo')
   * const res1 = some.ifSome(value => console.log(value)) // logs 'foo' to the console
   * res1 === some // true
   * const none = Option.None()
   * const res2 = none.ifSome(value => console.log(value)) // does nothing
   * res2 === none // true
   * ```
   */
  ifSome (fn: (t: T) => void): Option<T> {
    this.value.ifSome(fn)
    return this
  }

  /**
   * Executes the provided function if the Option instance does not contain a value.
   * It always returns itself.
   *
   * It's a nice method to chain with others
   *
   * ```ts
   * const a: Option<number>
   *
   * a.ifNone(() => {
   *   // ... do something
   * }).andThen((value) => {
   *   // ... only executed if the first block was not.
   * })
   * ```
   *
   * @param fn - The function to execute if the Option instance does not contain a value.
   * @returns The Option instance itself.
   *
   * @example
   * ```ts
   * const some = Option.Some('foo')
   * some.ifNone(() => console.log('No value')) // does nothing
   * const none = Option.None()
   * none.ifNone(() => console.log('No value')) // logs 'No value' to the console
   * ```
   */
  ifNone (fn: () => void): Option<T> {
    this.value.ifNone(fn)
    return this
  }

  /**
   * Useful to evaluate what's inside the optional.
   * If the instance is Some it executes the block of code with the value as argument.
   * No mutability is done.
   * Nonthing is returned.
   *
   * If the instance is None, nothing happens.
   *
   * @param param - Function to exec if there is value inside.
   *
   * @example
   * ```ts
   * const some = Option.Some('foo')
   * some.inspect(value => console.log(value)) // logs 'foo' to the console
   * const none = Option.None()
   * none.inspect(value => console.log(value)) // does nothing
   * ```
   */
  inspectContent (param: (t: T) => void) {
    this.ifSome(param)
  }

  /**
   * If the instance is None returns None.
   * If the value inside the instnace pass the predicate, the instance gets transformed to None
   * and the value is returned
   *
   * @param param - The predicate function to apply to the value.
   * @returns A new option with the filtered value.
   *
   * @example
   * ```ts
   * const opt1 = Option.Some(5)
   * const result1 = opt1.takeIf(value => value > 3) // Some(5)
   * opt1.isNone() // true
   * const opt2 = Option.Some(2)
   * const result2 = opt2.takeIf(value => value > 3) // Some(5)
   * opt2.isSome() // true
   * opt2.unwrap() // 2
   * const opt3 = Option.None<number>()
   * const result3 = opt3.takeIf(value => value > 3) // None
   * opt3.isNone() // true
   * ```
   */
  takeIf (param: Predicate<T>): Option<T> {
    return this.filter(param).andThen(() => this.take())
  }

  /**
   * Converts the Option instance to an array.
   * If the instance is None it returns an empty array
   * If the instance is Some it returns an array of size 1 containing the value.
   *
   * @returns An array with the content of the option.
   *
   * @example
   * ```ts
   * const some = Option.Some('foo')
   * some.toArray() // ['foo']
   * const none = Option.None()
   * none.toArray() // []
   * ```
   */
  toArray (): T[] {
    return this.value.toArray()
  }


  equals (another: Option<T>): boolean {
    return this.value.equals(another.value)
  }

  equalsBy (another: Option<T>, equality: AreEqual<T>): boolean {
    return this.value.equalsBy(another.value, equality)
  }
}
