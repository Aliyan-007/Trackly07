# Trackly

## Plan • Track • Achieve

**Product & Technical Brief**  
**Status:** MVP-ready, production-oriented web application  
**Audience:** Students, collaborators, recruiters, clients, investors, and open-source contributors

---

## 1. Executive Summary

**Trackly** is an all-in-one academic productivity platform that gives students a single, calm workspace for planning their week, managing coursework, building habits, and understanding their progress. It replaces the fragmented workflow of switching among calendars, to-do apps, reminders, and spreadsheets with an experience designed around the way students actually organize their lives.

The product is intentionally focused. Rather than adding every possible productivity feature, Trackly reduces the effort required to answer the questions that matter each day:

- What do I need to do next?
- What deadlines are approaching?
- How does my week look?
- Am I following through on the routines that support my goals?
- Where is my time and effort going?

Trackly combines an at-a-glance dashboard, timetable planning, task and deadline management, habit tracking, and visual productivity analytics in a responsive React application. Its component-oriented architecture, typed codebase, and clear separation of features make it suitable both as a polished MVP and as a foundation for a broader academic platform.

> **Product principle:** Reduce mental clutter so students can focus on learning instead of organizing.

---

## 2. Product Vision and Positioning

Student productivity is often distributed across disconnected tools: a calendar for class times, a notes app for assignments, a checklist for tasks, and a separate habit tracker for personal routines. That fragmentation adds friction at exactly the moment students need clarity.

Trackly brings these activities into one coherent system. It is not positioned as a general-purpose corporate task manager; it is an academic companion shaped around classes, subjects, study blocks, assignments, deadlines, and sustainable routines.

### Product objectives

| Objective                       | How Trackly addresses it                                                                                        |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Make the day easier to start    | A dashboard surfaces classes, deadlines, priority work, and habit progress immediately.                         |
| Make commitments visible        | The timetable turns a scattered set of classes, study sessions, and events into a clear weekly view.            |
| Help students act on priorities | Tasks carry deadlines, categories, priorities, and completion state rather than living in an unstructured list. |
| Encourage consistency           | Simple habit check-ins and progress views reward repeatable behavior without creating pressure.                 |
| Turn activity into insight      | Lightweight charts help students reflect and adjust their planning habits.                                      |

### Target audience

**Primary audience**

- University and college students balancing courses, assignments, exams, and personal responsibilities
- High school students building early planning and study habits

**Secondary audience**

- Self-learners and online-course participants
- Competitive exam candidates working toward long-term milestones
- Teachers and educators managing a personal academic schedule

The interface remains approachable for first-time planners while offering enough structure for students with demanding schedules.

---

## 3. Experience Principles

Trackly is designed to feel modern, minimal, quick, and reassuring. Its product decisions are guided by the following principles:

1. **Clarity before density.** Information is grouped into meaningful summaries, not crowded dashboards or endless controls.
2. **Actionable by default.** Every view should help a student decide what to do, not merely display stored data.
3. **Low-friction maintenance.** Creating a task, completing a habit, or checking a schedule should take seconds.
4. **Consistency builds trust.** Shared interaction patterns, spacing, status colors, and components keep the product predictable.
5. **Progress should motivate, not judge.** Analytics expose patterns and achievements without turning productivity into a source of guilt.
6. **Responsive and inclusive access.** The product is useful on desktop for planning and on mobile for quick daily check-ins.

---

## 4. Core Product Features

### 4.1 Landing Page

The landing page introduces Trackly before a student has committed to creating an account. It explains the product in a visual, benefit-led narrative and offers clear paths into authentication.

**Key sections**

- A modern hero section with the Trackly message, product value proposition, and prominent calls to action
- A concise product overview that frames Trackly as one workspace for academic life
- Feature highlights for timetable planning, tasks, habits, and insights
- A screenshot or product-preview section that makes the interface tangible
- Testimonial placeholders that can later host verified student stories
- An FAQ that answers common concerns about use, setup, privacy, and access
- A complete footer with product links, support information, and legal destinations
- Google Sign-In and email registration entry points

The page balances persuasion with transparency. Instead of making abstract claims about “getting more done,” it demonstrates what students can see and manage after signing in. Calls to action are repeated at natural decision points so a visitor can begin without searching for the next step.

### 4.2 Authentication and Onboarding

Authentication is built to get users from discovery to a personal workspace with minimal interruption. **Supabase Auth** provides managed identity handling, while the client application owns the onboarding flow and protected-route experience.

