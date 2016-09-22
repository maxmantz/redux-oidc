import { USER_EXPIRED, REDIRECT_SUCCESS, USER_FOUND, USER_NOT_FOUND, SILENT_RENEW_ERROR, SESSION_TERMINATED } from '../constants';

const initialState = {
  user: null,
  isLoadingUser: true
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case USER_EXPIRED:
        return Object.assign({}, { ...state }, { isLoadingUser: false });
    case SILENT_RENEW_ERROR:
        return Object.assign({}, { ...state }, { isLoadingUser: false });        
    case SESSION_TERMINATED:
      return Object.assign({}, { ...state }, { user: null });
    case REDIRECT_SUCCESS:
    case USER_FOUND:
      return Object.assign({}, { ...state }, { user: action.payload, isLoadingUser: false });
    default:
      return state;
  }
}
