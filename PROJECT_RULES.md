# Project Rules & Guidelines

## 1. Tech Stack Requirements
- **Framework:** Angular
- **UI Component Library:** `ng-zorro-antd` (Ant Design for Angular)
- **Styling:** SCSS (Component-scoped)
- **Icons:** Lucide Icons (e.g., `lucide-angular`)

## 2. Mock Data & State Management Principles
- **Strict Separation (`mock-data/`):** All mocked arrays, hardcoded initial states, and JSON objects MUST be isolated in a dedicated `mock-data/` directory (e.g., `mock-data/dashboard.mock.ts`).
- **Data Encapsulation:** UI Components (`.ts`) must **never** import mock data directly. 
- **The Service Bridge:** `@Injectable()` Services are the *only* structures allowed to import constants from `mock-data/`. These services must structure the data as RxJS Observables (e.g., using `return of(MOCK_DATA);`). Components must subscribe to these services to consume data.
- **Data Currency:** Ensure all mock data and simulated records reflect the current year (e.g., 2026).

## 3. General Principles
- **Code Quality:** Write clean, readable, well-organized code. Ensure strict Separation of Concerns (SoC) between view logic (components) and business/data logic (services).
- **Localization:** The platform supports multi-language display (currently Thai `TH` and English `EN`). Use variable text rendering based on the active locale state instead of hardcoded raw strings in templates.
- **Graceful Error Handling:** Interface elements must gracefully handle empty states, processing states, or missing data without breaking the layout. 

## 4. Documentation Standard
- For every code block, component, or configuration file edited, clearly maintain the File Path at the top of the file/block (e.g., `// src/app/features/dashboard/dashboard.component.ts`) to ensure all developers understand the exact context and location of the source.
