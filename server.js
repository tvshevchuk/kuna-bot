const express = require('express');
const hbs = require('hbs');
const request = require('request');

const app = express();
const port = process.env.PORT || 8080;

app.set('view engine', 'hbs');
app.use(express.static(__dirname));

const lastMarketData = [];

setInterval(() => {
    request({
        url: 'https://kuna.io/api/v2/tickers/btcuah',
        json: true
    }, (err, response, body) => {
        lastMarketData.push(body);
        if (lastMarketData.length >= 10) {
            lastMarketData.shift();
        }
    });
}, 5000);

const renderLastMarketData = (lastMarketData) => {
    let temp = '<ul>';
    lastMarketData.forEach(el => {
        temp += '<li>' + JSON.stringify(el) + '</li>';
    });
    return temp + '</ul>';
}

app.get('/', (req, res) => {
    let lastMarketDataHtml = renderLastMarketData(lastMarketData);
    res.render('index.hbs', {
        lastMarketDataHtml
    });
});

app.listen(port, () => {
    console.log(`Listening on ${port} port...`);
});
