const express = require('express');
const basicAuth = require('express-basic-auth');

const kunaAPI = require('./kunaAPI');

const router = express.Router();

router.get('/btcuah', (req, res, next) => {
    kunaAPI.btcuah((err, response, body) => {
        if (err) throw err;
        res.send(body);
    });   
});

router.get('/orderbook', (req, res, next) => {
    kunaAPI.orderbook((err, response, body) => {
        if (err) throw err;
        res.send(body);
    });   
});

router.get('/trades', (req, res, next) => {
    kunaAPI.trades((err, response, body) => {
        if (err) throw err;
        res.send(body);
    });   
});

const auth = basicAuth({
    users: {'tvshevchuk': 'mypass'}
});

router.get('/myinfo', auth, (req, res, next) => {
    kunaAPI.myInfo((err, response, body) => {
        if (err) throw err;
        res.send(body);
    });   
});

router.get('/myhistory', auth, (req, res, next) => {
    kunaAPI.myHistory((err, response, body) => {
        if (err) throw err;
        res.send(body);
    });   
});

module.exports = router;