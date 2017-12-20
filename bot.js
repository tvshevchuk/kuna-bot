const kunaAPI = require('./kunaAPI');

const delay = 5000;
const netCoeff = 0.9975;
const market = 'btcuah';

class Bot {
    constructor() {
        this.uahBudget = 0;
        this.isRun = false;
    }

    start (uahBudget) {
        console.log(`${market} bot started`);
        if (this.isRun) return;

        let self = this;
        let isSell, maxSellPrice, soldFunds, boughtenVolume;
        
        this.isRun = true;
        this.uahBudget = uahBudget;
        
        kunaAPI.myHistory(market).then(myHistory => {
            return myHistory[0];
        }).then(myLastTrade => {

            //TODO: sell btc if current btc budget is less then requested uah budget
            isSell = (myLastTrade.side === 'bid') && (parseFloat(myLastTrade.funds) > this.uahBudget - 1);
            if (isSell) {
                soldFunds = parseFloat(myLastTrade.funds);
                boughtenVolume = parseFloat(myLastTrade.volume);
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
                                    console.log(`maxSellPrice: ${maxSellPrice}`);
                                    resolve();
                                } else {
                                    if (maxSellPrice) {
                                        let options = {
                                            side: 'sell',
                                            volume: boughtenVolume,
                                            market: 'btcuah',
                                            price: bid
                                        }
                                        kunaAPI.postMyOrder(options).then(order => {
                                            console.log('Sold order: ', order);
                                            isSell = false;
                                            maxSellPrice = 0;
                                            resolve();
                                        }).catch(error => reject(error));
                                    } else {
                                        console.log(`bid: ${bid}`);
                                        resolve();
                                    }
                                }
                            }
                            else {
                                maxSellPrice = 0;
                                console.log(`bid: ${bid}`);
                                resolve();
                            }
                        } else {
                            //TODO: include tax
                            boughtenVolume = this.uahBudget / ask;
                            let options = {
                                side: 'buy',
                                volume: boughtenVolume,
                                market: 'btcuah',
                                price: ask
                            }
                            kunaAPI.postMyOrder(options).then(order => {
                                console.log('Boughten order: ', order);
                                isSell = true;
                                maxSellPrice = 0;
                                boughtenVolume = parseFloat(order.volume);
                                soldFunds = parseFloat(order.volume) * parseFloat(order.price);
                                resolve();
                            }).catch(error => reject(error));
                        }
                    }).catch(error => reject(error));
                });
                
                promise.then(() => {
                    this.timeoutId = setTimeout(timeout, delay);        
                }).catch(error => {
                    console.log(`ERROR: ${error}`);
                    this.timeoutId = setTimeout(timeout, delay * 2);
                });
            };

            this.timeoutId = setTimeout(timeout, delay);
        });
    }

    stop () {
        console.log(`${market} bot stoped`);
        this.isRun = false;
        clearTimeout(this.timeoutId);
    }
}

const bot = new Bot();

module.exports = bot;