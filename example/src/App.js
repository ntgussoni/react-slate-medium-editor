import React, { Component } from "react";

import initialValue from "./initial-value.json";

import {
  ReactSlateMediumEditor,
  Value,
  KeyUtils
} from "react-slate-medium-editor";

const Bold = ({ children, ...rest }) => (
  <strong style={{ color: "blue" }} {...rest}>
    {children}
  </strong>
);

const Italic = ({ children, ...rest }) => (
  <i style={{ color: "red" }} {...rest}>
    {children}
  </i>
);

export default class App extends Component {
  constructor(props) {
    super(props);
    KeyUtils.resetGenerator(); // This is for SSR
    this.state = {
      value: Value.fromJSON(initialValue),
      value2: Value.fromJSON(initialValue)
    };
  }

  onChange = value => {
    this.setState({ value });
  };

  onChange2 = value2 => {
    this.setState({ value2 });
  };

  render() {
    const { value, value2 } = this.state;

    return (
      <div>
        <div
          style={{
            margin: "0 auto",
            marginTop: "100px",
            display: "block",
            width: "50%"
          }}
        >
          <ReactSlateMediumEditor
            onChange={this.onChange}
            value={value}
            components={{
              bold: Bold,
              italic: Italic
            }}
          />
        </div>
        <div
          style={{
            margin: "0 auto",
            marginTop: "100px",
            display: "block",
            width: "50%"
          }}
        >
          <ReactSlateMediumEditor onChange={this.onChange2} value={value2} />
        </div>
      </div>
    );
  }
}
