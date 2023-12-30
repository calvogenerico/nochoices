import {Option} from "./option.js";

export type OptionDuo<A, B> = [Option<A>, Option<B>]
export function unzip<A, B> (opt: Option<[A, B]>): OptionDuo<A, B> {
  return opt.map<OptionDuo<A, B>>(([a, b]) => [Option.Some(a), Option.Some(b)])
      .unwrapOr([Option.None<A>(), Option.None<B>()])
}