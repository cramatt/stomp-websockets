import {
  INCREMENT_COUNTER,
  DECREMENT_COUNTER
} from './user-actions';

export function userReducer(state = [], action) {
  switch (action.type) {
    case INCREMENT_COUNTER:
      return state + 1;
    case DECREMENT_COUNTER:
      return state - 1;
    default:
      return state;
  }
}
