Transforma arquitecturas basadas en comunicación síncrona hacia
topologías desacopladas orientadas por eventos, demostrando
comprensión de la consistencia eventual y de los patrones de
mensajería en sistemas distribuidos.

Map Out Domain Events.
Wire an In-Memory Event Bus.
Refactor the event bus to use an external message broker (like RabbitMQ).

## Event-Driven Architecture

Domain events are routed through a **RabbitMQ** topic exchange (`domain_events`, see
`shared/infrastructure/bus/RabbitMQEventBus.ts`). Each subscriber binds its own exclusive,
auto-delete queue to the routing key it cares about, so a single event can fan out to several
bounded contexts without them knowing about each other (`shared/infrastructure/bus/subscribers.ts`
is the only place that wires publishers to subscribers).

Domain event map (matches `level-3-components-backend.md`):

| Event | Published by | Consumed by |
|---|---|---|
| `OrderCreated` | Ordering | Payment (charges the order) |
| `PaymentSuccessful` | Payment | Ordering (confirms order, issues tickets), Identity (issues digital pass), Notification |
| `PaymentFailed` | Payment | Ordering (cancels the order) |
| `EventCancelled` | Events | Notification |
| `EventUpdated` | Events | Notification |
| `TicketPurchased` | Ordering | Notification |
| `OrderCancelled` | Ordering | Notification |

Bootstrap order in `server.ts`: connect to RabbitMQ → register subscribers → connect to MySQL →
start listening. On `SIGINT`/`SIGTERM` the broker connection is closed before the process exits.

## Architecture

Backend monolith partitioned into 5 bounded contexts (see `level-3-components-backend.md`), each mapped 1:1 to `src/modules/<context>`:

* **Identity Context** — `identity`: authentication, authorization, and digital pass issuance (JWT).
* **Events Context** — `events`:
  * `events` core — event catalog, search, and lifecycle (domain/application layers).
  * **Venue Plugin Manager** (`infrastructure/venue`) — a microkernel component that decouples venue integrations (seating maps, real-time availability) from the core domain. `VenueAdapter` is the plugin contract; `VenuePluginManager` is the registry/dispatcher; concrete integrations (`GenericVenueAdapter`, `LegacyVenueAdapter`) are pluggable adapters registered at bootstrap (`sharedVenuePluginManager.ts`). Adding a new venue system means adding a new adapter, no core changes required.
* **Ordering Context** — `ordering`: seat locking, reservations, and order lifecycle.
* **Payment Context** — `payment`: payment provider integration (mocked; no direct DB persistence).
* **Notification Context** — `notification`: maps internal domain events to outbound notifications.

Cross-module communication happens exclusively through domain events on the RabbitMQ bus above —
no module imports another module's application services directly.
