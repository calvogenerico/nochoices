# With the right Options there is no choice to make

This is the of the rust built in `Option` type ported to typescript.

## Why Options?

Languages derived from the JS family usually deal with tons of complexity related to `null`
and `undefined`. It's common to deal with this using nullable types and logical operations.
The option pattern is an elegant alternative to that. It deals with the same problem ensuring
type safety.

Let's check a few examples:

```typescript
// Same value expressed in 2 different ways:
const optional = Option.Some(10)
const nullable: number | null = 10

// Filter
const isEven = (n: number) => n % 2 === 0\
// Transformation
const plus1 = (n: number) => n + 1

expect(
    optional.filter(isEven).map(plus1).unwrapOr(-1)
).to.eql(Option.Some(11)) // Simple logic easy to read.

expect(
    nullable && isEven(nullable) ? plus1(nullable) : -1
).to.eql(11) // Abuse of syntax, harder to read and understand.
```

The optional pattern also helps with border cases like this:

```typescript
const maybeTen: null | number = 10;
const maybeZero: null | number = 0;

if (maybeTen) {
  // ...
} // Works as expected

if (maybeZero) {
  // ...
} // b is not null, so it's present, but the value is falsey, the if is not executed.
```

Optionals make this a ton more expresive:

```typescript
const maybeTen = Option.Some(10)
const maybeZero = Option.Some(0)

if (maybeTen.isSome()) {
  // ... 
} // Works as expected

if (maybeZero.isSome()) {
  // ... 
} // Works as expected
```

## Why copy the rust implementation?

In rust optionals are everywhere. The default implementation is very versatile and rust
developers use it everywhere. Rust Option interface was tested in every kind of battles,
and was improved over time.

Still, this library takes a little freedom on how to translate from rust to typescript.
There are certain methods that make tons of sense in rust, but no sense at all in typescript.
For examples methods related to mutability or behaviors specific to rust.

There is also a few things that are very desirable in ts that were added. The names were also
adapted to typescript conventions (snake case to camel case, for example).

## How to use it

Install:

```bash
# yarn
yarn i nochoices
# npm
npm i nochoices
# pnpm
pnpm i nochoices
```

And then use:

```typescript
import {Option} from 'nochoices'

const ten = Option.Some(10)
const empty = Option.None()
// ...
```

## How to test

```bash
pnpm install
pnpm test
```

## How to contribute

Issues and prs are open.


## Changes from rust option lib:

There are certain rust features that are just not applicable in typescript. So methods related to those
features where excluded.

There is also a few methods that are super desirable in ts that do not make sense in rust. Those were added.

Lastly, there are a few that I just like, so I added them.

### Added methods

- `ifSome(fn: (t: T) => void): Option<T>`: execs the provided fn only if current value is some. Returns `this` always. 
- `ifNone(fn: (t: T) => void): Option<T>`: execs the provided fn only if current value is none. Returns `this` always. 
- `toArray(): T[]`: if none returns [], if some returns an array of size 1 with the value.

### Excluded methods
The following methods where excluded:

- Every method that converts between refs and mutability 
  - `as_ref`
  - `as_mut`
  - `as_deref`
  - `as_deref_mut`
  - `as_pin_ref`
  - `as_pin_mut`
  - `unwrap_unchecked`

- Typescript does not have anything related to `Result` type, so the following were also omitted: 
  - `ok_or`
  - `ok_or_else`
  - `transpose`
  - `as_slice`
  - `as_mut_slice`

- Certain methods are related to traits that do not have so much sense in ts. Those were omitted. `toArray` kind of encapsulates the behavior of some of this, though.
  - `into_iter`
  - `iter`
  - `iter_mut`
  - `from_residual`
  - `hash`
  - `hash_slice`
  - `cmp`
  - `max`
  - `min`
  - `clamp`
  - `eq`
  - `ne`
  - `partial_cmp`
  - `lt`
  - `le`
  - `gt`
  - `ge`
  - `product`
  - `sum`
  - `from_output`
  - `branch`

- Methods that are not part of traits, but expect that the paramers implement traits that not applicable to ts:
  - `unwrap_or_default`
  - `get_or_insert_default`
  - `copied`
  - `cloned`
