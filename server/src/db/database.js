
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
            -- Profile info
            name TEXT, -- Name of person or orphanage
            contact_person TEXT,
            phone TEXT,
            address TEXT,
            -- Geolocation for recipients
            latitude REAL,
            longitude REAL,
            capacity INTEGER -- Number of children for orphanages
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
            status TEXT DEFAULT 'available', -- 'available', 'claimed', 'completed'
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`);
        
        // Seed initial data
        const seedUsers = db.prepare("INSERT OR IGNORE INTO users (username, password, role, name, address, latitude, longitude, capacity) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        // Donor
        seedUsers.run('event_manager', 'password', 'donor', 'Grand Events', '123 Main St, San Francisco, CA', 37.7749, -122.4194, null);
        // Recipients
        seedUsers.run('sunny_orphanage', 'password', 'recipient', 'Sunny Orphanage', '456 Market St, San Francisco, CA', 37.7937, -122.3964, 50);
        seedUsers.run('happy_home', 'password', 'recipient', 'Happy Home Shelter', '789 Mission St, San Francisco, CA', 37.7833, -122.4092, 30);
        seedUsers.finalize();
    });
};

module.exports = { db, initDb };
