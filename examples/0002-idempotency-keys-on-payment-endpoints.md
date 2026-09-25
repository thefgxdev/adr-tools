# ADR-0002: Require idempotency keys on every payment endpoint

- **Status:** accepted
- **Date:** 2025-06-03
- **Deciders:** payments team, platform team
- **Reversibility:** cheap (hours), but the incident it prevents is not

## Context

A customer was charged twice: the first request succeeded, the response timed out at the load balancer, the mobile client retried. Refund issued, trust lost. Retries are a fact of networks; the payment endpoint must be safe to retry.

## Options considered

1. **Deduplicate on the provider side only.** The provider supports idempotency keys, but our own order record was also created twice. Partial.
2. **Idempotency keys stored before the side effect, scoped to the customer, 24 h expiry**, and passed through to the provider. Covers our records and the charge.
3. **Do nothing; rely on client-side double-click protection.** Does not survive network timeouts.

## Decision

Option 2. The mobile and web clients generate a UUID when the payment sheet opens and send it on every retry. The server inserts the key in `payment_idempotency (key, customer_id)` with a unique constraint before calling the provider; a conflict returns the stored result or `409` while in progress.

## Consequences

- Easier: retries are safe; support can see duplicate attempts in one table.
- Harder: clients must persist the key across app restarts during a pending payment.
- Must do: expiry job (done), client SDK change (done), a test that fires two concurrent requests with the same key (done).
- Revisit if: the provider's own idempotency semantics change, or payment methods with asynchronous confirmation are added.
