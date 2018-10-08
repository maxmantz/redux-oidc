import PropTypes from 'prop-types';
import React from 'react';

class SignoutCallbackComponent extends React.Component {
  static propTypes = {
    // the content to render
    children: PropTypes.element.isRequired,

    // the userManager
    userManager: PropTypes.object.isRequired,

    // a function invoked when the callback succeeds
    successCallback: PropTypes.func.isRequired,

    // a function invoked when the callback fails
    errorCallback: PropTypes.func
  };

  componentDidMount() {
    this.props.userManager.signoutRedirectCallback()
      .then((user) => this.onRedirectSuccess(user))
      .catch((error) => this.onRedirectError(error));
  }

  onRedirectSuccess = (user) => {
    this.props.successCallback(user);
  };

  onRedirectError = (error) => {
    if (this.props.errorCallback) {
      this.props.errorCallback(error);
    } else {
      throw new Error(`Error handling logout redirect callback: ${error.message}`);
    }
  };

  render() {
    return React.Children.only(this.props.children);
  }
}

export default SignoutCallbackComponent;
