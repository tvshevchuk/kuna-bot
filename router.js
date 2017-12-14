const express = require('express');
const basicAuth = require('express-basic-auth');

const kunaAPI = require('./kunaAPI');
const bot = require('./bot');

const router = express.Router();

const sendBodyAsResponse = (res) => {
    return (err, response, body) => {
        if (err) throw err;
        res.send(body);
    };
};

router.get('/btcuah', (req, res) => {
    kunaAPI.btcuah(sendBodyAsResponse(res));   
});

router.get('/orderbook', (req, res) => {
    kunaAPI.orderbook(sendBodyAsResponse(res));   
});

router.get('/trades', (req, res) => {
    kunaAPI.trades(sendBodyAsResponse(res));   
});

const auth = basicAuth({
    users: {'tvshevchuk': 'mypass'}
});

router.get('/myinfo', auth, (req, res) => {
    kunaAPI.myInfo(sendBodyAsResponse(res));   
});

router.post('/postorder', auth, (req, res) => {
    let { body } = req;
    kunaAPI.postMyOrder(body, sendBodyAsResponse(res));
});

router.post('/deleteorder', auth, (req, res) => {
    let { body } = req;
    kunaAPI.deleteMyOrder(body, sendBodyAsResponse(res));
});

router.get('/myorders', auth, (req, res) => {
    kunaAPI.myOrders(sendBodyAsResponse(res));   
});

router.get('/myhistory', auth, (req, res) => {
    kunaAPI.myHistory(sendBodyAsResponse(res));   
});

router.get('/startbot', auth, (req, res) => {
    bot.start();
    res.status(200).send({status: 'Bot started'});
});

router.get('/stopbot', auth, (req, res) => {
    bot.stop();
    res.status(200).send({status: 'Bot stoped'});
});

module.exports = router;