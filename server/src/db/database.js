
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./src/db/nourish-net.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the nourish-net database.');
});

const initDb = () => {
    db.serialize(() => {
        // Users table for both donors (event managers) and recipients (orphanages)
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT,
            role TEXT, -- 'donor' or 'recipient'
            name TEXT,
            contact_person TEXT,
            phone TEXT,
            address TEXT,
            latitude REAL,
            longitude REAL,
            capacity INTEGER
        )`);

        // Donations table for leftover food events
        db.run(`CREATE TABLE IF NOT EXISTS donations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            event_name TEXT,
            food_type TEXT,
            quantity TEXT,
            pickup_time DATETIME,
            address TEXT,
            latitude REAL,
            longitude REAL,
            status TEXT DEFAULT 'available', -- 'available', 'claimed', 'delivery_in_progress', 'delivered'
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`);

        // New table for supply orders
        db.run(`CREATE TABLE IF NOT EXISTS supply_orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            item TEXT,
            quantity INTEGER,
            order_time DATETIME,
            status TEXT, -- 'placed', 'delivered'
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`);

        // New table for deliveries
        db.run(`CREATE TABLE IF NOT EXISTS deliveries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            donation_id INTEGER,
            recipient_id INTEGER,
            status TEXT, -- 'requested', 'in_progress', 'delivered'
            pickup_address TEXT,
            dropoff_address TEXT,
            estimated_fare REAL,
            booking_time DATETIME,
            FOREIGN KEY (donation_id) REFERENCES donations(id),
            FOREIGN KEY (recipient_id) REFERENCES users(id)
        )`);

        // Seed initial data
        const seedUsers = db.prepare("INSERT OR IGNORE INTO users (id, username, password, role, name, address, latitude, longitude, capacity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        // Donor
        seedUsers.run(1, 'event_manager', 'password', 'donor', 'Grand Events', '123 Main St, San Francisco, CA', 37.7749, -122.4194, null);
        // Recipients
        seedUsers.run(2, 'sunny_orphanage', 'password', 'recipient', 'Sunny Orphanage', '456 Market St, San Francisco, CA', 37.7937, -122.3964, 50);
        seedUsers.run(3, 'happy_home', 'password', 'recipient', 'Happy Home Shelter', '789 Mission St, San Francisco, CA', 37.7833, -122.4092, 30);
        seedUsers.finalize();
    });
};

module.exports = { db, initDb };
