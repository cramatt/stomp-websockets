/* eslint-disable */

import angular from 'angular';
import 'angular-ui-router';
import 'ng-mobx/lib/ng-mobx';

import {hello} from './app/hello';
import {userStore} from './user-store.js';
import routesConfig from './routes';

import './index.scss';

export const app = 'app';

angular
  .module(app, ['ui.router', 'ng-mobx'])
  .config(routesConfig)
  .service('userStore', userStore)
  .component('app', hello);
