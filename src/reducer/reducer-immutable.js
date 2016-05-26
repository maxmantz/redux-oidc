import { fromJS } from 'immutable';
import { USER_EXPIRED, REDIRECT_SUCCESS, USER_FOUND, SILENT_RENEW_ERROR, SESSION_TERMINATED } from '../constants';

const initialState = fromJS({
  user: null,
});

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case USER_EXPIRED:
    case SILENT_RENEW_ERROR:
    case SESSION_TERMINATED:
      return state.set('user', null);
    case REDIRECT_SUCCESS:
    case USER_FOUND:
      return fromJS({
        user: action.payload
      });
    default:
      return state;
  }
}
