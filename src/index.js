import React from "react";
import styled from "styled-components";
import Plain from "slate-plain-serializer";
import { Block, Value, KeyUtils } from "slate";
import { Editor, getEventRange, getEventTransfer } from "slate-react";
import isUrl from "is-url";
import imageExtensions from "./image-extensions";

import {
  insertImage,
  getAlignmentStyle,
  getData,
  DEFAULT_NODE
} from "./helpers";

import HoverMenu from "./components/hover-menu";
import SideMenu from "./components/side-menu";

/**
 * A styled image block component.
 *
 * @type {Component}
 */

const Image = styled.img`
  display: block;
  max-width: 100%;
  box-shadow: ${props => (props.selected ? "0 0 0 2px blue;" : "none")};
`;

/*
 * A function to determine whether a URL has an image extension.
 *
 * @param {String} url
 * @return {Boolean}
 */

function isImage(url) {
  return !!imageExtensions.find(url.endsWith);
}

/**
 * The editor's schema.
 *
 * @type {Object}
 */

const schema = {
  document: {
    last: { type: "paragraph" },
    normalize: (editor, { code, node, child }) => {
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
    }
  }
};

/**
 * The hovering menu example.
 *
 * @type {Component}
 */
export default class ReactSlateMediumEditor extends React.Component {
  /**
   * On update, update the menu.
   */

  componentDidMount = () => {
    this.updateMenu();
    this.updateSideMenu();
  };

  componentDidUpdate = () => {
    this.updateMenu();
    this.updateSideMenu();
  };

  onKeyDown = (event, editor, next) => {
    const { value } = editor;

    // Soft break, line return if shift pressed

    if (event.key === "Enter") {
      if (event.shiftKey === true) {
        editor.insertText("\n");
        return;
      }

      return editor.insertBlock(DEFAULT_NODE);
    }

    return next();
  };

  /**
   * Update the menu's absolute position.
   */

  updateSideMenu = () => {
    const sideMenu = this.sideMenu;
    if (!sideMenu) return;

    const { value } = this.props;
    const { selection, blocks, texts } = value;

    if (!value) return;
    if (!selection) return;

    if (selection.isBlurred || !selection.isCollapsed) {
      sideMenu.removeAttribute("style");
      return;
    }

    const native = window.getSelection();

    if (native.rangeCount === 0) {
      sideMenu.removeAttribute("style");
      return;
    }
    const topBlock = blocks.get(0);
    const notAParagraph = topBlock && topBlock.type !== DEFAULT_NODE;
    const notEmptyText =
      texts && texts.get(0) && texts.get(0).text.length !== 0;

    if (notAParagraph || notEmptyText) {
      sideMenu.removeAttribute("style");
      return;
    }

    const range = native.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    sideMenu.style.opacity = 1;

    const top = rect.top + window.pageYOffset - (15 - rect.height / 2);
    sideMenu.style.top = `${top}px`;

    const left = rect.left;
    sideMenu.style.left = `${left}px`;
  };

  /**
   * Update the menu's absolute position.
   */

  updateMenu = () => {
    const menu = this.menu;
    if (!menu) return;

    const { value } = this.props;

    if (!value) return;
    const { fragment, selection, focusBlock } = value;

    const isImage = focusBlock && focusBlock.type === "image";

    if (!(selection.isFocused && (selection.isExpanded || isImage))) {
      menu.removeAttribute("style");
      return;
    }

    const native = window.getSelection();
    const range = native.getRangeAt(0);

    const rect = range.getBoundingClientRect();
    menu.style.opacity = 1;

    const top = rect.top + window.pageYOffset - menu.offsetHeight;
    menu.style.top = `${top < 0 ? 0 : top}px`;

    const left =
      rect.left + window.pageXOffset - menu.offsetWidth / 2 + rect.width / 2;

    menu.style.left = `${left < 0 ? 0 : left}px`;
  };

  /**
   * Render.
   *
   * @return {Element}
   */

  render() {
    const { value, placeholder, readOnly } = this.props;

    return (
      <div>
        <Editor
          readOnly={readOnly}
          placeholder={placeholder || "Enter some text..."}
          value={value || Plain.deserialize("")}
          onChange={this.onChange}
          renderEditor={this.renderEditor}
          onDrop={this.onDropOrPaste}
          onPaste={this.onDropOrPaste}
          onKeyDown={this.onKeyDown}
          renderNode={this.renderNode}
          renderMark={this.renderMark}
          schema={schema}
        />
      </div>
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
    const children = next();
    return (
      <React.Fragment>
        {children}
        <HoverMenu innerRef={menu => (this.menu = menu)} editor={editor} />
        <SideMenu
          innerRef={sideMenu => (this.sideMenu = sideMenu)}
          editor={editor}
          onFileSelected={() => {}}
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
    switch (mark.type) {
      case "bold":
        return <strong {...attributes}>{children}</strong>;
      case "italic":
        return <em {...attributes}>{children}</em>;
      default:
        return next();
    }
  };

  /**
   * Render a Slate node.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderNode = (props, editor, next) => {
    const { attributes, node, children, isFocused } = props;

    const alignmentStyle = getAlignmentStyle(getData(node, "alignment"));

    switch (node.type) {
      case "image": {
        const src = node.data.get("src");
        return (
          <Image
            {...attributes}
            style={alignmentStyle}
            src={src}
            selected={isFocused}
          />
        );
      }
      case "paragraph":
        return (
          <p {...attributes} style={alignmentStyle}>
            {children}
          </p>
        );
      case "block-quote":
        return (
          <blockquote {...attributes} style={alignmentStyle}>
            {children}
          </blockquote>
        );

      case "heading-one":
        return (
          <h1 {...attributes} style={alignmentStyle}>
            {children}
          </h1>
        );
      case "heading-two":
        return (
          <h2 {...attributes} style={alignmentStyle}>
            {children}
          </h2>
        );
      case "bulleted-list":
        return (
          <ul {...attributes} style={alignmentStyle}>
            {children}
          </ul>
        );
      case "numbered-list":
        return (
          <ol {...attributes} style={alignmentStyle}>
            {children}
          </ol>
        );
      case "list-item":
        return (
          <li {...attributes} style={alignmentStyle}>
            {children}
          </li>
        );
      default:
        return next();
    }
  };

  /**
   * On drop, insert the image wherever it is dropped.
   *
   * @param {Event} event
   * @param {Editor} editor
   * @param {Function} next
   */

  onDropOrPaste = (event, editor, next) => {
    const target = getEventRange(event, editor);
    if (!target && event.type === "drop") return next();

    const transfer = getEventTransfer(event);
    const { type, text, files } = transfer;

    if (type === "files") {
      for (const file of files) {
        const reader = new FileReader();
        const [mime] = file.type.split("/");
        if (mime !== "image") continue;

        reader.addEventListener("load", () => {
          editor.command(insertImage, reader.result, target);
        });

        reader.readAsDataURL(file);
      }
      return;
    }

    if (type === "text") {
      if (!isUrl(text)) return next();
      if (!isImage(text)) return next();
      editor.command(insertImage, text, target);
      return;
    }

    next();
  };

  /**
   * On change.
   *
   * @param {Editor} editor
   */

  onChange = change => {
    const { onChange } = this.props;
    console.log("CALLING ON CHANGE", change);
    onChange(change.value);
  };
}

export { Value, KeyUtils };
