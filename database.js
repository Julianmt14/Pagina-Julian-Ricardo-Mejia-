const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file path
const dbPath = path.join(__dirname, 'portfolio.db');

// Create and initialize database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
        initializeDatabase();
    }
});

// Initialize database schema
function initializeDatabase() {
    db.run(`
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            subject TEXT NOT NULL,
            message TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log('Database table initialized successfully');
        }
    });
}

// Insert a new message
function insertMessage(name, email, subject, message, callback) {
    const sql = 'INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)';
    db.run(sql, [name, email, subject, message], function(err) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, { id: this.lastID });
        }
    });
}

// Get all messages
function getAllMessages(callback) {
    const sql = 'SELECT * FROM messages ORDER BY created_at DESC';
    db.all(sql, [], (err, rows) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, rows);
        }
    });
}

// Get message by ID
function getMessageById(id, callback) {
    const sql = 'SELECT * FROM messages WHERE id = ?';
    db.get(sql, [id], (err, row) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, row);
        }
    });
}

// Close database connection
function closeDatabase() {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed');
        }
    });
}

module.exports = {
    db,
    insertMessage,
    getAllMessages,
    getMessageById,
    closeDatabase
};
