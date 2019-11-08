import React from "react";
import styled from "styled-components";
import { Block } from "slate";
import { Editor } from "slate-react";

// import { Editor, getEventRange, getEventTransfer } from "slate-react";
// import isUrl from "is-url";

import {
  // isImage,
  // insertImage,
  getAlignmentStyle,
  getData,
  DEFAULT_NODE
} from "../../helpers";

import HoverMenu from "../hover-menu";
import SideMenu from "../side-menu";
import Embed from "../embed";

/**
 * The editor's schema.
 *
 * @type {Object}
 */

const schema = {
  document: {
    last: { type: "paragraph" },
    normalize: (editor, { code, node }) => {
      switch (code) {
        case "last_child_type_invalid": {
          const paragraph = Block.create("paragraph");
          return editor.insertNodeByKey(node.key, node.nodes.size, paragraph);
        }
      }
    }
  },
  blocks: {
    image: {
      isVoid: true
    },
    embed: {
      isVoid: true
    }
  }
};

const Italic = ({ attributes, children }) => <i {...attributes}>{children} </i>;
const Bold = ({ attributes, children }) => (
  <strong {...attributes}>{children}</strong>
);
const Image = ({ attributes, data }) => (
  <img {...attributes} src={data.get("src")} />
);
const Link = ({ attributes, children, data }) => (
  <a {...attributes} href={data.get("href")}>
    {children}
  </a>
);
const Paragraph = ({ attributes, children }) => (
  <p {...attributes}>{children}</p>
);
const Blockquote = ({ attributes, children }) => (
  <blockquote {...attributes}>{children}</blockquote>
);
const HeadingOne = ({ attributes, children }) => (
  <h1 {...attributes}>{children}</h1>
);
const HeadingTwo = ({ attributes, children }) => (
  <h2 {...attributes}>{children}</h2>
);
const BulletedList = ({ attributes, children }) => (
  <ul {...attributes}>{children}</ul>
);
const NumberedList = ({ attributes, children }) => (
  <ol {...attributes}>{children}</ol>
);
const ListItem = ({ attributes, children }) => (
  <li {...attributes}>{children}</li>
);

const VideoEmbed = ({ attributes, data, editor }) => (
  <Embed {...attributes} editor={editor} data={data} />
);

const DEFAULT_COMPONENTS = {
  italic: Italic,
  bold: Bold,
  image: Image,
  link: Link,
  paragraph: Paragraph,
  "block-quote": Blockquote,
  "heading-one": HeadingOne,
  "heading-two": HeadingTwo,
  "bulleted-list": BulletedList,
  "numbered-list": NumberedList,
  "list-item": ListItem,
  embed: VideoEmbed
};

const StyledDiv = styled.div`
  z-index: 1;
  position: relative;
  margin-left: 40px;
  user-select: text;
  -webkit-user-select: text;
`;

/**
 * The hovering menu example.
 *
 * @type {Component}
 */

export default class ReactSlateMediumEditor extends React.Component {
  state = {
    showLinkInput: false
  };

  /**
   * On update, update the menu.
   */

  componentDidMount = () => {
    // this.updateMenu();
    // this.updateSideMenu();

    if (window) {
      // window.addEventListener("resize", () => {
      //   this.scheduleReposition();
      //   this.updateSideMenu();
      // });
    }
  };

  componentDidUpdate = () => {
    this.updateMenu();
    this.updateSideMenu();
  };

  componentWillUnmount = () => {
    if (window) {
      // window.removeEventListener("resize");
    }
  };

  // onKeyDown = (event, editor, next) => {
  //   const { value } = editor;

  //   // Soft break, line return if shift pressed

  //   if (event.key === "Enter") {
  //     if (event.shiftKey === true) {
  //       editor.insertText("\n");
  //       return;
  //     }

  //     return editor.insertBlock(DEFAULT_NODE);
  //   }

  //   return next();
  // };

  /**
   * Update the menu's absolute position.
   */

