# 🏗️ Creational Design Patterns in TypeScript

Production-grade, clean, and type-safe implementations of **Creational Design Patterns** in TypeScript.

This repository demonstrates the practical application of design patterns in real-world software engineering scenarios with comprehensive interfaces, full type-safety, and standalone executable demonstrations.

---

## 📁 Repository Structure

```text
pattern-templates/
├── Creational/
│   ├── Singletone/                     # Singleton Pattern (Yagona nusxa shabloni)
│   │   └── DBConnection/
│   │       ├── db-connection.interface.ts   # Database connection, metrics & query interfaces
│   │       ├── db-connection.ts             # Thread-safe Singleton implementation
│   │       └── index.ts                     # Exports & Executable demo
│   │
│   ├── Factory/                        # Factory Pattern (Fabrika shabloni)
│   │   └── Developer/
│   │       ├── developer.interface.ts       # Developer domain types, roles & budget interfaces
│   │       ├── developers.ts                # 5 Concrete classes (Frontend, Backend, Mobile, DevOps, FullStack)
│   │       ├── developer-factory.ts         # Extensible factory with role registry & team cost calculator
│   │       └── index.ts                     # Exports & Executable demo
│   │
│   └── Builder/                        # Builder Pattern (Quruvchi shabloni)
│       ├── 3-computer-builder.ts            # 3. Computer Builder (Desktop, Gaming, Laptop)
│       ├── 4-http-client-builder.ts         # 4. Fluent HttpClient Builder & Immutable HttpRequest
│       ├── 5-http-real-client.ts            # 5. Real HTTP requests (GET, POST, Auth, Headers, Query)
│       ├── 6-http-retry-exception.ts        # 6. Retry strategy (Backoff) & Typed Custom Exceptions
│       └── index.ts                         # Unified exports
│
├── Builder/                            # Root shortcut linking directly to Builder patterns
│   ├── 3-computer-builder.ts
│   ├── 4-http-client-builder.ts
│   ├── 5-http-real-client.ts
│   ├── 6-http-retry-exception.ts
│   └── index.ts
│
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Patterns Overview

### 1. Singleton Pattern: `DBConnection`
- **Location:** `Creational/Singletone/DBConnection/`
- **Purpose:** Guarantees a single database connection instance across the application lifecycle.
- **Key Highlights:**
  - Strict private constructor preventing accidental instantiation.
  - Connection pooling simulation and metrics tracking (uptime, executed queries, active pool).
  - Transaction wrapper (`BEGIN -> COMMIT / ROLLBACK`).
  - Safe teardown via `disconnect()` and test utility `resetInstance()`.

```typescript
import { DBConnection } from './Creational/Singletone/DBConnection/index.js';

const db1 = DBConnection.getInstance({ database: 'fintech_crm_db' });
const db2 = DBConnection.getInstance();

console.log(db1 === db2); // true (Identical instance)
await db1.connect();
const users = await db1.query('SELECT * FROM users');
```

---

### 2. Factory Pattern: `Developer`
- **Location:** `Creational/Factory/Developer/`
- **Purpose:** Encapsulates the instantiation of different developer specializations without coupling callers to concrete classes.
- **5 Developer Roles:**
  1. `FrontendDeveloper` (Next.js, React, TypeScript, TailwindCSS)
  2. `BackendDeveloper` (Node.js, NestJS, PostgreSQL, Redis, Kafka)
  3. `MobileDeveloper` (Flutter, Dart, React Native, Swift, Kotlin)
  4. `DevOpsEngineer` (Kubernetes, Terraform, AWS, CI/CD, Prometheus)
  5. `FullStackDeveloper` (TypeScript, React, Node.js, Docker)
- **Key Highlights:**
  - Open/Closed Principle via dynamic registry (`DeveloperFactory.registerRole()`).
  - Batch team creation and automated sprint cost/budget calculator.

```typescript
import { DeveloperFactory } from './Creational/Factory/Developer/index.js';

const seniorFrontend = DeveloperFactory.createFrontend('Shohnazar', 'SENIOR');
console.log(seniorFrontend.writeCode('Interactive Dashboard'));
console.log(seniorFrontend.deploy());

// Create an entire project team with budget calculation
const team = DeveloperFactory.createTeam([
  { role: 'FRONTEND', name: 'Alisher', level: 'MID' },
  { role: 'BACKEND', name: 'Bobur', level: 'SENIOR' },
  { role: 'DEVOPS', name: 'Rustam', level: 'SENIOR' },
]);

const budget = DeveloperFactory.calculateTeamBudget(team);
console.log(`Monthly Team Budget: $${budget.estimatedMonthlyCost}`);
```

---

### 3. Builder Pattern
- **Location:** `Creational/Builder/` and `Builder/`

#### 3. Computer Builder (`3-computer-builder.ts`)
- Step-by-step construction of complex computer configurations.
- Fluent setter methods with defaults (`setRAM`, `setOS`, `setStorage`, `setPointingDevice`, `setKeyboard`).
- Pre-built configurations for Developer Laptop, Gaming PC, and Workstation.

#### 4. HttpClient Builder (`4-http-client-builder.ts`)
- Highly configurable, immutable `HttpRequest` builder.
- Fluent API for query params, headers, authentication (`Bearer`, `Basic`, `ApiKey`), timeouts, and SSL protocol enforcement.

#### 5. HttpClient Real Client (`5-http-real-client.ts`)
- Real live HTTP executions against JSONPlaceholder.
- Demonstrated features:
  - GET with query params, SSL security check, custom headers, and bearer auth.
  - POST with multi-object payload merging via `setBodies(...)`.
  - Type-safe generic response parsing: `await request.execute<IPost>()`.

#### 6. HttpClient Retry & Custom Exceptions (`6-http-retry-exception.ts`)
- Robust typed exception hierarchy:
  - `HttpClientException` (Base error with timestamp, method, url)
  - `HttpTimeoutException` (Timeout triggered via `AbortController`)
  - `HttpStatusException` (HTTP 4xx / 5xx error with status and payload)
  - `HttpNetworkException` (Underlying socket/DNS/connectivity failures)
- Exponential backoff retry engine (`delayMs * backoffFactor^(attempt - 1)`).
- Fail-fast client error protection (4xx errors abort retries immediately).

---

## 🛠️ Quickstart & Running Demos

### Prerequisites
- Node.js (v18+)
- npm

### Installation
```bash
git clone https://github.com/shohnazar-abdusalomov/pattern-templates.git
cd pattern-templates
npm install
```

### Run All Demos
```bash
npm run demo:all
```

### Run Individual Pattern Demos
```bash
# 1. Singleton (DBConnection)
npm run demo:singleton

# 2. Factory (Developer)
npm run demo:factory

# 3. Builder (Computer)
npm run demo:computer

# 4. Builder (HttpClient Builder)
npm run demo:http-builder

# 5. Builder (Real HTTP Client Calls)
npm run demo:http-real

# 6. Builder (Retry Strategy & Custom Exceptions)
npm run demo:http-retry
```

### Type Checking
```bash
npm run typecheck
```

---

## 📄 License
MIT © [Shohnazar Abdusalomov](https://github.com/shohnazar-abdusalomov)
