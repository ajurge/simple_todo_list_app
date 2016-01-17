//Global variables should be defined here.
var path = require('path');
var Global = {
    todosFile: path.join(__dirname, '_todos.json'),
    fs: require('fs'),
    uuid: require('node-uuid'),
    //Set the WebSockets io externally after the NodeJS server is configured and started
    io: undefined
};
module.exports = Global;
