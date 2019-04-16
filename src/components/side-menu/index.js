import React from "react";
import ReactDOM from "react-dom";
import { ReactComponent as VideoIcon } from "../../assets/icons/video-plus-regular.svg";

import ImageUploadButton from "./image-upload-button";

import styled, { css } from "styled-components";

const Button = styled.span`
  cursor: pointer;
  border: 1px solid #000;
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
    color: ${props => (props.active ? "#ccc" : "#000")};
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
  border: 1px solid #000;
  color: #000;
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
  state = {
    opened: false,
    ssrDone: false
  };

  componentDidMount() {
    this.setState({ ssrDone: true });
  }

  toggleSideMenu = e => {
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
    const { className, innerRef, onFileSelected, editor } = this.props;
    const { opened, ssrDone } = this.state;

    if (!ssrDone) {
      return null;
    }

    const root = window.document.getElementsByTagName("body")[0];

    return ReactDOM.createPortal(
      <StyledMenu opened={opened} className={className} ref={innerRef}>
        <OpenButton opened={opened} onMouseDown={this.toggleSideMenu}>
          <Icon>+</Icon>
        </OpenButton>

        <ButtonContainer>
          <ImageUploadButton
            editor={editor}
            opened={opened}
            toggleSideMenu={this.toggleSideMenu}
            onFileSelected={onFileSelected}
          />
          {this.renderButton("video", VideoIcon, 150, opened)}
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

  onButtonClick = (e, type) => {
    e.preventDefault();
    const { editor } = this.props;
    if (type === "video") {
      editor.setBlocks("embed");
    }
  };
}
