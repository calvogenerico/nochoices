import {OptionalValue} from "./optional-value.js";
import {FlattenOption, Option} from "./option.js";

export class Some<T> extends OptionalValue<T> {
  value: T

  constructor (value: T) {
    super();
    this.value = value
  }

  isPresent (): boolean {
    return true;
  }

  isAbsent (): boolean {
    return false;
  }

  unwrap (): T {
    return this.value
  }

  map<M> (fn: (a: T) => M): Option<M> {
    const newValue = fn(this.value)
    return Option.Some(newValue);
  }

  filter (fn: (a: T) => boolean): Option<T> {
    const res = fn(this.value);
    if (res) {
      return Option.Some(this.value)
    }
    return Option.None();
  }

  expect (_err: Error): T {
    return this.value;
  }

  unwrapOr (_defaultValue: T): T {
    return this.value;
  }

  unwrapOrElse (_defaultFn: () => T): T {
    return this.value;
  }

  flatten (): Option<FlattenOption<T>> {
    if (this.value instanceof Option) {
      return this.value
    } else {
      return Option.Some(this.value) as Option<FlattenOption<T>>
    }
  }

  mapOr<U> (_defaultValue: U, mapFn: (value: T) => U): U {
    return mapFn(this.value);
  }

  mapOrElse<U> (_defFn: () => U, mapFn: (value: T) => U): U {
    return mapFn(this.value);
  }
}