# Arquitectura del Proyecto: Monolito Modular

Este documento explica la arquitectura de TicketWave API, diseñada como un **Monolito Modular** siguiendo principios de **Clean Architecture** y **DDD (Domain-Driven Design)**.

## ¿Por qué un Monolito Modular?

Hemos elegido un enfoque de Monolito Modular por las siguientes razones:

1.  **Complejidad Manejable**: Permite mantener la simplicidad de despliegue de un solo artefacto (monolito) mientras se mantiene una separación clara de responsabilidades (módulos).
2.  **Límites de Dominio Claros**: Cada módulo representa un "Bounded Context". Esto facilita el entendimiento del negocio y evita que el código se convierta en un "Big Ball of Mud".
3.  **Facilidad de Evolución**: Si un módulo crece demasiado en carga de trabajo o complejidad, su extracción a un microservicio independiente es trivial gracias a su bajo acoplamiento.
4.  **Carga Cognitiva Reducida**: Los desarrolladores pueden enfocarse en un solo módulo a la vez sin necesidad de entender todo el sistema.

## Estructura de Directorios

El proyecto se organiza en la carpeta `src/modules`, donde cada subcarpeta es un módulo independiente:

```text
src/modules/{module-name}/
├── domain/            # Lógica de negocio pura (Entidades, Objetos de Valor, Eventos de Dominio, Interfaces de Repositorio)
├── application/       # Casos de uso y orquestación (Servicios de Aplicación)
└── infrastructure/    # Implementaciones técnicas (Controladores HTTP, Repositorios concretos, Clientes de APIs externas)
    └── http/          # Rutas y controladores de Express
```

### Reglas de Dependencia

Para mantener la integridad de la arquitectura, seguimos la "Regla de Dependencia": **las dependencias solo pueden apuntar hacia adentro (hacia el Dominio)**.

-   `Infrastructure` conoce a `Application` y `Domain`.
-   `Application` conoce a `Domain`.
-   `Domain` no conoce a nadie.

### Comunicación entre Módulos

La comunicación entre módulos debe ser, preferiblemente, **asíncrona y basada en eventos** para reducir el acoplamiento.

-   Se utiliza un **In-Memory Event Bus** (`src/shared/infrastructure/bus/EventEmitterBus.ts`) para publicar y suscribirse a eventos de dominio.
-   Ejemplo: Cuando se compra un ticket en el módulo `ticketing`, se publica el evento `TicketPurchased`. El módulo `notif` está suscrito a este evento para enviar el correo correspondiente.

## Módulos Implementados

Basado en los requisitos de `ticketwave-events.md` y el diagrama C4:

-   **Catalog**: Gestión de eventos, venues y búsquedas.
-   **Ticketing**: Reserva de asientos y emisión de tickets.
-   **Payment**: Gestión de pagos y reembolsos.
-   **Fraud**: Detección de bots y comportamiento sospechoso.
-   **Promo**: Aplicación de descuentos y promociones.
-   **Notif**: Notificaciones a usuarios.
-   **Users**: Gestión de perfiles de usuario.
-   **Auth**: Autenticación y seguridad.

## Shared Kernel

La carpeta `src/shared` contiene código que es común a todos los módulos pero no pertenece a ningún dominio específico, como la infraestructura del bus de eventos, utilidades de respuesta y manejo de errores.
