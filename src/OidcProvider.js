import React, { PropTypes } from 'react';
import { userExpired, userFound, silentRenewError, sessionTerminated, userExpiring } from './actions';

class OidcProvider extends React.Component {
  static propTypes = {
    userManager: PropTypes.object.isRequired
  };

  static childContextTypes = {
    userManager: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.userManager = props.userManager;
  }

  getChildContext() {
    return {
      userManager: this.userManager
    };
  }

  componentWillMount() {
    // register the event callbacks
    this.userManager.events.addUserLoaded(this.onUserLoaded);
    this.userManager.events.addSilentRenewError(this.onSilentRenewError);
    this.userManager.events.addAccessTokenExpired(this.onAccessTokenExpired);
    this.userManager.events.addUserUnloaded(this.onUserUnloaded);
    this.userManager.events.addUserExpiring(this.onUserExpiring);
  }

  componentWillUnmount() {
    // unregister the event callbacks
    this.userManager.events.removeUserLoaded(this.onUserLoaded);
    this.userManager.events.removeSilentRenewError(this.onSilentRenewError);
    this.userManager.events.removeAccessTokenExpired(this.onAccessTokenExpired);
    this.userManager.events.removeUserUnloaded(this.onUserUnloaded);
    this.userManager.events.removeUserExpiring(this.onUserExpiring);
  }

  // event callback when the user has been loaded (on silent renew or redirect)
  onUserLoaded = (user) => {
    this.context.store.dispatch(userFound(user));
  };

  // event callback when silent renew errored
  onSilentRenewError = (error) => {
    this.context.store.dispatch(silentRenewError(error));
  };

  // event callback when the access token expired
  onAccessTokenExpired = () => {
    this.context.store.dispatch(userExpired());
  };

  // event callback when the user is logged out
  onUserUnloaded = () => {
    this.context.store.dispatch(sessionTerminated());
  };

  // event callback when the user is expiring
  onUserExpiring = () => {
    this.context.store.dispatch(userExpiring());
  }

  render() {
    return React.Children.only(this.props.children);
  }
}

export default OidcProvider;
