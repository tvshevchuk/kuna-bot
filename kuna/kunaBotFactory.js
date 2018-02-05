const kunaBot = require('./kunaBot');

class BotFactory {
    constructor() {
        this.botPool = {
            btcuah: null,
            ethuah: null
        }

        this.markets = Object.keys(this.botPool);
    }

    initAllKunaBots() {
        this.markets.forEach(market => {
            this.botPool[market] = new kunaBot(market);
        });
    }

    getBotByMarket(market) {
        return this.botPool[market];
    }
}

module.exports = new BotFactory();