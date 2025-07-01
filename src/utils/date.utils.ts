export function toValidDate(value: any): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return date instanceof Date && !isNaN(date.getTime()) ? date : null;
}
