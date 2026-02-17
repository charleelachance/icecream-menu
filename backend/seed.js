const db = require('./db');

db.prepare('DELETE FROM daily_menu_flavors').run(); // Remove all menu-flavor links first
db.prepare('DELETE FROM daily_menus').run();        // Remove all menus
db.prepare('DELETE FROM flavors').run();            // Now safe to clear flavors

const flavors = [
  { name: 'Vanilla', description: 'Classic creamy', price: 3.5, in_stock: 1 },
  { name: 'Chocolate', description: 'Rich and smooth', price: 3.5, in_stock: 1 },
  { name: 'Strawberry', description: 'Fresh strawberry', price: 3.5, in_stock: 1 },
  { name: 'Mint Chip', description: 'Minty with chocolate chips', price: 4, in_stock: 1 },
  { name: 'Cookie Dough', description: 'Chunks of cookie dough', price: 4, in_stock: 1 },
  { name: 'Pistachio', description: 'Nutty and green', price: 4, in_stock: 1 },
  { name: 'Rocky Road', description: 'Chocolate, marshmallow, almonds', price: 4, in_stock: 1 },
  { name: 'Butter Pecan', description: 'Buttery with roasted pecans', price: 4, in_stock: 1 },
  { name: 'Coffee', description: 'Bold coffee flavor', price: 3.5, in_stock: 1 },
  { name: 'Salted Caramel', description: 'Sweet and salty caramel', price: 4, in_stock: 1 },
  { name: 'Birthday Cake', description: 'Cake batter and sprinkles', price: 4, in_stock: 1 },
  { name: 'Cookies & Cream', description: 'Crushed cookies in vanilla', price: 4, in_stock: 1 },
  { name: 'Lemon Sorbet', description: 'Bright and tart', price: 3.5, in_stock: 1 },
  { name: 'Mango', description: 'Tropical mango', price: 3.5, in_stock: 1 },
  { name: 'Raspberry Ripple', description: 'Raspberry swirl', price: 3.5, in_stock: 1 },
  { name: 'Peanut Butter Cup', description: 'Peanut butter and chocolate', price: 4, in_stock: 1 },
  { name: 'Maple Walnut', description: 'Maple ice cream with walnuts', price: 4, in_stock: 1 },
  { name: 'Black Cherry', description: 'Sweet cherries in cream', price: 4, in_stock: 1 },
  { name: 'Green Tea', description: 'Earthy matcha', price: 4, in_stock: 1 },
  { name: 'Rum Raisin', description: 'Rum-soaked raisins', price: 4, in_stock: 1 },
  { name: 'Blueberry Cheesecake', description: 'Blueberry and cheesecake bits', price: 4, in_stock: 0 },
  { name: 'Coconut', description: 'Creamy coconut', price: 3.5, in_stock: 0 },
  { name: 'Pumpkin Spice', description: 'Pumpkin and warm spices', price: 4, in_stock: 0 },
  { name: 'S’mores', description: 'Chocolate, graham, marshmallow', price: 4, in_stock: 0 },
  { name: 'Dulce de Leche', description: 'Caramelized milk', price: 4, in_stock: 0 }
];

const insert = db.prepare(`
  INSERT INTO flavors (name, description, price, in_stock)
  VALUES (@name, @description, @price, @in_stock)
`);

const insertMany = db.transaction((flavors) => {
  for (const flavor of flavors) insert.run(flavor);
});

insertMany(flavors);

// Ensure SQLite autoincrement resets so IDs start at 1 after delete
db.prepare("DELETE FROM sqlite_sequence WHERE name = 'flavors'").run();
db.prepare("DELETE FROM sqlite_sequence WHERE name = 'daily_menus'").run();
db.prepare("DELETE FROM sqlite_sequence WHERE name = 'daily_menu_flavors'").run();

// Helper: get favorite flavor IDs (Vanilla, Chocolate, Strawberry, Mint Chip, Cookie Dough)
function getFavoriteFlavorIds() {
  return db.prepare('SELECT id FROM flavors WHERE name IN (?,?,?,?,?) ORDER BY id ASC')
    .all('Vanilla', 'Chocolate', 'Strawberry', 'Mint Chip', 'Cookie Dough')
    .map(row => row.id);
}

// Helper: get non-favorite flavor IDs
function getNonFavoriteFlavorIds() {
  return db.prepare('SELECT id FROM flavors WHERE name NOT IN (?,?,?,?,?) ORDER BY id ASC')
    .all('Vanilla', 'Chocolate', 'Strawberry', 'Mint Chip', 'Cookie Dough')
    .map(row => row.id);
}

// Seed 2 weeks of historical menus (excluding today)
const today = new Date();
const insertMenu = db.prepare('INSERT INTO daily_menus (date) VALUES (?)');
const insertMenuFlavor = db.prepare('INSERT INTO daily_menu_flavors (menu_id, flavor_id) VALUES (?, ?)');
const favoriteIds = getFavoriteFlavorIds();
const nonFavoriteIds = getNonFavoriteFlavorIds();

function getRandomFlavorsForDay(dayIndex) {
  // Always include all 5 favorites, rest random non-favorites, 7-10 total
  const numFlavors = 7 + Math.floor(Math.random() * 4); // 7-10
  const favorites = favoriteIds.slice(); // all 5 favorites
  // Shuffle non-favorites and pick the rest
  const shuffledNonFavs = nonFavoriteIds.slice().sort(() => 0.5 - Math.random());
  const needed = Math.max(0, numFlavors - favorites.length);
  const chosenNonFavs = shuffledNonFavs.slice(0, needed);
  // Combine and shuffle
  const menu = favorites.concat(chosenNonFavs).sort(() => 0.5 - Math.random());
  return menu;
}

for (let daysAgo = 14; daysAgo >= 1; daysAgo--) {
  const date = new Date(today.getTime() - daysAgo * 86400000).toISOString().split('T')[0];
  const flavorIds = getRandomFlavorsForDay(daysAgo);
  if (flavorIds.length >= 7) {
    const menuResult = insertMenu.run(date);
    const menuId = menuResult.lastInsertRowid;
    for (const flavorId of flavorIds) {
      insertMenuFlavor.run(menuId, flavorId);
    }
  }
}
