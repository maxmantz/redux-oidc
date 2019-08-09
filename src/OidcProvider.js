import PropTypes from 'prop-types';
import React from 'react';
import { userExpired, userFound, silentRenewError, sessionTerminated, userExpiring, userSignedOut } from './actions';

class OidcProvider extends React.Component {
  static propTypes = {
    // the user manager from oidc-client
    userManager: PropTypes.object.isRequired,

    // the redux-store
    store: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.userManager = props.userManager;
    // register the event callbacks
    this.userManager.events.addUserLoaded(this.onUserLoaded);
    this.userManager.events.addSilentRenewError(this.onSilentRenewError);
    this.userManager.events.addAccessTokenExpired(this.onAccessTokenExpired);
    this.userManager.events.addAccessTokenExpiring(this.onAccessTokenExpiring);
    this.userManager.events.addUserUnloaded(this.onUserUnloaded);
    this.userManager.events.addUserSignedOut(this.onUserSignedOut);
  }

  componentWillUnmount() {
    // unregister the event callbacks
    this.userManager.events.removeUserLoaded(this.onUserLoaded);
    this.userManager.events.removeSilentRenewError(this.onSilentRenewError);
    this.userManager.events.removeAccessTokenExpired(this.onAccessTokenExpired);
    this.userManager.events.removeAccessTokenExpiring(this.onAccessTokenExpiring);
    this.userManager.events.removeUserUnloaded(this.onUserUnloaded);
    this.userManager.events.removeUserSignedOut(this.onUserSignedOut);
  }

  // event callback when the user has been loaded (on silent renew or redirect)
  onUserLoaded = (user) => {
    this.props.store.dispatch(userFound(user));
  };

  // event callback when silent renew errored
  onSilentRenewError = (error) => {
    this.props.store.dispatch(silentRenewError(error));
  };

  // event callback when the access token expired
  onAccessTokenExpired = () => {
    this.props.store.dispatch(userExpired());
  };

  // event callback when the user is logged out
  onUserUnloaded = () => {
    this.props.store.dispatch(sessionTerminated());
  };

  // event callback when the user is expiring
  onAccessTokenExpiring = () => {
    this.props.store.dispatch(userExpiring());
  }

  // event callback when the user is signed out
  onUserSignedOut = () => {
    this.props.store.dispatch(userSignedOut());
  }

  render() {
    return React.Children.only(this.props.children);
  }
}

export default OidcProvider;
