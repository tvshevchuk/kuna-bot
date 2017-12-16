const kunaAPI = require('./kunaAPI');

const uahBudget = 50; 
const delay = 5000;

class Bot {
    constructor() {
        this.isRun = false;
    }

    start () {
        if (this.isRun) return;

        let self = this;
        let isSell, maxSellPrice, buyPrice, isPeak, boughtenVolume;
        
        this.isRun = true;

        kunaAPI.myHistory().then(myHistory => {
            return myHistory[0];
        }).then(myLastTrade => {
            isSell = (myLastTrade.side === 'bid') && (parseFloat(myLastTrade.funds) > uahBudget - 1);
            if (isSell) {
                buyPrice = parseFloat(myLastTrade.price);
                boughtenVolume = uahBudget / buyPrice;
                maxSellPrice = 0;
            }

            let timeout = () => {
                let promise = new Promise((resolve, reject) => {
                    kunaAPI.orderbook().then(orderBook => {
                        let bid = parseFloat(orderBook.bids[0].price);
                        let ask = parseFloat(orderBook.asks[0].price);
    
                        if (isSell) {
                            if (bid > buyPrice) {
                                if (bid >= maxSellPrice) {
                                    maxSellPrice = bid;
                                    isPeak = true;
                                    console.log(`maxSellPrice: ${maxSellPrice}`);
                                    resolve();
                                } else {
                                    if (isPeak) {
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
                                        });
                                    } else {
                                        console.log(`bid: ${bid}`);
                                        resolve();
                                    }
                                }
                            }
                            else {
                                console.log(`bid: ${bid}`);
                                resolve();
                            }
                        } else {
                            boughtenVolume = uahBudget / ask;
                            let options = {
                                side: 'buy',
                                volume: boughtenVolume,
                                market: 'btcuah',
                                price: ask
                            }
                            console.log(options);
                            kunaAPI.postMyOrder(options).then(order => {
                                console.log('Boughten order: ', order);
                                isSell = true;
                                maxSellPrice = 0;
                                buyPrice = ask;
                                resolve();
                            });
                        }
                    });
                });
                
                promise.then(() => {
                    this.timeoutId = setTimeout(timeout, delay);        
                });
            };

            this.timeoutId = setTimeout(timeout, delay);
        });
    }

    stop () {
        this.isRun = false;
        clearTimeout(this.timeoutId);
    }
}

const bot = new Bot();

module.exports = bot;