import {
  USER_EXPIRED,
  USER_FOUND,
  SILENT_RENEW_ERROR,
  SESSION_TERMINATED,
  LOADING_USER,
  USER_SIGNED_OUT
} from '../constants';

const initialState = {
  user: null,
  isLoadingUser: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case USER_EXPIRED:
        return Object.assign({}, { ...state }, { user: null, isLoadingUser: false });
    case SILENT_RENEW_ERROR:
        return Object.assign({}, { ...state }, { user: null, isLoadingUser: false });
    case SESSION_TERMINATED:
    case USER_SIGNED_OUT:
      return Object.assign({}, { ...state }, { user: null, isLoadingUser: false });
    case USER_FOUND:
      return Object.assign({}, { ...state }, { user: action.payload, isLoadingUser: false });
    case LOADING_USER:
      return Object.assign({}, {...state}, { isLoadingUser: true });
    default:
      return state;
  }
}
