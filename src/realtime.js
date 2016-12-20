const uuid = require('uuid');

export class Realtime {
  constructor(client, clientId) {
    this.client = client;
    this.clientId = clientId;
  }
  _getIdFromUrl(url) {
    const parts = url.split('/');
    return parts[parts.length - 1];
  }
  get(url) {
    this.client.send('rest/user', {
      url,
      action: 'get',
      id: this.clientId,
      transaction: uuid.v4()
    });
  }
  update(url, newBody) {
    this.client.send('update', {
      url,
      action: 'update',
      resourceId: this._getIdFromUrl(url)
    }, angular.toJson(newBody));
  }
  create(url, newBody) {
    this.client.send('create', {
      url,
      action: 'create',
      id: this.clientId,
      resourceId: this._getIdFromUrl(url)
    }, angular.toJson(newBody));
  }
  delete(url) {
    this.client.send('delete', {
      url,
      action: 'delete',
      resourceId: this._getIdFromUrl(url)
    });
  }
}
