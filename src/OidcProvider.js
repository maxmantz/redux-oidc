import React, { PropTypes } from 'react';

class OidcProvider extends React.Component {
  static propTypes = {
    userManager: PropTypes.object.isRequired,
    children: PropTypes.element.isRequired
  };

  static childContextTypes = {
    userManager: PropTypes.object
  };

  getChildContext() {
    return {
      userManager: this.userManager
    };
  }

  constructor(props) {
    super(props);
    this.userManager = props.userManager;
  }

  render() {
    return React.Children.only(this.props.children);
  }
}

export default OidcProvider;
