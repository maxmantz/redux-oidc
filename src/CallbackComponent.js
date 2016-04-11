import React, { PropTypes } from 'react';
import createTokenManager from './helpers/createTokenManager';
import { STORAGE_KEY } from './constants';

class CallbackComponent extends React.Component {
  constructor(props) {
    super(props);

    if (typeof(props.redirectOnSuccess) !== 'undefined') {
      this.state = {
        redirectOnSuccess: props.redirectOnSuccess
      };
    }
    else {
      this.state = {
        redirectOnSuccess: true
      };
    }
  }


  onTokenCallbackSuccess = () => {
    const redirectUrl = this.props.redirectUri || localStorage.getItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY);
    const { successCallback } = this.props;
    const { redirectOnSuccess } = this.state;

    if (redirectOnSuccess) {
      if (successCallback && typeof(successCallback) === 'function') {
        successCallback();
      }
      window.location = redirectUrl || `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
    }
    else {
      if (successCallback && typeof(successCallback) === 'function') {
        successCallback();
      }
    }
  };

  onTokenCallbackError = (error) => {
    localStorage.removeItem(STORAGE_KEY);
    const { errorCallback } = this.props;
    if (errorCallback && typeof(errorCallback) === 'function') {
      errorCallback(error);
    }
  };

  componentDidMount() {
    let { redirectOnSuccess } = this.props;
    const manager = createTokenManager(this.props.config);

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

export default CallbackComponent;
