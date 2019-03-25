import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { Editor } from "slate-react";
import { ReactComponent as ImageIcon } from "../../assets/icons/image-regular.svg";

import { insertImage } from "../../helpers";

import styled, { css } from "styled-components";

const Button = styled.span`
  cursor: pointer;
  border: 1px solid #ccc;
  background: white;
  border-radius: 100%;

  ${props =>
    props.opened &&
    css`
      transform: scale(1) rotate(0deg);
      opacity: 1;
      transition-duration: ${props => props.delay}ms;
      transition-timing-function: ease-in;
    `}
  ${props =>
    !props.opened &&
    css`
      transform: scale(0) rotate(-45deg);
      opacity: 0;
      transition-duration: ${props => props.delay}ms;
      transition-timing-function: ease-in;
    `}

  &:hover {
    svg {
      color: #ccc;
    }
  }
`;

const Icon = styled.span`
  vertical-align: text-bottom;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    height: 17px;
    box-sizing: content-box;
    background-size: cover;
    color: ${props => (props.active ? "white" : "#aaa")};
  }
`;

/**
 * Give the menu some styles.
 *
 * @type {Component}
 */

const OpenButton = styled.div`
  cursor: pointer;
  position: relative;
  width: 30px;
  height: 30px;
  background: white;
  border: 1px solid #ccc;
  color: #ccc;
  background: white;
  border-radius: 50%;
  justify-content: center;

  ${props =>
    props.opened &&
    css`
      -webkit-transition: -webkit-transform 250ms;
      transition: -webkit-transform 250ms;
      transition: transform 250ms;
      transition: transform 250ms, -webkit-transform 250ms;
      -webkit-transform: rotate(45deg);
      transform: rotate(45deg);
    `}

  ${props =>
    !props.opened &&
    css`
      -webkit-transform: rotate(0);
      transform: rotate(0);
      -webkit-transition: -webkit-transform 0.1s;
      transition: -webkit-transform 0.1s;
      transition: transform 0.1s;
      transition: transform 0.1s, -webkit-transform 0.1s;
    `}


  > span {
    font-size: 24px;
    line-height: 24px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  transform: scale(1);
  padding-left: 20px;

  > span {
    position: relative;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    margin-left: 10px;
  }
`;

const StyledMenu = styled.div`
  display: flex;
  position: absolute;
  z-index: 1;
  top: -10000px;
  left: -10000px;
  margin-left: -40px;
`;

export default class SideMenu extends React.Component {
  static propTypes = {
    editor: PropTypes.instanceOf(Editor),
    className: PropTypes.string,
    innerRef: PropTypes.node
  };

  state = {
    opened: false,
    ssrDone: false
  };

  componentDidMount() {
    this.setState({ ssrDone: true });
  }

  openSideMenu = e => {
    e.preventDefault();
    this.setState(prevState => {
      return { opened: !prevState.opened };
    });
  };
  /**
   * Render.
   *
   * @return {Element}
   */

  render() {
    const { className, innerRef } = this.props;
    const { opened, ssrDone } = this.state;

    if (!ssrDone) {
      return null;
    }

    const root = window.document.getElementsByTagName("body")[0];

    return ReactDOM.createPortal(
      <StyledMenu opened={opened} className={className} ref={innerRef}>
        <OpenButton opened={opened} onMouseDown={this.openSideMenu}>
          <Icon>+</Icon>
        </OpenButton>

        <ButtonContainer>
          {this.renderButton("image", ImageIcon, 50, opened)}
          {/* {this.renderButton("video", ImageIcon, 150, opened)}
          {this.renderButton("another", ImageIcon, 250, opened)}
          {this.renderButton("bla", ImageIcon, 350, opened)} */}
        </ButtonContainer>
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

  renderButton(type, Image, delay, opened) {
    return (
      <Button
        delay={delay}
        opened={opened}
        reversed
        onMouseDown={event => this.onButtonClick(event, type)}
      >
        <Icon>
          <Image />
        </Icon>
      </Button>
    );
  }

  /**
   * On clicking the image button, prompt for an image and insert it.
   *
   * @param {Event} event
   */

  onClickImage = event => {
    const { editor } = this.props;

    event.preventDefault();
    const src = window.prompt("Enter the URL of the image:");
    if (!src) return;
    editor.command(insertImage, src);
  };

  /**
   * When a mark button is clicked, toggle the current mark.
   *
   * @param {Event} event
   * @param {String} type
   */

  onButtonClick = (event, type) => {
    event.preventDefault();

    switch (type) {
      case "image":
        this.onClickImage(event);
    }
  };
}
