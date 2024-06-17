const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const { dbConnection } = require('./config/config.js');
const path = require('path');
// const swaggerUI = require('swagger-ui-express');
// const docs = require('./docs/index');
// require('./crons/cleanupUsers.js');

dbConnection();

app.use(express.json());

app.use('/public', express.static(path.join(__dirname, 'public')));

// app.use('/users', require('./routes/users.js'));
app.use('/residents', require('./routes/residents.js'));
app.use('/activities', require('./routes/activities.js'));

// app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(docs));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

module.exports = app;