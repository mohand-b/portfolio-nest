export function toValidDate(
  value: string | number | Date | null | undefined,
): Date | null {
  if (!value) return null;

  let cleanValue: string | number | Date = value;
  if (typeof value === 'string') {
    cleanValue = value.replace(/^"(.*)"$/, '$1');
  }

  const date = new Date(cleanValue);
  return date instanceof Date && !isNaN(date.getTime()) ? date : null;
}
