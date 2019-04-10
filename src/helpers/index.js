export const DEFAULT_NODE = "paragraph";

/**
 * A change function to standardize inserting images.
 *
 * @param {Editor} editor
 * @param {String} src
 * @param {Range} target
 */

export const insertImage = (editor, src, target) => {
  if (target) {
    editor.select(target);
  }

  editor.insertBlock({
    type: "image",
    data: { src }
  });
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