#### Authentication flow

1. A visitor chooses **Continue with Google**, **Sign up with email**, or **Sign in** from the landing page or authentication screen.
2. For Google OAuth, Supabase redirects the user to Google’s consent flow and returns them to a pre-approved application callback URL.
3. For email registration, the application validates the address and password, creates the account through Supabase, and—where email confirmation is enabled—guides the user to verify their address before full access.
4. For email sign-in, Supabase validates credentials and returns an authenticated session.
5. The client listens for authentication state changes, persists the session securely through Supabase’s supported browser storage mechanism, and redirects the user to the appropriate in-app destination.
6. Protected routes verify that a valid session exists before rendering application content. Unauthenticated visitors are redirected to sign-in with a safe return path.
7. Logging out clears the active Supabase session and local user-scoped UI state as appropriate, then returns the user to a public route.

**Security and experience considerations**

- OAuth redirect URLs are explicitly allowlisted in Supabase and deployment configuration.
- Return URLs are validated to avoid unsafe or open redirects.
- Passwords are handled by Supabase Auth rather than stored or processed directly by the app.
- Session restoration prevents users from needing to sign in again each time they refresh or reopen the browser.
- Friendly empty states and lightweight first-run prompts help new users create their first timetable item, task, or habit without a long setup wizard.

### 4.3 Dashboard: the Daily Command Center

The dashboard is the first authenticated destination and the most frequently visited view. Its job is not to show every record; it is to give students an immediate, calm understanding of their day and week.

The dashboard brings together:

- **Today’s classes and scheduled sessions**, ordered by time
- **Upcoming deadlines**, with urgency made visible before work becomes overdue
- **Pending tasks**, particularly high-priority and near-due items
- **Completed-task summaries**, offering a clear sense of momentum
- **Habit progress**, such as today’s completed routines and current consistency
- **Productivity summaries**, presented through concise cards and focused charts

Summary cards provide quick scanning, while charts are deliberately limited to insights that prompt a decision. A student might notice that high-priority work is accumulating, that a subject has received less attention, or that habits dip on certain days. The interface avoids overwhelming the user by placing detailed management actions in their dedicated views.

### 4.4 Timetable Planner

The timetable planner provides a visual weekly map of academic commitments. Students can add and review recurring classes, one-off events, study sessions, revision blocks, and personal commitments in a format that reflects how a week actually unfolds.

**Capabilities**

- Weekly timetable with day and time positioning
- Academic class scheduling by subject or category
- Dedicated study-session blocks for intentional preparation
- Personal events and reminders that affect availability
- Clear time organization through consistent labels, colors, and duration

A timetable is more useful than a list for academic planning because it reveals constraints. Students can identify open study windows, spot overloaded days, plan around classes, and protect time for rest. Trackly makes that visual planning accessible without requiring a complex calendar workflow.

### 4.5 Task Manager

The task manager gives assignments and personal academic work the structure needed to move from “I should do this” to “I know what comes next.” It supports both a quick capture workflow and deeper organization when needed.

**Task information can include**

- Title and optional description
- Subject, course, or custom category
- Assignment or homework classification
- Due date and deadline status
- Priority level
- Completion and progress state
- Creation and completion timestamps for reporting

Students can filter or group work by urgency, category, priority, and status. This makes it easy to shift from a broad workload view to a focused next-action list. In practice, Trackly helps students protect attention: assignments with closer deadlines and higher importance are visible first, while completed tasks leave the active workflow instead of adding noise.

### 4.6 Habit Tracker

Academic outcomes are supported by repeatable routines, not just deadline management. Trackly’s habit tracker makes those routines visible and easy to maintain through small, daily check-ins.

Examples include:

- Daily study sessions
- Reading or revision
- Exercise and movement
- Drinking water
- Maintaining a consistent sleep schedule
- Class attendance

Each habit can be tracked over time, with completion history and visual progress. Rather than presenting habit tracking as a rigid streak counter, Trackly emphasizes continuity and reflection. Students can see which routines are becoming dependable, recognize when a schedule is unrealistic, and make small adjustments that support long-term academic well-being.

### 4.7 Productivity Analytics

Analytics transform routine activity into useful reflection. Trackly’s charts are designed to answer practical questions—not to create vanity metrics.

