const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to the database
const connection = mysql.createConnection(process.env.DATABASE_URL);

connection.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to the database.');
    }
});

// Register endpoint
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required.');
    }

    connection.query(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, password],
        (err, results) => {
            if (err) {
                console.error('Error registering user:', err);  // Log the error for debugging
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).send('Username already exists.');
                }
                return res.status(500).send('Error registering user.');
            }

            res.status(201).send('User registered successfully.');
        }
    );
});

// Start the server
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
});
