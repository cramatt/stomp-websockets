/* eslint-disable */

//const stompjs = require("stompjs/lib/stomp.js");
const uuid = require('uuid');

export const hello = {
  template: require('./hello.html'),
  /*@ngInject*/
  controller($log, $scope) {
    // create new STOMP connection via websockets
    var ws = new WebSocket('ws://127.0.0.1:4444');
    console.log(Stomp);
    var client = Stomp.client('ws://127.0.0.1:4444');

    var clientId = uuid.v4();
    console.log(clientId);

    // the client is notified when it is connected to the server.
    client.connect(null, null, function setupSubscriptions(frame) {
      console.log('setupSubscriptions for frame', frame);
      client.subscribe('get/' + clientId, handleGet);
      // client.subscribe('update', handleUpdate);
      // client.subscribe('create', handleCreate);
      // client.subscribe('delete', handleDelete);
    });

    // client subscription so we can unsub

    // subscribe to 
    

    var handleGet = (message) => {
      let body = angular.fromJson(message.body);
      let headers = message.headers;
      $log.log('get', headers, body);
      this.users = body;
      $scope.$apply();
    }

    function handleUpdate(message) {
      let body = angular.fromJson(message.body);
      let headers = message.headers;
      $log.log('update', headers, body);
    }

    function handleCreate(message) {
      let body = angular.fromJson(message.body);
      let headers = message.headers;
      $log.log('create', headers, body);
    }

    function handleDelete(message) {
      let body = angular.fromJson(message.body);
      let headers = message.headers;
      $log.log('delete', headers, body);
    }

    // Realtime interface  

    class Realtime {
      constructor(id) {
        this.id = id;
      }
      _getIdFromUrl(url) {
        var parts = url.split('/');
        return parts[parts.length - 1];
      }
      get(url) {
        client.send('get/' + clientId, {
          url: url,
          action: 'get',
          id: this.id,
          transaction: uuid.v4()
        });
      }
      update(url, newBody) {
        client.send('update', {
          url: url,
          action: 'update',
          resourceId: this._getIdFromUrl(url)
        }, angular.toJson(newBody));
      }
      create(url, newBody) {
        client.send('create', {
          url: url,
          action: 'create',
          resourceId: this._getIdFromUrl(url)
        }, newBody);
      }
      delete(url) {
        client.send('delete', {
          url: url,
          action: 'delete',
          resourceId: this._getIdFromUrl(url)
        });
      }
    }

    // some tests 

    var realtime = new Realtime(clientId);

    function testConnection() {
      //realtime.get('/user');
      // realtime.create('/user');
      // realtime.update('/user/1', {
      //   name: 'Matt'
      // });
    }

    this.runGet = function () {
      ws.send('a commend');
      //realtime.get('/user');
    }

    this.runCreate = function () {
      realtime.create('/user', {
        name: 'Sammy',
        favFood: 'Mac and Cheese'
      });
    }

    setTimeout(testConnection, 1000);

  }
};
