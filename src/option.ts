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

  flatten (): Option<FlatteOption<T>> {
    if (this.isSome()) {
      const inner = this.unwrap();
      if (inner instanceof Option) {
        return inner
      } else {
        return this as Option<FlatteOption<T>>
      }
    } else {
      return Option.None()
    }
  }
}
// Option<1>

// Option<Option<1>>

// export type FlatOption<T> = T extends Option<infer U>
//     ? (U extends Option<infer V>
//         ? Option<V>
//         : Option<U>
//         )
//     : Option<T>

// export type FlatOption<T> = T extends Option<infer U>
//     ? (U extends Option<any>? FlatOption<U> : U)
//     : T

export type FlatteOption<T> = T extends Option<infer U>
    ? U
    : T