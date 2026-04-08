
const express = require('express');
const { db } = require('../db/database');
const NodeGeocoder = require('node-geocoder');
const router = express.Router();

const options = {
  provider: 'openstreetmap',
};
const geocoder = NodeGeocoder(options);

// Helper function for distance calculation (Haversine formula)
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

// --- Auth ---
router.post('/register', async (req, res) => {
    const { username, password, role, name, address, contact_person, phone, capacity } = req.body;
    let latitude, longitude;
    try {
        const geoResult = await geocoder.geocode(address);
        if (geoResult.length === 0) {
            return res.status(400).json({ error: "Could not geocode address." });
        }
        latitude = geoResult[0].latitude;
        longitude = geoResult[0].longitude;
    } catch (err) {
        return res.status(500).json({ error: "Geocoding service failed." });
    }

    db.run('INSERT INTO users (username, password, role, name, address, latitude, longitude, contact_person, phone, capacity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [username, password, role, name, address, latitude, longitude, contact_person, phone, capacity],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ id: this.lastID });
        }
    );
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get('SELECT id, username, role, name, address, latitude, longitude FROM users WHERE username = ? AND password = ?', [username, password], (err, user) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (user) {
            res.json({ message: 'Login successful', user });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    });
});

// --- Donations ---
router.post('/donations', async (req, res) => {
    const { user_id, event_name, food_type, quantity, pickup_time, address } = req.body;
    let latitude, longitude;
    try {
        const geoResult = await geocoder.geocode(address);
        if (geoResult.length === 0) {
            return res.status(400).json({ error: "Could not geocode address." });
        }
        latitude = geoResult[0].latitude;
        longitude = geoResult[0].longitude;
    } catch (err) {
        return res.status(500).json({ error: "Geocoding service failed." });
    }

    db.run('INSERT INTO donations (user_id, event_name, food_type, quantity, pickup_time, address, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [user_id, event_name, food_type, quantity, pickup_time, address, latitude, longitude],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ id: this.lastID });
        }
    );
});

router.get('/donations/nearby', (req, res) => {
    const { lat, lon, radius = 20 } = req.query; // radius in km

    db.all('SELECT * FROM donations WHERE status = ?', ['available'], (err, donations) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const nearbyDonations = donations
            .map(donation => {
                const distance = getDistance(lat, lon, donation.latitude, donation.longitude);
                return { ...donation, distance };
            })
            .filter(donation => donation.distance <= radius)
            .sort((a, b) => a.distance - b.distance);
        
        res.json(nearbyDonations);
    });
});

router.get('/donations/mine/:user_id', (req, res) => {
    db.all('SELECT * FROM donations WHERE user_id = ? ORDER BY pickup_time DESC', [req.params.user_id], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});


// --- Orphanages ---
router.get('/orphanages/nearby', (req, res) => {
    const { lat, lon, radius = 20 } = req.query;

    db.all("SELECT id, name, address, contact_person, phone, capacity, latitude, longitude FROM users WHERE role = 'recipient'", [], (err, orphanages) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const nearbyOrphanages = orphanages
            .map(orphanage => {
                const distance = getDistance(lat, lon, orphanage.latitude, orphanage.longitude);
                return { ...orphanage, distance };
            })
            .filter(orphanage => orphanage.distance <= radius)
            .sort((a, b) => a.distance - b.distance);

        res.json(nearbyOrphanages);
    });
});

// --- Supplies ---
router.post('/supplies/order', (req, res) => {
    const { user_id, item, quantity } = req.body;
    db.run('INSERT INTO supply_orders (user_id, item, quantity, order_time, status) VALUES (?, ?, ?, ?, ?)',
        [user_id, item, quantity, new Date().toISOString(), 'placed'],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            // Simulate delivery
            setTimeout(() => {
                db.run('UPDATE supply_orders SET status = ? WHERE id = ?', ['delivered', this.lastID]);
            }, 20 * 60 * 1000); // 20 minutes
            res.json({ id: this.lastID, message: "Order placed successfully." });
        }
    );
});

router.get('/supplies/orders/:user_id', (req, res) => {
    db.all('SELECT * FROM supply_orders WHERE user_id = ? ORDER BY order_time DESC', [req.params.user_id], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// --- Deliveries ---
router.post('/deliveries/request', (req, res) => {
    const { donation_id, recipient_id, pickup_address, dropoff_address, estimated_fare } = req.body;

    // 1. Create a delivery record
    db.run('INSERT INTO deliveries (donation_id, recipient_id, pickup_address, dropoff_address, estimated_fare, booking_time, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [donation_id, recipient_id, pickup_address, dropoff_address, estimated_fare, new Date().toISOString(), 'requested'],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            const deliveryId = this.lastID;
            
            // 2. Update donation status
            db.run("UPDATE donations SET status = 'claimed' WHERE id = ?", [donation_id], (err) => {
                if (err) {
                    // This is tricky in a real app, might need a transaction
                    return res.status(500).json({ error: "Failed to update donation status." });
                }

                // 3. Simulate delivery progress
                setTimeout(() => {
                    db.run('UPDATE deliveries SET status = ? WHERE id = ?', ['in_progress', deliveryId]);
                }, 1 * 60 * 1000); // 1 minute
                
                setTimeout(() => {
                    db.run('UPDATE deliveries SET status = ? WHERE id = ?', ['delivered', deliveryId]);
                    db.run('UPDATE donations SET status = ? WHERE id = ?', ['delivered', donation_id]);
                }, 15 * 60 * 1000); // 15 minutes

                res.json({ id: deliveryId, message: "Delivery requested successfully." });
            });
        }
    );
});

module.exports = router;
