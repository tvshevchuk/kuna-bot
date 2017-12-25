/**
 * startFirstMethod (market, uahBudget) {
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
                        let bid = fetchLastPriceFromOrderBook(orderBook, 'bids');
                        let ask = fetchLastPriceFromOrderBook(orderBook, 'asks');
    
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
 */