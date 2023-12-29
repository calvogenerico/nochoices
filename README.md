# I don't want choices, what I need are options.






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

- Methods from traits that are not easy to translate to typescript.
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

- Methods that use rust specific traits
  - `unwrap_or_default`
  - `get_or_insert_default`
  - `copied`
  - `cloned`
