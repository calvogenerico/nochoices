import {Option} from "./option.js";

export abstract class OptionalValue<T> {
  abstract isPresent (): boolean

  abstract isAbsent (): boolean

  abstract unwrap (): T

  abstract map<M> (fn: (a: T) => M): Option<M>

  abstract filter (fn: (a: T) => boolean): Option<T>
}