import co from 'co';
import { userFound, userExpired } from '../actions';

export function* loadUserHandler(store, userManager) {
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
