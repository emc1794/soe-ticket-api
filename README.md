Diseña flujos de trabajo resilientes entre múltiples servicios mediante
el uso del patrón Saga y acciones compensatorias, gestionando fallos
parciales del sistema y priorizando la recuperación automática y la
integridad de los datos.


Create a multi-service workflow (e.g., booking/payment/shipping) using the Saga Pattern (Choreography or Orchestration).

## Booking Saga (Orchestration)

`BookingSagaOrchestrator` (`modules/ordering/saga/BookingSagaOrchestrator.ts`) coordinates the
booking workflow end to end. Every cross-context call is issued **from** the orchestrator — Events,
Fraud, Identity and Ordering's own use cases never call each other directly or know about the
saga's other steps. This is orchestration, not choreography: contrast with the Notification module
(unchanged since Session 2), which still reacts to events independently.

1. **Reserve Seat** — `Events` module (`SeatReservation`, Redis-backed hold). Internal call.
2. **Validate Fraud Risk** — `Fraud` module, reintroduced as a component inside the Payment
   bounded context (`modules/payment/fraud/CheckFraud.ts`). Internal call.
   - On rejection: compensate by releasing the seat, reject the request synchronously (no order
     is ever created).
3. **Process Payment** — the only step that crosses the RabbitMQ broker. The saga publishes
   `ProcessPaymentCommand`; Payment's `ProcessPaymentOnCommand` subscriber consumes it and
   replies with `PaymentSuccessful` / `PaymentFailed`. The HTTP request returns `202 Accepted`
   here — the saga pauses and resumes asynchronously.
4. **On `PaymentSuccessful`** (`onPaymentSuccessful`): Issue Ticket via `Identity`
   (`IssueDigitalPass`, internal call) → `CompleteOrder` marks the order `PAID` and creates the
   `Ticket` rows → release the seat hold now that it's a permanent ticket.
5. **On `PaymentFailed`** (`onPaymentFailed`, compensation): release the seat hold, then
   `CancelOrder`.

There is no separate saga-state table: the `Order.status` transition (`PENDING` → `PAID` /
`CANCELLED`) in MySQL **is** the saga state, and both completion paths are idempotent (re-delivery
of `PaymentSuccessful`/`PaymentFailed` is a no-op if the order is already in its terminal state).
That keeps the saga scoped to what this exercise asks for, without a bespoke persistence model.

Design trade-off worth calling out: the `Ticket`/digital-pass split follows the diagram literally
(Identity "issues" the pass, Ordering "completes" the order), but the actual `Ticket` entity and
its MySQL table stay owned by Ordering rather than migrating to Identity — the data is inherently
order/seat-shaped (`orderId`, `eventId`, `seatNumber`), and a cross-module data migration wasn't
warranted just to satisfy a C4 box.

## Event-Driven Architecture

Domain events/commands are routed through a **RabbitMQ** topic exchange (`domain_events`, see
`shared/infrastructure/bus/RabbitMQEventBus.ts`). Each subscriber binds its own exclusive,
auto-delete queue to the routing key it cares about, so a single event can fan out to several
bounded contexts without them knowing about each other (`shared/infrastructure/bus/subscribers.ts`
is the only place that wires publishers to subscribers).

Domain event map (matches `level-3-components-backend.md`):

| Event | Published by | Consumed by |
|---|---|---|
| `OrderCreated` | Ordering (saga step 1-4) | — (observability only) |
| `ProcessPaymentCommand` | Ordering (saga step 5) | Payment |
| `PaymentSuccessful` | Payment | Ordering (saga), Notification |
| `PaymentFailed` | Payment | Ordering (saga) |
| `EventCancelled` | Events | Notification |
| `EventUpdated` | Events | Notification |
| `TicketPurchased` | Ordering (saga step 9) | Notification |
| `OrderCancelled` | Ordering (saga compensation) | Notification |

Bootstrap order in `server.ts`: connect to RabbitMQ → register subscribers → connect to MySQL →
start listening. On `SIGINT`/`SIGTERM` the broker connection is closed before the process exits.

## Architecture

Backend monolith partitioned into 5 bounded contexts (see `level-3-components-backend.md`), each mapped 1:1 to `src/modules/<context>`:

* **Identity Context** — `identity`: authentication, authorization, and digital pass issuance (JWT).
* **Events Context** — `events`:
  * `events` core — event catalog, search, and lifecycle (domain/application layers).
  * **Seat Reservation** (`domain/SeatReservation.ts`) — Redis-backed temporary seat holds, used by the Booking Saga.
  * **Venue Plugin Manager** (`infrastructure/venue`) — a microkernel component that decouples venue integrations (seating maps, real-time availability) from the core domain. `VenueAdapter` is the plugin contract; `VenuePluginManager` is the registry/dispatcher; concrete integrations (`GenericVenueAdapter`, `LegacyVenueAdapter`) are pluggable adapters registered at bootstrap (`sharedVenuePluginManager.ts`).
* **Ordering Context** — `ordering`: order lifecycle, and the **Booking Saga Orchestrator** (see above) that drives it.
* **Payment Context** — `payment`:
  * `payment` core — payment provider integration (mocked; no direct DB persistence).
  * **Fraud** (`fraud/CheckFraud.ts`) — a component inside the Payment context, called by the saga before payment is attempted.
* **Notification Context** — `notification`: maps internal domain events to outbound notifications.

Cross-context calls either go through the Booking Saga Orchestrator (synchronous, in-process) or
through the RabbitMQ domain event bus (asynchronous) — no module imports another module's
application services directly except the saga orchestrator itself, which is explicitly the
integration point.
