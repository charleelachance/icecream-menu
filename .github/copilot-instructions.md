🍦 Ice Cream Menu Management App

1. Project Overview

This is a full-stack web application for managing a rotating daily ice cream menu.

The system allows:

Viewing today's menu

Editing today's menu

Editing previous menus

Managing flavor stock availability

Reusing flavor definitions across days

The architecture is:

Frontend: React (Vite)

Backend: Node.js + Express

Database: SQLite (better-sqlite3)

Frontend runs on:

http://localhost:5173

Backend runs on:

http://localhost:3001

2. Project Structure
   icecream-menu/
   ├── backend/
   │ ├── db.js
   │ ├── init.js
   │ ├── seed.js
   │ ├── server.js
   │ └── icecream.db
   ├── frontend/
   │ ├── src/
   │ │ ├── api.js
   │ │ ├── App.jsx
   │ │ ├── main.jsx
   │ │ ├── pages/
   │ │ │ ├── MenuPage.jsx
   │ │ │ └── EditMenuPage.jsx
   │ │ └── components/
   │ │ ├── WorkingMenu.jsx
   │ │ ├── FlavorLibrary.jsx
   │ │ └── FlavorItem.jsx
   └── package.json

We are using a single root package.json.

3. Database Schema
   flavors

Stores reusable flavor definitions.

CREATE TABLE flavors (
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL,
description TEXT,
price REAL,
in_stock INTEGER NOT NULL DEFAULT 1,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

daily_menus

Represents a menu for a specific date.

CREATE TABLE daily_menus (
id INTEGER PRIMARY KEY AUTOINCREMENT,
date TEXT NOT NULL UNIQUE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

Date format is:

YYYY-MM-DD

daily_menu_flavors

Join table between menus and flavors.

CREATE TABLE daily_menu_flavors (
id INTEGER PRIMARY KEY AUTOINCREMENT,
menu_id INTEGER NOT NULL,
flavor_id INTEGER NOT NULL,
FOREIGN KEY (menu_id) REFERENCES daily_menus(id) ON DELETE CASCADE,
FOREIGN KEY (flavor_id) REFERENCES flavors(id),
UNIQUE(menu_id, flavor_id)
);

4. Backend API Contract

All API responses are JSON.

GET /flavors

Returns all flavors.

Response:

[
{
"id": 1,
"name": "Vanilla",
"description": "Classic creamy",
"price": 3.5,
"in_stock": 1
}
]

PATCH /flavors/:id

Updates stock status.

Body:

{
"in_stock": 0
}

GET /menus/:date

Returns menu for date.

If menu does not exist:

{
"date": "2026-02-17",
"flavors": []
}

If exists:

{
"date": "2026-02-17",
"flavors": [ ...flavor objects... ]
}

PUT /menus/:date

Creates or replaces a menu.

Body:

{
"flavorIds": [1,2,3]
}

Behavior:

Deduplicates IDs

Validates IDs exist

Creates menu if missing

Replaces previous menu entries

Uses transaction

5. Frontend Architecture

We use:

React functional components

Hooks (useState, useEffect)

Axios for API

React Router

src/api.js

Contains all backend calls.

No direct axios calls inside components.

Page Responsibilities
MenuPage.jsx

Displays today’s menu

Read-only display

EditMenuPage.jsx

Two-panel layout:

Left:

Working menu (selected flavors)

Right:

Flavor library (all flavors)

Features:

Add flavor to menu

Remove flavor from menu

Search flavors

Save changes

Component Responsibilities
WorkingMenu.jsx

Displays selected flavors

Remove button per item

FlavorLibrary.jsx

Displays all flavors

Search input

Add button per flavor

Out-of-stock indicator

FlavorItem.jsx

Reusable UI for flavor row.

6. Business Rules

A flavor exists independently of a menu.

A flavor can appear in multiple menus.

A menu belongs to exactly one date.

A menu is fully replaced on update.

Duplicate flavors are not allowed in a menu.

Out-of-stock flavors can still appear in historical menus.

7. Implementation Plan
   Phase 1 – Basic Display

Fetch flavors

Fetch today’s menu

Display both

Phase 2 – Edit Menu

Create EditMenuPage

Load menu by date

Add/remove functionality

Submit PUT request

Show success feedback

Phase 3 – UX Improvements

Loading states

Error handling

Disable save while saving

Highlight unsaved changes

Phase 4 – Stock Management

Toggle stock from UI

Show out-of-stock indicator

Prevent adding out-of-stock flavors to future menus

8. Coding Standards

Use functional components only

No business logic inside JSX

Keep components small and focused

Extract reusable logic into hooks if needed

No direct database logic in frontend

API calls go through api.js only

9. Important Constraints for Copilot

When generating code:

Do NOT rewrite the backend contract.

Follow existing database schema.

Do NOT introduce Redux or heavy state libraries.

Keep implementation simple and readable.

Avoid premature abstraction.

Use minimal dependencies.

Prefer clarity over cleverness.

10. Development Commands

Backend:

node backend/server.js

Frontend:

cd frontend
npm run dev

11. Goal of This Project

This is a technical prototype demonstrating:

Full-stack integration

Clean architecture

Proper data modeling

REST API design

Transaction handling

React component structure

The priority is correctness and clarity over visual polish.

---

Company Project Background & Expectations (Interview Context)

A local ice cream shop has thousands of flavor recipes. Each day they serve a rotating selection and someone manually updates their website every morning — takes about 15 minutes of hand-typing. The owner wants this to not be so much of a pain point.

Some additional context from the staff: The current system does a poor job of remembering what flavors were displayed yesterday, so clerks are essentially starting from scratch each day. They'd love to at least start from yesterday's list. The system also doesn't know which flavors are currently available in the store, so clerks have to manually check before posting anything.

Try to build something that actually works - but failure is an option! Doesn't need to be deployed or pretty and flavor names can be fake or generated — don't spend time on the data, spend it on the problem. Don't spend more than a few hours — we're not looking for polished, we're looking for how you think.

We'd suggest treating this as a prototype — something like SQLite + Node + React could represent a stack that is easy to scaffold, but use whatever you're comfortable with.

There's no single right answer... and have fun with it if you want!

As always -- use whatever you want. AI, Google, friends, Stack Overflow. We assume you'll use AI. We do.

When you're done, let us know and we'll schedule a time for you to walk us through what you did and why.
