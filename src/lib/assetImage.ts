/*
 * Images live in _asset-source/images. Drop a file there with the name a
 * data file asks for (e.g. "home-hero.jpg") and it is picked up on the next
 * build; until then <ImageSlot> shows a gradient placeholder.
 */
const files = import.meta.glob<string>('../../_asset-source/images/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  import: 'default',
})

const byName = new Map(
  Object.entries(files).map(([path, url]) => [path.slice(path.lastIndexOf('/') + 1), url]),
)

/** URL of an image in _asset-source/images, or undefined if it hasn't been supplied. */
export function assetImage(file: string) {
  return byName.get(file)
}
