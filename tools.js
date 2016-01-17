// tools.js
// ========
module.exports = {
  logToConsole: function (msgType, msg) {
    console.log(msgType + ' - ' + createDateStamp() + msg);
  },
  deleteItemInArrayById: function (itemId, array){
    array = JSON.parse(array);
    for(var i = 0; i < array.length; i++) {
      if(array[i].id === itemId) {
        array.splice(i, 1);
        return array;
      }
    }
  },
  //webSocket can be one socket ar all sockets bound to the server
  sendToWebSockets: function (file, webSocket) {
    global.fs.readFile(file, 'utf8', function(err, todos) {
  		todos = JSON.parse(todos);
  		webSocket.emit('todos', todos);
  	});
  }
};

//Helper functions.
var createDateStamp = function () {
  return '[' + new Date().toUTCString() + ']: ';
}
