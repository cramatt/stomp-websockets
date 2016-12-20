/* eslint-disable */

//const stompjs = require("stompjs/lib/stomp.js");
const uuid = require('uuid');
const mobx = require('mobx');
const userActions = require('./../user-actions.js');

import {
  DataStore
} from 'js-data';

export const hello = {
  template: require('./hello.html'),
  /*@ngInject*/
  controller($log, userStore, $timeout, userDsStore, $ngRedux) {
    // create new STOMP connection via websockets
    var client = Stomp.client('ws://127.0.0.1:4444');

    var clientId = uuid.v4();
    console.log(clientId);

    this.users = userStore.getAll();

    // let unsubscribe = $ngRedux.connect(this.mapStateToThis, userActions)(this);
    // $scope.$on('$destroy', unsubscribe);

    // function mapStateToThis(state) {
    //   return {
    //     value: state.counter
    //   };
    // }

    // the client is notified when it is connected to the server.
    client.connect(null, null, function setupSubscriptions(frame) {
      console.log('setupSubscriptions for frame', frame);
      client.subscribe('rest/user', handleGet, {
        id: clientId
      });
      // client.subscribe('update', handleUpdate);
      // client.subscribe('create', handleCreate);
      // client.subscribe('delete', handleDelete);
    });

    // var dispose = mobx.autorun(() => {
    //   this.users = userStore.getAll();
    //   $timeout(function () {
    //     $scope.$apply();
    //   });
    //   console.log('%cNEW STATE:', 'font-weight: bold');
    //   console.log(JSON.stringify(mobx.toJS(this.users), null, 2));
    // });

    // this.$onDestroy = () => {
    //   dispose();
    //   unsubscribe();
    // };

    // client subscription so we can unsub

    // subscribe to 


    var handleGet = (message) => {
      let body = angular.fromJson(message.body);
      let headers = message.headers;
      $log.log('get', headers, body);
      //this.users = body;
      userStore.replaceAll(body);
      //$scope.$apply();
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
        client.subscribe('rest/user', handleGet, {
          id: clientId
        });
        client.send('rest/user', {
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
          id: this.id,
          resourceId: this._getIdFromUrl(url)
        }, angular.toJson(newBody));
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

    var testConnection = () => {
      //realtime.get('/user');
      // realtime.create('/user');
      // realtime.update('/user/1', {
      //   name: 'Matt'
      // });
      this.runGet();
    }

    this.runGet = function () {
      realtime.get('rest/user');
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