| Insight                     | What it shows                                     | Planning value                                                                      |
| --------------------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Completed vs. pending tasks | Current workload and execution progress           | Helps identify whether work is accumulating faster than it is finished.             |
| Weekly productivity         | Completed work across the week                    | Reveals productive periods and weeks that may need earlier planning.                |
| Habit completion            | Consistency across selected habits                | Highlights routines that support or disrupt focus.                                  |
| Subject distribution        | Work allocation by subject or category            | Helps students avoid unintentionally neglecting a course.                           |
| Priority breakdown          | Mix of high, medium, and low-priority work        | Indicates whether important work is being addressed early enough.                   |
| Progress over time          | Trends in tasks and habits across a longer period | Encourages reflection on sustainable improvement rather than a single day’s output. |

Charts use readable labels, clear legends, and responsive layouts. They complement, rather than replace, the student’s judgment. A learner can use a weak habit-completion week as a cue to simplify their plan, or use an uneven subject distribution to schedule focused study blocks.

### 4.8 Settings and Personalization

Settings provide control without overcomplicating the main workflow. Available options can include:

- **Theme preferences:** light, dark, or system-aware display settings
- **Account management:** profile details, email, connected Google identity, and sign-out controls
- **Notification preferences:** reminder and deadline settings as notification capabilities are enabled
- **Data management:** local data controls, export or reset options, and clear explanations of storage behavior
- **Personalization:** preferred week start, display conventions, categories, and dashboard preferences

Preferences should be applied consistently and persisted so the workspace feels personal on every return visit.

---

## 5. End-to-End User Journey

1. **Discover** — A student reaches the landing page from a portfolio, referral, search result, or social link. The page explains how Trackly replaces scattered academic planning tools.
2. **Create an account** — The student signs up with Google or email. Session persistence means this is a one-time friction point rather than a repeated barrier.
3. **Set up the week** — The student adds classes, regular study windows, and key events to the timetable. The week becomes visible as a usable plan.
4. **Capture commitments** — Assignments, homework, and personal tasks are created with due dates, subjects, and priorities.
5. **Build supportive routines** — The student adds a small set of habits, such as a daily revision block or a sleep target, and checks them off as they happen.
6. **Use the dashboard daily** — A quick visit shows what is scheduled, what needs attention, and how current habits are progressing.
7. **Review and adjust** — Analytics reveal patterns across tasks, subjects, and habits. The student uses those insights to rebalance the following week.

The journey is deliberately incremental. Trackly offers value after a student adds only a few items, then becomes more useful as the timetable, task history, and habit data grow. Every frequent interaction is kept lightweight, responsive, and encouraging.

---

## 6. Technology Stack and Rationale

| Layer            | Technology                     | Role and rationale                                                                                                                                                                                                                                         |
| ---------------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Frontend         | **React 19**                   | Provides a mature component model for interactive, stateful interfaces. React’s ecosystem, concurrent rendering capabilities, and reusable composition patterns support a responsive product that can grow without duplicating UI logic.                   |
| Language         | **TypeScript**                 | Adds static typing to data models, component props, service contracts, and state. This reduces integration errors, makes refactoring safer, and gives contributors stronger editor support.                                                                |
| Build tool       | **Vite**                       | Delivers fast local development through native ES modules and efficient hot updates, then produces optimized production bundles. Its straightforward configuration supports a clean developer experience.                                                  |
| Routing          | **Wouter**                     | A lightweight client-side router well suited to a focused single-page application. It supports public, authentication, and protected application routes without the overhead of a larger routing framework.                                                |
| Styling          | **Tailwind CSS**               | Enables a consistent design system through composable utility classes. It speeds implementation, makes responsive states explicit, and helps keep styling close to the components that use it.                                                             |
| UI components    | **shadcn/ui** and **Radix UI** | Radix supplies accessible, behaviorally robust primitives such as dialogs, menus, and tabs. shadcn/ui provides editable, project-owned component patterns built on those primitives, preserving design flexibility and avoiding a rigid black-box library. |
| Client state     | **Zustand**                    | Offers small, explicit stores for shared client state with minimal boilerplate. It is appropriate for dashboard filters, UI preferences, feature state, and persistence coordination without making simple updates difficult to trace.                     |
| Visualization    | **Recharts**                   | Supplies composable React chart components for dashboard and analytics views. It enables responsive, maintainable visualizations without building SVG chart behavior from scratch.                                                                         |
| Authentication   | **Supabase Auth**              | Manages secure email/password and Google OAuth authentication, session handling, and provider integration. It reduces custom security surface area while preserving a smooth client-side experience.                                                       |
| Persistence      | **Browser Local Storage**      | Stores MVP-era user-created planner data and selected preferences locally for immediate access and a low-complexity first release. It is paired with clear user expectations and designed for later migration.                                             |
| API/server layer | **Express.js**                 | Provides an optional, familiar Node.js service layer for custom API endpoints, integrations, validation, or server-side workflows that should not live in the browser.                                                                                     |
| Managed backend  | **Supabase**                   | Provides the managed authentication foundation and can later host PostgreSQL-backed cloud data, row-level security, storage, and server-side functions.                                                                                                    |
| Deployment       | **Netlify**                    | Offers CDN-backed static delivery, preview deployments, environment-variable management, HTTPS, and straightforward continuous deployment for the Vite frontend.                                                                                           |

