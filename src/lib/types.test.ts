import { describe, it, expectTypeOf, expect } from 'vitest'
import { type ValidSchema, SCHEMAS } from './types.d'

describe('Types', () => {
  it('should have correct ValidSchema types', () => {
    expectTypeOf<ValidSchema>().toEqualTypeOf<'Card' | 'Deck' | 'TestSchema'>()
  })

  it('should have correct schema keys', () => {
    // Runtime check that SCHEMAS has the expected keys
    expect(Object.keys(SCHEMAS).sort()).toEqual(['Card', 'Deck', 'TestSchema'].sort())
  })

  it('should not allow invalid schema names', () => {
    // @ts-expect-error - This should show a type error
    const invalidSchema: ValidSchema = 'InvalidSchema'
  })
})