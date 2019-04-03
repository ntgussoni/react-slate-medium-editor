import React, { Fragment } from "react";
import { ReactComponent as ImageIcon } from "../../../assets/icons/image-regular.svg";

import { insertImage } from "../../../helpers";

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

export default class ImageUploadButton extends React.Component {
  /**
   * Render.
   *
   * @return {Element}
   */

  handleFileSelection = e => {
    const files = e.target.files;
    const src = URL.createObjectURL(files[0]);
    const { onFileSelected, editor, toggleSideMenu } = this.props;

    toggleSideMenu(e);
    editor.command(insertImage, src);
    onFileSelected(files);
  };

  render() {
    const { opened, onFileSelected } = this.props;

    return (
      <Fragment>
        <input
          style={{ display: "none" }}
          type="file"
          ref={ref => (this.imageInput = ref)}
          onChange={e => this.handleFileSelection(e)}
        />
        <Button
          delay={50}
          opened={opened}
          reversed
          onMouseDown={() => this.imageInput.click()}
        >
          <Icon>
            <ImageIcon />
          </Icon>
        </Button>
      </Fragment>
    );
  }
}
