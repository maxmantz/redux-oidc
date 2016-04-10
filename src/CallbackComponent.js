import React, { PropTypes } from 'react';
import createTokenManager from './helpers/createTokenManager';
import { STORAGE_KEY } from './constants';

class CallbackComponent extends React.Component {
  constructor(props) {
    super(props);
    this.onTokenCallbackSuccess.bind(this);
    this.onTokenCallbackError.bind(this);
  }

  onTokenCallbackSuccess() {
    const redirectUrl = localStorage.getItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY);
    
    const { redirectOnSuccess, successCallback, redirectUri } = this.props;
    if (redirectOnSuccess) {
      if (successCallback && typeof(successCallback) === 'function') {
        successCallback();
      }
      window.location = redirectUri ? redirectUri : `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
    }
    else {
      if (successCallback && typeof(successCallback) === 'function') {
        successCallback();
      }
    }
  }

  onTokenCallbackError(error) {
    localStorage.removeItem(STORAGE_KEY);
    const { errorCallback } = this.props;
    if (errorCallback && typeof(errorCallback) === 'function') {
      errorCallback(error);
    }
  }

  componentDidMount() {
    let { redirectOnSuccess } = this.props;
    const manager = createTokenManager(this.props.config);

    if (typeof(redirectOnSuccess) === 'undefined' || typeof(redirectOnSuccess) === 'null') {
      redirectOnSuccess = true;
    }

    // process the token callback
    manager.processTokenCallbackAsync().then(this.onTokenCallbackSuccess, this.onTokenCallbackError);
  }


  get defaultContent() {
    return <div>Redirecting...</div>;
  }

  render() {
    return (
      <div>
        { this.props.children || this.defaultContent }
      </div>
    );
  }
}

CallbackComponent.propTypes = {
  config: PropTypes.object.isRequired,
  errorCallback: PropTypes.func,
  redirectOnSuccess: PropTypes.bool,
  successCallback: PropTypes.func
};

export default CallbackComponent;
