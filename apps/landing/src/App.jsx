import { useEffect, useRef, useState } from 'react';
import {
  MapPin,
  Clock,
  Bell,
  ArrowUp,
  Check,
  ChevronDown,
  CheckCircle2,
  Languages,
  Navigation,
  Timer,
  Zap,
  AlertTriangle,
  DoorOpen,
} from 'lucide-react';
import { useLanguage } from './LanguageContext.jsx';
import { LANGUAGES } from './i18n.js';

const PAIN_ICONS = [Clock, Bell, Navigation];
const FLOW_VISUALS = ['input', 'calc', 'countdown', 'push'];
const FLOW_STEP_ICONS = [MapPin, Timer, Zap, Bell];

const GRADIENT_BTN =
  'bg-gradient-to-r from-[#EF4444] to-[#F97316] text-white font-bold';

const INPUT_BASE =
  'w-full rounded-xl px-4 tracking-tight outline-none transition-shadow disabled:opacity-60';

const EMAIL_FIELD = `${INPUT_BASE} border-2 border-gray-200 bg-white py-4 text-base font-medium text-[#1a1a1a] shadow-sm placeholder:font-normal placeholder:text-[#64748B] focus:border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/25`;

const OPTIONAL_FIELD = `${INPUT_BASE} resize-none border border-dashed border-gray-200 bg-[#F8FAFC] py-2.5 text-sm text-[#64748B] placeholder:text-[#94A3B8] focus:border-[#EF4444]/60 focus:ring-1 focus:ring-[#EF4444]/15`;

const SHEETDB_URL = import.meta.env.VITE_SHEETDB_URL || '';

const STATE_STYLES = {
  safe: {
    dot: 'bg-emerald-500',
    border: 'border-emerald-200',
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
  },
  warning: {
    dot: 'bg-amber-400',
    border: 'border-amber-200',
    bg: 'bg-amber-50',
    text: 'text-amber-900',
  },
  urgent: {
    dot: 'bg-red-500',
    border: 'border-red-200',
    bg: 'bg-red-50',
    text: 'text-red-800',
  },
  over: {
    dot: 'bg-neutral-800',
    border: 'border-neutral-300',
    bg: 'bg-neutral-100',
    text: 'text-neutral-700',
  },
};

async function getVisitorMeta() {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const now = new Date();

  const date = now.toLocaleDateString('ko-KR', { timeZone: timezone });
  const datetime = now.toLocaleString('ko-KR', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  let country = '';
  let countryCode = '';

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      country = data.country_name || '';
      countryCode = data.country_code || '';
    }
  } catch {
    // IP lookup failed
  }

  if (!country) {
    const locale = navigator.language || 'ko-KR';
    const region = locale.split('-')[1]?.toUpperCase();
    if (region) {
      countryCode = region;
      try {
        const lang = locale.split('-')[0] || 'ko';
        country =
          new Intl.DisplayNames([lang], { type: 'region' }).of(region) || region;
      } catch {
        country = region;
      }
    } else {
      country = timezone;
    }
  }

  return { date, datetime, country, countryCode, timezone };
}

