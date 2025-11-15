export function toValidDate(value: any): Date | null {
  if (!value) return null;

  // Remove surrounding quotes if present (handles JSON.stringify artifacts in FormData)
  let cleanValue = value;
  if (typeof value === 'string') {
    cleanValue = value.replace(/^"(.*)"$/, '$1');
  }

  const date = new Date(cleanValue);
  return date instanceof Date && !isNaN(date.getTime()) ? date : null;
}
