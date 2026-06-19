# Architecture Guidelines

## 1. Core Architecture Strategy
The application is built on Angular and utilizes `ng-zorro-antd` for the UI foundation. The architecture mandates a strict separation of concerns to ensure maintainability, testability, and a clear path if backend APIs are introduced later.

## 2. Directory & Module Structure
- **`mock-data/`**: A fully isolated directory holding constants, JSON data, and mock objects. Provides a single source of truth for prototyping and simulated states.
- **`services/`**: The Core Data Abstraction layer. `@Injectable()` services fetch data (from `mock-data/` or future APIs) and expose them via RxJS Observables. It handles all asynchronous operations and data transformations.
- **`components/` (or `features/`):** The isolated Presentation layer. These Angular components consume data exclusively by subscribing to services. They use `ng-zorro-antd` structural and UI components (`<nz-layout>`, `<nz-table>`, etc.) for rendering and emitting user interactions.

## 3. Domain Entities (Logistics Data Comparison)
The central business logic revolves around verifying extracted AI document data against master sets.

### 3.1 Workflow Entities
- **Jobs:** Encompass multiple documents related to a single logistic transaction.
  - *Statuses:* `NEW` -> `READY` (Review) -> `PROCESSING` -> `DONE`.
- **Documents:** Individual files (Invoice, Packing List, B/L, etc.).
  - *Statuses:* `RECEIVED` -> `EXTRACTING` (AI OCR) -> `OCR_DONE` -> (`MATCHED` / `MISMATCHED`) -> `LOCKED` (Approved).

### 3.2 State Transitions & Business Logic
- **Locking Mechanism:** Users lock document columns once verified. When all document columns in a Job are `LOCKED`, the Job automatically elevates to a `READY` state.
- **Confidence Scoring:** AI analysis provides confidence percentages which impact document visual grouping and required attention.
- **Mismatch Overrides:** Users can manually override AI mismatches (or synonyms). Synonyms map directly to predefined rules.
