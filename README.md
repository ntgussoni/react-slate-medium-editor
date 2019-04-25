# react-slate-medium-editor

> WYSIWYG Medium-like editor for react

[![NPM](https://img.shields.io/npm/v/react-slate-medium-editor.svg)](https://www.npmjs.com/package/react-slate-medium-editor) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## WORK IN PROGRESS

## Install

```bash
npm install --save react-slate-medium-editor
```

## Usage

```jsx
import React, { Component } from "react";
import { ReactSlateMediumEditor } from "react-slate-medium-editor";

class Example extends Component {
  state = {
    value: null
  };

  onChange = value => {
    this.setState({ value });
  };

  render() {
    return (
      <ReactSlateMediumEditor
        onChange={this.onChange}
        value={value}
        onFileSelected={file => someFunction(file)}
      />
    );
  }
}
```

## License

MIT © [ntgussoni](https://github.com/ntgussoni)
