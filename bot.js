const kunaAPI = require('./kunaAPI');
const Order = require('./models/orderModel');
const Status = require('./models/statusModel');
const { fetchLastPriceFromOrderBook } = require('./utils/kunaUtils');

const delay = 2000;
const netCoeff = 0.9975;

class Bot {
    constructor(market) {
        this.market = market;
        this.isRun = false;
        this.timeoutId = null;
        this.askQueue = [];
        this.bidQueue = [];

        this.initBot();
    }

    initBot() {
        Status.findOne({ market: this.market }).then(status => {
            if (!status || !status.isRun) return;

            if (Date.now() - status.updatedAt.getTime() <= status.timeLimit * 60 * 1000) {
                this.askQueue = status.askStory;
                this.bidQueue = status.bidStory;
            }

            this.startSecondMethod(status.uahBudget, status.timeLimit);
        });
    }

    startSecondMethod(uahBudget, timeLimit) {
        console.log(`${this.market} bot started`);
        if (this.isRun) return;

        this.isRun = true;

        let ask, bid;
        let isAskMin = false, isBidMax = false;
        let i = 0, askCount = 0, bidCount = 0;

        const maxArrayLength = timeLimit * Math.floor(60 * 1000 / delay);

        const timeout = () => {
            kunaAPI.orderbook(this.market)
                .then(orderBook => {
                    bid = fetchLastPriceFromOrderBook(orderBook, 'bids');
                    ask = fetchLastPriceFromOrderBook(orderBook, 'asks');

                    isAskMin = ask < Math.min(...this.askQueue);
                    isBidMax = bid > Math.max(...this.bidQueue);

                    console.log(`${++i}: ask: ${ask}, bid: ${bid}, askMin: ${isAskMin}, bidMax: ${isBidMax}`);

                    this.askQueue.push(ask);
                    this.bidQueue.push(bid);
                    askCount++;
                    bidCount++;
                }).then(() => {
                    if (askCount % 10 !== 0) return;

                    return Status.findOneAndUpdate({ market: this.market }, {
                        $set: {
                            askStory: this.askQueue,
                            updatedAt: new Date()
                        }
                    });
                }).then(() => {
                    if (bidCount % 10 !== 0) return;

                    return Status.findOneAndUpdate({ market: this.market }, {
                        $set: {
                            bidStory: this.bidQueue,
                            updatedAt: new Date()
                        }
                    });
                }).then(() => {
                    if (this.askQueue.length > maxArrayLength) {
                        this.askQueue.shift();
                    } else return;

                    return isAskMin && Order.find({ method: 'second', market: this.market })
                        .then(orders => {
                            if (orders.length >= 5 || this.askQueue.length < maxArrayLength) return;

                            let options = {
                                side: 'buy',
                                volume: uahBudget / ask,
                                market: this.market,
                                price: ask
                            };

                            return kunaAPI.postMyOrder(options)
                                .then(order => {
                                    console.log('Boughten order: ', order);
                                    this.askQueue = [];
                                    let newOrder = new Order(Object.assign(order, {
                                        orderId: order.id,
                                        createdAt: new Date(),
                                        method: 'second'
                                    }));
                                    return newOrder.save();
                                });
                        })
                }).then(() => {
                    if (this.bidQueue.length > maxArrayLength) {
                        this.bidQueue.shift();
                    } else return;

                    return isBidMax && Order.find({ method: 'second', market: this.market }).sort({ price: -1 })
                        .then(orders => {
                            const orderForSell = orders.find(order => order.price < bid);
                            if (!orderForSell) return;

                            let options = {
                                side: 'sell',
                                volume: orderForSell.volume,
                                market: this.market,
                                price: bid
                            };
                            let soldOrder;

                            return kunaAPI.postMyOrder(options)
                            .then(order => {
                                if (!order) return;

                                console.log('Sold order: ', soldOrder);
                                this.bidQueue = [];
                                return Order.find({ price: orderForSell.price }).remove();
                            })

                        })
                }).then(() => {
                    this.timeoutId = setTimeout(timeout, delay);
                })
                .catch((error) => {
                    console.log('Error: ' + error);
                    this.timeoutId = setTimeout(timeout, delay * 10);
                })
        }
        this.timeoutId = setTimeout(timeout, delay);
    }

    stopSecondMethod() {
        console.log(`${this.market} bot stoped`);
        this.isRun = false;
        clearTimeout(this.timeoutId);
    }
}

const btcuahBot = new Bot('btcuah');
const ethuahBot = new Bot('ethuah');

module.exports = {
    btcuahBot,
    ethuahBot
};
