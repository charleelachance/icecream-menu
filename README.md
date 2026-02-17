# 🍦 Ice Cream Menu Management System

A full-stack web application for managing a rotating daily ice cream menu. Built as a technical prototype to solve the real-world problem of manually updating ice cream shop menus every day.

## Problem Statement

A local ice cream shop with thousands of flavor recipes needs to update their website menu daily. The current manual process takes ~15 minutes and doesn't remember previous selections or track which flavors are currently available in the store. This application streamlines that workflow.

## Tech Stack

-   **Frontend**: React with Vite
-   **Backend**: Node.js + Express
-   **Database**: SQLite (better-sqlite3)
-   **Architecture**: RESTful API with transaction-based updates

## Features

### ✅ Implemented

-   View and edit today's menu
-   Reusable flavor library
-   Search/filter flavors by name
-   Track in-stock vs out-of-stock flavors
-   Sort flavors by:
    -   Alphabetical
    -   Most popular (times served)
    -   Least popular
-   Toggle flavor descriptions on/off
-   Historical menu tracking (2 weeks of seed data)
-   Pre-fill yesterday's menu when today's menu is blank
-   Responsive, centered layout
-   Transaction-safe database updates

### 🔄 Business Rules

-   Flavors exist independently and can be reused across multiple menus
-   Each menu belongs to exactly one date
-   Menus are fully replaced on update (idempotent)
-   Duplicate flavors are automatically deduplicated
-   Out-of-stock flavors can still appear in historical menus

## Project Structure

```
icecream-menu/
├── backend/
│   ├── server.js       # Express API server
│   ├── db.js          # SQLite database connection
│   ├── init.js        # Database schema initialization
│   └── seed.js        # Sample data seeding (100 flavors)
├── frontend/
│   ├── src/
│   │   ├── api.js                    # API client wrapper
│   │   ├── App.jsx                   # Main app with routing
│   │   ├── components/
│   │   │   ├── MenuPage.jsx          # Read-only menu view
│   │   │   ├── EditMenuPage.jsx      # Menu editor
│   │   │   ├── FlavorLibrary.jsx     # All flavors list
│   │   │   ├── WorkingMenu.jsx       # Selected flavors
│   │   │   └── FlavorItem.jsx        # Reusable flavor UI
│   │   └── index.css                 # Global styles
│   └── vite.config.js
└── package.json        # Root dependencies
```

## Database Schema

### `flavors`

Reusable flavor definitions

```sql
CREATE TABLE flavors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  price REAL,
  in_stock INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### `daily_menus`

Menu for a specific date

```sql
CREATE TABLE daily_menus (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL UNIQUE,  -- Format: YYYY-MM-DD
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### `daily_menu_flavors`

Join table (many-to-many)

```sql
CREATE TABLE daily_menu_flavors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  menu_id INTEGER NOT NULL,
  flavor_id INTEGER NOT NULL,
  FOREIGN KEY (menu_id) REFERENCES daily_menus(id) ON DELETE CASCADE,
  FOREIGN KEY (flavor_id) REFERENCES flavors(id),
  UNIQUE(menu_id, flavor_id)
);
```

## API Endpoints

### `GET /flavors?sort=<option>`

Returns all flavors with usage statistics

-   **Query params**: `sort` (optional) - `popularity` | `least_popular` | default (alphabetical)
-   **Response**: Array of flavor objects with `times_served` count

### `PATCH /flavors/:id`

Update flavor stock status

-   **Body**: `{ "in_stock": 0 | 1 }`

### `GET /menus/:date`

Get menu for a specific date

-   **Response**: `{ date, flavors: [...] }` or `{ date, flavors: [] }` if not found

### `PUT /menus/:date`

Create or replace menu for a date

-   **Body**: `{ "flavorIds": [1, 2, 3] }`
-   **Validates**: IDs exist, deduplicates, uses transaction

## Getting Started

### Prerequisites

-   Node.js (v14 or higher)
-   npm or yarn

### Installation & Setup

1. **Clone and navigate to project**

    ```bash
    cd icecream-menu
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Initialize the database**

    ```bash
    node backend/init.js
    ```

4. **Seed sample data (100 flavors)**
    ```bash
    node backend/seed.js
    ```

### Running the Application

You'll need **two terminal windows**:

**Terminal 1 - Backend Server**

```bash
node backend/server.js
```

Server runs on: `http://localhost:3001`

**Terminal 2 - Frontend Dev Server**

```bash
cd frontend
npm run dev
```

Frontend runs on: `http://localhost:5173`

### Using the App

1. **View Today's Menu**: Navigate to the home page (`/`)
2. **Edit Menu**: Click "Edit Today's Menu" or go to `/edit/:date`
    - Search for flavors in the right panel
    - Click "+" to add flavors to the menu
    - Click "×" to remove flavors from the menu
    - Sort by popularity to see most/least used flavors
    - Toggle descriptions on/off for better readability
    - Click "Save Menu" when done

### Demo



https://github.com/user-attachments/assets/09c5b554-117f-42c2-af59-e6e6abb5f080



