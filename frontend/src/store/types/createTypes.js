const GLOBAL_CACHE = new Set();

export const createTypes = (...types) => {
  if (types.length === 0) {
    throw new Error("Must specify at least one type");
  }

  const TYPES = {}; // eslint-disable-line no-unused-vars

  // Copy each type into the returned object and add into the global cache. If
  // we come across a duplicate, throw an error, but not in production.
  types.forEach((type) => {
    if (GLOBAL_CACHE.has(type)) {
      throw new Error(`${type} has already been defined as an action type`);
    }

    if (typeof type !== "string") {
      throw new Error(`${type} is of an invalid type, expected string`);
    }

    TYPES[type] = type;
    GLOBAL_CACHE.add(type);
  });

  return TYPES;
};

// Allows the outside user to clear the global cache state.
export const clearGlobalCache = () => GLOBAL_CACHE.clear();
