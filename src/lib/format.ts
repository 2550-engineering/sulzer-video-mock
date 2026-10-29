/** "555 706": thousands grouped with spaces, like the key specs. */
export const groupThousands = (value: number, decimals = 0) =>
  value
    .toLocaleString('en-GB', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    .replaceAll(',', ' ')
