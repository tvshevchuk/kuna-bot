const fetchLastPriceFromOrderBook = (orderbook, type) => {
    if (!orderbook || !orderbook[type]) throw 'Incorrect orderbook!';

    let lastPrice = orderbook[type].find(order => !isNaN(parseFloat(order.price))).price;

    if (lastPrice) {
        return lastPrice;
    } else {
        throw 'Incorrect prices in orderbook!';
    }
}

module.exports = {
    fetchLastPriceFromOrderBook
}