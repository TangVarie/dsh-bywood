// Extract the inline-SVG literals the client template embeds, straight from the
// BYWOOD logo originals. Prints a JSON object so build.mjs can consume it.
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const DIR = process.argv[2]
if (DIR === undefined) throw new Error('usage: extract-svg.mjs <logo asset dir>')

function read(name) {
  return readFileSync(join(DIR, name), 'utf8')
}

function attr(openTag, name) {
  const match = new RegExp(`${name}="([^"]*)"`).exec(openTag)
  return match === null ? undefined : match[1]
}

/** Inner XML + root viewBox for one logo file. */
function svg(file) {
  const text = read(file)
  const open = /<svg[^>]*>/.exec(text)
  if (open === null) throw new Error(`${file}: no <svg>`)
  const inner = /<svg[^>]*>([\s\S]*)<\/svg>/.exec(text)
  if (inner === null) throw new Error(`${file}: unbalanced`)
  return {
    viewBox: attr(open[0], 'viewBox'),
    body: inner[1].replace(/<!--[\s\S]*?-->/g, '').replace(/\s+/g, ' ').trim(),
  }
}

/** The four-band mark: the rect is dropped (the caller owns the field colour). */
const iconBody = svg('icon.svg').body.replace(/<rect[^>]*\/>/, '').trim()
const bands = svg('icon-small.svg').body.replace(/<rect[^>]*\/>/, '').trim()
const markCurrent = svg('mark-current.svg').body

/** The wordmark path of the horizontal lockup, split into its coloured runs. */
const horizontal = svg('horizontal-teal-on-light.svg').body
const paths = [...horizontal.matchAll(/<path fill="([^"]*)" d="([^"]*)"\/>/g)].map(m => ({
  fill: m[1],
  d: m[2],
}))
if (paths.length !== 3) throw new Error(`horizontal: expected 3 paths, got ${paths.length}`)
const [markPath, wordmarkPath, wPath] = paths

const out = {
  iconViewBox: svg('icon.svg').viewBox,
  iconMarkBody: iconBody,
  bandsViewBox: svg('icon-small.svg').viewBox,
  bandsBody: bands,
  markViewBox: svg('mark-current.svg').viewBox,
  markBody: markCurrent,
  horizontalViewBox: svg('horizontal-teal-on-light.svg').viewBox,
  markPath: markPath.d,
  wordmarkPath: wordmarkPath.d,
  wPath: wPath.d,
}
process.stdout.write(JSON.stringify(out, null, 2))
