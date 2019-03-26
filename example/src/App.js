import React, { Component } from "react";
import { Value } from "slate";

import initialValue from "./initial-value.json";

import ExampleComponent from "react-slate-medium-editor";

export default class App extends Component {
  state = {
    value: Value.fromJSON(initialValue)
  };

  onChange = value => {
    this.setState({ value });
  };

  render() {
    const { value } = this.state;

    return (
      <div
        style={{
          margin: "0 auto",
          marginTop: "100px",
          display: "block",
          width: "50%"
        }}
      >
        <ExampleComponent onChange={this.onChange} value={value} />
      </div>
    );
  }
}
