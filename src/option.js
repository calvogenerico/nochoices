export class Option {
    value;
    constructor(value) {
        this.value = value;
    }
    static Some(value) {
        return new Option(value);
    }
    static None() {
        return new Option(null);
    }
    isAbsent() {
        return this.value === null;
    }
    isPresent() {
        return this.value !== null;
    }
}
