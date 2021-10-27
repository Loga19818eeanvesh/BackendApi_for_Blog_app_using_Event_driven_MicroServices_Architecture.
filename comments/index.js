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
            content:comment,
            status:"pending"
        });
    }
    else{
        commentsByPostId[id]=[];
        commentsByPostId[id].push({
            id:ID,
            content:comment,
            status:"pending"
        });
    }
    await axios.post('http://localhost:2823/events',{
        type:"CommentCreated",
        data:{
            postId : id,
            id : ID,
            content : comment,
            status:"pending"
        }
    });
    res.send(commentsByPostId[id]);
});

app.post('/events',async (req,res)=>{
    //console.log("Event Recieved ",req.body.type);

    if(req.body.type==="CommentModerated"){
        const postId = req.body.data.postId;
        if(commentsByPostId[postId]){
            commentsByPostId[postId].forEach((comment,index,arr) => {
                if(comment.id === req.body.data.id){
                    arr[index].status=req.body.data.status;
                }
            });
            await axios.post("http://localhost:2823/events",{
                type:"CommentUpdated",
                data:{
                    ...req.body.data
                }
            });
        }
    }

    res.send({});
})


app.listen(2803,()=>{
    console.log('port 2803');
});