const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const healthRoutes = require('./routes/health');
const userRoutes = require('./routes/users');

app.use('/api/health', healthRoutes);
app.use('/api/users', userRoutes);
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/baskets', require('./routes/baskets'));

app.get('/', (req, res) => {
    res.send('SAO Backend is running');
});

// Create routes/health.js first effectively

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
