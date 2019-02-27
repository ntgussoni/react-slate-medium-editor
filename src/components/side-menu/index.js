import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { Editor } from "slate-react";

import styled from "styled-components";

const Button = styled.span`
  cursor: pointer;
  color: #ccc;
  transform: scale(1);
  border-radius: 100%;
  transition-delay: ${props => props.delay}ms !important;
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

const OpenButton = styled.div`
  width: 34px;
  height: 34px;
  line-height: 34px;
  font-size: 34px;
`;

const ButtonContainer = styled.div`
  display: block;
  position: absolute;
  height: 100%;
`;

const StyledMenu = styled.div`
  padding: 10px;
  position: absolute;
  z-index: 1;
  top: -10000px;
  left: -10000px;
  margin-top: -6px;
  opacity: 0;
  border-radius: 4px;
  display: block;

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

  state = {
    opened: true
  };
  /**
   * Render.
   *
   * @return {Element}
   */

  render() {
    const { className, innerRef } = this.props;
    const { opened } = this.state;
    const root = window.document.getElementById("root");

    return ReactDOM.createPortal(
      <StyledMenu className={className} ref={innerRef}>
        <OpenButton
          onMouseDown={() =>
            this.setState(prevState => {
              return { opened: !prevState.opened };
            })
          }
        >
          {opened ? "-" : "+"}
        </OpenButton>

        {opened ? (
          <ButtonContainer>
            {this.renderMarkButton("image", "image", 0)}
            {this.renderMarkButton("image", "video", 30)}
            {this.renderMarkButton("another", "another", 60)}
            {this.renderMarkButton("bla", "bla", 90)}
          </ButtonContainer>
        ) : null}
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

  renderMarkButton(type, icon, delay) {
    const { editor } = this.props;
    const { value } = editor;
    return (
      <Button
        delay={delay}
        reversed
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
