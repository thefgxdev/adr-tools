# ADR-0001: Start as a modular monolith, not as microservices

- **Status:** accepted
- **Date:** 2025-02-14
- **Deciders:** founding engineering team
- **Reversibility:** moderate (a sprint per extracted module, if boundaries are kept)

## Context

New B2B product, four engineers, one database, unknown load. The team has microservices experience and the temptation to start distributed. Every network boundary adds a failure mode, an observability requirement and a deploy pipeline; at four engineers those costs are paid in features not built.

## Options considered

1. **Microservices from day one.** Clear ownership later; today, five deploy pipelines, distributed transactions and a tracing stack before the first customer.
2. **Modular monolith.** One deployable, one database, strict module boundaries enforced by package structure and lint rules, domain events in-process. Extraction later is a mechanical change if boundaries hold.
3. **Do nothing (unstructured monolith).** Fastest for a month, then every change touches everything.

## Decision

Option 2. Modules own their tables; cross-module reads go through module interfaces, never through joins across module tables; module boundaries are enforced by a dependency-cruiser rule in CI.

## Consequences

- Easier: one deploy, one transaction, local debugging, refactors across modules in one PR.
- Harder: discipline required; the lint rule is the only thing stopping a convenient join.
- Must do: dependency rule in CI (done), event bus abstraction so in-process events can later become a queue, per-module ownership file.
- Revisit if: a module needs independent scaling or a separate release cadence, or the team passes fifteen engineers.
