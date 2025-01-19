const pool = require('../db');

const updateLocation = async (req, res) => {
    const userId = req.user.id;
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
        return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    try {
        await pool.query(
            `INSERT INTO user_locations (user_id, latitude, longitude, last_updated)
             VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
             ON CONFLICT (user_id)
             DO UPDATE SET latitude = $2, longitude = $3, last_updated = CURRENT_TIMESTAMP;`,
            [userId, latitude, longitude]
        );

        res.status(200).json({ message: 'Location updated successfully' });
    } catch (err) {
        console.error('Error updating location:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};



const getLocation = async (req, res) => {
    const userId = req.user.id;

    try {
        const result = await pool.query(
            'SELECT latitude, longitude FROM user_locations WHERE user_id = $1',
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Location not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching location:', err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { updateLocation, getLocation };
