import createUserManager from './createUserManager';

export default function processSilentRenew() {
  const mgr = createUserManager();
  mgr.signinSilentCallback();
}
