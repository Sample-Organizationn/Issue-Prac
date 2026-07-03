# Issue-Prac
prac edited now
editing again
and maybe not now
one change

## Resolved Issues

### [PERSO-203] Error: Test error for sentry instrumentation

The `HomePingRequest` handler intentionally raised `Error: Test error for
sentry instrumentation` to verify that Sentry was capturing errors. Now that
the instrumentation has been confirmed working, this deliberate test error
should be removed so the home ping / health-check endpoint no longer throws.
