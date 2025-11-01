export function bufferToBase64(
  buffer: Buffer | null | undefined,
  mimeType: string = 'image/png',
): string | null {
  if (!buffer) {
    return null;
  }
  const base64 = buffer.toString('base64');
  return `data:${mimeType};base64,${base64}`;
}

export function buffersToBase64(
  buffers: Buffer[] | null | undefined,
  mimeType: string = 'image/png',
): string[] {
  if (!buffers || buffers.length === 0) {
    return [];
  }
  return buffers
    .map((buffer) => bufferToBase64(buffer, mimeType))
    .filter((base64): base64 is string => base64 !== null);
}

export function base64ToBuffer(
  base64String: string | null | undefined,
): Buffer | null {
  if (!base64String) {
    return null;
  }

  const base64Data = base64String.includes(',')
    ? base64String.split(',')[1]
    : base64String;

  try {
    return Buffer.from(base64Data, 'base64');
  } catch (error) {
    console.error('Failed to convert base64 to buffer:', error);
    return null;
  }
}