---

## 7. Application Architecture

Trackly follows a modular, feature-aware frontend architecture. The design prioritizes separation of concerns: screens compose features, features use reusable UI, shared state lives in focused stores, and external integrations are accessed through service modules rather than scattered direct calls.

### Architectural layers

```text
Presentation (pages, layouts, components)
              ↓
Feature logic (hooks, view models, validation)
              ↓
Shared state (Zustand stores and contexts)
              ↓
Services (Supabase Auth, local persistence, API clients)
              ↓
Persistence and platform services (Local Storage, Supabase, Express endpoints)
```

### Key design decisions

- **Component-based composition:** Pages are assembled from small, focused components such as summary cards, timetable entries, task rows, habit check-ins, and chart containers. This improves consistency and makes individual pieces easy to test or reuse.
- **Separation of domain and presentation logic:** Components should focus on rendering and interactions; hooks, stores, and services own fetching, transformations, persistence, and side effects.
- **Feature-oriented boundaries:** Task, timetable, habit, analytics, and authentication logic can evolve independently while sharing stable primitives and data types.
- **Centralized shared state:** Zustand stores make cross-page state explicit and avoid excessive prop drilling. Persisted state is versioned or migrated where required to prevent data-shape regressions.
- **Authentication boundary:** An auth provider or dedicated auth store observes Supabase session changes. Route guards consume that single source of truth rather than implementing authentication checks independently on each page.
- **Shared layouts:** Public and authenticated sections use their own layouts. The authenticated layout centrally manages navigation, responsive shell behavior, and global feedback surfaces such as toasts or dialogs.
- **Utility and service modules:** Date calculations, priority mapping, chart transformations, local-storage adapters, and Supabase calls remain isolated from views, making them simpler to verify and replace.

This structure keeps the MVP understandable while making future capabilities—cloud sync, notifications, or collaborative features—additive rather than disruptive.

---

## 8. Recommended Project Structure

```text
src/
├── pages/          # Route-level screens: landing, auth, dashboard, timetable, tasks, habits, analytics, settings
├── components/     # Reusable UI and composed feature components
│   ├── ui/          # Project-owned shadcn/ui primitives
│   └── shared/      # Navigation, empty states, cards, dialogs, form controls
├── layouts/         # Public and authenticated application shells
├── hooks/           # Reusable React hooks for auth, media queries, data actions, and derived behavior
├── stores/          # Zustand stores for planner data, preferences, and shared UI state
├── services/        # Supabase client, auth service, persistence adapters, and API clients
├── lib/             # Library configuration and low-level integrations
├── utils/           # Pure helpers: dates, formatting, sorting, validation, and analytics transformations
├── contexts/        # React contexts for narrowly scoped cross-tree concerns where context is appropriate
├── assets/          # Local static images, icons, fonts, and illustration resources
├── types/           # Shared TypeScript domain models and API contracts
├── App.tsx          # Route composition and top-level providers
└── main.tsx         # Application bootstrap
```

Supporting directories may include `server/` for the Express application, `netlify/functions/` for deployment-native serverless endpoints, and `public/` for static files that should bypass bundling.

This organization keeps route-level orchestration separate from reusable UI and isolates infrastructure-specific details. New contributors can quickly locate the feature they need without searching through a single oversized component directory.

---

## 9. Data Model and Persistence Strategy

### MVP persistence

For the MVP, planner data is stored in **browser Local Storage**. Tasks, timetable entries, habits, completion records, and preferences can be serialized through a dedicated persistence adapter and restored when the application loads. This provides instant perceived performance, works without a custom database schema, and keeps early operating complexity low.

