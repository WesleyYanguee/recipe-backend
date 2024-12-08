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

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the Recipe API!');
});

// Get all recipes
app.get('/recipes', (req, res) => {
    connection.query('SELECT * FROM recipes', (err, results) => {
        if (err) {
            res.status(500).send('Error fetching recipes');
        } else {
            res.json(results);
        }
    });
});

// Get a recipe by ID
app.get('/recipes/:id', (req, res) => {
    const id = req.params.id;
    connection.query('SELECT * FROM recipes WHERE id = ?', [id], (err, results) => {
        if (err) {
            res.status(500).send('Error fetching recipe');
        } else {
            res.json(results[0]);
        }
    });
});

// Add a new recipe
app.post('/recipes', (req, res) => {
    const { name, imageUrl, ingredients, steps, category, cookTime } = req.body;
    connection.query(
        'INSERT INTO recipes (name, imageUrl, ingredients, steps, category, cookTime) VALUES (?, ?, ?, ?, ?, ?)',
        [name, imageUrl, JSON.stringify(ingredients), JSON.stringify(steps), category, cookTime],
        (err, results) => {
            if (err) {
                res.status(500).send('Error adding recipe');
            } else {
                res.status(200).send('Recipe added successfully');
            }
        }
    );
});

// Update a recipe
app.put('/recipes/:id', (req, res) => {
    const id = req.params.id;
    const { name, imageUrl, ingredients, steps, category, cookTime } = req.body;
    connection.query(
        'UPDATE recipes SET name = ?, imageUrl = ?, ingredients = ?, steps = ?, category = ?, cookTime = ? WHERE id = ?',
        [name, imageUrl, JSON.stringify(ingredients), JSON.stringify(steps), category, cookTime, id],
        (err, results) => {
            if (err) {
                res.status(500).send('Error updating recipe');
            } else {
                res.status(200).send('Recipe updated successfully');
            }
        }
    );
});

// Delete a recipe
app.delete('/recipes/:id', (req, res) => {
    const id = req.params.id;
    connection.query('DELETE FROM recipes WHERE id = ?', [id], (err, results) => {
        if (err) {
            res.status(500).send('Error deleting recipe');
        } else {
            res.status(200).send('Recipe deleted successfully');
        }
    });
});

// Start the server
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
});
