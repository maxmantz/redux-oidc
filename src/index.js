import createOidcMiddleware from "./oidcMiddleware";

// redux-oidc components
import CallbackComponent from "./CallbackComponent";
import OidcProvider from "./OidcProvider";
import SignoutCallbackComponent from "./SignoutCallbackComponent";
import createUserManager from "./helpers/createUserManager";
import loadUser from "./helpers/loadUser";
import processSilentRenew from "./helpers/processSilentRenew";
import reducer from "./reducer/reducer";
import createImmutableReducer from "./reducer/reducer-immutable";

// constants
import {
  LOADING_USER,
  LOAD_USER_ERROR,
  SESSION_TERMINATED,
  SILENT_RENEW_ERROR,
  USER_EXPIRED,
  USER_EXPIRING,
  USER_FOUND,
  USER_SIGNED_OUT,
} from "./constants";

// actions
import {
  loadUserError,
  loadingUser,
  sessionTerminated,
  silentRenewError,
  userExpired,
  userExpiring,
  userFound,
  userSignedOut,
} from "./actions";

export default createOidcMiddleware;

export {
  CallbackComponent,
  LOADING_USER,
  LOAD_USER_ERROR,
  OidcProvider,
  SESSION_TERMINATED,
  SILENT_RENEW_ERROR,
  SignoutCallbackComponent,
  USER_EXPIRED,
  USER_EXPIRING,
  USER_FOUND,
  USER_SIGNED_OUT,
  createImmutableReducer,
  createUserManager,
  loadUser,
  loadUserError,
  loadingUser,
  processSilentRenew,
  reducer,
  sessionTerminated,
  silentRenewError,
  userExpired,
  userExpiring,
  userFound,
  userSignedOut,
};
