# Employee Hub

A startup workforce management platform that replaces Excel sheets for tracking work and progress. Built with tag-based access control (Discord-style roles), project groups, and a Kanban-style token/task system.

## Tech Stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS v4
- **UI Library**: shadcn/ui (Radix primitives)
- **Database**: PostgreSQL (via Supabase)
- **Auth**: Supabase Auth (email + password / phone + password)
- **ORM**: Prisma

---

## Authentication

| Page | Description |
|---|---|
| `/login` | Login with email **OR** phone + password |
| `/register` | New user registration with email/phone + password |

- Users can authenticate using either their email or phone number combined with a password
- Supabase Auth handles session management
- Protected routes redirect to `/login` when unauthenticated

---

## Database Schema

### `users`

| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| email | text | Unique, nullable |
| phone | text | Unique, nullable |
| password_hash | text | |
| name | text | Display name |
| avatar_url | text | Profile image |
| is_active | boolean | Soft disable |
| created_at | timestamptz | |
| updated_at | timestamptz | |

At least one of email or phone is required.

### `tags`

| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| name | text | Unique, e.g. "admin", "manager", "developer" |
| description | text | |
| color | text | Hex color code for display badges |
| is_system | boolean | System tags cannot be deleted |
| created_at | timestamptz | |

### `user_tags`

| Column | Type | Notes |
|---|---|---|
| user_id | UUID | FK → users.id |
| tag_id | UUID | FK → tags.id |

Many-to-many. A user can have multiple tags.

### `permissions`

| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| tag_id | UUID | FK → tags.id |
| resource | text | e.g. "project", "task", "report", "employee", "settings" |
| can_view | boolean | |
| can_create | boolean | |
| can_edit | boolean | |
| can_delete | boolean | |
| can_assign | boolean | Special: can assign users to projects/tokens |

Each tag defines granular access per resource. A user's effective permissions = union of all their tags.

### `projects`

| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| name | text | |
| description | text | |
| status | text | planning / active / completed / archived |
| created_by | UUID | FK → users.id |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### `project_members`

| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| project_id | UUID | FK → projects.id |
| user_id | UUID | FK → users.id |
| role | text | manager / member / viewer |
| assigned_at | timestamptz | |

### `requirements`

| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| project_id | UUID | FK → projects.id |
| title | text | |
| description | text | |
| link | text | External URL (Google Drive, Google Docs, etc.) |
| created_by | UUID | FK → users.id |
| created_at | timestamptz | |

**No file storage.** All documents are referenced via external links.

### `messages`

| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| project_id | UUID | FK → projects.id |
| user_id | UUID | FK → users.id |
| content | text | |
| created_at | timestamptz | |

Project-level discussion/chat thread.

### `tokens`

| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| project_id | UUID | FK → projects.id |
| title | text | |
| description | text | |
| status | text | open / in_progress / done / cancelled |
| priority | text | low / medium / high / urgent |
| raised_by | UUID | FK → users.id (creator) |
| assigned_to | UUID | FK → users.id, nullable |
| started_at | timestamptz | Set when picked up |
| completed_at | timestamptz | Set when done |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### `token_links`

| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| token_id | UUID | FK → tokens.id |
| title | text | |
| url | text | External links related to the token |

---

## Pages / Routes

| Route | Access | Description |
|---|---|---|
| `/login` | Public | Email or phone + password login |
| `/register` | Public | Registration form |
| `/dashboard` | Auth | Overview: my projects, my assigned tokens, activity |
| `/projects` | Auth+Perm | Project listing (filtered by permissions) |
| `/projects/[id]` | Auth+Perm | Project detail with tabs |
| `/projects/[id]/board` | Auth+Perm | Kanban board for project tokens |
| `/projects/[id]/requirements` | Auth+Perm | External docs/links for the project |
| `/projects/[id]/members` | Auth+Perm | Manage project team members |
| `/projects/[id]/discussion` | Auth+Perm | Project chat/messages |
| `/employees` | Auth+Perm | Employee directory |
| `/employees/[id]` | Auth+Perm | Employee profile + tag badges |
| `/admin/tags` | Admin | Tag CRUD |
| `/admin/permissions` | Admin | Permission matrix editor |
| `/settings` | Auth | User profile settings |

---

