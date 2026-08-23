/**
 * The three published packages, in one place.
 *
 * This is the price authority for the whole site: the cards, the LocalBusiness
 * schema, the AEO paragraph and the Stripe deposit all read from here, so a
 * price can never be right in one place and stale in another.
 *
 * IMPORTANT: the checkout route computes the deposit from `priceMinor` on the
 * server. Never let a client-supplied amount reach Stripe.
 */

export type PackageId = "presence" | "business" | "partner"

export type Package = {
  id: PackageId
  name: string
  /** Display price, e.g. "£100" or "from £600". */
  price: string
  /** Suffix shown after the price, e.g. "/month". */
  priceNote: string
  /** Headline price in pence. Null when the price is quoted, not fixed. */
  priceMinor: number | null
  tagline: string
  features: string[]
  footnote?: string
  cta: string
  featured: boolean
  /**
   * Fixed-price packages take a deposit up front. Partner is a monthly
   * retainer starting "from £600", so there is no fixed total to take a
   * percentage of: it goes straight to a call and is invoiced after scoping.
   */
  requiresDeposit: boolean
  /** ClickUp Service/Product option id, so the lead lands correctly tagged. */
  clickUpServiceId: string
  /**
   * Which Calendly event this package books. Packages that take a deposit are
   * gated: the call can only be booked once Stripe confirms payment. Partner
   * books the same full consultation but is ungated, having nothing to pay.
   * Enquiries with no package fall through to the free Q&A.
   */
  meeting: "evaluation" | "qa"
  /**
   * Sales Stage the ClickUp deal opens in. Deposit-taking packages open in
   * "deposit-pending" so the deposit email automation can pick them up; Partner
   * has nothing to pay up front, so it opens in "discovery" instead.
   * Mapped to a ClickUp option id in app/api/deals/route.ts.
   */
  openingStage: "deposit-pending" | "discovery" 
  /** Short description used on the Stripe checkout line item. */
  checkoutDescription: string
}

/** Share of the headline price taken up front. */
export const DEPOSIT_RATE = 0.3

export const PACKAGES: Package[] = [
  {
    id: "presence",
    name: "Presence",
    price: "£100",
    priceNote: "",
    priceMinor: 100_00,
    tagline: "Get found online. Live in 48 hours.",
    features: [
      "Domain registered in your name",
      "One-page website, branded to you",
      "Enquiry form straight to your inbox",
      "Google Business Profile set up",
      "Compliance ready: cookie banner, GDPR and legal pages configured",
      "Shop built in, ready to switch on when you are",
    ],
    cta: "Start with Presence",
    featured: false,
    requiresDeposit: true,
    clickUpServiceId: "d76f85bf-9d9f-4364-9a19-8413df7216c7", // Digital Presence
    openingStage: "deposit-pending",
    meeting: "evaluation",
    checkoutDescription: "One-page website, domain and Google Business Profile. Live in 48 hours.",
  },
  {
    id: "business",
    name: "Business",
    price: "£500",
    priceNote: "",
    priceMinor: 500_00,
    tagline: "Start selling. Live in 4 working days.",
    features: [
      "Everything in Presence",
      "Full multi-page website or online store",
      "Up to 30 products loaded and priced",
      "Payments and delivery set up and tested",
      "30-minute handover call so you can run it yourself",
    ],
    footnote:
      "4 working days from receipt of your assets: logo, photos, product list. We'll send a short brief that tells you exactly what we need.",
    cta: "Start with Business",
    featured: true,
    requiresDeposit: true,
    clickUpServiceId: "d5ae5218-7af9-4efc-8307-488c64c7e947", // E-Commerce
    openingStage: "deposit-pending",
    meeting: "evaluation",
    checkoutDescription: "Full website or online store with up to 30 products. Live in 4 working days.",
  },
  {
    id: "partner",
    name: "Partner",
    price: "from £600",
    priceNote: "/month",
    priceMinor: 600_00,
    tagline: "Your technical team, embedded.",
    features: [
      "For organisations building custom software, not a storefront",
      "Named technical lead in your leadership meetings",
      "Dedicated engineering hours each month, worked to your roadmap",
      "Built on the right stack for your problem, chosen with you and explained plainly",
      "You own the code and the IP",
      "Priority support with an agreed response time",
    ],
    cta: "Enquire about Partner",
    featured: false,
    requiresDeposit: false,
    clickUpServiceId: "1d331b03-5126-42f5-b82d-552a0ee893f9", // Tech Partnership
    openingStage: "discovery",
    meeting: "evaluation",
    checkoutDescription: "Embedded technical team, monthly retainer.",
  },
]

export const getPackage = (id: string | null | undefined): Package | undefined =>
  PACKAGES.find(p => p.id === id)

/** Deposit in pence, or null when the package is not paid up front. */
export function depositMinor(pkg: Package): number | null {
  if (!pkg.requiresDeposit || pkg.priceMinor === null) return null
  return Math.round(pkg.priceMinor * DEPOSIT_RATE)
}

/** Remaining balance in pence, due on completion. */
export function balanceMinor(pkg: Package): number | null {
  const deposit = depositMinor(pkg)
  if (deposit === null || pkg.priceMinor === null) return null
  return pkg.priceMinor - deposit
}

/** Renders pence as "£150" or "£12.50". */
export function formatGBP(minor: number): string {
  return minor % 100 === 0
    ? `£${minor / 100}`
    : `£${(minor / 100).toFixed(2)}`
}

/** ClickUp currency fields are in MAJOR units, our internals are pence. */
export const toMajor = (minor: number): number => minor / 100

/**
 * ClickUp tag put on every deal the website files. The Zapier zap on the Deals
 * list skips deposit-link generation when it sees this, because these customers
 * pay through Stripe Checkout on the site instead. Removing the tag from a
 * stalled deal lets Zapier mint a link so it can be chased by email.
 */
export const WEBSITE_TAG = "piranha-website"
