//import { render } from '@temir/core'

//import App from './App.vue'
/*
  i think i can just use an event emitter to send desired 
  component and data/props to update renderer
*/

import { 
  getRemoteVersions, getCurrentVersion, getLatestVersion, 
  downloadRelease, listLocalVersions, noRender,
  rmAllVersions, rmVersion, editPath
} from "./utils.js"

import { Command } from 'commander';
import { createRequire } from "module";

const require = createRequire(import.meta.url);
let pkg_json = require('./package.json')


const program = new Command();

program
  .name('STDB-VM')
  .description('SpacetimeDB version manager!')
  .version(pkg_json.version) // process.env.npm_package_version


program.command('current')
  .description('Active spacetime version')
  .action(noRender(async () => {
    // early versions dont provide path...
    console.log(execSync('where spacetime').toString()) // powershell only (otherwise can use 'where')
    console.log(await getCurrentVersion())
    // render(App)
  }));

import { homedir } from "os";
import path from "path"
import fs from "fs"

function getExePath(dir) {
  let files = fs.readdirSync(dir)
  const spacetimeFile = files.find((filename) => filename.startsWith('spacetime'));
  
  if (spacetimeFile) {
    return path.join(dir, spacetimeFile)
  } else {
    throw new Error("No file starting with 'spacetime' found in the directory.");
  }
}

import {execSync} from 'child_process'
let stdb_path = path.join(homedir(), 'SpacetimeDB')
program.command('set')
  .option('<version>', 'specific version to set.')
  .option('-d, --direct', 'Use direct path to SpacetimeDB Version rather than replacing default')
  .option('--remote, -r', 'set version from remote list')
  .action(noRender(async (options, cmd) => {
    // If not given version use app selector (local list? --remote to see full list)
    let version = cmd.args[0]
    let isDefault = options.direct !== true
    if (!version) {
      console.log("use app selector on:", options.remote ? 'remote': 'local' )
    }

    // If version doesn't exist: attempt download
    if(!listLocalVersions().includes(version)) {
      console.log('Downloading:', version)
      await downloadRelease(cmd.args[0])
    }

    // Does current path match?
    let current_path;
    try{
      /*// early versions dont provide path...
        let res = execSync('spacetime version').toString()
        let match = res.match(/Path: (.*?)\n/)  
        if (match) { current_path = path.dirname(match[1]) }
        else { throw new Error('Match not found') } 
      */
      // (Get-Command spacetime).path
      let res_path = execSync('where spacetime').toString().split('\n')?.[0] // can match multiple
      current_path = path.dirname(res_path)
    } catch (err) {
      console.log(err.message)
    }

    let version_dir = path.join(stdb_path, 'versions', version)
    let desired_path = isDefault ? stdb_path : version_dir

    // replace default exe with desired version
    if (isDefault) {
      fs.copyFileSync(getExePath(version_dir), getExePath(stdb_path)) 
      console.log('updated default exe')
    }

    // Update paths
    if (desired_path !== current_path) {
      editPath((pathArr)=>[...pathArr, desired_path])
      //console.warn(`Restart or patch env: $env:Path += ";${desired_path}"`)
      console.warn(`Restart or patch env:\n\t $env:Path = "${desired_path};" + $env:PATH`)
    }
  }));

program.command('use-default')
  .action(noRender(async (options, cmd) => {
    let current_path;
    try{
      let res_path = execSync('where spacetime').toString().split('\n')?.[0] // can match multiple
      current_path = path.dirname(res_path)
    } catch (err) {
      console.log(err.message)
    }

    let desired_path = stdb_path;
    if (desired_path !== current_path) {
      editPath((pathArr)=>[...pathArr, desired_path])
      //console.warn(`Restart or patch env: $env:Path += ";${desired_path}"`)
      console.warn(`Restart or patch env:\n\t $env:Path = "${desired_path};" + $env:PATH`)
    } else {
      console.log('you are already on default')
    }
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
  .description('Split a string into substrings and display as an array')
  .option('<version>', 'Download specific version.')
  .action(noRender(async (_, cmd) => {
    console.log("load", cmd.args[0])
    if (cmd.args[0]) return await downloadRelease(cmd.args[0])

    console.log('will use app selector')
  }));

program.command('rm')
  .allowUnknownOption()
  .description('Delete SpacetimeDB version.')
  .option('<version>', 'string to split')
  .option('--all', 'Download specific version.')
  .action(noRender((options, cmd) => {
    let versionArg = cmd.args[0]
    if (options.all) {
      return rmAllVersions()
    } else if (versionArg) {
      rmVersion(versionArg)
    } else {
      console.log('app selector...')
    }
  }));


// Temir passes in the file as an arg, so we gotta remove that in dev mode
//let args = [...process.argv]
//if (process.env.npm_command) args.splice(2,1)
//program.parse(args)

program.parse()

/* program.exitOverride(()=>{
  console.log('hi')
  process.exit(0)
}) */