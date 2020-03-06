const cp = require('child_process')
const util = require('util')
const open = require('open')
const spawn = util.promisify(cp.spawn)
const exec = util.promisify(cp.exec)

const DISPLAY_ID = '42CB4156-C554-5E88-0C83-518D9ACEE321'
const RECORD_RES = '1920x1080'

async function main() {
  let commands
  let message
  const { stdout, stderr } = await exec('displayplacer list')
  const match = new RegExp(
    `Persistent screen id: ${DISPLAY_ID}[\\s\\S]*?Resolution: (?<res>[\\dx]+)$`,
    'gm'
  ).exec(stdout)
  if (!match) {
    console.error({ stdout, stderr })
    throw new Error(
      'There was a problem parsing the output of "displayplacer list"'
    )
  }

  const { res: currentResolution } = match.groups
  if (currentResolution === RECORD_RES) {
    commands = [
      `displayplacer "id:D7D5FA3E-EDB3-4603-3F1F-A309049FCFA5 res:3840x1600 hz:60 color_depth:8 scaling:off origin:(0,0) degree:0" "id:${DISPLAY_ID} res:1680x1050 color_depth:8 scaling:on origin:(3840,550) degree:0"`,
      `osascript -e 'quit app "ScreenFlow"'`
    ]
    message = 'Hope recording went well!'
  } else {
    commands = [
      `displayplacer "id:D7D5FA3E-EDB3-4603-3F1F-A309049FCFA5 res:3840x1600 hz:60 color_depth:8 scaling:off origin:(0,0) degree:0" "id:${DISPLAY_ID} res:${RECORD_RES} color_depth:8 scaling:off origin:(3840,520) degree:0"`,
      `open /Applications/ScreenFlow.app`
    ]
    await open('https://egghead.io/production')
    await open('https://github.com/twclark0/')
    message = `Getting ready to start recording!`
  }

  console.log(message)
  await Promise.all(
    commands.map(cmd => spawn(cmd, { stdio: 'inherit', shell: true }))
  )
}

main()
