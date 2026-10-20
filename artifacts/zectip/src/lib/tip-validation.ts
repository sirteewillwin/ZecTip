export type TipFieldErrors = {
  recipient?: string;
  amount?: string;
};

const LEGACY_ZCASH_ADDRESS = /^(?:t1|t3|zc)[a-zA-Z0-9]{30,}$/i;
const SHIELDED_ZCASH_ADDRESS = /^(?:zs1|u1)[a-zA-Z0-9]{20,}$/i;
const ZEC_AMOUNT = /^\d+(?:\.\d{1,8})?$/;

export function validateTipFields(
  recipient: string,
  amount: string,
): TipFieldErrors {
  const errors: TipFieldErrors = {};
  const normalizedRecipient = recipient.trim();
  const normalizedAmount = amount.trim();

  if (!normalizedRecipient) {
    errors.recipient = 'Enter a Zcash address to continue.';
  } else if (
    !LEGACY_ZCASH_ADDRESS.test(normalizedRecipient) &&
    !SHIELDED_ZCASH_ADDRESS.test(normalizedRecipient)
  ) {
    errors.recipient =
      'Address format looks incomplete. This check does not verify an address on the network.';
  }

  if (!normalizedAmount) {
    errors.amount = 'Enter an amount.';
  } else {
    const numericAmount = Number(normalizedAmount);
    if (
      !ZEC_AMOUNT.test(normalizedAmount) ||
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      errors.amount = 'Use a positive amount with up to 8 decimal places.';
    }
  }

  return errors;
}