async function submitToSheetDB(email, featureRequest = '') {
  if (!SHEETDB_URL) {
    await new Promise((r) => setTimeout(r, 400));
    return;
  }

  const meta = await getVisitorMeta();

  const response = await fetch(SHEETDB_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      data: [
        {
          email: email.trim(),
          feature_request: featureRequest.trim(),
          date: meta.date,
          datetime: meta.datetime,
          country: meta.country,
          country_code: meta.countryCode,
          timezone: meta.timezone,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error('SheetDB submit failed');
  }
}

function MarkerHighlight({ children }) {
  return (
    <span className="relative inline whitespace-nowrap">
      <span className="relative z-10">{children}</span>
      <span
        aria-hidden
        className="absolute bottom-[0.06em] left-[-0.05em] right-[-0.05em] z-0 h-[0.52em] -skew-x-3 rounded-[2px] bg-[#FECACA]"
      />
    </span>
  );
}

function HeroDescHighlight({ children }) {
  return (
    <span className="mt-3 block text-lg font-extrabold leading-snug tracking-tight text-[#1a1a1a] lg:text-xl">
      {children}
    </span>
  );
}

function HeroHeadlineLine({ line, mark }) {
  if (!mark) return line;

  const index = line.indexOf(mark);
  if (index === -1) return line;

  return (
    <>
      {line.slice(0, index)}
      <MarkerHighlight>{mark}</MarkerHighlight>
      {line.slice(index + mark.length)}
    </>
  );
}

function LanguageSelect() {
  const { lang, setLang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const current = LANGUAGES.find((item) => item.code === lang);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={t.langSelect}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex h-9 items-center gap-2 rounded-full border border-gray-200 bg-white/90 px-3.5 py-2 text-xs font-semibold tracking-tight text-[#1a1a1a] shadow-sm backdrop-blur-sm transition hover:border-[#EF4444]/50 focus:border-[#EF4444] focus:outline-none focus:ring-2 focus:ring-[#EF4444]/20"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-[#EF4444]/20 to-[#F97316]/30">
          <Languages className="h-3 w-3 text-[#1a1a1a]" strokeWidth={2.25} />
        </span>
        <span className="max-w-[5.5rem] truncate sm:max-w-none">{current?.label}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 text-[#64748B] transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t.langSelect}
          className="absolute right-0 top-[calc(100%+0.5rem)] z-50 min-w-[10.5rem] overflow-hidden rounded-2xl border border-gray-100 bg-white p-1.5 shadow-xl shadow-gray-200/70"
        >
          <li className="mb-1 px-2 pt-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8]">
              {t.langMenuTitle}
            </span>
          </li>
          {LANGUAGES.map(({ code, label }) => {
            const selected = lang === code;
            return (
              <li key={code} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => {
                    setLang(code);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-semibold tracking-tight transition ${
                    selected
                      ? 'bg-gradient-to-r from-[#EF4444] to-[#F97316] text-white shadow-sm'
                      : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#1a1a1a]'
                  }`}
                >
                  {label}
                  {selected && <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function BenefitEmphasis({ children }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[#FECACA] px-2.5 py-0.5 text-sm font-bold text-[#991B1B] sm:px-3 sm:py-1 sm:text-base">
      {children}
    </span>
  );
}

function EarlyBirdBenefit({ className = '', alwaysCenter = false }) {
  const { t } = useLanguage();
  const b = t.benefit;

  return (
    <p
      className={`text-center text-base leading-[1.85] text-[#64748B] sm:text-lg sm:leading-relaxed ${
        alwaysCenter ? '' : 'sm:text-left'
      } ${className}`}
    >
      <span className="inline sm:inline">
        {b.prefix}{' '}
        <BenefitEmphasis>{b.badge}</BenefitEmphasis> {b.suffix}
      </span>
      <br className="sm:hidden" />
      <span className="hidden sm:inline">&nbsp;</span>
      <span className="inline sm:inline">
        <BenefitEmphasis>{b.highlight}</BenefitEmphasis>
        {b.end}
      </span>
    </p>
  );
}

function WaitlistForm({ className = '' }) {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [featureRequest, setFeatureRequest] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setError('');

    try {
      await submitToSheetDB(trimmed, featureRequest);
      setSubmitted(true);
    } catch {
      setError(t.form.error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div
        className={`w-full max-w-lg overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm ${className}`}
        role="status"
      >
        <div className="h-1 bg-gradient-to-r from-[#EF4444] to-[#F97316]" />
        <div className="flex items-start gap-4 px-5 py-5 sm:items-center sm:px-6 sm:py-6">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#EF4444]/20 to-[#F97316]/30">
            <CheckCircle2 className="h-5 w-5 text-[#EF4444]" strokeWidth={2.25} />
          </div>
          <div className="text-left">
            <p className="font-bold tracking-tight text-[#1a1a1a] sm:text-base">
              {t.form.successTitle}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-[#64748B]">
              {t.form.successDesc}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-lg ${className}`}>
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3">
        <input
          type="email"
          required
          disabled={loading}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.form.emailPlaceholder}
          className={EMAIL_FIELD}
          aria-label={t.form.emailLabel}
        />
        <textarea
          disabled={loading}
          value={featureRequest}
          onChange={(e) => setFeatureRequest(e.target.value)}
          placeholder={t.form.featurePlaceholder}
          rows={2}
          className={OPTIONAL_FIELD}
          aria-label={t.form.featureLabel}
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded-xl px-6 py-3.5 transition-transform duration-300 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100 ${GRADIENT_BTN}`}
        >
          {loading ? t.form.submitting : t.form.submit}
        </button>
      </form>
      {error && (
        <p className="mt-2 text-center text-sm text-red-600 sm:text-left" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function PhoneMockup() {
  const { t } = useLanguage();
  const p = t.phone;

  return (
    <div className="relative w-full max-w-sm">
      <div className="overflow-hidden rounded-[2rem] border-[3px] border-[#1a1a1a] bg-[#0f0f0f] shadow-2xl shadow-red-200/40">
        <div className="flex items-center justify-between bg-[#1a1a1a] px-5 py-2">
          <span className="text-[10px] font-medium text-white/60">{p.statusBar}</span>
          <div className="flex gap-1">
            <span className="h-1 w-3 rounded-full bg-white/40" />
            <span className="h-1 w-3 rounded-full bg-white/40" />
            <span className="h-1 w-3 rounded-full bg-white/60" />
          </div>
        </div>

        <div className="animate-pulse-urgent bg-gradient-to-b from-[#7F1D1D] to-[#450a0a] px-5 pb-6 pt-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-red-200/80">
            🚨 {p.countdownLabel}
          </p>
          <p className="mt-2 font-mono text-6xl font-black tracking-tighter text-white">
            {p.countdown}
          </p>
          <p className="mt-4 text-sm font-bold leading-snug text-red-100">{p.message}</p>
          <p className="mt-3 text-[11px] text-red-200/60">{p.appointment}</p>
        </div>

        <div className="space-y-2 bg-[#1a1a1a] p-3">
          <div className="rounded-xl bg-white/10 px-3 py-2.5 backdrop-blur">
            <p className="text-[9px] font-bold uppercase tracking-wider text-amber-400/90">
              PUSH · 20min
            </p>
            <p className="mt-0.5 text-[11px] font-medium leading-snug text-white/90">
              {p.push20}
            </p>
          </div>
          <div className="rounded-xl border border-red-500/40 bg-red-950/50 px-3 py-2.5">
            <p className="text-[9px] font-bold uppercase tracking-wider text-red-400">
              PUSH · 5min
            </p>
            <p className="mt-0.5 text-[11px] font-bold leading-snug text-red-100">
              {p.push5}
            </p>
          </div>
        </div>
      </div>

      <div className="absolute -left-2 top-16 hidden rounded-lg border border-red-200/50 bg-red-50 px-3 py-2 shadow-lg sm:block lg:-left-6">
        <div className="flex items-center gap-2">
          <DoorOpen className="h-4 w-4 shrink-0 text-red-600" />
          <p className="text-[10px] font-medium tracking-tight text-red-900">
            {t.reverse.desc.slice(0, 28)}…
          </p>
        </div>
      </div>
    </div>
  );
}

function FlowVisual({ type }) {
  const { t } = useLanguage();
  const v = t.flow.visual;

  if (type === 'input') {
    return (
      <div className="flex min-h-[240px] w-full flex-col justify-center gap-3 rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 p-6">
        {[
          { label: 'When', value: v.when },
          { label: 'From', value: v.from },
          { label: 'To', value: v.to },
        ].map((row) => (
          <div
            key={row.label}
            className="flex items-center gap-3 rounded-xl border border-white bg-white/90 px-4 py-3 shadow-sm"
          >
            <MapPin className="h-4 w-4 shrink-0 text-[#EF4444]" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                {row.label}
              </p>
              <p className="text-sm font-bold text-[#1a1a1a]">{row.value}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'calc') {
    return (
      <div className="flex min-h-[240px] w-full flex-col justify-center gap-2 rounded-2xl bg-gradient-to-tr from-orange-50 to-red-50 p-6">
        <div className="rounded-xl bg-white/90 px-4 py-3 shadow-sm">
          <p className="text-xs text-[#64748B]">{v.pureTravel}</p>
        </div>
        <div className="flex justify-center">
          <span className="text-lg font-bold text-[#EF4444]">+</span>
        </div>
        <div className="rounded-xl border-2 border-dashed border-[#EF4444]/40 bg-[#FEF2F2] px-4 py-3">
          <p className="text-xs font-bold text-[#EF4444]">{v.buffer}</p>
        </div>
        <div className="mt-2 flex justify-center">
          <span className="text-lg font-bold text-[#64748B]">=</span>
        </div>
        <div className="rounded-xl bg-gradient-to-r from-[#EF4444] to-[#F97316] px-4 py-3 shadow-md">
          <p className="text-center text-sm font-black text-white">{v.deadline}</p>
        </div>
      </div>
    );
  }

  if (type === 'countdown') {
    return (
      <div className="relative flex min-h-[240px] w-full flex-col items-center justify-center rounded-2xl bg-gradient-to-b from-[#7F1D1D] to-[#450a0a] p-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-red-200/70">
          🚨 {t.phone.countdownLabel}
        </p>
        <p className="mt-2 font-mono text-5xl font-black text-white">{t.phone.countdown}</p>
        <p className="mt-4 max-w-[200px] text-sm font-bold leading-snug text-red-100">
          {t.phone.message}
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[240px] w-full flex-col justify-center gap-3 rounded-2xl bg-[#1a1a1a] p-6">
      <div className="rounded-xl bg-white/10 px-4 py-3">
        <p className="text-[10px] font-bold text-amber-400">{v.push20label}</p>
        <p className="mt-1 text-xs font-medium text-white/90">{t.phone.push20}</p>
      </div>
      <div className="rounded-xl border border-red-500/50 bg-red-950/60 px-4 py-3">
        <p className="text-[10px] font-bold text-red-400">{v.push5label}</p>
        <p className="mt-1 text-xs font-bold text-red-100">{t.phone.push5}</p>
      </div>
    </div>
  );
}

function BrandLogo() {
  const { t } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#EF4444] to-[#F97316] text-sm shadow-sm">
        🚨
      </span>
      <div className="leading-tight">
        <span className="text-lg font-black tracking-tighter text-[#1a1a1a]">
          {t.brand}
        </span>
        <span className="ml-1.5 text-xs font-semibold text-[#EF4444]">{t.brandSub}</span>
      </div>
    </div>
  );
}

export default function App() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white tracking-tight antialiased">
      <header className="fixed top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-24">
          <BrandLogo />
          <LanguageSelect />
        </nav>
      </header>

      <main>
        <section className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-between px-6 pb-12 pt-24 lg:flex-row lg:px-24">
          <div className="mb-12 flex flex-1 flex-col justify-center lg:mb-0 lg:max-w-xl lg:pr-8">
            <h1 className="mb-6 text-4xl font-bold leading-tight text-[#1a1a1a] lg:text-5xl xl:text-6xl">
              {t.hero.h1.map((line, i) => (
                <span key={i}>
                  {i > 0 && <br />}
                  <HeroHeadlineLine
                    line={line}
                    mark={
                      t.hero.h1Mark?.lineIndex === i ? t.hero.h1Mark.word : undefined
                    }
                  />
                </span>
              ))}
            </h1>
            <p className="mb-8 text-base leading-relaxed text-[#64748B] lg:text-lg">
              {t.hero.descLead}
              <HeroDescHighlight>{t.hero.descHighlight}</HeroDescHighlight>
            </p>
            <WaitlistForm />
            <EarlyBirdBenefit className="mt-4" />
          </div>

          <div className="flex flex-1 items-center justify-center lg:justify-end">
            <PhoneMockup />
          </div>
        </section>

        <section className="bg-[#F8FAFC] px-6 py-20">
          <h2 className="mb-12 text-center text-3xl font-bold leading-snug text-[#1a1a1a]">
            {t.pain.title.map((line, i) => (
              <span key={line}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </h2>
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
            {t.pain.cards.map((card, index) => {
              const Icon = PAIN_ICONS[index];
              return (
                <article
                  key={card.title}
                  className="rounded-2xl bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#EF4444]/15 to-[#F97316]/25">
                    <Icon className="h-6 w-6 text-[#1a1a1a]" strokeWidth={1.75} />
                  </div>
                  <h3 className="mb-3 text-lg font-bold text-[#1a1a1a]">{card.title}</h3>
                  <p className="text-sm leading-relaxed text-[#64748B]">{card.desc}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-24 max-lg:bg-[#F8FAFC] lg:bg-transparent">
          <h2 className="mb-10 text-center text-3xl font-bold leading-snug text-[#1a1a1a] lg:mb-16 lg:text-4xl">
            {t.flow.title.map((line, i) => (
              <span key={line}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </h2>
          <div className="space-y-6 lg:space-y-28">
            {t.flow.steps.map((step, index) => {
              const StepIcon = FLOW_STEP_ICONS[index];
              return (
                <div
                  key={step.title}
                  className={`flex w-full flex-col items-stretch gap-8 overflow-hidden max-lg:rounded-2xl max-lg:border max-lg:border-gray-200 max-lg:bg-white max-lg:p-5 max-lg:shadow-sm lg:gap-16 ${
                    index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'
                  }`}
                >
                  <div className="w-full lg:flex-1">
                    <FlowVisual type={FLOW_VISUALS[index]} />
                  </div>
                  <div className="flex-1 max-lg:border-t max-lg:border-gray-100 max-lg:pt-6 lg:border-0 lg:pt-0">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FEF2F2] text-sm font-black text-[#EF4444]">
                        {index + 1}
                      </span>
                      <StepIcon className="h-5 w-5 text-[#EF4444]" strokeWidth={2} />
                    </div>
                    <h3 className="mb-4 text-xl font-bold text-[#1a1a1a] lg:text-2xl">
                      {step.title}
                    </h3>
                    <p className="text-base leading-relaxed text-[#64748B] lg:text-lg">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-[#F8FAFC] px-6 py-20">
          <h2 className="mb-12 text-center text-3xl font-bold leading-snug text-[#1a1a1a]">
            {t.states.title.map((line, i) => (
              <span key={line}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </h2>
          <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.states.items.map((state) => {
              const style = STATE_STYLES[state.color];
              return (
                <article
                  key={state.name}
                  className={`rounded-2xl border p-6 ${style.border} ${style.bg}`}
                >
                  <div className="mb-3 flex items-center gap-2">
                    <span className={`h-3 w-3 rounded-full ${style.dot}`} />
                    <span className={`text-sm font-black ${style.text}`}>{state.name}</span>
                  </div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                    {state.time}
                  </p>
                  <p className={`text-sm font-medium leading-relaxed ${style.text}`}>
                    {state.message}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="bg-[#1a1a1a] px-6 py-20 text-center text-white">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#EF4444] to-[#F97316] text-2xl">
            <AlertTriangle className="h-7 w-7 text-white" strokeWidth={2} />
          </div>
          <h2 className="mb-6 text-2xl font-bold leading-snug tracking-tight sm:text-3xl lg:text-4xl">
            {t.reverse.title.map((line, i) => (
              <span key={line}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-white/70 lg:text-lg">
            {t.reverse.desc}
          </p>
        </section>

        <section className="px-6 py-24">
          <div className="mx-auto max-w-5xl rounded-3xl bg-gradient-to-br from-red-50 to-orange-50 p-8 text-center sm:p-12">
            <h2 className="mb-4 text-2xl font-bold leading-snug text-[#1a1a1a] sm:text-3xl">
              {t.cta.title.map((line, i) => (
                <span key={line}>
                  {i > 0 && <br />}
                  {line}
                </span>
              ))}
            </h2>
            <EarlyBirdBenefit className="mb-8" alwaysCenter />
            <div className="flex justify-center">
              <WaitlistForm className="justify-center" />
            </div>
          </div>

          <footer className="mt-16 text-center text-sm text-[#64748B]/80">
            {t.footer}
          </footer>
        </section>
      </main>

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white/90 text-[#1a1a1a] shadow-md backdrop-blur transition-transform duration-300 hover:scale-105"
        aria-label={t.scrollTop}
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </div>
  );
}
