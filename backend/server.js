const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// GET /flavors
app.get('/flavors', (req, res) => {
    const { sort } = req.query;

    let orderClause = 'ORDER BY f.name ASC';

    if (sort === 'popularity') {
        orderClause = 'ORDER BY times_served DESC';
    }

    if (sort === 'least_popular') {
        orderClause = 'ORDER BY times_served ASC';
    }

    const flavors = db.prepare(`
    SELECT 
      f.*,
      COUNT(dmf.id) as times_served
    FROM flavors f
    LEFT JOIN daily_menu_flavors dmf 
      ON f.id = dmf.flavor_id
    GROUP BY f.id
    ${orderClause}
  `).all();

    res.json(flavors);
});

// PATCH /flavors/:id
app.patch('/flavors/:id', (req, res) => {
    const { id } = req.params;
    const { in_stock } = req.body;

    const stmt = db.prepare('UPDATE flavors SET in_stock = ? WHERE id = ?');
    stmt.run(in_stock ? 1 : 0, id);

    res.json({ success: true });
});

// GET /menus/:date
app.get('/menus/:date', (req, res) => {
    const { date } = req.params;

    // Find menu by date
    const menu = db.prepare('SELECT * FROM daily_menus WHERE date = ?').get(date);

    if (!menu) {
        // Return empty menu object if not found (simpler for prototype)
        return res.json({ date, flavors: [] });
    }

    // Get all flavors for this menu
    const flavors = db.prepare(`
      SELECT f.*
      FROM flavors f
      JOIN daily_menu_flavors dmf ON f.id = dmf.flavor_id
      WHERE dmf.menu_id = ?
    `).all(menu.id);

    res.json({ date: menu.date, flavors });
});

// PUT /menus/:date
app.put('/menus/:date', (req, res) => {
    const { date } = req.params;
    let { flavorIds } = req.body;

    if (!Array.isArray(flavorIds)) {
        return res.status(400).json({ error: 'flavorIds must be an array' });
    }

    // Deduplicate flavor IDs
    flavorIds = [...new Set(flavorIds)];

    // Validate flavor IDs exist
    const validFlavors = db
        .prepare('SELECT id FROM flavors WHERE id IN (' + flavorIds.map(() => '?').join(',') + ')')
        .all(...flavorIds)
        .map(f => f.id);

    const invalidFlavors = flavorIds.filter(id => !validFlavors.includes(id));
    if (invalidFlavors.length > 0) {
        return res.status(400).json({ error: 'Invalid flavor IDs', invalidFlavors });
    }

    const transaction = db.transaction((date, flavorIds) => {
        // Check if menu exists
        let menu = db.prepare('SELECT * FROM daily_menus WHERE date = ?').get(date);

        if (!menu) {
            // Create menu if not exists
            const result = db.prepare('INSERT INTO daily_menus (date) VALUES (?)').run(date);
            menu = { id: result.lastInsertRowid, date };
        } else {
            // Delete existing menu flavors
            db.prepare('DELETE FROM daily_menu_flavors WHERE menu_id = ?').run(menu.id);
        }

        // Insert new menu flavors
        const insertFlavor = db.prepare('INSERT INTO daily_menu_flavors (menu_id, flavor_id) VALUES (?, ?)');
        for (const flavorId of flavorIds) {
            insertFlavor.run(menu.id, flavorId);
        }

        return menu;
    });

    const menu = transaction(date, flavorIds);

    res.json({ success: true, menu, flavorIds });
});

app.listen(3001, () => {
    console.log('Server running on http://localhost:3001');
});
