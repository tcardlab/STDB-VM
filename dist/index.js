import { defineComponent, unref, withCtx, createTextVNode, toDisplayString, createVNode, useSSRContext, mergeProps, openBlock, createBlock, resolveDynamicComponent, createCommentVNode, Fragment, renderList } from 'vue';
import { TBox, TText, useInput, render } from '@temir/core';
import { ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderVNode } from 'vue/server-renderer';
import { computed, ref } from '@vue/runtime-core';
import figures from 'figures';
import os, { homedir } from 'os';
import path from 'path';
import fs from 'fs';
import * as stream from 'stream';
import axios from 'axios';
import child_process, { execSync } from 'node:child_process';
import { promisify } from 'node:util';
import { Command } from 'commander';
import { execSync as execSync$1 } from 'child_process';

const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "Item",
  __ssrInlineRender: true,
  props: {
    isSelected: { type: Boolean },
    label: null
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(TBox), _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(TText), {
              color: unref(props).isSelected ? "blue" : void 0
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(props).label)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(props).label), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(TText), {
                color: unref(props).isSelected ? "blue" : void 0
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(unref(props).label), 1)
                ]),
                _: 1
              }, 8, ["color"])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});

const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Selector/Item.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Indicator",
  __ssrInlineRender: true,
  props: {
    isSelected: null
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(TBox), mergeProps({ marginRight: 1 }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(props).isSelected) {
              _push2(ssrRenderComponent(unref(TText), { color: "blue" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(unref(figures).pointer)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(unref(figures).pointer), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(ssrRenderComponent(unref(TText), null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(" ")}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(" "))
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            }
          } else {
            return [
              unref(props).isSelected ? (openBlock(), createBlock(unref(TText), {
                key: 0,
                color: "blue"
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(unref(figures).pointer), 1)
                ]),
                _: 1
              })) : (openBlock(), createBlock(unref(TText), { key: 1 }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(" "))
                ]),
                _: 1
              }))
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});

