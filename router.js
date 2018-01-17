const express = require('express');
const basicAuth = require('express-basic-auth');

const kunaAPI = require('./kunaAPI');
const Status = require('./models/statusModel');
const { getBotByMarket } = require('./utils/botUtils');

const router = express.Router();

const sendBodyAsResponse = (res) => {
    return result => {
        res.send(result);
    };
};

router.get('/tickers/:market', (req, res) => {
    kunaAPI.tickers(req.params.market).then(sendBodyAsResponse(res));   
});

router.get('/orderbook/:market', (req, res) => {
    kunaAPI.orderbook(req.params.market).then(sendBodyAsResponse(res));   
});

router.get('/trades/:market', (req, res) => {
    kunaAPI.trades(req.params.market).then(sendBodyAsResponse(res));   
});

const auth = basicAuth({
    users: {'tvshevchuk': 'mypass'}
});

router.get('/myinfo', auth, (req, res) => {
    kunaAPI.myInfo().then(sendBodyAsResponse(res));   
});

router.post('/postorder', auth, (req, res) => {
    let { body } = req;
    kunaAPI.postMyOrder(body).then(sendBodyAsResponse(res));
});

router.post('/deleteorder', auth, (req, res) => {
    let { body } = req;
    kunaAPI.deleteMyOrder(body).then(sendBodyAsResponse(res));
});

router.get('/myorders/:market', auth, (req, res) => {
    kunaAPI.myOrders(req.params.market).then(sendBodyAsResponse(res));   
});

router.get('/myhistory/:market', auth, (req, res) => {
    kunaAPI.myHistory(req.params.market).then(sendBodyAsResponse(res));   
});

router.post('/startbot/:market', auth, (req, res) => {
    let { body } = req;
    let bot = getBotByMarket(req.params.market);

    let options = {
        market: req.params.market,
        isRun: true,
        askStory: [],
        bidStory: [],
        uahBudget: body.uahBudget,
        timeLimit: body.timeLimit,
        updatedAt: new Date()
    }

    Status.findOne({ market: req.params.market }).then(status => {
        if (!status) {
            let newStatus = new Status(options);
            return newStatus.save();
        } else {
            status.isRun = true;
            status.uahBudget = body.uahBudget;
            status.timeLimit = body.timeLimit;
            if (Date.now() - status.updatedAt.getTime() > body.timeLimit * 60 * 1000) {
                status.askStory = [];
                status.bidStory = [];
            }
            status.updatedAt = new Date();
            return Status.findOneAndUpdate({ market: req.params.market }, { $set: status });
        }
    }).then(() => {
        bot.startSecondMethod(body.uahBudget, body.timeLimit);
        res.status(200).send({status: 'Bot started'});
    })
});

router.get('/stopbot/:market', auth, (req, res) => {
    let bot = getBotByMarket(req.params.market);
    
    Status.findOneAndUpdate( {market: req.params.market }, { $set: {isRun: false } })
    .then(() => {
        bot.stopSecondMethod();
        res.status(200).send({status: 'Bot stoped'});
    })
});

module.exports = router;