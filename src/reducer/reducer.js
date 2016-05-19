import { USER_EXPIRED, REDIRECT_SUCCESS } from '../constants';

const initialState = {
  user: null
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case USER_EXPIRED:
      return Object.assign({}, { ...state }, { user: null });
    case REDIRECT_SUCCESS:
      return Object.assign({}, { ...state }, { user: action.payload });
    default:
      return state;
  }
}