  updateSideMenu = () => {
    const { value, readOnly } = this.props;
    const { selection, texts, blocks } = value;
    const sideMenu = this.sideMenu;
    if (!sideMenu) return;
    if (!value) return;
    if (!selection) return;

    const isCollapsed = selection.isCollapsed;
    const topBlock = blocks.get(0);
    const isAParagraph = topBlock && topBlock.type === DEFAULT_NODE;
    const isEmptyText = texts && texts.get(0) && texts.get(0).text.length === 0;
    if (!readOnly && (isCollapsed && isAParagraph && isEmptyText)) {
      this.repositionSideMenu();
    } else {
      sideMenu.removeAttribute("style");
    }
  };

  getRangeBoundingClientRect = range => {
    var rects = range.getClientRects();
    var top = 0;
    var right = 0;
    var bottom = 0;
    var left = 0;

    if (rects.length) {
      ({ top, right, bottom, left } = rects[0]);
      for (var ii = 1; ii < rects.length; ii++) {
        var rect = rects[ii];

        if (rect.height !== 0 || rect.width !== 0) {
          top = Math.min(top, rect.top);
          right = Math.max(right, rect.right);
          bottom = Math.max(bottom, rect.bottom);
          left = Math.min(left, rect.left);
        }
      }
    }
    return {
      top,
      right,
      bottom,
      left,
      width: right - left,
      height: bottom - top
    };
  };

  repositionSideMenu = () => {
    const { editorId = 0 } = this.props;

    const sideMenu = this.sideMenu;
    if (!sideMenu) return;
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;

    const childrenRect = this.getRangeBoundingClientRect(
      window.getSelection().getRangeAt(0)
    );

    const parentRect = window.document
      .getElementById(`slate-medium-editor-${editorId}`)
      .getBoundingClientRect();

    const rect = {
      ...childrenRect,
      top: childrenRect.top - parentRect.top,
      left: childrenRect.left - parentRect.left
    };

    const top = rect.top - (15 - rect.height / 2);
    const left = rect.left;

    sideMenu.style.opacity = 1;
    sideMenu.style.top = `${top}px`;
    sideMenu.style.left = `${left}px`;
  };

  toggleLinkVisibility = () => {
    this.setState(prevState => {
      return { showLinkInput: !prevState.showLinkInput };
    }, this.updateMenu());
  };

  scheduleReposition = () => {
    setTimeout(() => {
      return this.repositionMenu();
    }, 0);
  };
  /**
   * Update the menu's absolute position.
   */

  repositionMenu = () => {
    const { isMobile, editorId = 0 } = this.props;
    const menu = this.menu;
    if (!menu) return;

    const childrenRect = this.getRangeBoundingClientRect(
      window.getSelection().getRangeAt(0)
    );
    // This is a fix for the link doing weird things
    if (childrenRect.top === 0 && childrenRect.left === 0) {
      return;
    }

    const parentRect = window.document
      .getElementById(`slate-medium-editor-${editorId}`)
      .getBoundingClientRect();

    const rect = {
      ...childrenRect,
      top: childrenRect.top - parentRect.top,
      left: childrenRect.left - parentRect.left
    };

    let top = rect.top - menu.offsetHeight;
    let left = rect.left - menu.offsetWidth / 2 + rect.width / 2;

    if (isMobile) {
      top = rect.top + window.pageYOffset + menu.offsetHeight;
      left = 0;
    }

    const $menuArrow = menu.querySelector("#menu-arrow");

    menu.style.opacity = 1;
    menu.style.top = `${top}px`;
    menu.style.left = `${left < 0 ? 0 : left}px`;

    $menuArrow.style.left = left < 0 ? `calc(50% + ${left}px)` : "50%";
  };

  updateMenu = () => {
    const { value, readOnly } = this.props;
    const { showLinkInput } = this.state;
    const { fragment, selection, focusBlock } = value;
    const menu = this.menu;
    if (!menu) return;
    if (!value) return;

    const isImage = focusBlock && focusBlock.type === "image";
    const isText = selection.isExpanded && fragment.text !== "";
    const textOrImageSelected = selection.isFocused && (isText || isImage);
    if (!readOnly && (textOrImageSelected || showLinkInput)) {
      this.repositionMenu();
    } else {
      menu.removeAttribute("style");
    }
  };

