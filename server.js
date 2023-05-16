const express = require('express');
const server = express();
const connectToDB = require('./db');
const cors = require('cors');

server.use(express.json());

server.use(
  cors({
    origin: '*',
  })
);

connectToDB();

const routes = require('./routes');

server.use('/api', routes);

const port = process.env.PORT || 5001;

server.listen(port, '0.0.0.0', () => console.log(`Server running at ${port}`));
