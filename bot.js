const kunaAPI = require('./kunaAPI');

const uahBudget = 10; 

class Bot {
    constructor() {
        this.isRun = false;
    }

    start () {
        if (this.isRun) return;

        let self = this;

        this.isRun = true;

        this.timeoutId = setTimeout(function timeout() {
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