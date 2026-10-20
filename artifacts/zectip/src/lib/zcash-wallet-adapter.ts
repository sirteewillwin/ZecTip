export type TipPaymentRequest = {
  recipient: string;
  amountZec: string;
  message?: string;
};

export type WalletPaymentStatus = 'pending' | 'confirmed' | 'failed';

/**
 * Future integration boundary only; ZecTip does not provide an implementation.
 *
 * A real adapter must delegate transaction approval/signing to a user-approved
 * wallet and must never accept seed phrases or private keys. It may report
 * `confirmed` only after checking the transaction through a supported wallet
 * or chain-status API. This contract alone does not prove that a payment used
 * a shielded pool.
 */
export interface ZcashWalletAdapter {
  submitPayment(request: TipPaymentRequest): Promise<{ transactionId: string }>;
  getPaymentStatus(transactionId: string): Promise<WalletPaymentStatus>;
}

export type DemoPaymentStatus =
  | 'demo-pending'
  | 'demo-success'
  | 'demo-failure';
