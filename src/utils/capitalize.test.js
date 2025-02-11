import { describe, expect, it } from 'vitest';
import capitalize from './capitalize';

describe('Capitalize', () => {
  it('throws if not given a string', () => {
    expect(() => capitalize()).toThrowError();
    expect(() => capitalize(7)).toThrowError();
    expect(() => capitalize(true)).toThrowError();
  });

  it('returns empty string if the given string is empty', () => {
    expect(capitalize('')).toBe('');
  });

  it('returns same string with the 1st letter of every word in uppercase, and the reset letters in lowercase', () => {
    expect(capitalize('foo 12 bar tar!')).toBe('Foo 12 Bar Tar!');
    expect(capitalize('Foo 12 Bar Tar!')).toBe('Foo 12 Bar Tar!');
    expect(capitalize('FOO 12 BAR TAR!')).toBe('Foo 12 Bar Tar!');
    expect(capitalize('FoO 12 bAr taR!')).toBe('Foo 12 Bar Tar!');
  });
});
