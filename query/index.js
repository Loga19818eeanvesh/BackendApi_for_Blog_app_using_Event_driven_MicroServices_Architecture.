const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const axios = require('axios');

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
            posts[postId].comments.push({id:req.body.data.id,content:req.body.data.content,status:req.body.data.status});
        }
        else{
            posts[postId]={
                id:postId,
                title:"",
                comments : [{id:req.body.data.id,content:req.body.data.content,status:req.body.data.status}]
            };
        }
    }
    if(req.body.type === "CommentUpdated"){
        const postId=req.body.data.postId;
        if(posts[postId]){
            let flag=0;
            posts[postId].comments.forEach((comment,index,arr) => {
                if(comment.id===req.body.data.id){
                    arr[index]={
                        id:req.body.data.id,
                        content:req.body.data.content,
                        status:req.body.data.status
                    }
                    flag=1;
                }
            });
            if(flag===0){
                posts[postId].comments.push({id:req.body.data.id,content:req.body.data.content,status:req.body.data.status});
            }
        }
        else{
            posts[postId]={
                id:postId,
                title:"",
                comments : [{id:req.body.data.id,content:req.body.data.content,status:req.body.data.status}]
            };
        }
    }
    
    res.send({});
});

app.listen(2800,async ()=>{
    console.log('port 2800');
    const res=await axios.get('http://event-bus-srv:2823/events');
    for(let event of res.data){
        const type=event.type;
        const data=event.data;
        if(type === "PostCreated"){
            if(posts[data.id]){
                posts[data.id].title=data.title;
            }
            else{
                posts[data.id]={
                    id : data.id,
                    title : data.title,
                    comments : []
                }
            }
        }
        if(type === "CommentCreated"){
            const postId=data.postId;
            if(posts[postId]){
                posts[postId].comments.push({id:data.id,content:data.content,status:data.status});
            }
            else{
                posts[postId]={
                    id:postId,
                    title:"",
                    comments : [{id:data.id,content:data.content,status:data.status}]
                };
            }
        }
        if(type === "CommentUpdated"){
            const postId=data.postId;
            if(posts[postId]){
                let flag=0;
                posts[postId].comments.forEach((comment,index,arr) => {
                    if(comment.id===data.id){
                        arr[index]={
                            id:data.id,
                            content:data.content,
                            status:data.status
                        }
                        flag=1;
                    }
                });
                if(flag===0){
                    posts[postId].comments.push({id:data.id,content:data.content,status:data.status});
                }
            }
            else{
                posts[postId]={
                    id:postId,
                    title:"",
                    comments : [{id:data.id,content:data.content,status:data.status}]
                };
            }
        }
    }
});