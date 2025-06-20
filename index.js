const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');


var corsOptions = {
  origin: 'http://webapp-123456.s3-website-us-east-1.amazonaws.com',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type'
};

app.use(cors(corsOptions));
app.use(express.json());
dotenv.config();


const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL conectado');
});


app.get('/', (req, res) => {
  res.status(200).json({ message: 'Backend en funcionamiento' });
});

app.get('/products', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.post('/products', (req, res) => {
  const { name, price, description, image } = req.body;

    if (!name || !price) {
        return res.status(400).send('Name and price are required');
    }

  db.query('INSERT INTO products (name, price, description, image) VALUES (?, ?, ?, ?)', [name, price, description, image], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(200);
  });
});

app.listen(3001, () => console.log('Backend en http://localhost:3001'));