const express = require('express');
const bodyParser = require('body-parser'); 
const axios  = require('axios');                                                       

const app=express();

app.use(bodyParser.json());

app.post('/events',(req,res)=>{
    if(req.body.type=="CommentCreated"){
        const status = req.body.data.content.includes('loga19818eeanvesh') ? 'rejected' : 'approved' ;

        axios.post('http://event-bus-srv:2823/events',{
            type : "CommentModerated",
            data:{
                ...req.body.data,
                status : status
            }
        });
    }

    res.send({});
});

app.listen(2801,()=>{
    console.log("running on 2801 port");
})