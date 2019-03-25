import React, { Component } from "react";
import { Value } from "slate";

import initialValue from "./initial-value.json";

import ExampleComponent from "react-slate-medium-editor";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: Value.fromJSON(initialValue),
      value2: Value.fromJSON(initialValue)
    };
  }

  render() {
    const { value, value2 } = this.state;

    return (
      <div
        style={{
          margin: "0 auto",
          marginTop: "100px",
          display: "block",
          width: "50%"
        }}
      >
        <ExampleComponent
          onChange={value => this.setState({ value })}
          value={value}
        />
        {/* <ExampleComponent
          onChange={value2 => this.setState({ value2 })}
          value={value2}
        /> */}
      </div>
    );
  }
}
