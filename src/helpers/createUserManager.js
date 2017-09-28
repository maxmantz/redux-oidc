// check that the UserManager is present
let UserManager;

try {
  UserManager = require('oidc-client').UserManager;
} catch (e) {
  try {
    UserManager = require('oidc-client-fetch').UserManager;
  } catch (e) {
    throw new Error("redux-oidc: Couldn't find UserManager. Please install either 'oidc-client' or 'oidc-client-fetch'.");
  }
}

export default function createUserManager(config) {
  return new UserManager(config);
}
