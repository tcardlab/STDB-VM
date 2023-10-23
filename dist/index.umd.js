(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(require("@temir/core"), require("vue")) : typeof define === "function" && define.amd ? define(["@temir/core", "vue"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global.temir, global.Vue));
})(this, function(temir, vue) {
  "use strict";
  const _interopDefaultLegacy = (e) => e && typeof e === "object" && "default" in e ? e : { default: e };
  const temir__default = /* @__PURE__ */ _interopDefaultLegacy(temir);
  const _sfc_main = {
    __name: "Item",
    setup(__props) {
      console.info("comp ran");
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.unref(temir.TBox), null, {
          default: vue.withCtx(() => [
            vue.createVNode(vue.unref(temir.TText), null, {
              default: vue.withCtx(() => [
                vue.createTextVNode(" test ")
              ]),
              _: 1
            })
          ]),
          _: 1
        });
      };
    }
  };
  let {
    render
  } = temir__default.default;
  render(_sfc_main, {
    patchConsole: false
  });
});
