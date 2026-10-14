/**
 * Node's test runner does not resolve extensionless TypeScript imports.
 * Next and tsc do. This hook is only loaded by `npm test`.
 */
export async function resolve(specifier, context, nextResolve) {
  const needsExtension =
    (specifier.startsWith("./") || specifier.startsWith("../")) &&
    !/\.(?:[cm]?[jt]s|json|css|node)$/.test(specifier);
  if (!needsExtension) return nextResolve(specifier, context);
  try {
    return await nextResolve(`${specifier}.ts`, context);
  } catch {
    return nextResolve(specifier, context);
  }
}
