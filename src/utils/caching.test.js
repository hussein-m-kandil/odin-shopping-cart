import { afterEach, describe, expect, it, vi } from 'vitest';
import { cacheData, getCachedData } from './caching';

afterEach(() => window.localStorage.clear());

describe('Caching', () => {
  it('should return the cached data if the given lifetime did not pass', () => {
    const key = 'k';
    const data = { x: 'y' };
    const lifetime = 1000;
    const delta = lifetime * 0.75;
    const currentTime = new Date();
    const futureTime = new Date(currentTime.getTime() + delta);
    cacheData(key, data);
    vi.useFakeTimers();
    vi.setSystemTime(futureTime);
    expect(new Date() - currentTime).toBeLessThan(lifetime);
    expect(getCachedData(key, lifetime)).toEqual(data);
    vi.useRealTimers();
  });

  it('should return the cached data after some time but the lifetime still did not pass', () => {
    const data = { x: 'y' };
    const key = 'k';
    cacheData(key, data);
    expect(getCachedData(key, 100)).toEqual(data);
  });

  it('should return `null` if the given key is unknown', () => {
    cacheData('k', { x: 'y' });
    expect(getCachedData(true, 100)).toBeNull();
  });

  it('should return `null` if the given lifetime is passed since caching date', () => {
    const lifetime = 1000;
    const delta = lifetime + 5;
    const currentTime = new Date();
    const futureTime = new Date(currentTime.getTime() + delta);
    cacheData('k', { x: 'y' });
    vi.useFakeTimers();
    vi.setSystemTime(futureTime);
    expect(new Date() - currentTime).toBeGreaterThanOrEqual(lifetime);
    expect(getCachedData(true, lifetime)).toBeNull();
    vi.useRealTimers();
  });
});
