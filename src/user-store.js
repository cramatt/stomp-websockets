
// @see https://github.com/gaui/todoApp-angular-mobx-webpack
// @see https://www.gaui.is/angular-1-5-todo-app/

// @see https://github.com/500tech/ng-mobx/blob/master/lib/ng-mobx.js

// @see http://blog.grossman.io/angular-1-using-redux-architecture/
// @see https://github.com/angular-redux/ng-redux

const mobx = require('mobx');

export function userStore() {
  const users = mobx.observable([]);

  this.getAll = () => {
    return users;
  };

  this.replaceAll = newUsers => {
    users.replace(newUsers);
  };

  this.addUser = user => {
    const newUser = Object.assign({}, user);
    users.push(newUser);
  };
}
