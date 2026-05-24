# Project Non-Technical Requirements

## What is this project?

Employee Hub is a web-based workforce management platform built for a growing startup that wants to eliminate Excel sheets and manual tracking. Instead of managers juggling spreadsheets to assign work, track progress, and manage teams, Employee Hub gives everyone a single dashboard where projects, tasks, and team communication live together in real time.

## Why are we doing this?

The startup currently relies on Excel sheets to manage employees, assign work, and track progress. This approach breaks down as the team grows — sheets get out of sync, there's no real-time visibility into who is working on what, progress updates require manual follow-ups, and there's no central place for project documents or team communication. The goal is to replace ad-hoc spreadsheets with a structured platform that gives everyone — from admins to developers to social media managers — the right level of access and visibility without the overhead of manual updates.

## Who will use the platform?

**Admin** — Full control over the entire system. Manages employees, creates tags, defines permissions, oversees all projects. Can see everything and do everything.

**Managers** — Oversee projects and teams. Assign employees to project groups, create projects, monitor token/task progress, review work. Different managers may have different levels of access depending on their tags (e.g. a social media manager might only see marketing projects while a tech manager sees engineering projects).

**Employees/Developers** — Assigned to project groups. View project requirements and documents, raise tokens (issues/tasks), pick up available tokens to work on them, mark their work complete. They see only the projects they are assigned to.

**Top Management** — View-only access across all projects. Can see who is working on what, track overall progress, and generate reports without needing to dig through Excel sheets or ask managers for updates.

## Key requirements in simple terms

1. **Employee registration** — Every employee has an account with their name, email or phone, and password.

2. **Tag system (like Discord roles)** — Each employee can have multiple tags (e.g. #admin, #manager, #developer, #social-media). Tags control what a person can see and do. A social media manager with the #manager tag should not automatically see engineering projects — tags must have granular permission controls per resource.

3. **Project groups** — Managers and admins create projects and assign employees to them. Each project group has its own members with specific roles (manager, member, viewer). Top management can see all groups; regular employees only see the groups they are part of.

4. **Requirements and documents via links** — When a project is created, managers attach requirements, specification docs, and reference materials. These are shared as external links (Google Drive, Google Docs, etc.) — no files are stored in the platform's database to keep things lightweight and avoid storage bloat.

5. **Token/task system** — Think of tokens like sticky notes on a board. Anyone in a project group can raise a token describing an issue, a task, or something that needs to be done. Any other team member can click a "+" button on that token to pick it up and start working on it. The moment they pick it up, the system logs the start time. When they finish, they mark it done and the system logs the completion time. This gives full visibility into who did what and how long it took.

6. **Project communication** — Each project has a discussion thread where team members can post messages, share updates, and ask questions without leaving the platform.

7. **Role-based visibility** — Not everyone sees everything. A person's tags determine which menu items, pages, and buttons are visible to them. An employee should not see the admin panel. A social media manager should not see engineering projects. A manager should be able to see their team's progress but may not be able to delete projects.