  /**
   * Render.
   *
   * @return {Element}
   */

  render() {
    const {
      value,
      placeholder,
      readOnly,
      className,
      isMobile = false,
      editorId = 0
    } = this.props;
    return (
      <StyledDiv id={`slate-medium-editor-${editorId}`} className={className}>
        <Editor
          editorId={editorId}
          readOnly={readOnly}
          isMobile={isMobile}
          placeholder={placeholder || "Enter some text..."}
          value={value}
          onChange={this.onChange}
          renderEditor={this.renderEditor}
          ref={ref => (this.editor = ref)}
          // onDrop={this.onDropOrPaste}
          // onPaste={this.onDropOrPaste}
          // onKeyDown={this.onKeyDown}
          renderNode={this.renderNode}
          renderMark={this.renderMark}
          schema={schema}
        />
      </StyledDiv>
    );
  }

  /**
   * Render the editor.
   *
   * @param {Object} props
   * @param {Function} next
   * @return {Element}
   */

  renderEditor = (props, editor, next) => {
    const { onFileSelected, isMobile, editorId = 0 } = this.props;
    const children = next();

    return (
      <React.Fragment>
        {children}
        <HoverMenu
          editorId={editorId}
          isMobile={isMobile}
          innerRef={menu => (this.menu = menu)}
          onToggleLinkVisibility={this.toggleLinkVisibility}
          onMenuReposition={this.scheduleReposition}
          editor={editor}
        />
        <SideMenu
          editorId={editorId}
          innerRef={sideMenu => (this.sideMenu = sideMenu)}
          editor={editor}
          onFileSelected={onFileSelected}
        />
      </React.Fragment>
    );
  };

  /**
   * Render a Slate mark.
   *
   * @param {Object} props
   * @param {Editor} editor
   * @param {Function} next
   * @return {Element}
   */

  renderMark = (props, editor, next) => {
    const { children, mark, attributes } = props;
    const { components = {} } = this.props;

    const Component = components[mark.type] || DEFAULT_COMPONENTS[mark.type];

    if (!Component) {
      return next();
    }

    return <Component attributes={attributes}>{children}</Component>;
  };

  /**
   * Render a Slate node.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderNode = (props, editor, next) => {
    const { attributes, node, children, isFocused } = props;
    const { components = {} } = this.props;
    const alignmentStyle = getAlignmentStyle(getData(node, "alignment"));
    const Component = components[node.type] || DEFAULT_COMPONENTS[node.type];

    if (!Component) {
      return next();
    }

    return (
      <Component
        attributes={attributes}
        data={node.data}
        editor={editor}
        selected={isFocused}
        style={alignmentStyle}
      >
        {children}
      </Component>
    );
  };

  /**
   * On drop, insert the image wherever it is dropped.
   *
   * @param {Event} event
   * @param {Editor} editor
   * @param {Function} next
   */

  // onDropOrPaste = (event, editor, next) => {
  //   const { onFileSelected } = this.props;

  //   const target = getEventRange(event, editor);
  //   if (!target && event.type === "drop") return next();

  //   const transfer = getEventTransfer(event);
  //   const { type, text, files } = transfer;

  //   if (type === "files") {
  //     for (const file of files) {
  //       const reader = new FileReader();
  //       const [mime] = file.type.split("/");
  //       if (mime !== "image") continue;

  //       reader.addEventListener("load", () => {
  //         editor.command(
  //           insertImage,
  //           { file: reader.result, type: "base64" },
  //           target,
  //           onFileSelected
  //         );
  //       });

  //       reader.readAsDataURL(file);
  //     }
  //     return;
  //   }

  //   if (type === "text") {
  //     if (!isUrl(text)) return next();
  //     if (!isImage(text)) return next();
  //     editor.command(insertImage, { file: text, type: "text" }, target);
  //     return;
  //   }

  //   next();
  // };

  /**
   * On change.
   *
   * @param {Editor} editor
   */

  onChange = change => {
    const { onChange } = this.props;
    onChange(change.value);
  };
}
