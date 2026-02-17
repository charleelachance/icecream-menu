const db = require('./db');

// Clear existing data (in correct order: foreign keys first)
db.prepare('DELETE FROM daily_menu_flavors').run(); // Remove all menu-flavor links first
db.prepare('DELETE FROM daily_menus').run();        // Remove all menus
db.prepare('DELETE FROM flavors').run();            // Now safe to clear flavors

const flavors = [
  // 5 Favorites (always appear in menus)
  { name: 'Vanilla', description: 'Classic creamy', price: 3.5, in_stock: 1 },
  { name: 'Chocolate', description: 'Rich and smooth', price: 3.5, in_stock: 1 },
  { name: 'Strawberry', description: 'Fresh strawberry', price: 3.5, in_stock: 1 },
  { name: 'Mint Chip', description: 'Minty with chocolate chips', price: 4, in_stock: 1 },
  { name: 'Cookie Dough', description: 'Chunks of cookie dough', price: 4, in_stock: 1 },

  // 80 In-stock flavors
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
  { name: 'Blueberry', description: 'Fresh blueberries', price: 3.5, in_stock: 1 },
  { name: 'Caramel Swirl', description: 'Vanilla with caramel ribbons', price: 4, in_stock: 1 },
  { name: 'Cherry Garcia', description: 'Cherry and chocolate chunks', price: 4, in_stock: 1 },
  { name: 'Chocolate Fudge Brownie', description: 'Chocolate with fudge brownies', price: 4.5, in_stock: 1 },
  { name: 'Cinnamon', description: 'Warm cinnamon spice', price: 3.5, in_stock: 1 },
  { name: 'Cotton Candy', description: 'Sweet carnival treat', price: 3.5, in_stock: 1 },
  { name: 'French Vanilla', description: 'Rich vanilla custard', price: 3.5, in_stock: 1 },
  { name: 'Hazelnut', description: 'Roasted hazelnut', price: 4, in_stock: 1 },
  { name: 'Honey Lavender', description: 'Floral honey lavender', price: 4, in_stock: 1 },
  { name: 'Mocha Almond Fudge', description: 'Coffee, chocolate, almonds', price: 4.5, in_stock: 1 },
  { name: 'Neapolitan', description: 'Vanilla, chocolate, strawberry', price: 3.5, in_stock: 1 },
  { name: 'Orange Sherbet', description: 'Tangy orange', price: 3.5, in_stock: 1 },
  { name: 'Peach', description: 'Sweet summer peaches', price: 3.5, in_stock: 1 },
  { name: 'Pralines & Cream', description: 'Vanilla with praline pecans', price: 4, in_stock: 1 },
  { name: 'Red Velvet', description: 'Red velvet cake pieces', price: 4, in_stock: 1 },
  { name: 'Strawberry Cheesecake', description: 'Strawberry with cheesecake', price: 4, in_stock: 1 },
  { name: 'Tiramisu', description: 'Italian coffee dessert', price: 4.5, in_stock: 1 },
  { name: 'Toasted Coconut', description: 'Toasted coconut flakes', price: 4, in_stock: 1 },
  { name: 'Vanilla Bean', description: 'Real vanilla bean specks', price: 3.5, in_stock: 1 },
  { name: 'White Chocolate Raspberry', description: 'White chocolate and raspberry', price: 4, in_stock: 1 },
  { name: 'Banana', description: 'Creamy banana', price: 3.5, in_stock: 1 },
  { name: 'Blackberry', description: 'Sweet blackberries', price: 3.5, in_stock: 1 },
  { name: 'Bubblegum', description: 'Sweet bubblegum flavor', price: 3.5, in_stock: 1 },
  { name: 'Butterscotch', description: 'Rich butterscotch', price: 3.5, in_stock: 1 },
  { name: 'Cafe Latte', description: 'Coffee with cream', price: 4, in_stock: 1 },
  { name: 'Caramel Apple', description: 'Apple with caramel', price: 4, in_stock: 1 },
  { name: 'Caramel Macchiato', description: 'Coffee caramel swirl', price: 4, in_stock: 1 },
  { name: 'Champagne', description: 'Sparkling champagne sorbet', price: 4.5, in_stock: 1 },
  { name: 'Chocolate Chip', description: 'Vanilla with chocolate chips', price: 3.5, in_stock: 1 },
  { name: 'Chocolate Peanut Butter', description: 'Chocolate and peanut butter', price: 4, in_stock: 1 },
  { name: 'Creme Brulee', description: 'Caramelized custard', price: 4.5, in_stock: 1 },
  { name: 'Earl Grey', description: 'Tea-infused cream', price: 4, in_stock: 1 },
  { name: 'Eggnog', description: 'Holiday spiced custard', price: 4, in_stock: 1 },
  { name: 'Espresso', description: 'Strong espresso', price: 4, in_stock: 1 },
  { name: 'Fig', description: 'Sweet fig', price: 4, in_stock: 1 },
  { name: 'Ginger', description: 'Spicy ginger', price: 3.5, in_stock: 1 },
  { name: 'Gingerbread', description: 'Warm gingerbread spices', price: 4, in_stock: 1 },
  { name: 'Graham Cracker', description: 'Sweet graham crackers', price: 3.5, in_stock: 1 },
  { name: 'Grape', description: 'Concord grape', price: 3.5, in_stock: 1 },
  { name: 'Key Lime Pie', description: 'Tangy lime pie', price: 4, in_stock: 1 },
  { name: 'Lemon Meringue', description: 'Lemon with meringue swirl', price: 4, in_stock: 1 },
  { name: 'Licorice', description: 'Black licorice', price: 3.5, in_stock: 1 },
  { name: 'Mango Sorbet', description: 'Pure mango sorbet', price: 3.5, in_stock: 1 },
  { name: 'Marionberry', description: 'Pacific Northwest berries', price: 3.5, in_stock: 1 },
  { name: 'Marshmallow', description: 'Fluffy marshmallow', price: 3.5, in_stock: 1 },
  { name: 'Mascarpone', description: 'Italian cream cheese', price: 4, in_stock: 1 },
  { name: 'Nutella', description: 'Hazelnut chocolate spread', price: 4.5, in_stock: 1 },
  { name: 'Oatmeal Cookie', description: 'Oatmeal cookie pieces', price: 4, in_stock: 1 },
  { name: 'Passion Fruit', description: 'Tropical passion fruit', price: 3.5, in_stock: 1 },
  { name: 'Pina Colada', description: 'Pineapple and coconut', price: 4, in_stock: 1 },
  { name: 'Pineapple', description: 'Sweet pineapple', price: 3.5, in_stock: 1 },
  { name: 'Raspberry Cheesecake', description: 'Raspberry with cheesecake', price: 4, in_stock: 1 },
  { name: 'Rose', description: 'Delicate rose water', price: 4, in_stock: 1 },
  { name: 'Snickerdoodle', description: 'Cinnamon sugar cookie', price: 4, in_stock: 1 },
  { name: 'Spumoni', description: 'Cherry, pistachio, chocolate', price: 4, in_stock: 1 },
  { name: 'Strawberry Banana', description: 'Strawberry and banana', price: 3.5, in_stock: 1 },
  { name: 'Tangerine', description: 'Citrus tangerine', price: 3.5, in_stock: 1 },
  { name: 'Toffee', description: 'Buttery toffee bits', price: 4, in_stock: 1 },
  { name: 'Tres Leches', description: 'Three milks cake', price: 4.5, in_stock: 1 },
  { name: 'Turtle', description: 'Chocolate, caramel, pecans', price: 4.5, in_stock: 1 },
  { name: 'Watermelon', description: 'Fresh watermelon', price: 3.5, in_stock: 1 },

  // 15 Out-of-stock flavors
  { name: 'Blueberry Cheesecake', description: 'Blueberry and cheesecake bits', price: 4, in_stock: 0 },
  { name: 'Coconut', description: 'Creamy coconut', price: 3.5, in_stock: 0 },
  { name: 'Pumpkin Spice', description: 'Pumpkin and warm spices', price: 4, in_stock: 0 },
  { name: 'S\'mores', description: 'Chocolate, graham, marshmallow', price: 4, in_stock: 0 },
  { name: 'Dulce de Leche', description: 'Caramelized milk', price: 4, in_stock: 0 },
  { name: 'Avocado', description: 'Creamy avocado', price: 4, in_stock: 0 },
  { name: 'Bacon', description: 'Maple bacon bits', price: 4.5, in_stock: 0 },
  { name: 'Carrot Cake', description: 'Spiced carrot cake', price: 4, in_stock: 0 },
  { name: 'Cheesecake', description: 'Plain cheesecake swirl', price: 4, in_stock: 0 },
  { name: 'Cucumber', description: 'Fresh cucumber sorbet', price: 3.5, in_stock: 0 },
  { name: 'Guava', description: 'Tropical guava', price: 3.5, in_stock: 0 },
  { name: 'Horchata', description: 'Cinnamon rice milk', price: 4, in_stock: 0 },
  { name: 'Jalapeno', description: 'Spicy jalapeno', price: 4, in_stock: 0 },
  { name: 'Lavender', description: 'Floral lavender', price: 4, in_stock: 0 },
  { name: 'Lychee', description: 'Exotic lychee', price: 3.5, in_stock: 0 }
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

console.log('Database seeded with 100 flavors and 2 weeks of historical menus!');
