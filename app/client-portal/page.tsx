'use client'

// Auth-gated, per-user content — never statically prerender
export const dynamic = 'force-dynamic'

import { useState, useEffect, useCallback, useRef } from 'react'
import { type Session } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { ChevronLeft, ChevronRight, Loader2, Mail, CheckCircle2, Plus, X, CalendarIcon, Upload, FileIcon, Send, MessageSquare, ExternalLink, Circle, Eye, Flag, CreditCard } from 'lucide-react'
import { format, parseISO, isValid } from 'date-fns'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  EMPTY, STEPS, emptyStakeholder, getPortalClient, pickForm,
  parseStakeholders, serializeStakeholders,
  parseBrandAssets, serializeBrandAssets, uploadBrandAsset, removeBrandAsset,
  getBrandAssetSignedUrl, MAX_BRAND_FILE_BYTES,
  loadOnboarding, claimOnboarding, saveProgress, completeOnboarding, sendSignInLink,
  fetchProjectDashboard, fetchComments, postComment, fetchTaskDetail, approveProject,
  fetchMembers, addMember, removeMember,
  logInfo,
  type FormData, type Stakeholder, type BrandAsset,
  type ProjectDashboard as DashboardData, type PortalComment, type TaskDetail,
  type ChatChannel, type HubMembers,
} from '@/lib/data/portal'

