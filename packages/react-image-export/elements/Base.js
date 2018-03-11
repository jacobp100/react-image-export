const { sortBy, getOr } = require("lodash/fp");
const { flattenStyle } = require("../stylesheet");
const renderViewBackground = require("../render/viewBackground");
const processTransform = require("../render/transform");

module.exports = class Base {
  constructor(backend, settings, props = {}) {
    this.backend = backend;
    this.settings = settings;
    this.setProps(props);
    this.children = [];
    this.frame = null;
  }

  setProps({ children, style, ...props }) {
    this.props = props;
    this.style = flattenStyle(style) || {};
  }

  appendChild(child) {
    this.removeChild(child, false);
    this.children.push(child);
  }

  insertBefore(child, beforeChild) {
    this.removeChild(child, false);
    const beforeIndex = this.children.indexOf(beforeChild);
    this.children.splice(beforeIndex, 0, child);
  }

  removeChild(child, force = true) {
    const index = this.children.indexOf(child);
    if (index !== -1) {
      this.children.splice(index, 1);
    } else if (force) {
      throw new Error("Could not remove non-existent child");
    }
  }

  filteredChildren() {
    return this.measureFunc == null ? this.children : [];
  }

  /* eslint-disable */
  async getHostStyles() {
    return {};
  }
  /* eslint-enable */

  async render(parentOffset = { x: 0, y: 0 }) {
    const { backend, settings, frame, style } = this;

    if (style.display === "none") return;

    const hasTransform = style != null && style.transform != null;
    const hasAlpha =
      style != null && style.opacity != null && style.opacity !== 1;
    const hasClip = style.overflow === "hidden";

    if (hasTransform) {
      backend.pushTransform(processTransform(style.transform), frame);
    }

    if (hasAlpha) {
      backend.pushAlpha(style.opacity);
    }

    if (hasClip) {
      const ctx = backend.beginClip();
      renderViewBackground.clip(ctx, frame, settings, style);
      backend.pushClip();
    }

    const screenFrame = {
      x: this.frame.x + parentOffset.x,
      y: this.frame.y + parentOffset.y,
      width: this.frame.width,
      height: this.frame.height
    };

    await this.draw(screenFrame);
    const children = sortBy(getOr("style.zIndex", 0), this.filteredChildren());
    /* eslint-disable */
    const offset = { x: screenFrame.x, y: screenFrame.y };
    for (const child of children) {
      await child.render(offset);
    }
    /* eslint-enable */

    if (hasClip) backend.popClip();
    if (hasAlpha) backend.popAlpha();
    if (hasTransform) backend.popTransform();
  }

  // eslint-disable-next-line
  draw() {}
};
