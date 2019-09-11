import React, { Fragment } from "react";
import { ReactComponent as VideoIcon } from "../../../assets/icons/video-plus-regular.svg";
import { insertVideo, setData } from "../../../helpers";
import { Button, Icon } from "../Button";

export default class ImageUploadButton extends React.Component {
  handleFileSelection = e => {
    const { onFileSelected, editor, toggleSideMenu } = this.props;
    const file = e.target.files[0];
    toggleSideMenu(e);
    const newNode = editor.query(insertVideo, { file }, null);
    if (onFileSelected) {
      onFileSelected(file).then(url => {
        // Should probably delegate this to the image component
        if (editor.value.document.getNode(newNode.key)) {
          editor.command(setData, newNode, { video: url });
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
            <VideoIcon />
          </Icon>
        </Button>
      </Fragment>
    );
  }
}
