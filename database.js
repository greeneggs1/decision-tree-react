const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

// Create a table to store decision tree results
const createTableQuery = `
CREATE TABLE IF NOT EXISTS results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_name TEXT,
    alignment_values TEXT,
    capacity_values TEXT,
    client_values TEXT,
    personal_values TEXT,
    financial_values TEXT,
    decision TEXT
);
`;

db.run(createTableQuery, (err) => {
    if (err) {
        console.error('Error creating table:', err.message);
    } else {
        console.log('Table created successfully');
    }
});

// Function to insert a new result into the database
function insertResult(result) {
    const { projectName, alignmentValues, capacityValues, clientValues, personalValues, financialValues, decision } = result;
    const insertQuery = `
    INSERT INTO results (project_name, alignment_values, capacity_values, client_values, personal_values, financial_values, decision)
    VALUES (?, ?, ?, ?, ?, ?, ?);
    `;
    db.run(insertQuery, [projectName, alignmentValues, capacityValues, clientValues, personalValues, financialValues, decision], (err) => {
        if (err) {
            console.error('Error inserting result:', err.message);
        } else {
            console.log('Result inserted successfully');
        }
    });
}

// Function to retrieve all results from the database
function getAllResults(callback) {
    const selectQuery = `SELECT * FROM results;`;
    db.all(selectQuery, (err, rows) => {
        if (err) {
            console.error('Error retrieving results:', err.message);
            callback([]);
        } else {
            callback(rows);
        }
    });
}

module.exports = { insertResult, getAllResults };
