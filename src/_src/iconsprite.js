const fs = require('fs')
const path = require('path')
const util = require('util')
const glob = require('glob')
const File = require('vinyl')
const SVGSpriter = require('svg-sprite')

const getFiles = util.promisify(glob)

const siteData = require(path.resolve(__dirname, '../_data/metadata.js'))
const cwd = path.resolve(__dirname, './icons')

const spriteConfig = {
    mode: {
        inline: true,
        symbol: {
            sprite: 'sprite.svg',
            example: false
        }
    },
    shape: {
        transform: [ 'svgo' ],
        id: {
            generator: 'icon-%s'
        }
    },
    svg: {
        xmlDeclaration: false,
        doctypeDeclaration: false
    }
}

module.exports = async () => {
    if (!siteData.embeddedIcons || (Array.isArray(siteData.embeddedIcons) && !siteData.embeddedIcons.length)) {
        return ''
    }

    const spriter = new SVGSpriter(spriteConfig)
    const compileSprite = async (args) => {
        return new Promise((resolve, reject) => {
            spriter.compile(args, (error, result) => {
                if (error) {
                    return reject(error)
                }
                resolve(result.symbol.sprite)
            })
        })
    }

    (await getFiles('**/*.svg', { cwd }))
        .filter(file => siteData.embeddedIcons === true || siteData.embeddedIcons.includes(file))
        .forEach(file => {
            spriter.add(
                new File({
                    path: path.join(cwd, file),
                    base: cwd,
                    contents: fs.readFileSync(path.join(cwd, file))
                })
            )
        })

    const sprite = await compileSprite(spriteConfig.mode)
    return '<div hidden>\n\t' + sprite.contents.toString('utf8') + '\n</div>'
}
