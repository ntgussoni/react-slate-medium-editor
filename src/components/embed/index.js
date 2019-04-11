import React from "react";
import urlParser from "js-video-url-parser";

export default class Embed extends React.Component {
  state = {
    value: "",
    embedUrl: null
  };

  onClick = e => {
    e.stopPropagation();
  };

  onChange = e => {
    const video = e.target.value;
    const { node, editor } = this.props;
    this.setState({ value: video });
    editor.setNodeByKey(node.key, { data: { video } });
  };

  handleKeyPress = e => {
    const value = e.target.value;
    if (e.key === "Enter") {
      e.preventDefault();

      const videoInfo = urlParser.parse(value);

      if (videoInfo) {
        const embedUrl = urlParser.create({
          videoInfo,
          format: "embed"
        });
        this.setState({ showVideo: true, embedUrl });
      }
    }
  };

  render() {
    const { node } = this.props;
    const { embedUrl, value } = this.state;
    const video = node.data.get("video") || value;
    console.log(embedUrl);
    return embedUrl ? (
      <div
        style={{
          position: "relative",
          paddingBottom: "56.25%" /* 16:9 */,
          paddingTop: "25px",
          height: 0
        }}
      >
        <iframe
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%"
          }}
          src={embedUrl}
          allowFullScreen
        />
      </div>
    ) : (
      <input
        autoFocus
        style={{
          padding: "10px",
          border: "none",
          width: "100%",
          fontSize: "16px",
          placeholderColor: "#e3e3e3",
          outline: "none"
        }}
        type="text"
        value={video}
        placeholder="Paste or type a Youtube or Vimeo Link and press ENTER"
        onChange={this.onChange}
        onClick={this.onClick}
        onKeyDown={this.handleKeyPress}
      />
    );
  }
}
