import React from "react";
import urlParser from "js-video-url-parser";
import { ReactComponent as VideoIcon } from "../../assets/icons/video-plus-regular.svg";

const Iframe = ({ embedUrl }) => (
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
);

const HtmlVideo = ({ video }) => (
  <div
    style={{
      position: "relative",
      paddingBottom: "56.25%" /* 16:9 */,
      paddingTop: "25px",
      height: 0
    }}
  >
    <video
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%"
      }}
      controls
    >
      <source src={video} type="video/mp4" />
    </video>
  </div>
);

const Placeholder = () => (
  <div
    style={{
      position: "relative",
      paddingBottom: "56.25%" /* 16:9 */,
      paddingTop: "25px",
      height: 0
    }}
  >
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        border: "1px solid #e3e3e3",
        backgroundColor: "#e3e3e3",
        alignItems: "center",
        justifyContent: "center",
        display: "flex"
      }}
    >
      <VideoIcon style={{ height: "40px" }} />
    </div>
  </div>
);

export default class Embed extends React.Component {
  state = {
    value: ""
  };

  onClick = e => {
    e.stopPropagation();
  };

  onChange = e => {
    const { value } = e.target;
    this.setState({ value });
  };

  selfDestroy = () => {
    const { "data-key": dataKey, editor } = this.props;
    editor.removeNodeByKey(dataKey);
  };

  handleBlur = e => {
    e.stopPropagation();
    const video = e.target.value;
    if (video === "") this.selfDestroy();
  };

  handleKeyPress = e => {
    const video = e.target.value;
    const { "data-key": dataKey, editor } = this.props;

    if (e.key === "Enter") {
      e.preventDefault();
      video !== ""
        ? editor.setNodeByKey(dataKey, { data: { video } })
        : this.selfDestroy();
    }
  };

  getEmbedUrl = () => {
    const { data } = this.props;
    const video = data.get("video");
    const videoInfo = urlParser.parse(video);

    return videoInfo
      ? urlParser.create({
          videoInfo,
          format: "embed"
        })
      : null;
  };

  render() {
    const { value } = this.state;
    const { data } = this.props;
    const video = data.get("video");

    const isBlob = typeof window !== "undefined" && video instanceof Blob;
    const isUrl = typeof video === "string";
    const embedUrl = isUrl && this.getEmbedUrl();

    // THIS SUCKS TODO: IMPROVE ntorres
    const renderIframe = embedUrl;
    const renderVideo = video && !isBlob && !renderIframe;
    const renderPlaceholder = isBlob;

    if (renderPlaceholder) {
      return <Placeholder />;
    }

    if (renderIframe) {
      return <Iframe embedUrl={embedUrl} />;
    }

    if (renderVideo) {
      return <HtmlVideo video={video} />;
    }

    return (
      <p>
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
          value={value}
          placeholder="Paste or type a Youtube or Vimeo Link and press ENTER"
          onChange={this.onChange}
          onClick={this.onClick}
          onKeyDown={this.handleKeyPress}
          onBlur={this.handleBlur}
        />
      </p>
    );
  }
}