## API Routes

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Login (email or phone + password) |
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/users` | List employees |
| GET | `/api/users/[id]` | Employee profile |
| PUT | `/api/users/[id]` | Update employee |
| GET/POST | `/api/tags` | List / Create tags |
| PUT/DELETE | `/api/tags/[id]` | Update / Delete tags |
| POST | `/api/users/[id]/tags` | Assign tags to user |
| DELETE | `/api/users/[id]/tags/[tagId]` | Remove tag from user |
| GET/POST | `/api/permissions` | List / Create permissions |
| PUT | `/api/permissions/[id]` | Update permission |
| GET/POST | `/api/projects` | List / Create projects |
| GET/PUT/DELETE | `/api/projects/[id]` | Get / Update / Delete project |
| GET/POST | `/api/projects/[id]/members` | List / Add members |
| DELETE | `/api/projects/[id]/members/[userId]` | Remove member |
| GET/POST | `/api/projects/[id]/requirements` | List / Add requirements |
| PUT/DELETE | `/api/projects/[id]/requirements/[reqId]` | Update / Delete requirement |
| GET/POST | `/api/projects/[id]/messages` | List / Send messages |
| GET/POST | `/api/projects/[id]/tokens` | List / Create tokens |
| PUT/DELETE | `/api/tokens/[id]` | Update / Delete token |
| POST | `/api/tokens/[id]/assign` | Pick up token (+ button) — sets assigned_to + started_at |
| POST | `/api/tokens/[id]/complete` | Mark token done — sets completed_at |
| GET/POST | `/api/tokens/[id]/links` | List / Add links to a token |

---

## Tag-Based Access Control

Tags work like Discord roles. Each tag has fine-grained permissions per resource.

**Example tag setup:**
- **#admin** — full access to all resources
- **#manager** — can view all projects, assign members, view reports
- **#developer** — can view assigned projects, raise tokens, pick up tokens
- **#social-media** — can only view specific resources (e.g. marketing projects only)
- **#viewer** — read-only on visible projects

**Permission matrix per tag:**

```
Tag: manager
┌──────────┬──────┬────────┬──────┬────────┬───────────┐
│ Resource │ View │ Create │ Edit │ Delete │ Assign    │
├──────────┼──────┼────────┼──────┼────────┼───────────┤
│ project  │  ✓   │   ✓    │  ✓   │   ✗    │    ✓      │
│ task     │  ✓   │   ✓    │  ✓   │   ✓    │    ✓      │
│ employee │  ✓   │   ✗    │  ✗   │   ✗    │    ✗      │
│ report   │  ✓   │   ✓    │  ✗   │   ✗    │    ✗      │
│ settings │  ✗   │   ✗    │  ✗   │   ✗    │    ✗      │
└──────────┴──────┴────────┴──────┴────────┴───────────┘
```

---

## Token Workflow (Kanban)

```
[Open] ──(+)──> [In Progress] ──(✓)──> [Done]
                  │
                  └──(x)──> [Cancelled]
```

1. Any project member raises a token → status = `open`, priority set, optional links
2. Any project member clicks "+" on an open token → instantly assigns to them, status → `in_progress`, `started_at` = now
3. Member works on the token, can attach external links for reference
4. Member clicks "Complete" → status → `done`, `completed_at` = now
5. Tokens can be cancelled at any time

The Kanban board displays three columns: **Open | In Progress | Done**

---

## Layout

```
┌─────────┬────────────────────────────────────┐
│         │                                    │
│ Sidebar │        Main Content Area           │
│         │                                    │
│ ─────── │                                    │
│ Dashboard│                                    │
│ Projects│                                    │
│ Employees│                                    │
│ Tags    │                                    │
│ Settings│                                    │
│         │                                    │
└─────────┴────────────────────────────────────┘
```

- **Sidebar**: Navigation links, project list, user avatar + logout
- **Top Bar**: Breadcrumbs, search, notification bell
- **Content**: Page content based on active route

---

## Implementation Phases

1. **Foundation** — Next.js setup, Supabase project, Prisma schema, shadcn/ui config
2. **Auth** — Login/register pages, protected routes
3. **Tags & Permissions** — Tag CRUD, permission matrix, tag assignment UI
4. **Employee Hub** — Employee directory and profiles
5. **Projects** — Project CRUD, member management, project detail page
6. **Requirements** — External link management per project
7. **Kanban Board** — Token CRUD, board columns, "+" pickup, completion
8. **Discussions** — Project chat/messages
9. **Dashboard & Polish** — Aggregated views, notifications, access control hardening
