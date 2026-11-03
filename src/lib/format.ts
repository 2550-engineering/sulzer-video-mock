/** "555 706": thousands grouped with spaces, like the key specs. */
export const groupThousands = (value: number, decimals = 0) =>
  value
    .toLocaleString('en-GB', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    .replaceAll(',', ' ')

/** A file size as shown in file lists: "640 KB" or "2.4 MB". */
export const formatFileSize = (bytes: number) =>
  bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`
