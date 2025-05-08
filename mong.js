'use strict';
import configRoutes from './routes/index.js';
import express from 'express';
//const express = require('express');
import path from 'path';    
import { fileURLToPath } from 'url';
import cors from 'cors';


const __filename = fileURLToPath(import.meta.url); // getting dirname as seen in documentation
const __dirname = path.dirname(__filename);
const app = express();
app.use(cors())
app.use(express.static(path.join(__dirname, './cs546/build')));

app.use((req, res) => {
    res.status(200).send('Hello, world!');
});

//configRoutes(app)
// Start the server
const PORT = 3000
app.listen(PORT, () => {
    console.log(`App hosted on  http://localhost:${PORT}/`);
    console.log('Press Ctrl+C to quit.');
});