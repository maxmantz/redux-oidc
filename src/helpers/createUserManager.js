import { UserManager } from 'oidc-client-ts';

export default function createUserManager(config) {
  return new UserManager(config);
}
