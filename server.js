require('newrelic');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const router = require('./router');

const app = express();
const port = process.env.PORT || 8080;
const env = process.env.NODE_ENV || 'development';

let dbConnection;
switch (env) {
    case 'production': 
        dbConnection = 'mongodb://heroku_xwwpxjsf:eajekpsnr716h69v9nmn0ck98s@ds163016.mlab.com:63016/heroku_xwwpxjsf';
        break;
    case 'development':
        dbConnection = 'mongodb://myuser:mypass@ds131137.mlab.com:31137/kuna-bot-dev';
        break;
}

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
