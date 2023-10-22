# STDB-VM
[SpacetimeDB](https://spacetimedb.com/) Version Manager (Windows only atm)<br/>
( This repo has no official association with SpacetimeDB )

<br/>

This tool is useful when:
1. Wanting to change STDB versions with ease
2. Working on two STDB projects at the same time and switching relatively frequently.
3. Frequently switching between two branches on different versions.
4. Testing how old and new systems interact with each other: 
    - e.g. test how old client generated bindings and UI interact with new DB updates/modules. Useful for live module updates, slow roll-outs, zero-downtime/non-forced/manual update systems, etc.
5. Offline version switching.
6. Loading the earliest and latest of versions.

<br/>

Change default version release listings with `--remote` flag:
```sh
stdb-vm set -r
# apply given env patch
```

<br/>

Use `--direct` flag to point to different local versions simultaneously:
```sh
# Terminal 1
stdb-vm set version-1 -d # apply given env patch

# Terminal 2
stdb-vm set version-2 -d # apply given env patch

# later - return to default instance
stdb-vm use-default 
```

## Getting Started

> Assumes you already have [SpacetimeDB](https://spacetimedb.com/install) installed

Using:
```shell
npm i -g <package not released yet>
stdb-vm <cmd> <args...> <options...>
```
<!--https://stackoverflow.com/a/39217735-->

Developing:
```shell
# clone
npm i
npm start -- <cmd> <args...> <options...>
```


## Todo:
- [ ] Selection lists
- [ ] Publish: Build, npm dist, and make globally accessible 
<!-- https://blog.logrocket.com/building-typescript-cli-node-js-commander/#making-cli-globally-accessible -->
<!--https://stackoverflow.com/a/39217735-->
- [ ] Refactor (cmd route like directories, group vue and commander cmds, components dir)
- [ ] Doc generations (determine if cmd or import, iterate over help)
- [ ] Add support for other OS's

Another question is whether to wrap the whole app in vue
or whether to just use components as needed.

I am not sure if the `.spacetime` directory is subject to breaking changes.
I may need to version that as well and inform users to pass that path via `spacetime start <STDB_PATH>`
I may be able to provide a helper command to start so they do not have to pass path manually.

<br/>

# Docs
<!--Insert Generated Docs Below-->