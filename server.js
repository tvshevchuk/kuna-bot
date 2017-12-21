require('newrelic');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const router = require('./router');

const app = express();
const port = process.env.PORT || 8080;
const dbConnection = process.env.NODE_ENV 
    ? 'mongodb://myuser:mypass@ds163016.mlab.com:63016/heroku_xwwpxjsf'
    : 'mongodb://myuser:mypass@ds161346.mlab.com:61346/kuna-bot-dev';

mongoose.Promise = global.Promise;
mongoose.connect(dbConnection, { useMongoClient: true });

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', router);

app.get('*', (req, res) => {
    res.send(__dirname + 'index.html');
});

app.listen(port, () => {
    console.log(`Listening on ${port} port...`);
});
