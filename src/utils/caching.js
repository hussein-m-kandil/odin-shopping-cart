/**
 * Caches the given data mapped to the given key.
 *
 * @param {string} key - A key to cache the data with it
 * @param {any} data - Any JS value
 * @returns {void}
 */
export function cacheData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ data, date: new Date() }));
  } catch (error) {
    console.log(error);
  }
}

/**
 * Returns the cached data or `null`, in case the given key is unknown,
 * or the cached data is stale (the given lifetime already passed since caching it).
 *
 * @param {string} key - A key used previously to cache data
 * @param {*} cachingLifetimeMS - A time (in millisecond) to determine whether the cached data still valid, the default is 5000 (5 seconds)
 * @returns
 */
export function getCachedData(key, cachingLifetimeMS = 5000) {
  try {
    const serializedProducts = localStorage.getItem(key);
    if (serializedProducts) {
      const reviver = (k, v) => (k === 'date' ? new Date(v) : v);
      const { data, date } = JSON.parse(serializedProducts, reviver);
      if (new Date() - date < cachingLifetimeMS) return data;
    }
  } catch (error) {
    console.log(error);
  }
  return null;
}