const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Selector/Indicator.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Selector",
  __ssrInlineRender: true,
  props: {
    items: { default: () => [] },
    value: { default: 0 },
    frame_size: null,
    wrap: { type: Boolean, default: false },
    indicatorComponent: { default: _sfc_main$1 },
    itemComponent: { default: _sfc_main$2 },
    onSelect: null,
    onHighlight: null
  },
  emits: ["submit"],
  setup(__props, { emit }) {
    const props = __props;
    function wrapNormalize(index, len) {
      return (index % len + len) % len;
    }
    function onHandle(input, key) {
      let frameLen = frame.value.length;
      let mapLen = mapped.value.length;
      let atFrameStart = highlight.value === 0;
      let atArrStart = selected.value === 0;
      let atFrameEnd = highlight.value === frameLen - 1;
      let atArrEnd = selected.value === mapLen - 1;
      if (key.upArrow) {
        if (atFrameStart) {
          if (atArrStart && !props.wrap)
            return;
          return offset.value = wrapNormalize(offset.value - 1, mapLen);
        }
        highlight.value = ((highlight.value - 1) % frameLen + frameLen) % frameLen;
      } else if (key.downArrow) {
        console.log("REEEE");
        if (atFrameEnd) {
          if (atArrEnd && !props.wrap)
            return;
          return offset.value = wrapNormalize(offset.value + 1, mapLen);
        }
        highlight.value = (highlight.value + 1) % frame.value.length;
      } else if (key.return) {
        emit("submit", props.items[selected.value], selected.value);
      }
    }
    useInput(onHandle);
    const mapped = computed(() => props.items.reduce((acc, el, i) => [
      ...acc,
      { id: i, label: el.label, value: el.value }
    ], []));
    const highlight = ref(0);
    const offset = ref(props.value);
    function circularSlice(arr, startIndex) {
      const len = arr.length;
      let endIndex = +startIndex + +(props.frame_size || len) - 1;
      startIndex = wrapNormalize(startIndex, len);
      endIndex = wrapNormalize(endIndex, len);
      if (startIndex <= endIndex) {
        return arr.slice(startIndex, endIndex + 1);
      } else {
        return arr.slice(startIndex).concat(arr.slice(0, endIndex + 1));
      }
    }
    const frame = computed(() => {
      if (!props.frame_size)
        return mapped.value;
      return circularSlice(mapped.value, offset.value);
    });
    const selected = computed(() => {
      return wrapNormalize(offset.value + highlight.value, mapped.value.length);
    });
    let atStart = computed(() => selected.value === 0);
    let atEnd = computed(() => selected.value === mapped.value.length - 1);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(TBox), mergeProps({ flexDirection: "column" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (props.frame_size) {
              _push2(ssrRenderComponent(unref(TText), null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(unref(atStart) && !props.wrap ? " " : unref(figures).triangleUp)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(unref(atStart) && !props.wrap ? " " : unref(figures).triangleUp), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`<!--[-->`);
            ssrRenderList(unref(frame), (item) => {
              _push2(ssrRenderComponent(unref(TBox), null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    ssrRenderVNode(_push3, createVNode(resolveDynamicComponent(props.indicatorComponent), {
                      isSelected: item.id == unref(selected)
                    }, null), _parent3, _scopeId2);
                    ssrRenderVNode(_push3, createVNode(resolveDynamicComponent(props.itemComponent), {
                      isSelected: item.id == unref(selected),
                      label: "" + item.label
                    }, null), _parent3, _scopeId2);
                  } else {
                    return [
                      (openBlock(), createBlock(resolveDynamicComponent(props.indicatorComponent), {
                        isSelected: item.id == unref(selected)
                      }, null, 8, ["isSelected"])),
                      (openBlock(), createBlock(resolveDynamicComponent(props.itemComponent), {
                        isSelected: item.id == unref(selected),
                        label: "" + item.label
                      }, null, 8, ["isSelected", "label"]))
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
            _push2(ssrRenderComponent(unref(TText), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(!props.frame_size || !props.wrap && unref(atEnd) ? " " : unref(figures).triangleDown)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(!props.frame_size || !props.wrap && unref(atEnd) ? " " : unref(figures).triangleDown), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(TText), { color: "green" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(selected) + 1)}/${ssrInterpolate(unref(mapped).length)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(selected) + 1) + "/" + toDisplayString(unref(mapped).length), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              props.frame_size ? (openBlock(), createBlock(unref(TText), { key: 0 }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(unref(atStart) && !props.wrap ? " " : unref(figures).triangleUp), 1)
                ]),
                _: 1
              })) : createCommentVNode("", true),
              (openBlock(true), createBlock(Fragment, null, renderList(unref(frame), (item) => {
                return openBlock(), createBlock(unref(TBox), null, {
                  default: withCtx(() => [
                    (openBlock(), createBlock(resolveDynamicComponent(props.indicatorComponent), {
                      isSelected: item.id == unref(selected)
                    }, null, 8, ["isSelected"])),
                    (openBlock(), createBlock(resolveDynamicComponent(props.itemComponent), {
                      isSelected: item.id == unref(selected),
                      label: "" + item.label
                    }, null, 8, ["isSelected", "label"]))
                  ]),
                  _: 2
                }, 1024);
              }), 256)),
              createVNode(unref(TText), null, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(!props.frame_size || !props.wrap && unref(atEnd) ? " " : unref(figures).triangleDown), 1)
                ]),
                _: 1
              }),
              createVNode(unref(TText), { color: "green" }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(unref(selected) + 1) + "/" + toDisplayString(unref(mapped).length), 1)
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
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Selector.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

const execPromise = promisify(child_process.exec);
const finished = promisify(stream.finished);


const owner = 'clockworklabs';
const repo = 'SpacetimeDB';
let versions_path = path.join(os.homedir(), 'SpacetimeDB', 'versions');

let asset_map = {
  'win32_*'     :  'spacetime.exe'                ,
  'linux_x64'   :  'spacetime.linux-amd64.tar.gz' ,
  'linux_arm64' :  'spacetime.linux-arm64.tar.gz' ,
  'darwin_x64'  :  'spacetime.darwin-amd64.tar.gz',
  'darwin_arm64':  'spacetime.darwin-arm64.tar.gz',
};

function getPath(releaseTag) {
  return path.join(versions_path, releaseTag)
}


async function getRemoteVersions() {
  let res = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases`);
  let data = await res.json();
  return data
}


async function getCurrentVersion() {
  // could check path or `execute spacetime version`
  let {stdout, stderr} =  await execPromise('spacetime version');
  return stdout || stderr
}


async function getLatestVersion() {
  let res = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases/latest`);
  let data = await res.json();
  return data
}


async function downloadFile(url, dest, assetName) {
  fs.mkdirSync(dest, { recursive: true });

  const writer = fs.createWriteStream(path.join(dest, assetName));
  await axios({
    method: 'get',
    url: url,
    responseType: 'stream',
    onDownloadProgress: (progressEvent)=>{
      let percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
      console.log(percentCompleted,'%');
    }
  }).then(response => {
    response.data.pipe(writer);
    return finished(writer); //this is a Promise
  });

  // handle unzip if necessary
}


function getArch() {
  const platform = process.platform;
  const architecture = process.arch;
  return [
    platform, 
    platform === 'win32' ? '*' : architecture
  ]
}


function listLocalVersions() {
  // might want to validate they are directories
  return fs.readdirSync(versions_path)
}


function rmAllVersions() {
  for(let version of listLocalVersions()) {
    let vPath = path.join(versions_path, version);
    if (fs.statSync(vPath).isDirectory()) {
      fs.rmSync(vPath, { recursive: true });
    }
  }
}


function rmVersion(version) {
  let vPath = path.join(versions_path, version);
  if (fs.statSync(vPath)?.isDirectory?.()) {
    fs.rmSync(vPath, { recursive: true });
  }
}


async function downloadRelease(releaseTag) {
  let assetName = asset_map[getArch().join('_')];

  await fetch(`https://api.github.com/repos/${owner}/${repo}/releases/tags/${releaseTag}`)
    .then(response => {
      if (response.ok) return response.json();
      throw new Error(`Failed to fetch release information: ${response.status} ${response.statusText}`);
    })
    .then(async release => {
      // Find the desired asset by name
      const asset = release.assets.find(asset => asset.name === assetName);

      if (!asset) throw new Error(`Asset "${assetName}" not found in the release.`);

      // Download the asset
      const downloadUrl = asset.browser_download_url;
      const destinationPath = getPath(releaseTag);
      return await downloadFile(downloadUrl, destinationPath, assetName);
    })
    .then(() => {
      console.log('Asset downloaded successfully.');
    })
    .catch(error => {
      console.error('Error:', error);
    });
}


const noRender = function (cb) {
  return async (...args) =>  {
    await cb(...args);
    process.exit(0);
  }
};


function editPath(cb) {
  let [osType] = getArch();

  if (osType === 'win32') {
    // Get User PATH
    let userPath = execSync(`[Environment]::GetEnvironmentVariable("Path", [EnvironmentVariableTarget]::User)`, {
      shell: "powershell.exe"
    });

    let PathArr = userPath.toString().split(';');

    // Strip old STDB paths
    PathArr = PathArr.filter(p => !(/Program Files\\SpacetimeDB|SpacetimeDB[\s\t\n]*$|SpacetimeDB\\versions\\/.test(p)) );
    
    // Update User PATH cb
    PathArr = cb(PathArr);
    let newPATH = PathArr.join(';');

    // Update User PATH (requires restart)
    execSync(`[Environment]::SetEnvironmentVariable("PATH", "${newPATH}", [EnvironmentVariableTarget]::User)`, {
      shell: "powershell.exe"
    });
  } else {
    console.log("OS not supported yet");
    // prob use cross-env to update others
  }

  //console.log('Updated Path - please restart terminal...')
}


function getExePath(dir) {
  // idk if every platform ends with .exe, so doing this to be safe
  let files = fs.readdirSync(dir);
  const spacetimeFile = files.find((filename) => filename.startsWith('spacetime'));
  
  if (spacetimeFile) {
    return path.join(dir, spacetimeFile)
  } else {
    throw new Error("No file starting with 'spacetime' found in the directory.");
  }
}

render(createVNode(_sfc_main$2, {
  "label": 'HI'
}, null));
let stdb_path = path.join(homedir(), 'SpacetimeDB');
const program = new Command();
program.name('stdb-vm') //process.env.npm_package_name)
.description('SpacetimeDB version manager!').version('v0.0.0'); //process.env.npm_package_version)
// .exitOverride()

program.command('current').description('Show active SpacetimeDB version and path.').action(noRender(async () => {
  // early versions don't provide path...
  console.log(execSync$1('where spacetime').toString()); // powershell only (otherwise can use 'where')
  console.log(await getCurrentVersion());
  // render(App)
}));
let renderWait = (component, cb) => {
  let r;
  let resolvableCB = cb(() => ender(r) /* Kill render cb */, r);
  r = render(component(resolvableCB));
  return r.waitUntilExit();
};
function toSelectable(list) {
  return list.map(el => ({
    label: el,
    value: el
  }));
}
function ender(renderer) {
  renderer.clear();
  renderer.unmount();
}
program.command('set').description('Set active SpacetimeDB version by tag name. (Has selector for no args)').option('<version>', 'Specific version to set.').option('-d, --direct', 'Use direct path to SpacetimeDB Version rather than replacing default.').option('-r, --remote', 'Set version from remote release list.').action(async (options, cmd) => {
  // If not given version use app selector (local list? --remote to see full list)
  let version = cmd.args[0];
  let isDefault = options.direct !== true;
  if (!version) {
    let versionArr;
    {
      if (options.remote) {
        let remoteVersions = await getRemoteVersions();
        versionArr = toSelectable(remoteVersions.map(release => release.tag_name));
      } else {
        let localVersions = listLocalVersions().reverse();
        versionArr = toSelectable(localVersions);
      }
      if (!versionArr.length) {
        console.log(`No ${options.remote ? 'remote' : 'local'} versions found?`);
        process.exit(1);
      }
    }

    // Wait for version to be selected
    await renderWait(cb => createVNode(_sfc_main, {
      "items": versionArr,
      "onSubmit": cb,
      "wrap": true
    }, null), exit => selected => {
      console.log('Selected:', selected.value);
      version = selected.value;
      exit();
    });
    if (!version) process.exit(1); // quit without selecting
  }

  // If version doesn't exist: attempt download
  if (!listLocalVersions().includes(version)) {
    console.log('Downloading:', version);
    await downloadRelease(version);
  }

  // Get Paths and Dirs
  let version_dir = path.join(stdb_path, 'versions', version);
  let desired_path = isDefault ? stdb_path : version_dir;
  let current_path;
  try {
    let res_path = execSync$1('where spacetime').toString().split('\n')?.[0]; // can match multiple
    current_path = path.dirname(res_path);
  } catch (err) {
    // just means path not set, nbd
    // console.log(err.message)
  }

  // replace default exe with desired version
  if (isDefault) {
    fs.copyFileSync(getExePath(version_dir), getExePath(stdb_path));
    console.log('Updated default exe');
  }

  // Update paths:
  // Must always update as its hard to know for sure
  // what is set "outside the runtime" without terminal restart
  editPath(pathArr => [...pathArr, desired_path]);
  if (desired_path !== current_path) {
    console.warn(`Restart or patch env:\n\t $env:Path = "${desired_path};" + $env:PATH`);
  }
  process.exit(0);
});
program.command('use-default').description('Set SpacetimeDB path back to default `{homeDir}/SpacetimeDB`.').action(noRender(async (options, cmd) => {
  let current_path;
  try {
    let res_path = execSync$1('where spacetime').toString().split('\n')?.[0]; // can match multiple
    current_path = path.dirname(res_path);
  } catch (err) {
    console.log(err.message);
  }
  let desired_path = stdb_path;
  // Must always update as its hard to know for sure
  // what is set "outside the runtime" without terminal restart
  editPath(pathArr => [...pathArr, desired_path]);
  if (desired_path !== current_path) {
    console.warn(`Restart or patch env:\n\t $env:Path = "${desired_path};" + $env:PATH`);
  } else {
    console.log('Already on default');
  }
}));
program.command('latest').description('Check latest release on github.').action(noRender(async () => {
  console.log((await getLatestVersion()).tag_name);
}));
program.command('list').description('List downloaded SpacetimeDB versions.').action(noRender(() => {
  console.log(listLocalVersions());
}));
program.command('releases').description('List SpacetimeDB releases on github.').action(noRender(async () => {
  let releases = await getRemoteVersions();
  console.log(releases.map(release => release.tag_name));
}));
program.command('load').description('Download SpacetimeDB version. (Has selector for no args)').option('<version>', 'Download specific version.').action(async (_, cmd) => {
  if (cmd.args[0]) {
    await downloadRelease(cmd.args[0]);
    process.exit(0);
  }
  let releases = await getRemoteVersions();
  let remoteVersions = toSelectable(releases.map(release => release.tag_name));
  if (!remoteVersions.length) {
    console.log('No remote versions found?');
    process.exit(1);
  }
  let r = render(createVNode(_sfc_main, {
    "items": remoteVersions,
    "onSubmit": handleLoad,
    "wrap": true,
    "frame": 5
  }, null));
  async function handleLoad(version, index) {
    console.log('Load:', version.value);
    ender(r);
    await downloadRelease(version.value);
    process.exit(0);
  }
});
program.command('rm').allowUnknownOption().description('Delete SpacetimeDB version. (Has selector for no args)').option('<version>', 'Specific version to remove.').option('--all', 'Download specific version.').action(async (options, cmd) => {
  let versionArg = cmd.args[0];
  if (options.all) {
    rmAllVersions();
  } else if (versionArg) {
    rmVersion(versionArg);
  } else {
    let localVersions = toSelectable(listLocalVersions().reverse());
    if (!localVersions.length) {
      console.log('No local versions found');
      process.exit(1);
    }
    let version;
    await renderWait(cb => createVNode(_sfc_main, {
      "items": localVersions,
      "onSubmit": cb,
      "wrap": true
    }, null), exit => selected => {
      console.log('rm:', selected.value);
      version = selected.value;
      exit();
    });
    if (!version) process.exit(1); // exit without selecting
    rmVersion(version);
  }
  process.exit(0);
});
program.parse();

/* if (process.env['npm_lifecycle_event'] !== 'docs') {
  // dont run for doc gen
  program.parse()
}

export default program */
