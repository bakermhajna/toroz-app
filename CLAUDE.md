# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # dev server at localhost:4200 (hash routing)
npm run build      # production build
npm run watch      # build with watch mode (development)
npm test           # run Karma unit tests
```

Angular CLI is also available directly: `ng serve`, `ng build`, `ng generate component <path>`, etc.

## What This App Is

**Toroz** is a restaurant self-service kiosk system with three interfaces:

- **Kiosk** (`/kiosk`, default) — customer-facing ordering flow: welcome → dine type → customer details → category → menu → item customizer → payment → confirmation
- **Kitchen** (`/kitchen`) — real-time Kitchen Display System (KDS) showing orders and their status transitions (new → preparing → ready → done)
- **Admin** (`/admin`) — PIN-protected (default: 1234) menu management with CRUD for categories/items, image uploads, JSON export/import, and order history

All data lives in **Firebase Realtime Database**; images in **Firebase Storage**. Routing is hash-based (`withHashLocation()`).

## Architecture

### Tech Stack
- Angular 21 standalone components (no NgModules), strict TypeScript, OnPush change detection throughout
- RxJS 7.8 for Firebase subscriptions; Angular Signals for local reactive state
- Firebase Realtime Database collections: `menu`, `menuMeta`, `todayOrders`, `doneOrders`, `meta/lastOrderNum`
- Firebase Storage path pattern: `menu-images/{catKey}/{itemId}.{ext}` and `menu-images/categories/{catKey}.{ext}`
- SCSS with global CSS variables defined in `src/styles.scss` (`--dark`, `--gold`, `--cream`, `--green`, `--danger`)

### Folder Structure
```
src/app/
  core/
    models/      # shared TypeScript interfaces (MenuItem, MenuCategory, Order, CartItem, CustomSelections, …)
    services/    # singleton services (menu, order, storage, pin)
    guards/      # adminGuard (PIN check via PinService + sessionStorage)
  features/
    kiosk/       # all kiosk screens as child components
    kitchen/     # KDS display
    admin/       # menu editor, modals, image upload
  shared/
    components/  # ToastComponent, ConfirmDialogComponent, BrandMarkComponent
```

### Key Service Patterns

**MenuService** — owns menu state as signals (`_menu`, `_menuLoading`, `_meta`, `_metaLoading`). Reads/writes Firebase `menu` and `menuMeta` nodes. Exposes computed signals and mutation methods.

**OrderService** — subscribes to Firebase `todayOrders` and `doneOrders` via `onValue` listeners and exposes them as signals. Handles order creation/status updates.

**StorageService** — wraps Firebase Storage upload/download for category and item images.

**PinService** — stores admin authentication state in `sessionStorage`.

### Component Patterns
- All components are **standalone** with an explicit `imports` array
- **`ChangeDetectionStrategy.OnPush`** everywhere
- Local state via `signal()` / `computed()`; cross-component state via injected services
- `ViewChild` used for template refs (e.g. modals, scroll containers)

### Routing
```
/              → redirects to /kiosk
/kiosk         → KioskShellComponent (lazy)
/kitchen       → KitchenShellComponent (lazy)
/admin         → AdminShellComponent (lazy, guarded by adminGuard)
```

## Code Style
- Prettier: 100-char line width, single quotes (see `.prettierrc` if present)
- Strict TypeScript: `noImplicitOverride`, `noPropertyAccessFromIndexSignature`, `strictTemplates`
- `skipTests: true` in Angular schematics defaults — the project has minimal test coverage
