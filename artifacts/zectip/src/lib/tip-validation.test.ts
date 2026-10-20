import { describe, expect, it } from 'vitest';
import { validateTipFields } from './tip-validation';

const saplingFormatExample = `zs1${'a'.repeat(40)}`;

describe('validateTipFields', () => {
  it('rejects a missing or malformed recipient address', () => {
    expect(validateTipFields('', '0.1').recipient).toMatch(/enter a zcash address/i);
    expect(validateTipFields('not-an-address', '0.1').recipient).toMatch(
      /format looks incomplete/i,
    );
  });

  it('accepts supported Zcash address prefixes as format-only input', () => {
    expect(validateTipFields(saplingFormatExample, '0.1').recipient).toBeUndefined();
    expect(validateTipFields(`u1${'a'.repeat(40)}`, '0.1').recipient).toBeUndefined();
    expect(validateTipFields(`t1${'a'.repeat(34)}`, '0.1').recipient).toBeUndefined();
  });

  it('requires a positive ZEC amount with at most eight decimal places', () => {
    expect(validateTipFields(saplingFormatExample, '0').amount).toMatch(
      /positive amount/i,
    );
    expect(validateTipFields(saplingFormatExample, '-0.1').amount).toMatch(
      /positive amount/i,
    );
    expect(validateTipFields(saplingFormatExample, '0.000000001').amount).toMatch(
      /positive amount/i,
    );
    expect(
      validateTipFields(saplingFormatExample, '0.00000001').amount,
    ).toBeUndefined();
    expect(
      validateTipFields(saplingFormatExample, '0.025').amount,
    ).toBeUndefined();
  });

  it('rejects values too large to represent as a finite number', () => {
    expect(
      validateTipFields(saplingFormatExample, '9'.repeat(400)).amount,
    ).toMatch(/positive amount/i);
  });
});
