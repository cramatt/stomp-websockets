const uuid = require('uuid');
const Stomp = require('stompjs/lib/stomp').Stomp;
import {Realtime} from './../realtime';

export const hello = {
  template: require('./hello.html'),
  /* @ngInject */
  controller($log, userStore) {
    // create unique client id
    // this is used in all requests to identify the client
    // @todo consider if we should include in connect
    // @todo consider if subscribes have different ids
    const clientId = uuid.v4();

    // create new STOMP connection via websockets
    // You can also reuse an existing websocket (ex SockJS) using Stomp.over(ws)
    const client = Stomp.client('ws://127.0.0.1:4444');

    // simple immutable store
    // this avoids needing $scope.$apply() in our socket events
    // see `mobx-autorun` directive which magically runs digest cycle when store changes
    this.users = userStore.getAll();

    // connect to STOMP server
    client.connect({
      id: clientId
    }, () => {
      $log.log('Successful connect. Client can now subscribe.');
      const handleGet = message => {
        const body = angular.fromJson(message.body);
        const headers = message.headers;
        $log.log('get', headers, body);
        userStore.replaceAll(body);
      };
      client.subscribe('rest/user', handleGet, {
        id: clientId
      });
    });

    // Realtime interface
    // @todo implement getAndSubscribe method which addresses the common use case
    const realtime = new Realtime(client, clientId);

    // simple interface for testing CRUD actions
    // in realtiy these would be built out as components
    this.runGet = () => {
      realtime.get('rest/user');
    };

    this.runCreate = user => {
      realtime.create('/user', user);
    };

    this.runUpdate = user => {
      realtime.update(`/user/${user.id}`, user);
    };

    this.runDelete = user => {
      realtime.delete(`/user/${user.id}`);
    };
  }
};
