import {describe} from "mocha";
import {Option} from "../src/index.js";
import {unzip} from "../src/unzip.js";
import {expect} from "chai";

describe('unzip', () => {
  it('for none returns [none, none]', () => {
    const none: Option<[number, string]> = Option.None()
    const unzipped = unzip(none)
    expect(unzipped).to.eql([Option.None<number>(), Option.None<string>()])
  })

  it('for some returns an array of size 2 with the unzipped optionals', () => {
    const none: Option<[number, string]> = Option.Some([123, 'foo'])
    const unzipped = unzip(none)
    expect(unzipped).to.eql([Option.Some(123), Option.Some('foo')])
  })
})