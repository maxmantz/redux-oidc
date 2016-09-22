import { fromJS } from 'immutable';
import { USER_EXPIRED, REDIRECT_SUCCESS, USER_FOUND, USER_NOT_FOUND, SILENT_RENEW_ERROR, SESSION_TERMINATED } from '../constants';

const initialState = fromJS({
  user: null,
  isLoadingUser: true
});

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case USER_EXPIRED:
      return state.set('isLoadingUser', false);
    case SILENT_RENEW_ERROR:
      return state.set('isLoadingUser', false);        
    case SESSION_TERMINATED:
      return state.set('user', null);
    case REDIRECT_SUCCESS:
    case USER_FOUND:
      return fromJS({
        user: action.payload,
        isLoadingUser: false
      });
    default:
      return state;
  }
}
