const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

let results = [];

// Endpoint to save decision tree results
app.post('/save', (req, res) => {
    const result = req.body;
    results.push(result);
    res.status(201).send('Result saved successfully');
});

// Endpoint to retrieve decision tree results
app.get('/results', (req, res) => {
    res.json(results);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

