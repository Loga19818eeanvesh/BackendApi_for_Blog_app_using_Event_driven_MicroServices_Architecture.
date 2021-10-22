const express = require('express');
const bodyParser = require('body-parser');
const {randomBytes} = require('crypto');  
const cors = require('cors');  
const axios  = require('axios');                                                           

const app=express();

app.use(bodyParser.json());
app.use(cors());

const commentsByPostId={};

app.get('/posts/:id/comments',(req,res)=>{
    const id=req.params.id;
    res.send(commentsByPostId[id]||[]);
});

app.post('/posts/:id/comments',async (req,res)=>{
    const id=req.params.id;
    const ID = randomBytes(4).toString('hex');
    const comment = req.body.content;
    if(commentsByPostId[id]){
        commentsByPostId[id].push({
            id:ID,
            content:comment
        });
    }
    else{
        commentsByPostId[id]=[];
        commentsByPostId[id].push({
            id:ID,
            content:comment
        });
    }
    await axios.post('http://localhost:2823/events',{
        type:"CommentCreated",
        data:{
            postId : id,
            id : ID,
            content : comment
        }
    });
    res.send(commentsByPostId[id]);
});

app.post('/events',(req,res)=>{
    //console.log("Event Recieved ",req.body.type);

    res.send({});
})


app.listen(2803,()=>{
    console.log('port 2803');
});