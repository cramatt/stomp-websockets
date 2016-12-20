import {
  DataStore
} from 'js-data';

export const userDsStore = new DataStore().defineMapper('user', {
  schema: {
    properties: {
      id: {
        type: 'number'
      },
      name: {
        type: 'string'
      },
      favFood: {
        type: 'string'
      }
    }
  }
});
