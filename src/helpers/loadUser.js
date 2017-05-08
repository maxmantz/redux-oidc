import co from 'co';
import { userFound, userExpired } from '../actions';

export function* loadUserHandler(store, userManager) {
  if (!store || !store.dispatch) {
    throw new Error('redux-oidc: You need to pass the redux store into the loadUser helper!');
  }

  if (!userManager || !userManager.getUser) {
    throw new Error('redux-oidc: You need to pass the userManager into the loadUser helper!');
  }

  const user = yield userManager.getUser();

  if (user && !user.expired) {
    store.dispatch(userFound(user));
  } else {
    store.dispatch(userExpired());
  }
}

export default function loadUser(store, userManager) {
  co(loadUserHandler(store, userManager));
}
