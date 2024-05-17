const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db/db')
const route = require('./routes/index')

const app = express();
const port = 3000;

app.use(bodyParser.json());
db.connect();
route(app);


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

