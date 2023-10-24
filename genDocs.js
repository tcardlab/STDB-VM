// process exits, so we cant do this...
/* process.argv = []
import program from './index.jsx'

program.parse(['help'])
console.log('REEE', x) 
*/

import { execSync } from "child_process"

let commandNames;
GET_CMDS : {
  let res = execSync('npm start help').toString()

  // Split the input text into lines and find the lines after "Commands:"
  const lines = res.split('\n')
  const commandLines = lines.slice(lines.indexOf('Commands:') + 1)

  // Extract the first word of each line
  commandNames = commandLines
    .filter(line => /^\s\s\w/.test(line))
    .map(line=>line.trim().split(' ')[0])
    .filter(name => name !== '') // Filter out empty strings
    //.sort()
  
  // CMDs are in order we defined them
  // But help is added last, this move it to the front
  commandNames.unshift(commandNames.pop())

  //console.log(commandNames)
}

import { exec } from "child_process"
import {promisify} from 'util'
import fs from 'fs'
const execPro = promisify(exec)
!(async () => {
  let i=1;
  let cancel = setInterval(()=>console.log(i++, 'seconds (takes ~5s)'), 1e3)
  let start = Date.now()

  let docObj = {}
  SYNC_EXEC : {/*  // 17sec
    for (let [i, cmd] of Object.entries(commandNames)) {
      console.log(`${i}/${commandNames.length}`, cmd)
      let cmdRes = execSync(`npm start help ${cmd==='help' ? '' : cmd}`).toString()
      docObj[cmd] = cmdRes
    }
   */}
  ASYNC_EXEC : { // 4sec
    for (let [i, cmd] of Object.entries(commandNames)) {
      let cmdRes = execPro(`npm start help ${cmd==='help' ? '' : cmd}`)
      docObj[cmd] = cmdRes
      cmdRes.then(v=>docObj[cmd]=v.stdout) // replace l8r
    }
    await Promise.all(Object.values(docObj))
  }

  console.log( (Date.now() - start) / 1e3, 'seconds')
  clearInterval(cancel)

  return docObj
})()
.then(obj => {
  let tag = '\n# Docs'
  let filePath = './README.md'
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return console.error('Error reading the file:', err)
  
    // Find the position of tag in the file content
    const endIndex = data.indexOf(tag);
    if (endIndex === -1) return console.error(`The string "${tag}" was not found in the file.`)

    // Edit content
    const staticContent = data.slice(0, endIndex + tag.length)
    const editedContent = staticContent + '\n\n<br/>\n\n' + formatCmdObj(obj)

    // Write the edited content back to the file
    fs.writeFile(filePath, editedContent, 'utf8', (err) => {
      if (err) console.error('Error writing the edited content to the file:', err)
      console.log('File edited successfully.');
    })
  })
})

function formatCmdObj(obj) {
  let out = ''
  for (let [k, v] of Object.entries(obj)) {
    out += `\n<h3>${k}:</h3>\n\n`
    out += `\`\`\`${v.substring(v.indexOf('\nUsage:'))}\`\`\`\n`
  }
  return out
}