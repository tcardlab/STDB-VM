import temir from "@temir/core";
import { resolveComponent, withCtx, createTextVNode, createVNode, useSSRContext } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
const _sfc_main = {
  __name: "Item",
  __ssrInlineRender: true,
  setup(__props) {
    console.info("comp ran");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_TBox = resolveComponent("TBox");
      const _component_TText = resolveComponent("TText");
      _push(ssrRenderComponent(_component_TBox, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_TText, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` test `);
                } else {
                  return [
                    createTextVNode(" test ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_TText, null, {
                default: withCtx(() => [
                  createTextVNode(" test ")
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Selector/Item.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
let {
  render
} = temir;
console.log("hit");
let r = render(_sfc_main);
console.log(r);
