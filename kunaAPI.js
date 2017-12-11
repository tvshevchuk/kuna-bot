const request = require('request');
const hmacSHA256 = require('crypto-js/hmac-sha256');
const hex = require('crypto-js/enc-hex.js');

const jsonRequest = (url, cb) => request({url, json: true}, cb);
const jsonPostRequest = (url, cb, body) => request({method: 'POST', url, json: true, body}, cb);

const btcuah = cb => jsonRequest('https://kuna.io/api/v2/tickers/btcuah', cb);

const orderbook = cb => jsonRequest('https://kuna.io/api/v2/order_book?market=btcuah', cb);

const trades = cb => jsonRequest('https://kuna.io/api/v2/trades?market=btcuah', cb); 

const access_key = 'Yzl4tdCgMWhqITEEXpRJBRR7bKxZsAhH6pSqEHKr';
const private_key = 'KxqcnyGMF4hC8peLMUMP63XWyq5dx3Caqi09yuQw';  
    
const createSignature = (method, url, parameters) => {
    let path = `${method}|${url}|${parameters}`;
    return hex.stringify(hmacSHA256(path, private_key));
}

const myInfo = cb => {
    let tonce = Date.now();
    let signature = createSignature('GET', '/api/v2/members/me', `access_key=${access_key}&tonce=${tonce}`);
    return jsonRequest(`https://kuna.io/api/v2/members/me?access_key=${access_key}&tonce=${tonce}&signature=${signature}`, cb);
}

const postMyOrder = (cb, body) => {
    let tonce = Date.now();
    let signature = createSignature('POST', '/api/v2/orders', `access_key=${access_key}&tonce=${tonce}`);
    return jsonPostRequest(`https://kuna.io/api/v2/orders?access_key=${access_key}&tonce=${tonce}&signature=${signature}`, cb, body);
}

const deleteMyOrder = (cb, body) => {
    let tonce = Date.now();
    let signature = createSignature('POST', '/api/v2/order/delete', `access_key=${access_key}&tonce=${tonce}`);
    return jsonPostRequest(`https://kuna.io/api/v2/order/delete?access_key=${access_key}&tonce=${tonce}&signature=${signature}`, cb, body);
}

const myOrders = cb => {
    let tonce = Date.now();
    let signature = createSignature('GET', '/api/v2/orders', `{access_key}&market=btcuah&tonce=${tonce}`);
    return jsonRequest(`https://kuna.io/api/v2/orders?access_key=${access_key}&market=btcuah&tonce=${tonce}&signature=${signature}`, cb);
}

const myHistory = cb => {
    let tonce = Date.now();
    let signature = createSignature('GET', '/api/v2/trades/my', `access_key=${access_key}&market=btcuah&tonce=${tonce}`);
    return jsonRequest(`https://kuna.io/api/v2/trades/my?access_key=${access_key}&market=btcuah&tonce=${tonce}&signature=${signature}`, cb);
}

module.exports = {
    btcuah,
    orderbook,
    trades,
    myInfo,
    postMyOrder,
    deleteMyOrder,
    myOrders,
    myHistory
}