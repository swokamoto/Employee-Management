const express = require('express');
const { Pool } = require('pg');
const { promptUser } = require('./inquirer');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({extended: false}));

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'business_db',
    password: 'tmntKA!!9200'
});

pool.connect();

console.log('EMPLOYEE MANAGEMENT SYSTEM');
promptUser();

app.use((req, res) => { 
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});