import React, { Component } from "react";
import { Value } from "slate";

import initialValue from "./initial-value.json";

import ExampleComponent from "react-slate-medium-editor";

export default class App extends Component {
  state = {
    value: Value.fromJSON(initialValue),
    value2: Value.fromJSON(initialValue)
  };

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
          <ExampleComponent onChange={this.onChange} value={value} />
        </div>
        <div
          style={{
            margin: "0 auto",
            marginTop: "100px",
            display: "block",
            width: "50%"
          }}
        >
          <ExampleComponent onChange={this.onChange2} value={value2} />
        </div>
      </div>
    );
  }
}
