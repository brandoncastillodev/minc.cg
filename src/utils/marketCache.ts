let cachedProducts = null;

export function getCachedProducts() {
  return cachedProducts;
}

export function setCachedProducts(products) {
  cachedProducts = products;
}

export function clearCachedProducts() {
  cachedProducts = null;
}
