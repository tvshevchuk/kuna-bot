const express = require('express');
const basicAuth = require('express-basic-auth');

const kunaAPI = require('./kunaAPI');

const router = express.Router();

const sendBodyAsResponse = (res) => {
    return (err, response, body) => {
        if (err) throw err;
        res.send(body);
    };
};

router.get('/btcuah', (req, res, next) => {
    kunaAPI.btcuah(sendBodyAsResponse(res));   
});

router.get('/orderbook', (req, res, next) => {
    kunaAPI.orderbook(sendBodyAsResponse(res));   
});

router.get('/trades', (req, res, next) => {
    kunaAPI.trades(sendBodyAsResponse(res));   
});

const auth = basicAuth({
    users: {'tvshevchuk': 'mypass'}
});

router.get('/myinfo', auth, (req, res, next) => {
    kunaAPI.myInfo(sendBodyAsResponse(res));   
});

router.post('/postorder', auth, (req, res, next) => {
    let { body } = req;
    kunaAPI.postMyOrder(body, sendBodyAsResponse(res));
});

router.post('/deleteorder', auth, (req, res, next) => {
    let { body } = req;
    kunaAPI.deleteMyOrder(body, sendBodyAsResponse(res));
});

router.get('/myorders', auth, (req, res, next) => {
    kunaAPI.myOrders(sendBodyAsResponse(res));   
});

router.get('/myhistory', auth, (req, res, next) => {
    kunaAPI.myHistory(sendBodyAsResponse(res));   
});

module.exports = router;