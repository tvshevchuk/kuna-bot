const express = require('express');
const basicAuth = require('express-basic-auth');

const kunaAPI = require('./kunaAPI');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/public'));

const auth = basicAuth({
    users: {'tvshevchuk': 'mypass'}
});

const latestMarketData = [];

setInterval(() => {
    kunaAPI.btcuah((err, response, body) => {
        latestMarketData.unshift(body);
        if (latestMarketData.length >= 10) {
            latestMarketData.pop();
        }
    });
}, 5000);

app.get('/btcuah', (req, res, next) => {
    res.send(latestMarketData);
});

app.get('/myinfo', auth, (req, res, next) => {
    kunaAPI.myInfo((err, response, body) => {
        if (err) throw err;
        res.send(body);
    });   
});

app.get('/myhistory', auth, (req, res, next) => {
    kunaAPI.myHistory((err, response, body) => {
        if (err) throw err;
        res.send(body);
    });   
});

app.get('/', (req, res) => {
    res.render(__dirname + 'index.html');
});

app.listen(port, () => {
    console.log(`Listening on ${port} port...`);
});
