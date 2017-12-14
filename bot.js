const kunaAPI = require('./kunaAPI');

class Bot {
    constructor() {
        this.isRun = false;
    }

    start () {
        if (this.isRun) return;

        let i = 0;
        let self = this;

        this.isRun = true;
        this.timeoutId = setTimeout(function timeout() {
            console.log(++i);
            self.timeoutId = setTimeout(timeout, 2000);
        }, 2000);
    }

    stop () {
        this.isRun = false;
        clearTimeout(this.timeoutId);
    }
}

const bot = new Bot();

module.exports = bot;