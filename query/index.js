const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 

const app=express();

app.use(bodyParser.json());
app.use(cors());

const posts={};

app.get('/posts',(req,res)=>{
    res.send(posts);
});

app.post('/events',(req,res)=>{
    if(req.body.type === "PostCreated"){
        if(posts[req.body.data.id]){
            posts[req.body.data.id].title=req.body.data.title;
        }
        else{
            posts[req.body.data.id]={
                id : req.body.data.id,
                title : req.body.data.title,
                comments : []
            }
        }
    }
    if(req.body.type === "CommentCreated"){
        const postId=req.body.data.postId;
        if(posts[postId]){
            posts[postId].comments.push({id:req.body.data.id,content:req.body.data.content});
        }
        else{
            posts[postId]={
                id:postId,
                title:"",
                comments : [{id:req.body.data.id,content:req.body.data.content}]
            }
        }
    }
    
    res.send({});
});

app.listen(2800,()=>{
    console.log('port 2800');
});