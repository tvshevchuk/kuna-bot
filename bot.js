const kunaAPI = require('./kunaAPI');
const Order = require('./models/orderModel');
const { fetchLastPriceFromOrderBook } = require('./kunaUtils');

const delay = 2000;
const netCoeff = 0.9975;

class Bot {
    constructor() {
        this.uahBudget = {
            btcuah: 0,
            ethuah: 0
        };
        this.isRun = {
            btcuah: false,
            ethuah: false
        };
        this.timeoutId = {
            btcuah: null,
            ethuah: null
        };
    }

    startSecondMethod (market, uahBudget, timeLimit) {
        console.log(`${market} bot started`);
        if (this.isRun[market]) return;

        this.isRun[market] = true;
        this.uahBudget[market] = uahBudget;

        let ask, bid;
        let askQueue = [], bidQueue = [];
        let isAskMin = false, isBidMax = false;
        let i = 0;

        const timeout = () => {
            kunaAPI.orderbook(market)
            .then(orderBook => {
                bid = fetchLastPriceFromOrderBook(orderBook, 'bids');
                ask = fetchLastPriceFromOrderBook(orderBook, 'asks');
                
                isAskMin = ask < Math.min(...askQueue);
                isBidMax = bid > Math.max(...bidQueue);

                console.log(`${++i}: ask: ${ask}, bid: ${bid}, askMin: ${isAskMin}, bidMax: ${isBidMax}`);

                askQueue.push(ask);
                bidQueue.push(bid);

                if (askQueue.length > timeLimit * Math.floor(60 * 1000 / delay)) {
                    askQueue.shift();
                    bidQueue.shift();

                    if (isAskMin) {
                        return Order.find({method: 'second', market}).sort({createdAt: -1})
                        .then(orders => {
                            if (!orders.length || (orders.length < 5 && Date.now() - orders[0].createdAt.getTime() > timeLimit * 60 * 1000)) {
                                let options = {
                                    side: 'buy',
                                    volume: this.uahBudget[market] / ask,
                                    market,
                                    price: ask
                                };
                                return kunaAPI.postMyOrder(options)
                                .then(order => {
                                    return kunaAPI.myOrders(market).then(orders => {
                                        return orders.length ? order : Object.assign(order, {isBoughten: true});
                                    })
                                })
                                .then(order => {
                                    if (order.isBoughten) {
                                        console.log('Boughten order: ', order);
                                        let newOrder = new Order(Object.assign(order, {
                                            createdAt: new Date(),
                                            method: 'second'
                                        }));
                                        return newOrder.save();
                                    } else return kunaAPI.deleteMyOrder({id: order.id});
                                });
                            }
                        })
                    }
                }
            })
            .then(() => {
                if (askQueue.length === timeLimit * Math.floor(60 * 1000 / delay) && isBidMax) {
                    return Order.find({method: 'second', market}).sort({price: -1})
                    .then(orders => {
                        if (!!orders.length && bid > orders[0].price) {
                            let options = {
                                side: 'sell',
                                volume: orders[0].volume,
                                market,
                                price: bid
                            }
                            return kunaAPI.postMyOrder(options).then((order) => {
                                console.log('Sold order: ', order);
                                return Order.find({price: orders[0].price}).remove();
                            })
                        }
                    })
                } 
            })
            .then(() => {
                this.timeoutId[market] = setTimeout(timeout, delay);
            })
            .catch((error) => {
                console.log('Error: ' + error);
                this.timeoutId[market] = setTimeout(timeout, delay * 10);
            })
        }
        this.timeoutId[market] = setTimeout(timeout, delay);
    }

    stopSecondMethod (market) {
        console.log(`${market} bot stoped`);
        this.isRun[market] = false;
        clearTimeout(this.timeoutId[market]);
    }
}

const bot = new Bot();

module.exports = bot;