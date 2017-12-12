const request = require('request');
const hmacSHA256 = require('crypto-js/hmac-sha256');
const hex = require('crypto-js/enc-hex.js');

const jsonRequest = (url, cb) => request({url, json: true}, cb);
const jsonPostRequest = (url, cb, body) => request({method: 'POST', url, json: true, body}, cb);

const timestamp = cb => request('https://kuna.io/api/v2/timestamp', cb);

/*
    {
    "at": время на сервере,
    "ticker": {
        "buy": цена биткоина на покупку,
        "sell": цена биткоина на продажу,
        "low": наименьшая цена сделки за 24 часа,
        "high": наибольшая цена сделки за 24 часа,
        "last": цена последней сделки,
        "vol": объём торгов в базовой валюте за 24 часа,
        "amount": общая стоимость торгов в котируемое валюте за 24 часа
    }
}
*/
const btcuah = cb => jsonRequest('https://kuna.io/api/v2/tickers/btcuah', cb);

/*
    {
    "asks": массив ордеров на продажу
    [{ 
        "id": идентификатор ордера,
        "side": всегда sell,
        "ord_type": тип ордера — limit или market,
        "price": цена за биткоин,
        "avg_price": средняя цена сделки по ордеру,
        "state": состояние ордера — всегда wait,
        "market": идентификатор рынка,
        "created_at": время выставления ордера,
        "volume": объём сделки в биткоинах,
        "remaining_volume": незаполненное количество биткоинов,
        "executed_volume": проданное количество биткоинов,
        "trades_count": количество сделок по данному ордеру
    }],

    "bids": массив ордеров на покупку
    [{
        "id": идентификатор ордера,
        "side": всегда buy,
        "ord_type": тип ордера — limit или market,
        "price": цена за биткоин,
        "avg_price": средняя цена сделки по ордеру,
        "state": состояние ордера — всегда wait,
        "market": идентификатор рынка,
        "created_at": время выставления ордера,
        "volume": объём сделки в биткоинах,
        "remaining_volume": незаполненное количество биткоинов,
        "executed_volume": купленное количество биткоинов,
        "trades_count": количество сделок по ордеру
    }]
}
*/
const orderbook = cb => jsonRequest('https://kuna.io/api/v2/order_book?market=btcuah', cb);

/*
    [{
    "id": идентификатор сделки,
    "price": цена за биткоин,
    "volume": объём в биткоинах,
    "funds": объём в гривнах,
    "market": идентификатор рынка,
    "created_at": время сделки,
    "side": всегда null
}]
*/
const trades = cb => jsonRequest('https://kuna.io/api/v2/trades?market=btcuah', cb); 

const access_key = 'Yzl4tdCgMWhqITEEXpRJBRR7bKxZsAhH6pSqEHKr';
const private_key = 'KxqcnyGMF4hC8peLMUMP63XWyq5dx3Caqi09yuQw';  
    
const createSignature = (method, url, parameters) => {
    let path = `${method}|${url}|${parameters}`;
    return hex.stringify(hmacSHA256(path, private_key));
}

/*
    {
    "email": электронная почта,
    "activated": активирован ли акаунт,
    "accounts": массив активов
    [{
        "currency": валюта,
        "balance": доступная сумма,
        "locked": заблокированная сумма
    }]
}
*/
const myInfo = cb => {
    let tonce = Date.now();
    let signature = createSignature('GET', '/api/v2/members/me', `access_key=${access_key}&tonce=${tonce}`);
    return jsonRequest(`https://kuna.io/api/v2/members/me?access_key=${access_key}&tonce=${tonce}&signature=${signature}`, cb);
}

/*
    POST

    side — buy или sell
    volume — объём ордера в биткоинах
    market — btcuah
    price — цена за один биткоин

    {
    "id": идентификатор ордера,
    "side": buy или sell,
    "ord_type": тип ордера — limit или market,
    "price": цена за биткоин,
    "avg_price": средняя цена сделки по ордеру, для нового ордера — 0,
    "state": состояние ордера, для нового ордера — wait,
    "market": идентификатор рынка,
    "created_at": время выставления ордера,
    "volume": выставленный объём в биткоинах,
    "remaining_volume": незаполненное количество биткоинов,
    "executed_volume": заполненное количество биткоинов, для нового ордера — 0,
    "trades_count": количество торгов по ордеру, для нового ордера — 0
}
*/
const postMyOrder = (body, cb) => {
    let tonce = Date.now();
    let signature = createSignature('POST', '/api/v2/orders', `access_key=${access_key}&tonce=${tonce}`);
    return jsonPostRequest(`https://kuna.io/api/v2/orders?access_key=${access_key}&tonce=${tonce}&signature=${signature}`, cb, body);
}

/*
    POST

    id — идентификатор ордера

    {
    "id": идентификатор ордера,
    "side": buy или sell,
    "ord_type": тип ордера — limit или market,
    "price": цена за биткоин,
    "avg_price": средняя цена сделки по ордеру,
    "state": состояние ордера — весгда wait,
    "market": идентификатор рынка,
    "created_at": время выставления ордера,
    "volume": объём сделки в биткоинах,
    "remaining_volume": незаполненное количество биткоинов,
    "executed_volume": заполненное количество биткоинов,
    "trades_count": количество сделок по ордеру
}
*/
const deleteMyOrder = (body, cb) => {
    let tonce = Date.now();
    let signature = createSignature('POST', '/api/v2/order/delete', `access_key=${access_key}&tonce=${tonce}`);
    return jsonPostRequest(`https://kuna.io/api/v2/order/delete?access_key=${access_key}&tonce=${tonce}&signature=${signature}`, cb, body);
}

/*
    [{
    "id": идентификатор ордера,
    "side": buy или sell,
    "ord_type": тип ордера— limit или market,
    "price": цена за биткоин,
    "avg_price": средняя цена сделки по ордеру,
    "state": состояние ордера — всегда wait,
    "market": идентификатор рынка,
    "created_at": время выставления ордера,
    "volume": объём сделки в биткоинах,
    "remaining_volume": оставшееся количество биткоинов,
    "executed_volume": купленное количество биткоинов,
    "trades_count": количество сделок по ордеру
}]
*/
const myOrders = cb => {
    let tonce = Date.now();
    let signature = createSignature('GET', '/api/v2/orders', `access_key=${access_key}&market=btcuah&tonce=${tonce}`);
    return jsonRequest(`https://kuna.io/api/v2/orders?access_key=${access_key}&market=btcuah&tonce=${tonce}&signature=${signature}`, cb);
}

/*
    [{
    "id": идентификатор сделки,
    "price": цена за биткоин,
    "volume": объём в биткоинах,
    "funds": объём в гривнах,
    "market": идентификатор рынка,
    "created_at": время сделки,
    "side": bid или ask
}]
*/
const myHistory = cb => {
    let tonce = Date.now();
    let signature = createSignature('GET', '/api/v2/trades/my', `access_key=${access_key}&market=btcuah&tonce=${tonce}`);
    return jsonRequest(`https://kuna.io/api/v2/trades/my?access_key=${access_key}&market=btcuah&tonce=${tonce}&signature=${signature}`, cb);
}

module.exports = {
    timestamp,
    btcuah,
    orderbook,
    trades,
    myInfo,
    postMyOrder,
    deleteMyOrder,
    myOrders,
    myHistory
}