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
  - *Statuses:*
    - `NEW`: Waiting for files (รอไฟล์ครบ)
    - `PENDING`: Ready to start comparison or comparison passed (รอดำเนินการ / เปรียบเทียบข้อมูลผ่านแล้ว)
    - `PROCESSING`: Running automated AI comparison (กำลังเปรียบเทียบข้อมูล)
    - `REVIEW`: Pending manual data review and approval (รอตรวจสอบ)
    - `READY`: All documents successfully approved and locked (เสร็จสมบูรณ์)
    - `DONE`: Data fully exported to the next system (ส่งออกแล้ว)
- **Documents:** Individual files (Invoice, Packing List, B/L, etc.).
  - *Statuses:* `MISSING` -> `RECEIVED` -> `EXTRACTING` (AI OCR) -> `OCR_DONE` -> (`MATCHED` / `MISMATCHED`) -> `LOCKED` (Approved).

### 3.2 State Transitions & Business Logic
- **Locking Mechanism:** Users lock document columns once verified. When all document columns in a Job are `LOCKED`, the Job automatically elevates to a `READY` state.
- **Sequential Workflow Sub-items:** When a workflow consists of sequential sub-items (e.g. multi-step verification pipelines), all subsequent sub-items start in the `NEW` state (waiting for files) instead of starting as `PROCESSING` immediately, ensuring a proper, human-in-the-loop progression.
- **Confidence Scoring:** AI analysis provides confidence percentages which impact document visual grouping and required attention.
- **Mismatch Overrides:** Users can manually override AI mismatches (or synonyms). Synonyms map directly to predefined rules.
