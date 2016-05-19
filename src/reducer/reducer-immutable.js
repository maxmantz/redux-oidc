import { fromJS } from 'immutable';
import { USER_EXPIRED, REDIRECT_SUCCESS } from '../constants';

const initialState = fromJS({
  user: null,
});

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case USER_EXPIRED:
      return state.set('user', null);
    case REDIRECT_SUCCESS:
      console.log('payload', action.payload);
      return state.set('user', fromJS(action.payload));
    default:
      return state;
  }
}