Local Storage is appropriate at this stage because it enables rapid validation of the planning workflow before introducing full synchronization, conflict handling, access policies, and database operations. Its limitations are made explicit: data is tied to a browser and device, can be cleared by the user, and is not a substitute for an encrypted cloud backup.

### Authentication and session persistence

Supabase Auth persists an authenticated session using its supported client persistence strategy. The application listens for session updates rather than treating a one-time sign-in response as permanent truth. This supports refreshes, browser restarts, token renewal, and clean logout behavior.

### Future cloud migration

The architecture should expose a repository or service interface for each data domain. The UI and feature hooks depend on that interface, not directly on Local Storage. A future cloud implementation can then write to Supabase PostgreSQL while preserving the same feature contracts.

A cloud phase would introduce:

- Per-user records linked to authenticated user IDs
- Supabase Row Level Security policies so users can access only their own data
- Secure server timestamps and data validation
- Migration of local records to a cloud account
- Sync status, conflict-resolution rules, and offline queuing where necessary

---

## 10. Routing, Security, and Access Control

Trackly uses Wouter to provide fast client-side navigation in a single-page application.

| Route area          | Example routes                                                             | Access behavior                                                             |
| ------------------- | -------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Public marketing    | `/`, `/faq`                                                                | Available to every visitor                                                  |
| Authentication      | `/sign-in`, `/sign-up`, `/auth/callback`                                   | Redirects signed-in users away from redundant auth screens when appropriate |
| Protected workspace | `/dashboard`, `/timetable`, `/tasks`, `/habits`, `/analytics`, `/settings` | Requires a restored, valid Supabase session before rendering                |

Protected-route components should show a brief loading state while session restoration is in progress, avoiding a flash of the wrong screen. Authentication failures redirect to sign-in safely; user-provided redirect targets are restricted to known internal application paths.

Client-side route protection improves the user experience but does not replace backend access control. When cloud data is enabled, Supabase Row Level Security and server-side authorization are the authority for protecting user records.

---

## 11. Deployment and Production Delivery

### Build and hosting flow

1. Vite compiles the React and TypeScript application into optimized static assets using `vite build`.
2. Netlify deploys the generated frontend directory to its global CDN, providing HTTPS, cache-friendly asset delivery, previews for pull requests, and continuous deployment from the chosen Git branch.
3. Netlify environment variables provide the browser-safe Supabase URL and public anonymous key at build time (for example, `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`). Secrets must never be committed to source control or included in client bundles.
4. A Netlify SPA rewrite rule sends non-asset application routes to `index.html`, allowing Wouter to resolve routes on refresh or direct navigation.

Example redirect configuration:

```text
/*  /index.html  200
```

### Express deployment note

A traditional, continuously running **Express.js** server is not hosted as a standard static Netlify deployment. Trackly supports two production-ready patterns:

- **Frontend-first MVP:** Deploy the Vite application on Netlify and use Supabase directly for authentication and managed backend capabilities.
- **Custom backend services:** Deploy Express independently on a Node-compatible host, or package small endpoint handlers as Netlify Functions. The frontend communicates with these endpoints through environment-configured URLs.

This distinction prevents deployment assumptions from becoming an operational issue. If Express is used for custom integrations or protected server workflows, it should be deployed in an environment designed for long-running Node services, or its individual operations should be adapted to serverless functions.

### Production readiness checks

- Configure Supabase site URL and approved OAuth redirect URLs for production and previews.
- Use separate development, preview, and production environment values.
- Validate build output with a clean production build before release.
- Test direct navigation to protected and nested SPA routes.
- Configure HTTP security headers and a content-security policy appropriate to the deployment.
- Add error monitoring and privacy-conscious product analytics before broad release.

---

## 12. Performance, Accessibility, and Compatibility

Trackly’s product promise depends on responsiveness. Planning should feel quicker than switching to a notebook or a separate app.

### Performance considerations

- **Fast initial load:** Vite produces minified, code-split production assets; assets should be compressed and sized appropriately.
- **Route and feature lazy loading:** Less frequently opened views—such as analytics or settings—can be loaded on demand to protect initial dashboard performance.
- **Efficient state updates:** Zustand selectors should subscribe components only to the state they need, reducing avoidable renders.
- **Optimized React rendering:** Stable list keys, memoization where profiling justifies it, and derived data calculated outside repeated render paths keep data-heavy screens responsive.
- **Local-first reads:** Local Storage allows immediate planner data restoration for the MVP, while future sync can occur asynchronously.
- **Responsive design:** Tailwind breakpoints and mobile-aware layouts ensure schedule views, charts, filters, and forms remain usable on narrow screens.

