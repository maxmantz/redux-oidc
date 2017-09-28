// check that the UserManager is present
let UserManager;

try {
  UserManager = require('oidc-client').UserManager;
} catch (a) {
  try {
    UserManager = require('oidc-client-fetch').UserManager;
  } catch (b) {
    throw new Error("redux-oidc: Couldn't find UserManager. Please install either 'oidc-client' or 'oidc-client-fetch'.");
  }
}

export default function createUserManager(config) {
  return new UserManager(config);
}
