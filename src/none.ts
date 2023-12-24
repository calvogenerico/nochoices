import {OptionalValue} from "./optional-value.js";
import {Option} from "./option.js";

export class None<T> extends OptionalValue<T> {
  isPresent (): boolean {
    return false;
  }

  isAbsent (): boolean {
    return true;
  }

  unwrap (): T {
    throw new Error('unwrap over None.')
  }

  map<M> (_fn: (a: T) => M): Option<M> {
    return Option.None()
  }

  filter (_fn: (a: T) => boolean): Option<T> {
    return Option.None();
  }
}