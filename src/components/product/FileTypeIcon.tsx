import { FileText } from 'lucide-react'

/** Document icon with the file format (PDF, MP4 …) under it. */
export function FileTypeIcon({ format }: { format: string }) {
  return (
    <span className="flex size-12 shrink-0 flex-col items-center justify-center gap-0.5 rounded-md bg-primary-tint text-primary">
      <FileText className="size-5" strokeWidth={1.75} />
      <span className="text-[9px] leading-none font-bold tracking-wide">{format}</span>
    </span>
  )
}
