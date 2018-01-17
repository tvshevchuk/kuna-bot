const {btcuahBot, ethuahBot} = require('../bot');

const getBotByMarket = market => {
    switch (market) {
        case 'btcuah': return btcuahBot;
        case 'ethuah': return ethuahBot;
        default: return;
    }
}

module.exports = {
    getBotByMarket
}