### Accessibility standards

- Semantic HTML, correctly associated labels, and meaningful headings
- Keyboard navigation for menus, dialogs, forms, and interactive charts where applicable
- Focus states that are visible and consistent
- Sufficient contrast without relying on color alone for priority or status
- Screen-reader-friendly names and descriptions for controls
- Radix UI primitives for accessible interaction behavior

The target baseline is modern evergreen browsers: current Chrome, Edge, Firefox, and Safari, with responsive verification on common desktop and mobile viewport sizes.

---

## 13. Future Roadmap

Trackly’s current architecture supports an intentional roadmap without requiring a rewrite.

| Opportunity              | Value to students                                                               | Architectural path                                                                                     |
| ------------------------ | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Calendar synchronization | Keeps academic plans aligned with Google Calendar, Outlook, or device calendars | Add integration services and secure OAuth scopes behind the existing timetable domain.                 |
| Push notifications       | Helps users act before deadlines and maintain habits                            | Add notification preferences, scheduled backend jobs, and web-push/service-worker support.             |
| AI study planner         | Turns workload and availability into suggested study plans                      | Introduce an opt-in planning service with transparent inputs, recommendations, and user approval.      |
| Smart scheduling         | Finds realistic study blocks around classes and deadlines                       | Extend timetable and task models with duration, availability, and scheduling constraints.              |
| Cloud synchronization    | Safely makes data available across devices                                      | Replace the local repository implementation with Supabase-backed, user-scoped data services.           |
| Mobile application       | Supports fast check-ins and on-the-go planning                                  | Reuse shared domain contracts and design system concepts in React Native or a dedicated mobile client. |
| File attachments         | Keeps assignment briefs and reference files linked to work                      | Use Supabase Storage with user-scoped policies and task-level attachment metadata.                     |
| Collaboration            | Supports study groups, shared plans, or accountability partners                 | Add workspace and membership models, roles, invitations, and explicit sharing permissions.             |
| Advanced insights        | Offers deeper workload, focus, and trend analysis                               | Expand event history and analytics transformation services without changing core screens.              |
| Offline support (PWA)    | Makes essential planning reliable with unstable connectivity                    | Add a web app manifest, service worker, caching strategy, and a sync queue.                            |

The most important constraint in future development is to preserve Trackly’s calmness. New capabilities should be introduced as optional, discoverable layers—not as permanent complexity in the daily workflow.

---

## 14. Why Trackly Matters

Trackly addresses a practical student problem: academic life becomes harder when planning systems are fragmented. By placing schedules, tasks, routines, and reflection in one focused workspace, the product reduces the cognitive overhead of staying organized.

The project also demonstrates more than a collection of frontend screens. It reflects a complete product approach:

- A clearly defined audience and problem space
- A user journey that moves from first visit to daily habit
- Thoughtful information hierarchy and accessible interface patterns
- Modern React, TypeScript, and Vite implementation practices
- Maintainable architecture with reusable components and isolated services
- Secure, low-friction authentication through Supabase
- A practical MVP persistence model with a credible path to cloud scale
- Production-aware deployment, performance, and routing considerations

Trackly is designed to be useful immediately and capable of growing deliberately. Its core experience remains simple—**plan the week, track the work, build routines, and understand progress**—while its technical foundation is ready for the integrations and intelligence of a complete academic productivity platform.

---

## 15. Project Snapshot

| Item                  | Summary                                                                                                                 |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **Name**              | Trackly                                                                                                                 |
| **Tagline**           | Plan • Track • Achieve                                                                                                  |
| **Category**          | Student productivity and academic planning platform                                                                     |
| **Primary platform**  | Responsive web application                                                                                              |
| **Core stack**        | React 19, TypeScript, Vite, Wouter, Tailwind CSS, shadcn/ui, Radix UI, Zustand, Recharts, Supabase, Express.js, Netlify |
| **Primary value**     | One clear workspace for schedules, coursework, habits, and productivity insights                                        |
| **MVP data strategy** | Browser Local Storage with Supabase authentication persistence                                                          |
| **Scale path**        | Supabase cloud data, secure per-user access, integrations, PWA support, mobile, and collaboration                       |

**Trackly — Plan • Track • Achieve.**
