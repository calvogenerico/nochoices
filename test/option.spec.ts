import { describe, it } from 'mocha'
import {expect} from 'chai'
import {Option} from "../src/index.js";

describe('Option', () => {
  it('None is absent', () => {
    let opt = Option.None()
    expect(opt.isAbsent()).to.eql(true)
  })

  it('None is not present', () => {
    let opt = Option.None()
    expect(opt.isPresent()).to.eql(false)
  })

  it('Some is present', () => {
    let opt = Option.Some(1)
    expect(opt.isPresent()).to.eql(true)
  })

  it('Some is not absent', () => {
    let opt = Option.Some(1)
    expect(opt.isAbsent()).to.eql(false)
  })

  describe('map', () => {
    it('None returns none', () => {
      let opt: Option<number> = Option.None()
      let mapped = opt.map((a) => a + 1)
      expect(mapped.isAbsent())
    })

    it('None returns none', () => {
      let opt = Option.Some(1)
      let mapped = opt.map((a) => a + 1)
      expect(mapped.isPresent())
      expect(mapped.unwrap()).to.eql(2)
    })
  })
})