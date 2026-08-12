* Conduct an architectural review of the initial monolith.
* Refactor the code into strict domain-oriented modules.

## Architecture

Backend monolith partitioned into 5 bounded contexts (see `level-3-components-backend.md`), each mapped 1:1 to `src/modules/<context>`:

* **Identity Context** — `identity`: authentication, authorization, and profile (JWT).
* **Events Context** — `events`:
  * `events` core — event catalog, search, and lifecycle (domain/application layers).
  * **Venue Plugin Manager** (`infrastructure/venue`) — a microkernel component that decouples venue integrations (seating maps, real-time availability) from the core domain. `VenueAdapter` is the plugin contract; `VenuePluginManager` is the registry/dispatcher; concrete integrations (`GenericVenueAdapter`, `LegacyVenueAdapter`) are pluggable adapters registered at bootstrap (`sharedVenuePluginManager.ts`). Adding a new venue system means adding a new adapter, no core changes required.
* **Ordering Context** — `ordering`: seat locking, reservations, and order lifecycle.
* **Payment Context** — `payment`: payment provider integration (mocked; no direct DB persistence).
* **Notification Context** — `notification`: maps internal domain events to outbound notifications.

Cross-module communication uses an in-process domain event bus (`shared/infrastructure/bus`) — no external message broker at this stage.
