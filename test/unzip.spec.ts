import { describe, expect, it } from 'vitest';
import { Option } from '../src/index.js';
import { unzip } from '../src/unzip.js';

describe('unzip', () => {
  it('for none returns [none, none]', () => {
    const none: Option<[number, string]> = Option.None();
    const unzipped = unzip(none);
    expect(unzipped).toStrictEqual([Option.None<number>(), Option.None<string>()]);
  });

  it('for some returns an array of size 2 with the unzipped optionals', () => {
    const none: Option<[number, string]> = Option.Some([123, 'foo']);
    const unzipped = unzip(none);
    expect(unzipped).toStrictEqual([Option.Some(123), Option.Some('foo')]);
  });
});
