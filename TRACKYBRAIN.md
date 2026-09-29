# TracklyBrain: Coding Manual

This guide is a map of the Trackly project: what each important file owns, where to make common changes, and which parts of the app should not be changed casually. Start at the project root (`D:\projects\trackly`) unless you specifically intend to work on the nested `trackly/` copy.

## Start Here

| If you want to change...                           | Start in...                     |
| -------------------------------------------------- | ------------------------------- |
| The app startup and global CSS import              | `src/main.tsx`                  |
| Routes, page access, and global providers          | `src/App.tsx`                   |
| Sidebar, mobile navigation, and shared page header | `src/layouts/AppLayout.tsx`     |
| Theme colors and shared visual styling             | `src/styles/index.css`          |
| Available theme names and metadata                 | `src/themes/themeConfig.ts`     |
| Shared domain types                                | `src/types/index.ts`            |
| Tasks, habits, timetable data and actions          | `src/stores/useTracklyStore.ts` |
| A page's content and local interactions            | `src/pages/<PageName>.tsx`      |
| Supabase client configuration                      | `src/services/supabase.ts`      |
| AI request helper                                  | `src/services/ai.ts`            |
| Authentication behavior                            | `src/contexts/AuthContext.tsx`  |
| Cloud workspace synchronization                    | `src/contexts/CloudSync.tsx`    |
| Netlify server-side AI/email endpoints             | `netlify/functions/`            |
| Database tables, policies, and triggers            | `supabase/schema.sql`           |

## Project Layout

- `src/pages/` contains route-level screens: Dashboard, Tasks, Habits, Timetable, Analytics, Notes, Journal, Study Files, Assistant, Settings, Landing, Auth, and Reset Password.
- `src/components/shared/` contains shared pieces such as icons, contextual AI, and the error boundary.
- `src/components/ui/` contains reusable UI primitives such as modals and confirmation dialogs.
- `src/components/timetable/` contains schedule-specific components.
- `src/layouts/` contains the authenticated application shell and shared page layout.
- `src/contexts/` coordinates authentication and cloud synchronization.
- `src/stores/` owns client workspace state and persistence.
- `src/utils/` contains small shared helpers, including local date handling.
- `public/` contains files served as-is by Vite, such as the SPA redirect configuration.
- `netlify/functions/` contains server functions. Keep provider secrets on the server; never put them in browser code or `VITE_` variables.
- `supabase/` contains database SQL that must be applied to the Supabase project separately.

## Common Changes

### Change a page

Edit the matching file in `src/pages/`. For example, task UI belongs in `src/pages/Tasks.tsx`; dashboard summaries belong in `src/pages/Dashboard.tsx`. Keep data operations in the existing store/service layer rather than duplicating persistence inside a component.

### Add or change navigation

Add or update the route in `src/App.tsx`, then update the `nav` list in `src/layouts/AppLayout.tsx` if the page should appear in navigation. Preserve the existing `Workspace` wrapper for authenticated application pages.

### Change stored data or behavior

The Zustand store in `src/stores/useTracklyStore.ts` owns task, habit, schedule, and preference state. Shared data shapes live in `src/types/index.ts`. Update both when a domain field changes, and check `src/contexts/CloudSync.tsx` and `supabase/schema.sql` if the serialized cloud data or database contract also changes.

### Change themes or global appearance

Theme selection is listed in `src/themes/themeConfig.ts`; the preference is applied by the `Theme` component in `src/App.tsx`; theme tokens and component styles are in `src/styles/index.css`. Prefer the existing `--t-*` variables for surfaces, text, borders, and actions so one component works across themes.

### Change authentication or AI

Authentication calls are centralized in `src/contexts/AuthContext.tsx`, with the Supabase client in `src/services/supabase.ts`. Browser AI calls go through `src/services/ai.ts` to a function in `netlify/functions/`. Do not expose private API keys to the frontend.

### Change icons or reusable controls

Use `src/components/shared/Icons.tsx` for the app's curated icon exports. Shared dialogs and modal behavior belong in `src/components/ui/`; update the shared component when all its call sites should change.

## Data Flow And Guardrails

1. Pages render the current data from `useTracklyStore` and call its actions for changes.
2. Zustand persists the local workspace in browser storage; signed-in cloud synchronization is handled by `CloudSync`.
3. Keep route declarations in `App.tsx`, navigation in `AppLayout.tsx`, and domain logic in its current owner.
4. When changing a type or persisted shape, search for its usages before editing; older browser data may still use the previous shape.
5. Avoid editing `dist/`, `node_modules/`, binary assets, package lockfiles by hand, or installed AI assistant skill bundles.

## Root App And Nested Copy

This workspace has an app at the root and a second app copy under `trackly/`. The root `package.json` is the normal command entry point. The `format` scripts include both app trees so they stay consistently formatted; make functional changes in the app you intend to ship and check its own package/build configuration before changing the nested copy.

## Format And Verify

From the project root, run:

```sh
npm run format
npm run format:check
npm run build
```

`format` writes the configured Prettier style to the app source, project configs, and Markdown documentation. `format:check` checks the same files without changing them. The production build runs TypeScript compilation and Vite bundling; it does not replace visual testing in the browser.

For a focused change, run `npm run format` after editing, then `npm run build`. Check the affected page in the browser, especially after changing shared styles, routes, authentication, persisted data, or responsive layouts.
