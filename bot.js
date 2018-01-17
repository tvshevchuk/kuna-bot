const kunaAPI = require('./kunaAPI');
const Order = require('./models/orderModel');
const Status = require('./models/statusModel');
const { fetchLastPriceFromOrderBook } = require('./utils/kunaUtils');

const delay = 2000;
const netCoeff = 0.9975;

class Bot {
    constructor(market) {
        this.market = market;
        this.uahBudget = 0;
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
            
            startSecondMethod(status.uahBudget, status.timeLimit);
        });
    }

    startSecondMethod(uahBudget, timeLimit) {
        console.log(`${this.market} bot started`);
        if (this.isRun) return;

        this.isRun = true;
        this.uahBudget = uahBudget;

        let ask, bid;
        let isAskMin = false, isBidMax = false;
        let i = 0;

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

                    if (this.askQueue.length > timeLimit * Math.floor(60 * 1000 / delay)) {
                        this.askQueue.shift();
                        this.bidQueue.shift();
                    }

                    if (this.askQueue.length % 10 === 0) {
                        Status.findOneAndUpdate({ market: this.market }, {
                            $set: {
                                askStory: this.askQueue,
                                bidStory: this.bidQueue,
                                updatedAt: new Date()
                            }
                        }).then(() => {});
                    }

                    return isAskMin && Order.find({ method: 'second', market: this.market }).sort({ createdAt: -1 })
                        .then(orders => {
                            if (orders.length
                                && (orders.length >= 5 || Date.now() - orders[0].createdAt.getTime() <= timeLimit * 60 * 1000))
                                return;

                            let options = {
                                side: 'buy',
                                volume: this.uahBudget / ask,
                                market: this.market,
                                price: ask
                            };
                            return kunaAPI.postMyOrder(options)
                                .then(order => {
                                    console.log('Boughten order: ', order);
                                    let newOrder = new Order(Object.assign(order, {
                                        orderId: order.id,
                                        createdAt: new Date(),
                                        method: 'second'
                                    }));
                                    return newOrder.save();
                                });
                        })
                })
                .then(() => {
                    if (this.askQueue.length === timeLimit * Math.floor(60 * 1000 / delay) && isBidMax) {
                        return Order.find({ method: 'second', market: this.market }).sort({ price: -1 })
                            .then(orders => {
                                if (!!orders.length && bid > orders[0].price) {
                                    let options = {
                                        side: 'sell',
                                        volume: orders[0].volume,
                                        market: this.market,
                                        price: bid
                                    }
                                    return kunaAPI.postMyOrder(options).then((order) => {
                                        console.log('Sold order: ', order);
                                        return Order.find({ price: orders[0].price }).remove();
                                    })
                                }
                            })
                    }
                })
                .then(() => {
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
