# Simple TODO List App

## To use

Node.js is used to serve static files from `public/` and handle requests to `/api/todos` to fetch or add data. Start a server with the following:

### Node

```sh
npm install
npm start
```

And visit <http://localhost:8000/>. Try opening multiple tabs or browser windows and add/delete the TODOs!

## Changing the port

You can change the port number by setting the `$PORT` environment variable before invoking the node.js server, e.g.,

```sh
set PORT=3000
node server.js
```
