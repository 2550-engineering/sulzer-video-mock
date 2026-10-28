import { useCallback } from 'react'
import { productPage } from '../data/catalogPages'
import { useToast } from '../toast/useToast'
import type { Document } from '../types'

const copy = productPage.documentation

/**
 * Downloads a document: its real file when it has an `href`, otherwise just a
 * "Download started" toast, so the demo never makes a network call.
 */
export function useDocumentDownload() {
  const showToast = useToast()
  return useCallback(
    (doc: Document) => {
      if (doc.href) {
        const link = document.createElement('a')
        link.href = doc.href
        link.download = ''
        link.click()
        return
      }
      showToast({ message: copy.downloadStarted(doc.title), detail: `${doc.format} · ${doc.size}` })
    },
    [showToast],
  )
}
