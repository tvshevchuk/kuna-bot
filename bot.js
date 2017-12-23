const kunaAPI = require('./kunaAPI');
const Order = require('./models/orderModel');

const delay = 5000;
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

    startFirstMethod (market, uahBudget) {
        console.log(`${market} bot started`);
        if (this.isRun[market]) return;

        let isSell, maxSellPrice, soldFunds, boughtenVolume;
        
        this.isRun[market] = true;
        this.uahBudget[market] = uahBudget;
        
        Order.find({method: 'first', market}).sort({createdAt: -1}).then(orders => {
            let myLastTrade = orders && orders[0];

            //TODO: sell btc if current btc budget is less then requested uah budget
            isSell = myLastTrade 
                && (myLastTrade.side === 'buy') 
                && (myLastTrade.price * myLastTrade.volume > this.uahBudget[market] - 1);

            if (isSell) {
                soldFunds = myLastTrade.price * myLastTrade.volume;
                boughtenVolume = myLastTrade.volume;
                maxSellPrice = 0;
            }

            let timeout = () => {
                let promise = new Promise((resolve, reject) => {
                    kunaAPI.orderbook(market).then(orderBook => {
                        let bid = parseFloat(orderBook.bids[0].price);
                        let ask = parseFloat(orderBook.asks[0].price);
    
                        if (isSell) {
                            if (bid * boughtenVolume * netCoeff > soldFunds) {
                                if (bid >= maxSellPrice) {
                                    maxSellPrice = bid;
                                    console.log(`${market} maxSellPrice: ${maxSellPrice}`);
                                    resolve();
                                } else {
                                    if (maxSellPrice) {
                                        let options = {
                                            side: 'sell',
                                            volume: boughtenVolume,
                                            market,
                                            price: bid
                                        }
                                        kunaAPI.postMyOrder(options).then(order => {
                                            console.log('Sold order: ', order);
                                            isSell = false;
                                            maxSellPrice = 0;

                                            Order.find({method: 'first', market}).sort({createdAt: -1}).limit(1).remove({}, (err) => {
                                                if (err) reject(err);
                                                resolve();
                                            })
                                        }).catch(error => reject(error));
                                    } else {
                                        console.log(`${market} bid: ${bid}`);
                                        resolve();
                                    }
                                }
                            }
                            else {
                                maxSellPrice = 0;
                                console.log(`${market} bid: ${bid}`);
                                resolve();
                            }
                        } else {
                            //TODO: include tax
                            boughtenVolume = this.uahBudget[market] / ask;
                            let options = {
                                side: 'buy',
                                volume: boughtenVolume,
                                market,
                                price: ask
                            }
                            kunaAPI.postMyOrder(options).then(order => {
                                console.log('Boughten order: ', order);
                                isSell = true;
                                maxSellPrice = 0;
                                boughtenVolume = parseFloat(order.volume);
                                soldFunds = parseFloat(order.volume) * parseFloat(order.price);
                                
                                let newOrder = new Order(Object.assign(options, {
                                    createdAt: new Date(),
                                    method: 'first'
                                }));
                                return newOrder.save();
                            })
                            .then(() => resolve())
                            .catch(error => reject(error));
                        }
                    }).catch(error => reject(error));
                });
                
                promise.then(() => {
                    this.timeoutId[market] = setTimeout(timeout, delay);        
                }).catch(error => {
                    this.timeoutId[market] = setTimeout(timeout, delay * 2);
                });
            };

            this.timeoutId[market] = setTimeout(timeout, delay);
        });
    }

    stopFirstMethod (market) {
        console.log(`${market} bot stoped`);
        this.isRun[market] = false;
        clearTimeout(this.timeoutId[market]);
    }

    startSecondMethod (market, uahBudget) {
        let askQueue = [], bidQueue = [];

        const timeout = () => {
            kunaAPI.orderbook(market).then(orderBook => {
                let ask = orderBook.asks[0].price;
                let bid = orderBook.bids[0].price;

                let isAskMin = ask < Math.min(...askQueue);
                let isBidMax = bid > Math.max(...bidQueue);

                askQueue.push(ask);
                bidQueue.push(bid);

                if (askQueue.length > 60) {
                    askQueue.shift();
                    bidQueue.shift();

                    let askPromise = new Promise((resolve, reject) => {
                        if (isAskMin) {
                            Order.find({method: 'second', market}).sort({createdAt: -1}).then(orders => {
                                if (orders.length < 5 && Date.now() - orders[0].createdAt.getTime() > 5 * 60 * 1000) {
                                    let options = {
                                        side: 'buy',
                                        volume: this.uahBudget[market] / ask,
                                        market,
                                        price: ask
                                    };
                                    kunaAPI.postMyOrder(options).then(order => {
                                        console.log('Boughten order: ', order);
                                        let newOrder = new Order(Object.assign(options, {
                                            createdAt: new Date(),
                                            method: 'second'
                                        }));
                                        return newOrder.save().then(() => resolve());
                                    }).catch(() => reject());
                                } else resolve();
                            })
                        } else resolve();
                    });

                    askPromise.then(() => {
                        if (isBidMax) {
                            return Order.find({method: 'second', market}).sort({price: -1}).then(orders => {
                                if (bid > orders[0].price) {
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
                    }).then(() => {
                        this.timeoutId[market] = setTimeout(timeout, delay);
                    })
                } else this.timeoutId[market] = setTimeout(timeout, delay);
            }).catch(() => {
                this.timeoutId[market] = setTimeout(timeout, delay * 2);
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