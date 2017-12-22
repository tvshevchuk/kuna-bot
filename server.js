require('newrelic');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const router = require('./router');

const app = express();
const port = process.env.PORT || 8080;
const dbConnection = process.env.NODE_ENV 
    ? 'mongodb://myuser:mypass@ds163016.mlab.com:63016/heroku_xwwpxjsf'
    : 'mongodb://test:test@ds131137.mlab.com:31137/kuna-bot-dev';

mongoose.Promise = global.Promise;
mongoose.connect(dbConnection, { useMongoClient: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Successful connection to db.');
});

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
