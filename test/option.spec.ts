import {describe, it} from 'mocha'
import {expect} from 'chai'
import {Option} from "../src/index.js";
import {Some} from "../src/some.js";

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

  describe('#unwrap', () => {
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

  describe('#expect', () => {
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

  describe('#unwrap_or', () => {
    it('None returns the default value', () => {
      const none = Option.None()
      const defaultValue = 123
      expect(none.unwrapOr(defaultValue)).to.eql(123)
    })

    it('Some returns the contained value', () => {
      const value = { a: 123 }
      const some = Option.Some(value)
      const defaultValue = { a: 0 }
      expect(some.unwrapOr(defaultValue)).to.equal(value)
    })
  })

  describe('#unwrap_or_else', () => {
    it('None executes the provided function and returns that value', () => {
      const none = Option.None()
      const obj = {}
      let called = false
      expect(none.unwrapOrElse(() => {
        called = true
        return obj
      })).to.equal(obj)
      expect(called).to.eql(true)
    })
  })

  describe('#map', () => {
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

    it('some sends the inner value to the fn', () => {
      const obj = {}
      const some = Option.Some(obj)
      let called = false
      some.map((value) => {
        expect(value).to.equal(obj)
        called = true
        return value
      })
      expect(called).to.eql(true)
    })
  })

  describe('#filter', () => {
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

  describe('#flatten', () => {
    it('none keeps being none', () => {
      const none = Option.None()
      const flattened = none.flatten();
      expect(flattened.isNone()).to.eql(true)
    })

    it('some of some of t returns some of t', () => {
      const some = Option.Some(Option.Some(1))
      const flattened = some.flatten();
      expect(flattened.isSome()).to.eql(true)
      expect(flattened.unwrap()).to.eql(1)
    })

    it('some of t returns some of t', () => {
      const some = Option.Some(1)
      const flattened = some.flatten();
      expect(flattened.isSome()).to.eql(true)
      expect(flattened.unwrap()).to.eql(1)
    })

    it('some of some of some of t returns some of some of t', () => {
      const obj = {};
      const some = Option.Some(Option.Some(Option.Some(obj)))
      const flattened = some.flatten();
      expect(flattened.isSome()).to.eql(true)
      expect(flattened.unwrap().unwrap()).to.eql(obj)
    })
  })

  describe('#mapOr', () => {
    it('returns the default value for None', () => {
      const none = Option.None<number>()
      const mapped = none.mapOr(10, a => a + 1)
      expect(mapped).to.eql(10)
    })

    it('returns the transformed value when is some', () => {
      const some = Option.Some(10)
      const mapped = some.mapOr(-1, a => a + 1)
      expect(mapped).to.eql(11)
    })

    it('some sends the right value to map fn', () => {
      const obj = {}
      const some = Option.Some(obj)
      let called = false
      const mapped = some.mapOr(-1, a => {
        expect(a).to.equal(obj)
        called = true
        return 10
      })
      expect(called).to.eql(true)
    })
  })

  describe('#mapOrElse', () => {
    it('none returns execs the provided generator', () => {
      const n = 123123
      const none = Option.None<number>()
      const res = none.mapOrElse(() => n, (_) =>  10)
      expect(res).to.eql(n)
    })

    it('some returns maps the value', () => {
      const some = Option.Some(10)
      const res = some.mapOrElse(() => -1, a =>  a + 1)
      expect(res).to.eql(11)
    })

    it('sends the right argument to map fn', () => {
      const obj = {}
      const some = Option.Some(obj)
      let called = false
      const mapped = some.mapOrElse(() => -1, a => {
        expect(a).to.equal(obj)
        called = true
        return 10
      })
      expect(called).to.eql(true)
    })
  })
})