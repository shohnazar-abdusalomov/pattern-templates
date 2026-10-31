# 🚀 Design Patterns in TypeScript

> Production-grade, type-safe implementations of classic Creational and Structural Design Patterns in **TypeScript** (ESM / NodeNext), accurately ported and adapted from [professorDeveloper/design-patterns](https://github.com/professorDeveloper/design-patterns).

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📂 Project Structure

The repository structure matches the source repository 1:1, organized into **Creational** and **Structural** patterns:

```text
src/
├── creational/
│   ├── abstractfactory/         # Abstract Factory (Payment & Refund Processors)
│   │   ├── product/             # PaymentProcessor, RefundProcessor interfaces
│   │   ├── factory/             # PaymentFactory, ClickFactory, PaymeFactory
│   │   ├── client/              # CheckoutService client
│   │   └── main.ts              # Runnable demo
│   ├── builder/                 # Builder Pattern (CMS Website Builder)
│   │   ├── cms.enum.ts          # Cms enum (WORDPRESS, TILDA)
│   │   ├── website.ts           # Website product
│   │   ├── website-builder.ts   # Abstract WebsiteBuilder
│   │   ├── simple-website-builder.ts
│   │   ├── enterprise-website-builder.ts
│   │   ├── director.ts          # Director orchestrator
│   │   └── main.ts              # Runnable demo
│   ├── builder_http/            # Resilient HTTP Client Builder
│   │   ├── custom-exceptions.ts # ServerError, TimeoutError, NetworkError, etc.
│   │   ├── nice-response.ts     # Resource<T> (Success / Error wrapper)
│   │   ├── utils.ts             # URL query parameters manipulation
│   │   ├── nice-http-client.ts  # NiceHttpClient & NiceHttpClientBuilder
│   │   └── main.ts              # Runnable demo
│   ├── prototype/               # Prototype Pattern (Cloning)
│   │   ├── copiable.interface.ts# Generic Copiable interface
│   │   ├── project.ts           # Project prototype class
│   │   ├── copy_type/           # Shallow vs Deep copy demonstration
│   │   ├── document/            # Document cloning with deep tag list clone
│   │   └── game/                # GameCharacter cloning with independent inventory
│   └── singleton/               # Singleton Pattern
│       ├── database-helper.ts   # DatabaseHelper thread-safe / lazy singleton
│       ├── programming-logg.ts  # ProgrammingLogg instance singleton
│       ├── test-object.ts       # Object declaration / constant singleton
│       └── main.ts              # Runnable demo
└── structural/
    ├── adapter/                 # Adapter Pattern
    │   ├── with_database/       # Adapting legacy JavaApplication to Database interface
    │   ├── with_email/          # Adapting EmailClient & TelegramClient to NotificationService
    │   └── with_payment/        # StripePaymentAdapter: UZS to USD cents conversion
    ├── bridge/                  # Bridge Pattern (Decoupling abstraction & implementation)
    │   ├── develop/             # Program abstraction bridged with Developer implementors
    │   ├── device_example/      # BasicRemote bridged with Device (Radio, Tv, XiaomiDeviceAdaptor)
    │   └── game/                # Game abstraction bridged with Cpp/Java Developers
    └── composite/               # Composite Pattern
        └── with_project/        # Team composite managing leaf Developers (Frontend & Backend)
```

---

## 🛠️ Quick Start

### Installation

```bash
git clone https://github.com/shohnazar-abdusalomov/pattern-templates.git
cd pattern-templates
npm install
```

### Type Checking

```bash
npm run typecheck
```

### Run All Pattern Demonstrations

```bash
npm run demo:all
```

---

## 📑 Patterns Overview & Demos

### 1. Creational Patterns

| Pattern | Description | Demo Command |
| :--- | :--- | :--- |
| **Abstract Factory** | Creates families of related payment and refund processors (`Click` and `Payme`) without specifying concrete classes. | `npm run demo:abstractfactory` |
| **Builder (Website)** | Step-by-step construction of complex `Website` objects using `Director`, `SimpleWebsiteBuilder`, and `EnterpriseWebsiteBuilder`. | `npm run demo:builder` |
| **Builder (HTTP)** | Fluent builder for `NiceHttpClient` with headers, query params, retry policies, and structured `Resource<T>` responses. | `npm run demo:builder-http` |
| **Prototype (Document)** | Clones `Document` instances with isolated tag lists via `DocumentFactory`. | `npm run demo:prototype:doc` |
| **Prototype (Game)** | Clones `GameCharacter` with independent inventory arrays via `CharacterFactory`. | `npm run demo:prototype:game` |
| **Prototype (Copy Type)** | Compares shallow vs deep copying behavior with mutable references. | `npm run demo:prototype:copy` |
| **Singleton** | Enforces single instance creation for `DatabaseHelper`, `ProgrammingLogg`, and frozen `TestObject`. | `npm run demo:singleton` |

### 2. Structural Patterns

| Pattern | Description | Demo Command |
| :--- | :--- | :--- |
| **Adapter (Database)** | Adapts legacy `JavaApplication` into the modern `Database` interface. | `npm run demo:adapter:database` |
| **Adapter (Notification)** | Integrates `EmailClient` and `TelegramClient` into a unified `NotificationService`. | `npm run demo:adapter:email` |
| **Adapter (Payment)** | Adapts third-party `StripeApi` (cents) to `PaymentProcessor` (UZS) with real-time exchange rates. | `npm run demo:adapter:payment` |
| **Bridge (Develop)** | Decouples `Program` execution logic from concrete `Developer` implementations (`JavaDeveloper`, `KotlinDeveloper`). | `npm run demo:bridge:develop` |
| **Bridge (Device)** | Decouples `BasicRemote` controller from devices (`Radio`, `Tv`, and adapted `XiaomiDevice`). | `npm run demo:bridge:device` |
| **Bridge (Game)** | Bridges `Game` genres (`RacingGame`, `FootballGame`) with game engine developers (`CppDeveloper`, `JavaDeveloper`). | `npm run demo:bridge:game` |
| **Composite (Project)** | Treats individual `FrontendDeveloper` / `BackendDeveloper` and composite `Team` uniformly. | `npm run demo:composite` |

---

## 🧪 Detailed Pattern Implementations

### Creational: Abstract Factory (`src/creational/abstractfactory`)
- **Factory Interface:** `PaymentFactory` declares `createPaymentProcessor()` and `createRefundProcessor()`.
- **Concrete Factories:**
  - `ClickFactory`: Returns `ClickPaymentProcessor` and `ClickRefundProcessor`.
  - `PaymeFactory`: Returns `PaymePaymentProcessor` and `PaymeRefundProcessor`.
- **Client:** `CheckoutService` uses factory composition for decoupled processing.

### Creational: Builder (`src/creational/builder`)
- **Product:** `Website` with properties `name`, `cms` (`WORDPRESS` or `TILDA`), and `price`.
- **Builder:** `WebsiteBuilder` provides step-by-step methods: `buildName()`, `buildCms()`, and `buildPrice()`.
- **Director:** `Director` coordinates builder construction sequence to produce finished products.

### Creational: Resilient HTTP Client (`src/creational/builder_http`)
- Fluent configuration: `baseUrl`, `cookies`, `headers`, `readTimeout`, `connectionTimeout`, and `retryLimit`.
- Strong error typing: `ServerError`, `TimeoutError`, `NetworkError`, `InvalidUrlError`, `UnknownError`.
- Safe functional response container: `Resource.Success<T>` and `Resource.Error`.

### Creational: Prototype (`src/creational/prototype`)
- Deep copy isolation: Cloned objects guarantee internal array mutability does not leak back to prototype originals.
- Demonstrated across Document tags and Game Character inventory systems.

### Creational: Singleton (`src/creational/singleton`)
- `DatabaseHelper.getInstance()`: Guarantees single database connection manager instance.
- `ProgrammingLogg.getInstance()`: Centralized application logger with equality verification.
- `TestObject`: Readonly frozen object literal representing constant singleton.

### Structural: Adapter (`src/structural/adapter`)
- **Database Adapter:** Translates legacy application method calls (`insertObject`) to standardized CRUD interfaces (`insert`, `update`, `delete`, `get`).
- **Notification Adapter:** Wraps incompatible clients (`EmailClient.sendEmail`, `TelegramClient.sendTelegramMessage`) into `NotificationService.send`.
- **Payment Adapter:** Converts local currency (UZS) into Stripe's integer cents format using configurable exchange rates.

### Structural: Bridge (`src/structural/bridge`)
- Prevents Cartesian explosion of class inheritance by separating abstraction hierarchies from implementation hierarchies:
  - `Program` (abstraction) ⇄ `Developer` (implementation).
  - `BasicRemote` (abstraction) ⇄ `Device` (implementation).
  - `Game` (abstraction) ⇄ `Developer` (implementation).

### Structural: Composite (`src/structural/composite`)
- `Team` acts as a composite containing developer leaves (`FrontendDeveloper`, `BackendDeveloper`).
- Invocations like `createProject()` transparently delegate across all tree components.

---

## 📄 License

MIT © [Shohnazar Abdusalomov](https://github.com/shohnazar-abdusalomov)
