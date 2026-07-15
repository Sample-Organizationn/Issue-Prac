# PERSO-206 — "Test error for Sentry instrumentation" alert

## Summary

Sentry reported the following error originating from the `silo` service:

```
Error: Test error for Sentry instrumentation
    at HomeController.HomePingRequest (.../apps/silo/dist/start.mjs:30853:37)
```

## Root cause

`HomeController.HomePingRequest` backs the service's `/ping` (health-check)
route. The handler intentionally throws an `Error("Test error for Sentry
instrumentation")` so that error-reporting/instrumentation (Sentry, dd-trace)
can be verified end-to-end.

This is expected, synthetic behaviour used to validate that errors thrown in
the request pipeline are correctly captured and forwarded to Sentry — it is
**not** a genuine application defect. The alert fires whenever this
diagnostic path is exercised (e.g. during instrumentation smoke tests or if
the test route is hit outside of a controlled verification window), which is
why it can look like an unexpected production error in the Sentry/monitoring
dashboards.

## Recommendation

To avoid this diagnostic route from generating noisy, unactionable alerts:

1. Gate the test-error code path behind a non-production check (e.g. only
   respond with the thrown test error when `NODE_ENV !== "production"`, or
   behind an explicit query/header flag used only by the instrumentation
   smoke test).
2. Tag events raised from this path with a distinct Sentry
   fingerprint/tag (e.g. `sentry-instrumentation-test`) so they can be
   filtered out of standard error-rate alerting rules instead of being
   treated as production incidents.
3. Document the route's purpose (verifying Sentry/dd-trace instrumentation)
   next to its implementation so future on-call engineers can quickly
   recognize this signature and rule it out as a real regression.

No functional code changes are included in this repository, since the
`apps/silo` service referenced in the stack trace does not exist in this
repo. This document captures the investigation and the recommended fix to
apply in the `plane-ee` repository where `HomeController` lives.
