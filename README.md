# ADR Tools

Architecture Decision Records that actually get written and actually get read. A template, a numbering convention, examples, and a zero-dependency Node script that creates a new record from the command line.

By [Felipe Guedes](https://fgxdev.com). Used in production teams where "why did we do this?" used to be answered by whoever was still around.

## Why ADRs

Every system carries decisions that are expensive to reverse: the database, the tenancy model, the queue, the boundary between two services. Six months later the team that made them has changed, and the constraint that forced the decision is invisible. An ADR is one page that saves that constraint.

Rules that keep them alive:

1. **One record per expensive decision.** Not per meeting, not per ticket.
2. **Written when the decision is made**, not reconstructed later.
3. **Immutable.** A changed decision is a new record that supersedes the old one.
4. **Short.** Context, options, decision, consequences. If it does not fit in a page, the decision is two decisions.
5. **In the repository**, next to the code, reviewed like code.

## Usage

```bash
# create docs/adr/0007-use-postgres-row-level-security.md from the template
node adr.mjs new "Use Postgres row-level security for tenant isolation"

# list records with status
node adr.mjs list

# mark 0003 as superseded by 0007
node adr.mjs supersede 3 7
```

No dependencies. Requires Node 18+. Copy `adr.mjs` and `TEMPLATE.md` into your repository.

## The template

See [`TEMPLATE.md`](TEMPLATE.md). Fields: status, date, deciders, reversibility, context, options considered (always including "do nothing"), decision, consequences (including what would make you revisit it).

The **reversibility** field is the one most templates lack. It tells the reader how carefully to read.

## Examples

- [`examples/0001-modular-monolith-over-microservices.md`](examples/0001-modular-monolith-over-microservices.md)
- [`examples/0002-idempotency-keys-on-payment-endpoints.md`](examples/0002-idempotency-keys-on-payment-endpoints.md)

## Em português

Registros de decisão de arquitetura que são escritos e lidos: template, convenção de numeração, exemplos e um script Node sem dependências para criar novos registros. Uma página por decisão cara de reverter.

## License

Apache-2.0. Copyright (c) 2026 Felipe Guedes (fgxdev.com). Redistributions must keep the NOTICE file and mark any changes.
