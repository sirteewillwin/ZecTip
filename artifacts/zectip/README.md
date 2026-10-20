# ZecTip

ZecTip is a mobile-first ZECathon prototype for exploring a Zcash tipping flow. The app is intentionally demo-only: it does not connect to a wallet, construct or submit a transaction, contact a Zcash node, or move funds.

## Architecture

- **React + TypeScript + Vite** provide the web app and development/build commands.
- **Wouter** currently routes the single-page experience at `/`.
- **Tailwind CSS** and `src/index.css` implement the responsive terminal-style UI.
- `src/App.tsx` contains the landing page, form, preview, and simulated status flow.
- `src/lib/tip-validation.ts` contains reusable form validation. Address checks only match broad prefixes and lengths; they do not verify checksums, network, ownership, or spendability.
- `src/lib/zcash-wallet-adapter.ts` defines a future wallet boundary only. It has no implementation and accepts no seed phrases or private keys. A real adapter must delegate signing to a user-approved wallet and obtain confirmation from a supported status source before showing a real payment as confirmed.
- `src/App.test.tsx` and `src/lib/tip-validation.test.ts` cover the browser flow and input rules.

The demo state is named `demo-pending`, `demo-success`, and `demo-failure` in code. The UI also labels each result as simulated so that a demo success cannot be confused with a confirmed ZEC payment.

## Setup and commands

This app is part of the pnpm workspace. From the workspace root:

```sh
pnpm install
pnpm --filter @workspace/zectip run test
pnpm --filter @workspace/zectip run typecheck
pnpm --filter @workspace/zectip run build
```

The Replit web workflow supplies the required `PORT` and `BASE_PATH` values. To run the Vite dev server manually, provide them:

```sh
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/zectip run dev
```

## Demo flow

Enter a recipient and positive ZEC amount, optionally add a note, then review the details. Running the simulation shows a pending state and then a simulated success; the demo paths menu can also show simulated success or failure directly. None of these paths calls a wallet, API, node, or blockchain.

The current address validation accepts broad-looking transparent (`t1`, `t3`), Sapling (`zs1`), unified (`u1`), and legacy Sprout (`zc`) prefixes with length heuristics. It is deliberately not represented as address verification.

## Real-payment integration assessment

No real payment integration was added because the available choices do not meet this web app's compatibility and safety requirements:

- **[ChainSafe WebZjs](https://github.com/ChainSafe/WebZjs)** is explicitly aimed at browser wallets, but its README still describes it as under development and says it has received no security review or audit and has no guarantees. Its documented account-creation example accepts a 24-word seed phrase. That is not compatible with ZecTip's requirement never to collect seed phrases or private keys in the frontend.
- **[Zcash Android Wallet SDK](https://github.com/zcash/zcash-android-wallet-sdk)** is a native Kotlin SDK, not a React/Vite browser dependency. Its README now marks version 4.0.0 as the final release and announces end of support at NU7 (then expected in November 2026).
- The official [Zcash light-client development guide](https://zcash.readthedocs.io/en/master/rtd_pages/lightclient_support.html) describes native Android/iOS wallet SDKs and the `lightwalletd` light-client service; it does not provide a maintained, audited React wallet adapter for this app.

These sources were reviewed on 2026-10-20. The code boundary is prepared for a future wallet-approved adapter, but no real signing, testnet, or mainnet capability is claimed or enabled. Before implementing one, select a maintained wallet provider that signs outside the ZecTip page, verify its browser/mobile compatibility and network-status API, then test with testnet funds only. Do not add seed phrases, spending keys, or production RPC credentials to the frontend.

## Privacy model and limitations

Zcash shielded transactions can hide transaction details under the appropriate shielded-address and wallet path, but privacy depends on the transaction and wallet used. ZecTip currently creates no Zcash transaction, so it cannot claim that a payment is private or shielded. The demo's form data remains in page memory and is not submitted to a ZecTip backend.

The app's stylesheet loads Space Grotesk and DM Mono through Google Fonts. This means the page is not fully offline and a font request can disclose a visit to that provider; the payment demo itself still makes no wallet or Zcash request. Do not describe the whole app as fully private until this external font dependency and any future wallet/network metadata flows have been reviewed.
