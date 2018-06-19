import {
  USER_EXPIRED,
  USER_FOUND,
  USER_NOT_FOUND,
  SILENT_RENEW_ERROR,
  SESSION_TERMINATED,
  LOADING_USER,
  USER_SIGNED_OUT
} from '../constants';

let reducer;

try {
  const { fromJS, Seq } = require('immutable');

    const fromJSGreedy = (js) => {
      return typeof js !== 'object' || js === null ? js :
        Array.isArray(js) ?
        Seq(js).map(fromJSGreedy).toList() :
        Seq(js).map(fromJSGreedy).toMap();
    }

    const initialState = fromJS({
      user: null,
      isLoadingUser: false
    });

    reducer = (state = initialState, action) => {
      switch (action.type) {
        case USER_EXPIRED:
          return fromJS({
            user: null,
            isLoadingUser: false
          });
        case SILENT_RENEW_ERROR:
          return fromJS({
            user: null,
            isLoadingUser: false
          });
        case SESSION_TERMINATED:
        case USER_SIGNED_OUT:
          return fromJS({
            user: null,
            isLoadingUser: false
          });
        case USER_FOUND:
          return fromJSGreedy({
            user: action.payload,
            isLoadingUser: false
          });
        case LOADING_USER:
          return state.set('isLoadingUser', true);
        default:
          return state;
      }
    };
} catch (error) {
  reducer = () => {
    console.error("You must install immutable-js for the immutable reducer to work!");
  };
}

export default reducer;
