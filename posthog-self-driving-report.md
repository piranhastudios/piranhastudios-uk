# PostHog Self-driving setup report

## Summary

PostHog Self-driving is configured for this web booking and payments application. Session Replay, Error Tracking, and Support were already enabled; their matching native responders were confirmed enabled, and the focused scout troop and two Replay Vision monitors remain active.

Findings will begin appearing in the [Self-driving inbox](https://eu.posthog.com/project/276903/inbox) within about 30 minutes as data arrives and scheduled checks run.

## AI data processing

Approved by the wizard prerequisite.

## GitHub

The PostHog GitHub App was already connected. The current repository was not visible to that App installation, so no GitHub Issues warehouse source was created; the selected responder remains safely dormant until a repository source syncs.

## Products enabled

| Product | Status | Web SDK check |
| --- | --- | --- |
| Session Replay | Already enabled | `components/AnalyticsTracker.tsx` does not disable session recording. |
| Error Tracking | Already enabled | `components/AnalyticsTracker.tsx` does not disable exception capture. |
| Support | Already enabled | Tickets reach Self-driving after an inbound email, inbox, or Slack channel is connected. |

## Signal sources

| Signal source | Action |
| --- | --- |
| `health_checks` / `health_issue` | Already enabled. |
| `error_tracking` / `issue_created` | Already enabled. |
| `error_tracking` / `issue_reopened` | Already enabled. |
| `error_tracking` / `issue_spiking` | Already enabled. |
| `conversations` / `ticket` | Already enabled. |
| `signals_scout` / `cross_source_issue` | No row needed: the scout gate is enabled by default. |
| `github` / `issue` | Already enabled as a dormant responder pending a GitHub Issues warehouse source. |
| `sentry` / `issue` | Existing dormant responder left enabled; no Sentry source is connected. |
| Session replay | Deliberately routed through Replay Vision scanners; no retired source row was created. |

## Connected tools

| Tool | Result |
| --- | --- |
| GitHub Issues | Selected, but no warehouse source was detected or created because the GitHub App cannot access this repository. The responder is enabled and dormant. |
| Linear, Jira, Sentry, Zendesk, and all other offered tools | Not used in this run. |

When a GitHub Issues source is connected, sync only the `issues` table needed by the responder; additional warehouse tables can be enabled later in PostHog.

## Scout troop

**Enabled (6 total)**

| Scout | What it watches |
| --- | --- |
| General | Cross-product patterns and uncovered surfaces. |
| Product analytics | Journey and conversion regressions. |
| Web analytics | Traffic, attribution, landing-page health, and 404 patterns. |
| Web vitals | Page-level Core Web Vitals regressions. |
| Revenue analytics | Payment and revenue-capture health. |
| Booking journey (custom) | Package selection through enquiry, payment, and consultation scheduling. |

**Disabled (22 total)**

| Scouts | Reason |
| --- | --- |
| AI observability, APM, conversations, CSP violations, customer analytics, data pipelines, data warehouse, experiments, feature flags, insight alerts, logs, MCP tool calls, skills store, surveys, tasks | Their product surfaces are not evidenced as actively used in this project. |
| Anomaly detection, observability gaps | Focused journey and web coverage takes priority. |
| Error tracking | Covered by the native Error Tracking responder. |
| Session replay | Covered by the Replay Vision monitors below. |
| Replay vision | Deferred until monitors accumulate enough observations for useful cross-monitor trends. |
| Inbox validation | Deferred because there are no resolved reports to re-measure yet. |

**Run budget:** 100 maximum runs per day; 6 used today; 94 remaining. Banner: “Scouts are in early access. Each project gets up to 100 scout runs a day. Contact team-self-driving@posthog.com if you need more.”

## Custom scouts

No new custom scouts were created in this run. The existing `signals-scout-booking-journey` already covers the primary package-to-enquiry-to-payment-to-consultation funnel.

A booking-handoff reliability scout was proposed to focus on ClickUp, Stripe, and Calendly delivery silence, but was declined. It partly overlaps the existing booking-journey scout; a separate payment watcher would also duplicate Revenue analytics, while replay-specific coverage belongs to Replay Vision.

If any scout becomes noisy, set its `emit` configuration to `false` in PostHog to switch it to dry-run mode.

## Replay Vision scanners

A Replay Vision scanner is an LLM that watches individual session recordings on a schedule and pushes qualifying findings to the inbox. These are the only parts of this setup that spend Replay Vision quota. Findings arrive at half weight and need independent corroboration before promotion into a report.

| Monitor | Status and scope | Sampling | Estimate |
| --- | --- | --- | --- |
| **Booking flow breakage** | Updated an earlier signal-emitting monitor. Watches recordings visiting `/book`, the completion flow for package selection, enquiry, deposit payment, and consultation scheduling; it looks for visibly failed forms, payments, confirmations, or calendar loading. | 50% | 0 observations/month; 0 credits/month. |
| **Booking flow frustration** | Updated an earlier signal-emitting monitor. Watches recordings with `$rageclick` across the product for repeated failed package, form, payment, or calendar interactions. | 100% | 0 observations/month; 0 credits/month. |

No recordings matched the recent window. Both monitors are enabled and armed, and will start working when matching recordings arrive. The organization has 7,500 Replay Vision credits remaining in the current period, with none used.

## Follow-ups

- [ ] Connect an inbound Support channel (email, inbox, or Slack) so Support tickets can produce findings.
- [ ] Grant `piranhastudios/piranhastudios-uk` to the PostHog GitHub App, then connect the GitHub Issues warehouse source from the [new data source page](https://eu.posthog.com/project/276903/pipeline/new/source). Its responder is already enabled.
- [ ] When the scanners have observations, review and rate their findings in Replay Vision to refine their usefulness.

## Files modified or created

- Updated `posthog-self-driving-report.md`.
- No application source files were changed.

## What happens next

The scout coordinator picks up fresh configurations within about 30 minutes. Scout runs draw from the daily budget, findings cluster into reports in the [Self-driving inbox](https://eu.posthog.com/project/276903/inbox), and immediately-actionable reports can start coding tasks.