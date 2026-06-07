'use client'

// Auth-gated, per-user content — never statically prerender
export const dynamic = 'force-dynamic'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createClient, type Session, type SupabaseClient } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { ChevronLeft, ChevronRight, Loader2, Mail, CheckCircle2 } from 'lucide-react'

// Lazy singleton — only created at runtime in the browser, never during build/SSR
let _supabase: SupabaseClient | null = null
function getSupabase(): SupabaseClient {
  if (!_supabase) {
    _supabase = createClient(
      process.env.NEXT_PUBLIC_DELIVERY_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_DELIVERY_SUPABASE_ANON_KEY!,
      { auth: { detectSessionInUrl: true, persistSession: true } }
    )
  }
  return _supabase
}

type FormData = {
  business_name: string; project_name: string; primary_contact: string
  other_stakeholders: string; target_kickoff: string; target_launch: string
  one_line_description: string; target_audience: string; why_now: string
  primary_goal: string; business_metrics: string; specific_targets: string
  brand_direction: string; favourite_brands: string; pinterest_board: string
  favourite_websites: string; visual_preferences: string; specific_references: string
  existing_content: string; new_content_needed: string; content_writer: string
  pages_needed: string; key_features: string; integrations: string
  forms: string; compliance: string; current_website_admin: string
  domain_registrar: string; hosting: string; email_service: string; other_platforms: string
}

const EMPTY: FormData = {
  business_name: '', project_name: '', primary_contact: '', other_stakeholders: '',
  target_kickoff: '', target_launch: '', one_line_description: '', target_audience: '',
  why_now: '', primary_goal: '', business_metrics: '', specific_targets: '',
  brand_direction: '', favourite_brands: '', pinterest_board: '', favourite_websites: '',
  visual_preferences: '', specific_references: '', existing_content: '', new_content_needed: '',
  content_writer: '', pages_needed: '', key_features: '', integrations: '', forms: '',
  compliance: '', current_website_admin: '', domain_registrar: '', hosting: '',
  email_service: '', other_platforms: '',
}

const STEPS = [
  { title: 'Project Snapshot', description: 'Start with the basics — names, contacts, and key dates.' },
  { title: 'About Your Business', description: 'Help us understand who you are and who you serve.' },
  { title: 'Goals & Success', description: 'Define what success looks like for this project.' },
  { title: 'Brand', description: 'Share your brand direction and what inspires you.' },
  { title: 'Design Direction', description: 'Show us your visual taste and aesthetic preferences.' },
  { title: 'Content', description: 'Plan what exists, what\'s needed, and who\'s writing it.' },
  { title: 'Functionality', description: 'Define the pages, features, and tools you need.' },
  { title: 'Technical Access', description: 'Share any access we\'ll need to get started.' },
  { title: 'Book Your Consultation', description: 'Schedule your kickoff call and we\'ll take it from here.' },
]

