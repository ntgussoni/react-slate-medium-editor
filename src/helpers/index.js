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
