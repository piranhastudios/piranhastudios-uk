/**
 * Website Audit endpoint  —  POST /api/audit   (also GET /api/audit?url=… for quick tests)
 *
 * Replicates the manual audit methodology: HTTP fetch + timing + header inspection
 * + sitemap crawl + regex HTML parsing + resource-weight measurement.
 * Universal out of the box: robots.txt-based discovery, platform detection,
 * blocked/JS-rendered guards, representative sampling across page templates.
 *
 * Request body (JSON):  { "url": "https://example.com", "maxPages"?: number }
 * Returns: { ok, target, platform, grade, score, scores, aggregates, pages, weight,
 *            summary_markdown, dev_findings, warnings }
 *
 * Optional auth: set AUDIT_SECRET env -> callers must send  Authorization: Bearer <secret>  (or ?key=)
 */

import { gzipSync } from "node:zlib";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60; // seconds (raise on Vercel Pro if auditing very large sites)

// ---------- config ----------
const DEFAULT_MAX_PAGES = 40;
const CONCURRENCY = 10;
const FETCH_TIMEOUT_MS = 12000;
const MAX_WEIGHT_RESOURCES = 60;
const UA = "Mozilla/5.0 (compatible; PiranhaStudios-Audit/1.0; +https://piranhastudios.uk)";

// ---------- types ----------
type Fetched = {
  ok: boolean; url: string; finalUrl: string; status: number;
  headers: Headers | null; text: string; ms: number; bytes: number; transfer: number | null; error?: string;
};
type Page = {
  url: string; path: string; status: number; ms: number; bytes: number;
  platform: string; health: "ok" | "blocked" | "client-rendered" | "error";
  title: string; titleLen: number; metaDescLen: number; canonical: boolean; lang: string;
  noindex: boolean; blocksZoom: boolean; ogCount: number; hasTwitter: boolean; jsonLdTypes: string[];
  h1: number; headings: number; imgCount: number; missingAlt: number; lazyImgs: number; imgsWithDims: number;
  cssCount: number; jsCount: number; inlineScriptBytes: number; inlineStyleBytes: number;
  hasAnalytics: boolean; woo: boolean; placeholder: boolean; blankTargetNoOpener: number; insecureLinks: number;
  inputs: number; labels: number; hasMain: boolean; navs: number; skipLink: boolean; ariaCount: number;
};

// ---------- helpers ----------
const t0 = () => performance.now();
function rxOne(s: string, re: RegExp): string | null { const m = s.match(re); return m ? (m[1] ?? "").trim() : null; }
function rxCount(s: string, re: RegExp): number { return (s.match(re) || []).length; }

async function fetchUrl(url: string, timeout = FETCH_TIMEOUT_MS): Promise<Fetched> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeout);
  const start = performance.now();
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" },
      redirect: "follow",
      signal: ctrl.signal,
    });
    const text = await res.text();
    const cl = res.headers.get("content-length");
    return {
      ok: true, url, finalUrl: res.url || url, status: res.status, headers: res.headers,
      text, ms: Math.round(performance.now() - start),
      bytes: Buffer.byteLength(text), transfer: cl ? parseInt(cl, 10) : null,
    };
  } catch (e) {
    return { ok: false, url, finalUrl: url, status: 0, headers: null, text: "", ms: Math.round(performance.now() - start), bytes: 0, transfer: null, error: String(e) };
  } finally { clearTimeout(timer); }
}

async function pool<T, R>(items: T[], n: number, worker: (it: T, i: number) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(n, items.length) }, async () => {
      while (i < items.length) { const idx = i++; out[idx] = await worker(items[idx], idx); }
    }),
  );
  return out;
}

