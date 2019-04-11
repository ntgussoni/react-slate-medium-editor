import React from "react";
import styled from "styled-components";
import Plain from "slate-plain-serializer";
import { Block } from "slate";
import { Editor, getEventRange, getEventTransfer } from "slate-react";
import isUrl from "is-url";
import imageExtensions from "../../image-extensions";

import {
  insertImage,
  getAlignmentStyle,
  getData,
  DEFAULT_NODE
} from "../../helpers";

import HoverMenu from "../hover-menu";
import SideMenu from "../side-menu";

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

const DEFAULT_COMPONENTS = {
  italic: "i",
  bold: "strong",
  image: ({ data, children, ...props }) => (
    <Image src={data.get("src")} {...props} />
  ),
  link: ({ children, data, ...props }) => (
    <a href={data.get("href")} {...props}>
      {children}
    </a>
  ),
  paragraph: "p",
  "block-quote": "blockquote",
  "heading-one": "h1",
  "heading-two": "h2",
  "bulleted-list": "ul",
  "numbered-list": "ol",
  "list-item": "li"
};

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
      window.addEventListener("resize", () => {
        this.scheduleReposition();
        this.updateSideMenu();
      });
    }
  };

  componentDidUpdate = () => {
    this.updateMenu();
    this.updateSideMenu();
  };

  componentWillUnmount = () => {
    if (window) {
      window.removeEventListener("resize");
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
    const sideMenu = this.sideMenu;
    if (!sideMenu) return;

    const { value } = this.props;
    const { selection, blocks, texts } = value;

    if (!value) return;
    if (!selection) return;

    if (selection.isBlurred || selection.isExpanded) {
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

    const rect = window
      .getSelection()
      .getRangeAt(0)
      .getBoundingClientRect();
    const top = rect.top + window.pageYOffset - (15 - rect.height / 2);
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
    const menu = this.menu;
    const rect = window
      .getSelection()
      .getRangeAt(0)
      .getBoundingClientRect();

    // This is a fix for the link doing weird things
    if (rect.top === 0 && rect.left === 0) {
      return;
    }

    const top = rect.top + window.pageYOffset - menu.offsetHeight;
    const left =
      rect.left + window.pageXOffset - menu.offsetWidth / 2 + rect.width / 2;

    menu.style.opacity = 1;
    menu.style.top = `${top < 0 ? 0 : top}px`;
    menu.style.left = `${left < 0 ? 0 : left}px`;
  };

  updateMenu = () => {
    const { value } = this.props;
    const { showLinkInput } = this.state;
    const { fragment, selection, focusBlock } = value;
    const menu = this.menu;
    if (!menu) return;
    if (!value) return;

    const isImage = focusBlock && focusBlock.type === "image";
    const isText = selection.isExpanded && fragment.text !== "";
    const textOrImageSelected = selection.isFocused && (isText || isImage);
    console.log(selection, textOrImageSelected, showLinkInput);
    if (textOrImageSelected || showLinkInput) {
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
    const { value, placeholder, readOnly } = this.props;

    return (
      <div>
        <Editor
          readOnly={readOnly}
          placeholder={placeholder || "Enter some text..."}
          value={value || Plain.deserialize("")}
          onChange={this.onChange}
          renderEditor={this.renderEditor}
          ref={ref => (this.editor = ref)}
          onDrop={this.onDropOrPaste}
          onPaste={this.onDropOrPaste}
          // onKeyDown={this.onKeyDown}
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
        <HoverMenu
          innerRef={menu => (this.menu = menu)}
          onToggleLinkVisibility={this.toggleLinkVisibility}
          onMenuReposition={this.scheduleReposition}
          editor={editor}
        />
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
    const { components = {} } = this.props;

    const Component = components[mark.type] || DEFAULT_COMPONENTS[mark.type];

    if (!Component) {
      return next();
    }

    return <Component {...attributes}>{children}</Component>;
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
        {...attributes}
        data={node.data}
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
    console.log("CHANGED", change);
    onChange(change.value);
  };
}
