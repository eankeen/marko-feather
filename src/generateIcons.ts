// @ts-ignore
import del from 'del'
import fs, { Dirent } from 'fs'
import { camelCase, startCase } from 'lodash'
import path from 'path'

process.on('unhandledRejection', (err) => {
  console.error(err)
})
const featherDir: string = path.dirname(require.resolve('feather-icons'))
const iconDir = path.join(featherDir, 'icons')
const distDir: string = path.join(__dirname, '../dist')
const iconOutDir: string = path.join(__dirname, '../dist/icons')

async function getIconList(): Promise<string[]> {
  let iconList: Dirent[] = await fs.promises.readdir(iconDir, {
    withFileTypes: true,
  })
  let iconListString: string[] = iconList
    .filter((icon: Dirent): boolean => {
      return icon.isFile() && icon.name.includes('.svg')
    })
    .map((icon: Dirent): string => {
      return icon.name
    })

  return iconListString
}

;(async (): Promise<void> => {
  await fs.promises.writeFile(
    path.join(distDir, 'index.js'),
    `module.exports = {
${await (async (): Promise<string> => {
  let string = ''
  ;(await getIconList()).forEach((iconName: string) => {
    string += `  ${startCase(camelCase(iconName))
      .replace(/ /g, '')
      .replace('Svg', '')}: require('./${iconName.replace(
      '.svg',
      '.marko'
    )}'),\n`
  })
  console.log(string)
  return string
})()}}`
  )
})()
;(async (): Promise<void> => {
  let itemContents: PromiseSettledResult<string>[] | undefined
  let readPromises: Promise<string>[] = []
  for (const icon of await getIconList()) {
    // read all feather icons
    const fullIconPath: string = path.join(iconDir, icon)
    readPromises.push(
      fs.promises.readFile(fullIconPath, {
        encoding: 'utf8',
      })
    )
    itemContents = await Promise.allSettled(readPromises)
  }
  // transform and write feather icons
  const writePromises: Promise<void>[] = []
  for (const iconPromiseResult of itemContents) {
    if (iconPromiseResult.status !== 'fulfilled') {
      console.error(
        `error: promise not satisfied: ${iconPromiseResult.toString()}`
      )
      process.exitCode = 1
    }

    // @ts-ignore
    const newFeatherIcon: string = iconPromiseResult?.value
      .replace(/"24"/gi, 'input.size')
      .replace(/stroke="currentColor"/i, `stroke=input.color`)
      .replace(/stroke-width="2"/i, `stroke-width=input.strokeWidth`)
    if (newFeatherIcon) {
      await del(['../dist/*', '!../dist/'])
      let nameStringAtStart: string = newFeatherIcon.slice(
        newFeatherIcon.indexOf(`class="feather`) + 15
      )
      let nameString = nameStringAtStart
        .slice(0, nameStringAtStart.indexOf(`"`))
        .slice(8)

      const iconOut = path.join(path.dirname(iconOutDir), nameString + '.marko')
      // const iconOut = iconOutDir
      writePromises.push(fs.promises.writeFile(iconOut, newFeatherIcon))
    } else {
      console.error('something failed')
      process.exitCode = 1
    }
  }

  try {
    await Promise.all(writePromises)
  } catch (err) {
    console.error(`issue writing new contents: ${err.toString()}`)
  }
})()
