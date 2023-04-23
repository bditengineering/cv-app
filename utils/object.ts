export function omit(
  obj: Record<string, unknown>,
  keys: string | string[],
): Record<string, unknown> {
  if (!obj || typeof obj !== "object") {
    throw new TypeError("Expected first argument to be an object");
  }

  const keysToOmit = typeof keys === "string" ? [keys] : keys;

  if (!Array.isArray(keysToOmit)) {
    throw new TypeError("Expected second argument to be an array or string");
  }

  if (keysToOmit.some((key) => typeof key !== "string")) {
    throw new TypeError("Expected keys to be an array of strings");
  }

  const result: Record<string, unknown> = {};

  for (const key of Object.keys(obj)) {
    if (!keysToOmit.includes(key)) {
      result[key] = obj[key];
    }
  }

  return result;
}
