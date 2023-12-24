import {describe, it} from 'mocha'
import {expect} from 'chai'
import {Option} from "../src/index.js";

describe('Option', () => {
  it('None is absent', () => {
    const opt = Option.None()
    expect(opt.isNone()).to.eql(true)
  })

  it('None is not present', () => {
    const opt = Option.None()
    expect(opt.isSome()).to.eql(false)
  })

  it('Some is present', () => {
    const opt = Option.Some(1)
    expect(opt.isSome()).to.eql(true)
  })

  it('Some is not absent', () => {
    const opt = Option.Some(1)
    expect(opt.isNone()).to.eql(false)
  })

  describe('unwrap', () => {
    it('None.unwrap throws an error', () => {
      const none = Option.None()
      expect(() => none.unwrap()).to.throw(Error, 'unwrap over None.')
      expect(none.isNone()).to.eq(true)
    })

    it('Some.unwrap returns the contained value', () => {
      const obj = {}
      const none = Option.Some(obj)
      const value = none.unwrap()
      expect(value).to.equal(obj)
    })
  })

  describe('expect', () => {
    it('None.expect trows specified error', () => {
      const err = new Error('this is the error')
      const none = Option.None()
      expect(() => none.expect(err)).to.throw(Error, 'this is the error')
    })

    it('Some.expect returns the contained value', () => {
      const obj = {}
      const err = new Error('this is the error')
      const some = Option.Some(obj)
      expect(some.expect(err)).to.equal(obj)
    })
  })

  describe('map', () => {
    it('None returns none', () => {
      const opt: Option<number> = Option.None()
      const mapped = opt.map((a) => a + 1)
      expect(mapped.isNone())
    })

    it('None returns none', () => {
      const opt = Option.Some(1)
      const mapped = opt.map((a) => a + 1)
      expect(mapped.isSome())
      expect(mapped.unwrap()).to.eql(2)
    })

    it('can change the type of the option', () => {
      const opt1 = Option.Some(1)
      const opt2 = opt1.map(_ => 'a')
      expect(opt2.isSome())
      expect(opt2.unwrap()).to.eql('a')
    })
  })

  describe('filter', () => {
    it('None keeps none when the filterFn returns true', () => {
      const none = Option.None()
      const res = none.filter((_) => true)
      expect(res.isNone()).to.eql(true)
    })

    it('None keeps none when the filterFn returns false', () => {
      const none = Option.None()
      const res = none.filter((_) => false)
      expect(res.isNone()).to.eql(true)
    })

    it('Some keeps the value when the filterFn returns true', () => {
      const some = Option.Some(123)
      const res = some.filter((_) => true)
      expect(res.unwrap()).to.eql(123)
    })

    it('Some returns None when when the filterFn returns false', () => {
      const some = Option.Some(123)
      const res = some.filter((_) => false)
      expect(res.isNone()).to.eql(true)
    })

    it('Sends the right value to the fn', () => {
      const obj = {}
      const some = Option.Some(obj)
      let called = false
      const res = some.filter((a) => {
        expect(a).to.equal(obj)
        called = true
        return true
      })
      expect(res.isSome()).to.eql(true)
      expect(called).to.eql(true)
    })
  })
})