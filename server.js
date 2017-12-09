const express = require('express');
const hbs = require('hbs');

const app = express();
const port = process.env.NODE_ENV || 8080;

app.set('view engine', 'hbs');
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.render('index.hbs');
});

app.listen(port, () => {
    console.log(`Listening on ${port} port...`);
})
