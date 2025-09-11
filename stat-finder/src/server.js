import { Client } from 'pg';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`, req.query);
    next();
});

const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}

const config2 = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME2
}

app.get('/api/player', async (req, res) => {
    console.log('Request received:', req.query);
    const client = new Client(config);
    let query = 'SELECT * FROM players WHERE "Name" = $1';
    const params = [req.query.name];

    try {
        await client.connect();

        if (!req.query.name) {
            return res.status(400).json({ error: 'Player name is required' });
        }

        console.log('QUERY:', query);
        console.log('PARAMS:', params);
        const result = await client.query(query, params);
        res.json(result.rows);
    
    } catch(err) {
        console.error('Error occurred:', {
            error: err.message,
            stack: err.stack,
            requestParams: req.query,
            queryDetails: { query, params }
        });
        res.status(500).json({ error: err.message });
    } finally {
        await client.end();
    }

})

app.get('/test', (req, res) => {
    res.send('Server is running');
});

app.get('/api/nfl-player', async (req, res) => {
    console.log('Request received:', req.query);
    const client = new Client(config2);
    let query = 'SELECT * FROM players WHERE "Name" = $1';
    const params = [req.query.name];

    try {
        await client.connect();

        if (!req.query.name) {
            return res.status(400).json({ error: 'Player name is required' });
        }

        console.log('QUERY:', query);
        console.log('PARAMS:', params);
        const result = await client.query(query, params);
        res.json(result.rows);
    
    } catch(err) {
        console.error('Error occurred:', {
            error: err.message,
            stack: err.stack,
            requestParams: req.query,
            queryDetails: { query, params }
        });
        res.status(500).json({ error: err.message });
    } finally {
        await client.end();
    }

})

app.get('/nfl-test', (req, res) => {
    res.send('Server is running');
});

const port = 3000;
app.listen(port, () => console.log(`Running on port ${port}`));