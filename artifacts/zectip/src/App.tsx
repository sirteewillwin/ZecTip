import { type ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { ArrowDownRight, ArrowRight, CheckCircle2, ChevronDown, CircleAlert, EyeOff, ExternalLink, Fingerprint, LoaderCircle, LockKeyhole, Menu, MessageSquareText, Radio, ShieldCheck, Sparkles, Terminal, X } from 'lucide-react';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function Home() {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{ recipient?: string; amount?: string }>({});
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'failed'>('idle');
  const [showPreview, setShowPreview] = useState(false);
  const [demoMenu, setDemoMenu] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const formatAddress = (value: string) => value.trim();
  const validate = () => {
    const next: typeof errors = {};
    const addr = formatAddress(recipient);
    if (!addr) next.recipient = 'Enter a Zcash address to continue.';
    else if (!/^(?:(?:t[13]|zc)[a-zA-Z0-9]{30,}|(?:zs1|u1)[a-zA-Z0-9]{20,})$/i.test(addr)) next.recipient = 'Address format looks incomplete. This check does not verify an address on the network.';
    if (!amount) next.amount = 'Enter an amount.';
    else if (!/^\d+(\.\d{1,8})?$/.test(amount) || Number(amount) <= 0) next.amount = 'Use a positive amount with up to 8 decimal places.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };
  const beginPreview = () => { if (validate()) { setStatus('idle'); setShowPreview(true); } };
  const simulate = (outcome: 'pending' | 'success' | 'failed') => {
    setShowPreview(false);
    setStatus(outcome);
    if (outcome === 'pending') {
      window.setTimeout(() => setStatus((current) => current === 'pending' ? 'success' : current), 2600);
    }
    document.getElementById('tip')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
  const reset = () => { setStatus('idle'); setShowPreview(false); };
  const useSample = () => {
    setRecipient('zs1qexampleaddressformatonlynotarealrecipient000000000000000');
    setAmount('0.025');
    setMessage('For the work you put into this. Keep building.');
    setErrors({});
    setDemoMenu(false);
    setStatus('idle');
    setShowPreview(false);
    document.getElementById('tip')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const links = [['Why privacy', '#privacy'], ['How it works', '#how'], ['Make a tip', '#tip']] as const;

  return (
    <main className="scanlines min-h-[100dvh] overflow-hidden bg-[#0a0e0c] text-[#e1ebe3]">
      <header className="relative z-30 border-b border-[#1b2a21] bg-[#0a0e0c]/95">
        <div className="mx-auto flex h-[68px] max-w-[1180px] items-center justify-between px-5 sm:px-8">
          <a href="#top" data-testid="link-home" aria-label="ZecTip home" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center border border-[#46f48a]/50 bg-[#46f48a]/10 text-[#46f48a]"><Terminal size={18}/></span>
            <span className="font-bold tracking-[-.04em] text-[19px]">zec<span className="text-[#46f48a]">tip</span><span className="mono ml-2 text-[9px] font-normal tracking-[.16em] text-[#71867a]">BETA</span></span>
          </a>
          <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">
            {links.map(([label, href]) => <a key={href} href={href} data-testid={`link-nav-${href.slice(1)}`} className="mono text-[11px] text-[#9ba99f] transition-colors hover:text-[#53f58c]">{label}</a>)}
          </nav>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 mono text-[10px] text-[#849489] sm:flex"><span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[#46f48a]"/>DEMO ENVIRONMENT</span>
            <button className="flex h-9 items-center gap-2 border border-[#314237] px-3 text-[11px] font-semibold text-[#cbd9ce] transition hover:border-[#46f48a] hover:text-[#46f48a]" onClick={() => document.getElementById('tip')?.scrollIntoView({ behavior: 'smooth' })} data-testid="button-header-tip"><span className="text-[#46f48a]">+</span> Send a tip</button>
            <button aria-label={mobileMenu ? 'Close menu' : 'Open menu'} onClick={() => setMobileMenu(!mobileMenu)} className="p-2 text-[#cbd9ce] md:hidden" data-testid="button-mobile-menu">{mobileMenu ? <X size={18}/> : <Menu size={18}/>}</button>
          </div>
        </div>
        {mobileMenu && <nav className="border-t border-[#1b2a21] px-5 py-3 md:hidden" aria-label="Mobile navigation">{links.map(([label, href]) => <a key={href} href={href} onClick={() => setMobileMenu(false)} className="block py-3 mono text-xs text-[#a4b1a8]" data-testid={`link-mobile-${href.slice(1)}`}>{label}</a>)}</nav>}
      </header>

      <section id="top" className="relative mx-auto max-w-[1180px] px-5 pb-16 pt-16 sm:px-8 sm:pb-24 sm:pt-24">
        <div className="grid-noise pointer-events-none absolute inset-x-0 top-0 h-[520px]"/>
        <div className="relative grid items-center gap-12 lg:grid-cols-[1.08fr_.92fr] lg:gap-20">
          <div className="reveal">
            <div className="mono mb-7 flex items-center gap-3 text-[10px] uppercase tracking-[.18em] text-[#7d9383]"><span className="h-px w-8 bg-[#46f48a]"/>ZECATHON / EXPLORATION 001</div>
            <h1 className="max-w-[720px] text-[clamp(3.6rem,10vw,7.7rem)] font-semibold leading-[.86] tracking-[-.085em] text-[#e2ebe3]">A little<br/>value.<br/><span className="text-[#46f48a]">A lot more</span><br/>privacy.</h1>
            <p className="mt-8 max-w-[480px] text-[15px] leading-7 text-[#a2b0a5] sm:text-[17px]">A thoughtful way to explore tipping with Zcash. Send appreciation without making every detail of your generosity a public performance.</p>
            <div className="mt-9 flex flex-col gap-3 min-[430px]:flex-row">
              <a href="#tip" data-testid="link-hero-start" className="group inline-flex h-12 items-center justify-center gap-3 bg-[#46f48a] px-5 font-semibold text-[#07100b] transition hover:bg-[#78ffa9]">Try the local demo <ArrowRight size={16} className="transition-transform group-hover:translate-x-1"/></a>
              <a href="#privacy" data-testid="link-hero-privacy" className="inline-flex h-12 items-center justify-center gap-3 border border-[#344338] px-5 text-sm text-[#c1cec4] transition hover:border-[#46f48a]/60">Why privacy matters <ArrowDownRight size={15} className="text-[#46f48a]"/></a>
            </div>
            <div className="mt-12 flex items-center gap-3 border-l border-[#46f48a] pl-4">
              <span className="mono text-[10px] leading-5 text-[#829186]">NO WALLET CONNECTED<br/>NO NETWORK REQUESTS<br/><span className="text-[#46f48a]">NO FUNDS MOVED</span></span>
            </div>
          </div>
          <div className="reveal-delay relative mx-auto w-full max-w-[500px]">
            <div className="absolute -inset-4 border border-[#46f48a]/10"/>
            <div className="absolute -right-2 -top-5 mono text-[9px] tracking-[.2em] text-[#769080]">SIGNAL / 01</div>
            <div className="relative border border-[#294333] bg-[#0d1510] p-5 shadow-[0_24px_90px_rgba(0,0,0,.32)] sm:p-7">
              <div className="mb-7 flex items-center justify-between border-b border-[#203128] pb-4">
                <div className="flex items-center gap-2 mono text-[10px] text-[#84968a]"><span className="h-2 w-2 rounded-full bg-[#46f48a]"/> ZECTIP / PRIVATE BY DESIGN</div><span className="mono text-[9px] text-[#53665a]">v.0.1.0</span>
              </div>
              <div className="mono text-[10px] text-[#71877a]">$ composing a gesture…</div>
              <div className="my-5 flex items-baseline gap-3"><span className="text-[64px] font-semibold leading-none tracking-[-.08em] text-[#e2ebe3]">0.025</span><span className="mono text-sm text-[#46f48a]">ZEC</span></div>
              <div className="space-y-3 border-t border-[#203128] pt-5 mono text-[10px]">
                <div className="flex justify-between gap-3"><span className="text-[#6c7f72]">TO</span><span className="text-[#9cad9f]">zs1q…format-only</span></div>
                <div className="flex justify-between"><span className="text-[#6c7f72]">NOTE</span><span className="text-[#9cad9f]">“keep building.”</span></div>
                <div className="flex justify-between"><span className="text-[#6c7f72]">MODE</span><span className="text-[#46f48a]">LOCAL SIMULATION</span></div>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-[#203128] pt-4">
                <div className="flex items-center gap-2 text-xs text-[#9aa99e]"><LockKeyhole size={14} className="text-[#46f48a]"/> A private gesture, not a public spectacle.</div><span className="mono text-[9px] text-[#56715e]">→</span>
              </div>
            </div>
            <div className="mt-4 flex justify-between mono text-[9px] tracking-[.13em] text-[#56685c]"><span>SIMULATED INTERFACE</span><span>NO CHAIN ACTIVITY</span></div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#1b2a21] bg-[#0d1410]">
        <div className="mx-auto grid max-w-[1180px] gap-0 px-5 sm:px-8 md:grid-cols-3">
          {[
            { n: '01', title: 'Intentional', text: 'A tip should feel like a human gesture, not another data point.' },
            { n: '02', title: 'Private-capable', text: 'Zcash gives people options to transact with more discretion.' },
            { n: '03', title: 'Honest about limits', text: 'This prototype simulates only. Privacy flows are not implemented here.' },
          ].map((item, i) => <article key={item.n} className={`py-7 ${i ? 'border-t border-[#1b2a21] md:border-l md:border-t-0 md:pl-8' : ''} md:pr-8`}><div className="mono mb-3 text-[10px] text-[#46f48a]">/{item.n}</div><h2 className="text-lg font-semibold tracking-[-.04em]">{item.title}</h2><p className="mt-2 max-w-[270px] text-sm leading-6 text-[#85948a]">{item.text}</p></article>)}
        </div>
      </section>

      <section id="privacy" className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-24">
          <div>
            <div className="mono mb-5 text-[10px] tracking-[.18em] text-[#46f48a]">THE CASE FOR PRIVACY</div>
            <h2 className="max-w-[440px] text-4xl font-semibold leading-[1.02] tracking-[-.065em] sm:text-6xl">Generosity deserves a little <span className="text-[#46f48a]">room to breathe.</span></h2>
            <p className="mt-6 max-w-[400px] text-[15px] leading-7 text-[#96a59a]">When every payment broadcasts who paid whom and how much, kindness can turn into a ledger for strangers. Financial privacy gives people agency over what they reveal.</p>
          </div>
          <div className="relative border border-[#294333] bg-[#0d1510] p-6 sm:p-9">
            <div className="absolute right-5 top-5 text-[#46f48a]"><Fingerprint size={23}/></div>
            <div className="mono text-[10px] tracking-[.15em] text-[#71877a]">ZCASH / SHIELDED TRANSACTIONS</div>
            <h3 className="mt-7 max-w-[530px] text-2xl font-medium leading-tight tracking-[-.04em] sm:text-3xl">Privacy is a capability. Not a claim this demo can make.</h3>
            <p className="mt-5 text-sm leading-7 text-[#91a196]">Zcash shielded transactions can protect sender, recipient, and amount when shielded addresses and appropriate wallet flows are used. Which details are private depends on the transaction path and wallet.</p>
            <div className="mt-7 border-l-2 border-[#d8b657] bg-[#d8b657]/[.06] px-4 py-3 text-sm leading-6 text-[#d6c992]"><strong className="font-semibold text-[#ead98f]">Important:</strong> ZecTip currently does not implement shielded addresses, wallet flows, or blockchain transactions. The demo below is a local-only simulation; no payment is sent or shielded.</div>
            <div className="mt-7 grid gap-4 border-t border-[#203128] pt-6 sm:grid-cols-2">
              <div className="flex gap-3"><EyeOff size={17} className="mt-0.5 shrink-0 text-[#46f48a]"/><div><div className="text-sm font-medium">Selective visibility</div><p className="mt-1 text-xs leading-5 text-[#76877b]">Choose a privacy-preserving flow where it fits your needs.</p></div></div>
              <div className="flex gap-3"><ShieldCheck size={17} className="mt-0.5 shrink-0 text-[#46f48a]"/><div><div className="text-sm font-medium">Privacy by choice</div><p className="mt-1 text-xs leading-5 text-[#76877b]">Understand what is and is not disclosed before sending.</p></div></div>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="border-y border-[#1b2a21] bg-[#0d1410]">
        <div className="mx-auto max-w-[1180px] px-5 py-16 sm:px-8 sm:py-20">
          <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><div className="mono mb-4 text-[10px] tracking-[.18em] text-[#46f48a]">A SMALL, CLEAR FLOW</div><h2 className="text-3xl font-semibold tracking-[-.06em] sm:text-5xl">Three steps. No surprises.</h2></div><p className="max-w-[350px] text-sm leading-6 text-[#839287]">This prototype lets you feel the shape of the experience without touching a wallet or a network.</p></div>
          <div className="grid gap-0 md:grid-cols-3">
            {[['01', 'Set the intention', 'Add a Zcash address, an amount, and an optional note. The address check is format-only.'], ['02', 'Review the details', 'See a clear preview of the simulated tip before you choose what happens next.'], ['03', 'Explore outcomes', 'Run a pending, simulated success, or simulated failure path locally. Nothing is broadcast.']].map(([n, title, copy], i) => <article key={n} className={`relative border-t border-[#304236] py-6 ${i > 0 ? 'md:ml-8' : ''}`}><span className="mono text-xs text-[#46f48a]">{n} <span className="text-[#46584b]">/</span></span><h3 className="mt-4 text-xl font-semibold tracking-[-.04em]">{title}</h3><p className="mt-2 max-w-[305px] text-sm leading-6 text-[#839287]">{copy}</p>{i < 2 && <ArrowRight className="absolute right-4 top-7 hidden text-[#365340] md:block" size={17}/>}</article>)}
          </div>
        </div>
      </section>

      <section id="tip" className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid items-start gap-10 lg:grid-cols-[.7fr_1.3fr] lg:gap-20">
          <div className="lg:sticky lg:top-10">
            <div className="mono mb-5 flex items-center gap-2 text-[10px] tracking-[.16em] text-[#46f48a]"><span className="h-1.5 w-1.5 rounded-full bg-[#46f48a]"/> LOCAL DEMO / NO REAL FUNDS</div>
            <h2 className="text-4xl font-semibold leading-[.98] tracking-[-.07em] sm:text-6xl">Make a tip.<br/><span className="text-[#46f48a]">Make it count.</span></h2>
            <p className="mt-5 max-w-[350px] text-sm leading-6 text-[#8e9d91]">Try a realistic flow using sample or your own format-only input. All results are simulated in this browser.</p>
            <button onClick={useSample} className="mt-7 inline-flex items-center gap-2 border border-[#324438] px-4 py-3 text-xs font-medium text-[#c7d2c9] transition hover:border-[#46f48a]/70 hover:text-[#46f48a]" data-testid="button-load-sample"><Sparkles size={14} className="text-[#46f48a]"/> Load sample details</button>
            <div className="mt-5 flex items-start gap-2 text-[11px] leading-5 text-[#697a6e]"><CircleAlert size={14} className="mt-0.5 shrink-0 text-[#d6bb65]"/> Sample address is illustrative and may not be a real recipient.</div>
          </div>

          <div className="border border-[#2d4133] bg-[#0d1510]">
            <div className="flex items-center justify-between border-b border-[#203128] px-5 py-4 sm:px-7">
              <div className="flex items-center gap-2 mono text-[10px] tracking-[.12em] text-[#a0b0a3]"><Terminal size={14} className="text-[#46f48a]"/> TIP COMPOSER</div>
              <div className="relative">
                <button onClick={() => setDemoMenu(!demoMenu)} aria-expanded={demoMenu} className="inline-flex items-center gap-1.5 mono text-[9px] text-[#87998b] hover:text-[#46f48a]" data-testid="button-demo-options"><Radio size={12} className="text-[#46f48a]"/> DEMO PATHS <ChevronDown size={12}/></button>
                {demoMenu && <div className="absolute right-0 top-8 z-20 w-[200px] border border-[#324438] bg-[#101a13] p-1 shadow-xl">
                  {[['pending', 'Simulate pending'], ['success', 'Simulate success'], ['failed', 'Simulate failure']].map(([outcome, title]) => <button key={outcome} onClick={() => { if (validate()) simulate(outcome as 'pending'|'success'|'failed'); setDemoMenu(false); }} className="block w-full px-3 py-2.5 text-left mono text-[10px] text-[#b1beb4] hover:bg-[#19251c] hover:text-[#46f48a]" data-testid={`button-demo-${outcome}`}>{title}</button>)}
                </div>}
              </div>
            </div>
            <form onSubmit={(event) => { event.preventDefault(); beginPreview(); }} className="space-y-5 p-5 sm:space-y-6 sm:p-7" noValidate>
              <div>
                <label htmlFor="recipient" className="mb-2 flex justify-between mono text-[10px] tracking-[.08em] text-[#9ca99f]"><span>RECIPIENT ADDRESS</span><span className="text-[#5c7161]">ZCASH · FORMAT ONLY</span></label>
                <div className={`flex items-center border bg-[#09100b] transition focus-within:border-[#46f48a]/70 ${errors.recipient ? 'border-[#dc655b]/80' : 'border-[#2b3b30]'}`}>
                  <span className="px-3 mono text-xs text-[#46f48a]">›</span>
                  <input id="recipient" value={recipient} onChange={(e) => { setRecipient(e.target.value); setErrors((old) => ({ ...old, recipient: undefined })); }} autoComplete="off" spellCheck={false} placeholder="zs1… / u1… / t1…" className="h-12 w-full bg-transparent pr-3 mono text-[12px] text-[#d8e3da] outline-none placeholder:text-[#506154]" aria-invalid={!!errors.recipient} aria-describedby={errors.recipient ? 'recipient-error' : 'recipient-hint'} data-testid="input-recipient"/>
                </div>
                {errors.recipient ? <p id="recipient-error" role="alert" className="mt-2 text-xs text-[#ef8178]" data-testid="error-recipient">{errors.recipient}</p> : <p id="recipient-hint" className="mt-2 text-[10px] text-[#697b6d]">Format check only — no checksum or network verification.</p>}
              </div>
              <div>
                <label htmlFor="amount" className="mb-2 flex justify-between mono text-[10px] tracking-[.08em] text-[#9ca99f]"><span>AMOUNT</span><span className="text-[#5c7161]">ZEC</span></label>
                <div className={`flex items-center border bg-[#09100b] transition focus-within:border-[#46f48a]/70 ${errors.amount ? 'border-[#dc655b]/80' : 'border-[#2b3b30]'}`}>
                  <input id="amount" inputMode="decimal" value={amount} onChange={(e) => { setAmount(e.target.value); setErrors((old) => ({ ...old, amount: undefined })); }} placeholder="0.00000000" className="h-12 w-full bg-transparent px-4 mono text-[15px] text-[#d8e3da] outline-none placeholder:text-[#506154]" aria-invalid={!!errors.amount} aria-describedby={errors.amount ? 'amount-error' : undefined} data-testid="input-amount"/>
                  <span className="mr-3 border-l border-[#293a2d] pl-3 mono text-xs text-[#46f48a]">ZEC</span>
                </div>
                {errors.amount && <p id="amount-error" role="alert" className="mt-2 text-xs text-[#ef8178]" data-testid="error-amount">{errors.amount}</p>}
                <div className="mt-2 flex gap-2">{['0.01', '0.025', '0.1'].map((value) => <button type="button" key={value} onClick={() => { setAmount(value); setErrors((old) => ({ ...old, amount: undefined })); }} className="border border-[#28392d] px-2.5 py-1 mono text-[10px] text-[#77897b] hover:border-[#46f48a]/50 hover:text-[#46f48a]" data-testid={`button-amount-${value.replace('.', '-')}`}>{value}</button>)}</div>
              </div>
              <div>
                <label htmlFor="message" className="mb-2 flex justify-between mono text-[10px] tracking-[.08em] text-[#9ca99f]"><span>NOTE <span className="text-[#617266]">/ OPTIONAL</span></span><span className={message.length > 140 ? 'text-[#ef8178]' : 'text-[#5c7161]'}>{message.length}/140</span></label>
                <div className="flex border border-[#2b3b30] bg-[#09100b] focus-within:border-[#46f48a]/70"><MessageSquareText size={15} className="ml-3 mt-3.5 shrink-0 text-[#71877a]"/><textarea id="message" value={message} onChange={(e) => setMessage(e.target.value.slice(0, 140))} maxLength={140} rows={3} placeholder="A few words, if you like…" className="w-full resize-none bg-transparent p-3 mono text-[11px] leading-5 text-[#d8e3da] outline-none placeholder:text-[#506154]" data-testid="input-message"/></div>
              </div>
              <div className="flex items-start gap-2 border border-[#3b3828] bg-[#d6bb65]/[.045] px-3 py-3 text-[11px] leading-5 text-[#a99f72]"><CircleAlert size={14} className="mt-0.5 shrink-0 text-[#d6bb65]"/><span>Simulation only. No wallet, network, transaction, or actual funds are involved.</span></div>
              <button type="submit" className="group flex h-12 w-full items-center justify-center gap-2 bg-[#46f48a] font-semibold text-[#07100b] transition hover:bg-[#77ffa7]" data-testid="button-review-tip">Review simulated tip <ArrowRight size={16} className="transition-transform group-hover:translate-x-1"/></button>
            </form>

            {showPreview && <div role="dialog" aria-modal="true" aria-labelledby="preview-title" className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4" onClick={(e) => { if (e.target === e.currentTarget) setShowPreview(false); }} data-testid="dialog-tip-preview">
              <div className="w-full max-w-[460px] border border-[#3b5d44] bg-[#0d1510] shadow-2xl">
                <div className="flex items-center justify-between border-b border-[#203128] px-5 py-4"><div className="mono text-[10px] tracking-[.13em] text-[#46f48a]">REVIEW / SIMULATED TIP</div><button onClick={() => setShowPreview(false)} aria-label="Close preview" className="p-1 text-[#9aa99e] hover:text-white" data-testid="button-close-preview"><X size={17}/></button></div>
                <div className="p-5 sm:p-6"><h3 id="preview-title" className="text-2xl font-semibold tracking-[-.05em]">A gesture, not a transaction.</h3>
                  <div className="mt-6 divide-y divide-[#203128] border-y border-[#203128]">
                    <div className="flex justify-between gap-3 py-4"><span className="mono text-[10px] text-[#71877a]">TO</span><span className="max-w-[250px] break-all text-right mono text-[10px] text-[#c7d3c9]">{formatAddress(recipient)}</span></div>
                    <div className="flex justify-between py-4"><span className="mono text-[10px] text-[#71877a]">AMOUNT</span><span className="mono text-sm text-[#46f48a]">{amount} ZEC</span></div>
                    {message && <div className="flex justify-between gap-3 py-4"><span className="mono text-[10px] text-[#71877a]">NOTE</span><span className="max-w-[250px] text-right text-xs text-[#c7d3c9]">{message}</span></div>}
                  </div>
                  <div className="mt-4 border border-[#d6bb65]/30 bg-[#d6bb65]/[.05] p-3 mono text-[10px] leading-5 text-[#cfbf7d]">DEMO ONLY · This does not send funds, create a real transaction, or use shielded flows.</div>
                  <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row"><button onClick={() => setShowPreview(false)} className="h-11 flex-1 border border-[#344338] text-xs text-[#b4c0b6] hover:border-[#7d9282]" data-testid="button-edit-preview">Edit details</button><button onClick={() => simulate('pending')} className="h-11 flex-1 bg-[#46f48a] text-xs font-semibold text-[#07100b] hover:bg-[#77ffa7]" data-testid="button-confirm-simulation">Run simulation <ArrowRight size={14} className="ml-1 inline"/></button></div>
                </div>
              </div>
            </div>}

            {status !== 'idle' && <div aria-live="polite" aria-atomic="true" className={`border-t px-5 py-5 sm:px-7 ${status === 'failed' ? 'border-[#6a3935] bg-[#2a1715]/60' : status === 'success' ? 'border-[#276740] bg-[#112419]' : 'border-[#35523b] bg-[#111c13]'}`} data-testid={`status-${status}`}>
              <div className="flex items-start gap-3">
                <span className={`mt-0.5 ${status === 'failed' ? 'text-[#ed786e]' : 'text-[#46f48a]'}`}>{status === 'pending' ? <LoaderCircle className="animate-spin" size={19}/> : status === 'success' ? <CheckCircle2 size={19}/> : <CircleAlert size={19}/>}</span>
                <div className="flex-1">
                  <div className={`mono text-[11px] font-medium tracking-[.1em] ${status === 'failed' ? 'text-[#ed8279]' : 'text-[#69f39a]'}`}>{status === 'pending' ? 'SIMULATED / PENDING' : status === 'success' ? 'SIMULATED / SUCCESS' : 'SIMULATED / FAILURE'}</div>
                  <p className="mt-1.5 text-xs leading-5 text-[#a2b0a5]">{status === 'pending' ? 'A local demo state is running. No request has been made.' : status === 'success' ? 'Demo outcome only. No real payment was sent or confirmed, and no payment was shielded.' : 'Demo failure path reached. No real payment was attempted.'}</p>
                  {status === 'pending' && <button onClick={() => simulate('success')} className="mt-3 text-left mono text-[10px] text-[#46f48a] underline underline-offset-4" data-testid="button-finish-pending">Finish pending demo as success</button>}
                </div>
                <button onClick={reset} aria-label="Dismiss status" className="p-1 text-[#8fa095] hover:text-white" data-testid="button-dismiss-status"><X size={15}/></button>
              </div>
              {status !== 'pending' && <button onClick={reset} className="mt-4 border border-[#3a4b3e] px-3 py-2 mono text-[9px] tracking-[.08em] text-[#b6c4b9] hover:border-[#46f48a]/60 hover:text-[#46f48a]" data-testid="button-reset-demo">RESET DEMO</button>}
            </div>}
          </div>
        </div>
      </section>

      <section className="border-y border-[#1b2a21] bg-[#0d1410]">
        <div className="mx-auto grid max-w-[1180px] gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1fr_auto] md:items-center">
          <div><div className="mono mb-3 text-[10px] tracking-[.16em] text-[#46f48a]">BUILT TO ASK A BETTER QUESTION</div><h2 className="max-w-[640px] text-2xl font-medium leading-tight tracking-[-.05em] sm:text-4xl">What if tipping could feel personal again?</h2></div>
          <a href="#tip" data-testid="link-bottom-demo" className="inline-flex h-11 items-center justify-center gap-2 border border-[#46f48a]/50 px-4 text-xs font-medium text-[#46f48a] transition hover:bg-[#46f48a] hover:text-[#07100b]">Explore the demo <ArrowRight size={15}/></a>
        </div>
      </section>
      <footer className="mx-auto flex max-w-[1180px] flex-col gap-4 px-5 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <a href="#top" className="inline-flex items-center gap-2 text-sm font-semibold tracking-[-.03em]" data-testid="link-footer-home"><span className="flex h-6 w-6 items-center justify-center border border-[#46f48a]/40 text-[#46f48a]"><Terminal size={12}/></span>zec<span className="text-[#46f48a]">tip</span></a>
        <p className="max-w-[550px] text-[10px] leading-5 text-[#66766b]">ZecTip is a ZECathon concept prototype. Simulation only: no wallet connection, network requests, real transactions, or shielded payments.</p>
        <a href="#privacy" className="inline-flex items-center gap-1 mono text-[9px] text-[#74877a] hover:text-[#46f48a]" data-testid="link-footer-privacy">PRIVACY NOTES <ExternalLink size={11}/></a>
      </footer>
    </main>
  );
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