export default function ClientPortal() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [form, setForm] = useState<FormData>(EMPTY)
  const initialized = useRef(false)

  useEffect(() => {
    const sb = getSupabase()
    const { data: { subscription } } = sb.auth.onAuthStateChange(async (_, session) => {
      setSession(session)
      setLoading(false)

      if (session && !initialized.current) {
        initialized.current = true
        const email = session.user.email!

        const { data } = await sb
          .from('client_onboarding')
          .select('*')
          .eq('email', email)
          .single()

        if (data) {
          const { current_step, completed_at, ...fields } = data
          setForm(prev => ({ ...prev, ...fields }))
          setStep(current_step ?? 0)
          if (completed_at) setCompleted(true)

          if (!data.user_id) {
            await sb
              .from('client_onboarding')
              .update({ user_id: session.user.id })
              .eq('email', email)
          }
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  const setField = useCallback((k: keyof FormData, v: string) => {
    setForm(prev => ({ ...prev, [k]: v }))
  }, [])

  const saveAndAdvance = async (nextStep: number) => {
    if (!session) return
    setSaving(true)
    await getSupabase()
      .from('client_onboarding')
      .update({ ...form, current_step: nextStep, updated_at: new Date().toISOString() })
      .eq('email', session.user.email)
    setSaving(false)
    setStep(nextStep)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const markComplete = async () => {
    if (!session) return
    setSaving(true)
    await getSupabase()
      .from('client_onboarding')
      .update({ ...form, current_step: STEPS.length, completed_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq('email', session.user.email)
    await fetch('/api/client-portal/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: session.user.email }),
    })
    setSaving(false)
    setCompleted(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-white/30" />
      </div>
    )
  }

  if (!session) return <UnauthScreen />
  if (completed) return <DoneScreen />

  const progress = Math.round((step / STEPS.length) * 100)
  const isLast = step === STEPS.length - 1

  const F = (key: keyof FormData, label: string, opts?: { placeholder?: string; multi?: boolean; rows?: number }) => (
    <div className="space-y-2">
      <Label htmlFor={key} className="text-sm font-normal text-neutral-400">{label}</Label>
      {opts?.multi
        ? <Textarea id={key} value={form[key]} onChange={e => setField(key, e.target.value)}
            placeholder={opts.placeholder} rows={opts.rows ?? 4}
            className="bg-white/5 border-white/10 text-white placeholder:text-neutral-600 resize-none focus-visible:ring-white/20" />
        : <Input id={key} value={form[key]} onChange={e => setField(key, e.target.value)}
            placeholder={opts?.placeholder}
            className="bg-white/5 border-white/10 text-white placeholder:text-neutral-600 focus-visible:ring-white/20" />
      }
    </div>
  )

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Sticky header */}
      <header className="sticky top-0 z-20 border-b border-white/8 bg-black/95 backdrop-blur-md px-6 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">Piranha Studios</p>
              <p className="text-sm font-medium text-white leading-tight">{STEPS[step].title}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-neutral-600">{step + 1} / {STEPS.length}</p>
              <p className="text-xs text-neutral-400 mt-0.5">{progress}% complete</p>
            </div>
          </div>
          <Progress value={progress} className="h-px bg-white/8 [&>div]:bg-white" />
        </div>
      </header>

      {/* Step content */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">{STEPS[step].title}</h1>
          <p className="mt-1.5 text-sm text-neutral-400">{STEPS[step].description}</p>
        </div>

        <div className="space-y-6">
          {step === 0 && <>
            {F('business_name', 'Business name', { placeholder: 'Exactly as it should appear in headers and copy' })}
            {F('project_name', 'Project name', { placeholder: 'e.g. Website redesign, Brand refresh' })}
            {F('primary_contact', 'Primary point of contact', { placeholder: 'Name, email, phone' })}
            {F('other_stakeholders', 'Other stakeholders / approvers', { placeholder: 'Name and role', multi: true, rows: 3 })}
            {F('target_kickoff', 'Target kickoff date', { placeholder: 'e.g. 1 September 2025' })}
            {F('target_launch', 'Target launch date', { placeholder: 'e.g. 1 November 2025' })}
          </>}

          {step === 1 && <>
            {F('one_line_description', 'One-line description', { placeholder: 'How would you describe what you do to a stranger?' })}
            {F('target_audience', 'Target audience', { placeholder: 'Age, gender, location, income, interests, where they spend time online — the more specific, the better', multi: true, rows: 5 })}
            {F('why_now', 'Why this project, why now?', { placeholder: 'Launch, rebrand, outgrowing current site, funding round, just needs to look right?', multi: true, rows: 4 })}
          </>}

          {step === 2 && <>
            {F('primary_goal', 'Primary goal', { placeholder: 'What does this project need to achieve to be a success?', multi: true, rows: 4 })}
            {F('business_metrics', 'Business metrics', { placeholder: 'What should the result drive? Bookings, sales, leads, signups, brand recognition…', multi: true, rows: 4 })}
            {F('specific_targets', 'Specific targets', { placeholder: 'Any numbers? Monthly leads, conversion rate, traffic, average order value…', multi: true, rows: 3 })}
          </>}

          {step === 3 && <>
            <p className="text-xs text-neutral-500 -mb-2">
              Upload logos, colour palettes, fonts, and brand assets — we'll send you a secure link separately.
            </p>
            {F('brand_direction', 'Brand direction', { placeholder: 'Anything you want to evolve, refresh, or move away from?', multi: true, rows: 4 })}
            {F('favourite_brands', 'Three favourite brands', { placeholder: 'Name three brands you love and what you love about each. Not necessarily in your industry.', multi: true, rows: 5 })}
            {F('pinterest_board', 'Pinterest inspiration board', { placeholder: 'Link to a board that captures the look and vibe you\'re drawn to' })}
          </>}

          {step === 4 && <>
            {F('favourite_websites', 'Three favourite websites', { placeholder: 'Name three sites and what you love about each', multi: true, rows: 5 })}
            {F('visual_preferences', 'Visual preferences', { placeholder: 'Modern vs. classic, minimal vs. rich, animations, dark mode, illustration style…', multi: true, rows: 4 })}
            {F('specific_references', 'Specific references', { placeholder: 'Links or screenshots of layouts, interactions, or elements you\'d like us to consider', multi: true, rows: 4 })}
          </>}

          {step === 5 && <>
            {F('existing_content', 'Existing content', { placeholder: 'Link to your current site or content. What should we keep, edit, or remove?', multi: true, rows: 5 })}
            {F('new_content_needed', 'New content needed', { placeholder: 'Pages, sections, blog posts, case studies, testimonials…', multi: true, rows: 4 })}
            {F('content_writer', 'Who\'s writing it?', { placeholder: 'You, us, or a contributor?' })}
          </>}

          {step === 6 && <>
            {F('pages_needed', 'Pages needed', { placeholder: 'List the main pages and sections', multi: true, rows: 4 })}
            {F('key_features', 'Key features', { placeholder: 'Checkout, booking, member login, gated content, blog, search, multi-language…', multi: true, rows: 4 })}
            {F('integrations', 'Integrations', { placeholder: 'CRM, payment, email marketing, analytics, calendars, AI tooling. Tool names help.', multi: true, rows: 3 })}
            {F('forms', 'Forms', { placeholder: 'What should each form capture, and where should the data go?', multi: true, rows: 3 })}
            {F('compliance', 'Compliance', { placeholder: 'GDPR, accessibility, industry-specific requirements?', multi: true, rows: 2 })}
          </>}

          {step === 7 && <>
            <p className="text-xs text-neutral-500 -mb-2">
              Share only what you have — we'll request anything else as we go. Prefer to share credentials securely? Just ask and we'll send a secure link.
            </p>
            {F('current_website_admin', 'Current website admin', { placeholder: 'Login URL or instructions for granting access' })}
            {F('domain_registrar', 'Domain registrar', { placeholder: 'e.g. GoDaddy, Cloudflare, Namecheap' })}
            {F('hosting', 'Hosting', { placeholder: 'Provider name or control panel access' })}
            {F('email_service', 'Email service', { placeholder: 'e.g. Google Workspace, Klaviyo, Mailchimp' })}
            {F('other_platforms', 'Other platforms', { placeholder: 'Anything else we\'ll need to connect to', multi: true, rows: 3 })}
          </>}

          {step === 8 && (
            <div>
              <div className="rounded-xl overflow-hidden border border-white/10 bg-neutral-950">
                <iframe
                  src="https://calendly.com/piranha-consultation/business-evaluation?embed_type=Inline&hide_gdpr_banner=1&background_color=0a0a0a&text_color=ffffff&primary_color=ffffff"
                  width="100%"
                  height="700"
                  frameBorder={0}
                  title="Book your Piranha Studios consultation"
                />
              </div>
              <p className="text-center text-xs text-neutral-600 mt-6">
                Already booked your call?{' '}
                <button
                  onClick={markComplete}
                  disabled={saving}
                  className="text-neutral-400 underline underline-offset-4 hover:text-white transition-colors"
                >
                  Mark as complete
                </button>
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Sticky footer nav (hidden on Calendly step) */}
      {!isLast && (
        <footer className="sticky bottom-0 border-t border-white/8 bg-black/95 backdrop-blur-md px-6 py-4">
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => saveAndAdvance(step - 1)}
              disabled={step === 0 || saving}
              className="text-neutral-500 hover:text-white"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <Button
              size="sm"
              onClick={() => saveAndAdvance(step + 1)}
              disabled={saving}
              className="bg-white text-black hover:bg-neutral-100 font-medium min-w-36"
            >
              {saving
                ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" />
                : null}
              {step === STEPS.length - 2 ? 'Save & Book Call' : 'Save & Continue'}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </footer>
      )}
    </div>
  )
}

function UnauthScreen() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mx-auto mb-6">
          <Mail className="h-5 w-5 text-white/60" />
        </div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 mb-3">Piranha Studios</p>
        <h1 className="text-xl font-semibold text-white mb-2">Check your email</h1>
        <p className="text-sm text-neutral-400 leading-relaxed">
          We sent you a secure sign-in link. Click it to access your client portal and complete your project prep pack.
        </p>
        <p className="text-xs text-neutral-600 mt-8">
          Can&apos;t find it? Check your spam folder or email{' '}
          <a href="mailto:hello@piranha-studios.co.uk" className="text-neutral-400 underline underline-offset-4 hover:text-white transition-colors">
            hello@piranha-studios.co.uk
          </a>
        </p>
      </div>
    </div>
  )
}

function DoneScreen() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <CheckCircle2 className="h-10 w-10 text-white mx-auto mb-6" strokeWidth={1.5} />
        <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 mb-3">Piranha Studios</p>
        <h1 className="text-xl font-semibold text-white mb-2">You&apos;re all set</h1>
        <p className="text-sm text-neutral-400 leading-relaxed">
          Your prep pack is complete and your consultation is booked. We&apos;ll review everything before the call and come prepared.
        </p>
        <p className="text-xs text-neutral-600 mt-8">
          Questions in the meantime?{' '}
          <a href="mailto:hello@piranha-studios.co.uk" className="text-neutral-400 underline underline-offset-4 hover:text-white transition-colors">
            hello@piranha-studios.co.uk
          </a>
        </p>
      </div>
    </div>
  )
}
