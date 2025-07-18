const { Client } = require('pg');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}

app.get('/api/player', async (req, res) => {
    console.log('Request received:', req.query);
    const client = new Client(config);
    await client.connect();

    try {

        if (!req.query.name) {
            return res.status(400).json({ error: 'Player name is required' });
        }

        let query = 'SELECT * FROM players WHERE "Name" = $1';
        const params = [req.query.name];
        let index = 2;

        if (req.query.minutes){
            console.log('minutes if entered')
            query += ` AND (SPLIT_PART("MP", ':', 1)::int + SPLIT_PART("MP", ':', 2)::int / 60.0) >= $${index++}`;
            query += ` AND "MP" IS NOT NULL`;
            params.push(Number(req.query.minutes));
        }

        if (req.query.opp){
            console.log('opp if entered')
            query += ` AND "Opp" = $${index++}`;
            params.push(req.query.opp);
        }

        if (req.query.home){
            console.log('home if entered')
            query += ` AND "Home?" IS NULL`;
        }

        if (req.query.away){
            console.log('away if entered')
            query += ` AND "Home?" IS NOT NULL`;
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

const port = 5000;
app.listen(port, () => console.log(`Running on port ${port}`));