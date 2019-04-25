import React, { Component } from "react";

import initialValue from "./initial-value.json";

import {
  ReactSlateMediumEditor,
  Value,
  KeyUtils
} from "react-slate-medium-editor";

export default class App extends Component {
  constructor(props) {
    super(props);
    KeyUtils.resetGenerator(); // This is for SSR
    this.state = {
      value: Value.fromJSON(initialValue)
    };
  }

  onChange = value => {
    this.setState({ value });
  };

  render() {
    const { value } = this.state;

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
            onFileSelected={() => {}}
          />
        </div>
      </div>
    );
  }
}
