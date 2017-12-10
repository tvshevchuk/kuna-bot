const express = require('express');
const basicAuth = require('express-basic-auth');
const request = require('request');
const hmacSHA256 = require('crypto-js/hmac-sha256');
const hex = require('crypto-js/enc-hex.js');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/public'));

const access_key = 'Yzl4tdCgMWhqITEEXpRJBRR7bKxZsAhH6pSqEHKr';
const private_key = 'KxqcnyGMF4hC8peLMUMP63XWyq5dx3Caqi09yuQw';

const auth = basicAuth({
    users: {'tvshevchuk': 'mypass'},
    challenge: true
});

const latestMarketData = [];

setInterval(() => {
    request({
        url: 'https://kuna.io/api/v2/tickers/btcuah',
        json: true
    }, (err, response, body) => {
        latestMarketData.unshift(body);
        if (latestMarketData.length >= 10) {
            latestMarketData.pop();
        }
    });
}, 5000);

const renderLatestMarketData = (latestMarketData) => {
    let temp = '<ol>';
    latestMarketData.forEach(el => {
        temp += '<li>' + JSON.stringify(el) + '</li>';
    });
    return temp + '</ol>';
}

app.get('/myinfo', auth, (req, res, next) => {
    let tonce = Date.now();
    const path = `GET|/api/v2/members/me|access_key=${access_key}&tonce=${tonce}`;
    const hmacDigest = hex.stringify(hmacSHA256(path, private_key));
    request({
        url: `https://kuna.io/api/v2/members/me?access_key=${access_key}&tonce=${tonce}&signature=${hmacDigest}`,
        json: true
    }, (err, response, body) => {
        if (err) throw err;
        res.send(body);
    });    
});


app.get('/', (req, res) => {
    let latestMarketDataHtml = renderLatestMarketData(latestMarketData);
    res.render(__dirname + 'index.html');
});

app.listen(port, () => {
    console.log(`Listening on ${port} port...`);
});
