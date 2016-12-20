/* eslint-disable */

// @todo better handling when client is removed
// @todo es6

var mockData = require('./mock-data');
var webstomp = require("webstomp");
var app = webstomp();
var uuid = require('node-uuid');
var _ = require('lodash');
var subscribers = {}; // id['get'], id['create']
var subs = {};

// handle connect
app.connect(function (frame) {
  console.log(">> client connected", this);
  // store subscription to deregister later and send messages
  this.hooks = [];
  return this.connected({
    'heart-beat': '0,0',
    server: 'stomp',
    host: "stomp-crud",
    session: uuid.v4(),
    version: "0.1"
  });
});

app.disconnect(function() {
  console.log(">> client disconnected", this);
  _.each(this.hooks, hook => hook());
});

// handle disconnect
app.disconnect(function () {
  console.log("<< client disconnected");
});

// on send of each message type
app.send("update", handleUpdateSend);
app.send("create", handleCreateSend);
app.send("delete", handleDeleteSend);

app.send("rest/user", handleGetSend);
app.subscribe("rest/user", handleGetSubscribe);

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

function handleDeleteSend() {
  console.log('>> client wants to delete send', this);
  mockData.users = _.reject(mockData.users, {id: this.headers.resourceId});
  _sendMessageToAllSubscribers('rest/user', mockData.users);
}

function handleCreateSend() {
  console.log('>> client wants to create send', this);
  var body = JSON.parse(this.body);
  var newUser = {
    id:  uuid.v4(),
    name: body.name,
    favFood: body.favFood
  };
  mockData.users.push(newUser);
  _sendMessageToAllSubscribers('rest/user', mockData.users);
}

function handleUpdateSend() {
  console.log('>> client wants to update send', this);
  var body = JSON.parse(this.body);
  var updatedUser = {
    name: body.name,
    favFood: body.favFood
  };
  var existingIndex = _.findIndex(mockData.users, {id: this.headers.resourceId});
  mockData.users[existingIndex] = _.extend(mockData.users[existingIndex], updatedUser);
  console.log(mockData.users);
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
  if (subscribers[dest]) {
    _.each(subscribers[dest], function (sub) {
      sub(dest, data);
    });
  }
}

// this function works to send to all clients, BUT if a cient has not subscribed then 
// the message will be unhandled.
function _sendToAllSubscribers(dest, data) {
  console.log('>>>>>> trying to send to all users');
  console.log(app.send());
  _.forIn(subs, function (sub, id) {
    console.log('>>>>>>>>> sending to ', sub.headers.id);
    sub.message({
      subscription: sub.headers.id,
      action: sub.headers.action,
      destination: dest,
      "message-id": uuid.v4()
    }, JSON.stringify(data));
  });
  //app.send(dest, JSON.stringify(data));
}

app.listen(4444);

app.on("error", function (err) {
  return console.error(err);
});

console.log("app started ws://localhost:4444");
