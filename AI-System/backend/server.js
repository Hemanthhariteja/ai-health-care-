require('dotenv').config();
const express = require('express');
const cors = require('cors');

const chatRoutes = require('./chatRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', chatRoutes);

const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
  console.log(`AI Server running on port ${PORT} 💙`);
});