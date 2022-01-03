import React, { Component } from "react";

// Magic component to make UIKit work with Next
class UIKit extends Component {
  state = { ready: false };
  componentDidMount = () => {
    if (typeof window !== "undefined") {
      const uikit = require("uikit");
      const icons = require("../../../node_modules/uikit/dist/js/uikit-icons.js");
      uikit.use(icons);
      this.setState({ ready: true });
    }
  };

  render() {
    return <div>{this.props.children}</div>;
  }
}

export default UIKit;