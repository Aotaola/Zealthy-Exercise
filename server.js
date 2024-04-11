require('dotenv').config();

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path'); 
const app = express();
//to inject env variable to frontend client
const fs = require('fs'); 


const ticketRoutes = require('./routes/ticketRoutes');
const authRoutes = require('./routes/authRoutes');

app.use(cors()); 
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

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, 'client/build')));

// Serve modified index.html with environment variables
app.get('/index.html', (req, res) => {
  // Read the index.html file from your React build
  let indexHtml = fs.readFileSync(path.join(__dirname, 'client/build/index.html'), 'utf-8');

  // Inject environment variables into the HTML
  indexHtml = indexHtml.replace(/%REACT_APP_API_URL%/g, process.env.REACT_APP_API_URL);

  // Send the modified HTML as the response
  res.send(indexHtml);
});

// Anything that doesn't match the above, send back index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});





