const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 3000;

const connectDB = require('./utils/connectDb');

const apiRouter = require('./apiRoutes');

connectDB();

app.use(bodyParser.json());
app.use(cors());
app.use('/api', apiRouter);

app.listen(PORT, () => {
    console.log(`Server run on http://localhost:${PORT}/api`);
});

module.exports = app;