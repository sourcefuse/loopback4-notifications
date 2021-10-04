export async function loadDynamic(packageName: string) {
  try {
    const dynamicPackage = await import(packageName);
    return dynamicPackage;
  } catch (e) {
    return null;
  }
}
