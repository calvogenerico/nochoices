# I'll give your the options




## Excluded methods
- Every method modifies refs and mutability 
  - `as_ref`
  - `as_mut`
  - `as_deref`
  - `as_deref_mut`
  - `as_pin_ref`
  - `as_pin_mut`
  - `unwrap_unchecked`
- Transformations to rust types `Result`.
  - `ok_or`
  - `ok_or_else`
  - `transpose`
  - `as_slice`
  - `as_mut_slice`

- Conversions to iterator.
  - `into_iter`
  - `iter`
  - `iter_mut`

- Methods that use rust specific traits
  - `unwrap_or_default`
  - `get_or_insert_default`

