const db = require('./db');

// Create flavors table
db.exec(`
  CREATE TABLE IF NOT EXISTS flavors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL,
    in_stock INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);

// Create daily_menus table
db.exec(`
  CREATE TABLE IF NOT EXISTS daily_menus (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);

// Create daily_menu_flavors join table
db.exec(`
  CREATE TABLE IF NOT EXISTS daily_menu_flavors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    menu_id INTEGER NOT NULL,
    flavor_id INTEGER NOT NULL,
    FOREIGN KEY (menu_id) REFERENCES daily_menus(id) ON DELETE CASCADE,
    FOREIGN KEY (flavor_id) REFERENCES flavors(id),
    UNIQUE(menu_id, flavor_id)
  );
`);

console.log('Database initialized!');