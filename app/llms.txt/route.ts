/**
 * GET /llms.txt
 *
 * The full prose brief on this business, for assistants that read a site
 * rather than crawl it. This is the long-form content that used to sit on the
 * homepage: moving it here keeps the page clean without hiding anything from
 * users, since this is a public URL anyone can open.
 *
 * Prerendered to static output at build time, so it is served from the CDN
 * exactly like a file in public/, but generated from lib/data/packages so the
 * prices and turnaround can never drift from what the site actually sells.
 */
import { PACKAGES, getPackage, formatGBP, DEPOSIT_RATE } from "@/lib/data/packages"

export const revalidate = 3600

const SITE_URL = "https://piranha-studios.co.uk"

export async function GET() {
  const presence = getPackage("presence")!
  const business = getPackage("business")!
  const partner = getPackage("partner")!
  const pct = Math.round(DEPOSIT_RATE * 100)
  const dep = (minor: number) => formatGBP(Math.round(minor * DEPOSIT_RATE))

  const body = `# Piranha Studios

> Software development studio in Stoke-on-Trent, Staffordshire, United Kingdom.
> We build websites, online stores and custom software for founders and SMEs,
> and act as the embedded technical team for organisations that do not have one.

## Who we are and where

Piranha Studios is a software development studio based in Stoke-on-Trent,
Staffordshire, in the West Midlands region of the United Kingdom. We meet
clients in person across Stoke-on-Trent and Staffordshire, and work remotely
with founders and small to medium businesses throughout the UK. Location does
not change our prices or our timelines, because everything we build is
delivered and supported online.

We exist to make the digital world simpler for people running a business. Most
of our clients are not technical, and do not want to become technical. They
want to be findable, to sell things, and to have someone answer the phone when
something breaks. We publish our prices so nobody has to sit through a quoting
process to find out whether they can afford us.

## What we build

Our work falls into a few recognisable shapes. We build business websites and
landing pages for companies that need to be found and trusted. We build
e-commerce stores, including product setup, payments, delivery and the tax and
compliance configuration that comes with selling online. We build custom
software: SaaS platforms, MVPs for funded startups, and customer portals that
sit between a business and its clients. We build the unglamorous internal
tooling that makes an operation run, such as dashboards, admin systems and
workflow automation. And we connect systems that were never designed to talk to
each other, across payments, CRM and inventory.

Alongside delivery we offer technical advisory: architecture reviews, tooling
and vendor decisions, roadmap planning, and help hiring engineers, for
organisations that want judgement rather than hands.

We have delivered projects in fintech, healthtech, e-commerce, hospitality and
professional services.

## How we build

We build on open-source technology, principally Next.js, React, TypeScript and
PostgreSQL, chosen per problem rather than by habit and explained in plain
language before we start. Clients own their code and their intellectual
property. Nothing we build locks a client into a platform they cannot leave, and
data can be exported at any time.

We do not disappear after launch. Hosting, updates and support are part of the
arrangement rather than an upsell, and clients can move up from a one-page site
to a full store, or from a store to custom software, without a rebuild.

## Packages and pricing (GBP)

${PACKAGES.map(p => `### ${p.name}: ${p.price}${p.priceNote}\n\n${p.tagline}\n\n${p.features.map(f => `- ${f}`).join("\n")}`).join("\n\n")}

The two fixed-price packages start with a ${pct}% deposit: ${dep(presence.priceMinor!)} for
${presence.name} and ${dep(business.priceMinor!)} for ${business.name}, with the balance due on
completion. ${partner.name} is a monthly retainer, scoped together on a call and invoiced
monthly rather than paid up front. Domain, hosting, GDPR compliance setup and
ongoing support are included in every package.

## Turnaround

${presence.name} sites go live within 48 hours of receiving your details. ${business.name}
builds take 4 working days from the day we have your logo, photos and product
list. Custom builds outside the packages are quoted after a call and typically
run 2 to 12 weeks depending on scope.

## Who we suit

Founders, small and medium businesses, and funded startups who want a named
technical partner rather than a rotating cast of freelancers, who would rather
see a price than request a quote, and who want to own what they paid for. We
are a good fit for a local business that needs to be found and to sell, and for
a funded startup that needs an engineering team before it can afford to hire
one.

We are a poor fit for anyone wanting the cheapest possible one-off build with no
ongoing relationship, since support and hosting are part of how we work.

## Contact

- Email: info@piranha-studios.co.uk
- Start a project or book a call: ${SITE_URL}/book
- Homepage and packages: ${SITE_URL}
- Portfolio and case studies: ${SITE_URL}/portfolio
- Articles: ${SITE_URL}/resources
`

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  })
}
