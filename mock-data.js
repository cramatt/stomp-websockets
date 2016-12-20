const uuid = require('uuid');

module.exports = {
  users: [{
    id: uuid.v4(),
    name: 'Tim',
    favFood: 'Tacos'
  }, {
    id: uuid.v4(),
    name: 'Matt',
    favFood: 'Cheese'
  }, {
    id: uuid.v4(),
    name: 'Chris',
    favFood: 'Peanut Butter'
  }, {
    id: uuid.v4(),
    name: 'Marty',
    favFood: 'Avacados'
  }],
  sessions: [{
    id: uuid.v4(),
    name: 'Test Session 1',
    state: 'STOPPED'
  }, {
    id: uuid.v4(),
    name: 'Test Session 2',
    state: 'PAUSED'
  }]
};
