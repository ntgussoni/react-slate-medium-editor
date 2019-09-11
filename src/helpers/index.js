import { Block } from "slate";
import imageExtensions from "../image-extensions";

export const EMPTY_TEXT = {
  object: "value",
  document: {
    object: "document",
    data: {},
    nodes: [
      {
        object: "block",
        type: "paragraph",
        data: {},
        nodes: [
          { object: "text", leaves: [{ object: "leaf", text: "", marks: [] }] }
        ]
      }
    ]
  }
};

export const DEFAULT_NODE = "paragraph";

/**
 * A change function to standardize inserting images.
 *
 * @param {Editor} editor
 * @param {Object} file
 * @param {Range} target
 *
 */

export const insertImage = (editor, { file = null, type = "file" }, target) => {
  if (target) {
    editor.select(target);
  }

  let src = file;
  if (type === "file") {
    src = URL.createObjectURL(file);
  }

  const imageBlock = Block.create({
    type: "image",
    data: { src }
  });

  editor.insertBlock(imageBlock);
  return imageBlock;
};

/**
 * A change function to standardize inserting videos.
 *
 * @param {Editor} editor
 * @param {Object} url
 * @param {Range} target
 *
 */

export const insertVideo = (editor, { file = null }, target) => {
  if (target) {
    editor.select(target);
  }

  const videoBlock = Block.create({
    type: "embed",
    data: { video: file }
  });

  editor.insertBlock(videoBlock);
  return videoBlock;
};

/*
 * A function to determine whether a URL has an image extension.
 *
 * @param {String} url
 * @return {Boolean}
 */

export const isImage = url => {
  return !!imageExtensions.find(url.endsWith);
};

export const wrapLink = (editor, href) => {
  editor.wrapInline({
    type: "link",
    data: { href }
  });

  editor.moveToEnd();
};

export const unwrapLink = editor => {
  editor.unwrapInline("link");
};

export const setData = (editor, node, data) => {
  editor.setNodeByKey(node.key, { data: { ...node.data.toJS(), ...data } });
};

export const getData = (node, name, defaultValue = {}) => {
  return node.data.get(name) || defaultValue;
};

export const getAlignmentStyle = alignment => {
  switch (alignment) {
    case "align_right":
      return { textAlign: "right" };
    case "align_justify":
      return { textAlign: "justify" };
    case "align_center":
      return { textAlign: "center" };
    default:
      return { textAlign: "left" };
  }
};

export const hasLinks = editor => {
  const { value } = editor;
  return value.inlines.some(inline => inline.type === "link");
};

export const hasAlignment = (editor, alignment) => {
  const { value } = editor;
  return value.blocks.some(node => getData(node, "alignment") === alignment);
};

/**
 * Check if the current selection has a mark with `type` in it.
 *
 * @param {String} type
 * @return {Boolean}
 */

export const hasMark = (editor, type) => {
  const { value } = editor;
  return value.activeMarks.some(mark => mark.type === type);
};

/**
 * Check if the any of the currently selected blocks are of `type`.
 *
 * @param {String} type
 * @return {Boolean}
 */

export const hasBlock = (editor, type) => {
  const { value } = editor;
  return value.blocks.some(node => node.type === type);
};
