
export class Option<T> {
  private value: OptionalValue<T>;

  private constructor (value: OptionalValue<T>) {
    this.value = value
  }

  static Some<T>(value: T): Option<T> {
    return new Option(new Some(value))
  }

  static None<T>(): Option<T> {
    return new Option<T>(new None())
  }

  isAbsent(): boolean {
    return this.value.isAbsent()
  }

  isPresent(): boolean {
    return this.value.isPresent()
  }

  map <M>(fn: (a: T) => M): Option<M> {
    return this.value.map(fn)
  }

  unwrap (): T {
    return this.value.unwrap()
  }
}

abstract class OptionalValue<T> {
  abstract isPresent(): boolean
  abstract isAbsent(): boolean

  abstract unwrap(): T

  abstract map<M>(fn: (a: T) => M): Option<M>
}

class None<T> extends OptionalValue<T> {
  isPresent (): boolean {
    return false;
  }

  isAbsent (): boolean {
    return true;
  }

  unwrap (): T {
    throw new Error('unwrap over None.')
  }

  map<M>(_fn: (a: T) => M): Option<M> {
    return Option.None()
  }
}

class Some<T> extends OptionalValue<T> {
  value: T
  constructor (value: T) {
    super();
    this.value = value
  }

  isPresent (): boolean {
    return true;
  }

  isAbsent (): boolean {
    return false;
  }

  unwrap (): T {
    return this.value
  }

  map<M> (fn: (a: T) => M): Option<M> {
    const newValue = fn(this.value)
    return Option.Some(newValue);
  }
}