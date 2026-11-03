/* Real file downloads made in the browser. */

/** Starts a download of `blob` as `fileName`. */
export function downloadBlob(fileName: string, blob: Blob) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.append(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/** Starts a download of a text file. */
export const downloadText = (fileName: string, text: string, type = 'text/csv;charset=utf-8') =>
  downloadBlob(fileName, new Blob([text], { type }))
