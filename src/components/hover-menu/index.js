import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { Editor } from "slate-react";
import { ReactComponent as FormatBold } from "../../assets/icons/format_bold.svg";
import { ReactComponent as FormatItalic } from "../../assets/icons/format_italic.svg";
import { ReactComponent as FormatLink } from "../../assets/icons/format_link.svg";
import styled from "styled-components";
/**
 * Define the default node type.
 *
 * @type {String}
 */

const DEFAULT_NODE = "paragraph";

const Button = styled.span`
  cursor: pointer;
`;

const Icon = styled.span`
  font-size: 18px;
  vertical-align: text-bottom;

  svg {
    height: 17px;
    color: ${props => (props.active ? "white" : "#aaa")};

    &:hover {
      color: #fff;
    }
  }
`;

/**
 * The hovering menu.
 *
 * @type {Component}
 */

/**
 * Give the menu some styles.
 *
 * @type {Component}
 */

const MenuArrow = styled.div`
  position: absolute;
  bottom: -10px;
  left: 50%;
  clip: rect(10px 20px 20px 0);
  transform: translate(-50, -50);
  margin-left: -10px !important;
`;

const Arrow = styled.span`
  display: block;
  width: 20px;
  height: 20px;
  background-color: #262625;
  -webkit-transform: rotate(45deg) scale(0.5);
  transform: rotate(45deg) scale(0.5);
`;

const StyledMenu = styled.div`
  padding: 10px;
  position: absolute;
  z-index: 1;
  top: -10000px;
  left: -10000px;
  margin-top: -6px;
  opacity: 0;
  background-image: linear-gradient(to bottom, rgba(49, 49, 47, 0.99), #262625);
  border-radius: 4px;
  transition: opacity 0.75s;

  & > * {
    display: inline-block;
  }
  & > * + * {
    margin-left: 15px;
  }
`;

export default class HoverMenu extends React.Component {
  static propTypes = {
    editor: PropTypes.instanceOf(Editor),
    className: PropTypes.string,
    innerRef: PropTypes.node
  };

  state = {
    ssrDone: false
  };

  /**
   * Check if the current selection has a mark with `type` in it.
   *
   * @param {String} type
   * @return {Boolean}
   */

  hasMark = type => {
    const {
      editor: { value }
    } = this.props;
    return value.activeMarks.some(mark => mark.type === type);
  };

  /**
   * Check if the any of the currently selected blocks are of `type`.
   *
   * @param {String} type
   * @return {Boolean}
   */

  hasBlock = type => {
    const {
      editor: { value }
    } = this.props;
    return value.blocks.some(node => node.type === type);
  };

  /**
   * Render.
   *
   * @return {Element}
   */

  componentDidMount() {
    this.setState({ ssrDone: true });
  }

  render() {
    const { className, innerRef } = this.props;
    const { ssrDone } = this.state;

    // To prevent errors on SSR due to window not being available
    if (!ssrDone) {
      return null;
    }

    const root = window.document.getElementsByTagName("body")[0];

    return ReactDOM.createPortal(
      <StyledMenu className={className} ref={innerRef}>
        {this.renderMarkButton("bold", FormatBold)}
        {this.renderMarkButton("italic", FormatItalic)}
        {this.renderMarkButton("link", FormatLink)}
        {this.renderBlockButton("heading-one", "looks_one")}
        {this.renderBlockButton("heading-two", "looks_two")}
        {this.renderBlockButton("block-quote", "format_quote")}
        {this.renderBlockButton("numbered-list", "format_list_numbered")}
        {this.renderBlockButton("bulleted-list", "format_list_bulleted")}
        <MenuArrow>
          <Arrow />
        </MenuArrow>
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

  renderMarkButton = (type, Image) => {
    const isActive = this.hasMark(type);

    return (
      <Button
        reversed
        active={isActive}
        onMouseDown={event => this.onClickMark(event, type)}
      >
        <Icon active={isActive}>
          <Image />
        </Icon>
      </Button>
    );
  };

  /**
   * Render a block-toggling toolbar button.
   *
   * @param {String} type
   * @param {String} icon
   * @return {Element}
   */

  renderBlockButton = (type, icon) => {
    let isActive = this.hasBlock(type);

    const { editor } = this.props;
    const {
      value: { document, blocks }
    } = editor;

    if (["numbered-list", "bulleted-list"].includes(type)) {
      if (blocks.size > 0) {
        const parent = document.getParent(blocks.first().key);
        isActive = this.hasBlock("list-item") && parent && parent.type === type;
      }
    }

    return (
      <Button
        active={isActive}
        onMouseDown={event => this.onClickBlock(event, type)}
      >
        <Icon>{icon}</Icon>
      </Button>
    );
  };

  /**
   * When a mark button is clicked, toggle the current mark.
   *
   * @param {Event} event
   * @param {String} type
   */

  onClickMark = (event, type) => {
    event.preventDefault();

    const { editor } = this.props;
    editor.toggleMark(type);
  };

  /**
   * When a block button is clicked, toggle the block type.
   *
   * @param {Event} event
   * @param {String} type
   */

  onClickBlock = (event, type) => {
    event.preventDefault();
    console.log(this.props);
    const { editor } = this.props;
    const { value } = editor;
    const { document } = value;

    console.log(type);
    // Handle everything but list buttons.
    if (type !== "bulleted-list" && type !== "numbered-list") {
      debugger;
      const isActive = this.hasBlock(type);
      const isList = this.hasBlock("list-item");

      if (isList) {
        editor
          .setBlocks(isActive ? DEFAULT_NODE : type)
          .unwrapBlock("bulleted-list")
          .unwrapBlock("numbered-list");
      } else {
        editor.setBlocks(isActive ? DEFAULT_NODE : type);
      }
    } else {
      // Handle the extra wrapping required for list buttons.
      const isList = this.hasBlock("list-item");
      const isType = value.blocks.some(block => {
        return !!document.getClosest(block.key, parent => parent.type === type);
      });

      if (isList && isType) {
        editor
          .setBlocks(DEFAULT_NODE)
          .unwrapBlock("bulleted-list")
          .unwrapBlock("numbered-list");
      } else if (isList) {
        editor
          .unwrapBlock(
            type === "bulleted-list" ? "numbered-list" : "bulleted-list"
          )
          .wrapBlock(type);
      } else {
        editor.setBlocks("list-item").wrapBlock(type);
      }
    }
  };
}
