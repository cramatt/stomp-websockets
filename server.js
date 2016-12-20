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
app.send("rest/user", handleGetSend);
// app.send("update", function() {});
app.send("create", handleCreateSend);
// app.send("delete", function() {});

app.subscribe("rest/user", handleGetSubscribe);
// app.subscribe("update", function () {});
app.subscribe("create", handleCreateSubscribe);
// app.subscribe("delete", function () {});

function doAction(destination, data) {
  this.message({
    subscription: this.headers.id,
    action: this.headers.action,
    destination: destination,
    "message-id": uuid.v4()
  }, JSON.stringify(data));
}

function handleGetSend() {
  console.log('>> client wants to get send', this);
  _sendMessageToThisSubscriber(this.headers.id, 'rest/user', mockData.users);
}

function handleCreateSend() {
  console.log('>> client wants to create send', this);
  var body = JSON.parse(this.body);
  mockData.users.push(body);
  _sendMessageToAllSubscribers('rest/user', mockData.users);
}

function handleGetSubscribe() {
  console.log('>> client wants to subscribe to get', this);
  // ensure this user gets all events 
  // @todo clean this up to remove both
  // @todo unsub on disconnect
  subscribers['rest/user'] = subscribers['rest/user'] || [];
  subscribers['rest/user'].push(doAction.bind(this));
  // and get this event
  subscribers[this.headers.id] = subscribers[this.headers.id] || {};
  subscribers[this.headers.id]['rest/user'] = doAction.bind(this);
}

function handleCreateSubscribe() {
  console.log('>> client wants to subscribe to create', this);
  subscribers[this.headers.id] = subscribers[this.headers.id] || {};
  subscribers[this.headers.id]['create'] = doAction.bind(this);
}

////// 

function _sendMessageToThisSubscriber(id, dest, data) {
  if (subscribers[id] && subscribers[id][dest]) {
    subscribers[id][dest](dest, data);
  }
}

function _sendMessageToAllSubscribers(dest, data) {
  if(subscribers[dest]) {
    _.each(subscribers[dest], function(sub) {
      console.log(sub, dest, data);
      sub(dest, data);
    });
  }
}

app.listen(4444);

app.on("error", function (err) {
  return console.error(err);
});

console.log("app started ws://localhost:4444");
