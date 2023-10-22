// #! /usr/bin/env node

import { render } from '@temir/core'
import Selector from './components/Selector.vue'

import SelectInputItem from './components/Selector/Item.vue' 

render(<SelectInputItem label={'HI'}/>)

import { 
  getRemoteVersions, getCurrentVersion, getLatestVersion, 
  downloadRelease, listLocalVersions, noRender,
  rmAllVersions, rmVersion, editPath, getExePath
} from "./utils.js"

import { Command } from 'commander';

import {execSync} from 'child_process'
import { homedir } from "os";
import path from "path"
import fs from "fs"

let stdb_path = path.join(homedir(), 'SpacetimeDB')

const program = new Command();

program
  .name('stdb-vm')//process.env.npm_package_name)
  .description('SpacetimeDB version manager!')
  .version('v0.0.0') //process.env.npm_package_version)
  // .exitOverride()


program.command('current')
  .description('Show active SpacetimeDB version and path.')
  .action(noRender(async () => {
    // early versions don't provide path...
    console.log(execSync('where spacetime').toString()) // powershell only (otherwise can use 'where')
    console.log(await getCurrentVersion())
    // render(App)
  }));


let renderPromise = async (component, cb) => {
  return new Promise((resolve, reject) => {
    let r;
    let resolvableCB = cb(()=>r, resolve, reject)
    r = render(component(resolvableCB))
  })
}

let renderWait = (component, cb) => {
  let r;
  let resolvableCB = cb(()=>ender(r)/* Kill render cb */, r)
  r = render(component(resolvableCB))
  return r.waitUntilExit()
}

function toSelectable(list) {
  return list.map(el =>({label:el, value:el}))
}

function ender(renderer) {
  renderer.clear()
  renderer.unmount()
}

program.command('set')
  .description('Set active SpacetimeDB version by tag name. (Has selector for no args)')
  .option('<version>', 'Specific version to set.')
  .option('-d, --direct', 'Use direct path to SpacetimeDB Version rather than replacing default.')
  .option('-r, --remote', 'Set version from remote release list.')
  .action(async (options, cmd) => {
    // If not given version use app selector (local list? --remote to see full list)
    let version = cmd.args[0]
    let isDefault = options.direct !== true
    if (!version) {
      let versionArr;
      GET_VERSIONS : {
        if (options.remote) {
          let remoteVersions = await getRemoteVersions()
          versionArr = toSelectable(remoteVersions.map(release => release.tag_name))
        } else {
          let localVersions = listLocalVersions().reverse()
          versionArr = toSelectable(localVersions)
        }

        if (!versionArr.length) {
          console.log(`No ${options.remote ? 'remote' : 'local'} versions found?`)
          process.exit(1)
        }
      }

      // Wait for version to be selected
      await renderWait(
        cb => <Selector items={versionArr} onSubmit={cb} wrap={true}/>,
        exit => selected => {
          console.log('Selected:', selected.value)
          version = selected.value
          exit()
        }
      )
      if(!version) process.exit(1) // quit without selecting
    }

    // If version doesn't exist: attempt download
    if(!listLocalVersions().includes(version)) {
      console.log('Downloading:', version)
      await downloadRelease(version)
    }

    // Get Paths and Dirs
    let version_dir = path.join(stdb_path, 'versions', version)
    let desired_path = isDefault ? stdb_path : version_dir
    let current_path;
    try{
      let res_path = execSync('where spacetime').toString().split('\n')?.[0] // can match multiple
      current_path = path.dirname(res_path)
    } catch (err) {
      // just means path not set, nbd
      // console.log(err.message)
    }

    // replace default exe with desired version
    if (isDefault) {
      fs.copyFileSync(getExePath(version_dir), getExePath(stdb_path)) 
      console.log('Updated default exe')
    }

    // Update paths:
    // Must always update as its hard to know for sure
    // what is set "outside the runtime" without terminal restart
    editPath((pathArr)=>[...pathArr, desired_path])
    if (desired_path !== current_path) {
      console.warn(`Restart or patch env:\n\t $env:Path = "${desired_path};" + $env:PATH`)
    }

    process.exit(0)
  });

program.command('use-default')
  .description('Set SpacetimeDB path back to default `{homeDir}/SpacetimeDB`.')
  .action(noRender(async (options, cmd) => {
    let current_path;
    try{
      let res_path = execSync('where spacetime').toString().split('\n')?.[0] // can match multiple
      current_path = path.dirname(res_path)
    } catch (err) {
      console.log(err.message)
    }

    let desired_path = stdb_path;
    // Must always update as its hard to know for sure
    // what is set "outside the runtime" without terminal restart
    editPath((pathArr)=>[...pathArr, desired_path])
    if (desired_path !== current_path) {
      console.warn(`Restart or patch env:\n\t $env:Path = "${desired_path};" + $env:PATH`)
    } else { console.log('Already on default') }
  }));

program.command('latest')
  .description('Check latest release on github.')
  .action(noRender(async () => {
    console.log( (await getLatestVersion()).tag_name )
  }));

program.command('list')
  .description('List downloaded SpacetimeDB versions.')
  .action(noRender(() => {
    console.log(listLocalVersions())
  }));

program.command('releases')
  .description('List SpacetimeDB releases on github.')
  .action(noRender(async () => {
    let releases = await getRemoteVersions()
    console.log(releases.map(release => release.tag_name))
  }));

program.command('load')
  .description('Download SpacetimeDB version. (Has selector for no args)')
  .option('<version>', 'Download specific version.')
  .action(async (_, cmd) => {
    if (cmd.args[0]) {
      await downloadRelease(cmd.args[0])
      process.exit(0)
    }

    let releases = await getRemoteVersions()
    let remoteVersions = toSelectable(releases.map(release => release.tag_name))
    if (!remoteVersions.length) {
      console.log('No remote versions found?')
      process.exit(1)
    }

    let r = render(<Selector items={remoteVersions} onSubmit={handleLoad} wrap={true} frame={5}/>)
    async function handleLoad(version, index) {
      console.log('Load:', version.value)
      ender(r)
      await downloadRelease(version.value)
      process.exit(0)
    }
  });


program.command('rm')
  .allowUnknownOption()
  .description('Delete SpacetimeDB version. (Has selector for no args)')
  .option('<version>', 'Specific version to remove.')
  .option('--all', 'Download specific version.')
  .action(async (options, cmd) => {
    let versionArg = cmd.args[0]
    if (options.all) {
      rmAllVersions()
    } else if (versionArg) {
      rmVersion(versionArg)
    } else {
      let localVersions = toSelectable(listLocalVersions().reverse())
      if (!localVersions.length) {
        console.log('No local versions found')
        process.exit(1)
      }

      let version;
      await renderWait(
        cb => <Selector items={localVersions} onSubmit={cb} wrap={true}/>,
        exit => selected => {
          console.log('rm:', selected.value)
          version = selected.value
          exit()
      })
      if (!version) process.exit(1) // exit without selecting
      rmVersion(version)
    }

    process.exit(0)
  })

program.parse()

/* if (process.env['npm_lifecycle_event'] !== 'docs') {
  // dont run for doc gen
  program.parse()
}

export default program */