import {describe} from "mocha"
import {Option} from "../src/index.js"
import {flatten} from "../src/flatten.js"
import {expect} from "chai"

describe('flatten', () => {
  it('decrease one level of optional nesting for some of some of 1', () => {
    const someOfSome = Option.Some(Option.Some(1))
    const flat = flatten(someOfSome)
    expect(flat.unwrap()).to.eql(1)
  })


  it('decrease one level of optional nesting for some of some of some of 1', () => {
    const someOfSome = Option.Some(Option.Some(Option.Some(1)))
    const flat = flatten(someOfSome)
    expect(flat.unwrap().unwrap()).to.eql(1)
  })

  it('returns None for None', () => {
    const someOfSome = Option.Some(Option.Some(Option.None()))
    const flat = flatten(someOfSome)
    expect(flat.unwrap().isNone()).to.eql(true)
  })
})