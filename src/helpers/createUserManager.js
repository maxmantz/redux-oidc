import { UserManager } from 'oidc-client';

export default function createUserManager(config) {
  return new UserManager(config);
}