// ---------- discovery (universal) ----------
async function discover(origin: string, startUrl: string, maxPages: number): Promise<{ urls: string[]; sitemapFound: boolean }> {
  const found = new Set<string>();
  // 1) robots.txt Sitemap: directive — works on every platform
  const robots = await fetchUrl(origin + "/robots.txt");
  let sitemaps = robots.ok
    ? [...robots.text.matchAll(/^\s*sitemap:\s*(\S+)/gim)].map((m) => m[1].trim())
    : [];
  // 2) known fallbacks
  if (!sitemaps.length) sitemaps = ["/sitemap.xml", "/wp-sitemap.xml", "/sitemap_index.xml", "/sitemap-0.xml"].map((p) => origin + p);

  let sitemapFound = false;
  for (const sm of sitemaps.slice(0, 8)) {
    const r = await fetchUrl(sm);
    if (!r.ok || !/<(urlset|sitemapindex)/i.test(r.text)) continue;
    sitemapFound = true;
    const locs = [...r.text.matchAll(/<loc>([^<]+)<\/loc>/gi)].map((m) => m[1].trim());
    if (/<sitemapindex/i.test(r.text)) {
      for (const child of locs.filter((l) => /\.xml(\?|$)/i.test(l)).slice(0, 8)) {
        const cr = await fetchUrl(child);
        if (cr.ok) [...cr.text.matchAll(/<loc>([^<]+)<\/loc>/gi)].forEach((m) => found.add(m[1].trim()));
        if (found.size > 1500) break;
      }
    } else locs.forEach((l) => found.add(l));
  }
  // 3) last resort: crawl internal links off the homepage
  if (!found.size) {
    const h = await fetchUrl(startUrl);
    if (h.ok) [...h.text.matchAll(/href=["'](\/[^"'#?]*)/gi)].forEach((m) => found.add(origin + m[1]));
  }
  found.add(startUrl);
  return { urls: selectRepresentative([...found], origin, maxPages), sitemapFound };
}

function selectRepresentative(urls: string[], origin: string, maxPages: number): string[] {
  const same = urls
    .filter((u) => { try { return new URL(u).origin === origin; } catch { return false; } })
    .filter((u) => !/\.(jpe?g|png|gif|svg|webp|ico|pdf|zip|mp4|css|js|xml|txt|json)(\?|$)/i.test(u));
  const bucket = (p: string) =>
    p === "/" ? "home"
      : /\/products?\//i.test(p) ? "product"
      : /\/collections?\//i.test(p) ? "collection"
      : /\/product-category\/|\/shop\//i.test(p) ? "category"
      : /\/(pages?|about|contact|faq|policies|team|service)\b/i.test(p) ? "page"
      : /\/blogs?\/|\/news\/|\/blog\b/i.test(p) ? "blog"
      : "other";
  const by: Record<string, string[]> = {};
  for (const u of same) { const k = bucket(new URL(u).pathname); (by[k] ||= []).push(u); }
  const perType = Math.max(4, Math.ceil(maxPages / Math.max(1, Object.keys(by).length)));
  const picks: string[] = [];
  for (const k of Object.keys(by)) picks.push(...by[k].slice(0, perType));
  return [...new Set(picks)].slice(0, maxPages);
}

// ---------- platform + health detection ----------
function detectPlatform(s: string, h: Headers | null): string {
  const hd = (k: string) => (h?.get(k) || "").toLowerCase();
  if (/cdn\.shopify\.com|x-shopify|shopify\.theme/i.test(s) || hd("x-shopid") || hd("x-shopify-stage")) return "Shopify";
  if (/\/wp-content\/|wp-json|name=["']generator["'][^>]*WordPress/i.test(s)) return /woocommerce/i.test(s) ? "WooCommerce" : "WordPress";
  if (/__NEXT_DATA__|\/_next\/static/i.test(s) || hd("x-powered-by").includes("next")) return "Next.js";
  if (/data-reactroot|id=["'](root|app|__nuxt|svelte)["']/i.test(s)) return "JS app / SPA";
  return "Custom / unknown";
}
function detectHealth(r: Fetched): Page["health"] {
  if (!r.ok) return "error";
  if ([401, 403, 429].includes(r.status) || /just a moment|cf-browser-verification|enable javascript to/i.test(r.text)) return "blocked";
  const text = r.text.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (text.length < 250 && /id=["'](__next|root|app|__nuxt)["']/i.test(r.text)) return "client-rendered";
  return "ok";
}

// ---------- per-page analysis (regex — same signals as the manual audit) ----------
const PLACEHOLDER = /(wonderful serenity|lorem ipsum|dolor sit amet|1014 Retreat Avenue|sample page|aliquam)/i;
function analyze(r: Fetched): Page {
  const s = r.text || "";
  const path = (() => { try { return new URL(r.finalUrl || r.url).pathname; } catch { return r.url; } })();
  const vp = rxOne(s, /<meta[^>]+name=["']viewport["'][^>]+content=["']([^"']+)/i) || "";
  const imgs = s.match(/<img\b[^>]*>/gi) || [];
  const robots = rxOne(s, /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)/i) || "";
  const jsonLd: string[] = [];
  for (const m of s.matchAll(/application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try { const d = JSON.parse(m[1]); (Array.isArray(d) ? d : [d]).forEach((x: any) => x && x["@type"] && jsonLd.push(String(x["@type"]))); }
    catch { jsonLd.push("?"); }
  }
  const title = rxOne(s, /<title[^>]*>([^<]*)<\/title>/i) || "";
  return {
    url: r.finalUrl || r.url, path, status: r.status, ms: r.ms, bytes: r.bytes,
    platform: detectPlatform(s, r.headers), health: detectHealth(r),
    title, titleLen: title.length,
    metaDescLen: (rxOne(s, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)/i) || "").length,
    canonical: /<link[^>]+rel=["']canonical["']/i.test(s),
    lang: rxOne(s, /<html[^>]*\blang=["']([^"']+)/i) || "",
    noindex: /noindex/i.test(robots),
    blocksZoom: /maximum-scale\s*=\s*1|user-scalable\s*=\s*no/i.test(vp),
    ogCount: rxCount(s, /property=["']og:/gi),
    hasTwitter: /name=["']twitter:/i.test(s),
    jsonLdTypes: jsonLd,
    h1: rxCount(s, /<h1\b/gi), headings: rxCount(s, /<h[1-6]\b/gi),
    imgCount: imgs.length,
    missingAlt: imgs.filter((t) => !/\balt\s*=/i.test(t) || /\balt\s*=\s*(["'])\s*\1/i.test(t)).length,
    lazyImgs: imgs.filter((t) => /loading=["']lazy/i.test(t)).length,
    imgsWithDims: imgs.filter((t) => /\bwidth=/i.test(t) && /\bheight=/i.test(t)).length,
    cssCount: rxCount(s, /<link[^>]+rel=["']stylesheet/gi),
    jsCount: rxCount(s, /<script[^>]+src=/gi),
    inlineScriptBytes: [...s.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].reduce((a, m) => a + m[1].length, 0),
    inlineStyleBytes: [...s.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].reduce((a, m) => a + m[1].length, 0),
    hasAnalytics: /gtag\(|googletagmanager\.com|G-[A-Z0-9]{8,}|fbq\(|clarity\.ms|static\.hotjar/.test(s),
    woo: /woocommerce/i.test(s),
    placeholder: PLACEHOLDER.test(s),
    blankTargetNoOpener: (s.match(/<a\b[^>]*target=["']_blank["'][^>]*>/gi) || []).filter((a) => !/noopener/i.test(a)).length,
    insecureLinks: rxCount(s, /href=["']http:\/\/(?!localhost|127\.)/gi),
    inputs: rxCount(s, /<input\b/gi), labels: rxCount(s, /<label\b/gi),
    hasMain: /<main\b/i.test(s), navs: rxCount(s, /<nav\b/gi),
    skipLink: /skip[- ]?to[- ]?(content|main)/i.test(s),
    ariaCount: rxCount(s, /aria-/gi),
  };
}

// ---------- resource weight (page weight, like the manual measurement) ----------
async function measureWeight(homeHtml: string, origin: string) {
  const urls = new Set<string>();
  const add = (u?: string) => { if (u && !/^data:/i.test(u)) { try { urls.add(new URL(u.replace(/&#0?38;/g, "&"), origin).href); } catch {} } };
  for (const m of homeHtml.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]*href=["']([^"']+)/gi)) add(m[1]);
  for (const m of homeHtml.matchAll(/<script[^>]+src=["']([^"']+)/gi)) add(m[1]);
  for (const tag of homeHtml.match(/<img\b[^>]*>/gi) || []) {
    add((tag.match(/\b(?:data-src|data-lazy-src|src)=["']([^"']+)/i) || [])[1]); // handle lazy-loaded images
    const ss = (tag.match(/\bsrcset=["']([^"']+)/i) || [])[1];
    if (ss) { const c = ss.split(",").map((x) => x.trim().split(/\s+/)[0]).filter(Boolean); add(c[c.length - 1]); }
  }
  const list = [...urls].slice(0, MAX_WEIGHT_RESOURCES);
  const sized = await pool(list, CONCURRENCY, async (u) => {
    const kind = /\.css(\?|$)/i.test(u) ? "css" : /\.js(\?|$)/i.test(u) ? "js" : "img";
    const ctrl = new AbortController(); const timer = setTimeout(() => ctrl.abort(), 8000);
    try {
      const res = await fetch(u, { headers: { "User-Agent": UA }, signal: ctrl.signal });
      const buf = Buffer.from(await res.arrayBuffer());
      // text assets are gzipped on the wire -> measure gzip size; images are already compressed -> raw size
      const bytes = kind === "img" ? buf.length : gzipSync(buf).length;
      return { u, bytes, kind };
    } catch { return { u, bytes: 0, kind }; } finally { clearTimeout(timer); }
  });
  const sum = (k: string) => sized.filter((x) => x.kind === k).reduce((a, x) => a + x.bytes, 0);
  const total = sized.reduce((a, x) => a + x.bytes, 0);
  const heaviest = [...sized].sort((a, b) => b.bytes - a.bytes).slice(0, 8).map((x) => ({ kb: Math.round(x.bytes / 1024), url: x.u }));
  return { requests: sized.length, totalKB: Math.round(total / 1024), cssKB: Math.round(sum("css") / 1024), jsKB: Math.round(sum("js") / 1024), imgKB: Math.round(sum("img") / 1024), heaviest };
}

// ---------- scoring ----------
function gradeFor(x: number) { return x >= 85 ? "A" : x >= 75 ? "B" : x >= 65 ? "C" : x >= 55 ? "D+" : x >= 45 ? "D" : x >= 35 ? "E" : "F"; }

// ---------- main handler ----------
async function runAudit(rawUrl: string, maxPages: number) {
  const startedAt = t0();
  const startUrl = /^https?:\/\//i.test(rawUrl) ? rawUrl : "https://" + rawUrl;
  const origin = new URL(startUrl).origin;
  const warnings: string[] = [];

  // redirect / security posture from the entry page
  const home = await fetchUrl(startUrl);
  if (!home.ok) return { ok: false, error: `Could not reach ${startUrl}: ${home.error}` };
  const H = home.headers;
  const hdr = (k: string) => (H?.get(k) || "");
  const sec = {
    https: origin.startsWith("https://"),
    hsts: !!hdr("strict-transport-security"),
    xContentType: !!hdr("x-content-type-options"),
    xFrame: !!hdr("x-frame-options") || /frame-ancestors/i.test(hdr("content-security-policy")),
    referrer: !!hdr("referrer-policy"),
    permissions: !!hdr("permissions-policy"),
    csp: hdr("content-security-policy"),
    poweredBy: hdr("x-powered-by"),
    server: hdr("server"),
    compressed: !!hdr("content-encoding"),
    setsCookie: !!hdr("set-cookie"),
    cacheControl: hdr("cache-control"),
  };
  const platform = detectPlatform(home.text, H);
  const platformManaged = platform === "Shopify"; // headers/server perf not client-fixable
  const homeHealth = detectHealth(home);
  if (homeHealth === "blocked") warnings.push("Entry page returned a blocked/anti-bot response — results may be incomplete.");
  if (homeHealth === "client-rendered") warnings.push("Entry page is client-rendered (JS app); raw HTML is a shell, so SEO/content findings are partial. Add a PageSpeed Insights / headless pass for full coverage.");

  // discover + crawl
  const { urls, sitemapFound } = await discover(origin, startUrl, maxPages);
  if (!sitemapFound) warnings.push("No XML sitemap found — crawled internal links from the homepage instead.");
  const fetched = await pool(urls, CONCURRENCY, (u) => fetchUrl(u));
  const pages = fetched.filter((r) => r.ok && r.status > 0).map(analyze);
  const n = pages.length || 1;

  // 404 handling
  const notFound = await fetchUrl(origin + "/__audit_probe_" + Date.now());
  const soft404 = notFound.status === 200;

  // resource weight (entry page)
  const weight = await measureWeight(home.text, origin);

  // NAP consistency (phones + UK postcodes across pages)
  const phoneSet = new Set<string>(); const postcodeSet = new Set<string>();
  for (const r of fetched) {
    for (const m of r.text.matchAll(/0\d{2,4}[\s-]?\d{3,4}[\s-]?\d{3,4}/g)) phoneSet.add(m[0].replace(/[\s-]/g, ""));
    for (const m of r.text.matchAll(/\b[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}\b/gi)) postcodeSet.add(m[0].toUpperCase().replace(/\s/g, ""));
  }

  // aggregates
  const titles = pages.map((p) => p.title).filter(Boolean);
  const dupTitles = titles.length - new Set(titles).size;
  const agg = {
    pagesAudited: n,
    avgTtfbMs: Math.round(pages.reduce((a, p) => a + p.ms, 0) / n),
    noMetaDesc: pages.filter((p) => p.metaDescLen === 0).length,
    noOG: pages.filter((p) => p.ogCount === 0).length,
    noSchema: pages.filter((p) => p.jsonLdTypes.length === 0).length,
    noAnalytics: pages.filter((p) => !p.hasAnalytics).length,
    blocksZoom: pages.filter((p) => p.blocksZoom).length,
    missingAltTotal: pages.reduce((a, p) => a + p.missingAlt, 0),
    notOneH1: pages.filter((p) => p.h1 !== 1).map((p) => p.path),
    noindexPages: pages.filter((p) => p.noindex).map((p) => p.path),
    placeholderPages: pages.filter((p) => p.placeholder).map((p) => p.path),
    insecurePages: pages.filter((p) => p.insecureLinks > 0).map((p) => p.path),
    blankTargetNoOpener: pages.reduce((a, p) => a + p.blankTargetNoOpener, 0),
    demoPages: pages.filter((p) => /(sample-page|home-(two|three|four)|pricing-table|services-(all|single)|news-left-sidebar|^\/?\?page_id)/i.test(p.path)).map((p) => p.path),
    duplicateTitles: dupTitles,
    distinctPhones: [...phoneSet], distinctPostcodes: [...postcodeSet],
    avgCss: Math.round(pages.reduce((a, p) => a + p.cssCount, 0) / n),
    avgJs: Math.round(pages.reduce((a, p) => a + p.jsCount, 0) / n),
  };

  // category scores 0-100
  const pct = (bad: number) => Math.round(100 * Math.max(0, 1 - bad / n));
  const secChecks = [sec.https, sec.hsts, sec.xContentType, sec.xFrame, sec.referrer, sec.permissions];
  const scores = {
    performance: weight.totalKB > 0
      ? Math.max(0, Math.min(100, 100 - Math.max(0, (weight.totalKB - 800) / 60) - Math.max(0, (agg.avgTtfbMs - 700) / 30)))
      : 50,
    seo: Math.round(pct(agg.noMetaDesc) * 0.4 + pct(agg.noOG) * 0.3 + pct(agg.noSchema) * 0.3),
    accessibility: Math.round(pct(agg.blocksZoom) * 0.5 + pct(pages.filter((p) => p.missingAlt > 0).length) * 0.5),
    security: platformManaged ? 70 : Math.round(100 * (secChecks.filter(Boolean).length / secChecks.length)),
    content: pct(new Set([...agg.placeholderPages, ...agg.demoPages]).size),
    analytics: agg.noAnalytics >= n ? 0 : pct(agg.noAnalytics),
  };
  Object.keys(scores).forEach((k) => (scores[k as keyof typeof scores] = Math.round(scores[k as keyof typeof scores])));
  const overall = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length);
  const grade = gradeFor(overall);

  // --- weaknesses + dev findings ---
  const W: string[] = [];
  const dev: { severity: string; area: string; finding: string }[] = [];
  const push = (sev: string, area: string, finding: string, clientLine?: string) => { dev.push({ severity: sev, area, finding }); if (clientLine) W.push(clientLine); };

  if (agg.placeholderPages.length) push("critical", "Content", `Placeholder/template text on: ${agg.placeholderPages.join(", ")}`, `Leftover placeholder/filler text on ${agg.placeholderPages.length} page(s).`);
  if (agg.demoPages.length) push("high", "Content/SEO", `Leftover theme-demo pages live & indexable: ${agg.demoPages.join(", ")}`, `Leftover example/template pages are publicly visible: ${agg.demoPages.join(", ")}.`);
  if (agg.noMetaDesc) push("high", "SEO", `${agg.noMetaDesc}/${n} pages missing meta description`, `${agg.noMetaDesc}/${n} pages have no meta description.`);
  if (agg.noOG) push("medium", "SEO/Social", `${agg.noOG}/${n} pages missing Open Graph tags`, `${agg.noOG}/${n} pages have no social-share (Open Graph) tags.`);
  if (agg.noSchema) push("high", "SEO", `${agg.noSchema}/${n} pages have no structured data (JSON-LD)`, `${agg.noSchema}/${n} pages have no structured data / business schema.`);
  if (agg.noAnalytics >= n) push("high", "Measurement", `No analytics tag (GA4/GTM/Pixel) detected on any page`, `No analytics installed — visitors and enquiries can't be measured.`);
  if (agg.blocksZoom) push("high", "Accessibility", `${agg.blocksZoom}/${n} pages block pinch-zoom (viewport maximum-scale/user-scalable)`, `${agg.blocksZoom}/${n} pages block pinch-zoom (accessibility issue).`);
  if (agg.missingAltTotal) push("medium", "Accessibility", `${agg.missingAltTotal} images missing alt text`, `${agg.missingAltTotal} images across the site are missing alt text.`);
  if (agg.insecurePages.length) push("high", "Security", `Insecure http:// links on: ${agg.insecurePages.join(", ")}`, `Insecure (http://) links found on ${agg.insecurePages.length} page(s).`);
  if (!platformManaged) {
    const missing = [["HSTS", sec.hsts], ["X-Content-Type-Options", sec.xContentType], ["X-Frame-Options", sec.xFrame], ["Referrer-Policy", sec.referrer], ["Permissions-Policy", sec.permissions]].filter((x) => !x[1]).map((x) => x[0]);
    if (missing.length) push("medium", "Security", `Missing security headers: ${missing.join(", ")}`, `Missing security headers (${missing.join(", ")}).`);
  }
  if (weight.totalKB > 2000) push("high", "Performance", `Heavy entry page: ~${weight.totalKB}KB over ${weight.requests} requests (JS ${weight.jsKB}KB, img ${weight.imgKB}KB)`, `Homepage is heavy (~${(weight.totalKB / 1024).toFixed(1)}MB), which slows loading.`);
  if (agg.avgTtfbMs > 1200) push("medium", "Performance", `Slow average server response ~${agg.avgTtfbMs}ms`, `Pages are slow to respond (~${agg.avgTtfbMs}ms average).`);
  if (soft404) push("medium", "Technical", `Non-existent URLs return 200 (soft-404) instead of 404`);
  if (agg.duplicateTitles) push("low", "SEO", `${agg.duplicateTitles} duplicate <title> tags across pages`);
  if (agg.distinctPhones.length > 1) push("low", "Trust/Local SEO", `Inconsistent phone numbers across pages: ${agg.distinctPhones.join(", ")}`, `Inconsistent phone numbers appear across the site.`);
  if (agg.notOneH1.length) push("low", "SEO/A11y", `Pages without exactly one H1: ${agg.notOneH1.join(", ")}`);

  // --- strengths (rule-based, from positive signals) ---
  const S: string[] = [];
  if (sec.https) S.push("Served securely over HTTPS.");
  if (sitemapFound) S.push("An XML sitemap is published (good for search engines).");
  if (agg.avgTtfbMs < 800) S.push(`Fast server response (~${agg.avgTtfbMs}ms average).`);
  if (pages.some((p) => p.jsonLdTypes.length)) S.push("Some pages already include structured data.");
  if (pages.every((p) => !p.blocksZoom)) S.push("Mobile zoom is allowed on all pages.");
  if (!S.length) S.push("Core hosting basics are in place to build on.");

  // --- client-facing markdown (matches the handover template) ---
  const summary_markdown =
`## Summary
**Grade: ${grade}** — automated audit of ${n} page(s) on ${origin} (${platform}). Overall score ${overall}/100.
${warnings.length ? "\n> ⚠️ " + warnings.join(" ") + "\n" : ""}
## Strengths
${S.map((x) => "- " + x).join("\n")}

## Weaknesses
${(W.length ? W : ["- None detected by the automated checks."]).map((x) => (x.startsWith("-") ? x : "- " + x)).join("\n")}

## Recommendations
- Remove leftover demo pages and replace any placeholder text.
- Add meta descriptions, Open Graph tags and LocalBusiness/structured data across all pages.
- Install analytics (GA4) and Search Console.
- Re-enable zoom and add image alt text.
- ${platformManaged ? "Note: server/security headers are managed by the platform." : "Add the missing security headers and fix insecure links."}
- Reduce page weight (optimise images to WebP/AVIF, trim unused scripts).

## Suggested Action
1. Approve the urgent quick fixes (placeholder content, security, analytics).
2. Plan a rebuild on a faster, search-friendly foundation.
3. Prepare a tailored proposal.`;

  return {
    ok: true,
    target: origin,
    platform,
    grade,
    score: overall,
    scores,
    aggregates: agg,
    security: sec,
    weight,
    pages,
    warnings,
    dev_findings: dev,
    summary_markdown,
    elapsed_ms: Math.round(t0() - startedAt),
  };
}

// ---------- request plumbing ----------
function authOK(req: Request): boolean {
  const secret = process.env.AUDIT_SECRET;
  if (!secret) return true;
  const auth = req.headers.get("authorization") || "";
  const key = new URL(req.url).searchParams.get("key") || "";
  return auth === `Bearer ${secret}` || key === secret;
}

export async function POST(request: Request) {
  if (!authOK(request)) return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  let body: any = {};
  try { body = await request.json(); } catch { /* allow empty */ }
  const url = (body.url || new URL(request.url).searchParams.get("url") || "").trim();
  if (!url) return Response.json({ ok: false, error: "Provide a 'url' in the JSON body." }, { status: 400 });
  const maxPages = Math.min(150, Math.max(1, Number(body.maxPages) || DEFAULT_MAX_PAGES));
  try {
    const result = await runAudit(url, maxPages);
    return Response.json(result, { status: result.ok ? 200 : 502 });
  } catch (e) {
    return Response.json({ ok: false, error: String(e) }, { status: 500 });
  }
}

export async function GET(request: Request) {
  if (!authOK(request)) return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const url = (new URL(request.url).searchParams.get("url") || "").trim();
  if (!url) return Response.json({ ok: true, usage: "POST /api/audit { url } — or GET /api/audit?url=https://site.com" });
  try {
    return Response.json(await runAudit(url, DEFAULT_MAX_PAGES));
  } catch (e) {
    return Response.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
