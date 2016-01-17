# Simple TODO List App

## To use

Node.js is used to serve static files from `public/` and handle requests to the REST API (`/api/todos`) to fetch or delete TODOs. Socket.IO is used to create TODOs and for realtime updates to the clients using the WebSocket protocol. Start a server with the following:

### Node

```sh
npm install
npm start
```

Visit <http://localhost:8000/>. Try opening multiple tabs or browser windows and add/delete TODOs!

## Changing the port

You can change the port number by setting the `$PORT` environment variable before invoking the node.js server, e.g.,

```sh
set PORT=3000
node server.js
```
