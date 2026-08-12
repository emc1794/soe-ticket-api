Ejecuta la extracción progresiva de microservicios y la separación de
operaciones de lectura y escritura mediante el patrón CQRS, tomando
decisiones fundamentadas en perfiles reales de carga y equilibrando
los beneficios de la escalabilidad con la complejidad operativa
inherente a las arquitecturas distribuidas.

Physically extract one modular domain into its own
independent deployment unit with its own dedicated, isolated
database instance.

## Reduced Monolith (Session 6)

The Ordering domain (Order/Ticket entities, their MySQL tables, the Booking Saga Orchestrator,
and the `/ordering` HTTP routes) has been **removed from this repository** — it is now expected
to live in its own independently deployable Ordering Service with its own isolated database.
**That service itself is out of scope for this change** and is deferred to a future session; this
change only makes the monolith match its reduced shape from `level-3-components-monolith-backend.md`
and choreographs correctly with a service that publishes/consumes the contracts below.

Since an in-process orchestrator can't make synchronous calls across two independently deployed
services, the Session 5 saga collapses back into pure choreography over RabbitMQ for the part that
still lives in this monolith:

1. The (external, not-yet-built) Ordering Service publishes `OrderCreated`.
2. **Fraud** (`modules/payment/fraud/`, a component of the Payment context) consumes it directly,
   calls `CheckFraud`, and either:
   - passes → calls `ProcessPayment` **in-process** (Fraud and Payment are still co-located here), or
   - rejects → publishes `PaymentFailed` **itself** (Payment is never invoked for a rejected order).
3. **Payment** processes the (mocked) charge and publishes `PaymentSuccessful` / `PaymentFailed`,
   same as Session 5. Notification still reacts to `PaymentSuccessful` independently, unchanged.
4. Once the Ordering Service has seen `PaymentSuccessful` and finalized the order on its own side
   (not built here), it is expected to publish `OrderCompleted`. The new **Ordering Event Consumer**
   (`modules/order-sync/`) reacts to it with two in-process calls: `Identity.IssueDigitalPass`
   (ticket issuance) and `Notification.SendOrderConfirmation` (confirmation alert).

`OrderCreated` / `OrderCompleted` now live as lightweight **external event contracts** in
`shared/contracts/` — this monolith only consumes them, it doesn't own or publish them. They exist
purely so RabbitMQ subscribers here have a typed shape to bind to; the source of truth for orders
is the (future) Ordering Service's own database.

**Left in place on purpose:** `SeatReservation` (`modules/events/domain/SeatReservation.ts`) has no
caller left in this monolith — its only caller (the saga orchestrator) was removed — but it's the
capability the future Ordering Service will need to call to reserve/release seats, so it wasn't
deleted, just currently unwired. The `orders`/`tickets` tables also still physically exist in the
monolith's MySQL instance; dropping/migrating them belongs to the same deferred extraction work as
building the service itself, not to this change.

## Booking Saga (Orchestration) — Session 5, superseded above

Session 5 introduced `BookingSagaOrchestrator` as a single in-process coordinator for the whole
booking workflow. That component no longer exists in this monolith (see above) — kept here only as
a pointer for anyone reading history: the orchestration approach doesn't survive a physical service
boundary, hence the fallback to broker choreography for the steps that now span two services.

## Event-Driven Architecture

Domain events/commands are routed through a **RabbitMQ** topic exchange (`domain_events`, see
`shared/infrastructure/bus/RabbitMQEventBus.ts`). Each subscriber binds its own exclusive,
auto-delete queue to the routing key it cares about, so a single event can fan out to several
bounded contexts without them knowing about each other (`shared/infrastructure/bus/subscribers.ts`
is the only place that wires publishers to subscribers).

Domain event map:

| Event | Published by | Consumed by |
|---|---|---|
| `OrderCreated` | *(external)* Ordering Service | Fraud |
| `PaymentSuccessful` | Payment | Notification; *(external)* Ordering Service |
| `PaymentFailed` | Payment, or Fraud (on rejection) | *(external)* Ordering Service |
| `OrderCompleted` | *(external)* Ordering Service | Ordering Event Consumer (`order-sync`) |
| `EventCancelled` | Events | Notification |
| `EventUpdated` | Events | Notification |

Bootstrap order in `server.ts`: connect to RabbitMQ → register subscribers → connect to MySQL →
start listening. On `SIGINT`/`SIGTERM` the broker connection is closed before the process exits.

## Architecture

Backend monolith partitioned into bounded contexts (see `level-3-components-monolith-backend.md`), each mapped 1:1 to `src/modules/<context>`:

* **Identity Context** — `identity`: authentication, authorization, and digital pass issuance (JWT).
* **Events Context** — `events`:
  * `events` core — event catalog, search, and lifecycle.
  * **Seat Reservation** — Redis-backed temporary seat holds (currently unwired — see above).
  * **Venue Plugin Manager** (`infrastructure/venue`) — microkernel component for pluggable venue integrations (`GenericVenueAdapter`, `LegacyVenueAdapter`).
* **Payment Context** — `payment`:
  * `payment` core — payment provider integration (mocked; no direct DB persistence).
  * **Fraud** (`fraud/`) — gates payment on `OrderCreated`, reintroduced as a Payment-context component.
* **Notification Context** — `notification`: maps internal domain events to outbound notifications, plus `SendOrderConfirmation` (called directly by `order-sync`).
* **Order Sync** — `order-sync`: the "Ordering Event Consumer" — reacts to `OrderCompleted` from the (external) Ordering Service.

No SPA-facing booking endpoint remains in this monolith (`/ordering/*` is gone) — per the diagram,
the SPA now only calls `identity` and `events` here directly (no gateway yet).
