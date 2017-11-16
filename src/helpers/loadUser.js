import { userFound, userExpired, loadUserError, loadingUser, userNotFound } from '../actions';

// stores the redux store here to be accessed by all functions
let reduxStore;

// helper function to set the redux store (for testing)
export function setReduxStore(newStore) {
  reduxStore = newStore;
}

// helper function to get the redux store (for testing)
export function getReduxStore() {
  return reduxStore;
}

// callback function called when the user has been loaded
export function getUserCallback(user) {
  if (user) {
    if (!user.expired) {
      reduxStore.dispatch(userFound(user));
    } else {
      reduxStore.dispatch(userExpired());
    }
  }
  else {
    reduxStore.dispatch(userNotFound());
  }
  return user;
}

// error callback called when the userManager's loadUser() function failed
export function errorCallback(error) {
  console.error(`redux-oidc: Error in loadUser() function: ${error.message}`);
  reduxStore.dispatch(loadUserError());
}

// function to load the current user into the store
// NOTE: use only when silent renew is configured
export default function loadUser(store, userManager) {
  if (!store || !store.dispatch) {
    throw new Error('redux-oidc: You need to pass the redux store into the loadUser helper!');
  }

  if (!userManager || !userManager.getUser) {
    throw new Error('redux-oidc: You need to pass the userManager into the loadUser helper!');
  }

  reduxStore = store;

  reduxStore.dispatch(loadingUser());
  userManager.getUser()
    .then(getUserCallback)
    .catch(errorCallback);
}
