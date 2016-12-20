/* eslint-disable */

var mockData = require('./mock-data');
var webstomp = require("webstomp");
var app = webstomp();
var uuid = require('node-uuid');
var _ = require('lodash');
var subscribers = {}; // id['get'], id['create']

// handle connect
app.connect(function () {
  console.log(">> client connected");
  return this.connected({
    'heart-beat': '0,0',
    server: 'stomp',
    host: "stomp-crud",
    session: uuid.v4(),
    version: "0.1"
  });
});

// handle disconnect
app.disconnect(function () {
  console.log("<< client disconnected");
});

// on send of each message type
app.send("get/:id", handleGetSend);
// app.send("update", function() {});
app.send("create/:id", handleCreateSend);
// app.send("delete", function() {});

app.subscribe("get/:id", handleGetSubscribe);
// app.subscribe("update", function () {});
//app.subscribe("create/:id", handleCreateSubscribe);
// app.subscribe("delete", function () {});

function handleGetSend() {
  console.log('>> client wants to get send', this);
}

function handleCreateSend() {
  console.log('>> client wants to create send', this);
}

function handleGetSubscribe() {
  console.log('>> client wants to subscribe to get', this);
  this.message({
    subscription: this.headers.id,
    action: this.headers.action,
    destination: 'get/' + this.headers.id,
    "message-id": uuid.v4()
  }, JSON.stringify(mockData.users));
}

app.listen(4444);

app.on("error", function (err) {
  return console.error(err);
});

console.log("app started ws://localhost:4444");
