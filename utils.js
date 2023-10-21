
import os from 'os'
import path from 'path'
import fs from 'fs'
import * as stream from 'stream';
import axios from 'axios';

import { execSync } from "child_process"
import child_process from "node:child_process"
import { promisify } from 'node:util'
const execPromise = promisify(child_process.exec)



const owner = 'clockworklabs'
const repo = 'SpacetimeDB'

export async function getRemoteVersions() {
  let res = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases`)
  let data = await res.json()
  return data
}


export async function getCurrentVersion() {
  // could check path or `execute spacetime version`
  let {stdout, stderr} =  await execPromise('spacetime version')
  return stdout || stderr
}


export async function getLatestVersion() {
  let res = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases/latest`)
  let data = await res.json()
  return data
}


const finished = promisify(stream.finished);
async function downloadFile(url, dest, assetName) {
  fs.mkdirSync(dest, { recursive: true });

  const writer = fs.createWriteStream(path.join(dest, assetName));
  await axios({
    method: 'get',
    url: url,
    responseType: 'stream',
    onDownloadProgress: (progressEvent)=>{
      let percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total )
      console.log(percentCompleted,'%');
    }
  }).then(response => {
    response.data.pipe(writer);
    return finished(writer); //this is a Promise
  });

  // handle unzip if necessary
}


export function getArch() {
  const platform = process.platform;
  const architecture = process.arch;
  return [
    platform, 
    platform === 'win32' ? '*' : architecture
  ]
}

let versions_path = path.join(os.homedir(), 'SpacetimeDB', 'versions')

export function listLocalVersions() {
  // might want to validate they are directories
  return fs.readdirSync(versions_path)
}

export function rmAllVersions() {
  for(let version of listLocalVersions()) {
    let vPath = path.join(versions_path, version)
    if (fs.statSync(vPath).isDirectory()) {
      fs.rmSync(vPath, { recursive: true })
    }
  }
}

export function rmVersion(version) {
  let vPath = path.join(versions_path, version)
  if (fs.statSync(vPath)?.isDirectory?.()) {
    fs.rmSync(vPath, { recursive: true })
  }
}

let asset_map = {
  'win32_*'     :  'spacetime.exe'                ,
  'linux_x64'   :  'spacetime.linux-amd64.tar.gz' ,
  'linux_arm64' :  'spacetime.linux-arm64.tar.gz' ,
  'darwin_x64'  :  'spacetime.darwin-amd64.tar.gz',
  'darwin_arm64':  'spacetime.darwin-arm64.tar.gz',
}


function getPath(releaseTag) {
  return path.join(versions_path, releaseTag)
}

export async function downloadRelease(releaseTag) {
  let assetName = asset_map[getArch().join('_')]

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

export const noRender = function (cb) {
  return async (...args) =>  {
    await cb(...args)
    process.exit(0)
  }
}

//import crossEnv from 'cross-env'
export function editPath(cb) {
  let [osType] = getArch()

  if (osType === 'win32') {
    // Get User PATH
    let userPath = execSync(`[Environment]::GetEnvironmentVariable("Path", [EnvironmentVariableTarget]::User)`, {
      shell: "powershell.exe"
    })

    let PathArr = userPath.toString().split(';')

    // Strip old STDB paths
    PathArr = PathArr.filter(p => !(/Program Files\\SpacetimeDB|SpacetimeDB[\s\t\n]*$|SpacetimeDB\\versions\\/.test(p)) )
    
    // Update User PATH cb
    PathArr = cb(PathArr)
    let newPATH = PathArr.join(';')

    // Update User PATH (requires restart)
    execSync(`[Environment]::SetEnvironmentVariable("PATH", "${newPATH}", [EnvironmentVariableTarget]::User)`, {
      shell: "powershell.exe"
    })

    /* // Tmp Update User PATH (to avoid restart)
    execSync(`$env:PATH = [Environment]::GetEnvironmentVariable("Path", [EnvironmentVariableTarget]::Machine)+"${newPATH}";$env:Path -replace ';', "\`n"`, {
      shell: "powershell.exe"
    }) */
  } else {
    console.log("OS not supported yet")
    // prob use cross-env to update others
  }

  //console.log('Updated Path - please restart terminal...')
}