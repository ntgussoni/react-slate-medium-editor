import React from "react";
import ReactDOM from "react-dom";
import { ReactComponent as VideoIcon } from "../../assets/icons/play-circle-regular.svg";

import ImageUploadButton from "./image-upload-button";
import VideoUploadButton from "./video-upload-button";
import { Button, Icon } from "./Button";
import styled, { css } from "styled-components";

/**
 * Give the menu some styles.
 *
 * @type {Component}
 */

const OpenButton = styled.div`
  cursor: pointer;
  position: relative;
  height: 32px;
  width: 32px;
  background-color: #ffffff;
  box-shadow: 0 5px 15px 0 rgba(0, 0, 0, 0.2);
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
    font-size: 16px;
    line-height: 16px;
    height: 100%;
  }

  .tooltiptext {
    font-size: 12px;
    line-height: 18px;
    opacity: 0.8;
    width: 120px;
    background-color: black;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px 0;
    position: absolute;
    z-index: 1;
    bottom: 150%;
    left: 50%;
    margin-left: -60px;

    &::after {
      content: "";
      position: absolute;
      top: 100%;
      left: 50%;
      margin-left: -5px;
      border-width: 5px;
      border-style: solid;
      border-color: black transparent transparent transparent;
    }
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
  z-index: 9999;
  top: -10000px;
  left: -10000px;
  margin-left: -32px;
`;

export default class SideMenu extends React.Component {
  state = {
    opened: false,
    showTooltip: true,
    ssrDone: false
  };

  componentDidMount() {
    this.setState({ ssrDone: true });
  }

  toggleSideMenu = e => {
    e.preventDefault();
    this.setState(prevState => {
      return { opened: !prevState.opened, showTooltip: false };
    });
  };
  /**
   * Render.
   *
   * @return {Element}
   */

  render() {
    const { className, innerRef, onFileSelected, editor } = this.props;
    const { opened, ssrDone, showTooltip } = this.state;

    if (!ssrDone) {
      return null;
    }

    const root = window.document.getElementById(`slate-medium-editor`);

    return ReactDOM.createPortal(
      <StyledMenu opened={opened} className={className} ref={innerRef}>
        <OpenButton opened={opened} onMouseDown={this.toggleSideMenu}>
          <Icon>+</Icon>
          {showTooltip && (
            <div className="tooltiptext">
              Agregá imágenes para hacer tu contenido más atractivo
            </div>
          )}
        </OpenButton>

        <ButtonContainer>
          <ImageUploadButton
            editor={editor}
            opened={opened}
            toggleSideMenu={this.toggleSideMenu}
            onFileSelected={onFileSelected}
          />
          <VideoUploadButton
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
