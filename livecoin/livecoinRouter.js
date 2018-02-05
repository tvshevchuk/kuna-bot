const express = require('express');

const publicAPI = require('./livecoinAPI/publicAPI');

const router = express.Router();

const sendBodyAsResponse = (res) => {
    return result => {
        res.send(result);
    };
};

router.get('/ticker', (req, res) => {
    let body = { req };
    res.send();
    //publicAPI.ticker(body).then(sendBodyAsResponse(res));
});

module.exports = router;