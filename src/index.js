/* eslint-disable */

import angular from 'angular';

import {hello} from './app/hello';
import {userStore} from './user-store.js';
import {userDsStore} from './user-ds-store.js';
import {userReducer} from './user-reducer.js';
import 'angular-ui-router';
import routesConfig from './routes';

import ngRedux from 'ng-redux';
import { combineReducers } from 'redux';

import 'ng-mobx/lib/ng-mobx';

import './index.scss';

export const app = 'app';

angular
  .module(app, ['ui.router', 'ngRedux', 'ng-mobx'])
  .config(routesConfig)
  .config(($ngReduxProvider) => {
    let reducer = combineReducers({
      reducer1: userReducer
    });
    $ngReduxProvider.createStoreWith(reducer);
  })
  .service('userStore', userStore)
  .service('userDsStore', function() {
    return userDsStore;
  })
  .component('app', hello);
