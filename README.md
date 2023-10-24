# STDB-VM
[SpacetimeDB](https://spacetimedb.com/) Version Manager (Windows only atm)<br/>
( This repo has no official association with SpacetimeDB )

<br/>

This tool is useful when:
1. Wanting to change STDB versions with ease (run old projects, git-bisect, upgrading etc.)
2. Working on two STDB projects at the same time and switching relatively frequently.
3. Frequently switching between two branches on different versions.
4. Testing how old and new systems interact with each other: 
    - e.g. test how old client generated bindings and UI interact with new DB updates/modules. Useful for live module updates, slow roll-outs, zero-downtime/non-forced/manual update systems, etc.
5. Offline version switching.
6. Loading the earliest and latest of versions.

<br/>

Change default version release listings with `--remote` flag:
```sh
stvm set -r
# apply given env patch
```

<br/>

Use `--direct` flag to point to different local versions simultaneously:
```sh
# Terminal 1
stvm set version-1 -d # apply given env patch
stvm start

# Terminal 2
stvm set version-2 -d # apply given env patch
stvm start

# later - return to default instance
stvm use-default 
```

## Getting Started

<!-- > Assumes you already have [SpacetimeDB](https://spacetimedb.com/install) installed -->

Using:
```shell
npm i -g <package not released yet>
stdb-vm <cmd> <args...> <options...>
# alias
stvm <cmd> <args...> <options...>
```
<!--https://stackoverflow.com/a/39217735-->

Developing:
```shell
# clone, then:
npm i
npm start -- <cmd> <args...> <options...>

# Generate cli docs
npm run docs

# build
npm run build
npm run built:Test -- <cmd> <args...> <options...>

# test globally
npm install -g .
```


## Todo:
- [ ] Selection lists
- [ ] Publish: Build, npm dist, and make globally accessible 
<!-- https://blog.logrocket.com/building-typescript-cli-node-js-commander/#making-cli-globally-accessible -->
<!-- https://stackoverflow.com/a/39217735 -->
- [ ] Refactor (cmd route like directories, group vue and commander cmds, components dir)
- [ ] Doc generations (determine if cmd or import, iterate over help)
- [ ] Add support for other OS's
- [ ] Pure semver support so you don't have to be picky with tag names
    - https://docs.npmjs.com/cli/v6/using-npm/semver
- [ ] Use loading bar component for downloads
- [ ] rmdb cmd to remove db's in .spacetime/versions

Another question is whether to wrap the whole app in vue
or whether to just use components as needed.

I am not sure if the `.spacetime` directory is subject to breaking changes.
I may need to version that as well and inform users to pass that path via `spacetime start <STDB_PATH>`
I may be able to provide a helper command to start so they do not have to pass path manually.

<br/>

<!-- Insert Generated Docs Below `# Docs` -->
# Docs

<br/>


<h3>help:</h3>

```
Usage: stdb-vm [options] [command]

Alias: stvm

SpacetimeDB Version Manager!

Options:
  -V, --version    output the version number
  -h, --help       display help for command

Commands:
  current          Show active SpacetimeDB version and path.
  set [options]    Set active SpacetimeDB version by tag name. (Has selector
                   for no args)
  use-default      Set SpacetimeDB path back to default
                   `{homeDir}/SpacetimeDB`.
  latest           Check latest release on github.
  list             List downloaded SpacetimeDB versions.
  releases         List SpacetimeDB releases on github.
  load [options]   Download SpacetimeDB version. (Has selector for no args)
  rm [options]     Delete SpacetimeDB version. (Has selector for no args)
  start [options]  Start SpacetimeDB runtime with a version specific DB
                   directory.
                   (Mitigates versions introducing breaking changes and avoids
                   file lock allowing multiple versions to run at once.)
  help [command]   display help for command
```

<h3>current:</h3>

```
Usage: stdb-vm current [options]

Show active SpacetimeDB version and path.

Options:
  -h, --help  display help for command
```

<h3>set:</h3>

```
Usage: stdb-vm set [options]

Set active SpacetimeDB version by tag name. (Has selector for no args)

Options:
  <version>     Specific version to set.
  -d, --direct  Use direct path to SpacetimeDB Version rather than replacing
                default.
  -r, --remote  Set version from remote release list.
  -h, --help    display help for command
```

<h3>use-default:</h3>

```
Usage: stdb-vm use-default [options]

Set SpacetimeDB path back to default `{homeDir}/SpacetimeDB`.

Options:
  -h, --help  display help for command
```

<h3>latest:</h3>

```
Usage: stdb-vm latest [options]

Check latest release on github.

Options:
  -h, --help  display help for command
```

<h3>list:</h3>

```
Usage: stdb-vm list [options]

List downloaded SpacetimeDB versions.

Options:
  -h, --help  display help for command
```

<h3>releases:</h3>

```
Usage: stdb-vm releases [options]

List SpacetimeDB releases on github.

Options:
  -h, --help  display help for command
```

<h3>load:</h3>

```
Usage: stdb-vm load [options]

Download SpacetimeDB version. (Has selector for no args)

Options:
  <version>   Download specific version.
  -h, --help  display help for command
```

<h3>rm:</h3>

```
Usage: stdb-vm rm [options]

Delete SpacetimeDB version. (Has selector for no args)

Options:
  <version>   Specific version to remove.
  --all       Download specific version.
  -h, --help  display help for command
```

<h3>start:</h3>

```
Usage: stdb-vm start [options]

Start SpacetimeDB runtime with a version specific DB directory.
(Mitigates versions introducing breaking changes and avoids file lock allowing
multiple versions to run at once.)

Options:
  <args...>   argument passthrough to `spacetime start`
  -h, --help  display help for command
```
