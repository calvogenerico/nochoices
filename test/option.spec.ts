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

  describe('unwrap', () => {
    it('None.unwrap throws an error', () => {
      let none = Option.None()
      expect(() => none.unwrap()).to.throw(Error, 'unwrap over None.')
      expect(none.isAbsent()).to.eq(true)
    })

    it('Some.unwrap returns the contained value', () => {
      const obj = {}
      let none = Option.Some(obj)
      let value = none.unwrap()
      expect(value).to.equal(obj)
    })
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

    it('can change the type of the option', () => {
      let opt1 = Option.Some(1)
      let opt2 = opt1.map(_ => 'a')
      expect(opt2.isPresent())
      expect(opt2.unwrap()).to.eql('a')
    })
  })
})