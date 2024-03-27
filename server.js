require('dotenv').config();

const express = require('express');
const cors = require('cors'); 
const jwt = require('jsonwebtoken');
const app = express();

const ticketRoutes = require('./routes/ticketRoutes');
//const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');


app.use(cors()); // cors middleware
app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// TICKETS
app.use('/api', ticketRoutes);

// AUTH
app.use('/api', authRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



