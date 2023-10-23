import temir, { TBox, TText } from "@temir/core";
import { openBlock, createBlock, unref, withCtx, createVNode, createTextVNode } from "vue";
const _sfc_main = {
  __name: "Item",
  setup(__props) {
    console.info("comp ran");
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(TBox), null, {
        default: withCtx(() => [
          createVNode(unref(TText), null, {
            default: withCtx(() => [
              createTextVNode(" test ")
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
} = temir;
render(_sfc_main, {
  patchConsole: false
});
