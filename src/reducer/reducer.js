import { USER_EXPIRED, REDIRECT_SUCCESS, USER_FOUND } from '../constants';

const initialState = {
  user: null
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case USER_EXPIRED:
      return Object.assign({}, { ...state }, { user: null });
    case REDIRECT_SUCCESS:
    case USER_FOUND:
      return Object.assign({}, { ...state }, { user: action.payload });
    default:
      return state;
  }
}
