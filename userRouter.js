const express = require('express');

const User = require('./models/userModel');

const router = express.Router();

router.post('/register', (req, res) => {
    let { username, password } = req.body;
    let user = new User({ username, password });

    user.save().then(user => res.status(200).send(user))
        .catch(err => res.status(400).send(err));
});

router.post('/login', (req, res) => {
    let { username, password } = req.body;
    res.send();
});

module.exports = router;