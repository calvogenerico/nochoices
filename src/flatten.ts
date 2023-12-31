import {Option} from "./option.js"

export function flatten<T>(opt: Option<Option<T>>): Option<T> {
  return opt.unwrapOr(Option.None())
}