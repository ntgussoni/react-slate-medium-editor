import React, { Fragment } from "react";
import { ReactComponent as ImageIcon } from "../../../assets/icons/image-regular.svg";
import { insertImage, setData } from "../../../helpers";
import styled, { css } from "styled-components";

export default class ImageUploadButton extends React.Component {
  handleFileSelection = e => {
    const { onFileSelected, editor, toggleSideMenu } = this.props;
    const [file] = e.target.files;
    toggleSideMenu(e);
    const newNode = editor.query(insertImage, { file }, null);
    if (onFileSelected) {
      onFileSelected(file).then(url => {
        // Should probably delegate this to the image component
        if (editor.value.document.getNode(newNode.key)) {
          editor.command(setData, newNode, { src: url });
        }
      });
    }
  };

  render() {
    const { opened } = this.props;

    return (
      <Fragment>
        <input
          style={{ display: "none" }}
          type="file"
          ref={ref => (this.uploadInput = ref)}
          onChange={e => this.handleFileSelection(e)}
        />
        <Button
          delay={50}
          opened={opened}
          reversed
          onMouseDown={() => this.uploadInput.click()}
        >
          <Icon>
            <ImageIcon />
          </Icon>
        </Button>
      </Fragment>
    );
  }
}

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
