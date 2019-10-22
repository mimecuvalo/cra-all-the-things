import { defaultDataIdFromObject } from 'apollo-cache-inmemory';

// You can add custom caching controls based on your data model.
export function dataIdFromObject(obj) {
  switch (obj.__typename) {
    default:
      return defaultDataIdFromObject(obj); // fall back to default handling
  }
}