export default function ClientPortal() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [form, setForm] = useState<FormData>(EMPTY)
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([emptyStakeholder()])
  const [brandAssets, setBrandAssets] = useState<BrandAsset[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const initialized = useRef(false)

  // Auth: keep this callback SYNCHRONOUS. Awaiting Supabase calls inside
  // onAuthStateChange re-enters the auth client's Web Lock (via getSession)
  // and can deadlock — the promise never resolves and saves hang forever.
  // Data loading is done in the separate effect below, outside that lock.
  useEffect(() => {
    const sb = getPortalClient()
    sb.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data: { subscription } } = sb.auth.onAuthStateChange((_, s) => {
      setSession(s)
      setLoading(false)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Load onboarding data once a session exists — outside the auth-lock.
  useEffect(() => {
    if (!session || initialized.current) return
    initialized.current = true
    const email = session.user.email!
    logInfo('session: authenticated', { email })

    ;(async () => {
      const data = await loadOnboarding(email)
      if (!data) return
      setForm(prev => ({ ...prev, ...pickForm(data) }))
      setStep(data.current_step ?? 0)
      if (data.completed_at) setCompleted(true)
      setStakeholders(parseStakeholders(data.other_stakeholders))
      setBrandAssets(parseBrandAssets(data.brand_assets))

      if (!data.user_id) await claimOnboarding(email, session.user.id)
    })()
  }, [session])

  const setField = useCallback((k: keyof FormData, v: string) => {
    setForm(prev => ({ ...prev, [k]: v }))
  }, [])

  const updateStakeholders = useCallback((next: Stakeholder[]) => {
    setStakeholders(next)
    setForm(prev => ({ ...prev, other_stakeholders: serializeStakeholders(next) }))
  }, [])

  const updateBrandAssets = useCallback((next: BrandAsset[]) => {
    setBrandAssets(next)
    setForm(prev => ({ ...prev, brand_assets: serializeBrandAssets(next) }))
  }, [])

  const onBrandFiles = async (files: FileList | null) => {
    if (!files || !session) return
    setUploadError(null)
    setUploading(true)
    const added: BrandAsset[] = []
    for (const file of Array.from(files)) {
      if (file.size > MAX_BRAND_FILE_BYTES) {
        setUploadError(`${file.name} is over 50MB and was skipped.`)
        continue
      }
      const asset = await uploadBrandAsset(session.user.id, file)
      if (asset) added.push(asset)
      else setUploadError(`Couldn't upload ${file.name}. Please try again.`)
    }
    if (added.length) updateBrandAssets([...brandAssets, ...added])
    setUploading(false)
  }

  const onRemoveBrandAsset = async (asset: BrandAsset) => {
    updateBrandAssets(brandAssets.filter(a => a.path !== asset.path))
    await removeBrandAsset(asset.path)
  }

  const saveAndAdvance = async (nextStep: number) => {
    if (!session) return
    setSaving(true)
    const { ok } = await saveProgress(session.user.email!, form, nextStep)
    setSaving(false)
    if (ok) {
      setStep(nextStep)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const markComplete = async () => {
    if (!session) return
    setSaving(true)
    const { ok } = await completeOnboarding(session.user.email!, form)
    setSaving(false)
    if (ok) setCompleted(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-white/30" />
      </div>
    )
  }

  if (!session) return <UnauthScreen />
  if (completed) return <ProjectDashboard form={form} stakeholders={stakeholders} brandAssets={brandAssets} />

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
      <header className="sticky top-16 z-20 border-b border-white/8 bg-black/95 backdrop-blur-md px-6 py-4">
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

            {/* Primary contact */}
            <div className="space-y-4 pt-2">
              <Label className="text-sm font-normal text-neutral-400">Primary point of contact</Label>
              <div className="space-y-1.5">
                <p className="text-xs text-neutral-500">Preferred contact method</p>
                <div className="flex gap-2">
                  {(['whatsapp', 'email'] as const).map(method => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => {
                        const next = form.primary_contact_method === method ? '' : method
                        setField('primary_contact_method', next)
                        if (next) updateStakeholders(stakeholders.map(s => ({ ...s, method: next })))
                      }}
                      className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        form.primary_contact_method === method
                          ? 'bg-white text-black border-white'
                          : 'bg-transparent text-neutral-400 border-white/15 hover:border-white/30 hover:text-white'
                      }`}
                    >
                      {method === 'whatsapp' ? 'WhatsApp' : 'Email'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {F('primary_contact_name', 'Name', { placeholder: 'Full name' })}
                {F('primary_contact_role', 'Role', { placeholder: 'e.g. Founder, Marketing Lead' })}
              </div>
              {F('primary_contact',
                form.primary_contact_method === 'whatsapp' ? 'WhatsApp number'
                  : form.primary_contact_method === 'email' ? 'Email address'
                  : 'Contact detail',
                {
                  placeholder:
                    form.primary_contact_method === 'whatsapp' ? '+44 7700 900000'
                    : form.primary_contact_method === 'email' ? 'you@example.com'
                    : 'Phone or email'
                }
              )}
            </div>

            {/* Other stakeholders */}
            <div className="space-y-3 pt-2">
              <Label className="text-sm font-normal text-neutral-400">Other stakeholders / approvers</Label>
              {stakeholders.map((s, i) => (
                <div key={i} className="rounded-lg border border-white/8 bg-white/[0.02] p-4 space-y-3">
                  {stakeholders.length > 1 && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => updateStakeholders(stakeholders.filter((_, j) => j !== i))}
                        className="text-neutral-600 hover:text-neutral-300 transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-sm font-normal text-neutral-400">Name</Label>
                      <Input
                        value={s.name}
                        onChange={e => { const next = [...stakeholders]; next[i] = { ...next[i], name: e.target.value }; updateStakeholders(next) }}
                        placeholder="Full name"
                        className="bg-white/5 border-white/10 text-white placeholder:text-neutral-600 focus-visible:ring-white/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-normal text-neutral-400">Role</Label>
                      <Input
                        value={s.role}
                        onChange={e => { const next = [...stakeholders]; next[i] = { ...next[i], role: e.target.value }; updateStakeholders(next) }}
                        placeholder="e.g. Creative Director"
                        className="bg-white/5 border-white/10 text-white placeholder:text-neutral-600 focus-visible:ring-white/20"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-normal text-neutral-400">
                      {form.primary_contact_method === 'whatsapp' ? 'WhatsApp number' : form.primary_contact_method === 'email' ? 'Email address' : 'Contact detail'}
                    </Label>
                    <Input
                      value={s.detail}
                      onChange={e => { const next = [...stakeholders]; next[i] = { ...next[i], detail: e.target.value }; updateStakeholders(next) }}
                      placeholder={form.primary_contact_method === 'whatsapp' ? '+44 7700 900000' : form.primary_contact_method === 'email' ? 'you@example.com' : 'Phone or email'}
                      className="bg-white/5 border-white/10 text-white placeholder:text-neutral-600 focus-visible:ring-white/20"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => updateStakeholders([...stakeholders, emptyStakeholder()])}
                className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-white transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                Add another
              </button>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-normal text-neutral-400">Target kickoff date</Label>
              <DatePicker value={form.target_kickoff} onChange={v => setField('target_kickoff', v)} placeholder="Pick a date" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-normal text-neutral-400">Target launch date</Label>
              <DatePicker value={form.target_launch} onChange={v => setField('target_launch', v)} placeholder="Pick a date" />
            </div>
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
            {/* Brand asset uploads */}
            <div className="space-y-3">
              <Label className="text-sm font-normal text-neutral-400">Brand assets</Label>
              <p className="text-xs text-neutral-500 -mt-1">
                Upload logos, colour palettes, fonts, and any existing brand materials. Up to 50MB each — only you and the team can see them.
              </p>
              <label
                onDragEnter={e => { e.preventDefault(); if (!uploading) setDragActive(true) }}
                onDragOver={e => { e.preventDefault(); if (!uploading) setDragActive(true) }}
                onDragLeave={e => { e.preventDefault(); setDragActive(false) }}
                onDrop={e => {
                  e.preventDefault()
                  setDragActive(false)
                  if (!uploading) onBrandFiles(e.dataTransfer.files)
                }}
                className={`flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-6 py-8 transition-colors ${
                  uploading ? 'border-white/10 cursor-default'
                    : dragActive ? 'border-white/40 bg-white/[0.04] cursor-pointer'
                    : 'border-white/15 hover:border-white/30 cursor-pointer'
                }`}
              >
                {uploading
                  ? <Loader2 className="h-5 w-5 text-neutral-500 animate-spin" />
                  : <Upload className="h-5 w-5 text-neutral-500" />}
                <span className="text-sm text-neutral-400">{uploading ? 'Uploading…' : dragActive ? 'Drop to upload' : 'Click to upload or drag files here'}</span>
                <input
                  type="file"
                  multiple
                  disabled={uploading}
                  className="hidden"
                  onChange={e => { onBrandFiles(e.target.files); e.target.value = '' }}
                />
              </label>
              {uploadError && <p className="text-xs text-red-400/80">{uploadError}</p>}
              {brandAssets.length > 0 && (
                <div className="space-y-2">
                  {brandAssets.map(asset => (
                    <BrandAssetRow key={asset.path} asset={asset} onRemove={() => onRemoveBrandAsset(asset)} />
                  ))}
                </div>
              )}
            </div>
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

function formatBytes(bytes: number): string {
  if (!bytes) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  return `${(bytes / Math.pow(1024, i)).toFixed(i ? 1 : 0)} ${units[i]}`
}

function BrandAssetRow({ asset, onRemove }: { asset: BrandAsset; onRemove?: () => void }) {
  const [url, setUrl] = useState<string | null>(null)
  const isImage = asset.type?.startsWith('image/')

  useEffect(() => {
    let active = true
    getBrandAssetSignedUrl(asset.path).then(u => { if (active) setUrl(u) })
    return () => { active = false }
  }, [asset.path])

  return (
    <div className="flex items-center gap-3 rounded-lg border border-white/8 bg-white/[0.02] p-2.5">
      <div className="h-10 w-10 rounded bg-white/5 flex items-center justify-center overflow-hidden shrink-0">
        {isImage && url
          ? <img src={url} alt={asset.name} className="h-full w-full object-cover" />
          : <FileIcon className="h-4 w-4 text-neutral-500" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-white truncate">{asset.name}</p>
        <p className="text-xs text-neutral-600">{formatBytes(asset.size)}</p>
      </div>
      {onRemove
        ? <button
            type="button"
            onClick={onRemove}
            className="text-neutral-600 hover:text-neutral-300 transition-colors shrink-0"
            aria-label={`Remove ${asset.name}`}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        : url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-600 hover:text-white transition-colors shrink-0"
              aria-label={`Open ${asset.name}`}
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
    </div>
  )
}

function DatePicker({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  const parsed = value ? parseISO(value) : undefined
  const selected = parsed && isValid(parsed) ? parsed : undefined

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex items-center justify-between w-full px-3 py-2 rounded-md border border-white/10 bg-white/5 text-sm text-left transition-colors hover:border-white/20 focus:outline-none focus-visible:ring-1 focus-visible:ring-white/20"
        >
          <span className={selected ? 'text-white' : 'text-neutral-600'}>
            {selected ? format(selected, 'd MMMM yyyy') : (placeholder ?? 'Pick a date')}
          </span>
          <CalendarIcon className="h-4 w-4 text-neutral-500 shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-neutral-900 border-white/10" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={day => onChange(day ? format(day, 'yyyy-MM-dd') : '')}
          initialFocus
          classNames={{
            months: 'flex flex-col',
            month: 'space-y-4',
            caption: 'flex justify-center pt-1 relative items-center text-white',
            caption_label: 'text-sm font-medium',
            nav_button: 'h-7 w-7 bg-transparent p-0 text-neutral-400 hover:text-white border border-white/10 hover:border-white/30 rounded-md flex items-center justify-center',
            nav_button_previous: 'absolute left-1',
            nav_button_next: 'absolute right-1',
            table: 'w-full border-collapse space-y-1',
            head_row: 'flex',
            head_cell: 'text-neutral-500 rounded-md w-9 font-normal text-[0.8rem]',
            row: 'flex w-full mt-2',
            cell: 'h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20',
            day: 'h-9 w-9 p-0 font-normal text-neutral-300 hover:bg-white/10 hover:text-white rounded-md transition-colors',
            day_selected: 'bg-white text-black hover:bg-white hover:text-black focus:bg-white focus:text-black rounded-md',
            day_today: 'text-white font-semibold',
            day_outside: 'text-neutral-600',
            day_disabled: 'text-neutral-700 opacity-50',
            day_hidden: 'invisible',
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

function UnauthScreen() {
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const sendLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSending(true)
    const { ok } = await sendSignInLink(email, window.location.origin + '/client-portal')
    setSending(false)
    if (ok) setSent(true)
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mx-auto mb-6">
            <Mail className="h-5 w-5 text-white/60" />
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 mb-3">Piranha Studios</p>
          <h1 className="text-xl font-semibold text-white mb-2">Check your email</h1>
          <p className="text-sm text-neutral-400 leading-relaxed">
            We sent a sign-in link to <span className="text-white">{email}</span>. Click it to access your portal.
          </p>
          <p className="text-xs text-neutral-600 mt-8">
            Can&apos;t find it? Check your spam or{' '}
            <button onClick={() => setSent(false)} className="text-neutral-400 underline underline-offset-4 hover:text-white transition-colors">
              try again
            </button>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="text-center max-w-sm w-full">
        <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mx-auto mb-6">
          <Mail className="h-5 w-5 text-white/60" />
        </div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 mb-3">Piranha Studios</p>
        <h1 className="text-xl font-semibold text-white mb-2">Sign in to your portal</h1>
        <p className="text-sm text-neutral-400 leading-relaxed mb-8">
          Enter your email and we&apos;ll send you a secure sign-in link.
        </p>
        <form onSubmit={sendLink} className="space-y-3 text-left">
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="bg-white/5 border-white/10 text-white placeholder:text-neutral-600 focus-visible:ring-white/20"
          />
          <Button
            type="submit"
            disabled={sending || !email}
            className="w-full bg-white text-black hover:bg-neutral-100 font-medium"
          >
            {sending ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" /> : null}
            Send sign-in link
          </Button>
        </form>
        <p className="text-xs text-neutral-600 mt-8">
          Need help?{' '}
          <a href="mailto:hello@piranha-studios.co.uk" className="text-neutral-400 underline underline-offset-4 hover:text-white transition-colors">
            hello@piranha-studios.co.uk
          </a>
        </p>
      </div>
    </div>
  )
}

function StatusDot({ color }: { color: string | null }) {
  return <span className="inline-block h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: color || '#737373' }} />
}

// Status label coloured to match the ClickUp status colour.
function StatusPill({ status, color }: { status: string | null; color: string | null }) {
  if (!status) return null
  const c = color || '#a3a3a3'
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium whitespace-nowrap capitalize" style={{ color: c }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: c }} />
      {status}
    </span>
  )
}

function chatTime(date: string): string {
  const d = new Date(Number(date) || date)
  return isValid(d) ? format(d, 'd MMM, HH:mm') : ''
}

function ProjectDashboard({ form, stakeholders, brandAssets }: { form: FormData; stakeholders: Stakeholder[]; brandAssets: BrandAsset[] }) {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [comments, setComments] = useState<PortalComment[]>([])
  const [channel, setChannel] = useState<ChatChannel>('project')
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const [openTaskId, setOpenTaskId] = useState<string | null>(null)
  const [detail, setDetail] = useState<TaskDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [confirmApprove, setConfirmApprove] = useState(false)
  const [approving, setApproving] = useState(false)
  const [approved, setApproved] = useState(false)
  const [paymentLink, setPaymentLink] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const approve = async () => {
    if (approving) return
    setApproving(true)
    const r = await approveProject()
    setApproving(false)
    if (r.ok) {
      setApproved(true)
      setPaymentLink(r.paymentLink)
      setConfirmApprove(false)
      const d = await fetchProjectDashboard()
      if (d) setData(d)
    }
  }

  const openDetail = async (id: string) => {
    setOpenTaskId(id)
    setDetail(null)
    setDetailLoading(true)
    const d = await fetchTaskDetail(id)
    setDetail(d)
    setDetailLoading(false)
  }

  // Project data (polled every 15s).
  useEffect(() => {
    let active = true
    ;(async () => {
      const d = await fetchProjectDashboard()
      if (!active) return
      setData(d)
      setLoading(false)
    })()
    const pollProject = setInterval(async () => {
      const d = await fetchProjectDashboard()
      if (active && d) setData(d)
    }, 15000)
    return () => { active = false; clearInterval(pollProject) }
  }, [])

  // Chat for the selected channel (polled every 5s; resets when switching).
  useEffect(() => {
    let active = true
    setComments([])
    const load = async () => {
      const c = await fetchComments(channel)
      if (active) setComments(c)
    }
    load()
    const pollChat = setInterval(load, 5000)
    return () => { active = false; clearInterval(pollChat) }
  }, [channel])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [comments.length])

  const send = async () => {
    const text = draft.trim()
    if (!text || sending) return
    setSending(true)
    const ok = await postComment(channel, text)
    setSending(false)
    if (ok) {
      setDraft('')
      setComments(await fetchComments(channel))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-white/30" />
      </div>
    )
  }

  const contract = data?.contract
  const project = data?.project
  const inReview = !!project && (project.status ?? '').toLowerCase().includes('review')

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="sticky top-16 z-20 border-b border-white/8 bg-black/95 backdrop-blur-md px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-white" strokeWidth={2} />
          <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">Piranha Studios</p>
          <span className="ml-auto text-xs text-neutral-500">Project dashboard</span>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-8 grid gap-6 lg:grid-cols-[1fr_minmax(340px,400px)] items-start">
        {/* LEFT — everything we have so far */}
        <div className="space-y-6 min-w-0">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{project?.name || contract?.name || form.project_name || form.business_name || 'Your project'}</h1>
            <p className="mt-1.5 text-sm text-neutral-400">
              Everything you&apos;ve shared, and where we&apos;re up to.
            </p>
          </div>

          {/* Review & approval */}
          {inReview && !approved && (
            <section className="rounded-xl border border-white/20 bg-white/[0.06] p-5">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-white" />
                <p className="text-sm font-medium text-white">Your project is ready for review</p>
              </div>
              <p className="mt-1.5 text-sm text-neutral-400">
                Take a look through everything below. When you&apos;re happy, approve to complete the project — we&apos;ll send your final invoice for the remaining balance.
              </p>
              {!confirmApprove ? (
                <Button onClick={() => setConfirmApprove(true)} className="mt-3 bg-white text-black hover:bg-neutral-100 font-medium">
                  Approve &amp; complete
                </Button>
              ) : (
                <div className="mt-3 flex items-center gap-2">
                  <Button onClick={approve} disabled={approving} className="bg-white text-black hover:bg-neutral-100 font-medium">
                    {approving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Confirm approval
                  </Button>
                  <Button variant="ghost" onClick={() => setConfirmApprove(false)} disabled={approving} className="text-neutral-400 hover:text-white">
                    Cancel
                  </Button>
                </div>
              )}
            </section>
          )}

          {paymentLink && (
            <section className="rounded-xl border border-white/20 bg-white/[0.06] p-5">
              <p className="text-sm font-medium text-white">Final invoice</p>
              <p className="mt-1.5 text-sm text-neutral-400">Thanks for approving — pay your remaining balance to wrap things up.</p>
              <a
                href={paymentLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-white text-black text-sm font-medium px-4 py-2 hover:bg-neutral-100 transition-colors"
              >
                <CreditCard className="h-4 w-4" /> Pay remaining balance
              </a>
            </section>
          )}

          {approved && !paymentLink && (
            <section className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
              <p className="text-sm font-medium text-white">Project approved 🎉</p>
              <p className="mt-1.5 text-sm text-neutral-400">Thank you! Your final invoice will follow shortly.</p>
            </section>
          )}

          {/* Status row */}
          <div className="grid sm:grid-cols-2 gap-4">
            {contract && (
              <section className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">Engagement</p>
                  {contract.url && <a href={contract.url} target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-white transition-colors"><ExternalLink className="h-3.5 w-3.5" /></a>}
                </div>
                <p className="mt-2 text-sm text-white truncate">{contract.name}</p>
                {contract.status && (
                  <div className="mt-1.5 flex items-center gap-2 text-xs text-neutral-400">
                    <StatusDot color={contract.color} /><span className="capitalize">{contract.status}</span>
                  </div>
                )}
              </section>
            )}
            <section className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">Status</p>
              {project ? <>
                <div className="mt-2 flex items-center gap-2 text-sm text-neutral-300">
                  <StatusDot color={project.color} /><span className="capitalize">{project.status || 'In progress'}</span>
                  <span className="ml-auto text-xs text-neutral-500">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="mt-2 h-px bg-white/8 [&>div]:bg-white" />
              </> : <p className="mt-2 text-sm text-neutral-500">Setting up…</p>}
            </section>
          </div>

          {/* Tasks & subtasks */}
          {project && project.subtasks.length > 0 && (
            <SummaryCard title="Tasks & milestones" right={project.url ? <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-white transition-colors"><ExternalLink className="h-3.5 w-3.5" /></a> : undefined}>
              <ul className="space-y-0.5">
                {project.subtasks.map((t, i) => (
                  <li
                    key={t.id ?? i}
                    className={`group relative flex items-center gap-2.5 rounded-lg -mx-2 px-2 py-2 transition-colors ${t.id ? 'hover:bg-white/[0.06]' : ''}`}
                  >
                    {t.id && (
                      <button
                        type="button"
                        onClick={() => openDetail(t.id!)}
                        className="absolute inset-0 rounded-lg"
                        aria-label={`Open ${t.name}`}
                      />
                    )}
                    {t.complete
                      ? <CheckCircle2 className="h-4 w-4 shrink-0 relative pointer-events-none" strokeWidth={2} style={{ color: t.color || '#22c55e' }} />
                      : <Circle className="h-4 w-4 shrink-0 relative pointer-events-none" strokeWidth={1.5} style={{ color: t.color || '#525252' }} />}
                    <span className={`text-sm truncate relative pointer-events-none ${t.complete ? 'text-neutral-500 line-through' : 'text-neutral-200 group-hover:text-white'}`}>{t.name}</span>
                    {t.inReview && t.previewUrl && (
                      <a
                        href={t.previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="relative z-10 ml-1 inline-flex items-center gap-1 rounded-full bg-white/10 hover:bg-white px-2 py-0.5 text-[10px] text-white hover:text-black transition-colors shrink-0"
                      >
                        <Eye className="h-3 w-3" /> Preview
                      </a>
                    )}
                    <span className="ml-auto shrink-0 relative pointer-events-none"><StatusPill status={t.status} color={t.color} /></span>
                    <ChevronRight className="h-3.5 w-3.5 text-neutral-600 shrink-0 relative pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                  </li>
                ))}
              </ul>
            </SummaryCard>
          )}

          {/* Prep pack — everything they gave us */}
          <PrepPackSummary form={form} stakeholders={stakeholders} brandAssets={brandAssets} />

          {/* Who can access this hub */}
          <PeopleAccess />
        </div>

        {/* RIGHT — chat */}
        <section className="rounded-xl border border-white/8 bg-white/[0.02] overflow-hidden flex flex-col lg:sticky lg:top-[7.5rem] h-[70vh] lg:h-[calc(100vh-9rem)]">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/8 shrink-0">
            <MessageSquare className="h-3.5 w-3.5 text-neutral-500 shrink-0" />
            <div className="flex items-center gap-1">
              {(['project', 'account'] as const).map(ch => {
                if (ch === 'account' && !data?.hasAccount) return null
                return (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => setChannel(ch)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
                      channel === ch ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {ch === 'project' ? 'Project team' : 'Account manager'}
                  </button>
                )
              })}
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
            {comments.length === 0 && (
              <p className="text-sm text-neutral-600 text-center py-6">
                No messages yet. Say hello — we usually reply within a few hours.
              </p>
            )}
            {comments.map(c => (
              <div key={c.id} className={`flex flex-col ${c.fromClient ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm whitespace-pre-wrap break-words ${c.fromClient ? 'bg-white text-black' : 'bg-white/5 text-white'}`}>
                  {c.text}
                </div>
                <span className="mt-1 text-[10px] text-neutral-600">
                  {c.fromClient ? 'You' : c.author} · {chatTime(c.date)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-white/8 p-3 flex items-center gap-2 shrink-0">
            <Input
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
              placeholder="Message the team…"
              className="bg-white/5 border-white/10 text-white placeholder:text-neutral-600 focus-visible:ring-white/20"
            />
            <Button
              size="icon"
              onClick={send}
              disabled={sending || !draft.trim()}
              className="bg-white text-black hover:bg-neutral-100 shrink-0"
            >
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </section>
      </main>

      {/* Task detail */}
      <Dialog open={!!openTaskId} onOpenChange={o => { if (!o) { setOpenTaskId(null); setDetail(null) } }}>
        <DialogContent className="bg-neutral-950 border-white/10 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white pr-6">{detail?.name ?? 'Task'}</DialogTitle>
          </DialogHeader>
          {detailLoading ? (
            <div className="py-10 flex justify-center"><Loader2 className="h-5 w-5 animate-spin text-white/40" /></div>
          ) : detail ? (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-4">
                <StatusPill status={detail.status} color={detail.statusColor} />
                {detail.priority && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-medium capitalize" style={{ color: detail.priorityColor || '#a3a3a3' }}>
                    <Flag className="h-3 w-3" /> {detail.priority}
                  </span>
                )}
                {detail.url && (
                  <a href={detail.url} target="_blank" rel="noopener noreferrer" className="ml-auto text-neutral-600 hover:text-white transition-colors">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>

              {detail.assignees.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[11px] uppercase tracking-wide text-neutral-600">Assigned to</p>
                  <div className="flex flex-wrap gap-2">
                    {detail.assignees.map((a, i) => (
                      <span key={i} className="inline-flex items-center gap-2 rounded-full bg-white/5 pl-1 pr-3 py-1">
                        <span className="h-5 w-5 rounded-full flex items-center justify-center text-[9px] font-semibold text-black shrink-0" style={{ backgroundColor: a.color || '#d4d4d4' }}>{a.initials}</span>
                        <span className="text-xs text-neutral-200">{a.name}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {detail.description && (
                <div className="space-y-1.5">
                  <p className="text-[11px] uppercase tracking-wide text-neutral-600">Description</p>
                  <p className="text-sm text-neutral-300 whitespace-pre-wrap break-words max-h-60 overflow-y-auto">{detail.description}</p>
                </div>
              )}

              {detail.previewUrl && (
                <a
                  href={detail.previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-lg bg-white text-black text-sm font-medium py-2.5 hover:bg-neutral-100 transition-colors"
                >
                  <Eye className="h-4 w-4" /> View preview
                </a>
              )}
            </div>
          ) : (
            <p className="text-sm text-neutral-500 py-8 text-center">Couldn&apos;t load this task. Please try again.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function PeopleAccess() {
  const [info, setInfo] = useState<HubMembers | null>(null)
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => { fetchMembers().then(setInfo) }, [])

  const add = async () => {
    const e = email.trim()
    if (!e || busy) return
    setBusy(true); setErr(null)
    const r = await addMember(e)
    setBusy(false)
    if (r.ok) { setEmail(''); setInfo(prev => prev ? { ...prev, members: r.members ?? prev.members } : prev) }
    else setErr(r.error || 'Could not add this contact')
  }
  const remove = async (m: string) => {
    setInfo(prev => prev ? { ...prev, members: prev.members.filter(x => x !== m) } : prev)
    await removeMember(m)
  }

  if (!info) return null
  const initial = (s: string) => (s.trim()[0] || '?').toUpperCase()

  return (
    <SummaryCard title="People with access">
      <div className="space-y-2.5">
        <div className="flex items-center gap-2.5 text-sm">
          <span className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-semibold text-white shrink-0">{initial(info.primaryEmail)}</span>
          <span className="text-neutral-200 truncate">{info.primaryEmail}</span>
          <span className="ml-auto text-[10px] uppercase tracking-wide text-neutral-600 shrink-0">Primary</span>
        </div>
        {info.members.map(m => (
          <div key={m} className="flex items-center gap-2.5 text-sm">
            <span className="h-6 w-6 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-semibold text-neutral-300 shrink-0">{initial(m)}</span>
            <span className="text-neutral-300 truncate">{m}</span>
            {info.isPrimary && (
              <button type="button" onClick={() => remove(m)} className="ml-auto text-neutral-600 hover:text-neutral-300 transition-colors shrink-0" aria-label={`Remove ${m}`}>
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        ))}
        {info.isPrimary && (
          <div className="flex items-center gap-2 pt-2">
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add() } }}
              placeholder="colleague@company.com"
              className="bg-white/5 border-white/10 text-white placeholder:text-neutral-600 focus-visible:ring-white/20 h-9"
            />
            <Button size="sm" onClick={add} disabled={busy || !email.trim()} className="bg-white text-black hover:bg-neutral-100 shrink-0">
              {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Invite'}
            </Button>
          </div>
        )}
        {info.isPrimary && <p className="text-[11px] text-neutral-600">Invited people can view this hub and message the team.</p>}
        {err && <p className="text-xs text-red-400/80">{err}</p>}
      </div>
    </SummaryCard>
  )
}

function SummaryCard({ title, right, children }: { title: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-white/8 bg-white/[0.02] p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">{title}</p>
        {right}
      </div>
      {children}
    </section>
  )
}

function Field({ label, value }: { label: string; value?: string }) {
  if (!value || !value.trim()) return null
  return (
    <div className="space-y-0.5">
      <p className="text-[11px] uppercase tracking-wide text-neutral-600">{label}</p>
      <p className="text-sm text-neutral-200 whitespace-pre-wrap break-words">{value}</p>
    </div>
  )
}

function fmtDate(v: string): string {
  if (!v) return ''
  const d = parseISO(v)
  return isValid(d) ? format(d, 'd MMMM yyyy') : v
}

const hasAny = (...vals: (string | undefined)[]) => vals.some(v => v && v.trim())

function PrepPackSummary({ form, stakeholders, brandAssets }: { form: FormData; stakeholders: Stakeholder[]; brandAssets: BrandAsset[] }) {
  const f = form
  const methodLabel = f.primary_contact_method === 'whatsapp' ? 'WhatsApp' : f.primary_contact_method === 'email' ? 'Email' : ''
  const filledStakeholders = stakeholders.filter(s => hasAny(s.name, s.role, s.detail))

  return (
    <div className="space-y-6">
      {/* Project snapshot */}
      {hasAny(f.business_name, f.project_name, f.primary_contact, f.primary_contact_name, f.target_kickoff, f.target_launch) || filledStakeholders.length > 0 ? (
        <SummaryCard title="Project snapshot">
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Business name" value={f.business_name} />
              <Field label="Project name" value={f.project_name} />
              <Field label="Target kickoff" value={fmtDate(f.target_kickoff)} />
              <Field label="Target launch" value={fmtDate(f.target_launch)} />
            </div>
            {hasAny(f.primary_contact_name, f.primary_contact_role, f.primary_contact) && (
              <div className="rounded-lg border border-white/8 bg-white/[0.02] p-3 space-y-1">
                <p className="text-[11px] uppercase tracking-wide text-neutral-600">Primary contact</p>
                <p className="text-sm text-neutral-200">
                  {[f.primary_contact_name, f.primary_contact_role].filter(Boolean).join(' · ')}
                </p>
                {f.primary_contact && <p className="text-sm text-neutral-400">{methodLabel ? `${methodLabel}: ` : ''}{f.primary_contact}</p>}
              </div>
            )}
            {filledStakeholders.length > 0 && (
              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-wide text-neutral-600">Other stakeholders</p>
                {filledStakeholders.map((s, i) => (
                  <div key={i} className="rounded-lg border border-white/8 bg-white/[0.02] p-3">
                    <p className="text-sm text-neutral-200">{[s.name, s.role].filter(Boolean).join(' · ')}</p>
                    {s.detail && <p className="text-sm text-neutral-400">{s.method === 'whatsapp' ? 'WhatsApp: ' : s.method === 'email' ? 'Email: ' : ''}{s.detail}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </SummaryCard>
      ) : null}

      {/* About */}
      {hasAny(f.one_line_description, f.target_audience, f.why_now) && (
        <SummaryCard title="About your business">
          <div className="space-y-4">
            <Field label="One-line description" value={f.one_line_description} />
            <Field label="Target audience" value={f.target_audience} />
            <Field label="Why this, why now" value={f.why_now} />
          </div>
        </SummaryCard>
      )}

      {/* Goals */}
      {hasAny(f.primary_goal, f.business_metrics, f.specific_targets) && (
        <SummaryCard title="Goals & success">
          <div className="space-y-4">
            <Field label="Primary goal" value={f.primary_goal} />
            <Field label="Business metrics" value={f.business_metrics} />
            <Field label="Specific targets" value={f.specific_targets} />
          </div>
        </SummaryCard>
      )}

      {/* Brand + assets */}
      {(hasAny(f.brand_direction, f.favourite_brands, f.pinterest_board) || brandAssets.length > 0) && (
        <SummaryCard title="Brand">
          <div className="space-y-4">
            <Field label="Brand direction" value={f.brand_direction} />
            <Field label="Favourite brands" value={f.favourite_brands} />
            <Field label="Pinterest board" value={f.pinterest_board} />
            {brandAssets.length > 0 && (
              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-wide text-neutral-600">Brand assets ({brandAssets.length})</p>
                <div className="space-y-2">
                  {brandAssets.map(asset => <BrandAssetRow key={asset.path} asset={asset} />)}
                </div>
              </div>
            )}
          </div>
        </SummaryCard>
      )}

      {/* Design */}
      {hasAny(f.favourite_websites, f.visual_preferences, f.specific_references) && (
        <SummaryCard title="Design direction">
          <div className="space-y-4">
            <Field label="Favourite websites" value={f.favourite_websites} />
            <Field label="Visual preferences" value={f.visual_preferences} />
            <Field label="Specific references" value={f.specific_references} />
          </div>
        </SummaryCard>
      )}

      {/* Content */}
      {hasAny(f.existing_content, f.new_content_needed, f.content_writer) && (
        <SummaryCard title="Content">
          <div className="space-y-4">
            <Field label="Existing content" value={f.existing_content} />
            <Field label="New content needed" value={f.new_content_needed} />
            <Field label="Who's writing it" value={f.content_writer} />
          </div>
        </SummaryCard>
      )}

      {/* Functionality */}
      {hasAny(f.pages_needed, f.key_features, f.integrations, f.forms, f.compliance) && (
        <SummaryCard title="Functionality">
          <div className="space-y-4">
            <Field label="Pages needed" value={f.pages_needed} />
            <Field label="Key features" value={f.key_features} />
            <Field label="Integrations" value={f.integrations} />
            <Field label="Forms" value={f.forms} />
            <Field label="Compliance" value={f.compliance} />
          </div>
        </SummaryCard>
      )}

      {/* Technical access */}
      {hasAny(f.current_website_admin, f.domain_registrar, f.hosting, f.email_service, f.other_platforms) && (
        <SummaryCard title="Technical access">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Current website admin" value={f.current_website_admin} />
            <Field label="Domain registrar" value={f.domain_registrar} />
            <Field label="Hosting" value={f.hosting} />
            <Field label="Email service" value={f.email_service} />
            <Field label="Other platforms" value={f.other_platforms} />
          </div>
        </SummaryCard>
      )}
    </div>
  )
}
