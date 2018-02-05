const request = require('request-promise-native');
const hmacSHA256 = require('crypto-js/hmac-sha256');
const hex = require('crypto-js/enc-hex.js');

const jsonRequest = url => request({url, json: true});
const jsonPostRequest = (url, body) => request({method: 'POST', url, json: true, body});

/**
 * Получить информацию за последние 24 часа по конкретной паре валют.
В ответе есть следующие поля:
max_bid, min_ask - максимальный бид и минимальный аск за последние 24 часа
best_bid, best_ask - лучшие текущие бид и аск
 */
const ticker = (currencyPair) => {
    let url = 'https://api.livecoin.net/exchange/ticker';
    url += convertParamsToUrl({ currencyPair });
    return jsonRequest(url);
}

/**
 * GET /exchange/last_trades
Получить информацию о последних сделках (транзакциях) по заданной паре валют.
Информацию можно получить либо за последний час, либо за последнюю минуту.
 */
const lastTrades = (currencyPair, minutesOrHour, type) => {
    let url = `https://api.livecoin.net/exchange/last_trades?currencyPair=${currencyPair}`;
    url += convertParamsToUrl({ minutesOrHour, type });
    return jsonRequest(url);
}

/**
 * GET /exchange/order_book
Получить ордера по выбранной паре (можно установить признак группировки ордеров по ценам)
 */
const orderBook = (currencyPair, groupByPrice, depth) => {
    let url = `https://api.livecoin.net/exchange/order_book?currencyPair=${currencyPair}`;
    url += convertParamsToUrl({ groupByPrice, depth });
    return jsonRequest(url);
}

/**
 * GET /exchange/all/order_book
Возвращает ордербук по каждой валютной паре
 */
const allOrderBook = (groupByPrice, depth) => {
    let url = `https://api.livecoin.net/exchange/all/order_book`;
    url += convertParamsToUrl({ groupByPrice, depth });
    return jsonRequest(url);
}

/**
 *GET /exchange/maxbid_minask
Возвращает максимальный бид и минимальный аск в текущем стакане 
 */
const maxBidMinAsk = (currencyPair) => {
    let url = `https://api.livecoin.net/exchange/maxbid_minask`;
    url += convertParamsToUrl({ currencyPair });
    return jsonRequest(url);
}

/**
 * GET /exchange/restrictions
Возвращает ограничения по каждой паре по мин. размеру ордера и максимальному кол-ву знаков после запятой в цене.
 */
const restrictions = () => jsonRequest('https://api.livecoin.net/exchange/restrictions');

/**
 * GET /info/coinInfo
возвращает общую информацию по критовалютам:
name - название
symbol - символ
walletStatus - статус кошелька
normal - Кошелек работает нормально
delayed - Кошелек задерживается (нет нового блока 1-2 часа)
blocked - Кошелек не синхронизирован (нет нового блока минимум 2 часа)
blocked_long - Последний блок получен более 24 ч. назад
down - Кошелек временно выключен
delisted - Монета будет удалена с биржи, заберите свои средства
closed_cashin - Разрешен только вывод
closed_cashout - Разрешен только ввод
withdrawFee - комиссия за вывод
minDepositAmount - мин. сумма пополнения
minWithdrawAmount - мин. сумма вывода
 */
const coinInfo = () => jsonRequest('https://api.livecoin.net/info/coinInfo');

module.exports = {
    ticker,
    lastTrades,
    orderBook,
    allOrderBook,
    maxBidMinAsk,
    restrictions,
    coinInfo
};