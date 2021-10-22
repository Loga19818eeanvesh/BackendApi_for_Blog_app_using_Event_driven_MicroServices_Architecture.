const express = require('express');
const bodyParser = require('body-parser');
const axios  = require('axios');

const app = express();
app.use(bodyParser.json());

app.post('/events', async (req,res) => {
    const event = req.body;

    await axios.post('http://localhost:2828/events',event);
    await axios.post('http://localhost:2803/events',event);
    axios.post('http://localhost:2800/events',event);

    res.send({status : 'OK'});
})

app.listen(2823,() => {
    console.log('listening on 2823');
});