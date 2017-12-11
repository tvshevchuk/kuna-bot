const request = require('request');
const hmacSHA256 = require('crypto-js/hmac-sha256');
const hex = require('crypto-js/enc-hex.js');

const btcuah = (cb) => {
    request({
        url: 'https://kuna.io/api/v2/tickers/btcuah',
        json: true
    }, cb);
}

const access_key = 'Yzl4tdCgMWhqITEEXpRJBRR7bKxZsAhH6pSqEHKr';
const private_key = 'KxqcnyGMF4hC8peLMUMP63XWyq5dx3Caqi09yuQw';
    
const createSignature = (tonce) => {
    let path = `GET|/api/v2/members/me|access_key=${access_key}&tonce=${tonce}`;
    return hex.stringify(hmacSHA256(path, private_key));
}

const myInfo = (cb) => {
    let tonce = Date.now();
    let signature = createSignature(tonce);
    request({
        url: `https://kuna.io/api/v2/members/me?access_key=${access_key}&tonce=${tonce}&signature=${hmacDigest}`,
        json: true
    }, cb); 
}

module.exports = {
    btcuah,
    myInfo
}