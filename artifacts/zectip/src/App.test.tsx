import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from './App';

const validRecipient = `zs1${'a'.repeat(40)}`;

Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
  configurable: true,
  value: vi.fn(),
});

function enterTip(recipient = validRecipient, amount = '0.025', note = '') {
  fireEvent.change(screen.getByLabelText(/recipient address/i), {
    target: { value: recipient },
  });
  fireEvent.change(screen.getByLabelText(/amount/i), {
    target: { value: amount },
  });
  if (note) {
    fireEvent.change(screen.getByLabelText(/optional/i), {
      target: { value: note },
    });
  }
}

describe('ZecTip demo flow', () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('shows a clear error for an invalid recipient before opening review', () => {
    render(<App />);
    enterTip('not-a-zcash-address');
    fireEvent.click(screen.getByTestId('button-review-tip'));

    expect(screen.getByTestId('error-recipient').textContent).toMatch(
      /format looks incomplete/i,
    );
    expect(screen.queryByTestId('dialog-tip-preview')).toBeNull();
  });

  it('rejects zero and accepts the smallest positive ZEC amount', () => {
    render(<App />);
    enterTip(validRecipient, '0');
    fireEvent.click(screen.getByTestId('button-review-tip'));

    expect(screen.getByTestId('error-amount').textContent).toMatch(
      /positive amount/i,
    );

    fireEvent.change(screen.getByLabelText(/amount/i), {
      target: { value: '0.00000001' },
    });
    fireEvent.click(screen.getByTestId('button-review-tip'));

    expect(screen.getByTestId('dialog-tip-preview').textContent).toContain(
      '0.00000001 ZEC',
    );
  });

  it('shows the recipient, amount, and optional note in the review', () => {
    render(<App />);
    enterTip(validRecipient, '0.025', 'Thanks for building this.');
    fireEvent.click(screen.getByTestId('button-review-tip'));

    const preview = screen.getByTestId('dialog-tip-preview').textContent ?? '';
    expect(preview).toContain(validRecipient);
    expect(preview).toContain('0.025 ZEC');
    expect(preview).toContain('Thanks for building this.');
    expect(preview).toContain('DEMO ONLY');
    expect(preview).toContain('does not send funds');
  });

  it('ends the pending demo in a simulated success without claiming payment confirmation', () => {
    render(<App />);
    enterTip();
    fireEvent.click(screen.getByTestId('button-review-tip'));
    vi.useFakeTimers();
    fireEvent.click(screen.getByTestId('button-confirm-simulation'));

    expect(screen.getByTestId('status-demo-pending').textContent).toContain(
      'SIMULATED / PENDING',
    );

    act(() => {
      vi.advanceTimersByTime(2600);
    });

    const success = screen.getByTestId('status-demo-success').textContent ?? '';
    expect(success).toContain('SIMULATED / SUCCESS');
    expect(success).toContain('No real payment was sent or confirmed');
    expect(success).toContain('no shielded transfer occurred');
  });
});
