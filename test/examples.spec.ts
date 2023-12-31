import {describe} from "mocha";
import {Option} from "../src/index.js";
import {expect} from "chai";

describe('compare optional vs nullable', () => {
  it('get or fail', () => {
    const optional = Option.Some(10)
    const nullable: number | null = 10

    expect(optional.unwrap()).to.eql(10) // Typesafe, throws an error if absent
    expect(nullable!).to.eql(10) // Non type safe. If absent it simply returns null
  })

  it('transform value', () => {
    const plus1 = (n: number) => n + 1

    const optional = Option.Some(10)
    const nullable: number | null = 10

    expect(optional.map(plus1).expect(new Error())).to.eql(11) // typesafe, easy to read
    expect(nullable && plus1(nullable)).to.eql(11) // Non type safe. Syntax abuse, harder to read.
  })

  it('complex transformation', () => {
    const isEven = (n: number) => n % 2 === 0
    const plus1 = (n: number) => n + 1

    const optional = Option.Some(10)
    const nullable: number | null = 10

    expect(
        optional.filter(isEven).map(plus1).unwrapOr(-1)
    ).to.eql(11) // Simple logic easy to read.

    expect(
        nullable ?? isEven(nullable) ? plus1(nullable) : -1
    ).to.eql(11) // Abuse of syntax, harder to read and understand.
  })
})