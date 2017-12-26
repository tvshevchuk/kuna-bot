const express = require('express');
const basicAuth = require('express-basic-auth');

const kunaAPI = require('./kunaAPI');
const bot = require('./bot');

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
    bot.startSecondMethod(req.params.market, body.uahBudget, body.timeLimit);
    res.status(200).send({status: 'Bot started'});
});

router.get('/stopbot/:market', auth, (req, res) => {
    bot.stopSecondMethod(req.params.market);
    res.status(200).send({status: 'Bot stoped'});
});

module.exports = router;