import {describe, it} from 'mocha'
import {expect} from 'chai'
import {Option} from "../src/index.js"

describe('Option', () => {
  describe('#isSome', () => {
    it('None is not present', () => {
      const opt = Option.None()
      expect(opt.isSome()).to.eql(false)
    })

    it('Some is present', () => {
      const opt = Option.Some(1)
      expect(opt.isSome()).to.eql(true)
    })
  })

  describe('#isNone', () => {
    it('None is absent', () => {
      const opt = Option.None()
      expect(opt.isNone()).to.eql(true)
    })

    it('Some is not absent', () => {
      const opt = Option.Some(1)
      expect(opt.isNone()).to.eql(false)
    })
  })


  describe('#isSomeAnd', () => {
    it('none returns false', () => {
      const none = Option.None()
      const res = none.isSomeAnd(() => true)
      expect(res).to.eql(false)
    })

    it('none does not call the fn', () => {
      const none = Option.None()
      let called = false
      none.isSomeAnd(() => {
        called = true
        return true
      })
      expect(called).to.eql(false)
    })

    it('some returns false when the fn returns false', () => {
      const some = Option.Some(123)
      const res = some.isSomeAnd((_) => false)
      expect(res).to.eql(false)
    })

    it('some returns true when the fn returns true', () => {
      const some = Option.Some(123)
      const res = some.isSomeAnd((_) => true)
      expect(res).to.eql(true)
    })

    it('some calls the fn', () => {
      const some = Option.Some(123)
      let called = false
      some.isSomeAnd((_) => {
        called = true
        return true
      })
      expect(called).to.eql(true)
    })

    it('returns calls the fn with using its internal value as the argument', () => {
      const obj = {}
      const some: Option<object> = Option.Some(obj)
      some.isSomeAnd((o) => {
        expect(o).to.equal(obj)
        return true
      })
    })
  })

  describe('#isSomeBut', () => {
    it('none returns false', () => {
      const none = Option.None()
      const res = none.isSomeBut(() => true)
      expect(res).to.eql(false)
    })

    it('none does not call the fn', () => {
      const none = Option.None()
      let called = false
      none.isSomeBut(() => {
        called = true
        return true
      })
      expect(called).to.eql(false)
    })

    it('some returns true when the fn returns false', () => {
      const some = Option.Some(123)
      const res = some.isSomeBut((_) => false)
      expect(res).to.eql(true)
    })

    it('some returns false when the fn returns true', () => {
      const some = Option.Some(123)
      const res = some.isSomeBut((_) => true)
      expect(res).to.eql(false)
    })

    it('some calls the fn', () => {
      const some = Option.Some(123)
      let called = false
      some.isSomeBut((_) => {
        called = true
        return true
      })
      expect(called).to.eql(true)
    })

    it('returns calls the fn with using its internal value as the argument', () => {
      const obj = {}
      const some: Option<object> = Option.Some(obj)
      some.isSomeBut((o) => {
        expect(o).to.equal(obj)
        return true
      })
    })
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
      const flattened = none.flatten()
      expect(flattened.isNone()).to.eql(true)
    })

    it('some of some of t returns some of t', () => {
      const some = Option.Some(Option.Some(1))
      const flattened = some.flatten()
      expect(flattened.isSome()).to.eql(true)
      expect(flattened.unwrap()).to.eql(1)
    })

    it('some of t returns some of t', () => {
      const some = Option.Some(1)
      const flattened = some.flatten()
      expect(flattened.isSome()).to.eql(true)
      expect(flattened.unwrap()).to.eql(1)
    })

    it('some of some of some of t returns some of some of t', () => {
      const obj = {}
      const some = Option.Some(Option.Some(Option.Some(obj)))
      const flattened = some.flatten()
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
      some.mapOr(-1, a => {
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
      some.mapOrElse(() => -1, a => {
        expect(a).to.equal(obj)
        called = true
        return 10
      })
      expect(called).to.eql(true)
    })
  })

  describe('#zip', () => {
    it('none returns None when receives None as argument', () => {
      const none = Option.None()
      const arg = Option.None()
      const zipped = none.zip(arg)
      expect(zipped.isNone()).to.eql(true)
    })

    it('none returns None when receives Some as argument', () => {
      const none = Option.None()
      const arg = Option.Some(10)
      const zipped = none.zip(arg)
      expect(zipped.isNone()).to.eql(true)
    })

    it('Some returns None when recieves None', () => {
      const some = Option.Some(10)
      const arg = Option.None()
      const zipped = some.zip(arg)
      expect(zipped.isNone()).to.eql(true)
    })

    it('Some returns Some with both values when receives another Some', () => {
      const some = Option.Some(10)
      const arg = Option.Some('foo')
      const zipped = some.zip(arg)
      expect(zipped.unwrap()).to.eql([10, 'foo'])
    })
  })

  describe('#zipWith', () => {
    it('None returns None when receives None as parameter', () => {
      const none = Option.None()
      const arg = Option.None()
      const res = none.zipWith(arg, (_a, _b) => { expect.fail('should not be called')})
      expect(res.isNone()).to.eql(true)
    })

    it('None returns None when receives Some as parameter', () => {
      const none = Option.None()
      const arg = Option.Some(10)
      const res = none.zipWith(arg, (_a, _b) => { expect.fail('should not be called')})
      expect(res.isNone()).to.eql(true)
    })

    it('Some returns None when receives None as parameter', () => {
      const none = Option.Some(10)
      const arg = Option.None()
      const res = none.zipWith(arg, (_a, _b) => { expect.fail('should not be called')})
      expect(res.isNone()).to.eql(true)
    })

    it('when Some receives Some it returns Some with the content of applying the map function', () => {
      const none = Option.Some(3)
      const arg = Option.Some('a')
      const res = none.zipWith(arg, (a, b) => b.repeat(a))
      expect(res.unwrap()).to.eql('aaa')
    })
  })

  describe('#and', () => {
    it('none and none returns none', () => {
      const none = Option.None()
      const arg = Option.None()
      const res = none.and(arg)
      expect(res).to.eql(Option.None())
    })

    it('none and some returns none', () => {
      const none = Option.None()
      const arg = Option.Some(123)
      const res = none.and(arg)
      expect(res).to.eql(Option.None())
    })

    it('some and none returns none', () => {
      const some = Option.Some(123)
      const arg = Option.None()
      const res = some.and(arg)
      expect(res).to.eql(Option.None())
    })

    it('some and some returns some with the value and type of the parameter', () => {
      const some = Option.Some(123)
      const arg = Option.Some('foo')
      const res = some.and(arg)
      expect(res).to.eql(Option.Some('foo'))
    })

    it('some and some returns exactly the same instance sent as argument', () => {
      const some = Option.Some(123)
      const arg = Option.Some('foo')
      const res = some.and(arg)
      expect(res).to.equal(arg)
    })
  })

  describe('#or', () => {
    it('none or none returns none', () => {
      const none = Option.None()
      const arg = Option.None()
      const res = none.or(arg)
      expect(res.isNone()).to.eql(true)
    })

    it('none or some returns the some given as arg', () => {
      const none = Option.None()
      const obj = {}
      const arg = Option.Some(obj)
      const res = none.or(arg)
      expect(res.unwrap()).to.equal(obj)
    })

    it('some or none returns the first some', () => {
      const obj = {}
      const some = Option.Some(obj)
      const arg: Option<object> = Option.None()
      const res = some.or(arg)
      expect(res.unwrap()).to.equal(obj)
    })

    it('some or none returns exactly the same instance', () => {
      const some = Option.Some(123)
      const arg: Option<number> = Option.None()
      const res = some.or(arg)
      expect(res).to.equal(some)
    })

    it('some or some returns the first some', () => {
      const str = 'foo'
      const some = Option.Some(str)
      const arg = Option.Some('bar')
      const res = some.or(arg)
      expect(res.unwrap()).to.equal(str)
    })
  })

  describe('#xor', () => {
    it('None xor None returns None', () => {
      const none = Option.None()
      const arg = Option.None()
      const res = none.xor(arg)
      expect(res).to.eql(Option.None())
    })

    it('None xor Some returns the Some given as arg', () => {
      const none = Option.None()
      const value = {}
      const arg = Option.Some(value)
      const res = none.xor(arg)
      expect(res.unwrap()).to.eql(value)
    })

    it('Some xor None returns the Some with the first value', () => {
      const value = {}
      const some = Option.Some(value)
      const arg: Option<object> = Option.None()
      const res = some.xor(arg)
      expect(res.unwrap()).to.eql(value)
    })

    it('Some xor Some returns None', () => {
      const some = Option.Some(123)
      const arg = Option.Some(456)
      const res = some.xor(arg)
      expect(res.isNone()).to.eql(true)
    })
  })

  describe('#andThen', () => {
    it('none receives a function that returns none, the result is none', () => {
      const none: Option<number> = Option.None()
      const fn = (_a: number) => Option.None()
      const res = none.andThen(fn)
      expect(res.isNone()).to.eql(true)
    })

    it('some receives a function that returns some, the result is some of the result', () => {
      const some: Option<number> = Option.Some(10)
      const fn = (_a: number) => Option.Some('foo')
      const res = some.andThen(fn)
      expect(res.unwrap()).to.eql('foo')
    })

    it('some receives a function that returns none, the result is none', () => {
      const some: Option<number> = Option.Some(10)
      const fn = (_a: number) => Option.None()
      const res = some.andThen(fn)
      expect(res.isNone()).to.eql(true)
    })

    it('none receives a function that returns some, the result is none', () => {
      const none: Option<number> = Option.None()
      const fn = (_a: number) => Option.Some(10)
      const res = none.andThen(fn)
      expect(res.isNone()).to.eql(true)
    })

    it('sends the right argument to the callback', () => {
      const obj = {}
      const some: Option<object> = Option.Some(obj)
      let called = false
      some.andThen((a) => {
        expect(a).to.equal(obj)
        called = true
        return Option.None()
      })
      expect(called).to.eql(true)
    })

    it('does not call the callback when returns none', () => {
      const none: Option<object> = Option.None()
      let called = false
      none.andThen(() => {
        called = true
        return Option.None()
      })
      expect(called).to.eql(false)
    })
  })

  describe('#orElse', () => {
    it('none with a function that returns none is none', () => {
      const none = Option.None()
      const fn = () => Option.None()
      const res = none.orElse(fn)
      expect(res.isNone()).to.eql(true)
    })

    it('Some with a function that returns none is the original some', () => {
      const none = Option.None()
      const fn = () => Option.None()
      const res = none.orElse(fn)
      expect(res.isNone()).to.eql(true)
    })

    it('none with a function that returns some gets some with the returned option of the fn', () => {
      const none: Option<number> = Option.None()
      const fn = () => Option.Some(10)
      const res = none.orElse(fn)
      expect(res.unwrap()).to.eql(10)
    })

    it('some with a function that returns some gets some with the value of self', () => {
      const data = 'foo'
      const some = Option.Some(data)
      const fn = () => Option.Some('bar')
      const res = some.orElse(fn)
      expect(res.unwrap()).to.eql('foo')
    })
  })

  describe('#insert', () => {
    it('none gets transformed into some with the given value', () => {
      const option = Option.None()
      option.insert(10)
      expect(option.unwrap()).to.eql(10)
    })

    it('some replace the old value with the one given as argument', () => {
      const option = Option.Some(123)
      option.insert(456)
      expect(option.unwrap()).to.eql(456)
    })
  })

  describe('#getOrInsert', () => {
    it('none returns the value given by default.', () => {
      const none = Option.None()
      const res = none.getOrInsert(123)
      expect(res).to.eql(123)
    })

    it('none gets converted into some with the value.', () => {
      const option = Option.None()
      option.getOrInsert(123)
      expect(option.unwrap()).to.eql(123)
    })

    it('some returns the value contained inside and ignores the argument.', () => {
      const some = Option.Some(123)
      const res = some.getOrInsert(456)
      expect(res).to.eql(123)
    })

    it('some keeps its original value.', () => {
      const some = Option.Some(123)
      some.getOrInsert(456)
      expect(some.unwrap()).to.eql(123)
    })
  })

  describe('#getOrInsertWith', () => {
    it('none returns the result of evaluating the generator fn', () => {
      const none = Option.None()
      const fn = () => 'foo'
      const res = none.getOrInsertWith(fn);
      expect(res).to.eql('foo')
    })

    it('none gets transformed into some with the value returned by the fn', () => {
      const option = Option.None()
      const fn = () => 'foo'
      option.getOrInsertWith(fn);
      expect(option.isSome()).to.eql(true)
      expect(option.unwrap()).to.eql('foo')
    })

    it('some returns the value stored from before', () => {
      const some = Option.Some(123)
      const fn = () => 456
      const res = some.getOrInsertWith(fn)
      expect(res).to.eql(123)
    })

    it('some does not change its value', () => {
      const some = Option.Some(123)
      const fn = () => 456
      some.getOrInsertWith(fn)
      expect(some.unwrap()).to.eql(123)
    })

    it('some does not evaluate the function', () => {
      const some = Option.Some(123)
      let called = false
      some.getOrInsertWith(() => {
        called = true
        return 456
      })
      expect(called).to.eql(false)
    })
  })

  describe('#take', () => {
    it('take from none returns none', () => {
      const none = Option.None()
      expect(none.take().isNone()).to.eql(true)
    })

    it('take from none leaves self as none', () => {
      const none = Option.None()
      none.take();
      expect(none.isNone()).to.eql(true)
    })

    it('some returns its contained value', () => {
      const some = Option.Some(123)
      const res = some.take();
      expect(res.unwrap()).to.eql(123)
    })

    it('some mutates into none', () => {
      const option = Option.Some(123)
      option.take();
      expect(option.isNone()).to.eql(true)
    })
  })

  describe('#takeIf', () => {
    it('none returns none', () => {
      const none = Option.None()
      const res = none.takeIf((_) => true)
      expect(res.isNone()).to.eql(true)
    })
    it('none does not call the fn', () => {
      const none = Option.None()
      let called = false
      none.takeIf((_) => {
        called = true
        return true
      })
      expect(called).to.eql(false)
    })

    it('some returns some with its value when predicate is true', () => {
      const some = Option.Some(123)
      const res = some.takeIf((_) => true)
      expect(res.isSome()).to.eql(true)
      expect(res.unwrap()).to.eql(123)
    })

    it('some mutates into none when predicate returns true', () => {
      const some = Option.Some(123)
      some.takeIf((_) => true)
      expect(some.isNone()).to.eql(true)
    })

    it('some returns none when preducate returns false', () => {
      const some = Option.Some(123)
      const res = some.takeIf((_) => false)
      expect(res.isNone()).to.eql(true)
    })

    it('some does not mutate when predicate returns false', () => {
      const some = Option.Some(123)
      some.takeIf((_) => false)
      expect(some.isSomeAnd(t => t === 123)).to.eql(true)
    })
  })

  describe('#replace', () => {
    it('none mutates into some with the given value', () => {
      const obj = {}
      const option: Option<object> = Option.None()
      option.replace(obj)
      expect(option.isSome()).to.eql(true)
      expect(option.unwrap()).to.equal(obj)
    })

    it('none returns none', () => {
      const obj = {}
      const none: Option<object> = Option.None()
      const res = none.replace(obj)
      expect(res.isNone()).to.eql(true)
    })

    it('some returns some with the old value', () => {
      const oldValue = 123
      const newValue = 456
      const some = Option.Some(oldValue)
      const res = some.replace(newValue)
      expect(res.isSome()).to.eql(true)
      expect(res.unwrap()).to.eql(oldValue)
    })

    it('some retains the new value inside', () => {
      const oldValue = 123
      const newValue = 456
      const some = Option.Some(oldValue)
      some.replace(newValue)
      expect(some.isSome()).to.eql(true)
      expect(some.unwrap()).to.eql(newValue)
    })
  })

  describe('#ifSome', () => {
    it('none does not call the fn', () => {
      const none = Option.None()
      let called = false
      none.ifSome((_) => {
        called = true
      })
      expect(called).to.eql(false)
    })

    it('some calls the fn', () => {
      const some = Option.Some(123)
      let called = false
      some.ifSome((t) => {
        expect(t).to.eql(123)
        called = true
      })
      expect(called).to.eql(true)
    })

    it('none returns none', () => {
      const none = Option.None()
      const res = none.ifSome((_) => {})
      expect(res.isNone()).to.eql(true)
    })

    it('some returns self', () => {
      const some = Option.Some(123)
      const res = some.ifSome((_) => {})
      expect(res.isSome()).to.eql(true)
      expect(res).to.equal(some)
    })
  })

  describe('#ifNone', () => {
    it('none calls the fn', () => {
      const none = Option.None()
      let called = false
      none.ifNone(() => {
        called = true
      })
      expect(called).to.eql(true)
    })

    it('some does not call the fn', () => {
      const some = Option.Some(123)
      let called = false
      some.ifNone(() => {
        called = true
      })
      expect(called).to.eql(false)
    })

    it('none returns none', () => {
      const none = Option.None()
      const res = none.ifNone(() => {})
      expect(res.isNone()).to.eql(true)
    })

    it('some returns self', () => {
      const some = Option.Some(123)
      const res = some.ifNone(() => {})
      expect(res.isSome()).to.eql(true)
      expect(res).to.equal(some)
    })
  })

  describe('#inspect', () => {
    it('none does not call the fn', () => {
      const none = Option.None()
      let called = false
      none.inspectContent((_) => {
        called = true
      })
      expect(called).to.eql(false)
    })

    it('some calls the fn with the right arg', () => {
      const some = Option.Some(123)
      let called = false
      some.inspectContent((arg) => {
        expect(arg).to.eql(123)
        called = true
      })
      expect(called).to.eql(true)
    })
  })

  describe('#toArray', () => {
    it('none returns an empty array', () => {
      const none = Option.None()
      expect(none.toArray()).to.eql([])
    })

    it('some returns an array with the value contained', () => {
      const obj = {}
      const some = Option.Some(obj)
      expect(some.toArray()).to.eql([obj])
    })
  })

  describe('Option.fromNullable', () => {
    it('returns none for null', () => {
      const option = Option.fromNullable(null)
      expect(option.isNone()).to.eql(true)
    })

    it('returns none for undefined', () => {
      const option = Option.fromNullable(undefined)
      expect(option.isNone()).to.eql(true)
    })

    it('returns some for a number', () => {
      const option = Option.fromNullable(10)
      expect(option.isSome()).to.eql(true)
      expect(option.unwrap()).to.eql(10)
    })

    it('returns some for a false', () => {
      const option = Option.fromNullable(false)
      expect(option.isSome()).to.eql(true)
      expect(option.unwrap()).to.eql(false)
    })

    it('returns some for a 0s', () => {
      const option = Option.fromNullable(0)
      expect(option.isSome()).to.eql(true)
      expect(option.unwrap()).to.eql(0)
    })
  })

  describe('#equals', () => {
    it('returns true for 2 nones', () => {
      const none1 = Option.None()
      const none2 = Option.None()
      expect(none1.equals(none2)).to.eql(true)
    })

    it('returns false for none and some', () => {
      const none = Option.None()
      const some = Option.Some(10)
      expect(none.equals(some)).to.eql(false)
    })

    it('returns false for some and none', () => {
      const some = Option.Some('foo')
      const none = Option.None<string>()
      expect(some.equals(none)).to.eql(false)
    })

    it('returns true for some and some with the same value', () => {
      const some1 = Option.Some('foo')
      const some2 = Option.Some('foo')
      expect(some1.equals(some2)).to.eql(true)
    })

    it('returns false for some and some with different value', () => {
      const some1 = Option.Some('foo')
      const some2 = Option.Some('bar')
      expect(some1.equals(some2)).to.eql(false)
    })
  })

  describe('#equalsWith', () => {
    it('returns true for 2 nones', () => {
      const none1 = Option.None()
      const none2 = Option.None()
      const eq = none1.equalsWith(none2, () => false);
      expect(eq).to.eql(true)
    })

    it('returns false for none and some', () => {
      const none = Option.None()
      const some = Option.Some(10)
      const eq = none.equalsWith(some, () => true);
      expect(eq).to.eql(false)
    })

    it('returns false for some and none', () => {
      const some = Option.Some(10)
      const none = Option.None<number>()
      const eq = some.equalsWith(none, () => true);
      expect(eq).to.eql(false)
    })

    it('returns false for some and some when equality fails', () => {
      const some1 = Option.Some(10)
      const some2 = Option.Some(10)
      const eq = some1.equalsWith(some2, () => false);
      expect(eq).to.eql(false)
    })

    it('returns true for some and some when equality returns true', () => {
      const some1 = Option.Some(1)
      const some2 = Option.Some(22)
      const eq = some1.equalsWith(some2, () => true);
      expect(eq).to.eql(true)
    })

    it('sends right parameter to equality', () => {
      const obj1 = {}
      const obj2 = {}
      const some1 = Option.Some(obj1)
      const some2 = Option.Some(obj2)
      let called = false
      some1.equalsWith(some2, (a, b) => {
        expect(a).to.equals(obj1)
        expect(b).to.equals(obj2)
        called = true
        return true
      });
      expect(called).to.eql(true)
    })
  })
})