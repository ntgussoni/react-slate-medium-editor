import React, { Component } from "react";
import { Value } from "slate";

import initialValue from "./initial-value.json";

import ExampleComponent from "react-slate-medium-editor";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: Value.fromJSON(initialValue)
    };
  }

  render() {
    const { value } = this.state;

    console.log(value);
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
      </div>
    );
  }
}
