import {Option} from "./option.js";

export function flatten<T>(opt: Option<Option<T>>): Option<T> {
  if (opt.isSome()) {
    return opt.unwrap()
  } else {
    return Option.None()
  }
}