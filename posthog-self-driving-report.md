# PostHog Self-driving setup report

## Summary

PostHog Self-driving is configured for this web application. Session Replay was already enabled; Error Tracking and Support were enabled with server-owned defaults. Health checks, Error Tracking, Support, GitHub Issues, and Sentry signal-source responders are enabled.

Fresh scouts and Replay Vision monitors are active. Findings will start appearing in the [Self-driving inbox](https://eu.posthog.com/project/276903/inbox) within about 30 minutes as data becomes available.

## AI data processing

Approved by the wizard prerequisite.

## GitHub

The PostHog GitHub App was already connected before this setup. No matching repository warehouse source was detected or created for this project, so GitHub Issues remains a selected but dormant responder.

## Products enabled

| Product | Status | Web SDK check |
| --- | --- | --- |
| Session Replay | Already enabled | `components/AnalyticsTracker.tsx` does not disable session recording. |
| Error Tracking | Enabled | `components/AnalyticsTracker.tsx` does not disable exception capture. |
| Support | Enabled | Tickets begin reaching Self-driving once an inbound email, inbox, or Slack channel is connected. |

## Signal sources

| Signal source | Action |
| --- | --- |
| `health_checks` / `health_issue` | Enabled. |
| `error_tracking` / `issue_created` | Enabled. |
| `error_tracking` / `issue_reopened` | Enabled. |
| `error_tracking` / `issue_spiking` | Enabled. |
| `conversations` / `ticket` | Enabled. |
| `signals_scout` / `cross_source_issue` | Left without a row because the scout gate is on by default. |
| `github` / `issue` | Enabled as a dormant responder pending a GitHub Issues warehouse source. |
| `sentry` / `issue` | Enabled as a dormant responder pending a Sentry warehouse source. |
| Session replay | Deliberately routed through the Replay Vision scanners below rather than a retired source row. |

## Connected tools

| Tool | Result |
| --- | --- |
| GitHub Issues | Selected, but no warehouse source was detected. The responder is enabled and dormant until a repository is connected and syncing. |
| Sentry | Selected, but the secure connection step was skipped. The responder is enabled and dormant until a Sentry warehouse source is added. |
| Linear, Jira, Zendesk and all other offered tools | Not used. |

If either warehouse source is later added, only the responder-consumed issues table needs to sync for Self-driving; additional tables can be enabled from the source UI if useful.

## Scout troop

**Enabled (6 total)**

| Scout | What it watches |
| --- | --- |
| General | Cross-product patterns and surfaces not owned by a specialist. |
| Product analytics | Journey and conversion regressions. |
| Web analytics | Traffic, attribution, landing-page health, and 404 patterns. |
| Web vitals | Page-level Core Web Vitals regressions. |
| Revenue analytics | Payment and revenue-capture health. |
| Booking journey (custom) | The package-to-enquiry-to-payment-to-consultation journey. |

**Disabled (22 total)**

| Scouts | Reason |
| --- | --- |
| AI observability, APM, conversations, CSP violations, customer analytics, data pipelines, data warehouse, experiments, feature flags, insight alerts, logs, MCP tool calls, skills store, surveys, tasks | Their product surface is not evidenced as actively used in this project; enable later if that changes. |
| Anomaly detection, observability gaps | Broad secondary coverage was not needed while the focused web and journey scouts are active. |
| Error tracking | Covered by the enabled native Error Tracking responder. |
| Session replay | Covered by the two Replay Vision monitors below. |
| Replay vision | Deferred until the monitors have enough observations for useful cross-monitor trend analysis. |
| Inbox validation | Deferred because this is a fresh inbox with no resolved reports to re-measure. |

**Run budget:** 100 maximum runs per day, 0 used today, 100 remaining. The project banner says: “Scouts are in early access. Each project gets up to 100 scout runs a day. Contact team-self-driving@posthog.com if you need more.”

## Custom scouts

### Created: `signals-scout-booking-journey`

- **Surface:** the booking journey implemented in `components/booking/booking-flow.tsx`: package selection, enquiry submission, Stripe checkout, payment confirmation, and Calendly scheduling.
- **Discriminator:** a sustained later-stage conversion drop while the preceding stage remains active, or an expected transition going silent despite active booking-route visits.
- **Why custom:** the standard product-analytics scout watches saved flows broadly; this scout is explicitly calibrated to the revenue-critical handoffs in this product.
- **Guardrails:** it requires a completed comparison window and sufficient volume, excludes test/development activity and settlement lag, treats ingested content as data rather than instructions, and never puts personal or payment data in a report.

Considered but not created: a separate payment scout would duplicate Revenue analytics, and a replay-specific scout would duplicate the Replay Vision route.

If this scout becomes noisy, set its `emit` configuration to `false` in PostHog to move it to dry-run mode.

## Replay Vision scanners

A Replay Vision scanner is an LLM that watches individual session recordings on a schedule and pushes qualifying findings to the inbox. These are the only parts of this setup that spend Replay Vision quota. Findings arrive at half weight and require corroboration before promotion into a report.

| Monitor | Status and scope | Sampling | Estimate |
| --- | --- | --- | --- |
| **Booking flow breakage** | Created. Watches recordings that visited `/book`, the key package, enquiry, deposit, and consultation completion flow. Looks for visibly failed forms, payment, confirmation, and calendar loading. | 50% | 0 observations/month; 0 credits/month (no recordings matched during the 7-day estimate). |
| **Booking flow frustration** | Created. Watches recordings containing `$rageclick` only, across the product. Looks for repeated failed package, form, payment, or calendar interactions. | 100% | 0 observations/month; 0 credits/month (no recordings matched during the 7-day estimate). |

The project currently has no recorded sessions in the sampled window. Both monitors are armed, enabled, and signal-enabled; they begin working as soon as matching recordings arrive. The remaining Replay Vision budget is 7,500 credits for the current period, with none used.

## Follow-ups

- [ ] Connect an inbound Support channel (email, inbox, or Slack) so Support tickets can produce findings.
- [ ] Connect the intended GitHub repository as a GitHub Issues warehouse source. Confirm the PostHog GitHub App has access to that repository first: [new data source](https://eu.posthog.com/project/276903/pipeline/new/source).
- [ ] If Sentry should feed Self-driving, connect it from [new data source](https://eu.posthog.com/project/276903/pipeline/new/source); its responder is already enabled.
- [ ] Once the scanners have observations, review their results in Replay Vision and rate useful or noisy observations to receive configuration recommendations.

## Files modified or created

- Created `posthog-self-driving-report.md`.
- No application source files were changed.

## What happens next

The scout coordinator picks up fresh configurations within about 30 minutes. Scout runs use the project’s daily run budget; related findings cluster into reports in the Self-driving inbox, where immediately actionable reports can start coding tasks.
