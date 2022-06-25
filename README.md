# BackendApi for BlogApp using Event driven MicroServices Architecture.

##Api contains five microservices 
1. Posts service to post blog running on port 2828
2. Comments service to add comments to post running on port 2803
3. Query service to send all posts to client running on port 2800
4. Moderation service to filter comments running on port 2801
5. Event-bus to send events between services running on port 2823

Used Docker to create containers of services and Kubernetes for deployment and network between services.

## Tools/Technologies used
Node.js, Express.js, Docker, Kubernetes

## How to start
1. Run 'npm install' on terminal in each subfolder to download all dependencies  
2. Run 'npm start' on each subfolder to start all services
3. You need to have node.js installed in your machine

