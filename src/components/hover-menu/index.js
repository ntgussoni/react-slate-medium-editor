import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { Editor } from "slate-react";

import styled from "styled-components";

const Button = styled.span`
  cursor: pointer;
  color: ${props =>
    props.reversed
      ? props.active
        ? "white"
        : "#aaa"
      : props.active
      ? "black"
      : "#ccc"};
`;

const Icon = styled(({ className, ...rest }) => {
  return <span className={`material-icons ${className}`} {...rest} />;
})`
  font-size: 18px;
  vertical-align: text-bottom;
`;

/**
 * The hovering menu.
 *
 * @type {Component}
 */

/**
 * Give the menu some styles.
 *
 * @type {Component}
 */

const MenuArrow = styled.div`
  position: absolute;
  bottom: -10px;
  left: 50%;
  clip: rect(10px 20px 20px 0);
  transform: translate(-50, -50);
  margin-left: -10px !important;
`;

const Arrow = styled.span`
  display: block;
  width: 20px;
  height: 20px;
  background-color: #262625;
  -webkit-transform: rotate(45deg) scale(0.5);
  transform: rotate(45deg) scale(0.5);
`;

const StyledMenu = styled.div`
  padding: 10px;
  position: absolute;
  z-index: 1;
  top: -10000px;
  left: -10000px;
  margin-top: -6px;
  opacity: 0;
  background-image: linear-gradient(to bottom, rgba(49, 49, 47, 0.99), #262625);
  border-radius: 4px;
  transition: opacity 0.75s;

  & > * {
    display: inline-block;
  }
  & > * + * {
    margin-left: 15px;
  }
`;

export default class HoverMenu extends React.Component {
  static propTypes = {
    editor: PropTypes.instanceOf(Editor),
    className: PropTypes.string,
    innerRef: PropTypes.node
  };
  /**
   * Render.
   *
   * @return {Element}
   */

  render() {
    const { className, innerRef } = this.props;
    const root = window.document.getElementById("root");

    return ReactDOM.createPortal(
      <StyledMenu className={className} ref={innerRef}>
        {this.renderMarkButton("bold", "format_bold")}
        {this.renderMarkButton("italic", "format_italic")}
        {this.renderMarkButton("underlined", "format_underlined")}
        {this.renderMarkButton("code", "code")}
        <MenuArrow>
          <Arrow />
        </MenuArrow>
      </StyledMenu>,
      root
    );
  }

  /**
   * Render a mark-toggling toolbar button.
   *
   * @param {String} type
   * @param {String} icon
   * @return {Element}
   */

  renderMarkButton(type, icon) {
    const { editor } = this.props;
    const { value } = editor;
    const isActive = value.activeMarks.some(mark => mark.type === type);
    return (
      <Button
        reversed
        active={isActive}
        onMouseDown={event => this.onClickMark(event, type)}
      >
        <Icon>{icon}</Icon>
      </Button>
    );
  }

  /**
   * When a mark button is clicked, toggle the current mark.
   *
   * @param {Event} event
   * @param {String} type
   */

  onClickMark(event, type) {
    const { editor } = this.props;
    event.preventDefault();
    editor.toggleMark(type);
  }
}
